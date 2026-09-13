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
