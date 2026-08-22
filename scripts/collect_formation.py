#!/usr/bin/env python3
"""
MEASUREMENT COLLECTOR - corporate formation agents
===================================================
The third and last Permission Layer node. Asks whether the shell companies
behind tracked hosting providers share the people and addresses that formed them.

WHAT IT MEASURES, AND WHY THAT AND NOT SOMETHING ELSE
------------------------------------------------------
Not who these companies are; the profiles already say that. Whether they SHARE
anything: a registered office, a director, a secretary, a formation date cluster.

A registered office standing behind several of them is a formation agent. An
address used by dozens of unrelated shells is a service, and a service is
reachable by policy in a way an anonymous operator abroad is not. Nobody counts
them, which is why this node has sat unmeasured while being rated on the map.

If they share nothing, that is a real result. It is also the answer the registry
sponsors collector already returned about LIRs: near-total dispersion, no
chokepoint. Two independent nodes giving the same answer would say something
about the shape of this ecosystem that one of them alone cannot.

UK ONLY, AND THAT IS A REAL LIMIT
----------------------------------
Companies House covers UK entities. The tracked shells also sit in Estonia,
Russia, Germany, Israel and Kentucky, each a separate registry with its own
access rules. A provider absent from this measurement is not clean, it is
elsewhere, and the health report says so rather than showing a reassuring zero.

WHY THESE NUMBERS CAN MISLEAD
-----------------------------
1. Shared addresses are usually innocent. Thousands of legitimate companies use
   a formation agent's or accountant's address. Concentration is a prompt to
   look, never evidence of complicity.
2. Officers can be nominees. A name appearing on several boards may be a
   professional director who never knew what the companies did.
3. Dissolved companies keep their records, so a hit here does not mean an active
   entity. Status is reported alongside.
4. Name search is fuzzy. Entries resolved by name rather than number are
   candidates and are labelled as such.

CREDENTIALS
-----------
Needs a free Companies House REST API key, read from COMPANIES_HOUSE_KEY, which
in GitHub Actions comes from the repository secret of that name. Companies House
uses HTTP Basic auth with the key as the username and an empty password. The key
is never written to any output file.

USAGE
-----
    python3 scripts/collect_formation.py

OUTPUT
------
    data/measurement/formation-agents.json
    data/measurement/HEALTH-formation.txt
"""

import base64
import json
import os
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone

API = "https://api.company-information.service.gov.uk"
OUT = pathlib.Path("data/measurement")
CONFIG = OUT / "tracked-companies.json"
UA = "RENO-Observatory-Measurement"
PAUSE = 0.6          # Companies House rate-limits at 600 requests per 5 minutes


def api(path, key):
    """Companies House uses Basic auth: key as username, empty password."""
    token = base64.b64encode(f"{key}:".encode()).decode()
    req = urllib.request.Request(API + path, headers={
        "Authorization": f"Basic {token}", "User-Agent": UA, "Accept": "application/json"})
    for wait in (0, 5, 20):
        if wait:
            time.sleep(wait)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read()), None
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                return None, "unauthorized"
            if e.code == 404:
                return None, "not_found"
            if e.code == 429:
                continue
            return None, f"http_{e.code}"
        except Exception:
            continue
    return None, "unreachable"


def norm_address(a):
    """Registered office as one comparable string. Postcode carries most of the
    signal, so it leads."""
    if not a:
        return ""
    parts = [a.get("postal_code"), a.get("address_line_1"), a.get("locality")]
    s = " ".join(p.strip() for p in parts if p)
    return re.sub(r"\s+", " ", s).upper().strip()


def collect(number, key):
    rec = {"number": number}
    prof, err = api(f"/company/{number}", key)
    if err:
        rec["error"] = err
        return rec
    rec.update(
        company_name=prof.get("company_name"),
        status=prof.get("company_status"),
        type=prof.get("type"),
        incorporated=prof.get("date_of_creation"),
        dissolved=prof.get("date_of_cessation"),
        sic=prof.get("sic_codes") or [],
        registered_office=norm_address(prof.get("registered_office_address")),
    )
    time.sleep(PAUSE)

    off, oerr = api(f"/company/{number}/officers?items_per_page=100", key)
    if not oerr and off:
        rec["officers"] = [{
            "name": o.get("name"),
            "role": o.get("officer_role"),
            "appointed": o.get("appointed_on"),
            "resigned": o.get("resigned_on"),
            "nationality": o.get("nationality"),
            "address": norm_address(o.get("address")),
        } for o in off.get("items", [])]
    else:
        rec["officers"] = []
        rec["officers_error"] = oerr
    return rec


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)
    OUT.mkdir(parents=True, exist_ok=True)

    key = os.environ.get("COMPANIES_HOUSE_KEY", "").strip()
    if not key:
        write_health(None, now, [
            "No COMPANIES_HOUSE_KEY was provided, so nothing could be collected.",
            "In GitHub Actions this comes from the repository secret of that name:",
            "Settings, then Secrets and variables, then Actions.",
            "The key must be a REST API key from developer.company-information.service.gov.uk,",
            "not an HMRC key and not a stream key."])
        print("NO KEY. Nothing collected. See HEALTH-formation.txt")
        return 1

    cfg = json.loads(CONFIG.read_text())
    companies, problems = [], []

    for entry in cfg["companies"]:
        rec = collect(entry["number"], key)
        rec["linked_to"] = entry.get("linked_to")
        rec["profile_name"] = entry.get("name")
        rec["resolved_by"] = "number"
        if entry.get("note"):
            rec["note"] = entry["note"]
        if rec.get("error") == "unauthorized":
            write_health(None, now, [
                "Companies House rejected the key. It may be mistyped, revoked, restricted",
                "by IP address, or issued in the Sandbox environment rather than Live."])
            print("KEY REJECTED. See HEALTH-formation.txt")
            return 1
        if rec.get("error"):
            problems.append(f"{entry['number']} ({entry.get('name')}): {rec['error']}")
            print(f"  {entry['number']:<10} {rec['error']}")
        else:
            print(f"  {entry['number']:<10} {str(rec.get('company_name'))[:38]:<39} "
                  f"{rec.get('status')}, {len(rec.get('officers', []))} officers")
        companies.append(rec)
        time.sleep(PAUSE)

    for entry in cfg.get("search_only", []):
        res, err = api("/search/companies?q=" + urllib.parse.quote(entry["name"]) + "&items_per_page=5", key)
        time.sleep(PAUSE)
        if err or not res or not res.get("items"):
            companies.append({"profile_name": entry["name"], "linked_to": entry.get("linked_to"),
                              "resolved_by": "name", "error": err or "no_match"})
            print(f"  {entry['name'][:34]:<35} no match")
            continue
        top = res["items"][0]
        rec = collect(top.get("company_number"), key)
        rec.update(linked_to=entry.get("linked_to"), profile_name=entry["name"],
                   resolved_by="name",
                   match_confidence="CANDIDATE, matched by name search, not confirmed")
        companies.append(rec)
        print(f"  {entry['name'][:34]:<35} candidate: {str(rec.get('company_name'))[:30]}")
        time.sleep(PAUSE)

    live = [c for c in companies if not c.get("error")]
    addresses, officers = Counter(), Counter()
    addr_members, off_members = defaultdict(list), defaultdict(list)
    for c in live:
        a = c.get("registered_office")
        if a:
            addresses[a] += 1
            addr_members[a].append(c.get("company_name"))
        for o in c.get("officers", []):
            n = (o.get("name") or "").strip().upper()
            if n:
                officers[n] += 1
                off_members[n].append(c.get("company_name"))

    shared_addr = {a: {"count": n, "companies": addr_members[a]}
                   for a, n in addresses.items() if n > 1}
    shared_off = {o: {"count": n, "companies": off_members[o]}
                  for o, n in officers.items() if n > 1}

    payload = {
        "meta": {
            "source": "Companies House REST API (UK)",
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "companies_queried": len(companies),
            "companies_resolved": len(live),
            "shared_addresses": len(shared_addr),
            "shared_officers": len(shared_off),
            "jurisdiction": "United Kingdom only",
            "measures": "Whether the shells behind tracked providers share formation infrastructure.",
            "why_this_can_mislead": (
                "Shared addresses are usually innocent: thousands of legitimate companies use a "
                "formation agent's or accountant's address, so concentration is a prompt to look "
                "and never evidence of complicity. Officers may be nominees who never knew what "
                "the companies did. Dissolved companies keep their records, so a hit is not "
                "proof of an active entity. Entries resolved by name search are candidates, not "
                "confirmations. And this is UK only: a provider absent here is not clean, it is "
                "registered somewhere this does not reach."
            ),
            "distortion": "Medium",
        },
        "shared_registered_offices": shared_addr,
        "shared_officers": shared_off,
        "companies": companies,
    }
    (OUT / "formation-agents.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, now, problems)
    print(f"\n  {len(shared_addr)} shared address(es), {len(shared_off)} shared officer(s)")
    print(f"Wrote {OUT/'formation-agents.json'} and {OUT/'HEALTH-formation.txt'}")
    return 0


def write_health(payload, now, problems):
    if payload is None:
        lines = ["CORPORATE FORMATION AGENTS - HEALTH REPORT", "", "STATUS: BROKEN", "",
                 f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC", "",
                 "WHAT IS WRONG:"] + [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
        (OUT / "HEALTH-formation.txt").write_text("\n".join(lines) + "\n")
        return

    m = payload["meta"]
    status = "STALE" if problems else "OK"
    lines = [
        "CORPORATE FORMATION AGENTS - HEALTH REPORT", "",
        f"STATUS: {status}", "",
        f"Checked              {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Jurisdiction         {m['jurisdiction']}",
        f"Companies queried    {m['companies_queried']}",
        f"Resolved             {m['companies_resolved']}",
        "",
    ]
    for c in payload["companies"]:
        if c.get("error"):
            lines.append(f"   {str(c.get('profile_name'))[:34]:<35} could not resolve ({c['error']})")
        else:
            cand = "  CANDIDATE" if c.get("resolved_by") == "name" else ""
            lines.append(f"   {str(c.get('company_name'))[:34]:<35} {c.get('status','?'):<10} "
                         f"inc {c.get('incorporated','?')}{cand}")
    lines.append("")

    sa, so = payload["shared_registered_offices"], payload["shared_officers"]
    if sa:
        lines.append("Registered offices used by more than one tracked company:")
        for a, d in sorted(sa.items(), key=lambda kv: -kv[1]["count"]):
            lines.append(f"   {d['count']} companies   {a[:58]}")
            for n in d["companies"]:
                lines.append(f"                 {str(n)[:54]}")
        lines.append("")
    else:
        lines.append("No registered office is shared by more than one tracked company.")
        lines.append("")
    if so:
        lines.append("Officers appearing at more than one tracked company:")
        for o, d in sorted(so.items(), key=lambda kv: -kv[1]["count"]):
            lines.append(f"   {d['count']} companies   {o[:52]}")
        lines.append("")
    else:
        lines.append("No officer appears at more than one tracked company.")
        lines.append("")

    lines += ["A shared address or director is a PROMPT TO LOOK, never a finding. Formation",
              "agents and accountants host thousands of legitimate companies at one address.",
              "",
              "READ THESE NUMBERS CAREFULLY:", " " + m["why_this_can_mislead"], ""]
    if problems:
        lines.append("WHAT IS WRONG:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
    else:
        lines.append("Nothing to do. Collection is healthy.")
    (OUT / "HEALTH-formation.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
