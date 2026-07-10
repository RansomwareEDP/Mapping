#!/usr/bin/env python3
"""
fetch_ti_feeds.py
-----------------
Pulls RSS feeds from major threat intelligence sources, filters each feed
for articles relevant to tracked ransomware groups, and writes results to
groups/data/ti-feed.json plus per-group ti-feed-<group>.json files.

Run by GitHub Actions on schedule. Also safe to run locally.

Output format (groups/data/ti-feed.json):
  Array of objects:
    { "group": "lynx", "title": "...", "url": "...", "source": "...", "date": "ISO8601" }
"""

import json
from datetime import datetime, timezone
from pathlib import Path

try:
    import feedparser
except ImportError:
    print("feedparser not installed. Run: pip install feedparser")
    raise

# Some sites reject the default feedparser user agent; present a browser UA.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)

# -------------------------------------------------------
# RSS FEEDS TO MONITOR (all free / no API key)
# Add or remove feeds here as needed. A feed that fails or
# returns nothing is skipped with a warning; it never
# breaks the run.
# -------------------------------------------------------
FEEDS = [
    # Vendor research blogs
    "https://unit42.paloaltonetworks.com/feed/",
    "https://blog.talosintelligence.com/rss/",
    "https://feeds.trendmicro.com/TrendMicroResearch",
    "https://research.checkpoint.com/feed/",
    "https://news.sophos.com/en-us/feed/",
    "https://www.welivesecurity.com/en/rss/feed/",
    "https://securelist.com/feed/",
    "https://www.microsoft.com/en-us/security/blog/feed/",
    "https://www.sentinelone.com/blog/feed/",
    "https://www.crowdstrike.com/blog/feed/",
    "https://www.rapid7.com/blog/rss/",
    "https://www.group-ib.com/blog/feed/",
    "https://socradar.io/feed/",
    "https://www.darktrace.com/blog/rss",
    "https://thedfirreport.com/feed/",
    "https://decoded.avast.io/feed/",
    "https://www.malwarebytes.com/blog/feed/index.xml",
    # News outlets
    "https://www.bleepingcomputer.com/feed/",
    "https://therecord.media/feed",
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.securityweek.com/feed/",
    "https://www.darkreading.com/rss.xml",
    "https://www.infosecurity-magazine.com/rss/news/",
    "https://www.helpnetsecurity.com/feed/",
    "https://cybernews.com/feed/",
    "https://krebsonsecurity.com/feed/",
    # Ransomware / breach-focused independents
    "https://databreaches.net/feed/",
    "https://suspectfile.com/feed/",
    "https://redpacketsecurity.com/feed/",
]

# -------------------------------------------------------
# KEYWORD MAPPING PER GROUP
# All strings are matched case-insensitively against the
# article title + summary + content combined.
# -------------------------------------------------------
KEYWORDS = {
    "lynx": [
        "lynx ransomware",
        "inc ransomware",
        "storm-2113",
        "water lalawag",
        "lynx raas",
    ],
    "qilin": [
        "qilin ransomware",
        "agenda ransomware",
        "howling scorpius",
        "qilin",
    ],
    "akira": [
        "akira ransomware",
        "punk spider",
        "gold sahara",
        "storm-1567",
        "akira raas",
    ],
    "lockbit": [
        "lockbit",
        "lock bit",
        "operation cronos",
        "lockbitsupp",
    ],
    "dragonforce": [
        "dragonforce ransomware",
        "dragonforce",
    ],
    "conti": [
        "conti ransomware",
        "conti group",
        "wizard spider",
        "unc1878",
    ],
    "clop": [
        "cl0p",
        "clop ransomware",
        "fin11",
        "ta505",
        "unc5936",
        "moveit ransomware",
        "cleo ransomware",
        "goanywhere ransomware",
        "oracle ebs ransomware",
    ],
    "royal": [
        "royal ransomware",
        "blacksuit ransomware",
        "chaos ransomware",
        "operation checkmate",
        "blacksuit",
    ],
    "silentransom": [
        "silent ransom group",
        "luna moth",
        "srg ransomware",
        "leakeddata",
        "callback phishing ransomware",
    ],
    "thegentlemen": [
        "the gentlemen ransomware",
        "thegentlemen ransomware",
        "storm-2697",
        "gentlemen raas",
        "readme-gentlemen",
        "ransom:win64/gentlemen",
    ],
    "blackbasta": [
        "black basta",
        "blackbasta",
        "storm-1811",
        "cardinal cybercrime",
    ],
    "nightspire": [
        "nightspire",
        "night spire",
    ],
    "payload": [
        "payload ransomware",
        "recover_payload",
        "payload ransom gang",
        "payload ransom group",
    ],
    "worldleaks": [
        "world leaks",
        "worldleaks",
        "hunters international",
    ],
    "8base": [
        "8base",
        "8 base ransomware",
        "phobos ransomware",
        "phobos aetor",
    ],
}

MAX_PER_GROUP = 10          # max articles to keep per group
MAX_ENTRIES_PER_FEED = 50   # how many entries to scan per feed fetch


def parse_date(entry):
    """Return a UTC ISO8601 string from a feedparser entry, or empty string."""
    for attr in ("published_parsed", "updated_parsed", "created_parsed"):
        val = getattr(entry, attr, None)
        if val:
            try:
                dt = datetime(*val[:6], tzinfo=timezone.utc)
                return dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            except Exception:
                pass
    return ""


def entry_text(entry):
    """Combine title, summary, and content into one lowercase string.

    NOTE: this replaces an earlier version whose conditional expression
    silently discarded title and summary whenever an entry had no
    content attribute, which made every keyword match fail.
    """
    parts = [
        getattr(entry, "title", "") or "",
        getattr(entry, "summary", "") or "",
    ]
    content = getattr(entry, "content", None)
    if content:
        try:
            parts.append(content[0].get("value", "") or "")
        except (IndexError, AttributeError, TypeError):
            pass
    return " ".join(parts).lower()


def match_group(entry, keywords):
    """Return True if the entry text contains any of the keywords."""
    text = entry_text(entry)
    return any(kw in text for kw in keywords)


def fetch_feeds():
    """Fetch and parse all configured RSS feeds. Returns list of raw entries."""
    all_entries = []
    for url in FEEDS:
        try:
            feed = feedparser.parse(url, agent=USER_AGENT)
            feed_title = getattr(feed.feed, "title", url)
            count = 0
            for entry in feed.entries[:MAX_ENTRIES_PER_FEED]:
                all_entries.append((feed_title, entry))
                count += 1
            status = getattr(feed, "status", "n/a")
            print(f"  [{count:>3} entries, http {status}] {url}")
            if count == 0:
                print(f"    WARNING: no entries from {url}")
        except Exception as e:
            print(f"  WARNING: could not fetch {url}: {e}")
    return all_entries


def main():
    output_path = Path("groups/data/ti-feed.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print("Fetching TI blog RSS feeds...")
    raw_entries = fetch_feeds()
    print(f"  Fetched {len(raw_entries)} total entries across {len(FEEDS)} feeds")

    results = []

    for group, keywords in KEYWORDS.items():
        matches = []
        seen_urls = set()
        for feed_title, entry in raw_entries:
            if not match_group(entry, keywords):
                continue
            url = getattr(entry, "link", "#")
            if url in seen_urls:
                continue
            seen_urls.add(url)
            matches.append({
                "group":  group,
                "title":  getattr(entry, "title", "Untitled"),
                "url":    url,
                "source": feed_title,
                "date":   parse_date(entry),
            })

        # Sort newest first, cap at max
        matches.sort(key=lambda x: x["date"], reverse=True)
        matches = matches[:MAX_PER_GROUP]
        results.extend(matches)
        print(f"  {group}: {len(matches)} articles matched")

    # Write combined file; the HTML filters by group client-side
    output_path.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"Wrote {len(results)} total entries to {output_path}")

    # Also write per-group files so each HTML page fetches only its own feed
    for group in KEYWORDS:
        group_items = [r for r in results if r["group"] == group]
        Path(f"groups/data/ti-feed-{group}.json").write_text(
            json.dumps(group_items, indent=2, ensure_ascii=False)
        )


if __name__ == "__main__":
    main()
