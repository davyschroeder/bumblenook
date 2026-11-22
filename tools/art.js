// Makes the artwork for the website from the game itself: a town built in the sandbox, photographed in the browser.
//   node build.js && node tools/art.js          -> art/poster.png (840x1180 @2x), art/wide.png (1200x630 @2x), art/plain-*.png
// Options (environment): SEED, TIME (0..1, time of day), SEASON (0..3), ONLY=poster|wide|clip
//   ONLY=clip node tools/art.js                 -> art/frames/*.png (a 10 second flight, 24 frames a second, 1280x720)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'site'), out = path.join(__dirname, '..', 'art');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.woff2': 'font/woff2' };
const SEED = +(process.env.SEED || 4242), TIME = +(process.env.TIME || 0.5), SEASON = +(process.env.SEASON || 0);

async function town(page, started) {
  if (!started) { await page.evaluate(() => document.getElementById('s-sand').click()); await page.waitForTimeout(1500); }
  return page.evaluate(({ SEED, TIME, SEASON, GFXSET }) => {
    const { G, W, BT, api, UIS, CAM } = __hh;
    api.newGame(SEED, 'sandbox'); G.started = true; UIS.paused = true; G.tut = 6;
    __hh.SET.gfxSet = true; if (GFXSET) { __hh.SET.gfx = GFXSET; api.applySettings(); }
    const c = G.center, N = 56, H = 28;
    for (let j = c.j - 1; j <= c.j + 3; j++) for (let i = c.i - 1; i <= c.i + 3; i++) if (!(i >= c.i && i < c.i + 3 && j >= c.j && j < c.j + 3) && !api.canPlace('path', i, j)) api.placeBuilding('path', i, j, 0, { silent: true });
    const list = ['house', 'house', 'well', 'bakery', 'market', 'tavern', 'house', 'fountain', 'apiary', 'flowers', 'flowers', 'lantern', 'lantern', 'bench', 'bench',
      'school', 'house', 'windmill', 'farm', 'academy', 'pond', 'house', 'store', 'cathedral', 'orchard', 'house', 'greathive', 'pasture', 'lumber', 'forager', 'house', 'belltower',
      'weaver', 'flowers', 'lantern', 'house', 'quarry', 'bench', 'flowers', 'house', 'lantern', 'flowers', 'fisher', 'harbour', 'lighthouse', 'shipyard', 'house', 'house', 'flowers', 'lantern'];
    const placed = [], missing = [];
    for (const t of list) {
      if (!BT[t]) { missing.push(t); continue; }
      const s = BT[t].size; let best = null, bd = 1e9;
      for (let j = 3; j < N - 4; j++) for (let i = 3; i < N - 4; i++) {
        if (api.canPlace(t, i, j)) continue;
        const d = Math.hypot(i + s / 2 - H - c.cx, j + s / 2 - H - c.cz);
        if (d < 3.4 || d >= bd) continue;
        let crowded = false;
        if (s > 1) for (let q = j - 1; q <= j + s && !crowded; q++) for (let p = i - 1; p <= i + s; p++) { const o = p >= 0 && q >= 0 && p < N && q < N ? G.bmap.get(W.occ[q * N + p]) : null; if (o && o.size > 1) { crowded = true; break; } }
        if (!crowded && !api.blocks(t, i, j, 0)) { bd = d; best = [i, j]; }
      }
      if (!best) { missing.push(t); continue; }
      const dx = c.cx - (best[0] + s / 2 - H), dz = c.cz - (best[1] + s / 2 - H);
      const rot = Math.abs(dz) > Math.abs(dx) ? (dz > 0 ? 0 : 2) : dx > 0 ? 1 : 3;
      const b = api.placeBuilding(t, best[0], best[1], rot, { done: true, silent: true }); if (b) placed.push(t);
    }
    Object.assign(G.res, { wood: 200, stone: 200, food: 200, grain: 30, honey: 40, coins: 300 });
    G.season = SEASON; G.day = SEASON * 4 + 2;
    for (const b of G.buildings) if (b.done && b.def.job) { api.assignWorker(b); }
    // let the town live for a while so people arrive, work and carry things
    for (let d = 0; d < 3; d++) { G.time = 0.2; for (let t = 0; t < 70; t += 0.05) api.stepSim(0.05); for (const b of G.buildings) if (b.done && b.def.job && !b.workers.length) api.assignWorker(b); }
    G.time = TIME; for (let t = 0; t < 4; t += 0.05) api.stepSim(0.05); G.time = TIME;
    document.getElementById('modal').hidden = true;
    const bb = (t) => { const b = G.buildings.find((b) => b.type === t); return b ? [+b.cx.toFixed(1), +b.cz.toFixed(1)] : null; };
    return { placed: placed.length, missing, pop: G.villagers.length, center: [c.cx, c.cz], lighthouse: bb('lighthouse'), cathedral: bb('cathedral'), hive: bb('greathive'), windmill: bb('windmill') };
  }, { SEED, TIME, SEASON, GFXSET: process.env.GFX || '' });
}
const HIDE = '#hud,#labels,#coach,#toasts,#floats,#photo,#modal{display:none!important}';
const cam = (page, o) => page.evaluate((o) => { const { CAM, G } = __hh; const c = G.center; CAM.follow = null; CAM.attract = false; CAM.gx = CAM.tx = c.cx + (o.dx || 0); CAM.gz = CAM.tz = c.cz + (o.dz || 0); CAM.gd = CAM.dist = o.dist; CAM.gyaw = CAM.yaw = o.yaw; if (o.pitch) CAM.pitch = o.pitch; }, o);

const POSTER = `<div id="art" style="position:fixed;inset:0;z-index:99;pointer-events:none;color:#fff3d9;text-align:center">
 <div style="position:absolute;inset:0 0 auto 0;height:36%;background:linear-gradient(#1d120acc,#2b1e1499 45%,#2b1e1400)"></div>
 <div style="position:absolute;inset:auto 0 0 0;height:22%;background:linear-gradient(#2b1e1400,#1d120ad9)"></div>
 <div style="position:absolute;top:64px;left:0;right:0;font:400 112px/1 Caprasimo,serif;color:#f6b93b;text-shadow:0 5px 0 #7a4a08,0 12px 30px #1d120a99;letter-spacing:.005em">Bumblenook</div>
 <div style="position:absolute;top:196px;left:0;right:0;font:900 24px/1 Nunito,sans-serif;letter-spacing:.42em;text-indent:.42em;text-transform:uppercase;text-shadow:0 2px 10px #1d120a">Cosy village builder</div>
 <div style="position:absolute;bottom:84px;left:0;right:0;font:800 30px/1.2 Nunito,sans-serif;text-shadow:0 2px 12px #1d120a">Settle it. Tend it. Watch it bloom.</div>
 <div style="position:absolute;bottom:40px;left:0;right:0;font:800 14px/1 Nunito,sans-serif;letter-spacing:.34em;text-indent:.34em;opacity:.8">INVICT GAME STUDIO</div></div>`;
const WIDE = `<div id="art" style="position:fixed;inset:0;z-index:99;pointer-events:none;color:#fff3d9">
 <div style="position:absolute;inset:0 auto 0 0;width:62%;background:linear-gradient(90deg,#1d120ae6,#2b1e14b3 55%,#2b1e1400)"></div>
 <div style="position:absolute;left:64px;top:188px;font:400 104px/1 Caprasimo,serif;color:#f6b93b;text-shadow:0 4px 0 #7a4a08,0 10px 26px #1d120a99">Bumblenook</div>
 <div style="position:absolute;left:68px;top:306px;font:900 21px/1 Nunito,sans-serif;letter-spacing:.42em;text-transform:uppercase">Cosy village builder</div>
 <div style="position:absolute;left:68px;top:356px;font:800 27px/1.3 Nunito,sans-serif">Settle it. Tend it.<br>Watch it bloom.</div></div>`;

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, s) => { const f = path.join(root, q.url.split('?')[0] === '/' ? 'index.html' : q.url.split('?')[0]); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(d); } }); }).listen(8125);
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const shots = [
    { name: 'poster', w: 840, h: 1180, overlay: POSTER, cam: { dist: +(process.env.PD || 37), yaw: +(process.env.PY || 0.75), dx: +(process.env.PX || 2.5), dz: +(process.env.PZ || -0.5) } },
    { name: 'wide', w: 1200, h: 630, overlay: WIDE, cam: { dist: +(process.env.WD || 22), yaw: +(process.env.WY || 0.75), dx: +(process.env.WX || 0), dz: +(process.env.WZ || 0) } },
  ].filter((s) => !process.env.ONLY || process.env.ONLY === s.name);
  for (const s of shots) {
    const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: +(process.env.DSF || 2) });
    page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
    await page.goto('http://localhost:8125/'); await page.waitForTimeout(2500);
    console.log(s.name, JSON.stringify(await town(page)), 'post', await page.evaluate(() => __hh.GFX.on + ' broken ' + __hh.GFX.broken));
    await page.addStyleTag({ content: HIDE }); await cam(page, s.cam); await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(out, 'plain-' + s.name + '.png') });
    await page.evaluate((h) => document.body.insertAdjacentHTML('beforeend', h), s.overlay); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(out, s.name + '.png') });
    await page.close();
  }
  if (process.env.ONLY === 'clip') {
    // a short flight over the town: the page's clock is driven by hand, one screenshot per frame, so the film is smooth
    const FPS = 24, SECS = +(process.env.SECS || 10), dir = path.join(out, 'frames');
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 2 });
    page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
    await page.addInitScript(() => { let q = [], now = 0; window.requestAnimationFrame = (f) => { q.push(f); return q.length; }; performance.now = () => now;
      window.__tick = (ms) => { now += ms; const run = q; q = []; for (const f of run) f(now); }; });
    await page.goto('http://localhost:8125/'); await page.waitForTimeout(1500);
    await page.evaluate(() => { for (let i = 0; i < 30; i++) __tick(33); document.getElementById('s-sand').click(); for (let i = 0; i < 10; i++) __tick(33); });
    const info = await town(page, true);
    console.log('clip', JSON.stringify(info));
    await page.addStyleTag({ content: HIDE });
    await page.evaluate(() => { const { UIS, G } = __hh; UIS.paused = false; UIS.speed = 2; G.festival = 0; });
    for (let f = 0; f < FPS * SECS; f++) {
      const k = f / (FPS * SECS - 1), e = k * k * (3 - 2 * k);
      await cam(page, { dist: 19 + 5 * e, yaw: 0.45 + 0.75 * e, dx: 1.5 - 1.5 * e, dz: 0.5 * e });
      await page.evaluate((ms) => __tick(ms), 1000 / FPS);
      await page.screenshot({ path: path.join(dir, 'f' + String(f).padStart(4, '0') + '.png') });
    }
    await page.close();
  }
  await browser.close(); srv.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });
