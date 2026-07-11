/* The Omen Calculator — estimates your odds of drawing a Mythic Warden
   from the Sunken Choir, accounting for a hard-pity guarantee. */
(function () {
  const form = document.getElementById("omen-form");
  if (!form) return;

  const rateInput = document.getElementById("base-rate");
  const pityInput = document.getElementById("pity-threshold");
  const currentInput = document.getElementById("current-pity");
  const plannedInput = document.getElementById("planned-pulls");

  const resultNumber = document.getElementById("result-number");
  const omenFill = document.getElementById("omen-fill");
  const rowAtLeastOne = document.getElementById("row-at-least-one");
  const rowGuarantee = document.getElementById("row-guarantee");
  const rowExpected = document.getElementById("row-expected");

  function calculate() {
    const rate = Math.min(100, Math.max(0.01, parseFloat(rateInput.value) || 0)) / 100;
    const pity = Math.max(1, parseInt(pityInput.value) || 1);
    const current = Math.max(0, Math.min(pity - 1, parseInt(currentInput.value) || 0));
    const planned = Math.max(0, parseInt(plannedInput.value) || 0);

    let probNone = 1;
    let willHitGuarantee = false;

    for (let i = 1; i <= planned; i++) {
      const pityCount = current + i;
      const isGuaranteed = pityCount >= pity;
      if (isGuaranteed) willHitGuarantee = true;
      const p = isGuaranteed ? 1 : rate;
      probNone *= 1 - p;
    }

    const probAtLeastOne = planned === 0 ? 0 : 1 - probNone;
    const expectedPulls = Math.round(1 / rate);

    resultNumber.textContent = `${(probAtLeastOne * 100).toFixed(1)}%`;
    omenFill.style.width = `${(probAtLeastOne * 100).toFixed(1)}%`;

    rowAtLeastOne.querySelector("span:last-child").textContent =
      `${(probAtLeastOne * 100).toFixed(1)}%`;
    rowGuarantee.querySelector("span:last-child").textContent = willHitGuarantee
      ? "Yes — pity triggers in this window"
      : "No — pity not reached";
    rowExpected.querySelector("span:last-child").textContent =
      `~${expectedPulls} pulls (rate only, ignores pity)`;
  }

  form.addEventListener("input", calculate);
  calculate();
})();
