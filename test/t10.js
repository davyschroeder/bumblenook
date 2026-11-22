const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ device: 'iPhone 13' });
  const S = (f, a) => page.evaluate(f, a);
  const ringTap = async () => { await page.waitForTimeout(900); const p = await S(() => { const r = document.getElementById('coach-ring').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); await page.touchscreen.tap(p[0], p[1]); await page.waitForTimeout(700); };
  await page.tap('#s-new'); await page.waitForTimeout(1200);
  await ringTap(); await ringTap();                       // Materials tab, Lumber Hut
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'shots/80-phone-spot.png' });
  await ringTap();                                        // marked spot
  await page.waitForTimeout(1500);
  console.log('coach:', await page.textContent('#coach-text'), '| ghost on screen at', await S(() => { const b = __hh.UIS.build; const s = __hh.api.screenOf(b.i + 1 - 28, b.y, b.j + 1 - 28); return [Math.round(s.x), Math.round(s.y), document.elementFromPoint(s.x, s.y).id]; }));
  await page.screenshot({ path: 'shots/81-phone-place.png' });
  await ringTap();                                        // Place
  console.log('placed:', await S(() => __hh.G.buildings.map(b => b.type).join(' ')), '| tut', await S(() => __hh.G.tut));
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
