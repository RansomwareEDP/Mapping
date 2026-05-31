#!/usr/bin/env python3
"""
fetch_ti_feeds.py
-----------------
Pulls RSS feeds from major threat intelligence sources, filters each feed
for articles relevant to tracked ransomware groups, and writes results to
groups/data/ti-feed.json.

Run by GitHub Actions on schedule. Also safe to run locally.

Output format (groups/data/ti-feed.json):
  Array of objects:
    { "group": "lynx", "title": "...", "url": "...", "source": "...", "date": "ISO8601" }
"""

import json
import re
from datetime import datetime, timezone
from pathlib import Path

try:
    import feedparser
except ImportError:
    print("feedparser not installed. Run: pip install feedparser")
    raise

# -------------------------------------------------------
# RSS FEEDS TO MONITOR
# Add or remove feeds here as needed.
# -------------------------------------------------------
FEEDS = [
    "https://unit42.paloaltonetworks.com/feed/",
    "https://www.bleepingcomputer.com/feed/",
    "https://socradar.io/feed/",
    "https://www.darktrace.com/blog/rss",
    "https://thedfirreport.com/feed/",
    "https://www.rapid7.com/blog/rss/",
    "https://www.group-ib.com/blog/feed/",
    "https://www.sentinelone.com/blog/feed/",
    "https://www.crowdstrike.com/blog/feed/",
    "https://decoded.avast.io/feed/",
]

# -------------------------------------------------------
# KEYWORD MAPPING PER GROUP
# All strings are matched case-insensitively against the
# article title + summary combined.
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
}

MAX_PER_GROUP = 10      # max articles to keep per group
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


def fetch_feeds():
    """Fetch and parse all configured RSS feeds. Returns list of raw entries."""
    all_entries = []
    for url in FEEDS:
        try:
            feed = feedparser.parse(url)
            feed_title = getattr(feed.feed, "title", url)
            for entry in feed.entries[:MAX_ENTRIES_PER_FEED]:
                all_entries.append((feed_title, entry))
        except Exception as e:
            print(f"Warning: could not fetch {url}: {e}")
    return all_entries


def match_group(entry, keywords):
    """Return True if the entry text contains any of the keywords."""
    text = (
        getattr(entry, "title", "") + " " +
        getattr(entry, "summary", "") + " " +
        getattr(entry, "content", [{}])[0].get("value", "") if hasattr(entry, "content") and entry.content else ""
    ).lower()
    return any(kw in text for kw in keywords)


def main():
    output_path = Path("groups/data/ti-feed.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print("Fetching TI blog RSS feeds...")
    raw_entries = fetch_feeds()
    print(f"  Fetched {len(raw_entries)} total entries across {len(FEEDS)} feeds")

    results = []

    for group, keywords in KEYWORDS.items():
        matches = []
        for feed_title, entry in raw_entries:
            if match_group(entry, keywords):
                matches.append({
                    "group":  group,
                    "title":  getattr(entry, "title", "Untitled"),
                    "url":    getattr(entry, "link",  "#"),
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
