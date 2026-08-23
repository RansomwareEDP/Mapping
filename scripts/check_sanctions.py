#!/usr/bin/env python3
"""
DRIFT CHECK - enforcement.json against the OFAC SDN list
=========================================================
Watches a hand-maintained file for things moving underneath it.

WHAT THIS IS, AND IS NOT
------------------------
It does NOT replace the analysis in data/enforcement.json. Deciding what an
action was, who it hit, and what it achieved is judgment, and judgment is not
automatable.

What it does is notice when the world changes and the file has not: a new cyber
designation that is not logged yet, or a logged designation that is no longer on
the list. It produces QUESTIONS, never corrections.

WHY THIS FILE AND NOT ANOTHER
-----------------------------
Four map nodes rest on enforcement.json, two of them rated CRITICAL, and all four
read PARTIAL in the coverage register because a person keeps them current. That
makes it the highest-leverage hand-maintained file in the set, and the one where
silent staleness costs most.

NAME MATCHING IS FUZZY, AND THAT IS THE MAIN LIMITATION
--------------------------------------------------------
OFAC writes "KHOROSHEV, Dmitry Yuryevich". The tracker writes "Dmitry Yuryevich
Khoroshev". Transliteration from Russian varies. The rules that handle this, and
the cases that pin them, live in scripts/_names.py and are shared with the wallet
collector so the two cannot drift apart. Run --selftest after changing them.

Every output is therefore a CANDIDATE for a human to check. Nothing here is a
finding.

THREE INNOCENT REASONS AN ENTRY APPEARS AS "NOT ON THE LIST"
-------------------------------------------------------------
1. It was sanctioned by the UK, EU or Australia, not the US. The tracker covers
   several authorities; this checks one.
2. It sits under a non-cyber OFAC program, commonly RUSSIA-EO14024, which this
   does not read.
3. The name is spelled differently enough that matching failed.
Delisting is the fourth and least likely explanation. Check the others first.

SOURCE
------
OFAC Specially Designated Nationals list, published by the US Treasury.
Public, keyless, free.

USAGE
-----
    python3 scripts/check_sanctions.py

OUTPUT
------
    data/measurement/sanctions-drift.json
    data/measurement/HEALTH-sanctions.txt
"""

import csv
import io
import json
import pathlib
import re
import subprocess
import sys
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import _names
from datetime import datetime, timezone

SDN_URL = "https://www.treasury.gov/ofac/downloads/sdn.csv"
TRACKER = pathlib.Path("data/enforcement.json")
OUT = pathlib.Path("data/measurement")
UA = "RENO-Observatory-Measurement"

# OFAC programme codes for cyber-related designations. Ransomware actors also
# appear under RUSSIA-EO14024 and others, which this does not read: an entry
# missing here is not evidence of anything on its own.
CYBER_PROGRAMS = ("CYBER2", "CYBER3", "CYBER4")

# The tracker writes the WORD "None" to mean not sanctioned. Read as a value it
# is a non-empty string, which flagged 120 unsanctioned people for being missing
# from a sanctions list. Human-written files carry conventions like this and code
# has to know them.
NO_VALUE = {"", "NONE", "N/A", "NA", "-", "UNKNOWN", "TBD"}

# Only a US designation would appear on the SDN list. An entry sanctioned solely
# by the UK, EU or Australia is correctly absent and must not be raised.
US_MARKERS = ("OFAC", "TREASURY", "SDN", "US ", "U.S.", "USA")


# The tracker also records the ABSENCE of a designation in prose: "No
# entity-level designation", "No designation as of Jul 2026". Those sentences
# contain the vocabulary of a designation while asserting the opposite, so
# keyword presence alone reads them backwards.
NEGATIONS = ("NO DESIGNATION", "NO ENTITY-LEVEL DESIGNATION", "NOT DESIGNATED",
             "NO ENTITY LEVEL DESIGNATION", "NO SANCTIONS", "NOT SANCTIONED")


def claims_us_designation(text):
    t = (text or "").strip()
    u = t.upper()
    if u in NO_VALUE:
        return False
    if any(n in u for n in NEGATIONS):
        return False
    return any(m in u for m in US_MARKERS)


def download():
    req = urllib.request.Request(SDN_URL, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return r.read().decode("latin-1")
    except Exception:
        out = subprocess.run(["curl", "-s", "-L", "--max-time", "180",
                              "-H", f"User-Agent: {UA}", SDN_URL],
                             capture_output=True, text=True, errors="replace")
        return out.stdout if out.returncode == 0 and out.stdout.strip() else None


# The matching rules and the cases that pin them now live in _names.py, so the
# two collectors that compare names cannot drift apart. This stays as a wrapper
# because the workflow calls --selftest before every collection.
def selftest():
    return _names.selftest()


def main():
    sys.stdout.reconfigure(line_buffering=True)
    if "--selftest" in sys.argv:
        return selftest()
    now = datetime.now(timezone.utc)
    OUT.mkdir(parents=True, exist_ok=True)

    raw = download()
    if not raw:
        write_health(None, now, ["The OFAC SDN list could not be downloaded."])
        print("DOWNLOAD FAILED")
        return 1

    sdn = []
    for row in csv.reader(io.StringIO(raw)):
        if len(row) < 12:
            continue
        programs = [p.strip("[] ") for p in (row[3] or "").split("]") if p.strip("[] ")]
        if not any(p in CYBER_PROGRAMS for p in programs):
            continue
        sdn.append({"ent_num": row[0], "name": row[1].strip(),
                    "sdn_type": (row[2] or "").strip(" -0"),
                    "programs": programs, "remarks": (row[11] or "").strip()[:300],
                    "_tok": _names.tokens(row[1])})
    print(f"  OFAC     {len(sdn)} entries under {', '.join(CYBER_PROGRAMS)}")

    tracker = json.loads(TRACKER.read_text())
    logged = []
    for p in tracker.get("individuals", []):
        logged.append({"name": p.get("name", ""), "kind": "individual",
                       "claims_sanctions": claims_us_designation(p.get("sanctions")),
                       "sanctions_text": p.get("sanctions", ""),
                       "_tok": _names.tokens(p.get("name", "")) | _names.tokens(p.get("aliases", ""))})
    for e in tracker.get("entities", []):
        logged.append({"name": e.get("entity", ""), "kind": "entity",
                       "claims_sanctions": claims_us_designation(e.get("sanctions")),
                       "sanctions_text": e.get("sanctions", ""),
                       "_tok": _names.tokens(e.get("entity", ""))})
    print(f"  Tracker  {len(logged)} people and entities, asOf "
          f"{tracker.get('meta', {}).get('asOf', 'unknown')}")

    unlogged = [s for s in sdn if not any(_names.overlaps(s["_tok"], l["_tok"]) for l in logged)]
    absent = [l for l in logged
              if l["claims_sanctions"] and not any(_names.overlaps(l["_tok"], s["_tok"]) for s in sdn)]

    payload = {
        "meta": {
            "source": "OFAC Specially Designated Nationals list, public and keyless",
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "tracker_as_of": tracker.get("meta", {}).get("asOf"),
            "programs_read": list(CYBER_PROGRAMS),
            "ofac_cyber_entries": len(sdn),
            "tracker_records": len(logged),
            "candidates_unlogged": len(unlogged),
            "candidates_absent": len(absent),
            "measures": "Whether a hand-maintained tracker has drifted from the published list.",
            "why_this_can_mislead": (
                "Name matching is fuzzy and deliberately generous, so both lists below contain "
                "false positives by design. An entry appearing as unlogged may already be in the "
                "tracker under a different transliteration. An entry appearing as absent is most "
                "often designated under a non-cyber OFAC programme such as RUSSIA-EO14024, or "
                "spelled differently enough that matching failed. Only entries claiming a US "
                "designation are checked, so UK, EU and Australia-only sanctions are correctly "
                "left out. Delisting is the least likely explanation, not the first. Nothing here "
                "is a finding; every line is a question for a person."
            ),
            "distortion": "High on individual lines, low on the direction of travel.",
        },
        "candidates_not_in_tracker": [
            {k: v for k, v in s.items() if k != "_tok"} for s in unlogged],
        "tracker_entries_not_on_sdn": [
            {k: v for k, v in l.items() if k != "_tok"} for l in absent],
    }
    (OUT / "sanctions-drift.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, now, [])
    print(f"\n  {len(unlogged)} OFAC entries with no obvious tracker match")
    print(f"  {len(absent)} tracker entries with no obvious SDN match")
    print(f"\nWrote {OUT/'sanctions-drift.json'} and {OUT/'HEALTH-sanctions.txt'}")
    return 0


def write_health(payload, now, problems):
    if payload is None:
        lines = ["SANCTIONS DRIFT CHECK - HEALTH REPORT", "", "STATUS: BROKEN", "",
                 f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC", "",
                 "WHAT IS WRONG:"] + [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
        (OUT / "HEALTH-sanctions.txt").write_text("\n".join(lines) + "\n")
        return

    m = payload["meta"]
    unlogged = payload["candidates_not_in_tracker"]
    absent = payload["tracker_entries_not_on_sdn"]

    lines = [
        "SANCTIONS DRIFT CHECK - HEALTH REPORT", "",
        "STATUS: OK", "",
        f"Checked              {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Tracker last updated {m['tracker_as_of']}",
        f"OFAC cyber entries   {m['ofac_cyber_entries']}",
        f"Tracker records      {m['tracker_records']}",
        "",
        "NOTHING BELOW IS A FINDING. Every line is a question for a person.",
        "",
        f"On the OFAC cyber list, no obvious match in the tracker  ({len(unlogged)}):",
    ]
    for s in unlogged[:25]:
        lines.append(f"   {s['name'][:52]:<53} {'/'.join(s['programs'])}")
    if len(unlogged) > 25:
        lines.append(f"   ... and {len(unlogged) - 25} more, in sanctions-drift.json")
    lines += ["", " Most of these will be actors outside the tracker's scope, or already",
              " logged under a different spelling. Worth scanning for names you recognise.", ""]

    lines.append(f"In the tracker as sanctioned, no obvious match on the SDN list ({len(absent)}):")
    for l in absent[:20]:
        lines.append(f"   {l['name'][:34]:<35} {l['sanctions_text'][:44]}")
    if len(absent) > 20:
        lines.append(f"   ... and {len(absent) - 20} more, in sanctions-drift.json")
    lines += ["", " Check in this order: sanctioned by the UK, EU or Australia rather than",
              " the US; designated under a non-cyber programme such as RUSSIA-EO14024;",
              " spelled differently. Delisting is the LAST explanation to reach for.", ""]

    lines += ["READ THIS CAREFULLY:", " " + m["why_this_can_mislead"], "",
              "Nothing to do automatically. This report exists to be read."]
    (OUT / "HEALTH-sanctions.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
