// Bundles src/*.js into one page. dist/bumblenook.html is the page body; dist/index.html is a standalone copy.
const fs = require('fs'), path = require('path');
const order = ['core', 'world', 'gfx', 'models', 'models2', 'models3', 'models4', 'audio', 'sim', 'progress', 'expand', 'more', 'life', 'i18n', 'visuals', 'artmodels', 'animation', 'ui', 'tutorial', 'main'];
const js = order.map((n) => fs.readFileSync(path.join(__dirname, 'src', n + '.js'), 'utf8')).join('\n');
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
const bundle = '(function(){\n"use strict";\n' + js + '\nwindow.__hh={get renderer(){return renderer;},TRACKS:TRACKS,TREASURES:TREASURES,startExpedition:startExpedition,PACE:PACE,QUESTS:QUESTS,doTrade:doTrade,TRADES:TRADES,G:G,W:W,CAM:CAM,UIS:UIS,BT:BT,TUT:TUT,LEVELS:LEVELS,ACH:ACH,TECHS:TECHS,STORY:STORY,FISH:FISH,SET:SET,UPGRADES:UPGRADES,SEASONS:SEASONS,CIVICS:CIVICS,NL:NL,CHOICES:CHOICES,SCENARIOS:SCENARIOS,NEW_RES:NEW_RES,RES:RES,JOBS:JOBS,GFX:GFX,life:{tryBirth:tryBirth,ageTick:ageTick,foundIsle:foundIsle,isleDay:isleDay,isleShift:isleShift,choiceDay:choiceDay,resolveChoice:resolveChoice,showChoice:showChoice,roadCount:roadCount,neighbourhoods:neighbourhoods,lifeDay:lifeDay,medals:medals,scnOf:scnOf,calcHappy:calcHappy,pantryDay:pantryDay},api:{animateBuildings:animateBuildings,applySettings:applySettings,tr:trText,civic:buyCivic,capOf:capOf,research:research,upgrade:upgradeBuilding,upgradeBlock:upgradeBlock,explore:exploreSite,newGame:newGame,loadGame:loadGame,readSave:readSave,lock:lockReason,deliver:deliverMission,festival:holdFestival,newMission:newMission,blocks:sealsOff,tutSpot:tutSpot,placeBuilding:placeBuilding,canPlace:canPlace,assignWorker:assignWorker,serialize:serialize,screenOf:screenOf,stepSim:stepSim,trees:trees,rocks:rocks,bushes:bushes}};\n})();';
if (bundle.includes('</script')) throw new Error('script terminator in bundle');
fs.writeFileSync(path.join(__dirname, 'dist-bundle.js'), bundle);
const page = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8')
  .replace('<!--JS-->', () => '<script src="' + CDN + '"></script>\n<script>\n' + bundle + '\n</script>');
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'bumblenook.html'), page);
const head = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  '<title>Bumblenook</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Cellipse cx=%2724%27 cy=%2716%27 rx=%279%27 ry=%2713%27 fill=%27%23fff%27 stroke=%27%233a2a1f%27 stroke-width=%272%27/%3E%3Cellipse cx=%2740%27 cy=%2716%27 rx=%279%27 ry=%2713%27 fill=%27%23fff%27 stroke=%27%233a2a1f%27 stroke-width=%272%27/%3E%3Cellipse cx=%2732%27 cy=%2738%27 rx=%2724%27 ry=%2719%27 fill=%27%23f6b93b%27 stroke=%27%233a2a1f%27 stroke-width=%274%27/%3E%3Cpath d=%27M24 21v34M40 21v34%27 stroke=%27%233a2a1f%27 stroke-width=%277%27/%3E%3C/svg%3E">' +
  '<style>:root{color-scheme:light;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style></head><body>';
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), head + page + '</body></html>');
// site/: the copy davyschroeder.nl serves from /bumblenook/. Nothing is loaded from other sites: three.js and the fonts sit next to the page.
const crypto = require('crypto');
const site = path.join(__dirname, 'site');
fs.mkdirSync(path.join(site, 'fonts'), { recursive: true });
const three = fs.readFileSync(path.join(__dirname, 'lib', 'three.min.js'));
fs.writeFileSync(path.join(site, 'three.min.js'), three);
for (const f of fs.readdirSync(path.join(__dirname, 'fonts'))) fs.copyFileSync(path.join(__dirname, 'fonts', f), path.join(site, 'fonts', f));
const v = (buf) => crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
const fv = (f) => 'fonts/' + f + '?v=' + v(fs.readFileSync(path.join(__dirname, 'fonts', f)));
const FONTS = "<style>@font-face{font-family:'Caprasimo';font-style:normal;font-weight:400;font-display:swap;src:url(" + fv('caprasimo.woff2') + ") format('woff2')}" +
  "@font-face{font-family:'Nunito';font-style:normal;font-weight:200 1000;font-display:swap;src:url(" + fv('nunito.woff2') + ") format('woff2')}</style>";
const GF = /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/;
const src = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf8');
if (!GF.test(src)) throw new Error('font link not found');
const sitePage = src.replace(/<title>[^<]*<\/title>\n?/, '').replace(/<meta name="claude:[^>]*>\n?/, '').replace(GF, () => FONTS + '\n')
  .replace('<!--JS-->', () => '<script src="three.min.js?v=' + v(three) + '"></script>\n<script>\n' + bundle + '\n</script>');
if (/https?:\/\/(?!www\.w3\.org)[a-z]/.test(sitePage.replace(bundle, ''))) throw new Error('site page still loads something from another site');
const DESC = 'Bumblenook, a cosy 3D village builder: settle a little island, put your villagers to work, and grow a camp into a harbour town with a lighthouse, a cathedral and a great golden hive.';
const siteHead = head.replace('<title>Bumblenook</title>', '<title>Bumblenook · Cosy village builder</title><meta name="description" content="' + DESC + '"><meta name="theme-color" content="#2b1e14">');
if (siteHead === head) throw new Error('title not found in head');
fs.writeFileSync(path.join(site, 'index.html'), siteHead + sitePage + '</body></html>\n');
// A genuinely portable edition: scripts and fonts are embedded, so double-clicking works offline.
const EMBED_FONTS = "<style>@font-face{font-family:'Caprasimo';font-weight:400;font-display:swap;src:url(data:font/woff2;base64," + fs.readFileSync(path.join(__dirname,'fonts','caprasimo.woff2')).toString('base64') + ") format('woff2')}" +
  "@font-face{font-family:'Nunito';font-weight:200 1000;font-display:swap;src:url(data:font/woff2;base64," + fs.readFileSync(path.join(__dirname,'fonts','nunito.woff2')).toString('base64') + ") format('woff2')}</style>";
const portable = src.replace(/<title>[^<]*<\/title>\n?/, '').replace(/<meta name="claude:[^>]*>\n?/, '').replace(GF, () => EMBED_FONTS + '\n')
  .replace('<!--JS-->', () => '<script>\n' + three.toString('utf8') + '\n</script>\n<script>\n' + bundle + '\n</script>');
fs.writeFileSync(path.join(__dirname, 'Bumblenook.html'), siteHead + portable + '</body></html>\n');
console.log('built', (page.length / 1024).toFixed(0) + ' KB');
