/* Renders CARDS (from js/cards-data.js) into the All Cards gallery.
   Filter chips (role + pool) and the search box are built automatically —
   add a new card to cards-data.js and it just shows up here. */
(function () {
  const grid = document.getElementById("cards-grid");
  const roleToolbar = document.getElementById("role-filter-group");
  const poolToolbar = document.getElementById("pool-filter-group");
  const searchInput = document.getElementById("card-search");
  const countEl = document.getElementById("card-count");
  const emptyState = document.getElementById("cards-empty-state");
  if (!grid || typeof CARDS === "undefined") return;

  let activeRole = "All";
  let activePool = "All";
  let query = "";

  const TIER_LABEL = {
    "SS": "SS Tier", "S+": "S+ Tier", "S": "S Tier",
    "A": "A Tier", "B": "B Tier", "C": "C Tier",
  };

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  /* ---- Automatic rarity scaling ----
     A card can specify just `base` (its Basic-rarity odds/hp/dmg) instead of
     a full `stats` table. Gold/Rainbow/Secret are then derived automatically:
     each tier up is 100x rarer (odds) and 4x the stats of the tier before it. */
  const RARITY_TIERS = ["Basic", "Gold", "Rainbow", "Secret"];
  const ODDS_STEP = 100;
  const STAT_STEP = 4;
  const SUFFIXES = [
    { v: 1e18, s: "Qi" }, { v: 1e15, s: "Qa" }, { v: 1e12, s: "T" },
    { v: 1e9, s: "B" }, { v: 1e6, s: "M" }, { v: 1e3, s: "K" },
  ];

  function parseCompactNumber(str) {
    if (str === undefined || str === null) return NaN;
    const cleaned = String(str).trim().replace(/^1\s*in\s*/i, "");
    const m = cleaned.match(/^([\d,.]+)\s*(K|M|B|T|Qa|Qi)?$/i);
    if (!m) return NaN;
    const n = parseFloat(m[1].replace(/,/g, ""));
    const suffix = (m[2] || "").toLowerCase();
    const mult = { k: 1e3, m: 1e6, b: 1e9, t: 1e12, qa: 1e15, qi: 1e18 }[suffix] || 1;
    return n * mult;
  }

  function formatCompactNumber(num) {
    for (const { v, s } of SUFFIXES) {
      if (num >= v) {
        const n = num / v;
        const rounded = n >= 100 ? Math.round(n) : Math.round(n * 100) / 100;
        return trimZeros(rounded) + s;
      }
    }
    return trimZeros(Math.round(num * 100) / 100);
  }

  function trimZeros(n) {
    return String(n).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  }

  function deriveStatsFromBase(base) {
    const oddsNum = parseCompactNumber(base.odds);
    const hpNum = parseCompactNumber(base.hp);
    const dmgNum = parseCompactNumber(base.dmg);
    const stats = {};
    RARITY_TIERS.forEach((tier, i) => {
      stats[tier] = {
        odds: "1 in " + formatCompactNumber(oddsNum * Math.pow(ODDS_STEP, i)),
        hp: formatCompactNumber(hpNum * Math.pow(STAT_STEP, i)),
        dmg: formatCompactNumber(dmgNum * Math.pow(STAT_STEP, i)),
      };
    });
    return stats;
  }

  function getStats(card) {
    if (card.stats) return card.stats;
    if (card.base) return deriveStatsFromBase(card.base);
    return { Basic: { odds: "—", hp: "—", dmg: "—" } };
  }

  function statTabs(stats) {
    const keys = Object.keys(stats);
    return `
      <div class="card-stat-tabs" role="tablist">
        ${keys.map((k, i) => `<button class="stat-tab ${i === 0 ? "active" : ""}" data-stat="${escapeHTML(k)}" type="button">${escapeHTML(k)}</button>`).join("")}
      </div>
      ${keys.map((k, i) => {
        const s = stats[k];
        const rows = [`<div class="stat-row"><span>Odds</span><strong>${escapeHTML(s.odds)}</strong></div>`];
        if (s.hp !== undefined) rows.push(`<div class="stat-row"><span>HP</span><strong>${escapeHTML(s.hp)}</strong></div>`);
        if (s.dmg !== undefined) rows.push(`<div class="stat-row"><span>DMG</span><strong>${escapeHTML(s.dmg)}</strong></div>`);
        return `<div class="card-stat-panel ${i === 0 ? "active" : ""}" data-stat="${escapeHTML(k)}">${rows.join("")}</div>`;
      }).join("")}
    `;
  }

  function cardHTML(card) {
    const tierBadge = card.tier
      ? `<span class="badge tier-${card.tier.replace("+", "plus").toLowerCase()}">${escapeHTML(TIER_LABEL[card.tier] || card.tier)}</span>`
      : `<span class="badge tier-none">Unranked</span>`;
    const stats = getStats(card);
    const localFile = card.localImage || `${card.id}.png`;
    const imgAttrs = card.image
      ? `data-fallback="${escapeHTML(card.image)}" onerror="this.onerror=null;this.src=this.dataset.fallback;"`
      : `onerror="this.onerror=null;this.style.opacity='0.15';"`;
    const sourceLink = card.wikiUrl
      ? `<a class="card-source-link" href="${escapeHTML(card.wikiUrl)}" target="_blank" rel="noopener">View source on wiki →</a>`
      : "";

    return `
      <article class="card-tile" data-role="${escapeHTML(card.role)}" data-pool="${escapeHTML(card.pool)}" data-name="${escapeHTML(card.name.toLowerCase())} ${escapeHTML((card.altName || "").toLowerCase())}">
        <div class="card-tile-art">
          <img src="images/cards/${escapeHTML(localFile)}" alt="${escapeHTML(card.name)}" loading="lazy" referrerpolicy="no-referrer" ${imgAttrs} />
        </div>
        <div class="card-tile-body">
          <div class="card-tile-head">
            <h3>${escapeHTML(card.name)}</h3>
            ${card.altName ? `<span class="card-altname">${escapeHTML(card.altName)}</span>` : ""}
          </div>
          <div class="card-badges">
            <span class="badge role-${card.role.toLowerCase()}">${escapeHTML(card.role)}</span>
            <span class="badge pool-badge">${escapeHTML(card.pool)}</span>
            ${tierBadge}
          </div>
          <p class="card-ability"><strong>${escapeHTML(card.ability.name)}:</strong> ${escapeHTML(card.ability.text)}</p>
          ${statTabs(stats)}
          ${sourceLink}
        </div>
      </article>
    `;
  }

  function buildToolbars() {
    if (roleToolbar) {
      const roles = ["All", ...Array.from(new Set(CARDS.map((c) => c.role))).sort()];
      roleToolbar.innerHTML = roles
        .map((r) => `<button class="filter-chip ${r === activeRole ? "active" : ""}" data-role="${escapeHTML(r)}">${escapeHTML(r)}</button>`)
        .join("");
      roleToolbar.querySelectorAll(".filter-chip").forEach((btn) => {
        btn.addEventListener("click", () => { activeRole = btn.dataset.role; render(); });
      });
    }
    if (poolToolbar) {
      const pools = ["All", ...Array.from(new Set(CARDS.map((c) => c.pool))).sort()];
      poolToolbar.innerHTML = pools
        .map((p) => `<button class="filter-chip ${p === activePool ? "active" : ""}" data-pool="${escapeHTML(p)}">${escapeHTML(p)}</button>`)
        .join("");
      poolToolbar.querySelectorAll(".filter-chip").forEach((btn) => {
        btn.addEventListener("click", () => { activePool = btn.dataset.pool; render(); });
      });
    }
  }

  function render() {
    buildToolbars();
    const q = query.trim().toLowerCase();
    const visible = CARDS.filter((c) => {
      if (activeRole !== "All" && c.role !== activeRole) return false;
      if (activePool !== "All" && c.pool !== activePool) return false;
      if (q && !`${c.name} ${c.altName || ""}`.toLowerCase().includes(q)) return false;
      return true;
    });

    grid.innerHTML = visible.map(cardHTML).join("");
    if (countEl) {
      countEl.textContent = `${visible.length} card${visible.length === 1 ? "" : "s"} shown of ${CARDS.length} catalogued`;
    }
    if (emptyState) {
      emptyState.style.display = visible.length ? "none" : "block";
    }

    // Wire up per-card stat tabs
    grid.querySelectorAll(".card-tile").forEach((tile) => {
      tile.querySelectorAll(".stat-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          const key = tab.dataset.stat;
          tile.querySelectorAll(".stat-tab").forEach((t) => t.classList.toggle("active", t.dataset.stat === key));
          tile.querySelectorAll(".card-stat-panel").forEach((p) => p.classList.toggle("active", p.dataset.stat === key));
        });
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      query = searchInput.value;
      render();
    });
  }

  render();
})();
