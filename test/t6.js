const { open } = require('./common');
(async () => {
  // landscape phone + late-game performance numbers
  const { browser, page, errors } = await open({ viewport: { width: 844, height: 390 } });
  const S = (f, a) => page.evaluate(f, a);
  await page.screenshot({ path: 'shots/30-land-start.png' });
  await page.click('#s-new'); await page.waitForTimeout(800);
  await page.click('.item[data-type="house"]'); await page.mouse.move(420, 200); await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/31-land-hud.png' });
  console.log('h-scroll', await S(() => document.documentElement.scrollWidth > innerWidth), 'hud bottom', await S(() => Math.round(document.getElementById('build').getBoundingClientRect().bottom)), 'of', 390);
  await page.keyboard.press('Escape');
  // fill the island with a big village for a draw-call count
  await S(() => {
    const { G, BT, api, UIS } = __hh; UIS.paused = true;
    const types = ['house', 'house', 'house', 'lumber', 'forager', 'farm', 'bakery', 'apiary', 'market', 'well', 'lantern', 'lantern', 'flowers', 'bench', 'windmill', 'fountain', 'store', 'quarry', 'house', 'house', 'lantern', 'flowers'];
    let n = 0;
    for (let rep = 0; rep < 4; rep++) for (const t of types) {
      const s = BT[t].size; let best = null, bd = 1e9;
      for (let j = 3; j < 50; j++) for (let i = 3; i < 50; i++) { if (api.canPlace(t, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - G.center.cx, j + s / 2 - 28 - G.center.cz); if (d > 3 && d < bd) { bd = d; best = [i, j]; } }
      if (best) { api.placeBuilding(t, best[0], best[1], n++ % 4, { done: true }); }
    }
    G.res.food = 999;
    UIS.paused = false;
  });
  await page.setViewportSize({ width: 1360, height: 820 });
  await S(() => { for (let q = 0; q < 36; q++) { const v = __hh.G.villagers[0]; } });
  await page.waitForTimeout(3000);
  const info = await S(() => { const r = __hh.renderer.info; return { calls: r.render.calls, tris: r.render.triangles, geos: r.memory.geometries, buildings: __hh.G.buildings.length, villagers: __hh.G.villagers.length }; });
  console.log('render info', JSON.stringify(info));
  await S(() => { __hh.CAM.gd = 30; });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots/32-bigvillage.png' });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
