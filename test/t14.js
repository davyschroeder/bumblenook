const { open } = require('./common');
(async () => {
  for (const phone of [false, true]) {
    const { browser, page, errors } = await open(phone ? { device: 'iPhone 13' } : { viewport: { width: 1100, height: 700 } });
    const S = (f, a) => page.evaluate(f, a);
    if (phone) await page.tap('#s-new'); else await page.click('#s-new');
    await page.waitForTimeout(600);
    const info = await S(() => {
      const { G, BT, api, UIS, CAM } = __hh; G.tut = 6; UIS.paused = true; G.level = 3; Object.assign(G.res, { wood: 300, stone: 300, food: 300, honey: 20, coins: 100, wool: 6, cloth: 4, grain: 30 });
      const spot = (type, minD) => { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 3; j < 52; j++) for (let i = 3; i < 52; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - G.center.cx, j + s / 2 - 28 - G.center.cz); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; };
      for (const t of ['harbour', 'pasture', 'weaver', 'tavern', 'school', 'belltower', 'hedge', 'statue', 'farm']) { const p = spot(t, t === 'harbour' ? 0 : 4); api.placeBuilding(t, p[0], p[1], 0, { done: true }); }
      const hb = G.buildings.find(b => b.type === 'harbour'); api.assignWorker(hb); api.assignWorker(G.buildings.find(b => b.type === 'pasture'));
      G.time = 0.075;
      let docked = -1; for (let t = 0; t < 60; t += 0.05) { api.stepSim(0.05); if (G.ship.state === 'docked') { docked = t; break; } }
      CAM.gx = CAM.tx = G.ship.x * 0.6 + hb.cx * 0.4; CAM.gz = CAM.tz = G.ship.z * 0.6 + hb.cz * 0.4; CAM.gd = CAM.dist = 16;
      return { docked, ship: [G.ship.x.toFixed(1), G.ship.z.toFixed(1)], missions: G.missions.map(m => m.text + ' => ' + m.coins) };
    });
    console.log(phone ? 'PHONE' : 'DESKTOP', JSON.stringify(info));
    await page.waitForTimeout(1800);
    await page.screenshot({ path: 'shots/97-ship-' + (phone ? 'p' : 'd') + '.png' });
    await S(() => { const b = __hh.G.buildings.find(b => b.type === 'pasture'); __hh.CAM.gx = __hh.CAM.tx = b.cx; __hh.CAM.gz = __hh.CAM.tz = b.cz + 2; __hh.CAM.gd = __hh.CAM.dist = 15; __hh.G.rain = 60; __hh.UIS.paused = false; });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'shots/98-rain-' + (phone ? 'p' : 'd') + '.png' });
    if (phone) await page.tap('#quest'); else await page.click('#quest');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'shots/99-panel-' + (phone ? 'p' : 'd') + '.png' });
    const del = await S(() => { const b = document.querySelector('[data-mission]:not([disabled])'); if (!b) return 'no deliverable'; const c0 = __hh.G.res.coins; b.click(); return 'coins ' + c0 + ' -> ' + __hh.G.res.coins + ', missions left ' + __hh.G.missions.length; });
    console.log('deliver via button:', del, '| h-scroll', await S(() => document.documentElement.scrollWidth > innerWidth));
    console.log('errors:', errors.length ? errors.join('\n') : 'none');
    await browser.close();
  }
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
