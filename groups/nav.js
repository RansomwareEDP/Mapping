/* nav.js — renders the cross-page sidebar and the in-page lineage chips
   from window.GROUPS (defined in groups-data.js). Include AFTER groups-data.js
   on every profile page. Degrades gracefully: if GROUPS is missing, the page's
   static sidebar is left untouched. */
(function () {
  var GROUPS = window.GROUPS || [];
  if (!GROUPS.length) return;

  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function startYear(g) { var m = (g.active || '').match(/\d{4}/); return m ? +m[0] : 9999; }

  var curSlug = (location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '');
  var bySlug = {}; GROUPS.forEach(function (g) { bySlug[g.slug] = g; });

  /* ---- styles ---- */
  var css = [
    '.group-era-label{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gray-400);padding:12px 12px 4px;opacity:.8;}',
    '.group-era-label:first-child{padding-top:2px;}',
    '.lineage-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:13px 48px;background:var(--navy-mid);border-bottom:1px solid var(--navy-light);}',
    '.lineage-bar .lineage-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gray-400);margin-right:2px;}',
    '.lineage-chip{font-size:12px;font-weight:600;color:var(--gray-300);background:var(--navy-light);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:5px 12px;text-decoration:none;transition:background .15s,color .15s;display:inline-flex;align-items:center;gap:6px;}',
    '.lineage-chip:hover{background:var(--accent);color:#fff;}',
    '.lineage-chip .lc-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}',
    '@media print{.lineage-bar{display:none;}}',
    '[data-theme="dark"] .lineage-bar{background:#161b22;border-bottom-color:#21262d;}',
    '[data-theme="dark"] .lineage-chip{background:#21262d;border-color:#30363d;color:#c9d1d9;}',
    '[data-theme="dark"] .lineage-chip:hover{background:var(--accent);color:#fff;}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function build() {
    /* ---- sidebar group list, grouped by era ---- */
    var nav = document.querySelector('.sidebar .group-list');
    if (nav) {
      var map = {};
      GROUPS.forEach(function (g) {
        var sec = (g.era === 'origins') ? 'Origins' : g.status;
        (map[sec] = map[sec] || []).push(g);
      });
      Object.keys(map).forEach(function (k) {
        map[k].sort(function (a, b) { return startYear(a) - startYear(b) || a.name.localeCompare(b.name); });
      });
      var ORDER = ['Origins', 'Active', 'Disrupted', 'Inactive', 'Defunct'];
      var html = '';
      ORDER.forEach(function (sec) {
        var items = map[sec]; if (!items || !items.length) return;
        html += '<div class="group-era-label">' + sec + '</div>';
        items.forEach(function (g) {
          var active = g.slug === curSlug ? ' active' : '';
          html += '<a class="group-item' + active + '" href="' + g.slug + '.html">'
                + '<span class="group-dot" style="background:' + (g.color || '#9aa3af') + '"></span>'
                + esc(g.name) + '</a>';
        });
      });
      nav.innerHTML = html;
      var cnt = document.querySelector('.group-count');
      if (cnt) cnt.textContent = GROUPS.length;
    }

    /* ---- in-page lineage chips (inserted right after the hero) ---- */
    var cur = bySlug[curSlug];
    var hero = document.querySelector('.hero');
    if (cur && cur.related && cur.related.length && hero && !document.querySelector('.lineage-bar')) {
      var chips = cur.related.map(function (s) { return bySlug[s]; }).filter(Boolean);
      if (chips.length) {
        var bar = '<div class="lineage-bar"><span class="lineage-label">Lineage &amp; related</span>'
          + chips.map(function (g) {
              return '<a class="lineage-chip" href="' + g.slug + '.html">'
                   + '<span class="lc-dot" style="background:' + (g.color || '#9aa3af') + '"></span>'
                   + esc(g.name) + '</a>';
            }).join('')
          + '</div>';
        hero.insertAdjacentHTML('afterend', bar);
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
