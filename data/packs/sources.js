/* ==================================================================
   RANSOMWARE ECOSYSTEM MAP : SOURCES PACK (open collection coverage)
   ------------------------------------------------------------------
   Loaded by the sources edition (?edition=sources). One row per map
   node: what OPEN collection feeds it today, where the map is dark,
   and what would close the gap. Drives the Coverage overlay and the
   "Open collection coverage" section of each node panel.

   Status values:
     INSTRUMENTED       at least one recurring open series feeds the node
     PARTIAL            a source touches the node but a major channel is missing
     DARK               no feed today, but a plausible open collection path exists
     STRUCTURALLY DARK  no feed and no realistic open path: reporting,
                        court records and leaks by nature, not by budget

   Only open sources are described here. Status changes on evidence
   (a collector run, a new public dataset), never on intention.
   Counts in the legend are computed from these rows, never typed in.
   ================================================================== */
window.MAP_PACKS = window.MAP_PACKS || {};
MAP_PACKS.sources = {
  meta: { pack:'sources', asOf:'2026-09-06', version:'1' },
  statuses: {
    'INSTRUMENTED':      { color:'#3a9850', short:'INSTRUMENTED' },
    'PARTIAL':           { color:'#c8a020', short:'PARTIAL' },
    'DARK':              { color:'#c03040', short:'DARK' },
    'STRUCTURALLY DARK': { color:'#5a6880', short:'STRUCT. DARK' }
  },
  byNode: {
    bph:      { status:'INSTRUMENTED', feeds:'Daily routing check on the known providers\' network ranges, registry and sponsor standing, and whether live malware infrastructure currently sits on their own address space. Routing alive while public chatter is quiet is itself the readout.', gap:'Successor brands that appear only in routing are tracked by network, not by name, until a public record ties them to an operator.', fix:'Keep the provider list current as brands rotate.' },
    vpn:      { status:'DARK', feeds:'Reporting only: takedowns and designations arrive through press and government releases.', gap:'No curated provider list and no network watch exist for this node.', fix:'A provider list with network ranges would reuse the routing check that already runs.' },
    forums:   { status:'PARTIAL', feeds:'Weekly liveness check on known forum front doors (up or down, and how long down).', gap:'The largest forums serve only gated front doors, so public statistics are unavailable for them; forum content is out of scope by decision.', fix:'Add the missing front-door addresses; decide whether splash pages count as liveness.' },
    crypters: { status:'DARK', feeds:'Nothing dedicated. Public malware-sample repositories carry indirect prevalence data that is not yet read.', gap:'No family list and no watch slot.', fix:'One line per crypter family in the sample watch.' },
    callers:  { status:'DARK', feeds:'Reporting only; the 2026 phishing-as-a-service takedowns arrived that way.', gap:'No caller dataset exists anywhere, and spam feeds cannot be attributed to named actors.', fix:'None justified; add a court-docket term when an operator is indicted.' },
    loaders:  { status:'DARK', feeds:'The botnet tracker channel is wired and the major loader families were added to it in September 2026; the status changes when the first run returns results.', gap:'A seed gap, not a sensor gap: the covering feed already runs.', fix:'Nothing further until the next run.' },
    stealers: { status:'INSTRUMENTED', feeds:'Weekly indicator series for the major stealer families from public malware-sample and indicator repositories.', gap:'The family list was deliberately narrow at launch and was widened in September 2026.', fix:'None pending.' },
    exploits: { status:'PARTIAL', feeds:'The CISA Known Exploited Vulnerabilities catalogue drives the exploitation-interval figures; the forum liveness check covers the exploit marketplace front door.', gap:'KEV records what is exploited, not who brokers it. The broker market is dark to open collection.', fix:'A standing KEV-velocity series on the existing fetch chassis; a named-entity watch for the state-linked brokers.' },
    iab:      { status:'DARK', feeds:'Reporting only; the 2026 price-collapse observation is single-source.', gap:'Listings sit behind forum authentication walls or inside paid vendor feeds.', fix:'Vendor quarterly reports collected on a calendar give a low-frequency open series. Carry the price claim with a single-source caveat.' },
    raas:     { status:'INSTRUMENTED', feeds:'Daily victim pipeline from leak-site postings, a brand roster with active, quiet and dormant states, and federal court dockets. With leak sites, the best-fed node on the map.', gap:'Brand level only; leak-site presence is offender-published data.', fix:'Nothing cheap missing at brand level.' },
    affiliate:{ status:'STRUCTURALLY DARK', feeds:'Indictments, leaked chat corpora, reporting.', gap:'The individual level is invisible by design; visibility arrives through leaks and prosecutions.', fix:'None to buy. Leak corpora are the real channel.' },
    datamkt:  { status:'DARK', feeds:'Reporting. The main breach market has a liveness slot but no reachable front door; log markets have nothing.', gap:'No market inventory series exists.', fix:'Extend the liveness check to market landing pages that self-publish inventory counts.' },
    leaksite: { status:'INSTRUMENTED', feeds:'Daily victim pipeline plus leak-site snapshots back to 2013, a silence monitor for brands that stop posting, and state breach-notification records, the one channel the offender does not control.', gap:'Deepest coverage in the layer.', fix:'Keep the breach-notification source on a quarterly re-check.' },
    negot:    { status:'PARTIAL', feeds:'Outcome statistics through vendor reporting; court records where negotiators were prosecuted.', gap:'Outcomes are fed, but the service layer itself is a private business market with no public surface.', fix:'None cheap. Transcripts arrive through leak corpora when they arrive.' },
    bridge:   { status:'DARK', feeds:'Vendor reporting.', gap:'No open per-bridge criminal-flow series; attribution needs commercial blockchain analytics, which sit outside open collection.', fix:'Public explorers give liveness only, not criminal share.' },
    mixers:   { status:'DARK', feeds:'Sanctions actions and reporting; the enforcement tracker carries the designation side.', gap:'Activity is public, attribution is not. Same wall as bridges.', fix:'None open.' },
    otc:      { status:'PARTIAL', feeds:'Enforcement records, plus website and channel liveness for two named brokers.', gap:'Broker books are invisible; liveness shows presence, not volume.', fix:'Add court-docket and sanctions terms as brokers are named.' },
    cex:      { status:'DARK', feeds:'Enforcement events via reporting (freezes, compliance actions). This node is where pressure lands, not a collection target, so coverage expectations differ.', gap:'Nesting is visible only to the exchange itself and to blockchain analytics.', fix:'None open.' },
    ruexch:   { status:'INSTRUMENTED', feeds:'Exchange watch: website and Telegram liveness for the sanctioned exchanges and their successors, rebrand-chain aware, plus trading-activity signals from public APIs where an exchange exposes one.', gap:'Verified on-chain addresses per exchange are still being assembled from public sources; one exchange\'s API answer is ambiguous.', fix:'Finish the verified address pass.' },
    exchl:    { status:'DARK', feeds:'Reporting.', gap:'A critical node with an empty roster: nobody has named the current non-compliant set to watch.', fix:'Name the entities (a research job); the exchange watch then takes them one line each.' },
    mules:    { status:'STRUCTURALLY DARK', feeds:'Enforcement actions via news; prosecutions via court dockets.', gap:'The cash-out human layer has no open dataset; it is observable only when enforcement touches it.', fix:'Keep the enforcement channel.' },
    bankacct: { status:'STRUCTURALLY DARK', feeds:'Reporting.', gap:'Terminal fiat destination; bank-side data is regulator territory and never public.', fix:'None open.' },
    a7a5:     { status:'PARTIAL', feeds:'Sanctions actions and reporting. An independent on-chain turnover check is built and staged but has not yet run.', gap:'Until it runs, the published turnover claim is vendor-reported, not verified.', fix:'Run the turnover check.' },
    fsb:      { status:'STRUCTURALLY DARK', feeds:'Reporting, indictments, leaks.', gap:'State protection layer; no feed can exist.', fix:'Russian court records help at the margins when a portal is reachable.' },
    mvd:      { status:'STRUCTURALLY DARK', feeds:'Reporting (arrests, selective safe harbour).', gap:'Russian court and registry portals are gated to outside access.', fix:'A paid Russian court-records aggregator account is the one lever, and it covers the whole state layer at once.' },
    rosfin:   { status:'STRUCTURALLY DARK', feeds:'Reporting.', gap:'Protection relationships are unwatchable; only the rulebook is public.', fix:'Low-frequency watch on public advisories.' },
    cbr:      { status:'STRUCTURALLY DARK', feeds:'Reporting.', gap:'Rulebook public, application invisible.', fix:'Same document watch as Rosfinmonitoring.' },
    gru:      { status:'STRUCTURALLY DARK', feeds:'Reporting, indictments.', gap:'No feed can exist.', fix:'Narrative only.' },
    svr:      { status:'STRUCTURALLY DARK', feeds:'Reporting, indictments.', gap:'No feed can exist.', fix:'Narrative only.' },
    genpros:  { status:'STRUCTURALLY DARK', feeds:'Reporting.', gap:'Same gated court portals.', fix:'Same court-records lever.' },
    fns:      { status:'STRUCTURALLY DARK', feeds:'Reporting.', gap:'Company-registry data sits behind access walls.', fix:'Same lever, registry side.' },
    doxing:   { status:'DARK', feeds:'Reporting (investigative journalists, the published leak corpora).', gap:'Actor-run channels, irregular by nature.', fix:'Optional watch on the known exposure channels.' },
    'enab-transit':  { status:'DARK', feeds:'Static analysis of each hosting provider\'s upstream carriers, published on the enablement-layer page; snapshots, not a series.', gap:'The published dependency claim rests on snapshots.', fix:'Diff each provider\'s upstream set on every routing run: the one build that turns the central leverage claim from documented into measured.' },
    'enab-registry': { status:'DARK', feeds:'Reporting; static analysis on the enablement-layer page.', gap:'No feed of registry or sponsoring-LIR actions exists.', fix:'RIPE database delegation and LIR records are public and scriptable; needs scoping.' },
    'enab-corp':     { status:'DARK', feeds:'Reporting; company-register checks for named shells.', gap:'Visibility depends on jurisdiction: UK registers are free and machine-readable, others progressively opaque. Absence of a record is never absence of a shell.', fix:'Register checks for named shells as a calendar habit, UK first.' }
  }
};
