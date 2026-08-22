#!/usr/bin/env python3
"""
MEASUREMENT COLLECTOR - victim stream
=====================================
Builds the measurement series that the KPI framework needs, from the
ransomware.live public API.

WHAT MAKES THIS DIFFERENT FROM refresh-data.yml
-----------------------------------------------
refresh-data.yml exists to fill 13 group pages on the website. It fetches the
whole ecosystem and then throws away every victim that is not one of those 13
groups, along with the sector and country labels on all of them.

This script keeps everything, and writes the counts the framework measures:
totals by month, by group, by country, and by sector.

It does NOT touch groups/data/. The website feed is left exactly as it is.

SELF-HEALING
------------
Every run re-fetches the current month AND the previous month. That looks
wasteful and is the most important line in the file. It means a run that is
missed for six weeks is repaired automatically by the next run, with no help
from anyone, and it also picks up victims that groups post weeks late.

This is the same design that repaired the desktop collector on 21 Aug 2026
after it silently lost 74 days of data.

USAGE
-----
    python3 scripts/collect_measurement.py            # current + previous month
    python3 scripts/collect_measurement.py --full     # rebuild all history

OUTPUT
------
    data/measurement/victims-monthly.json   the series
    data/measurement/HEALTH-victims.txt             plain-language status report
    data/measurement/HEALTH-victims.json            same, machine readable

If HEALTH.txt says anything other than OK, paste it into a Claude session.
"""

import json
import pathlib
import subprocess
import sys
import time
import urllib.request
from collections import Counter
from datetime import datetime, timezone

API = "https://api.ransomware.live/v2/victims"
# Extended from 2024-01 to 2022-01 on 22 Aug 2026. The KPI framework baselines
# at Q1 2024 by choice and that is unaffected; the collector simply holds more
# than the framework needs. The gain is that operations before 2024 become
# checkable: Hive, ALPHV/BlackCat and LockBit all sit in the older window and
# were previously reported as unverifiable.
HISTORY_START = (2022, 1)          # earliest month the series covers
OUT = pathlib.Path("data/measurement")
UA = "RENO-Observatory-Measurement"

# A month with fewer than this many victims is almost certainly incomplete
# rather than quiet. Real months run 700-950. The desktop collector's failure
# produced ~100 a month and looked normal, which is what this guards against.
LOW_MONTH_FLOOR = 300


def fetch(year, month):
    """
    Fetch one whole month. No record cap, unlike the /recentvictims feed.

    Returns (records, error). error is None on success, "ratelimit" when the
    source is asking us to slow down, or "failed" for anything else. Those two
    are kept apart deliberately: being told to slow down is normal and fixes
    itself, a source going away is not.
    """
    url = f"{API}/{year}/{month}"
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read()), None
    except urllib.error.HTTPError as e:
        if e.code == 429:
            return None, "ratelimit"
        return None, "failed"
    except Exception:
        # Some Python installs on macOS cannot verify certificates. curl can.
        # GitHub Actions never hits this path; Reno's Mac does.
        out = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-w", "\n%{http_code}",
             "-H", f"User-Agent: {UA}", url],
            capture_output=True, text=True,
        )
        body, _, code = out.stdout.rpartition("\n")
        if code.strip() == "429":
            return None, "ratelimit"
        if out.returncode != 0 or not body.strip():
            return None, "failed"
        try:
            return json.loads(body), None
        except json.JSONDecodeError:
            return None, "failed"


def fetch_with_retry(year, month, pause=None):
    """
    Wait out rate limiting rather than giving up on it. Being told to slow
    down is normal; three growing waits clears it in almost every case.
    """
    records, err = fetch(year, month)
    for wait in (30, 60, 120):
        if err != "ratelimit":
            break
        print(f"        rate limited, waiting {wait}s")
        time.sleep(wait)
        records, err = fetch(year, month)
    return records, err


def months_back_to(start, now):
    """Every (year, month) from start up to and including now."""
    y, m = start
    out = []
    while (y, m) <= (now.year, now.month):
        out.append((y, m))
        m += 1
        if m == 13:
            y, m = y + 1, 1
    return out


def clean(value):
    """Normalise the empty-ish values this source uses interchangeably."""
    v = (value or "").strip()
    return "" if v.lower() in ("", "n/a", "not found", "unknown", "null") else v


def summarise(records):
    """Turn a month of raw victim records into the counts the framework reads."""
    groups, countries, sectors = Counter(), Counter(), Counter()
    sector_known = 0
    for v in records:
        g = clean(v.get("group"))
        if g:
            groups[g.lower()] += 1
        c = clean(v.get("country"))
        if c:
            countries[c.upper()] += 1
        s = clean(v.get("activity"))
        if s:
            sectors[s] += 1
            sector_known += 1
    return {
        "total": len(records),
        "distinct_groups": len(groups),
        "sector_labelled": sector_known,
        "by_group": dict(groups.most_common()),
        "by_country": dict(countries.most_common()),
        "by_sector": dict(sectors.most_common()),
    }


def main():
    full = "--full" in sys.argv
    now = datetime.now(timezone.utc)

    OUT.mkdir(parents=True, exist_ok=True)
    series_path = OUT / "victims-monthly.json"

    # Load whatever we already have, so a normal run only replaces two months.
    previous_newest = ""
    if series_path.exists():
        prior = json.loads(series_path.read_text())
        series = prior.get("months", {})
        previous_newest = prior.get("meta", {}).get("newest_record") or ""
    else:
        series = {}
        full = True   # nothing on disk means a first run is a full build

    if full:
        targets = months_back_to(HISTORY_START, now)
        print(f"FULL REBUILD: {len(targets)} months from {HISTORY_START[0]}-{HISTORY_START[1]:02d}")
    else:
        prev_y, prev_m = (now.year, now.month - 1) if now.month > 1 else (now.year - 1, 12)
        targets = [(prev_y, prev_m), (now.year, now.month)]
        print("INCREMENTAL: current month plus previous month (self-healing)")

    newest_seen = ""
    failures = []
    ratelimited = []

    # Be a polite client. A full rebuild is 32 requests; without a pause the
    # source rate limits us, which is exactly what happened on 21 Aug 2026.
    pause = 3 if full else 1

    for i, (y, m) in enumerate(targets):
        key = f"{y}-{m:02d}"
        if i:
            time.sleep(pause)
        records, err = fetch_with_retry(y, m, pause=30)
        if records is None or not isinstance(records, list):
            (ratelimited if err == "ratelimit" else failures).append(key)
            print(f"  {key}  {'RATE LIMITED' if err == 'ratelimit' else 'FETCH FAILED'}")
            continue
        series[key] = summarise(records)
        for v in records:
            d = clean(v.get("discovered")) or clean(v.get("attackdate"))
            if d > newest_seen:
                newest_seen = d
        print(f"  {key}  {len(records):>5} victims  "
              f"{series[key]['distinct_groups']:>3} groups  "
              f"{series[key]['sector_labelled']:>5} sector-labelled")

    # A failed run must not erase what we already knew. Keep the later of the
    # two, so a transient outage never makes the report look worse than reality.
    if previous_newest > newest_seen:
        newest_seen = previous_newest

    ordered = {k: series[k] for k in sorted(series)}
    series_path.write_text(json.dumps({
        "meta": {
            "source": "ransomware.live public API",
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "months": len(ordered),
            "total_victims": sum(v["total"] for v in ordered.values()),
            "newest_record": newest_seen,
            "note": "Counts only. Individual victim records are not published here.",
        },
        "months": ordered,
    }, indent=1))

    write_health(ordered, newest_seen, failures, ratelimited, now)
    print(f"\nWrote {series_path} and {OUT/'HEALTH-victims.txt'}")
    return 1 if failures else 0


def write_health(series, newest_seen, failures, ratelimited, now):
    """Plain-language status file. Written every run, whether good or bad."""
    keys = sorted(series)
    recent = keys[-6:]
    problems = []
    notes = []

    if failures:
        problems.append(f"Could not download these months: {', '.join(failures)}. "
                        "The data source may be down or may have changed.")
    if ratelimited:
        notes.append(f"The data source asked us to slow down on: {', '.join(ratelimited)}. "
                     "This is normal and fixes itself on the next run. No action needed.")

    age_line = "unknown"
    if newest_seen:
        try:
            newest_dt = datetime.fromisoformat(newest_seen.replace("Z", "+00:00"))
            age = (now - newest_dt).days
            age_line = f"{newest_seen[:10]}  ({age} days old)"
            if age > 3:
                problems.append(f"The newest victim record is {age} days old. "
                                "It should normally be 0 to 2 days old. "
                                "That means collection has stopped running.")
        except ValueError:
            age_line = newest_seen[:10]

    for k in recent:
        total = series[k]["total"]
        is_current = k == f"{now.year}-{now.month:02d}"
        if total < LOW_MONTH_FLOOR and not is_current:
            problems.append(f"{k} holds only {total} victims. Real months run 700 to 950. "
                            "That month looks incomplete.")

    if failures:
        status = "BROKEN"
    elif problems:
        status = "STALE"
    else:
        status = "OK"

    lines = [
        "MEASUREMENT COLLECTOR - HEALTH REPORT",
        "",
        f"STATUS: {status}",
        "",
        f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Months in series   {len(keys)}",
        f"Victims counted    {sum(v['total'] for v in series.values()):,}",
        f"Newest record      {age_line}",
        "",
        "Victims per month, most recent six:",
    ]
    for k in recent:
        s = series[k]
        flag = ""
        if s["total"] < LOW_MONTH_FLOOR and k != f"{now.year}-{now.month:02d}":
            flag = "   <-- LOOKS WRONG"
        note = "  (month still in progress)" if k == f"{now.year}-{now.month:02d}" else ""
        lines.append(f"   {k}   {s['total']:>5}{note}{flag}")

    lines += ["", ]
    if notes:
        lines.append("WORTH KNOWING (not a problem):")
        lines += [f" - {n}" for n in notes]
        lines.append("")
    if problems:
        lines.append("WHAT IS WRONG:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session and say",
                  "'the measurement collector health file says this'."]
    else:
        lines.append("Nothing to do. Collection is healthy.")

    lines += ["", "This file is rewritten after every run. If the date at the top is more",
              "than two days old, the scheduled job is not running, and that is itself",
              "the problem."]

    (OUT / "HEALTH-victims.txt").write_text("\n".join(lines) + "\n")
    (OUT / "HEALTH-victims.json").write_text(json.dumps({
        "status": status,
        "checked": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "months": len(keys),
        "total_victims": sum(v["total"] for v in series.values()),
        "newest_record": newest_seen[:10] if newest_seen else None,
        "problems": problems,
        "notes": notes,
    }, indent=1))


if __name__ == "__main__":
    sys.exit(main())
