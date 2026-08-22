#!/usr/bin/env python3
"""
DRIFT CHECK - the takedown scoreboard against observed leak-site activity
=========================================================================
Tests what the scoreboard CLAIMS an operation achieved against what the victim
series SHOWS the target doing afterwards.

WHY
---
data/scoreboard.json scores 34 operations on a 0 to 5 scale and records outcomes
like "Dead", "Brand dead", "Degraded but active". Those are the sharpest claims
in the whole corpus, and nothing has ever checked them. Meanwhile the victim
series records, month by month, whether the target kept publishing victims.

Scoring an operation is judgment and stays judgment. Whether the group kept
posting afterwards is a fact, and the two should be put next to each other.

WHAT IT PRODUCES
----------------
For every operation against a ransomware group, victims published in the six
months before and the six months after, and a flag where the claimed outcome and
the observed behaviour appear to disagree.

FOUR REASONS A DISAGREEMENT MAY NOT BE ONE
------------------------------------------
1. Rebranding. "Brand dead" can be exactly right while the operators carry on
   under a new name. Successor brands are counted SEPARATELY for this reason,
   and a dead brand with a busy successor is the scoreboard being precise, not
   wrong.
2. Backdating. Groups publish victims weeks after the attack, so the month
   boundary around an operation is soft.
3. The series starts in January 2024. Operations before that cannot be checked,
   and are reported as unverifiable rather than as successes.
4. Leak-site posting is not the same as operating. A group can be active and
   quiet, or dead and still have a live site.

So this raises QUESTIONS about specific claims. It never overturns one.

USAGE
-----
    python3 scripts/check_scoreboard.py

OUTPUT
------
    data/measurement/scoreboard-drift.json
    data/measurement/HEALTH-scoreboard.txt
"""

import json
import pathlib
import sys
from datetime import datetime, timezone

OUT = pathlib.Path("data/measurement")
SCOREBOARD = pathlib.Path("data/scoreboard.json")
SERIES = OUT / "victims-monthly.json"
MAPPING = OUT / "scoreboard-groups.json"
WINDOW = 6          # months either side of the operation

# Outcomes asserting the target stopped. Anything else already concedes survival.
CLAIMS_STOPPED = ("dead", "dismantled", "neutralized", "brand dead")


def months_around(date_str, months):
    """The `months` month keys before, and after, an operation date."""
    d = datetime.strptime(date_str[:10], "%Y-%m-%d")
    before, after, y, m = [], [], d.year, d.month
    yy, mm = y, m
    for _ in range(months):
        mm -= 1
        if mm == 0:
            yy, mm = yy - 1, 12
        before.append(f"{yy}-{mm:02d}")
    yy, mm = y, m
    for _ in range(months):
        mm += 1
        if mm == 13:
            yy, mm = yy + 1, 1
        after.append(f"{yy}-{mm:02d}")
    return sorted(before), sorted(after)


def months_until_silent(series, slugs, after_keys):
    """
    How many months after an operation before the brand stopped posting and
    stayed stopped.

    A six-month total cannot tell a three-month tail from a group still running.
    ALPHV/BlackCat published 58 victims after its operation, which flagged as a
    disagreement, but the shape was 22, 31, 5, 0, 0, 0: a brand winding down,
    exactly as scored. Sums hide that. Sequences do not.

    Returns None when the brand never reached a sustained zero in the window.
    """
    counts = []
    for k in after_keys:
        month = series.get(k)
        if month is None:
            return None, []
        counts.append(sum(month["by_group"].get(s, 0) for s in slugs))
    for i in range(len(counts)):
        if all(c == 0 for c in counts[i:]):
            return i, counts
    return None, counts


def count(series, slugs, keys):
    total, present = 0, 0
    for k in keys:
        month = series.get(k)
        if not month:
            continue
        present += 1
        for s in slugs:
            total += month["by_group"].get(s, 0)
    return total, present


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)

    series = json.loads(SERIES.read_text())["months"]
    board = json.loads(SCOREBOARD.read_text())
    mapping = json.loads(MAPPING.read_text())["targets"]
    earliest = min(series) if series else ""

    results, flags = [], []
    for op in board["operations"]:
        if "ansomware group" not in op.get("targetType", ""):
            continue
        target = op.get("targets", "")
        cfg = mapping.get(target, {})
        slugs = cfg.get("slugs", [])
        succ = cfg.get("successor_slugs", [])
        before_keys, after_keys = months_around(op["date"], WINDOW)

        rec = {"operation": op.get("operation"), "date": op["date"][:10],
               "target": target, "score": op.get("score"),
               "claimed_outcome": op.get("outcome"), "slugs": slugs,
               "successor_slugs": succ, "note": cfg.get("note", "")}

        if not slugs:
            rec["verdict"] = "NOT CHECKABLE"
            rec["reason"] = cfg.get("note") or "No leak-site brand mapped to this target."
        elif min(after_keys) < earliest or min(before_keys) < earliest:
            rec["verdict"] = "NOT CHECKABLE"
            rec["reason"] = (f"The victim series begins {earliest}; this operation needs data "
                             f"from {min(before_keys)}.")
        else:
            b, bp = count(series, slugs, before_keys)
            a, ap = count(series, slugs, after_keys)
            sa, _ = count(series, succ, after_keys) if succ else (0, 0)
            silent_after, monthly = months_until_silent(series, slugs, after_keys)
            rec.update(victims_before=b, victims_after=a, months_covered_after=ap,
                       successor_victims_after=sa, monthly_after=monthly,
                       months_until_silent=silent_after,
                       change_pct=(round(100 * (a - b) / b) if b else None))
            claims_stopped = any(c in (op.get("outcome") or "").lower() for c in CLAIMS_STOPPED)
            # Still posting at the end of the window is a disagreement. Winding
            # down to a sustained zero is the claim being right with a tail, and
            # the tail length is the useful number.
            if claims_stopped and silent_after is None:
                brand_dead = "brand dead" in (op.get("outcome") or "").lower()
                rec["verdict"] = "WORTH CHECKING"
                rec["reason"] = (f"Recorded as \"{op.get('outcome')}\", but this brand was still "
                                 f"publishing at the end of the {ap}-month window "
                                 f"({', '.join(str(c) for c in monthly)})."
                                 + (" Note the claim is specifically about the BRAND." if brand_dead else ""))
                flags.append(rec)
            elif claims_stopped and silent_after > 0:
                rec["verdict"] = "CONSISTENT"
                rec["reason"] = (f"Wound down over {silent_after} month(s) and then stopped "
                                 f"({', '.join(str(c) for c in monthly)}). {a} victims were "
                                 f"published during the tail."
                                 + (f" A successor brand published {sa} in the same window." if sa else ""))
            elif claims_stopped:
                rec["verdict"] = "CONSISTENT"
                rec["reason"] = ("Recorded as stopped, and the brand went silent immediately."
                                 + (f" A successor brand published {sa}." if sa else ""))
            else:
                rec["verdict"] = "CONSISTENT"
                rec["reason"] = (f"Outcome does not claim the target stopped. Posting went from "
                                 f"{b} to {a} across the {WINDOW} months either side.")
        results.append(rec)
        print(f"  {rec['date']}  {rec['verdict']:<14} {target[:34]:<35} "
              f"{rec.get('victims_before','-')} -> {rec.get('victims_after','-')}")

    payload = {
        "meta": {
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "sources": ["data/scoreboard.json", "data/measurement/victims-monthly.json"],
            "scoreboard_as_of": board.get("meta", {}).get("asOf"),
            "series_begins": earliest,
            "window_months": WINDOW,
            "operations_checked": len(results),
            "worth_checking": len(flags),
            "measures": "Whether a scored operation's claimed outcome matches later leak-site posting.",
            "why_this_can_mislead": (
                "A dead brand with busy operators is the scoreboard being precise, not wrong, "
                "which is why successor brands are counted separately and never added in. "
                "Victims are often published weeks after the attack, so the month boundary "
                "around an operation is soft. The series begins "
                f"{earliest}, so earlier operations are unverifiable rather than successful. "
                "And leak-site posting is not the same as operating: a group can be active and "
                "quiet, or finished with a site still up. Nothing here overturns a score."
            ),
            "distortion": "Medium",
        },
        "operations": results,
    }
    (OUT / "scoreboard-drift.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, now)
    print(f"\nWrote {OUT/'scoreboard-drift.json'} and {OUT/'HEALTH-scoreboard.txt'}")
    return 0


def write_health(payload, now):
    m, ops = payload["meta"], payload["operations"]
    flags = [o for o in ops if o["verdict"] == "WORTH CHECKING"]
    nc = [o for o in ops if o["verdict"] == "NOT CHECKABLE"]
    ok = [o for o in ops if o["verdict"] == "CONSISTENT"]

    lines = [
        "TAKEDOWN SCOREBOARD DRIFT CHECK - HEALTH REPORT", "",
        "STATUS: OK", "",
        f"Checked              {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Scoreboard as of     {m['scoreboard_as_of']}",
        f"Victim series begins {m['series_begins']}",
        f"Operations checked   {m['operations_checked']}",
        f"Consistent           {len(ok)}",
        f"Worth checking       {len(flags)}",
        f"Not checkable        {len(nc)}",
        "",
        "NOTHING HERE OVERTURNS A SCORE. Scoring is judgment; this is one fact",
        "placed beside it.",
        "",
    ]
    if flags:
        lines.append("Claims worth a second look:")
        for o in flags:
            lines.append(f"   {o['date']}  {o['target'][:30]}")
            lines.append(f"      scored {o['score']}, recorded as \"{o['claimed_outcome']}\"")
            lines.append(f"      {o['reason']}")
            if o.get("successor_victims_after"):
                lines.append(f"      successor brand published {o['successor_victims_after']} "
                             f"in the same window")
            lines.append("")
    if ok:
        lines.append("Consistent with the record:")
        for o in ok:
            tail = o.get("months_until_silent")
            shape = ", ".join(str(c) for c in (o.get("monthly_after") or [])) or "-"
            lines.append(f"   {o['date']}  {o['target'][:26]:<27} "
                         f"{o.get('victims_before','-')} -> {o.get('victims_after','-')}"
                         + (f", silent after {tail}mo" if tail else ""))
            if o.get("monthly_after"):
                lines.append(f"        monthly after: {shape}"
                             + (f"   successor: {o['successor_victims_after']}"
                                if o.get("successor_victims_after") else ""))
        lines.append("")
    if nc:
        lines.append("Cannot be checked, and why. These are NOT successes:")
        for o in nc:
            lines.append(f"   {o['date']}  {o['target'][:30]:<31} {o['reason'][:64]}")
        lines.append("")
    lines += ["READ THIS CAREFULLY:", " " + m["why_this_can_mislead"], "",
              "Nothing to do automatically. This report exists to be read."]
    (OUT / "HEALTH-scoreboard.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
