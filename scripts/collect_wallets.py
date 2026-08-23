#!/usr/bin/env python3
"""
MEASUREMENT COLLECTOR - sanctioned wallets
===========================================
Reads the crypto addresses the US Treasury publishes alongside its designations,
then asks the public blockchains whether those wallets are still moving money.

THE QUESTION
------------
Designation is supposed to cut an entity off. Whether it does is an empirical
question that almost nobody asks in public, because it requires joining two
things that sit apart: the sanctions list, and the chain.

Both are free. OFAC publishes the addresses. The blockchains publish every
transaction. Nothing here needs an account, a vendor, or permission.

WHAT IT MEASURES
----------------
For each designated entity holding wallets:
  received        lifetime total into those addresses
  balance         what is sitting there now
  transactions    how many, across all its addresses
  last activity   the date money last moved

Last activity against the designation date is the whole point. A wallet quiet
since the week it was listed is one outcome. A wallet still transacting a year
later is a different one, and the difference is not currently measured anywhere
in this framework.

WHAT IT DOES NOT MEAN
---------------------
1. A quiet wallet is not a stopped entity. Operators move to fresh addresses
   the moment one is published; the listed wallet going still is the EXPECTED
   result and says nothing about whether the business continued.
2. A busy wallet is not necessarily the operator. Anyone can send funds to a
   published address, including researchers, and dust attacks deliberately taint
   addresses with unsolicited payments.
3. Balances are not seizures. Funds sitting in an address may be frozen,
   abandoned, or simply unmoved.
4. Coverage is partial. Bitcoin and Tron are read here. Ethereum, Monero and
   several others are listed but not yet read, and are reported as uncovered
   rather than as zero.

So this measures the LISTED ADDRESSES, not the entity's finances. Read it as a
floor on activity and never as a total.

SOURCES
-------
  OFAC SDN list       the addresses and which entity holds them
  mempool.space       Bitcoin, public and keyless
  TronGrid            Tron, public and keyless

USAGE
-----
    python3 scripts/collect_wallets.py

OUTPUT
------
    data/measurement/sanctioned-wallets.json
    data/measurement/HEALTH-wallets.txt
"""

import csv
import io
import json
import pathlib
import re
import subprocess
import sys
import time
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import _names
from collections import defaultdict
from datetime import datetime, timezone

SDN_URL = "https://www.treasury.gov/ofac/downloads/sdn.csv"
OUT = pathlib.Path("data/measurement")
UA = "RENO-Observatory-Measurement"
PAUSE = 2.0

# Coverage below this makes every conclusion here unsafe. On 23 Aug 2026 six
# runs in a morning drove reads from 138 down to 75 as the free API throttled,
# and the report cheerfully announced "no address shows meaningful movement"
# on 35 percent coverage. A null result computed from a third of the data is
# not a null result, it is a missing one wearing the same clothes.
MIN_COVERAGE = 0.80

ADDR_RE = re.compile(r"Digital Currency Address - ([A-Z0-9]+)\s+([a-zA-Z0-9]{25,100})")
TRACKER = pathlib.Path("data/enforcement.json")
CYBER = ("CYBER2", "CYBER3", "CYBER4")

# Chains with a free keyless endpoint. Everything else is recorded as listed
# but unread, which is honest; showing it as zero would invent a finding.
SUPPORTED = {"XBT", "TRX"}

# Movements at or below these values are treated as DUST, not activity.
#
# Published sanctioned addresses are dusted constantly: anyone can send a
# fraction of a cent to an address on a public list, and some do it deliberately
# to taint it. On 23 Aug 2026 this collector reported GRINEX as active 371 days
# after its designation, three days before the check. The transfers were 0.032
# and 0.033 TRX, worth a fraction of a cent each. Read as activity that is a
# headline. Read as dust it is noise, and dust is what it was.
#
# Without a floor, every dusted address on the list looks alive forever, and the
# one measurement here that could embarrass a bad sanctions claim becomes the
# one most likely to produce a false one.
# 0.0005 BTC was too low. It let a 0.000527 BTC crumb count as CHATEX still
# moving money 545 days after designation, when its real transactions were 11
# BTC and stopped on the designation date itself. Dust is not only the obvious
# fractions of a cent; it is anything too small to be commerce.
#
# Whatever number sits here will be arguable, which is why the report now prints
# the AMOUNT next to every date. A reader who disagrees with the threshold can
# see what it excluded and judge for themselves.
DUST_FLOOR = {"BTC": 0.01, "TRX": 1000.0}


def http(url, timeout=45):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    for wait in (0, 10, 30, 90):
        if wait:
            time.sleep(wait)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", "replace")
        except Exception:
            # -L is required: Treasury issues two redirects for the SDN file.
            # check_sanctions.py already had it and this did not, which is the
            # same two-copies-of-the-same-logic drift that bit the victim fetch.
            # Whenever a third collector needs HTTP, extract this rather than
            # copying it again.
            out = subprocess.run(["curl", "-s", "-L", "--max-time", str(timeout),
                                  "-H", f"User-Agent: {UA}", url],
                                 capture_output=True, text=True, errors="replace")
            if out.returncode == 0 and out.stdout.strip():
                return out.stdout
    return None


def bitcoin(addr):
    raw = http(f"https://mempool.space/api/address/{addr}")
    if not raw:
        return None
    try:
        d = json.loads(raw)
    except json.JSONDecodeError:
        return None
    cs = d.get("chain_stats", {})
    recv, spent = cs.get("funded_txo_sum", 0), cs.get("spent_txo_sum", 0)
    rec = {"received": recv / 1e8, "balance": (recv - spent) / 1e8,
           "transactions": cs.get("tx_count", 0), "unit": "BTC", "last_activity": None}
    if rec["transactions"]:
        time.sleep(PAUSE)
        txs = http(f"https://mempool.space/api/address/{addr}/txs")
        try:
            items = json.loads(txs) if txs else []
            best, best_val = None, 0.0
            for t in items:
                bt = (t.get("status") or {}).get("block_time")
                if not bt:
                    continue
                # Value moving to or from THIS address in that transaction.
                val = sum(o.get("value", 0) for o in (t.get("vout") or [])
                          if o.get("scriptpubkey_address") == addr)
                val += sum((i.get("prevout") or {}).get("value", 0)
                           for i in (t.get("vin") or [])
                           if (i.get("prevout") or {}).get("scriptpubkey_address") == addr)
                if best is None or bt > best:
                    best, best_val = bt, val / 1e8
            if best:
                rec["last_activity"] = datetime.fromtimestamp(
                    best, timezone.utc).strftime("%Y-%m-%d")
                rec["last_activity_value"] = round(best_val, 8)
        except (json.JSONDecodeError, ValueError, TypeError):
            pass
    return rec


def tron(addr):
    raw = http(f"https://api.trongrid.io/v1/accounts/{addr}")
    if not raw:
        return None
    try:
        d = json.loads(raw)
    except json.JSONDecodeError:
        return None
    items = d.get("data") or []
    if not items:
        return {"received": 0, "balance": 0, "transactions": 0, "unit": "TRX",
                "last_activity": None, "note": "no account record on chain"}
    a = items[0]
    last = a.get("latest_opration_time") or a.get("latest_consume_time")
    return {"received": None, "balance": (a.get("balance") or 0) / 1e6,
            "transactions": None, "unit": "TRX",
            "last_activity": (datetime.fromtimestamp(last / 1000, timezone.utc)
                              .strftime("%Y-%m-%d") if last else None)}


def designation_dates():
    """
    Earliest recorded designation date per target, from the enforcement tracker.

    Without this, "last activity January 2026" needs the reader to already know
    when the entity was designated. With it the number becomes days after
    designation, which is the question actually being asked: did money move
    AFTER the sanction landed.

    Matching uses the shared rules in _names.py, so a date attached here and a
    name checked in check_sanctions.py cannot disagree about who is who.
    """
    if not TRACKER.exists():
        return []
    try:
        actions = json.loads(TRACKER.read_text()).get("actions", [])
    except (json.JSONDecodeError, ValueError):
        return []
    out = []
    for a in actions:
        target, date = (a.get("targets") or "").strip(), (a.get("date") or "")[:10]
        if target and date:
            out.append({"target": target, "date": date,
                        "authority": a.get("authority", ""),
                        "tokens": _names.tokens(target)})
    return out


def main():
    sys.stdout.reconfigure(line_buffering=True)
    now = datetime.now(timezone.utc)
    OUT.mkdir(parents=True, exist_ok=True)

    raw = http(SDN_URL, timeout=180)
    if not raw:
        write_health(None, now, ["The OFAC SDN list could not be downloaded."])
        return 1

    entities = defaultdict(lambda: {"programs": set(), "addresses": []})
    for row in csv.reader(io.StringIO(raw)):
        if len(row) < 12:
            continue
        programs = [p.strip("[] ") for p in (row[3] or "").split("]") if p.strip("[] ")]
        if not any(p in CYBER for p in programs):
            continue
        for m in ADDR_RE.finditer(row[11] or ""):
            e = entities[row[1].strip()]
            e["programs"].update(programs)
            e["addresses"].append({"chain": m.group(1), "address": m.group(2)})

    total = sum(len(e["addresses"]) for e in entities.values())
    supported = sum(1 for e in entities.values() for a in e["addresses"]
                    if a["chain"] in SUPPORTED)
    print(f"  {len(entities)} designated entities, {total} addresses, "
          f"{supported} on chains this reads")

    designations = designation_dates()
    print(f"  {len(designations)} dated actions available for matching")

    results, unread = {}, defaultdict(int)
    for name, e in sorted(entities.items()):
        recs, tot_recv, tot_bal, tot_tx, last = [], 0.0, 0.0, 0, None
        for a in e["addresses"]:
            if a["chain"] not in SUPPORTED:
                unread[a["chain"]] += 1
                recs.append({**a, "read": False,
                             "note": "chain not read by this collector"})
                continue
            data = bitcoin(a["address"]) if a["chain"] == "XBT" else tron(a["address"])
            time.sleep(PAUSE)
            if data is None:
                recs.append({**a, "read": False, "note": "lookup failed"})
                continue
            recs.append({**a, "read": True, **data})
            if data.get("received"):
                tot_recv += data["received"]
            if data.get("balance"):
                tot_bal += data["balance"]
            if data.get("transactions"):
                tot_tx += data["transactions"]
            # Only count activity above the dust floor toward "last activity".
            # The raw date is kept on the address either way, so nothing is
            # hidden: it simply stops driving the headline number.
            unit = data.get("unit", "")
            floor = DUST_FLOOR.get(unit, 0)
            last_val = data.get("last_activity_value")
            if last_val is not None:
                meaningful = last_val > floor
            else:
                # No per-transaction value available, as on Tron. Fall back to
                # the balance, and mark it so the weaker basis is visible.
                meaningful = (data.get("balance") or 0) > floor
                data["dust_basis"] = "balance only; per-transaction value unavailable"
            data["above_dust_floor"] = meaningful
            recs[-1]["above_dust_floor"] = meaningful
            recs[-1]["last_activity_value"] = last_val
            if data.get("dust_basis"):
                recs[-1]["dust_basis"] = data["dust_basis"]
            if data.get("last_activity") and meaningful and (last is None or data["last_activity"] > last):
                last = data["last_activity"]

        # Earliest matching designation. Earliest, because an entity can be
        # designated more than once and the first one is when it was cut off.
        tok = _names.tokens(name)
        matches = [d for d in designations if _names.overlaps(tok, d["tokens"])]
        desig = min((d["date"] for d in matches), default=None)
        after = None
        if desig and last:
            after = (datetime.strptime(last, "%Y-%m-%d").date()
                     - datetime.strptime(desig, "%Y-%m-%d").date()).days

        results[name] = {
            "programs": sorted(e["programs"]),
            "designated": desig,
            "designating_authority": next((d["authority"] for d in matches
                                           if d["date"] == desig), None) if desig else None,
            "days_activity_after_designation": after,
            "addresses_listed": len(e["addresses"]),
            "addresses_read": sum(1 for r in recs if r.get("read")),
            "total_received_btc": round(tot_recv, 4),
            "current_balance_btc": round(tot_bal, 4),
            "transactions": tot_tx,
            "last_activity": last,
            "days_since_activity": ((now.date() - datetime.strptime(last, "%Y-%m-%d").date()).days
                                    if last else None),
            "addresses": recs,
        }
        if last or tot_tx:
            print(f"  {name[:36]:<37} {tot_recv:>10.2f} BTC in, last {last or '-'}")

    read_ok = sum(v["addresses_read"] for v in results.values())
    readable = total - sum(unread.values())
    coverage = (read_ok / readable) if readable else 0.0

    active = {k: v for k, v in results.items()
              if v["days_since_activity"] is not None and v["days_since_activity"] <= 90}
    # The finding this collector exists to surface: wallets that kept moving
    # after the designation that was supposed to cut them off.
    moved_after = {k: v for k, v in results.items()
                   if (v.get("days_activity_after_designation") or 0) > 0}

    payload = {
        "meta": {
            "sources": ["OFAC SDN list", "mempool.space (Bitcoin)", "TronGrid (Tron)"],
            "built": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "entities": len(results),
            "addresses_listed": total,
            "addresses_read": sum(v["addresses_read"] for v in results.values()),
            "chains_not_read": dict(unread),
            "addresses_lookup_failed": sum(
                1 for v in results.values() for a in v["addresses"]
                if a.get("note") == "lookup failed"),
            "coverage": round(coverage, 3),
            "coverage_sufficient": coverage >= MIN_COVERAGE,
            "min_coverage": MIN_COVERAGE,
            "entities_active_last_90_days": len(active),
            "entities_with_activity_after_designation": len(moved_after),
            "designation_dates_matched": sum(1 for v in results.values() if v.get("designated")),
            "measures": "Whether wallets published on the sanctions list are still moving money.",
            "why_this_can_mislead": (
                "A quiet wallet is not a stopped entity: operators move to fresh addresses as "
                "soon as one is published, so the listed address going still is the EXPECTED "
                "result and says nothing about whether the business continued. A busy wallet is "
                "not necessarily the operator either, since anyone can send funds to a published "
                "address and dust attacks deliberately taint them. Balances are not seizures. "
                "And coverage is partial: Bitcoin and Tron are read, other listed chains are "
                "reported as unread rather than as zero. This measures the LISTED ADDRESSES, "
                "never the entity's finances, and is a floor on activity rather than a total."
            ),
            "dust_floor": DUST_FLOOR,
            "distortion": "High as a measure of an entity. Low as a measure of the addresses themselves.",
        },
        "entities": results,
    }
    (OUT / "sanctioned-wallets.json").write_text(json.dumps(payload, indent=1))
    write_health(payload, now, [])
    print(f"\nWrote {OUT/'sanctioned-wallets.json'} and {OUT/'HEALTH-wallets.txt'}")
    return 0


def write_health(payload, now, problems):
    if payload is None:
        lines = ["SANCTIONED WALLETS - HEALTH REPORT", "", "STATUS: BROKEN", "",
                 f"Checked            {now.strftime('%d %b %Y at %H:%M')} UTC", "",
                 "WHAT IS WRONG:"] + [f" - {p}" for p in problems]
        (OUT / "HEALTH-wallets.txt").write_text("\n".join(lines) + "\n")
        return

    m, ents = payload["meta"], payload["entities"]
    ranked = sorted(ents.items(), key=lambda kv: -(kv[1]["total_received_btc"] or 0))
    lines = [
        "SANCTIONED WALLETS - HEALTH REPORT", "",
        f"STATUS: {'OK' if m.get('coverage_sufficient') else 'STALE'}", "",
        f"Checked                 {now.strftime('%d %b %Y at %H:%M')} UTC",
        f"Designated entities     {m['entities']}",
        f"Addresses listed        {m['addresses_listed']}",
        f"Addresses read          {m['addresses_read']}",
        f"Active in last 90 days  {m['entities_active_last_90_days']} entities",
        "",
        f"Designation dates matched {m['designation_dates_matched']} of {m['entities']}",
        "",
    ]
    lines.append(f"Coverage                {m.get('coverage', 0) * 100:.0f} percent of readable addresses")
    lines.append("")
    failed = m.get("addresses_lookup_failed", 0)
    if failed:
        lines += [f"WARNING: {failed} of {m['addresses_listed']} addresses could not be read this",
                  " run. Their entities are therefore understated, and a quiet entity below may",
                  " simply be one that failed to look up. Coverage has varied between runs.", ""]

    moved = sorted(((n, v) for n, v in ents.items()
                    if (v.get("days_activity_after_designation") or 0) > 0),
                   key=lambda kv: -kv[1]["days_activity_after_designation"])
    if moved:
        lines += ["MONEY MOVED AFTER THE DESIGNATION LANDED.",
                  "The listed addresses saw activity this long after the entity was designated.",
                  f"Movements at or below {m['dust_floor']} are excluded as dust; the amount of the",
                  "last qualifying movement is shown so you can judge the threshold yourself:",
                  "   entity                          designated    last activity    gap     amount"]
        for n, v in moved:
            # The amount must come from the SAME address that produced the date.
            # Taking max() across addresses printed "0.5719 BTC on 2026-08-19"
            # for FIRST VPN SERVICE, pairing an amount from a 2024 transaction
            # on one address with a 2026 date from another. Neither transaction
            # happened. A fabricated figure in a report about sanctions is the
            # worst failure available here.
            src = next((a for a in v["addresses"]
                        if a.get("above_dust_floor")
                        and a.get("last_activity") == v["last_activity"]), None)
            amt = (src or {}).get("last_activity_value") or 0
            lines.append(f"   {n[:30]:<31} {v['designated']}    {v['last_activity']}  "
                         f"{v['days_activity_after_designation']:>5}d   {amt:>9.4f}")
            if src:
                lines.append(f"        that movement: {amt} {src.get('unit','')} "
                             f"at {src.get('address','')[:44]}")
        lines += ["",
                  " This does NOT prove the entity was still trading. A late movement may be a",
                  " sweep, a third party, or noise. Read the amount before believing the date:",
                  " most apparent cases here have turned out to be fractions of a coin arriving",
                  " at a burned address, while the entity's real money stopped on or before the",
                  " day it was designated.", ""]
    elif not m.get("coverage_sufficient"):
        lines += ["NO CONCLUSION DRAWN. Only "
                  f"{m['coverage'] * 100:.0f} percent of readable addresses were fetched this run,",
                  f"below the {m['min_coverage'] * 100:.0f} percent needed to say anything about absence.",
                  "",
                  " Nothing was found, but nothing being found on partial data is not a result.",
                  " Wait for a run with full coverage before treating silence as meaningful.", ""]
    else:
        lines += ["NO listed address shows a meaningful movement after its entity's designation",
                  "date, among those where a date could be matched.",
                  "",
                  " That is the result, not an absence of one. Published addresses go dark, and",
                  " they go dark fast. It does NOT mean the entities stopped operating: it means",
                  " these particular addresses stopped being used, which is the expected response",
                  " to being listed. Measuring whether the BUSINESS continued needs the successor",
                  " addresses, and those are not published by anyone.", ""]

    lines += ["Entities by lifetime bitcoin received into their listed addresses:",
              "   entity                              received      balance   last activity"]
    for name, v in ranked[:18]:
        if not v["addresses_read"]:
            continue
        last = v["last_activity"] or "never"
        age = f" ({v['days_since_activity']}d)" if v["days_since_activity"] is not None else ""
        lines.append(f"   {name[:34]:<35} {v['total_received_btc']:>10.2f}   "
                     f"{v['current_balance_btc']:>10.4f}   {last}{age}")
    lines.append("")
    if m["chains_not_read"]:
        lines.append("Listed but NOT read by this collector. These are not zeroes:")
        for c, n in sorted(m["chains_not_read"].items(), key=lambda kv: -kv[1]):
            lines.append(f"   {n:>3} addresses on {c}")
        lines.append("")
    lines += ["WHAT A QUIET WALLET DOES NOT MEAN:",
              " Operators move to fresh addresses as soon as one is published. A listed",
              " address going still is the expected outcome and is NOT evidence the entity",
              " stopped operating. Read silence as the address being burned, not the",
              " business being closed.", "",
              "READ THESE NUMBERS CAREFULLY:", " " + m["why_this_can_mislead"], "",
              "Nothing to do. Collection is healthy."]
    (OUT / "HEALTH-wallets.txt").write_text("\n".join(lines) + "\n")


if __name__ == "__main__":
    sys.exit(main())
