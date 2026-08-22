#!/usr/bin/env python3
"""
NODE COVERAGE - the register
=============================
Works out what is actually measured about each node on the ecosystem map, by
looking at what the collectors produced rather than at what anyone wrote down.

WHY THIS EXISTS
---------------
A coverage verdict used to be a sentence in a document. Nothing checked it, so
it could drift from the truth in either direction: a node could read MEASURED
long after its collector broke, or stay listed as NOT MEASURABLE years after
someone worked out how to measure it.

Here a verdict is a fact about whether something ran. MEASURED means a collector
produced data recently. If that collector stops, the node degrades on its own
and says so.

THE VERDICTS
------------
  MEASURED        a collector feeds this node and ran within the freshness window
  PARTIAL         no collector, but a hand-maintained instrument covers it. There
                  is something to say; nothing is keeping it current. The count of
                  these is the size of the manual burden, and each one goes stale
                  the day its author stops.
  STALE           a collector feeds it but has not run recently. Was measured;
                  is not being measured now. This state did not exist before,
                  and it is the one worth watching.
  GAP             nothing feeds it and nothing covers it, but public sources could
  NOT MEASURABLE  nothing feeds it, and public sources cannot. Reason required.
  UNMAPPED        the map has a node this file does not know about

UNMAPPED is deliberate. Adding a node to the map without deciding what can be
said about it should be visible, because silence is not an acceptable answer.

WHAT THIS DOES NOT DO
---------------------
It reports whether a node is measured, never whether the measurement is any
good. A collector pointed at the wrong data still reads MEASURED. That failure
happened here on 22 Aug 2026: a contaminated network list produced confident
numbers and a healthy status. Plumbing checks cannot see meaning.

USAGE
-----
    python3 scripts/build_coverage.py

OUTPUT
------
    data/measurement/node-coverage.json
    data/measurement/HEALTH-coverage.txt
"""

import json
import pathlib
import re
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone

OUT = pathlib.Path("data/measurement")
MAPDATA = pathlib.Path("data/ecosystem-map-data.js")
COVERAGE_MAP = OUT / "node-coverage-map.json"

# A collector that has not run in this long is not measuring anything today.
# Every collector here runs daily, so a week is generous rather than tight.
FRESH_DAYS = 7

# Every verdict this register can issue, in reporting order. Defined once. The
# summary and the detail sections both read this list, because when they were
# two separate literals one of them lost PARTIAL and the counts stopped summing
# to the number of nodes.
VERDICTS = ("MEASURED", "PARTIAL", "STALE", "GAP", "NOT_MEASURABLE", "UNMAPPED")


def read_map_nodes():
    """Node id, label and tier straight from the live map data."""
    src = MAPDATA.read_text(errors="ignore")
    pat = re.compile(r"id:'([a-z0-9_-]+)'.*?label:\[([^\]]*)\].*?tier:'([A-Z-]+)'", re.S)
    nodes = {}
    for m in pat.finditer(src):
        label = " ".join(re.findall(r"'([^']*)'", m.group(2))).replace("&", "and").strip()
        nodes[m.group(1)] = {"label": label, "tier": m.group(3)}
    return nodes


def feed_state(filename, now):
    """When a collector output was built, and whether that is recent enough."""
    path = OUT / filename
    if not path.exists():
        return {"file": filename, "present": False, "built": None, "age_days": None}
    built = None
    try:
        built = (json.loads(path.read_text()).get("meta") or {}).get("built")
    except (json.JSONDecodeError, ValueError):
        pass
    age = None
    if built:
        try:
            age = (now - datetime.strptime(built, "%Y-%m-%dT%H:%M:%SZ")
                   .replace(tzinfo=timezone.utc)).days
        except ValueError:
            pass
    return {"file": filename, "present": True, "built": built, "age_days": age}


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)

    map_nodes = read_map_nodes()
    cfg = json.loads(COVERAGE_MAP.read_text())["nodes"]

    results, tally = {}, Counter()
    for node_id, meta in map_nodes.items():
        entry = cfg.get(node_id)
        rec = {"label": meta["label"], "tier": meta["tier"]}

        if entry is None:
            rec.update(verdict="UNMAPPED", feeds=[],
                       reason="On the map, but nothing here decides what can be said about it.")
            results[node_id] = rec
            tally["UNMAPPED"] += 1
            continue

        feeds = [feed_state(f, now) for f in entry.get("feeds", [])]
        rec["feeds"] = feeds
        if entry.get("note"):
            rec["note"] = entry["note"]

        hand = entry.get("hand_maintained", [])
        if hand:
            rec["hand_maintained"] = hand
        # A watcher checks a hand-maintained file for drift. It does NOT measure
        # the node, so it must never promote one to MEASURED. Attaching five
        # watchers moved five nodes to MEASURED on 22 Aug 2026, which overstated
        # coverage by counting supervision as measurement.
        watched = entry.get("watched_by", [])
        if watched:
            rec["watched_by"] = [feed_state(f, now) for f in watched]

        if not feeds:
            if hand and entry.get("verdict_if_no_feed") != "NOT_MEASURABLE":
                rec["verdict"] = "PARTIAL"
                if watched:
                    fresh = [w for w in rec["watched_by"]
                             if w["age_days"] is not None and w["age_days"] <= FRESH_DAYS]
                    rec["reason"] = ("Covered by " + ", ".join(hand) + ", which a person "
                                     "maintains. Watched for drift by " + ", ".join(watched) +
                                     (", checked recently." if fresh else
                                      ", but that check has not run recently."))
                else:
                    rec["reason"] = ("Covered by " + ", ".join(hand) +
                                     ", which a person maintains. Nothing would announce it "
                                     "going stale.")
            else:
                rec["verdict"] = entry.get("verdict_if_no_feed", "GAP")
                rec["reason"] = entry.get("reason", "")
        else:
            usable = [f for f in feeds if f["present"]]
            fresh = [f for f in usable if f["age_days"] is not None and f["age_days"] <= FRESH_DAYS]
            if not usable:
                rec["verdict"] = "STALE"
                rec["reason"] = "A collector is assigned but has produced no output file."
            elif not fresh:
                oldest = max((f["age_days"] for f in usable if f["age_days"] is not None), default=None)
                rec["verdict"] = "STALE"
                rec["reason"] = (f"Last collected {oldest} days ago. Was measured; is not being "
                                 f"measured now." if oldest is not None
                                 else "Collector output carries no build date.")
            else:
                rec["verdict"] = "MEASURED"
                rec["freshest_days"] = min(f["age_days"] for f in fresh)

        results[node_id] = rec
        tally[rec["verdict"]] += 1

    orphans = [k for k in cfg if k not in map_nodes]

    payload = {
        "meta": {
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "map_source": str(MAPDATA),
            "nodes_on_map": len(map_nodes),
            "freshness_window_days": FRESH_DAYS,
            "counts": dict(tally),
            "measures": "Which map nodes are actually being measured right now.",
            "why_this_can_mislead": (
                "This reports whether a node is measured, never whether the measurement is "
                "sound. A collector pointed at the wrong data still reads MEASURED. Verdicts "
                "also depend on the freshness window: widen it and STALE nodes silently become "
                "MEASURED again without anything having been collected."
            ),
            "entries_not_on_map": orphans,
        },
        "nodes": results,
    }
    (OUT / "node-coverage.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, now)

    for v in VERDICTS:
        if tally.get(v):
            print(f"  {v:<16} {tally[v]:>2} of {len(map_nodes)}")
    print(f"\nWrote {OUT/'node-coverage.json'} and {OUT/'HEALTH-coverage.txt'}")
    return 0


def write_health(payload, now):
    nodes, meta = payload["nodes"], payload["meta"]
    tally = meta["counts"]
    problems = []

    stale = [(k, v) for k, v in nodes.items() if v["verdict"] == "STALE"]
    if stale:
        problems.append(f"{len(stale)} node(s) were being measured and are not now: "
                        + ", ".join(f"{v['label']}" for _, v in stale) + ".")
    unmapped = [v["label"] for v in nodes.values() if v["verdict"] == "UNMAPPED"]
    if unmapped:
        problems.append("The map has node(s) with no coverage decision recorded: "
                        + ", ".join(unmapped) + ". Add them to node-coverage-map.json.")
    if meta["entries_not_on_map"]:
        problems.append("node-coverage-map.json describes node(s) the map no longer has: "
                        + ", ".join(meta["entries_not_on_map"]) + ".")

    counted = sum(tally.values())
    if counted != meta["nodes_on_map"]:
        problems.append(
            f"The verdicts add up to {counted} but the map has {meta['nodes_on_map']} nodes. "
            f"{abs(meta['nodes_on_map'] - counted)} node(s) are unaccounted for, which means a "
            "verdict exists that this report does not list. Do not trust the counts above.")

    status = "STALE" if problems else "OK"
    lines = [
        "NODE COVERAGE - HEALTH REPORT", "",
        f"STATUS: {status}", "",
        f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Nodes on the map   {meta['nodes_on_map']}",
        f"Freshness window   {meta['freshness_window_days']} days", "",
        "Verdicts:",
    ]
    for v in VERDICTS:
        if tally.get(v):
            lines.append(f"   {v:<16} {tally[v]:>2} of {meta['nodes_on_map']}")
    lines.append("")

    measured = [(k, v) for k, v in nodes.items() if v["verdict"] == "MEASURED"]
    if measured:
        lines.append("Measured now, and by what:")
        for _, v in sorted(measured, key=lambda kv: kv[1]["label"]):
            files = ", ".join(f["file"].replace(".json", "") for f in v["feeds"] if f["present"])
            lines.append(f"   {v['label'][:34]:<35} {v['tier']:<9} {files}")
        lines.append("")

    partial = [v for v in nodes.values() if v["verdict"] == "PARTIAL"]
    if partial:
        watched = [v for v in partial if v.get("watched_by")]
        unwatched = [v for v in partial if not v.get("watched_by")]
        lines.append("Maintained by hand. A person still does the work on all of these.")
        lines.append("")
        if unwatched:
            lines.append("  UNWATCHED. These go stale the day their author stops, and")
            lines.append("  nothing would announce it:")
            for v in sorted(unwatched, key=lambda x: x["label"]):
                lines.append(f"     {v['tier']:<9} {v['label'][:30]:<31} "
                             f"{', '.join(v.get('hand_maintained', []))[:40]}")
            lines.append("")
        if watched:
            lines.append("  WATCHED. Still hand-maintained, but a daily check would notice")
            lines.append("  the source moving underneath them:")
            for v in sorted(watched, key=lambda x: x["label"]):
                lines.append(f"     {v['tier']:<9} {v['label'][:30]:<31} "
                             f"{', '.join(w['file'].replace('.json','') for w in v['watched_by'])}")
        lines.append("")

    crit_gaps = [v for v in nodes.values()
                 if v["verdict"] == "GAP" and v["tier"] in ("CRITICAL", "HIGH")]
    if crit_gaps:
        lines.append("Unbuilt, and rated CRITICAL or HIGH on the map. These are the")
        lines.append("highest-value build items, in the map's own priority order:")
        for v in sorted(crit_gaps, key=lambda x: (x["tier"] != "CRITICAL", x["label"])):
            lines.append(f"   {v['tier']:<9} {v['label']}")
        lines.append("")

    lines += ["READ THIS CAREFULLY:", " " + meta["why_this_can_mislead"], ""]
    if problems:
        lines.append("WHAT IS WRONG:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
    else:
        lines.append("Nothing to do. Every node has a current verdict.")
    (OUT / "HEALTH-coverage.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
