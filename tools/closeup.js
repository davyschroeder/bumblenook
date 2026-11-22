// Close-ups for checking models: all cottage variants in rows, then the town centre.   node build.js && node tools/closeup.js
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'site'), out = path.join(__dirname, '..', 'art');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.woff2': 'font/woff2' };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, s) => { const f = path.join(root, q.url.split('?')[0] === '/' ? 'index.html' : q.url.split('?')[0]); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(d); } }); }).listen(8126);
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message)); page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 300)); });
  await page.goto('http://localhost:8126/'); await page.waitForTimeout(2500);
  await page.evaluate(() => document.getElementById('s-sand').click()); await page.waitForTimeout(1200);
  const info = await page.evaluate((TIME) => {
    const { G, BT, api, UIS, CAM, SET } = __hh; SET.gfxSet = true; api.newGame(77, 'sandbox'); G.started = true; UIS.paused = true; G.tut = 6;
    const c = G.center; let n = 0; const spots = [];
    for (let row = 0; row < 3 && n < BT.house.variants; row++) for (let col = 0; col < 4 && n < BT.house.variants; col++) {
      let done = false;
      for (let r = 0; r < 30 && !done; r++) for (let dj = -r; dj <= r && !done; dj++) for (let di = -r; di <= r && !done; di++) {
        const i = c.i + 5 + col * 3 + di, j = c.j - 3 + row * 3 + dj;
        if (r === 0 && (di || dj)) continue;
        if (!api.canPlace('house', i, j) && !spots.some((s) => Math.abs(s[0] - i) < 3 && Math.abs(s[1] - j) < 3)) { api.placeBuilding('house', i, j, 0, { variant: n, done: true, silent: true }); spots.push([i, j]); done = true; }
      }
      n++;
    }
    for (const t of ['lumber', 'store', 'bakery', 'quarry', 'market']) { for (let j = 4; j < 50; j++) { let ok = false; for (let i = 4; i < 50; i++) if (!api.canPlace(t, i, j) && Math.hypot(i - c.i, j - c.j - 6) < 6 && !api.blocks(t, i, j, 0)) { api.placeBuilding(t, i, j, 0, { done: true, silent: true }); ok = true; break; } if (ok) break; } }
    G.time = TIME; api.stepSim(0.05); G.time = TIME;
    const xs = spots.map((s) => s[0] + 1 - 28), zs = spots.map((s) => s[1] + 1 - 28);
    CAM.gx = CAM.tx = (Math.min(...xs) + Math.max(...xs)) / 2; CAM.gz = CAM.tz = (Math.min(...zs) + Math.max(...zs)) / 2; CAM.gd = CAM.dist = 15; CAM.gyaw = CAM.yaw = 0.35; CAM.attract = false;
    return { houses: spots.length, post: __hh.GFX.on };
  }, +(process.env.TIME || 0.4));
  console.log(JSON.stringify(info));
  await page.addStyleTag({ content: '#hud,#labels,#coach,#toasts,#floats,#photo,#modal{display:none!important}' });
  await page.waitForTimeout(3000); await page.screenshot({ path: path.join(out, 'houses.png') });
  await page.evaluate(() => { const { CAM, G } = __hh; CAM.gx = CAM.tx = G.center.cx; CAM.gz = CAM.tz = G.center.cz + 4; CAM.gd = CAM.dist = 12; CAM.gyaw = CAM.yaw = 0.6; });
  await page.waitForTimeout(3000); await page.screenshot({ path: path.join(out, 'centre.png') });
  await browser.close(); srv.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });
