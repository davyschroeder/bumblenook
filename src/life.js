// ---------- life: roads that matter, needs and neighbourhoods, the Far Isle, events with a choice,
// longer production chains, animals, a life course for villagers, decor that works, and challenges ----------

// ----- new goods -----
Object.assign(RES, { cake: 'Cake', clothes: 'Clothes', salt: 'Salt', clay: 'Clay', grapes: 'Grapes' });
Object.assign(CAP_K, { cake: 0.4, clothes: 0.4, salt: 0.4, clay: 0.6, grapes: 0.4 });
const NEW_RES = ['cake', 'clothes', 'salt', 'clay', 'grapes'];
TRADES.push({ give: 'cake', n: 1, get: 'coins', m: 12 }, { give: 'clothes', n: 1, get: 'coins', m: 22 });
Object.assign(CARRY_FN, {
  cake: (b) => b.cyl(0.07, 0.07, 0.06, 8, 0, 0, 0, 0xf3e1c2).cyl(0.072, 0.072, 0.02, 8, 0, 0.06, 0, C.pink).sph(0.02, 0, 0.09, 0, C.red),
  clothes: (b) => b.box(0.15, 0.04, 0.12, 0, 0, 0, C.roofB).box(0.15, 0.04, 0.12, 0, 0.04, 0, C.roofR).box(0.15, 0.04, 0.12, 0, 0.08, 0, C.white),
  egg: (b) => b.cyl(0.075, 0.06, 0.05, 7, 0, 0, 0, C.woodL).sph(0.03, -0.025, 0.06, 0, C.white, [1, 1.25, 1]).sph(0.03, 0.03, 0.06, 0.02, 0xf2dcc0, [1, 1.25, 1]).sph(0.03, 0, 0.06, -0.03, C.white, [1, 1.25, 1]),
  milk: (b) => b.cyl(0.05, 0.06, 0.12, 7, 0, 0, 0, 0xc8ccd2).cyl(0.03, 0.05, 0.04, 7, 0, 0.12, 0, 0xb4b8be),
});
Object.assign(JOBS, {
  confectioner: { title: 'Pastry cook', plural: 'Pastry cooks', shirt: 0xf6d7de, hat: 'toque' },
  tailor: { title: 'Tailor', plural: 'Tailors', shirt: 0x6f5aa8, hat: 'cap', hatC: 0x3d2f66 },
  poulterer: { title: 'Poultry keeper', plural: 'Poultry keepers', shirt: 0xd98f3d, hat: 'straw' },
  dairy: { title: 'Dairy farmer', plural: 'Dairy farmers', shirt: 0x5f8f6a, hat: 'straw' },
});

// ----- new buildings -----
Object.assign(BT, {
  coop: { lvl: 1, name: 'Chicken Coop', cat: 'voedsel', size: 2, cost: { wood: 25 }, time: 10, job: 'poulterer', slots: 1, desc: 'Hens lay best on grain: 2 grain gives 6 food. Without grain they scratch around for a few eggs.' },
  cowshed: { lvl: 2, name: 'Cowshed', cat: 'voedsel', size: 3, field: true, cost: { wood: 50, stone: 15 }, time: 18, job: 'dairy', slots: 2, desc: 'Cows give milk and cheese: 3 grain feeds them for 10 food. They graze for less when the grain runs out.' },
  pastry: { lvl: 2, name: 'Pastry Shop', cat: 'voedsel', size: 2, cost: { wood: 40, stone: 30 }, time: 16, job: 'confectioner', slots: 1, desc: 'Bakes 6 food and 1 honey into a cake. Cake on the table makes everyone happy and sells well.' },
  tailor: { lvl: 3, name: 'Tailor', cat: 'grond', size: 2, cost: { wood: 40, stone: 20 }, time: 16, job: 'tailor', slots: 1, desc: 'Sews 2 cloth into a set of clothes. Clothes keep every home warm in winter and sell for a good price.' },
  brazier: { lvl: 1, name: 'Brazier', cat: 'sfeer', size: 1, cost: { stone: 8, wood: 4 }, time: 4, decor: 1, quick: true, desc: 'A fire basket for the street. Homes close by stay warm in winter.' },
  garden: { lvl: 1, name: 'Garden', cat: 'sfeer', size: 2, cost: { wood: 12 }, time: 8, decor: 4, desc: 'A little park with roses and a bird bath. Makes the homes around it lovelier and good company.' },
  flag: { name: 'Flagpole', cat: 'sfeer', size: 1, cost: { wood: 8 }, time: 4, decor: 2, quick: true, desc: 'The colours of Bumblenook. A cheerful sight for the homes around it.' },
  arch: { lvl: 2, name: 'Rose Arch', cat: 'sfeer', size: 1, cost: { wood: 10 }, time: 5, decor: 3, quick: true, walk: true, desc: 'An arch of climbing roses. Villagers can walk under it.' },
});
for (const t of ['coop', 'cowshed', 'pastry', 'tailor', 'brazier', 'garden', 'arch']) {           // the same price steps as the older buildings
  const d = BT[t], k = d.lvl >= 3 ? 1.5 : d.lvl === 2 ? 1.4 : 1.2;
  for (const r of Object.keys(d.cost)) d.cost[r] = Math.max(1, Math.round(d.cost[r] * k / 5) * 5);
}

function mCoop() {
  const b = new MB();
  b.box(1.1, 0.08, 0.9, -0.15, 0, -0.3, C.woodD);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.07, 0.3, 0.07, -0.15 + sx * 0.45, 0.08, -0.3 + sz * 0.35, C.woodD);
  b.box(1.0, 0.5, 0.8, -0.15, 0.38, -0.3, C.plank).gable(0.84, 0.36, 1.04, -0.15, 0.88, -0.3, C.plank, Math.PI / 2).gable(1.0, 0.44, 1.2, -0.15, 0.86, -0.3, C.roofR, Math.PI / 2);
  b.box(0.22, 0.26, 0.04, -0.15, 0.4, 0.1, C.dark).box(0.26, 0.04, 0.5, -0.15, 0.2, 0.34, C.woodL, [0.55, 0, 0]);
  b.glow(0.16, 0.14, 0.04, 0.18, 0.66, 0.105);
  b.box(0.5, 0.1, 0.22, 0.62, 0, 0.5, C.wood).box(0.44, 0.04, 0.16, 0.62, 0.1, 0.5, C.wheat);
  for (let q = 0; q < 6; q++) b.box(0.04, 0.34, 0.04, 0.9, 0, -0.75 + q * 0.3, C.woodL);
  b.box(0.03, 0.03, 1.56, 0.9, 0.26, 0, C.woodL);
  return b.build();
}
function mHen() {
  const b = new MB();
  b.sph(0.085, 0, 0.11, 0, C.white, [1, 0.95, 1.25], 1).sph(0.055, 0, 0.2, 0.09, C.white, null, 1).cone(0.02, 0.05, 4, 0, 0.18, 0.15, C.gold, [Math.PI / 2, 0, 0]);
  b.box(0.015, 0.05, 0.04, 0, 0.24, 0.09, C.red).cone(0.05, 0.1, 4, 0, 0.12, -0.12, 0xe8e2d4, [-0.9, 0, 0]);
  b.box(0.012, 0.06, 0.012, -0.03, 0, 0, C.gold).box(0.012, 0.06, 0.012, 0.03, 0, 0, C.gold);
  return b.build().geo;
}
function mCowshed() {
  const b = new MB();
  b.box(1.5, 0.08, 1.0, 0, 0, -0.95, C.stone).box(1.4, 0.72, 0.9, 0, 0.08, -0.95, C.red).gable(0.9, 0.5, 1.4, 0, 0.8, -0.95, C.red, Math.PI / 2).gable(1.08, 0.6, 1.56, 0, 0.78, -0.95, 0x5a4a42, Math.PI / 2);
  b.box(0.5, 0.56, 0.05, 0, 0.08, -0.49, C.woodD).box(0.04, 0.56, 0.02, 0, 0.08, -0.46, C.white).box(0.5, 0.04, 0.02, 0, 0.36, -0.46, C.white);
  b.glow(0.2, 0.18, 0.04, 0, 0.98, -0.475).box(0.5, 0.2, 0.24, -1.05, 0, -0.2, C.wood).box(0.44, 0.04, 0.18, -1.05, 0.2, -0.2, 0x7ec8e3);
  b.sph(0.2, 1.1, 0.14, -0.3, C.wheat, [1, 0.8, 1], 1).sph(0.16, 0.95, 0.12, -0.12, 0xd9b84a, [1, 0.8, 1]);
  for (const sx of [-1, 1]) for (let q = 0; q < 6; q++) b.box(0.05, 0.4, 0.05, sx * 1.42, 0, -0.42 + q * 0.37, C.woodL);
  for (const sx of [-1, 1]) b.box(0.03, 0.03, 1.9, sx * 1.42, 0.3, 0.5, C.woodL).box(0.03, 0.03, 1.9, sx * 1.42, 0.14, 0.5, C.woodL);
  for (const sx of [-1, 1]) for (let q = 0; q < 3; q++) b.box(0.05, 0.4, 0.05, sx * (0.55 + q * 0.42), 0, 1.44, C.woodL);
  for (const sx of [-1, 1]) b.box(0.9, 0.03, 0.03, sx * 0.97, 0.3, 1.44, C.woodL).box(0.9, 0.03, 0.03, sx * 0.97, 0.14, 1.44, C.woodL);
  return b.build();
}
function mCow() {
  const b = new MB();
  b.box(0.2, 0.2, 0.42, 0, 0.16, 0, C.white).box(0.15, 0.16, 0.18, 0, 0.26, 0.28, C.white).box(0.11, 0.08, 0.08, 0, 0.26, 0.4, C.pink);
  b.box(0.21, 0.12, 0.16, 0, 0.24, -0.06, 0x3a2f2a).box(0.12, 0.1, 0.19, 0.045, 0.3, 0.2, 0x3a2f2a);
  for (const sx of [-1, 1]) { b.box(0.05, 0.16, 0.05, sx * 0.07, 0, 0.15, C.white).box(0.05, 0.16, 0.05, sx * 0.07, 0, -0.15, C.white).cone(0.02, 0.06, 4, sx * 0.06, 0.42, 0.26, C.woodL); }
  b.box(0.02, 0.16, 0.02, 0, 0.18, -0.23, C.white, [0.3, 0, 0]);
  return b.build().geo;
}
function mPastry() {
  const b = new MB();
  b.box(1.5, 0.1, 1.3, 0, 0, 0, C.stone).box(1.3, 0.78, 1.1, 0, 0.1, 0, 0xf6d7de).box(1.34, 0.07, 1.14, 0, 0.84, 0, C.white);
  b.gable(1.3, 0.5, 1.1, 0, 0.9, 0, 0xf6d7de).gable(1.56, 0.62, 1.42, 0, 0.88, 0, 0x8d5c9e);
  b.box(0.3, 0.5, 0.05, -0.38, 0.1, 0.56, C.woodD).box(0.42, 0.06, 0.18, -0.38, 0.02, 0.68, C.stoneL);
  b.glow(0.5, 0.3, 0.04, 0.25, 0.52, 0.555).box(0.6, 0.05, 0.14, 0.25, 0.32, 0.6, C.woodL);
  for (let q = 0; q < 5; q++) b.box(0.132, 0.03, 0.34, -0.014 + q * 0.132, 0.86, 0.68, q % 2 ? C.white : C.pink, [0.5, 0, 0]);
  b.cyl(0.05, 0.05, 0.05, 7, 0.12, 0.37, 0.6, 0xf3e1c2).cyl(0.05, 0.05, 0.02, 7, 0.12, 0.42, 0.6, C.pink).cyl(0.05, 0.05, 0.05, 7, 0.38, 0.37, 0.6, C.bread).sph(0.02, 0.38, 0.44, 0.6, C.red);
  b.box(0.2, 0.55, 0.2, 0.38, 1.0, -0.25, C.stoneD).box(0.26, 0.06, 0.26, 0.38, 1.55, -0.25, C.stone);
  b.box(0.04, 0.4, 0.04, -0.72, 0.6, 0.6, C.woodD).box(0.3, 0.2, 0.03, -0.6, 0.86, 0.6, C.white).cyl(0.06, 0.06, 0.02, 8, -0.6, 0.95, 0.62, C.pink, [Math.PI / 2, 0, 0]);
  return b.build();
}
function mTailor() {
  const b = new MB();
  b.box(1.5, 0.1, 1.3, 0, 0, 0, C.stone).box(1.3, 0.7, 1.1, 0, 0.1, 0, C.plaster).box(1.36, 0.07, 1.16, 0, 0.8, 0, C.woodD).box(1.32, 0.5, 1.12, 0, 0.87, 0, C.plaster);
  for (const sx of [-1, 0, 1]) b.box(0.06, 0.5, 0.05, sx * 0.63, 0.87, 0.55, C.woodD);
  b.gable(1.32, 0.46, 1.12, 0, 1.37, 0, C.plaster).gable(1.56, 0.58, 1.4, 0, 1.35, 0, 0x4c5f73);
  b.box(0.3, 0.5, 0.05, 0.38, 0.1, 0.56, 0x6f5aa8).box(0.42, 0.06, 0.18, 0.38, 0.02, 0.68, C.stoneL);
  b.glow(0.46, 0.3, 0.04, -0.28, 0.5, 0.555).glow(0.2, 0.2, 0.04, -0.32, 1.12, 0.565).glow(0.2, 0.2, 0.04, 0.32, 1.12, 0.565);
  b.box(0.04, 0.5, 0.04, -0.75, 0.1, 0.62, C.woodD).box(0.04, 0.5, 0.04, -0.2, 0.1, 0.72, C.woodD).box(0.6, 0.02, 0.02, -0.475, 0.58, 0.67, C.woodD, [0, -0.18, 0]);
  b.box(0.14, 0.2, 0.02, -0.62, 0.38, 0.65, C.roofR).box(0.14, 0.2, 0.02, -0.45, 0.38, 0.68, C.roofB).box(0.14, 0.2, 0.02, -0.29, 0.38, 0.71, C.roofY);
  b.box(0.3, 0.2, 0.03, 0.38, 0.9, 0.6, C.woodL).box(0.12, 0.02, 0.01, 0.38, 1.0, 0.62, C.dark, [0, 0, 0.6]).box(0.12, 0.02, 0.01, 0.38, 1.0, 0.62, C.dark, [0, 0, -0.6]);
  return b.build();
}
function mBrazier() {
  const b = new MB();
  for (let q = 0; q < 3; q++) { const a = q / 3 * TAU; b.box(0.03, 0.34, 0.03, Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1, C.iron, [Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25]); }
  b.cyl(0.17, 0.11, 0.12, 8, 0, 0.3, 0, C.iron).cyl(0.14, 0.14, 0.03, 8, 0, 0.4, 0, 0x2a1a12).sph(0.05, 0.03, 0.44, 0, 0xff8a2a).sph(0.04, -0.04, 0.44, 0.03, 0xffd84d);
  return b.build();
}
function mGarden() {
  const b = new MB();
  b.box(1.84, 0.04, 1.84, 0, 0, 0, 0x8fc46a);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { b.box(0.6, 0.12, 0.6, sx * 0.55, 0.04, sz * 0.55, C.soil); for (let q = 0; q < 5; q++) b.sph(0.07, sx * 0.55 + Math.cos(q * 1.9) * 0.18, 0.2, sz * 0.55 + Math.sin(q * 1.9) * 0.18, [C.pink, C.red, C.gold, C.white, 0xb07fd8][(q + (sx > 0 ? 1 : 0) + (sz > 0 ? 2 : 0)) % 5]); }
  b.box(1.84, 0.02, 0.3, 0, 0.04, 0, 0xdcc79c).box(0.3, 0.02, 1.84, 0, 0.04, 0, 0xdcc79c);
  b.cyl(0.07, 0.11, 0.3, 8, 0, 0.05, 0, C.stoneL).cyl(0.2, 0.1, 0.07, 10, 0, 0.35, 0, C.stoneL).cyl(0.16, 0.16, 0.015, 10, 0, 0.41, 0, 0x7ec8e3);
  for (const s of [[-0.86, -0.86], [0.86, -0.86], [-0.86, 0.86], [0.86, 0.86]]) b.sph(0.13, s[0], 0.15, s[1], C.leafD, [1, 1.1, 1], 1);
  return b.build();
}
function mFlag() {
  const b = new MB();
  b.cyl(0.09, 0.11, 0.08, 8, 0, 0, 0, C.stone).cyl(0.022, 0.028, 1.5, 6, 0, 0.08, 0, C.woodL).sph(0.04, 0, 1.6, 0, C.gold);
  for (let q = 0; q < 4; q++) b.box(0.115, 0.3, 0.02, 0.08 + q * 0.115, 1.2 - (q % 2) * 0.012, 0, q % 2 ? C.dark : C.gold);
  return b.build();
}
function mArch() {
  const b = new MB();
  for (const sx of [-1, 1]) { b.box(0.06, 0.8, 0.06, sx * 0.36, 0, 0.12, C.woodL).box(0.06, 0.8, 0.06, sx * 0.36, 0, -0.12, C.woodL); for (let q = 0; q < 4; q++) b.sph(0.07, sx * 0.37, 0.16 + q * 0.2, (q % 2 ? 0.1 : -0.1), q % 2 ? C.leaf : C.leafD); }
  for (let q = 0; q < 7; q++) { const a = Math.PI * q / 6; b.box(0.14, 0.05, 0.32, Math.cos(a) * 0.36, 0.8 + Math.sin(a) * 0.2, 0, C.woodL, [0, 0, a + Math.PI / 2]); b.sph(0.055, Math.cos(a) * 0.37, 0.86 + Math.sin(a) * 0.21, q % 2 ? 0.14 : -0.14, [C.pink, C.red, C.white][q % 3]); }
  return b.build();
}
Object.assign(MODEL_FN, { coop: mCoop, cowshed: mCowshed, pastry: mPastry, tailor: mTailor, brazier: mBrazier, garden: mGarden, flag: mFlag, arch: mArch });
// animals wander inside a box in front of their building
function addFlock(g, ex, n, geoKey, geoFn, box) {
  ex.flock = { box, list: [] };
  for (let q = 0; q < n; q++) {
    const m = new THREE.Mesh(cachedGeo(geoKey, geoFn), MAT.main); m.castShadow = true;
    const s = { m, x: rand(box[0], box[1]), z: rand(box[2], box[3]), tx: 0, tz: 0, wait: Math.random() * 4, rot: Math.random() * TAU, ph: Math.random() * 6 };
    m.position.set(s.x, 0, s.z); g.add(m); ex.flock.list.push(s);
  }
}
EXTRA_FN.coop = (g, ex) => addFlock(g, ex, 4, 'hen', mHen, [0.2, 0.75, -0.6, 0.75]);
EXTRA_FN.cowshed = (g, ex) => addFlock(g, ex, 3, 'cow', mCow, [-1.1, 1.1, -0.1, 1.15]);
EXTRA_FN.brazier = (g, ex) => { ex.sprite = makeGlowSprite(1.5); ex.sprite.position.set(0, 0.5, 0); g.add(ex.sprite); };
POOLS.brazier = 2.2; POOLS.pastry = 2.2; POOLS.tailor = 2.2;
function animateFlock(u, dt, t) {
  const f = u.flock, cow = f.box[1] - f.box[0] > 1.5;
  for (const s of f.list) {
    s.wait -= dt;
    if (s.wait <= 0 && s.wait > -90) { s.tx = rand(f.box[0], f.box[1]); s.tz = rand(f.box[2], f.box[3]); s.wait = -100; }
    let bob = 0;
    if (s.wait < -90) {
      const dx = s.tx - s.x, dz = s.tz - s.z, d = Math.hypot(dx, dz), sp = cow ? 0.16 : 0.3;
      if (d < 0.05) s.wait = rand(cow ? 4 : 1.5, cow ? 10 : 5);
      else { s.x += dx / d * dt * sp; s.z += dz / d * dt * sp; let df = Math.atan2(dx, dz) - s.rot; while (df > Math.PI) df -= TAU; while (df < -Math.PI) df += TAU; s.rot += df * Math.min(1, dt * 4); bob = Math.abs(Math.sin(t * (cow ? 5 : 14) + s.ph)) * (cow ? 0.01 : 0.02); }
    }
    s.m.position.set(s.x, bob, s.z); s.m.rotation.y = s.rot;
    s.m.rotation.x = s.wait > 0 && !cow && Math.sin(t * 2 + s.ph) > 0.6 ? 0.5 : 0;          // a hen pecks at the ground
  }
}

// ----- the new jobs -----
JOB_THINK.poulterer = (v, b) => {
  const fed = G.res.grain >= 2, sick = G.sickUntil > G.clock;
  if (sick) return idleAt(v, b, 'The animals are poorly: nothing to collect today');
  b.warn = fed ? null : 'No grain to feed the hens: fewer eggs';
  v.plan.push(go(accessTiles(b), 'Walking to the coop'), act(fed ? 7 : 10, 'bend', fed ? 'Feeding the hens' : 'Looking for eggs', { face: { x: b.cx, z: b.cz } }), call((q) => {
    const ok = G.res.grain >= 2; if (ok) G.res.grain -= 2;
    setCarry(q, 'food', ok ? 6 : 2, 'egg');
  }));
};
JOB_THINK.dairy = (v, b) => {
  const fed = G.res.grain >= 3, k = pick(b.fieldTiles);
  if (G.sickUntil > G.clock) return idleAt(v, b, 'The animals are poorly: nothing to collect today');
  b.warn = fed ? null : 'No grain for the cows: they give less milk on grass alone';
  v.plan.push(go(k, 'Walking to the cows'), act(fed ? 8 : 10, 'bend', fed ? 'Milking a cow' : 'Leading the cows to graze'), call((q) => {
    const ok = G.res.grain >= 3; if (ok) G.res.grain -= 3;
    setCarry(q, 'food', (ok ? 10 : 3) + (G.season === 3 && !ok ? -1 : 0), 'milk');
  }));
};
JOB_THINK.confectioner = (v, b) => processJob(v, b, { bring: 'Carrying flour and honey to the shop', fetch: 'Fetching bread and honey from storage', say: 'Baking a cake', wait: 'Waiting for spare food and a jar of honey', dur: 9, carry: 'bread',
  ready: () => G.res.food >= 6 + G.villagers.length * 3 && G.res.honey >= 1 && G.res.cake < capOf('cake'), take: () => { G.res.food -= 6; G.res.honey -= 1; }, done: (q) => { G.stats.cake = (G.stats.cake || 0) + 1; setCarry(q, 'cake', 1); } });
JOB_THINK.tailor = (v, b) => processJob(v, b, { bring: 'Carrying cloth to the workshop', fetch: 'Fetching cloth from storage', say: 'Sewing clothes', wait: 'Waiting for 2 cloth from the weaver', dur: 10, carry: 'wool',
  ready: () => G.res.cloth >= 3 && G.res.clothes < capOf('clothes'), take: () => { G.res.cloth -= 2; }, done: (q) => { G.stats.clothes = (G.stats.clothes || 0) + 1; setCarry(q, 'clothes', 1); } });

// ----- 1. roads that matter -----
// A workplace joined to a storehouse (or the green) by an unbroken path sends its goods by handcart: a quarter more arrives.
const ROAD_BONUS = 0.25;
const CARRIERS = ['lumber', 'quarry', 'forager', 'farmer', 'fisher', 'baker', 'bee', 'shepherd', 'weaver', 'miner', 'picker', 'gardener', 'brewer', 'brickmaker', 'poulterer', 'dairy', 'confectioner', 'tailor'];
let _roadNav = -1;
const _road = new Uint8Array(N * N);
const isPathTile = (k) => { const o = G.bmap.get(W.occ[k]); return !!o && (o.type === 'path' || o.type === 'arch'); };
function ringTiles(b) {
  const out = [];
  for (let j = b.j - 1; j <= b.j + b.size; j++) for (let i = b.i - 1; i <= b.i + b.size; i++) {
    if (!inGrid(i, j) || (i >= b.i && i < b.i + b.size && j >= b.j && j < b.j + b.size)) continue;
    if ((i < b.i || i >= b.i + b.size) && (j < b.j || j >= b.j + b.size)) continue;      // corners do not touch
    out.push(tileIdx(i, j));
  }
  return out;
}
function roadNet() {
  if (_roadNav === W.nav) return _road;
  _roadNav = W.nav; _road.fill(0);
  const q = [];
  for (const b of G.buildings) if (b.done && b.def.storage) for (const k of ringTiles(b)) if (isPathTile(k) && !_road[k]) { _road[k] = 1; q.push(k); }
  while (q.length) {
    const k = q.pop(), i = k % N, j = (k / N) | 0;
    for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const p = i + d[0], r = j + d[1]; if (!inGrid(p, r)) continue; const n = tileIdx(p, r); if (!_road[n] && isPathTile(n)) { _road[n] = 1; q.push(n); } }
  }
  for (const b of G.buildings) b.onRoad = CARRIERS.includes(b.def.job) && b.done && ringTiles(b).some((k) => _road[k]);
  return _road;
}
const roadCount = () => { roadNet(); return G.buildings.reduce((n, b) => n + (b.onRoad ? 1 : 0), 0); };
function cartBonus(v, amt) {          // extra goods a handcart brings; whole numbers, fair on average
  if (!v.job || !(roadNet(), v.job.onRoad)) return 0;
  const x = amt * ROAD_BONUS, n = Math.floor(x);
  return n + (Math.random() < x - n ? 1 : 0);
}
function mBarrow() {
  const b = new MB();
  b.box(0.16, 0.07, 0.2, 0, 0.07, 0.06, C.woodL).box(0.02, 0.02, 0.26, -0.07, 0.1, -0.14, C.woodD).box(0.02, 0.02, 0.26, 0.07, 0.1, -0.14, C.woodD);
  b.cyl(0.05, 0.05, 0.03, 8, 0, 0.02, 0.19, C.dark, [0, 0, Math.PI / 2]).box(0.02, 0.06, 0.02, -0.06, 0, -0.02, C.woodD).box(0.02, 0.06, 0.02, 0.06, 0, -0.02, C.woodD);
  return b.build().geo;
}

// ----- 2 + 8. needs, and the neighbourhood a home stands in -----
// Every home is scored on four things by what stands around it. Residents slowly take on the scores of their home.
const NEAR = {
  warm: { center: [6, 1], tavern: [5, 0.7], bakery: [4.5, 0.6], pastry: [4.5, 0.6], bathhouse: [6, 0.8], brazier: [4.5, 0.55], brickworks: [4, 0.4], lantern: [2.5, 0.12] },
  company: { center: [6, 0.6], tavern: [7, 0.7], bench: [4, 0.25], pond: [5, 0.35], fountain: [5, 0.4], garden: [5, 0.4], gazebo: [5, 0.4], bandstand: [7, 0.6], market: [5, 0.3], well: [4, 0.25], house: [3.2, 0.12] },
  noise: { lumber: [4.5, 0.3], quarry: [5, 0.4], mine: [5.5, 0.45], brickworks: [4.5, 0.35], weaver: [3, 0.15], harbour: [4, 0.2], shipyard: [5, 0.35], cowshed: [3.5, 0.15], coop: [3, 0.12] },
  beauty: { flowers: [4, 0.14], hedge: [3, 0.06], lantern: [3.5, 0.1], garden: [5.5, 0.4], flag: [5, 0.18], arch: [4, 0.2], statue: [6, 0.5], fountain: [6, 0.6], pond: [5, 0.35], well: [4.5, 0.3], bench: [3.5, 0.12], gazebo: [5, 0.35], belltower: [7, 0.5], cathedral: [9, 0.7], greathive: [9, 0.7], bandstand: [6, 0.35] },
};
const NEED_KEYS = ['warm', 'company', 'rest', 'beauty'];
const NEED_NAME = { warm: 'Warmth', company: 'Company', rest: 'Rest', beauty: 'Lovely street' };
let _hoodNav = -1;
function scoreAt(x, z, table, skip) {
  let s = 0, top = null, tv = 0;
  for (const o of G.buildings) {
    if (!o.done || o === skip) continue;
    const e = table[o.type]; if (!e) continue;
    const d = Math.hypot(o.cx - x, o.cz - z); if (d > e[0]) continue;
    const c = e[1] * (1 - 0.6 * d / e[0]); s += c;
    if (c > tv) { tv = c; top = o; }
  }
  return [s, top];
}
function neighbourhoods() {
  if (_hoodNav === W.nav) return;
  _hoodNav = W.nav;
  for (const b of G.buildings) {
    if (!b.done || (b.type !== 'house' && b.type !== 'center')) continue;
    const w = scoreAt(b.cx, b.cz, NEAR.warm, b), c = scoreAt(b.cx, b.cz, NEAR.company, b), n = scoreAt(b.cx, b.cz, NEAR.noise, b), be = scoreAt(b.cx, b.cz, NEAR.beauty, b);
    let green = 0;
    for (const t of trees) if (t && t.state === 0 && Math.abs(t.x - b.cx) < 4 && Math.abs(t.z - b.cz) < 4) green++;
    const tent = b.type === 'center';
    b.hood = { warm: clamp((tent ? 0.25 : 0.3) + w[0], 0, 1), company: clamp(0.15 + c[0], 0, 1), rest: clamp((tent ? 0.45 : b.up ? 1 : 0.9) - n[0], 0, 1), beauty: clamp(be[0] + Math.min(0.25, green * 0.04), 0, 1), loud: n[1] };
  }
}
const hoodOf = (v) => { neighbourhoods(); return ((v.home && v.home.hood) || (G.center && G.center.hood)) || null; };
function needsTick(dt) {                 // once a second
  const clothed = G.res.clothes > 0 ? 0.3 : G.res.cloth > 0 ? 0.12 : 0;
  for (const v of G.villagers) {
    const h = hoodOf(v); if (!h) continue;
    if (!v.need) v.need = { warm: h.warm, company: h.company, rest: h.rest, beauty: h.beauty };
    const k = Math.min(1, dt / 90);
    v.need.warm += (clamp(h.warm + clothed, 0, 1) - v.need.warm) * k;
    v.need.company += (h.company - v.need.company) * k * 0.6;
    v.need.rest += (h.rest - v.need.rest) * k;
    v.need.beauty += (h.beauty - v.need.beauty) * k;
  }
}
function needAvg(key) { let s = 0, n = 0; for (const v of G.villagers) if (v.need) { s += v.need[key]; n++; } return n ? s / n : 0.5; }
function needParts(add) {                // extra lines in the happiness sum
  if (G.level < 1 || !G.villagers.some((v) => v.need)) return;
  const co = needAvg('company'), re = needAvg('rest'), be = needAvg('beauty');
  if (G.season === 3) { const w = needAvg('warm'), n = Math.round((w - 0.55) * 16); add(n >= 0 ? 'Warm homes in winter' : 'Cold homes: braziers, a tavern or clothes help', n); }
  let n = Math.round((co - 0.4) * 10); if (n) add(n > 0 ? 'Good company close to home' : 'Lonely streets: benches and gardens help', n);
  n = Math.round((re - 0.7) * 14); if (n) add(n > 0 ? 'A good night\'s sleep' : 'Noisy nights next to the workshops', n);
  n = Math.round(be * 8); if (n) add('Lovely streets', n);
}
const lifeSpeed = (v) => (v.need && v.need.rest < 0.35 ? 0.9 : 1) * (v.age >= ELDER_AGE ? 0.9 : 1);

// ----- 7. a life course -----
const CHILD_DAYS = 3, ELDER_AGE = 40;
const isChild = (v) => !!v.child;
const ageName = (v) => (v.child ? 'Child' : v.age >= ELDER_AGE ? 'Elder' : 'Grown-up');
function setChildLook(v) { v.mesh.scale.setScalar(v.child ? 0.62 : 1); }
function tryBirth() {                    // a settler's place is sometimes taken by a baby
  if (G.mode === 'sandbox' || G.level < 2 || G.happy < 60 || G.villagers.filter(isChild).length >= Math.max(1, Math.floor(G.villagers.length / 6))) return false;
  const homes = G.buildings.filter((b) => b.type === 'house' && b.done && b.residents.length < bedsOf(b) && b.residents.filter((v) => !v.child && v.age < ELDER_AGE).length >= 2);
  if (!homes.length || Math.random() > (G.babySoon ? 1 : 0.4)) return false;
  G.babySoon = false;
  const h = pick(homes), at = accessTiles(h)[0], x = at === undefined ? h.cx : tileX(at % N), z = at === undefined ? h.cz + 1.2 : tileX((at / N) | 0);
  const v = spawnVillager(x, z);
  v.child = true; v.age = 0; v.home = h; h.residents.push(v); setChildLook(v);
  G.stats.born = (G.stats.born || 0) + 1;
  puff(x, v.y + 0.4, z, [0xffd9e6, 0xffffff, 0xfff2b0], 10, { speed: 0.8, life: 0.8, size: 0.07, glow: true });
  sfx('pop'); toast(v.name + ' was born in Bumblenook! ' + pick(h.residents.filter((q) => q !== v)).name + '\'s cottage has a new voice.', 'good'); logNews(v.name + ' was born.');
  return true;
}
function childThink(v) {
  const school = G.buildings.find((b) => b.type === 'school' && b.done && b.workers.length);
  if (school && G.time > 0.12 && G.time < 0.45 && Math.random() < 0.7) { v.schooled = true; v.plan.push(go(accessTiles(school), 'Running to school'), act(rand(8, 14), 'idle', pick(['Learning letters', 'Counting bumblebees', 'Listening to a story']), { face: { x: school.cx, z: school.cz } })); return; }
  const k = greenSpot(4.2);
  if (k >= 0) { v.plan.push(go(k, pick(['Running across the green', 'Chasing a butterfly', 'Playing tag'])), act(rand(2, 5), Math.random() < 0.5 ? 'cheer' : 'idle', pick(['Playing on the green', 'Skipping stones', 'Building a den', 'Counting clouds']))); return; }
  v.plan.push(act(3, 'idle', 'Looking around'));
}
function ageTick() {                     // every morning
  const school = staffed('school');
  for (const v of G.villagers) {
    v.age = (v.age || 0) + 1;
    if (v.child && v.age >= CHILD_DAYS - (v.schooled && school ? 1 : 0)) {
      v.child = false; v.age = 8; setChildLook(v);
      toast(v.schooled ? v.name + ' has grown up and is ready to work, quick and clever from school.' : v.name + ' has grown up and is ready to work.', 'good'); logNews(v.name + ' grew up.');
    } else if (v.age === ELDER_AGE) {
      v.hair = 3; refreshVillagerLook(v);
      logNews(v.name + ' is now one of the village elders.');
    }
  }
}
const elderCount = () => G.villagers.reduce((n, v) => n + (v.age >= ELDER_AGE ? 1 : 0), 0);

// ----- 3. the Far Isle -----
// A second island over the horizon, reached from the Shipyard. It is run from a panel: crews dig clay, pan salt and
// pick grapes, and a supply boat brings the harvest home every morning.
const ISLE_COST = { wood: 150, food: 100, coins: 200 }, ISLE_UP = { brick: 60, coins: 300 };
const ISLE_YIELD = { salt: 5, clay: 9, grapes: 5 }, ISLE_FOOD = 6;
const isleCrews = () => (G.isle.up ? 5 : 3);
function isleBlock() {
  if (!countDone('shipyard')) return 'Build the Shipyard first.';
  if (!G.stats.exped) return 'Finish one expedition first: the crew has to find the island.';
  if (!canAfford(ISLE_COST)) return 'Not enough wood, food or coins yet to found an outpost.';
  return null;
}
function foundIsle() {
  if (G.isle.on || isleBlock()) { sfx('error'); return false; }
  pay(ISLE_COST); G.isle.on = true; G.isle.crew = { salt: 1, clay: 1, grapes: 1 };
  sfx('quest'); toast('The outpost on the Far Isle is founded. A supply boat will call every morning.', 'quest'); logNews('An outpost was founded on the Far Isle.'); uiDirty(); return true;
}
function isleShift(res, d) {
  const c = G.isle.crew, used = c.salt + c.clay + c.grapes;
  if (d > 0 && used >= isleCrews()) return false;
  if (d < 0 && c[res] <= 0) return false;
  c[res] += d; sfx('click'); uiDirty(); return true;
}
function upgradeIsle() {
  if (!G.isle.on || G.isle.up || !canAfford(ISLE_UP)) { sfx('error'); return false; }
  pay(ISLE_UP); G.isle.up = true; sfx('quest'); toast('The outpost has grown: room for 5 crews.', 'quest'); uiDirty(); return true;
}
function isleDay() {
  if (!G.isle.on) return;
  const c = G.isle.crew, crews = c.salt + c.clay + c.grapes; if (!crews) return;
  const need = crews * ISLE_FOOD, fed = G.res.food >= need + G.villagers.length * 2;
  if (fed) G.res.food -= need;
  const got = [];
  for (const r of ['salt', 'clay', 'grapes']) { const n = store(r, Math.round(c[r] * ISLE_YIELD[r] * (fed ? 1 : 0.5))); if (n) got.push(n + ' ' + RES[r].toLowerCase()); G.stats.isle = (G.stats.isle || 0) + n; }
  const msg = 'The supply boat from the Far Isle brought ' + (got.join(', ') || 'nothing: the stores are full') + (fed ? '.' : '. There was no food to send, so the crews worked at half strength.');
  logNews(msg); toast(msg, fed ? 'good' : 'bad');
}
function pantryDay() {                   // salt, grapes, cake and clothes are used up a little every day
  const pop = G.villagers.length;
  const use = (res, per) => { if (G.res[res] > 0) G.res[res] = Math.max(0, G.res[res] - Math.max(1, Math.round(pop / per))); };
  use('salt', 8); if (staffed('tavern')) use('grapes', 10); use('cake', 12); if (G.season === 3) use('clothes', 10);
}
const foodK = () => (G.res.salt > 0 ? 0.85 : 1);          // salted food keeps: the village eats 15% less

// ----- 4. events with a choice -----
const CHOICE_GAP = 3;
const CHOICES = [
  { id: 'pedlar', when: () => countDone('farm') > 0 && G.res.coins >= 30, title: 'A pedlar with seeds',
    text: 'A pedlar unpacks a tray of strange seeds on the green. "Thirty coins," she says, "and your fields will thank me by morning."',
    a: ['Buy the seeds (30 coins)', () => { G.res.coins -= 30; for (const b of G.buildings) if (b.type === 'farm' && b.done) b.growth = 1; G.res.grain += 15; return 'The seeds were as good as her word: every field is ready and there are 15 sacks of grain besides.'; }],
    b: ['Send her on her way', () => { G.res.coins += 5; G.stats.coins += 5; return 'She shrugs, sells a few ribbons instead and leaves 5 coins for the pitch.'; }] },
  { id: 'storm', when: () => countDone('farm') > 0, title: 'Dark clouds over the sea',
    text: 'The fishers say a storm will hit tonight. The grain is not quite ripe yet.',
    a: ['Bring the harvest in early', () => { let n = 0; for (const b of G.buildings) if (b.type === 'farm' && b.done) { n += Math.round(8 * b.growth); b.growth = 0; } G.res.grain += n; G.rain = Math.max(G.rain, 50); return 'Everyone helped. ' + n + ' grain is safe in the store, and the storm found empty fields.'; }],
    b: ['Trust the weather to turn', () => { G.rain = Math.max(G.rain, 50); if (Math.random() < 0.5) return 'The storm passed out at sea. The fields stand tall.'; const f = G.buildings.filter((b) => b.type === 'farm' && b.done); for (const b of f) b.growth *= 0.3; return 'The storm came ashore and flattened most of the grain.'; }] },
  { id: 'sick', when: () => countDone('pasture') + countDone('coop') + countDone('cowshed') > 0, title: 'The animals are poorly',
    text: 'The sheep cough, the hens will not lay. The herb woman can mix a cure, but she wants honey for it.',
    a: ['Pay her 6 honey', () => { if (G.res.honey < 6) { G.sickUntil = G.clock + DAY_LEN * 0.5; return 'There was not enough honey for a full cure. The animals rest until this evening.'; } G.res.honey -= 6; return 'By noon the whole flock is back on its feet.'; }],
    b: ['Let them rest', () => { G.sickUntil = G.clock + DAY_LEN; G.foxUntil = Math.max(G.foxUntil, G.clock + DAY_LEN); return 'No wool, eggs or milk today. They will be better tomorrow.'; }] },
  { id: 'sailors', when: () => G.res.food >= 50, title: 'Stranded sailors',
    text: 'A small boat washed up on the beach with three hungry sailors. They ask for food, and perhaps a place to stay.',
    a: ['Take them in (40 food)', () => { G.res.food -= 40; if (G.villagers.length < Math.min(bedCount(), MAX_POP)) { const c = G.center, v = spawnVillager(c.cx + rand(-2, 2), c.cz + 2.5); v.age = 12; assignHomes(); return v.name + ' decides to stay in Bumblenook. The others sail on, well fed.'; } G.res.coins += 30; G.stats.coins += 30; return 'There was no free bed, so they sailed on after a good meal and left 30 coins in thanks.'; }],
    b: ['Give them supplies for the journey (15 food)', () => { G.res.food -= 15; G.res.coins += 20; G.stats.coins += 20; return 'They mend the boat and leave on the evening tide, paying 20 coins for the kindness.'; }] },
  { id: 'circus', when: () => G.res.coins >= 40 && G.villagers.length >= 8, title: 'A travelling circus',
    text: 'Jugglers, a fire-eater and a very old bear in a hat. They will perform on the green for forty coins.',
    a: ['Let the show begin (40 coins)', () => { G.res.coins -= 40; G.cheer = G.clock + DAY_LEN * 1.5; for (const v of G.villagers) if (v.need) v.need.company = Math.min(1, v.need.company + 0.3); G.fireworks = Math.max(G.fireworks || 0, 6); return 'The whole village laughed until dark. Spirits will be high for a day and a half.'; }],
    b: ['Not today', () => 'The circus moves on to the next island. The children wave until it is out of sight.'] },
  { id: 'map', when: () => G.res.coins >= 50 && W.sites && W.sites.some((s) => !s.found), title: 'An old map',
    text: 'A sailor at the tavern has a map of this very island, with a cross on it. He will part with it for fifty coins.',
    a: ['Buy the map (50 coins)', () => { G.res.coins -= 50; const s = W.sites.find((q) => !q.found); if (!s) return 'The cross marks a place you already know.'; s.found = true; markSite(s); G.stats.explored++; G.res.coins += 70; G.stats.coins += 70; return 'The cross was real: the ' + SITE_KINDS[s.kind].name + ' gave up 70 coins, and its story is in the almanac.'; }],
    b: ['Keep the coins', () => 'He folds the map away with a grin. "Your loss."'] },
  { id: 'wedding', when: () => G.res.food >= 40 && G.villagers.length >= 10, title: 'A wedding on the green',
    text: 'Two villagers want to marry this week, and they would love a proper feast.',
    a: ['Hold a feast (35 food, 3 honey)', () => { G.res.food -= 35; G.res.honey = Math.max(0, G.res.honey - 3); G.cheer = G.clock + DAY_LEN * 2; G.babySoon = true; return 'Music, dancing and far too much cake. The village will be cheerful for two days.'; }],
    b: ['Keep it small', () => { G.cheer = G.clock + DAY_LEN * 0.5; return 'A quiet promise under the old tree. It was lovely all the same.'; }] },
  { id: 'swarm', when: () => countDone('apiary') > 0 && countDone('house') > 2, title: 'Bees in the chimney',
    text: 'A swarm has moved into a cottage chimney. The beekeeper could coax them into a hive, but it will take all day.',
    a: ['Move them to the apiary', () => { G.res.honey += 8; G.stats.honey += 8; return 'It took all day and a few stings, but there is a new hive: 8 extra honey.'; }],
    b: ['Smoke them out', () => { G.res.wood = Math.max(0, G.res.wood - 10); return 'A fire of damp wood did the trick. The bees left for the forest, and so did 10 wood.'; }] },
];
function choiceDay() {
  if (G.pending || G.level < 1 || G.day < 5 || G.day - (G.lastChoice || 0) < CHOICE_GAP || Math.random() > 0.5) return;
  const pool = CHOICES.filter((c) => c.when() && c.id !== G.prevChoice);
  if (!pool.length) return;
  const c = pick(pool); G.pending = c.id; G.lastChoice = G.day; G.prevChoice = c.id;
  showChoice();
}
function resolveChoice(n) {
  const c = CHOICES.find((q) => q.id === G.pending); if (!c) { G.pending = null; return; }
  const msg = (n ? c.b : c.a)[1]();
  G.pending = null; G.stats.choices = (G.stats.choices || 0) + 1;
  logNews(msg); toast(msg, 'quest'); sfx('click'); uiDirty();
}

// ----- 9. challenges -----
const SCENARIOS = [
  { id: 'winter', name: 'The Hard Winter', desc: 'Autumn is nearly over and there are six mouths to feed. Reach spring without the village going hungry.',
    goal: 'Reach spring (day 17) with less than a minute of hunger', ban: [],
    setup() { G.day = 10; for (let q = 0; q < 2; q++) spawnVillager(G.center.cx + rand(-2, 2), G.center.cz + 2.6); Object.assign(G.res, { wood: 80, stone: 30, food: 70 }); G.level = 1; },
    prog: () => [Math.min(17, G.day), 17], fail: () => G.scn.hungry > 60, done: () => G.day >= 17,
    medal: () => (G.scn.hungry < 1 && G.happy >= 70 ? 3 : G.scn.hungry < 20 ? 2 : 1), tiers: 'Gold: never hungry and 70% happy. Silver: under 20 seconds of hunger.' },
  { id: 'nomarket', name: 'No Market', desc: 'The merchants have boycotted the island. Build the Lighthouse without ever building a Market.',
    goal: 'Build the Lighthouse', ban: ['market'], setup() {},
    prog: () => [countDone('lighthouse'), 1], fail: () => false, done: () => countDone('lighthouse') > 0,
    medal: () => (G.day <= 40 ? 3 : G.day <= 60 ? 2 : 1), tiers: 'Gold: by day 40. Silver: by day 60.' },
  { id: 'honey', name: 'Honey Rush', desc: 'A ship will pay a fortune for honey, but it sails soon. Fill the pantry with 40 honey.',
    goal: 'Have 40 honey in store', ban: [], setup() { G.level = 1; Object.assign(G.res, { wood: 90, stone: 30 }); },
    prog: () => [Math.min(40, Math.floor(G.res.honey)), 40], fail: () => G.day > 16, done: () => G.res.honey >= 40,
    medal: () => (G.day <= 8 ? 3 : G.day <= 12 ? 2 : 1), tiers: 'Gold: by day 8. Silver: by day 12. The ship leaves after day 16.' },
  { id: 'small', name: 'Small is Beautiful', desc: 'Grow into a Village with at most 14 buildings. Paths, lanterns, flowers and other decor are free.',
    goal: 'Reach Village with 14 buildings or fewer', ban: [], setup() {},
    prog: () => [Math.min(2, G.level), 2], fail: () => scnBuildings() > 14, done: () => G.level >= 2,
    medal: () => (scnBuildings() <= 10 ? 3 : scnBuildings() <= 12 ? 2 : 1), tiers: 'Gold: 10 buildings or fewer. Silver: 12 or fewer.' },
];
const scnBuildings = () => G.buildings.reduce((n, b) => n + (b.type !== 'center' && b.def.cat !== 'sfeer' && !b.def.flat ? 1 : 0), 0);
const scnOf = () => (G.mode.indexOf('scn-') === 0 ? SCENARIOS.find((s) => 'scn-' + s.id === G.mode) : null);
const MEDAL = ['', 'Bronze', 'Silver', 'Gold'];
function medals() { try { return JSON.parse(localStorage.getItem('bumblenook-medals') || '{}'); } catch (e) { return {}; } }
function scenarioSetup() { const s = scnOf(); if (!s) return; G.scn = { hungry: 0, over: 0 }; s.setup(); G.season = seasonOf(G.day); applySeason(); assignHomes(); }
function scenarioTick() {                // once a second
  const s = scnOf(); if (!s || !G.scn || G.scn.over) return;
  if (G.hungry) G.scn.hungry++;
  if (s.fail()) { G.scn.over = -1; sfx('error'); toast('Challenge lost: ' + s.name + '. You can keep building, or start it again from the title screen.', 'bad'); uiDirty(); return; }
  if (!s.done()) return;
  const m = s.medal(); G.scn.over = m;
  try { const all = medals(); if ((all[s.id] || 0) < m) { all[s.id] = m; localStorage.setItem('bumblenook-medals', JSON.stringify(all)); } } catch (e) { /* medals are optional */ }
  G.fireworks = Math.max(G.fireworks || 0, 10); sfx('quest');
  toast('Challenge won: ' + s.name + '. ' + MEDAL[m] + ' medal!', 'quest'); uiDirty();
}

// ----- wiring -----
function lifeBase() {
  for (const r of NEW_RES) G.res[r] = 0;
  G.isle = { on: false, up: false, crew: { salt: 0, clay: 0, grapes: 0 } };
  G.pending = null; G.lastChoice = 0; G.prevChoice = null; G.sickUntil = -1; G.babySoon = false; G.scn = null;
  _roadNav = -1; _hoodNav = -1;
}
function lifeTick() { needsTick(1); scenarioTick(); }
function lifeDay() { ageTick(); isleDay(); pantryDay(); choiceDay(); }
function lifeHappy(add) {
  needParts(add);
  if (G.res.cake > 0) add('Cake on the table', 6);
  if (G.res.grapes > 0 && staffed('tavern')) add('Wine at the tavern', 5);
  if (G.res.clothes > 0) add('Fine new clothes', 4);
  const e = elderCount(); if (e) add('Wise elders', Math.min(4, Math.ceil(e / 3)));
  const kids = G.villagers.filter(isChild).length; if (kids) add('Children playing', Math.min(4, kids));
}
function lifeSave() {
  return { isle: G.isle, pending: G.pending, lastChoice: G.lastChoice, prev: G.prevChoice, sick: Math.max(0, G.sickUntil - G.clock), scn: G.scn,
    p: G.villagers.map((v) => [v.age || 0, v.child ? 1 : 0, v.schooled ? 1 : 0, v.need ? NEED_KEYS.map((k) => +v.need[k].toFixed(2)) : 0]) };
}
function lifeLoad(x) {
  if (!x) { G.villagers.forEach((v, n) => { v.age = 6 + (n * 7) % 22; }); return; }       // an older save: everyone is a grown-up of some age
  if (x.isle) G.isle = x.isle;
  G.pending = x.pending || null; G.lastChoice = x.lastChoice || 0; G.prevChoice = x.prev || null; G.sickUntil = x.sick ? x.sick : -1; G.scn = x.scn || null;
  G.villagers.forEach((v, n) => {
    const a = (x.p || [])[n]; if (!a) { v.age = 8; return; }
    v.age = a[0]; v.child = !!a[1]; v.schooled = !!a[2]; setChildLook(v);
    if (a[3]) { v.need = {}; NEED_KEYS.forEach((k, q) => { v.need[k] = a[3][q]; }); }
    if (v.child && v.job) unassignWorker(v.job, v);
  });
}
// per frame: the handcart shows while someone from a workplace on the road carries goods
function lifeAnimate(v) {
  const u = v.mesh.userData, want = !!(u.carry && u.carry.visible && v.job && v.job.onRoad && v.carry);
  if (want && !u.barrow) { u.barrow = new THREE.Mesh(cachedGeo('barrow', mBarrow), MAT.main); u.barrow.position.set(0, 0, 0.3); u.barrow.castShadow = true; v.mesh.add(u.barrow); }
  if (u.barrow) u.barrow.visible = want;
}
// four more goals, on the tracks that already exist
TRACKS.find((t) => t.id === 'prosper').goals.push(
  { text: 'Join 4 workplaces to a storehouse by path', hint: 'A workplace on the road sends its goods by handcart: a quarter more arrives.', prog: () => [Math.min(4, roadCount()), 4], reward: { coins: 30 } },
  { text: 'Bake 5 cakes and sew 3 sets of clothes', hint: 'The Pastry Shop and the Tailor finish what the bakery and the weaver begin.', prog: () => [Math.min(5, G.stats.cake || 0) + Math.min(3, G.stats.clothes || 0), 8], reward: { coins: 60 } });
TRACKS.find((t) => t.id === 'discover').goals.push(
  { text: 'Found an outpost on the Far Isle', hint: 'Tap the Shipyard after your first expedition.', prog: () => [G.isle && G.isle.on ? 1 : 0, 1], reward: { coins: 80 } },
  { text: 'Bring home 60 goods from the Far Isle', hint: 'Salt keeps food longer, clay makes bricks without stone, grapes become wine at the tavern.', prog: () => [Math.min(60, G.stats.isle || 0), 60], reward: { coins: 120 } });
QUESTS.length = 0; for (const t of TRACKS) for (const q of t.goals) QUESTS.push(q);
function lifeDirty() { _roadNav = -1; _hoodNav = -1; }

// ----- interface -----
const needBar = (id, label) => '<div class="need"><span class="grow">' + label + '</span><span class="bar"><i id="' + id + '"></i></span></div>';
const HOOD_TIP = {
  warm: 'A brazier, the tavern or a bakery close by would keep this home warmer in winter.',
  company: 'A bench, a garden or the pond close by would bring company.',
  beauty: 'Flowers, a garden or a flagpole would brighten this street.',
};
function lifePanelHtml(b) {
  let h = '';
  if (CARRIERS.includes(b.def.job)) h += '<p class="note" id="b-road"></p>';
  if (b.type === 'house' || b.type === 'center') h += '<h3>Neighbourhood</h3>' + NEED_KEYS.map((k) => needBar('b-n-' + k, NEED_NAME[k])).join('') + '<p class="note" id="b-hood"></p>';
  if (b.type === 'shipyard') h += '<h3>The Far Isle</h3><p class="note" id="b-isle"></p><div id="b-islec"></div>';
  return h;
}
function lifePanelUpdate(b) {
  if (CARRIERS.includes(b.def.job)) { roadNet(); $('b-road').textContent = !b.done ? '' : b.onRoad ? 'On the road: goods travel by handcart, a quarter more arrives.' : 'Not joined to a storehouse by path. Lay a path from here to a Storehouse or the green for a quarter more.'; }
  if (b.type === 'house' || b.type === 'center') {
    neighbourhoods(); const h = b.hood;
    if (h) {
      for (const k of NEED_KEYS) $('b-n-' + k).style.width = Math.round(h[k] * 100) + '%';
      let low = 'warm'; for (const k of ['company', 'rest', 'beauty']) if (h[k] < h[low]) low = k;
      $('b-hood').textContent = h[low] >= 0.7 ? 'A lovely place to live.' : low === 'rest' ? (b.type === 'center' ? 'A tent is no place for a good night\'s sleep. Cottages rest better.' : h.loud ? 'The ' + h.loud.def.name + ' close by is noisy. Homes sleep better away from workshops.' : 'A restless spot.') : HOOD_TIP[low];
    }
  }
  if (b.type === 'shipyard') {
    const I = G.isle, blk = I.on ? null : !b.done ? 'Build the Shipyard first.' : isleBlock();
    $('b-isle').textContent = I.on ? 'Every morning a supply boat brings the harvest. Each crew needs ' + ISLE_FOOD + ' food a day. Salt keeps food longer, clay makes bricks without stone, grapes become wine at the tavern.'
      : blk || 'An island over the horizon with salt pans, clay pits and vines. Found an outpost there.';
    const c = I.crew, used = c.salt + c.clay + c.grapes;
    setH('b-islec', !I.on ? '<div class="row"><span class="grow pline">' + costHtml(ISLE_COST) + '</span><button type="button" class="btn" id="b-found"' + (blk ? ' disabled' : '') + '>Found an outpost</button></div>'
      : '<p class="note">Crews at work: ' + used + ' of ' + isleCrews() + '</p>' + ['salt', 'clay', 'grapes'].map((r) => '<div class="row"><span class="grow isl">' + ic(r) + '<span>' + RES[r] + ' (' + ISLE_YIELD[r] + ' a day each)</span></span><button type="button" class="sq" data-isle="' + r + ':-1" aria-label="Fewer"' + (c[r] ? '' : ' disabled') + '>' + ic('minus') + '</button><b class="cnt">' + c[r] + '</b><button type="button" class="sq plus" data-isle="' + r + ':1" aria-label="More"' + (used >= isleCrews() ? ' disabled' : '') + '>' + ic('plus') + '</button></div>').join('') +
        (I.up ? '' : '<div class="row"><span class="grow pline">' + costHtml(ISLE_UP) + '</span><button type="button" class="btn" id="b-isleup"' + (canAfford(ISLE_UP) ? '' : ' disabled') + '>Enlarge: 5 crews</button></div>'));
  }
}
function lifePanelClick(t) {
  if (t.id === 'b-found') { foundIsle(); return true; }
  if (t.id === 'b-isleup') { upgradeIsle(); return true; }
  if (t.dataset.isle) { const a = t.dataset.isle.split(':'); if (!isleShift(a[0], +a[1])) sfx('error'); return true; }
  return false;
}
const lifeVillagerHtml = () => '<p class="note" id="v-life"></p><p class="note" id="v-life2"></p>' + NEED_KEYS.map((k) => needBar('v-n-' + k, NEED_NAME[k])).join('');
function lifeVillagerUpdate(v) {
  $('v-life').textContent = ageName(v) + ', ' + v.age + (v.age === 1 ? ' day' : ' days') + ' in Bumblenook.';
  $('v-life2').textContent = v.child ? (staffed('school') ? 'Too young to work: plays on the green and goes to school.' : 'Too young to work: plays on the green. A school helps children grow up sooner.') : v.age >= ELDER_AGE ? 'Works at a gentler pace, and the village is happier for the stories.' : '';
  const n = v.need || hoodOf(v);
  if (n) for (const k of NEED_KEYS) $('v-n-' + k).style.width = Math.round(n[k] * 100) + '%';
}
function lifeCardText(base) {
  const s = scnOf(); if (!s || !G.scn) return base;
  const p = s.prog();
  return 'Challenge · ' + (G.scn.over > 0 ? MEDAL[G.scn.over] + ' medal won' : G.scn.over < 0 ? 'lost' : s.goal + ' (' + p[0] + '/' + p[1] + ')');
}
function lifeVillageUpdate() {
  const s = scnOf();
  setH('vl-scn', !s || !G.scn ? '' : '<h3>Challenge</h3><p class="status">' + s.name + '</p><p class="note">' + s.goal + '</p><p class="note">' + s.tiers + '</p><p class="note">' + (G.scn.over > 0 ? 'Won with a ' + MEDAL[G.scn.over].toLowerCase() + ' medal.' : G.scn.over < 0 ? 'Lost this time. Start it again from the title screen.' : 'Still open.') + '</p>');
}
function showChoice() {
  const c = CHOICES.find((q) => q.id === G.pending); if (!c || !G.started) return;
  $('ev-title').textContent = c.title; $('ev-text').textContent = c.text; $('ev-a').textContent = c.a[0]; $('ev-b').textContent = c.b[0];
  openModal('event'); sfx('quest');
}
function openChallenges() {
  const got = medals();
  $('ch-list').innerHTML = SCENARIOS.map((s) => '<div class="tech' + (got[s.id] ? ' got' : '') + '"><div class="grow"><b>' + s.name + '</b><span>' + s.desc + '</span><span class="why">' + s.tiers + '</span></div><button type="button" class="btn" data-scn="' + s.id + '">' + (got[s.id] ? MEDAL[got[s.id]] : 'Play') + '</button></div>').join('');
  openModal('chal');
}
function startScenario(id) {
  const mode = 'scn-' + id, sv = readSave(mode);
  audioInit(); UIS.hadSave = false;
  if (sv && sv.x && sv.x.scn && !sv.x.scn.over) { try { loadGame(sv); UIS.hadSave = true; } catch (e) { UIS.hadSave = false; } }
  if (!UIS.hadSave) { clearSave(mode); newGame((Math.random() * 1e6) | 0, mode); centerCamera(); }
  closeModal(); enterGame(); sfx('done');
  const s = scnOf(); toast('Challenge: ' + s.goal, 'quest');
}
