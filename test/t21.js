// The seven new features, seen through the real interface.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 1280, height: 800 } });
  const S = (f, a) => page.evaluate(f, a);
  const txt = (sel) => page.textContent(sel);
  await page.click('#s-new'); await page.waitForTimeout(800); await page.click('#coach-skip'); await page.waitForTimeout(300);
  console.log('goal card:', (await txt('#q-n')), '|', await S(() => [...document.querySelectorAll('#q-list .qg')].map(e => e.textContent).join(' || ')));
  await page.screenshot({ path: 'shots/e0-goalcard.png', clip: { x: 0, y: 0, width: 520, height: 260 } });
  // ledger: play a little, then open by tapping the wood chip
  await S(() => { const { G, BT, api, UIS } = __hh; UIS.paused = true; G.res.wood = 200; G.res.stone = 100;
    const byD = (arr) => arr.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz));
    const spot = (type, near, minD) => { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 3; j < 52; j++) for (let i = 3; i < 52; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - near.x, j + s / 2 - 28 - near.z); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; };
    const C = { x: G.center.cx, z: G.center.cz };
    let p = spot('lumber', byD(api.trees.filter(t => t.state === 0))[8], 1.5); api.placeBuilding('lumber', p[0], p[1], 0, { done: true });
    p = spot('forager', byD(api.bushes)[2], 1.5); api.placeBuilding('forager', p[0], p[1], 0, { done: true });
    for (const b of G.buildings) if (b.def.job) { api.assignWorker(b); api.assignWorker(b); }
    for (let t = 0; t < 200; t += 0.05) api.stepSim(0.05); });
  await page.waitForTimeout(600);
  console.log('modal open before ledger:', await S(() => { const m = document.getElementById('modal'); const o = !m.hidden && [...m.children].filter(c => !c.hidden).map(c => c.id).join(','); m.hidden = true; return o; }));
  await page.click('#r-wood'); await page.waitForTimeout(500);
  console.log('ledger:', await txt('#pn-title'), '|', await S(() => [...document.querySelectorAll('#lg-rows .lg')].slice(1, 4).map(e => e.textContent.replace(/\s+/g, ' ')).join(' || ')), '|', await txt('#lg-food'));
  await page.screenshot({ path: 'shots/e1-ledger.png' });
  await page.click('#pn-close');
  console.log('errors so far:', errors.length ? errors.join('\n') : 'none');
  await browser.close();

  // sandbox for everything else
  const B = await open({ viewport: { width: 1280, height: 800 } });
  const pg = B.page, S2 = (f, a) => pg.evaluate(f, a);
  await pg.click('#s-sand'); await pg.waitForTimeout(900);
  const info = await S2(() => {
    const { G, BT, api, UIS, CAM } = __hh; UIS.paused = true;
    const spot = (type, minD) => { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 3; j < 52; j++) for (let i = 3; i < 52; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - G.center.cx, j + s / 2 - 28 - G.center.cz); if (d < minD) continue; let crowd = 0; if (s > 1) for (let q = j - 1; q <= j + s; q++) for (let p = i - 1; p <= i + s; p++) { const o = G.bmap.get(__hh.W.occ[q * 56 + p]); if (o && o.size > 1) crowd = 1; } if (!crowd && d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; };
    const placed = {};
    for (const t of ['tavern', 'bench', 'bench', 'bench', 'pond', 'academy', 'house', 'house', 'lighthouse', 'cathedral', 'shipyard', 'greathive', 'apiary']) { const p = spot(t, BT[t].nearWater ? 0 : 3.6); if (p) { const b = api.placeBuilding(t, p[0], p[1], 2, { done: true }); placed[t] = b ? 1 : 0; } else placed[t] = 'NO SPOT'; }
    for (const b of G.buildings) if (b.def.job) api.assignWorker(b);
    return { placed, locks: ['cathedral', 'shipyard', 'greathive'].map(t => api.lock(t)), finale: G.finale, won: G.won };
  });
  console.log('sandbox placed', JSON.stringify(info));
  await S2(() => { document.getElementById('modal').hidden = true; });
  // evening life: fast-forward into the evening and look at the green
  await S2(() => { const { G, api, CAM } = __hh; G.time = 0.6; for (let t = 0; t < 22; t += 0.05) api.stepSim(0.05); const c = G.center; CAM.gx = CAM.tx = c.cx; CAM.gz = CAM.tz = c.cz; CAM.gd = CAM.dist = 17; });
  await pg.waitForTimeout(1500);
  console.log('evening:', await S2(() => { const m = {}; for (const v of __hh.G.villagers) m[v.say] = (m[v.say] || 0) + 1; return JSON.stringify(m); }), '| sitting', await S2(() => __hh.G.villagers.filter(v => v.anim === 'sit').length));
  await pg.screenshot({ path: 'shots/e2-evening.png' });
  // festival dance
  await S2(() => { const { G, api } = __hh; G.time = 0.3; for (const v of G.villagers) v.plan.length = 0; api.festival(); for (let t = 0; t < 14; t += 0.05) api.stepSim(0.05); });
  await pg.waitForTimeout(1200);
  console.log('festival:', await S2(() => __hh.G.villagers.filter(v => v.anim === 'cheer').length + ' cheering of ' + __hh.G.villagers.length + ', festival ' + Math.round(__hh.G.festival)));
  await pg.screenshot({ path: 'shots/e3-festival.png' });
  // winter: snowmen and the fair
  await S2(() => { const { G, api } = __hh; G.festival = 0; G.day = 13; G.time = 0.999; api.stepSim(0.5); G.time = 0.25; for (let q = 0; q < 12; q++) { for (const v of G.villagers) if (!v.job && Math.random() < 0.5) v.plan.length = 0; for (let t = 0; t < 12; t += 0.05) api.stepSim(0.05); G.time = 0.3; } api.festival(); for (let t = 0; t < 3; t += 0.05) api.stepSim(0.05); });
  await pg.waitForTimeout(2500);
  console.log('winter: season', await S2(() => __hh.SEASONS[__hh.G.season]), 'snowmen', await S2(() => __hh.W.snowmen.length), 'fair', await S2(() => __hh.G.fair), 'happy parts', await S2(() => __hh.G.happyParts.filter(p => /Fair|Snow/.test(p[0])).map(p => p[0] + ' ' + p[1]).join(', ')));
  await pg.screenshot({ path: 'shots/e4-winterfair.png' });
  // grand projects + expedition
  await S2(() => { const { G, CAM } = __hh; const b = G.buildings.find(b => b.type === 'cathedral') || G.center; const h = G.buildings.find(b => b.type === 'greathive') || b; CAM.gx = CAM.tx = (b.cx + h.cx) / 2; CAM.gz = CAM.tz = (b.cz + h.cz) / 2; CAM.gd = CAM.dist = 20; G.day = 1; G.time = 0.999; __hh.api.stepSim(0.5); G.time = 0.35; });
  await pg.waitForTimeout(2500); await pg.screenshot({ path: 'shots/e5-wonders.png' });
  const ex = await S2(() => { const { G, api } = __hh; const ok = __hh.startExpedition(); let log = [G.exp.state]; for (let t = 0; t < 320; t += 0.05) { api.stepSim(0.05); if (log[log.length - 1] !== G.exp.state) log.push(G.exp.state); } return { ok, log, treasure: Object.keys(G.treasure), exped: G.stats.exped }; });
  console.log('expedition', JSON.stringify(ex));
  // academy pairs
  await S2(() => { const { G, CAM } = __hh; G.tech = { masonry: 1 }; G.rp = 300; const b = G.buildings.find(b => b.type === 'academy'); CAM.gx = CAM.tx = b.cx; CAM.gz = CAM.tz = b.cz; });
  await pg.waitForTimeout(900);
  const ap = await S2(() => { const b = __hh.G.buildings.find(b => b.type === 'academy'); const s = __hh.api.screenOf(b.cx, b.y + 0.3, b.cz); return [s.x, s.y]; });
  await S2(() => { document.getElementById('modal').hidden = true; });
  await pg.mouse.click(ap[0], ap[1]); await pg.waitForTimeout(500);
  await pg.click('[data-tech="guildfarm"]'); await pg.waitForTimeout(400);
  console.log('guild choice:', await S2(() => JSON.stringify({ guildfarm: !!__hh.G.tech.guildfarm, other: document.querySelector('[data-tech="guildtrade"]') ? 'still buyable' : 'locked out', label: [...document.querySelectorAll('.tech.lost .tick')].map(e => e.textContent).join(',') })));
  await S2(() => { document.getElementById('pn-body').scrollTop = 99999; });
  await pg.waitForTimeout(300); await pg.screenshot({ path: 'shots/e6-guilds.png' });
  console.log('errors:', B.errors.length ? B.errors.join('\n') : 'none');
  await B.browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
