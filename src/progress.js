// ---------- progress: village levels, requests, badges, festivals, the trading ship and rain ----------
const LEVELS = [
  { name: 'Camp', need: [] },
  { name: 'Hamlet', need: [['pop', 10]], reward: { wood: 30, stone: 20 } },
  { name: 'Village', need: [['pop', 18], ['happy', 65]], reward: { coins: 25 } },
  { name: 'Town', need: [['pop', 26], ['earned', 250]], reward: { coins: 60 } },
  { name: 'Harbour Town', need: [['pop', 34], ['built', 'harbour']], reward: { coins: 100 } },
];
function levelNeeds(n) {
  return LEVELS[n].need.map((q) => q[0] === 'pop' ? ['Villagers', G.villagers.length, q[1]] : q[0] === 'happy' ? ['Happiness', Math.round(G.happy), q[1]]
    : q[0] === 'earned' ? ['Coins earned', G.stats.coins, q[1]] : [BT[q[1]].name + ' built', countDone(q[1]), 1]);
}
const unlocksAt = (n) => Object.keys(BT).filter((t) => BT[t].lvl === n).map((t) => BT[t].name);
function checkLevel() {
  while (G.level < LEVELS.length - 1 && levelNeeds(G.level + 1).every((r) => r[1] >= r[2])) {
    const L = LEVELS[++G.level];
    for (const r of Object.keys(L.reward)) G.res[r] += L.reward[r];
    const un = unlocksAt(G.level);
    toast('Bumblenook is now a ' + L.name + '!' + (un.length ? ' Unlocked: ' + un.join(', ') + '.' : ''), 'quest');
    if (G.started) { sfx('quest'); G.fireworks += 6; }
    uiDirty();
  }
}

// ----- requests: villagers (and the ship) ask for goods -----
const MISSION_TEXT = {
  food: ['{who} is planning a picnic and asks for {n} food.', '{who} wants to fill the pantry before winter: {n} food.'],
  wood: ['{who} is building a treehouse and needs {n} wood.', '{who} wants to mend the fences: {n} wood.'],
  stone: ['{who} dreams of a garden wall: {n} stone.', '{who} is paving the yard and asks for {n} stone.'],
  grain: ['{who} is trying a new porridge and asks for {n} grain.', '{who} wants to feed the ducks: {n} grain.'],
  honey: ['{who} has a tickly cough and asks for {n} honey.', '{who} is baking honey cake: {n} honey.'],
  wool: ['{who} is stuffing a pillow and asks for {n} wool.'],
  cloth: ['{who} needs {n} cloth for new curtains.', '{who} is sewing a party dress: {n} cloth.'],
  cider: ['{who} is celebrating a birthday and asks for {n} cider.'],
  brick: ['{who} wants a proper brick oven: {n} bricks.'],
};
const SHIP_TEXT = 'The trading ship will buy {n} {res} at a fine price.';
const MISSION_VAL = { wood: 0.5, stone: 0.7, food: 0.6, grain: 0.8, honey: 3, wool: 2, cloth: 7, cider: 8, brick: 5 };
const MISSION_BASE = { wood: 20, stone: 15, food: 20, grain: 10, honey: 4, wool: 6, cloth: 3, cider: 3, brick: 5 };
function missionPool() {
  const p = ['wood', 'stone', 'food'];
  if (countDone('farm')) p.push('grain'); if (countDone('apiary')) p.push('honey'); if (countDone('pasture')) p.push('wool'); if (countDone('weaver')) p.push('cloth'); if (countDone('ciderpress')) p.push('cider'); if (countDone('brickworks')) p.push('brick');
  return p;
}
function newMission(ship) {
  const pool = missionPool().filter((r) => !G.missions.some((m) => m.res === r && m.ship === ship));
  if (!pool.length || !G.villagers.length) return null;
  const res = pick(pool), k = (1 + G.level * 0.45) * (ship ? 1.6 : 1) * rand(0.8, 1.25), base = MISSION_BASE[res] * k;
  const n = base >= 10 ? Math.round(base / 5) * 5 : Math.max(1, Math.round(base));
  const who = ship ? 'The trading ship' : pick(G.villagers).name;
  const m = {
    id: G.nextId++, res, n, ship, who, coins: Math.max(3, Math.round(n * MISSION_VAL[res] * (ship ? 1.7 * (hasTech('navigation') ? 1.3 : 1) * (G.civic.crane ? 1.25 : 1) * (hasTech('sealore') ? 1.25 : 1) : 1.1 * (hasTech('guildtrade') ? 1.25 : 1)))), cheer: !ship && Math.random() < 0.35,
    text: (ship ? SHIP_TEXT : pick(MISSION_TEXT[res])).replace('{who}', who).replace('{n}', n).replace('{res}', RES[res].toLowerCase()), until: ship ? 0 : G.clock + 2 * DAY_LEN,
  };
  G.missions.push(m); uiDirty();
  return m;
}
function deliverMission(m) {
  if (G.res[m.res] < m.n) { sfx('error'); return false; }
  G.res[m.res] -= m.n; G.res.coins += m.coins; G.stats.coins += m.coins; G.stats.missions++;
  if (m.ship) G.stats.ship++;
  if (m.cheer) G.cheer = G.clock + DAY_LEN;
  G.missions.splice(G.missions.indexOf(m), 1);
  sfx('coin'); toast((m.ship ? 'Ship order filled' : m.who + ' is delighted') + ': +' + m.coins + ' coins' + (m.cheer ? ' and the whole village cheers up.' : '.'), 'good');
  uiDirty(); return true;
}

// ----- badges -----
const ACH = [
  { id: 'loaf', name: 'First Loaf', desc: 'Bake your first bread', test: () => G.stats.bread >= 1, coins: 5 },
  { id: 'helper', name: 'Good Neighbour', desc: 'Fill 5 requests', test: () => G.stats.missions >= 5, coins: 20 },
  { id: 'honey', name: 'Honeypot', desc: 'Collect 40 honey', test: () => G.stats.honey >= 40, coins: 20 },
  { id: 'green', name: 'Green Thumb', desc: 'Plant 15 saplings', test: () => G.stats.planted >= 15, coins: 10 },
  { id: 'lights', name: 'Lamplighter', desc: 'Have 10 lanterns', test: () => countDone('lantern') >= 10, coins: 15 },
  { id: 'wool', name: 'Woolly Jumper', desc: 'Weave 20 cloth', test: () => G.stats.cloth >= 20, coins: 20 },
  { id: 'party', name: 'Life of the Party', desc: 'Hold 3 festivals', test: () => G.stats.fest >= 3, coins: 30 },
  { id: 'rich', name: 'Merchant Prince', desc: 'Earn 300 coins', test: () => G.stats.coins >= 300, coins: 40 },
  { id: 'sailor', name: 'Old Salt', desc: 'Fill 5 ship orders', test: () => G.stats.ship >= 5, coins: 40 },
  { id: 'full', name: 'Full House', desc: 'Reach 30 villagers', test: () => G.villagers.length >= 30, coins: 30 },
  { id: 'cozy', name: 'Snug as a Bug', desc: 'Reach 95% happiness', test: () => G.happy >= 95, coins: 30 },
  { id: 'spark', name: 'Bright Spark', desc: 'Finish 5 researches', test: () => G.stats.research >= 5, coins: 30 },
  { id: 'designs', name: 'Grand Designs', desc: 'Upgrade 3 buildings', test: () => G.stats.upgrades >= 3, coins: 30 },
  { id: 'explorer', name: 'Pathfinder', desc: 'Explore every old site', test: () => W.sites && W.sites.length > 0 && W.sites.every((q) => q.found), coins: 30 },
  { id: 'angler', name: 'Master Angler', desc: 'Catch all 8 kinds of fish', test: () => FISH.every((f) => G.fish[f.id]), coins: 40 },
  { id: 'beacon', name: 'Guiding Light', desc: 'Build the Lighthouse', test: () => countDone('lighthouse') >= 1, coins: 50 },
];
function checkAch() {
  if (!G.started) return;
  for (const a of ACH) {
    if (G.ach[a.id] || !a.test()) continue;
    G.ach[a.id] = 1; G.res.coins += a.coins;
    const un = Object.keys(BT).filter((t) => BT[t].ach === a.id).map((t) => BT[t].name);
    toast('Badge earned: ' + a.name + '. +' + a.coins + ' coins' + (un.length ? ' and you unlocked the ' + un.join(', ') + '.' : '.'), 'quest');
    sfx('quest'); uiDirty();
  }
}

// ----- festival -----
const FEST_COST = { food: 30, honey: 5 };
function festivalBlock() {
  if (G.level < 2) return 'Festivals start once Bumblenook is a Village.';
  if (G.festival > 0) return 'The festival is in full swing!';
  if (!G.civic.feast && !canAfford(FEST_COST)) return 'A festival needs 30 food and 5 honey.';
  return null;
}
function holdFestival() {
  if (festivalBlock()) { sfx('error'); return false; }
  if (!G.civic.feast) pay(FEST_COST);
  G.festival = DAY_LEN * (countDone('bandstand') ? 1.2 : 0.8); G.stats.fest++; G.fireworks += 12;
  G.fair = G.season === 3;
  if (G.fair) { const n = 15 + G.villagers.length; G.res.coins += n; G.stats.coins += n; G.stats.fair++; sfx('quest'); toast('The Winter Fair is open! Lanterns, hot cider and a great fire on the green. Visitors left ' + n + ' coins.', 'quest'); }
  else { sfx('quest'); toast('Festival! Music, honey cake and fireworks: everyone is in high spirits.', 'quest'); }
  uiDirty(); return true;
}

// ----- the trading ship (needs a staffed Harbour) -----
function shipPoints(hb) {
  const s = hb.shore, x = tileX(s.k % N), z = tileX((s.k / N) | 0);
  if (!hb.dockD) { let d = 1.6; while (d < 8 && heightAt(x + s.fx * d, z + s.fz * d) > -0.3) d += 0.3; hb.dockD = d + 0.7; }   // moor in deep water, clear of the beach
  return { dx: x + s.fx * hb.dockD, dz: z + s.fz * hb.dockD, fx: x + s.fx * 34, fz: z + s.fz * 34 };
}
function shipTick(dt) {
  const S = G.ship, hb = G.buildings.find((b) => b.type === 'harbour' && b.done && b.shore);
  if (!hb) { if (S.mesh) S.mesh.visible = false; if (S.state !== 'away') { S.state = 'away'; G.missions = G.missions.filter((m) => !m.ship); } return; }
  if (!S.mesh) { S.mesh = new THREE.Mesh(cachedGeo('boat', mBoat), MAT.main); S.mesh.castShadow = true; S.mesh.visible = false; buildGroup.add(S.mesh); }
  const P = shipPoints(hb);
  if (S.state === 'away') {
    if (S.day !== G.day && G.time > 0.07 && G.time < 0.4 && hb.workers.length) { S.state = 'in'; S.t = 0; S.day = G.day; }
  } else if (S.state === 'in') {
    S.t += dt / 16;
    if (S.t >= 1) {
      S.t = 1; S.state = 'docked';
      newMission(true); newMission(true);
      toast('The trading ship has docked. Tap the goal card to see its orders.', 'good'); sfx('bell', hearK(hb.cx, hb.cz) * 0.7 + 0.2);
    }
  } else if (S.state === 'docked') {
    if (G.time > 0.56 || G.time < 0.05) { S.state = 'out'; S.t = 0; G.missions = G.missions.filter((m) => !m.ship); uiDirty(); }
  } else if (S.state === 'out') {
    S.t += dt / 16;
    if (S.t >= 1) S.state = 'away';
  }
  const m = S.mesh;
  m.visible = S.state !== 'away';
  if (!m.visible) return;
  const e = S.state === 'in' ? 1 - (1 - S.t) * (1 - S.t) : S.state === 'out' ? 1 - S.t * S.t : 1;
  S.x = lerp(P.fx, P.dx, e); S.z = lerp(P.fz, P.dz, e);
  const out = S.state === 'out';
  S.rot = Math.atan2(-(out ? P.fz - P.dz : P.dz - P.fz), out ? P.fx - P.dx : P.dx - P.fx);
}

// ----- rain: a passing shower helps crops and berries along -----
let RAINK = 0;
function progressTick(dt) {
  G.missionT -= dt;
  if (G.missionT <= 0) {
    G.missionT = PACE.mission;
    if (G.started && G.level >= 1 && G.missions.filter((m) => !m.ship).length < 2) { const m = newMission(false); if (m) toast('A new request from ' + m.who + '. Tap the goal card to read it.', ''); }
  }
  if (G.missions.some((m) => !m.ship && m.until <= G.clock)) { G.missions = G.missions.filter((m) => m.ship || m.until > G.clock); uiDirty(); }
  if (G.festival > 0) {
    G.festival = Math.max(0, G.festival - dt);
    if (DAY.glow > 0.6 && G.fireworks < 1 && Math.random() < dt * 0.25) G.fireworks = 2;
  }
  if (G.rainAt > 0 && G.clock >= G.rainAt) { G.rainAt = -1; G.rain = rand(35, 60); toast('A shower rolls in. Crops and berries love it.', ''); }
  if (G.rain > 0) G.rain = Math.max(0, G.rain - dt);
  shipTick(dt); expTick(dt);
}
