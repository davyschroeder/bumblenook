const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open();
  const S = (f) => page.evaluate(f);
  await page.click('#s-new'); await page.waitForTimeout(500);
  await page.click('#speed button[data-s="3"]');
  await S(() => { __hh.G.time = 0.715; window.__f = 0; (function c() { window.__f++; requestAnimationFrame(c); })(); });
  for (let q = 0; q < 8; q++) {
    const f0 = await S(() => window.__f);
    await page.waitForTimeout(4000);
    console.log('fps', ((await S(() => window.__f)) - f0) / 4, 't', await S(() => __hh.G.time.toFixed(3)), 'day', await S(() => __hh.G.day), await S(() => __hh.G.villagers.map(v => v.state + ':' + v.say + ':' + (v.plan[0] ? v.plan[0].t : '-') + ':' + v.goingHome).join(' | ')));
  }
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
