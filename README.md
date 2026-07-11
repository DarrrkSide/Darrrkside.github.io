# Hollowmere — Field Guide

A static game-guide site: story chapters, community team builds, and a
pity/luck calculator. No build step, no backend — plain HTML/CSS/JS, ready
for GitHub Pages.

## Adding a team (this is the whole workflow)

1. Open `js/teams-data.js`.
2. Copy the template block near the top of the file (between the `----`
   markers).
3. Paste it into the `TEAMS` list, above the closing `];`.
4. Fill in the fields — name, rarity, members, synergy, etc. The comments
   above the template explain each one.
5. Save. Open `teams.html` (or refresh it) to see the new card. Any new
   tags you use automatically become filter chips — nothing else to edit.

That file is the only thing you need to touch to keep the team list
current. Everything else (cards, filters, layout) renders itself from it.

## Running it locally

No install required — just open `index.html` in a browser. If your browser
blocks local file scripts, run a tiny local server instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a new GitHub repo and push this folder's contents to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a
   branch," pick the `main` branch and `/ (root)` folder, then **Save**.
4. GitHub will publish it at `https://<your-username>.github.io/<repo-name>/`
   within a minute or two.

Every time you push a change (including a new team in `teams-data.js`),
GitHub Pages redeploys automatically — no rebuild step.

## File map

```
index.html          Home page
story.html           Story guide (7 chapters)
teams.html            Team builds (renders from teams-data.js)
calculator.html        Omen pity/luck calculator
css/style.css          Design tokens + shared components
css/pages.css           Page-specific styles
js/teams-data.js         <- edit this to add teams
js/teams-render.js        Renders teams-data.js into cards (don't need to touch)
js/calculator.js           Pity math for the calculator page
js/spores.js                 Ambient background animation
js/main.js                    Nav + small shared behavior
```

## Customizing further

- Colors and fonts are all CSS variables at the top of `css/style.css`
  under `:root` — change the palette there and it updates everywhere.
- Story chapters live directly in `story.html` as `<article class="chapter">`
  blocks — copy one to add an 8th chapter.
