// New-feature checks through the real interface, in English and in Dutch.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 1280, height: 800 } });
  const S = (f, a) => page.evaluate(f, a);
  const txt = (sel) => page.textContent(sel);
  await page.screenshot({ path: 'shots/b0-start.png' });
  console.log('start buttons:', await S(() => [...document.querySelectorAll('#start button')].filter(b => !b.hidden).map(b => b.textContent).join(' | ')));
  // --- sandbox ---
  await page.click('#s-sand'); await page.waitForTimeout(900);
  console.log('sandbox: mode', await S(() => __hh.G.mode), 'level', await S(() => __hh.LEVELS[__hh.G.level].name), 'locks', await S(() => Object.keys(__hh.BT).filter(t => t !== 'center' && __hh.api.lock(t)).join(',') || 'none'), 'pop', await S(() => __hh.G.villagers.length));
  // place academy + townhall + path drag + undo through the UI
  async function placeUI(type, tab, dx, dy) {
    await page.click('#tabs button[data-tab="' + tab + '"]');
    await S((t) => document.querySelector('.item[data-type="' + t + '"]').scrollIntoView({ inline: 'center', block: 'nearest' }), type);
    await page.click('.item[data-type="' + type + '"]');
    for (const [x, y] of [[640 + dx, 330 + dy], [520 + dx, 300 + dy], [760 + dx, 300 + dy], [640 + dx, 240 + dy], [420 + dx, 360 + dy], [860 + dx, 380 + dy]]) {
      await page.mouse.move(x, y, { steps: 2 }); await page.waitForTimeout(200);
      if (await S(() => __hh.UIS.build && __hh.UIS.build.has && !__hh.UIS.build.reason)) { await page.mouse.click(x, y); await page.waitForTimeout(250); return true; }
    }
    await page.keyboard.press('Escape'); return false;
  }
  console.log('place academy', await placeUI('academy', 'dorp', -220, 0), 'townhall', await placeUI('townhall', 'dorp', 230, 10), 'house', await placeUI('house', 'dorp', 0, -150));
  const res0 = await S(() => JSON.stringify(__hh.G.res));
  console.log('sandbox keeps resources:', res0 === await S(() => JSON.stringify(__hh.G.res)), '| undo visible', await page.isVisible('#c-undo'));
  const nb = await S(() => __hh.G.buildings.length);
  await page.click('#c-undo'); await page.waitForTimeout(300);
  console.log('undo: buildings', nb, '->', await S(() => __hh.G.buildings.length));
  // path drag
  await page.click('#tabs button[data-tab="sfeer"]'); await page.click('.item[data-type="path"]');
  const p0 = await S(() => { const c = __hh.G.center, a = __hh.api.screenOf(c.cx - 3, 0.3, c.cz + 3.5), b = __hh.api.screenOf(c.cx + 3, 0.3, c.cz + 3.5); return [a.x, a.y, b.x, b.y]; });
  await page.mouse.move(p0[0], p0[1]); await page.mouse.down(); await page.mouse.move(p0[2], p0[3], { steps: 14 }); await page.mouse.up(); await page.waitForTimeout(300);
  console.log('path drag laid', await S(() => __hh.G.buildings.filter(b => b.type === 'path').length), 'tiles');
  await page.keyboard.press('Escape');
  // finish buildings, staff academy, research via panel
  await S(() => { const { G, api } = __hh; for (const b of G.buildings) if (!b.done) { b.progress = 0.99; } for (let t = 0; t < 30; t += 0.05) api.stepSim(0.05); for (const b of G.buildings) if (b.done && b.def.job) { api.assignWorker(b); api.assignWorker(b); } G.rp = 100; G.tech = {}; });
  const ac = await S(() => { const b = __hh.G.buildings.find(b => b.type === 'academy'); __hh.CAM.gx = __hh.CAM.tx = b.cx; __hh.CAM.gz = __hh.CAM.tz = b.cz; return b.done; });
  await page.waitForTimeout(700);
  const sp = await S(() => { const b = __hh.G.buildings.find(b => b.type === 'academy'); const s = __hh.api.screenOf(b.cx, b.y + 0.3, b.cz); return [s.x, s.y]; });
  await page.mouse.click(sp[0], sp[1]); await page.waitForTimeout(500);
  console.log('academy done', ac, '| panel', await txt('#pn-title'), '|', await txt('#b-rp'));
  await page.click('[data-tech="mining"]'); await page.waitForTimeout(300);
  console.log('research via button: mining', await S(() => !!__hh.G.tech.mining), 'insight left', await S(() => __hh.G.rp));
  await page.screenshot({ path: 'shots/b1-academy.png' });
  await page.click('#pn-close');
  // town hall improvements
  const th = await S(() => { const b = __hh.G.buildings.find(b => b.type === 'townhall'); if (!b) return null; __hh.CAM.gx = __hh.CAM.tx = b.cx; __hh.CAM.gz = __hh.CAM.tz = b.cz; return 1; });
  if (th) { await page.waitForTimeout(700); const q = await S(() => { const b = __hh.G.buildings.find(b => b.type === 'townhall'); const s = __hh.api.screenOf(b.cx, b.y + 0.3, b.cz); return [s.x, s.y]; }); await page.mouse.click(q[0], q[1]); await page.waitForTimeout(400); await page.click('[data-civic="streets"]'); await page.waitForTimeout(200); console.log('civic bought:', await S(() => Object.keys(__hh.G.civic).join(','))); await page.click('#pn-close'); }
  // upgrade a house through its panel
  await S(() => { const { G, api, BT } = __hh; G.tech.carpentry = 1; let b = G.buildings.find(b => b.type === 'house'); if (!b) { for (let j = 5; j < 50 && !b; j++) for (let i = 5; i < 50; i++) if (!api.canPlace('house', i, j) && !api.blocks('house', i, j, 0) && Math.hypot(i - 27 - G.center.cx, j - 27 - G.center.cz) > 6) { b = api.placeBuilding('house', i, j, 0, { done: true }); break; } } __hh.CAM.gx = __hh.CAM.tx = b.cx; __hh.CAM.gz = __hh.CAM.tz = b.cz; });
  await page.waitForTimeout(700);
  const hp = await S(() => { const b = __hh.G.buildings.find(b => b.type === 'house'); const s = __hh.api.screenOf(b.cx, b.y + 0.3, b.cz); return [s.x, s.y]; });
  await page.mouse.click(hp[0], hp[1]); await page.waitForTimeout(400);
  await page.click('#b-upg'); await page.waitForTimeout(500);
  console.log('upgrade: title', await txt('#pn-title'), '| beds', await txt('#b-res'));
  await page.screenshot({ path: 'shots/b2-townhouse.png' });
  await page.click('#pn-close');
  // site: tap and explore
  const st = await S(() => { const s = __hh.W.sites[0]; __hh.CAM.gx = __hh.CAM.tx = s.x; __hh.CAM.gz = __hh.CAM.tz = s.z; __hh.CAM.gd = __hh.CAM.dist = 16; return s.kind; });
  await page.waitForTimeout(800);
  const sq = await S(() => { const s = __hh.W.sites[0]; const q = __hh.api.screenOf(s.x, s.y + 0.2, s.z); return [q.x, q.y]; });
  await page.mouse.click(sq[0], sq[1]); await page.waitForTimeout(400);
  console.log('site', st, '| panel', await txt('#pn-title'), '|', await txt('#s-note'));
  await page.screenshot({ path: 'shots/b3-site.png' });
  await page.click('#s-go'); await page.waitForTimeout(200);
  await S(() => { for (let t = 0; t < 90; t += 0.05) __hh.api.stepSim(0.05); });
  console.log('explored:', await S(() => __hh.W.sites[0].found), 'stats', await S(() => __hh.G.stats.explored));
  // seasons: winter look
  await S(() => { const c = __hh.G.center; __hh.CAM.gx = __hh.CAM.tx = c.cx; __hh.CAM.gz = __hh.CAM.tz = c.cz; __hh.CAM.gd = __hh.CAM.dist = 30; __hh.G.day = 13; for (let t = 0; t < 2; t += 0.05) __hh.api.stepSim(0.05); __hh.G.time = 0.999; __hh.api.stepSim(0.5); __hh.G.time = 0.3; __hh.G.rain = 40; });
  await page.waitForTimeout(3500);
  console.log('season now:', await S(() => __hh.SEASONS[__hh.G.season]), '| clock', await txt('#day'));
  await page.screenshot({ path: 'shots/b4-winter.png' });
  await S(() => { __hh.G.day = 9; __hh.G.time = 0.999; __hh.api.stepSim(0.5); __hh.G.time = 0.3; __hh.G.rain = 0; });
  await page.waitForTimeout(2500); await page.screenshot({ path: 'shots/b5-autumn.png' });
  // photo mode
  await page.click('#menu'); await page.click('[data-act="photo"]'); await page.waitForTimeout(400);
  await page.click('#ph-up'); await page.click('#ph-up'); await page.fill('#ph-time', '66'); await page.waitForTimeout(1200);
  console.log('photo mode: hud hidden', await S(() => getComputedStyle(document.getElementById('hud')).display === 'none'), 'tilt', await S(() => __hh.CAM.tilt));
  await page.screenshot({ path: 'shots/b6-photo.png' });
  await page.click('#ph-exit');
  // language + text size + graphics
  await page.click('#menu'); await page.click('[data-act="lang"]'); await page.click('[data-act="big"]'); await page.click('[data-act="gfx"]'); await page.waitForTimeout(300);
  console.log('menu NL:', await S(() => [...document.querySelectorAll('#m-menu button')].map(b => b.textContent).join(' | ')));
  await page.click('[data-act="close"]'); await page.click('#quest'); await page.waitForTimeout(600);
  await page.screenshot({ path: 'shots/b7-dutch.png' });
  const left = await S(() => { const out = new Set(); for (const id of ['hud', 'modal']) { const w = document.createTreeWalker(document.getElementById(id), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.nodeValue.trim(); if (/[A-Za-z]{4}/.test(t) && n._en === n.nodeValue && !n.parentNode.closest('[hidden],svg') && !__hh.G.villagers.some(v => v.name === t)) out.add(t); } } return [...out].slice(0, 40); });
  console.log('NL: untranslated visible texts (' + left.length + '):', left.join(' || '));
  console.log('NL toast sample:', await S(() => [__hh.api.tr('Mabel has moved to Bumblenook!'), __hh.api.tr('Goal reached: Build 2 Cottages. Reward: 15 stone, 10 wood'), __hh.api.tr('Jack explored the Stone Circle and found 40 stone and 20 coins.'), __hh.api.tr('Day 4: The tide left 20 wood on the beach.')].join(' || ')));
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
