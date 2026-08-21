#!/usr/bin/env python3
"""
MEASUREMENT COLLECTOR - upstream transit carriers
==================================================
Measures who is still carrying traffic for the hosting providers the ecosystem
depends on, and when they stopped.

WHY THIS EXISTS
---------------
Upstream Transit Carriers is rated CRITICAL on the ecosystem map, sits in the
Permission Layer, and is measured by nothing. It is not measured because nobody
built it, not because the data is missing: every network on the public internet
must announce who it connects to in order to work at all. That announcement is
published, free, and keyless.

WHAT IT MEASURES
----------------
For every network belonging to a tracked hosting provider:

  visible          is it announcing routes at all right now
  last_seen        the date it stopped, if it stopped. This is the death date.
  upstreams        how many carriers currently provide it transit
  neighbours       how many networks it connects to, monthly, back to 2024

A provider that loses transit goes dark. Watching the count fall, and watching
how long it stays down before someone else picks it up, is the durability
measurement the framework asks for and does not have.

SOURCE
------
RIPEstat, run by the RIPE NCC. Public, keyless, free.

WHY THESE NUMBERS CAN MISLEAD
-----------------------------
Two things, both real:

1. A network going dark is not proof of enforcement. Providers renumber,
   consolidate, and abandon AS numbers for ordinary commercial reasons. This
   measures disconnection, not cause. Pair it with the action log before
   claiming any takedown worked.

2. The monthly history counts ALL observed neighbours, which mixes transit
   providers with peers. The upstream figure is exact but only for right now.
   The history is a connectivity trend, not a transit count. Do not read the
   two as the same number.

WHICH NETWORKS
--------------
Read from data/measurement/tracked-networks.json, which is data, not code.
Add providers there.

USAGE
-----
    python3 scripts/collect_transit.py
    python3 scripts/collect_transit.py --no-history    # faster, current state only
"""

import json
import pathlib
import subprocess
import sys
import time
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone

RIPESTAT = "https://stat.ripe.net/data"
OUT = pathlib.Path("data/measurement")
CONFIG = OUT / "tracked-networks.json"
UA = "RENO-Observatory-Measurement"
HISTORY_FROM = "2024-01-01"
PAUSE = 1.0          # be a polite client; RIPEstat is a free public service


def get(endpoint, params):
    url = f"{RIPESTAT}/{endpoint}/data.json?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return json.loads(r.read())
    except Exception:
        out = subprocess.run(["curl", "-s", "--max-time", "90", "-H", f"User-Agent: {UA}", url],
                             capture_output=True, text=True)
        if out.returncode != 0 or not out.stdout.strip():
            return None
        try:
            return json.loads(out.stdout)
        except json.JSONDecodeError:
            return None


def month_span(start, end):
    """Every YYYY-MM touched by a start/end timestamp pair."""
    try:
        a = datetime.strptime(start[:7], "%Y-%m")
        b = datetime.strptime(end[:7], "%Y-%m")
    except (ValueError, TypeError):
        return []
    out, y, m = [], a.year, a.month
    while (y, m) <= (b.year, b.month):
        out.append(f"{y}-{m:02d}")
        m += 1
        if m == 13:
            y, m = y + 1, 1
    return out


def collect_asn(asn, want_history):
    """Current routing state plus, optionally, the monthly neighbour history."""
    rec = {"asn": asn}

    status = get("routing-status", f"resource=AS{asn}")
    if not status or status.get("status") != "ok":
        rec["error"] = "routing status unavailable"
        return rec
    d = status.get("data", {})
    rec["announced_prefixes_v4"] = (d.get("announced_space") or {}).get("v4", {}).get("prefixes", 0)
    rec["observed_neighbours"] = d.get("observed_neighbours", 0)
    rec["first_seen"] = (d.get("first_seen") or {}).get("time", "")[:10]
    rec["last_seen"] = (d.get("last_seen") or {}).get("time", "")[:10]
    rec["visible"] = bool(rec["observed_neighbours"]) or bool(rec["announced_prefixes_v4"])

    if rec["last_seen"]:
        try:
            gone = (datetime.now(timezone.utc).date()
                    - datetime.strptime(rec["last_seen"], "%Y-%m-%d").date()).days
            rec["days_since_last_seen"] = gone
        except ValueError:
            pass

    time.sleep(PAUSE)
    nb = get("asn-neighbours", f"resource=AS{asn}")
    if nb and nb.get("status") == "ok":
        ns = nb.get("data", {}).get("neighbours", [])
        # RIPEstat labels a neighbour "left" when it sits upstream in observed
        # AS paths, which is the closest public proxy for "provides transit".
        rec["upstreams_now"] = sorted(x["asn"] for x in ns if x.get("type") == "left")
        rec["downstreams_now"] = len([x for x in ns if x.get("type") == "right"])

    if want_history:
        time.sleep(PAUSE)
        h = get("asn-neighbours-history",
                f"resource=AS{asn}&starttime={HISTORY_FROM}"
                f"&endtime={datetime.now(timezone.utc).strftime('%Y-%m-%d')}")
        if h and h.get("status") == "ok":
            per_month = defaultdict(set)
            for n in h.get("data", {}).get("neighbours", []):
                for tl in n.get("timelines", []):
                    for mo in month_span(tl.get("starttime"), tl.get("endtime")):
                        per_month[mo].add(n["neighbour"])
            rec["neighbours_by_month"] = {m: len(v) for m, v in sorted(per_month.items())}
    return rec


def main():
    # Progress must appear as it happens. Without this a slow run looks like a
    # hang, both in the terminal and in the GitHub Actions log.
    sys.stdout.reconfigure(line_buffering=True)

    want_history = "--no-history" not in sys.argv
    now = datetime.now(timezone.utc)
    cfg = json.loads(CONFIG.read_text())
    providers = cfg["providers"]

    total = sum(len(p["asns"]) for p in providers.values())
    print(f"Tracking {total} networks across {len(providers)} providers"
          f"{' with history' if want_history else ''}\n")

    results, failures = {}, []
    for slug, prov in providers.items():
        recs = []
        for asn in prov["asns"]:
            r = collect_asn(asn, want_history)
            if r.get("error"):
                failures.append(f"AS{asn}")
            recs.append(r)
            time.sleep(PAUSE)
        live = [r for r in recs if r.get("visible")]
        dark = [r for r in recs if not r.get("visible") and not r.get("error")]
        ups = sorted({u for r in recs for u in r.get("upstreams_now", [])})
        results[slug] = {
            "name": prov["name"],
            "designated": prov.get("designated", False),
            "profile": prov.get("profile"),
            "networks_tracked": len(recs),
            "networks_visible": len(live),
            "networks_dark": len(dark),
            "distinct_upstreams_now": len(ups),
            "upstream_asns_now": ups,
            "networks": recs,
        }
        flag = " [designated]" if prov.get("designated") else ""
        print(f"  {prov['name'][:26]:<26}{flag:<14} "
              f"{len(live):>2} visible / {len(recs):>2} tracked, "
              f"{len(ups):>3} upstream carriers")

    payload = {
        "meta": {
            "source": "RIPEstat (RIPE NCC), public and keyless",
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "providers": len(providers),
            "networks_tracked": total,
            "networks_visible": sum(p["networks_visible"] for p in results.values()),
            "history_from": HISTORY_FROM if want_history else None,
            "measures": "Who still carries traffic for tracked hosting providers, and when they stopped.",
            "why_this_can_mislead": (
                "A network going dark is disconnection, not proof of enforcement: providers "
                "renumber and abandon AS numbers commercially. The monthly history counts all "
                "observed neighbours, mixing transit with peering; only the current upstream "
                "figure is a transit count. Never read the two as the same number."
            ),
            "distortion": "Medium",
        },
        "providers": results,
    }
    (OUT / "transit-carriers.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, failures, now)
    print(f"\nWrote {OUT/'transit-carriers.json'} and {OUT/'HEALTH-transit.txt'}")
    return 1 if len(failures) > total // 4 else 0


def write_health(payload, failures, now):
    meta, provs = payload["meta"], payload["providers"]
    problems = []
    if failures:
        problems.append(f"Could not read {len(failures)} of {meta['networks_tracked']} networks: "
                        f"{', '.join(failures[:8])}{' ...' if len(failures) > 8 else ''}.")
    if meta["networks_visible"] == 0:
        problems.append("No tracked network is visible anywhere. That is far more likely to be a "
                        "problem with the data source than a real event.")

    status = "BROKEN" if problems and meta["networks_visible"] == 0 else ("STALE" if problems else "OK")
    lines = [
        "UPSTREAM TRANSIT CARRIERS - HEALTH REPORT",
        "",
        f"STATUS: {status}",
        "",
        f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Providers tracked  {meta['providers']}",
        f"Networks tracked   {meta['networks_tracked']}",
        f"Still routing      {meta['networks_visible']}",
        "",
        "By provider:",
        "   provider                    routing   dark   upstream carriers",
    ]
    for slug, p in sorted(provs.items(), key=lambda kv: -kv[1]["distinct_upstreams_now"]):
        mark = " *" if p["designated"] else "  "
        lines.append(f"  {mark}{p['name'][:24]:<25} {p['networks_visible']:>5}   "
                     f"{p['networks_dark']:>4}   {p['distinct_upstreams_now']:>8}")
    lines += ["", "   * = under a public sanctions or enforcement action", ""]

    dead = [(slug, r) for slug, p in provs.items() for r in p["networks"]
            if not r.get("visible") and r.get("last_seen")]
    if dead:
        lines.append("Networks that have gone dark, newest first:")
        for slug, r in sorted(dead, key=lambda x: x[1]["last_seen"], reverse=True)[:12]:
            lines.append(f"   AS{r['asn']:<8} {provs[slug]['name'][:22]:<23} "
                         f"last seen {r['last_seen']}  "
                         f"({r.get('days_since_last_seen', '?')} days ago)")
        lines.append("")

    lines += ["READ THESE NUMBERS CAREFULLY:", " " + meta["why_this_can_mislead"], ""]
    if problems:
        lines.append("WHAT IS WRONG:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
    else:
        lines.append("Nothing to do. Collection is healthy.")
    (OUT / "HEALTH-transit.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
