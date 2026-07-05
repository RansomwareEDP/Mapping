(function () {
  var script = document.currentScript;
  var page = script.getAttribute("data-page");
  var base = script.getAttribute("src").replace(/\/scripts\/enforcement-module\.js.*$/, "");
  var mount = document.getElementById("enforcement-module");
  if (!mount || !page) return;

  var CSS = [
    ".enfmod { border: 1px solid rgba(128,128,128,0.35); border-radius: 8px; margin: 16px 0 24px; overflow: hidden; font-size: 13px; }",
    ".enfmod-head { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(128,128,128,0.08); border-bottom: 1px solid rgba(128,128,128,0.25); flex-wrap: wrap; }",
    ".enfmod-title { font-weight: 700; font-size: 13px; letter-spacing: 0.02em; }",
    ".enfmod-live { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #2471a3; border: 1px solid rgba(36,113,163,0.5); background: rgba(36,113,163,0.10); padding: 1px 8px; border-radius: 10px; }",
    ".enfmod-asof { font-size: 11px; opacity: 0.65; margin-left: auto; }",
    ".enfmod-body { padding: 12px 14px; }",
    ".enfmod-sub { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.6; margin: 10px 0 6px; }",
    ".enfmod table { width: 100%; border-collapse: collapse; font-size: 12.5px; }",
    ".enfmod td { padding: 5px 8px 5px 0; border-bottom: 1px solid rgba(128,128,128,0.18); vertical-align: top; }",
    ".enfmod tr:last-child td { border-bottom: none; }",
    ".enfmod .d { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; white-space: nowrap; opacity: 0.8; }",
    ".enfmod .chip { display: inline-block; font-size: 11px; font-weight: 600; padding: 1px 8px; border-radius: 10px; border: 1px solid; white-space: nowrap; }",
    ".enfmod .c-red { color: #d64545; border-color: rgba(214,69,69,0.5); background: rgba(214,69,69,0.10); }",
    ".enfmod .c-amber { color: #b7770d; border-color: rgba(183,119,13,0.5); background: rgba(183,119,13,0.10); }",
    ".enfmod .c-green { color: #1e8449; border-color: rgba(30,132,73,0.5); background: rgba(30,132,73,0.10); }",
    ".enfmod .c-blue { color: #2471a3; border-color: rgba(36,113,163,0.5); background: rgba(36,113,163,0.10); }",
    ".enfmod .c-gray { opacity: 0.75; border-color: rgba(128,128,128,0.4); background: rgba(128,128,128,0.08); }",
    ".enfmod-foot { padding: 8px 14px; border-top: 1px solid rgba(128,128,128,0.25); font-size: 11.5px; display: flex; gap: 14px; flex-wrap: wrap; }",
    ".enfmod-foot a { color: #2471a3; }",
    ".enfmod-gap { padding: 14px; }",
    ".enfmod-more { font-size: 11.5px; opacity: 0.7; padding-top: 4px; }"
  ].join("\n");

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function statusClass(s) {
    var t = String(s).toLowerCase();
    if (/sentenced|convicted|guilty|released for time served/.test(t)) return "c-green";
    if (/custody|arrested|detention|detained|extradited|pretrial|charged/.test(t)) return "c-amber";
    if (/at large|fugitive/.test(t)) return "c-red";
    if (/sanctioned/.test(t)) return "c-blue";
    return "c-gray";
  }
  function chip(s) { return "<span class='chip " + statusClass(s) + "'>" + esc(s) + "</span>"; }

  function render(D) {
    var acts = D.actions.filter(function (a) { return String(a.pages).indexOf(page) >= 0; });
    var inds = D.individuals.filter(function (p) { return String(p.pages).indexOf(page) >= 0; });
    var mrow = null;
    for (var i = 0; i < D.matrix.length; i++) {
      if (String(D.matrix[i].page).indexOf(page) >= 0) { mrow = D.matrix[i]; break; }
    }

    var st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);

    var head = "<div class='enfmod-head'><span class='enfmod-title'>Enforcement tracker</span>" +
      "<span class='enfmod-live'>Auto-synced</span>" +
      (mrow && mrow.gap ? "<span class='chip c-red'>Enforcement gap</span>" : "") +
      "<span class='enfmod-asof'>As of " + esc(D.meta.asOf) + "</span></div>";

    var body;
    if (!acts.length && !inds.length) {
      body = "<div class='enfmod-gap'>No sanctions designations, indictments, or law enforcement operations on record for this entity" +
        (mrow && mrow.gap ? ". This is an active node with unexploited financial, criminal, and infrastructure levers." : ".") + "</div>";
    } else {
      acts.sort(function (a, b) { return String(b.date) < String(a.date) ? -1 : 1; });
      var shown = acts.slice(0, 8);
      var actRows = shown.map(function (a) {
        return "<tr><td class='d'>" + esc(a.date) + "</td><td>" + esc(a.type) +
          (a.operation ? " <span style='opacity:0.6'>(" + esc(a.operation) + ")</span>" : "") +
          "<div style='opacity:0.75; font-size:11.5px'>" + esc(a.targets) + "</div></td><td>" + chip(a.outcome) + "</td>" +
          "<td>" + (a.source ? "<a href='" + esc(a.source) + "' target='_blank' rel='noopener'>&#8599;</a>" : "") + "</td></tr>";
      }).join("");
      var more = acts.length > shown.length ? "<div class='enfmod-more'>" + (acts.length - shown.length) + " more in the full tracker.</div>" : "";
      var indRows = inds.map(function (p) {
        return "<tr><td><strong>" + esc(p.name) + "</strong>" +
          (p.aliases ? " <span style='opacity:0.6'>(" + esc(p.aliases) + ")</span>" : "") + "</td>" +
          "<td style='opacity:0.75'>" + (p.reward && p.reward !== "None" ? esc(p.reward) : "") + "</td>" +
          "<td>" + chip(p.status) + "</td></tr>";
      }).join("");
      body = "<div class='enfmod-body'>" +
        (actRows ? "<div class='enfmod-sub'>Actions (" + acts.length + ")</div><table>" + actRows + "</table>" + more : "") +
        (indRows ? "<div class='enfmod-sub'>Named individuals (" + inds.length + ")</div><table>" + indRows + "</table>" : "") +
        "</div>";
    }

    var foot = "<div class='enfmod-foot'><a href='" + base + "/tracker.html'>Full tracker</a>" +
      "<a href='" + base + "/tracker.html#matrix'>Pressure matrix</a>" +
      "<span style='opacity:0.6'>Source: data/enforcement.json</span></div>";

    mount.innerHTML = "<div class='enfmod'>" + head + body + foot + "</div>";
  }

  function fallback() {
    var s = document.createElement("script");
    s.src = base + "/data/enforcement-data.js";
    s.onload = function () { if (window.ENFORCEMENT) render(window.ENFORCEMENT); };
    document.head.appendChild(s);
  }

  fetch(base + "/data/enforcement.json")
    .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(render)
    .catch(fallback);
})();
