/* node-library.js — unified Node Library switcher for all profile and index pages.
   Rendered into every element with class "node-library".
   Two-step navigation: pick a node type, then pick a profile, and the page opens.

   TO ADD A NEW PROFILE: add one line to the matching items list below
   (format: ['fileslug', 'Display Name']). Every page across the site
   picks it up automatically. No other edits needed.                         */
(function () {
  'use strict';

  var TYPES = [
    { id: 'groups', label: 'Ransomware Groups', folder: 'groups', items: [
      ['8base', '8Base / Phobos'],
      ['akira', 'Akira'],
      ['alphv', 'ALPHV / BlackCat'],
      ['blackbasta', 'Black Basta'],
      ['clop', 'Cl0p'],
      ['conti', 'Conti'],
      ['darkside', 'DarkSide / BlackMatter'],
      ['dragonforce', 'DragonForce'],
      ['dyre', 'Dyre / Dyreza'],
      ['lockbit', 'LockBit'],
      ['silentransom', 'Luna Moth / SRG'],
      ['lynx', 'Lynx / INC'],
      ['nightspire', 'NightSpire'],
      ['payload', 'Payload'],
      ['qilin', 'Qilin'],
      ['revil', 'REvil / Sodinokibi'],
      ['royal', 'Royal / BlackSuit / Chaos'],
      ['ryuk', 'Ryuk'],
      ['scatteredspider', 'Scattered Spider'],
      ['thegentlemen', 'The Gentlemen'],
      ['trickbot', 'TrickBot'],
      ['worldleaks', 'World Leaks / Hunters Intl'],
      ['zeus', 'Zeus / GameOver Zeus']
    ]},
    { id: 'exchanges', label: 'Cryptocurrency Exchanges', folder: 'exchanges', items: [
      ['abcex', 'ABCeX'],
      ['audia6', 'AudiA6 / Dark2Web'],
      ['bitpapa', 'Bitpapa'],
      ['btce', 'BTC-e / WEX'],
      ['cryptex', 'Cryptex / PM2BTC'],
      ['exmo', 'EXMO'],
      ['garantex', 'Garantex / Grinex'],
      ['post-garantex-network', 'Post-Garantex Network'],
      ['rapira', 'Rapira']
    ]},
    { id: 'bphs', label: 'BPH Providers', folder: 'bphs', items: [
      ['aeza', 'Aeza Group'],
      ['bearhost', 'Bearhost / Underground'],
      ['dedbropro', 'DEDBROPRO'],
      ['medialand', 'Media Land / Yalishanda'],
      ['stark', 'Stark Industries / THE.Hosting'],
      ['zservers', 'ZServers / XHost']
    ]}
  ];

  /* ---- where are we ---- */
  var path = (location.pathname || '').toLowerCase();
  var parts = path.split('/').filter(Boolean);
  var last = parts.length ? parts[parts.length - 1] : '';
  var curSlug = last.replace(/\.html$/, '');
  var curType = null;
  TYPES.forEach(function (t) {
    if (path.indexOf('/' + t.folder + '/') !== -1 || curSlug === t.folder) curType = t;
  });
  if (curType && (curSlug === curType.folder || curSlug === 'index' || curSlug === '')) curSlug = 'index';

  /* ---- styles (uses page theme variables, with fallbacks) ---- */
  var css = [
    '.node-library{padding:14px 16px 12px;border-bottom:1px solid var(--border,rgba(128,128,128,.25));}',
    '.node-library .nl-label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim,var(--gray-400,#8a93a3));margin-bottom:7px;}',
    '.node-library select{display:block;width:100%;background:var(--bg-card,var(--navy-mid,#141a26));border:1px solid var(--border,rgba(255,255,255,.15));color:var(--text,var(--gray-200,#d7dde6));padding:6px 8px;border-radius:4px;font-size:12px;margin-bottom:7px;cursor:pointer;}',
    '.node-library select:last-child{margin-bottom:0;}',
    '.node-library-inline{border-bottom:none;padding:16px 0 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}',
    '.node-library-inline .nl-label{margin-bottom:0;}',
    '.node-library-inline select{display:inline-block;width:auto;min-width:180px;margin-bottom:0;}',
    '@media print{.node-library{display:none;}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---- render ---- */
  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function entityOptions(type) {
    var html = '<option value="" disabled' + (typeIsCurrent(type) && curSlug !== 'index' ? '' : ' selected') + '>Select a profile…</option>';
    html += '<option value="index">» All ' + esc(type.label) + '</option>';
    var items = type.items.slice().sort(function (a, b) {
      return a[1].toLowerCase().localeCompare(b[1].toLowerCase());
    });
    items.forEach(function (it) {
      var sel = (typeIsCurrent(type) && curSlug === it[0]) ? ' selected' : '';
      html += '<option value="' + esc(it[0]) + '"' + sel + '>' + esc(it[1]) + '</option>';
    });
    return html;
  }

  function typeIsCurrent(type) { return curType && curType.id === type.id; }

  function hrefFor(type, slug) {
    var target = (slug === 'index') ? 'index.html' : slug + '.html';
    if (curType) return '../' + type.folder + '/' + target;
    return type.folder + '/' + target;
  }

  function build(box) {
    var typeSel = document.createElement('select');
    typeSel.setAttribute('aria-label', 'Node type');
    TYPES.forEach(function (t, i) {
      var o = document.createElement('option');
      o.value = String(i);
      o.textContent = t.label;
      if (typeIsCurrent(t)) o.selected = true;
      typeSel.appendChild(o);
    });
    if (!curType) typeSel.selectedIndex = 0;

    var entSel = document.createElement('select');
    entSel.setAttribute('aria-label', 'Profile');

    function refresh() {
      var t = TYPES[+typeSel.value];
      entSel.innerHTML = entityOptions(t);
      if (!typeIsCurrent(t)) entSel.selectedIndex = 0;
    }
    refresh();

    typeSel.addEventListener('change', refresh);
    entSel.addEventListener('change', function () {
      var t = TYPES[+typeSel.value];
      if (entSel.value) location.href = hrefFor(t, entSel.value);
    });

    var lab = document.createElement('div');
    lab.className = 'nl-label';
    lab.textContent = 'Node Library';

    box.innerHTML = '';
    box.appendChild(lab);
    box.appendChild(typeSel);
    box.appendChild(entSel);
  }

  function init() {
    var boxes = document.querySelectorAll('.node-library');
    for (var i = 0; i < boxes.length; i++) build(boxes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
