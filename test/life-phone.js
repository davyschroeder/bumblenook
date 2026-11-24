// The new screens at phone width: challenges list, an event, the top bar with every resource, a cottage panel.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ device: 'iPhone 13' });
  const S = (f, a) => page.evaluate(f, a);
  await page.tap('#s-chal'); await page.waitForTimeout(500); await page.screenshot({ path: 'shots/h0-phone-chal.png' });
  console.log('challenge sheet fits:', await S(() => { const r = document.getElementById('m-chal').getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.top), Math.round(r.bottom), innerWidth, innerHeight].join(' '); }));
  await page.tap('[data-scn="small"]'); await page.waitForTimeout(900);
  await S(() => { const { G, UIS } = __hh; UIS.paused = true; for (const r of Object.keys(__hh.RES)) G.res[r] = 123; G.rp = 12; G.pending = 'wedding'; __hh.life.showChoice(); });
  await page.waitForTimeout(700); await page.screenshot({ path: 'shots/h1-phone-event.png' });
  console.log('event sheet fits:', await S(() => { const r = document.getElementById('m-event').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; }));
  await page.tap('#ev-b'); await page.waitForTimeout(700);
  console.log('h-scroll with every resource:', await S(() => document.documentElement.scrollWidth > innerWidth), '| top bar box', await S(() => { const r = document.getElementById('res').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)].join('x'); }), '| card:', await page.textContent('#q-n'));
  await page.screenshot({ path: 'shots/h2-phone-top.png' });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
