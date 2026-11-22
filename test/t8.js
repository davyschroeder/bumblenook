// Play-test: follow ONLY what the tutorial coach points at, then build a village through the real UI.
const { open } = require('./common');
const phone = process.argv[2] === 'phone';
(async () => {
  const { browser, page, errors } = await open(phone ? { device: 'iPhone 13' } : {});
  const S = (f, a) => page.evaluate(f, a);
  const tag = phone ? 'p' : 'd';
  const tap = async (x, y) => { if (phone) await page.touchscreen.tap(x, y); else { await page.mouse.move(x, y, { steps: 3 }); await page.waitForTimeout(120); await page.mouse.click(x, y); } await page.waitForTimeout(450); };
  const ff = (sec) => S((s) => { for (let t = 0; t < s; t += 0.05) __hh.api.stepSim(0.05); }, sec);
  await page.screenshot({ path: `shots/${tag}50-title.png` });
  await tap(...(await S(() => { const r = document.getElementById('s-new').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })));
  await page.waitForTimeout(900);
  // --- tutorial ---
  let lastText = '', shot = 0, guard = 0;
  while (guard++ < 60) {
    const c = await S(() => {
      const c = __hh.TUT.cur; if (!c) return null;
      const ring = document.getElementById('coach-ring').getBoundingClientRect();
      return { text: document.getElementById('coach-text').textContent, tut: __hh.G.tut, kind: c.el ? 'el' : c.b ? 'b' : c.world ? 'world' : 'none', ok: !!c.ok, x: ring.left + ring.width / 2, y: ring.top + ring.height / 2, hidden: document.getElementById('coach').hidden };
    });
    if (!c) { if (await S(() => __hh.G.tut >= 6)) break; await page.waitForTimeout(400); continue; }
    if (c.text !== lastText) { lastText = c.text; console.log(`[tut ${c.tut}] (${c.kind}) ${c.text}`); await page.screenshot({ path: `shots/${tag}51-tut-${String(shot++).padStart(2, '0')}.png` }); }
    if (c.ok) { await tap(...(await S(() => { const r = document.getElementById('coach-ok').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }))); continue; }
    if (c.tut === 1) { await ff(6); await page.waitForTimeout(500); continue; }      // villagers are building: just wait
    await page.waitForTimeout(700);                                                  // let the camera settle on the marked spot
    const p = await S(() => { const r = document.getElementById('coach-ring').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    await tap(p[0], p[1]);
  }
  console.log('tutorial finished:', await S(() => __hh.G.tut), 'buildings', await S(() => __hh.G.buildings.map(b => b.type + (b.done ? '' : '*') + (b.def.job ? '[' + b.workers.length + ']' : '')).join(' ')), 'steps', guard);
  // --- build a village with the real UI ---
  const TAB = { house: 'dorp', store: 'dorp', well: 'dorp', market: 'dorp', forager: 'voedsel', fisher: 'voedsel', farm: 'voedsel', bakery: 'voedsel', windmill: 'voedsel', apiary: 'voedsel', lumber: 'grond', quarry: 'grond', path: 'sfeer', lantern: 'sfeer', flowers: 'sfeer', bench: 'sfeer', fountain: 'sfeer' };
  async function build(type) {
    const can = await S((t) => { const d = __hh.BT[t]; return Object.keys(d.cost).every(r => __hh.G.res[r] >= d.cost[r]) && !__hh.api.lock(t); }, type);
    if (!can) return false;
    const spot = await S((t) => {
      const { G, BT, api, CAM } = __hh, s = BT[t].size, c = G.center; let best = null, bd = 1e9;
      for (let j = 3; j < 52; j++) for (let i = 3; i < 52; i++) {
        if (api.canPlace(t, i, j)) continue;
        const d = Math.hypot(i + s / 2 - 28 - c.cx, j + s / 2 - 28 - c.cz); if (d < 3.6) continue;
        let crowd = 0; if (s > 1) for (let q = j - 1; q <= j + s; q++) for (let p = i - 1; p <= i + s; p++) { const o = G.bmap.get(__hh.W.occ[q * 56 + p]); if (o && o.size > 1) crowd = 1; }
        if (!crowd && d < bd) { bd = d; best = [i, j]; }
      }
      if (!best) return null;
      CAM.gx = CAM.tx = best[0] + s / 2 - 28; CAM.gz = CAM.tz = best[1] + s / 2 - 28 + (innerHeight > innerWidth ? 2.5 : 1); CAM.gd = CAM.dist = 21;
      return { i: best[0], j: best[1], s };
    }, type);
    if (!spot) return false;
    await page.waitForTimeout(350);
    await tap(...(await S((id) => { const r = document.querySelector('#tabs button[data-tab="' + id + '"]').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, TAB[type])));
    await S((t) => document.querySelector('.item[data-type="' + t + '"]').scrollIntoView({ inline: 'center', block: 'nearest' }), type);
    await tap(...(await S((t) => { const r = document.querySelector('.item[data-type="' + t + '"]').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, type)));
    const sp = await S((o) => { const s = __hh.api.screenOf(o.i + o.s / 2 - 28, 0.3, o.j + o.s / 2 - 28); return [s.x, s.y, document.elementFromPoint(s.x, s.y).id]; }, spot);
    if (sp[2] !== 'c') { console.log('  spot for', type, 'is under the HUD:', sp[2]); await page.keyboard.press('Escape'); return false; }
    const n0 = await S(() => __hh.G.buildings.length);
    await tap(sp[0], sp[1]);
    if (phone && !(await S((t) => __hh.BT[t].quick, type))) await tap(...(await S(() => { const r = document.getElementById('p-ok').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })));
    if (await S(() => !!__hh.UIS.build)) await tap(...(await S(() => { const r = document.getElementById('p-stop').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })));
    const ok = (await S(() => __hh.G.buildings.length)) > n0;
    if (!ok) console.log('  FAILED to place', type, await S(() => document.getElementById('p-msg').textContent));
    return ok;
  }
  async function staff() {      // open each understaffed workplace through its badge and press +
    for (let q = 0; q < 6; q++) {
      const id = await S(() => { const free = __hh.G.villagers.filter(v => !v.job).length; if (free < 3) return 0; const b = __hh.G.buildings.find(b => b.done && b.def.job && b.workers.length < b.def.slots); if (!b) return 0; __hh.CAM.gx = __hh.CAM.tx = b.cx; __hh.CAM.gz = __hh.CAM.tz = b.cz + (innerHeight > innerWidth ? 3 : 1); return b.id; });
      if (!id) return;
      await page.waitForTimeout(500);
      const r = await S((id) => { const el = document.querySelector('.wl[data-b="' + id + '"]'); if (!el) return null; const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, id);
      if (!r) { console.log('  no badge for', id); return; }
      await tap(r[0], r[1]);
      for (let k = 0; k < 2; k++) if (await S(() => { const p = document.getElementById('bw-p'); return p && !p.disabled && __hh.G.villagers.filter(v => !v.job).length > 2; })) await tap(...(await S(() => { const r = document.getElementById('bw-p').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })));
      await tap(...(await S(() => { const r = document.getElementById('pn-close').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })));
    }
  }
  const count = (t) => S((t) => __hh.G.buildings.filter(b => b.type === t).length, t);
  const plan = [['house', 2], ['well', 1], ['house', 4], ['quarry', 1], ['lantern', 2], ['farm', 1], ['bakery', 1], ['house', 6], ['apiary', 1], ['flowers', 3], ['market', 1], ['fisher', 1], ['bench', 2], ['house', 8], ['windmill', 1], ['lantern', 4], ['fountain', 1], ['farm', 2], ['store', 1], ['flowers', 5]];
  let placed = 0;
  for (let round = 0; round < (+process.env.ROUNDS || (phone ? 10 : 46)); round++) {
    for (const [t, n] of plan) { if ((await count(t)) < n) { if (await build(t)) { placed++; } break; } }
    await staff();
    await ff(34);
    if (round % 9 === 8) console.log('round', round, await S(() => 'day ' + __hh.G.day + ' pop ' + __hh.G.villagers.length + ' res ' + JSON.stringify(__hh.G.res) + ' happy ' + Math.round(__hh.G.happy) + ' goal ' + (__hh.G.quest + 1)));
  }
  console.log('placed through the UI:', placed, '| village:', await S(() => { const m = {}; for (const b of __hh.G.buildings) m[b.type] = (m[b.type] || 0) + 1; return JSON.stringify(m); }));
  console.log('jobs:', await S(() => { const m = {}; for (const v of __hh.G.villagers) { const j = v.job ? v.job.def.job : 'free'; m[j] = (m[j] || 0) + 1; } return JSON.stringify(m); }));
  await S(() => { const c = __hh.G.center; __hh.CAM.gx = __hh.CAM.tx = c.cx; __hh.CAM.gz = __hh.CAM.tz = c.cz; __hh.CAM.gd = __hh.CAM.dist = 30; __hh.G.time = 0.3; });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `shots/${tag}60-village-day.png` });
  await S(() => { __hh.UIS.paused = true; __hh.G.time = 0.69; __hh.CAM.gd = 24; });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `shots/${tag}61-village-dusk.png` });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
