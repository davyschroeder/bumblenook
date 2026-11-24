# Bumblenook

## Storybook graphics edition.

This edition gives the original game a substantial procedural 3D art and animation upgrade. The game interface defaults to English.

### Play immediately.

Extract the ZIP and open **`Bumblenook.html`** in a WebGL-capable browser. It is a self-contained offline edition: Three.js, the game and both fonts are embedded. No installation, internet connection or build step is required to play it.

For a website, upload the **contents of `site/`** to the game's existing directory. Keep `index.html`, `three.min.js` and `fonts/` together. Serving the game from the same origin and path preserves access to its existing browser save. Opening the standalone file is a separate browser storage location.

The menu's Graphics setting cycles through the original High, Plain and Low levels. High adds glow, filmic grading and depth-aware miniature focus. Plain retains the new models and materials; Low reduces shadows, environmental decoration and character detail. Existing gameplay, building identifiers, production chains and save format remain compatible.

### What changed.

- 37 building types have new models or substantial architectural detail. Twelve cottage variants now have modelled shingles, roof caps, framed windows, doors, shutters, flower boxes and masonry.
- A richer four-tent starting camp; a new timber harbour; a rebuilt striped lighthouse; a cathedral with a rose window, open belfries and moving bells; and a layered golden Great Hive crowned by a sculpted bee.
- New villager rigs with rounded faces, ears, cheeks, hair and profession clothing, separate heads, elbows and knees, staggered blinking and visible hand tools.
- Distance-driven footsteps, weight transfer, idle breathing and glancing, eased poses, carrying, gathering, fishing, construction, chopping and celebration animation.
- Gust-driven windmills, deforming cloth flags and sails, rocking boats, continuous fountain arcs, droplets and ripples, softer chimney smoke and springy construction completion.
- Richer tree crowns, layered pines, grass and flower clusters, coastal reeds, pebbles, shells and driftwood. Populated instance ranges reduce unnecessary geometry submissions.
- Rough physically based materials, warm sky reflections, softer edge highlights and a more restrained bloom and colour grade.
- A new water shader with shallow-to-deep colour, animated shore foam, caustic-like moving light, ripples and glints.
- A forest-green, parchment and honey-gold interface, clearer build cards with actual model thumbnails, responsive phone controls, focus states and reduced-motion interface support.
- Better cleanup of per-island graphics resources when starting or loading another island.

### Verification.

The integrated source passed non-browser checks for 65 model/variant combinations, 27 profession rigs, four starting inhabitants, placement, worker assignment, construction, 120 seconds of simulation, save/load, child sizing, paused poses and a populated town with all four major landmarks. Fourteen shader pairs compiled and linked without warnings in an OpenGL ES 3.2 software context. Actual geometry was also rendered separately for visual inspection.

Desktop and 390-by-844 mobile interface flows were checked in a browser using a clearly labelled renderer stub. The available browser had WebGL disabled even for the original game, so full browser GPU rendering, frame rates and hardware-specific behaviour could not be measured here. The UI-only harness and external model-review render are not part of the playable edition.

The original project documentation follows below.

---

A cosy 3D village builder that runs in the browser. Settle a small island, put your villagers to work,
and grow a camp of four tents into a harbour town with a lighthouse, a cathedral and a great golden hive.

**Play it:** [davyschroeder.nl/bumblenook](https://davyschroeder.nl/bumblenook/)

- A working economy: wood, stone, food, grain, honey, wool, cloth, brick, cider and coins, with storage limits
  and a village ledger that shows what came in and went out.
- Villagers with names, talents, homes and jobs. You decide who works where; in the evening they go to the
  tavern, sit on a bench or feed the ducks.
- 37 goals on three tracks (Grow, Prosper, Discover), villager requests, badges, a story told in letters,
  old sites to explore, an Academy with research and guild choices, town improvements and building upgrades.
- Four seasons, day and night, rain and snow, festivals, a trading ship, and expeditions that bring home treasures.
- Three ways to play: a normal village, a daily island that is the same for everyone, and a sandbox.
- Mouse, keyboard and touch. English and Dutch. The village is saved in the browser.

Everything is made in code: the low-poly models, the island, the water, the sounds and the music. There are no
image or sound files.

## Build

```
node build.js
```

This joins `src/*.js` into one script and writes:

| Output | What it is |
|---|---|
| `site/` | The copy the website serves: `index.html`, `three.min.js` and `fonts/`. It loads nothing from other sites. **Commit it** together with the source. |
| `dist/index.html` | A single page that loads three.js from a CDN and the fonts from Google Fonts. Used by the tests. Not committed. |
| `dist/bumblenook.html` | The same page without `<html>` and `<head>`, for publishing as a claude.ai artifact. Not committed. |

There is nothing to install for the build; it only needs Node.

## Source

| File | What is in it |
|---|---|
| `src/index.html` | The page: styles and the HUD. `<!--JS-->` is replaced by the script. |
| `src/core.js` | Constants, random numbers, the model builder, colours and materials. |
| `src/world.js` | The island: terrain, water, trees, rocks, weather, sky, day and night. |
| `src/models*.js` | Buildings, villagers and animals. |
| `src/gfx.js` | The look: soft glow, miniature depth of field and colour grading on top of the picture, contact shadows, light on the ground at night, detail in the grass. Graphics has three settings; a phone that cannot keep up drops to the plain picture by itself. |
| `src/visuals.js` | Sky reflections, fill lighting, instanced shore details, pollen and night stars. |
| `src/artmodels.js` | Handcrafted architecture, detailed cottages and rebuilt landmarks. Loaded after the original model catalogue. |
| `src/animation.js` | Animated cloth, hand tools, bells, fountain streams and sailing boat details. |
| `src/audio.js` | Sound effects and music. |
| `src/sim.js` | Buildings, pathfinding, villagers and their jobs, saving and loading. Pacing lives in `PACE`. |
| `src/progress.js` | Village levels, requests, badges, festivals and the trading ship. |
| `src/expand.js` | Research, town improvements, upgrades, seasons, sites, the story, the daily island and settings. |
| `src/more.js` | The three goal tracks, the ledger, guilds, winter, evening life, and the projects after the lighthouse. |
| `src/i18n.js` | The Dutch texts. English strings are the keys. |
| `src/ui.js` | Camera, mouse and touch, the build menu and all panels. |
| `src/tutorial.js` | The in-game tutorial, the badges above buildings and the village on the title screen. |
| `src/main.js` | Start-up and the frame loop. |

The files share one scope and are joined in the order listed in `build.js`.

## Tests

The tests drive the real page in Chromium with [Playwright](https://playwright.dev). Run the build first and
start the test server, then run a test:

```
node build.js
node test/serve.js &
node test/t3.js
```

| Test | What it checks |
|---|---|
| `test/site.js` | The website copy starts, loads its own three.js and fonts, and asks nothing from other sites. Needs no test server. |
| `test/t1.js`, `test/t3.js` | The page starts; building, assigning workers, the camera, night, saving and loading with the mouse. |
| `test/t5.js`, `test/t10.js`, `test/t19.js`, `test/t22.js` | Phones: touch, the tutorial, the three ways to play, old saves, the newer panels. |
| `test/t8.js` | Follows the tutorial and builds a village through the interface (`node test/t8.js phone` for touch). |
| `test/t11.js` | Measures how often villagers walk through buildings, trees or each other. |
| `test/t15.js`, `test/t17.js`, `test/t18.js`, `test/t21.js` | Save round trip, research, upgrades, seasons, Dutch texts, settings, and the features in `src/more.js`. |
| `test/human.js` | Plays a whole game at a human pace and reports when each level is reached. Slow. |
| `test/islands.js` | Checks 40 islands for a fair start: coast and rock near the green. |

Some of the older numbered tests were written for earlier versions and may need updating.

## Artwork

`node tools/art.js` builds a town in the sandbox and photographs it: the box art, the wide picture and (with
`ONLY=clip`) the frames of the gameplay clip on the website. The pictures land in `art/`, which is not committed.

## Credits

- [three.js](https://threejs.org) r149 (`lib/three.min.js`), MIT licence.
- The fonts Caprasimo and Nunito (`fonts/`), SIL Open Font License; the licence texts are next to the files.
- Built together with [Claude](https://claude.ai).
