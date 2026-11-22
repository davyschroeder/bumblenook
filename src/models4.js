// ---------- five more cottages (variants 7 to 11), so a street of homes does not repeat itself ----------
// All keep the footprint, the door on the front (+z) and a chimney near (0.38, -0.25), where the smoke rises.
function mHouse3(v) {
  const b = new MB(), k = v - 7, roof = ROOFS[(v * 3 + 1) % 5];
  const chimney = (h) => b.box(0.2, h, 0.2, 0.38, 1.0, -0.25, C.stoneD).box(0.27, 0.06, 0.27, 0.38, 1.0 + h, -0.25, C.stone);
  const win = (x, y, z, side) => { if (side) b.glow(0.04, 0.22, 0.22, x, y, z).box(0.05, 0.03, 0.3, x, y - 0.15, z, C.woodD).box(0.03, 0.24, 0.05, x, y - 0.12, z - 0.15, C.roofG).box(0.03, 0.24, 0.05, x, y - 0.12, z + 0.15, C.roofG);
    else b.glow(0.22, 0.22, 0.04, x, y, z).box(0.3, 0.03, 0.06, x, y - 0.15, z + 0.01, C.woodD).box(0.05, 0.24, 0.03, x - 0.15, y - 0.12, z + 0.01, C.roofG).box(0.05, 0.24, 0.03, x + 0.15, y - 0.12, z + 0.01, C.roofG); };
  const door = (x, z, col) => b.box(0.3, 0.5, 0.05, x, 0.1, z, C.woodD).box(0.24, 0.44, 0.03, x, 0.1, z + 0.02, col).box(0.03, 0.03, 0.03, x + 0.07, 0.33, z + 0.05, C.gold).box(0.42, 0.06, 0.18, x, 0.02, z + 0.12, C.stoneL);
  b.box(1.5, 0.1, 1.3, 0, 0, 0, C.stone);
  if (k === 0) {                       // an L-shaped cottage: a long house with a wing to the front
    b.box(1.3, 0.7, 0.72, 0, 0.1, -0.19, C.plaster).gable(1.3, 0.46, 0.72, 0, 0.8, -0.19, C.plaster).gable(1.52, 0.56, 0.96, 0, 0.78, -0.19, roof);
    b.box(0.62, 0.7, 0.6, 0.34, 0.1, 0.25, C.plaster).gable(0.6, 0.4, 0.62, 0.34, 0.8, 0.25, C.plaster, Math.PI / 2).gable(0.74, 0.42, 0.72, 0.34, 0.78, 0.33, roof, Math.PI / 2);
    b.box(1.34, 0.06, 0.76, 0, 0.76, -0.19, C.woodD);
    door(-0.3, 0.17, C.roofB); win(0.34, 0.5, 0.555, 0); win(-0.655, 0.5, -0.2, 1); win(0.655, 0.5, 0.25, 1);
    b.glow(0.16, 0.16, 0.04, 0.34, 0.98, 0.56);
    b.box(0.5, 0.05, 0.3, -0.36, 0.1, 0.36, C.woodL).box(0.05, 0.3, 0.05, -0.58, 0.1, 0.48, C.woodD).box(0.05, 0.3, 0.05, -0.14, 0.1, 0.48, C.woodD);
    chimney(0.5);
  } else if (k === 1) {                // tall and narrow, half-timbered, the upper floor leans out
    b.box(1.1, 0.62, 1.0, 0, 0.1, 0, C.stoneL).box(1.26, 0.07, 1.14, 0, 0.72, 0, C.woodD).box(1.2, 0.62, 1.08, 0, 0.79, 0, 0xf7efe0);
    for (const sx of [-1, 0, 1]) b.box(0.06, 0.62, 0.05, sx * 0.57, 0.79, 0.53, C.woodD).box(0.06, 0.62, 0.05, sx * 0.57, 0.79, -0.53, C.woodD);
    for (const sz of [-1, 1]) b.box(0.05, 0.62, 0.06, 0.59, 0.79, sz * 0.5, C.woodD).box(0.05, 0.62, 0.06, -0.59, 0.79, sz * 0.5, C.woodD);
    b.box(0.05, 0.7, 0.04, -0.28, 0.76, 0.535, C.woodD, [0, 0, 0.5]).box(0.05, 0.7, 0.04, 0.28, 0.76, 0.535, C.woodD, [0, 0, -0.5]);
    b.gable(1.2, 0.6, 1.08, 0, 1.41, 0, 0xf7efe0).gable(1.42, 0.74, 1.34, 0, 1.38, 0, roof);
    door(0, 0.5, C.roofR); b.glow(0.2, 0.22, 0.04, -0.3, 1.1, 0.545).glow(0.2, 0.22, 0.04, 0.3, 1.1, 0.545).glow(0.04, 0.22, 0.22, 0.605, 1.1, 0).glow(0.04, 0.22, 0.22, -0.605, 1.1, 0).glow(0.16, 0.16, 0.04, 0, 1.62, 0.5);
    b.box(0.26, 0.05, 0.07, -0.3, 0.94, 0.57, C.wood).box(0.26, 0.05, 0.07, 0.3, 0.94, 0.57, C.wood).sph(0.04, -0.34, 1.0, 0.59, C.red).sph(0.04, -0.26, 1.0, 0.59, C.gold).sph(0.04, 0.3, 1.0, 0.59, C.pink);
    b.box(0.2, 0.9, 0.2, 0.38, 1.3, -0.25, C.stoneD).box(0.27, 0.06, 0.27, 0.38, 2.2, -0.25, C.stone);
  } else if (k === 2) {                // a log cabin with a porch
    for (let q = 0; q < 5; q++) b.box(1.3 + (q % 2) * 0.08, 0.15, 0.92 + ((q + 1) % 2) * 0.08, 0, 0.1 + q * 0.15, -0.12, q % 2 ? C.wood : C.plank);
    b.gable(1.3, 0.48, 0.92, 0, 0.85, -0.12, C.wood).gable(1.56, 0.6, 1.5, 0, 0.82, 0.02, roof === C.roofP ? C.roofG : roof);
    b.box(1.3, 0.06, 0.36, 0, 0.1, 0.5, C.woodL);
    for (const sx of [-1, 1]) b.box(0.07, 0.68, 0.07, sx * 0.6, 0.16, 0.62, C.woodD);
    b.box(1.26, 0.05, 0.05, 0, 0.36, 0.62, C.wood).box(0.3, 0.5, 0.05, -0.25, 0.16, 0.36, C.woodD).box(0.03, 0.03, 0.03, -0.17, 0.4, 0.39, C.gold);
    b.glow(0.24, 0.22, 0.04, 0.3, 0.55, 0.355).box(0.32, 0.04, 0.06, 0.3, 0.41, 0.37, C.woodD).glow(0.04, 0.22, 0.22, 0.675, 0.55, -0.12).glow(0.04, 0.22, 0.22, -0.675, 0.55, -0.12);
    b.box(0.3, 0.2, 0.2, 0.42, 0.16, 0.52, C.woodL).cyl(0.09, 0.1, 0.22, 7, -0.52, 0.16, 0.52, C.woodD);
    b.box(0.26, 1.5, 0.24, 0.38, 0.1, -0.5, C.stone).box(0.2, 0.26, 0.2, 0.38, 1.6, -0.5, C.stoneD);
    b.box(0.2, 0.01, 0.2, 0.38, 1.0, -0.25, C.wood);
  } else if (k === 3) {                // a low white cottage with a hipped roof and a round bay window
    b.box(1.3, 0.62, 1.06, 0, 0.1, 0, 0xf7efe0).box(1.36, 0.06, 1.12, 0, 0.72, 0, C.woodD);
    b.cone(1.02, 0.7, 4, 0, 0.78, 0, roof, [0, Math.PI / 4, 0]);
    b.cyl(0.26, 0.26, 0.5, 8, 0.32, 0.1, 0.52, 0xf7efe0).cone(0.32, 0.26, 8, 0.32, 0.6, 0.52, roof);
    b.glow(0.2, 0.2, 0.04, 0.32, 0.38, 0.785).glow(0.04, 0.2, 0.14, 0.555, 0.38, 0.62).glow(0.04, 0.2, 0.14, 0.085, 0.38, 0.62);
    door(-0.32, 0.53, C.roofY); win(-0.655, 0.48, 0, 1); win(0.655, 0.48, -0.1, 1);
    for (let q = 0; q < 5; q++) b.box(0.04, 0.2, 0.04, -0.72 + q * 0.11, 0.1, 0.62, C.white);
    b.box(0.5, 0.03, 0.03, -0.5, 0.24, 0.62, C.white).sph(0.1, -0.6, 0.16, 0.5, C.leaf, [1, 0.8, 1]).sph(0.035, -0.62, 0.25, 0.52, C.pink).sph(0.035, -0.56, 0.23, 0.46, C.white);
    chimney(0.55);
  } else {                             // a stone house with dormers and a lean-to shed
    b.box(1.02, 0.74, 1.1, -0.14, 0.1, 0, C.stoneL).gable(1.1, 0.5, 1.02, -0.14, 0.84, 0, C.stoneL, Math.PI / 2).gable(1.36, 0.62, 1.24, -0.14, 0.82, 0, roof, Math.PI / 2);
    b.box(0.36, 0.44, 0.8, 0.55, 0.1, -0.1, C.plank).box(0.44, 0.05, 0.9, 0.56, 0.58, -0.1, C.woodD, [0, 0, -0.32]);
    b.box(0.2, 0.34, 0.04, 0.55, 0.1, 0.31, C.woodD);
    for (const sz of [-1, 1]) b.box(0.26, 0.22, 0.26, -0.5, 0.98, sz * 0.26, C.stoneL).gable(0.34, 0.14, 0.32, -0.5, 1.2, sz * 0.26, roof).glow(0.04, 0.14, 0.16, -0.635, 1.08, sz * 0.26);
    door(-0.3, 0.53, C.roofG); win(0.1, 0.52, 0.555, 0); win(-0.655, 0.5, 0, 1);
    b.glow(0.18, 0.18, 0.04, -0.14, 1.02, 0.56);
    b.cyl(0.11, 0.12, 0.26, 8, -0.66, 0.1, 0.55, C.woodD).box(0.2, 0.03, 0.2, -0.66, 0.36, 0.55, C.wood);
    b.box(0.2, 0.62, 0.2, 0.38, 1.0, -0.25, C.stoneD).box(0.27, 0.06, 0.27, 0.38, 1.62, -0.25, C.stone);
    b.box(0.2, 0.5, 0.2, 0.38, 0.5, -0.25, C.stoneD);
  }
  return b.build();
}
{ const older = MODEL_FN.house; MODEL_FN.house = (v) => (v >= 7 ? mHouse3(v) : older(v)); }
