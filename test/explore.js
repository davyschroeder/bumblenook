// Sending an explorer through the interface: someone must actually walk to the site and explore it.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 1280, height: 800 } });
  const S = (f, a) => page.evaluate(f, a);
  await page.click('#s-new'); await page.waitForTimeout(800); await page.click('#coach-skip'); await page.waitForTimeout(300);
  const info = await S(() => { const { G, W, CAM, UIS } = __hh; UIS.paused = true; const c = G.center;
    for (const v of G.villagers) v.job = v.job || { def: { job: 'lumber' }, workers: [], fake: true };   // nobody is free
    const s = W.sites.filter((s) => !s.found).sort((a, b) => Math.hypot(a.x - c.cx, a.z - c.cz) - Math.hypot(b.x - c.cx, b.z - c.cz))[0];
    CAM.gx = CAM.tx = s.x; CAM.gz = CAM.tz = s.z; CAM.gd = CAM.dist = 14; window.__site = s; return { kind: s.kind, d: Math.round(Math.hypot(s.x - c.cx, s.z - c.cz)), sites: W.sites.length }; });
  await page.waitForTimeout(900);
  const p = await S(() => { const s = window.__site, q = __hh.api.screenOf(s.x, s.y + 0.3, s.z); return [q.x, q.y]; });
  await page.mouse.click(p[0], p[1]); await page.waitForTimeout(500);
  console.log('site', JSON.stringify(info), '| panel:', await page.textContent('#pn-title').catch(() => 'NONE'), '| button:', await S(() => { const b = document.getElementById('s-go'); return b ? b.textContent + (b.disabled ? ' (disabled)' : '') : 'NO BUTTON'; }));
  await page.click('#s-go').catch((e) => console.log('click failed', e.message.slice(0, 80)));
  const log = await S(() => { const { G, api, UIS } = __hh; const s = window.__site; for (const v of G.villagers) if (v.job && v.job.fake) v.job = null; UIS.paused = false; const out = []; let last = '';
    for (let t = 0; t < 240 && !s.found; t += 0.05) { api.stepSim(0.05); const v = s.busy; const st = v ? v.name + ': ' + v.say + ' [' + (v.plan[0] ? v.plan[0].t : '-') + ']' : 'nobody'; if (st !== last) { out.push(Math.round(t) + 's ' + st); last = st; } }
    return { found: s.found, out: out.slice(0, 14), explored: G.stats.explored, q: G.q.discover }; });
  console.log(JSON.stringify(log, null, 1));
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
