// The website copy (site/): must run without anything from another site.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'site');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.woff2': 'font/woff2', '.txt': 'text/plain' };
(async () => {
  const srv = http.createServer((q, s) => {
    const f = path.join(root, q.url.split('?')[0] === '/' ? 'index.html' : q.url.split('?')[0]);
    fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(d); } });
  }).listen(8124);
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const outside = [], failed = [], errors = [];
  await page.route('**/*', (r) => { const u = r.request().url(); if (u.startsWith('http://localhost:8124/') || u.startsWith('data:')) return r.continue(); outside.push(u); return r.abort(); });
  page.on('requestfailed', (r) => failed.push(r.url()));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
  page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8124/'); await page.waitForTimeout(3000);
  console.log('title:', await page.title(), '| three', await page.evaluate(() => typeof THREE !== 'undefined' && THREE.REVISION));
  console.log('fonts:', await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].map((f) => f.family + ' ' + f.status).join(', '); }));
  await page.click('#s-new'); await page.waitForTimeout(1500);
  console.log('playing:', await page.evaluate(() => __hh.G.started), 'villagers', await page.evaluate(() => __hh.G.villagers.length));
  console.log('requests to other sites:', outside.length ? outside.join(' ') : 'none', '| failed:', failed.length ? failed.join(' ') : 'none', '| errors:', errors.length ? errors.join(' | ') : 'none');
  await browser.close(); srv.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
