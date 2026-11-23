// How fast do two brickmakers work when stone and wood are plentiful?
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({});
  await page.click('#s-new'); await page.waitForTimeout(800); await page.click('#coach-skip');
  const r = await page.evaluate(() => { const { G, api, UIS, BT } = __hh; UIS.paused = true; G.tech.masonry = 1; G.level = 4; Object.assign(G.res, { wood: 500, stone: 500, food: 900 });
    const c = G.center; let b = null;
    for (let j = 4; j < 50 && !b; j++) for (let i = 4; i < 50 && !b; i++) if (!api.canPlace('brickworks', i, j) && Math.hypot(i - c.i, j - c.j) < 7 && Math.hypot(i - c.i, j - c.j) > 4) b = api.placeBuilding('brickworks', i, j, 0, { done: true });
    api.assignWorker(b); api.assignWorker(b); const out = [];
    G.res.brick = 140; for (let m = 1; m <= 3; m++) { for (let t = 0; t < 60; t += 0.05) { api.stepSim(0.05); if (G.time > 0.6) G.time = 0.2; } out.push(G.res.brick); }
    return { workers: b.workers.length, perMinute: out, says: b.workers.map(v => v.say) }; });
  console.log(JSON.stringify(r), 'errors', errors.length);
  await browser.close();
})();
