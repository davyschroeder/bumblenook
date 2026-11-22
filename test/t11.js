// Clipping meter: plays a scripted village and samples how often a visible villager overlaps something.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 500, height: 400 } });
  await page.click('#s-new'); await page.waitForTimeout(500);
  const out = await page.evaluate(() => {
    const { G, W, BT, api, UIS } = __hh; UIS.paused = true; G.tut = 6;
    const N = 56, c = { building: 0, tree: 0, bush: 0, rock: 0, villager: 0, fence: 0, samples: 0 }, where = {};
    function spot(type, cx, cz, minD) { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 2; j < N - 4; j++) for (let i = 2; i < N - 4; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - cx, j + s / 2 - 28 - cz); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, (i + j) % 4)) { bd = d; best = [i, j]; } } return best; }
    function build(type, near, minD) { const d = BT[type]; for (const r of Object.keys(d.cost)) if (G.res[r] < d.cost[r]) return; const n = near || G.center, p = spot(type, n.cx !== undefined ? n.cx : n.x, n.cz !== undefined ? n.cz : n.z, minD === undefined ? 3.2 : minD); if (!p) return; for (const r of Object.keys(d.cost)) G.res[r] -= d.cost[r]; api.placeBuilding(type, p[0], p[1], (p[0] + p[1]) % 4); }
    const count = (t) => G.buildings.filter(b => b.type === t).length;
    const byD = (arr) => arr.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz));
    const tree = byD(api.trees.filter(t => t.state === 0))[8], bush = byD(api.bushes)[2], rock = byD(api.rocks)[1];
    function sample() {
      const vs = G.villagers.filter(v => v.mesh.visible && v.state !== 'sleep');
      for (const v of vs) {
        c.samples++;
        const i = Math.floor(v.x + 28), j = Math.floor(v.z + 28), k = j * N + i, b = G.bmap.get(W.occ[k]);
        if (b && W.solid[k]) { c.building++; where[b.type] = (where[b.type] || 0) + 1; }
        else if (b && b.type === 'farm') { const th = b.rot * Math.PI / 2, dx = v.x - b.cx, dz = v.z - b.cz, lx = dx * Math.cos(th) - dz * Math.sin(th), lz = dx * Math.sin(th) + dz * Math.cos(th); if (Math.abs(Math.abs(lx) - 1.42) < 0.1 || (Math.abs(lz - 1.42) < 0.1 && Math.abs(lx) > 0.47)) c.fence++; }
        for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
          const q = (j + dj) * N + i + di, nk = W.natK[q];
          if (nk === 1) { const t = api.trees[W.natI[q]]; if (t.state === 0 && t.size > 0.45 && Math.hypot(t.x - v.x, t.z - v.z) < (t.kind ? 0.36 : 0.2) * t.sc * t.size) c.tree++; }
          else if (nk === 3) { const bu = api.bushes[W.natI[q]]; if (!bu.gone && Math.hypot(bu.x - v.x, bu.z - v.z) < 0.24) c.bush++; }
          else if (nk === 2) { const r = api.rocks[W.natI[q]]; if (r.amount > 0 && Math.hypot(r.x - v.x, r.z - v.z) < 0.3) c.rock++; }
        }
        for (const o of vs) if (o !== v && Math.hypot(o.x - v.x, o.z - v.z) < 0.15) { c.villager++; break; }
      }
    }
    build('lumber', tree, 1.5); build('forager', bush, 1.5);
    for (let step = 0; step < 44; step++) {
      for (const b of G.buildings) while (b.done && b.def.job && b.workers.length < b.def.slots && G.villagers.filter(v => !v.job).length > 2) if (!api.assignWorker(b)) break;
      const pop = G.villagers.length, beds = G.buildings.filter(b => b.def.beds).reduce((n, b) => n + b.def.beds, 0);
      if (beds < pop + 3 && count('house') < 9) build('house');
      if (!count('quarry') && pop >= 6) build('quarry', rock, 1.5);
      if (!count('farm') && pop >= 8) build('farm');
      if (!count('bakery') && count('farm')) build('bakery');
      if (!count('fisher') && pop >= 9) build('fisher', null, 0);
      if (!count('well') && pop >= 6) build('well');
      if (count('lantern') < 4 && pop >= 8) build('lantern');
      if (!count('apiary') && pop >= 9) build('apiary');
      if (count('flowers') < 5 && count('apiary')) build('flowers', G.buildings.find(b => b.type === 'apiary'), 1.5);
      if (!count('market') && pop >= 8) build('market');
      if (count('lumber') < 2 && pop >= 10) build('lumber', tree, 9);
      if (count('farm') < 2 && pop >= 13) build('farm');
      if (count('bench') < 3 && pop >= 10) build('bench');
      for (let t = 0; t < 42.5; t += 0.05) { api.stepSim(0.05); if (Math.round(t * 20) % 10 === 0) sample(); }
    }
    const pc = (n) => (n / c.samples * 100).toFixed(2) + '%';
    return { samples: c.samples, building: pc(c.building), tree: pc(c.tree), bush: pc(c.bush), rock: pc(c.rock), villager: pc(c.villager), fence: pc(c.fence), where, pop: G.villagers.length, day: G.day, res: G.res, quest: G.quest };
  });
  console.log(JSON.stringify(out));
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
