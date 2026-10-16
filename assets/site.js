// Cyscale site script. No third-party code loads here except HubSpot (see HUBSPOT below).
(function () {
  // NIST SP 800-171 Rev. 2 families and requirement counts (110 total).
  var families = [
    ["AC", "Access Control", 22], ["AT", "Awareness and Training", 3],
    ["AU", "Audit and Accountability", 9], ["CM", "Configuration Management", 9],
    ["IA", "Identification and Authentication", 11], ["IR", "Incident Response", 3],
    ["MA", "Maintenance", 6], ["MP", "Media Protection", 9],
    ["PS", "Personnel Security", 2], ["PE", "Physical Protection", 6],
    ["RA", "Risk Assessment", 3], ["CA", "Security Assessment", 4],
    ["SC", "System and Communications Protection", 16], ["SI", "System and Information Integrity", 7]
  ];

  var grid = document.getElementById("ledger");
  if (grid) {
    var cells = [];
    families.forEach(function (f) {
      var row = document.createElement("div");
      row.className = "family";
      var abbr = document.createElement("abbr");
      abbr.title = f[1] + " (" + f[2] + " requirements)";
      abbr.textContent = f[0];
      var box = document.createElement("div");
      box.className = "cells";
      for (var i = 0; i < f[2]; i++) {
        var c = document.createElement("span");
        c.className = "cell";
        box.appendChild(c);
        cells.push(c);
      }
      row.appendChild(abbr);
      row.appendChild(box);
      grid.appendChild(row);
    });

    // One orchestrated moment: requirements fill in, in a shuffled order, once.
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      cells.forEach(function (c) { c.classList.add("met"); });
    } else {
      var order = cells.map(function (_, i) { return i; });
      for (var j = order.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var t = order[j]; order[j] = order[k]; order[k] = t;
      }
      var n = 0;
      setTimeout(function step() {
        for (var b = 0; b < 3 && n < order.length; b++, n++) cells[order[n]].classList.add("met");
        if (n < order.length) setTimeout(step, 28);
      }, 450);
    }
  }

  // Credentials: rendered from data/credentials.json. A badge image at assets/badges/<id>.png
  // is shown when present; otherwise a text badge stands in.
  var badgeRoot = document.getElementById("badges");
  if (badgeRoot && window.fetch) {
    fetch("data/credentials.json").then(function (r) { return r.json(); }).then(function (data) {
      data.groups.forEach(function (g, gi) {
        var group = document.createElement("div");
        group.className = "badge-group" + (gi === 0 ? " primary" : "");
        var h = document.createElement("h3"); h.textContent = g.issuer; group.appendChild(h);
        var ul = document.createElement("ul"); ul.className = "badges";
        g.items.forEach(function (c) {
          var li = document.createElement("li"); li.className = "badge";
          var art = document.createElement("div"); art.className = "badge-art";
          var text = document.createElement("span"); text.className = "badge-text"; text.textContent = c.short;
          var img = new Image();
          img.alt = c.short + " badge";
          img.onload = function () { art.innerHTML = ""; art.appendChild(img); };
          img.src = "assets/badges/" + c.id + ".png";
          art.appendChild(text);
          var name = document.createElement("div"); name.className = "badge-name";
          name.textContent = c.name + " (" + c.short + ")";
          li.appendChild(art); li.appendChild(name);
          if (c.verify) {
            var a = document.createElement("a"); a.className = "badge-verify"; a.href = c.verify;
            a.rel = "noopener"; a.target = "_blank"; a.textContent = "Verify";
            li.appendChild(a);
          }
          ul.appendChild(li);
        });
        group.appendChild(ul); badgeRoot.appendChild(group);
      });
    }).catch(function () {});
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // HUBSPOT: public identifiers only (portal and form IDs are visible on any HubSpot-powered page).
  // Never place API keys or private-app tokens in this repository.
  var HUBSPOT = { portalId: "246437985", region: "na2", formId: "" };
  var target = document.getElementById("hubspot-form");
  if (target && HUBSPOT.formId) {
    var s = document.createElement("script");
    s.src = "https://js-" + HUBSPOT.region + ".hsforms.net/forms/embed/v2.js";
    s.onload = function () {
      target.innerHTML = "";
      window.hbspt.forms.create({ region: HUBSPOT.region, portalId: HUBSPOT.portalId, formId: HUBSPOT.formId, target: "#hubspot-form" });
    };
    document.head.appendChild(s);
  }
})();
