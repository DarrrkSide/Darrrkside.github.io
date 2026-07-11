/* Shared site behavior: mobile nav toggle + active-link marking. */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Mark current page in nav
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const target = a.getAttribute("href");
    if (target === here || (here === "" && target === "index.html")) {
      a.classList.add("active");
    }
  });

  // Story page: highlight table-of-contents entry on scroll
  const chapters = document.querySelectorAll(".chapter[id]");
  const tocLinks = document.querySelectorAll(".toc a");
  if (chapters.length && tocLinks.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove("active"));
            const match = document.querySelector(
              `.toc a[href="#${entry.target.id}"]`
            );
            if (match) match.classList.add("active");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    chapters.forEach((c) => obs.observe(c));
  }
})();

/* Discord floating button injection */
(function () {
  // Append a persistent Discord invite button to every page
  function makeDiscordFab() {
    if (document.querySelector('.discord-fab')) return;
    try {
      const a = document.createElement('a');
      a.className = 'discord-fab';
      a.href = 'https://discord.gg/BKCGYKHcN';
      a.target = '_blank';
      a.rel = 'noreferrer noopener';
      a.title = 'Join our Discord';
      a.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 3H4a1 1 0 00-1 1v14l4-2 4 2 4-2 4 2V4a1 1 0 00-1-1z" fill="currentColor"/></svg>
        <span style="font-family:var(--f-mono); font-size:0.85rem; color:#fff;">Discord</span>
      `;
      document.body.appendChild(a);
    } catch (e) {
      /* ignore */
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeDiscordFab); else makeDiscordFab();
})();
