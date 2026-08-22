#!/usr/bin/env python3
"""
DRIFT CHECK - how current the hand-maintained evidence is
==========================================================
Watches the files a person keeps by hand, and reports how old their evidence is.

WHY NOT SOMETHING CLEVERER
--------------------------
The obvious idea was to recompute the reachability finding from the tracker and
compare it to the Conversion Test's published figure. That was rejected
deliberately.

The Conversion Test defines denominators, handles unfinished cases, codes
outcomes conservatively and carries negative controls. A keyword pass over a
free-text status field would reproduce none of that while producing a number
that LOOKS like a rival answer. A crude recomputation dressed as a check is
worse than no check, because it invites someone to trust the wrong figure.

So this measures staleness, which is a fact, rather than re-deriving findings,
which is judgment.

WHAT IT REPORTS
---------------
  declared age    each hand-kept file's own asOf date, and how old that is
  evidence age    for the tracker's individuals, the "checked <month>" stamps
                  recorded against domestic status, and how many say "Not checked"
  status mix      raw counts of at-large against in-custody. NOT a reachability
                  ratio, and labelled so nobody reads it as one.

WHY THIS CAN MISLEAD
--------------------
An old asOf date does not mean a file is wrong. A tracker of historical
enforcement actions can be entirely accurate and untouched for months, because
nothing happened. Age is a prompt to check, not a defect. What age genuinely
tells you is how long you have been trusting something nobody has looked at.

USAGE
-----
    python3 scripts/check_staleness.py

OUTPUT
------
    data/measurement/staleness.json
    data/measurement/HEALTH-staleness.txt
"""

import json
import pathlib
import re
import sys
from collections import Counter
from datetime import datetime, timezone

OUT = pathlib.Path("data/measurement")
ROOT = pathlib.Path("data")

# Hand-maintained files, and which map nodes lean on each.
WATCHED = [
    ("enforcement.json", "Sanctions and indictment tracker",
     ["Crypto Mixers", "OTC Brokers", "Russia-Based Exchanges", "Non-Compliant Exchanges"]),
    ("scoreboard.json", "Takedown scoreboard",
     ["Underground Forums", "Loaders and Botnets", "RaaS Operator"]),
    ("reconstitution-data.js", "Reconstitution intervals",
     ["Bulletproof Hosting", "RaaS Operator", "Leak Site Operations"]),
    ("lineage-data.js", "Group lineage",
     ["RaaS Operator", "RaaS Affiliates"]),
]

CHECKED_RE = re.compile(r"checked\s+([A-Z][a-z]{2})\s+(\d{4})", re.I)
MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}

# Conservative buckets. Anything not clearly one or the other stays unclassified,
# because guessing here is how a crude number starts looking authoritative.
IN_CUSTODY = ("arrest", "custody", "detention", "convicted", "sentenced", "extradit", "jailed")
AT_LARGE = ("at large", "fugitive", "wanted")


def age_days(date_str, now):
    for fmt in ("%Y-%m-%d", "%Y-%m", "%Y"):
        try:
            return (now - datetime.strptime(date_str[:len(fmt) + 2], fmt)
                    .replace(tzinfo=timezone.utc)).days
        except (ValueError, TypeError):
            continue
    return None


def declared_asof(path):
    """The file's own asOf stamp, from JSON meta or a JS header comment."""
    try:
        text = path.read_text(errors="ignore")
    except OSError:
        return None
    if path.suffix == ".json":
        try:
            return (json.loads(text).get("meta") or {}).get("asOf")
        except (json.JSONDecodeError, ValueError):
            return None
    m = re.search(r'"asOf"\s*:\s*"([0-9]{4}-[0-9]{2}(?:-[0-9]{2})?)"', text)
    return m.group(1) if m else None


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)

    files = []
    for name, label, nodes in WATCHED:
        path = ROOT / name
        asof = declared_asof(path) if path.exists() else None
        files.append({
            "file": name, "label": label, "nodes": nodes,
            "present": path.exists(),
            "as_of": asof,
            "as_of_age_days": age_days(asof, now) if asof else None,
            "file_modified": (datetime.fromtimestamp(path.stat().st_mtime, timezone.utc)
                              .strftime("%Y-%m-%d") if path.exists() else None),
        })
        a = files[-1]["as_of_age_days"]
        print(f"  {name:<26} asOf {str(asof):<12} "
              f"{'age ' + str(a) + 'd' if a is not None else 'no asOf stamp'}")

    evidence = {"stamps": Counter(), "not_checked": 0, "no_stamp": 0, "total": 0}
    status_mix = Counter()
    tracker = ROOT / "enforcement.json"
    if tracker.exists():
        try:
            people = json.loads(tracker.read_text()).get("individuals", [])
        except (json.JSONDecodeError, ValueError):
            people = []
        for p in people:
            evidence["total"] += 1
            ds = (p.get("domesticStatus") or "").strip()
            m = CHECKED_RE.search(ds)
            if m:
                mo, yr = MONTHS.get(m.group(1).lower()), int(m.group(2))
                evidence["stamps"][f"{yr}-{mo:02d}" if mo else str(yr)] += 1
            elif "not checked" in ds.lower():
                evidence["not_checked"] += 1
            else:
                evidence["no_stamp"] += 1

            st = (p.get("status") or "").lower()
            if any(k in st for k in IN_CUSTODY):
                status_mix["in custody or convicted"] += 1
            elif any(k in st for k in AT_LARGE):
                status_mix["at large"] += 1
            else:
                status_mix["not classified"] += 1

    newest = max(evidence["stamps"]) if evidence["stamps"] else None
    payload = {
        "meta": {
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "measures": "How old the evidence in hand-maintained files is.",
            "newest_domestic_check": newest,
            "newest_check_age_days": age_days(newest, now) if newest else None,
            "why_this_can_mislead": (
                "An old date does not mean a file is wrong. A tracker of historical enforcement "
                "can be entirely accurate and untouched for months because nothing happened. Age "
                "is a prompt to check, not a defect. What it does tell you is how long something "
                "has been trusted without anyone looking at it. The status mix below is a raw "
                "count and is NOT a reachability ratio: the Conversion Test defines denominators, "
                "handles unfinished cases and carries negative controls, none of which are "
                "reproduced here, and no figure here should be read against its findings."
            ),
            "distortion": "Low. These are dates, not inferences.",
        },
        "files": files,
        "domestic_check_stamps": dict(sorted(evidence["stamps"].items(), reverse=True)),
        "individuals_not_checked": evidence["not_checked"],
        "individuals_without_a_stamp": evidence["no_stamp"],
        "individuals_total": evidence["total"],
        "status_mix_raw_counts": dict(status_mix),
    }
    (OUT / "staleness.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, now)
    print(f"\nWrote {OUT/'staleness.json'} and {OUT/'HEALTH-staleness.txt'}")
    return 0


def write_health(payload, now):
    m = payload["meta"]
    problems = []
    for f in payload["files"]:
        if not f["present"]:
            problems.append(f"{f['file']} is missing. {len(f['nodes'])} node(s) rest on it.")
        elif f["as_of_age_days"] is None:
            problems.append(f"{f['file']} carries no asOf stamp, so its age cannot be judged.")
        elif f["as_of_age_days"] > 120:
            problems.append(f"{f['file']} declares itself current as of {f['as_of']}, "
                            f"{f['as_of_age_days']} days ago.")

    status = "STALE" if problems else "OK"
    lines = [
        "HAND-MAINTAINED EVIDENCE - HEALTH REPORT", "",
        f"STATUS: {status}", "",
        f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC", "",
        "Files a person keeps current, and how old they say they are:",
        "   file                        as of         age    nodes resting on it",
    ]
    for f in payload["files"]:
        age = f"{f['as_of_age_days']}d" if f["as_of_age_days"] is not None else "?"
        lines.append(f"   {f['file'][:26]:<27} {str(f['as_of'])[:11]:<12} {age:>5}    {len(f['nodes'])}")
    lines.append("")

    st = payload["domestic_check_stamps"]
    if st:
        lines.append("When the tracker last checked each person's domestic status:")
        for k, v in list(st.items())[:8]:
            lines.append(f"   {k}   {v:>3} individuals")
        lines.append(f"   not checked   {payload['individuals_not_checked']:>3} individuals")
        lines.append(f"   no stamp      {payload['individuals_without_a_stamp']:>3} individuals")
        lines.append(f"   TOTAL         {payload['individuals_total']:>3}")
        lines.append("")

    mix = payload["status_mix_raw_counts"]
    if mix:
        lines.append("Status mix, RAW COUNTS ONLY. This is not a reachability ratio and must")
        lines.append("not be compared against the Conversion Test's findings:")
        for k, v in sorted(mix.items(), key=lambda kv: -kv[1]):
            lines.append(f"   {v:>3}  {k}")
        lines.append("")

    lines += ["READ THIS CAREFULLY:", " " + m["why_this_can_mislead"], ""]
    if problems:
        lines.append("WORTH A LOOK:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "None of these is an error. They are things nobody has looked at in a while."]
    else:
        lines.append("Nothing to do. Every hand-kept file is recently current.")
    (OUT / "HEALTH-staleness.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
