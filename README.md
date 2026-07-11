# Hollowmere — Field Guide

A static game-guide site: story chapters and a full Card database. No build
step, no backend — plain HTML/CSS/JS, ready for GitHub Pages.

## Adding a card (this is the whole workflow)

1. Open `js/cards-data.js`.
2. Copy an existing card object in the `CARDS` array as a template.
3. Fill in the fields — `name`, `role` (`"Attacker"` or `"Support"`), `pool`,
   `tier` (or `null` if it isn't on the community tier list), `image` (the
   real wikia CDN URL — see below), `ability`, and `stats` per rarity.
4. Save. Open `cards.html` (or refresh it) to see the new tile. Role/pool
   filter chips are built automatically from whatever values are in the
   data — nothing else to edit.

That file is the only thing you need to touch to keep the card list
current. Everything else (grid, filters, search, stat tabs) renders itself
from it.

### Pulling card images from the wiki

Fandom's image URLs (`static.wikia.nocookie.net/.../revision/latest?cb=...`)
are content-hashed per file — they can't be guessed from a card name, so
each one has to be looked up. Two ways to get the real URL for a card:

- Open the card's file page on the wiki, e.g.
  `https://anime-card-clash.fandom.com/wiki/File:Card_Name.png`, and copy
  the "Original file" link.
- Or query the MediaWiki API directly:
  `https://anime-card-clash.fandom.com/api.php?action=query&titles=File:Card_Name.png&prop=imageinfo&iiprop=url&format=json`
  — the `url` field in the response is the real, working image URL.

The [All Cards wiki page](https://anime-card-clash.fandom.com/wiki/All_Cards)
is the source for everything currently in `cards-data.js`; it doesn't have
every card in the game documented yet, so `cards.html` will grow as the
wiki does.

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
cards.html            All Cards database (renders from cards-data.js)
css/style.css          Design tokens + shared components
css/pages.css           Page-specific styles
js/cards-data.js         <- edit this to add/update cards
js/cards-render.js        Renders cards-data.js into the grid (don't need to touch)
js/spores.js                 Ambient background animation
js/main.js                    Nav + small shared behavior
```

## Customizing further

- Colors and fonts are all CSS variables at the top of `css/style.css`
  under `:root` — change the palette there and it updates everywhere.
- Story chapters live directly in `story.html` as `<article class="chapter">`
  blocks — copy one to add an 8th chapter.
