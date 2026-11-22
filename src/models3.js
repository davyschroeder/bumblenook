// ---------- third wave: academy, industry, leisure, upgrades, old sites and wildlife ----------
function mAcademy() {
  const b = new MB();
  b.box(1.7, 0.14, 1.45, 0, 0, -0.1, C.stoneL).box(1.4, 0.8, 1.05, 0, 0.14, -0.25, 0xf3ead6).box(1.5, 0.08, 1.15, 0, 0.94, -0.25, C.stone);
  for (const x of [-0.55, -0.18, 0.18, 0.55]) b.cyl(0.06, 0.07, 0.74, 6, x, 0.14, 0.46, C.white);
  b.box(1.5, 0.1, 0.3, 0, 0.88, 0.46, C.stoneL).gable(0.34, 0.3, 1.5, 0, 0.98, 0.46, C.stoneL, Math.PI / 2);
  b.cyl(0.42, 0.46, 0.16, 10, 0, 1.02, -0.3, C.stoneL).sph(0.42, 0, 1.18, -0.3, 0x4c7ea9, [1, 0.85, 1], 1).sph(0.05, 0, 1.56, -0.3, C.gold);
  b.cyl(0.03, 0.05, 0.42, 6, 0.52, 1.06, -0.55, C.gold, [0.9, 0, 0.3]).cyl(0.02, 0.02, 0.16, 4, 0.5, 1.02, -0.52, C.dark);
  b.box(0.3, 0.5, 0.05, 0, 0.14, 0.285, C.woodD).glow(0.2, 0.3, 0.04, -0.45, 0.58, 0.28).glow(0.2, 0.3, 0.04, 0.45, 0.58, 0.28).glow(0.04, 0.3, 0.2, 0.705, 0.58, -0.25).glow(0.04, 0.3, 0.2, -0.705, 0.58, -0.25);
  b.box(0.2, 0.05, 0.14, -0.72, 0.14, 0.62, C.red).box(0.18, 0.05, 0.13, -0.72, 0.19, 0.62, C.roofB, [0, 0.3, 0]).box(0.19, 0.05, 0.14, -0.72, 0.24, 0.62, C.gold, [0, -0.2, 0]);
  b.cyl(0.03, 0.05, 0.2, 5, 0.72, 0.14, 0.62, C.woodD).sph(0.1, 0.72, 0.42, 0.62, C.roofB, null, 1).box(0.1, 0.02, 0.21, 0.72, 0.41, 0.62, C.leaf, [0, 0.4, 0.4]);
  return b.build();
}
function mMine() {
  const b = new MB();
  b.sph(0.8, -0.1, 0.25, -0.35, C.stone, [1.15, 0.85, 0.85], 1).sph(0.5, 0.55, 0.2, -0.55, C.stoneD, [1, 0.8, 1], 0).sph(0.4, -0.75, 0.15, -0.1, C.stoneL, [1, 0.8, 1], 0);
  b.box(0.1, 0.62, 0.1, -0.32, 0, 0.3, C.woodD).box(0.1, 0.62, 0.1, 0.22, 0, 0.3, C.woodD).box(0.74, 0.1, 0.12, -0.05, 0.6, 0.3, C.wood).box(0.44, 0.56, 0.3, -0.05, 0, 0.2, 0x241a14);
  b.box(0.04, 0.03, 0.75, -0.2, 0, 0.62, C.iron).box(0.04, 0.03, 0.75, 0.1, 0, 0.62, C.iron);
  for (let q = 0; q < 4; q++) b.box(0.42, 0.02, 0.06, -0.05, 0, 0.36 + q * 0.18, C.woodD);
  b.box(0.34, 0.2, 0.3, -0.05, 0.1, 0.72, C.wood).cyl(0.06, 0.06, 0.38, 6, -0.05, 0.02, 0.62, C.dark, [0, 0, Math.PI / 2]).cyl(0.06, 0.06, 0.38, 6, -0.05, 0.02, 0.82, C.dark, [0, 0, Math.PI / 2]);
  b.sph(0.09, -0.1, 0.34, 0.7, C.stoneL).sph(0.08, 0.04, 0.33, 0.76, C.stone).sph(0.07, -0.02, 0.36, 0.66, C.stoneD);
  b.box(0.04, 0.5, 0.04, 0.55, 0, 0.5, C.woodD).glow(0.1, 0.12, 0.1, 0.55, 0.56, 0.5).box(0.04, 0.4, 0.04, 0.75, 0, 0.75, C.woodD, [0, 0, 0.5]).box(0.2, 0.05, 0.04, 0.64, 0.36, 0.75, C.iron, [0, 0, 0.5]);
  return b.build();
}
function mOrchard() {
  const b = new MB();
  const tree = (x, z, s) => {
    b.cyl(0.06 * s, 0.09 * s, 0.5 * s, 5, x, 0, z, 0x8a5d3b).sph(0.42 * s, x, 0.8 * s, z, 0x6fb04a, [1, 0.85, 1]).sph(0.28 * s, x + 0.12, 1.08 * s, z + 0.05, 0x84c057);
    for (let q = 0; q < 6; q++) { const a = q * 1.05 + x; b.sph(0.045, x + Math.cos(a) * 0.36 * s, (0.72 + (q % 3) * 0.12) * s, z + Math.sin(a) * 0.36 * s, q % 2 ? C.red : 0xe8b53a); }
  };
  tree(-0.85, -0.85, 1); tree(0.85, -0.8, 1.1); tree(0, 0, 1.15); tree(-0.8, 0.85, 1.05); tree(0.9, 0.8, 0.95);
  b.box(0.3, 0.16, 0.24, 0.1, 0, 1.05, C.woodL).sph(0.05, 0.03, 0.18, 1.05, C.red).sph(0.05, 0.15, 0.18, 1.02, 0xe8b53a).sph(0.05, 0.1, 0.19, 1.1, C.red);
  b.box(0.04, 0.9, 0.04, -0.22, 0, -0.05, C.woodL, [0.25, 0, 0]).box(0.04, 0.9, 0.04, -0.4, 0, -0.05, C.woodL, [0.25, 0, 0]);
  for (let q = 0; q < 4; q++) b.box(0.2, 0.03, 0.03, -0.31, 0.15 + q * 0.2, -0.02 + q * 0.05, C.wood);
  return b.build();
}
function mCider() {
  const b = new MB();
  b.box(1.1, 0.12, 1.0, -0.25, 0, -0.3, C.stone).box(1.0, 0.6, 0.9, -0.25, 0.12, -0.3, C.plaster).gable(1.0, 0.42, 0.9, -0.25, 0.72, -0.3, C.plaster).gable(1.2, 0.52, 1.14, -0.25, 0.7, -0.3, 0x8a5a2e);
  for (const sx of [-1, 1]) b.box(0.07, 0.6, 0.07, -0.25 + sx * 0.5, 0.12, 0.15, C.woodD);
  b.box(0.26, 0.44, 0.05, -0.45, 0.12, 0.16, C.woodD).glow(0.2, 0.2, 0.04, 0, 0.48, 0.155);
  b.cyl(0.3, 0.3, 0.6, 10, 0.62, 0.34, -0.35, C.wood, [Math.PI / 2, 0, 0]).cyl(0.31, 0.31, 0.04, 10, 0.62, 0.34, -0.2, C.iron, [Math.PI / 2, 0, 0]).cyl(0.31, 0.31, 0.04, 10, 0.62, 0.34, -0.5, C.iron, [Math.PI / 2, 0, 0]).box(0.5, 0.08, 0.1, 0.62, 0, -0.2, C.woodD).box(0.5, 0.08, 0.1, 0.62, 0, -0.5, C.woodD);
  b.box(0.06, 0.6, 0.06, 0.3, 0, 0.55, C.woodD).box(0.06, 0.6, 0.06, 0.8, 0, 0.55, C.woodD).box(0.6, 0.06, 0.08, 0.55, 0.56, 0.55, C.wood).cyl(0.03, 0.03, 0.34, 6, 0.55, 0.3, 0.55, C.iron).cyl(0.2, 0.2, 0.2, 9, 0.55, 0.08, 0.55, C.woodL).box(0.3, 0.03, 0.03, 0.55, 0.66, 0.55, C.iron);
  b.box(0.26, 0.14, 0.2, -0.25, 0, 0.7, C.woodL).sph(0.045, -0.3, 0.16, 0.7, C.red).sph(0.045, -0.2, 0.16, 0.72, 0xe8b53a).cyl(0.07, 0.06, 0.16, 7, 0.0, 0, 0.75, 0x8a5a2e).cyl(0.03, 0.04, 0.05, 6, 0.0, 0.16, 0.75, 0x8a5a2e);
  return b.build();
}
function mBrick() {
  const b = new MB(), br = 0xb5563c;
  b.cyl(0.5, 0.56, 0.3, 9, -0.35, 0, -0.35, br).sph(0.5, -0.35, 0.3, -0.35, 0xc2684a, [1, 0.9, 1], 1).box(0.24, 0.22, 0.1, -0.35, 0.02, 0.17, 0x241a14).glow(0.16, 0.12, 0.05, -0.35, 0.1, 0.2);
  b.box(0.22, 1.1, 0.22, -0.7, 0.3, -0.7, br).box(0.28, 0.06, 0.28, -0.7, 1.4, -0.7, C.stoneD);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.06, 0.6, 0.06, 0.5 + sx * 0.32, 0, -0.35 + sz * 0.35, C.woodD);
  b.box(0.86, 0.06, 0.92, 0.5, 0.62, -0.35, C.thatch, [0, 0, 0.18]);
  for (let l = 0; l < 3; l++) for (let q = 0; q < 3 - l; q++) b.box(0.2, 0.09, 0.1, 0.34 + q * 0.21 + l * 0.1, l * 0.09, -0.5, l % 2 ? 0xc2684a : br).box(0.2, 0.09, 0.1, 0.34 + q * 0.21 + l * 0.1, l * 0.09, -0.3, l % 2 ? br : 0xc2684a);
  b.sph(0.2, 0.45, 0.07, 0.6, 0xb98a5a, [1.2, 0.5, 1]).sph(0.14, 0.7, 0.06, 0.72, 0xa87a4c, [1, 0.5, 1]).box(0.5, 0.05, 0.3, -0.5, 0.2, 0.7, C.woodL).box(0.05, 0.2, 0.05, -0.7, 0, 0.7, C.woodD).box(0.05, 0.2, 0.05, -0.3, 0, 0.7, C.woodD);
  for (let q = 0; q < 3; q++) b.box(0.13, 0.06, 0.08, -0.64 + q * 0.14, 0.25, 0.7, 0xb98a5a);
  return b.build();
}
function mGreenhouse() {
  const b = new MB(), gl = 0xbfe6df, fr = C.white;
  b.box(1.5, 0.14, 1.1, 0, 0, -0.15, C.stoneL).box(1.42, 0.5, 1.02, 0, 0.14, -0.15, gl).gable(1.42, 0.45, 1.02, 0, 0.64, -0.15, 0xd3f0ea);
  for (const x of [-0.71, -0.36, 0, 0.36, 0.71]) b.box(0.04, 0.5, 0.04, x, 0.14, 0.36, fr).box(0.04, 0.5, 0.04, x, 0.14, -0.66, fr).box(0.03, 0.03, 1.1, x, 0.64, -0.15, fr);
  b.box(1.46, 0.04, 0.04, 0, 0.62, 0.36, fr).box(1.46, 0.04, 0.04, 0, 0.62, -0.66, fr).box(1.46, 0.04, 0.04, 0, 1.08, -0.15, fr).box(0.26, 0.42, 0.04, 0, 0.14, 0.375, 0x8fc7bd);
  for (let q = 0; q < 5; q++) b.sph(0.09, -0.56 + q * 0.28, 0.72, -0.15, q % 2 ? C.leaf : C.leafD, [1, 0.8, 1]);
  for (const x of [-0.6, 0.55]) { b.box(0.4, 0.14, 0.2, x, 0, 0.72, C.woodL).sph(0.07, x - 0.1, 0.2, 0.72, C.leaf).sph(0.07, x + 0.1, 0.2, 0.72, C.leafD).sph(0.035, x - 0.1, 0.28, 0.72, C.red).sph(0.035, x + 0.12, 0.27, 0.74, C.red); }
  b.cyl(0.07, 0.05, 0.14, 7, 0.02, 0, 0.78, 0x7f9db0).box(0.14, 0.02, 0.02, 0.1, 0.1, 0.78, 0x7f9db0, [0, 0, 0.5]);
  return b.build();
}
function mBath() {
  const b = new MB();
  b.box(1.5, 0.12, 1.0, 0, 0, -0.4, C.stoneL).box(1.3, 0.6, 0.8, 0, 0.12, -0.45, 0xefe6d2).box(1.4, 0.08, 0.9, 0, 0.72, -0.45, C.stone).sph(0.4, 0, 0.8, -0.45, 0x3f8f8a, [1.2, 0.7, 1], 1).sph(0.05, 0, 1.1, -0.45, C.gold);
  b.box(0.28, 0.44, 0.05, 0, 0.12, -0.04, 0x3f8f8a).glow(0.16, 0.22, 0.04, -0.42, 0.42, -0.045).glow(0.16, 0.22, 0.04, 0.42, 0.42, -0.045);
  b.cyl(0.62, 0.66, 0.16, 12, 0, 0, 0.5, C.stone).cyl(0.52, 0.52, 0.02, 12, 0, 0.15, 0.5, 0x7fd0e0).box(0.3, 0.05, 0.16, -0.85, 0.16, 0.2, C.woodL).box(0.05, 0.16, 0.05, -0.95, 0, 0.2, C.woodD).box(0.05, 0.16, 0.05, -0.75, 0, 0.2, C.woodD).box(0.2, 0.04, 0.14, -0.85, 0.21, 0.2, C.white);
  b.cyl(0.09, 0.07, 0.16, 7, 0.82, 0, 0.15, C.woodL).box(0.14, 0.04, 0.1, 0.82, 0.16, 0.15, C.pink);
  return b.build();
}
function mTownhall() {
  const b = new MB();
  b.box(1.7, 0.16, 1.3, 0, 0, -0.2, C.stoneL).box(1.5, 0.85, 1.1, 0, 0.16, -0.25, 0xf0e2c4).box(1.56, 0.07, 1.16, 0, 1.01, -0.25, C.woodD).gable(1.5, 0.5, 1.1, 0, 1.08, -0.25, 0xf0e2c4).gable(1.68, 0.6, 1.32, 0, 1.06, -0.25, 0x4c6a8a);
  b.box(0.52, 0.8, 0.52, 0, 1.3, -0.25, 0xf0e2c4).box(0.6, 0.06, 0.6, 0, 2.1, -0.25, C.woodD).cone(0.4, 0.6, 4, 0, 2.16, -0.25, 0x4c6a8a, [0, Math.PI / 4, 0]).sph(0.05, 0, 2.78, -0.25, C.gold);
  b.cyl(0.17, 0.17, 0.03, 12, 0, 1.75, 0.02, C.white, [Math.PI / 2, 0, 0]).box(0.02, 0.13, 0.02, 0, 1.7, 0.04, C.dark).box(0.1, 0.02, 0.02, 0.04, 1.75, 0.04, C.dark);
  b.box(0.36, 0.56, 0.05, 0, 0.16, 0.305, C.woodD).box(0.7, 0.08, 0.26, 0, 0.08, 0.5, C.stone).box(0.9, 0.08, 0.26, 0, 0, 0.6, C.stoneL);
  for (const x of [-0.5, 0.5]) b.glow(0.2, 0.3, 0.04, x, 0.6, 0.305).box(0.04, 0.5, 0.04, x * 1.5, 0.16, 0.42, C.woodD).box(0.22, 0.14, 0.02, x * 1.5 + 0.12, 0.5, 0.42, x < 0 ? C.gold : C.red);
  b.glow(0.04, 0.3, 0.2, 0.755, 0.6, -0.25).glow(0.04, 0.3, 0.2, -0.755, 0.6, -0.25).glow(0.14, 0.18, 0.04, 0, 1.45, 0.015);
  return b.build();
}
function mWatchtower() {
  const b = new MB();
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.07, 1.3, 0.07, sx * 0.3, 0, sz * 0.3, C.woodD, [sz * -0.1, 0, sx * 0.1]);
  b.box(0.66, 0.04, 0.04, 0, 0.6, 0.3, C.wood).box(0.66, 0.04, 0.04, 0, 0.6, -0.3, C.wood).box(0.04, 0.04, 0.66, 0.3, 0.6, 0, C.wood).box(0.04, 0.04, 0.66, -0.3, 0.6, 0, C.wood);
  b.box(0.8, 0.06, 0.8, 0, 1.3, 0, C.plank);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.05, 0.5, 0.05, sx * 0.36, 1.36, sz * 0.36, C.woodD);
  b.box(0.78, 0.04, 0.04, 0, 1.56, 0.36, C.wood).box(0.78, 0.04, 0.04, 0, 1.56, -0.36, C.wood).box(0.04, 0.04, 0.78, 0.36, 1.56, 0, C.wood).box(0.04, 0.04, 0.78, -0.36, 1.56, 0, C.wood);
  b.cone(0.62, 0.4, 4, 0, 1.86, 0, C.roofR, [0, Math.PI / 4, 0]).glow(0.1, 0.12, 0.1, 0.2, 1.72, 0.2).cyl(0.015, 0.015, 0.4, 4, 0, 2.2, 0, C.woodD).box(0.2, 0.12, 0.02, 0.1, 2.48, 0, C.gold);
  b.box(0.04, 1.3, 0.04, -0.1, 0, 0.42, C.woodL).box(0.04, 1.3, 0.04, 0.1, 0, 0.42, C.woodL);
  for (let q = 0; q < 6; q++) b.box(0.2, 0.03, 0.03, 0, 0.12 + q * 0.2, 0.42, C.wood);
  return b.build();
}
function mBandstand() {
  const b = new MB();
  b.cyl(0.85, 0.9, 0.16, 8, 0, 0, 0, C.stoneL).cyl(0.8, 0.8, 0.04, 8, 0, 0.16, 0, C.plank);
  for (let q = 0; q < 8; q++) { const a = q / 8 * TAU + 0.39; b.cyl(0.035, 0.035, 0.8, 5, Math.cos(a) * 0.72, 0.2, Math.sin(a) * 0.72, C.white); if (q !== 1 && q !== 2) b.box(0.56, 0.04, 0.03, Math.cos(a + 0.39) * 0.67, 0.42, Math.sin(a + 0.39) * 0.67, C.white, [0, -(a + 0.39) + Math.PI / 2, 0]); }
  b.cone(0.98, 0.5, 8, 0, 1.0, 0, C.roofR).cone(0.5, 0.3, 8, 0, 1.3, 0, C.plaster).sph(0.06, 0, 1.64, 0, C.gold);
  b.box(0.4, 0.08, 0.2, 0.0, 0, 0.98, C.stone).box(0.03, 0.34, 0.03, -0.1, 0.2, 0.1, C.dark).box(0.2, 0.14, 0.02, -0.1, 0.5, 0.1, C.white, [0.4, 0, 0]);
  const fl = [C.gold, C.red, C.roofB, C.pink];
  for (let q = 0; q < 8; q++) { const a = q / 8 * TAU; b.cone(0.05, 0.1, 3, Math.cos(a) * 0.86, 0.9, Math.sin(a) * 0.86, fl[q % 4], [Math.PI, 0, 0]); }
  return b.build();
}
function mPond() {
  const b = new MB();
  b.cyl(0.9, 0.94, 0.07, 11, 0, 0, 0, C.stoneL).cyl(0.78, 0.78, 0.02, 11, 0, 0.065, 0, 0x4fb3d6);
  for (const p of [[-0.6, 0.45], [-0.68, 0.3], [-0.5, 0.58], [0.62, -0.4], [0.7, -0.25]]) b.cyl(0.012, 0.012, 0.4, 3, p[0], 0.06, p[1], C.leafD).cyl(0.025, 0.025, 0.1, 4, p[0], 0.42, p[1], 0x6b4529);
  for (const p of [[0.3, 0.35], [-0.2, -0.4], [0.45, -0.1]]) b.cyl(0.11, 0.11, 0.01, 7, p[0], 0.085, p[1], C.leaf).sph(0.035, p[0] + 0.03, 0.11, p[1], C.pink);
  b.sph(0.14, 0.82, 0.08, 0.5, C.stone, [1, 0.7, 1]).sph(0.1, -0.85, 0.06, -0.45, C.stoneD, [1, 0.7, 1]);
  return b.build();
}
function mDuck() {
  const b = new MB();
  b.sph(0.085, 0, 0.05, 0, C.white, [1, 0.8, 1.4], 1).sph(0.05, 0, 0.13, 0.1, 0x2f7d4a, null, 1).box(0.03, 0.015, 0.05, 0, 0.12, 0.16, 0xf0a422).box(0.04, 0.03, 0.05, 0, 0.08, -0.12, C.white, [0.5, 0, 0]);
  return b.build().geo;
}
function mBunny() {
  const b = new MB();
  b.sph(0.07, 0, 0.07, 0, 0xb89a78, [1, 0.9, 1.3], 1).sph(0.045, 0, 0.12, 0.08, 0xb89a78, null, 1).box(0.018, 0.08, 0.02, -0.02, 0.14, 0.07, 0xb89a78).box(0.018, 0.08, 0.02, 0.02, 0.14, 0.07, 0xb89a78).sph(0.025, 0, 0.07, -0.09, C.white);
  return b.build().geo;
}
function mGazebo() {
  const b = new MB();
  b.cyl(0.46, 0.5, 0.1, 6, 0, 0, 0, C.stoneL);
  for (let q = 0; q < 6; q++) { const a = q / 6 * TAU; b.cyl(0.028, 0.028, 0.7, 5, Math.cos(a) * 0.4, 0.1, Math.sin(a) * 0.4, C.white); }
  b.cone(0.6, 0.42, 6, 0, 0.8, 0, C.roofG).sph(0.05, 0, 1.24, 0, C.gold).box(0.4, 0.04, 0.14, 0, 0.26, -0.2, C.woodL).box(0.04, 0.16, 0.12, -0.16, 0.1, -0.2, C.woodD).box(0.04, 0.16, 0.12, 0.16, 0.1, -0.2, C.woodD);
  return b.build();
}
function mTownhouse(v) {
  const b = new MB(), roof = ROOFS[v % 5];
  b.box(1.5, 0.1, 1.3, 0, 0, 0, C.stone).box(1.3, 0.6, 1.1, 0, 0.1, 0, C.stoneL).box(1.42, 0.07, 1.22, 0, 0.7, 0, C.woodD).box(1.38, 0.62, 1.18, 0, 0.77, 0, C.plaster);
  for (const sx of [-1, 0, 1]) b.box(0.07, 0.62, 0.07, sx * 0.67, 0.77, 0.57, C.woodD).box(0.07, 0.62, 0.07, sx * 0.67, 0.77, -0.57, C.woodD);
  b.box(1.42, 0.06, 1.22, 0, 1.39, 0, C.woodD).gable(1.38, 0.62, 1.18, 0, 1.45, 0, C.plaster).gable(1.6, 0.76, 1.46, 0, 1.42, 0, roof);
  b.box(0.36, 0.3, 0.3, -0.3, 1.6, 0.42, C.plaster).gable(0.44, 0.2, 0.36, -0.3, 1.9, 0.42, roof, Math.PI / 2).glow(0.18, 0.18, 0.04, -0.3, 1.74, 0.575);
  b.box(0.2, 0.7, 0.2, 0.42, 1.5, -0.3, C.stoneD).box(0.26, 0.06, 0.26, 0.42, 2.2, -0.3, C.stone);
  b.box(0.3, 0.48, 0.05, -0.3, 0.1, 0.56, C.woodD).box(0.42, 0.06, 0.18, -0.3, 0.02, 0.68, C.stoneL).glow(0.24, 0.22, 0.04, 0.3, 0.44, 0.555).glow(0.2, 0.22, 0.04, -0.34, 1.08, 0.595).glow(0.2, 0.22, 0.04, 0.34, 1.08, 0.595).glow(0.04, 0.22, 0.2, 0.695, 1.08, 0).glow(0.04, 0.22, 0.2, -0.695, 1.08, 0);
  b.box(0.3, 0.07, 0.08, 0.3, 0.26, 0.6, C.wood).sph(0.045, 0.22, 0.36, 0.6, C.red).sph(0.045, 0.3, 0.37, 0.61, C.gold).sph(0.045, 0.38, 0.36, 0.6, C.pink);
  return b.build();
}
function mHouse2(v) {            // two extra cottage looks: thatched (5) and stone (6)
  const b = new MB(), thatch = v % 2 === 1;
  b.box(1.5, 0.1, 1.3, 0, 0, 0, C.stone).box(1.3, 0.62, 1.1, 0, 0.1, 0, thatch ? 0xf7efe0 : C.stoneL);
  if (thatch) b.gable(1.3, 0.5, 1.1, 0, 0.72, 0, 0xf7efe0).gable(1.66, 0.74, 1.56, 0, 0.62, 0, C.thatch).gable(1.3, 0.3, 1.2, 0, 1.12, 0, 0xcaa647);
  else b.gable(1.3, 0.5, 1.1, 0, 0.72, 0, C.stoneL).gable(1.56, 0.62, 1.42, 0, 0.7, 0, 0x5a6b7a).box(0.36, 0.26, 0.3, 0.3, 0.86, 0.42, C.stoneL).gable(0.44, 0.18, 0.36, 0.3, 1.12, 0.42, 0x5a6b7a, Math.PI / 2).glow(0.16, 0.14, 0.04, 0.3, 0.98, 0.575);
  b.box(0.22, 0.6, 0.22, -0.4, 0.9, -0.25, C.stoneD).box(0.28, 0.06, 0.28, -0.4, 1.5, -0.25, C.stone);
  b.box(0.28, 0.46, 0.05, 0.25, 0.1, 0.56, thatch ? C.roofG : C.roofB).box(0.4, 0.06, 0.18, 0.25, 0.02, 0.68, C.stoneL);
  b.glow(0.24, 0.22, 0.04, -0.3, 0.5, 0.555).box(0.32, 0.04, 0.07, -0.3, 0.36, 0.57, C.woodD).glow(0.04, 0.22, 0.22, 0.655, 0.5, 0).glow(0.04, 0.22, 0.22, -0.655, 0.5, 0);
  b.sph(0.12, -0.72, 0.1, 0.62, C.leaf, [1, 0.8, 1]).sph(0.04, -0.72, 0.2, 0.62, C.pink).sph(0.04, -0.66, 0.17, 0.68, C.white);
  return b.build();
}
// little add-ons that show a building has been upgraded
const UPG_FN = {
  lumber: (b) => b.box(0.06, 0.62, 0.06, 0.25, 0, 0.72, C.woodD).box(0.06, 0.62, 0.06, 0.75, 0, 0.72, C.woodD).box(0.6, 0.05, 0.06, 0.5, 0.6, 0.72, C.wood).box(0.02, 0.5, 0.2, 0.5, 0.12, 0.72, C.iron).box(0.5, 0.05, 0.22, 0.5, 0.1, 0.72, C.woodL).box(0.5, 0.04, 0.2, -0.75, 0, 0.75, C.plank).box(0.5, 0.04, 0.2, -0.75, 0.04, 0.75, C.woodL, [0, 0.1, 0]).box(0.5, 0.04, 0.2, -0.75, 0.08, 0.75, C.plank),
  quarry: (b) => b.box(0.07, 1.2, 0.07, -0.8, 0, 0.6, C.woodD).box(0.7, 0.06, 0.06, -0.55, 1.15, 0.6, C.wood).box(0.02, 0.6, 0.02, -0.25, 0.58, 0.6, C.dark).box(0.2, 0.16, 0.2, -0.25, 0.42, 0.6, C.stoneL).box(0.34, 0.2, 0.28, 0.1, 0.06, 0.78, C.wood).cyl(0.07, 0.07, 0.36, 6, 0.1, 0, 0.78, C.dark, [0, 0, Math.PI / 2]),
  farm: (b) => b.cyl(0.03, 0.04, 1.5, 5, -1.25, 0, -0.6, C.woodD).cyl(0.2, 0.2, 0.02, 8, -1.25, 1.5, -0.56, C.iron, [Math.PI / 2, 0, 0]).box(0.44, 0.03, 0.03, -1.25, 1.5, -0.54, C.white).box(0.03, 0.44, 0.03, -1.25, 1.28, -0.54, C.white).box(0.3, 0.2, 0.3, -1.25, 0, -0.6, C.stoneL),
  bakery: (b) => b.box(0.3, 1.2, 0.3, -0.62, 0, -0.55, 0xb5563c).box(0.36, 0.07, 0.36, -0.62, 1.2, -0.55, C.stoneD).box(0.5, 0.26, 0.24, 0.42, 0, 0.78, C.woodL).sph(0.06, 0.3, 0.3, 0.78, C.bread, [1.5, 0.8, 1]).sph(0.06, 0.45, 0.3, 0.78, 0xdba25a, [1.5, 0.8, 1]).sph(0.06, 0.56, 0.3, 0.8, C.bread),
};
function upgradeGeo(type) {
  return cachedGeo('upg:' + type, () => {
    const b = new MB();
    if (UPG_FN[type]) UPG_FN[type](b);
    const s = BT[type].size / 2 - 0.08;
    b.cyl(0.025, 0.03, 1.5, 4, -s, 0, -s, C.woodD).box(0.3, 0.18, 0.02, -s + 0.16, 1.3, -s, C.gold).box(0.08, 0.18, 0.025, -s + 0.12, 1.3, -s, C.dark);
    return b.build().geo;
  });
}
// old sites to explore
const SITE_KINDS = {
  circle: { name: 'Stone Circle', text: 'Mossy stones older than the island\'s oldest tree.' },
  wreck: { name: 'Old Shipwreck', text: 'Sun-bleached ribs of a ship that never made it home.' },
  cairn: { name: 'Lonely Cairn', text: 'Someone stacked these stones with great care, long ago.' },
  shrine: { name: 'Bee Shrine', text: 'A tiny shrine with a carved bumblebee, half hidden in the grass.' },
};
function mSite(kind) {
  const b = new MB();
  if (kind === 'circle') { for (let q = 0; q < 6; q++) { const a = q / 6 * TAU; b.box(0.14, 0.4 + (q % 2) * 0.16, 0.1, Math.cos(a) * 0.36, 0, Math.sin(a) * 0.36, q % 2 ? C.stone : C.stoneD, [0, -a, (q % 3 - 1) * 0.12]); } b.box(0.3, 0.08, 0.22, 0, 0, 0, C.stoneL).sph(0.08, 0.2, 0.05, 0.2, C.leafD, [1, 0.5, 1]); }
  else if (kind === 'wreck') { b.sph(0.5, 0, 0.02, 0, C.woodD, [1.6, 0.35, 0.6], 1); for (let q = 0; q < 5; q++) b.box(0.05, 0.46, 0.05, -0.5 + q * 0.25, 0.05, 0.22, C.wood, [0.5, 0, 0]).box(0.05, 0.4, 0.05, -0.5 + q * 0.25, 0.05, -0.22, C.woodL, [-0.5, 0, 0]); b.cyl(0.04, 0.05, 0.7, 5, 0.1, 0, 0, C.woodD, [0, 0, 0.35]).box(0.2, 0.14, 0.14, -0.45, 0.06, 0, C.plank).box(0.21, 0.03, 0.15, -0.45, 0.2, 0, C.gold); }
  else if (kind === 'cairn') { b.sph(0.26, 0, 0.14, 0, C.stone, [1.2, 0.6, 1]).sph(0.2, 0.02, 0.36, 0, C.stoneL, [1.1, 0.6, 1]).sph(0.15, -0.01, 0.53, 0.01, C.stoneD, [1, 0.6, 1]).sph(0.1, 0, 0.66, 0, C.stoneL, [1, 0.7, 1]).sph(0.07, 0.25, 0.04, 0.2, C.leafD, [1, 0.5, 1]).sph(0.035, 0.28, 0.1, 0.2, C.white); }
  else { b.box(0.4, 0.1, 0.4, 0, 0, 0, C.stoneD).box(0.3, 0.34, 0.24, 0, 0.1, 0, C.stoneL).gable(0.4, 0.14, 0.34, 0, 0.44, 0, C.stone).sph(0.07, 0, 0.3, 0.13, C.gold, [1.3, 1, 0.7], 1).box(0.03, 0.14, 0.02, -0.01, 0.23, 0.14, C.dark).sph(0.035, -0.2, 0.06, 0.24, C.pink).sph(0.035, 0.22, 0.06, 0.22, C.white); }
  return b.build().geo;
}
function mSiteFlag() { const b = new MB(); b.cyl(0.02, 0.025, 0.9, 4, 0.42, 0, 0.42, C.woodD).box(0.26, 0.16, 0.02, 0.56, 0.72, 0.42, C.gold).box(0.07, 0.16, 0.025, 0.52, 0.72, 0.42, C.dark); return b.build().geo; }

Object.assign(MODEL_FN, { academy: mAcademy, mine: mMine, orchard: mOrchard, ciderpress: mCider, brickworks: mBrick, greenhouse: mGreenhouse, bathhouse: mBath, townhall: mTownhall, watchtower: mWatchtower, bandstand: mBandstand, pond: mPond, gazebo: mGazebo, townhouse: mTownhouse });
const _mHouse1 = MODEL_FN.house;
MODEL_FN.house = (v) => (v >= 5 ? mHouse2(v) : _mHouse1(v));
EXTRA_FN.pond = (g, ex) => {
  ex.ducks = [];
  for (let q = 0; q < 2; q++) { const m = new THREE.Mesh(cachedGeo('duck', mDuck), MAT.main); g.add(m); ex.ducks.push({ m, a: q * 3.1, r: 0.3 + q * 0.22, sp: q ? -0.5 : 0.4 }); }
};
function animateDucks(u, dt, t) {
  for (const d of u.ducks) { d.a += d.sp * dt; d.m.position.set(Math.cos(d.a) * d.r, 0.07 + Math.sin(t * 3 + d.r * 9) * 0.006, Math.sin(d.a) * d.r); d.m.rotation.y = -d.a + (d.sp > 0 ? 0 : Math.PI); }
}
Object.assign(JOBS, {
  scholar: { title: 'Scholar', plural: 'Scholars', shirt: 0x5b4a8a, hat: 'beret', hatC: 0x3a2f5e },
  miner: { title: 'Miner', plural: 'Miners', shirt: 0x8a6f4f, hat: 'helmet', hatC: 0xd9a23a },
  picker: { title: 'Fruit Picker', plural: 'Fruit Pickers', shirt: 0xd96a5a, hat: 'straw' },
  brewer: { title: 'Cider Maker', plural: 'Cider Makers', shirt: 0x9a7a3a, hat: 'none' },
  brickmaker: { title: 'Brickmaker', plural: 'Brickmakers', shirt: 0xb5563c, hat: 'cap', hatC: 0x7a3b2e },
  gardener: { title: 'Gardener', plural: 'Gardeners', shirt: 0x4f9a6a, hat: 'straw' },
  attendant: { title: 'Bath Attendant', plural: 'Bath Attendants', shirt: 0xf3efe6, hat: 'none' },
  guard: { title: 'Watchman', plural: 'Watchmen', shirt: 0x8a2f22, hat: 'helmet', hatC: 0x7d8591 },
});
CARRY_FN.brick = (b) => b.box(0.16, 0.06, 0.09, 0, 0, 0, 0xb5563c).box(0.16, 0.06, 0.09, 0, 0.06, 0, 0xc2684a, [0, 0.2, 0]);
CARRY_FN.cider = (b) => b.cyl(0.055, 0.045, 0.11, 7, 0, 0, 0, 0x8a5a2e).cyl(0.025, 0.035, 0.04, 6, 0, 0.11, 0, 0x8a5a2e);
