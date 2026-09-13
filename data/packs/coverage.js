/* ==================================================================
   RANSOMWARE ECOSYSTEM MAP : COVERAGE POSTURE PACK
   ------------------------------------------------------------------
   Intel Annex records keyed by node id: collection posture,
   collectability, decision summary, methods, pre-action
   indicators, collection objectives. Drives the Collect Posture
   overlay and the Intel Annex tab. Nodes absent here simply show
   no annex tab.
   ================================================================== */
window.MAP_PACKS = window.MAP_PACKS || {};
MAP_PACKS.coverage = {
  meta: { pack:'coverage', nodeCount:22 },
  annex: {
    stealers: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'HIGH',
      decisionSummary: 'Stealer C2 monitoring and log market coverage should run continuously as baseline operations. The 19-day downstream window means that collection lags at the stealer layer translate directly into missed victim notification opportunities at the IAB and DLS layers.',
      methods: ['Stealer Log Market Monitoring','C2 Infrastructure Enumeration and Monitoring','Malware Sample Analysis','Forum and Distribution Channel Monitoring'],
      preActionIndicators: ['Stealer log volume spike for a specific sector or credential type','New stealer family appearing in markets before C2 fingerprint library is updated','Stealer operator announcing service shutdown or selling source code'],
      collectObjectives: ['Log market coverage is active and producing victim identifications','Downstream IAB program is configured to receive upstream victim flags','Operator attribution at analyst confidence with durable instrument ready','Alternative stealer infrastructure under collection']
    },
    loaders: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'HIGH',
      decisionSummary: 'Loader C2 monitoring should run continuously as a persistent background operation. Pre-encryption warning it produces is the highest-value victim protection mechanism in the EDP collection architecture — collection should never be traded for a tactical disruption gain.',
      methods: ['C2 Infrastructure Enumeration and Monitoring','Malware Sample Analysis','Botnet Monitoring and Sinkholing','Forum and Dark Market Monitoring'],
      preActionIndicators: ['Known loader C2 traffic detected in a specific victim network','Loader operator withdrawing forum presence or infrastructure shutdown signals','New loader family with no existing C2 fingerprint appearing in samples'],
      collectObjectives: ['Full victim pool enumeration for active campaigns','Operator attribution confirmed — handles, infrastructure, payment wallets','Distribution infrastructure mapped (SEO networks, IoT C2 layers, drive-by domains)','Successor loader infrastructure identified and under collection']
    },
    crypters: {
      posture: 'COLLECT-ONLY',
      collectability: 'MEDIUM',
      decisionSummary: 'The July 13, 2026 OFAC designation of Belarusian cryptor vendor Silayev is the first enforcement action against a crypter operator (Confirmed), superseding the prior judgment that action at this node was off the table. Posture remains COLLECT-ONLY: a designation is not an infrastructure operation, the market remains competitive and replaceable, and designation-only actions are the weakest instrument in the takedown record (Confirmed). The operational value remains primarily defensive, feeding AV vendor coordination and EDR signature updates, with vendor-level designation now demonstrated as a follow-on where a ransomware customer nexus is documented.',
      methods: ['Forum and Dark Market Monitoring','Malware Sample Technical Analysis'],
      preActionIndicators: ['FUD claims extending beyond 7 days for a major AV/EDR product','New obfuscation technique appearing across multiple unrelated malware families simultaneously','Major crypter service announcing capacity expansion or new subscription tier'],
      collectObjectives: []
    },
    callers: {
      posture: 'COLLECT-ONLY',
      collectability: 'LOW',
      decisionSummary: 'There is no disruption trigger for vishing services. The node is too replaceable for any disruption to produce lasting impact. The collection program is entirely defensive: build and maintain a pretext library, track sector targeting patterns, and feed victim preparation programs continuously.',
      methods: ['Victim Report Aggregation','Forum and Telegram Monitoring'],
      preActionIndicators: ['Vishing campaign volume spike in a specific sector','New pretext type appearing in forum advertising before appearing in victim reports','Recruitment posting for native English-speaking vishing operators'],
      collectObjectives: []
    },
    iab: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'HIGH',
      decisionSummary: 'IAB listing monitoring should run continuously and indefinitely. The 19-day window is operational — not a historical artifact — and every unprocessed listing is a victim notification failure. Market infrastructure disruption should only occur once victim notification pipeline is fully operational.',
      methods: ['Forum and Market Listing Monitoring','Listing-to-DLS Correlation','Stealer Log Cross-Reference','HUMINT — Informant Development from IAB Layer'],
      preActionIndicators: ['IAB listing volume spike for a specific sector (healthcare, energy, financial)','Known high-value organization appears in IAB listing','Boutique IAB operator shifting from public forum to invite-only or direct communication'],
      collectObjectives: ['Victim notification pipeline fully operational and tested','Listing-to-DLS correlation pipeline processing in under 24 hours','Boutique operator financial designation package complete with blockchain tracing','Forum section takedown coordinated with Node 07 action plan']
    },
    exploits: {
      posture: 'COLLECT-ONLY',
      collectability: 'MEDIUM',
      decisionSummary: 'Exploit broker monitoring is a permanent defensive intelligence collection program. No action trigger exists at this node because disruption produces no lasting impact. The entire value of collection here is feeding patching prioritization and AV/EDR vendor coordination continuously.',
      methods: ['Forum and Market Listing Monitoring','Malware Sample Exploit Code Cross-Reference','HUMINT — Market Participant Reporting'],
      preActionIndicators: ['Critical infrastructure product CVE appearing in criminal market listing within 7 days of disclosure','Mass purchase of a specific CVE exploit by multiple forum actors simultaneously','Known exploit broker advertising new zero-day before NVD publication'],
      collectObjectives: []
    },
    raas: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'HIGH',
      decisionSummary: 'Passive collection — DLS monitoring, TOR enumeration, on-chain analytics, malware sample analysis, forum monitoring — should run continuously against all identified platforms. The operator node is the highest-value collection target. Premature disruption eliminates visibility while producing only temporary degradation.',
      methods: ['TOR Infrastructure Enumeration','Affiliate Recruitment Channel Monitoring','Cryptocurrency Wallet Tracking','Leak Site and Victim Pipeline Monitoring','Malware Sample Analysis and Build Tracking'],
      preActionIndicators: ['Reduction in DLS posting frequency without corresponding victim volume decrease','Forum recruitment posting withdrawal or account suspension','Operator switching to new cryptocurrency receiving wallets without known campaign activity'],
      collectObjectives: ['Full affiliate network mapped by handle with geographic distribution assessed','All active TOR infrastructure fingerprinted and linked to operator','Admin wallet cluster documented for designation package','Successor infrastructure identified and under collection before primary action']
    },
    leaksite: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'VERY HIGH',
      decisionSummary: 'DLS monitoring is a permanent background process that should never be suspended. LOW burn risk on DLS action reflects that DLS infrastructure is separate from core RaaS platform — disrupting a DLS does not affect the operator\'s ability to attack victims, only the extortion pressure mechanism.',
      methods: ['Continuous DLS Monitoring','DLS Infrastructure Enumeration','IAB Listing-to-DLS Correlation'],
      preActionIndicators: ['DLS countdown timer acceleration without victim payment confirmation','High-value victim (critical infrastructure, healthcare) posted to DLS','Multi-brand DLS hosted on same backbone — single action can hit multiple brands'],
      collectObjectives: ['Infrastructure fingerprint database current and updated within 24 hours of change','Covert access assessed and authorized if Hive model applies','All victim notifications processed from current DLS victim list','Successor hosting infrastructure identified']
    },
    bph: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'HIGH',
      decisionSummary: 'Passive BPH collection — BGP monitoring, passive DNS, IOC feed integration, forum monitoring — should run continuously and indefinitely against all identified infrastructure. This baseline collection costs little and produces continuous customer-roster and infrastructure-mapping intelligence.',
      methods: ['BGP and ASN Monitoring','IP Range and Passive DNS Monitoring','IOC Feed Integration','Abuse Database and Registry Monitoring','Forum Monitoring'],
      preActionIndicators: ['Sudden decrease in forum advertising for a specific provider (aware of LE attention)','New shell company registrations in same jurisdiction as known BPH entity','BPH provider acquiring significant new ASN block or IP ranges'],
      collectObjectives: ['Full entity chain mapped — all legal entities and beneficial ownership chain traced','Complete criminal customer roster documented for the target provider','Upstream ISP depeering partners identified and engaged prior to action','Successor provider infrastructure identified and under collection']
    },
    forums: {
      posture: 'COLLECT-ONLY',
      collectability: 'HIGH',
      decisionSummary: 'Underground forums are COLLECT-ONLY for Russian-language institutional forums (Exploit, XSS, RAMP). The imperviousness judgment is now an open analytic question: RAMP has stayed dark 150+ days after the January 2026 FBI seizure, against a typical 60-90 day reconstitution window, and LeakBase was not reconstituted at roughly 90 days (Confirmed). The competing explanation, voluntary migration to private invite-only channels, would reduce open-source visibility rather than prove durable disruption (Analyst inference). Cross-node coverage value remains the core of the posture argument: no other platform provides comparable ecosystem-wide visibility, but that argument itself weakens if recruitment permanently leaves open forums.',
      methods: ['Cover Account Infiltration','IAB Listing Monitoring and the 19-Day Window','Handle Correlation and Persona Tracking','Infrastructure Monitoring (Hosting and Domain)','Escrow and Financial Infrastructure Monitoring'],
      preActionIndicators: ['Sudden increase in private Telegram channel references replacing forum discussion threads','Admin-initiated rule changes restricting previously permitted activity categories','Forum administrator indicating awareness of law enforcement infiltration'],
      collectObjectives: []
    },
    mixers: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'MEDIUM',
      decisionSummary: 'Passive on-chain monitoring against known mixer addresses runs continuously and requires no action decision. Designation is preferred over seizure because it terminates the criminal use case while allowing continued passive monitoring of funds that remain in the mixer.',
      methods: ['On-Chain Analytics Against Known Mixer Addresses','Smart Contract Analysis (Decentralized Mixers)','Mixer Infrastructure OSINT (Centralized Services)'],
      preActionIndicators: ['Mixer transaction volume spike correlating with a major ransomware campaign','Mixer operator announcing new features or expanded capacity','New decentralized mixer protocol launching with anonymity features exceeding Tornado Cash'],
      collectObjectives: ['Criminal customer wallet cluster map complete — all major RaaS wallets using the mixer documented','Entity chain behind centralized mixer reconstructed for designation package','Successor mixer infrastructure identified and on-chain monitoring established','Financial chain traces from mixer output to OTC/exchange endpoints documented']
    },
    otc: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'MEDIUM',
      decisionSummary: 'Passive OTC broker monitoring — forum and Telegram advertising, on-chain analytics — should run continuously. The designation decision is governed by criminal customer documentation completeness and entity chain reconstruction quality, not transaction volume alone.',
      methods: ['Forum and Telegram Channel Monitoring','On-Chain Analytics Against Known Broker Wallets','Exchange Cooperation and KYC Data'],
      preActionIndicators: ['OTC broker transaction volume spike following a major ransomware campaign','Broker advertising minimum transaction floor drop (accepting smaller amounts — market thinning)','Broker transferring large volumes to new wallets without corresponding customer activity'],
      collectObjectives: ['Criminal customer wallet set documented — all major RaaS operator clusters transacting with the broker','Entity chain reconstructed for OFAC designation package','T3 Financial Crime Unit USDT blacklisting action coordinated for simultaneous execution','Successor OTC infrastructure identified and monitoring established']
    },
    exchl: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'MEDIUM',
      decisionSummary: 'On-chain payment chain tracing and corporate registry monitoring run continuously as analytical programs. The action decision is governed by prosecution package completeness — whether the chain from ransomware proceeds to real-world assets is sufficiently documented to support asset forfeiture.',
      methods: ['On-Chain Payment Chain Tracing','Corporate Registry and Financial OSINT','Financial Institution Cooperation'],
      preActionIndicators: ['Identified launderer entity acquiring significant real estate in an accessible jurisdiction','Shell company chain approaching a jurisdiction with an extradition treaty','Financial institution SAR cluster identifying a launderer entity linked to 10+ transactions'],
      collectObjectives: ['Payment chain traced from ransom wallet through mixing and OTC layers to launderer entity','Asset map complete — real estate, vehicles, business interests in accessible jurisdictions documented','Physical enforcement partners engaged in relevant host jurisdictions','Beneficial ownership exposure package ready for simultaneous public release']
    },
    ruexch: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'HIGH',
      decisionSummary: 'Coverage of the Russian exchange cluster runs continuously and requires no action decision: designation records, corporate registries, and blockchain analytics keep the venue set enumerated in near real time. The action question is settled by the Garantex sequence rather than by transaction volume. The March 2025 seizure removed a brand, and a successor incorporated three months in advance (Grinex, Kyrgyzstan, December 2024) was carrying the same customer balances within days (Confirmed). When Grinex went dark in April 2026 the displaced flow re-concentrated onto a short named set (ABCeX, Rapira, Bitpapa, Exmo, Aifory Pro) rather than dispersing (Credible). Posture is COLLECT-THEN-ACT because the instruments do bite, but only when the successor entity and the settlement rail beneath it (A7 and the A7A5 token, past $100B in reported turnover and approved for Russian foreign-trade settlement) are mapped before the front-end is taken (Confirmed). Designation aimed at a venue buys 6 to 18 months; designation aimed at the settlement function is what buys structural change, and the post-takedown re-concentration is the collection objective precisely because concentration is what keeps the target set small (Analyst inference).',
      methods: ['On-Chain Flow Tracing Across the Post-Garantex Venue Set','Corporate Registry and Nominee Structure Reconstruction','Settlement Rail Mapping (A7 and A7A5 Issuance, Ownership, and Trade Approval)','Designation Record and Successor-Entity Monitoring','Physical Cash-Desk and Office Location Collection'],
      preActionIndicators: ['New exchange entity incorporated in a CIS jurisdiction while the existing venue still operates (the pre-built successor signature)','Bilateral flow with a designated venue beginning within days of a takedown, as Rapira to Grinex did on March 10, 2025','Ruble-backed token volume migrating to a new primary trading venue ahead of a designation package'],
      collectObjectives: ['Successor entity identified and under monitoring before action lands on the current venue','Settlement rail participants (issuer, banks, agents) documented to designation standard, not just the exchange front-end','Physical enforcement partners engaged in the host jurisdiction so action follows designation inside 12 months','Beneficial ownership traced through nominee and proxy structures to the controlling principals']
    },
    cex: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'HIGH',
      decisionSummary: 'Compliant exchanges are the one node in the laundering stack where the counterparty keeps records and answers process: KYC files, SAR filings, and 314(b) sharing make collectability the highest in this layer. The exposure is not the venue itself, it is the nested intermediary and straw-account supply chain operating inside it, and compliant-exchange share of ransomware off-ramping rose to 39% even as total payments fell (Confirmed). Posture is COLLECT-THEN-ACT rather than COLLECT-ONLY because a demonstrated action path now exists at the nesting layer: the UK became the first government to sanction the Xinbi marketplace in March 2026, and its May 26, 2026 package was the first use of Regulation 17A against cryptoasset exchanges, reaching a major global venue (HTX) alongside Exmo, Rapira, and Bitpapa (Confirmed). The action must fall on the nested correspondent rather than the host: enforcement against a cooperating regulated venue converts a collection source into a hostile counterparty, and that cost, not transaction volume, is what governs the timing decision (Analyst inference).',
      methods: ['Correspondent and Nested Account Relationship Mapping','SAR Coordination and 314(b) Information Sharing with Regulated Venues','On-Chain Attribution of Deposit Address Clusters to Nested Intermediaries','Corporate Registry Analysis of Front-End and Mirror Entities','Stablecoin Issuer Freeze Coordination'],
      preActionIndicators: ['Shared custodial wallet infrastructure linking a compliant front-end to a CIS-facing mirror, the pattern TRM documented across Exmo.com and Exmo.me','Nested intermediary deposit volume rising immediately after a designation elsewhere in the venue set','A regulated venue continuing to receive direct flow from a designated entity after the designation date'],
      collectObjectives: ['Nested intermediary entity chain reconstructed to beneficial ownership for a designation or Section 9714 package','Deposit address clusters attributed to specific criminal customers rather than to the host venue','Host-venue cooperation documented so action does not terminate the collection channel','Issuer-level freeze coordination pre-arranged so blocked funds cannot move inside the action window']
    },
    bridge: {
      posture: 'COLLECT-ONLY',
      collectability: 'MEDIUM',
      decisionSummary: 'Bridges are where the trail changes shape. TRM measured ransomware-linked mixer volume falling from roughly $152M in 2021 to about $48M in 2024 while bridge-related flows climbed to roughly $100M in 2025, overtaking mixers for the first time in 2024 (Confirmed). The mixer posture does not transfer with the volume. Mixers were purpose-built for obfuscation and could be designated on that basis, which is why designation there is preferred over seizure; bridges and no-identity swap protocols carry majority legitimate volume, and that dual-use quality is exactly why actors migrated onto them (Confirmed). The one designation-first test in this class did not hold: the Tornado Cash designation was ruled unlawful and formally withdrawn in March 2025 (Confirmed). Posture is therefore COLLECT-ONLY. The productive output is continuity of tracing rather than disruption: bridge provenance flags applied at the exchange and issuer layer restore attribution downstream, where a freeze or a designation can still land, and the constraint on freezing is attribution speed rather than willingness (Confirmed). Prevalence inside the ransomware stack specifically remains an emerging pattern rather than an established one (Credible), a second reason not to spend an action here.',
      methods: ['Cross-Chain Trace Reconstruction and Bridge Provenance Flagging','Smart Contract and Router Analysis for Decentralized Bridges','No-Identity Swap Desk Monitoring (Advertising and Deposit Wallets)','Downstream Exchange and Issuer Screening Against Bridge-Tainted Funds'],
      preActionIndicators: ['Ransomware wallet cluster hopping chains within minutes of the payment split, ahead of any mixer step','A bridge or swap desk whose ransomware-attributed share approaches the purpose-built profile seen at AudiA6 (roughly 80% ransomware exposure)','New bridge or swap protocol launching with privacy properties that defeat current cross-chain tracing methods'],
      collectObjectives: []
    },
    mules: {
      posture: 'COLLECT-THEN-ACT',
      collectability: 'MEDIUM',
      decisionSummary: 'SAR coordination and recruitment monitoring run continuously. Individual mule arrests without coordinator prosecution are low-value — they replace one mule with another. The collection objective is coordinator identification, which supports the prosecution package that dismantles the management layer.',
      methods: ['Financial Institution SAR Coordination','Mule Recruitment Advertising Monitoring','Mule Cooperation and Informant Development'],
      preActionIndicators: ['SAR clustering identifies a coordinator entity linked to 10+ mule accounts','Mule recruitment advertising surge correlated with a major ransomware campaign','Mule coordinator shifting to a new recruitment platform or communication channel'],
      collectObjectives: ['Coordinator-level attribution at legal standard supported by mule cooperation and financial records','Mule network map complete — coordinator, sub-coordinators, and active account holders documented','Real-time payment network intervention plan ready with partner financial institutions','Recruitment advertising platform notifications coordinated for simultaneous disruption']
    },
    negot: {
      posture: 'COLLECT-ONLY',
      collectability: 'MEDIUM',
      decisionSummary: 'Collection against criminal negotiation services is a permanent intelligence program. Disrupting negotiation services is counterproductive: it collapses the negotiation process, increases probability of victim data publication without resolution, and eliminates a multi-operator intelligence source. The layer is not only a source: the April 22, 2026 sentencings of US incident-response and negotiation insiders who moonlighted as ALPHV affiliates (with a third plea April 20) document an insider-compromise vector inside the victim-side layer (Confirmed). The collect-only argument therefore carries a vetting requirement: OFAC screening and insider-risk controls for commercial negotiation firms, and treatment of negotiation-side telemetry as a potential adversary collection channel.',
      methods: ['Victim Cooperation — Negotiation Communication Sharing','TOR Portal Monitoring and Cover Engagement','Ransom Note Corpus Analysis'],
      preActionIndicators: ['Negotiation service linguistic signature appearing under a new operator brand (confirms rebrand)','Same negotiation service detected across 3+ active RaaS operators simultaneously','Negotiation service adopting new communication channel or encryption protocol'],
      collectObjectives: []
    },
    fsb: {
      posture: 'COLLECT-ONLY',
      collectability: 'MEDIUM',
      decisionSummary: 'FSB is the architect of the protection layer rather than a node that can be disrupted, and the framework\'s governing principle decides the posture: direct pressure on FSB-shielded actors (public attribution, extradition requests, media naming campaigns) reliably converts a criminal liability into a protected state asset, and absorption is not reversible through additional pressure (Confirmed). Every available action instrument is therefore counterproductive when pointed here, which is what COLLECT-ONLY means at this node: collection is not a holding pattern, it is the entire product, and what it yields is targeting for other nodes. The krysha is transactional and tiered (elite and recruited, useful and tasked, theatrical and inconvenient, expendable), so placing an actor in a tier has to precede any sequencing decision. Evil Corp shows what the top tier buys: Eduard Benderskiy, a former FSB Vympel officer and Yakubets\'s father-in-law, supplied physical security, ensured Russian authorities did not pursue the group after the 2019 designations, and brokered meetings with Sberbank\'s Gref and Kremlin official Kozak, while indictments moved nothing and sanctions moved only the brand (Confirmed). The exploitable feature is that FSB is not unified: units compete, and an officer whose protected actor becomes an attribution risk is a liability to rival units rather than an asset (Confirmed). Officer financial exposure is buildable from open Russian registries and requires no HUMINT to initiate, which is why collectability is MEDIUM rather than LOW: the protection relationships are inferential, but the money moving around them is documentable. Two 2026 developments removed the last analytic escape hatch. Mintsifry Order No. 1174 (registered May 22, 2026) links passport data, home addresses, tax IDs, bank details, and real-time geolocation to every IP address on Russian infrastructure, with FSB access and no court order, so non-enforcement against a domestically resident actor is a deliberate choice and not a surveillance gap (Confirmed). And on July 13, 2026 the EU and UK formally attributed the coordination of state and non-state cyber actors to FSB Centre 16, alongside the failed attack on the Polish energy grid (Confirmed). Neither changes the posture; both raise the value of what is collected here.',
      methods: ['Officer Financial Exposure Profiling from Open Russian Registries (property, corporate, vehicle)','Protection-Payment Identification in Actor Finances (outflows fitting no operational cost profile)','Enforcement Non-Event Analysis (arrests that never come, cases that stall, assets never frozen)','Leak Corpus and Insider Exposure Exploitation (Conti and Black Basta chat records)','Designation and Indictment Record Correlation Against Assessed Protection Tier'],
      preActionIndicators: ['A protected actor\'s domestic misconduct surfacing in Russian media or through an FNS or Rosfinmonitoring process','A protected actor repeatedly disrupted despite protection, which makes the protecting officer look ineffective to competing units','Targeting drift toward CIS or Russian victims that forces MVD attention, the rule set the Nova crew enforced in reverse with its June 2026 affiliate ban and public apology','Choreographed arrest activity of the January 2022 REvil type, signalling an actor has become a diplomatic chip rather than an asset'],
      collectObjectives: []
    },
    genpros: {
      posture: 'COLLECT-ONLY',
      collectability: 'MEDIUM',
      decisionSummary: 'The Prosecutor General is a bottleneck, not a target: no external lever operates against it, and the post-2022 environment has made the blocking more reliable rather than less (Confirmed). The posture is COLLECT-ONLY by structure rather than by choice, and the collection product is diagnostic and unusually clean. A case that dies at Prosecutor General review after MVD and FNS have built it is confirmation that active protection exists for that actor, a finding no other node on the map produces. The 2021 REvil arrests are the studied example, arrests occurred and prosecution stalled, and the protection tiering reads that sequence as theatrical arrest used as a diplomatic chip rather than as enforcement (Confirmed). Two operational uses follow. First, referral structuring: tax evasion and laundering charges routed through FNS and MVD are harder to block at this stage than cybercrime charges, because cybercrime framing invites the national security review that triggers the block (Confirmed). Second, expectation management: a documented pattern of practice tells partner governments what Russian cooperation is actually worth before a mutual legal assistance request is spent on it (Analyst inference).',
      methods: ['Case Outcome Tracking from Arrest to Sentence for Russian Cybercrime Prosecutions','Referral Framing Analysis (which charge constructions survive review and which do not)','Mutual Legal Assistance Response Pattern Recording','Russian Court and Domestic Media Record Monitoring'],
      preActionIndicators: ['An MVD case with published arrests going quiet at the review stage with no charging decision','Charges downgraded or dropped following a regime-level signal, the REvil release pattern','A referral built on tax or laundering framing surviving where a cybercrime-framed referral previously failed'],
      collectObjectives: []
    },
    gru: {
      posture: 'COLLECT-ONLY',
      collectability: 'LOW',
      decisionSummary: 'GRU is a scope boundary before it is a target. Its relationship to criminal actors is operational rather than protective: the personnel are state employees, not co-opted freelancers, and no domestic Russian lever (MVD, FNS, CBR) applies to them, which removes the instrument set the rest of the state lane depends on (Confirmed). Posture is COLLECT-ONLY and the collection product is exclusion: identify GRU adjacency early enough that those actors are isolated out of campaigns aimed at commercially motivated ones, because misclassification here produces diplomatic and intelligence costs rather than merely a failed action. Collectability is LOW because adjacency shows up as targeting patterns and shared infrastructure rather than as documents, and the material that would confirm it generally sits in IC channels that cannot enter LE referral products without compartmentation review (Confirmed). Two things remain collectable in the open. Shared infrastructure is a legitimate target regardless of the downstream user, so BPH, VPN, and IAB nodes serving both criminal and GRU toolchains stay in scope on the criminal act alone (Confirmed). And the designation record is now explicit: the July 13, 2026 EU and UK package named LLC Impuls with owner Bashev, plus Kasyanenko, against Unit 29155 and the SSD, with the UK listing 24 targets in its largest coordinated cyber action to date (Confirmed). Designations map the boundary; they do not move the actors, all of whom remain at large.',
      methods: ['Targeting Pattern Analysis for Strategic Rather Than Financial Motivation','Shared Infrastructure Correlation (BPH, VPN, and IAB nodes serving both toolchains)','Destructive Operation Attribution Review (ransomware-styled deployment used as cover)','Designation and Public Attribution Record Monitoring'],
      preActionIndicators: ['Victim set shifting toward NATO, Ukrainian, or critical infrastructure targets with no corresponding extortion revenue pattern','A ransomware-styled deployment with no functional payment or decryption path (wiper behaviour under criminal cover)','Criminal infrastructure showing operational overlap with a known GRU cluster during an active military objective window'],
      collectObjectives: []
    },
    svr: {
      posture: 'COLLECT-ONLY',
      collectability: 'LOW',
      decisionSummary: 'SVR carries the smallest ransomware footprint of the three services and sits on this map for scope discipline rather than for pressure. It is an espionage service: its cyber operations target government, defence, and diplomatic networks (APT29 and the SolarWinds compromise), it does not run a krysha the way FSB does, and it does not expose its criminal contacts either (Confirmed). Posture is COLLECT-ONLY, and unlike the other COLLECT-ONLY nodes the reason is not replaceability. There is nothing here to act against without acting on a sovereign intelligence relationship: any action touching SVR-adjacent infrastructure carries escalation risk out of proportion to the ransomware disruption it would produce (Analyst inference). Collectability is LOW for the same reason it is LOW at GRU: overlap indicators are technical and belong in IC channels, and surfacing them in shared LE products without compartmentation review is the specific failure mode the framework warns against (Confirmed). The usable intersections are two, and both point elsewhere on the map. SVR operators buy network access from the same initial access brokers who supply ransomware affiliates, and the broker\'s criminal act is unchanged by who the buyer is, so the IAB node stays fully in scope. The same logic covers shared BPH and anonymization infrastructure (Confirmed).',
      methods: ['IAB Market Overlap Indicator Collection (buyer-side indicators on broker listings)','Shared Infrastructure Technical Indicator Correlation (BPH and anonymization layers)','Compartmentation Review of Overlap Indicators Before Any LE Sharing'],
      preActionIndicators: ['An IAB listing or broker relationship showing buyer indicators consistent with an espionage rather than an extortion follow-on','A BPH or VPN provider under consideration for action showing SVR-adjacent tenancy','Personnel proximity reporting linking a criminal actor to SVR contacts, which requires corroboration before it enters any product'],
      collectObjectives: []
    }
  }
};
