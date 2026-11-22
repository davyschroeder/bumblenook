// Modes, old-save migration and phone layout of the new screens.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ device: 'iPhone 13' });
  const S = (f, a) => page.evaluate(f, a);
  await page.screenshot({ path: 'shots/d0-phone-start.png' });
  console.log('start h-scroll', await S(() => document.documentElement.scrollWidth > innerWidth), 'buttons', await S(() => [...document.querySelectorAll('#start button')].filter(b => !b.hidden).map(b => b.textContent + ' ' + Math.round(b.getBoundingClientRect().height)).join(' | ')));
  await page.tap('#s-daily'); await page.waitForTimeout(1200);
  const d1 = await S(() => ({ mode: __hh.G.mode, seed: __hh.G.seed, goal: __hh.G.daily.goal, date: __hh.G.daily.date, tut: __hh.G.tut }));
  console.log('daily', JSON.stringify(d1));
  await page.tap('#coach-skip'); await page.tap('#quest'); await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/d1-phone-daily.png' });
  await page.tap('#pn-close');
  // force the daily goal and check the record
  await S(() => { const { G, api } = __hh; G.stats.coins = 500; G.stats.honey = 99; G.stats.missions = 9; G.level = 2; G.happy = 99; for (let q = 0; q < 12; q++) G.villagers.push(G.villagers[0]); for (let t = 0; t < 2; t += 0.05) { try { api.stepSim(0.05); } catch (e) {} } G.villagers.length = 4; });
  console.log('daily done', await S(() => JSON.stringify(__hh.G.daily)), 'best stored', await S(() => localStorage.getItem('bumblenook-daily-best')));
  await page.tap('#menu'); await page.waitForTimeout(300); await page.screenshot({ path: 'shots/d2-phone-menu.png' });
  console.log('menu fits / scrolls:', await S(() => { const s = document.getElementById('m-menu'); return s.scrollHeight + ' in ' + s.clientHeight + ' (viewport ' + innerHeight + ')'; }));
  await page.tap('[data-act="save"]'); await page.waitForTimeout(300);
  // reload: daily continues, normal has no save yet
  await page.reload(); await page.waitForTimeout(2500);
  console.log('after reload: continue visible', await page.isVisible('#s-cont'));
  await page.tap('#s-daily'); await page.waitForTimeout(1000);
  console.log('daily resumed: same seed', (await S(() => __hh.G.seed)) === d1.seed, 'done kept', await S(() => __hh.G.daily.done));
  // --- migration: an old-format save must still load ---
  await S(() => {
    const d = __hh.api.serialize();
    for (const k of ['mode', 'rp', 'tech', 'civic', 'news', 'lastEvent', 'story', 'storyOn', 'storyBase', 'fish', 'daily', 'fox', 'sf']) delete d[k];
    d.v = 3; d.quest = 5; d.b = d.b.map(a => a.slice(0, 9)); d.p = d.p.map(a => a.slice(0, 9));
    localStorage.setItem('bumblenook-save-v2', JSON.stringify(d));
    const e = JSON.parse(JSON.stringify(d)); e.v = 2; for (const k of ['level', 'ach', 'festival', 'cheer', 'missions']) delete e[k];
    localStorage.setItem('bumblenook-save-v1', JSON.stringify(e));
  });
  await page.reload(); await page.waitForTimeout(2500);
  console.log('old v3 save: continue visible', await page.isVisible('#s-cont'));
  await page.tap('#s-cont'); await page.waitForTimeout(900);
  console.log('v3 loaded:', await S(() => JSON.stringify({ mode: __hh.G.mode, b: __hh.G.buildings.length, v: __hh.G.villagers.length, talent: __hh.G.villagers[0].talent, sites: __hh.W.sites.length, quest: __hh.G.quest, season: __hh.G.season })));
  await S(() => { __hh.G.started = false; localStorage.removeItem('bumblenook-save-v2'); });      // stop the page from saving again on the way out
  await page.reload(); await page.waitForTimeout(2500);
  console.log('old v2 save under the old key: continue visible', await page.isVisible('#s-cont'));
  await page.tap('#s-cont'); await page.waitForTimeout(900);
  console.log('v2 loaded:', await S(() => JSON.stringify({ mode: __hh.G.mode, b: __hh.G.buildings.length, v: __hh.G.villagers.length, level: __hh.G.level })));
  for (let q = 0; q < 3; q++) await S(() => { for (let t = 0; t < 20; t += 0.05) __hh.api.stepSim(0.05); });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
