window.EDP_REGISTRY = {
 "meta": {
  "registry_version": "1.4",
  "generated": "2026-06-12",
  "framework": "Ransomware Ecosystem Disruption Framework",
  "map_current": "v2.5",
  "owner": "Reno",
  "changelog": [
   {
    "date": "2026-06-12",
    "change": "Registry v1.0 created. Seeded from KPI Tracker v3 (Q1 2026 baseline) and Doc 13 WAIS back-test."
   },
   {
    "date": "2026-06-12",
    "change": "v1.1: Full WAIS arrest backlog scored under Doc 14 eligibility rule, n=20 (1 HIGH, 10 MODERATE, 7 LIMITED, 2 PENDING). B-1/B-1b updated."
   },
   {
    "date": "2026-06-12",
    "change": "v1.2: AUDIA6 added as first ex-ante row (admins arrested Jun 10, Georgia; CO PENDING; RI provisional, reassess Sep 2026). n=21."
   },
   {
    "date": "2026-06-12",
    "change": "v1.3: Nine historical quarters (Q1 2024 to Q1 2026) imported from legacy site files. Curated case series relabeled neutrally; legacy Com WAIS entry removed per eligibility rule; verified primary-source values supersede legacy estimates where they conflicted."
   },
   {
    "date": "2026-06-12",
    "change": "v1.4: Counting rule for the new-brands column documented (curated, significance-threshold, Russia/CIS nexus) with vendor-census comparison, after review flagged the divergence from vendor new-group counts."
   }
  ]
 },
 "themes": {
  "A": "More Russian Domestic Enforcement",
  "B": "Visible FSB/RIS Strife",
  "C": "Fewer Payments and Worse Economics"
 },
 "kpis": [
  {
   "id": "A-1",
   "theme": "A",
   "name": "Russian Domestic Actions Against Ecosystem Actors",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "0 confirmed (open source)",
   "trend": "Improving (from zero)",
   "maturity": "L1/L2 Partial",
   "notes": "Russian domestic enforcement against ecosystem actors: 0 elite-tier actions visible in open source 2025. Most significant baseline = absence of action. REvil arrests (Jan 2022) remain the last confirmed elite-tier Russian enforcement event. | Q1 2026: First confirmed Russian domestic action against an ecosystem-adjacent actor (Node 07 forum admin). Caveat: CIS-norm enforcement (MVD framed forum as enabling fraud against Russian citizens), not protection-layer breakdown. CONFIRMED via MVD spokesperson statement.",
   "periods": {
    "2026Q1": "1 confirmed: MVD arrest of LeakBase admin 'Chucky' (Taganrog, Mar 2026); Russian LE also seized relaunch domain leakbase.bz",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "A-2",
   "theme": "A",
   "name": "Referral-to-Action Lag (days)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "UNKNOWN",
   "trend": "Insufficient Data",
   "maturity": "L2 - Requires Buy-In",
   "notes": "Requires internal operation log population. L2 gap. No seeded referral program currently documented. | Q1 2026: L2 gap persists. No seeded referral log.",
   "periods": {
    "2026Q1": "UNKNOWN",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "A-3",
   "theme": "A",
   "name": "Protection Relationship Status: Active Count",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "UNKNOWN",
   "trend": "Insufficient Data",
   "maturity": "L2 - Requires Buy-In",
   "notes": "L2 gap. Requires IC reporting feeds. This metric is a priority agenda item for the partner meeting. | Q1 2026: L2 gap persists.",
   "periods": {
    "2026Q1": "UNKNOWN",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "A-3b",
   "theme": "A",
   "name": "Protection Relationship Status: Strained Count",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "UNKNOWN",
   "trend": "Insufficient Data",
   "maturity": "L2 - Requires Buy-In",
   "notes": "L2 gap. | Q1 2026: L2 gap persists.",
   "periods": {
    "2026Q1": "UNKNOWN",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "A-3c",
   "theme": "A",
   "name": "Protection Relationship Status: Broken Count",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "UNKNOWN",
   "trend": "Insufficient Data",
   "maturity": "L2 - Requires Buy-In",
   "notes": "L2 gap. | Q1 2026: L2 gap persists.",
   "periods": {
    "2026Q1": "UNKNOWN",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "B-1",
   "theme": "B",
   "name": "WAIS: High Impact Arrests (Score 10-12)",
   "confidence": "CONFIRMED",
   "baseline_pre2026": "2 (LockBit affiliated operators, Operation Cronos Feb 2024)",
   "trend": "No Change",
   "maturity": "L1/L2 Partial",
   "notes": "LockBit-affiliated operators (Poland/Ukraine): WAIS 6-8 + coordination bonus. LockBit developer Panev: arrested Israel, awaiting extradition, WAIS PENDING debrief. | Q1 2026: No high-impact arrests of core Russia/CIS ransomware operators observable. CONFIRMED (absence in open source). | CORRECTION (2026-06-12, Doc 13 back-test): legacy baseline claim of 2 high-impact (10-12) arrests rescored to 9 MODERATE incl. coordination bonus. No WAIS HIGH arrest has yet been observed; see WAIS Scorer rows 6-8. | BACKLOG UPDATE (2026-06-12, Doc 14): full 2022-2026 arrest backlog scored, n=20. Exactly one HIGH exists: PHOBOS-AETOR (Feb 2025, 10 incl. coordination bonus, arrests + simultaneous infrastructure seizure + brand death). All other arrests 5-9.",
   "periods": {
    "2026Q1": "0 observable (no WAIS 10-12 arrests of Russia/CIS core operators in open source)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "B-1b",
   "theme": "B",
   "name": "WAIS: Moderate Impact Arrests (Score 7-9)",
   "confidence": "CONFIRMED",
   "baseline_pre2026": "0 in 2025 (Q1-Q3 observable)",
   "trend": "Improving (from zero)",
   "maturity": "L1/L2 Partial",
   "notes": "No arrests scoring 7-9 in 2025 observable from open source. LockBit Cronos arrests scored in this range. | Q1 2026: WAIS scoring of Q1 candidates is queued (back-test work item). Project Compass reporting CREDIBLE (secondary sources). | Scored 2026-06-12; full backlog n=20 in WAIS Scorer. Eligibility rule in Doc 14.",
   "periods": {
    "2026Q1": "1 scored: LeakBase admin arrest (MVD, Mar 2026) = 7 MODERATE (CHUCKY-RU). Project Compass excluded under eligibility rule (function/nexus fail)",
    "2026Q2": "Provisional: AUDIA6 admins arrested Jun 10 (Georgia, DOJ charges); scored ex-ante, CO PENDING. Quarter open.",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "B-2a",
   "theme": "B",
   "name": "Affiliate Defection Rate (new splinter groups per disruption event)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "HIGH. Multiple instances",
   "trend": "Reversing (consolidation)",
   "maturity": "L1 - Operational Now",
   "notes": "RansomHub affiliates to DragonForce/Qilin (April 2025). LockBit affiliates to RansomHub (2024). BlackCat affiliates to RansomHub (2024). Pattern: major brand collapse produces rapid affiliate redistribution. | Q1 2026: Fragmentation trend reversing. Check Point: top-10 share 71.1%, Qilin 338 victims (3rd straight qtr as no. 1), LockBit back in top tier (163), The Gentlemen 166. CREDIBLE.",
   "periods": {
    "2026Q1": "No confirmed defections this quarter. Structural shift: consolidation. LockBit/Qilin/DragonForce alliance (formed Oct 2025) absorbing affiliates; top 10 groups took 71% of Q1 victims (Check Point)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "B-2b",
   "theme": "B",
   "name": "Exit Scam Frequency (per quarter)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "2 confirmed (BlackCat Mar 2024, RansomHub Apr 2025)",
   "trend": "Improving",
   "maturity": "L1 - Operational Now",
   "notes": "Two exit scams in 14 months. Both followed law enforcement pressure accumulation. Pattern: LE pressure + large payment = exit scam risk elevated. | Q1 2026: No RaaS-operator exit scams observed, vs 2 in the 14 months prior. BreachForums incident is forum infrastructure, not RaaS. CREDIBLE (SpyCloud Labs).",
   "periods": {
    "2026Q1": "0 confirmed RaaS exit scams. 1 attempted forum-level exit scam (BreachForums moderator 'N/A' attempted sale of forum DB/source, Mar 2026)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "B-2c",
   "theme": "B",
   "name": "New RaaS Brand Emergence Rate (per quarter)",
   "confidence": "INDICATIVE",
   "baseline_pre2026": "85 groups tracked Q3 2025. 45 new in 2025 through Q3.",
   "trend": "Mixed",
   "maturity": "L1 - Operational Now",
   "notes": "Record fragmentation. 46 new groups in 2024 (48% of all active groups). 85 separate groups tracked Q3 2025 (Check Point Research). Fragmentation is both a disruption signal and a resilience risk. | Q1 2026: Divergent vendor signals: Breachsense reports ecosystem expansion (more active groups), Check Point reports consolidation of victim share (top 10 = 71%). Both can hold: many small brands, share concentrating at top. CREDIBLE.",
   "periods": {
    "2026Q1": "4 new brands entered tracking at volume (CoinbaseCartel, Bashe, CipherForce, Payload). Active groups by month: 58 / 54 / 65 (Breachsense)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-1",
   "theme": "C",
   "name": "Ransom Payment Volume (USD, estimated)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "$813M (2024). ~$820M est. 2025 (Chainalysis)",
   "trend": "Improving",
   "maturity": "L1 - Operational Now",
   "notes": "35% decline from 2023 record $1.25B. On-chain 2025 estimate: ~$820M. NOTE: Bitcoin price appreciation in 2024-2025 means some decline reflects crypto market, not pure disruption effect. Annotate accordingly. | Q1 2026: Chainalysis 2026 Crypto Crime Report. Note methodology split: Chainalysis 28% = on-chain share; Coveware 23% = IR caseload rate. CREDIBLE.",
   "periods": {
    "2026Q1": "FY2025 actual: $820M, -8% YoY, second consecutive annual decline (Chainalysis). On-chain payment share 28%, all-time low. Median demand $59,556 (up from $12,738 in 2024). Quarterly on-chain Q1 2026 figure not public",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-1b",
   "theme": "C",
   "name": "Victim Count (published, leak sites)",
   "confidence": "CONFIRMED",
   "baseline_pre2026": "5,243 (2024). 7,515 (2025)",
   "trend": "Improving (QoQ); Worsening (YoY)",
   "maturity": "L1 - Operational Now",
   "notes": "Record highs both years. Q4 2024: 1,663 victims (record quarter). November 2024: 632 victims (record month). 2025 annual total 44% above 2024. | Q1 2026: Vendor counts diverge on dedup/methodology; range recorded rather than single point. CONFIRMED (multiple independent trackers).",
   "periods": {
    "2026Q1": "2,122 (Check Point) to 2,638 (ReliaQuest); Breachsense 2,165; Travelers 2,405. -12.2% vs Q4 2025 all-time record (2,416, Check Point). Second-highest Q1 on record",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-1c",
   "theme": "C",
   "name": "Payment/Victim Divergence",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "Payment declining, victims rising = widening divergence",
   "trend": "Improving",
   "maturity": "L1 - Operational Now",
   "notes": "AUTO: divergence = payment declining vs. victim count rising. This is the core business model degradation signal. 2024: $813M / 5,243 victims = $155K/victim avg payment (vs $275K/victim in 2023). | Q1 2026: Core thesis metric. Pressure on economics continues while activity volume stays elevated. CREDIBLE.",
   "periods": {
    "2026Q1": "Divergence widening: FY2025 payments -8% vs victims +45% YoY (Breachsense) / +50% (Chainalysis claimed-victim basis). Q1 2026 victims near record while payment rates near historic lows",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-2",
   "theme": "C",
   "name": "Victim Payment Rate: Critical Infrastructure (%)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "UNKNOWN by sector",
   "trend": "Insufficient Data",
   "maturity": "L1 - Operational Now",
   "notes": "Sector-specific breakdown not publicly available from Coveware. All-sector rate: fewer than 50% in 2024, 23% Q3 2025 (Coveware). Sector breakdown requires direct Coveware engagement or ISAC data. | Q1 2026: Sector payment-rate breakdown still not published by Coveware or insurers. Gap persists.",
   "periods": {
    "2026Q1": "UNKNOWN by sector. Context: Coveware Q1 2026 caseload share: Healthcare 17.6%, Consumer Svcs 15.3%, Prof Svcs 11.8%, Financial 9.4%, Public Sector 7.1% (incident share, not payment rate)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-2b",
   "theme": "C",
   "name": "Victim Payment Rate: Healthcare (%)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "UNKNOWN (healthcare elevated vs avg)",
   "trend": "Insufficient Data",
   "maturity": "L1 - Operational Now",
   "notes": "Healthcare assessed above-average payment rate due to operational sensitivity. Specific rate UNKNOWN. | Q1 2026: Healthcare remains most-targeted sector in both Coveware caseload and Breachsense 2025 annual (538 victims). Payment rate still unpublished.",
   "periods": {
    "2026Q1": "UNKNOWN. Healthcare = 17.6% of Coveware Q1 2026 caseload (largest sector; incident share, not payment rate)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-2c",
   "theme": "C",
   "name": "Victim Payment Rate: General Commercial (%)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "23% all-sector Q3 2025 (historic low)",
   "trend": "Mixed (rate up QoQ, still near historic lows)",
   "maturity": "L1 - Operational Now",
   "notes": "Coveware Q3 2025: 23% payment rate (historic low). Q4 2025 est: ~20% (Coveware). Six-year consecutive decline. Large enterprises increasingly refusing to pay. | Q1 2026: Coveware: average rising on big-game data-theft cases while median falls (mid-market resilience). Data-theft-only payment rates remain structurally low. CONFIRMED (Coveware first-hand caseload).",
   "periods": {
    "2026Q1": "23% (Coveware Q1 2026), up from 20% in Q4 2025 (historic low). Avg payment $680,081 (+15% QoQ); median $300,750 (-7% QoQ)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-3a",
   "theme": "C",
   "name": "Leak Site Post Volume (monthly avg)",
   "confidence": "CONFIRMED",
   "baseline_pre2026": "553/month avg Q4 2024. ~626/month avg 2025.",
   "trend": "Improving (QoQ); elevated vs history",
   "maturity": "L1 - Operational Now",
   "notes": "Post volumes at record highs. Signal: groups compensating for lower payment rates with higher attack tempo. More victims, less revenue per victim. | Q1 2026: Single-source monthly series (Breachsense) now populated Jan 2024 - May 2026 in Leak Site Signals tab. Q2 2026 to date: Apr 772, May 646. CONFIRMED (claimed victims, deduplicated).",
   "periods": {
    "2026Q1": "722/month avg (Jan 677, Feb 680, Mar 808; Breachsense). -2.3% vs Q4 2025 record avg of 739/month",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-3b",
   "theme": "C",
   "name": "Avg Time-to-Publish (days)",
   "confidence": "CREDIBLE",
   "baseline_pre2026": "Compressing. Negotiations begin within hours of exfiltration.",
   "trend": "Insufficient Data",
   "maturity": "L1 - Operational Now",
   "notes": "Chainalysis 2025 Crypto Crime Report: ransomware operations faster, negotiations beginning within hours of data exfiltration. Compression = groups under pressure to escalate. | Q1 2026: Data gap logged. Needs Coveware/Chainalysis negotiation-timeline update or Ransomlook diffing.",
   "periods": {
    "2026Q1": "UNKNOWN for Q1 2026. No public vendor update; assessed still compressed (~2 days). INDICATIVE",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  },
  {
   "id": "C-3c",
   "theme": "C",
   "name": "Avg Takedown/Relaunch Cycle (days)",
   "confidence": "CONFIRMED",
   "baseline_pre2026": "Mixed. LockBit: 5 days (fast). RansomHub: no relaunch (dissolved). BlackCat: 48-72hrs then dissolved.",
   "trend": "Improving",
   "maturity": "L1 - Operational Now",
   "notes": "Variance in cycle: large franchise brands taking longer to reconstitute post-disruption than in prior years. RansomHub did not relaunch. Ecosystem fragmentation means individual brand dissolution has less macro impact. | Q1 2026: First quarter with a cycle terminated by arrest (LeakBase). RAMP non-reconstitution is the strongest infrastructure-resilience signal to date. CONFIRMED.",
   "periods": {
    "2026Q1": "3 cycle events: RAMP forum (FBI seizure Jan 28, no relaunch through Q1; fragmentation per Rapid7); LeakBase (seized Mar 3-4, relaunched in ~6 days, relaunch re-seized by Russian LE and admin arrested); Tycoon 2FA (disrupted Mar 4, -41% activity in week 1)",
    "2026Q2": "",
    "2026Q3": "",
    "2026Q4": ""
   }
  }
 ],
 "nodes": [
  {
   "id": "Node 01",
   "name": "OTC Crypto Brokers",
   "priority": "CRITICAL",
   "status_summary": "Financial friction significantly elevated. Operators holding funds in personal wallets (unprecedented caution). No-KYC exchange usage declined sharply post-Cryptex/Garantex designations. Actors shifting to cross-chain bridges.",
   "owner": "OFAC / Treasury / Chainalysis",
   "last_updated": "Apr 2026",
   "level": "L1/L2 Partial",
   "confidence": "CONFIRMED"
  },
  {
   "id": "Node 02",
   "name": "High-Risk Exchanges",
   "priority": "CRITICAL",
   "status_summary": "Primary no-KYC exchange landscape degraded. German LE seized 47 Russian-language no-KYC exchanges (Sep 2024). OFAC SDN list: 1,200+ crypto wallet addresses. Centralized exchanges remain dominant cash-out (39% of flows).",
   "owner": "Treasury / FinCEN / FVEY financial partners",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "CONFIRMED"
  },
  {
   "id": "Node 03",
   "name": "Bulletproof Hosting (BPH)",
   "priority": "CRITICAL",
   "status_summary": "Significant recent disruptions. Zservers sanctioned Feb 2025 (OFAC/FCDO/DFAT joint action). Aeza Group sanctioned. Operation Endgame extended May 2025. BPH operators rebuilding under new names.",
   "owner": "FBI / NCA / Shadowserver",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "CONFIRMED"
  },
  {
   "id": "Node 04",
   "name": "IAB Markets",
   "priority": "HIGH",
   "status_summary": "IAB market active. ~$14M paid to IABs in 2025 (Chainalysis). VPN credential exploitation dominant access vector (28.6% of Q3 2024 ransomware attacks). Systematic pricing data requires Intel 471/Flashpoint.",
   "owner": "Intel 471 / Flashpoint / CISA",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "CREDIBLE"
  },
  {
   "id": "Node 05",
   "name": "Botnet/Loaders",
   "priority": "HIGH",
   "status_summary": "QakBot disrupted Aug 2023, partial reconstitution within 90-180 days. Operation Endgame (May 2024, extended May 2025) disrupted IcedID, SystemBC, Pikabot predecessors. Successor loaders filling partial gap.",
   "owner": "FBI / NCA / Europol / national CERTs",
   "last_updated": "Apr 2026",
   "level": "L1/L2 Partial",
   "confidence": "CONFIRMED"
  },
  {
   "id": "Node 06",
   "name": "Leak Site Hosting",
   "priority": "HIGH",
   "status_summary": "Record 81 active data leak sites tracked Q3 2025. High fragmentation. Individual site takedowns produce fast relaunch. Volume of sites = ecosystem fragmentation signal.",
   "owner": "FBI / Europol / FVEY LE",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "CONFIRMED"
  },
  {
   "id": "Node 07",
   "name": "Underground Trust Infrastructure",
   "priority": "HIGH",
   "status_summary": "Trust under elevated strain. Two exit scams in 14 months. Coveware: RaaS model 'has not recovered' since LockBit/ALPHV disruptions. Lone wolf attacks increasing as affiliates trust RaaS operators less.",
   "owner": "Intel 471 / Flashpoint",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "CREDIBLE"
  },
  {
   "id": "Node 08",
   "name": "Mixing/Obfuscation Services",
   "priority": "HIGH",
   "status_summary": "Mixer ecosystem significantly degraded. Chipmixer seized 2023. Sinbad seized. Tornado Cash designated 2022 (delisted Mar 2025 on court ruling). Substantial decline in mixer usage confirmed. Actors shifting to cross-chain bridges and personal wallets.",
   "owner": "Chainalysis / TRM / OFAC",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "CONFIRMED"
  },
  {
   "id": "Node 09A",
   "name": "Mule Networks (Russia-Domestic)",
   "priority": "HIGH",
   "status_summary": "UNKNOWN. Highest-priority L2 gap. Requires Rosfinmonitoring channel access. No open-source visibility.",
   "owner": "Rosfinmonitoring / FNS / CBR channel",
   "last_updated": "UNKNOWN",
   "level": "L2 - Requires Buy-In",
   "confidence": "CREDIBLE"
  },
  {
   "id": "Node 09B",
   "name": "Mule Networks (Third-Country)",
   "priority": "HIGH",
   "status_summary": "Partially visible. MLAT actions and third-country prosecutions. Specific referral counts require FVEY LE/Europol partner reporting.",
   "owner": "FVEY LE / Europol / MLAT partners",
   "last_updated": "Apr 2026",
   "level": "L1/L2 Partial",
   "confidence": "CREDIBLE"
  },
  {
   "id": "Node 10",
   "name": "Stealer/Credential Markets",
   "priority": "MEDIUM",
   "status_summary": "Directional: stealer market disruption produces IAB price impact at 60-90 day lag. Attribution distance high. INDICATIVE only.",
   "owner": "Intel 471 / Flashpoint / private sector",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "INDICATIVE"
  },
  {
   "id": "Node 07 supplemental",
   "name": "Underground Marketplaces",
   "priority": "MEDIUM",
   "status_summary": "Record 81 data leak sites Q3 2025. Forum migration to Telegram ongoing. New group emergence at record pace. Fragmentation elevated.",
   "owner": "Intel 471 / Flashpoint",
   "last_updated": "Apr 2026",
   "level": "L1 - Operational Now",
   "confidence": "INDICATIVE"
  }
 ],
 "groups": [
  {
   "name": "RansomHub",
   "status": "Dissolved",
   "date_first_action": "Mar 2025",
   "op_capacity": "0% (brand dissolved)",
   "financial_rails": "Collapsed",
   "protection_layer": "Unknown",
   "leak_posts": "N/A",
   "affiliates": "N/A",
   "reconstitution_risk": "Low",
   "last_wais": "None scored",
   "strife_events": "0",
   "next_review": "Jun 2026"
  },
  {
   "name": "Qilin",
   "status": "Fully Operational",
   "date_first_action": "Feb 2025",
   "op_capacity": "Rising (absorbed affiliates)",
   "financial_rails": "Intact",
   "protection_layer": "Unknown/None Assessed",
   "leak_posts": "Rising vs baseline",
   "affiliates": "Unknown",
   "reconstitution_risk": "High",
   "last_wais": "None scored",
   "strife_events": "0",
   "next_review": "Jun 2026"
  },
  {
   "name": "Akira",
   "status": "Fully Operational",
   "date_first_action": "Feb 2025",
   "op_capacity": "~100%",
   "financial_rails": "Intact",
   "protection_layer": "Unknown/None Assessed",
   "leak_posts": "Stable/rising",
   "affiliates": "Unknown",
   "reconstitution_risk": "High",
   "last_wais": "None scored",
   "strife_events": "0",
   "next_review": "Jun 2026"
  },
  {
   "name": "LockBit",
   "status": "Degraded",
   "date_first_action": "Feb 2024",
   "op_capacity": "~40-70% of pre-Cronos",
   "financial_rails": "Partially Disrupted",
   "protection_layer": "Active (assessed)",
   "leak_posts": "Reduced vs baseline",
   "affiliates": "Partial",
   "reconstitution_risk": "High",
   "last_wais": "9 (Cronos arrests, Doc 13)",
   "strife_events": "1",
   "next_review": "Jun 2026"
  },
  {
   "name": "DragonForce",
   "status": "Fully Operational",
   "date_first_action": "Apr 2025",
   "op_capacity": "Rising rapidly",
   "financial_rails": "Intact",
   "protection_layer": "Unknown/None Assessed",
   "leak_posts": "Rising rapidly post-RansomHub",
   "affiliates": "Unknown",
   "reconstitution_risk": "Medium",
   "last_wais": "None scored",
   "strife_events": "0",
   "next_review": "Jun 2026"
  },
  {
   "name": "Black Basta",
   "status": "Significantly Degraded",
   "date_first_action": "Feb 2025",
   "op_capacity": "Unknown post-leak",
   "financial_rails": "Unknown",
   "protection_layer": "Strained (assessed)",
   "leak_posts": "Unknown post-leak",
   "affiliates": "Unknown",
   "reconstitution_risk": "High",
   "last_wais": "N/A (no arrests)",
   "strife_events": "1",
   "next_review": "Jun 2026"
  },
  {
   "name": "Play",
   "status": "Fully Operational",
   "date_first_action": "Feb 2025",
   "op_capacity": "~100%",
   "financial_rails": "Intact",
   "protection_layer": "Unknown/None Assessed",
   "leak_posts": "Stable",
   "affiliates": "Unknown",
   "reconstitution_risk": "Medium",
   "last_wais": "None scored",
   "strife_events": "0",
   "next_review": "Jun 2026"
  }
 ],
 "leak_site_monthly": [
  {
   "month": "Jan 2024",
   "victims": 278,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Feb 2024",
   "victims": 357,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Mar 2024",
   "victims": 325,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Apr 2024",
   "victims": 388,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "May 2024",
   "victims": 547,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Jun 2024",
   "victims": 305,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Jul 2024",
   "victims": 424,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Aug 2024",
   "victims": 399,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Sep 2024",
   "victims": 427,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Oct 2024",
   "victims": 470,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Nov 2024",
   "victims": 490,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Dec 2024",
   "victims": 594,
   "note": "2024 peak month",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Jan 2025",
   "victims": 535,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Feb 2025",
   "victims": 878,
   "note": "2025 peak; CL0P mass-exploitation campaign",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Mar 2025",
   "victims": 743,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Apr 2025",
   "victims": 511,
   "note": "RansomHub collapse",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "May 2025",
   "victims": 363,
   "note": "2025 trough; only month below 2024 equivalent",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Jun 2025",
   "victims": 440,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Jul 2025",
   "victims": 509,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Aug 2025",
   "victims": 487,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Sep 2025",
   "victims": 583,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Oct 2025",
   "victims": 761,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Nov 2025",
   "victims": 679,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Dec 2025",
   "victims": 777,
   "note": "Q4 2025 = record quarter (739/mo avg)",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Jan 2026",
   "victims": 677,
   "note": "RAMP forum seized by FBI Jan 28",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Feb 2026",
   "victims": 680,
   "note": "",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Mar 2026",
   "victims": 808,
   "note": "Highest month of 2026 to date; LeakBase takedown and MVD arrest",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "Apr 2026",
   "victims": 772,
   "note": "Q2 2026 provisional",
   "source": "Breachsense monthly/annual reports"
  },
  {
   "month": "May 2026",
   "victims": 646,
   "note": "Q2 2026 provisional; lowest month of 2026",
   "source": "Breachsense monthly/annual reports"
  }
 ],
 "wais_events": [
  {
   "op_id": "REVIL-RU",
   "date": "Jan 2022",
   "actor": "REvil-linked suspects, 14 detained (FSB/MVD raids, aggregate)",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "2",
   "reconstitution_impact": "1",
   "base": "6",
   "coord_bonus": "No",
   "final": "6",
   "category": "LIMITED IMPACT",
   "node_role": "RaaS affiliates/cash-out (Node 09A-adjacent)",
   "dual_log_a1": "Yes",
   "confidence": "CONFIRMED",
   "note": "Unprecedented Russian action; forum shock was real but short-lived. Brand already defunct, so reconstitution unaffected. Outcomes: slow trials, partial releases. Controlled-impunity signature.",
   "track": "strict"
  },
  {
   "op_id": "VASILIEV",
   "date": "Nov 2022",
   "actor": "Mikhail Vasiliev, LockBit affiliate (Canada)",
   "node_criticality": "1",
   "cooperation_output": "2",
   "trust_cascade": "1",
   "reconstitution_impact": "1",
   "base": "5",
   "coord_bonus": "No",
   "final": "5",
   "category": "LIMITED IMPACT",
   "node_role": "Affiliate (Node 06 consumer)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Devices and target lists seized; sentenced ~4 years (Canada, Mar 2024), later extradited to US. No observable effect on LockBit tempo.",
   "track": "strict"
  },
  {
   "op_id": "ASTAMIROV",
   "date": "Jun 2023",
   "actor": "Ruslan Astamirov, LockBit affiliate (US, Arizona)",
   "node_criticality": "1",
   "cooperation_output": "2",
   "trust_cascade": "1",
   "reconstitution_impact": "1",
   "base": "5",
   "coord_bonus": "No",
   "final": "5",
   "category": "LIMITED IMPACT",
   "node_role": "Affiliate",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Guilty plea Jul 2024. Affiliate-tier; no ecosystem cascade.",
   "track": "strict"
  },
  {
   "op_id": "ZOLOTARJOVS",
   "date": "Dec 2023",
   "actor": "Deniss Zolotarjovs, Karakurt cold-case negotiator (Georgia; extradited Aug 2024)",
   "node_criticality": "2",
   "cooperation_output": "2",
   "trust_cascade": "1",
   "reconstitution_impact": "2",
   "base": "7",
   "coord_bonus": "No",
   "final": "7",
   "category": "MODERATE IMPACT",
   "node_role": "Specialist negotiator, Conti lineage (Node 07-adjacent)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Guilty plea Jul 2025, sentenced 8.5y May 2026. Plea materials exposed Karakurt internals incl. reported access to Russian government databases. Karakurt activity faded.",
   "track": "strict"
  },
  {
   "op_id": "SUGAR-RU",
   "date": "Jan 2024",
   "actor": "SugarLocker trio incl. Aleksandr Ermakov (Russia)",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "1",
   "reconstitution_impact": "3",
   "base": "7",
   "coord_bonus": "No",
   "final": "7",
   "category": "MODERATE IMPACT",
   "node_role": "RaaS operators, minor brand (Node 06)",
   "dual_log_a1": "Yes",
   "confidence": "CONFIRMED",
   "note": "Russian domestic. Brand never returned (RI 3) but sentences were suspended (Nov 2024): enforcement theater with real brand-death effect. Dual signal.",
   "track": "strict"
  },
  {
   "op_id": "CRONOS-A1",
   "date": "Feb 2024",
   "actor": "LockBit-affiliated suspect (Poland)",
   "node_criticality": "1",
   "cooperation_output": "2",
   "trust_cascade": "2",
   "reconstitution_impact": "2",
   "base": "7",
   "coord_bonus": "Yes",
   "final": "9",
   "category": "MODERATE IMPACT",
   "node_role": "Affiliate/support",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Back-test row (Doc 13). Operation-level TC/RI; bundling caveat applies.",
   "track": "strict"
  },
  {
   "op_id": "CRONOS-A2",
   "date": "Feb 2024",
   "actor": "LockBit-affiliated operators (Ukraine)",
   "node_criticality": "1",
   "cooperation_output": "2",
   "trust_cascade": "2",
   "reconstitution_impact": "2",
   "base": "7",
   "coord_bonus": "Yes",
   "final": "9",
   "category": "MODERATE IMPACT",
   "node_role": "Affiliates",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Back-test row (Doc 13).",
   "track": "strict"
  },
  {
   "op_id": "ENDGAME-2024",
   "date": "May 2024",
   "actor": "4 arrests, Armenia/Ukraine (Operation Endgame, aggregate)",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "2",
   "reconstitution_impact": "2",
   "base": "7",
   "coord_bonus": "Yes",
   "final": "9",
   "category": "MODERATE IMPACT",
   "node_role": "Loader/botnet operators (Node 05)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Largest anti-botnet action to date; LE follow-up messaging amplified underground concern. Loader ecosystem partially rebuilt (SmokeLoader resurgence preceded Endgame 3.0, Nov 2025).",
   "track": "strict"
  },
  {
   "op_id": "TRAMP-AM",
   "date": "Jun 2024",
   "actor": "Oleg Nefedov (Tramp), Black Basta leader, detained Yerevan ~72h, released/fled",
   "node_criticality": "3",
   "cooperation_output": "1",
   "trust_cascade": "2",
   "reconstitution_impact": "1",
   "base": "7",
   "coord_bonus": "No",
   "final": "7",
   "category": "MODERATE IMPACT",
   "node_role": "RaaS core leader (Node 06)",
   "dual_log_a1": "No",
   "confidence": "CREDIBLE",
   "note": "Near-miss row under the arrest-and-release rule. Leaked chats show internal alarm; episode fed the strife that preceded the Feb 2025 leak. Retention failure converted a potential 10+ into a 7.",
   "track": "strict"
  },
  {
   "op_id": "PANEV",
   "date": "Aug 2024 (arrest) / Mar 2025 (extradition)",
   "actor": "Rostislav Panev, LockBit developer",
   "node_criticality": "2",
   "cooperation_output": "2",
   "trust_cascade": "1",
   "reconstitution_impact": "2",
   "base": "7",
   "coord_bonus": "No",
   "final": "7",
   "category": "MODERATE IMPACT",
   "node_role": "Core developer (Node 06)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Back-test row (Doc 13).",
   "track": "strict"
  },
  {
   "op_id": "PTITSYN",
   "date": "2024 (South Korea); extradited Nov 2024",
   "actor": "Evgenii Ptitsyn, Phobos administrator",
   "node_criticality": "3",
   "cooperation_output": "2",
   "trust_cascade": "1",
   "reconstitution_impact": "2",
   "base": "8",
   "coord_bonus": "No",
   "final": "8",
   "category": "MODERATE IMPACT",
   "node_role": "RaaS admin (Node 06)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Highest-NC custodial arrest in the set. Guilty plea 2026. Phobos/8Base continued under others until Feb 2025 action.",
   "track": "strict"
  },
  {
   "op_id": "CRONOS3",
   "date": "Oct 2024",
   "actor": "4 arrests: suspected LockBit developer (France), BPH admin (Spain, 9 servers), 2 affiliates (UK). Aggregate",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "2",
   "reconstitution_impact": "2",
   "base": "7",
   "coord_bonus": "Yes",
   "final": "9",
   "category": "MODERATE IMPACT",
   "node_role": "Developer + BPH admin + affiliates (Nodes 06/03)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Sustained-pressure phase; simultaneous Khoroshev-linked sanctions. LockBit stayed degraded through 2025.",
   "track": "strict"
  },
  {
   "op_id": "MATVEEV-RU",
   "date": "Nov 2024",
   "actor": "Mikhail Matveev (Wazawaka), Kaliningrad",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "1",
   "reconstitution_impact": "1",
   "base": "5",
   "coord_bonus": "No",
   "final": "5",
   "category": "LIMITED IMPACT",
   "node_role": "Prolific multi-group affiliate/operator (LockBit/Babuk/Hive/Conti)",
   "dual_log_a1": "Yes",
   "confidence": "CONFIRMED",
   "note": "Russian domestic. Outcome: two fines paid, crypto forfeiture, out on bail. The cleanest single-case evidence of controlled impunity: high-value actor, minimal incapacitation.",
   "track": "strict"
  },
  {
   "op_id": "PHOBOS-AETOR",
   "date": "Feb 2025",
   "actor": "4 arrests incl. Berezhnoy and Glebov (Phuket, Thailand); 8Base DLS seized; 27 servers down",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "2",
   "reconstitution_impact": "3",
   "base": "8",
   "coord_bonus": "Yes",
   "final": "10",
   "category": "HIGH ECOSYSTEM IMPACT",
   "node_role": "Phobos/8Base operators (Node 06) + infrastructure",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "First and only HIGH band row. Arrests + simultaneous leak-site and server seizure; 8Base brand never returned. Confirms the coordination thesis: arrests reach HIGH only when paired with infrastructure kill and brand death.",
   "track": "strict"
  },
  {
   "op_id": "BESCIOKOV",
   "date": "Mar 2025",
   "actor": "Aleksej Besciokov, Garantex administrator (Kerala, India)",
   "node_criticality": "3",
   "cooperation_output": "PENDING",
   "trust_cascade": "2",
   "reconstitution_impact": "2",
   "base": "(7+PENDING)",
   "coord_bonus": "Yes",
   "final": "--",
   "category": "PENDING",
   "node_role": "Financial rail: exchange admin (Node 02)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Arrested alongside US/EU Garantex domain seizure and fund freezes. Garantex rebranded (Grinex) at reduced trust. Cooperation PENDING until extradition and proceedings resolve.",
   "track": "strict"
  },
  {
   "op_id": "AEZA-RU",
   "date": "Apr 2025",
   "actor": "Yuri Bozoyan, Arseny Penzev + employees, Aeza Group founders (St. Petersburg)",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "1",
   "reconstitution_impact": "1",
   "base": "5",
   "coord_bonus": "No",
   "final": "5",
   "category": "LIMITED IMPACT",
   "node_role": "BPH leadership (Node 03)",
   "dual_log_a1": "Yes",
   "confidence": "CREDIBLE",
   "note": "Russian domestic. Charges concern darknet drug-market hosting (BlackSprut), not ransomware; Aeza kept operating and was OFAC-sanctioned Jul 2025. Nexus passes via OFAC ransomware-hosting findings; effect on ransomware hosting: nil.",
   "track": "strict"
  },
  {
   "op_id": "VARDANYAN",
   "date": "Apr 2025 (Kyiv); extradited Jun 2025",
   "actor": "Karen Vardanyan, Ryuk initial access specialist",
   "node_criticality": "2",
   "cooperation_output": "PENDING",
   "trust_cascade": "1",
   "reconstitution_impact": "1",
   "base": "(4+PENDING)",
   "coord_bonus": "No",
   "final": "(4+PENDING)",
   "category": "PENDING",
   "node_role": "IAB (Node 04)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "Ryuk long defunct; historical accountability arrest. Pleaded not guilty Jun 2025; cooperation PENDING.",
   "track": "strict"
  },
  {
   "op_id": "VOLKOV",
   "date": "2024 (Italy); sentenced Mar 2026",
   "actor": "Aleksei Volkov, Yanluowang initial access broker",
   "node_criticality": "2",
   "cooperation_output": "2",
   "trust_cascade": "1",
   "reconstitution_impact": "1",
   "base": "6",
   "coord_bonus": "No",
   "final": "6",
   "category": "LIMITED IMPACT",
   "node_role": "IAB (Node 04)",
   "dual_log_a1": "No",
   "confidence": "CREDIBLE",
   "note": "Guilty plea; ~7 years (Mar 2026). Yanluowang defunct since 2022 leak; no live-ecosystem effect.",
   "track": "strict"
  },
  {
   "op_id": "MEDUZA-RU",
   "date": "Oct 2025",
   "actor": "3 suspected Meduza infostealer developers (Russia)",
   "node_criticality": "2",
   "cooperation_output": "1",
   "trust_cascade": "1",
   "reconstitution_impact": "2",
   "base": "6",
   "coord_bonus": "No",
   "final": "6",
   "category": "LIMITED IMPACT",
   "node_role": "Stealer MaaS developers (Node 10)",
   "dual_log_a1": "Yes",
   "confidence": "CREDIBLE",
   "note": "Russian domestic. Rare action against an active MaaS serving the ransomware supply chain; Meduza operations disrupted. Watch for reconstitution; RI provisional.",
   "track": "strict"
  },
  {
   "op_id": "AUDIA6",
   "date": "Jun 10, 2026",
   "actor": "Ruslan Tkachuk and Alexander Ledenev, AudiA6 laundering service admins (arrested Georgia; DOJ charges)",
   "node_criticality": "2",
   "cooperation_output": "PENDING",
   "trust_cascade": "2",
   "reconstitution_impact": "2",
   "base": "(6+PENDING)",
   "coord_bonus": "Yes",
   "final": "--",
   "category": "PENDING",
   "node_role": "Laundering service admins (Node 08/09-adjacent) + Dark2Web forum (Node 07)",
   "dual_log_a1": "No",
   "confidence": "CONFIRMED",
   "note": "FIRST EX-ANTE ROW: scored 2026-06-12, two days post-action (prospective test per Doc 13). ~EUR 336M laundered for ransomware gangs 2022-2025; 25 domains, 30+ servers seized, Telegram blocked. TC provisional (30-day window open); RI provisional, reassess Sep 2026; CO PENDING until proceedings.",
   "track": "strict"
  },
  {
   "op_id": "CHUCKY-RU",
   "date": "Mar 2026",
   "actor": "LeakBase admin 'Chucky' (MVD, Taganrog)",
   "node_criticality": "1",
   "cooperation_output": "1",
   "trust_cascade": "2",
   "reconstitution_impact": "3",
   "base": "7",
   "coord_bonus": "No",
   "final": "7",
   "category": "MODERATE IMPACT",
   "node_role": "Forum admin, ecosystem-adjacent (Node 07 marginal)",
   "dual_log_a1": "Yes",
   "confidence": "CONFIRMED",
   "note": "Russian domestic; dual-logged to A-1. Marginal node criticality under the case-by-case forum rule, but the arrest terminated the relaunch cycle: LeakBase did not reconstitute.",
   "track": "strict"
  }
 ],
 "wais_population": {
  "rule": "Eligibility (Doc 14): (1) Function test: mapped ecosystem role (RaaS core/dev/admin, affiliate, IAB, loader/botnet, BPH, mixer/OTC/exchange/laundering, mule coordination, forum/trust admin, protection layer). (2) Nexus test: activity linked to Russia/CIS-nexus ransomware operations; arrestee nationality irrelevant. (3) Liberty test: arrest, detention, or extradition; indictments/sanctions/doxxing excluded. Window: Jan 2022 onward. Arrest-and-release scores with Cooperation Output 1.",
  "exclusions": "Vasinskyi, Dunaev, Vachon-Desjardins (arrest pre-window); Project Compass / The Com (function/nexus fail, incl. legacy Q4 2025 Com-arrests entry removed on import); DoppelPaymer raids Mar 2023 (custodial arrest unconfirmed); Conti (zero arrests ever recorded). Legacy per-operation WAIS scores from the retired site files (Cronos 10, Khoroshev naming 7, Scattered Spider 6, Magnus 7, 8Base 7, Phobos charges 6, LockBit breach 8, Checkmate 8) are superseded by the Doc 14 per-arrest roster; non-arrest events are tracked as notable events or strife entries, not WAIS rows.",
  "n": 21,
  "distribution": "1 HIGH, 10 MODERATE, 7 LIMITED, 3 PENDING",
  "scored": "2026-06-12"
 },
 "waisd_events": [
  {
   "event": "Conti leak",
   "date": "Feb 2022",
   "nc": 3,
   "iy": 3,
   "tc": 3,
   "ex_ante": 9,
   "outcome_ri": 3,
   "outcome": "Brand dissolved within 90 days; never reconstituted",
   "track": "WAIS-D"
  },
  {
   "event": "QakBot, Op Duck Hunt",
   "date": "Aug 2023",
   "nc": 3,
   "iy": 2,
   "tc": 1,
   "ex_ante": 6,
   "outcome_ri": 2,
   "outcome": "Partial reconstitution 90-180d at 30-40%; original botnet never restored",
   "track": "WAIS-D"
  },
  {
   "event": "BlackCat, DOJ action",
   "date": "Dec 2023",
   "nc": 2,
   "iy": 2,
   "tc": 2,
   "ex_ante": 6,
   "outcome_ri": 1,
   "outcome": "Regained site in 48-72h; brand later died by its own exit scam (Mar 2024)",
   "track": "WAIS-D"
  },
  {
   "event": "LockBit, Op Cronos",
   "date": "Feb 2024",
   "nc": 2,
   "iy": 3,
   "tc": 3,
   "ex_ante": 8,
   "outcome_ri": 2,
   "outcome": "Relaunch in 5 days; degraded ~2 years; 5.0 return Q1 2026 at ~7-8% share",
   "track": "WAIS-D"
  },
  {
   "event": "Black Basta leak",
   "date": "Feb 2025",
   "nc": 3,
   "iy": 3,
   "tc": 3,
   "ex_ante": 9,
   "outcome_ri": 3,
   "outcome": "Inactive by Mar 2025; members migrated to Cactus; no successor brand",
   "track": "WAIS-D"
  }
 ],
 "wais_validation": {
  "status": "Directional pass",
  "detail": "Ex-ante subtotal rank-orders all five outcomes with zero inversions (n=5). See Doc 13.",
  "date": "2026-06-12"
 },
 "historical_quarters": {
  "note": "Imported 2026-06-12 from the legacy per-quarter KPI files. Victim counts in this table follow the ransomware.live / Check Point series; the Leak Site Signals monthly series uses Breachsense. Two independent series, do not mix across them. Payment volume figures marked est. are analyst estimates derived from Chainalysis half-year or annual totals; do not cite as point figures. Legacy per-operation WAIS scores were superseded by the Doc 14 per-arrest roster on import. curated_sample is an analyst-maintained longitudinal case series used for trend corroboration only; it is a small subset and not representative of full ecosystem volume. COUNTING RULE, new brands: this column is a curated count of new RaaS brands reaching operational significance within the mapped Russia/CIS-nexus ecosystem during the quarter (sustained multi-victim posting or active affiliate recruitment), assessed at INDICATIVE confidence. It is deliberately narrower than vendor new-group censuses, which count every distinct leak-site name at first victim post regardless of nexus, scale, or rebrand status (vendor basis: 46 new groups in 2024, 40+ in 2025, per Breachsense/Check Point). Use the vendor census for ecosystem-wide churn; use this column for fragmentation pressure on the targeted ecosystem.",
  "quarters": [
   {
    "quarter": "2024Q1",
    "victims": 1075,
    "victims_source": "ransomware.live",
    "payments_est_musd": 215,
    "payments_note": "est. from Chainalysis H1 2024 total $459.8M",
    "payment_rate_pct": null,
    "median_payment_usd": 250000,
    "median_note": "Coveware Q1 2024 median, 2024 peak (CREDIBLE)",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 2,
     "exit_scams": 0,
     "forum_dispute_pct": 12,
     "new_brands": 1,
     "recruitment_shifts": "yes"
    },
    "takedowns": 1,
    "relaunch_status": "fast (LockBit ~5-7 days)",
    "notable_events": "Operation Cronos (Feb 20); ALPHV terminal decline post-Dec 2023 seizure; RansomHub emergence",
    "curated_sample": null,
    "analyst_note": "Cronos dominated the quarter. LockBit relaunched fast; affiliate defection began."
   },
   {
    "quarter": "2024Q2",
    "victims": 1248,
    "victims_source": "ransomware.live",
    "payments_est_musd": 245,
    "payments_note": "est.; Dark Angels $75M spans Q2/Q3 boundary",
    "payment_rate_pct": null,
    "median_payment_usd": null,
    "median_note": "",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 4,
     "exit_scams": 1,
     "forum_dispute_pct": 22,
     "new_brands": 2,
     "recruitment_shifts": "yes"
    },
    "takedowns": 0,
    "relaunch_status": "n/a",
    "notable_events": "ALPHV exit scam (Mar, ~$22M Change Healthcare ransom); Khoroshev named and sanctioned (May), no arrest; no Russian response",
    "curated_sample": {
     "cases": 21,
     "total_paid_usd": 9664828,
     "median_paid_usd": 170000,
     "top_family": "Data exfiltration"
    },
    "analyst_note": "Khoroshev naming with zero Russian response: protection-layer negative indicator."
   },
   {
    "quarter": "2024Q3",
    "victims": 1257,
    "victims_source": "ransomware.live",
    "payments_est_musd": 200,
    "payments_note": "est. from Chainalysis H2 2024; H2 down 37.5% YoY",
    "payment_rate_pct": null,
    "median_payment_usd": 200000,
    "median_note": "curated sample median",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 3,
     "exit_scams": 0,
     "forum_dispute_pct": 8,
     "new_brands": 3,
     "recruitment_shifts": "no"
    },
    "takedowns": 0,
    "relaunch_status": "n/a",
    "notable_events": "Payments dropped sharply after July; divergence signal emerging; Cicada3301 appeared",
    "curated_sample": {
     "cases": 33,
     "total_paid_usd": 15814836,
     "median_paid_usd": 200000,
     "top_family": "Akira"
    },
    "analyst_note": "Victims flat while payments declining: divergence emerging."
   },
   {
    "quarter": "2024Q4",
    "victims": 1663,
    "victims_source": "ransomware.live (record at time)",
    "payments_est_musd": 154,
    "payments_note": "est.; FY2024 $813.55M, revised ~$892M in Chainalysis 2026 report",
    "payment_rate_pct": 25,
    "median_payment_usd": 110890,
    "median_note": "Coveware Q4 2024, -45% from Q1 peak (CONFIRMED)",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 2,
     "exit_scams": 0,
     "forum_dispute_pct": 5,
     "new_brands": 4,
     "recruitment_shifts": "no"
    },
    "takedowns": 0,
    "relaunch_status": "n/a",
    "notable_events": "Operation Magnus (Redline/Meta stealers, Oct 28): upstream supply-chain action; Matveev arrested in Russia (Nov, Doc 14 row MATVEEV-RU)",
    "curated_sample": {
     "cases": 36,
     "total_paid_usd": 19942518,
     "median_paid_usd": 110890,
     "top_family": "Akira"
    },
    "analyst_note": "Divergence confirmed: record victims, historic-low payment rate (25%)."
   },
   {
    "quarter": "2025Q1",
    "victims": 2289,
    "victims_source": "Check Point Research (Cl0p Cleo bulk listings inflate count)",
    "payments_est_musd": 230,
    "payments_note": "est. from FY2025 ~$820M",
    "payment_rate_pct": null,
    "median_payment_usd": 200000,
    "median_note": "curated sample median",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 5,
     "exit_scams": 0,
     "forum_dispute_pct": 15,
     "new_brands": 5,
     "recruitment_shifts": "yes"
    },
    "takedowns": 1,
    "relaunch_status": "failed (8Base never relaunched)",
    "notable_events": "Operation Phobos Aetor (Feb 11, Doc 14 row PHOBOS-AETOR, the only WAIS HIGH); Cl0p Cleo campaign; DragonForce cartel model announced; SugarLocker arrests context (Doc 14 SUGAR-RU was Jan 2024)",
    "curated_sample": {
     "cases": 35,
     "total_paid_usd": 19892495,
     "median_paid_usd": 200000,
     "top_family": "Qilin"
    },
    "analyst_note": "Record count is Cl0p-distorted; interpret with caution."
   },
   {
    "quarter": "2025Q2",
    "victims": 1607,
    "victims_source": "Check Point Research",
    "payments_est_musd": 220,
    "payments_note": "est.; Coveware reported record average payouts ($1.1M+)",
    "payment_rate_pct": null,
    "median_payment_usd": 600000,
    "median_note": "curated sample median spike, consistent with Coveware record averages",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 6,
     "exit_scams": 0,
     "forum_dispute_pct": 18,
     "new_brands": 4,
     "recruitment_shifts": "yes"
    },
    "takedowns": 0,
    "relaunch_status": "n/a (LockBit panel breach was non-LE)",
    "notable_events": "LockBit affiliate-panel breach (May, non-LE strife event: affiliate identities exposed); DragonForce cartel active; Aeza founders arrested in Russia (Apr, Doc 14 AEZA-RU)",
    "curated_sample": {
     "cases": 27,
     "total_paid_usd": 28251769,
     "median_paid_usd": 600000,
     "top_family": "Akira"
    },
    "analyst_note": "Q1 Cl0p distortion corrected. Fewer but larger payments."
   },
   {
    "quarter": "2025Q3",
    "victims": 1592,
    "victims_source": "Check Point Research",
    "payments_est_musd": 185,
    "payments_note": "est. from FY2025 total",
    "payment_rate_pct": 23,
    "median_payment_usd": 140000,
    "median_note": "curated sample median; Coveware rate 23% (CONFIRMED)",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 4,
     "exit_scams": 0,
     "forum_dispute_pct": 10,
     "new_brands": 6,
     "recruitment_shifts": "yes"
    },
    "takedowns": 1,
    "relaunch_status": "failed (BlackSuit not relaunched)",
    "notable_events": "Operation Checkmate (BlackSuit/Royal-Conti lineage site seizure, Jul); 47 of 85 active groups under 10 victims: peak fragmentation",
    "curated_sample": {
     "cases": 26,
     "total_paid_usd": 9800457,
     "median_paid_usd": 140000,
     "top_family": "Akira"
    },
    "analyst_note": "Fragmentation peak. Conti-lineage pressure continued."
   },
   {
    "quarter": "2025Q4",
    "victims": 2416,
    "victims_source": "Check Point Research (all-time record)",
    "payments_est_musd": 185,
    "payments_note": "est. from FY2025 ~$820M adjusted for H1 weighting",
    "payment_rate_pct": 20,
    "median_payment_usd": 325000,
    "median_note": "Coveware Q4 2025: rate 20% historic low, median $325,000 (CONFIRMED). Legacy file said median $250K; verified Coveware figure wins, discrepancy noted",
    "ru_domestic_actions": 0,
    "strife": {
     "defections": 5,
     "exit_scams": 1,
     "forum_dispute_pct": 12,
     "new_brands": 8,
     "recruitment_shifts": "yes"
    },
    "takedowns": 0,
    "relaunch_status": "n/a",
    "notable_events": "Record victim quarter; Meduza stealer dev arrests in Russia (Oct, Doc 14 MEDUZA-RU); LockBit/Qilin/DragonForce alliance (formed Oct) active. Legacy Com-arrests WAIS entry removed per Doc 14 eligibility rule",
    "curated_sample": {
     "cases": 20,
     "total_paid_usd": 11839769,
     "median_paid_usd": 325000,
     "top_family": "Akira"
    },
    "analyst_note": "Eighth consecutive quarter of zero Russian domestic enforcement against core actors at the time; divergence at maximum: record victims, record-low payment rate."
   },
   {
    "quarter": "2026Q1",
    "victims": 2122,
    "victims_source": "Check Point Research (-12.2% QoQ, second-highest Q1)",
    "payments_est_musd": null,
    "payments_note": "quarterly on-chain figure not public; FY2025 closed at $820M (-8% YoY)",
    "payment_rate_pct": 23,
    "median_payment_usd": 300750,
    "median_note": "Coveware Q1 2026: rate 23%, avg $680,081, median $300,750 (CONFIRMED)",
    "ru_domestic_actions": 1,
    "strife": {
     "defections": 0,
     "exit_scams": 0,
     "forum_dispute_pct": null,
     "new_brands": 4,
     "recruitment_shifts": "consolidation"
    },
    "takedowns": 2,
    "relaunch_status": "RAMP: none through Q1; LeakBase: ~6 days, then terminated by arrest",
    "notable_events": "RAMP seized (Jan 28); LeakBase takedown + MVD arrest of admin (Mar, Doc 14 CHUCKY-RU); consolidation reversal: top 10 groups = 71% of victims",
    "curated_sample": {
     "cases": 19,
     "total_paid_usd": 12921538,
     "median_paid_usd": 300750,
     "top_family": "Akira"
    },
    "analyst_note": "Baseline quarter. First Russian domestic action against an ecosystem-adjacent actor; consolidation reversal underway."
   }
  ]
 },
 "sources": [
  {
   "item": "A-1 Russian domestic actions",
   "value": "1 (LeakBase admin arrest, Taganrog)",
   "source": "MVD via spokesperson Irina Volk; SpyCloud Labs March 2026 update",
   "date": "Mar/Apr 2026",
   "url": "https://spycloud.com/blog/march-2026-cybercrime-update/",
   "confidence": "CONFIRMED"
  },
  {
   "item": "A-1 supporting",
   "value": "leakbase.bz seized by Russian LE before reconstitution",
   "source": "SpyCloud Labs; Europol press release",
   "date": "Mar 2026",
   "url": "https://www.europol.europa.eu/media-press/newsroom/news/major-data-leak-forum-dismantled-in-global-action-against-cybercrime-forum",
   "confidence": "CONFIRMED"
  },
  {
   "item": "B-1b candidate: Project Compass",
   "value": "30 arrests of The Com members; ~180 additional identified",
   "source": "Industry weekly reporting (Senthorus); not yet corroborated by DOJ/Europol press release in this register",
   "date": "Feb/Mar 2026",
   "url": "https://blog.senthorus.ch/posts/03_03_2026",
   "confidence": "CREDIBLE"
  },
  {
   "item": "B-2a consolidation",
   "value": "Top 10 groups = 71.1% of Q1 victims; Qilin 338; LockBit 163; The Gentlemen 166",
   "source": "Check Point Research, State of Ransomware Q1 2026",
   "date": "2026-05-11",
   "url": "https://research.checkpoint.com/2026/the-state-of-ransomware-q1-2026/",
   "confidence": "CREDIBLE"
  },
  {
   "item": "B-2a alliance context",
   "value": "LockBit/Qilin/DragonForce formal operational alliance announced Oct 2025",
   "source": "CybelAngel; Industrial Cyber",
   "date": "Q4 2025 / Q1 2026",
   "url": "https://cybelangel.com/blog/lockbit-qilin-and-dragonforce/",
   "confidence": "CREDIBLE"
  },
  {
   "item": "B-2b exit scams",
   "value": "0 RaaS; 1 attempted forum-level (BreachForums)",
   "source": "SpyCloud Labs March 2026 update",
   "date": "2026-04-10",
   "url": "https://spycloud.com/blog/march-2026-cybercrime-update/",
   "confidence": "CREDIBLE"
  },
  {
   "item": "B-2c new brands",
   "value": "CoinbaseCartel, Bashe, CipherForce, Payload; active groups 58/54/65 by month",
   "source": "Breachsense monthly reports Jan-Mar 2026",
   "date": "Feb-Apr 2026",
   "url": "https://www.breachsense.com/ransomware-reports/march-2026/",
   "confidence": "CREDIBLE"
  },
  {
   "item": "C-1 payment volume FY2025",
   "value": "$820M, -8% YoY; 28% on-chain payment share (all-time low); median demand $59,556",
   "source": "Chainalysis 2026 Crypto Crime Report; The Register summary",
   "date": "2026-02-27",
   "url": "https://www.chainalysis.com/blog/crypto-ransomware-2026/",
   "confidence": "CREDIBLE"
  },
  {
   "item": "C-1b victim count Q1 2026",
   "value": "2,122 (Check Point); 2,165 (Breachsense); 2,405 (Travelers); 2,638 (ReliaQuest); Q4 2025 record 2,416",
   "source": "Multiple independent trackers",
   "date": "Apr-May 2026",
   "url": "https://research.checkpoint.com/2026/the-state-of-ransomware-q1-2026/",
   "confidence": "CONFIRMED (range)"
  },
  {
   "item": "C-2c payment rate",
   "value": "23% Q1 2026 (vs 20% Q4 2025); avg $680,081; median $300,750",
   "source": "Coveware by Veeam, Q1 2026 quarterly report",
   "date": "2026-04-30",
   "url": "https://coveware.com/2026/04/patch-management-goes-from-hard-to-ludicrous-in-the-agentic-ai-era/",
   "confidence": "CONFIRMED (first-hand caseload)"
  },
  {
   "item": "C-2 sector context",
   "value": "Coveware Q1 2026 caseload share: Healthcare 17.6%, Consumer Svcs 15.3%, Prof Svcs 11.8%, Financial 9.4%, Public 7.1%",
   "source": "Coveware by Veeam",
   "date": "2026-04-30",
   "url": "https://coveware.com/2026/04/patch-management-goes-from-hard-to-ludicrous-in-the-agentic-ai-era/",
   "confidence": "CONFIRMED"
  },
  {
   "item": "C-3a monthly series",
   "value": "Jan 2024 - May 2026 monthly victim counts (see Leak Site Signals tab)",
   "source": "Breachsense annual 2025 + monthly reports",
   "date": "Feb-Jun 2026",
   "url": "https://www.breachsense.com/ransomware-reports/",
   "confidence": "CONFIRMED (claimed victims)"
  },
  {
   "item": "C-3c RAMP seizure",
   "value": "FBI/DOJ seizure Jan 28, 2026; no reconstitution through Q1; underground fragmentation",
   "source": "The Register; ZeroFox; Rapid7",
   "date": "Jan-Mar 2026",
   "url": "https://www.theregister.com/2026/01/28/fbi_seizes_ramp_forum/",
   "confidence": "CONFIRMED"
  },
  {
   "item": "C-3c RAMP aftermath",
   "value": "Post-RAMP fragmentation, migration to XSS/Exploit/Telegram",
   "source": "Rapid7",
   "date": "Q1 2026",
   "url": "https://www.rapid7.com/blog/post/tr-post-ramp-allegations-fragmentation-ransomware-underground-rebuild/",
   "confidence": "CREDIBLE"
  },
  {
   "item": "C-3c LeakBase cycle",
   "value": "Seized Mar 3-4; relaunched ~6 days (leakbase.bz); re-seized by Russian LE; admin arrested",
   "source": "SpyCloud Labs; Europol",
   "date": "Mar-Apr 2026",
   "url": "https://spycloud.com/blog/march-2026-cybercrime-update/",
   "confidence": "CONFIRMED"
  },
  {
   "item": "C-3c Tycoon 2FA",
   "value": "Disrupted Mar 4, 2026 (Europol/Microsoft); -41% credential recapture week 1",
   "source": "SpyCloud Labs February 2026 update",
   "date": "2026-03-09",
   "url": "https://spycloud.com/blog/february-2026-cybercrime-update/",
   "confidence": "CREDIBLE"
  },
  {
   "item": "Q2 2026 context (provisional)",
   "value": "Apr 772 / May 646 victims; VPN service used by ~24 ransomware gangs shut down May 21",
   "source": "Breachsense; TechCrunch",
   "date": "May-Jun 2026",
   "url": "https://techcrunch.com/2026/05/21/law-enforcement-shuts-down-vpn-service-used-by-two-dozen-ransomware-gangs/",
   "confidence": "CREDIBLE"
  }
 ]
};
