const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 1000, height: 660 } });
  const S = (f, a) => page.evaluate(f, a);
  await page.click('#s-new'); await page.waitForTimeout(500); await page.click('#coach-skip');
  const snap = () => S(() => { const { G } = __hh; return JSON.stringify({ level: G.level, ach: Object.keys(G.ach), missions: G.missions.map(m => m.res + m.n + ':' + m.coins), fest: Math.round(G.festival), b: G.buildings.map(b => b.type + (b.def.job ? b.workers.length : '')).join(','), wool: G.res.wool, cloth: G.res.cloth, stats: [G.stats.missions, G.stats.fest, G.stats.planted], fence: __hh.W.fence.reduce((n, v) => n + (v ? 1 : 0), 0), tut: G.tut }); });
  await S(() => {
    const { G, BT, api, UIS } = __hh; UIS.paused = true; G.level = 2; G.ach.honey = 1; Object.assign(G.res, { wood: 300, stone: 300, food: 300, honey: 20, coins: 100, wool: 6, cloth: 4 });
    const spot = (type, minD) => { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 3; j < 52; j++) for (let i = 3; i < 52; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - G.center.cx, j + s / 2 - 28 - G.center.cz); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; };
    for (const t of ['tavern', 'pasture', 'weaver', 'school', 'hedge', 'fountain']) { const p = spot(t, 4); api.placeBuilding(t, p[0], p[1], 0, { done: true }); }
    api.assignWorker(G.buildings.find(b => b.type === 'pasture')); api.assignWorker(G.buildings.find(b => b.type === 'tavern'));
    api.newMission(false); api.newMission(false); api.festival(); G.stats.planted = 3;
    for (let t = 0; t < 5; t += 0.05) api.stepSim(0.05);
  });
  const before = await snap();
  await page.click('#menu'); await page.click('[data-act="save"]');
  await page.reload(); await page.waitForTimeout(2500);
  await page.click('#s-cont'); await page.waitForTimeout(800);
  const after = await snap();
  console.log('before', before); console.log('after ', after); console.log(before === after ? 'ROUNDTRIP OK' : 'ROUNDTRIP DIFFERS');
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
