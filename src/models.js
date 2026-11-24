// ---------- models: every building and villager is built from code ----------
const ROOFS = [C.roofR, C.roofB, C.roofG, C.roofY, C.roofP];

function mCenter() {
  const b = new MB();
  for (let q = 0; q < 9; q++) { const a = q / 9 * TAU; b.box(0.13, 0.1, 0.1, Math.cos(a) * 0.34, 0, Math.sin(a) * 0.34, q % 2 ? C.stone : C.stoneL, [0, -a, 0]); }
  b.cyl(0.05, 0.05, 0.5, 5, 0, 0.06, 0, C.woodD, [0, 0.3, 1.2]).cyl(0.05, 0.05, 0.5, 5, 0, 0.06, 0, C.wood, [0, 2.2, 1.2]).cyl(0.05, 0.05, 0.5, 5, 0, 0.06, 0, C.woodD, [0, 4.3, 1.2]);
  b.cyl(0.1, 0.1, 0.8, 6, -0.85, 0.02, 0.35, C.wood, [Math.PI / 2, 0, 0.5]).cyl(0.1, 0.1, 0.8, 6, 0.85, 0.02, 0.35, C.woodL, [Math.PI / 2, 0, -0.5]);
  // tents
  b.gable(0.95, 0.62, 1.0, -0.9, 0, -0.85, C.white, 0.5).box(0.05, 0.7, 0.05, -0.9, 0, -0.85, C.woodD);
  b.gable(0.95, 0.62, 1.0, 0.95, 0, -0.8, 0xf2c98a, -0.45).box(0.05, 0.7, 0.05, 0.95, 0, -0.8, C.woodD);
  b.box(0.3, 0.3, 0.02, -0.63, 0, -0.42, C.dark, [0, 0.5, 0]).box(0.3, 0.3, 0.02, 0.73, 0, -0.38, C.dark, [0, -0.45, 0]);
  // flag
  b.cyl(0.035, 0.045, 1.9, 5, 0, 0, -1.2, C.woodD).box(0.6, 0.36, 0.03, 0.33, 1.5, -1.2, C.gold).box(0.1, 0.36, 0.035, 0.26, 1.5, -1.2, C.dark).box(0.1, 0.36, 0.035, 0.46, 1.5, -1.2, C.dark).sph(0.06, 0, 1.94, -1.2, C.gold);
  // stockpile
  b.box(0.32, 0.3, 0.32, 1.05, 0, 0.75, C.plank).box(0.3, 0.28, 0.3, 0.72, 0, 0.95, C.woodL, [0, 0.4, 0]).box(0.26, 0.24, 0.26, 1.0, 0.3, 0.8, C.wood, [0, 0.3, 0]);
  b.cyl(0.14, 0.14, 0.34, 8, 1.15, 0, 1.15, C.woodD).cyl(0.145, 0.145, 0.04, 8, 1.15, 0.22, 1.15, C.iron);
  // signpost
  b.box(0.06, 0.6, 0.06, -1.1, 0, 1.0, C.woodD).box(0.5, 0.3, 0.05, -1.1, 0.5, 1.0, C.woodL).box(0.4, 0.04, 0.06, -1.1, 0.68, 1.0, C.dark).box(0.3, 0.04, 0.06, -1.14, 0.58, 1.0, C.dark);
  return b.build();
}
function mHouse(v) {
  const b = new MB(), roof = ROOFS[v % 5], wall = v % 2 ? C.plaster : 0xf7efe0;
  b.box(1.5, 0.1, 1.3, 0, 0, 0, C.stone).box(1.3, 0.75, 1.1, 0, 0.1, 0, wall).box(1.34, 0.07, 1.14, 0, 0.8, 0, C.woodD);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.08, 0.72, 0.08, sx * 0.63, 0.1, sz * 0.53, C.woodD);
  b.gable(1.28, 0.52, 1.1, 0, 0.87, 0, wall).gable(1.56, 0.64, 1.42, 0, 0.84, 0, roof);
  b.box(0.2, 0.55, 0.2, 0.38, 1.0, -0.25, C.stoneD).box(0.26, 0.06, 0.26, 0.38, 1.55, -0.25, C.stone);
  b.box(0.28, 0.48, 0.05, -0.28, 0.1, 0.56, C.woodD).box(0.03, 0.03, 0.03, -0.19, 0.33, 0.6, C.gold).box(0.4, 0.06, 0.18, -0.28, 0.02, 0.68, C.stoneL);
  b.glow(0.24, 0.24, 0.04, 0.3, 0.55, 0.555).box(0.32, 0.04, 0.07, 0.3, 0.38, 0.57, C.woodD).box(0.3, 0.07, 0.08, 0.3, 0.3, 0.6, C.wood);
  b.sph(0.045, 0.22, 0.4, 0.6, C.pink).sph(0.045, 0.3, 0.41, 0.61, C.gold).sph(0.045, 0.38, 0.4, 0.6, C.red);
  b.glow(0.04, 0.24, 0.24, 0.655, 0.55, 0.1).glow(0.04, 0.24, 0.24, -0.655, 0.55, -0.1).glow(0.2, 0.2, 0.04, 0, 1.05, 0.5);
  return b.build();
}
function mLumber() {
  const b = new MB();
  for (let q = 0; q < 4; q++) b.box(1.12 + (q % 2) * 0.06, 0.16, 0.9 + ((q + 1) % 2) * 0.06, -0.2, q * 0.16, -0.25, q % 2 ? C.wood : C.woodD);
  b.gable(1.3, 0.5, 1.15, -0.2, 0.64, -0.25, C.roofG).gable(1.1, 0.4, 0.9, -0.2, 0.64, -0.25, C.woodD);
  b.box(0.26, 0.44, 0.05, -0.45, 0, 0.22, C.dark).glow(0.2, 0.2, 0.04, 0.05, 0.36, 0.215);
  for (let q = 0; q < 3; q++) b.cyl(0.09, 0.09, 0.7, 6, 0.62 + q * 0.01, 0, -0.5 + q * 0.19, C.woodL, [0, 0, Math.PI / 2]);
  b.cyl(0.09, 0.09, 0.7, 6, 0.62, 0.15, -0.4, C.wood, [0, 0, Math.PI / 2]).cyl(0.09, 0.09, 0.7, 6, 0.62, 0.15, -0.21, C.woodL, [0, 0, Math.PI / 2]);
  b.cyl(0.16, 0.18, 0.2, 7, 0.4, 0, 0.6, C.woodL).box(0.04, 0.34, 0.04, 0.42, 0.2, 0.6, C.woodD, [0, 0, -0.5]).box(0.14, 0.09, 0.03, 0.5, 0.42, 0.6, C.iron, [0, 0, -0.5]);
  b.cyl(0.07, 0.07, 0.3, 6, -0.1, 0, 0.7, C.woodL, [0, 0.6, Math.PI / 2]).cyl(0.07, 0.07, 0.3, 6, 0.0, 0, 0.82, C.wood, [0, -0.4, Math.PI / 2]);
  return b.build();
}
function mQuarry() {
  const b = new MB();
  b.box(1.0, 0.62, 0.85, -0.25, 0, -0.3, C.stone).box(1.04, 0.12, 0.89, -0.25, 0, -0.3, C.stoneD);
  b.box(1.2, 0.08, 1.05, -0.25, 0.66, -0.3, C.stoneD, [0.16, 0, 0]).box(0.26, 0.42, 0.05, -0.45, 0, 0.13, C.woodD).glow(0.2, 0.18, 0.04, 0.0, 0.36, 0.13);
  b.box(0.3, 0.22, 0.26, 0.55, 0, -0.55, C.stoneL).box(0.26, 0.2, 0.26, 0.6, 0, -0.2, C.stone, [0, 0.4, 0]).box(0.24, 0.2, 0.22, 0.56, 0.21, -0.42, C.stoneL, [0, 0.2, 0]);
  b.sph(0.2, 0.2, 0.1, 0.65, C.stoneL, [1.2, 0.8, 1]).sph(0.14, -0.1, 0.08, 0.72, C.stone).sph(0.11, 0.42, 0.07, 0.8, C.stoneD);
  b.box(0.07, 1.0, 0.07, 0.7, 0, 0.35, C.woodD).box(0.55, 0.06, 0.06, 0.5, 0.95, 0.35, C.wood).box(0.02, 0.5, 0.02, 0.28, 0.48, 0.35, C.dark).box(0.16, 0.14, 0.16, 0.28, 0.36, 0.35, C.stoneL);
  return b.build();
}
function mForager() {
  const b = new MB();
  b.cyl(0.5, 0.52, 0.5, 8, -0.15, 0, -0.2, C.plaster).cyl(0.53, 0.53, 0.06, 8, -0.15, 0, -0.2, C.stone);
  b.cone(0.72, 0.62, 8, -0.15, 0.48, -0.2, C.thatch).cone(0.4, 0.3, 8, -0.15, 0.9, -0.2, 0xcaa647);
  b.box(0.24, 0.4, 0.06, -0.15, 0, 0.31, C.woodD).glow(0.05, 0.16, 0.16, 0.34, 0.3, -0.2);
  for (const p of [[0.55, 0.45], [0.75, 0.1], [0.3, 0.72]]) {
    b.cyl(0.14, 0.11, 0.15, 7, p[0], 0, p[1], C.woodL);
    b.sph(0.05, p[0] - 0.04, 0.16, p[1], C.red).sph(0.05, p[0] + 0.05, 0.17, p[1] + 0.03, 0xb02a55).sph(0.05, p[0], 0.18, p[1] - 0.05, C.red);
  }
  b.box(0.04, 0.5, 0.04, -0.75, 0, 0.5, C.woodD).box(0.04, 0.5, 0.04, -0.3, 0, 0.75, C.woodD).box(0.56, 0.03, 0.03, -0.52, 0.47, 0.62, C.wood, [0, 0.5, 0]);
  b.box(0.08, 0.14, 0.02, -0.62, 0.32, 0.57, C.leaf, [0, 0.5, 0]).box(0.08, 0.12, 0.02, -0.45, 0.34, 0.66, C.leafD, [0, 0.5, 0]);
  return b.build();
}
function mFarm() {
  const b = new MB();
  b.box(1.6, 0.8, 0.8, -0.5, 0, -1.0, C.red).box(1.64, 0.08, 0.84, -0.5, 0, -1.0, C.stoneD).gable(1.74, 0.5, 0.98, -0.5, 0.8, -1.0, 0x6b4a3a).gable(1.6, 0.42, 0.8, -0.5, 0.8, -1.0, C.red);
  b.box(0.5, 0.55, 0.04, -0.5, 0.08, -0.59, C.white).box(0.42, 0.47, 0.05, -0.5, 0.12, -0.585, C.red).box(0.05, 0.6, 0.055, -0.5, 0.12, -0.58, C.white, [0, 0, 0.7]).box(0.05, 0.6, 0.055, -0.5, 0.12, -0.58, C.white, [0, 0, -0.7]);
  b.glow(0.2, 0.18, 0.04, -1.05, 0.5, -0.595).glow(0.2, 0.18, 0.04, 0.05, 0.5, -0.595);
  b.cyl(0.3, 0.3, 1.1, 8, 0.95, 0, -1.0, C.stoneL).cone(0.34, 0.3, 8, 0.95, 1.1, -1.0, C.roofR);
  // fence around the field
  for (let q = 0; q <= 6; q++) { if (q === 3) continue; const x = -1.42 + q * 0.473, gate = q === 2 || q === 4; b.box(gate ? 0.08 : 0.06, gate ? 0.36 : 0.26, gate ? 0.08 : 0.06, x, 0, 1.42, gate ? C.woodD : C.woodL); }   // gap in the middle = gate
  for (let q = 0; q <= 3; q++) { const z = -0.42 + q * 0.613; b.box(0.06, 0.26, 0.06, -1.42, 0, z, C.woodL).box(0.06, 0.26, 0.06, 1.42, 0, z, C.woodL); }
  b.box(0.95, 0.04, 0.03, -0.945, 0.17, 1.42, C.wood).box(0.95, 0.04, 0.03, 0.945, 0.17, 1.42, C.wood).box(0.03, 0.04, 1.84, -1.42, 0.17, 0.5, C.wood).box(0.03, 0.04, 1.84, 1.42, 0.17, 0.5, C.wood);
  // scarecrow
  b.box(0.05, 0.6, 0.05, 1.05, 0, 0.9, C.woodD).box(0.5, 0.05, 0.05, 1.05, 0.4, 0.9, C.woodD).box(0.2, 0.22, 0.1, 1.05, 0.28, 0.9, C.roofB).sph(0.09, 1.05, 0.62, 0.9, C.thatch).cone(0.13, 0.14, 6, 1.05, 0.66, 0.9, C.woodD);
  return b.build();
}
function mCrops() {
  const b = new MB();
  for (let r = 0; r < 5; r++) for (let q = 0; q < 10; q++) {
    const x = -1.2 + q * 0.26 + (r % 2) * 0.05, z = -0.25 + r * 0.36;
    if (Math.hypot(x - 1.05, z - 0.9) < 0.25) continue;
    b.cone(0.07, 0.42, 4, x, 0, z, 0xffffff, [0, q + r, 0]);
  }
  return b.build().geo;
}
function mFisher() {
  const b = new MB();
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.08, 0.2, 0.08, -0.2 + sx * 0.42, 0, -0.3 + sz * 0.36, C.woodD);
  b.box(1.0, 0.06, 0.9, -0.2, 0.18, -0.3, C.wood).box(0.9, 0.55, 0.8, -0.2, 0.24, -0.3, 0xe9eef0).gable(1.08, 0.46, 1.02, -0.2, 0.79, -0.3, C.roofB).gable(0.9, 0.38, 0.8, -0.2, 0.79, -0.3, 0xe9eef0);
  b.box(0.24, 0.4, 0.05, -0.4, 0.24, 0.11, C.woodD).glow(0.18, 0.18, 0.04, 0.02, 0.56, 0.105).box(0.36, 0.05, 0.24, -0.4, 0.08, 0.28, C.wood, [0.5, 0, 0]);
  b.box(0.05, 0.62, 0.05, 0.45, 0, 0.45, C.woodD).box(0.05, 0.62, 0.05, 0.9, 0, 0.1, C.woodD).box(0.6, 0.03, 0.03, 0.675, 0.58, 0.275, C.wood, [0, 0.66, 0]);
  for (let q = 0; q < 4; q++) b.box(0.05, 0.16, 0.02, 0.5 + q * 0.11, 0.4, 0.42 - q * 0.085, q % 2 ? 0x9fb8c8 : 0xc4d6e0, [0, 0.66, 0]);
  b.sph(0.4, -0.35, 0.1, 0.75, C.woodL, [1.3, 0.4, 0.55]).box(0.9, 0.04, 0.06, -0.35, 0.2, 0.75, C.woodD);
  b.cyl(0.13, 0.13, 0.3, 8, 0.6, 0, -0.55, C.woodD).cyl(0.135, 0.135, 0.03, 8, 0.6, 0.2, -0.55, C.iron);
  b.cyl(0.13, 0.13, 0.05, 10, 0.31, 0.5, -0.3, C.white, [0, 0, Math.PI / 2]).cyl(0.07, 0.07, 0.06, 8, 0.31, 0.5, -0.3, C.red, [0, 0, Math.PI / 2]);
  return b.build();
}
function mBakery() {
  const b = new MB();
  b.box(1.3, 0.2, 1.1, -0.1, 0, -0.2, C.stone).box(1.24, 0.6, 1.04, -0.1, 0.2, -0.2, C.plaster).gable(1.22, 0.5, 1.04, -0.1, 0.8, -0.2, C.plaster).gable(1.46, 0.6, 1.3, -0.1, 0.78, -0.2, C.roofY);
  b.box(0.42, 1.5, 0.42, 0.62, 0, -0.4, 0xb5563c).box(0.5, 0.08, 0.5, 0.62, 1.5, -0.4, C.stoneD).box(0.2, 0.2, 0.05, 0.62, 0.12, -0.17, C.dark);
  b.box(0.26, 0.46, 0.05, -0.5, 0.2, 0.33, C.woodD).glow(0.34, 0.24, 0.04, 0.05, 0.56, 0.325);
  for (let q = 0; q < 5; q++) b.box(0.12, 0.03, 0.34, -0.19 + q * 0.12, 0.78, 0.45, q % 2 ? C.white : C.red, [0.45, 0, 0]);
  b.box(0.62, 0.04, 0.2, 0.05, 0.38, 0.42, C.woodL).sph(0.07, -0.12, 0.46, 0.42, C.bread, [1.5, 0.8, 1]).sph(0.07, 0.07, 0.46, 0.42, 0xdba25a, [1.5, 0.8, 1]).sph(0.06, 0.24, 0.46, 0.43, C.bread, [1, 0.9, 1]);
  b.box(0.04, 0.04, 0.3, -0.5, 0.86, 0.45, C.dark).cyl(0.11, 0.11, 0.03, 8, -0.5, 0.68, 0.58, C.bread, [Math.PI / 2, 0, 0]);
  b.glow(0.04, 0.2, 0.2, -0.725, 0.56, -0.2);
  b.sph(0.16, -0.62, 0.12, 0.62, 0xefe6cf, [1, 0.9, 0.9]).sph(0.14, -0.38, 0.1, 0.72, 0xe3d8ba, [1, 0.9, 1]);
  return b.build();
}
function mApiary() {
  const b = new MB();
  const hive = (x, z, c1, c2, ry) => {
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.04, 0.12, 0.04, x + sx * 0.12, 0, z + sz * 0.12, C.woodD);
    b.box(0.34, 0.15, 0.34, x, 0.12, z, c1, [0, ry, 0]).box(0.33, 0.15, 0.33, x, 0.27, z, c2, [0, ry, 0]).box(0.34, 0.15, 0.34, x, 0.42, z, c1, [0, ry, 0]);
    b.gable(0.42, 0.14, 0.42, x, 0.57, z, C.woodD, ry).box(0.1, 0.03, 0.02, x + Math.sin(ry) * 0.17, 0.15, z + Math.cos(ry) * 0.17, C.dark, [0, ry, 0]);
  };
  hive(-0.5, -0.35, C.white, C.gold, 0.2); hive(0.15, -0.55, C.gold, 0x9fcfe0, -0.1); hive(0.6, 0.0, 0x9fcfe0, C.white, -0.5);
  b.box(0.5, 0.04, 0.3, -0.35, 0.3, 0.5, C.woodL).box(0.04, 0.3, 0.04, -0.55, 0, 0.5, C.woodD).box(0.04, 0.3, 0.04, -0.15, 0, 0.5, C.woodD);
  b.cyl(0.06, 0.06, 0.12, 7, -0.48, 0.34, 0.5, C.honey).cyl(0.06, 0.06, 0.12, 7, -0.3, 0.34, 0.52, C.honey).cyl(0.065, 0.065, 0.03, 7, -0.48, 0.46, 0.5, C.white).cyl(0.065, 0.065, 0.03, 7, -0.3, 0.46, 0.52, C.white);
  for (const p of [[0.3, 0.6, C.pink], [0.5, 0.75, C.gold], [0.7, 0.55, 0xb48ae0], [0.15, 0.8, C.white], [0.82, 0.8, C.pink], [-0.8, 0.1, C.gold], [-0.85, -0.75, 0xb48ae0]]) {
    b.cyl(0.012, 0.012, 0.18, 3, p[0], 0, p[1], C.leafD).sph(0.055, p[0], 0.2, p[1], p[2], [1, 0.7, 1]);
  }
  return b.build();
}
function mStore() {
  const b = new MB();
  b.box(1.5, 0.85, 1.15, 0, 0, -0.2, C.plank).box(1.54, 0.1, 1.19, 0, 0, -0.2, C.stoneD).gable(1.5, 0.55, 1.15, 0, 0.85, -0.2, C.plank).gable(1.66, 0.66, 1.38, 0, 0.83, -0.2, C.woodD);
  for (const x of [-0.74, -0.37, 0.37, 0.74]) b.box(0.05, 0.85, 0.04, x, 0, 0.385, C.woodD);
  b.box(0.6, 0.6, 0.05, 0, 0.05, 0.385, C.dark).box(0.28, 0.56, 0.06, -0.15, 0.07, 0.4, C.wood, [0, 0.5, 0]).glow(0.22, 0.18, 0.04, 0, 1.08, 0.38);
  b.box(0.3, 0.3, 0.3, 0.72, 0, 0.68, C.woodL).box(0.26, 0.26, 0.26, 0.7, 0.3, 0.66, C.plank, [0, 0.4, 0]).box(0.28, 0.28, 0.28, 0.4, 0, 0.78, C.wood, [0, 0.2, 0]);
  b.cyl(0.14, 0.14, 0.34, 8, -0.7, 0, 0.65, C.woodD).cyl(0.145, 0.145, 0.04, 8, -0.7, 0.2, 0.65, C.iron).sph(0.17, -0.42, 0.13, 0.78, 0xe6d9b8, [1, 0.85, 0.9]);
  return b.build();
}
function mWell() {
  const b = new MB();
  b.cyl(0.3, 0.32, 0.3, 8, 0, 0, 0, C.stone).cyl(0.33, 0.33, 0.06, 8, 0, 0.28, 0, C.stoneL).cyl(0.23, 0.23, 0.02, 8, 0, 0.33, 0, 0x3f9fc4);
  b.box(0.06, 0.62, 0.06, -0.3, 0.2, 0, C.woodD).box(0.06, 0.62, 0.06, 0.3, 0.2, 0, C.woodD).cyl(0.03, 0.03, 0.62, 5, 0, 0.72, 0, C.wood, [0, 0, Math.PI / 2]);
  b.gable(0.82, 0.26, 0.6, 0, 0.82, 0, C.roofR).box(0.015, 0.2, 0.015, 0.05, 0.52, 0, C.dark).cyl(0.07, 0.055, 0.1, 6, 0.05, 0.44, 0, C.woodL);
  return b.build();
}
function mMarket() {
  const b = new MB();
  const stall = (x, z, ry, c) => {
    const cs = Math.cos(ry), sn = Math.sin(ry);
    const P = (lx, lz) => [x + lx * cs + lz * sn, z - lx * sn + lz * cs];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const p = P(sx * 0.36, sz * 0.24); b.box(0.045, 0.72, 0.045, p[0], 0, p[1], C.woodD); }
    for (let q = 0; q < 6; q++) { const p = P(-0.375 + q * 0.15, 0.04); b.box(0.15, 0.03, 0.72, p[0], 0.74, p[1], q % 2 ? C.white : c, [0.28, ry, 0]); }
    let p = P(0, 0.1); b.box(0.78, 0.3, 0.3, p[0], 0, p[1], C.woodL, [0, ry, 0]);
    const goods = [C.red, C.bread, C.honey, C.leaf, 0xe9eef0];
    for (let q = 0; q < 5; q++) { p = P(-0.28 + q * 0.14, 0.1); b.sph(0.06, p[0], 0.35, p[1], goods[(q + (x > 0 ? 2 : 0)) % 5]); }
  };
  stall(-0.48, -0.35, 0.25, C.red); stall(0.5, -0.1, -0.5, C.roofB);
  b.cyl(0.03, 0.04, 1.4, 5, 0.0, 0, 0.6, C.woodD);
  const fl = [C.gold, C.red, C.roofB, C.roofG, C.pink];
  for (let q = 0; q < 5; q++) b.cone(0.07, 0.12, 3, -0.6 + q * 0.14, 0.92 + q * 0.085, 0.42 + q * 0.04, fl[q], [Math.PI, 0, 0]);
  for (let q = 0; q < 5; q++) b.cone(0.07, 0.12, 3, 0.6 - q * 0.14, 0.92 + q * 0.085, 0.48 + q * 0.03, fl[4 - q], [Math.PI, 0, 0]);
  b.box(0.26, 0.24, 0.26, -0.75, 0, 0.6, C.plank, [0, 0.3, 0]).cyl(0.12, 0.12, 0.28, 8, 0.75, 0, 0.72, C.woodD).sph(0.05, -0.75, 0.28, 0.6, C.red).sph(0.05, -0.68, 0.27, 0.64, C.gold);
  return b.build();
}
function mWindmill() {
  const b = new MB();
  b.cyl(0.6, 0.66, 0.2, 8, 0, 0, 0, C.stone).cyl(0.42, 0.58, 1.35, 8, 0, 0.2, 0, C.white).cyl(0.66, 0.66, 0.05, 8, 0, 0.62, 0, C.woodD);
  for (let q = 0; q < 8; q++) { const a = q / 8 * TAU; b.box(0.03, 0.14, 0.03, Math.cos(a) * 0.63, 0.66, Math.sin(a) * 0.63, C.woodD); }
  b.cone(0.5, 0.5, 8, 0, 1.55, 0, C.roofR).box(0.26, 0.44, 0.06, 0, 0.2, 0.57, C.woodD).glow(0.16, 0.2, 0.05, 0, 1.0, 0.49).glow(0.05, 0.2, 0.16, 0.5, 0.95, 0).glow(0.05, 0.2, 0.16, -0.5, 0.95, 0);
  b.cyl(0.05, 0.05, 0.3, 6, 0, 1.6, 0.42, C.woodD, [Math.PI / 2, 0, 0]);
  b.sph(0.16, 0.6, 0.12, 0.55, 0xe6d9b8, [1, 0.85, 0.9]).sph(0.15, 0.78, 0.11, 0.35, 0xefe6cf, [1, 0.85, 0.9]);
  return b.build();
}
function mBlades() {
  const b = new MB();
  b.cyl(0.08, 0.08, 0.1, 6, 0, -0.05, 0, C.woodD, [Math.PI / 2, 0, 0]);
  for (let q = 0; q < 4; q++) {
    const a = q * Math.PI / 2;
    const cx = Math.cos(a), sy = Math.sin(a);
    b._add(new THREE.BoxGeometry(0.05, 1.1, 0.03), cx * 0.55, sy * 0.55, 0, C.woodD, [0, 0, a - Math.PI / 2]);
    b._add(new THREE.BoxGeometry(0.24, 0.8, 0.012), cx * 0.66 - sy * 0.12, sy * 0.66 + cx * 0.12, 0.01, 0xf3ead2, [0, 0, a - Math.PI / 2]);
  }
  return b.build().geo;
}
function mFountain() {
  const b = new MB();
  b.cyl(0.8, 0.84, 0.22, 10, 0, 0, 0, C.stoneL).cyl(0.68, 0.68, 0.03, 10, 0, 0.21, 0, 0x4fb3d6).cyl(0.14, 0.2, 0.6, 8, 0, 0.2, 0, C.stone);
  b.cyl(0.36, 0.16, 0.14, 8, 0, 0.78, 0, C.stoneL).cyl(0.3, 0.3, 0.02, 8, 0, 0.915, 0, 0x4fb3d6).cyl(0.07, 0.09, 0.2, 6, 0, 0.92, 0, C.stone);
  b.sph(0.13, 0, 1.24, 0, C.gold, [1.3, 1, 1], 1).box(0.05, 0.25, 0.26, -0.03, 1.115, 0, C.dark).box(0.05, 0.22, 0.24, 0.09, 1.13, 0, C.dark).sph(0.08, -0.2, 1.26, 0, C.dark, null, 1);
  b.box(0.2, 0.012, 0.12, 0.02, 1.36, 0.1, C.white, [0.5, 0, 0]).box(0.2, 0.012, 0.12, 0.02, 1.36, -0.1, C.white, [-0.5, 0, 0]);
  return b.build();
}
function mLighthouse() {
  const b = new MB();
  b.cyl(0.78, 0.9, 0.28, 9, 0, 0, 0, C.stoneD).cyl(0.7, 0.74, 0.1, 9, 0, 0.28, 0, C.stone);
  let y = 0.38, r = 0.52;
  for (let q = 0; q < 5; q++) { b.cyl(r - 0.045, r, 0.5, 10, 0, y, 0, q % 2 ? C.white : C.red); y += 0.5; r -= 0.045; }
  b.cyl(0.46, 0.46, 0.06, 10, 0, y, 0, C.dark);
  for (let q = 0; q < 10; q++) { const a = q / 10 * TAU; b.box(0.025, 0.16, 0.025, Math.cos(a) * 0.43, y + 0.06, Math.sin(a) * 0.43, C.dark); }
  b.cyl(0.24, 0.24, 0.06, 8, 0, y + 0.06, 0, C.stoneD).glow(0.34, 0.3, 0.34, 0, y + 0.27, 0, [0, 0.4, 0]).cone(0.34, 0.34, 8, 0, y + 0.42, 0, C.red).sph(0.05, 0, y + 0.8, 0, C.gold);
  b.box(0.28, 0.46, 0.06, 0, 0.38, 0.5, C.woodD).glow(0.14, 0.2, 0.05, 0, 1.3, 0.455).glow(0.14, 0.2, 0.05, 0, 2.1, 0.385);
  return b.build();
}
function mLantern() {
  const b = new MB();
  b.cyl(0.09, 0.11, 0.08, 6, 0, 0, 0, C.stone).cyl(0.03, 0.035, 0.75, 5, 0, 0.08, 0, C.dark).box(0.2, 0.03, 0.03, 0.08, 0.8, 0, C.dark);
  b.box(0.14, 0.02, 0.14, 0.17, 0.74, 0, C.dark).cone(0.11, 0.08, 4, 0.17, 0.76, 0, C.dark, [0, Math.PI / 4, 0]).box(0.12, 0.02, 0.12, 0.17, 0.58, 0, C.dark).glow(0.1, 0.14, 0.1, 0.17, 0.67, 0);
  return b.build();
}
function mFlowers(v) {
  const b = new MB();
  b.box(0.8, 0.1, 0.8, 0, 0, 0, C.soil);
  b.box(0.86, 0.14, 0.05, 0, 0, 0.42, C.woodL).box(0.86, 0.14, 0.05, 0, 0, -0.42, C.woodL).box(0.05, 0.14, 0.86, 0.42, 0, 0, C.woodL).box(0.05, 0.14, 0.86, -0.42, 0, 0, C.woodL);
  const cols = [[C.pink, C.white, C.gold], [0xb48ae0, C.white, C.pink], [C.red, C.gold, 0xff9a5c], [0x8fd0ff, C.white, 0xb48ae0]][v % 4];
  const r = mulberry32(v * 13 + 5);
  for (let q = 0; q < 11; q++) {
    const x = (r() - 0.5) * 0.64, z = (r() - 0.5) * 0.64, h = 0.16 + r() * 0.16;
    b.cyl(0.012, 0.012, h, 3, x, 0.1, z, C.leafD).sph(0.06, x, 0.1 + h + 0.02, z, cols[q % 3], [1, 0.7, 1]);
    if (q % 3 === 0) b.sph(0.07, x + 0.05, 0.14, z + 0.04, C.leaf, [1, 0.6, 1]);
  }
  return b.build();
}
function mBench() {
  const b = new MB();
  b.box(0.06, 0.2, 0.3, -0.3, 0, 0, C.stone).box(0.06, 0.2, 0.3, 0.3, 0, 0, C.stone).box(0.78, 0.05, 0.14, 0, 0.2, 0.07, C.woodL).box(0.78, 0.05, 0.14, 0, 0.2, -0.08, C.wood);
  b.box(0.05, 0.3, 0.05, -0.3, 0.2, -0.16, C.woodD).box(0.05, 0.3, 0.05, 0.3, 0.2, -0.16, C.woodD).box(0.78, 0.1, 0.04, 0, 0.38, -0.16, C.woodL);
  return b.build();
}
function mSapling() {
  const b = new MB();
  b.cyl(0.05, 0.08, 0.5, 5, 0, 0, 0, 0x8a5d3b).sph(0.4, 0, 0.8, 0, 0x6fb04a, [1, 0.92, 1]).sph(0.28, 0.1, 1.15, 0.05, 0x84c057);
  return b.build();
}
function mScaffold(size) {
  const b = new MB(), h = size * 0.55, a = size / 2 - 0.12;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.06, h, 0.06, sx * a, 0, sz * a, C.woodL);
  for (const y of [h * 0.5, h - 0.05]) {
    b.box(a * 2, 0.04, 0.04, 0, y, a, C.wood).box(a * 2, 0.04, 0.04, 0, y, -a, C.wood).box(0.04, 0.04, a * 2, a, y, 0, C.wood).box(0.04, 0.04, a * 2, -a, y, 0, C.wood);
  }
  b.box(a * 1.2, 0.03, 0.3, 0, h * 0.5 + 0.04, a - 0.16, C.plank);
  return b.build().geo;
}

const EXTRA_FN = {};
const MODEL_FN = {
  center: mCenter, house: mHouse, lumber: mLumber, quarry: mQuarry, forager: mForager, farm: mFarm, fisher: mFisher, bakery: mBakery,
  apiary: mApiary, store: mStore, well: mWell, market: mMarket, windmill: mWindmill, fountain: mFountain, lighthouse: mLighthouse,
  lantern: mLantern, flowers: mFlowers, bench: mBench, tree: mSapling,
};
const _modelCache = {};
function getModel(type, variant) {
  const key = type + ':' + (variant || 0);
  return _modelCache[key] || (_modelCache[key] = MODEL_FN[type](variant || 0));
}
const _geoCache = {};
function cachedGeo(key, fn) { return _geoCache[key] || (_geoCache[key] = fn()); }

// Group for a building: static body + glowing windows + animated extras
function makeBuildingGroup(type, variant) {
  const g = new THREE.Group(), m = getModel(type, variant);
  const body = new THREE.Mesh(m.geo, MAT.build); body.castShadow = true; body.receiveShadow = true;
  g.add(body); g.userData.body = body;
  if (m.glow) { g.userData.glow = new THREE.Mesh(m.glow, MAT.glow); g.add(g.userData.glow); }
  const ex = g.userData;
  if (type === 'windmill') {
    ex.blades = new THREE.Mesh(cachedGeo('blades', mBlades), MAT.main); ex.blades.position.set(0, 1.6, 0.6); ex.blades.castShadow = true; g.add(ex.blades);
  } else if (type === 'farm') {
    ex.cropMat = new THREE.MeshLambertMaterial({ color: 0x7fbf4d });
    ex.crops = new THREE.Mesh(cachedGeo('crops', mCrops), ex.cropMat); ex.crops.castShadow = true; g.add(ex.crops);
  } else if (type === 'center') {
    const fb = new MB(); fb.cone(0.16, 0.42, 5, 0, 0.1, 0, 0xff8a2a).cone(0.09, 0.3, 5, 0.02, 0.1, 0.02, 0xffd84d);
    ex.flame = new THREE.Mesh(cachedGeo('flame', () => fb.build().geo), new THREE.MeshBasicMaterial({ vertexColors: true })); g.add(ex.flame);
    ex.sprite = makeGlowSprite(3.2); ex.sprite.position.set(0, 0.5, 0); g.add(ex.sprite);
  } else if (type === 'lantern') {
    ex.sprite = makeGlowSprite(1.7); ex.sprite.position.set(0.17, 0.67, 0); g.add(ex.sprite);
  } else if (type === 'lighthouse') {
    ex.sprite = makeGlowSprite(4.5); ex.sprite.position.set(0, 3.2, 0); g.add(ex.sprite);
    const bg = new THREE.ConeGeometry(1.5, 9, 10, 1, true); bg.translate(0, -4.5, 0); bg.rotateX(-Math.PI / 2);
    ex.beamMat = new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    ex.beam = new THREE.Group(); ex.beam.position.set(0, 3.2, 0);
    const b1 = new THREE.Mesh(bg, ex.beamMat), b2 = new THREE.Mesh(bg, ex.beamMat); b2.rotation.y = Math.PI;
    ex.beam.add(b1, b2); g.add(ex.beam);
  }
  if (EXTRA_FN[type]) EXTRA_FN[type](g, ex);
  dressBuilding(g, type);
  return g;
}

// ----- villagers -----
const JOBS = {
  free: { title: 'Free villager', plural: 'Free (builders)', shirt: 0x8fb573, hat: 'none' },
  lumber: { title: 'Woodcutter', plural: 'Woodcutters', shirt: 0xc8553d, hat: 'beanie', hatC: 0x8a2f22 },
  quarry: { title: 'Stonecutter', plural: 'Stonecutters', shirt: 0x7d8591, hat: 'helmet', hatC: 0xe0b83a },
  forager: { title: 'Forager', plural: 'Foragers', shirt: 0xb565a7, hat: 'straw' },
  farmer: { title: 'Farmer', plural: 'Farmers', shirt: 0x4a7fb5, hat: 'straw' },
  fisher: { title: 'Fisher', plural: 'Fishers', shirt: 0x2f8f9a, hat: 'cap', hatC: 0xf2c230 },
  baker: { title: 'Baker', plural: 'Bakers', shirt: 0xf3efe6, hat: 'toque' },
  bee: { title: 'Beekeeper', plural: 'Beekeepers', shirt: 0xf0e2a8, hat: 'veil' },
  merchant: { title: 'Merchant', plural: 'Merchants', shirt: 0x7a4fa0, hat: 'beret', hatC: 0x4c2f6b },
};
// The villagers use a compact, jointed toy rig. Shared geometry keeps a busy town light.
function villagerBodyGeo(job, skinI, hairI) {
  return cachedGeo('vb2:' + job + ':' + skinI, () => {
    const J = JOBS[job] || JOBS.free, b = new MB();
    b.cyl(0.082, 0.113, 0.19, 10, 0, 0.18, 0, J.shirt);
    b.sph(0.092, 0, 0.31, 0, J.shirt, [1.05, 0.65, 0.82], 1);
    b.cyl(0.109, 0.109, 0.025, 10, 0, 0.182, 0, C.woodD);
    b.box(0.029, 0.026, 0.009, 0, 0.182, 0.108, C.gold);
    b.cyl(0.033, 0.04, 0.05, 8, 0, 0.352, 0, C.skin[skinI]);
    // Linen collars, little buttons and a visibly different apron for each trade.
    b.box(0.036, 0.046, 0.012, -0.023, 0.324, 0.062, C.white, [0, 0, -0.35]);
    b.box(0.036, 0.046, 0.012, 0.023, 0.324, 0.062, C.white, [0, 0, 0.35]);
    for (let q = 0; q < 3; q++) b.sph(0.007, 0, 0.267 + q * 0.025, 0.091, C.gold);
    if (['baker', 'brewer', 'brickmaker', 'confectioner', 'attendant', 'tailor'].includes(job)) {
      b.box(0.13, 0.127, 0.018, 0, 0.203, 0.089, job === 'brickmaker' ? C.woodL : C.white);
      b.box(0.075, 0.04, 0.014, 0, 0.236, 0.106, job === 'brickmaker' ? C.wood : 0xd9d6c4);
    } else if (['farmer', 'gardener', 'shepherd', 'poulterer', 'dairy'].includes(job)) {
      for (const side of [-1, 1]) b.box(0.023, 0.14, 0.014, side * 0.05, 0.22, 0.079, 0xcdbb8b);
      b.box(0.065, 0.046, 0.02, 0, 0.245, 0.1, C.woodL);
    } else if (['docker', 'fisher', 'shipwright'].includes(job)) {
      for (let q = 0; q < 3; q++) b.box(0.14 - q * 0.008, 0.012, 0.012, 0, 0.242 + q * 0.025, 0.086, C.white);
    }
    return b.build().geo;
  });
}
function villagerHeadGeo(job, skinI, hairI) {
  return cachedGeo('vh2:' + job + ':' + skinI + ':' + hairI, () => {
    const J = JOBS[job] || JOBS.free, b = new MB(), hc = J.hatC || C.gold, hair = C.hair[hairI], skin = C.skin[skinI];
    b.sph(0.106, 0, 0, 0, skin, [1, 1.03, 0.94], 2);
    b.sph(0.024, -0.101, -0.002, -0.006, skin, [0.6, 1, 0.8], 1).sph(0.024, 0.101, -0.002, -0.006, skin, [0.6, 1, 0.8], 1);
    b.sph(0.016, 0, -0.008, 0.099, skin, [0.8, 0.8, 1.1], 1);
    b.sph(0.015, -0.056, -0.019, 0.079, 0xd98b75, [1.15, 0.55, 0.25], 1).sph(0.015, 0.056, -0.019, 0.079, 0xd98b75, [1.15, 0.55, 0.25], 1);
    b.box(0.021, 0.004, 0.004, 0, -0.042, 0.09, C.woodD);
    b.sph(0.004, -0.013, -0.038, 0.088, C.woodD).sph(0.004, 0.013, -0.038, 0.088, C.woodD);
    b.sph(0.109, 0, 0.036, -0.027, hair, [1.02, 0.75, 1], 1);
    // Five hairstyles are readable as silhouettes, even without a hat.
    if (hairI === 0) {
      for (let q = 0; q < 4; q++) b.sph(0.041, -0.06 + q * 0.04, 0.075 + Math.sin(q) * 0.012, 0.038, hair, [0.85, 0.65, 1], 1);
    } else if (hairI === 1) {
      b.sph(0.049, -0.073, -0.037, -0.052, hair, [0.65, 1.4, 0.72], 1).sph(0.049, 0.073, -0.037, -0.052, hair, [0.65, 1.4, 0.72], 1);
      b.sph(0.046, 0.018, 0.082, 0.045, hair, [1.3, 0.48, 0.75], 1);
    } else if (hairI === 2) {
      b.sph(0.052, -0.027, 0.089, 0.018, hair, [1.3, 0.8, 1.1], 1).sph(0.035, 0.044, 0.077, 0.05, hair, [1, 0.6, 0.9], 1);
    } else if (hairI === 3) {
      b.sph(0.049, 0.025, 0.048, -0.11, hair, [1.1, 1, 0.85], 1);
      b.sph(0.045, -0.04, 0.066, 0.052, hair, [1, 0.5, 0.7], 1);
    } else {
      for (let q = 0; q < 6; q++) { const a = q / 6 * TAU; b.sph(0.04, Math.cos(a) * 0.074, 0.062 + (q % 2) * 0.01, Math.sin(a) * 0.061 - 0.02, hair, null, 1); }
    }
    if (J.hat === 'beanie') b.sph(0.113, 0, 0.075, -0.008, hc, [1, 0.65, 1], 1).cyl(0.109, 0.109, 0.025, 12, 0, 0.068, 0, hc).sph(0.027, 0, 0.155, -0.01, C.white, null, 1);
    else if (J.hat === 'helmet') b.sph(0.118, 0, 0.067, 0, hc, [1, 0.72, 1], 1).cyl(0.135, 0.135, 0.018, 12, 0, 0.057, 0.008, hc).box(0.025, 0.085, 0.19, 0, 0.058, 0, C.gold);
    else if (J.hat === 'straw') b.cyl(0.176, 0.18, 0.017, 14, 0, 0.078, 0, C.thatch).cyl(0.083, 0.098, 0.066, 12, 0, 0.095, 0, C.thatch).cyl(0.1, 0.103, 0.023, 12, 0, 0.096, 0, J.shirt);
    else if (J.hat === 'cap') b.sph(0.112, 0, 0.075, -0.004, hc, [1, 0.58, 1], 1).sph(0.083, 0, 0.065, 0.087, hc, [1.2, 0.11, 0.9], 1).sph(0.012, 0, 0.136, 0, C.gold, null, 1);
    else if (J.hat === 'toque') {
      b.cyl(0.085, 0.09, 0.081, 12, 0, 0.068, 0, C.white);
      for (const p of [[0,0.173,0],[-0.043,0.162,0.018],[0.04,0.163,0.02],[0,0.16,-0.04]]) b.sph(0.057,p[0],p[1],p[2],C.white,null,1);
    } else if (J.hat === 'veil') {
      b.cyl(0.16, 0.17, 0.014, 14, 0, 0.081, 0, C.white).cyl(0.085, 0.1, 0.061, 10, 0, 0.096, 0, C.white);
      for (const x of [-0.11,0.11]) b.box(0.007,0.12,0.007,x,-0.045,0.07,0xd9d2b8);
      b.box(0.22,0.007,0.007,0,-0.044,0.07,0xd9d2b8);
    } else if (J.hat === 'beret') b.sph(0.118, 0.018, 0.101, -0.008, hc, [1.1, 0.4, 1.05], 1).cyl(0.008,0.01,0.021,5,0.025,0.137,-0.012,hc);
    return b.build().geo;
  });
}
function villagerArmGeo(job, skinI) {
  return cachedGeo('va2:' + job + ':' + skinI, () => {
    const b = new MB(), J = JOBS[job] || JOBS.free;
    b.cyl(0.034, 0.029, 0.09, 8, 0, -0.084, 0, J.shirt).sph(0.035, 0, -0.005, 0, J.shirt, [1, 1.1, 1], 1);
    b.cyl(0.03,0.03,0.017,8,0,-0.088,0,C.white); return b.build().geo;
  });
}
function villagerSimpleArmGeo(job,skinI) {
  return cachedGeo('villager-simple-arm:'+job+':'+skinI,()=>{
    const b=new MB(),J=JOBS[job]||JOBS.free;
    b.cyl(0.034,0.027,0.103,8,0,-0.098,0,J.shirt).cyl(0.027,0.023,0.06,8,0,-0.158,0,C.skin[skinI]);
    b.sph(0.026,0,-0.16,0.006,C.skin[skinI],[1,1.1,0.9],1);return b.build().geo;
  });
}
const CARRY_FN = {
  wood: (b) => b.cyl(0.035, 0.035, 0.2, 5, 0, 0, 0, C.woodL, [0, 0, Math.PI / 2]).cyl(0.035, 0.035, 0.2, 5, 0, 0.06, 0.02, C.wood, [0, 0, Math.PI / 2]),
  stone: (b) => b.sph(0.075, 0, 0.06, 0, C.stoneL, [1.1, 0.85, 1]),
  food: (b) => b.cyl(0.075, 0.06, 0.07, 7, 0, 0, 0, C.woodL).sph(0.035, -0.02, 0.085, 0, C.red).sph(0.035, 0.03, 0.09, 0.02, 0xb02a55).sph(0.035, 0.01, 0.085, -0.03, C.red),
  fish: (b) => b.sph(0.07, 0, 0.05, 0, 0x9fb8c8, [1.7, 0.7, 0.5]).cone(0.04, 0.06, 3, 0.13, 0.02, 0, 0x7f9db0, [0, 0, Math.PI / 2]),
  grain: (b) => b.cone(0.07, 0.2, 5, 0, 0, 0, C.wheat, [Math.PI, 0, 0]).cyl(0.03, 0.03, 0.02, 5, 0, 0.08, 0, C.red),
  bread: (b) => b.cyl(0.075, 0.06, 0.05, 7, 0, 0, 0, C.woodL).sph(0.05, 0, 0.07, 0, C.bread, [1.4, 0.8, 1]),
  honey: (b) => b.cyl(0.05, 0.05, 0.09, 7, 0, 0, 0, C.honey).cyl(0.055, 0.055, 0.02, 7, 0, 0.09, 0, C.white),
};
function carryGeo(kind) { return cachedGeo('carry:' + kind, () => { const b = new MB(); CARRY_FN[kind](b); return b.build().geo; }); }

function makeVillagerMesh(v) {
  const g = new THREE.Group(), job = v.job ? v.job.def.job : 'free';
  const mesh = (geo) => { const m = new THREE.Mesh(geo, MAT.main); m.castShadow = true; return m; };
  const body = mesh(villagerBodyGeo(job, v.skin, v.hair));
  const head = new THREE.Group(); head.position.y = 0.461;
  const headBody = mesh(villagerHeadGeo(job, v.skin, v.hair)); head.add(headBody);
  const eyes = mesh(cachedGeo('villager-eyes', () => {
    const b = new MB();
    for (const x of [-0.036, 0.036]) {
      b.sph(0.012, x, 0, 0, 0x302b28, [0.8, 1.2, 0.38], 1);
      b.sph(0.0035, x - 0.003, 0.004, 0.0045, C.white, [1,1,0.5],1);
    }
    return b.build().geo;
  })); eyes.position.set(0, 0.009, 0.097); eyes.castShadow = false; head.add(eyes);
  const thighGeo = cachedGeo('villager-thigh', () => {
    const b = new MB(); b.cyl(0.038,0.032,0.10,8,0,-0.10,0,0x455661).sph(0.038,0,-0.012,0,0x455661,[1,0.75,1],1); return b.build().geo;
  });
  const shinGeo = cachedGeo('villager-shin', () => {
    const b = new MB(); b.cyl(0.032,0.028,0.078,8,0,-0.078,0,0x455661).box(0.061,0.028,0.091,0,-0.092,0.013,0x4c3730).box(0.065,0.012,0.096,0,-0.099,0.013,0x2f2924); return b.build().geo;
  });
  const legL = mesh(thighGeo), legR = mesh(thighGeo), kneeL = mesh(shinGeo), kneeR = mesh(shinGeo);
  legL.position.set(-0.052,0.198,0); legR.position.set(0.052,0.198,0); kneeL.position.y = kneeR.position.y = -0.1;
  legL.add(kneeL); legR.add(kneeR);
  const ag = villagerArmGeo(job,v.skin), armL = mesh(ag), armR = mesh(ag);
  armL.position.set(-0.117,0.35,0); armR.position.set(0.117,0.35,0);
  const foreGeo = cachedGeo('villager-forearm:' + v.skin, () => {
    const b = new MB(); b.cyl(0.027,0.023,0.068,8,0,-0.068,0,C.skin[v.skin]).sph(0.026,0,-0.071,0.006,C.skin[v.skin],[1,1.1,0.9],1); return b.build().geo;
  });
  const elbowL=mesh(foreGeo),elbowR=mesh(foreGeo); elbowL.position.y=elbowR.position.y=-0.087;
  armL.add(elbowL);armR.add(elbowR);
  const carry=mesh(carryGeo('wood'));carry.position.set(0,0.247,0.157);carry.visible=false;
  const rod = mesh(cachedGeo('rod2', () => {
    const b = new MB();
    b.cyl(0.006,0.011,0.57,6,0,0,0,C.woodD).cyl(0.013,0.013,0.065,6,0,0.025,0,C.woodL);
    b.box(0.003,0.47,0.003,0,0.1,0.24,C.white).sph(0.016,0,0.1,0.24,C.red,[0.7,1,0.7],1);
    b.box(0.003,0.003,0.24,0,0.568,0.12,C.white); return b.build().geo;
  })); rod.position.set(0.12,0.23,0.11);rod.rotation.x=0.72;rod.visible=false;
  const tool=mesh(cachedGeo('tool:hammer',()=>{
    const b=new MB();b.cyl(0.009,0.013,0.19,6,0,-0.025,0,C.woodL).box(0.088,0.04,0.045,0,0.148,0,C.iron);return b.build().geo;
  }));tool.position.set(0,-0.067,0.018);tool.visible=false;elbowR.add(tool);
  const inner=new THREE.Group();inner.add(body,head,armL,armR,carry,rod);g.add(inner,legL,legR);
  g.scale.setScalar(1.2);
  g.userData={body,head,headBody,eyes,legL,legR,kneeL,kneeR,armL,armR,elbowL,elbowR,carry,rod,tool,inner,
    gait:0,phase:((v.id||0)*1.713)%TAU,clock:0,oldX:v.x,oldZ:v.z,step:0,toolKind:'hammer',detailLevel:null,thighGeo,armGeo:ag,
    simpleArmGeo:villagerSimpleArmGeo(job,v.skin),simpleLegGeo:cachedGeo('villager-simple-leg',()=>{const b=new MB();b.cyl(0.036,0.029,0.18,8,0,-0.18,0,0x455661).box(0.064,0.03,0.095,0,-0.199,0.013,C.dark);return b.build().geo;})};
  return g;
}
function refreshVillagerLook(v) {
  const u=v.mesh.userData,job=v.job?v.job.def.job:'free';
  u.body.geometry=villagerBodyGeo(job,v.skin,v.hair);u.headBody.geometry=villagerHeadGeo(job,v.skin,v.hair);
  u.armGeo=villagerArmGeo(job,v.skin);u.simpleArmGeo=villagerSimpleArmGeo(job,v.skin);u.armL.geometry=u.armR.geometry=u.armGeo;u.detailLevel=null;
}
