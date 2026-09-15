/* ==================================================================
   RANSOMWARE ECOSYSTEM MAP : EDITION MANIFESTS
   ------------------------------------------------------------------
   One rendering shell (map.html), several editions. An edition is a
   manifest: which data packs load, which menus and controls show,
   which overlays start switched on. An edition is NEVER a copy of a
   data file. All packs live in data/packs/.

   Open an edition with ?edition=<name> on the map URL:
     /map                     public edition (default, unchanged)
     /map?edition=analyst     public data plus the measurement layer
     /map?edition=sources     public data plus the coverage layer
     /map?edition=briefing    presentation mode plus the nine-step briefing walkthrough

   Fields:
     title       header title
     subtitle    header helper line
     packs       pack names to load, in order (structure is required)
     menus       which of the three menus render (view, overlays, stories)
     controls    per-control visibility; a control not listed is shown
     startWith   overlays switched on when the page opens
     startPresent open in presentation mode (controls hidden, labels enlarged)
     extends     copy another edition first, then apply this one

   CACHE: the monthly bumps the ?v= number on the manifest script tag in
   map.html; that number versions every pack. Keep `version` here in step
   with it (it is the fallback for self-contained copies).
   ================================================================== */
window.MAP_MANIFESTS = {
  version: '10',
  defaultEdition: 'public',
  editions: {

    public: {
      title: 'Ransomware Ecosystem v3.0',
      subtitle: 'Scroll to zoom. Drag to pan. Click a node to inspect. View, Overlays and Stories menus above; search filters live.',
      packs: ['structure', 'events', 'coverage', 'cases', 'teaching'],
      menus: { view: true, overlays: true, stories: true },
      controls: {},
      startWith: []
    },

    analyst: {
      extends: 'public',
      title: 'Ransomware Ecosystem v3.0 · Analyst',
      subtitle: 'Public data plus the measurement layer: which nodes the daily collectors instrument, their latest readings, and the enforcement records that touch each node.',
      packs: ['structure', 'events', 'coverage', 'cases', 'teaching', 'analyst'],
      startWith: ['measurement']
    },

    briefing: {
      extends: 'public',
      title: 'Ransomware Ecosystem v3.0 · Briefing',
      subtitle: 'The map in presentation mode with a nine-step walkthrough for a senior audience. Press Teaching to start; Present returns to the full map.',
      packs: ['structure', 'events', 'coverage', 'cases', 'briefing'],
      startPresent: true,
      startWith: []
    },

    sources: {
      extends: 'public',
      title: 'Ransomware Ecosystem v3.0 · Sources',
      subtitle: 'Public data plus the coverage layer: what open collection feeds each node today, where the map is dark, and why.',
      packs: ['structure', 'events', 'coverage', 'cases', 'teaching', 'sources'],
      controls: { 'btn-centrality': false },
      startWith: ['coverage']
    }
  }
};
