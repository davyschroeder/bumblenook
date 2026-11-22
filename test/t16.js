// Full play-through of the expanded game: research, upgrades, seasons, events, exploring, story.
const { open } = require('./common');
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 1200, height: 760 } });
  await page.click('#s-new'); await page.waitForTimeout(500);
  const out = await page.evaluate(() => {
    const { G, W, BT, api, UIS, LEVELS, ACH, TECHS, STORY, SEASONS } = __hh; UIS.paused = true; G.tut = 6;
    document.getElementById('modal').hidden = true;
    const N = 56, log = []; let lastLevel = 0, lastQuest = 0, lastSeason = 0, lastStory = 0, hungry = 0, steps = 0, newsSeen = new Set(); const seenAch = {};
    function spot(type, cx, cz, minD) { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 2; j < N - 4; j++) for (let i = 2; i < N - 4; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - cx, j + s / 2 - 28 - cz); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; }
    function build(type, near, minD) { const d = BT[type]; if (api.lock(type)) return false; for (const r of Object.keys(d.cost)) if (G.res[r] < d.cost[r]) return false; const n = near || G.center, p = spot(type, n.cx !== undefined ? n.cx : n.x, n.cz !== undefined ? n.cz : n.z, minD === undefined ? 3.4 : minD); if (!p) { if (!log.includes('NO SPOT ' + type)) log.push('NO SPOT ' + type); return false; } for (const r of Object.keys(d.cost)) G.res[r] -= d.cost[r]; api.placeBuilding(type, p[0], p[1], 0); return true; }
    const count = (t) => G.buildings.filter(b => b.type === t).length;
    const byD = (arr) => arr.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz));
    const tree = byD(api.trees.filter(t => t.state === 0))[8], bush = byD(api.bushes)[2], rock = byD(api.rocks)[1];
    const stamp = () => 'd' + G.day + ' ' + SEASONS[G.season].slice(0, 3);
    build('lumber', tree, 1.5); build('forager', bush, 1.5);
    const want = [['house', 3], ['quarry', 1, rock, 1.5], ['well', 1], ['farm', 1], ['bakery', 1], ['lantern', 3], ['house', 5], ['fisher', 1, null, 0], ['apiary', 1], ['flowers', 4], ['house', 7], ['market', 1], ['academy', 1], ['tavern', 1], ['pasture', 1], ['weaver', 1], ['house', 9], ['mine', 1, rock, 1.5], ['brickworks', 1], ['orchard', 1], ['windmill', 1], ['ciderpress', 1], ['school', 1], ['farm', 2], ['watchtower', 1], ['greenhouse', 1], ['house', 11], ['bathhouse', 1], ['pond', 1], ['harbour', 1, null, 0], ['belltower', 1], ['townhall', 1], ['bandstand', 1], ['house', 13], ['lighthouse', 1, null, 0], ['gazebo', 1]];
    const techOrder = ['mining', 'masonry', 'forestry', 'orchards', 'carpentry', 'watch', 'rotation', 'cartography', 'glass', 'springs', 'civics', 'barrows', 'beelore', 'navigation'];
    for (let step = 0; step < 420 && !(G.won && G.level >= 4 && G.story >= STORY.length); step++) {
      steps = step;
      for (const b of G.buildings) while (b.done && b.def.job && b.workers.length < b.def.slots + (b.up && __hh.UPGRADES[b.type].slots || 0) && G.villagers.filter(v => !v.job).length > 2) if (!api.assignWorker(b)) break;
      for (const [t, n, near, minD] of want) { if (count(t) < n) { build(t, near || (t === 'flowers' ? G.buildings.find(b => b.type === 'apiary') : null), t === 'flowers' ? 1.5 : minD); break; } }
      for (const id of techOrder) { if (!G.tech[id]) { if (api.research(id)) log.push(stamp() + ' research ' + id); break; } }
      for (const b of G.buildings) if (!api.upgradeBlock(b) && G.stats.upgrades < 6 && (count('townhall') || G.res.brick > 42)) { api.upgrade(b); log.push(stamp() + ' upgrade ' + b.type); break; }
      for (const s of W.sites) if (!s.found && !s.busy && G.level >= 1) { api.explore(s); break; }
      for (const m of G.missions.slice()) if (m.res !== 'brick' && G.res[m.res] >= m.n + (m.res === 'food' ? 60 : m.res === 'stone' || m.res === 'wood' ? 60 : 0)) api.deliver(m);
      for (const c of __hh.CIVICS) if (!G.civic[c.id] && G.res.coins > c.cost + 150 && count('townhall')) { api.civic(c.id); log.push(stamp() + ' civic ' + c.id); break; }
      if (G.stats.fest < 3 && G.res.food > 110 && G.res.honey >= 5) api.festival();
      if (G.storyOn && G.story === 0 && G.res.wood > 5) { const t0 = api.trees.filter(t => t.state === 0)[20]; for (let q = 0; q < 2; q++) { const i = t0.i + ((Math.random() * 7) | 0) - 3, j = t0.j + ((Math.random() * 7) | 0) - 3; if (!api.canPlace('tree', i, j)) api.placeBuilding('tree', i, j, 0); } }
      const mk = G.buildings.find(b => b.type === 'market' && b.done && b.workers.length);
      if (mk) { while (G.res.honey > 14) { G.res.honey--; G.res.coins += 3; G.stats.coins += 3; } while (G.res.cloth > 6) { G.res.cloth--; G.res.coins += 6; G.stats.coins += 6; } while (G.res.cider > 5) { G.res.cider--; G.res.coins += 7; G.stats.coins += 7; } while (G.res.wood > 400) { G.res.wood -= 10; G.res.coins += 5; G.stats.coins += 5; } }
      for (let t = 0; t < 42.5; t += 0.05) { api.stepSim(0.05); if (G.hungry) hungry++; }
      if (G.season !== lastSeason) { lastSeason = G.season; log.push(stamp() + ' SEASON pop ' + G.villagers.length + ' food ' + G.res.food + ' happy ' + Math.round(G.happy)); }
      if (G.level !== lastLevel) { lastLevel = G.level; log.push(stamp() + ' LEVEL ' + LEVELS[G.level].name); }
      if (G.story !== lastStory) { lastStory = G.story; log.push(stamp() + ' story chapter ' + G.story + ' done'); }
      for (const a of ACH) if (G.ach[a.id] && !seenAch[a.id]) { seenAch[a.id] = 1; log.push(stamp() + ' badge ' + a.name); }
      for (const n of G.news) if (!newsSeen.has(n)) { newsSeen.add(n); if (/storm|fox|bard|tide|traveller|swarm|perfect night/i.test(n)) log.push('   news: ' + n); }
    }
    log.push('END after ' + steps + ' steps, ' + stamp() + ' level ' + LEVELS[G.level].name + ' goals ' + G.quest + ' won ' + G.won + ' story ' + G.story + '/' + STORY.length + ' hungry-steps ' + hungry);
    log.push('res ' + JSON.stringify(G.res) + ' rp ' + G.rp + ' tech ' + Object.keys(G.tech).length + '/' + TECHS.length + ' fish ' + Object.keys(G.fish).length + ' sites ' + W.sites.filter(s => s.found).length + '/' + W.sites.length);
    log.push('stats ' + JSON.stringify(G.stats));
    log.push('jobs ' + JSON.stringify(G.villagers.reduce((m, v) => { const j = v.job ? v.job.def.job : 'free'; m[j] = (m[j] || 0) + 1; return m; }, {})));
    log.push('warn ' + G.buildings.filter(b => b.warn && b.workers.length).map(b => b.type + ': ' + b.warn).join(' | '));
    const c = G.center; __hh.CAM.gx = __hh.CAM.tx = c.cx; __hh.CAM.gz = __hh.CAM.tz = c.cz; __hh.CAM.gd = __hh.CAM.dist = 36; G.time = 0.3; G.rain = 0; UIS.paused = false;
    return log;
  });
  console.log(out.join('\n'));
  await page.evaluate(() => { document.getElementById('modal').hidden = true; });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'shots/a1-full-village.png' });
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
