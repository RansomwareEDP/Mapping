/* bph-upstreams.js : shared upstream-dependency data for BPH providers.
   Single source of truth for the cross-profile upstream map and for every
   count derived from it.

   TO ADD A NEWLY PUBLISHED BPH: add one entry to PROVIDERS below, in the
   order you want it to appear. The enablement-layer page rebuilds its
   Section 03 table and recalculates every count automatically. Nobody
   types "5 of 7" anywhere, the same rule the site already uses for
   profile counts.

   FIELDS
     slug     file name in /bphs/ without .html, also used for the link
     name     display name in the table and in prose lists
     chain    documented upstream transit chain, from the profile Section 04
     juris    jurisdictions the upstreams sit in, or "None"
     western  true if at least one upstream is inside an EU, UK or US
              jurisdiction, which is what determines whether the transit
              lever exists at all for that provider
     lever    assessment of whether the lever is available and whether it
              has been used

   If this file is edited, bump the ?v= number wherever it is referenced so
   browser caches refresh, the same rule as node-library.js and glossary.js.

   House style: no em dashes anywhere.                                       */
(function () {
  'use strict';

  var PROVIDERS = [
    {
      slug: 'aeza', name: 'Aeza Group', western: true,
      chain: 'aurologic GmbH (AS30823, Germany, primary European upstream and colocation); Hetzner (AS24940, Germany); Hurricane Electric (AS6939, US); Zayo (AS8218, US)',
      juris: 'Germany, United States',
      lever: 'Available and unused. aurologic remained a primary upstream after US, UK, and Australian designations.'
    },
    {
      slug: 'stark', name: 'Stark / THE.Hosting', western: true,
      chain: 'MIRhosting (Almere, Netherlands), physical colocation and transit to AMS-IX and DE-CIX Frankfurt',
      juris: 'Netherlands, Germany',
      lever: 'Available. Exercised indirectly through the May 2026 Dutch seizure and arrests rather than through de-peering.'
    },
    {
      slug: 'zservers', name: 'ZServers / XHost', western: true,
      chain: 'Hostkey (Netherlands) confirmed as at least one upstream via the September 2024 breach; additional transit undocumented',
      juris: 'Netherlands',
      lever: 'Available. Not used: the February 2025 action went straight to sanctions and physical seizure.'
    },
    {
      slug: 'dedbropro', name: 'DEDBROPRO', western: true,
      chain: 'Belcloud (AS44901, Bulgaria); CJSC RASCOM (AS20764, Russia)',
      juris: 'Bulgaria (EU)',
      lever: 'Available and unused. No designation exists against the entity, so no compulsion pathway currently applies.'
    },
    {
      slug: 'virtualine', name: 'Virtualine / Railnet', western: true,
      chain: 'aurologic GmbH (AS30823, Germany, primary, carrying roughly 95 percent of Railnet traffic); Pfcloud UG (AS51396, Germany, secondary, a single range)',
      juris: 'Germany',
      lever: 'Available and unused. No designation exists against Virtualine, Railnet, or their fronts, so no compulsion pathway currently applies. aurologic continued serving these networks through late 2025 while also serving the sanctioned Aeza.'
    },
    {
      slug: 'medialand', name: 'Media Land', western: false,
      chain: 'NetCom-R (AS49531, RU); MegaFon (AS20632, RU); SYSECT D.O.O. (AS202799, Montenegro); Lavrentyev A.A. (AS51538, RU). Historical: Vimpelcom/Beeline (AS3216), ERTH (AS9049)',
      juris: 'Montenegro only',
      lever: 'Effectively absent. All four peers remained in place through the November 2025 sanctions and the July 2026 indictment and EU designation.'
    },
    {
      slug: 'bearhost', name: 'Bearhost / PROSPERO', western: false,
      chain: 'Kaspersky Lab (AS209030) since December 2024. Kaspersky denies an intentional relationship. PROTON66 upstream chain not documented.',
      juris: 'None',
      lever: 'Absent. Transit sits inside Russia with a vendor that is itself outside Western regulatory reach.'
    }
  ];

  /* ---- helpers ---- */
  var WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
               'eight', 'nine', 'ten', 'eleven', 'twelve'];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function word(n) { return WORDS[n] || String(n); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* "a, b and c" */
  function joinList(names) {
    if (names.length === 0) return 'none';
    if (names.length === 1) return names[0];
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  }

  /* pages sitting inside /bphs/ need a different relative path than root pages */
  function linkPrefix() {
    var p = (location.pathname || '').toLowerCase();
    return p.indexOf('/bphs/') !== -1 ? '' : 'bphs/';
  }

  var withW = PROVIDERS.filter(function (p) { return p.western; });
  var without = PROVIDERS.filter(function (p) { return !p.western; });

  var STATS = {
    total: PROVIDERS.length,
    western: withW.length,
    westernNames: withW.map(function (p) { return p.name.split(' / ')[0]; }),
    noneNames: without.map(function (p) { return p.name.split(' / ')[0]; })
  };

  /* ---- fillers, each keyed off a data attribute so pages opt in ---- */
  var FILL = {
    /* "5 of 7" */
    'count-fraction': function () { return STATS.western + ' of ' + STATS.total; },
    /* "Five of seven" */
    'count-words': function () { return cap(word(STATS.western)) + ' of ' + word(STATS.total); },
    /* "five of seven" */
    'count-words-lower': function () { return word(STATS.western) + ' of ' + word(STATS.total); },
    /* "seven" */
    'total-word': function () { return word(STATS.total); },
    /* comma list of every provider, for the attribute table */
    'provider-list': function () {
      return PROVIDERS.map(function (p) { return p.name; })
        .sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); })
        .join(', ');
    },
    /* "Aeza, Stark, ZServers, DEDBROPRO and Virtualine" */
    'western-names': function () { return joinList(STATS.westernNames); },
    /* "Media Land and Bearhost" */
    'none-names': function () { return joinList(STATS.noneNames); }
  };

  function buildTable(tbody) {
    var prefix = linkPrefix();
    tbody.innerHTML = PROVIDERS.map(function (p) {
      return '<tr>' +
        '<td><a href="' + prefix + esc(p.slug) + '.html" style="color:var(--accent,#58a6ff);text-decoration:none">' +
          esc(p.name) + '</a></td>' +
        '<td>' + esc(p.chain) + '</td>' +
        '<td>' + esc(p.juris) + '</td>' +
        '<td>' + esc(p.lever) + '</td>' +
      '</tr>';
    }).join('');
  }

  function init() {
    var tbody = document.getElementById('bph-upstream-rows');
    if (tbody) buildTable(tbody);

    var slots = document.querySelectorAll('[data-bph]');
    for (var i = 0; i < slots.length; i++) {
      var key = slots[i].getAttribute('data-bph');
      if (FILL[key]) slots[i].textContent = FILL[key]();
    }
  }

  /* expose for other components that may want the same numbers */
  window.BPH_UPSTREAMS = { providers: PROVIDERS, stats: STATS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
