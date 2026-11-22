// ---------- more buildings: tavern, school, pasture, weaver, harbour, bell tower, hedge, statue ----------
function mTavern() {
  const b = new MB();
  b.box(1.5, 0.55, 1.2, 0, 0, -0.15, C.stoneL).box(1.54, 0.08, 1.24, 0, 0, -0.15, C.stoneD);
  b.box(1.64, 0.07, 1.34, 0, 0.55, -0.15, C.woodD).box(1.6, 0.5, 1.3, 0, 0.62, -0.15, C.plaster);
  for (const sx of [-1, 0, 1]) b.box(0.07, 0.5, 0.07, sx * 0.78, 0.62, 0.48, C.woodD).box(0.07, 0.5, 0.07, sx * 0.78, 0.62, -0.78, C.woodD);
  b.gable(1.6, 0.6, 1.3, 0, 1.12, -0.15, C.plaster).gable(1.8, 0.72, 1.56, 0, 1.1, -0.15, 0x7a3b2e);
  b.box(0.24, 0.75, 0.24, -0.5, 1.25, -0.4, C.stoneD).box(0.3, 0.06, 0.3, -0.5, 2.0, -0.4, C.stone);
  b.box(0.3, 0.46, 0.05, 0, 0, 0.46, C.woodD).box(0.03, 0.03, 0.03, 0.1, 0.24, 0.5, C.gold);
  b.glow(0.22, 0.2, 0.04, -0.45, 0.32, 0.455).glow(0.22, 0.2, 0.04, 0.45, 0.32, 0.455).glow(0.2, 0.2, 0.04, -0.38, 0.88, 0.505).glow(0.2, 0.2, 0.04, 0.38, 0.88, 0.505).glow(0.04, 0.2, 0.2, 0.805, 0.88, -0.15).glow(0.04, 0.2, 0.2, -0.805, 0.88, -0.15);
  b.box(0.04, 0.04, 0.34, 0.62, 1.0, 0.66, C.dark).box(0.26, 0.2, 0.03, 0.62, 0.78, 0.8, C.gold).box(0.1, 0.1, 0.035, 0.62, 0.83, 0.8, C.woodD);
  b.cyl(0.2, 0.2, 0.04, 8, -0.6, 0.24, 0.78, C.woodL).cyl(0.04, 0.05, 0.24, 5, -0.6, 0, 0.78, C.woodD).cyl(0.07, 0.07, 0.14, 6, -0.88, 0, 0.66, C.wood).cyl(0.07, 0.07, 0.14, 6, -0.36, 0, 0.9, C.wood).cyl(0.03, 0.03, 0.06, 5, -0.55, 0.28, 0.75, C.gold);
  b.cyl(0.13, 0.13, 0.3, 8, 0.34, 0, 0.72, C.woodD).cyl(0.135, 0.135, 0.03, 8, 0.34, 0.18, 0.72, C.iron);
  return b.build();
}
function mSchool() {
  const b = new MB();
  b.box(1.4, 0.1, 1.1, 0, 0, -0.2, C.stone).box(1.3, 0.7, 1.0, 0, 0.1, -0.2, C.white).gable(1.3, 0.5, 1.0, 0, 0.8, -0.2, C.white).gable(1.5, 0.6, 1.24, 0, 0.78, -0.2, C.roofR);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.04, 0.3, 0.04, sx * 0.11, 1.3, -0.2 + sz * 0.11, C.white);
  b.cone(0.26, 0.28, 4, 0, 1.6, -0.2, C.roofR, [0, Math.PI / 4, 0]).sph(0.07, 0, 1.46, -0.2, C.gold);
  b.box(0.3, 0.5, 0.05, 0, 0.1, 0.31, C.roofB).box(0.5, 0.06, 0.2, 0, 0.02, 0.42, C.stoneL);
  b.glow(0.22, 0.26, 0.04, -0.42, 0.5, 0.305).glow(0.22, 0.26, 0.04, 0.42, 0.5, 0.305).glow(0.04, 0.26, 0.22, 0.655, 0.5, -0.2).glow(0.04, 0.26, 0.22, -0.655, 0.5, -0.2);
  b.box(0.5, 0.34, 0.04, -0.6, 0.2, 0.76, 0x2f4a3a, [0, 0.4, 0]).box(0.04, 0.5, 0.04, -0.82, 0, 0.67, C.woodD).box(0.04, 0.5, 0.04, -0.4, 0, 0.85, C.woodD).box(0.3, 0.02, 0.045, -0.6, 0.4, 0.765, C.white, [0, 0.4, 0]);
  b.cyl(0.02, 0.025, 1.0, 4, 0.78, 0, 0.6, C.woodD).box(0.26, 0.16, 0.02, 0.92, 0.82, 0.6, C.roofB);
  b.box(0.12, 0.12, 0.12, 0.4, 0, 0.75, C.red).box(0.12, 0.12, 0.12, 0.55, 0, 0.84, C.gold, [0, 0.5, 0]).box(0.11, 0.11, 0.11, 0.46, 0.12, 0.79, C.roofB, [0, 0.3, 0]);
  return b.build();
}
function mPasture() {
  const b = new MB();
  // open shelter, hay and a trough along the back
  b.box(0.07, 0.6, 0.07, -1.2, 0, -0.7, C.woodD).box(0.07, 0.6, 0.07, -0.1, 0, -0.7, C.woodD).box(1.3, 0.55, 0.06, -0.65, 0, -1.36, C.wood).box(0.06, 0.55, 0.66, -1.3, 0, -1.03, C.wood).box(0.06, 0.55, 0.66, 0, 0, -1.03, C.wood);
  b.box(1.5, 0.07, 0.95, -0.65, 0.62, -1.0, C.thatch, [0.22, 0, 0]).box(1.2, 0.05, 0.6, -0.65, 0.02, -1.02, 0xd8c070);
  b.cyl(0.2, 0.2, 0.36, 9, 0.5, 0.2, -1.05, C.wheat, [0, 0, Math.PI / 2]).cyl(0.2, 0.2, 0.36, 9, 0.95, 0.2, -1.1, 0xd9b84a, [0, 0.3, Math.PI / 2]).cyl(0.2, 0.2, 0.36, 9, 0.7, 0.56, -1.08, C.wheat, [0, 0.1, Math.PI / 2]);
  b.box(0.5, 0.14, 0.2, 1.05, 0, -0.68, C.woodL).box(0.44, 0.02, 0.14, 1.05, 0.13, -0.68, 0x4fb3d6);
  for (let q = 0; q <= 6; q++) { if (q === 3) continue; const x = -1.42 + q * 0.473, gate = q === 2 || q === 4; b.box(gate ? 0.08 : 0.06, gate ? 0.36 : 0.28, gate ? 0.08 : 0.06, x, 0, 1.42, gate ? C.woodD : C.woodL); }
  for (let q = 0; q <= 3; q++) { const z = -0.42 + q * 0.613; b.box(0.06, 0.28, 0.06, -1.42, 0, z, C.woodL).box(0.06, 0.28, 0.06, 1.42, 0, z, C.woodL); }
  for (const y of [0.11, 0.21]) b.box(0.95, 0.035, 0.03, -0.945, y, 1.42, C.wood).box(0.95, 0.035, 0.03, 0.945, y, 1.42, C.wood).box(0.03, 0.035, 1.84, -1.42, y, 0.5, C.wood).box(0.03, 0.035, 1.84, 1.42, y, 0.5, C.wood);
  return b.build();
}
function mSheep() {
  const b = new MB();
  b.sph(0.15, 0, 0.2, 0, 0xf5f1e6, [1, 0.95, 1.3], 1).sph(0.075, 0, 0.27, 0.2, 0x4a4038, [0.9, 1, 1.1], 1).box(0.03, 0.03, 0.08, -0.07, 0.3, 0.17, 0x4a4038, [0, 0, 0.5]).box(0.03, 0.03, 0.08, 0.07, 0.3, 0.17, 0x4a4038, [0, 0, -0.5]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.035, 0.1, 0.035, sx * 0.07, 0, sz * 0.11, 0x4a4038);
  b.sph(0.05, 0, 0.24, -0.2, 0xf5f1e6);
  return b.build().geo;
}
function mWeaver() {
  const b = new MB();
  b.box(1.26, 0.1, 1.06, -0.2, 0, -0.3, C.stone).box(1.2, 0.68, 1.0, -0.2, 0.1, -0.3, C.plaster).gable(1.2, 0.48, 1.0, -0.2, 0.78, -0.3, C.plaster).gable(1.4, 0.58, 1.24, -0.2, 0.76, -0.3, 0x3f8f8a);
  b.box(0.28, 0.46, 0.05, -0.5, 0.1, 0.21, C.woodD).glow(0.24, 0.22, 0.04, 0.05, 0.5, 0.205).glow(0.04, 0.22, 0.22, -0.805, 0.5, -0.3);
  // loom
  b.box(0.05, 0.6, 0.05, 0.5, 0, 0.3, C.woodD).box(0.05, 0.6, 0.05, 0.9, 0, 0.3, C.woodD).box(0.5, 0.05, 0.05, 0.7, 0.58, 0.3, C.wood).box(0.5, 0.05, 0.05, 0.7, 0.16, 0.3, C.wood);
  for (let q = 0; q < 6; q++) b.box(0.015, 0.4, 0.015, 0.54 + q * 0.065, 0.18, 0.3, C.white);
  b.box(0.36, 0.14, 0.02, 0.7, 0.2, 0.31, C.roofB).box(0.3, 0.05, 0.25, 0.7, 0.14, 0.5, C.woodL).box(0.05, 0.14, 0.05, 0.58, 0, 0.5, C.woodD).box(0.05, 0.14, 0.05, 0.82, 0, 0.5, C.woodD);
  // drying line with cloth
  b.box(0.04, 0.6, 0.04, -0.9, 0, 0.75, C.woodD).box(0.04, 0.6, 0.04, 0.2, 0, 0.85, C.woodD).box(1.1, 0.02, 0.02, -0.35, 0.57, 0.8, C.dark, [0, -0.09, 0]);
  const cl = [C.red, C.gold, C.roofB, C.white];
  for (let q = 0; q < 4; q++) b.box(0.2, 0.26 - (q % 2) * 0.06, 0.02, -0.74 + q * 0.26, 0.3 + (q % 2) * 0.06, 0.765 + q * 0.024, cl[q], [0, -0.09, 0]);
  b.cyl(0.13, 0.1, 0.12, 7, 0.25, 0, 0.45, C.woodL).sph(0.11, 0.25, 0.16, 0.45, 0xf5f1e6, [1, 0.7, 1]);
  return b.build();
}
function mHarbour() {
  const b = new MB();
  b.box(1.84, 0.12, 1.84, 0, 0, 0, C.woodL);
  for (let q = 0; q < 6; q++) b.box(1.84, 0.005, 0.02, 0, 0.12, -0.75 + q * 0.3, C.woodD);
  b.box(1.0, 0.6, 0.8, -0.3, 0.12, -0.4, 0xe9eef0).gable(1.0, 0.4, 0.8, -0.3, 0.72, -0.4, 0xe9eef0).gable(1.18, 0.5, 1.02, -0.3, 0.7, -0.4, 0x2c4f7a);
  b.box(0.26, 0.42, 0.05, -0.5, 0.12, 0.01, C.woodD).glow(0.2, 0.2, 0.04, -0.08, 0.46, 0.005).glow(0.04, 0.2, 0.2, 0.205, 0.46, -0.4);
  b.cyl(0.035, 0.045, 1.9, 5, 0.6, 0.12, -0.55, C.woodD).box(0.7, 0.04, 0.04, 0.6, 1.5, -0.55, C.woodD);
  const fl = [C.red, C.gold, C.roofB, C.white];
  for (let q = 0; q < 4; q++) b.cone(0.07, 0.13, 3, 0.33 + q * 0.18, 1.36, -0.55, fl[q], [Math.PI, 0, 0]);
  b.box(0.3, 0.3, 0.3, 0.55, 0.12, 0.25, C.plank).box(0.26, 0.26, 0.26, 0.6, 0.42, 0.22, C.wood, [0, 0.4, 0]).box(0.3, 0.28, 0.3, 0.2, 0.12, 0.55, C.woodL, [0, 0.2, 0]);
  b.cyl(0.13, 0.13, 0.3, 8, -0.6, 0.12, 0.6, C.woodD).cyl(0.135, 0.135, 0.03, 8, -0.6, 0.3, 0.6, C.iron).cyl(0.16, 0.16, 0.07, 9, -0.2, 0.12, 0.65, 0xcdb588);
  b.cyl(0.13, 0.13, 0.05, 10, 0.21, 0.5, -0.1, C.white, [0, 0, Math.PI / 2]).cyl(0.07, 0.07, 0.06, 8, 0.21, 0.5, -0.1, C.red, [0, 0, Math.PI / 2]);
  b.box(0.04, 0.3, 0.04, 0.75, 0.12, 0.7, C.iron).box(0.22, 0.04, 0.04, 0.75, 0.14, 0.7, C.iron).box(0.12, 0.04, 0.04, 0.75, 0.4, 0.7, C.iron);
  return b.build();
}
function mBoat() {
  const b = new MB();
  b.sph(0.5, 0, 0.12, 0, C.wood, [1.7, 0.5, 0.62], 1).box(1.2, 0.06, 0.46, 0, 0.2, 0, C.woodL).box(0.5, 0.2, 0.3, -0.45, 0.26, 0, C.plank);
  b.cyl(0.03, 0.04, 1.5, 5, 0.1, 0.26, 0, C.woodD).box(0.03, 0.9, 0.8, 0.14, 0.7, 0, 0xfff4d6).box(0.035, 0.16, 0.8, 0.14, 1.05, 0, C.gold).box(0.035, 0.16, 0.8, 0.14, 0.78, 0, C.gold);
  b.cone(0.07, 0.16, 3, 0.1, 1.78, 0.06, C.red, [0, 0, Math.PI / 2]).box(0.18, 0.16, 0.18, 0.5, 0.26, 0.05, C.woodL, [0, 0.4, 0]).cyl(0.08, 0.08, 0.18, 7, 0.55, 0.26, -0.15, C.woodD);
  return b.build().geo;
}
function mBelltower() {
  const b = new MB();
  b.box(0.8, 0.16, 0.8, 0, 0, 0, C.stoneD).cyl(0.34, 0.42, 1.5, 4, 0, 0.16, 0, C.stoneL, [0, Math.PI / 4, 0]);
  b.box(0.2, 0.34, 0.05, 0, 0.16, 0.3, C.woodD).glow(0.1, 0.2, 0.04, 0, 0.95, 0.27).box(0.6, 0.06, 0.6, 0, 1.66, 0, C.stoneD);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.07, 0.42, 0.07, sx * 0.22, 1.72, sz * 0.22, C.stoneL);
  b.sph(0.14, 0, 1.95, 0, C.gold, [1, 1.15, 1], 1).cyl(0.16, 0.16, 0.03, 8, 0, 1.8, 0, C.gold).sph(0.04, 0, 1.76, 0, C.dark);
  b.box(0.62, 0.06, 0.62, 0, 2.14, 0, C.stoneD).cone(0.44, 0.6, 4, 0, 2.2, 0, C.roofR, [0, Math.PI / 4, 0]).sph(0.05, 0, 2.82, 0, C.gold);
  return b.build();
}
function mHedge() {
  const b = new MB();
  b.box(0.96, 0.36, 0.44, 0, 0, 0, C.leafD);
  for (let q = 0; q < 5; q++) b.sph(0.17, -0.36 + q * 0.18, 0.36 + (q % 2) * 0.03, (q % 2 ? 0.05 : -0.05), q % 2 ? C.leaf : 0x5f9e45, [1, 0.7, 1.2]);
  b.sph(0.03, -0.2, 0.3, 0.23, C.pink).sph(0.03, 0.25, 0.22, 0.23, C.white).sph(0.03, 0.05, 0.16, 0.23, C.pink);
  return b.build();
}
function mStatue() {
  const b = new MB();
  b.box(0.6, 0.1, 0.6, 0, 0, 0, C.stoneD).box(0.46, 0.34, 0.46, 0, 0.1, 0, C.stoneL).box(0.52, 0.05, 0.52, 0, 0.44, 0, C.stone).box(0.24, 0.12, 0.02, 0, 0.2, 0.235, C.gold);
  b.cyl(0.085, 0.13, 0.26, 7, 0, 0.49, 0, C.stone).sph(0.1, 0, 0.84, 0, C.stone, null, 1).cyl(0.19, 0.19, 0.015, 9, 0, 0.91, 0, C.stone).cyl(0.085, 0.1, 0.08, 7, 0, 0.92, 0, C.stone);
  b.box(0.05, 0.22, 0.05, 0.17, 0.72, 0, C.stone, [0, 0, -0.5]).box(0.05, 0.2, 0.05, -0.14, 0.55, 0, C.stone, [0, 0, -0.15]);
  b.sph(0.07, 0.26, 0.98, 0, C.gold, [1.3, 1, 1], 1).box(0.03, 0.14, 0.15, 0.25, 0.91, 0, C.dark).box(0.12, 0.01, 0.07, 0.26, 1.05, 0.06, C.white, [0.5, 0, 0]).box(0.12, 0.01, 0.07, 0.26, 1.05, -0.06, C.white, [-0.5, 0, 0]);
  return b.build();
}
Object.assign(MODEL_FN, { tavern: mTavern, school: mSchool, pasture: mPasture, weaver: mWeaver, harbour: mHarbour, belltower: mBelltower, hedge: mHedge, statue: mStatue });
EXTRA_FN.pasture = (g, ex) => {
  ex.sheep = [];
  for (let q = 0; q < 3; q++) {
    const m = new THREE.Mesh(cachedGeo('sheep', mSheep), MAT.main); m.castShadow = true;
    const s = { m, x: -0.8 + q * 0.75, z: 0.15 + (q % 2) * 0.6, tx: 0, tz: 0.5, wait: Math.random() * 4, rot: Math.random() * TAU, hop: Math.random() * 6 };
    m.position.set(s.x, 0, s.z); g.add(m); ex.sheep.push(s);
  }
};
function animateSheep(u, dt, t) {
  for (const s of u.sheep) {
    s.wait -= dt;
    if (s.wait <= 0 && s.wait > -90) { s.tx = rand(-1.1, 1.1); s.tz = rand(-0.2, 1.1); s.wait = -100; }
    if (s.wait < -90) {
      const dx = s.tx - s.x, dz = s.tz - s.z, d = Math.hypot(dx, dz);
      if (d < 0.05) s.wait = rand(2, 7);
      else { s.x += dx / d * dt * 0.25; s.z += dz / d * dt * 0.25; const tr = Math.atan2(dx, dz); let df = tr - s.rot; while (df > Math.PI) df -= TAU; while (df < -Math.PI) df += TAU; s.rot += df * Math.min(1, dt * 4); }
    }
    s.m.position.set(s.x, s.wait < -90 ? Math.abs(Math.sin(t * 7 + s.hop)) * 0.03 : 0, s.z); s.m.rotation.y = s.rot;
    s.m.rotation.x = s.wait > 0 && s.wait < 1.5 ? 0.25 : 0;       // nibbling
  }
}
Object.assign(JOBS, {
  innkeeper: { title: 'Innkeeper', plural: 'Innkeepers', shirt: 0xa8643c, hat: 'none' },
  teacher: { title: 'Teacher', plural: 'Teachers', shirt: 0x3d4a66, hat: 'beret', hatC: 0x2f3b4f },
  shepherd: { title: 'Shepherd', plural: 'Shepherds', shirt: 0x6f9a54, hat: 'straw' },
  weaver: { title: 'Weaver', plural: 'Weavers', shirt: 0x86b5d9, hat: 'beanie', hatC: 0x3f6fa8 },
  docker: { title: 'Dockhand', plural: 'Dockhands', shirt: 0x2c5a8a, hat: 'cap', hatC: 0x24476b },
});
CARRY_FN.wool = (b) => b.sph(0.085, 0, 0.07, 0, 0xf5f1e6, [1.2, 0.85, 1], 1);
CARRY_FN.cloth = (b) => b.box(0.17, 0.05, 0.13, 0, 0, 0, C.roofB).box(0.17, 0.02, 0.05, 0, 0.05, 0, C.white);
