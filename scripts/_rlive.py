#!/usr/bin/env python3
"""
Shared fetch for the ransomware.live API.

WHY THIS FILE EXISTS
--------------------
Two collectors read this API: fetch_group_victims.py fills the public group
pages, and collect_measurement.py builds the measurement series. They had
separate copies of the same fetch-and-retry logic.

On 22 Aug 2026 the retry policy was fixed in one and not the other. Nothing
failed, which is the problem: two copies of the same logic drift silently, and
the one nobody edited keeps its old bug.

They are NOT merged into one collector, deliberately. The site feed and the
measurement pipeline should be able to fail independently: a fault in
measurement must never be able to take down the public pages. Sharing the fetch
removes the drift without coupling the jobs.
"""

import json
import subprocess
import time
import urllib.error
import urllib.request

BASE = "https://api.ransomware.live/v2/victims"

# Growing waits. Being told to slow down is normal and clears; three attempts
# cover it in almost every case without giving up on a run.
BACKOFF = (30, 60, 120)


def fetch_month(year, month, user_agent, timeout=60):
    """
    One whole month of victims. No record cap, unlike the /recentvictims feed
    that silently returned exactly 100 records regardless of elapsed time and
    cost 74 days of data before anyone noticed.

    Returns (records, error) where error is None, "ratelimit", or "failed".
    """
    url = f"{BASE}/{year}/{month}"
    req = urllib.request.Request(
        url, headers={"Accept": "application/json", "User-Agent": user_agent})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read()), None
    except urllib.error.HTTPError as e:
        return None, ("ratelimit" if e.code == 429 else "failed")
    except Exception:
        # Some macOS Python installs cannot verify certificates. curl can.
        # GitHub Actions never takes this path; a local run does.
        out = subprocess.run(
            ["curl", "-s", "--max-time", str(timeout), "-w", "\n%{http_code}",
             "-H", f"User-Agent: {user_agent}", url],
            capture_output=True, text=True)
        body, _, code = out.stdout.rpartition("\n")
        if code.strip() == "429":
            return None, "ratelimit"
        if out.returncode != 0 or not body.strip():
            return None, "failed"
        try:
            return json.loads(body), None
        except json.JSONDecodeError:
            return None, "failed"


def fetch_month_with_retry(year, month, user_agent, log=print):
    """Wait out rate limiting rather than treating it as failure."""
    records, err = fetch_month(year, month, user_agent)
    for wait in BACKOFF:
        if err != "ratelimit":
            break
        log(f"        rate limited, waiting {wait}s")
        time.sleep(wait)
        records, err = fetch_month(year, month, user_agent)
    return records, err
