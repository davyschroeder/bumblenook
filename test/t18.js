const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 900, height: 600 } });
  const S = (f, a) => page.evaluate(f, a);
  await page.click('#s-new'); await page.waitForTimeout(700); await page.click('#coach-skip');
  for (const act of ['big', 'lang', 'gfx']) {
    await page.click('#menu'); await page.click('[data-act="' + act + '"]'); await page.click('[data-act="close"]'); await page.waitForTimeout(500);
    console.log(act, await S(() => { const q = document.querySelector('#q-list .qg'), c = getComputedStyle(q), b = getComputedStyle(document.body); return [c.color, c.fontFamily.slice(0, 30), b.color, document.body.className, document.documentElement.lang, getComputedStyle(document.documentElement).colorScheme].join(' | '); }));
    await page.screenshot({ path: 'shots/c-' + act + '.png', clip: { x: 0, y: 0, width: 520, height: 200 } });
  }
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
