/* Renders TEAMS (from teams-data.js) into cards + auto-built filter chips.
   Add teams in teams-data.js — this file never needs to change. */
(function () {
  const grid = document.getElementById("teams-grid");
  const toolbar = document.getElementById("filter-group");
  const countEl = document.getElementById("team-count");
  const emptyState = document.getElementById("empty-state");
  if (!grid || typeof TEAMS === "undefined") return;

  let activeFilter = "All";

  function pips(level) {
    return Array.from({ length: 5 }, (_, i) =>
      `<i class="${i < level ? "on" : ""}"></i>`
    ).join("");
  }

  function cardHTML(team) {
    const rarityClass = `rarity-${(team.rarity || "common").toLowerCase()}`;
    const tags = (team.tags || [])
      .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
      .join("");
    const members = (team.members || [])
      .map(
        (m) =>
          `<div class="team-member"><span>${escapeHTML(m.role || "")}</span>${escapeHTML(m.name || "")}</div>`
      )
      .join("");

    return `
      <article class="team-card ${rarityClass}" data-tags="${(team.tags || []).join("|").toLowerCase()}">
        <span class="wax-seal">${escapeHTML(team.rarity || "common")}</span>
        <div>
          <h3>${escapeHTML(team.name || "Unnamed Team")}</h3>
          ${team.tagline ? `<p class="team-tagline">${escapeHTML(team.tagline)}</p>` : ""}
        </div>
        <div class="team-members">${members}</div>
        ${team.synergy ? `<p class="team-synergy">${escapeHTML(team.synergy)}</p>` : ""}
        <div class="team-meta">
          ${tags}
          <span class="difficulty">${pips(team.difficulty || 1)}</span>
        </div>
      </article>
    `;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  function allTags() {
    const set = new Set();
    TEAMS.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }

  function buildToolbar() {
    if (!toolbar) return;
    const tags = ["All", ...allTags()];
    toolbar.innerHTML = tags
      .map(
        (tag) =>
          `<button class="filter-chip ${tag === activeFilter ? "active" : ""}" data-tag="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`
      )
      .join("");
    toolbar.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.tag;
        render();
      });
    });
  }

  function render() {
    buildToolbar();
    const visible =
      activeFilter === "All"
        ? TEAMS
        : TEAMS.filter((t) => (t.tags || []).includes(activeFilter));

    grid.innerHTML = visible.map(cardHTML).join("");
    if (countEl) {
      countEl.textContent = `${visible.length} team${visible.length === 1 ? "" : "s"} charted`;
    }
    if (emptyState) {
      emptyState.style.display = visible.length ? "none" : "block";
    }
  }

  render();
})();
