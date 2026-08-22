#!/usr/bin/env python3
"""
GROUP PAGE FEED - victims for the 13 tracked group pages
=========================================================
This builds the per-group JSON files that groups/*.html read.

WHY THIS IS A FILE AND NOT INSIDE THE WORKFLOW
-----------------------------------------------
It used to live inside .github/workflows/refresh-data.yml as inline code,
which meant nobody could run it or test it without pushing to GitHub first.
That is how the fault below survived unnoticed.

THE FAULT THIS FIXES
--------------------
The old version downloaded six months of victims. If a month failed to
download it printed a warning, carried on, and wrote the group files anyway,
with that month's victims silently missing. The website then published an
under-count that looked completely normal.

This was not theoretical. On 19 Aug 2026 akira.json fell from 182 victims to
178 and then recovered to 181 two days later. Counts should not go backwards.

THE RULE NOW
------------
Stale but complete beats fresh but partial.

If any month cannot be downloaded after a retry, this script writes NOTHING
and exits with an error. The previous good files stay in place, the workflow
run goes red, and you find out. A missing update is visible. A quiet
under-count is not.

USAGE
-----
    python3 scripts/fetch_group_victims.py            # writes the files
    python3 scripts/fetch_group_victims.py --dry-run  # reports, writes nothing
"""

import json
import pathlib
import subprocess
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import _rlive
from datetime import datetime, timezone

BASE = "https://api.ransomware.live/v2"
MONTHS_BACK = 6
UA = "RENO-Observatory-Groups"
OUTDIR = pathlib.Path("groups/data")

# Keys are ransomware.live group slugs; values are the output filename.
# chaos is the current active iteration of the Royal/BlackSuit/Chaos lineage.
GROUPS = {
    "lynx": "lynx",
    "qilin": "qilin",
    "akira": "akira",
    "lockbit": "lockbit",
    "direwolf": "direwolf",
    "medusa": "medusa",
    "dragonforce": "dragonforce",
    "conti": "conti",
    "clop": "clop",
    "chaos": "royal",
    "SilentRansomGroup": "silentransom",
    "thegentlemen": "thegentlemen",
    "payload": "payload",
    "worldleaks": "worldleaks",
}


def month_list(now, count):
    """
    The last `count` calendar months, newest first.

    The old version stepped back by 28 days at a time, which drifts about three
    days per step. It happened to produce six correct months, but anyone raising
    the number past ten would have silently got a repeated month. This walks
    real calendar months instead.
    """
    out = []
    y, m = now.year, now.month
    for _ in range(count):
        out.append((y, m))
        m -= 1
        if m == 0:
            y, m = y - 1, 12
    return out


def main():
    dry_run = "--dry-run" in sys.argv
    now = datetime.now(timezone.utc)

    all_victims = []
    missing = []

    for i, (y, m) in enumerate(month_list(now, MONTHS_BACK)):
        if i:
            time.sleep(2)                      # be a polite client
        # Shared with the measurement collector so the retry policy cannot
        # drift between them. See scripts/_rlive.py.
        records, err = _rlive.fetch_month_with_retry(
            y, m, UA, log=lambda msg: print(f"  {y}-{m:02d}{msg}"))
        if records is None or not isinstance(records, list):
            missing.append(f"{y}-{m:02d}")
            print(f"  {y}-{m:02d}  FAILED ({err})")
            continue
        all_victims.extend(records)
        print(f"  {y}-{m:02d}  {len(records)} victims")

    # THE GUARD. Refuse to publish an incomplete picture.
    if missing:
        print(f"\nABORTING. Could not download: {', '.join(missing)}")
        print("Nothing was written. The existing files are unchanged and still complete.")
        print("This run is deliberately marked failed so the gap is visible.")
        return 1

    seen, unique = set(), []
    for v in all_victims:
        key = f"{v.get('victim')}|{v.get('group')}|{v.get('attackdate')}"
        if key not in seen:
            seen.add(key)
            unique.append(v)
    print(f"\n{len(unique)} unique victims across {MONTHS_BACK} complete months")

    # Second guard: never let a group file shrink without saying so out loud.
    shrunk = []
    for slug, filename in GROUPS.items():
        items = sorted(
            [v for v in unique if (v.get("group") or "").lower() == slug.lower()],
            key=lambda x: x.get("attackdate") or "", reverse=True,
        )
        path = OUTDIR / f"{filename}.json"
        was = 0
        if path.exists():
            try:
                was = len(json.loads(path.read_text()))
            except (json.JSONDecodeError, ValueError):
                was = 0
        change = ""
        if was and len(items) < was:
            change = f"   <-- DOWN from {was}"
            shrunk.append(f"{filename}: {was} -> {len(items)}")
        if not dry_run:
            path.write_text(json.dumps(items, indent=2, ensure_ascii=False))
        print(f"  {filename:<14} {len(items):>5}{change}")

    if not dry_run:
        (OUTDIR / "last-updated.json").write_text(
            json.dumps({"updated": now.strftime("%Y-%m-%dT%H:%M:%SZ")})
        )

    if shrunk:
        # Not fatal. The source does legitimately withdraw claims sometimes.
        # But it is never routine, so it is always said out loud.
        print("\nNOTE: these files got SMALLER, which is worth a look:")
        for s in shrunk:
            print(f"  {s}")
        print("Victims are rarely un-published. A drop usually means either the")
        print("source withdrew a claim, or the download was incomplete.")

    print("\nDRY RUN - nothing written." if dry_run else "\nWritten.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
