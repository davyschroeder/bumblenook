const { open } = require('./common');
(async () => {
  for (const vp of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
    const { browser, page, errors } = await open({ viewport: vp, wait: 2000 });
    const S = (f, a) => page.evaluate(f, a);
    await page.click('#s-new'); await page.waitForTimeout(700);
    await page.click('#tabs button[data-tab="sfeer"]'); await page.click('.item[data-type="path"]');
    // valid path tiles that are on screen and not under the HUD
    const pts = await S(() => {
      const { G, api } = __hh, out = [];
      const free = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.id === 'c'; };
      for (let r = 2; r < 9 && out.length < 3; r++) for (let a = 0; a < 16 && out.length < 3; a++) {
        const i = Math.round(G.center.cx + 28 + Math.cos(a) * r), j = Math.round(G.center.cz + 28 + Math.sin(a) * r);
        if (api.canPlace('path', i, j)) continue;
        const s = api.screenOf(i + 0.5 - 28, 0.3, j + 0.5 - 28);
        if (free(s.x, s.y) && !out.some(o => o.i === i && o.j === j)) out.push({ i, j, x: s.x, y: s.y });
      }
      return out;
    });
    for (const p of pts) { await page.mouse.click(p.x, p.y); await page.waitForTimeout(120); }
    console.log(vp.width + 'x' + vp.height, 'path taps', pts.length, 'placed', await S(() => __hh.G.buildings.filter(b => b.type === 'path').length), 'stone', await S(() => __hh.G.res.stone));
    await page.click('#tabs button[data-tab="dorp"]'); await page.click('.item[data-type="house"]'); await page.mouse.move(vp.width / 2, vp.height * 0.42);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'shots/40-' + vp.width + '.png' });
    await page.keyboard.press('Escape'); await page.click('#r-pop'); await page.waitForTimeout(200);
    await page.screenshot({ path: 'shots/41-' + vp.width + '.png' });
    console.log('errors:', errors.length ? errors.join('\n') : 'none');
    await browser.close();
  }
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
