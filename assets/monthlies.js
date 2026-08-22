// ─────────────────────────────────────────────────────────────────────────────
// MONTHLY ACTIVITY REPORTS: the single master list.
//
// Added 22 Aug 2026 after the homepage and the library drifted apart. The
// homepage carried a hand-typed grid of four PDF cards stopping at June; the
// library carried a separate hand-typed grid of five HTML editions through July.
// When the 5 Aug convention change dropped PDFs in favour of HTML, only one of
// the two lists was updated. Two hand-maintained copies of one list will always
// drift, so now both render from this file.
//
// SAME PATTERN as assets/node-library.js, assets/bph-upstreams.js and
// assets/glossary.js: add an entry here and every surface updates itself.
//
// PUBLISHING A NEW MONTHLY
//   1. Put the HTML edition in briefs/edp-monthly-YYYY-MM.html
//   2. Add one entry at the TOP of the array below
//   3. Bump the ?v= number on every page that loads this file
//   There is no step 4. Do not edit the homepage or the library by hand.
//
// Fields
//   ym     "YYYY-MM", used for sorting and for the month chip
//   month  three-letter chip, uppercase
//   name   month and year as written
//   title  card heading
//   desc   one line, what the month was actually about
//   html   path from the SITE ROOT, no leading slash
//   pdf    optional. Editions from Jul 2026 onward are HTML only.
// ─────────────────────────────────────────────────────────────────────────────

const EDP_MONTHLIES = [
  {
    ym: "2026-07", month: "JUL", name: "July 2026",
    title: "July 2026 Activity Summary",
    desc: "Tri-lateral sanctions package, the shift to enabler targeting, issuer-level asset freezing, and payment concentration",
    html: "briefs/edp-monthly-2026-07.html"
  },
  {
    ym: "2026-06", month: "JUN", name: "June 2026",
    title: "June 2026 Activity Summary",
    desc: "Operation Endgame's June phase against the loader and stealer layer, the AudiA6 laundering takedown, and confirmed CIS-exclusion enforcement",
    html: "briefs/edp-monthly-2026-06.html", pdf: "docs/EDP_Monthly_2026-06.pdf"
  },
  {
    ym: "2026-05", month: "MAY", name: "May 2026",
    title: "May 2026 Activity Summary",
    desc: "The Stark Industries seizure, RAMP passing 120 days dark, and supply-chain compromise entering mainstream intrusion reporting",
    html: "briefs/edp-monthly-2026-05.html", pdf: "docs/EDP_Monthly_2026-05.pdf"
  },
  {
    ym: "2026-04", month: "APR", name: "April 2026",
    title: "April 2026 Activity Summary",
    desc: "Affiliate-pool expansion at unprecedented scale, the Grinex collapse, and the EU ban on the digital ruble",
    html: "briefs/edp-monthly-2026-04.html", pdf: "docs/EDP_Monthly_2026-04.pdf"
  },
  {
    ym: "2026-03", month: "MAR", name: "March 2026",
    title: "March 2026 Activity Summary",
    desc: "RAMP and LeakBase seized inside five weeks, removing the forum layer that arbitrated recruitment and credential trading",
    html: "briefs/edp-monthly-2026-03.html", pdf: "docs/EDP_Monthly_2026-03.pdf"
  }
];

// ── renderer ────────────────────────────────────────────────────────────────
// Any element with data-monthlies gets filled. Attributes:
//   data-monthlies="full"    library style, full cards        (default)
//   data-monthlies="compact" homepage style, doc-card grid
//   data-limit="4"           show only the newest N
//   data-base="../"          path prefix, for pages not at the site root
(function () {
  function render(el) {
    const style = el.getAttribute("data-monthlies") || "full";
    const limit = parseInt(el.getAttribute("data-limit") || "0", 10);
    const base = el.getAttribute("data-base") || "";
    const list = EDP_MONTHLIES
      .slice()
      .sort((a, b) => b.ym.localeCompare(a.ym))
      .slice(0, limit > 0 ? limit : undefined);

    el.innerHTML = list.map(m => {
      const href = base + m.html;
      if (style === "compact") {
        return '<a class="doc-card" href="' + href + '">'
          + '<div class="doc-num">' + m.month + '</div><div>'
          + '<div class="doc-title">EDP Monthly Report &middot; ' + m.name + '</div>'
          + '<div class="doc-subtitle">' + m.desc + '</div></div>'
          + '<div class="doc-pdf-icon">HTML</div></a>';
      }
      return '<a class="monthly-card" href="' + href + '">'
        + '<div class="monthly-month">' + m.month + '</div>'
        + '<div class="monthly-body">'
        + '<div class="monthly-label">EDP Monthly &middot; ' + m.name + '</div>'
        + '<div class="monthly-title">' + m.title + '</div>'
        + '<div class="monthly-desc">' + m.desc + '</div></div>'
        + '<div class="monthly-badge">HTML</div></a>';
    }).join("");
  }

  function init() {
    document.querySelectorAll("[data-monthlies]").forEach(render);
    document.querySelectorAll("[data-monthly-count]").forEach(el => {
      el.textContent = EDP_MONTHLIES.length;
    });
    document.querySelectorAll("[data-monthly-latest]").forEach(el => {
      const newest = EDP_MONTHLIES.slice().sort((a, b) => b.ym.localeCompare(a.ym))[0];
      if (newest) el.textContent = newest.name;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
