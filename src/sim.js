// ---------- sim: buildings, villagers, economy ----------
const RES = { wood: 'Wood', stone: 'Stone', food: 'Food', grain: 'Grain', honey: 'Honey', wool: 'Wool', cloth: 'Cloth', brick: 'Bricks', cider: 'Cider', coins: 'Coins' };
const BT = {
  center: { name: 'Village Green', size: 3, beds: 4, storage: true, decor: 5, desc: 'The heart of the village. Villagers bring their harvest here.' },
  house: { name: 'Cottage', cat: 'dorp', size: 2, cost: { wood: 20 }, time: 10, beds: 3, variants: 7, desc: 'A snug home for 3 villagers. More beds bring new settlers.' },
  store: { lvl: 1, name: 'Storehouse', cat: 'dorp', size: 2, cost: { wood: 40, stone: 10 }, time: 14, storage: true, desc: 'An extra drop-off point. Put one near your workplaces to shorten the walk.' },
  well: { name: 'Well', cat: 'dorp', size: 1, cost: { stone: 20 }, time: 8, decor: 6, desc: 'Fresh water in the middle of the village. A real boost to happiness.' },
  market: { name: 'Market', cat: 'dorp', size: 2, cost: { wood: 40, stone: 30 }, time: 16, job: 'merchant', slots: 1, lvl: 2, desc: 'Trade goods for coins and back. With a merchant, every morning is market day.' },
  lighthouse: { name: 'Lighthouse', cat: 'dorp', size: 2, cost: { wood: 120, stone: 180, coins: 120 }, time: 60, decor: 20, nearWater: true, lvl: 3, max: 1, desc: 'The pride of Bumblenook. Must stand close to the water.' },
  forager: { name: 'Forager\'s Hut', cat: 'voedsel', size: 2, cost: { wood: 10 }, time: 8, job: 'forager', slots: 2, radius: 9, desc: 'Foragers pick berries from bushes nearby. The berries grow back by themselves.' },
  fisher: { lvl: 1, name: 'Fishing Hut', cat: 'voedsel', size: 2, cost: { wood: 20, stone: 5 }, time: 10, job: 'fisher', slots: 2, nearWater: true, desc: 'Fishers cast from the shore. Must stand close to the water.' },
  farm: { lvl: 1, name: 'Farm', cat: 'voedsel', size: 3, cost: { wood: 30, stone: 10 }, time: 16, job: 'farmer', slots: 2, desc: 'Farmers grow grain on the field. The bakery turns grain into bread.' },
  bakery: { lvl: 1, name: 'Bakery', cat: 'voedsel', size: 2, cost: { wood: 25, stone: 30 }, time: 14, job: 'baker', slots: 2, desc: 'A baker turns 3 grain into 7 food. Fresh bread makes everyone happy.' },
  windmill: { name: 'Windmill', cat: 'voedsel', size: 2, cost: { wood: 60, stone: 40, coins: 20 }, time: 24, decor: 4, lvl: 2, desc: 'Grinds the grain finer: every batch of bread gives 11 food instead of 7.' },
  apiary: { lvl: 1, name: 'Apiary', cat: 'voedsel', size: 2, cost: { wood: 20 }, time: 10, job: 'bee', slots: 1, desc: 'The beekeeper collects honey. Twice as much with 3 flower beds nearby.' },
  lumber: { name: 'Lumber Hut', cat: 'grond', size: 2, cost: { wood: 15 }, time: 9, job: 'lumber', slots: 2, radius: 9, desc: 'Woodcutters fell grown trees nearby and plant a sapling in their place.' },
  quarry: { name: 'Quarry Hut', cat: 'grond', size: 2, cost: { wood: 25 }, time: 12, job: 'quarry', slots: 2, radius: 10, desc: 'Stonecutters break up rocks nearby. Without rocks they work slower at the hut.' },
  tree: { name: 'Sapling', cat: 'grond', size: 1, cost: {}, quick: true, plant: true, desc: 'Plant a young tree for free. It can be felled once it has grown.' },
  path: { name: 'Path', cat: 'sfeer', size: 1, cost: { stone: 1 }, quick: true, walk: true, flat: true, desc: 'Villagers walk faster on paths. Drag to lay a whole stretch.' },
  lantern: { name: 'Lantern', cat: 'sfeer', size: 1, cost: { wood: 5, stone: 3 }, time: 3, decor: 2, quick: true, desc: 'Warm light in the evening. Adds a little happiness.' },
  flowers: { lvl: 1, name: 'Flower Bed', cat: 'sfeer', size: 1, cost: { wood: 2 }, time: 3, decor: 2, quick: true, variants: 4, desc: 'Brightens the village and attracts bumblebees. Good for the apiary.' },
  bench: { name: 'Bench', cat: 'sfeer', size: 1, cost: { wood: 6 }, time: 3, decor: 3, quick: true, desc: 'A place to rest with a view of the sea.' },
  fountain: { name: 'Bumble Fountain', cat: 'sfeer', size: 2, cost: { stone: 60, coins: 40 }, time: 20, decor: 12, ach: 'honey', desc: 'A fountain topped with a golden bumblebee. Adds a lot of happiness.' },
  tavern: { lvl: 2, max: 1, name: 'Tavern', cat: 'dorp', size: 2, cost: { wood: 50, stone: 30, coins: 10 }, time: 18, job: 'innkeeper', slots: 1, desc: 'A warm place to gather after work. With an innkeeper it lifts everyone\'s mood.' },
  school: { lvl: 2, max: 1, name: 'Schoolhouse', cat: 'dorp', size: 2, cost: { wood: 45, stone: 35 }, time: 18, job: 'teacher', slots: 1, desc: 'With a teacher, villagers learn clever tricks and work 10% faster.' },
  belltower: { lvl: 3, max: 1, name: 'Bell Tower', cat: 'dorp', size: 1, cost: { stone: 90, coins: 30 }, time: 24, decor: 10, desc: 'Rings in every new day. A proud landmark that adds a lot of charm.' },
  harbour: { lvl: 3, max: 1, name: 'Harbour', cat: 'dorp', size: 2, cost: { wood: 80, stone: 50, coins: 40 }, time: 26, job: 'docker', slots: 1, nearWater: true, desc: 'With a dockhand, a trading ship calls every morning with well-paid orders. Must stand close to the water.' },
  pasture: { lvl: 2, name: 'Sheep Pasture', cat: 'grond', size: 3, cost: { wood: 35 }, time: 14, job: 'shepherd', slots: 1, desc: 'A shepherd shears the sheep for wool. The weaver turns wool into cloth.' },
  weaver: { lvl: 2, name: 'Weaver', cat: 'grond', size: 2, cost: { wood: 35, stone: 15 }, time: 14, job: 'weaver', slots: 1, desc: 'Weaves 2 wool into 1 cloth. Cloth keeps villagers warm and sells well.' },
  hedge: { name: 'Hedge', cat: 'sfeer', size: 1, cost: { wood: 1 }, time: 2, decor: 1, quick: true, desc: 'A tidy green hedge to frame gardens and squares.' },
  statue: { ach: 'helper', name: 'Founder\'s Statue', cat: 'sfeer', size: 1, cost: { stone: 40, coins: 30 }, time: 12, decor: 8, desc: 'A thank-you from the villagers you helped. Adds charm.' },
  academy: { lvl: 2, max: 1, name: 'Academy', cat: 'dorp', size: 2, cost: { wood: 60, stone: 50, coins: 30 }, time: 22, job: 'scholar', slots: 2, desc: 'Scholars gather insight. Spend it here on research that unlocks new buildings, upgrades and clever tricks.' },
  townhall: { tech: 'civics', max: 1, name: 'Town Hall', cat: 'dorp', size: 2, cost: { stone: 80, brick: 30, coins: 60 }, time: 30, decor: 12, desc: 'The proud heart of a real town. Collects a little tax every morning.' },
  bathhouse: { tech: 'springs', max: 1, name: 'Bathhouse', cat: 'dorp', size: 2, cost: { stone: 50, brick: 15, coins: 20 }, time: 20, job: 'attendant', slots: 1, desc: 'A hot soak after a long day. With an attendant it makes everyone happier.' },
  watchtower: { tech: 'watch', max: 1, name: 'Watchtower', cat: 'dorp', size: 1, cost: { wood: 40, stone: 10 }, time: 14, job: 'guard', slots: 1, desc: 'A watchman keeps foxes away from the sheep and warns farmers before a storm.' },
  mine: { tech: 'mining', name: 'Mine', cat: 'grond', size: 2, cost: { wood: 50, coins: 20 }, time: 20, job: 'miner', slots: 2, nearRock: true, desc: 'Miners dig stone that never runs out. Must stand at the foot of rocky ground.' },
  brickworks: { tech: 'masonry', name: 'Brickworks', cat: 'grond', size: 2, cost: { wood: 30, stone: 40 }, time: 16, job: 'brickmaker', slots: 2, desc: 'Fires 2 stone and 1 wood into a brick. Bricks pay for upgrades and grand buildings.' },
  orchard: { tech: 'orchards', name: 'Orchard', cat: 'voedsel', size: 3, cost: { wood: 30 }, time: 14, job: 'picker', slots: 2, desc: 'Fruit pickers bring baskets of apples from spring to autumn. The trees rest in winter.' },
  ciderpress: { tech: 'orchards', name: 'Cider Press', cat: 'voedsel', size: 2, cost: { wood: 40, stone: 20 }, time: 16, job: 'brewer', slots: 1, desc: 'Presses 4 food into a jug of cider. Cider cheers the village and sells well.' },
  greenhouse: { tech: 'glass', name: 'Greenhouse', cat: 'voedsel', size: 2, cost: { wood: 30, brick: 20 }, time: 18, job: 'gardener', slots: 1, desc: 'A gardener grows vegetables under glass, even in the middle of winter.' },
  pond: { lvl: 1, name: 'Duck Pond', cat: 'sfeer', size: 2, cost: { stone: 15 }, time: 8, decor: 5, desc: 'A quiet pond with reeds, lilies and a pair of ducks.' },
  gazebo: { ach: 'explorer', name: 'Gazebo', cat: 'sfeer', size: 1, cost: { wood: 25, coins: 10 }, time: 8, decor: 5, desc: 'A shady little pavilion. A reward for exploring the whole island.' },
  bandstand: { tech: 'civics', max: 1, name: 'Bandstand', cat: 'sfeer', size: 2, cost: { wood: 40, coins: 30 }, time: 16, decor: 6, desc: 'Music on the green. Festivals last half as long again.' },
};
// Pacing: later buildings cost clearly more, so each new village level is something to work towards.
for (const t of Object.keys(BT)) {
  const d = BT[t], k = t === 'lighthouse' ? 1.3 : d.tech ? 1.5 : (d.lvl || 0) >= 3 ? 1.5 : (d.lvl || 0) === 2 ? 1.4 : (d.lvl || 0) === 1 ? 1.2 : 1;
  if (k > 1 && d.cost) for (const r of Object.keys(d.cost)) d.cost[r] = Math.max(1, Math.round(d.cost[r] * k / 5) * 5);
}
// One place for the tempo of the game. Early steps are quick; each later stage takes clearly longer.
const PACE = {
  arrive: [[4, 25], [9, 40], [11, 80], [14, 120], [18, 150], [26, 200], [34, 250], [40, 300]],   // [villagers, seconds until the next settler]
  build: [1.15, 1.35, 1.6, 1.8],      // build-time factor for camp / hamlet / village / town buildings
  scholar: 15,                        // seconds of study per point of insight
  mission: 100,                       // seconds between new requests
};
function arriveGap(pop) {
  const a = PACE.arrive;
  for (let q = 1; q < a.length; q++) if (pop <= a[q][0]) return lerp(a[q - 1][1], a[q][1], clamp((pop - a[q - 1][0]) / (a[q][0] - a[q - 1][0]), 0, 1));
  return a[a.length - 1][1];
}
const buildSlow = (d) => (d.quick ? 1 : PACE.build[Math.min(3, d.tech ? Math.max(2, d.lvl || 0) : d.lvl || 0)]);
const CATS = [['dorp', 'Village'], ['voedsel', 'Food'], ['grond', 'Materials'], ['sfeer', 'Decor']];
const TRADES = [
  { give: 'wood', n: 10, get: 'coins', m: 5 }, { give: 'stone', n: 10, get: 'coins', m: 7 }, { give: 'food', n: 10, get: 'coins', m: 6 },
  { give: 'grain', n: 5, get: 'coins', m: 4 }, { give: 'honey', n: 1, get: 'coins', m: 3 }, { give: 'wool', n: 4, get: 'coins', m: 5 }, { give: 'cloth', n: 1, get: 'coins', m: 6 }, { give: 'cider', n: 1, get: 'coins', m: 7 },
  { give: 'coins', n: 10, get: 'wood', m: 10 }, { give: 'coins', n: 12, get: 'stone', m: 10 }, { give: 'coins', n: 10, get: 'food', m: 10 }, { give: 'coins', n: 18, get: 'brick', m: 5 },
];
const NAMES = ['Alice', 'Ben', 'Clara', 'Dan', 'Ella', 'Finn', 'Grace', 'Hugo', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olive', 'Pip', 'Quinn', 'Rose', 'Sam', 'Tess', 'Una', 'Vince', 'Wren', 'Zoe', 'Amos', 'Bea', 'Cole', 'Dot', 'Eli', 'Fay', 'Gus', 'Hazel', 'Ike', 'June', 'Kit', 'Lily', 'Max', 'Nell', 'Otis', 'Pearl', 'Reed', 'Sage', 'Theo', 'Violet', 'Wade', 'Poppy', 'Jasper', 'Mabel'];
const DAY_LEN = 170, MAX_POP = 40;

const G = {};
let buildGroup, villGroup;
const isNight = () => G.time >= 0.725 && G.time < 0.955;
const dist2 = (ax, az, bx, bz) => (ax - bx) * (ax - bx) + (az - bz) * (az - bz);
const countDone = (type) => G.buildings.reduce((n, b) => n + (b.type === type && b.done ? 1 : 0), 0);
const jobCount = (job) => G.villagers.reduce((n, v) => n + (v.job && v.job.def.job === job ? 1 : 0), 0);
const bedCount = () => G.buildings.reduce((n, b) => n + (b.done ? bedsOf(b) : 0), 0);
const canAfford = (cost) => !cost || G.mode === 'sandbox' || Object.keys(cost).every((r) => G.res[r] >= cost[r]);
const staffed = (type) => G.buildings.some((b) => b.type === type && b.done && b.workers.length > 0);
const workSpeed = () => (G.hungry ? 0.6 : 1) * lerp(0.85, 1.15, G.happy / 100) * (G.taught ? 1.1 : 1);

// ----- placement -----
function eachTile(i0, j0, size, fn) { for (let j = j0; j < j0 + size; j++) for (let i = i0; i < i0 + size; i++) fn(tileIdx(i, j), i, j); }
function findShoreSpot(i0, j0, size, maxD) {
  let best = null, bd = 1e9;
  const cx = i0 + size / 2 - 0.5, cz = j0 + size / 2 - 0.5;
  for (let j = j0 - maxD; j < j0 + size + maxD; j++) for (let i = i0 - maxD; i < i0 + size + maxD; i++) {
    if (!inGrid(i, j) || (i >= i0 && i < i0 + size && j >= j0 && j < j0 + size)) continue;
    const k = tileIdx(i, j);
    if (W.type[k] === T_WATER || W.solid[k] || W.occ[k]) continue;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (!inGrid(i + di, j + dj) || W.type[tileIdx(i + di, j + dj)] !== T_WATER) continue;
      const d = dist2(i, j, cx, cz) + (W.natK[k] ? 9 : 0);      // rather not fish from inside a bush
      if (d < bd) { bd = d; best = { k, fx: di, fz: dj }; }
    }
  }
  return best;
}
function canPlace(type, i0, j0) {
  const d = BT[type], s = d.size;
  let reason = null, mn = 1e9, mx = -1e9;
  for (let j = j0; j < j0 + s && !reason; j++) for (let i = i0; i < i0 + s && !reason; i++) {
    if (!inGrid(i, j) || i < 1 || j < 1 || i > N - 2 || j > N - 2) { reason = 'Off the island'; break; }
    const k = tileIdx(i, j), t = W.type[k];
    if (t === T_WATER) reason = 'Can\'t build on water';
    else if (t === T_ROCK) reason = 'Too rocky';
    else if (W.occ[k]) reason = 'Something is already here';
    else if (W.natK[k] === NAT_ROCK) reason = 'A rock is in the way';
    else if (W.natK[k] === NAT_SITE) reason = 'An old site lies here. Tap it to explore';
    else if (d.plant && (W.natK[k] || t !== T_GRASS)) reason = t !== T_GRASS ? 'Trees only grow on grass' : 'Something already grows here';
  }
  if (reason) return reason;
  for (let j = j0; j <= j0 + s; j++) for (let i = i0; i <= i0 + s; i++) { const h = vh(i, j); if (h < mn) mn = h; if (h > mx) mx = h; }
  if (mx - mn > 0.6) return 'Too steep';
  if (d.nearWater && !findShoreSpot(i0, j0, s, 3)) return 'Must be close to the water';
  if (d.nearRock) {
    let near = false;
    for (let j = j0 - 3; j < j0 + s + 3 && !near; j++) for (let i = i0 - 3; i < i0 + s + 3; i++) { if (inGrid(i, j) && (W.type[tileIdx(i, j)] === T_ROCK || W.natK[tileIdx(i, j)] === NAT_ROCK)) { near = true; break; } }
    if (!near) return 'Must stand next to rocks or rocky ground';
  }
  return null;
}
function localOf(b, i, j) {         // tile -> rounded local coords of a building (front = +z)
  const dx = i + 0.5 - HALF - b.cx, dz = j + 0.5 - HALF - b.cz, th = b.rot * Math.PI / 2, cs = Math.cos(th), sn = Math.sin(th);
  return [Math.round(dx * cs - dz * sn), Math.round(dx * sn + dz * cs)];
}
function toWorld(b, lx, lz) {
  const th = b.rot * Math.PI / 2, cs = Math.cos(th), sn = Math.sin(th);
  return [b.cx + lx * cs + lz * sn, b.cz - lx * sn + lz * cs];
}
function placeBuilding(type, i, j, rot, o) {
  o = o || {};
  const d = BT[type];
  if (d.plant) { addTree(i, j, Math.random() < 0.3 ? 1 : 0, 0.12, Math.random); G.stats.planted++; return null; }
  const b = {
    id: G.nextId++, type, def: d, i, j, size: d.size, rot: rot || 0, variant: o.variant !== undefined ? o.variant : (Math.random() * (d.variants || 1)) | 0,
    progress: o.done ? 1 : o.progress || 0, done: !!o.done, workers: [], residents: [], builders: 0, growth: o.growth || 0, t: Math.random() * 10, pop: 0,
    cx: i + d.size / 2 - HALF, cz: j + d.size / 2 - HALF, y: 0, harvester: null, baking: 0, warn: null,
  };
  eachTile(i, j, d.size, (k) => { clearNat(k); W.occ[k] = b.id; });
  if (d.flat) { b.done = true; b.progress = 1; b.y = W.tileH[tileIdx(i, j)]; paintTile(tileIdx(i, j), 1); }
  else {
    b.y = o.y !== undefined ? o.y : footprintHeight(i, j, d.size);
    flattenArea(i, j, d.size, b.y);
    b.fieldTiles = [];
    const th = b.rot * Math.PI / 2, cs = Math.cos(th), sn = Math.sin(th);
    eachTile(i, j, d.size, (k, ti, tj) => {
      let solid = !d.walk, paint = d.size > 1 ? 2 : 0;
      if (type === 'farm' || type === 'pasture') {
        const l = localOf(b, ti, tj);
        if (l[1] >= 0) {
          paint = type === 'farm' ? 3 : 0;
          if (type === 'farm' && l[0] === 1 && l[1] === 1) solid = true;                 // the scarecrow stands here
          else { solid = false; b.fieldTiles.push(k); }
          // the fence closes the outer edges of the field; the gate is the middle of the front
          const edges = [];
          if (l[0] === -1) edges.push([-1, 0]); if (l[0] === 1) edges.push([1, 0]); if (l[1] === 1 && l[0] !== 0) edges.push([0, 1]);
          for (const e of edges) { const dx = Math.round(e[0] * cs + e[1] * sn), dz = Math.round(-e[0] * sn + e[1] * cs); W.fence[k] |= dx > 0 ? 1 : dx < 0 ? 2 : dz > 0 ? 4 : 8; }
        }
      }
      if (type === 'center') { paint = 1; const l = localOf(b, ti, tj); solid = !(l[0] === 0 && l[1] === 1); }   // tents, fire and benches fill the green
      W.solid[k] = solid ? 1 : 0; paintTile(k, paint);
    });
    // trees that would poke through the walls make room
    const m = d.size > 1 ? 0.45 : 0.25, x0 = i - HALF - m, x1 = i + d.size - HALF + m, z0 = j - HALF - m, z1 = j + d.size - HALF + m;
    for (let q = j - 1; q <= j + d.size; q++) for (let p = i - 1; p <= i + d.size; p++) {
      if (!inGrid(p, q)) continue;
      const k = tileIdx(p, q);
      if (W.natK[k] === NAT_TREE) { const t = trees[W.natI[k]]; if (t.x > x0 && t.x < x1 && t.z > z0 && t.z < z1) removeTree(t); }
    }
    const g = b.mesh = makeBuildingGroup(type, b.variant);
    g.position.set(b.cx, b.y, b.cz); g.rotation.y = b.rot * Math.PI / 2;
    if (!b.done) {
      b.scaffold = new THREE.Mesh(cachedGeo('scaf' + d.size, () => mScaffold(d.size)), MAT.main); b.scaffold.castShadow = true;
      if (d.size > 1) g.add(b.scaffold);
      g.userData.body.scale.y = 0.1;
    }
    buildGroup.add(g);
    if (d.nearWater || type === 'fisher') b.shore = findShoreSpot(i, j, d.size, 4);
    if (o.up) { b.up = 1; applyUpgradeLook(b); }
  }
  G.buildings.push(b); G.bmap.set(b.id, b); W.nav++;
  if (!o.silent && !d.flat) for (const v of G.villagers) {        // anyone standing on the plot steps aside first
    if (v.state === 'sleep' || !v.mesh.visible) continue;
    const k = curTile(v), ti = k % N, tj = (k / N) | 0;
    if (ti >= i && ti < i + d.size && tj >= j && tj < j + d.size && W.solid[k]) { clearPlan(v); v.plan.push(go(accessTiles(b), 'Stepping aside')); }
  }
  if (b.done && !o.silent) onBuilt(b, true);
  return b;
}
function onBuilt(b, quiet) {
  b.done = true; b.progress = 1;
  if (b.mesh) { if (b.scaffold) b.mesh.remove(b.scaffold); b.scaffold = null; b.mesh.userData.body.scale.y = 1; }
  if (!quiet) {
    b.pop = 1;
    if (!b.def.quick) { sfx('done', hearK(b.cx, b.cz)); toast(b.def.name + ' is finished!', 'good'); }
    puff(b.cx, b.y + 0.2, b.cz, [0xe8d9b0, 0xffffff, 0xd9c79a], 14, { spread: b.size * 0.4, speed: 1.2, up: 1.5, life: 0.8, size: 0.12 });
    G.stats.built[b.type] = (G.stats.built[b.type] || 0) + 1;
    if (b.def.job) assignWorker(b);
    if (b.type === 'lighthouse' && !G.won) { G.won = true; G.fireworks = 14; winMoment(); }
    if (b.type === 'greathive' && !G.finale) finale();
  }
  if (bedsOf(b)) assignHomes();
  G.critDirty = true;
}
function demolish(b, full) {
  if (b.type === 'center') return;
  const d = b.def;
  if (d.cost && G.mode !== 'sandbox') for (const r of Object.keys(d.cost)) G.res[r] += Math.floor(d.cost[r] * (full || !b.done ? 1 : 0.5));
  while (b.workers.length) unassignWorker(b);
  for (const v of G.villagers) {
    if (v.home === b) v.home = null;
    if (v.buildSite === b || v.inside === b) clearPlan(v);
  }
  eachTile(b.i, b.j, b.size, (k) => { W.occ[k] = 0; W.solid[k] = 0; W.fence[k] = 0; paintTile(k, 0); });
  if (b.mesh) buildGroup.remove(b.mesh);
  G.buildings.splice(G.buildings.indexOf(b), 1); G.bmap.delete(b.id);
  W.nav++; G.critDirty = true;
  assignHomes();
  puff(b.cx, b.y + 0.3, b.cz, [0xcbb894, 0x9a8a6a], 12, { spread: b.size * 0.4, speed: 1, life: 0.7, size: 0.12 });
  sfx('fall', hearK(b.cx, b.cz));
}
function accessTiles(b) {
  const out = [], fb = [];
  const f = toWorld(b, 0, b.size / 2 + 0.5), fi = worldToTile(f[0]), fj = worldToTile(f[1]);
  for (let j = b.j - 1; j <= b.j + b.size; j++) for (let i = b.i - 1; i <= b.i + b.size; i++) {
    if (!inGrid(i, j)) continue;
    const inside = i >= b.i && i < b.i + b.size && j >= b.j && j < b.j + b.size, k = tileIdx(i, j);
    if (W.type[k] === T_WATER) continue;
    if (inside) { if (!W.solid[k]) out.push(k); continue; }
    if (W.solid[k]) { fb.push(k); continue; }
    if (i === fi && j === fj) out.unshift(k); else out.push(k);
  }
  const clean = out.filter((k) => !W.natK[k]);          // rather not stand inside a tree or bush
  return clean.length ? clean : out.length ? out : fb;
}
function standNear(i, j) {          // ground next to a tree or bush, free tiles first
  const clean = [], any = [];
  for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
    const p = i + di, q = j + dj;
    if ((!di && !dj) || !inGrid(p, q)) continue;
    const k = tileIdx(p, q);
    if (W.type[k] === T_WATER || W.solid[k] || W.fence[k]) continue;
    any.push(k); if (!W.natK[k]) clean.push(k);
  }
  return clean.length ? clean : any.length ? any : [tileIdx(i, j)];
}
function besideBuilding(i, j) {
  for (let q = j - 1; q <= j + 1; q++) for (let p = i - 1; p <= i + 1; p++) {
    if (!inGrid(p, q)) continue;
    const b = G.bmap.get(W.occ[tileIdx(p, q)]);
    if (b && !b.def.flat) return true;
  }
  return false;
}
// Would a building here cut off part of the village? Floods the walkable ground from the green.
const _reach = new Uint8Array(N * N), _reach2 = new Uint8Array(N * N), _fq = new Int32Array(N * N);
let _reachNav = -1, _reachN = 0;
function floodReach(out, i0, j0, s) {
  out.fill(0);
  const c = G.center, f = toWorld(c, 0, 1), sk = tileIdx(worldToTile(f[0]), worldToTile(f[1]));
  let head = 0, tail = 0;
  out[sk] = 1; _fq[tail++] = sk;
  while (head < tail) {
    const k = _fq[head++], i = k % N, j = (k / N) | 0, fk = W.fence[k];
    for (let d = 0; d < 4; d++) {
      const ni = i + (d === 0 ? 1 : d === 1 ? -1 : 0), nj = j + (d === 2 ? 1 : d === 3 ? -1 : 0);
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue;
      const nk = nj * N + ni;
      if (out[nk] || W.type[nk] === T_WATER || W.solid[nk]) continue;
      if (s && ni >= i0 && ni < i0 + s && nj >= j0 && nj < j0 + s) continue;
      if ((fk & (1 << d)) || (W.fence[nk] & (1 << (d ^ 1)))) continue;
      out[nk] = 1; _fq[tail++] = nk;
    }
  }
  return tail;
}
function canReach(k) {            // can a villager walk there from the green without squeezing through a building?
  if (_reachNav !== W.nav) { _reachN = floodReach(_reach, 0, 0, 0); _reachNav = W.nav; }
  return _reach[k] === 1;
}
function ringReached(bi, bj, bs, arr) {
  for (let j = bj - 1; j <= bj + bs; j++) for (let i = bi - 1; i <= bi + bs; i++) {
    if (!inGrid(i, j) || (i >= bi && i < bi + bs && j >= bj && j < bj + bs)) continue;
    if (arr[tileIdx(i, j)]) return true;
  }
  return false;
}
function sealsOff(type, i0, j0, rot) {
  const d = BT[type];
  if (d.flat || d.plant || !G.center) return null;
  if (_reachNav !== W.nav) { _reachN = floodReach(_reach, 0, 0, 0); _reachNav = W.nav; }
  let covered = 0;
  eachTile(i0, j0, d.size, (k) => { if (_reach[k]) covered++; });
  const after = floodReach(_reach2, i0, j0, d.size);
  if (_reachN - covered - after > 3) return 'Would block the way';
  if (!ringReached(i0, j0, d.size, _reach2)) return 'Villagers could not reach it';
  if (type === 'farm' || type === 'pasture') {
    const th = (rot || 0) * Math.PI / 2, gx = i0 + 1.5 - HALF + 2 * Math.sin(th), gz = j0 + 1.5 - HALF + 2 * Math.cos(th), gi = worldToTile(gx), gj = worldToTile(gz);
    if (!inGrid(gi, gj) || !_reach2[tileIdx(gi, gj)] || W.fence[tileIdx(gi, gj)]) return 'The gate would be blocked. Rotate it';
  }
  for (const b of G.buildings) {
    if (b.def.flat || b.type === 'center') continue;
    if (ringReached(b.i, b.j, b.size, _reach) && !ringReached(b.i, b.j, b.size, _reach2)) return 'Would block the way to the ' + b.def.name;
  }
  return null;
}

// ----- pathfinding (A* on the tile grid) -----
const _pg = new Float32Array(N * N), _pf = new Int32Array(N * N), _ps = new Uint32Array(N * N), _pc = new Uint32Array(N * N), _pgoal = new Uint32Array(N * N);
let _pstamp = 0;
const _heapK = [], _heapF = [];
function hPush(k, f) {
  let n = _heapK.length; _heapK.push(k); _heapF.push(f);
  while (n > 0) { const p = (n - 1) >> 1; if (_heapF[p] <= f) break; _heapK[n] = _heapK[p]; _heapF[n] = _heapF[p]; n = p; }
  _heapK[n] = k; _heapF[n] = f;
}
function hPop() {
  const top = _heapK[0], lk = _heapK.pop(), lf = _heapF.pop(), len = _heapK.length;
  if (len) {
    let n = 0;
    for (;;) {
      let c = n * 2 + 1; if (c >= len) break;
      if (c + 1 < len && _heapF[c + 1] < _heapF[c]) c++;
      if (_heapF[c] >= lf) break;
      _heapK[n] = _heapK[c]; _heapF[n] = _heapF[c]; n = c;
    }
    _heapK[n] = lk; _heapF[n] = lf;
  }
  return top;
}
function stepCost(k) {
  const t = W.type[k];
  if (t === T_WATER) return -1;
  let c = (W.paint[k] === 1 ? 0.55 : t === T_SAND ? 1.25 : t === T_ROCK ? 1.8 : 1) + (W.solid[k] ? 200 : 0);     // through a building only when truly walled in
  const n = W.natK[k];                                   // walk around trees and bushes where there is room
  if (n === NAT_TREE) { if (trees[W.natI[k]].size > 0.4) c += 5; } else if (n === NAT_BUSH) c += 3;
  return c;
}
function findPath(sk, goals) {
  if (!goals || !goals.length) return null;
  const st = ++_pstamp;
  let gx = 0, gz = 0;
  for (const g of goals) { _pgoal[g] = st; gx += g % N; gz += (g / N) | 0; }
  gx /= goals.length; gz /= goals.length;
  let gr = 0;
  for (const g of goals) gr = Math.max(gr, Math.hypot(g % N - gx, ((g / N) | 0) - gz));
  if (_pgoal[sk] === st) return [];
  const H = (k) => Math.max(0, Math.hypot(k % N - gx, ((k / N) | 0) - gz) - gr) * 0.55;
  _heapK.length = 0; _heapF.length = 0;
  _pg[sk] = 0; _ps[sk] = st; _pf[sk] = -1; hPush(sk, H(sk));
  let found = -1;
  while (_heapK.length) {
    const k = hPop();
    if (_pc[k] === st) continue;
    _pc[k] = st;
    if (_pgoal[k] === st) { found = k; break; }
    const i = k % N, j = (k / N) | 0, g = _pg[k];
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue;
      const ni = i + di, nj = j + dj;
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue;
      const nk = nj * N + ni;
      if (_pc[nk] === st) continue;
      const c = stepCost(nk);
      if (c < 0) continue;
      const fk = W.fence[k], fn = W.fence[nk];             // fences: only through the gate
      if (fk || fn) { if (di && dj) continue; if ((fk & (di > 0 ? 1 : di < 0 ? 2 : dj > 0 ? 4 : 8)) || (fn & (di > 0 ? 2 : di < 0 ? 1 : dj > 0 ? 8 : 4))) continue; }
      if (di && dj) { if (stepCost(j * N + ni) < 0 || stepCost(nj * N + i) < 0 || W.solid[j * N + ni] || W.solid[nj * N + i]) continue; }
      const ng = g + c * (di && dj ? 1.414 : 1);
      if (_ps[nk] !== st || ng < _pg[nk]) { _pg[nk] = ng; _ps[nk] = st; _pf[nk] = k; hPush(nk, ng + H(nk)); }
    }
  }
  if (found < 0) return null;
  const path = [];
  for (let k = found; k !== sk && k >= 0; k = _pf[k]) path.push(k);
  return path.reverse();
}

// ----- villagers -----
function spawnVillager(x, z, o) {
  o = o || {};
  const used = new Set(G.villagers.map((v) => v.name));
  const free = NAMES.filter((n) => !used.has(n));
  const v = {
    id: G.nextId++, name: o.name || (free.length ? pick(free) : pick(NAMES)), x, z, y: heightAt(x, z), rot: Math.random() * TAU,
    skin: o.skin !== undefined ? o.skin : (Math.random() * 4) | 0, hair: o.hair !== undefined ? o.hair : (Math.random() * 5) | 0,
    talent: o.talent || pick(TALENT_JOBS),
    job: null, home: null, state: 'awake', plan: [], path: null, pi: 0, carry: null, hold: false, target: null, buildSite: null, inside: null,
    anim: 'idle', animT: Math.random() * 10, moving: false, say: 'Looking around', off: [rand(-0.18, 0.18), rand(-0.18, 0.18)], goingHome: false,
  };
  v.mesh = makeVillagerMesh(v); v.mesh.position.set(x, v.y, z);
  villGroup.add(v.mesh); G.villagers.push(v);
  return v;
}
function clearPlan(v) {
  if (v.target) { v.target.res = false; v.target = null; }
  if (v.buildSite) { v.buildSite.builders = Math.max(0, v.buildSite.builders - 1); v.buildSite = null; }
  if (v.job && v.job.harvester === v) v.job.harvester = null;
  if (v.inside) { v.inside.baking = Math.max(0, v.inside.baking - 1); v.inside = null; if (v.state !== 'sleep') v.mesh.visible = true; }
  if (v.sitB) { if (v.sitB.sitter === v) v.sitB.sitter = null; v.sitB = null; }
  if (v.exploring) { if (v.exploring.busy === v) v.exploring.busy = null; v.exploring = null; }      // called away: the site is free for someone else
  v.plan.length = 0; v.path = null; v.moving = false; v.anim = 'idle'; v.goingHome = false;
  v.mesh.userData.rod.visible = false;
}
function setCarry(v, res, amt, kind) {
  v.carry = { res, amt, kind: kind || res };
  const c = v.mesh.userData.carry; c.geometry = carryGeo(kind || res); c.visible = true;
}
function assignWorker(b, v) {
  if (!b.def.job || !b.done || b.workers.length >= slotsOf(b)) return false;
  if (!v) {
    let bd = 1e9;        // the nearest free villager, but someone with a talent for the job goes first
    for (const c of G.villagers) { if (c.job) continue; const d = dist2(c.x, c.z, b.cx, b.cz) - (c.talent === b.def.job ? 5000 : 0); if (d < bd) { bd = d; v = c; } }
  }
  if (!v) return false;
  if (v.job) unassignWorker(v.job, v);
  const asleep = v.state === 'sleep';
  clearPlan(v);
  if (v.carry) dropCarry(v);
  v.job = b; b.workers.push(v); refreshVillagerLook(v);
  if (asleep) v.mesh.visible = false;
  return true;
}
function unassignWorker(b, v) {
  v = v || b.workers[b.workers.length - 1];
  if (!v) return false;
  b.workers.splice(b.workers.indexOf(v), 1);
  clearPlan(v); v.hold = false;
  if (v.carry) dropCarry(v);
  v.job = null; refreshVillagerLook(v);
  return true;
}
function dropCarry(v) { if (v.carry) { G.res[v.carry.res] += v.carry.amt; v.carry = null; } v.hold = false; v.mesh.userData.carry.visible = false; }
function assignHomes() {
  const houses = G.buildings.filter((b) => b.done && b.type === 'house');
  for (const h of houses) h.residents = [];
  for (const v of G.villagers) { if (v.home && v.home.type === 'house' && G.bmap.has(v.home.id)) v.home.residents.push(v); else v.home = null; }
  for (const v of G.villagers) {
    if (v.home) continue;
    const h = houses.find((q) => q.residents.length < bedsOf(q));
    if (h) { v.home = h; h.residents.push(v); }
  }
}
function nearestStorage(v) {
  let best = null, bd = 1e9;
  for (const b of G.buildings) { if (!b.done || !b.def.storage) continue; const d = dist2(v.x, v.z, b.cx, b.cz); if (d < bd) { bd = d; best = b; } }
  return best;
}
const curTile = (v) => tileIdx(clamp(worldToTile(v.x), 0, N - 1), clamp(worldToTile(v.z), 0, N - 1));
function go(goals, say) { return { t: 'go', goals: Array.isArray(goals) ? goals : [goals], say }; }
function act(dur, anim, say, extra) { return Object.assign({ t: 'do', dur, anim, say, el: 0 }, extra || {}); }
function call(fn) { return { t: 'fn', fn }; }
function idleAt(v, b, say) { b.warn = say; v.plan.push(go(accessTiles(b), 'Walking to the ' + b.def.name.toLowerCase()), act(4, 'idle', say)); }

function think(v) {
  v.anim = 'idle';
  if (isNight()) {
    v.goingHome = true;
    const home = v.home || G.center;
    v.plan.push(go(accessTiles(home), 'Heading to bed'), call((q) => { q.state = 'sleep'; q.mesh.visible = false; q.say = q.home ? 'Asleep at home' : 'Asleep in a tent on the green'; }));
    return;
  }
  if (v.carry) {
    const st = nearestStorage(v);
    v.plan.push(go(accessTiles(st), 'Carrying ' + RES[v.carry.res].toLowerCase() + ' to storage'), call(deposit));
    return;
  }
  // evenings are for the tavern, a bench or the fire; during a festival the free villagers dance all day
  if ((isEvening() || (G.festival > 0 && !v.job && Math.random() < 0.5)) && !(v.job && NO_BREAK.includes(v.job.def.job)) && leisure(v, false)) return;
  if (!v.job) return thinkFree(v);
  v.job.warn = null;
  JOB_THINK[v.job.def.job](v, v.job);
}
function deposit(v) {
  const c = v.carry; if (!c) return;
  const got = store(c.res, c.amt);
  if (c.res === 'honey') G.stats.honey += c.amt;
  floatText(v.x, v.y + 0.9, v.z, got ? '+' + got : 'Full', c.res);
  sfx('drop', hearK(v.x, v.z) * 0.6);
  v.carry = null; v.mesh.userData.carry.visible = false;
}
function thinkFree(v) {
  let site = null, bs = 1e9;
  for (const b of G.buildings) {
    if (b.done) continue;
    const s = b.builders * 60 + Math.sqrt(dist2(v.x, v.z, b.cx, b.cz));
    if (s < bs) { bs = s; site = b; }
  }
  if (site) {
    site.builders++; v.buildSite = site;
    v.plan.push(go(accessTiles(site), 'Walking to the building site'), { t: 'build', b: site, el: 0 });
    return;
  }
  if (G.season === 3 && W.snowmen.length < 5 && Math.random() < 0.3 && planSnowman(v)) return;
  if (Math.random() < 0.3 && leisure(v, true)) return;
  const c = G.center;
  for (let q = 0; q < 12; q++) {
    const i = worldToTile(c.cx + rand(-4.5, 4.5)), j = worldToTile(c.cz + rand(-4.5, 4.5));
    if (!inGrid(i, j)) continue;
    const k = tileIdx(i, j);
    if (W.type[k] === T_WATER || W.solid[k] || W.natK[k] || W.fence[k] || !canReach(k)) continue;
    v.plan.push(go(k, 'Strolling through the village'), act(rand(2.5, 6), 'idle', pick(['Enjoying the view', 'Warming up by the fire', 'Chatting on the green', 'Listening to the bumblebees', 'Nothing to do for a moment'])));
    return;
  }
  v.plan.push(act(2, 'idle', 'Looking around'));
}
const JOB_THINK = {
  lumber(v, b) {
    let best = null, bd = 1e9; const r2 = b.def.radius * b.def.radius;
    for (const t of trees) {
      if (!t || t.state !== 0 || t.size < 0.75 || t.res || dist2(t.x, t.z, b.cx, b.cz) > r2) continue;
      const d = dist2(t.x, t.z, v.x, v.z); if (d < bd) { bd = d; best = t; }
    }
    if (!best) return idleAt(v, b, 'No grown trees nearby');
    best.res = true; v.target = best;
    v.plan.push(go(standNear(best.i, best.j), 'Walking to a tree'), { t: 'near', o: best, d: 0.58 }, act(4.5, 'chop', 'Felling a tree', {
      face: best, hit: 0.7, onHit(q) { best.shake = 1; sfx('chop', hearK(q.x, q.z)); puff(best.x, best.y + 0.4, best.z, [0xc79b69, 0x9a6b42], 3, { speed: 1.2, life: 0.5, size: 0.05 }); },
    }), call((q) => {
      q.target = null;
      if (best.state !== 0) return;                         // the tree made way for a building meanwhile
      best.state = 1; best.fall = 0; best.res = false; best.replant = true; q.target = null; W.falling.push(best);
      if (W.natK[best.k] === NAT_TREE && W.natI[best.k] === best.idx) W.natK[best.k] = NAT_NONE;
      sfx('fall', hearK(q.x, q.z)); setCarry(q, 'wood', 4 + (hasTech('forestry') ? 2 : 0) + (b.up ? 2 : 0));
    }));
  },
  quarry(v, b) {
    let best = null, bd = 1e9; const r2 = b.def.radius * b.def.radius;
    for (const rk of rocks) { if (rk.amount <= 0 || dist2(rk.x, rk.z, b.cx, b.cz) > r2) continue; const d = dist2(rk.x, rk.z, v.x, v.z); if (d < bd) { bd = d; best = rk; } }
    const hit = { hit: 0.6, onHit(q) { sfx('mine', hearK(q.x, q.z)); puff(q.x + Math.sin(q.rot) * 0.3, q.y + 0.25, q.z + Math.cos(q.rot) * 0.3, [0xc2bfb6, 0x9f9c95], 2, { speed: 1, life: 0.45, size: 0.045 }); } };
    if (!best) {
      b.warn = 'No rocks nearby: working slower at the hut';
      v.plan.push(go(accessTiles(b), 'Walking to the quarry hut'), act(8, 'chop', 'Cutting stone at the hut', Object.assign({ face: { x: b.cx, z: b.cz } }, hit)), call((q) => setCarry(q, 'stone', 3)));
      return;
    }
    const goals = [];
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const i = best.i + di, j = best.j + dj; if ((!di && !dj) || !inGrid(i, j)) continue;
      const k = tileIdx(i, j); if (W.type[k] !== T_WATER && !W.solid[k]) goals.push(k);
    }
    v.plan.push(go(goals.length ? goals : best.k, 'Walking to a rock'), act(5.5, 'chop', 'Cutting stone', Object.assign({ face: best }, hit)), call((q) => {
      if (best.amount > 0) {
        best.amount -= 3;
        if (best.amount <= 0) { W.solid[best.k] = 0; W.natK[best.k] = NAT_NONE; W.nav++; }
        setRockMatrix(best);
      }
      setCarry(q, 'stone', 3 + (b.up ? 1 : 0));
    }));
  },
  forager(v, b) {
    let best = null, bd = 1e9; const r2 = b.def.radius * b.def.radius;
    for (const bu of bushes) { if (bu.gone || !bu.ripe || bu.res || dist2(bu.x, bu.z, b.cx, b.cz) > r2) continue; const d = dist2(bu.x, bu.z, v.x, v.z); if (d < bd) { bd = d; best = bu; } }
    if (!best) return idleAt(v, b, G.season === 3 ? 'Berries are scarce in winter' : 'Waiting for berries to ripen');
    best.res = true; v.target = best;
    v.plan.push(go(standNear(best.i, best.j), 'Walking to a berry bush'), { t: 'near', o: best, d: 0.44 }, act(3.5, 'bend', 'Picking berries', { face: best, hit: 0.8, onHit(q) { sfx('pick', hearK(q.x, q.z)); } }), call((q) => {
      q.target = null;
      if (best.gone) return;
      best.ripe = false; best.timer = 50; best.res = false; q.target = null; setBushMatrix(best); setCarry(q, 'food', 3 + (hasTech('woodlore') ? 1 : 0));
    }));
  },
  farmer(v, b) {
    const k = pick(b.fieldTiles);
    if (b.growth >= 1 && !b.harvester) {
      b.harvester = v;
      v.plan.push(go(k, 'Walking to the field'), act(4, 'bend', 'Harvesting the grain'), call((q) => { b.growth = 0; b.harvester = null; setCarry(q, 'grain', Math.round((8 + (b.up ? 3 : 0) + (G.season === 2 ? 3 : 0)) * (hasTech('guildfarm') ? 1.25 : 1))); }));
    } else v.plan.push(go(k, 'Walking to the field'), act(5, 'bend', b.growth >= 1 ? 'Tidying the field' : 'Tending the crop', { tick(q, dt) { b.growth = Math.min(1, b.growth + dt * 0.016 * farmK(b)); } }));
  },
  fisher(v, b) {
    if (!b.shore) b.shore = findShoreSpot(b.i, b.j, b.size, 5);
    if (!b.shore) return idleAt(v, b, 'Can\'t reach the water');
    const s = b.shore, fx = tileX(s.k % N) + s.fx, fz = tileX((s.k / N) | 0) + s.fz;
    v.plan.push(go(s.k, 'Walking to the shore'), act(7, 'fish', 'Fishing from the shore', { face: { x: fx, z: fz }, rod: true }), call((q) => {
      puff(fx, 0.05, fz, [0xffffff, 0xbfe9f5], 6, { speed: 0.8, up: 1.6, life: 0.5, size: 0.06 }); sfx('splash', hearK(q.x, q.z)); catchFish(q); setCarry(q, 'food', 4 + (G.season === 3 ? 2 : 0) + (hasTech('sealore') ? 2 : 0), 'fish');
    }));
  },
  baker(v, b) {
    if (v.hold) {
      v.plan.push(go(accessTiles(b), 'Carrying grain to the bakery'), call((q) => { q.hold = false; q.mesh.userData.carry.visible = false; q.inside = b; b.baking++; q.mesh.visible = false; }),
        act(6, 'idle', 'Baking bread'), call((q) => {
          q.inside = null; b.baking = Math.max(0, b.baking - 1); q.mesh.visible = true;
          G.stats.bread++; G.lastBread = G.clock; setCarry(q, 'food', (countDone('windmill') ? 11 : 7) + (b.up ? 2 : 0), 'bread');
        }));
    } else if (G.res.grain >= 3) {
      v.plan.push(go(accessTiles(nearestStorage(v)), 'Fetching grain from storage'), call((q) => {
        if (G.res.grain >= 3) { G.res.grain -= 3; q.hold = true; const c = q.mesh.userData.carry; c.geometry = carryGeo('grain'); c.visible = true; }
      }));
    } else idleAt(v, b, 'Waiting for grain from the farm');
  },
  bee(v, b) {
    v.plan.push(go(accessTiles(b), 'Walking to the apiary'), act(13, 'bend', 'Tending the bees', { face: { x: b.cx, z: b.cz } }), call((q) => {
      let fl = 0;
      for (const o of G.buildings) if (o.type === 'flowers' && o.done && dist2(o.cx, o.cz, b.cx, b.cz) < 30) fl++;
      b.bonus = fl >= 3 || hasTech('beelore'); setCarry(q, 'honey', b.bonus ? 2 : 1);
    }));
  },
  merchant(v, b) {
    v.plan.push(go(accessTiles(b), 'Walking to the market'), act(8, 'idle', 'Minding the stall', { face: { x: b.cx, z: b.cz } }));
  },
  innkeeper(v, b) { v.plan.push(go(accessTiles(b), 'Walking to the tavern'), act(8, 'idle', pick(['Polishing mugs', 'Sweeping the doorstep', 'Telling a tall tale']), { face: { x: b.cx, z: b.cz } })); },
  teacher(v, b) { v.plan.push(go(accessTiles(b), 'Walking to the schoolhouse'), act(8, 'idle', pick(['Teaching the alphabet', 'Chalking sums on the board', 'Reading a story aloud']), { face: { x: b.cx, z: b.cz } })); },
  docker(v, b) { v.plan.push(go(accessTiles(b), 'Walking to the harbour'), act(8, G.ship.state === 'docked' ? 'chop' : 'idle', G.ship.state === 'docked' ? 'Unloading the ship' : 'Watching the horizon', { face: { x: b.cx, z: b.cz } })); },
  shepherd(v, b) {
    if (G.foxUntil > G.clock) return v.plan.push(go(pick(b.fieldTiles), 'Walking to the pasture'), act(6, 'idle', 'Chasing off a fox'));
    v.plan.push(go(pick(b.fieldTiles), 'Walking to the pasture'), act(6, 'bend', 'Shearing a sheep'), call((q) => setCarry(q, 'wool', 2)));
  },
  weaver(v, b) {
    if (v.hold) {
      v.plan.push(go(accessTiles(b), 'Carrying wool to the loom'), call((q) => { q.hold = false; q.mesh.userData.carry.visible = false; q.inside = b; b.baking++; q.mesh.visible = false; }),
        act(8 * (hasTech('artisans') ? 0.7 : 1), 'idle', 'Weaving cloth'), call((q) => { q.inside = null; b.baking = Math.max(0, b.baking - 1); q.mesh.visible = true; G.stats.cloth++; setCarry(q, 'cloth', 1); }));
    } else if (G.res.wool >= 2) {
      v.plan.push(go(accessTiles(nearestStorage(v)), 'Fetching wool from storage'), call((q) => {
        if (G.res.wool >= 2) { G.res.wool -= 2; q.hold = true; const c = q.mesh.userData.carry; c.geometry = carryGeo('wool'); c.visible = true; }
      }));
    } else idleAt(v, b, 'Waiting for wool from the pasture');
  },
  scholar(v, b) {
    if (TECHS.every(techSettled)) return idleAt(v, b, 'Everything has been researched. The scholars can take another job');
    v.plan.push(go(accessTiles(b), 'Walking to the academy'), act(PACE.scholar * (hasTech('scholars') ? 0.75 : 1), 'idle', pick(['Studying old books', 'Scribbling notes', 'Arguing about the stars', 'Charting the tides']), { face: { x: b.cx, z: b.cz } }), call((q) => { G.rp++; G.stats.insight++; floatText(b.cx, b.y + 1.7, b.cz, '+1', 'rp'); }));
  },
  miner(v, b) {
    v.plan.push(go(accessTiles(b), 'Walking to the mine'), act(7, 'chop', 'Mining stone', { face: { x: b.cx, z: b.cz }, hit: 0.7, onHit(q) { sfx('mine', hearK(q.x, q.z)); } }), call((q) => setCarry(q, 'stone', 3)));
  },
  picker(v, b) {
    if (G.season === 3) return idleAt(v, b, 'The trees are bare in winter');
    v.plan.push(go(accessTiles(b), 'Walking to the orchard'), act(6, 'chop', 'Picking apples', { face: { x: b.cx, z: b.cz } }), call((q) => setCarry(q, 'food', hasTech('guildfarm') ? 6 : 5)));
  },
  gardener(v, b) {
    v.plan.push(go(accessTiles(b), 'Walking to the greenhouse'), act(10, 'bend', 'Tending seedlings', { face: { x: b.cx, z: b.cz } }), call((q) => setCarry(q, 'food', hasTech('guildfarm') ? 5 : 4)));
  },
  brewer(v, b) {
    processJob(v, b, { bring: 'Carrying apples to the press', fetch: 'Fetching fruit from storage', say: 'Pressing cider', wait: 'Waiting for spare food to press', dur: 8, carry: 'food',
      ready: () => G.res.food >= 4 + G.villagers.length * 3, take: () => { G.res.food -= 4; }, done: (q) => { G.stats.cider++; setCarry(q, 'cider', 1); } });
  },
  brickmaker(v, b) {
    processJob(v, b, { bring: 'Carrying clay and stone to the kiln', fetch: 'Fetching stone from storage', say: 'Firing bricks', wait: 'Waiting for spare stone and wood', dur: 7, carry: 'stone',
      ready: () => G.res.stone >= 40 && G.res.wood >= 25 && G.res.brick < capOf('brick'), take: () => { G.res.stone -= 2; G.res.wood -= 1; }, done: (q) => { G.stats.brick++; setCarry(q, 'brick', 1); } });
  },
  attendant(v, b) { v.plan.push(go(accessTiles(b), 'Walking to the bathhouse'), act(8, 'idle', pick(['Folding towels', 'Stoking the boiler', 'Testing the water']), { face: { x: b.cx, z: b.cz } })); },
  guard(v, b) { v.plan.push(go(accessTiles(b), 'Walking to the watchtower'), act(9, 'idle', pick(['Keeping watch', 'Scanning the tree line', 'Whistling a tune']), { face: { x: b.cx, z: b.cz } })); },
};
function processJob(v, b, o) {      // fetch the ingredients, work indoors, carry the product to storage
  if (v.hold) {
    v.plan.push(go(accessTiles(b), o.bring), call((q) => { q.hold = false; q.mesh.userData.carry.visible = false; q.inside = b; b.baking++; q.mesh.visible = false; }),
      act(o.dur * (hasTech('artisans') ? 0.7 : 1), 'idle', o.say), call((q) => { q.inside = null; b.baking = Math.max(0, b.baking - 1); q.mesh.visible = true; o.done(q); }));
  } else if (o.ready()) {
    v.plan.push(go(accessTiles(nearestStorage(v)), o.fetch), call((q) => { if (o.ready()) { o.take(); q.hold = true; const c = q.mesh.userData.carry; c.geometry = carryGeo(o.carry); c.visible = true; } }));
  } else idleAt(v, b, o.wait);
}

function updateVillager(v, dt) {
  if (v.state === 'sleep') {
    if (!isNight()) { v.state = 'awake'; v.mesh.visible = true; v.goingHome = false; v.plan.length = 0; v.say = 'Waking up'; }
    return;
  }
  if (isNight() && !v.goingHome) {
    const s = v.plan[0];
    if (!s || s.t === 'build' || (s.t === 'do' && s.anim === 'idle' && !v.inside) || (s.t === 'go' && !v.carry && !v.target && !v.hold)) clearPlan(v);
  }
  if (!v.plan.length) think(v);
  const s = v.plan[0];
  if (!s) return;
  const ws = workSpeed() * (v.job && v.job.def.job === v.talent ? 1.3 : 1);
  v.moving = false;
  if (s.say) v.say = s.say;
  if (s.t === 'go') {
    if (!v.path || v.navV !== W.nav) {
      if (s.goals.length === 1 && W.solid[s.goals[0]] && !v.carry) { clearPlan(v); return; }      // something was built where they were heading
      v.path = findPath(curTile(v), s.goals); v.pi = 0; v.navV = W.nav;
      if (!v.path) { clearPlan(v); v.plan.push(act(2, 'idle', 'Can\'t get there')); return; }
    }
    if (v.pi >= v.path.length) { v.path = null; v.plan.shift(); return; }
    const k = v.path[v.pi]; let tx = tileX(k % N) + v.off[0], tz = tileX((k / N) | 0) + v.off[1];
    const nk = W.natK[k];
    if (nk === NAT_TREE || nk === NAT_BUSH) {               // no way around: at least pass beside the trunk
      const o = nk === NAT_TREE ? trees[W.natI[k]] : bushes[W.natI[k]], need = nk === NAT_BUSH ? 0.4 : o.size > 0.4 ? 0.42 : 0;
      let ox = tx - o.x, oz = tz - o.z, ol = Math.hypot(ox, oz);
      if (ol < need) { if (ol < 0.01) { ox = 1; oz = 0; ol = 1; } tx = o.x + ox / ol * need; tz = o.z + oz / ol * need; }
    }
    const dx = tx - v.x, dz = tz - v.z, d = Math.hypot(dx, dz);
    const sp = 1.55 * (hasTech('barrows') ? 1.15 : 1) * (W.paint[curTile(v)] === 1 ? (G.civic.streets ? 1.75 : 1.45) : 1) * (0.7 + 0.3 * ws) * dt;
    if (d <= sp) { v.x = tx; v.z = tz; v.pi++; }
    else { v.x += dx / d * sp; v.z += dz / d * sp; }
    if (d > 0.001) { const tr = Math.atan2(dx, dz); let df = tr - v.rot; while (df > Math.PI) df -= TAU; while (df < -Math.PI) df += TAU; v.rot += df * Math.min(1, dt * 10); }
    v.moving = true; v.y = heightAt(v.x, v.z);
  } else if (s.t === 'sit') {                                // take a seat on a bench for a while
    const b = s.b;
    if (!s.on) {
      if (!G.bmap.has(b.id) || (b.sitter && b.sitter !== v)) { v.sitB = null; v.plan.shift(); return; }
      s.on = 1; s.px = v.x; s.pz = v.z; b.sitter = v; v.sitB = b;
      const f = toWorld(b, 0, 0.04); v.x = f[0]; v.z = f[1]; v.y = b.y; v.rot = b.rot * Math.PI / 2;
    }
    v.anim = 'sit'; s.el += dt;
    if (s.el >= s.dur || isNight() || !G.bmap.has(b.id)) { v.x = s.px; v.z = s.pz; v.y = heightAt(v.x, v.z); b.sitter = null; v.sitB = null; v.anim = 'idle'; v.plan.shift(); }
  } else if (s.t === 'near') {                               // last steps up to a tree or bush, stopping just short of it
    if (s.px === undefined) { let ox = v.x - s.o.x, oz = v.z - s.o.z; const ol = Math.hypot(ox, oz) || 1; s.px = s.o.x + ox / ol * s.d; s.pz = s.o.z + oz / ol * s.d;
      if (W.solid[tileIdx(clamp(worldToTile(s.px), 0, N - 1), clamp(worldToTile(s.pz), 0, N - 1))]) { v.plan.shift(); return; } }
    const dx = s.px - v.x, dz = s.pz - v.z, d = Math.hypot(dx, dz), sp = 1.4 * dt;
    if (d <= sp || d > 2.5) { if (d <= sp) { v.x = s.px; v.z = s.pz; } v.plan.shift(); }
    else { v.x += dx / d * sp; v.z += dz / d * sp; faceTo(v, s.px, s.pz, dt); v.moving = true; }
    v.y = heightAt(v.x, v.z);
  } else if (s.t === 'do') {
    v.anim = s.anim;
    if (s.face) faceTo(v, s.face.x, s.face.z, dt);
    if (s.rod) v.mesh.userData.rod.visible = true;
    const before = s.el; s.el += dt * ws;
    if (s.tick) s.tick(v, dt * ws);
    if (s.hit && Math.floor(s.el / s.hit) > Math.floor(before / s.hit)) s.onHit(v);
    if (s.el >= s.dur) { v.plan.shift(); v.anim = 'idle'; if (s.rod) v.mesh.userData.rod.visible = false; }
  } else if (s.t === 'fn') { v.plan.shift(); s.fn(v); }
  else if (s.t === 'build') {
    const b = s.b;
    if (b.done || !G.bmap.has(b.id)) { clearPlan(v); return; }
    v.anim = 'chop'; faceTo(v, b.cx, b.cz, dt);
    b.progress += dt * ws / (b.def.time * buildSlow(b.def));
    const before = s.el; s.el += dt;
    if (Math.floor(s.el / 0.5) > Math.floor(before / 0.5)) { sfx('hammer', hearK(v.x, v.z)); puff(b.cx + rand(-0.4, 0.4) * b.size, b.y + 0.3, b.cz + rand(-0.4, 0.4) * b.size, 0xe3d2a8, 1, { speed: 0.5, life: 0.5, size: 0.06 }); }
    if (b.progress >= 1) { onBuilt(b); }
    v.say = 'Building: ' + b.def.name;
  }
}
// villagers keep a little distance from each other instead of standing inside one another
function nudge(v, dx, dz) {
  const nx = v.x + dx, nz = v.z + dz, k = tileIdx(clamp(worldToTile(nx), 0, N - 1), clamp(worldToTile(nz), 0, N - 1));
  if (W.solid[k] || W.type[k] === T_WATER || W.fence[k] !== W.fence[curTile(v)]) return;
  v.x = nx; v.z = nz; v.y = heightAt(nx, nz);
}
function separate(dt) {
  const vs = G.villagers, f = Math.min(1, dt * 5);
  for (let a = 0; a < vs.length; a++) {
    const p = vs[a]; if (p.state === 'sleep' || !p.mesh.visible) continue;
    for (let b = a + 1; b < vs.length; b++) {
      const q = vs[b]; if (q.state === 'sleep' || !q.mesh.visible) continue;
      let dx = q.x - p.x, dz = q.z - p.z; const d2 = dx * dx + dz * dz;
      if (d2 > 0.1024) continue;
      let d = Math.sqrt(d2);
      if (d < 0.001) { dx = Math.cos(a * 2.4 + b); dz = Math.sin(a * 2.4 + b); d = 1; }
      const push = (0.32 - Math.min(d, 0.32)) * 0.5 * f;
      nudge(p, -dx / d * push, -dz / d * push); nudge(q, dx / d * push, dz / d * push);
    }
  }
}
function faceTo(v, x, z, dt) {
  const tr = Math.atan2(x - v.x, z - v.z); let df = tr - v.rot;
  while (df > Math.PI) df -= TAU; while (df < -Math.PI) df += TAU;
  v.rot += df * Math.min(1, dt * 8);
}
function animateVillager(v, dt) {
  const u = v.mesh.userData;
  v.animT += dt * (v.moving ? 11 : 7);
  let legs = 0, aL = 0, aR = 0, lean = 0, bob = 0, lift = 0, legsBoth = null;
  if (v.moving) { legs = Math.sin(v.animT) * 0.75; aL = -legs * 0.6; aR = legs * 0.6; bob = Math.abs(Math.sin(v.animT)) * 0.02; }
  else if (v.anim === 'chop') { const s = Math.sin(v.animT * 1.25); aL = aR = -1.7 + s * 0.9; lean = 0.18 + s * 0.12; }
  else if (v.anim === 'bend') { lean = 0.55 + Math.sin(v.animT * 0.7) * 0.1; aL = aR = -0.9 + Math.sin(v.animT * 0.7) * 0.3; }
  else if (v.anim === 'fish') { aR = -1.1; aL = -0.2; lean = Math.sin(v.animT * 0.2) * 0.04; }
  else if (v.anim === 'sit') { legsBoth = -1.45; aL = aR = -0.45; lift = 0.1; }
  else if (v.anim === 'cheer') { const s = Math.sin(v.animT * 1.1); aL = -2.7 + s * 0.35; aR = -2.7 - s * 0.35; bob = Math.abs(Math.sin(v.animT * 1.1)) * 0.06; lean = s * 0.05; }
  else bob = Math.sin(v.animT * 0.35) * 0.008;
  if (v.carry || v.hold) aL = aR = -1.25;
  u.legL.rotation.x = legsBoth === null ? legs : legsBoth; u.legR.rotation.x = legsBoth === null ? -legs : legsBoth; u.armL.rotation.x = aL; u.armR.rotation.x = aR;
  u.inner.rotation.x = lean; u.inner.position.y = bob;
  v.mesh.position.set(v.x, v.y + lift, v.z); v.mesh.rotation.y = v.rot + (v.anim === 'cheer' ? Math.sin(v.animT * 0.55) * 0.5 : 0);
}

// ----- economy tick -----
function calcHappy() {
  const pop = G.villagers.length || 1, parts = [];
  let h = 45;
  const add = (label, n) => { h += n; parts.push([label, n]); };
  add(G.hungry ? 'Going hungry' : 'Plenty to eat', G.hungry ? -30 : 10);
  const housed = G.villagers.filter((v) => v.home).length;
  add('A cottage of their own (' + housed + '/' + pop + ')', Math.round(housed / pop * 10));
  let decor = 0;
  for (const b of G.buildings) if (b.done && b.def.decor) decor += b.def.decor;
  add('Village charm', Math.min(25, Math.round(decor / pop * 6)));
  if (G.civic.gardens) add('Public gardens', 5);
  if (G.clock - G.lastBread < 150) add('Fresh bread', 8);
  if (G.res.honey > 0) add('Honey in the pantry', 7);
  if (staffed('tavern')) add('A cosy tavern', 8);
  if (G.res.cloth > 0) add('Warm clothes', 6);
  if (G.cheer > G.clock) add('A kind deed', 5);
  if (G.festival > 0) add(G.fair ? 'Winter Fair!' : 'Festival!', G.fair ? 20 : 15);
  if (G.season === 3 && W.snowmen && W.snowmen.length) add('Snowmen on the green', Math.min(5, W.snowmen.length));
  const tr = Object.keys(G.treasure).length; if (tr) add('Treasures from afar', tr);
  if (G.res.cider > 0) add('Cider in the cellar', 6);
  if (staffed('bathhouse')) add('A hot bath', 6);
  if (G.level >= 2 && !staffed('tavern')) add('Nowhere to gather in the evening', -5);
  if (G.level >= 2 && G.clock - G.lastBread >= 150) add('Missing fresh bread', -4);
  if ((G.level >= 3 || G.season === 3) && G.res.cloth <= 0) add(G.season === 3 ? 'Shivering without warm clothes' : 'Worn-out clothes', -5);
  G.taught = staffed('school');
  G.happyTarget = clamp(h, 0, 100); G.happyParts = parts;
}
function marketStaffed() { return G.buildings.some((b) => b.type === 'market' && b.done && b.workers.length); }
function doTrade(t) {
  if (!marketStaffed() || G.res[t.give] < t.n) { sfx('error'); return false; }
  const got = t.get === 'coins' && hasTech('guildtrade') ? Math.round(t.m * 1.25) : t.m;
  G.res[t.give] -= t.n; G.res[t.get] += got;
  if (t.get === 'coins') G.stats.coins += t.m;
  sfx('coin'); return true;
}
function arrive() {
  if (G.villagers.length >= Math.min(bedCount(), MAX_POP) || G.hungry || G.res.food < G.villagers.length * 3 || G.happy < 35) return;
  const c = G.center; let best = -1, bd = 1e9;
  for (let q = 0; q < 60; q++) {
    const k = (Math.random() * N * N) | 0;
    if (W.type[k] !== T_SAND || W.solid[k] || !canReach(k)) continue;
    const d = dist2(tileX(k % N), tileX((k / N) | 0), c.cx, c.cz) + Math.random() * 60;
    if (d < bd) { bd = d; best = k; }
  }
  const x = best < 0 ? c.cx : tileX(best % N), z = best < 0 ? c.cz + 2 : tileX((best / N) | 0);
  const v = spawnVillager(x, z);
  assignHomes();
  puff(x, v.y + 0.4, z, [0xfff2b0, 0xffffff], 8, { speed: 0.8, life: 0.7, size: 0.07, glow: true });
  sfx('pop'); toast(v.name + ' has moved to Bumblenook!', 'good');
}
function simTick(dt) {         // dt in game seconds
  G.clock += dt;
  const pop = G.villagers.length;
  if (G.mode !== 'sandbox') G.foodAcc += pop * dt / 26;
  while (G.foodAcc >= 1) { G.foodAcc -= 1; if (G.res.food > 0) { G.res.food--; G.hungry = false; } else { if (!G.hungry && G.clock - G.hungryMsg > 90) { G.hungryMsg = G.clock; toast('The food has run out! Villagers work slower.', 'bad'); } G.hungry = true; } }
  G.happyT -= dt; if (G.happyT <= 0) { G.happyT = 1; calcHappy(); checkLevel(); checkQuest(); checkAch(); expandTick(dt); }
  G.happy += (G.happyTarget - G.happy) * Math.min(1, dt * 0.25);
  G.arriveT -= dt; if (G.arriveT <= 0) { G.arriveT = arriveGap(G.villagers.length) * (G.happy > 80 ? 0.85 : 1); arrive(); }
  // nature
  progressTick(dt);
  for (const bu of bushes) if (!bu.gone && !bu.ripe) { bu.timer -= dt * (G.season === 3 ? 0.25 : (G.rain > 0 ? 2 : 1) * (G.season === 1 ? 1.3 : 1)) * (hasTech('woodlore') ? 1.5 : 1); if (bu.timer <= 0) { bu.ripe = true; setBushMatrix(bu); } }
  G.growT -= dt;
  if (G.growT <= 0) {
    G.growT = 1;
    let live = 0;
    for (const t of trees) { if (!t || t.state !== 0) continue; live++; if (t.size < 1) { t.size = Math.min(1, t.size + (hasTech('woodlore') ? 0.0165 : 0.011)); setTreeMatrix(t); } }
    G.sapT -= 1;
    if (G.sapT <= 0 && live < W.treeTarget) {
      G.sapT = 5;
      for (let q = 0; q < 8; q++) {
        const t = trees[(Math.random() * trees.length) | 0];
        if (!t || t.state !== 0 || t.size < 0.9) continue;
        const i = t.i + ((Math.random() * 5) | 0) - 2, j = t.j + ((Math.random() * 5) | 0) - 2;
        if (!inGrid(i, j)) continue;
        const k = tileIdx(i, j);
        if (W.type[k] !== T_GRASS || W.occ[k] || W.natK[k] || besideBuilding(i, j)) continue;
        addTree(i, j, t.kind, 0.1, Math.random); break;
      }
    }
  }
  for (const b of G.buildings) if (b.type === 'farm' && b.done) b.growth = Math.min(1, b.growth + dt * 0.006 * farmK(b));
  for (let q = W.falling.length - 1; q >= 0; q--) {      // felled trees topple, then the woodcutter's sapling takes their place
    const tr = W.falling[q]; tr.fall += dt * 0.9;
    if (tr.fall < 1) continue;
    removeTree(tr); W.falling.splice(q, 1);
    if (tr.replant && W.type[tr.k] !== T_WATER && !W.occ[tr.k] && !W.natK[tr.k] && !besideBuilding(tr.i, tr.j)) addTree(tr.i, tr.j, tr.kind, 0.1, Math.random);
  }
}
function newDay() {
  G.day++;
  seasonTurn(); dailyEvent();
  if (countDone('townhall')) { const n = Math.round(G.villagers.length * 0.6); G.res.coins += n; G.stats.coins += n; logNews('The Town Hall collected ' + n + ' coins in tax.'); }
  if (G.day >= 2 && Math.random() < 0.3) G.rainAt = G.clock + rand(15, 90);
  G.flowY = G.flow; G.flow = { in: {}, out: {} };
  const bell = G.buildings.find((b) => (b.type === 'belltower' || b.type === 'cathedral') && b.done);
  if (bell) sfx('bell', hearK(bell.cx, bell.cz) * 0.8 + 0.2);
  if (marketStaffed()) {
    const n = Math.max(1, Math.round(G.villagers.length * G.happy / 100 * 0.8));
    G.res.coins += n; G.stats.coins += n;
    const m = G.buildings.find((b) => b.type === 'market' && b.done);
    floatText(m.cx, m.y + 1.4, m.cz, '+' + n, 'coins'); sfx('coin');
    toast('Market day: the merchant earned ' + n + ' coins.', 'good');
  }
  saveGame();
}

// ----- per-frame building animation -----
function animateBuildings(dt, t) {
  for (const b of G.buildings) {
    const g = b.mesh; if (!g) continue;
    const u = g.userData;
    if (!b.done) u.body.scale.y = lerp(0.1, 1, b.progress);
    if (b.pop > 0) { b.pop = Math.max(0, b.pop - dt * 2.2); const s = 1 + Math.sin(b.pop * Math.PI) * 0.16; g.scale.set(s, 1 + Math.sin(b.pop * Math.PI) * 0.22, s); }
    b.t += dt;
    if (!b.done) continue;
    if (u.blades) u.blades.rotation.z -= dt * 0.9;
    if (u.sheep) animateSheep(u, dt, t);
    if (u.ducks) animateDucks(u, dt, t);
    if (u.crops) { const gr = b.growth; u.crops.scale.y = Math.max(0.03, gr); u.cropMat.color.set(0x7fbf4d).lerp(_c2.set(0xe6c450), smooth(0.6, 1, gr)); }
    if (u.flame) { u.flame.scale.set(1 + Math.sin(t * 13) * 0.12, 1 + Math.sin(t * 17 + 1) * 0.2, 1 + Math.cos(t * 11) * 0.12); u.flame.rotation.y = t * 2; }
    if (u.beam) { u.beam.rotation.y += dt * 0.7; u.beamMat.opacity = DAY.glow * 0.14; }
    let smoke = null, rate = 0;
    if (b.type === 'house' && b.residents.length && (DAY.glow > 0.3 || b.id % 3 === 0)) { smoke = [0.38, 1.66, -0.25]; rate = 1.3; }
    else if (b.type === 'bakery' && b.baking) { smoke = [0.62, 1.64, -0.4]; rate = 0.35; }
    else if (b.type === 'center') { smoke = [0, 0.6, 0]; rate = 0.9; }
    else if (b.type === 'brickworks' && b.baking) { smoke = [-0.7, 1.5, -0.7]; rate = 0.4; }
    else if (b.type === 'bathhouse' && b.workers.length) { smoke = [rand(-0.3, 0.3), 0.25, 0.5 + rand(-0.3, 0.3)]; rate = 0.7; }
    else if (b.type === 'fountain') { if (b.t > 0.25) { b.t = 0; puff(b.cx, b.y + 1.0, b.cz, [0xbfe9f5, 0xffffff, 0x8fd3ea], 2, { speed: 0.5, up: 1.3, life: 0.6, size: 0.045, grav: 4 }); } }
    if (smoke && b.t > rate) {
      b.t = 0; const p = toWorld(b, smoke[0], smoke[2]);
      puff(p[0], b.y + smoke[1], p[1], [0xe6e2da, 0xcfcac0], 1, { speed: 0.12, up: 0.55, grav: -0.15, life: 2.2, size: 0.09, grow: 0.16 });
    }
  }
  for (const tr of W.falling) setTreeMatrix(tr);
  const em = G.exp.mesh;
  if (em && em.visible) { em.position.set(G.exp.x, -0.04 + Math.sin(t * 1.5) * 0.03, G.exp.z); em.rotation.set(Math.sin(t * 1.2) * 0.04, G.exp.rot, 0); }
  const sm = G.ship.mesh;
  if (sm && sm.visible) { sm.position.set(G.ship.x, -0.04 + Math.sin(t * 1.7) * 0.03, G.ship.z); sm.rotation.set(Math.sin(t * 1.3) * 0.04, G.ship.rot, Math.sin(t * 1.1) * 0.03); }
  for (const tr of trees) if (tr && tr.shake > 0 && tr.state === 0) { tr.shake = Math.max(0, tr.shake - dt * 3); setTreeMatrix(tr); }
  if (G.fireworks > 0) {
    G.fwT = (G.fwT || 0) - dt;
    if (G.fwT <= 0) {
      G.fwT = 0.45; G.fireworks--;
      const c = G.center, x = c.cx + rand(-7, 7), z = c.cz + rand(-7, 7), y = rand(5, 8), col = pick([0xffd84d, 0xff7a66, 0x8fd0ff, 0xb48ae0, 0x9be37a, 0xffffff]);
      puff(x, y, z, col, 26, { speed: 3.2, up: 0.8, grav: 2.2, life: 1.3, size: 0.11, glow: true, spread: 0.05 }); sfx('boom', 0.7);
    }
  }
}

// ----- quests -----
// ----- new game / save / load -----
function waterDistMap() {            // steps to the nearest water, for every tile
  const d = new Int16Array(N * N).fill(-1), q = new Int32Array(N * N);
  let h = 0, t = 0;
  for (let k = 0; k < N * N; k++) if (W.type[k] === T_WATER) { d[k] = 0; q[t++] = k; }
  while (h < t) {
    const k = q[h++], i = k % N, j = (k / N) | 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = i + di, nj = j + dj; if (!inGrid(ni, nj)) continue; const nk = tileIdx(ni, nj); if (d[nk] < 0) { d[nk] = d[k] + 1; q[t++] = nk; } }
  }
  return d;
}
// The green goes on flat grass roughly ten tiles from the shore, so fishing and a harbour are never a long trek.
function findPlazaSpot() {
  const wd = waterDistMap();
  let best = null, bs = -1e9;
  for (let j = HALF - 17; j <= HALF + 15; j++) for (let i = HALF - 17; i <= HALF + 15; i++) {
    let ok = true;
    for (let dj = -3; dj <= 5 && ok; dj++) for (let di = -3; di <= 5 && ok; di++) {
      if (!inGrid(i + di, j + dj)) { ok = false; break; }
      const k = tileIdx(i + di, j + dj);
      if (W.type[k] !== T_GRASS || W.slope[k] > 0.22) ok = false;
    }
    if (!ok) continue;
    const dw = wd[tileIdx(i + 1, j + 1)], sc = -Math.abs(dw - 10) - Math.hypot(i + 1 - HALF, j + 1 - HALF) * 0.12 - (dw < 8 ? 4 : 0);
    if (sc > bs) { bs = sc; best = [i, j]; }
  }
  return best || [HALF - 1, HALF - 1];
}
// Every island gets rocky ground within reach of the green: if nature did not provide any, a small crag is raised.
function ensureOutcrop(pi, pj, known) {
  let spot = known || null;
  if (!spot) {
    const ci = pi + 1, cj = pj + 1;
    for (let k = 0; k < N * N; k++) if (W.type[k] === T_ROCK && Math.hypot(k % N - ci, ((k / N) | 0) - cj) <= 12) return null;
    const wd = waterDistMap(), r = mulberry32(W.seed * 31 + 11), a0 = r() * TAU;
    for (let q = 0; q < 60 && !spot; q++) {
      const a = a0 + q * 0.61, d = 8 + (q % 4), i0 = Math.round(ci + Math.cos(a) * d) - 1, j0 = Math.round(cj + Math.sin(a) * d) - 1;
      let ok = true;
      for (let j = j0 - 1; j <= j0 + 3 && ok; j++) for (let i = i0 - 1; i <= i0 + 3; i++) { if (!inGrid(i, j) || W.type[tileIdx(i, j)] !== T_GRASS || wd[tileIdx(i, j)] < 3) { ok = false; break; } }
      if (ok) spot = [i0, j0];
    }
    if (!spot) return null;
  }
  const [i0, j0] = spot;
  for (let j = j0 + 1; j <= j0 + 2; j++) for (let i = i0 + 1; i <= i0 + 2; i++) W.h[j * (N + 1) + i] += 1.5 + hash2(i, j, W.seed) * 0.7;
  for (let j = j0 - 1; j <= j0 + 3; j++) for (let i = i0 - 1; i <= i0 + 3; i++) {
    if (!inGrid(i, j)) continue;
    computeTile(i, j, false);
    if (i >= i0 && i <= i0 + 2 && j >= j0 && j <= j0 + 2) W.type[tileIdx(i, j)] = T_ROCK;
    refreshTile(i, j);
  }
  W.hmapDirty = true;
  return spot;
}
function baseState(seed) {
  for (const k of Object.keys(G)) delete G[k];
  Object.assign(G, {
    seed, time: 0.08, day: 1, res: { wood: 50, stone: 20, food: 40, grain: 0, honey: 0, wool: 0, cloth: 0, brick: 0, cider: 0, coins: 0 }, buildings: [], villagers: [], bmap: new Map(),
    quest: 0, happy: 60, happyTarget: 60, happyParts: [], hungry: false, stats: { coins: 0, honey: 0, bread: 0, cloth: 0, planted: 0, missions: 0, ship: 0, fest: 0, research: 0, upgrades: 0, explored: 0, civic: 0, exped: 0, fair: 0, snowmen: 0, insight: 0, cider: 0, brick: 0, built: {} },
    q: { grow: 0, prosper: 0, discover: 0 }, treasure: {}, exp: { state: 'home', t: 0, until: 0, mesh: null, x: 0, z: 0, rot: 0 }, fair: false, finale: false,
    mode: 'normal', rp: 0, tech: {}, civic: {}, fullMsg: {}, season: 0, news: [], lastEvent: 0, story: 0, storyOn: false, storyBase: 0, fish: {}, daily: null, foxUntil: -1, nextId: 1, foodAcc: 0,
    level: 0, missions: [], ach: {}, festival: 0, cheer: -1, missionT: 50, rain: 0, rainAt: -1, taught: false, ship: { state: 'away', t: 0, day: 0, mesh: null, x: 0, z: 0, rot: 0 },
    arriveT: 20, hungryMsg: -999, tut: 0, demo: false, happyT: 0, growT: 1, sapT: 5, clock: 0, lastBread: -999, won: false, fireworks: 0, critDirty: true, started: false,
  });
  G.res = trackRes(G.res); resetFlow();
  if (buildGroup) scene.remove(buildGroup);
  if (villGroup) scene.remove(villGroup);
  buildGroup = new THREE.Group(); villGroup = new THREE.Group(); scene.add(buildGroup, villGroup);
  W.falling = [];
}
function newGame(seed, mode) {
  resetWorld(seed); baseState(seed); G.mode = mode || 'normal';
  const [pi, pj] = findPlazaSpot();
  G.outcrop = ensureOutcrop(pi, pj, null);
  G.center = placeBuilding('center', pi, pj, 0, { done: true, silent: true });
  generateNature({ i: pi + 1, j: pj + 1 });
  for (let q = 0; q < 4; q++) { const a = q / 4 * TAU + 0.6; spawnVillager(G.center.cx + Math.cos(a) * 2.4, G.center.cz + Math.sin(a) * 2.4); }
  generateSites(null);
  if (G.mode === 'sandbox') {
    G.level = LEVELS.length - 1; G.tut = 6;
    for (const t of TECHS) G.tech[t.id] = 1;
    for (const q of ACH) G.ach[q.id] = 1;
    for (let q = 0; q < 8; q++) { const a = q / 8 * TAU; spawnVillager(G.center.cx + Math.cos(a) * 3, G.center.cz + Math.sin(a) * 3); }
  } else if (G.mode === 'daily') { const key = todayKey(); G.daily = { date: key, goal: dailySeed(key) % DAILY_GOALS.length, done: false, score: 0 }; }
  W.snowmen = []; applySeason(); resetWildlife();
  calcHappy(); G.happy = G.happyTarget; resetFlow();
}
function serialize() {
  const bidx = new Map(); G.buildings.forEach((b, n) => bidx.set(b, n));
  const tr = []; for (const t of trees) if (t && t.state === 0) tr.push(t.i, t.j, t.kind, Math.round(t.size * 100));
  const rk = []; for (const r of rocks) if (r.amount > 0) rk.push(r.i, r.j, r.amount);
  const bu = []; for (const b of bushes) if (!b.gone) bu.push(b.i, b.j, b.ripe ? 1 : 0, Math.round(b.timer));
  return {
    v: 4, q: G.q, treasure: G.treasure, exp: { state: G.exp.state === 'away' ? 'away' : 'home', left: Math.max(0, G.exp.until - G.clock) }, fair: G.fair, finale: G.finale,
    sn: (W.snowmen || []).map((q) => [+q.x.toFixed(2), +q.z.toFixed(2)]), oc: G.outcrop || null, mode: G.mode, rp: G.rp, tech: G.tech, civic: G.civic, news: G.news, lastEvent: G.lastEvent, story: G.story, storyOn: G.storyOn, storyBase: G.storyBase, fish: G.fish, daily: G.daily,
    fox: Math.max(0, G.foxUntil - G.clock), sf: W.sites.map((q) => (q.found ? 1 : 0)), level: G.level, ach: G.ach, festival: G.festival, cheer: Math.max(0, G.cheer - G.clock),
    missions: G.missions.filter((m) => !m.ship).map((m) => Object.assign({}, m, { until: m.until - G.clock })),
    tut: G.tut, seed: G.seed, time: G.time, day: G.day, res: G.res, quest: G.quest, stats: G.stats, happy: G.happy, won: G.won, bread: G.clock - G.lastBread, target: W.treeTarget,
    b: G.buildings.map((b) => [b.type, b.i, b.j, b.rot, b.variant, b.done ? 1 : 0, +b.progress.toFixed(2), +b.y.toFixed(3), +b.growth.toFixed(2), b.up ? 1 : 0]),
    p: G.villagers.map((v) => [v.name, +v.x.toFixed(2), +v.z.toFixed(2), v.skin, v.hair, v.job ? bidx.get(v.job) : -1, v.home ? bidx.get(v.home) : -1, v.carry ? v.carry.res : 0, v.carry ? v.carry.amt : 0, v.talent]),
    tr, rk, bu, cam: camState(),
  };
}
function loadGame(d) {
  resetWorld(d.seed); baseState(d.seed);
  G.tut = d.tut === undefined ? 6 : d.tut;
  if (d.oc) G.outcrop = ensureOutcrop(0, 0, d.oc);
  if (d.q) Object.assign(G.q, d.q);
  G.treasure = d.treasure || {}; G.fair = !!d.fair; G.finale = !!d.finale;
  if (d.exp && d.exp.state === 'away') { G.exp.state = 'away'; G.exp.until = d.exp.left || 0; }
  G.mode = d.mode || 'normal'; G.rp = d.rp || 0; G.tech = d.tech || {}; G.civic = d.civic || {}; G.news = d.news || []; G.lastEvent = d.lastEvent || 0; G.story = d.story || 0; G.storyOn = !!d.storyOn; G.storyBase = d.storyBase || 0;
  G.fish = d.fish || {}; G.daily = d.daily || null; G.foxUntil = d.fox || -1;
  G.level = d.level || 0; G.ach = d.ach || {}; G.festival = d.festival || 0; G.cheer = d.cheer || -1; G.missions = (d.missions || []).map((m) => Object.assign({}, m));
  G.time = d.time; G.day = d.day; Object.assign(G.res, d.res); G.quest = d.quest; Object.assign(G.stats, d.stats); G.happy = d.happy; G.won = !!d.won; G.lastBread = -(d.bread || 999);
  for (const a of d.b) {
    const b = placeBuilding(a[0], a[1], a[2], a[3], { variant: a[4], done: !!a[5], progress: a[6], y: a[7], growth: a[8], up: !!a[9] && !!a[5], silent: true });
    if (b.done) onBuilt(b, true);
    if (b.type === 'center') G.center = b;
  }
  const r = mulberry32(d.seed * 7 + 3);
  for (let q = 0; q < d.tr.length; q += 4) if (!W.occ[tileIdx(d.tr[q], d.tr[q + 1])]) addTree(d.tr[q], d.tr[q + 1], d.tr[q + 2], d.tr[q + 3] / 100, r);
  for (let q = 0; q < d.rk.length; q += 3) if (!W.occ[tileIdx(d.rk[q], d.rk[q + 1])]) addRock(d.rk[q], d.rk[q + 1], d.rk[q + 2], r);
  for (let q = 0; q < d.bu.length; q += 4) if (!W.occ[tileIdx(d.bu[q], d.bu[q + 1])]) addBush(d.bu[q], d.bu[q + 1], r, !!d.bu[q + 2], d.bu[q + 3]);
  W.treeTarget = d.target || trees.length;
  generateSites(d.sf);
  scatterDeco(r);
  for (const a of d.p) {
    const v = spawnVillager(a[1], a[2], { name: a[0], skin: a[3], hair: a[4], talent: a[9] });
    const jb = G.buildings[a[5]], hm = G.buildings[a[6]];
    if (jb && jb.def.job && jb.done) { v.job = jb; jb.workers.push(v); refreshVillagerLook(v); }
    if (hm && hm.type === 'house') v.home = hm;
    if (a[7]) G.res[a[7]] += a[8];
  }
  assignHomes(); calcHappy();
  G.quest = G.q.grow + G.q.prosper + G.q.discover;
  W.snowmen = []; G.season = seasonOf(G.day); applySeason(); resetWildlife();
  if (G.season === 3) for (const q of d.sn || []) addSnowman(q[0], q[1]);
  resetFlow();
  if (d.cam) camRestore(d.cam);
}
const SAVE_KEY = 'bumblenook-save-v2';
const saveKey = (mode) => SAVE_KEY + (mode && mode !== 'normal' ? '-' + mode : '');
function saveGame() {
  if (!G.started) return false;
  try { localStorage.setItem(saveKey(G.mode), JSON.stringify(serialize())); return true; } catch (e) { return false; }
}
// Older saves keep working: missing parts get sensible defaults and the goal list is walked again from the start.
function migrate(d) {
  if (!d || typeof d !== 'object' || !d.seed || !Array.isArray(d.b)) return null;
  if (d.v === 4) return d;
  if (d.v !== 2 && d.v !== 3) return null;
  d.quest = 0; d.v = 4; d.mode = 'normal';
  return d;
}
function readSave(mode) {
  try {
    let s = localStorage.getItem(saveKey(mode));
    if (!s && (!mode || mode === 'normal')) s = localStorage.getItem('bumblenook-save-v1');
    if (!s) return null;
    const d = migrate(JSON.parse(s));
    if (d && mode === 'daily' && (!d.daily || d.daily.date !== todayKey())) return null;
    return d;
  } catch (e) { return null; }
}
function clearSave(mode) { try { localStorage.removeItem(saveKey(mode)); if (!mode || mode === 'normal') localStorage.removeItem('bumblenook-save-v1'); } catch (e) { /* ignore */ } }
