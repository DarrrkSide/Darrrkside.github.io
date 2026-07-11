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
