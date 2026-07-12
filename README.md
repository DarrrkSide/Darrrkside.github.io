# Hollowmere — Field Guide

A static game-guide site for Anime Card Clash: story chapters, a full Card
database, dungeon/tower/raid team builds, and the Omen luck calculator. No
build step, no backend — plain HTML/CSS/JS, ready for GitHub Pages.

> **Heads up:** 24 cards were just added using only the art you provided —
> their `role`, `ability`, and `base` stats in `js/cards-data.js` are all
> placeholders (search the file for `"Ability not yet documented"`) so they
> show up on the site now. Swap in the real numbers whenever you have them;
> nothing else needs to change since Gold/Rainbow/Secret recalculate from
> `base` automatically.

## Adding or updating a card

1. Open `js/cards-data.js`.
2. Copy an existing card object in the `CARDS` array as a template.
3. Fill in the fields — `name`, `role` (`"Attacker"` or `"Support"`), `pool`,
   `tier` (or `null` if it isn't on the community tier list), `image` (the
   real wikia CDN URL — see below, or `null` if you only have a local file),
   `ability`, and stats (see the two options below).
4. Save, then run `node tools/download-images.js` so the new card's art gets
   mirrored into `images/cards/` (see below) — skip this if you already
   dropped an image file into `images/cards/` yourself and set `localImage`.
5. Open `cards.html` (or refresh it) to see the new tile. Role/pool filter
   chips are built automatically from whatever values are in the data —
   nothing else to edit.

### Entering stats: just Basic, or the full table

You only ever need to enter **Basic**-rarity numbers. Give the card a
`base` instead of a full `stats` table:

```js
base: { odds: "1 in 500", hp: "75", dmg: "38" },
```

Gold/Rainbow/Secret are generated automatically at render time — each
tier is **100x rarer** (odds) and **4x the stats** (HP/DMG) of the tier
before it. So Gold = base × (100 odds, 4 stats), Rainbow = base × (10,000
odds, 16 stats), Secret = base × (1,000,000 odds, 64 stats). You never
have to type those out or do the math — just update `base` and every tier
recalculates itself.

If a card's real Gold/Rainbow/Secret numbers don't follow that formula
(some don't), give it a full `stats: { Basic: {...}, Gold: {...}, ... }`
object instead — same as every hand-entered card already in the file —
and that takes priority over `base`.

### Cards with only local art (no wiki page yet)

If you've got a card's image file but no wiki source for it, set
`localImage` to the filename inside `images/cards/` (e.g.
`"Some_Card.webp"`) and leave `image` and `wikiUrl` as `null`. The card
renders using that local file directly with no CDN fallback needed.

That file is the only thing you need to touch to keep the card list
current. Everything else (grid, filters, search, stat tabs) renders itself
from it. Guide/team entries (Story, Dungeon, Raids, Towers, Ranked, etc.)
work the same way, but live in `js/guides-data.js`.

Each team member object is `{ "n": "Card Name", "i": "trait/item or --", "r": "Gold" }`.
The `r` field is optional — when set to `"Basic"`, `"Gold"`, `"Rainbow"`, or
`"Secret"`, the card's name gets a colored rarity tag next to it (gold text
for Gold, an animated rainbow gradient for Rainbow, red for Secret). Leave
it out if you don't know the rarity for that team.

Card avatars in team builds render as a small rectangle (full card art
visible) whenever that card has a real image entry in `CARD_IMAGES`; cards
without one fall back to a circular initials avatar.

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

## Card images: local-first, with an automatic fallback

Every card `<img>` now points at `images/cards/<id>.png` first. If that
file doesn't exist (or fails to load), it falls back automatically to the
original wiki CDN link — with `referrerpolicy="no-referrer"` set, which is
what was actually stopping the hotlinked images from loading on GitHub
Pages in the first place (Fandom's CDN can reject the referrer some
browsers send from a different domain; dropping it entirely fixes that).

So the site works out of the box either way. To also get instant local
copies (faster loads, no dependency on Fandom's CDN staying up):

```bash
node tools/download-images.js
```

Requires Node 18+ (uses the built-in `fetch`). It reads every image URL out
of `js/cards-data.js` and `js/guides-data.js`, downloads anything missing
into `images/cards/`, and skips files it's already fetched — safe to re-run
after adding new cards.

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

Every time you push a change, GitHub Pages redeploys automatically — no
rebuild step.

## File map

```
index.html                 Home page
story.html                  Story guide (7 chapters)
story-towers.html            Story Towers team builds
dungeon.html                   Dungeon Mode mechanics
dungeon-teams.html               Bizarre/Titan dungeon team builds
raids.html                        Raid team builds
battle-tower.html                  Battle Tower team builds
celestial-tower.html                Celestial Tower team builds
world-boss.html                      World Boss team builds
limited-towers.html                   Limited-event tower team builds
underworld-invasion.html               Underworld Invasion team builds
ranked.html                             Ranked team builds
guides.html                              Hub linking every guide page
lore.html                                 Lore / world-building page
calculator.html                            Omen luck calculator
cards.html                                  All Cards database (renders from cards-data.js)

css/style.css               Design tokens + shared components (colors, buttons, nav, footer, Discord button)
css/pages.css                 Page-specific styles (cards grid, guide cards, etc.)

js/cards-data.js             <- edit this to add/update cards
js/cards-render.js            Renders cards-data.js into the All Cards grid (don't need to touch)
js/guides-data.js              <- edit this to add/update team-build guides
js/guides-render.js             Generic renderer used by every guide page (don't need to touch)
js/calculator.js                 Omen calculator logic
js/spores.js                      Ambient background animation
js/main.js                         Nav toggle, active-link marking, Discord button injection

images/cards/                Local card art (populate with tools/download-images.js)
tools/download-images.js      Fetches card art from the wiki into images/cards/
```

## Customizing further

- Colors and fonts are all CSS variables at the top of `css/style.css`
  under `:root` — change the palette there and it updates everywhere. The
  site currently uses a red/ember accent palette.
- The Discord invite link lives in `js/main.js` (search for `discord.gg`) —
  it's injected as a fixed button on every page from that one file.
- Story chapters live directly in `story.html` as `<article class="chapter">`
  blocks — copy one to add an 8th chapter.
