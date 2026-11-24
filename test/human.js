// A play-tester that behaves like a person: one action every few seconds, saves up for things,
// fast-forwards when there is nothing to do. Reports when each milestone lands in real play minutes.
const { open } = require('./common');
const CANDS = JSON.parse(process.env.CANDS || '[{"name":"current"}]');
const MAXMIN = +process.env.MAXMIN || 200;
(async () => {
  const { browser, page, errors } = await open({ viewport: { width: 600, height: 400 }, wait: 2000 });
  for (const cand of CANDS) {
    const out = await page.evaluate(({ cand, MAXMIN }) => {
      const { G, W, BT, api, UIS, LEVELS, TECHS, STORY, PACE, QUESTS, UPGRADES, CIVICS, TRADES, TRACKS } = __hh; const lqt = { grow: 0, prosper: 0, discover: 0 };
      if (!window.__base) window.__base = JSON.stringify({ pace: PACE, levels: LEVELS.slice(1).map(l => l.need), tech: TECHS.map(t => t.cost) });
      const base = JSON.parse(window.__base); Object.assign(PACE, base.pace, cand.pace || {});
      (cand.levels || base.levels).forEach((need, n) => { LEVELS[n + 1].need = need; });
      TECHS.forEach((t, n) => { t.cost = Math.round(base.tech[n] * (cand.techK || 1)); t.coins = Math.round(t.cost * 0.8); });
      api.newGame(cand.seed || 4242, 'normal'); G.started = true; G.tut = 6; UIS.paused = true; document.getElementById('modal').hidden = true;
      const N = 56, THINK = 8, marks = {}, events = [], gaps = [];
      let slow = 0; const marks1 = {};
      let real = 0, speed = 1, idleStreak = 0, idle = 0, thinks = 0, lastEv = 0, lq = 0, ll = 0, lr = 0, ls = 0, lpop = 4, lu = 0, lc = 0, hungry = 0; const seen = {};
      const mins = () => real / 60;
      const ev = (name, major) => { gaps.push([real - lastEv, name, mins()]); lastEv = real; if (major) events.push(mins().toFixed(1) + 'm ' + name); };
      const count = (t) => G.buildings.filter(b => b.type === t).length, done = (t) => G.buildings.filter(b => b.type === t && b.done).length;
      const afford = (c) => Object.keys(c).every(r => G.res[r] >= c[r]);
      const byD = (arr) => arr.slice().sort((a, b) => Math.hypot(a.x - G.center.cx, a.z - G.center.cz) - Math.hypot(b.x - G.center.cx, b.z - G.center.cz));
      const tree = byD(api.trees.filter(t => t.state === 0))[8], bush = byD(api.bushes)[2], rock = byD(api.rocks)[1];
      function spot(type, cx, cz, minD) { const s = BT[type].size; let best = null, bd = 1e9; for (let j = 2; j < N - 4; j++) for (let i = 2; i < N - 4; i++) { if (api.canPlace(type, i, j)) continue; const d = Math.hypot(i + s / 2 - 28 - cx, j + s / 2 - 28 - cz); if (d < minD) continue; if (d < bd && !api.blocks(type, i, j, 0)) { bd = d; best = [i, j]; } } return best; }
      function build(type) {
        const d = BT[type]; if (api.lock(type) || !afford(d.cost)) return false;
        const near = type === 'lumber' ? tree : type === 'forager' ? bush : type === 'quarry' || type === 'mine' ? rock : type === 'flowers' ? G.buildings.find(b => b.type === 'apiary') || G.center : G.center;
        const p = spot(type, near.cx !== undefined ? near.cx : near.x, near.cz !== undefined ? near.cz : near.z, near === G.center ? (d.nearWater ? 0 : 3.4) : 1.5 + count(type) * 6);
        if (!p) return false;
        for (const r of Object.keys(d.cost)) G.res[r] -= d.cost[r]; api.placeBuilding(type, p[0], p[1], 0); return true;
      }
      const want = [['lumber', 1], ['forager', 1], ['house', 2], ['quarry', 1], ['well', 1], ['house', 3], ['farm', 1], ['bakery', 1], ['fisher', 1], ['lantern', 3], ['apiary', 1], ['flowers', 3], ['house', 5], ['store', 1], ['pond', 1], ['market', 1], ['academy', 1], ['tavern', 1], ['house', 7], ['pasture', 1], ['weaver', 1], ['windmill', 1], ['school', 1], ['bench', 3], ['house', 9], ['mine', 1], ['brickworks', 1], ['orchard', 1], ['ciderpress', 1], ['watchtower', 1], ['farm', 2], ['greenhouse', 1], ['bathhouse', 1], ['house', 11], ['harbour', 1], ['belltower', 1], ['townhall', 1], ['bandstand', 1], ['house', 12], ['lighthouse', 1], ['lantern', 6], ['fountain', 1], ['shipyard', 1], ['cathedral', 1], ['statue', 1], ['gazebo', 1], ['store', 2], ['greathive', 1]];
      const techOrder = ['mining', 'masonry', 'forestry', 'guildfarm', 'orchards', 'carpentry', 'woodlore', 'watch', 'rotation', 'cartography', 'glass', 'springs', 'civics', 'barrows', 'artisans', 'beelore', 'navigation'];
      function act() {
        const pop = G.villagers.length, free = G.villagers.filter(v => !v.job).length, beds = G.buildings.reduce((n, b) => n + (b.done && b.def.beds ? b.def.beds + (b.up ? 2 : 0) : 0), 0);
        const sites = G.buildings.filter(b => !b.done).length;
        if (thinks % 3 === 0) for (const m of G.missions) if (G.res[m.res] >= m.n + (['food', 'wood', 'stone'].includes(m.res) ? 50 : m.res === 'brick' ? 40 : 2)) { api.deliver(m); return 'deliver'; }
        if (free > (sites ? 1 : 0) + (pop > 12 ? 1 : 0)) for (const b of G.buildings) if (b.done && b.def.job && b.workers.length < b.def.slots + (b.up && UPGRADES[b.type].slots || 0)) { if (api.assignWorker(b)) return 'assign'; }
        if (G.buildings.filter(b => b.type === 'house' && !b.done).length === 0 && beds - pop <= 1 && pop < 40 && build('house')) return 'house';
        if (G.hungry || G.res.food < pop * 4) { for (const t of ['forager', 'fisher', 'farm', 'bakery', 'orchard', 'greenhouse']) if (count(t) < (t === 'forager' || t === 'farm' ? 2 : 1) && !G.buildings.some(b => !b.done && ['forager', 'fisher', 'farm', 'bakery'].includes(b.type)) && build(t)) return 'food ' + t; }
        const mk = G.buildings.find(b => b.type === 'market' && b.done && b.workers.length);
        if (mk && thinks % 6 === 0) { for (const [r, keep, n, m] of [['honey', count('cathedral') ? 130 : 8, 1, 3], ['cloth', 4, 1, 6], ['cider', 4, 1, 7], ['wool', 20, 4, 5], ['wood', api.capOf('wood') * 0.75, 10, 5], ['stone', api.capOf('stone') * 0.75, 10, 7], ['food', api.capOf('food') * 0.8, 10, 6], ['grain', api.capOf('grain') * 0.7, 5, 4]]) if (G.res[r] > keep + n) { let k = 0; while (G.res[r] > keep + n && k++ < 6) { G.res[r] -= n; G.res.coins += m; G.stats.coins += m; } } }
        for (const id of techOrder) { if (!G.tech[id]) { if (count('academy') && api.research(id)) return 'research ' + id; break; } }
        for (const s of W.sites) if (!s.found && !s.busy && free > 1 && G.quest >= 6) { if (api.explore(s)) return 'explore'; }
        if (G.level >= 2 && G.stats.fest < 3 && G.res.food > pop * 6 + 30 && G.res.honey >= 5 && api.festival()) return 'festival';
        if (G.storyOn && G.story === 0 && G.stats.planted < 5 + (G.storyBase || 0)) { const t0 = api.trees.filter(t => t.state === 0)[20]; for (let q = 0; q < 12; q++) { const i = t0.i + ((Math.random() * 7) | 0) - 3, j = t0.j + ((Math.random() * 7) | 0) - 3; if (!api.canPlace('tree', i, j)) { api.placeBuilding('tree', i, j, 0); return 'plant'; } } }
        for (const b of G.buildings) if (!api.upgradeBlock(b) && G.res.brick > 60 && G.stats.upgrades < 7 && !G.won) { api.upgrade(b); return 'upgrade ' + b.type; }
        for (const c of CIVICS) if (count('townhall') && !G.civic[c.id] && G.res.coins > c.cost + 100) { api.civic(c.id); return 'civic'; }
        let hold = null;                                   // save up for the next thing on the list, but keep building what does not eat into it
        for (const [t, n] of want) {
          if (count(t) >= n || api.lock(t)) continue;
          const c = BT[t].cost;
          if (!hold) { if (afford(c)) { if (build(t)) return 'build ' + t; continue; } hold = c; continue; }
          if (Object.keys(c).every(r => G.res[r] - (hold[r] || 0) >= c[r]) && build(t)) return 'build ' + t;
        }
        return null;
      }
      const stageIdle = [0, 0, 0, 0, 0], stageThink = [0, 0, 0, 0, 0];
      while (real < MAXMIN * 60 && !G.finale) {
        const asleep = G.villagers.every(v => v.state === 'sleep');
        for (let t = 0; t < THINK; t += 0.1) { api.stepSim(0.1); if (G.hungry) hungry += 0.1; }
        real += THINK / (speed * (asleep ? 4 : 1)); slow += THINK / (asleep ? 4 : 1);
        if (G.villagers.length > lpop) { lpop = G.villagers.length; if (marks.settler === undefined) { marks.settler = mins(); ev('first settler (pop ' + lpop + ', beds ' + G.buildings.reduce((n, b) => n + (b.done && b.def.beds ? b.def.beds : 0), 0) + ', houses ' + count('house') + ')', 1); } else ev('settler'); if (lpop === 10 && marks.pop10 === undefined) marks.pop10 = mins(); }
        for (const t of TRACKS) while (lqt[t.id] < G.q[t.id]) { ev(t.name.toUpperCase().padEnd(8) + ' ' + t.goals[lqt[t.id]].text, 1); lqt[t.id]++; }
        if (G.won && marks1.Lighthouse === undefined) { marks1.Lighthouse = +(slow / 60).toFixed(0); marks.Lighthouse = mins(); }
        if (count('shipyard') && G.exp.state === 'home' && G.res.food > 260 && Object.keys(G.treasure).length < 6) __hh.startExpedition();
        // a player with a full purse buys the bricks the next project is short of
        if (count('market') && G.res.coins > 1500 && G.res.brick < 130 && G.res.brick < api.capOf('brick') - 5 && thinks % 4 === 0) { G.res.coins -= 18; G.res.brick += 5; }
        if (G.level !== ll) { ll = G.level; marks[LEVELS[ll].name] = mins(); marks1[LEVELS[ll].name] = +(slow / 60).toFixed(0); ev('LEVEL ' + LEVELS[ll].name, 1); }
        if (G.stats.research !== lr) { lr = G.stats.research; ev('research #' + lr, lr === 1); }
        if (G.story !== ls) { ls = G.story; ev('story ' + ls, 1); }
        if (G.stats.upgrades !== lu) { lu = G.stats.upgrades; ev('upgrade'); } if (G.stats.civic !== lc) { lc = G.stats.civic; ev('civic'); }
        for (const b of G.buildings) if (b.done && !seen[b.type]) { seen[b.type] = 1; ev('first ' + b.type); }
        if (G.pending) __hh.life.resolveChoice(G.res.coins > 300 ? 0 : 1);
        if (asleep) continue;
        const a = act(); thinks++; stageThink[G.level]++;
        if (!a) { idle++; stageIdle[G.level]++; idleStreak++; } else idleStreak = 0;
        speed = idleStreak >= 3 ? 3 : 1;
      }
      marks.end = mins(); marks1.end = +(slow / 60).toFixed(0);
      const evGaps1 = gaps.length;
      gaps.sort((a, b) => b[0] - a[0]);
      const early = gaps.filter(g => g[2] < (marks.Village || 1e9)).slice(0, 2), late = gaps.slice(0, 3);
      return { marks1, name: cand.name, marks: Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, +v.toFixed(1)])), finished: !!G.finale, treasures: Object.keys(G.treasure).length, quest: G.quest, level: G.level, day: G.day, pop: G.villagers.length,
        idle: stageThink.map((n, q) => n ? Math.round(stageIdle[q] / n * 100) + '%' : '-').join(' '), hungryMin: +(hungry / 60).toFixed(1),
        gapEarly: early.map(g => (g[0] / 60).toFixed(1) + 'm before "' + g[1] + '"').join('; '), gapMax: late.map(g => (g[0] / 60).toFixed(1) + 'm before "' + g[1] + '" @' + g[2].toFixed(0)).join('; '), coins: G.res.coins, left: TRACKS.map(t => t.goals[G.q[t.id]] ? t.name + ': ' + t.goals[G.q[t.id]].text + ' ' + JSON.stringify(t.goals[G.q[t.id]].prog ? t.goals[G.q[t.id]].prog() : '') : '').filter(Boolean).join(' | ') + ' || res ' + JSON.stringify(G.res) + ' caps ' + ['wood', 'stone', 'brick', 'honey'].map(r => r + ':' + api.capOf(r)).join(',') + ' locks ' + ['cathedral', 'shipyard', 'greathive'].map(t => t + ':' + (count(t) ? 'built' : G.buildings.some(b => b.type === t) ? 'site' : api.lock(t) || 'free, cost ' + JSON.stringify(BT[t].cost))).join(', '), events: events.slice(0, cand.verbose ? 80 : 0) };
    }, { cand, MAXMIN });
    console.log('\n== ' + out.name + '\n   at 1x, no fast-forward (minutes):', JSON.stringify(out.marks1), '\n   fast-forwarding while waiting   :', JSON.stringify(out.marks), '|', '| left:', out.left, '| finished', out.finished, 'goals', out.quest + '/37', 'treasures', out.treasures, 'lvl', out.level, 'day', out.day, 'pop', out.pop, '| idle by level', out.idle, '| hungry', out.hungryMin + 'm', '| coins', out.coins);
    console.log('   early gaps:', out.gapEarly, '\n   longest gaps:', out.gapMax);
    if (out.events.length) console.log(out.events.join('\n'));
  }
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('TEST FAILED', e); process.exit(1); });
