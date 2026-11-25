// On touch: press the building you are placing and drag, and it turns to face the finger.
const { open } = require('./common');
(async () => {
  const { browser, page, errors, ctx } = await open({ device: 'iPhone 13' });
  const S = (f, a) => page.evaluate(f, a);
  page.setDefaultTimeout(60000);
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  await page.tap('#s-new'); await page.waitForTimeout(900); await page.tap('#coach-skip'); await page.waitForTimeout(400);
  await S(() => { __hh.G.res.wood = 90; __hh.G.tut = 6; __hh.UIS.paused = true; });
  await page.tap('.item[data-type="house"]'); await page.waitForTimeout(400);
  const pt = await S(() => { const { G, api } = __hh; let best = null, bd = 1e9; for (let j = 6; j < 48; j++) for (let i = 6; i < 48; i++) { if (api.canPlace('house', i, j) || api.blocks('house', i, j, 0)) continue; const s = api.screenOf(i + 1 - 28, 0.3, j + 1 - 28), e = document.elementFromPoint(s.x, s.y); const d = Math.hypot(i + 1 - 28 - G.center.cx, j + 1 - 28 - G.center.cz); if (e && e.id === 'c' && s.y > 250 && s.y < 560 && s.x > 70 && s.x < 320 && d > 3.2 && d < bd) { bd = d; best = [s.x, s.y, i, j]; } } return best; });
  await page.touchscreen.tap(pt[0], pt[1]); await page.waitForTimeout(1200);
  const at = async () => S(() => { const B = __hh.UIS.build, s = __hh.api.screenOf(B.i + 1 - 28, 0.3, B.j + 1 - 28); return { x: s.x, y: s.y, rot: B.rot, i: B.i, j: B.j, msg: document.getElementById('p-msg').textContent }; });
  let g = await at(); const seen = [g.rot], start = [g.i, g.j], camBefore = await S(() => [__hh.CAM.gx, __hh.CAM.gz].map(v => +v.toFixed(2)).join(','));
  for (const [dx, dy] of [[70, 10], [10, -70], [-70, -10], [-10, 70]]) {
    g = await at();
    await touch('touchStart', g.x, g.y); for (let k = 1; k <= 6; k++) { await touch('touchMove', g.x + dx * k / 6, g.y + dy * k / 6); await page.waitForTimeout(60); } await touch('touchEnd'); await page.waitForTimeout(500);
    seen.push((await at()).rot);
  }
  g = await at();
  console.log('rotations seen while dragging:', seen.join(' > '), '| spot unchanged:', g.i === start[0] && g.j === start[1], '| camera unchanged:', camBefore === await S(() => [__hh.CAM.gx, __hh.CAM.gz].map(v => +v.toFixed(2)).join(',')), '| hint:', g.msg);
  await page.screenshot({ path: 'shots/k0-turn.png' });
  await page.tap('#p-ok'); await page.waitForTimeout(600);
  console.log('built with rot', await S(() => { const b = __hh.G.buildings.find(q => q.type === 'house'); return b ? b.rot : 'NOT BUILT'; }));
  // a drag that starts away from the building pans as before
  await page.tap('.item[data-type="house"]'); await page.waitForTimeout(300); await page.touchscreen.tap(pt[0], pt[1] - 60); await page.waitForTimeout(900);
  const c0 = await S(() => __hh.CAM.gx + __hh.CAM.gz); await touch('touchStart', 60, 300); for (let k = 1; k <= 6; k++) { await touch('touchMove', 60 + 12 * k, 300 + 6 * k); await page.waitForTimeout(40); } await touch('touchEnd'); await page.waitForTimeout(400);
  console.log('pan moved camera:', Math.abs((await S(() => __hh.CAM.gx + __hh.CAM.gz)) - c0) > 0.2);
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e.message.slice(0, 400)); process.exit(1); });
