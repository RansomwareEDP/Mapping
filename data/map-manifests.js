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

   Fields:
     title       header title
     subtitle    header helper line
     packs       pack names to load, in order (structure is required)
     menus       which of the three menus render (view, overlays, stories)
     controls    per-control visibility; a control not listed is shown
     startWith   overlays switched on when the page opens
     extends     copy another edition first, then apply this one

   CACHE: bump `version` whenever any pack changes so browsers refetch.
   ================================================================== */
window.MAP_MANIFESTS = {
  version: '7',
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
      subtitle: 'Public data plus the measurement layer: which nodes the daily collectors actually instrument, and which enforcement records touch each node.',
      packs: ['structure', 'events', 'coverage', 'cases', 'teaching', 'analyst'],
      startWith: ['measurement']
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
