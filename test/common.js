const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const lib = fs.readFileSync(path.join(__dirname, '..', 'lib', 'three.min.js'));
async function open(opts) {
  opts = opts || {};
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext(opts.device ? { ...devices[opts.device] } : { viewport: opts.viewport || { width: 1360, height: 820 }, deviceScaleFactor: 1 });
  await ctx.route('**/*', (r) => {
    const u = r.request().url();
    if (u.includes('three.min.js')) return r.fulfill({ body: lib, contentType: 'application/javascript' });
    if (u.startsWith('http://localhost')) return r.continue();
    return r.abort();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  await page.goto('http://localhost:8123/');
  await page.waitForTimeout(opts.wait || 2500);
  return { browser, ctx, page, errors };
}
module.exports = { open };
