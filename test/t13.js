// Progression play-through: respects every lock, fills requests and ship orders, holds festivals.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 1200, height: 760 } });
  await page.click('#s-new'); await page.waitForTimeout(500);
  const out = await page.evaluate(() => {
    const { G, W, BT, api, UIS, LEVELS, ACH } = __hh; UIS.paused = true; G.tut = 6;
    const N = 56, log = []; let lastLevel = 0, lastQuest = 0; const seenAch = {};
    function spot(type, cx, cz, minD) { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 2; j < N - 4; j++) for (let i = 2; i < N - 4; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - cx, j + s / 2 - 28 - cz); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; }
    function build(type, near, minD) { const d = BT[type]; if (api.lock(type)) return false; for (const r of Object.keys(d.cost)) if (G.res[r] < d.cost[r]) return false; const n = near || G.center, p = spot(type, n.cx !== undefined ? n.cx : n.x, n.cz !== undefined ? n.cz : n.z, minD === undefined ? 3.4 : minD); if (!p) return false; for (const r of Object.keys(d.cost)) G.res[r] -= d.cost[r]; api.placeBuilding(type, p[0], p[1], 0); return true; }
    const count = (t) => G.buildings.filter(b => b.type === t).length;
    const byD = (arr) => arr.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz));
    const tree = byD(api.trees.filter(t => t.state === 0))[8], bush = byD(api.bushes)[2], rock = byD(api.rocks)[1];
    const stamp = () => 'd' + G.day + ' ' + String(Math.floor((5 + G.time * 24) % 24)).padStart(2, '0') + 'h';
    build('lumber', tree, 1.5); build('forager', bush, 1.5);
    const want = [['house', 3], ['quarry', 1, rock, 1.5], ['well', 1], ['farm', 1], ['bakery', 1], ['lantern', 3], ['house', 5], ['apiary', 1], ['flowers', 4], ['fisher', 1, null, 0], ['house', 7], ['market', 1], ['tavern', 1], ['pasture', 1], ['weaver', 1], ['lumber', 2, tree, 9], ['bench', 3], ['house', 9], ['windmill', 1], ['school', 1], ['farm', 2], ['store', 1], ['fountain', 1], ['house', 11], ['harbour', 1, null, 0], ['belltower', 1], ['hedge', 4], ['statue', 1], ['house', 13], ['lighthouse', 1, null, 0], ['lantern', 10]];
    for (let step = 0; step < (+location.hash.slice(1) || 150) && !(G.won && G.level >= 4); step++) {
      for (const b of G.buildings) while (b.done && b.def.job && b.workers.length < b.def.slots && G.villagers.filter(v => !v.job).length > 2) if (!api.assignWorker(b)) break;
      for (const [t, n, near, minD] of want) { if (count(t) < n) { build(t, near || (t === 'flowers' ? G.buildings.find(b => b.type === 'apiary') : null), t === 'flowers' ? 1.5 : minD); break; } }
      for (const m of G.missions.slice()) if (G.res[m.res] >= m.n + (m.res === 'food' ? 40 : 0)) api.deliver(m);
      if (G.stats.fest < 3 && G.res.food > 90 && G.res.honey >= 5) api.festival();
      const mk = G.buildings.find(b => b.type === 'market' && b.done && b.workers.length);
      if (mk) { while (G.res.honey > 12) { G.res.honey--; G.res.coins += 4; G.stats.coins += 4; } while (G.res.cloth > 6) { G.res.cloth--; G.res.coins += 6; G.stats.coins += 6; } while (G.res.wood > 400) { G.res.wood -= 10; G.res.coins += 5; G.stats.coins += 5; } }
      for (let t = 0; t < 42.5; t += 0.05) api.stepSim(0.05);
      if (G.level !== lastLevel) { lastLevel = G.level; log.push(stamp() + ' LEVEL ' + LEVELS[G.level].name + ' (pop ' + G.villagers.length + ')'); }
      if (G.quest !== lastQuest) { lastQuest = G.quest; log.push(stamp() + ' goal ' + G.quest + '/20 done'); }
      for (const a of ACH) if (G.ach[a.id] && !seenAch[a.id]) { seenAch[a.id] = 1; log.push(stamp() + ' badge ' + a.name); }
      if (step % 25 === 24) log.push(stamp() + ' res ' + JSON.stringify(G.res) + ' pop ' + G.villagers.length + ' happy ' + Math.round(G.happy) + ' ship ' + G.ship.state + ' missions ' + G.missions.length);
    }
    log.push('END ' + stamp() + ' level ' + LEVELS[G.level].name + ' goals ' + G.quest + '/20 won ' + G.won + ' stats ' + JSON.stringify(G.stats));
    log.push('jobs ' + JSON.stringify(G.villagers.reduce((m, v) => { const j = v.job ? v.job.def.job : 'free'; m[j] = (m[j] || 0) + 1; return m; }, {})));
    log.push('warn ' + G.buildings.filter(b => b.warn && b.workers.length).map(b => b.type + ': ' + b.warn).join(' | '));
    const c = G.center; __hh.CAM.gx = __hh.CAM.tx = c.cx; __hh.CAM.gz = __hh.CAM.tz = c.cz; __hh.CAM.gd = __hh.CAM.dist = 34; G.time = 0.3; G.rain = 0; UIS.paused = false;
    return log;
  });
  console.log(out.join('\n'));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots/95-progress-village.png' });
  await page.evaluate(() => { document.getElementById('modal').hidden = true; });
  await page.click('#quest'); await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/96-village-panel.png' });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
