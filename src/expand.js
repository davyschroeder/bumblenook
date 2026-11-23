// ---------- expand: research, upgrades, seasons, talents, events, exploring, story, almanac, modes ----------
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const SEASON_DAYS = 4;
const seasonOf = (day) => Math.floor((day - 1) / SEASON_DAYS) % 4;
const NAT_SITE = 4;
const TALENT_JOBS = ['lumber', 'quarry', 'forager', 'farmer', 'fisher', 'baker', 'bee', 'shepherd', 'weaver', 'miner', 'picker', 'scholar', 'gardener'];

// ----- research (Academy) -----
const TECHS = [
  { id: 'forestry', name: 'Forestry', cost: 12, desc: 'Woodcutters bring home 6 wood per tree instead of 4.' },
  { id: 'barrows', name: 'Wheelbarrows', cost: 18, desc: 'Everyone walks 15% faster.' },
  { id: 'mining', name: 'Mining', cost: 20, desc: 'Unlocks the Mine: endless stone from the hills.' },
  { id: 'rotation', name: 'Crop Rotation', cost: 22, desc: 'Fields grow 30% faster.' },
  { id: 'orchards', name: 'Orchards', cost: 24, desc: 'Unlocks the Orchard and the Cider Press.' },
  { id: 'cartography', name: 'Cartography', cost: 16, desc: 'Marks every unexplored site on the island.' },
  { id: 'masonry', name: 'Masonry', cost: 28, desc: 'Unlocks the Brickworks. Bricks pay for upgrades and grand buildings.' },
  { id: 'watch', name: 'Night Watch', cost: 22, desc: 'Unlocks the Watchtower, which keeps foxes and storm damage away.' },
  { id: 'beelore', name: 'Bee Lore', cost: 26, desc: 'Apiaries always give double honey.' },
  { id: 'carpentry', name: 'Carpentry', cost: 36, need: 'masonry', desc: 'Unlocks building upgrades: Townhouse, Sawmill, Stoneworks and more.' },
  { id: 'glass', name: 'Glassmaking', cost: 34, need: 'masonry', desc: 'Unlocks the Greenhouse: fresh food even in winter.' },
  { id: 'springs', name: 'Hot Springs', cost: 30, need: 'masonry', desc: 'Unlocks the Bathhouse.' },
  { id: 'navigation', name: 'Navigation', cost: 40, desc: 'The trading ship pays 30% more.' },
  { id: 'civics', name: 'Civics', cost: 48, need: 'carpentry', desc: 'Unlocks the Town Hall and the Bandstand.' },
];
for (const t of TECHS) { t.cost = Math.round(t.cost * 1.25); t.coins = Math.round(t.cost * 0.8); }
const hasTech = (id) => !!G.tech[id];
function techBlock(t) {
  if (G.tech[t.id]) return 'Done';
  if (t.alt && G.tech[t.alt]) return 'You chose the ' + TECHS.find((q) => q.id === t.alt).name;
  if (t.need && !G.tech[t.need]) return 'Needs ' + TECHS.find((q) => q.id === t.need).name;
  if (G.rp < t.cost) return 'Needs ' + t.cost + ' insight';
  if (!canAfford({ coins: t.coins })) return 'Needs ' + t.coins + ' coins';
  return null;
}
function research(id) {
  const t = TECHS.find((q) => q.id === id);
  if (!t || techBlock(t)) { sfx('error'); return false; }
  G.rp -= t.cost; pay({ coins: t.coins }); G.tech[id] = 1; G.stats.research++;
  const un = Object.keys(BT).filter((k) => BT[k].tech === id).map((k) => BT[k].name);
  sfx('quest'); toast('Research complete: ' + t.name + '.' + (un.length ? ' Unlocked: ' + un.join(', ') + '.' : ''), 'quest');
  uiDirty(); return true;
}

// ----- town improvements (Town Hall): somewhere to spend all those coins -----
const CIVICS = [
  { id: 'streets', name: 'Cobbled Streets', cost: 120, desc: 'Paths become even faster to walk on.' },
  { id: 'gardens', name: 'Public Gardens', cost: 160, desc: 'Flowers on every corner: lasting extra charm.' },
  { id: 'stores', name: 'Winter Stores', cost: 180, desc: 'Every kind of good can be stored in far larger amounts.' },
  { id: 'scholar', name: 'Scholarships', cost: 220, desc: 'Room for a third scholar at the Academy.' },
  { id: 'crane', name: 'Harbour Crane', cost: 260, desc: 'Ship orders pay 25% more.' },
  { id: 'feast', name: 'Festival Fund', cost: 300, desc: 'Festivals no longer cost food or honey.' },
];
function buyCivic(id) {
  const c = CIVICS.find((q) => q.id === id);
  if (!c || G.civic[id] || !canAfford({ coins: c.cost })) { sfx('error'); return false; }
  pay({ coins: c.cost }); G.civic[id] = 1; G.stats.civic++;
  sfx('quest'); toast('The council approved: ' + c.name + '.', 'quest'); logNews('The Town Hall paid for ' + c.name + '.'); uiDirty(); return true;
}
// ----- storage: stores are not bottomless -----
const CAP_K = { wood: 1, stone: 1, food: 1, grain: 1, honey: 0.4, wool: 0.4, cloth: 0.4, brick: 0.4, cider: 0.4 };
function capOf(res) {
  if (!CAP_K[res] || G.mode === 'sandbox') return Infinity;
  return Math.round((200 + countDone('store') * 150 + G.level * 50 + (G.civic.stores ? 300 : 0)) * CAP_K[res]);
}
function store(res, amt) {           // what workers bring in; returns what actually fitted
  const room = Math.max(0, capOf(res) - G.res[res]), n = Math.min(amt, room);
  G.res[res] += n;
  if (n < amt && G.clock - (G.fullMsg[res] || -999) > 240) { G.fullMsg[res] = G.clock; toast('The stores are full of ' + RES[res].toLowerCase() + '. Build a Storehouse, trade it at the Market or move a worker to another job.', 'bad'); }
  return n;
}

// ----- upgrades -----
const UPGRADES = {
  house: { name: 'Townhouse', cost: { wood: 20, brick: 12, coins: 15 }, desc: 'Three storeys: 5 beds instead of 3.', beds: 2 },
  lumber: { name: 'Sawmill', cost: { wood: 30, brick: 8, coins: 15 }, desc: 'Room for a third woodcutter, and 2 more wood per tree.', slots: 1 },
  quarry: { name: 'Stoneworks', cost: { wood: 30, brick: 8, coins: 15 }, desc: 'Room for a third stonecutter, and 1 more stone per trip.', slots: 1 },
  farm: { name: 'Irrigated Farm', cost: { wood: 25, brick: 10, coins: 20 }, desc: 'A windpump waters the field: crops grow 40% faster and yield more.' },
  bakery: { name: 'Grand Bakery', cost: { stone: 20, brick: 12, coins: 20 }, desc: 'A second oven: room for a third baker and 2 more food per batch.', slots: 1 },
};
const slotsOf = (b) => (b.def.slots || 0) + ((b.up && UPGRADES[b.type].slots) || 0) + (b.type === 'academy' && G.civic.scholar ? 1 : 0);
const bedsOf = (b) => (b.def.beds || 0) + ((b.up && UPGRADES[b.type].beds) || 0);
const nameOf = (b) => (b.up ? UPGRADES[b.type].name : b.def.name);
function pay(cost) { if (G.mode === 'sandbox' || !cost) return; for (const r of Object.keys(cost)) G.res[r] -= cost[r]; }
function upgradeBlock(b) {
  const u = UPGRADES[b.type];
  if (!u || b.up || !b.done) return 'none';
  if (!hasTech('carpentry')) return 'Research Carpentry at the Academy first.';
  if (!canAfford(u.cost)) return 'Not enough resources yet.';
  return null;
}
function applyUpgradeLook(b) {
  const g = b.mesh, u = g.userData;
  if (b.type === 'house') { const m = getModel('townhouse', b.variant % 5); u.body.geometry = m.geo; if (u.glow && m.glow) u.glow.geometry = m.glow; }
  const add = new THREE.Mesh(upgradeGeo(b.type), MAT.main); add.castShadow = true; g.add(add);
}
function upgradeBuilding(b) {
  if (upgradeBlock(b)) { sfx('error'); return false; }
  pay(UPGRADES[b.type].cost); b.up = 1; applyUpgradeLook(b); b.pop = 1; G.stats.upgrades++;
  puff(b.cx, b.y + 0.4, b.cz, [0xfff2b0, 0xffffff, 0xf6b93b], 16, { spread: b.size * 0.4, speed: 1.3, up: 1.6, life: 0.8, size: 0.1, glow: true });
  sfx('done', 1); toast(b.def.name + ' upgraded to ' + UPGRADES[b.type].name + '!', 'good');
  if (UPGRADES[b.type].beds) assignHomes();
  uiDirty(); return true;
}

// ----- seasons -----
const SEASON_GROW = [1.2, 1, 1, 0.6];
const farmK = (b) => SEASON_GROW[G.season] * (hasTech('rotation') ? 1.3 : 1) * (b.up ? 1.4 : 1) * (G.rain > 0 && G.season !== 3 ? 2 : 1);
const FOL = { round: [[0xffffff, 0], [0xffffff, 0], [0xffc890, 0x5a2800], [0x9fb0b8, 0x8c9aa6]], pine: [[0xffffff, 0], [0xffffff, 0], [0xffffff, 0], [0xdfe6ea, 0x4a5560]], bush: [[0xffffff, 0], [0xffffff, 0], [0xe8d0a0, 0x2a1800], [0xb0b8b0, 0x556060]] };
function applySeason() {
  const s = G.season; W.season = s;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) refreshTile(i, j);
  const set = (mesh, key) => { const c = FOL[key][s]; mesh.material.color.set(c[0]); mesh.material.userData.em = c[1]; };
  set(W.mRound, 'round'); set(W.mPine, 'pine'); set(W.mBush, 'bush');
  W.mTuft.visible = s !== 3; W.mTuft.material.color.set(s === 2 ? 0xe6d27a : 0xffffff);
  W.mFlower.visible = s < 2;
  if (s !== 3) meltSnowmen();
}
function seasonLight() {          // snow and autumn glow follow the daylight, so trees do not shine at night
  for (const m of [W.mRound, W.mPine, W.mBush]) m.material.emissive.set(m.material.userData.em || 0).multiplyScalar(clamp(DAY.lightK, 0.25, 1));
}
function seasonTurn() {
  const s = seasonOf(G.day);
  if (s === G.season) { if (s === 2 && seasonOf(G.day + 1) === 3) toast('Winter starts tomorrow. Berries and fruit will be scarce: fill the stores with food.', 'bad'); return; }
  G.season = s; applySeason();
  toast(['Spring is here. Everything grows a little faster.', 'Summer! Berries ripen quickly now.', 'Autumn colours the island. Harvests are extra rich.', 'Winter has come. Berries are scarce, fruit trees rest and fields grow slowly: live off your stores.'][s], s === 3 ? 'bad' : 'good');
  logNews(SEASONS[s] + ' begins.');
}

// ----- daily news: small strokes of luck and gentle setbacks -----
function logNews(text) { G.news.unshift('Day ' + G.day + ': ' + text); if (G.news.length > 6) G.news.length = 6; uiDirty(); }
function dailyEvent() {
  if (G.level < 1 || G.day - G.lastEvent < 2 || Math.random() > 0.55) return;
  G.lastEvent = G.day;
  const watch = staffed('watchtower'), farms = G.buildings.filter((b) => b.type === 'farm' && b.done), opts = ['driftwood', 'bard', 'traveller'];
  if (farms.length) opts.push('storm', 'bumper');
  if (countDone('pasture')) opts.push('fox');
  if (countDone('apiary')) opts.push('swarm');
  const e = pick(opts);
  let msg;
  if (e === 'driftwood') { const n = 15 + ((Math.random() * 4) | 0) * 5; G.res.wood += n; msg = 'The tide left ' + n + ' wood on the beach.'; }
  else if (e === 'bard') { G.cheer = G.clock + DAY_LEN; msg = 'A wandering bard sings on the green. Spirits are high today.'; }
  else if (e === 'traveller') { const n = 10 + G.level * 5; G.res.coins += n; G.stats.coins += n; msg = 'A grateful traveller left ' + n + ' coins for a warm meal.'; }
  else if (e === 'bumper') { for (const f of farms) f.growth = 1; msg = 'A perfect night for growing: every field is ready to harvest.'; }
  else if (e === 'swarm') { G.res.honey += 5; G.stats.honey += 5; msg = 'A wild swarm moved into the apiary: 5 extra honey.'; }
  else if (e === 'storm') {
    G.rain = Math.max(G.rain, 50);
    if (watch) msg = 'A storm blew in, but the watch rang the bell in time. The fields were covered.';
    else { pick(farms).growth = 0; msg = 'A storm flattened a field. A Watchtower would have warned the farmers.'; }
  } else if (e === 'fox') {
    if (watch) msg = 'A fox sniffed around the pasture, but the watchman chased it off.';
    else { G.foxUntil = G.clock + DAY_LEN * 0.5; msg = 'A fox is bothering the sheep: no wool until this evening. A Watchtower keeps foxes away.'; }
  }
  logNews(msg); toast(msg, e === 'storm' && !watch || e === 'fox' && !watch ? 'bad' : 'good');
}

// ----- old sites to explore -----
function generateSites(found) {
  W.sites = [];
  if (!W.siteGroup) { W.siteGroup = new THREE.Group(); worldGroup.add(W.siteGroup); }
  const r = mulberry32(W.seed * 13 + 7), c = G.center;
  for (const kind of ['circle', 'cairn', 'shrine', 'wreck']) {
    let spot = null;
    for (let q = 0; q < 500 && !spot; q++) {
      const i = 4 + ((r() * (N - 8)) | 0), j = 4 + ((r() * (N - 8)) | 0), k = tileIdx(i, j);
      if (W.type[k] !== (kind === 'wreck' ? T_SAND : T_GRASS) || W.slope[k] > 0.3) continue;
      const d = Math.hypot(tileX(i) - c.cx, tileX(j) - c.cz);
      if (d < 10 || d > 25 || W.sites.some((s) => Math.hypot(s.i - i, s.j - j) < 9)) continue;
      spot = [i, j, k];
    }
    if (!spot) continue;
    const [i, j, k] = spot, n = W.sites.length;
    if (W.natK[k] === NAT_ROCK) { const rk = rocks[W.natI[k]]; rk.amount = 0; setRockMatrix(rk); } else clearNat(k);
    hideDeco(k);
    const s = { n, kind, i, j, k, x: tileX(i), z: tileX(j), y: W.tileH[k], found: !!(found && found[n]), busy: null };
    W.natK[k] = NAT_SITE; W.natI[k] = n; W.solid[k] = 1;
    s.mesh = new THREE.Mesh(cachedGeo('site:' + kind, () => mSite(kind)), MAT.main); s.mesh.castShadow = true; s.mesh.position.set(s.x, s.y, s.z); s.mesh.rotation.y = r() * TAU; W.siteGroup.add(s.mesh);
    if (s.found) markSite(s);
    W.sites.push(s);
  }
  W.nav++;
}
function markSite(s) { const f = new THREE.Mesh(cachedGeo('siteflag', mSiteFlag), MAT.main); f.position.set(s.x, s.y, s.z); W.siteGroup.add(f); }
function exploreBlock(s) {
  if (s.found) return 'Explored. Its story is in the almanac.';
  if (s.busy && G.villagers.includes(s.busy)) return s.busy.name + ' is on the way.';
  if (!G.villagers.some((v) => v.state !== 'sleep')) return 'Everyone is asleep. Send someone in the morning.';
  return null;
}
function exploreSite(s) {
  if (exploreBlock(s)) { sfx('error'); return false; }
  let v = null, bd = 1e9;
  // a villager without a job goes first; if everyone has one, the nearest worker takes a break from it and returns afterwards
  for (const free of [true, false]) {
    for (const c of G.villagers) { if (c.state === 'sleep' || (free && c.job) || c.buildSite) continue; const d = dist2(c.x, c.z, s.x, s.z); if (d < bd) { bd = d; v = c; } }
    if (v) break;
  }
  if (!v) for (const c of G.villagers) { if (c.state === 'sleep') continue; const d = dist2(c.x, c.z, s.x, s.z); if (d < bd) { bd = d; v = c; } }
  if (!v) { sfx('error'); return false; }
  dropCarry(v); clearPlan(v); s.busy = v; v.exploring = s;
  toast(v.name + ' sets out to explore the ' + SITE_KINDS[s.kind].name + '.');
  v.plan.push(go(standNear(s.i, s.j), 'Setting out to explore'), { t: 'near', o: s, d: 0.75 }, act(10, 'chop', 'Exploring the ' + SITE_KINDS[s.kind].name.toLowerCase(), { face: s, hit: 1.1, onHit(q) { sfx('mine', hearK(q.x, q.z) * 0.6); puff(s.x, s.y + 0.2, s.z, [0xd9c79a, 0xa89a78], 2, { speed: 0.8, life: 0.5, size: 0.05 }); } }), call(() => {
    s.busy = null; v.exploring = null; if (s.found) return;
    s.found = true; markSite(s); G.stats.explored++;
    const loot = { circle: { stone: 40, coins: 20 }, wreck: { wood: 40, coins: 30 }, cairn: { coins: 35, honey: 6 }, shrine: { honey: 10, coins: 25 } }[s.kind];
    for (const k of Object.keys(loot)) { G.res[k] += loot[k]; if (k === 'coins') G.stats.coins += loot[k]; }
    puff(s.x, s.y + 0.5, s.z, [0xfff2b0, 0xf6b93b, 0xffffff], 14, { speed: 1.2, up: 1.6, life: 0.9, size: 0.09, glow: true });
    sfx('quest'); toast(v.name + ' explored the ' + SITE_KINDS[s.kind].name + ' and found ' + Object.keys(loot).map((k) => loot[k] + ' ' + RES[k].toLowerCase()).join(' and ') + '.', 'quest');
    logNews(v.name + ' explored the ' + SITE_KINDS[s.kind].name + '.'); uiDirty();
  }));
  sfx('click'); uiDirty(); return true;
}

// ----- almanac: fish -----
const FISH = [
  { id: 'bream', name: 'Silver Bream', w: 5 }, { id: 'sprat', name: 'Harbour Sprat', w: 5 }, { id: 'perch', name: 'Striped Perch', w: 4, s: [0, 1] },
  { id: 'trout', name: 'Brook Trout', w: 3, s: [0, 2] }, { id: 'eel', name: 'Moon Eel', w: 2, s: [1, 2] }, { id: 'cod', name: 'Winter Cod', w: 4, s: [3] },
  { id: 'pike', name: 'Old Pike', w: 1.2 }, { id: 'gold', name: 'Golden Carp', w: 0.5 },
];
function catchFish(v) {
  const pool = FISH.filter((f) => !f.s || f.s.includes(G.season));
  let r = Math.random() * pool.reduce((n, f) => n + f.w, 0), f = pool[0];
  for (const q of pool) { r -= q.w; if (r <= 0) { f = q; break; } }
  if (!G.fish[f.id]) { toast(v.name + ' caught a ' + f.name + '. New in the almanac!', 'good'); logNews(v.name + ' caught the first ' + f.name + '.'); }
  G.fish[f.id] = (G.fish[f.id] || 0) + 1;
}

// ----- story: letters that arrive as the village grows -----
const STORY = [
  { when: () => G.q.grow >= 3, who: 'Grandma Poppy', title: 'The seed tin', text: 'Dear settlers, I kept this tin of seeds for sixty years, waiting for someone brave enough to start over on the island. Plant them for me, would you?', task: 'Plant 5 saplings (Materials tab)', prog: () => [G.stats.planted - G.storyBase, 5], reward: { coins: 15, food: 20 } },
  { when: () => G.level >= 1, who: 'Captain Reed', title: 'The old map', text: 'I sailed past your island as a cabin boy. My captain marked strange places on his chart: standing stones, a wreck, a shrine. Find one, and tell me it was real.', task: 'Tap an old site on the island and send an explorer', prog: () => [Math.min(G.stats.explored, 1), 1], reward: { coins: 25 } },
  { when: () => G.level >= 2, who: 'Wren the bard', title: 'A song for Bumblenook', text: 'I have a new song and nowhere to sing it. Throw me a festival, and I promise the whole island will be humming it for a week.', task: 'Hold a festival', prog: () => [G.stats.fest - G.storyBase, 1], reward: { coins: 30, honey: 5 } },
  { when: () => G.level >= 3, who: 'Old Hazel', title: 'The beekeeper\'s dream', text: 'When I was young I dreamed of an island that smelled of honey from shore to shore. My knees are too old for hives now. Could you make it true?', task: 'Collect 80 honey in total', prog: () => [Math.min(G.stats.honey, 80), 80], reward: { coins: 50 } },
  { when: () => G.level >= 4, who: 'Captain Reed', title: 'A light for the sailors', text: 'Ships talk of your harbour in every port now. One thing is missing: a light to guide us home on stormy nights. Build it, and you will never lack for friends at sea.', task: 'Build the Lighthouse', prog: () => [countDone('lighthouse'), 1], reward: { coins: 100 } },
];
function storyTick() {
  if (!G.started || G.mode !== 'normal') return;
  const ch = STORY[G.story];
  if (!ch) return;
  if (!G.storyOn) {
    if (!ch.when()) return;
    G.storyOn = true;
    G.storyBase = G.story === 0 ? G.stats.planted : G.story === 1 ? G.stats.explored : G.story === 2 ? G.stats.fest : 0;
    showLetter(ch); logNews('A letter from ' + ch.who + ' arrived.'); uiDirty();
    return;
  }
  const p = ch.prog();
  if (p[0] >= p[1]) {
    for (const r of Object.keys(ch.reward)) { G.res[r] += ch.reward[r]; if (r === 'coins') G.stats.coins += ch.reward[r]; }
    sfx('quest'); toast(ch.who + ' is overjoyed: "' + ch.title + '" is complete. Reward: ' + Object.keys(ch.reward).map((r) => ch.reward[r] + ' ' + RES[r].toLowerCase()).join(', ') + '.', 'quest');
    G.story++; G.storyOn = false; uiDirty();
  }
}

// ----- daily island -----
const DAILY_GOALS = [
  { text: 'Reach 12 villagers', test: () => G.villagers.length >= 12 }, { text: 'Earn 60 coins', test: () => G.stats.coins >= 60 },
  { text: 'Grow into a Village', test: () => G.level >= 2 }, { text: 'Reach 80% happiness with 10 villagers', test: () => G.happy >= 80 && G.villagers.length >= 10 },
  { text: 'Collect 15 honey', test: () => G.stats.honey >= 15 }, { text: 'Build 6 Cottages', test: () => countDone('house') >= 6 }, { text: 'Fill 3 requests', test: () => G.stats.missions >= 3 },
];
function todayKey() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function dailySeed(key) { let h = 7; for (let q = 0; q < key.length; q++) h = (Math.imul(h, 31) + key.charCodeAt(q)) | 0; return Math.abs(h) % 900000 + 1; }
function dailyBest(key) { try { const d = JSON.parse(localStorage.getItem('bumblenook-daily-best') || '{}'); return d.date === key ? d.best : null; } catch (e) { return null; } }
function dailyTick() {
  const D = G.daily;
  if (!D || D.done || !G.started) return;
  if (!DAILY_GOALS[D.goal].test()) return;
  D.done = true; D.score = +((G.day - 1) + G.time).toFixed(2);
  const best = dailyBest(D.date);
  if (best === null || D.score < best) { try { localStorage.setItem('bumblenook-daily-best', JSON.stringify({ date: D.date, best: D.score })); } catch (e) { /* optional */ } }
  sfx('quest'); G.fireworks += 8;
  toast('Daily island complete in ' + D.score.toFixed(1) + ' days!' + (best !== null && D.score >= best ? ' Your best today is ' + best.toFixed(1) + '.' : ' A new personal best.'), 'quest');
  uiDirty();
}

// ----- wildlife -----
const bunnies = [];
function initWildlife() {
  for (let q = 0; q < 7; q++) { const m = new THREE.Mesh(cachedGeo('bunny', mBunny), MAT.main); m.castShadow = true; scene.add(m); bunnies.push({ m, x: 0, z: 0, tx: 0, tz: 0, wait: Math.random() * 5, rot: 0, ph: Math.random() * 9 }); }
}
function meadowSpot() {
  for (let q = 0; q < 40; q++) { const i = 3 + ((Math.random() * (N - 6)) | 0), j = 3 + ((Math.random() * (N - 6)) | 0), k = tileIdx(i, j); if (W.type[k] === T_GRASS && !W.occ[k] && !W.solid[k] && !W.natK[k]) return [tileX(i), tileX(j)]; }
  return [0, 0];
}
function resetWildlife() { for (const b of bunnies) { const p = meadowSpot(); b.x = b.tx = p[0]; b.z = b.tz = p[1]; } }
function updateWildlife(dt, t) {
  for (const b of bunnies) {
    b.m.visible = DAY.glow < 0.6;
    b.wait -= dt;
    if (b.wait <= 0 && b.wait > -90) {
      let ok = false;
      for (let q = 0; q < 6 && !ok; q++) { const x = b.x + rand(-2.5, 2.5), z = b.z + rand(-2.5, 2.5), k = tileIdx(clamp(worldToTile(x), 1, N - 2), clamp(worldToTile(z), 1, N - 2)); if (W.type[k] === T_GRASS && !W.solid[k] && !W.occ[k]) { b.tx = x; b.tz = z; ok = true; } }
      b.wait = ok ? -100 : 2;
    }
    let hop = 0;
    if (b.wait < -90) {
      const dx = b.tx - b.x, dz = b.tz - b.z, d = Math.hypot(dx, dz);
      if (d < 0.06) b.wait = rand(1.5, 6);
      else { b.x += dx / d * dt * 0.9; b.z += dz / d * dt * 0.9; b.rot = Math.atan2(dx, dz); hop = Math.abs(Math.sin(t * 9 + b.ph)) * 0.09; }
    }
    b.m.position.set(b.x, heightAt(b.x, b.z) + hop, b.z); b.m.rotation.y = b.rot;
  }
}

// ----- settings -----
const SET = { gfx: 'high', big: false, lang: 'en' };
function loadSettings() { try { Object.assign(SET, JSON.parse(localStorage.getItem('bumblenook-settings') || '{}')); } catch (e) { /* defaults */ } }
function saveSettings() { try { localStorage.setItem('bumblenook-settings', JSON.stringify(SET)); } catch (e) { /* optional */ } }
function applySettings() {
  const low = SET.gfx === 'low';
  sun.castShadow = !low;
  renderer.setPixelRatio(low ? 1 : Math.min(window.devicePixelRatio || 1, UIS.coarse ? 1.75 : 2));
  for (const c of clouds) c.visible = !low;
  document.body.classList.toggle('bigtext', !!SET.big);
  document.documentElement.lang = SET.lang;
  gfxApply();
  if (typeof resize === 'function' && camera) resize();
}

function expandTick(dt) {            // called once a second from the simulation
  storyTick(); dailyTick();
}
