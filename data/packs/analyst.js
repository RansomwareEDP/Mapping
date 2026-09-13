/* ==================================================================
   RANSOMWARE ECOSYSTEM MAP : ANALYST PACK
   ------------------------------------------------------------------
   Loaded by the analyst edition (?edition=analyst). Adds two things
   on top of the public data:

   1. MEASUREMENT overlay. Reads the live measurement register that
      the daily collectors write (data/measurement/node-coverage.json)
      and colours each node by its verdict. Nothing is copied here;
      the page fetches the register when the overlay is switched on,
      so the overlay is exactly as current as the last collector run.

   2. ENFORCEMENT records in the node panel. The enforcement tracker
      (data/enforcement.json) and the takedown scoreboard
      (data/scoreboard.json) describe targets by type, not by map
      node. The crosswalk below matches target-type words to node ids
      so each node panel can list the records that touch it. It is a
      keyword match: review before citing.
   ================================================================== */
window.MAP_PACKS = window.MAP_PACKS || {};
MAP_PACKS.analyst = {
  meta: { pack:'analyst', version:'1' },
  registerUrl: 'data/measurement/node-coverage.json',
  enforcementUrl: 'data/enforcement.json',
  scoreboardUrl: 'data/scoreboard.json',
  /* 3. LATEST READINGS. The register says which collector file feeds a
        node; the map fetches that file when the node is selected and
        shows its latest values in plain language. One entry per feed the
        collectors write. Every reading carries the feed's own caveat. */
  feeds: {
    'victims-monthly.json':   { url:'data/measurement/victims-monthly.json',   label:'Leak-site victim postings',        source:'ransomware.live' },
    'exploit-lag.json':       { url:'data/measurement/exploit-lag.json',       label:'Exploitation lag (CISA KEV)',      source:'CISA Known Exploited Vulnerabilities' },
    'crypter-usage.json':     { url:'data/measurement/crypter-usage.json',     label:'Packer and crypter prevalence',    source:'MalwareBazaar (abuse.ch)' },
    'hosted-threats.json':    { url:'data/measurement/hosted-threats.json',    label:'Live malware infrastructure',      source:'ThreatFox, URLhaus, Feodo (abuse.ch)' },
    'transit-carriers.json':  { url:'data/measurement/transit-carriers.json',  label:'Routing and upstream carriers',    source:'RIPEstat' },
    'registry-sponsors.json': { url:'data/measurement/registry-sponsors.json', label:'Registry standing and sponsors',   source:'RIPE Database' },
    'formation-agents.json':  { url:'data/measurement/formation-agents.json',  label:'UK shell companies',               source:'Companies House' },
    'sanctioned-wallets.json':{ url:'data/measurement/sanctioned-wallets.json',label:'Designated wallet activity',       source:'OFAC SDN list joined to public chains' },
    'staleness.json':         { url:'data/measurement/staleness.json',         label:'Age of hand-maintained evidence',  source:'this site' },
    'sanctions-drift.json':   { url:'data/measurement/sanctions-drift.json',   label:'Sanctions tracker drift',          source:'OFAC SDN list vs the enforcement tracker' },
    'scoreboard-drift.json':  { url:'data/measurement/scoreboard-drift.json',  label:'Scoreboard outcome check',         source:'victim series vs the takedown scoreboard' }
  },
  verdicts: {
    MEASURED:       { color:'#3a9850', short:'MEASURED',   text:'A daily collector currently produces a series for this node.' },
    PARTIAL:        { color:'#c8a020', short:'PARTIAL',    text:'A collector touches the node but a major channel is missing or not yet running.' },
    STALE:          { color:'#d07030', short:'STALE',      text:'A collector exists but has not run inside the freshness window.' },
    GAP:            { color:'#c03040', short:'GAP',        text:'No collector feeds this node today, though a collection path exists.' },
    NOT_MEASURABLE: { color:'#5a6880', short:'NOT MEAS.',  text:'No open feed can exist for this node; coverage is reporting, court records and leaks by nature.' },
    UNMAPPED:       { color:'#3a5878', short:'UNMAPPED',   text:'The register has no entry for this node.' }
  },
  /* target-type words (case-insensitive) to map node ids */
  crosswalk: [
    { match:/bulletproof|\bbph\b/i,            nodes:['bph'] },
    { match:/vpn/i,                             nodes:['vpn'] },
    { match:/crypter/i,                         nodes:['crypters'] },
    { match:/forum/i,                           nodes:['forums'] },
    { match:/botnet|malware infrastructure|loader/i, nodes:['loaders'] },
    { match:/infostealer|stealer/i,             nodes:['stealers'] },
    { match:/ransomware group|^group/i,         nodes:['raas'] },
    { match:/affiliate|deployer/i,              nodes:['affiliate'] },
    { match:/darknet market|\bmarket\b/i,       nodes:['datamkt'] },
    { match:/mixer/i,                           nodes:['mixers'] },
    { match:/laundering/i,                      nodes:['mixers','otc'] },
    { match:/exchange/i,                        nodes:['ruexch','exchl'] },
    { match:/stablecoin/i,                      nodes:['a7a5'] },
    { match:/gru/i,                             nodes:['gru'] }
  ]
};
