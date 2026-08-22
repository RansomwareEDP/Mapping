#!/usr/bin/env python3
"""
MEASUREMENT COLLECTOR - crypters and packers
=============================================
Measures which obfuscation wrappers are appearing on malware samples, and how
that mix changes over time.

WHAT THIS DOES AND DOES NOT MEASURE
-----------------------------------
It measures the TOOL. It does not measure the BUSINESS.

There is no public source for crypter pricing, revenue, customer counts, or
whether a given wrapper is sold as a service or shared privately. None of that
is here and none of it is coming from this source. What is here is which
wrappers show up on samples, how often, and when a new one appears.

THE CAP, WHICH IS THE MOST IMPORTANT THING ON THIS PAGE
-------------------------------------------------------
The API returns at most 1,000 samples per tag, newest first. For a popular
wrapper that is a window on recent activity, NOT a count.

This is precisely the failure that silently broke the desktop victim collector:
a capped feed that returns success every time while quietly omitting most of
the data. It looked healthy for six months.

So: any tag that returns exactly 1,000 is marked truncated, its monthly figures
are recorded as FLOORS rather than counts, and the health report says so. A
truncated series can show which months a wrapper was active. It cannot support
"usage rose" or "usage fell". Do not let anyone read it that way.

WHY THESE NUMBERS CAN MISLEAD, BEYOND THE CAP
---------------------------------------------
1. This counts what gets SUBMITTED to MalwareBazaar. Submission volume shifts
   when a large contributor joins or leaves, which moves every count without
   anything real changing.
2. A wrapper is invisible until somebody writes a tag or rule for it. So
   "time until a new crypter appears after a takedown" is dominated by analyst
   attention, not by adversary behaviour. That metric is the WEAKEST one this
   source can produce, despite being the most interesting to ask for.
3. Commodity protectors (Themida, VMProtect, UPX) are sold legitimately and
   used by ordinary software. They are reported separately and must never be
   totalled with the rest.

Distortion: HIGH. Read direction and presence, never magnitude.

CREDENTIALS
-----------
Needs an abuse.ch Auth-Key, free from the abuse.ch Authentication Portal.
Read from the ABUSECH_AUTH_KEY environment variable, which in GitHub Actions
comes from the repository secret of the same name. The key is never written to
any output file.

USAGE
-----
    python3 scripts/collect_crypters.py
    python3 scripts/collect_crypters.py --discover    # list tags actually in use

OUTPUT
------
    data/measurement/crypter-usage.json
    data/measurement/HEALTH-crypters.txt
"""

import json
import os
import pathlib
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone

API = "https://mb-api.abuse.ch/api/v1/"
OUT = pathlib.Path("data/measurement")
CONFIG = OUT / "crypter-tags.json"
UA = "RENO-Observatory-Measurement"
LIMIT = 1000               # the API maximum; hitting it exactly means truncated
PAUSE = 1.5


def api(fields, key):
    """POST form data to MalwareBazaar. Returns (payload, error_string)."""
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(API, data=data, headers={
        "Auth-Key": key, "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded"})
    for wait in (0, 5, 20):
        if wait:
            time.sleep(wait)
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.loads(r.read()), None
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                return None, "unauthorized"          # no point retrying a bad key
            continue
        except Exception:
            continue
    return None, "unreachable"


def month_of(sample):
    d = sample.get("first_seen") or sample.get("last_seen") or ""
    return d[:7] if len(d) >= 7 else ""


def collect_tag(tag, key):
    payload, err = api({"query": "get_taginfo", "tag": tag, "limit": LIMIT}, key)
    if err:
        return {"error": err}
    status = payload.get("query_status", "")
    if status != "ok":
        # no_results is a real answer: the tag exists but nothing matches, or
        # the tag is not one MalwareBazaar uses. Both are worth recording.
        return {"query_status": status, "samples": 0, "by_month": {}}

    data = payload.get("data") or []
    by_month, sigs = Counter(), Counter()
    for s in data:
        m = month_of(s)
        if m:
            by_month[m] += 1
        sig = (s.get("signature") or "").strip()
        if sig:
            sigs[sig] += 1

    truncated = len(data) >= LIMIT
    return {
        "query_status": status,
        "samples": len(data),
        "truncated": truncated,
        "oldest_seen": min(by_month) if by_month else "",
        "newest_seen": max(by_month) if by_month else "",
        "by_month": dict(sorted(by_month.items())),
        "top_families": dict(sigs.most_common(12)),
    }


def discover(key):
    """
    List the tags MalwareBazaar is actually applying, so the seed list can be
    replaced with reality instead of guesswork.

    Writes a file as well as printing. Anything that only reaches a build log
    has to be copied out by hand, which is a step that gets skipped.
    """
    payload, err = api({"query": "get_recent", "selector": "100"}, key)
    if err or not payload or payload.get("query_status") != "ok":
        reason = err or payload.get("query_status") if payload else err
        print(f"DISCOVERY FAILED: {reason}")
        (OUT / "crypter-tags-discovered.json").write_text(json.dumps(
            {"error": str(reason), "checked": datetime.now(timezone.utc)
             .strftime("%Y-%m-%dT%H:%M:%SZ")}, indent=1))
        return 1

    # Accumulate across runs. One call sees at most 100 recent submissions, which
    # is both tiny and skewed: the 22 Aug 2026 sample was 58 percent ELF/Mirai and
    # showed none of the commercial protectors the collector was finding hundreds
    # of. Merging each daily run builds a real vocabulary over weeks, for free.
    prior_path = OUT / "crypter-tags-discovered.json"
    tags, types, sigs = Counter(), Counter(), Counter()
    runs, prior_samples = 0, 0
    if prior_path.exists():
        try:
            prior = json.loads(prior_path.read_text())
            tags.update(prior.get("tags") or {})
            types.update(prior.get("file_types") or {})
            sigs.update(prior.get("signatures") or {})
            runs = prior.get("runs_merged", 1)
            prior_samples = prior.get("samples_examined", 0)
        except (json.JSONDecodeError, ValueError):
            pass

    samples = payload.get("data") or []
    for smp in samples:
        for t in (smp.get("tags") or []):
            tags[t] += 1
        if smp.get("file_type"):
            types[smp["file_type"]] += 1
        if smp.get("signature"):
            sigs[smp["signature"]] += 1

    (OUT / "crypter-tags-discovered.json").write_text(json.dumps({
        "checked": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "note": ("Tags MalwareBazaar applied, accumulated across every run of this step. "
                 "Any single run sees at most 100 recent submissions and is heavily skewed "
                 "by whatever was being submitted that hour, so counts here show which tag "
                 "names EXIST, never how common a wrapper is. Use it to find names for "
                 "crypter-tags.json; use the collector itself for volume."),
        "runs_merged": runs + 1,
        "samples_examined": prior_samples + len(samples),
        "samples_this_run": len(samples),
        "distinct_tags": len(tags),
        "tags": dict(tags.most_common()),
        "file_types": dict(types.most_common()),
        "signatures": dict(sigs.most_common()),
    }, indent=1))

    print(f"{len(samples)} new submissions this run; {prior_samples + len(samples)} total "
          f"across {runs + 1} runs. {len(tags)} distinct tags seen:\n")
    for t, n in tags.most_common(60):
        print(f"   {n:>4}  {t}")
    print(f"\nFile types: {dict(types.most_common(10))}")
    print(f"\nWrote {OUT/'crypter-tags-discovered.json'}")
    return 0


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)
    OUT.mkdir(parents=True, exist_ok=True)

    key = os.environ.get("ABUSECH_AUTH_KEY", "").strip()
    if not key:
        write_health(None, now, [
            "No ABUSECH_AUTH_KEY was provided, so nothing could be collected.",
            "In GitHub Actions this comes from the repository secret of that name:",
            "Settings, then Secrets and variables, then Actions."])
        print("NO KEY. Nothing collected. See HEALTH-crypters.txt")
        return 1

    if "--discover" in sys.argv:
        return discover(key)

    cfg = json.loads(CONFIG.read_text())
    results, problems = {}, []
    truncated, unauthorized, dead_tags = [], False, []

    for entry in cfg["tags"]:
        tag = entry["tag"]
        r = collect_tag(tag, key)
        r["commodity"] = entry.get("commodity", False)
        r["note"] = entry.get("note", "")
        results[tag] = r
        if r.get("error") == "unauthorized":
            unauthorized = True
            print(f"  {tag:<16} REJECTED - the key was not accepted")
        elif r.get("error"):
            problems.append(f"{tag}: {r['error']}")
            print(f"  {tag:<16} {r['error']}")
        elif r.get("samples", 0) == 0:
            dead_tags.append(tag)
            print(f"  {tag:<16} no results ({r.get('query_status')})")
        else:
            mark = "  TRUNCATED at the 1,000 cap" if r.get("truncated") else ""
            if r.get("truncated"):
                truncated.append(tag)
            print(f"  {tag:<16} {r['samples']:>5} samples  "
                  f"{r['oldest_seen']} to {r['newest_seen']}{mark}")
        time.sleep(PAUSE)

    if unauthorized:
        write_health(None, now, [
            "MalwareBazaar rejected the Auth-Key. It may be mistyped, revoked, or",
            "stored under a different secret name. Confirm the repository secret is",
            "named exactly ABUSECH_AUTH_KEY and holds the key from abuse.ch."])
        return 1

    live = {t: r for t, r in results.items() if r.get("samples", 0) > 0}
    criminal = {t: r for t, r in live.items() if not r["commodity"]}

    payload = {
        "meta": {
            "source": "MalwareBazaar (abuse.ch) API, free account required",
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "tags_queried": len(results),
            "tags_returning_data": len(live),
            "tags_truncated": truncated,
            "sample_cap": LIMIT,
            "measures": "Which obfuscation wrappers appear on submitted malware samples.",
            "does_not_measure": ("Crypter pricing, revenue, customer counts, or whether a "
                                 "wrapper is sold as a service. No public source carries these."),
            "why_this_can_mislead": (
                f"The API returns at most {LIMIT} samples per tag, newest first, so any tag "
                "marked truncated yields FLOORS, not counts, and cannot support a claim that "
                "usage rose or fell. Counts also track what gets submitted to MalwareBazaar, "
                "which shifts when a large contributor joins or leaves. And a wrapper is "
                "invisible until somebody writes a tag for it, so time-to-appearance after a "
                "takedown measures analyst attention more than adversary behaviour. Commodity "
                "protectors are reported separately and must never be totalled with the rest."
            ),
            "distortion": "High",
        },
        "commodity_protectors": {t: r for t, r in live.items() if r["commodity"]},
        "criminal_wrappers": criminal,
        "tags_returning_nothing": dead_tags,
    }
    (OUT / "crypter-usage.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, now, problems)
    print(f"\nWrote {OUT/'crypter-usage.json'} and {OUT/'HEALTH-crypters.txt'}")
    return 0


def write_health(payload, now, problems):
    if payload is None:
        lines = ["CRYPTERS AND PACKERS - HEALTH REPORT", "", "STATUS: BROKEN", "",
                 f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC", "",
                 "WHAT IS WRONG:"] + [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session and say",
                  "'the crypter health file says this'."]
        (OUT / "HEALTH-crypters.txt").write_text("\n".join(lines) + "\n")
        return

    meta = payload["meta"]
    crim, comm = payload["criminal_wrappers"], payload["commodity_protectors"]
    trunc = meta["tags_truncated"]

    status = "STALE" if problems else ("OK" if meta["tags_returning_data"] else "STALE")
    if not meta["tags_returning_data"]:
        problems.append("No tag returned any samples. The seed tag list is probably wrong. "
                        "Run: python3 scripts/collect_crypters.py --discover")

    lines = [
        "CRYPTERS AND PACKERS - HEALTH REPORT", "",
        f"STATUS: {status}", "",
        f"Checked              {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Tags queried         {meta['tags_queried']}",
        f"Tags with data       {meta['tags_returning_data']}",
        f"Tags truncated       {len(trunc)}  (hit the {meta['sample_cap']:,} sample cap)",
        "",
    ]
    if crim:
        lines += ["Wrappers associated with criminal use:",
                  "   tag                samples   period            "]
        for t, r in sorted(crim.items(), key=lambda kv: -kv[1]["samples"]):
            flag = "  FLOOR ONLY" if r.get("truncated") else ""
            lines.append(f"   {t:<18} {r['samples']:>6}   "
                         f"{r['oldest_seen']} to {r['newest_seen']}{flag}")
        lines.append("")
    if comm:
        lines += ["Commodity protectors, sold legitimately. NOT criminal infrastructure:"]
        for t, r in sorted(comm.items(), key=lambda kv: -kv[1]["samples"]):
            flag = "  FLOOR ONLY" if r.get("truncated") else ""
            lines.append(f"   {t:<18} {r['samples']:>6}{flag}")
        lines.append("")
    if payload["tags_returning_nothing"]:
        lines += ["Tags that returned nothing. Either MalwareBazaar does not use these names,",
                  "or nothing currently matches. Worth replacing via --discover:",
                  "   " + ", ".join(payload["tags_returning_nothing"]), ""]
    if trunc:
        lines += ["TRUNCATION WARNING:",
                  f" These tags hit the {meta['sample_cap']:,} sample cap: {', '.join(trunc)}.",
                  " Their monthly figures are FLOORS, not counts. They can show that a wrapper",
                  " was active in a month. They CANNOT show that its use rose or fell.", ""]

    lines += ["WHAT THIS DOES NOT MEASURE:", " " + meta["does_not_measure"], "",
              "READ THESE NUMBERS CAREFULLY:", " " + meta["why_this_can_mislead"], ""]
    if problems:
        lines.append("WHAT IS WRONG:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
    else:
        lines.append("Nothing to do. Collection is healthy.")
    (OUT / "HEALTH-crypters.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
