const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open();
  await page.screenshot({ path: 'shots/01-start.png' });
  console.log('thumbs', await page.evaluate(() => Object.keys(__hh.UIS.thumbs).length), 'villagers', await page.evaluate(() => __hh.G.villagers.length));
  await page.click('#s-new');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots/02-game.png' });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
