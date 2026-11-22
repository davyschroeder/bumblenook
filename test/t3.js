const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open();
  const S = (f) => page.evaluate(f);
  await page.click('#s-new'); await page.waitForTimeout(800);
  await page.click('#coach-skip'); await page.waitForTimeout(300);      // this test drives the camera itself
  // --- build with the mouse ---
  await page.click('#tabs button[data-tab="grond"]');
  await page.click('.item[data-type="lumber"]');
  // find a valid spot on screen near trees
  const pt = await S(() => {
    const { G, api, BT } = __hh; let best = null, bd = 1e9;
    const t = api.trees.filter(t => t.state === 0).sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz))[6];
    for (let j = 4; j < 50; j++) for (let i = 4; i < 50; i++) { if (api.canPlace('lumber', i, j)) continue; const d = Math.hypot(i + 1 - 28 - t.x, j + 1 - 28 - t.z); if (d < bd && d > 1.5) { const q = api.screenOf(i + 1 - 28, 0.3, j + 1 - 28), e = document.elementFromPoint(q.x, q.y); if (e && e.id === 'c') { bd = d; best = [i, j]; } } }
    const s = api.screenOf(best[0] + 1 - 28, 0.3, best[1] + 1 - 28); return { x: s.x, y: s.y, tile: best };
  });
  await page.mouse.move(pt.x - 40, pt.y - 10); await page.mouse.move(pt.x, pt.y, { steps: 4 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/10-ghost.png' });
  console.log('place msg:', await page.textContent('#p-msg'), '| ghost tile', await S(() => [__hh.UIS.build.i, __hh.UIS.build.j, __hh.UIS.build.reason]), 'want', pt.tile);
  await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(300);
  console.log('after click: buildings', await S(() => __hh.G.buildings.map(b => b.type + ':' + b.done)), 'wood', await S(() => __hh.G.res.wood), 'build mode', await S(() => !!__hh.UIS.build));
  await page.click('#speed button[data-s="3"]');
  await page.waitForFunction(() => __hh.G.buildings.some(b => b.type === 'lumber' && b.done), null, { timeout: 60000 });
  console.log('lumber built; workers', await S(() => __hh.G.buildings.find(b => b.type === 'lumber').workers.length), 'quest', await S(() => __hh.G.quest));
  // --- select building by clicking it ---
  const bp = await S(() => { const b = __hh.G.buildings.find(b => b.type === 'lumber'); const s = __hh.api.screenOf(b.cx, b.y + 0.3, b.cz); return { x: s.x, y: s.y }; });
  await page.mouse.click(bp.x, bp.y); await page.waitForTimeout(300);
  console.log('panel:', await page.textContent('#pn-title'), '|', await page.textContent('#b-status'), '|', await page.textContent('#bw-n'));
  await page.click('#bw-p'); await page.waitForTimeout(200);
  console.log('after +:', await page.textContent('#bw-n'));
  await page.screenshot({ path: 'shots/11-panel.png' });
  await page.waitForTimeout(6000);
  await page.click('#r-pop'); await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/12-people.png' });
  await page.click('#p-list .person'); await page.waitForTimeout(600);
  console.log('villager panel:', await page.textContent('#pn-title'), '|', await page.textContent('#pn-sub'), '|', await page.textContent('#v-say'));
  await page.click('#r-happy'); await page.waitForTimeout(200);
  console.log('happy:', await page.textContent('#h-parts'));
  await page.keyboard.press('Escape');
  // --- camera: wheel, right-drag, keys ---
  const c0 = await S(() => ({ ...__hh.CAM }));
  await page.mouse.move(700, 400); await page.mouse.wheel(0, -400); await page.waitForTimeout(500);
  await page.mouse.down({ button: 'right' }); await page.mouse.move(900, 400, { steps: 5 }); await page.mouse.up({ button: 'right' });
  await page.mouse.move(600, 420); await page.mouse.down(); await page.mouse.move(500, 380, { steps: 5 }); await page.mouse.up();
  await page.waitForTimeout(500);
  const c1 = await S(() => ({ ...__hh.CAM }));
  console.log('cam zoom', c0.gd.toFixed(1), '->', c1.gd.toFixed(1), 'yaw', c0.gyaw.toFixed(2), '->', c1.gyaw.toFixed(2), 'pan', c0.gx.toFixed(1), c0.gz.toFixed(1), '->', c1.gx.toFixed(1), c1.gz.toFixed(1));
  // dragging must not have selected or placed anything
  console.log('sel after drag', await S(() => __hh.UIS.sel && __hh.UIS.sel.kind));
  await page.screenshot({ path: 'shots/13-close.png' });
  // --- night ---
  await S(() => { __hh.G.time = 0.715; });
  await S(() => { for (let t = 0; t < 12; t += 0.05) __hh.api.stepSim(0.05); });
  console.log('night: asleep', await S(() => __hh.G.villagers.filter(v => v.state === 'sleep').length + '/' + __hh.G.villagers.length), 'time', await S(() => __hh.G.time.toFixed(3)));
  await S(() => { __hh.UIS.paused = true; __hh.G.time = 0.82; });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shots/14-night.png' });
  await S(() => { __hh.UIS.paused = false; });
  await S(() => { for (let t = 0; t < 70; t += 0.05) __hh.api.stepSim(0.05); });
  await page.waitForTimeout(1500);
  console.log('morning: day', await S(() => __hh.G.day), 'awake', await S(() => __hh.G.villagers.filter(v => v.state !== 'sleep').length));
  // --- save and reload ---
  await page.click('#menu'); await page.click('[data-act="save"]');
  const before = await S(() => ({ b: __hh.G.buildings.length, v: __hh.G.villagers.length, wood: __hh.G.res.wood, jobs: __hh.G.villagers.filter(v => v.job).length, trees: __hh.api.trees.filter(t => t.state === 0).length }));
  await page.reload(); await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots/15-reload-start.png' });
  await page.click('#s-cont'); await page.waitForTimeout(800);
  const after = await S(() => ({ b: __hh.G.buildings.length, v: __hh.G.villagers.length, wood: __hh.G.res.wood, jobs: __hh.G.villagers.filter(v => v.job).length, trees: __hh.api.trees.filter(t => t.state === 0).length }));
  console.log('save', JSON.stringify(before), 'load', JSON.stringify(after));
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
