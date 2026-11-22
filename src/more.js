// ---------- more: three goal tracks, village ledger, guild choices, winter fun, village life, grand projects ----------

// ----- goals: three tracks run side by side, so there is always a choice of what to work on -----
const TRACKS = [
  { id: 'grow', name: 'Grow', goals: [
    { text: 'Build a Lumber Hut', hint: 'Open the Materials tab at the bottom.', prog: () => [countDone('lumber'), 1], reward: { food: 15 } },
    { text: 'Put 2 woodcutters to work', hint: 'Tap the hut and use the plus button.', prog: () => [jobCount('lumber'), 2], reward: { wood: 15 } },
    { text: 'Build a Forager\'s Hut near the berries', hint: 'Food runs out if nobody gathers any.', prog: () => [countDone('forager'), 1], reward: { wood: 10 } },
    { text: 'Build 2 Cottages', hint: 'Each cottage adds 3 beds.', prog: () => [countDone('house'), 2], reward: { stone: 15 } },
    { text: 'Grow the camp into a Hamlet', hint: 'Build cottages and keep everyone fed. A Hamlet unlocks farming, fishing and bees.', prog: () => [Math.min(G.villagers.length, LEVELS[1].need[0][1]), LEVELS[1].need[0][1]], reward: { wood: 20 } },
    { text: 'Build a Quarry Hut', hint: 'Place it close to grey rocks.', prog: () => [countDone('quarry'), 1], reward: { stone: 20 } },
    { text: 'Build a Farm and a Bakery', hint: 'Grain from the field becomes bread.', prog: () => [Math.min(1, countDone('farm')) + Math.min(1, countDone('bakery')), 2], reward: { food: 20 } },
    { text: 'Place a Well and 3 Lanterns', hint: 'A charming village makes villagers happy.', prog: () => [Math.min(1, countDone('well')) + Math.min(3, countDone('lantern')), 4], reward: { wood: 20 } },
    { text: 'Grow the Hamlet into a Village', hint: 'More villagers and a happy mood unlock the market, tavern and more.', prog: () => [Math.min(G.level, 2), 2], reward: { stone: 20 } },
    { text: 'Open a Tavern and hire an innkeeper', hint: 'In the evening villagers gather there.', prog: () => [jobCount('innkeeper'), 1], reward: { coins: 15 } },
    { text: 'Build a Windmill', hint: 'Every batch of bread will feed more villagers.', prog: () => [countDone('windmill'), 1], reward: { coins: 20 } },
    { text: 'Grow the Village into a Town', hint: 'Keep growing and earn coins by trading.', prog: () => [Math.min(G.level, 3), 3], reward: { stone: 40 } },
    { text: 'Upgrade a building', hint: 'Research Masonry and Carpentry, make bricks, then tap a Cottage or Lumber Hut.', prog: () => [Math.min(1, G.stats.upgrades), 1], reward: { coins: 30 } },
    { text: 'Raise happiness to 85%', hint: 'Tap the heart to see what helps.', prog: () => [Math.min(85, Math.round(G.happy)), 85], reward: { coins: 30 } },
    { text: 'Grow the Town into a Harbour Town', hint: 'Build a Harbour and keep the settlers coming.', prog: () => [Math.min(G.level, 4), 4], reward: { coins: 40 } },
    { text: 'Build the Lighthouse', hint: 'The pride of the island, right by the water.', prog: () => [countDone('lighthouse'), 1], reward: { coins: 50 } },
    { text: 'Build the Cathedral', hint: 'A grand project for a grand town. It takes a mountain of stone and bricks.', prog: () => [countDone('cathedral'), 1], reward: { coins: 100 } },
    { text: 'Raise the Great Hive', hint: 'The crowning wonder of Bumblenook, paid for in honey.', prog: () => [countDone('greathive'), 1], reward: { coins: 200 } },
  ] },
  { id: 'prosper', name: 'Prosper', goals: [
    { text: 'Stock 60 food', hint: 'A full pantry keeps settlers coming.', prog: () => [Math.min(60, Math.floor(G.res.food)), 60], reward: { wood: 10 } },
    { text: 'Fill a villager\'s request', hint: 'Requests start once the camp is a Hamlet. Tap this card to see them.', prog: () => [Math.min(1, G.stats.missions), 1], reward: { coins: 10 } },
    { text: 'Build an Apiary and collect 5 honey', hint: 'Flower beds nearby double the harvest.', prog: () => [Math.min(5, G.stats.honey), 5], reward: { coins: 10 } },
    { text: 'Build a Market and earn 60 coins', hint: 'Tap the market to trade. Honey sells well.', prog: () => [Math.min(60, G.stats.coins), 60], reward: { stone: 30 } },
    { text: 'Keep sheep and weave 5 cloth', hint: 'Build a Sheep Pasture and a Weaver in the Materials tab.', prog: () => [Math.min(5, G.stats.cloth), 5], reward: { coins: 20 } },
    { text: 'Hold a festival', hint: 'Tap this card. A festival costs 30 food and 5 honey.', prog: () => [Math.min(1, G.stats.fest), 1], reward: { coins: 20 } },
    { text: 'Build a Harbour and fill 2 ship orders', hint: 'The ship calls each morning once a dockhand works there.', prog: () => [Math.min(2, G.stats.ship), 2], reward: { coins: 40 } },
    { text: 'Earn 600 coins in total', hint: 'Trade surplus at the Market and keep filling requests.', prog: () => [Math.min(600, G.stats.coins), 600], reward: { brick: 20 } },
    { text: 'Pay for 3 town improvements', hint: 'Tap the Town Hall to see what the council can do.', prog: () => [Math.min(3, G.stats.civic), 3], reward: { coins: 50 } },
    { text: 'Fill 25 requests', hint: 'A village that helps each other.', prog: () => [Math.min(25, G.stats.missions), 25], reward: { coins: 60 } },
  ] },
  { id: 'discover', name: 'Discover', goals: [
    { text: 'Send an explorer to an old site', hint: 'Look for standing stones, a wreck or a shrine on the island and tap it.', prog: () => [Math.min(1, G.stats.explored), 1], reward: { coins: 15 } },
    { text: 'Catch 3 kinds of fish', hint: 'A Fishing Hut needs a Hamlet. Every catch is noted in the almanac.', prog: () => [Math.min(3, Object.keys(G.fish).length), 3], reward: { food: 20 } },
    { text: 'Build an Academy and finish a research', hint: 'Scholars gather insight. Tap the Academy to spend it.', prog: () => [Math.min(1, G.stats.research), 1], reward: { coins: 20 } },
    { text: 'Explore every old site', hint: 'Cartography marks the ones you have not found.', prog: () => [W.sites ? W.sites.filter((q) => q.found).length : 0, W.sites && W.sites.length ? W.sites.length : 4], reward: { coins: 25 } },
    { text: 'Choose a guild at the Academy', hint: 'Some research comes in pairs: you can only pick one of the two.', prog: () => [TECHS.some((t) => t.alt && G.tech[t.id]) ? 1 : 0, 1], reward: { coins: 20 } },
    { text: 'Finish 8 researches', hint: 'More scholars means faster insight.', prog: () => [Math.min(8, G.stats.research), 8], reward: { coins: 30 } },
    { text: 'Answer 3 letters', hint: 'Letters arrive as the village grows. Tap this card to read them.', prog: () => [Math.min(3, G.story), 3], reward: { coins: 30 } },
    { text: 'Build a Shipyard and finish an expedition', hint: 'After the Lighthouse, ships can sail far beyond the horizon.', prog: () => [Math.min(1, G.stats.exped), 1], reward: { coins: 50 } },
    { text: 'Bring home 4 treasures', hint: 'Every expedition returns with something from afar.', prog: () => [Math.min(4, Object.keys(G.treasure).length), 4], reward: { coins: 100 } },
  ] },
];
const QUESTS = TRACKS.reduce((a, t) => a.concat(t.goals), []);
const goalOf = (t) => t.goals[G.q[t.id]] || null;
function checkQuest() {
  for (const t of TRACKS) {
    const q = goalOf(t);
    if (!q) continue;
    const p = q.prog();
    if (p[0] < p[1]) continue;
    for (const r of Object.keys(q.reward)) G.res[r] += q.reward[r];
    G.q[t.id]++; G.quest++; sfx('quest');
    toast('Goal reached: ' + q.text + '. Reward: ' + Object.keys(q.reward).map((r) => q.reward[r] + ' ' + RES[r].toLowerCase()).join(', '), 'quest');
    uiDirty();
    return;                          // one at a time, so each gets its moment
  }
}

// ----- ledger: what comes in and goes out, per day -----
function trackRes(o) {
  return new Proxy(o, { set(t, k, v) { const d = v - (t[k] || 0); if (G.flow && d) { const f = d > 0 ? G.flow.in : G.flow.out; f[k] = (f[k] || 0) + Math.abs(d); } t[k] = v; return true; } });
}
function resetFlow() { G.flow = { in: {}, out: {} }; G.flowY = null; }
function openLedgerPanel() {
  select(null);
  openPanel('ledger', null, 'Village ledger', '', '<div id="lg-rows"></div><p class="note" id="lg-food"></p><p class="note">Yesterday shows a whole day. Tap a workplace to change who works where.</p>', () => {
    $('pn-sub').textContent = SEASONS[G.season] + ', day ' + G.day;
    const f = (n) => Math.round(n || 0), Y = G.flowY, T = G.flow;
    let h = '<div class="lg head"><span class="grow"></span><span>In stock</span><span>Yesterday</span><span>Today</span></div>';
    for (const r of Object.keys(RES)) {
      if ($('r-' + r).hidden) continue;
      const cap = capOf(r);
      h += '<div class="lg"><span class="grow">' + ic(r) + RES[r] + '</span><span>' + Math.floor(G.res[r]) + (cap < 1e9 ? '<small>/' + cap + '</small>' : '') + '</span>' +
        '<span>' + (Y ? '<b class="pos">+' + f(Y.in[r]) + '</b> <b class="neg">−' + f(Y.out[r]) + '</b>' : '<small>no full day yet</small>') + '</span>' +
        '<span><b class="pos">+' + f(T.in[r]) + '</b> <b class="neg">−' + f(T.out[r]) + '</b></span></div>';
    }
    setH('lg-rows', h);
    const eat = G.villagers.length * DAY_LEN / 26;
    $('lg-food').textContent = G.mode === 'sandbox' ? 'In the sandbox nobody goes hungry.' : 'The village eats about ' + Math.round(eat) + ' food a day. The pantry lasts roughly ' + (G.res.food / Math.max(1, eat)).toFixed(1) + ' days without new food.';
  });
}

// ----- guilds: research that comes in pairs, pick one -----
TECHS.push(
  { id: 'guildtrade', alt: 'guildfarm', name: 'Merchants\' Guild', cost: 38, desc: 'Market trades and requests pay a quarter more coins.' },
  { id: 'guildfarm', alt: 'guildtrade', name: 'Farmers\' Guild', cost: 38, desc: 'Farms, orchards and greenhouses yield a quarter more.' },
  { id: 'sealore', alt: 'woodlore', name: 'Sea Lore', cost: 45, desc: 'Fishers bring 2 more food and ship orders pay a quarter more.' },
  { id: 'woodlore', alt: 'sealore', name: 'Wood Lore', cost: 45, desc: 'Trees and berries grow back half as fast again, and foragers pick 1 more.' },
  { id: 'scholars', alt: 'artisans', need: 'masonry', name: 'Scholars\' Circle', cost: 52, desc: 'Scholars gather insight a third faster.' },
  { id: 'artisans', alt: 'scholars', need: 'masonry', name: 'Artisans\' Hall', cost: 52, desc: 'Weavers, brickmakers and cider makers work a third faster.' });
for (const t of TECHS) if (t.alt) t.coins = Math.round(t.cost * 0.8);
const techSettled = (t) => !!G.tech[t.id] || !!(t.alt && G.tech[t.alt]);

// ----- winter: snowmen, a cod run and the Winter Fair -----
function mSnowman() {
  const b = new MB();
  b.sph(0.2, 0, 0.17, 0, 0xf6f9fc, [1, 0.9, 1], 1).sph(0.15, 0, 0.42, 0, 0xffffff, null, 1).sph(0.11, 0, 0.62, 0, 0xf6f9fc, null, 1);
  b.cone(0.025, 0.1, 5, 0, 0.62, 0.14, 0xf08a2a, [Math.PI / 2, 0, 0]).box(0.02, 0.02, 0.02, -0.04, 0.66, 0.1, C.dark).box(0.02, 0.02, 0.02, 0.04, 0.66, 0.1, C.dark);
  b.cyl(0.085, 0.085, 0.015, 8, 0, 0.7, 0, C.dark).cyl(0.06, 0.06, 0.1, 8, 0, 0.71, 0, C.dark).box(0.3, 0.02, 0.02, 0.2, 0.45, 0, C.woodD, [0, 0, 0.5]).box(0.3, 0.02, 0.02, -0.2, 0.45, 0, C.woodD, [0, 0, -0.5]);
  b.box(0.26, 0.04, 0.26, 0, 0.5, 0, C.red, [0, 0.4, 0]);
  return b.build().geo;
}
function addSnowman(x, z) {
  if (!W.snowmen) W.snowmen = [];
  const m = new THREE.Mesh(cachedGeo('snowman', mSnowman), MAT.main); m.castShadow = true;
  m.position.set(x, heightAt(x, z), z); m.rotation.y = Math.random() * TAU; worldGroup.add(m);
  W.snowmen.push({ x, z, m });
}
function meltSnowmen() { if (!W.snowmen) { W.snowmen = []; return; } for (const s of W.snowmen) worldGroup.remove(s.m); W.snowmen.length = 0; }
function greenSpot(rad) {            // a free, reachable tile near the green
  const c = G.center;
  for (let q = 0; q < 14; q++) {
    const i = worldToTile(c.cx + rand(-rad, rad)), j = worldToTile(c.cz + rand(-rad, rad));
    if (!inGrid(i, j)) continue;
    const k = tileIdx(i, j);
    if (W.type[k] === T_WATER || W.solid[k] || W.natK[k] || W.fence[k] || W.occ[k] || !canReach(k)) continue;
    return k;
  }
  return -1;
}
function planSnowman(v) {
  const k = greenSpot(5.5);
  if (k < 0) return false;
  const x = tileX(k % N) + rand(-0.2, 0.2), z = tileX((k / N) | 0) + rand(-0.2, 0.2);
  if (W.snowmen.some((s) => Math.hypot(s.x - x, s.z - z) < 1.5)) return false;
  v.plan.push(go(standNear(k % N, (k / N) | 0), 'Looking for good snow'), act(7, 'bend', 'Building a snowman', { face: { x, z } }), call(() => { if (G.season === 3 && W.snowmen.length < 5) { addSnowman(x, z); G.stats.snowmen++; puff(x, heightAt(x, z) + 0.3, z, 0xffffff, 6, { speed: 0.6, life: 0.5, size: 0.06 }); } }));
  return true;
}

// ----- village life: evenings at the tavern, a rest on a bench, dancing at festivals -----
const isEvening = () => G.time >= 0.615 && G.time < 0.725;
const NO_BREAK = ['innkeeper', 'guard', 'attendant'];
function leisure(v, daytime) {
  if (G.festival > 0) {
    const k = greenSpot(3.6);
    if (k >= 0) { v.plan.push(go(k, 'Heading to the festival'), act(rand(5, 9), 'cheer', pick([G.fair ? 'Dancing around the winter fire' : 'Dancing at the festival', 'Singing along with the band', 'Sharing honey cake', 'Clapping to the music']))); return true; }
  }
  const r = Math.random();
  const tav = G.buildings.find((b) => b.type === 'tavern' && b.done && b.workers.length);
  if (tav && !daytime && r < 0.45) { v.plan.push(go(accessTiles(tav), 'Heading to the tavern'), act(rand(7, 12), r < 0.2 ? 'cheer' : 'idle', pick(['Having a drink at the tavern', 'Swapping stories at the tavern', 'Laughing with friends'])), ); return true; }
  const bench = G.buildings.find((b) => b.type === 'bench' && b.done && !b.sitter && Math.random() < 0.6);
  if (bench && r < 0.75) { bench.sitter = v; v.sitB = bench; v.plan.push(go(accessTiles(bench), 'Looking for a seat'), { t: 'sit', b: bench, dur: rand(8, 14), el: 0, say: pick(['Resting on a bench', 'Watching the world go by', 'Enjoying the evening air']) }); return true; }
  const pond = G.buildings.find((b) => b.type === 'pond' && b.done);
  if (pond && r < 0.9) { v.plan.push(go(accessTiles(pond), 'Strolling to the pond'), act(rand(5, 9), 'bend', 'Feeding the ducks', { face: { x: pond.cx, z: pond.cz } })); return true; }
  if (daytime) return false;
  const k = greenSpot(3.2);
  if (k < 0) return false;
  v.plan.push(go(k, 'Heading to the green'), act(rand(5, 10), 'idle', pick(['Warming up by the fire', 'Chatting on the green', 'Watching the sun go down']), { face: { x: G.center.cx, z: G.center.cz } }));
  return true;
}

// ----- grand projects after the Lighthouse -----
function mCathedral() {
  const b = new MB(), st = 0xd9d4c7, rf = 0x4c5f73;
  b.box(2.7, 0.14, 2.7, 0, 0, 0, C.stone).box(1.3, 1.5, 2.1, 0, 0.14, -0.15, st).gable(2.1, 0.8, 1.3, 0, 1.64, -0.15, st, Math.PI / 2).gable(2.26, 0.92, 1.5, 0, 1.6, -0.15, rf, Math.PI / 2);
  b.box(2.3, 1.1, 0.7, 0, 0.14, -0.35, st).gable(2.3, 0.5, 0.7, 0, 1.24, -0.35, st).gable(2.42, 0.58, 0.86, 0, 1.2, -0.35, rf);
  for (const sx of [-1, 1]) {
    b.box(0.62, 2.5, 0.62, sx * 0.78, 0.14, 0.9, st).box(0.7, 0.07, 0.7, sx * 0.78, 2.64, 0.9, C.stoneD).cone(0.44, 0.95, 4, sx * 0.78, 2.7, 0.9, rf, [0, Math.PI / 4, 0]).sph(0.05, sx * 0.78, 3.68, 0.9, C.gold);
    b.glow(0.16, 0.34, 0.04, sx * 0.78, 1.9, 1.215).glow(0.16, 0.3, 0.04, sx * 0.78, 1.1, 1.215);
    for (const z of [-0.8, -0.1, 0.5]) b.box(0.14, 1.0, 0.2, sx * 0.72, 0.14, z, C.stoneD).glow(0.04, 0.4, 0.18, sx * 0.655, 1.0, z + 0.3 > 0.7 ? 0.2 : z + 0.33);
  }
  b.box(0.5, 0.75, 0.08, 0, 0.14, 0.9, C.woodD).gable(0.6, 0.26, 0.1, 0, 0.89, 0.9, C.stoneD).cyl(0.3, 0.3, 0.05, 10, 0, 1.55, 0.91, C.stoneD, [Math.PI / 2, 0, 0]).glow(0.36, 0.36, 0.04, 0, 1.55, 0.93, [0, 0, Math.PI / 4]);
  b.box(0.9, 0.08, 0.3, 0, 0.04, 1.08, C.stoneL).box(1.1, 0.06, 0.3, 0, 0, 1.25, C.stone).cone(0.16, 1.1, 4, 0, 2.5, -0.35, rf, [0, Math.PI / 4, 0]).sph(0.04, 0, 3.62, -0.35, C.gold);
  return b.build();
}
function mShipyard() {
  const b = new MB();
  b.box(1.84, 0.1, 1.84, 0, 0, 0, C.woodL);
  for (let q = 0; q < 5; q++) b.box(1.5, 0.06, 0.1, 0.1, 0.1, -0.6 + q * 0.3, C.woodD);
  b.sph(0.5, 0.1, 0.42, 0, C.wood, [1.6, 0.5, 0.62], 1);
  for (let q = 0; q < 6; q++) b.box(0.04, 0.5, 0.04, -0.5 + q * 0.24, 0.4, 0.3, C.woodL, [0.35, 0, 0]).box(0.04, 0.5, 0.04, -0.5 + q * 0.24, 0.4, -0.3, C.woodL, [-0.35, 0, 0]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.07, 1.2, 0.07, 0.1 + sx * 0.75, 0.1, sz * 0.6, C.woodD);
  b.box(1.6, 0.06, 0.06, 0.1, 1.28, 0.6, C.wood).box(1.6, 0.06, 0.06, 0.1, 1.28, -0.6, C.wood).box(0.06, 0.06, 1.26, 0.85, 1.28, 0, C.wood).box(0.06, 0.06, 1.26, -0.65, 1.28, 0, C.wood);
  b.box(0.02, 0.5, 0.02, 0.3, 0.8, 0, C.dark).box(0.14, 0.1, 0.14, 0.3, 0.72, 0, C.iron);
  b.box(0.5, 0.05, 0.16, -0.65, 0.1, 0.8, C.plank).box(0.5, 0.05, 0.16, -0.65, 0.15, 0.8, C.woodL, [0, 0.1, 0]).box(0.5, 0.05, 0.16, -0.65, 0.2, 0.8, C.plank).cyl(0.12, 0.12, 0.28, 8, 0.75, 0.1, 0.8, C.woodD).cyl(0.16, 0.16, 0.06, 9, 0.4, 0.1, 0.82, 0xcdb588);
  b.cyl(0.03, 0.04, 1.5, 5, -0.82, 0.1, -0.82, C.woodD).box(0.3, 0.2, 0.02, -0.66, 1.4, -0.82, C.red).glow(0.1, 0.12, 0.1, 0.85, 1.1, 0.6);
  return b.build();
}
function mGreathive() {
  const b = new MB();
  b.cyl(1.35, 1.42, 0.16, 12, 0, 0, 0, C.stoneL).cyl(1.15, 1.2, 0.1, 12, 0, 0.16, 0, C.stone);
  const rings = [[1.0, 0.36], [1.06, 0.36], [1.0, 0.34], [0.88, 0.32], [0.72, 0.3], [0.52, 0.28], [0.3, 0.24]];
  let y = 0.26;
  rings.forEach((r, n) => { b.cyl(r[0] * 0.94, r[0], r[1], 12, 0, y, 0, n % 2 ? 0xe9a21c : C.gold); b.cyl(r[0] + 0.02, r[0] + 0.02, 0.035, 12, 0, y, 0, 0xb8780f); y += r[1]; });
  b.sph(0.14, 0, y + 0.08, 0, C.gold, null, 1).sph(0.06, 0, y + 0.26, 0, 0xfff2b0);
  b.box(0.44, 0.5, 0.12, 0, 0.26, 0.98, 0x3a2a1f).cyl(0.22, 0.22, 0.12, 10, 0, 0.76, 0.98, 0x3a2a1f, [Math.PI / 2, 0, 0]).glow(0.2, 0.2, 0.05, 0, 1.25, 1.02).glow(0.05, 0.2, 0.2, 1.02, 1.25, 0).glow(0.05, 0.2, 0.2, -1.02, 1.25, 0).glow(0.18, 0.18, 0.05, 0, 1.95, 0.72);
  for (let q = 0; q < 4; q++) { const a = q / 4 * TAU + 0.78, x = Math.cos(a) * 1.22, z = Math.sin(a) * 1.22; b.box(0.2, 0.3, 0.2, x, 0.16, z, C.stoneL).sph(0.1, x, 0.58, z, C.gold, [1.3, 1, 1], 1).box(0.04, 0.2, 0.21, x, 0.48, z, C.dark, [0, -a, 0]); }
  for (let q = 0; q < 10; q++) { const a = q / 10 * TAU, x = Math.cos(a) * 1.3, z = Math.sin(a) * 1.3; if (Math.abs(x) < 0.4 && z > 0) continue; b.sph(0.06, x, 0.2, z, [C.pink, C.white, 0xb48ae0][q % 3], [1, 0.7, 1]); }
  return b.build();
}
Object.assign(MODEL_FN, { cathedral: mCathedral, shipyard: mShipyard, greathive: mGreathive });
Object.assign(BT, {
  cathedral: { lvl: 4, after: 'lighthouse', max: 1, name: 'Cathedral', cat: 'dorp', size: 3, cost: { wood: 150, stone: 350, brick: 100, coins: 300 }, time: 80, decor: 25, desc: 'A grand project: twin towers over the rooftops. Its bells ring in every new day.' },
  shipyard: { lvl: 4, after: 'lighthouse', max: 1, name: 'Shipyard', cat: 'dorp', size: 2, cost: { wood: 250, brick: 60, coins: 250 }, time: 50, job: 'shipwright', slots: 1, nearWater: true, desc: 'With a shipwright you can send expeditions beyond the horizon. They return with coins and treasures.' },
  greathive: { lvl: 4, after: 'cathedral', max: 1, name: 'Great Hive', cat: 'dorp', size: 3, cost: { honey: 80, stone: 250, brick: 120, coins: 600 }, time: 110, decor: 30, desc: 'The crowning wonder of Bumblenook: a golden hive taller than the trees.' },
});
JOBS.shipwright = { title: 'Shipwright', plural: 'Shipwrights', shirt: 0x9a6b42, hat: 'cap', hatC: 0x6b4529 };
const TREASURES = [
  { id: 'pearl', name: 'Moon Pearl' }, { id: 'spice', name: 'Spice Chest' }, { id: 'parrot', name: 'Talking Parrot' },
  { id: 'idol', name: 'Golden Bee Idol' }, { id: 'chart', name: 'Star Chart' }, { id: 'shell', name: 'Singing Shell' },
];
const EXP_COST = { food: 80, cloth: 5, coins: 100 };
function expBlock() {
  const y = G.buildings.find((b) => b.type === 'shipyard' && b.done);
  if (!y) return 'none';
  if (G.exp.state !== 'home') return G.exp.state === 'away' ? 'The ship is far out at sea. It returns in about ' + Math.max(1, Math.ceil((G.exp.until - G.clock) / DAY_LEN * 24)) + ' hours.' : 'The ship is on the move.';
  if (!y.workers.length) return 'The Shipyard needs a shipwright first.';
  if (!y.shore) return 'The Shipyard cannot reach the water.';
  if (!canAfford(EXP_COST)) return 'An expedition needs 80 food, 5 cloth and 100 coins.';
  return null;
}
function startExpedition() {
  if (expBlock()) { sfx('error'); return false; }
  pay(EXP_COST); G.exp.state = 'out'; G.exp.t = 0;
  sfx('bell', 0.7); toast('The expedition sets sail. Fair winds!', 'good'); logNews('An expedition left the Shipyard.'); uiDirty(); return true;
}
function expTick(dt) {
  const E = G.exp, y = G.buildings.find((b) => b.type === 'shipyard' && b.done && b.shore);
  if (!y) { if (E.mesh) E.mesh.visible = false; return; }
  if (!E.mesh) { E.mesh = new THREE.Mesh(cachedGeo('boat', mBoat), MAT.main); E.mesh.castShadow = true; buildGroup.add(E.mesh); }
  const P = shipPoints(y);
  if (E.state === 'out') { E.t += dt / 18; if (E.t >= 1) { E.state = 'away'; E.until = G.clock + DAY_LEN * 1.2; } }
  else if (E.state === 'away') { if (G.clock >= E.until) { E.state = 'in'; E.t = 0; } }
  else if (E.state === 'in') {
    E.t += dt / 18;
    if (E.t >= 1) {
      E.state = 'home'; G.stats.exped++;
      const coins = 120 + ((Math.random() * 8) | 0) * 20, left = TREASURES.filter((t) => !G.treasure[t.id]);
      G.res.coins += coins; G.stats.coins += coins;
      let msg = 'The expedition is home with ' + coins + ' coins';
      if (left.length) { const t = pick(left); G.treasure[t.id] = 1; msg += ' and a treasure: the ' + t.name + '!'; } else msg += ' and tales of faraway shores.';
      sfx('quest'); toast(msg, 'quest'); logNews(msg); uiDirty();
    }
  }
  const e = E.state === 'out' ? E.t * E.t : E.state === 'in' ? 1 - (1 - E.t) * (1 - E.t) * 1 : 0, far = E.state === 'out' ? e : E.state === 'in' ? 1 - e : E.state === 'away' ? 1 : 0;
  E.mesh.visible = E.state !== 'away';
  E.x = lerp(P.dx, P.fx, far); E.z = lerp(P.dz, P.fz, far);
  E.rot = Math.atan2(-(P.fz - P.dz), P.fx - P.dx) + (E.state === 'in' ? Math.PI : 0);
}
function finale() {
  G.finale = true; G.fireworks += 24;
  setTimeout(() => openModal('final'), 2600);
}
ACH.push(
  { id: 'frost', name: 'Winter Wonder', desc: 'Hold a Winter Fair and build 3 snowmen', test: () => G.stats.fair >= 1 && G.stats.snowmen >= 3, coins: 25 },
  { id: 'voyager', name: 'World Traveller', desc: 'Bring home all 6 treasures', test: () => TREASURES.every((t) => G.treasure[t.id]), coins: 150 },
  { id: 'wonder', name: 'Queen of the Hive', desc: 'Raise the Great Hive', test: () => countDone('greathive') >= 1, coins: 200 });

JOB_THINK.shipwright = (v, b) => { v.plan.push(go(accessTiles(b), 'Walking to the shipyard'), act(8, G.exp.state === 'home' ? 'chop' : 'idle', G.exp.state === 'home' ? 'Caulking the hull' : 'Watching for the sails', { face: { x: b.cx, z: b.cz } })); };
