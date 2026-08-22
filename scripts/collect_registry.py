#!/usr/bin/env python3
"""
MEASUREMENT COLLECTOR - registries and sponsoring LIRs
=======================================================
Measures who vouches for the ecosystem's networks at the registry, and whether
that changes after an enforcement action.

WHY THIS EXISTS
---------------
Registries and Sponsoring LIRs is a Permission Layer node rated HIGH on the
ecosystem map, and nothing measures it. Every AS number on the internet is
allocated by a regional registry and, in the RIPE region, sponsored by a Local
Internet Registry that is accountable for it. Those records are published.

An operator cannot route without a registry entry. Someone has to sponsor it.
That someone is reachable by policy in a way the operator is not, and nobody
is counting them.

WHAT IT MEASURES
----------------
  registered      does a registry object still exist for this network
  organisation    the org the resource is assigned to
  sponsor         the maintainer identifying the LIR standing behind it
  last_modified   when the registry record last changed
  concentration   how many networks each LIR sponsors across the whole set

A record going away is de-registration. A record changing after a designation
is a sponsor moving, dropping, or renaming a client. Both are observable, dated,
and free.

WHY THESE NUMBERS CAN MISLEAD
-----------------------------
1. last_modified moves for trivial reasons. A contact email correction and a
   change of sponsor look identical in that field. Treat it as a prompt to look,
   never as evidence on its own.
2. Maintainer names are a strong hint at the sponsoring LIR, not a formal
   declaration of one. RIPE publishes sponsoring-org on some object types and
   not others.
3. Only the RIPE region is covered here. A network registered with ARIN, APNIC,
   AFRINIC or LACNIC returns nothing and is reported as out of region, NOT as
   de-registered. Confusing those two would invent takedowns that never happened.

SOURCE
------
RIPE Database REST API. Public, keyless, free.

USAGE
-----
    python3 scripts/collect_registry.py

OUTPUT
------
    data/measurement/registry-sponsors.json
    data/measurement/HEALTH-registry.txt
"""

import json
import pathlib
import subprocess
import sys
import time
import urllib.request
from collections import Counter
from datetime import datetime, timezone

RIPE = "https://rest.db.ripe.net/ripe"
OUT = pathlib.Path("data/measurement")
CONFIG = OUT / "tracked-networks.json"
UA = "RENO-Observatory-Measurement"
PAUSE = 0.5

# Maintainers operated by RIPE NCC itself. Present on every assigned object, so
# they identify nothing about who sponsors the resource.
GENERIC_MNT = {"RIPE-NCC-END-MNT", "RIPE-NCC-HM-MNT", "RIPE-NCC-LEGACY-MNT"}


def get(path):
    url = f"{RIPE}/{path}"
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": UA})
    for wait in (0, 4, 15):
        if wait:
            time.sleep(wait)
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read()), None
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None, "not_found"      # a real answer, not a failure
            continue
        except Exception:
            out = subprocess.run(["curl", "-s", "--max-time", "45", "-H", "Accept: application/json",
                                  "-H", f"User-Agent: {UA}", "-w", "\n%{http_code}", url],
                                 capture_output=True, text=True)
            body, _, code = out.stdout.rpartition("\n")
            if code.strip() == "404":
                return None, "not_found"
            if code.strip() == "200" and body.strip():
                try:
                    return json.loads(body), None
                except json.JSONDecodeError:
                    pass
    return None, "unreachable"


def attrs(payload):
    out = {}
    for a in payload["objects"]["object"][0]["attributes"]["attribute"]:
        out.setdefault(a["name"], []).append(a["value"])
    return out


def org_name(org_id, cache):
    if org_id in cache:
        return cache[org_id]
    payload, err = get(f"organisation/{org_id}.json")
    name = ""
    if payload and not err:
        try:
            name = attrs(payload).get("org-name", [""])[0]
        except (KeyError, IndexError):
            name = ""
    cache[org_id] = name
    time.sleep(PAUSE)
    return name


def collect(asn, cache):
    rec = {"asn": asn}
    payload, err = get(f"aut-num/AS{asn}.json")
    if err == "not_found":
        rec["registered"] = False
        rec["note"] = "No registry object in RIPE. Either de-registered, or registered outside the RIPE region."
        return rec
    if err or not payload:
        rec["error"] = "registry unreachable"
        return rec

    a = attrs(payload)
    rec["registered"] = True
    rec["as_name"] = a.get("as-name", [""])[0]
    rec["status"] = a.get("status", [""])[0]
    rec["created"] = a.get("created", [""])[0][:10]
    rec["last_modified"] = a.get("last-modified", [""])[0][:10]
    rec["country"] = a.get("country", [""])[0]

    org_id = a.get("org", [""])[0]
    rec["org_id"] = org_id
    rec["org_name"] = org_name(org_id, cache) if org_id else ""

    mnts = [m for m in a.get("mnt-by", []) if m.upper() not in GENERIC_MNT]
    rec["maintainers"] = mnts
    # The LIR-operated maintainer is the closest public marker of who sponsors
    # the resource. Prefer an explicit lir- prefix where one exists.
    lir = next((m for m in mnts if m.lower().startswith("lir-")), "")
    rec["sponsor_hint"] = lir or (mnts[0] if mnts else "")
    return rec


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)
    cfg = json.loads(CONFIG.read_text())

    cache, results, failures = {}, {}, []
    sponsors, orgs = Counter(), Counter()

    for slug, prov in cfg["providers"].items():
        recs = []
        for bucket in ("measured", "successor", "sibling"):
            for n in prov.get(bucket, []):
                r = collect(n["asn"], cache)
                r["confidence"] = bucket
                if r.get("error"):
                    failures.append(f"AS{n['asn']}")
                elif r.get("registered"):
                    if r["sponsor_hint"]:
                        sponsors[r["sponsor_hint"]] += 1
                    if r["org_name"]:
                        orgs[r["org_name"]] += 1
                recs.append(r)
                time.sleep(PAUSE)
        reg = [r for r in recs if r.get("registered")]
        results[slug] = {
            "name": prov["name"],
            "designated": prov.get("designated", False),
            "networks": len(recs),
            "registered": len(reg),
            "gone_or_out_of_region": len([r for r in recs if r.get("registered") is False]),
            "distinct_sponsors": len({r["sponsor_hint"] for r in reg if r["sponsor_hint"]}),
            "records": recs,
        }
        print(f"  {prov['name'][:26]:<27} {len(reg):>2} registered / {len(recs):>2} networks, "
              f"{results[slug]['distinct_sponsors']:>2} sponsors")

    payload = {
        "meta": {
            "source": "RIPE Database REST API, public and keyless",
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "networks_checked": sum(p["networks"] for p in results.values()),
            "registered": sum(p["registered"] for p in results.values()),
            "distinct_sponsors": len(sponsors),
            "measures": "Who vouches for these networks at the registry, and when that last changed.",
            "why_this_can_mislead": (
                "last_modified moves for trivial reasons; a contact correction and a change of "
                "sponsor look identical. Maintainer names indicate the sponsoring LIR, they do "
                "not formally declare it. Only the RIPE region is covered: a network held by "
                "ARIN, APNIC, AFRINIC or LACNIC reports as out of region, which is NOT the same "
                "as de-registered, and reading it as such would invent takedowns."
            ),
            "distortion": "Medium",
        },
        "sponsor_concentration": dict(sponsors.most_common()),
        "organisation_concentration": dict(orgs.most_common()),
        "providers": results,
    }
    (OUT / "registry-sponsors.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, failures, now)
    print(f"\nWrote {OUT/'registry-sponsors.json'} and {OUT/'HEALTH-registry.txt'}")
    return 0


def write_health(payload, failures, now):
    meta, provs = payload["meta"], payload["providers"]
    problems = []
    if failures:
        problems.append(f"Could not reach the registry for {len(failures)} networks: "
                        f"{', '.join(failures[:8])}.")
    if meta["registered"] == 0:
        problems.append("No network returned a registry object at all. Far more likely a problem "
                        "with the source than a real event.")

    status = "BROKEN" if meta["registered"] == 0 else ("STALE" if problems else "OK")
    lines = [
        "REGISTRIES AND SPONSORING LIRs - HEALTH REPORT", "",
        f"STATUS: {status}", "",
        f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Networks checked   {meta['networks_checked']}",
        f"With a record      {meta['registered']}",
        f"Distinct sponsors  {meta['distinct_sponsors']}",
        "",
        "By provider:",
        "   provider                    records   gone   sponsors",
    ]
    for slug, p in sorted(provs.items(), key=lambda kv: -kv[1]["registered"]):
        mark = " *" if p["designated"] else "  "
        lines.append(f"  {mark}{p['name'][:24]:<25} {p['registered']:>5}   "
                     f"{p['gone_or_out_of_region']:>4}   {p['distinct_sponsors']:>8}")
    lines += ["", "   * = under a public sanctions or enforcement action", ""]

    conc = payload["sponsor_concentration"]
    if conc:
        multi = [(k, v) for k, v in conc.items() if v > 1]
        lines.append("Sponsors standing behind more than one tracked network:")
        if multi:
            for k, v in multi[:12]:
                lines.append(f"   {v:>2} networks   {k[:52]}")
        else:
            lines.append("   None. Every network has its own sponsor.")
        lines.append("")

    recent = sorted(
        [(r["last_modified"], r["asn"], p["name"]) for p in provs.values()
         for r in p["records"] if r.get("last_modified")], reverse=True)[:8]
    if recent:
        lines.append("Registry records changed most recently:")
        for d, asn, name in recent:
            lines.append(f"   {d}   AS{asn:<8} {name[:30]}")
        lines += ["", "A record changing after a designation is worth a look. It is not evidence",
                  "on its own: this field also moves for contact and address corrections.", ""]

    lines += ["READ THESE NUMBERS CAREFULLY:", " " + meta["why_this_can_mislead"], ""]
    if problems:
        lines.append("WHAT IS WRONG:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
    else:
        lines.append("Nothing to do. Collection is healthy.")
    (OUT / "HEALTH-registry.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
