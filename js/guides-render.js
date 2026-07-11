/* Generic renderer for every team-guide category on the site.
   Reads GUIDES + CARD_IMAGES from js/guides-data.js.
   Call renderGuides({ containerId, category, mode }) from a page's inline
   script. mode: "sections" (grouped + ordered, used by Story Mode),
   "tabs" (variant tabs, used by Dungeon), "chips" (filter chips by
   location, used by Battle Tower), or "grid" (flat list, everything else). */
(function (global) {
  const AVATAR_COLORS = ["#5eead4", "#f0b45c", "#d9736b", "#7fffb0", "#9fada4"];

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = String(str == null ? "" : str);
    return div.innerHTML;
  }

  function initials(name) {
    const clean = String(name || "?").replace(/[^a-zA-Z ]/g, "").trim();
    if (!clean) return "?";
    const parts = clean.split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  }

  function colorFor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  }

  function avatarHTML(name) {
    const url = (typeof CARD_IMAGES !== "undefined" && CARD_IMAGES[name]) || null;
    if (url) {
      return `<span class="card-avatar"><img src="${escapeHTML(url)}" alt="${escapeHTML(name)}" loading="lazy" /></span>`;
    }
    return `<span class="card-avatar card-avatar-fallback" style="background:${colorFor(name)}22;color:${colorFor(name)};border-color:${colorFor(name)}55;">${escapeHTML(initials(name))}</span>`;
  }

  function codeButtonHTML(entry) {
    if (!entry.code) return "";
    return `<button class="code-btn" data-code-id="${escapeHTML(entry.id)}" title="Copy this team's in-game share code">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      CODE
    </button>`;
  }

  function cardHTML(entry, categoryLabel) {
    const title = entry.location || entry.tier || categoryLabel;
    const showTier = entry.tier && entry.tier !== title;
    const members = entry.members
      .map(
        (m) => `
        <div class="team-member guide-member">
          ${avatarHTML(m.n)}
          <span class="guide-member-text"><strong>${escapeHTML(m.n)}</strong>${m.i && m.i !== "--" ? `<span>${escapeHTML(m.i)}</span>` : ""}</span>
        </div>`
      )
      .join("");
    const required = entry.required.length
      ? `<div class="guide-col"><span class="eyebrow">Required</span><ul>${entry.required.map((r) => `<li>${escapeHTML(r)}</li>`).join("")}</ul></div>`
      : "";
    const tips = entry.tips.length
      ? `<div class="guide-col"><span class="eyebrow">Tips</span><ul>${entry.tips.map((t) => `<li>${escapeHTML(t)}</li>`).join("")}</ul></div>`
      : "";
    const metaBits = [];
    if (entry.rng) metaBits.push(`<span class="tag rng-tag">${escapeHTML(entry.rng)}</span>`);
    if (entry.variant) metaBits.push(`<span class="tag">${escapeHTML(entry.variant)}</span>`);
    if (entry.author) metaBits.push(`<span class="guide-author">by ${escapeHTML(entry.author)}</span>`);

    return `
      <article class="guide-card" data-location="${escapeHTML(entry.location || "")}">
        <div class="guide-card-head">
          <span class="guide-pill">${escapeHTML(categoryLabel)}</span>
          ${codeButtonHTML(entry)}
        </div>
        <h3>${escapeHTML(title)}</h3>
        ${showTier ? `<p class="team-tagline">${escapeHTML(entry.tier)}</p>` : ""}
        <div class="team-members guide-team">${members}</div>
        ${required || tips ? `<div class="guide-columns">${required}${tips}</div>` : ""}
        ${entry.stat ? `<p class="field-hint guide-stat">${escapeHTML(entry.stat)}</p>` : ""}
        <div class="team-meta guide-meta">${metaBits.join("")}</div>
      </article>
    `;
  }

  function wireCodeButtons(root) {
    root.querySelectorAll(".code-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.codeId;
        const key = "acc-code:" + id;
        let code = localStorage.getItem(key);
        if (!code) {
          const entered = prompt("Paste or type the in-game share code for this team:");
          if (!entered) return;
          code = entered.trim();
          if (!code) return;
          localStorage.setItem(key, code);
        }
        const flash = (label) => {
          const original = btn.innerHTML;
          btn.innerHTML = label;
          setTimeout(() => (btn.innerHTML = original), 1100);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(code)
            .then(() => flash("Copied!"))
            .catch(() => flash("Copy failed"));
        } else {
          flash("Copied!");
        }
      });
    });
  }

  const CATEGORY_LABELS = {
    story: "STORY",
    dungeon: "DUNGEON",
    raid: "RAID",
    storytowers: "STORY TOWERS",
    battletower: "BATTLE TOWER",
    celestialtower: "CELESTIAL TOWER",
    worldboss: "WORLD BOSS",
    limitedtower: "LIMITED EVENT",
    underworld: "UNDERWORLD",
    ranked: "RANKED",
  };

  function renderGuides(opts) {
    const container = document.getElementById(opts.containerId);
    if (!container || typeof GUIDES === "undefined") return;
    const label = CATEGORY_LABELS[opts.category] || opts.category.toUpperCase();
    const entries = GUIDES.filter((g) => g.category === opts.category);

    if (!entries.length) {
      container.innerHTML = `<div class="empty-state">No teams charted for this mode yet. Send in a team and it'll show up here.</div>`;
      return;
    }

    if (opts.mode === "sections") {
      const byLocation = {};
      entries.forEach((e) => {
        const loc = e.location || "Other";
        (byLocation[loc] = byLocation[loc] || []).push(e);
      });
      const locations = Object.keys(byLocation).sort((a, b) => {
        const oa = byLocation[a][0].order ?? 999;
        const ob = byLocation[b][0].order ?? 999;
        return oa - ob;
      });
      container.innerHTML = locations
        .map((loc, i) => {
          const cards = byLocation[loc].map((e) => cardHTML(e, label)).join("");
          return `
          <div class="guide-section" id="loc-${loc.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
            <span class="eyebrow">Map ${i + 1} of ${locations.length}</span>
            <h2 style="margin-top:10px; margin-bottom:20px;">${escapeHTML(loc)}</h2>
            <div class="guides-grid">${cards}</div>
          </div>`;
        })
        .join("");
    } else if (opts.mode === "tabs") {
      const variants = Array.from(new Set(entries.map((e) => e.variant || "All")));
      let active = variants[0];
      const renderTabs = () => {
        const tabsHTML = variants
          .map((v) => `<button class="filter-chip ${v === active ? "active" : ""}" data-variant="${escapeHTML(v)}">${escapeHTML(v)}</button>`)
          .join("");
        const visible = entries.filter((e) => (e.variant || "All") === active);
        container.innerHTML = `
          <div class="filter-group" style="margin-bottom:26px;">${tabsHTML}</div>
          <div class="guides-grid">${visible.map((e) => cardHTML(e, label)).join("")}</div>
        `;
        container.querySelectorAll("[data-variant]").forEach((btn) => {
          btn.addEventListener("click", () => {
            active = btn.dataset.variant;
            renderTabs();
          });
        });
        wireCodeButtons(container);
      };
      renderTabs();
      return;
    } else if (opts.mode === "chips") {
      const locations = ["All", ...Array.from(new Set(entries.map((e) => e.location).filter(Boolean)))];
      let active = "All";
      const renderChips = () => {
        const chipsHTML = locations
          .map((loc) => `<button class="filter-chip ${loc === active ? "active" : ""}" data-loc="${escapeHTML(loc)}">${escapeHTML(loc)}</button>`)
          .join("");
        const visible = active === "All" ? entries : entries.filter((e) => e.location === active);
        container.innerHTML = `
          <div class="filter-group" style="margin-bottom:26px;">${chipsHTML}</div>
          <div class="guides-grid">${visible.map((e) => cardHTML(e, label)).join("")}</div>
        `;
        container.querySelectorAll("[data-loc]").forEach((btn) => {
          btn.addEventListener("click", () => {
            active = btn.dataset.loc;
            renderChips();
          });
        });
        wireCodeButtons(container);
      };
      renderChips();
      return;
    } else {
      container.innerHTML = `<div class="guides-grid">${entries.map((e) => cardHTML(e, label)).join("")}</div>`;
    }

    wireCodeButtons(container);
  }

  global.renderGuides = renderGuides;
})(window);
