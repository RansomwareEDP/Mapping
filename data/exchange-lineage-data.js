// Exchange Lineage Explorer, DATA FILE
// Scope: RU/CIS-linked exchange succession, sourced from official records (OFAC, OFSI, DOJ, EU, Ukraine NSDC)
// plus labeled vendor reporting (Elliptic, TRM, Chainalysis, Global Ledger, Kharon).
// This is the ONLY file to edit for data updates. The explorer page reads it automatically.
// Structure: meta (title, range), vocab (node types, statuses, edge types, confidence, event types),
//            networks (lane labels), nodes, edges, events.
// Dates: "YYYY-MM" for node lifespans, "YYYY-MM" or "YYYY-MM-DD" for events. approx:true = start date unconfirmed.
// Every edge carries confidence: confirmed (official record) | credible (strong vendor evidence) | reported (single-source or co-location only).
// seed = entity key in Collection Layer OPEN/exchange-watch/exchange_seed.csv (S12 roster join key).
// Built 5 Sep 2026. v1.
// NAME-COLLISION GUARDS (verified 5 Sep 2026, do not conflate):
//   Cryptex24.io is NOT Cryptex.net (the sanctioned exchange). Cryptex.to / "Bytnex" is an unrelated scam.
//   "AWX Market" (a darknet market) is NOT the AWX exchange (awx.pro).
//   rapiraonline (Telegram) is a mobile game, not Rapira.
// SCOPE DECISION 5 Sep 2026: the RU obmennik tier (~150 exchangers under the EU 20th category ban,
// Chainalysis-attributed) is deliberately EXCLUDED: no lineage, mostly vendor-attributed membership.
// Recorded in Collection Layer rejected_candidates.md; revisit if Reno reopens.

const EX_DATA = {

meta: {
  title: "Exchange Lineage Explorer",
  sub: "RU/CIS exchange succession · official sanctions and seizure records · v1 · Sep 2026",
  yearMin: 2011,
  yearMax: 2026,
  sister: { label: "Ransomware Lineage Explorer", href: "ransomware-lineage-explorer.html" }
},

vocab: {
  nodeTypes: {
    exchange:   { label: "Exchange",            fill: "#0e7490", stroke: "#22d3ee", text: "#e8f6fa" },
    otc:        { label: "OTC / Courier Desk",  fill: "#1e3a5f", stroke: "#3d6a9e", text: "#dce8f5" },
    instrument: { label: "Settlement Token",    fill: "#4c1d95", stroke: "#a855f7", text: "#efe6fb" }
  },
  statuses: {
    active:           { label: "Active",             color: "#22c55e" },
    sanctioned_active:{ label: "Sanctioned, Active", color: "#fbbf24" },
    suspended:        { label: "Suspended",          color: "#fb923c" },
    seized:           { label: "Seized",             color: "#ef4444" },
    defunct:          { label: "Defunct",            color: "#64748b" },
    unknown:          { label: "Unknown",            color: "#8b949e" }
  },
  edgeTypes: {
    succession:     { label: "Succession",          color: "#14b8a6", width: 2.2 },
    rebrand:        { label: "Rebrand / Re-shell",  color: "#f97316", width: 2.2 },
    shared_control: { label: "Shared Control",      color: "#a855f7", width: 1.8 },
    settlement:     { label: "Settlement Layer",    color: "#22d3ee", width: 1.3 },
    displacement:   { label: "Flow Displacement",   color: "#3b82f6", width: 1.3 },
    relationship:   { label: "Relationship",        color: "#64748b", width: 1.2 }
  },
  confidence: {
    confirmed: { label: "Confirmed (official record)", dash: null },
    credible:  { label: "Credible (vendor evidence)",  dash: "5,3" },
    reported:  { label: "Reported (weak / single source)", dash: "2,3" }
  },
  eventTypes: {
    sanction:   { label: "Sanction designation", color: "#ef4444" },
    seizure:    { label: "Seizure / LE takedown", color: "#dc2626" },
    suspension: { label: "Suspension / halt",     color: "#fb923c" },
    launch:     { label: "Launch",                color: "#22c55e" },
    collapse:   { label: "Collapse",              color: "#64748b" },
    report:     { label: "Key public reporting",  color: "#3b82f6" }
  }
},

networks: {
  garantex_a7:  "Garantex / A7 Network",
  void_fillers: "Post-Garantex Void Fillers",
  awex_line:    "AWEX / AWX Line",
  suex_chatex:  "SUEX / Chatex Network",
  cryptex_uaps: "Cryptex / UAPS",
  btce_line:    "BTC-e Line",
  standalone:   "Standalone",
  otc_desks:    "OTC Desks"
},

nodes: [

  // ── BTC-e line ──────────────────────────────────────────────────────────
  { id:"btce", label:"BTC-e", type:"exchange", network:"btce_line", seed:"btce",
    first:"2011-07", last:"2017-07", status:"seized",
    notes:"Seized 25 Jul 2017 (DOJ), operator Alexander Vinnik arrested in Greece. FinCEN assessed a $110 million penalty. The original template: major RU-facing exchange killed by seizure, followed within weeks by a successor. Kept for lineage." },

  { id:"wex", label:"WEX", type:"exchange", network:"btce_line", seed:"btce",
    first:"2017-09", last:"2018-12", status:"defunct",
    notes:"Opened ~7 weeks after the BTC-e seizure with BTC-e's userbase, balances and staff continuity (widely documented; front man Dmitri Vasiliev). Collapsed late 2018 with users locked out. Never sanctioned; the enforcement against this line was criminal and FinCEN-regulatory. Demonstrates that succession does not require the successor to survive." },

  // ── SUEX / Chatex network ───────────────────────────────────────────────
  { id:"suex", label:"SUEX", type:"exchange", network:"suex_chatex", seed:"suex",
    first:"2018-01", approx:true, last:"2021-09", status:"defunct",
    notes:"First virtual currency exchange ever designated by OFAC (21 Sep 2021), for laundering ransomware proceeds. Nested exchange operating from Moscow's Federation Tower. Principal shareholder Egor Petukhovsky. Ceased operations after designation." },

  { id:"chatex", label:"Chatex", type:"exchange", network:"suex_chatex", seed:"chatex",
    first:"2017-01", approx:true, last:"2021-11", status:"defunct",
    notes:"Telegram-native P2P exchange, OFAC-designated 8 Nov 2021 with support entities IZIBITS OU, Chatextech SIA and Hightrade Finance. OFAC: direct ties to SUEX, used SUEX's nested function. Same operator network (Petukhovsky / IZIBITS / Hightrade), so an overlapping operation rather than a successor. Estonia revoked IZIBITS's license. No verified successor brand; business migrated into the wider RU cash-out ecosystem." },

  // ── Bitzlato ────────────────────────────────────────────────────────────
  { id:"bitzlato", label:"Bitzlato", type:"exchange", network:"standalone", seed:"bitzlato",
    first:"2016-01", last:"2023-01", status:"seized",
    notes:"Seized 18 Jan 2023 (DOJ + French action), founder Anatoly Legkodymov arrested in Miami; FinCEN issued its first-ever section 9714 order naming Bitzlato a primary money laundering concern. No confirmed successor. Kept for lineage." },

  // ── Cryptex / UAPS ──────────────────────────────────────────────────────
  { id:"cryptex", label:"Cryptex / PM2BTC", type:"exchange", network:"cryptex_uaps", seed:"cryptex",
    first:"2018-01", approx:true, last:"2024-09", status:"seized",
    notes:"Operation Final Exchange, 26 Sep 2024: cryptex.net and cryptex.one seized (US + Dutch), $7M+ in crypto seized, OFAC designations, Sergey Ivanov and Timur Shakhmametov indicted (EDVA). Ivanov subsequently arrested in Russia (house arrest, Oct 2024, domestic prosecution); Shakhmametov at large, $10M RFJ reward standing. NO VERIFIED SUCCESSOR as of Sep 2026. The 'Cryptex rebranded as Bytnex' claim concerns cryptex.to, an unrelated investment scheme, and is rejected. Residual risk is unbranded reconstitution through the UAPS/PinPays payment network, not a visible exchange." },

  // ── Garantex / A7 network ───────────────────────────────────────────────
  { id:"garantex", label:"Garantex", type:"exchange", network:"garantex_a7", seed:"garantex",
    first:"2019-05", last:"2025-03", status:"seized",
    notes:"OFAC-designated 5 Apr 2022 (Hydra action); domains seized 6 Mar 2025 (US Secret Service + German and Finnish server seizures, $26M+ frozen); re-designated 14 Aug 2025. Operated from Federation Tower, previously home to SUEX and Chatex. Admin Aleksej Besciokov arrested in India, Mar 2025; co-founder Aleksandr Mira Serda charged. The central kill event of the modern RU exchange ecosystem: everything in this lane and the void-filler lane reacts to 6 Mar 2025." },

  { id:"grinex", label:"Grinex", type:"exchange", network:"garantex_a7", seed:"garantex",
    first:"2025-03", last:"2026-04", status:"suspended",
    notes:"Direct operational successor to Garantex, per OFAC: created by Garantex employees, customer deposits transferred, balances restored via A7A5. Registered in Kyrgyzstan Dec 2024, BEFORE the takedown (pre-positioned continuity). Users saw blocked Garantex funds reappear in Grinex accounts by 12 Mar 2025 (Global Ledger). OFAC-designated 14 Aug 2025, UK 20 Aug 2025. Suspended operations 16 Apr 2026 after ~$13.7M (1B ruble) theft it blamed on 'Western special services' (unverified). No independently verified relaunch as of Sep 2026: brand present, trading not demonstrated." },

  { id:"meer", label:"Meer / TengriCoin", type:"exchange", network:"garantex_a7", seed:"meer",
    first:"2025-04", last:null, status:"sanctioned_active",
    notes:"Kyrgyz exchange (meer.kg) operated by CJSC TengriCoin, registered 13 Dec 2024, the SAME DAY as A7A5 issuer Old Vector: the strongest pre-positioning indicator in the chain. Launched ~Apr 2025 as an A7A5 venue. UK-designated 20 Aug 2025; EU 20th package (in force 24 Apr 2026). Best characterized as parallel pre-built infrastructure in the same A7A5 ecosystem, not a proven corporate successor to Garantex or Grinex. Became the major remaining A7A5 venue after Grinex's Apr 2026 suspension." },

  { id:"a7a5", label:"A7A5 (Old Vector)", type:"instrument", network:"garantex_a7", seed:"",
    first:"2025-02", last:null, status:"sanctioned_active",
    notes:"Ruble-backed token issued by Old Vector LLC (Kyrgyzstan), launched 8 Feb 2025, listed on Garantex 20 Feb 2025, two weeks before the takedown. The connective layer of the succession: tokens burned and reissued post-seizure to restore customer balances inside Grinex, then traded on Meer. Old Vector UK-designated 20 Aug 2025. The succession is a migration of liquidity and settlement, not a corporate rename; A7A5 is the rail it rode." },

  // ── AWEX / AWX line ─────────────────────────────────────────────────────
  { id:"awex", label:"AWEX (Crypto Explorer DMCC)", type:"exchange", network:"awex_line", seed:"awex",
    first:"2022-01", approx:true, last:"2024-04", status:"defunct",
    notes:"RU/UAE exchange (awex.pro), aka BANKOFF, run by Dubai-registered Crypto Explorer DMCC. OFAC-designated 25 Mar 2024 (cash desks in Moscow and Dubai; loaded funds onto Sberbank and Alfa-Bank cards). Read down as a brand: awex.pro now redirects to awx.pro." },

  { id:"awx", label:"AWX", type:"exchange", network:"awex_line", seed:"awex",
    first:"2024-04", last:null, status:"sanctioned_active",
    notes:"awx.pro, operated by AWX Solutions FZ-LLC (Dubai), registered ~1 month after the AWEX designation. Kharon: corporate records show the same chief executive as Crypto Explorer DMCC, and the old domain redirects. Ukraine NSDC sanctioned AWX Solutions 6 Jul 2025 as 'formerly AWEX'. NOT OFAC-designated under the new shell as of Sep 2026: a live example of designation evasion by corporate re-shell, at ~1 month cost." },

  // ── Post-Garantex void fillers (Elliptic, Feb 2026) ─────────────────────
  { id:"bitpapa", label:"Bitpapa", type:"exchange", network:"void_fillers", seed:"bitpapa",
    first:"2019-01", last:null, status:"sanctioned_active",
    notes:"UAE-registered P2P exchange serving RU users. OFAC-designated 25 Mar 2024; Ukraine sanctions 6 Jul 2025; UK A7 package 26 May 2026 (Bitpapa IC FZC). Elliptic (Feb 2026): ~9.7% of outgoing flows to OFAC-sanctioned targets, constant wallet rotation to defeat monitoring." },

  { id:"abcex", label:"ABCeX", type:"exchange", network:"void_fillers", seed:"abcex",
    first:"2023-01", approx:true, last:null, status:"sanctioned_active",
    notes:"Order-book + P2P ruble venue operating from Federation Tower, the ex-Garantex offices. Elliptic: $11B+ processed. Knocked offline by DDoS around the Garantex takedown, resumed 31 Jul 2025. UK-designated 26 May 2026 (Nueva Cryptologia SAS de CV), with UK citing links to Garantex co-founder Sergey Mendeleev. Largest unsanctioned platform in Elliptic's Feb 2026 report; sanctioned three months later." },

  { id:"aexbit", label:"AEXbit", type:"exchange", network:"void_fillers", seed:"",
    first:"2025-04", approx:true, last:null, status:"active",
    notes:"Appeared post-takedown with a UI identical to ABCeX and promotion in Garantex-linked channels. TRM: co-spending from shared hot wallets makes common control with ABCeX near-certain. Unsanctioned as of Sep 2026: the pre-built spare of the void-filler set. CANDIDATE for the S12 roster." },

  { id:"exmo_me", label:"Exmo.me", type:"exchange", network:"void_fillers", seed:"exmo",
    first:"2022-06", approx:true, last:null, status:"sanctioned_active",
    notes:"The Russia-facing service carrying the EXMO brand (parent brand founded 2014, claimed to exit Russia in 2022 by selling the regional business). Elliptic: $1M+ sent directly to Garantex; wider reporting ~$19.5M in direct transactions with Garantex, Grinex and Chatex. UK A7 package 26 May 2026 designated Exmo Exchange Limited operating Exmo.com (UK ref RUS3602, per the Exchange Deep Dive profile); also under Ukraine sanctions since Jul 2025; not OFAC-designated; platform still active." },

  { id:"rapira", label:"Rapira", type:"exchange", network:"void_fillers", seed:"rapira",
    first:"2023-01", approx:true, last:null, status:"sanctioned_active",
    notes:"Georgia-incorporated (Rapira Group LLC), Moscow office and cash desks. Elliptic: $72M+ in direct flows with Grinex; Moscow office reportedly raided in a capital-flight investigation. UK A7 package 26 May 2026." },

  { id:"aifory", label:"Aifory Pro", type:"exchange", network:"void_fillers", seed:"",
    first:"2023-01", approx:true, last:null, status:"sanctioned_active",
    notes:"Cash-to-crypto service (Moscow, Dubai, Türkiye) and trade-payment agent for RU cross-border settlement; USDT-funded virtual cards; ~$2M traced to Iranian exchange Abantether (Elliptic). UK A7 package 26 May 2026 (Aifory LLC). CANDIDATE for the S12 roster: the fifth Elliptic void-filler, previously unconfirmed in our records." },

  // ── Standalone ──────────────────────────────────────────────────────────
  { id:"netex24", label:"NetEx24", type:"exchange", network:"standalone", seed:"netex24",
    first:"2021-01", approx:true, last:null, status:"unknown",
    notes:"RU instant-exchanger (obmennik), OFAC-designated 25 Mar 2024 alongside Bitpapa and AWEX. May continue operating under rotating domains; no confirmed successor or rebrand. Operating status unknown, watched by S12." },

  // ── OTC desks ───────────────────────────────────────────────────────────
  { id:"audia6", label:"AudiA6 / Dark2Web", type:"otc", network:"otc_desks", seed:"audia6",
    first:"2021-01", approx:true, last:"2026-06", status:"seized",
    notes:"Mixer-as-a-service plus OTC layer integrated with the Dark2Web forum (same operators). ~10,333 BTC in deposits since 2021 attributed to its wallets; clean-for-dirty swaps in ~1 hour via 6,000+ mule accounts. SEIZED 10 Jun 2026 in a joint US/EU action together with Dark2Web (~25 domains, 30+ servers); Georgia-based operators charged, identified via a Sep 2025 arrest of a linked Ukrainian national in Poland. No successor identified. TG handle residue (@audia6_obmen) still exists but the service is dead; S12 existence-only signal should not be read as operating." },

  { id:"n001k", label:"001k", type:"otc", network:"otc_desks", seed:"001k",
    first:"2023-01", approx:true, last:null, status:"active",
    notes:"Ukraine-based Telegram crypto-to-fiat and cash-courier network, profiled publicly (ICIJ/Arkham) with large onward flows to WhiteBIT. Unsanctioned as of Jun 2026. Flow attribution is CLOSED territory; this entry records public existence only." }
],

edges: [
  { source:"btce", target:"wex", type:"succession", confidence:"confirmed", interval:"7 weeks",
    label:"userbase + staff continuity · gap ~7 weeks" },

  { source:"suex", target:"chatex", type:"shared_control", confidence:"confirmed",
    label:"OFAC: Petukhovsky / IZIBITS / Hightrade; Chatex nested on SUEX" },

  { source:"chatex", target:"garantex", type:"relationship", confidence:"reported",
    label:"Federation Tower co-location (Treasury 2022); no common control shown" },

  { source:"garantex", target:"grinex", type:"succession", confidence:"confirmed", interval:"6 days",
    label:"OFAC: built by Garantex staff, deposits transferred · balances restored in ~6 days" },

  { source:"garantex", target:"meer", type:"relationship", confidence:"credible",
    label:"pre-positioned parallel A7A5 venue (TengriCoin + Old Vector registered same day, 13 Dec 2024)" },

  { source:"grinex", target:"meer", type:"displacement", confidence:"credible",
    label:"A7A5 activity shifts to Meer after the Apr 2026 suspension" },

  { source:"a7a5", target:"garantex", type:"settlement", confidence:"confirmed",
    label:"listed 20 Feb 2025, two weeks pre-seizure" },

  { source:"a7a5", target:"grinex", type:"settlement", confidence:"confirmed",
    label:"burn-and-reissue rail used to restore customer balances" },

  { source:"a7a5", target:"meer", type:"settlement", confidence:"confirmed",
    label:"primary trading venue after Grinex suspension" },

  { source:"awex", target:"awx", type:"rebrand", confidence:"credible", interval:"1 month",
    label:"domain redirect + same CEO (Kharon) · re-shelled in ~1 month" },

  { source:"abcex", target:"aexbit", type:"shared_control", confidence:"credible",
    label:"TRM co-spending from shared hot wallets: near-certain same entity" },

  { source:"garantex", target:"abcex", type:"relationship", confidence:"reported",
    label:"ex-Garantex Federation Tower offices · UK cites Mendeleev link" },

  { source:"garantex", target:"bitpapa", type:"displacement", confidence:"credible",
    label:"void-filler (Elliptic, Feb 2026)" },
  { source:"garantex", target:"abcex", type:"displacement", confidence:"credible",
    label:"void-filler (Elliptic, Feb 2026) · $11B+ processed" },
  { source:"garantex", target:"exmo_me", type:"displacement", confidence:"credible",
    label:"void-filler (Elliptic, Feb 2026) · $1M+ direct to Garantex" },
  { source:"garantex", target:"rapira", type:"displacement", confidence:"credible",
    label:"void-filler (Elliptic, Feb 2026)" },
  { source:"garantex", target:"aifory", type:"displacement", confidence:"credible",
    label:"void-filler (Elliptic, Feb 2026)" },

  { source:"rapira", target:"grinex", type:"relationship", confidence:"credible",
    label:"$72M+ in direct flows (Elliptic)" }
],

events: [
  { date:"2017-07-25", type:"seizure",   label:"BTC-e seized; Vinnik arrested in Greece (DOJ / FinCEN $110M penalty)", actor_ids:["btce"] },
  { date:"2017-09-15", type:"launch",    label:"WEX opens with BTC-e userbase and balances", actor_ids:["wex"] },
  { date:"2018-10-01", type:"collapse",  label:"WEX collapses late 2018; users locked out", actor_ids:["wex"] },
  { date:"2021-09-21", type:"sanction",  label:"OFAC designates SUEX, the first exchange ever designated", actor_ids:["suex"] },
  { date:"2021-11-08", type:"sanction",  label:"OFAC designates Chatex + IZIBITS, Chatextech, Hightrade", actor_ids:["chatex"] },
  { date:"2022-04-05", type:"sanction",  label:"OFAC designates Garantex (Hydra action)", actor_ids:["garantex"] },
  { date:"2023-01-18", type:"seizure",   label:"Bitzlato seized; Legkodymov arrested; first FinCEN 9714 order", actor_ids:["bitzlato"] },
  { date:"2024-03-25", type:"sanction",  label:"OFAC designates Bitpapa, NetEx24, Crypto Explorer DMCC (AWEX)", actor_ids:["bitpapa","netex24","awex"] },
  { date:"2024-04-25", type:"launch",    label:"AWX Solutions FZ-LLC registered, ~1 month after the AWEX designation", actor_ids:["awx"] },
  { date:"2024-09-26", type:"seizure",   label:"Operation Final Exchange: Cryptex seized; Ivanov + Shakhmametov indicted; $10M RFJ", actor_ids:["cryptex"] },
  { date:"2025-02-08", type:"launch",    label:"Old Vector launches A7A5", actor_ids:["a7a5"] },
  { date:"2025-03-06", type:"seizure",   label:"Garantex domains seized (US/DE/FI), $26M+ frozen; Besciokov arrested in India", actor_ids:["garantex"] },
  { date:"2025-03-12", type:"launch",    label:"Blocked Garantex balances reappear inside Grinex (Global Ledger)", actor_ids:["grinex"] },
  { date:"2025-04-01", type:"launch",    label:"Meer launches as an A7A5 venue (Chainalysis)", actor_ids:["meer"] },
  { date:"2025-07-06", type:"sanction",  label:"Ukraine NSDC sanctions 60 crypto firms incl. AWX Solutions ('formerly AWEX') and Bitpapa", actor_ids:["awx","bitpapa"] },
  { date:"2025-07-31", type:"report",    label:"ABCeX announces resumption after post-takedown DDoS outage", actor_ids:["abcex"] },
  { date:"2025-08-14", type:"sanction",  label:"OFAC re-designates Garantex, designates Grinex + A7 network", actor_ids:["garantex","grinex"] },
  { date:"2025-08-20", type:"sanction",  label:"UK OFSI designates Grinex LLC, CJSC TengriCoin (Meer), Old Vector (A7A5)", actor_ids:["grinex","meer","a7a5"] },
  { date:"2026-02-21", type:"report",    label:"Elliptic names the five void-filling exchanges", actor_ids:["bitpapa","abcex","exmo_me","rapira","aifory"] },
  { date:"2026-04-16", type:"suspension",label:"Grinex suspends operations after ~$13.7M theft, blames 'Western special services'", actor_ids:["grinex"] },
  { date:"2026-04-24", type:"sanction",  label:"EU 20th package in force: TengriCoin/Meer designated; RU CASP transaction ban", actor_ids:["meer","a7a5"] },
  { date:"2026-05-26", type:"sanction",  label:"UK A7 package designates Bitpapa, Exmo, Aifory, Rapira, ABCeX", actor_ids:["bitpapa","exmo_me","aifory","rapira","abcex"] },
  { date:"2026-06-10", type:"seizure",   label:"AudiA6 + Dark2Web seized (joint US/EU); operators charged", actor_ids:["audia6"] }
]

};
