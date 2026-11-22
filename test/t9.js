const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open();
  const S = (f, a) => page.evaluate(f, a);
  await page.click('#s-new'); await page.waitForTimeout(700);
  await page.click('#coach-skip');
  await page.click('.item[data-type="house"]');
  let pt = null;
  for (const [x, y] of [[520, 330], [820, 330], [600, 250], [760, 440], [450, 420], [900, 250]]) {
    await page.mouse.move(x, y, { steps: 2 }); await page.waitForTimeout(250);
    if (await S(() => __hh.UIS.build.has && !__hh.UIS.build.reason)) { pt = { x, y }; break; }
  }
  console.log('valid spot at', pt, await page.textContent('#p-msg'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'shots/70-ghost-ok.png', clip: { x: pt.x - 330, y: pt.y - 230, width: 660, height: 420 } });
  await page.mouse.click(pt.x, pt.y); await page.waitForTimeout(600);
  await S(() => { for (let t = 0; t < 4; t += 0.05) __hh.api.stepSim(0.05); }); await page.waitForTimeout(700);
  await page.screenshot({ path: 'shots/72-site.png', clip: { x: pt.x - 330, y: pt.y - 230, width: 660, height: 420 } });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
