// Reconstitution Interval dataset
// Instrument: how long the ecosystem takes to heal after public pressure.
// Unit of measurement: the episode-node pair (a "clock"), not the episode and not the brand.
// Published series only: every closed interval rests on a citable, dated artifact.
// Clocks stop ONLY on a dated migration artifact. Assessed absorption without an artifact
// leaves the clock open (censored) with commentary.
// Generated 2026-08-02 from data/scoreboard.json (v1.1) and the ecosystem map monthly record.

window.RECONSTITUTION = {
  meta: {
    title: "Reconstitution Interval",
    version: "1.0",
    asOf: "2026-08-02",
    maturityDays: 90,
    clockClasses: {
      closed: "Migration evident: a dated, citable artifact shows customers moved to a replacement (or that service was never interrupted, interval 0)",
      censored: "No reconstitution observed as of the as-of date; interval is open and shown as a lower bound",
      open: "Under 90 days since action; assessment window still open",
      none: "No clock: court-process, attribution, state-entity, or interception events have nothing to reconstitute"
    }
  },

  lanes: [
    { id: "bph",      label: "Bulletproof Hosting",        group: "Infrastructure" },
    { id: "vpn",      label: "VPN / Proxy Infrastructure", group: "Infrastructure" },
    { id: "crypters", label: "Crypters / Evasion",         group: "Infrastructure" },
    { id: "callers",  label: "Social Engineering / PhaaS", group: "Infrastructure" },
    { id: "stealers", label: "Infostealers",               group: "Malware supply" },
    { id: "loaders",  label: "Loaders / Botnets",          group: "Malware supply" },
    { id: "forums",   label: "Underground Forums",         group: "Community" },
    { id: "datamkt",  label: "Data Markets",               group: "Community" },
    { id: "raas",     label: "RaaS Brands",                group: "Operations" },
    { id: "affiliate",label: "Affiliates",                 group: "Operations" },
    { id: "negot",    label: "Negotiation / IR Interface", group: "Operations" },
    { id: "ruexch",   label: "RU-facing Exchanges",        group: "Financial" },
    { id: "exchl",    label: "Exchange Laundering Venues", group: "Financial" },
    { id: "cex",      label: "Global Exchanges / Issuers", group: "Financial" },
    { id: "a7a5",     label: "A7A5 Stablecoin Rail",       group: "Financial" },
    { id: "mixers",   label: "Mixers / Laundering",        group: "Financial" },
    { id: "mules",    label: "Mule Networks",              group: "Financial" },
    { id: "gru",      label: "State Layer",                group: "State" }
  ],

  // Episode fields:
  //  date          public action date starting the clock (Rule 2). datePrecision "day" | "month"
  //  type          pressure | court | trust | sweep | unattributed
  //  scoreboardRefs  row numbers (n) in data/scoreboard.json
  //  actions       constituent public actions (an episode is a coordinated push, evidenced
  //                by same-window cross-referencing announcements, not mere calendar proximity)
  //  clocks        one per lane touched. class closed | censored | open | none
  //                replacementDays: replacement observably live (Rule 4, first date)
  //                migrationDays:   customers observably moved (Rule 3, stops the clock; feeds the median)
  //                approx: true when the source gives a range or verbal interval
  //  Censored/open ages are computed by the page from date -> meta.asOf, never hardcoded.

  episodes: [

  {
    id: "E01", date: "2021-09-21", datePrecision: "day", name: "Suex designation", type: "pressure",
    scoreboardRefs: [1],
    actions: [ { date: "2021-09-21", desc: "OFAC designates Suex OTC (first exchange designation)", authority: "OFAC", source: "https://home.treasury.gov/news/press-releases/jy0364" } ],
    clocks: [ { lane: "ruexch", target: "Suex", class: "censored",
      evidence: "No successor service; illicit OTC flow assessed consolidated into Garantex, but no dated migration artifact is in the record, so the clock stays open",
      confidence: "Confirmed (event); absorption Assessed" } ],
    commentary: "Service never reconstituted under any brand. Node-level demand absorption by an incumbent (Garantex) is assessed but unsourced to a dated artifact."
  },

  {
    id: "E02", date: "2021-11-08", datePrecision: "day", name: "Chatex designation", type: "pressure",
    scoreboardRefs: [2],
    actions: [ { date: "2021-11-08", desc: "OFAC designates Chatex", authority: "OFAC", source: "https://home.treasury.gov/news/press-releases/jy0471" } ],
    clocks: [ { lane: "ruexch", target: "Chatex", class: "censored",
      evidence: "No successor service observed", confidence: "Confirmed" } ],
    commentary: "Defunct with no successor; demand assessed absorbed inside the node."
  },

  {
    id: "E03", date: "2022-04-05", datePrecision: "day", name: "Hydra Market takedown", type: "pressure",
    scoreboardRefs: [3],
    actions: [ { date: "2022-04-05", desc: "BKA seizes Hydra servers (Germany); OFAC designates Hydra same day", authority: "BKA + OFAC", source: "https://home.treasury.gov/news/press-releases/jy0701" } ],
    clocks: [ { lane: "datamkt", target: "Hydra", class: "closed", migrationDays: 90, approx: true,
      evidence: "Vendor ecosystem fragmented to successor markets (OMG, Mega, Blacksprut) within months of the seizure",
      confidence: "Credible" } ],
    commentary: "Brand kill, node displacement: vendors migrated rather than exiting. Interval approximate; the source gives 'within months'."
  },

  {
    id: "E04", date: "2022-04-05", datePrecision: "day", name: "Garantex designation (2022)", type: "pressure",
    scoreboardRefs: [4],
    actions: [ { date: "2022-04-05", desc: "OFAC designates Garantex (same-day package with Hydra)", authority: "OFAC", source: "https://home.treasury.gov/news/press-releases/jy0701" } ],
    clocks: [ { lane: "ruexch", target: "Garantex", class: "closed", migrationDays: 0,
      evidence: "Service never interrupted; volume roughly doubled post-designation and the exchange operated three more years",
      confidence: "Confirmed" } ],
    commentary: "Canonical designation-only failure. Interval 0: no service interruption to recover from."
  },

  {
    id: "E05", date: "2023-01-26", datePrecision: "day", name: "Hive infrastructure takedown", type: "pressure",
    scoreboardRefs: [5],
    actions: [ { date: "2023-01-26", desc: "FBI/DOJ seize Hive infrastructure after 7 months of covert access", authority: "FBI + DOJ + Europol", source: "https://www.justice.gov/opa/pr/us-department-justice-disrupts-hive-ransomware-variant" } ],
    clocks: [ { lane: "raas", target: "Hive", class: "closed", replacementDays: 270, migrationDays: 270, approx: true,
      evidence: "Rebrand as Hunters International observed late 2023, roughly 9 months after seizure",
      confidence: "Credible" } ],
    commentary: "Brand dead 3.5 years; lineage wound down Jul 2025. The 9-month rebrand interval is among the longest closed RaaS intervals on record."
  },

  {
    id: "E06", date: "2023-08-29", datePrecision: "day", name: "Operation Duck Hunt (Qakbot)", type: "pressure",
    scoreboardRefs: [6],
    actions: [ { date: "2023-08-29", desc: "FBI-led international takedown of the Qakbot botnet", authority: "FBI + DOJ + Europol", source: "https://www.justice.gov/opa/pr/qakbot-malware-disrupted-international-cyber-takedown" } ],
    clocks: [ { lane: "loaders", target: "Qakbot", class: "closed", migrationDays: 90, approx: true,
      evidence: "Operator activity resumed ~3 months later (Dec 2023 spam-bomb pivot); original botnet never rebuilt",
      confidence: "Confirmed" } ],
    commentary: "Operators reconstituted activity, not the botnet: pivot rather than rebuild."
  },

  {
    id: "E07", date: "2023-12-19", datePrecision: "day", name: "ALPHV/BlackCat site seizure", type: "pressure",
    scoreboardRefs: [7],
    actions: [ { date: "2023-12-19", desc: "FBI seizes ALPHV leak site; decryptor released", authority: "FBI + DOJ", source: "https://www.justice.gov/opa/pr/justice-department-disrupts-prolific-alphvblackcat-ransomware-variant" } ],
    clocks: [ { lane: "raas", target: "ALPHV", class: "closed", replacementDays: 0, migrationDays: 0,
      evidence: "Site unseized within hours; group continued operating immediately",
      confidence: "Confirmed" } ],
    commentary: "The seizure itself produced a near-zero interval. Brand death came ~10 weeks later by exit scam (Mar 2024), an internal-trust collapse, with worst-case affiliate dispersal to RansomHub and Qilin."
  },

  {
    id: "E08", date: "2024-02-20", datePrecision: "day", name: "Operation Cronos (LockBit)", type: "pressure",
    scoreboardRefs: [8],
    actions: [ { date: "2024-02-20", desc: "Multi-phase takedown: infrastructure, arrests, sanctions, indictments; Khoroshev unmasked May 2024", authority: "NCA + FBI + Europol + 10 countries", source: "https://www.nationalcrimeagency.gov.uk/news/lockbit-leader-unmasked-and-sanctioned" } ],
    clocks: [ { lane: "raas", target: "LockBit", class: "closed", replacementDays: 5, migrationDays: 345, approx: true,
      evidence: "Leak site relaunched in 5 days but largely cosmetic (~80% of post-takedown posts illegitimate, Trend Micro); real capability rebuild only at LockBit 4.0, ~11.5 months",
      confidence: "Confirmed" } ],
    commentary: "The flagship trust-damage gap: replacement live in 5 days, migration evident only at ~345 days. The 340-day gap is measurable trust destruction."
  },

  {
    id: "E09", date: "2024-05-27", datePrecision: "day", name: "Operation Endgame phase 1", type: "pressure",
    scoreboardRefs: [9],
    actions: [ { date: "2024-05-27", desc: "Largest-ever botnet operation: IcedID, Pikabot, Bumblebee, SystemBC, Smokeloader", authority: "Europol + Eurojust + partners", source: "https://www.europol.europa.eu/media-press/newsroom/news/largest-ever-operation-against-botnets-hits-dropper-malware-ecosystem" } ],
    clocks: [
      { lane: "loaders", target: "IcedID / Pikabot", class: "censored",
        evidence: "No rebuild observed for either family since action", confidence: "Confirmed" },
      { lane: "loaders", target: "Bumblebee / SystemBC / Smokeloader", class: "closed", migrationDays: 270, approx: true,
        evidence: "Families returned and were re-targeted during 2025; no precise return date in the record",
        confidence: "Assessed" }
    ],
    commentary: "Mixed outcome inside one lane: two families dead, three reconstituted. Split clocks preserve the split."
  },

  {
    id: "E10", date: "2024-09-26", datePrecision: "day", name: "Cryptex / PM2BTC / UAPS action", type: "pressure",
    scoreboardRefs: [10],
    actions: [ { date: "2024-09-26", desc: "Coordinated US action + 96 arrests in Russia (targets harmed Russian interests)", authority: "OFAC + DOJ + USSS + FinCEN", source: "https://home.treasury.gov/news/press-releases/jy2616" } ],
    clocks: [ { lane: "ruexch", target: "Cryptex / PM2BTC / UAPS", class: "censored",
      evidence: "No successor of comparable scale identified in 22 months", confidence: "Confirmed" } ],
    commentary: "Strongest financial-infrastructure outcome on the board; the exception that proves the safe-harbor rule (Russia prosecuted because Russian interests were harmed)."
  },

  {
    id: "E11", date: "2024-10-25", datePrecision: "day", name: "REvil domestic prosecutions (Russia)", type: "court",
    scoreboardRefs: [11],
    actions: [ { date: "2024-10-25", desc: "Russian court verdicts, two waves; time-served releases followed", authority: "Russia (domestic)", source: "https://therecord.media/revil-hackers-sentenced-russia" } ],
    clocks: [ { lane: "raas", target: "REvil", class: "none",
      evidence: "Group defunct since Jan 2022 FSB raids; nothing to reconstitute", confidence: "Confirmed" } ],
    commentary: "Court-process event, no clock. Deterrent effect assessed minimal; confirms the selective safe-harbor model."
  },

  {
    id: "E12", date: "2025-02-10", datePrecision: "day", name: "Operation Phobos Aetor (+ Ptitsyn track)", type: "pressure",
    scoreboardRefs: [12],
    actions: [ { date: "2025-02-10", desc: "8Base infrastructure seized; Phuket arrests; Ptitsyn extradited and later pleads guilty", authority: "DOJ + Europol + Thai police + partners", source: "https://www.justice.gov/opa/pr/phobos-ransomware-affiliates-arrested-coordinated-international-disruption" } ],
    clocks: [ { lane: "raas", target: "Phobos / 8Base", class: "censored",
      evidence: "8Base leak site never returned; no reconstitution in 17+ months with admin and affiliates in custody",
      confidence: "Confirmed" } ],
    commentary: "Most complete disruption on the board: admin + affiliates + infrastructure. The censored interval here is the success signature: personnel exposure prevents the clock from ever stopping."
  },

  {
    id: "E13", date: "2025-02-11", datePrecision: "day", name: "Zservers designation + Dutch seizure", type: "pressure",
    scoreboardRefs: [13],
    actions: [ { date: "2025-02-11", desc: "Trilateral sanctions + Dutch seizure of 127 servers (Amsterdam)", authority: "OFAC + UK OFSI + AU DFAT + Dutch Police", source: "https://therecord.media/dutch-police-take-down-127-servers-sanctioned-host" } ],
    clocks: [ { lane: "bph", target: "Zservers / XHost", class: "censored",
      evidence: "No confirmed successor in 17+ months; demand assessed absorbed by other BPH providers, but no dated migration artifact in the record",
      confidence: "Confirmed (no-successor Credible)" } ],
    commentary: "Closest thing to a BPH kill; physical seizure was decisive. Absorption by the node is assessed but unartifacted, so the clock stays open rather than reporting displacement."
  },

  {
    id: "E14", date: "2025-02-20", datePrecision: "day", name: "Black Basta chat leak", type: "trust",
    scoreboardRefs: [14],
    actions: [ { date: "2025-02-20", desc: "Internal chat corpus leaked; no law-enforcement action; Jan 2026 follow-on actions", authority: "None (internal collapse)", source: "https://www.bleepingcomputer.com/news/security/black-basta-ransomware-gang-s-internal-chat-logs-leak-online/" } ],
    clocks: [ { lane: "raas", target: "Black Basta", class: "censored",
      evidence: "Brand never recovered; last leak-site victim Jan 2025", confidence: "Confirmed (dispersal Credible)" } ],
    commentary: "Trust-destruction episode with zero enforcement action, retained as a control case: internal collapse produced a longer interval than most takedowns."
  },

  {
    id: "E15", date: "2025-03-06", datePrecision: "day", name: "Garantex takedown", type: "pressure",
    scoreboardRefs: [15],
    actions: [ { date: "2025-03-06", desc: "Domain/server seizure + indictments + Tether freeze ($23-28M); Besciokov arrested in India", authority: "USSS + DOJ + BKA + Finland + Dutch FIOD + Europol + Tether", source: "https://www.chainalysis.com/blog/russian-exchange-garantex-dismantled/" } ],
    clocks: [ { lane: "ruexch", target: "Garantex", class: "closed", replacementDays: 13, migrationDays: 3,
      evidence: "Absorption flows to Rapira observed from day 3 (TRM); funded successor Grinex live in under 13 days with customer balances restored via A7A5 burn/remint (Global Ledger)",
      confidence: "Confirmed" } ],
    commentary: "Fastest well-documented node reconstitution on record. Migration artifact (day 3) precedes the dedicated replacement (day 13): absorption by an incumbent venue, then a purpose-built successor."
  },

  {
    id: "E16", date: "2025-04-01", datePrecision: "month", name: "Aeza pressure sequence", type: "pressure",
    scoreboardRefs: [16],
    actions: [
      { date: "2025-04-01", desc: "Russian arrests of Aeza leadership (BlackSprut hosting case)", authority: "Russia (domestic)", source: "https://home.treasury.gov/news/press-releases/sb0185" },
      { date: "2025-07-01", desc: "OFAC designates Aeza Group", authority: "OFAC", source: "https://home.treasury.gov/news/press-releases/sb0185" },
      { date: "2025-11-19", desc: "Evasion shells designated (Hypercore, Smart Digital Ideas, Datavice)", authority: "OFAC + NCA", source: "https://home.treasury.gov/news/press-releases/sb0319" }
    ],
    clocks: [ { lane: "bph", target: "Aeza", class: "closed", clockDate: "2025-07-01", migrationDays: 21, approx: true,
      evidence: "IP space shifted to Hypercore (UK, AS211522) ~3 weeks after the OFAC designation (Silent Push)",
      confidence: "Confirmed" } ],
    commentary: "Clock anchored on the OFAC designation, the action that produced the observable shift. Leadership decapitated domestically yet the network persisted via shell rotation: personnel exposure in a non-cooperative jurisdiction did not lengthen the interval."
  },

  {
    id: "E17", date: "2025-05-09", datePrecision: "day", name: "eXch seizure", type: "pressure",
    scoreboardRefs: [17],
    actions: [ { date: "2025-05-09", desc: "German seizure of the eXch mixer front end", authority: "BKA + Dutch FIOD", source: "https://www.bleepingcomputer.com/news/security/police-seizes-exch-cryptocurrency-exchange-used-by-ransomware-gangs/" } ],
    clocks: [ { lane: "mixers", target: "eXch", class: "closed", migrationDays: 3, approx: true,
      evidence: "API-level activity resumed ~3 days after front-end shutdown (TRM)", confidence: "Confirmed" } ],
    commentary: "Zombie state: the visible service died, the laundering function did not."
  },

  {
    id: "E18", date: "2025-05-20", datePrecision: "day", name: "Stark Industries EU designation", type: "pressure",
    scoreboardRefs: [18],
    actions: [ { date: "2025-05-20", desc: "EU designates Stark Industries Solutions", authority: "EU Council", source: "https://www.consilium.europa.eu/en/press/press-releases/" } ],
    clocks: [ { lane: "bph", target: "Stark Industries", class: "closed", migrationDays: 0,
      evidence: "Evasion pre-positioned after the designation leaked ~12 days early; no service interruption",
      confidence: "Confirmed" } ],
    commentary: "Interval 0 by pre-positioning: the designation process itself leaked the timing. Compare E28 (the later physical seizure)."
  },

  {
    id: "E19", date: "2025-05-21", datePrecision: "day", name: "LummaC2 takedown", type: "pressure",
    scoreboardRefs: [19],
    actions: [ { date: "2025-05-21", desc: "~2,300 domain seizures", authority: "DOJ + FBI + Microsoft DCU + Europol + JC3", source: "https://www.justice.gov/opa/pr/justice-department-seizes-domains-behind-major-information-stealing-malware-operation" } ],
    clocks: [ { lane: "stealers", target: "LummaC2", class: "closed", replacementDays: 1, migrationDays: 30, approx: true,
      evidence: "3 replacement domains live within a day; new campaigns within weeks (Jun-Jul 2025); near pre-takedown volume by late summer 2025",
      confidence: "Confirmed (volume recovery Credible)" } ],
    commentary: "No-custody takedown, full reconstitution: by Mar 2026 Lumma assessed fully reconstituted, and by Jul 2026 assessed to lead 2026 distribution. Operators were personally designated Jul 2026 (E33) with no observed effect on operations to date."
  },

  {
    id: "E20", date: "2025-05-22", datePrecision: "day", name: "Operation Endgame 2.0", type: "pressure",
    scoreboardRefs: [20],
    actions: [ { date: "2025-05-22", desc: "DanaBot takedown with full attribution; 16 named", authority: "DOJ + FBI + Europol + partners", source: "https://www.justice.gov/opa/pr/16-defendants-charged-connection-danabot-malware-scheme" } ],
    clocks: [ { lane: "loaders", target: "DanaBot", class: "censored",
      evidence: "No resurgence in 14+ months; indictment naming with developers still free", confidence: "Confirmed" } ],
    commentary: "Best malware outcome achieved without arrests: full attribution alone suppressed the rebuild."
  },

  {
    id: "E21", date: "2025-07-10", datePrecision: "day", name: "UK retail attack arrests", type: "court",
    scoreboardRefs: [21],
    actions: [ { date: "2025-07-10", desc: "NCA arrests DragonForce deployers (UK retail attacks)", authority: "NCA + CPS", source: "https://www.nationalcrimeagency.gov.uk/news/" } ],
    clocks: [ { lane: "affiliate", target: "DragonForce deployers", class: "none",
      evidence: "Personnel action against Western affiliates; no service to reconstitute", confidence: "Confirmed" } ],
    commentary: "Demonstrates jurisdictional leverage over the Western affiliate layer; marker only."
  },

  {
    id: "E22", date: "2025-07-22", datePrecision: "day", name: "XSS.is seizure + admin arrest", type: "pressure",
    scoreboardRefs: [22],
    actions: [ { date: "2025-07-22", desc: "Forum seized; administrator arrested in Ukraine", authority: "France (BL2C) + SBU + Europol", source: "https://www.europol.europa.eu/media-press/newsroom/news" } ],
    clocks: [ { lane: "forums", target: "XSS.is", class: "censored", replacementDays: 1,
      evidence: "Tor mirror live in ~1 day under unknown administration, but honeypot suspicion collapsed engagement; no artifact shows the user base returned",
      confidence: "Confirmed (engagement collapse Credible)" } ],
    commentary: "Inverse of the LockBit pattern: replacement immediate, migration never evidenced. The open clock with a live replacement IS the trust-damage measurement."
  },

  {
    id: "E23", date: "2025-07-24", datePrecision: "day", name: "Operation Checkmate (BlackSuit)", type: "pressure",
    scoreboardRefs: [23],
    actions: [ { date: "2025-07-24", desc: "BlackSuit infrastructure seized", authority: "DOJ + HSI + partners", source: "https://www.justice.gov/opa/pr/" } ],
    clocks: [ { lane: "raas", target: "BlackSuit", class: "closed", replacementDays: 0, migrationDays: 0, approx: true,
      evidence: "Successor Chaos pre-positioned since ~Feb 2025; rebrand pre-dated the takedown",
      confidence: "Confirmed (Chaos attribution Credible)" } ],
    commentary: "Interval 0 by pre-positioning. Successor materially smaller; Iranian MuddyWater ran false-flag Chaos operations early 2026; Chaos still active Jul 2026."
  },

  {
    id: "E24", date: "2025-08-14", datePrecision: "day", name: "A7 / A7A5 sanctions campaign", type: "pressure",
    scoreboardRefs: [24],
    actions: [
      { date: "2025-08-14", desc: "First A7A5 designations (5-package campaign, Aug 2025 to May 2026)", authority: "UK OFSI + OFAC + EU Council", source: "https://www.gov.uk/government/news/" },
      { date: "2026-04-15", datePrecision: "month", desc: "EU 20th package: Meer operator TengriCoin designated; full RU/BY crypto-platform ban", authority: "EU Council", source: "https://www.consilium.europa.eu/en/press/press-releases/" },
      { date: "2026-05-26", desc: "UK A7 network package: 18 designations under Regulation 17A", authority: "UK OFSI", source: "https://www.gov.uk/government/news/" }
    ],
    clocks: [ { lane: "a7a5", target: "A7A5 token", class: "closed", migrationDays: 1,
      evidence: "~80% of A7A5 supply burned and reminted to non-designated wallets 1 day after the Aug 2025 designations",
      confidence: "Confirmed" } ],
    commentary: "1-day interval on the rail itself; the campaign's real effect is slower venue compression (Grinex gone, trading concentrated on Meer.kg), tracked in E27 and E31."
  },

  {
    id: "E25", date: "2025-11-13", datePrecision: "day", name: "Operation Endgame 3.0", type: "pressure",
    scoreboardRefs: [25],
    actions: [ { date: "2025-11-13", desc: "Rhadamanthys, VenomRAT, Elysium infrastructure dismantled", authority: "Europol + partners", source: "https://www.europol.europa.eu/media-press/newsroom/news" } ],
    clocks: [ { lane: "stealers", target: "Rhadamanthys", class: "censored",
      evidence: "Reduced to residual trickle with no rebuild in 8+ months; customer rotation to Vidar reported but without a dated artifact, so the clock stays open",
      confidence: "Confirmed (rotation Credible)" } ],
    commentary: "One of the stronger malware kills. Node-level demand rotated to Vidar per industry reporting; without a dated migration artifact the published clock does not stop."
  },

  {
    id: "E26", date: "2025-11-19", datePrecision: "day", name: "Media Land designations", type: "pressure",
    scoreboardRefs: [26],
    actions: [ { date: "2025-11-19", desc: "Trilateral sanctions incl. pre-emptive designation of evasion shells (Volosovik, Zatolokin, Pankova; Media Land LLC + shells)", authority: "OFAC + UK OFSI + AU DFAT", source: "https://home.treasury.gov/news/press-releases/sb0319" } ],
    clocks: [ { lane: "bph", target: "Media Land", class: "closed", migrationDays: 0,
      evidence: "No service interruption observed; upstream peers held through the designation window (map monthly record, Jul 2026: peers hold through sanctions, indictment, and EU designation)",
      confidence: "Credible" } ],
    commentary: "Sanctions-only, no seizure, no arrests; several designated shells were incorporated Jul 2025, pre-built evasion. Escalated Jul 2026 by indictment + $10M reward (E33). Interval 0: nothing was interrupted."
  },

  {
    id: "E27", date: "2026-01-28", datePrecision: "day", name: "RAMP forum seizure", type: "pressure",
    scoreboardRefs: [],
    actions: [ { date: "2026-01-28", desc: "FBI seizes the RAMP forum", authority: "FBI", source: null, sourceNote: "Map monthly record; primary seizure notice to be attached" } ],
    clocks: [ { lane: "forums", target: "RAMP", class: "censored", replacementDays: 70,
      evidence: "T1erOne emerged as a successor candidate ~Apr 2026 but no migration artifact followed; RAMP dark past 184 days; administrator publicly declined reconstitution (Jul 2026)",
      confidence: "Confirmed (successor emergence Credible)" } ],
    commentary: "The anomaly of 2026: forum-layer reconstitution historically runs 60-90 days, and the prior benchmark (XSS mirror) was ~1 day. An admin publicly declining to rebuild is a new behavior class."
  },

  {
    id: "E28", date: "2026-03-03", datePrecision: "day", name: "Operation Leak (LeakBase)", type: "pressure",
    scoreboardRefs: [],
    actions: [ { date: "2026-03-03", desc: "LeakBase dismantled (Mar 3-4)", authority: "FBI + Europol", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "datamkt", target: "LeakBase", class: "censored",
      evidence: "Not reconstituted at ~90 days (Jun 2026 observation); nothing observed since",
      confidence: "Confirmed" } ],
    commentary: "Second data-point in the durable forum/market-layer non-reconstitution pattern alongside RAMP."
  },

  {
    id: "E29", date: "2026-03-26", datePrecision: "day", name: "Xinbi marketplace designation", type: "pressure",
    scoreboardRefs: [],
    actions: [ { date: "2026-03-26", desc: "UK sanctions the Xinbi marketplace ($19.9B in transactions)", authority: "UK OFSI", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "cex", target: "Xinbi", class: "open",
      evidence: "No reconstitution observation recorded in the corpus either way", confidence: "Confirmed (event)" } ],
    commentary: "Retained for lane completeness; assessment window has produced no recorded observation."
  },

  {
    id: "E30", date: "2026-04-15", datePrecision: "day", name: "Grinex drain + suspension", type: "unattributed",
    scoreboardRefs: [27],
    actions: [ { date: "2026-04-15", desc: "Unattributed wallet drain (~$13.7-15M) and suspension; Chainalysis flags possible insider exit scam or false flag", authority: "Unattributed", source: "https://www.chainalysis.com/blog/sanctioned-grinex-exchange-suspends-operations/" } ],
    clocks: [ { lane: "ruexch", target: "Grinex", class: "closed", migrationDays: 1, approx: true,
      evidence: "A7A5 trading concentrated on Meer.kg immediately (Chainalysis)", confidence: "Confirmed event; attribution unresolved" } ],
    commentary: "Included with an unattributed flag: whatever the cause, the node's healing behavior is the measurement. Third consecutive near-instant reconstitution in the RU-exchange lane."
  },

  {
    id: "E31", date: "2026-05-15", datePrecision: "month", name: "Operation Saffron (First VPN dismantle)", type: "pressure",
    scoreboardRefs: [],
    actions: [ { date: "2026-05-15", desc: "First VPN dismantled: 33 servers in 27 countries; 506 users identified", authority: "Europol + partners", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "vpn", target: "First VPN", class: "open",
      evidence: "No reconstitution observation in the record; OFAC designated the service and its administrator Jul 13 (E33); FBI Operation Riptide named it a target Jun 9-10",
      confidence: "Confirmed (event)" } ],
    commentary: "Repeated pressure on one target across three months: dismantle (May), campaign naming (Jun), designation (Jul). The lane view shows the stacking."
  },

  {
    id: "E32", date: "2026-05-22", datePrecision: "day", name: "Stark network server seizure (NL)", type: "pressure",
    scoreboardRefs: [28],
    actions: [ { date: "2026-05-22", desc: "Dutch FIOD seizes ~800 servers (Dronten, Schiphol-Rijk); 2 arrests incl. a company director", authority: "Dutch FIOD", source: "https://www.greynoise.io/blog/stark-industries-shell-game" } ],
    clocks: [ { lane: "bph", target: "Stark lineage (THE.Hosting)", class: "closed", migrationDays: 0,
      evidence: "Attack traffic on AS209847 continued at normal daily rates through the raid (GreyNoise)",
      confidence: "Confirmed (traffic continuity Credible)" } ],
    commentary: "First kinetic action against the network after the sanctions failure (E18). Interval 0 on traffic continuity; successor signal (WorkTitans B.V., ASN migration) under watch. Too recent for full assessment."
  },

  {
    id: "E33", date: "2026-06-10", datePrecision: "day", name: "AudiA6 takedown", type: "pressure",
    scoreboardRefs: [29],
    actions: [ { date: "2026-06-10", desc: "AudiA6 laundering service + Dark2Web forum dismantled: EUR 336M laundered, 2 admins arrested, 6,000+ KYC mule accounts exposed", authority: "USSS + Europol + partners", source: "https://www.europol.europa.eu/media-press/newsroom/news" } ],
    clocks: [
      { lane: "mixers", target: "AudiA6", class: "open",
        evidence: "No successor reported at 7+ weeks post-action", confidence: "Confirmed" },
      { lane: "mules", target: "AudiA6 mule network", class: "open",
        evidence: "6,000+ KYC accounts exposed; rebuild not observed", confidence: "Confirmed" }
    ],
    commentary: "Provisional kill: arrests plus mule-infrastructure seizure make rebuild hard. Window still open."
  },

  {
    id: "E34", date: "2026-06-24", datePrecision: "day", name: "Operation Endgame 2026 phase", type: "pressure",
    scoreboardRefs: [30],
    actions: [ { date: "2026-06-24", desc: "StealC, Amadey, SocGholish infrastructure dismantled (loader front end hit Jun 15-24)", authority: "Europol + partners", source: "https://www.europol.europa.eu/media-press/newsroom/news" } ],
    clocks: [
      { lane: "stealers", target: "StealC", class: "open",
        evidence: "No resurgence reported as of 2026-07-24 (1 month post-action)", confidence: "Confirmed" },
      { lane: "loaders", target: "Amadey / SocGholish", class: "open",
        evidence: "No resurgence reported as of 2026-07-24", confidence: "Confirmed" }
    ],
    commentary: "Fourth Endgame phase; window open."
  },

  {
    id: "E35", date: "2026-07-02", datePrecision: "day", name: "NetNut proxy disruption", type: "pressure",
    scoreboardRefs: [],
    actions: [ { date: "2026-07-02", desc: "NetNut residential proxy network disrupted (Jul 2-3): 2M devices cut off", authority: "Not recorded", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "vpn", target: "NetNut", class: "open",
      evidence: "No reconstitution observation yet", confidence: "Confirmed (event)" } ],
    commentary: "Window open."
  },

  {
    id: "E36", date: "2026-07-08", datePrecision: "day", name: "Vardanyan guilty plea (Ryuk)", type: "court",
    scoreboardRefs: [31],
    actions: [ { date: "2026-07-08", desc: "Ryuk deployer pleads guilty; custody via Ukraine extradition channel", authority: "DOJ", source: "https://www.justice.gov/opa/pr/" } ],
    clocks: [ { lane: "raas", target: "Ryuk lineage", class: "none",
      evidence: "Lineage defunct since 2020-2022; nothing to reconstitute", confidence: "Confirmed" } ],
    commentary: "Court-process marker."
  },

  {
    id: "E37", date: "2026-07-09", datePrecision: "day", name: "INTERPOL First Light 2026", type: "sweep",
    scoreboardRefs: [],
    actions: [ { date: "2026-07-09", desc: "$293M intercepted; 31,014 bank accounts blocked", authority: "INTERPOL + members", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "mules", target: "Mule accounts (global)", class: "none",
      evidence: "Interception sweep; account-level attrition has no single service to reconstitute", confidence: "Confirmed (event)" } ],
    commentary: "Sweep marker: pressure on the mule lane without a reconstitution clock."
  },

  {
    id: "E38", date: "2026-07-10", datePrecision: "day", name: "Martino sentencing (negotiator compromise)", type: "court",
    scoreboardRefs: [],
    actions: [ { date: "2026-07-10", desc: "Negotiation-side insider sentenced to 70 months", authority: "DOJ", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "negot", target: "Insider-compromise vector", class: "none",
      evidence: "Court-process event", confidence: "Confirmed (event)" } ],
    commentary: "Proves the negotiator-side compromise vector; marker only."
  },

  {
    id: "E39", date: "2026-07-13", datePrecision: "day", name: "Joint US-EU-UK enabler-layer package", type: "pressure",
    scoreboardRefs: [32, 33, 34],
    actions: [
      { date: "2026-07-13", desc: "EU-UK joint sanctions: Lumma operators (Voronin, Gordienko, Zhurkin) personally designated; Kovalev designated and publicly named as Stern; GRU Unit 29155 individuals + LLC Impuls; EU designates Media Land LLC and ML.Cloud; UK 24 names, EU 9+4 (largest EU cyber package)", authority: "EU Council + UK OFSI", source: "https://www.consilium.europa.eu/en/press/press-releases/2026/07/13/russian-cyber-attacks-and-destabilising-activities-council-sanctions-nine-individuals-and-four-entities/" },
      { date: "2026-07-13", desc: "OFAC designates First VPN Service (1VPNS) + administrator Rashevskyi; first-ever crypter-vendor designation (Silayev)", authority: "OFAC + UK OFSI", source: "https://home.treasury.gov/news/press-releases/sb0559" },
      { date: "2026-07-14", desc: "N.D. Ohio indictment unsealed (Volosovik, Zatolokin, Pankova; Media Land LLC; ML.Cloud LLC) + Rewards for Justice up to $10M with explicit state-nexus ask", authority: "DOJ + FBI + State RFJ", source: "https://www.justice.gov/opa/pr/three-russian-nationals-and-two-companies-indicted-international-cybercrimes-resulting-more" }
    ],
    clocks: [
      { lane: "bph", target: "Media Land", class: "open",
        evidence: "No service interruption observed to date; upstream transit peers holding (map monthly record). Watch case for finding 10 of the scoreboard",
        confidence: "Credible" },
      { lane: "vpn", target: "First VPN (1VPNS)", class: "open",
        evidence: "Designation follows the May dismantle (E31); no post-designation observation yet", confidence: "Confirmed (event)" },
      { lane: "crypters", target: "Crypter vendor (Silayev)", class: "open",
        evidence: "First designation in this lane; no baseline exists", confidence: "Confirmed (event)" },
      { lane: "stealers", target: "Lumma operators", class: "open",
        evidence: "Service already fully reconstituted from the 2025 takedown; designation targets the operators, not infrastructure. Lumma assessed to lead 2026 distribution as of Jul 2026",
        confidence: "Confirmed" },
      { lane: "raas", target: "Stern attribution (Kovalev)", class: "none",
        evidence: "Attribution strike at the command layer: first public moniker-to-name attribution by a government. Nothing to reconstitute; effect channel is trust and mobility, not infrastructure", confidence: "Confirmed" },
      { lane: "gru", target: "GRU Unit 29155 / LLC Impuls", class: "none",
        evidence: "State entities do not reconstitute; marker", confidence: "Confirmed" }
    ],
    commentary: "One episode, six lanes, four announcements across two days, cross-referencing each other and sharing targets: the model case for coordination-evidenced episode construction. Every clock open; the Media Land lane is the announced test of whether indictment + bounty outperforms the sanctions-only baseline (E26, interval 0)."
  },

  {
    id: "E40", date: "2026-07-20", datePrecision: "day", name: "Operation Olympus Blade (Kratos PhaaS)", type: "pressure",
    scoreboardRefs: [],
    actions: [ { date: "2026-07-20", desc: "Kratos/Sneaky2FA phishing-as-a-service taken down; developer arrested", authority: "Not fully recorded", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "callers", target: "Kratos / Sneaky2FA", class: "open",
      evidence: "Developer in custody; per the personnel-exposure pattern (scoreboard finding 8), a long or unending interval is expected", confidence: "Confirmed (event)" } ],
    commentary: "Window open; custody component present."
  },

  {
    id: "E41", date: "2026-07-15", datePrecision: "month", name: "Tether/CBI issuer freeze", type: "pressure",
    scoreboardRefs: [],
    actions: [ { date: "2026-07-15", desc: "Tether freezes 131M USDT; issuer-level designate-then-freeze proven at nine-figure scale", authority: "Tether (private) + designating authorities", source: null, sourceNote: "Map monthly record; primary release to be attached" } ],
    clocks: [ { lane: "cex", target: "Frozen USDT balances", class: "none",
      evidence: "Frozen funds are terminal; no reconstitution semantics", confidence: "Confirmed (event)" } ],
    commentary: "Financial-terminal marker: the designate-then-freeze sequence, not a takedown."
  }

  ]
};
