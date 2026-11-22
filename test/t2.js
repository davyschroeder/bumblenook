const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open();
  await page.click('#s-new');
  await page.waitForTimeout(500);
  const log = await page.evaluate(async () => {
    const { G, W, BT, api, UIS } = __hh;
    UIS.paused = true;
    const out = [];
    const N = 56;
    function spot(type, cx, cz, minD) {
      const s = BT[type].size; let best = null, bd = 1e9;
      for (let j = 2; j < N - 4; j++) for (let i = 2; i < N - 4; i++) {
        if (api.canPlace(type, i, j)) continue;
        const d = Math.hypot(i + s / 2 - 28 - cx, j + s / 2 - 28 - cz);
        if (d < (minD || 0)) continue;
        if (d < bd) { bd = d; best = [i, j]; }
      }
      return best;
    }
    function build(type, near, minD) {
      const d = BT[type];
      for (const r of Object.keys(d.cost)) if (G.res[r] < d.cost[r]) return false;
      const c = near || G.center, p = spot(type, c.cx !== undefined ? c.cx : c.x, c.cz !== undefined ? c.cz : c.z, minD === undefined ? 3.2 : minD);
      if (!p) { out.push('NO SPOT ' + type); return false; }
      for (const r of Object.keys(d.cost)) G.res[r] -= d.cost[r];
      return api.placeBuilding(type, p[0], p[1], 0) || true;
    }
    const ff = (sec) => { for (let t = 0; t < sec; t += 0.05) api.stepSim(0.05); };
    const snap = (label) => out.push(label + ' d' + G.day + ' t' + G.time.toFixed(2) + ' res ' + JSON.stringify(G.res) + ' pop ' + G.villagers.length + '/' + G.buildings.filter(b => b.done && b.def.beds).reduce((n, b) => n + b.def.beds, 0) + ' happy ' + Math.round(G.happy) + (G.hungry ? ' HUNGRY' : '') + ' q' + G.quest + ' jobs ' + G.villagers.map(v => v.job ? v.job.def.job[0] : '-').join(''));
    const count = (t) => G.buildings.filter(b => b.type === t).length;
    const tree = api.trees.filter(t => t.state === 0).sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz))[8];
    const bush = api.bushes.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz))[2];
    const rock = api.rocks.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz))[1];
    snap('start');
    build('lumber', tree, 1.5); build('forager', bush, 1.5);
    ff(40); snap('after40s');
    // staff workplaces fully
    const staff = () => { for (const b of G.buildings) while (b.done && b.def.job && b.workers.length < b.def.slots && G.villagers.filter(v => !v.job).length > 1) if (!api.assignWorker(b)) break; };
    for (let step = 0; step < 60; step++) {
      staff();
      const pop = G.villagers.length, beds = G.buildings.filter(b => b.def.beds).reduce((n, b) => n + b.def.beds, 0);
      if (beds < pop + 3 && count('house') < 12) build('house');
      if (!count('quarry') && pop >= 6) build('quarry', rock, 1.5);
      if (count('forager') < 2 && pop >= 7) build('forager', bush, 4);
      if (!count('farm') && pop >= 8) build('farm');
      if (!count('bakery') && count('farm')) build('bakery');
      if (!count('fisher') && pop >= 9) build('fisher', null, 0);
      if (!count('well') && pop >= 6) build('well');
      if (count('lantern') < 4 && pop >= 8) build('lantern');
      if (!count('apiary') && pop >= 9) build('apiary');
      if (count('flowers') < 4 && count('apiary')) build('flowers', G.buildings.find(b => b.type === 'apiary'), 1.5);
      if (!count('market') && pop >= 8) build('market');
      if (count('lumber') < 2 && pop >= 10) build('lumber', tree, 9);
      if (count('farm') < 2 && pop >= 13) build('farm');
      if (!count('windmill') && pop >= 12) build('windmill');
      if (!count('fountain') && pop >= 12) build('fountain');
      if (count('bench') < 4 && pop >= 10) build('bench');
      if (!count('lighthouse') && pop >= 16) build('lighthouse', null, 0);
      const mk = G.buildings.find(b => b.type === 'market' && b.done && b.workers.length);
      if (mk) { while (G.res.honey >= 3) { G.res.honey--; G.res.coins += 4; G.stats.coins += 4; } }
      ff(42.5);
      if (step % 4 === 3) snap('step' + step);
    }
    out.push('says: ' + G.villagers.map(v => v.name + ':' + v.say).join(' | '));
    out.push('buildings: ' + G.buildings.filter(b => b.type !== 'path').map(b => b.type + (b.done ? '' : '(' + b.progress.toFixed(2) + ')') + (b.def.job ? '[' + b.workers.length + ']' : '') + (b.warn ? '!' + b.warn : '')).join(', '));
    out.push('trees live ' + api.trees.filter(t => t.state === 0).length + ' target ' + W.treeTarget + ' stats ' + JSON.stringify(G.stats));
    UIS.paused = false;
    return out;
  });
  console.log(log.join('\n'));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'shots/03-village.png' });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
