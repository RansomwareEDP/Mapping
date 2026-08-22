#!/usr/bin/env python3
"""
MEASUREMENT COLLECTOR - live threat infrastructure on tracked networks
=======================================================================
Joins two things that already exist and have never been put together: the
networks belonging to tracked hosting providers, and the malware infrastructure
currently reported as live on the internet.

WHAT THIS ADDS
--------------
Every other measurement of bulletproof hosting here asks whether a provider
still EXISTS: is it routing, who carries it, is it registered. None of them ask
whether it is being USED.

This does. If botnet command servers and malware distribution sit inside a
tracked provider's address space today, that provider is not merely alive, it is
working. A provider that keeps routing while the malware on it goes to zero is a
different outcome from one that keeps both, and no current metric separates them.

It also gives the Loaders and Botnets node its first number: how many live
command servers are reported, by malware family.

SOURCES
-------
  ThreatFox (abuse.ch)  live indicators, principally botnet command servers
  URLhaus (abuse.ch)    URLs actively distributing malware
  RIPEstat              which address ranges each tracked network announces
All three are public, keyless and free.

COMPROMISED HOSTS ARE SEPARATED, WHICH MATTERS
-----------------------------------------------
ThreatFox marks whether an indicator sits on a compromised machine. A hacked
server at a legitimate hosting company is a VICTIM. A server rented from a
bulletproof host is INVENTORY. Counting them together would make ordinary
providers look complicit and let real ones hide in the average, so they are
counted apart and never totalled.

WHY THESE NUMBERS CAN MISLEAD
-----------------------------
1. Absence is not innocence. Zero indicators means nothing was REPORTED on that
   network, not that nothing is there. Reporting is uneven and volunteer-driven.
2. The source exports are a rolling recent window, so a single run is a snapshot.
   Counts accumulate across runs, and the run count is published alongside.
3. Address space moves. A prefix inside a tracked network today may belong to
   someone else next month, which is itself worth watching but corrupts any
   naive comparison over time.
4. Presence on a network is not proof the provider knew. It is a prompt to look
   at abuse response, which is the thing that actually distinguishes a
   bulletproof host from a careless one.

Distortion: Medium. Read presence and direction, not precise volume.

USAGE
-----
    python3 scripts/collect_hosted_threats.py

OUTPUT
------
    data/measurement/hosted-threats.json
    data/measurement/HEALTH-threats.txt
"""

import ipaddress
import json
import pathlib
import subprocess
import sys
import time
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone

THREATFOX = "https://threatfox.abuse.ch/export/json/recent/"
URLHAUS = "https://urlhaus.abuse.ch/downloads/json_recent/"
RIPESTAT = "https://stat.ripe.net/data/announced-prefixes/data.json?resource=AS{}"
OUT = pathlib.Path("data/measurement")
CONFIG = OUT / "tracked-networks.json"
UA = "RENO-Observatory-Measurement"
PAUSE = 1.0


def get_json(url, label):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    for wait in (0, 5, 20):
        if wait:
            time.sleep(wait)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        except Exception:
            out = subprocess.run(["curl", "-s", "--max-time", "120", "-H", f"User-Agent: {UA}", url],
                                 capture_output=True, text=True)
            if out.returncode == 0 and out.stdout.strip():
                try:
                    return json.loads(out.stdout)
                except json.JSONDecodeError:
                    pass
    print(f"  {label}: could not be downloaded")
    return None


def ip_of(value):
    """Pull an address out of the shapes these feeds use: bare ip, ip:port, url."""
    v = (value or "").strip()
    if v.startswith(("http://", "https://")):
        v = v.split("://", 1)[1].split("/", 1)[0]
    if v.startswith("["):                      # bracketed IPv6, optional port
        v = v[1:].split("]", 1)[0]
    elif v.count(":") == 1:                    # ipv4:port
        v = v.split(":", 1)[0]
    v = v.split("/", 1)[0]
    try:
        return ipaddress.ip_address(v)
    except ValueError:
        return None


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)
    OUT.mkdir(parents=True, exist_ok=True)

    cfg = json.loads(CONFIG.read_text())
    targets = []
    for slug, prov in cfg["providers"].items():
        for bucket in ("measured", "successor", "sibling"):
            for n in prov.get(bucket, []):
                targets.append((slug, prov["name"], n["asn"], bucket))

    # Address space per tracked network. Only networks still announcing routes
    # can host anything, so a dark one legitimately contributes nothing here.
    nets, prefix_owner, failed = [], {}, []
    for slug, name, asn, bucket in targets:
        d = get_json(RIPESTAT.format(asn), f"AS{asn} prefixes")
        if not d or d.get("status") != "ok":
            failed.append(f"AS{asn}")
            continue
        for p in d.get("data", {}).get("prefixes", []):
            try:
                net = ipaddress.ip_network(p["prefix"], strict=False)
            except ValueError:
                continue
            nets.append(net)
            prefix_owner[net] = (slug, name, asn, bucket)
        time.sleep(PAUSE)
    print(f"  tracked address space: {len(nets)} prefixes across "
          f"{len(targets) - len(failed)} networks")

    tf = get_json(THREATFOX, "ThreatFox")
    uh = get_json(URLHAUS, "URLhaus")
    if tf is None and uh is None:
        write_health(None, now, ["Neither ThreatFox nor URLhaus could be downloaded."])
        return 1

    indicators = []
    if tf:
        for group in tf.values():
            for v in group:
                indicators.append({
                    "src": "threatfox", "value": v.get("ioc_value"),
                    "malware": v.get("malware_printable") or v.get("malware") or "unknown",
                    "threat_type": v.get("threat_type"),
                    "compromised": bool(v.get("is_compromised")),
                    "first_seen": (v.get("first_seen_utc") or "")[:10]})
    if uh:
        rows = uh.values() if isinstance(uh, dict) else []
        for group in rows:
            for v in group:
                indicators.append({
                    "src": "urlhaus", "value": v.get("url"),
                    "malware": ", ".join(v.get("tags") or []) or "unknown",
                    "threat_type": "malware_distribution",
                    "compromised": False,
                    "first_seen": (v.get("dateadded") or "")[:10]})
    print(f"  indicators to check: {len(indicators)}")

    by_provider = defaultdict(lambda: {"inventory": [], "compromised": []})
    families, types = Counter(), Counter()
    for ind in indicators:
        ip = ip_of(ind["value"])
        if ip is None:
            continue
        for net in nets:
            if ip.version == net.version and ip in net:
                slug, name, asn, bucket = prefix_owner[net]
                rec = {"value": ind["value"], "malware": ind["malware"],
                       "threat_type": ind["threat_type"], "asn": asn,
                       "confidence": bucket, "first_seen": ind["first_seen"],
                       "source": ind["src"]}
                by_provider[slug]["compromised" if ind["compromised"] else "inventory"].append(rec)
                if not ind["compromised"]:
                    families[ind["malware"]] += 1
                types[ind["threat_type"]] += 1
                break

    # Ecosystem-wide botnet C2 counts, which stand on their own for the
    # Loaders and Botnets node whether or not anything lands on tracked space.
    c2_all = Counter(i["malware"] for i in indicators
                     if i["threat_type"] == "botnet_cc" and not i["compromised"])

    prior = {}
    hp = OUT / "hosted-threats.json"
    if hp.exists():
        try:
            prior = json.loads(hp.read_text())
        except (json.JSONDecodeError, ValueError):
            prior = {}
    runs = (prior.get("meta", {}).get("runs", 0)) + 1

    providers = {}
    for slug, prov in cfg["providers"].items():
        hits = by_provider.get(slug, {"inventory": [], "compromised": []})
        inv = hits["inventory"]
        # Split by confidence. A hit on a network the profile only records as
        # ADJACENT is not evidence about the provider, and folding it into one
        # total inflates them: 43 of Virtualine's first run sat on AS205759,
        # which its own profile states is "NOT confirmed Virtualine-owned".
        by_conf = Counter(h["confidence"] for h in inv)
        providers[slug] = {
            "name": prov["name"], "designated": prov.get("designated", False),
            "indicators_confirmed_own": by_conf.get("measured", 0),
            "indicators_on_successor": by_conf.get("successor", 0),
            "indicators_on_sibling": by_conf.get("sibling", 0),
            "indicators_on_compromised_hosts": len(hits["compromised"]),
            "by_network": dict(Counter(f"AS{h['asn']} ({h['confidence']})" for h in inv).most_common()),
            "malware_families": dict(Counter(h["malware"] for h in inv
                                             if h["confidence"] == "measured").most_common()),
            "indicators": inv[:200],
        }

    payload = {
        "meta": {
            "sources": ["ThreatFox (abuse.ch)", "URLhaus (abuse.ch)", "RIPEstat"],
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "runs": runs,
            "prefixes_checked": len(nets),
            "networks_unreadable": failed,
            "indicators_examined": len(indicators),
            "indicators_on_confirmed_networks": sum(p["indicators_confirmed_own"] for p in providers.values()),
            "indicators_on_adjacent_networks": sum(p["indicators_on_sibling"] + p["indicators_on_successor"]
                                                   for p in providers.values()),
            "measures": "Whether tracked hosting providers are currently carrying live malware infrastructure.",
            "why_this_can_mislead": (
                "Absence is not innocence: zero means nothing was REPORTED on that network, and "
                "reporting is uneven and volunteer-driven. The source exports cover a recent "
                "rolling window, so one run is a snapshot rather than a series. Address space "
                "changes hands, so a prefix inside a tracked network today may not be tomorrow. "
                "And presence is not proof the provider knew: it is a reason to look at abuse "
                "response, which is what separates a bulletproof host from a careless one. "
                "Indicators on compromised machines are counted separately and must never be "
                "added to the rest, because a hacked server is a victim, not inventory. Hits on "
                "sibling and successor networks are also kept apart: those are networks a profile "
                "records as adjacent without establishing ownership, so counting them against a "
                "provider asserts an attribution the research did not make."
            ),
            "distortion": "Medium",
        },
        "ecosystem_botnet_c2_by_family": dict(c2_all.most_common(40)),
        "indicator_types_on_tracked_space": dict(types.most_common()),
        "malware_families_on_tracked_space": dict(families.most_common(40)),
        "providers": providers,
    }
    hp.write_text(json.dumps(payload, indent=1))
    write_health(payload, now, [])

    for slug, p in sorted(providers.items(), key=lambda kv: -kv[1]["indicators_confirmed_own"]):
        if any(p[k] for k in ("indicators_confirmed_own", "indicators_on_sibling",
                              "indicators_on_successor", "indicators_on_compromised_hosts")):
            print(f"  {p['name'][:28]:<29} {p['indicators_confirmed_own']:>4} confirmed own, "
                  f"{p['indicators_on_sibling'] + p['indicators_on_successor']:>4} adjacent, "
                  f"{p['indicators_on_compromised_hosts']:>3} compromised")
    print(f"\nWrote {hp} and {OUT/'HEALTH-threats.txt'}")
    return 0


def write_health(payload, now, problems):
    if payload is None:
        lines = ["LIVE THREAT INFRASTRUCTURE - HEALTH REPORT", "", "STATUS: BROKEN", "",
                 f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC", "",
                 "WHAT IS WRONG:"] + [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
        (OUT / "HEALTH-threats.txt").write_text("\n".join(lines) + "\n")
        return

    m, provs = payload["meta"], payload["providers"]
    if m["networks_unreadable"]:
        problems.append(f"Address space could not be read for {len(m['networks_unreadable'])} "
                        f"network(s): {', '.join(m['networks_unreadable'][:6])}. Those cannot be "
                        "checked, so their zero is not a real zero.")

    status = "STALE" if problems else "OK"
    lines = [
        "LIVE THREAT INFRASTRUCTURE - HEALTH REPORT", "",
        f"STATUS: {status}", "",
        f"Checked                {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Run number             {m['runs']}",
        f"Prefixes checked       {m['prefixes_checked']:,}",
        f"Indicators examined    {m['indicators_examined']:,}",
        f"On confirmed networks  {m['indicators_on_confirmed_networks']:,}",
        f"On adjacent networks   {m['indicators_on_adjacent_networks']:,}  (ownership not established)",
        "",
        "By provider:",
        "   provider                    confirmed   adjacent   compromised",
    ]
    for slug, p in sorted(provs.items(), key=lambda kv: -kv[1]["indicators_confirmed_own"]):
        mark = " *" if p["designated"] else "  "
        adj = p["indicators_on_sibling"] + p["indicators_on_successor"]
        lines.append(f"  {mark}{p['name'][:25]:<26} {p['indicators_confirmed_own']:>9}   "
                     f"{adj:>8}   {p['indicators_on_compromised_hosts']:>11}")
    lines += ["", "   * = under a public sanctions or enforcement action",
              "   confirmed   = the provider's own address space, per its profile",
              "   adjacent    = sibling or successor networks. The research records a link",
              "                 but does NOT establish ownership. Not evidence about the provider.",
              "   compromised = someone else's hacked machine. A victim, not inventory.",
              "   These three are separate measurements. Never add them together.", ""]

    fam = payload["malware_families_on_tracked_space"]
    if fam:
        lines.append("Malware families on CONFIRMED provider address space only:")
        for f, n in list(fam.items())[:12]:
            lines.append(f"   {n:>4}  {f[:52]}")
        lines.append("")

    c2 = payload["ecosystem_botnet_c2_by_family"]
    if c2:
        lines.append("Live botnet command servers reported across the whole internet,")
        lines.append("by family. This stands on its own, independent of the providers above:")
        for f, n in list(c2.items())[:12]:
            lines.append(f"   {n:>4}  {f[:52]}")
        lines.append("")

    lines += ["READ THESE NUMBERS CAREFULLY:", " " + m["why_this_can_mislead"], ""]
    if problems:
        lines.append("WHAT IS WRONG:")
        lines += [f" - {p}" for p in problems]
        lines += ["", "WHAT TO DO: paste this file into a Claude session."]
    else:
        lines.append("Nothing to do. Collection is healthy.")
    (OUT / "HEALTH-threats.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
