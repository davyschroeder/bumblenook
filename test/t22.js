// Phone width: goal card, village panel, ledger, finale; Dutch for the new texts; save round-trip of the new fields.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ device: 'iPhone 13' });
  const S = (f, a) => page.evaluate(f, a);
  await page.tap('#s-new'); await page.waitForTimeout(800); await page.tap('#coach-skip'); await page.waitForTimeout(400);
  const box = async (sel) => S((s) => { const r = document.querySelector(s).getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; }, sel);
  console.log('phone goal card box', await box('#quest'), 'h-scroll', await S(() => document.documentElement.scrollWidth > innerWidth));
  await page.screenshot({ path: 'shots/f0-phone-goals.png' });
  // give the village some history, in winter with treasures, then look at the panels
  await S(() => { const { G, api, UIS } = __hh; UIS.paused = true; G.q.grow = 6; G.q.prosper = 3; G.q.discover = 2; G.quest = 11; G.treasure = { idol: 1, pearl: 1 }; G.tech.guildfarm = 1; G.res.wood = 180; for (let t = 0; t < 30; t += 0.05) api.stepSim(0.05); UIS.dirty = true; });
  await page.waitForTimeout(500);
  await S(() => { document.getElementById('modal').hidden = true; });
  await page.tap('#quest'); await page.waitForTimeout(500);
  console.log('village panel title:', await page.textContent('#pn-title'), '| goal rows', await S(() => document.querySelectorAll('#panel .qg, #panel .goal, #panel .trk').length), '| mentions treasures', await S(() => /Treasure/i.test(document.getElementById('pn-body').textContent)));
  await page.screenshot({ path: 'shots/f1-phone-village.png' });
  await S(() => { const b = document.getElementById('pn-body'); b.scrollTop = b.scrollHeight; }); await page.waitForTimeout(200);
  await page.screenshot({ path: 'shots/f2-phone-village-end.png' });
  await page.tap('#pn-close'); await page.waitForTimeout(200);
  await page.tap('#r-food'); await page.waitForTimeout(400);
  console.log('ledger on phone:', await page.textContent('#pn-title'), 'panel box', await box('#panel'));
  await page.screenshot({ path: 'shots/f3-phone-ledger.png' });
  await page.tap('#pn-close');
  // Dutch
  await S(() => { __hh.SET.lang = 'nl'; }); await page.tap('#menu'); await page.tap('[data-act="lang"]'); await page.waitForTimeout(200);
  const lang = await S(() => __hh.SET.lang); if (lang !== 'nl') { await page.tap('[data-act="lang"]'); }
  await page.tap('[data-act="close"]'); await page.waitForTimeout(400);
  console.log('lang', await S(() => __hh.SET.lang), '| card NL:', await S(() => [...document.querySelectorAll('#q-list .qg')].map(e => e.textContent).join(' || ')));
  await page.tap('#r-food'); await page.waitForTimeout(400);
  console.log('ledger NL:', await S(() => document.getElementById('panel').textContent.replace(/\s+/g, ' ').slice(0, 330)));
  await page.tap('#pn-close');
  const untr = await S(() => { const { TRACKS, TREASURES, TECHS, BT, ACH, api } = __hh; const miss = []; const chk = (s) => { if (s && api.tr(s) === s && /[a-z]{3}/.test(s)) miss.push(s); };
    for (const k in TRACKS) { chk(TRACKS[k].name); for (const q of TRACKS[k].goals) chk(q.text); }
    for (const t of TREASURES) { chk(t.name); chk(t.desc); }
    for (const id of ['guildtrade', 'guildfarm', 'sealore', 'woodlore', 'scholars', 'artisans']) { const t = (Array.isArray(TECHS) ? TECHS.find(x => x.id === id) : TECHS[id]); if (t) { chk(t.name); chk(t.desc); } }
    for (const id of ['cathedral', 'shipyard', 'greathive']) { chk(BT[id].name); chk(BT[id].desc); }
    for (const a of ACH) { chk(a.name); chk(a.desc); }
    return miss; });
  console.log('untranslated new strings (' + untr.length + '):', untr.slice(0, 12).join(' || '));
  // finale modal
  await S(() => { __hh.G.finale = false; });
  await S(() => { const m = document.getElementById('modal'); m.hidden = false; for (const c of m.children) c.hidden = c.id !== 'm-final'; __hh.api.tr && 0; });
  await page.waitForTimeout(300);
  console.log('finale modal:', await S(() => document.getElementById('m-final').textContent.replace(/\s+/g, ' ').slice(0, 260)), '| fits', await S(() => { const r = document.getElementById('m-final').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; }));
  await page.screenshot({ path: 'shots/f4-phone-finale.png' });
  await S(() => { document.getElementById('modal').hidden = true; });
  // save round-trip of the new fields
  const rt = await S(() => { const { G, W, api } = __hh; G.exp.state = 'away'; G.exp.until = G.clock + 50; G.fair = true;
    const snap = () => JSON.stringify({ q: G.q, quest: G.quest, tr: Object.keys(G.treasure), exp: G.exp.state, left: Math.round(G.exp.until - G.clock), fair: G.fair, finale: G.finale, sn: (W.snowmen || []).length, tech: Object.keys(G.tech).sort(), oc: G.outcrop });
    const a = snap(); const d = JSON.parse(JSON.stringify(api.serialize())); api.loadGame(d); const b = snap(); return { same: a === b, a, b }; });
  console.log('round-trip new fields:', rt.same ? 'IDENTICAL ' + rt.a : 'DIFFERS\n' + rt.a + '\n' + rt.b);
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
