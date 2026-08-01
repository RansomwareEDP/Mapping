/* glossary.js : shared glossary component for research site pages.
   Rendered into every element with class "glossary".

   USAGE
     <div class="glossary"></div>                        all terms, default heading
     <div class="glossary" data-terms="prefix,asn"></div> only those terms, in that order
     <div class="glossary" data-title="Key Terms"></div>  custom heading
     <div class="glossary" data-open="true"></div>        start expanded (default is collapsed)

     ...then before </body>:
     <script src="assets/glossary.js?v=1"></script>       (root-level pages)
     <script src="../assets/glossary.js?v=1"></script>    (pages one folder deep)

   TO ADD A TERM: add one entry to TERMS below. Every page using the
   component picks it up automatically. No other edits needed.
   If glossary.js itself is edited, bump the ?v= number wherever it is
   referenced so browser caches refresh, the same rule as node-library.js.

   House style: no em dashes anywhere in definitions.                        */
(function () {
  'use strict';

  var TERMS = [
    ['prefix', 'Prefix',
     'A block of IP addresses announced and routed across the internet as a single unit.'],

    ['asn', 'Autonomous system number',
     'The identifier for a network that makes its own routing decisions, written as AS30823. A provider normally holds one or more.'],

    ['upstream', 'Upstream, or transit provider',
     'The larger network a provider pays to carry its traffic to the rest of the internet. Without an upstream announcing its routes, a network is unreachable no matter how many servers it owns.'],

    ['peering', 'Peering',
     'Two networks exchanging traffic with each other directly, usually without payment. Distinct from transit, though the term de-peering is commonly applied to the ending of either relationship.'],

    ['ripe', 'RIPE NCC',
     'The registry that allocates IP address space and autonomous system numbers across Europe, the Middle East and Central Asia. It is an association under Dutch law and is therefore subject to EU sanctions regulation.'],

    ['lir', 'LIR (Local Internet Registry)',
     'An organisation holding registry membership, which receives address space and assigns it onward to its own customers. Roughly 20,000 exist in the RIPE region. LIR status carries the autonomy to reassign space and update registry records without prior approval.'],

    ['sponsor', 'Sponsoring LIR',
     'A member that obtains registry resources on behalf of an organisation that is not itself a member, and performs the customer checks on its behalf. A permissive sponsor is a route into the address system for a network that could not qualify directly.'],

    ['freeze', 'Freeze (sanctions)',
     'A registry lock applied to a designated party. No new resources and no transfers, while membership and existing holdings are retained. It restricts the paperwork rather than the traffic.'],

    ['conduit', 'Mere conduit',
     'The legal status of a network that only transmits data, which shields it from liability for what it carries provided it does not select or modify the content.'],

    ['designation', 'Designation',
     'The formal listing of a person or entity by a sanctions authority such as OFAC, the EU Council or the UK FCDO. It attaches to a legal person, not to infrastructure.']
  ];

  /* ---- styles: page themes vary across the site, so every colour falls back
          to a dark-friendly literal when the variable is absent ---- */
  var css = [
    '.glossary{margin:24px 0 0;padding-top:20px;border-top:1px solid var(--border-light,#21262d);}',
    '.glossary-head{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;list-style:none;}',
    '.glossary-head::-webkit-details-marker{display:none;}',
    '.glossary-title{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted,#8b949e);}',
    '.glossary-toggle{font-size:10px;color:var(--accent,#58a6ff);font-weight:600;letter-spacing:.04em;}',
    '.glossary-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;margin-top:12px;}',
    '.glossary-item{background:var(--bg-card,#1c2128);border:1px solid var(--border,#30363d);border-radius:6px;padding:10px 12px;}',
    '.glossary-term{font-size:12px;font-weight:700;color:var(--text-heading,#f0f6fc);margin-bottom:3px;}',
    '.glossary-def{font-size:11.5px;line-height:1.55;color:var(--text-muted,#8b949e);}',
    '@media (max-width:560px){.glossary-grid{grid-template-columns:1fr;}}',
    '@media print{.glossary details{display:block;} .glossary-grid{display:block;}}'
  ].join('');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function build(box) {
    var wanted = (box.getAttribute('data-terms') || '').trim();
    var list = TERMS;

    if (wanted) {
      var order = wanted.split(',').map(function (s) { return s.trim().toLowerCase(); });
      list = order.map(function (id) {
        for (var i = 0; i < TERMS.length; i++) if (TERMS[i][0] === id) return TERMS[i];
        return null;
      }).filter(Boolean);
    }
    if (!list.length) return;

    var title = box.getAttribute('data-title') || 'Terms Used On This Page';
    var open = box.getAttribute('data-open') === 'true';

    var items = list.map(function (t) {
      return '<div class="glossary-item">' +
               '<div class="glossary-term">' + esc(t[1]) + '</div>' +
               '<div class="glossary-def">' + esc(t[2]) + '</div>' +
             '</div>';
    }).join('');

    box.innerHTML =
      '<details' + (open ? ' open' : '') + '>' +
        '<summary class="glossary-head">' +
          '<span class="glossary-title">' + esc(title) + '</span>' +
          '<span class="glossary-toggle">show / hide</span>' +
        '</summary>' +
        '<div class="glossary-grid">' + items + '</div>' +
      '</details>';
  }

  function init() {
    var boxes = document.querySelectorAll('.glossary');
    if (!boxes.length) return;

    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    for (var i = 0; i < boxes.length; i++) build(boxes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
