// The nine additions in src/life.js, driven through the simulation and the interface.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 1280, height: 800 } });
  const S = (f, a) => page.evaluate(f, a);
  await page.click('#s-new'); await page.waitForTimeout(800); await page.click('#coach-skip'); await page.waitForTimeout(300);
  // --- buildings, animals, chains
  const r1 = await S(() => {
    const { G, W, BT, api, UIS, life } = __hh; UIS.paused = true; G.level = 4; G.tut = 6; for (const t of __hh.TECHS) G.tech[t.id] = 1;
    Object.assign(G.res, { wood: 900, stone: 900, food: 900, grain: 200, honey: 60, cloth: 30, coins: 2000, brick: 200 });
    const c = G.center, placed = {};
    const spot = (type, minD) => { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 3; j < 52; j++) for (let i = 3; i < 52; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - c.cx, j + s / 2 - 28 - c.cz); if (d < minD || d >= bd) continue; let crowd = 0; for (let q = j - 1; q <= j + s; q++) for (let p = i - 1; p <= i + s; p++) { const o = G.bmap.get(W.occ[q * 56 + p]); if (o && !o.def.flat) crowd = 1; } if (!crowd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; };
    for (const t of ['house', 'house', 'house', 'coop', 'cowshed', 'pastry', 'tailor', 'brazier', 'garden', 'flag', 'arch', 'lumber', 'tavern', 'school']) { const p = spot(t, 3.6); placed[t] = p ? !!api.placeBuilding(t, p[0], p[1], 0, { done: true }) : 'NO SPOT'; }
    for (let q = 0; q < 10; q++) life.tryBirth();          // nobody yet: no adults in the houses
    for (const b of G.buildings) if (b.done && b.def.job) { api.assignWorker(b); }
    const f0 = G.res.food;
    for (let t = 0; t < 260; t += 0.05) { api.stepSim(0.05); if (G.time > 0.55) G.time = 0.2; }
    return { placed, cake: G.stats.cake || 0, clothes: G.stats.clothes || 0, foodUp: Math.round(G.res.food - f0), grainLeft: G.res.grain, says: G.villagers.filter(v => v.job && ['poulterer', 'dairy', 'confectioner', 'tailor'].includes(v.job.def.job)).map(v => v.job.def.job + ': ' + v.say) };
  });
  console.log('1 buildings', JSON.stringify(r1));
  // --- roads
  const r2 = await S(() => {
    const { G, W, api, life } = __hh; const b = G.buildings.find(q => q.type === 'lumber'), c = G.center;
    const before = life.roadCount();
    // lay a path tile by tile from the hut's door side to the green
    let i = b.i + 1, j = b.j + b.size, n = 0; const ti = c.i + 1, tj = c.j + 3;
    while ((i !== ti || j !== tj) && n < 80) { if (!api.canPlace('path', i, j)) { api.placeBuilding('path', i, j, 0, { silent: true }); } if (i !== ti && (n % 2 === 0 || j === tj)) i += Math.sign(ti - i); else if (j !== tj) j += Math.sign(tj - j); else i += Math.sign(ti - i); n++; }
    if (!api.canPlace('path', ti, tj)) api.placeBuilding('path', ti, tj, 0, { silent: true });
    return { before, after: life.roadCount(), onRoad: b.onRoad, tiles: n };
  });
  console.log('2 roads', JSON.stringify(r2));
  // --- needs and neighbourhood, through the house panel
  const hp = await S(() => { const { G, api, CAM, life } = __hh; life.neighbourhoods(); const h = G.buildings.find(b => b.type === 'house'); CAM.gx = CAM.tx = h.cx; CAM.gz = CAM.tz = h.cz; CAM.gd = CAM.dist = 14; window.__h = h; return h.hood; });
  await page.waitForTimeout(900);
  const p = await S(() => { const h = window.__h, s = __hh.api.screenOf(h.cx, h.y + 0.4, h.cz); return [s.x, s.y]; });
  await page.mouse.click(p[0], p[1]); await page.waitForTimeout(500);
  console.log('3 hood', JSON.stringify(hp, (k, v) => (k === 'loud' ? (v ? v.type : null) : typeof v === 'number' ? +v.toFixed(2) : v)), '| panel:', await page.textContent('#pn-title'), '|', await S(() => (document.getElementById('b-hood') || {}).textContent), '| bars', await S(() => ['warm', 'company', 'rest', 'beauty'].map(k => document.getElementById('b-n-' + k).style.width).join(' ')));
  await page.screenshot({ path: 'shots/g1-house-panel.png' });
  await page.click('#pn-close');
  // --- life course
  const r4 = await S(() => { const { G, api, life } = __hh; G.happy = 90; G.babySoon = true; let born = false; for (let q = 0; q < 30 && !born; q++) { G.babySoon = true; born = life.tryBirth(); }
    const kid = G.villagers.find(v => v.child); if (!kid) return { born };
    const sc = kid.mesh.scale.x, cant = api.assignWorker(G.buildings.find(b => b.type === 'lumber'), kid);
    for (let t = 0; t < 30; t += 0.05) api.stepSim(0.05); const say = kid.say;
    life.ageTick(); life.ageTick(); life.ageTick();
    const old = G.villagers[0]; old.age = 39; life.ageTick();
    return { born, name: kid.name, scale: +sc.toFixed(2), assignChild: cant, say, grown: !kid.child, scaleAfter: kid.mesh.scale.x, elderHair: old.hair, parts: (life.calcHappy(), G.happyParts.filter(p => /elder|Children|Cake|clothes|street|company|sleep/i.test(p[0])).map(p => p[0] + ' ' + p[1])) }; });
  console.log('4 life', JSON.stringify(r4));
  // --- Far Isle through the shipyard panel
  await S(() => { const { G, BT, api, CAM } = __hh; G.stats.exped = 1; let b = null; for (let j = 3; j < 52 && !b; j++) for (let i = 3; i < 52 && !b; i++) if (!api.canPlace('shipyard', i, j) && !api.blocks('shipyard', i, j, 0)) b = api.placeBuilding('shipyard', i, j, 0, { done: true }); window.__s = b; CAM.gx = CAM.tx = b.cx; CAM.gz = CAM.tz = b.cz; });
  await page.waitForTimeout(900);
  const sp = await S(() => { const h = window.__s, s = __hh.api.screenOf(h.cx, h.y + 0.4, h.cz); return [s.x, s.y]; });
  await page.mouse.click(sp[0], sp[1]); await page.waitForTimeout(500);
  await S(() => { document.getElementById('pn-body').scrollTop = 9999; }); await page.waitForTimeout(400);
  await page.click('#b-found'); await page.waitForTimeout(400);
  await page.click('[data-isle="clay:-1"]'); await page.waitForTimeout(400); await page.click('[data-isle="salt:1"]'); await page.waitForTimeout(400);
  await S(() => { document.getElementById('pn-body').scrollTop = 9999; }); await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/g2-isle-panel.png' });
  console.log('5 isle', JSON.stringify(await S(() => { const { G, life } = __hh; const f = G.res.food; life.isleDay(); life.pantryDay(); return { on: G.isle.on, crew: G.isle.crew, salt: G.res.salt, clay: G.res.clay, grapes: G.res.grapes, foodSent: f - G.res.food, chips: __hh.NEW_RES.filter(r => !document.getElementById('r-' + r).hidden) }; })));
  await page.click('#pn-close');
  // --- every choice, both answers
  console.log('6 choices', JSON.stringify(await S(() => { const { G, CHOICES } = __hh; const out = []; for (const c of CHOICES) for (const k of ['a', 'b']) { G.res.coins = 500; G.res.food = 500; G.res.honey = 20; let m; try { m = c[k][1](); } catch (e) { m = 'THREW ' + e.message; } out.push(c.id + '.' + k + ': ' + (typeof m === 'string' && m.length > 10 ? 'ok' : 'BAD ' + m)); } return out.join(' | '); })));
  await S(() => { const { G, UIS, life } = __hh; G.pending = 'circus'; life.showChoice(); });
  await page.waitForTimeout(500); await page.screenshot({ path: 'shots/g3-choice.png' });
  const evTitle = await page.textContent('#ev-title');
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  const stillOpen = await S(() => !document.getElementById('modal').hidden && !!__hh.G.pending);
  await page.click('#ev-a'); await page.waitForTimeout(400);
  console.log('6 modal:', evTitle, '| stays open on Escape', stillOpen, '| after answer pending', await S(() => __hh.G.pending), 'modal hidden', await S(() => document.getElementById('modal').hidden));
  // --- save round trip
  console.log('8 save', JSON.stringify(await S(() => { const { G, api } = __hh; G.pending = null; const snap = () => JSON.stringify({ isle: G.isle, kids: G.villagers.filter(v => v.child).length, ages: G.villagers.map(v => v.age).join(','), res: __hh.NEW_RES.map(r => Math.round(G.res[r])), b: G.buildings.filter(b => ['coop', 'cowshed', 'pastry', 'tailor', 'garden'].includes(b.type)).length, need: G.villagers[0].need ? +G.villagers[0].need.rest.toFixed(2) : null });
    const a = snap(); api.loadGame(JSON.parse(JSON.stringify(api.serialize()))); const b = snap(); return a === b ? 'IDENTICAL ' + a : 'DIFFERS ' + a + ' ' + b; })));
  await S(() => { const { CAM, G } = __hh; CAM.gx = CAM.tx = G.center.cx + 3; CAM.gz = CAM.tz = G.center.cz + 2; CAM.gd = CAM.dist = 17; __hh.UIS.paused = true; });
  await page.addStyleTag({ content: '#hud,#labels,#coach,#toasts,#floats{display:none!important}' }); await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots/g4-new-buildings.png' });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
  // --- challenges, from the title screen
  const B = await open({ viewport: { width: 1280, height: 800 } });
  const pg = B.page;
  await pg.click('#s-chal'); await pg.waitForTimeout(400); await pg.screenshot({ path: 'shots/g5-challenges.png' });
  console.log('9 list:', await pg.evaluate(() => [...document.querySelectorAll('#ch-list b')].map(e => e.textContent).join(', ')));
  await pg.click('[data-scn="honey"]'); await pg.waitForTimeout(900);
  console.log('9 honey:', JSON.stringify(await pg.evaluate(() => { const { G, api, life } = __hh; const card = document.getElementById('q-n').textContent; G.res.honey = 41; for (let t = 0; t < 3; t += 0.05) api.stepSim(0.05); return { mode: G.mode, level: G.level, card, over: G.scn.over, medals: life.medals(), card2: (__hh.UIS.dirty = true, document.getElementById('q-n').textContent) }; })));
  await pg.reload(); await pg.waitForTimeout(2500); await pg.click('#s-chal'); await pg.waitForTimeout(300);
  console.log('9 after reload button:', await pg.evaluate(() => document.querySelector('[data-scn="honey"]').textContent));
  await pg.click('[data-scn="nomarket"]'); await pg.waitForTimeout(900);
  console.log('9 nomarket: market lock =', await pg.evaluate(() => { __hh.G.level = 4; return __hh.api.lock('market'); }), '| winter:', JSON.stringify(await pg.evaluate(() => { const { G, api } = __hh; api.newGame(5, 'scn-winter'); return { day: G.day, season: __hh.SEASONS[G.season], pop: G.villagers.length, food: G.res.food }; })));
  console.log('errors:', B.errors.length ? B.errors.join('\n') : 'none');
  await B.browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
