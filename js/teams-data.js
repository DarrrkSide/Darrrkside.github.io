/* ============================================================
   TEAMS DATABASE
   ============================================================
   This is the ONLY file you need to touch to add a new team.
   Every entry in the TEAMS list below becomes a card on the
   Team Builds page automatically — no HTML editing required.

   HOW TO ADD A TEAM:
   1. Copy the TEMPLATE block below (between the ---- lines).
   2. Paste it just above the closing "];" at the bottom of TEAMS.
   3. Fill in your values. Keep the commas between entries.
   4. Save the file and refresh the page (or push to GitHub).

   FIELD GUIDE:
   - name        : Team name, shown as the card title.
   - tagline     : One short line under the name. Optional — use "" to skip.
   - rarity      : One of "common", "uncommon", "rare", "mythic".
                   Controls the wax-seal badge color in the corner.
   - difficulty  : A number from 1 (easy) to 5 (hard) to pilot.
   - tags        : A list of short labels used for the filter chips
                   at the top of the page, e.g. ["PvP", "Budget"].
                   You can invent new tags freely — the filter bar
                   updates itself to include whatever tags you use.
   - members     : A list of Wardens on the team. Each one needs:
                     name : the Warden's name
                     role : their job on the team (e.g. "Vanguard")
   - synergy     : A short paragraph explaining why the team works.

   ---- TEMPLATE (copy from here) ----
   {
     name: "Your Team Name",
     tagline: "A short subtitle",
     rarity: "rare",
     difficulty: 3,
     tags: ["PvP"],
     members: [
       { name: "Warden Name", role: "Vanguard" },
       { name: "Warden Name", role: "Support" },
       { name: "Warden Name", role: "Ranged" }
     ],
     synergy: "Explain the combo or strategy in a sentence or two."
   },
   ---- (copy to here) ----
   ============================================================ */

const TEAMS = [
  {
    name: "Reedbreaker Vanguard",
    tagline: "Slow, unkillable, patient",
    rarity: "mythic",
    difficulty: 4,
    tags: ["PvP", "Tank Comp"],
    members: [
      { name: "Corrin the Sunken", role: "Vanguard" },
      { name: "Mossbell", role: "Support" },
      { name: "Ashen Quill", role: "Ranged" },
      { name: "Wick", role: "Control" },
    ],
    synergy:
      "Corrin's root field locks enemies in place while Mossbell layers regen faster than it can be burned down. Ashen Quill cleans up anything that tries to flee.",
  },
  {
    name: "Lanternlight Rush",
    tagline: "Burst them before the fog clears",
    rarity: "rare",
    difficulty: 3,
    tags: ["PvP", "Aggro"],
    members: [
      { name: "Fenn Halloway", role: "Striker" },
      { name: "Pike", role: "Striker" },
      { name: "Ysolde", role: "Support" },
    ],
    synergy:
      "Ysolde's lantern buff stacks damage on the first three hits landed within a breath. Fenn and Pike open the same target to detonate the stack immediately.",
  },
  {
    name: "Bogwatch Formation",
    tagline: "The reliable everyday team",
    rarity: "uncommon",
    difficulty: 2,
    tags: ["Budget", "Story Mode"],
    members: [
      { name: "Old Marrow", role: "Vanguard" },
      { name: "Little Ren", role: "Ranged" },
      { name: "Sable", role: "Support" },
    ],
    synergy:
      "No rare Wardens required. Old Marrow tanks the front line while Sable's cheap heals keep the team stable through most story chapters.",
  },
  {
    name: "First Light Starter",
    tagline: "What every new Warden should run",
    rarity: "common",
    difficulty: 1,
    tags: ["Budget", "Story Mode", "Beginner"],
    members: [
      { name: "Tam", role: "Vanguard" },
      { name: "Bryn", role: "Support" },
    ],
    synergy:
      "Two Wardens, both easy to find early. Tam blocks the path, Bryn keeps them standing. Enough to clear the first three chapters comfortably.",
  },
];
