const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 900, height: 620 } });
  const S = (f, a) => page.evaluate(f, a);
  await page.click('#s-new'); await page.waitForTimeout(500);
  await S(() => {
    const { G, BT, api, UIS } = __hh; G.tut = 6; UIS.paused = true; G.res.wood = 500; G.res.stone = 300; G.res.food = 400;
    const spot = (type, cx, cz, minD) => { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 3; j < 50; j++) for (let i = 3; i < 50; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - cx, j + s / 2 - 28 - cz); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; };
    const byD = (arr) => arr.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz));
    const tree = byD(api.trees.filter(t => t.state === 0))[10], bush = byD(api.bushes)[2];
    let p = spot('lumber', tree.x, tree.z, 1.5); api.placeBuilding('lumber', p[0], p[1], 0, { done: true });
    p = spot('forager', bush.x, bush.z, 1.5); api.placeBuilding('forager', p[0], p[1], 0, { done: true });
    p = spot('farm', G.center.cx, G.center.cz, 4.5); api.placeBuilding('farm', p[0], p[1], 0, { done: true });
    for (const t of ['farm', 'lumber', 'forager']) { const b = G.buildings.find(b => b.type === t); api.assignWorker(b); } api.assignWorker(G.buildings.find(b => b.type === 'farm'));
    for (let q = 0; q < 6; q++) api.stepSim(0.05);
  });
  const until = async (pred, label, file) => {
    const ok = await S((src) => { const pred = eval(src); const { G, api, CAM } = __hh; for (let t = 0; t < 120; t += 0.05) { api.stepSim(0.05); const v = G.villagers.find(pred); if (v && v.plan[0].el > 1.2) { CAM.gx = CAM.tx = v.x; CAM.gz = CAM.tz = v.z; CAM.gd = CAM.dist = 9.5; return v.name + ': ' + v.say; } } return null; }, pred);
    console.log(label, '->', ok);
    await page.waitForTimeout(1400); await page.screenshot({ path: 'shots/' + file });
  };
  await until("(v) => v.plan[0] && v.plan[0].t === 'do' && v.plan[0].anim === 'chop' && v.job && v.job.type === 'lumber'", 'woodcutter', '90-chop.png');
  await until("(v) => v.plan[0] && v.plan[0].t === 'do' && v.job && v.job.type === 'forager' && v.plan[0].anim === 'bend'", 'forager', '91-pick.png');
  await until("(v) => v.plan[0] && v.plan[0].t === 'do' && v.job && v.job.type === 'farm'", 'farmer', '92-farm.png');
  // sealing rule: a ring of houses around a spot must refuse the last gap
  const seal = await S(() => {
    const { G, api } = __hh; const c = G.center; const out = [];
    // try to wall in the green: every tile next to the ring gets a lantern until the rule refuses
    let refused = null, placed = 0;
    for (let j = c.j - 2; j <= c.j + 4 && !refused; j++) for (let i = c.i - 2; i <= c.i + 4; i++) {
      if (!(i === c.i - 2 || i === c.i + 4 || j === c.j - 2 || j === c.j + 4)) continue;
      if (api.canPlace('lantern', i, j)) continue;
      const r = api.blocks('lantern', i, j, 0); if (r) { out.push(r); continue; }
      api.placeBuilding('lantern', i, j, 0, { done: true }); placed++;
    }
    return 'placed ' + placed + ' lanterns around the green, refused ' + out.length + ': ' + [...new Set(out)].join(' | ');
  });
  console.log('sealing test:', seal);
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
