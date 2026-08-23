#!/usr/bin/env python3
"""
Shared name matching for sanctions and enforcement records.

WHY THIS IS ONE FILE
--------------------
Two collectors compare names against the OFAC list: check_sanctions.py watches
the enforcement tracker for drift, and collect_wallets.py joins designated
entities to their designation dates. Both need the same hard-won rules, and
copying them would repeat a mistake this project has already made three times
in one day, in three different files.

THE RULES, AND WHAT EACH ONE COST
----------------------------------
Names reach these lists through several transliteration schemes and in either
order. OFAC writes "KHOROSHEV, Dmitry Yuryevich"; a tracker writes "Dmitry
Yuryevich Khoroshev". Exact matching finds only the surname and calls them
strangers.

But loosening it too far is worse. Sergey SERGEEVICH Ivanov and Sergei
BORISOVICH Ivanov share a surname and a first name and are different men. The
patronymic is what separates them, and a two-hit threshold walks straight past
it, silently merging two people.

So: match name parts fuzzily, and where both sides supply three or more parts,
require three of them to match. The per-token threshold sits in a narrow window,
0.75, chosen because VITALII against VITALY scores 0.77 and is the same name,
while SERGEEVICH against BORISOVICH scores 0.60 and must not be.

Run --selftest after changing anything here.
"""

import difflib
import re
import sys

NOISE = {"THE", "LLC", "LTD", "OOO", "INC", "CO", "GROUP", "LIMITED", "COMPANY",
         "AKA", "FKA", "OAO", "ZAO", "PJSC", "JSC", "AND", "OF", "SERVICES",
         "S.R.O.", "SRO", "OU", "EOOD", "GMBH", "BV", "LP", "LLP"}

# Values a hand-written field uses to mean "nothing here".
NO_VALUE = {"", "NONE", "N/A", "NA", "-", "UNKNOWN", "TBD"}

THRESHOLD = 0.75


def tokens(name):
    """A name reduced to comparable parts. Order and punctuation are discarded."""
    parts = re.split(r"[^A-Za-z0-9]+", (name or "").upper())
    return {p for p in parts if len(p) > 2 and p not in NOISE}


def similar(x, y):
    """Two name parts that are the same name spelled differently."""
    if x == y:
        return True
    if abs(len(x) - len(y)) > 3:
        return False
    return difflib.SequenceMatcher(None, x, y).ratio() >= THRESHOLD


def overlaps(a, b):
    """
    Whether two token sets describe the same party. Generous by design: the
    output is a CANDIDATE for a person to check, never a conclusion.
    """
    if not a or not b:
        return False
    matched, unused = 0, set(b)
    for x in a:
        hit = next((y for y in unused if similar(x, y)), None)
        if hit:
            matched += 1
            unused.discard(hit)
    if min(len(a), len(b)) >= 3:
        return matched >= 3
    return matched >= 2 or (matched == 1 and min(len(a), len(b)) == 1)


SELFTEST = [
    ("Dmitry Yuryevich Khoroshev", "Dmitri Yurievich Khoroshov", True,
     "same man, different transliteration"),
    ("Vitalii Nikolaevich Kovalev", "KOVALEV, Vitaly Nikolayevich", True,
     "same man, OFAC surname-first and a different scheme"),
    ("Sergey Sergeevich Ivanov", "IVANOV, Sergey Sergeevich", True,
     "same man, name order reversed"),
    ("Sergey Sergeevich Ivanov", "Sergei Borisovich Ivanov", False,
     "DIFFERENT men: shared surname and first name, different patronymic"),
    ("Vitalii Nikolaevich Kovalev", "KOVALEV, Anatoliy Sergeyevich", False,
     "different men sharing a surname"),
    ("Suex OTC", "SUEX OTC, S.R.O.", True,
     "same entity, legal suffix present on one side only"),
    ("Media Land LLC", "Aeza Group LLC", False,
     "different companies sharing only a stripped legal suffix"),
]


def selftest():
    failures = 0
    for a, b, want, why in SELFTEST:
        got = overlaps(tokens(a), tokens(b))
        if got != want:
            failures += 1
        print(f"  {'PASS' if got == want else 'FAIL'}  {'match' if got else 'no   '}  "
              f"{a[:28]:<29} vs {b[:30]:<31} {why}")
    print(f"\n{'all cases pass' if not failures else str(failures) + ' FAILING'}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(selftest())
