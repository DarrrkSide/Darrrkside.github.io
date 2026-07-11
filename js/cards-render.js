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

  function statTabs(card) {
    const keys = Object.keys(card.stats);
    const hasHpDmg = keys.some((k) => card.stats[k].hp !== undefined && card.stats[k].hp !== "—" && card.stats[k].hp !== undefined);
    return `
      <div class="card-stat-tabs" role="tablist">
        ${keys.map((k, i) => `<button class="stat-tab ${i === 0 ? "active" : ""}" data-stat="${escapeHTML(k)}" type="button">${escapeHTML(k)}</button>`).join("")}
      </div>
      ${keys.map((k, i) => {
        const s = card.stats[k];
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

    return `
      <article class="card-tile" data-role="${escapeHTML(card.role)}" data-pool="${escapeHTML(card.pool)}" data-name="${escapeHTML(card.name.toLowerCase())} ${escapeHTML((card.altName || "").toLowerCase())}">
        <div class="card-tile-art">
          <img src="${escapeHTML(card.image)}" alt="${escapeHTML(card.name)}" loading="lazy" />
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
          ${statTabs(card)}
          <a class="card-source-link" href="${escapeHTML(card.wikiUrl)}" target="_blank" rel="noopener">View source on wiki →</a>
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
