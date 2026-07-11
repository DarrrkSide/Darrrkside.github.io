/* Ambient bioluminescent spore field — the site's signature atmosphere.
   Lightweight canvas animation, respects prefers-reduced-motion. */
(function () {
  const canvas = document.getElementById("spore-field");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  let w, h, spores;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeSpore() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      speed: 0.15 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() > 0.82 ? "#f0b45c" : "#7fffb0",
      alpha: 0.15 + Math.random() * 0.4,
    };
  }

  function init() {
    resize();
    const count = Math.min(70, Math.floor((w * h) / 18000));
    spores = Array.from({ length: count }, makeSpore);
  }

  function tick(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of spores) {
      s.y -= s.speed;
      s.x += Math.sin(t / 2000 + s.phase) * s.drift;
      if (s.y < -10) {
        s.y = h + 10;
        s.x = Math.random() * w;
      }
      const flicker = 0.6 + 0.4 * Math.sin(t / 900 + s.phase * 3);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.glow;
      ctx.globalAlpha = s.alpha * flicker;
      ctx.shadowColor = s.glow;
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  init();
  window.addEventListener("resize", init);

  if (reduceMotion) {
    // Draw a single static, calm frame instead of animating.
    tick(0);
  } else {
    requestAnimationFrame(tick);
  }
})();
