// A spot chosen while resources are short becomes buildable by itself once they have come in (touch: the Place button).
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ device: 'iPhone 13' });
  const S = (f, a) => page.evaluate(f, a);
  page.setDefaultTimeout(60000);
  await page.tap('#s-new'); await page.waitForTimeout(900); await page.tap('#coach-skip'); await page.waitForTimeout(400);
  await S(() => { const { G } = __hh; G.res.wood = 5; G.tut = 6; });
  await page.tap('.item[data-type="house"]'); await page.waitForTimeout(400);
  const pt = await S(() => { const { G, api } = __hh; let best = null, bd = 1e9; for (let j = 4; j < 50; j++) for (let i = 4; i < 50; i++) { if (api.canPlace('house', i, j) || api.blocks('house', i, j, 0)) continue; const s = api.screenOf(i + 1 - 28, 0.3, j + 1 - 28), e = document.elementFromPoint(s.x, s.y); const d = Math.hypot(i + 1 - 28 - G.center.cx, j + 1 - 28 - G.center.cz); if (e && e.id === 'c' && d > 3.5 && d < bd) { bd = d; best = [s.x, s.y]; } } return best; });
  await page.touchscreen.tap(pt[0], pt[1]); await page.waitForTimeout(900);
  const before = await S(() => ({ msg: document.getElementById('p-msg').textContent, disabled: document.getElementById('p-ok').disabled }));
  await S(() => { __hh.G.res.wood = 60; }); await page.waitForTimeout(1500);
  const after = await S(() => ({ msg: document.getElementById('p-msg').textContent, disabled: document.getElementById('p-ok').disabled }));
  await page.tap('#p-ok'); await page.waitForTimeout(600);
  console.log('short of wood:', JSON.stringify(before), '| once the wood is in:', JSON.stringify(after), '| built:', await S(() => __hh.G.buildings.map(b => b.type).join(',')));
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e.message.slice(0, 300)); process.exit(1); });
