// How fair is the starting position? Measures, over many islands, how far the green is from water and from rock.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 500, height: 360 }, wait: 2000 });
  const out = await page.evaluate(() => {
    const { G, W, api } = __hh, N = 56, rows = [];
    for (let s = 1; s <= 40; s++) {
      api.newGame(s * 7919, 'normal');
      const c = G.center, ci = c.i + 1, cj = c.j + 1; let dw = 99, dr = 99, dn = 99, lake = 0;
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const k = j * N + i, d = Math.hypot(i - ci, j - cj); if (W.type[k] === 0 && d < dw) dw = d; if (W.type[k] === 3 && d < dr) dr = d; if (W.natK[k] === 2 && d < dn) dn = d; }
      rows.push([dw, dr, dn, api.trees.filter(t => t.state === 0 && Math.hypot(t.i - ci, t.j - cj) < 12).length, api.bushes.filter(b => Math.hypot(b.i - ci, b.j - cj) < 12).length]);
    }
    const col = (n) => rows.map(r => r[n]).sort((a, b) => a - b), f = (a) => 'min ' + a[0].toFixed(0) + ' median ' + a[20].toFixed(0) + ' max ' + a[39].toFixed(0);
    return { water: f(col(0)), rockyGround: f(col(1)) + ' | none within 14 tiles on ' + rows.filter(r => r[1] > 14).length + '/40 islands', rockNodes: f(col(2)), trees12: f(col(3)), bushes12: f(col(4)), farFromWater: rows.filter(r => r[0] > 14).length + '/40 islands with water further than 14 tiles' };
  });
  for (const k of Object.keys(out)) console.log(k.padEnd(13), out[k]);
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
