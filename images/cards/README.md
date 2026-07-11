# images/cards/

Local card art goes here, named to match each card's `id` from
`js/cards-data.js` (e.g. `green-bomber.png`) or the slugified name for
support-card avatars from `CARD_IMAGES` in `js/guides-data.js`.

Run `node tools/download-images.js` from the project root to fetch all of
them automatically. The site works without this step too — every `<img>`
falls back to the original wiki CDN link (with `referrerpolicy="no-referrer"`
set, which is what was breaking the hotlinked loads) if no local file is
found here.
