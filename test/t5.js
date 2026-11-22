const { open } = require('./common');
(async () => {
  const { browser, ctx, page, errors } = await open({ device: 'iPhone 13' });
  const S = (f, a) => page.evaluate(f, a);
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, id) => ({ x: p[0], y: p[1], id })) });
  async function drag(a, b, steps) { await touch('touchStart', [a]); for (let q = 1; q <= steps; q++) { await touch('touchMove', [[a[0] + (b[0] - a[0]) * q / steps, a[1] + (b[1] - a[1]) * q / steps]]); await page.waitForTimeout(30); } await touch('touchEnd', []); }
  async function two(a0, b0, a1, b1, steps) { await touch('touchStart', [a0]); await touch('touchStart', [a0, b0]); for (let q = 1; q <= steps; q++) { const t = q / steps; await touch('touchMove', [[a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t], [b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t]]); await page.waitForTimeout(30); } await touch('touchEnd', [a1]); await touch('touchEnd', []); }
  const cam = () => S(() => ({ x: +__hh.CAM.gx.toFixed(2), z: +__hh.CAM.gz.toFixed(2), d: +__hh.CAM.gd.toFixed(2), yaw: +__hh.CAM.gyaw.toFixed(2) }));
  await page.screenshot({ path: 'shots/20-phone-start.png' });
  await page.tap('#s-new'); await page.waitForTimeout(1200);
  await page.screenshot({ path: 'shots/21-phone-hud.png' });
  console.log('touch class', await S(() => document.body.classList.contains('touch')), 'h-scroll', await S(() => document.documentElement.scrollWidth > innerWidth));
  const small = async () => S(() => [...document.querySelectorAll('#hud button, #modal button, #start button')].filter(b => b.offsetParent && (b.getBoundingClientRect().width < 36 || b.getBoundingClientRect().height < 34)).map(b => (b.id || b.className || b.textContent) + ' ' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height)));
  console.log('small targets (hud):', await small());
  // --- one finger pan ---
  let c0 = await cam(); await drag([200, 420], [120, 330], 6); await page.waitForTimeout(300); let c1 = await cam();
  console.log('pan', JSON.stringify(c0), '->', JSON.stringify(c1), 'sel', await S(() => __hh.UIS.sel));
  // --- pinch out (zoom in) and twist ---
  c0 = await cam(); await two([160, 400], [230, 400], [90, 400], [300, 400], 6); await page.waitForTimeout(300); c1 = await cam();
  console.log('pinch-out zoom', c0.d, '->', c1.d);
  c0 = await cam(); await two([120, 400], [270, 400], [140, 330], [250, 470], 6); await page.waitForTimeout(300); c1 = await cam();
  console.log('twist yaw', c0.yaw, '->', c1.yaw, 'zoom', c0.d, '->', c1.d);
  c0 = await cam(); await two([90, 400], [300, 400], [165, 400], [225, 400], 6); await page.waitForTimeout(300); c1 = await cam();
  console.log('pinch-in zoom', c0.d, '->', c1.d);
  // --- build with taps ---
  await page.tap('#tabs button[data-tab="grond"]'); await page.tap('.item[data-type="lumber"]'); await page.waitForTimeout(200);
  console.log('place card:', await page.textContent('#p-name'), '|', await page.textContent('#p-msg'), '| Place visible', await page.isVisible('#p-ok'), 'enabled', await page.isEnabled('#p-ok'));
  const pt = await S(() => {
    const { G, api, CAM } = __hh; let best = null, bd = 1e9;
    const t = api.trees.filter(t => t.state === 0).sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz))[6];
    for (let j = 4; j < 50; j++) for (let i = 4; i < 50; i++) { if (api.canPlace('lumber', i, j)) continue; const d = Math.hypot(i + 1 - 28 - t.x, j + 1 - 28 - t.z); if (d < bd && d > 1.5) { bd = d; best = [i, j]; } }
    CAM.gx = CAM.tx = best[0] + 1 - 28; CAM.gz = CAM.tz = best[1] + 1 - 28 + 1; CAM.gd = CAM.dist = 20; return best;
  });
  await page.waitForTimeout(600);
  const sp = await S((b) => { const s = __hh.api.screenOf(b[0] + 1 - 28, 0.3, b[1] + 1 - 28); return [s.x, s.y]; }, pt);
  await page.touchscreen.tap(sp[0], sp[1]); await page.waitForTimeout(300);
  console.log('after tap: ghost', await S(() => [__hh.UIS.build.i, __hh.UIS.build.j, __hh.UIS.build.has, __hh.UIS.build.reason]), 'want', pt, '| msg', await page.textContent('#p-msg'), '| placed yet', await S(() => __hh.G.buildings.length));
  await page.screenshot({ path: 'shots/22-phone-ghost.png' });
  await page.tap('#p-rot'); await page.tap('#p-ok'); await page.waitForTimeout(300);
  console.log('after Place: buildings', await S(() => __hh.G.buildings.map(b => b.type + ':r' + b.rot)), 'build mode', await S(() => !!__hh.UIS.build));
  // --- quick item: path with single taps ---
  await page.tap('#tabs button[data-tab="sfeer"]'); await page.tap('.item[data-type="path"]');
  const c = await S(() => { const b = __hh.G.center; const s = __hh.api.screenOf(b.cx + 3, 0.3, b.cz + 0.5), s2 = __hh.api.screenOf(b.cx + 4, 0.3, b.cz + 0.5); return [[s.x, s.y], [s2.x, s2.y]]; });
  await page.touchscreen.tap(c[0][0], c[0][1]); await page.waitForTimeout(150); await page.touchscreen.tap(c[1][0], c[1][1]); await page.waitForTimeout(200);
  console.log('paths placed', await S(() => __hh.G.buildings.filter(b => b.type === 'path').length), 'stone', await S(() => __hh.G.res.stone), 'still building', await S(() => !!__hh.UIS.build));
  await page.screenshot({ path: 'shots/23-phone-path.png' });
  await page.tap('#p-stop');
  // --- wait for the hut, then open it by tapping ---
  await page.tap('#speed button[data-s="3"]');
  await page.waitForFunction(() => __hh.G.buildings.some(b => b.type === 'lumber' && b.done), null, { timeout: 120000 });
  const bp = await S(() => { const b = __hh.G.buildings.find(b => b.type === 'lumber'); const s = __hh.api.screenOf(b.cx, b.y + 0.3, b.cz); return [s.x, s.y]; });
  await page.touchscreen.tap(bp[0], bp[1]); await page.waitForTimeout(400);
  console.log('panel:', await page.textContent('#pn-title'), '|', await page.textContent('#bw-n'), 'tap at', bp.map(Math.round), 'minus btn', await S(() => { const r = document.getElementById('bw-m').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); }));
  await page.tap('#bw-p'); await page.waitForTimeout(200);
  console.log('after +:', await page.textContent('#bw-n'), '| small targets:', await small());
  await page.screenshot({ path: 'shots/24-phone-panel.png' });
  await page.tap('#pn-close');
  // --- tap a villager ---
  const vp = await S(() => { const v = __hh.G.villagers.find(v => v.mesh.visible); const s = __hh.api.screenOf(v.x, v.y + 0.35, v.z); return [s.x, s.y]; });
  await page.touchscreen.tap(vp[0], vp[1]); await page.waitForTimeout(300);
  console.log('villager panel:', await S(() => __hh.UIS.panel && __hh.UIS.panel.kind), await page.textContent('#pn-title'), '|', await page.textContent('#pn-sub'));
  await page.tap('#r-pop'); await page.waitForTimeout(300); await page.screenshot({ path: 'shots/25-phone-people.png' });
  await page.tap('#pn-close'); await page.tap('#menu'); await page.waitForTimeout(200); await page.screenshot({ path: 'shots/26-phone-menu.png' });
  console.log('small targets (menu):', await small());
  await page.tap('[data-act="help"]'); await page.waitForTimeout(200); await page.screenshot({ path: 'shots/27-phone-help.png' });
  console.log('workers now', await S(() => __hh.G.buildings.find(b => b.type === 'lumber').workers.length));
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
