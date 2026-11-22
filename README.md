# Bumblenook

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
