// ---------- handcrafted architecture: a miniature island built from timber, stone and honey ----------
// Decorative geometry stays merged per building. All original footprints, jobs and save IDs stay intact.
const ART = {
  timber: 0x654938, timberLight: 0xad7c50, mortar: 0xa89d88, limestone: 0xe9dfc9,
  slate: 0x517c89, slateDark: 0x315762, cream: 0xffefcf, brass: 0xe7b954,
  terracotta: 0xc66b4a, teal: 0x4c958f, moss: 0x78965c, copper: 0xb67548,
};
function artTint(c, k) { return new THREE.Color(c).multiplyScalar(k).getHex(); }
function artMerge(a, b) {
  const out = new MB();
  for (const m of [a, b]) {
    if (m.geo) { const p = m.geo.attributes.position.array, c = m.geo.attributes.color.array; for (let i = 0; i < p.length; i++) { out.pos.push(p[i]); out.col.push(c[i]); } m.geo.dispose(); }
    if (m.glow) { const p = m.glow.attributes.position.array; for (let i = 0; i < p.length; i++) out.gpos.push(p[i]); m.glow.dispose(); }
  }
  return out.build();
}
function artBeam(b, ax, ay, az, bx, by, bz, r, c, sides) {
  const d = new THREE.Vector3(bx - ax, by - ay, bz - az), len = d.length();
  if (len < 0.0001) return;
  const g = new THREE.CylinderGeometry(r, r, len, sides || 5);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.divideScalar(len)));
  b._add(g, (ax + bx) / 2, (ay + by) / 2, (az + bz) / 2, c);
}
function artRing(b, r, tube, x, y, z, color, rot, arc) {
  b._add(new THREE.TorusGeometry(r, tube, 4, 16, arc || TAU), x, y, z, color, rot);
}
function artRoof(b, x, y, z, w, d, h, col, ry, rows) {
  ry = ry || 0; rows = rows || 5;
  b.gable(w, h, d, x, y, z, artTint(col, 0.66), ry);
  const columns = Math.max(4, Math.min(12, Math.ceil(w / 0.19))), cw = w / columns;
  for (const side of [-1, 1]) for (let row = 0; row < rows; row++) for (let q = 0; q < columns; q++) {
    const l = -w / 2 + q * cw + 0.006, r = l + cw - 0.012;
    const t0 = Math.max(0, row / rows - 0.035), t1 = Math.min(1.02, (row + 1) / rows + 0.018);
    const zz0 = side * t0 * d / 2, zz1 = side * t1 * d / 2;
    const yy0 = h * (1 - t0) + 0.019, yy1 = h * (1 - t1) + 0.019;
    const pts = [[l, yy0, zz0], [r, yy0, zz0], [r, yy1, zz1], [(l + r) / 2, yy1 - 0.018, zz1 + side * 0.02], [l, yy1, zz1]], pp = [];
    for (const tr of [[0, 1, 2], [0, 2, 3], [0, 3, 4]]) { const idx = side > 0 ? [tr[0], tr[2], tr[1]] : tr; for (const n of idx) pp.push(...pts[n]); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
    b._add(geo, x, y, z, artTint(col, 0.91 + ((q * 7 + row * 13) % 7) * 0.028), [0, ry, 0]);
  }
  const cs = Math.cos(ry), sn = Math.sin(ry), P = (xx, zz) => [x + xx * cs + zz * sn, z - xx * sn + zz * cs];
  let a = P(-w / 2 - 0.025, 0), c = P(w / 2 + 0.025, 0);
  artBeam(b, a[0], y + h + 0.025, a[1], c[0], y + h + 0.025, c[1], 0.035, artTint(col, 1.15), 6);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { a = P(sx * w / 2, sz * d / 2); c = P(sx * w / 2, 0); artBeam(b, a[0], y + 0.015, a[1], c[0], y + h + 0.015, c[1], 0.025, ART.timber); }
}
function artArch(b, x, y, z, w, h, frame, fill, depth) {
  const r = w / 2, spring = y + h - r, d = depth || 0.055;
  b.box(w, h - r, d, x, y, z, fill);
  b._add(new THREE.CircleGeometry(r, 12, 0, Math.PI), x, spring, z + d * 0.52, fill);
  for (const side of [-1, 1]) b.box(0.045, h - r, d + 0.02, x + side * (r + 0.018), y, z, frame);
  for (let q = 0; q < 9; q++) { const a = (q + 0.5) / 9 * Math.PI; b.box(0.065, 0.068, d + 0.025, x + Math.cos(a) * (r + 0.02), spring + Math.sin(a) * (r + 0.02) - 0.034, z + 0.008, frame, [0, 0, a - Math.PI / 2]); }
}
function artWindow(b, x, y, z, size, shutter, flowers) {
  const w = size || 0.25, h = w * 1.05;
  b.box(w + 0.08, h + 0.08, 0.035, x, y - h / 2 - 0.04, z, ART.timber);
  b.glow(w, h, 0.035, x, y, z + 0.02);
  b.box(0.025, h + 0.02, 0.045, x, y - h / 2, z + 0.045, ART.cream).box(w + 0.02, 0.023, 0.045, x, y - 0.012, z + 0.045, ART.cream);
  b.box(w + 0.13, 0.04, 0.09, x, y - h / 2 - 0.045, z + 0.03, ART.limestone);
  if (shutter) for (const s of [-1, 1]) {
    b.box(w * 0.32, h + 0.015, 0.035, x + s * (w * 0.69 + 0.03), y - h / 2, z + 0.025, shutter);
    for (let j = 0; j < 3; j++) b.box(w * 0.31, 0.018, 0.04, x + s * (w * 0.69 + 0.03), y - h / 2 + 0.04 + j * h * 0.3, z + 0.03, artTint(shutter, 0.75));
  }
  if (flowers) {
    b.box(w + 0.1, 0.075, 0.12, x, y - h / 2 - 0.12, z + 0.07, ART.timberLight);
    for (let i = 0; i < 4; i++) {
      const px = x - w * 0.4 + i * w * 0.27;
      b.sph(0.05, px, y - h / 2 - 0.035, z + 0.1, ART.moss, [1, 0.75, 1]);
      b.sph(0.03, px, y - h / 2 + 0.003, z + 0.12, [C.pink, C.white, C.gold, 0xb29acc][i], null, 1);
    }
  }
}
function artDoor(b, x, y, z, col, w, h) {
  w = w || 0.28; h = h || 0.5;
  artArch(b, x, y, z, w, h, ART.timber, col || ART.teal);
  for (let q = 0; q < 4; q++) b.box(0.008, h - w / 2 - 0.01, 0.008, x - w * 0.36 + q * w * 0.24, y + 0.01, z + 0.035, artTint(col || ART.teal, 0.72));
  b.sph(0.022, x + w * 0.29, y + h * 0.43, z + 0.06, ART.brass, null, 1);
  b.box(w + 0.19, 0.06, 0.2, x, y - 0.06, z + 0.09, ART.limestone);
}
function artPot(b, x, y, z, flower, scale) {
  const s = scale || 1;
  b.cyl(0.11 * s, 0.075 * s, 0.15 * s, 8, x, y, z, ART.terracotta).cyl(0.12 * s, 0.12 * s, 0.035 * s, 8, x, y + 0.13 * s, z, artTint(ART.terracotta, 1.15));
  b.sph(0.125 * s, x, y + 0.22 * s, z, ART.moss, [1, 0.85, 1], 1);
  if (flower) for (let q = 0; q < 4; q++) { const a = q * 2.4; b.sph(0.035 * s, x + Math.sin(a) * 0.08 * s, y + 0.29 * s, z + Math.cos(a) * 0.08 * s, flower, [1, 0.7, 1], 1); }
}
function artCrate(b, x, y, z, s) {
  s = s || 0.28;
  b.box(s, s, s, x, y, z, ART.timberLight);
  for (const k of [-1, 1]) b.box(s + 0.01, 0.028, s + 0.01, x, y + s * (k > 0 ? 0.84 : 0.08), z, ART.timber);
  for (const k of [-1, 1]) artBeam(b, x - s * 0.42, y + s * 0.1, z + k * (s / 2 + 0.009), x + s * 0.42, y + s * 0.9, z + k * (s / 2 + 0.009), 0.015, ART.timber);
}
function artBarrel(b, x, y, z, s) {
  s = s || 1;
  b.cyl(0.12 * s, 0.14 * s, 0.17 * s, 10, x, y, z, ART.timberLight).cyl(0.14 * s, 0.12 * s, 0.17 * s, 10, x, y + 0.17 * s, z, ART.timberLight);
  for (const h of [0.055, 0.27]) b.cyl(0.138 * s, 0.138 * s, 0.026 * s, 10, x, y + h * s, z, C.iron);
  b.cyl(0.117 * s, 0.117 * s, 0.018 * s, 10, x, y + 0.34 * s, z, ART.timber);
}
function artChimney(b, x, z, top, base) {
  base = base || 0.92; top = top || 1.6;
  b.box(0.21, top - base, 0.22, x, base, z, 0xb88366);
  for (let q = 0; q < Math.floor((top - base) / 0.11); q++) b.box(0.214, 0.012, 0.224, x, base + q * 0.11, z, 0xd3b394);
  b.box(0.28, 0.055, 0.29, x, top, z, ART.limestone).box(0.12, 0.009, 0.13, x, top + 0.057, z, ART.timber);
}
function artTent(b, x, z, col, ry, sc) {
  const local = new MB(), s = sc || 1;
  local.box(0.85, 0.035, 0.84, 0, 0, 0, 0x947d5a);
  local.gable(0.82, 0.66, 0.84, 0, 0.035, 0, col, Math.PI / 2);
  local.gable(0.012, 0.49, 0.44, 0, 0.04, 0.431, ART.timber, Math.PI / 2);
  // A-frame, canvas seams, pegged guy lines and a little rolled blanket.
  for (const zz of [-0.44, 0.44]) {
    artBeam(local, -0.44, 0.025, zz, 0, 0.74, zz, 0.021, ART.timberLight);
    artBeam(local, 0.44, 0.025, zz, 0, 0.74, zz, 0.021, ART.timberLight);
    for (const side of [-1, 1]) { artBeam(local, side * 0.31, 0.23, zz, side * 0.53, 0.045, zz + Math.sign(zz) * 0.08, 0.006, 0xe9ddbb); local.box(0.025, 0.075, 0.025, side * 0.53, 0, zz + Math.sign(zz) * 0.08, ART.timber); }
  }
  artBeam(local, 0, 0.71, -0.48, 0, 0.71, 0.48, 0.023, ART.timberLight);
  local.cyl(0.065, 0.065, 0.28, 8, 0.21, 0.04, 0.31, C.roofG, [0, 0, Math.PI / 2]);
  const m = local.build(); b._add(m.geo, x, 0, z, 0xffffff, [0, ry, 0], false, [s, s, s]);
  // MB._add paints a primitive uniformly; restore original per-vertex canvas colours after transform.
  const count = local.col.length, off = b.col.length - count;
  for (let i = 0; i < count; i++) b.col[off + i] = local.col[i];
}
function artCenter() {
  const b = new MB();
  b.cyl(1.42, 1.45, 0.035, 18, 0, 0, 0, 0xcfb987);
  artTent(b, -0.84, -0.64, 0xffefd4, 0.36, 0.94); artTent(b, 0.84, -0.64, 0xeacb88, -0.36, 0.94);
  artTent(b, -0.91, 0.66, 0xb4cfba, 1.03, 0.67); artTent(b, 0.91, 0.66, 0xe5bc9e, -1.03, 0.67);
  for (let q = 0; q < 12; q++) { const a = q / 12 * TAU; b.sph(0.085, Math.cos(a) * 0.3, 0.07, Math.sin(a) * 0.3, q % 2 ? ART.mortar : ART.limestone, [1.1, 0.7, 0.9], 1); }
  for (const a of [0, 2.1, 4.2]) artBeam(b, Math.sin(a) * 0.22, 0.06, Math.cos(a) * 0.22, -Math.sin(a) * 0.22, 0.15, -Math.cos(a) * 0.22, 0.045, ART.timber);
  b.cyl(0.025, 0.04, 1.96, 8, 0, 0, -1.2, ART.timber).sph(0.065, 0, 1.98, -1.2, ART.brass, null, 1);
  artCrate(b, 0.62, 0.03, 1.1, 0.24); artBarrel(b, -0.67, 0.03, 1.11, 0.7);
  b.box(0.05, 0.52, 0.05, -1.22, 0, 1.18, ART.timber).box(0.48, 0.24, 0.06, -1.22, 0.42, 1.18, ART.timberLight).box(0.28, 0.018, 0.067, -1.22, 0.57, 1.18, ART.cream).box(0.2, 0.018, 0.067, -1.22, 0.5, 1.18, ART.cream);
  for (let q = 0; q < 3; q++) b.sph(0.09, -0.16 + q * 0.16, 0.03, 1.24, ART.limestone, [1, 0.3, 1]);
  return b.build();
}
// More roof shapes for the cottages: hipped, gambrel and saltbox, laid in rows like the gable roof.
function artSlope(b, pts, col, rows, cx, cy, cz, ry, ox, oy, oz) {       // pts: eave left, eave right, top right, top left
  const L = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t];
  for (let r = 0; r < rows; r++) {
    const t0 = r / rows, t1 = (r + 1) / rows;
    const q = [L(pts[0], pts[3], t0), L(pts[1], pts[2], t0), L(pts[1], pts[2], t1), L(pts[0], pts[3], t1)];
    let tris = [q[0], q[1], q[2], q[0], q[2], q[3]];
    const u = [q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]], w = [q[3][0] - q[0][0] + q[2][0] - q[1][0], q[3][1] - q[0][1] + q[2][1] - q[1][1], q[3][2] - q[0][2] + q[2][2] - q[1][2]];
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const mid = [(q[0][0] + q[2][0]) / 2 - cx, (q[0][1] + q[2][1]) / 2 - cy, (q[0][2] + q[2][2]) / 2 - cz];
    if (n[0] * mid[0] + n[1] * mid[1] + n[2] * mid[2] < 0) tris = [q[0], q[2], q[1], q[0], q[3], q[2]];
    const arr = []; for (const v of tris) arr.push(v[0], v[1] + 0.012 * (rows - r) / rows, v[2]);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    b._add(g, ox, oy, oz, artTint(col, 0.86 + (r % 2) * 0.1 + ((r * 5) % 3) * 0.02), [0, ry || 0, 0]);
  }
}
function artRoofForm(b, form, x, y, z, w, d, h, col, ry, wall) {
  const a = w / 2, c = d / 2, S = (pts, cl, rows, cy) => artSlope(b, pts, cl, rows, 0, cy === undefined ? h * 0.3 : cy, 0, ry, x, y, z);
  const A = [-a, 0, -c], B = [a, 0, -c], Cc = [a, 0, c], D = [-a, 0, c];
  b._add(new THREE.BoxGeometry(w, 0.035, d), x, y + 0.012, z, artTint(col, 0.6), [0, ry || 0, 0]);
  if (form === 1) {                        // hipped: four slopes meeting in a short ridge
    const rl = Math.max(0.02, (w - d) / 2 + 0.12), R1 = [-rl, h, 0], R2 = [rl, h, 0];
    S([D, Cc, R2, R1], col, 5); S([B, A, R1, R2], col, 5); S([A, D, R1, R1], col, 5); S([Cc, B, R2, R2], col, 5);
    b._add(new THREE.CylinderGeometry(0.03, 0.03, rl * 2 + 0.06, 6), x, y + h + 0.02, z, artTint(col, 1.15), [0, ry || 0, Math.PI / 2]);
  } else if (form === 2) {                 // gambrel: steep below, gentle above, like a little barn
    const k = c * 0.56, m = h * 0.66, R1 = [-a, h, 0], R2 = [a, h, 0];
    for (const s of [1, -1]) { const E0 = [-a, 0, s * c], E1 = [a, 0, s * c], M0 = [-a, m, s * k], M1 = [a, m, s * k]; S([E0, E1, M1, M0], col, 3, 0); S([M0, M1, R2, R1], artTint(col, 1.06), 3, 0); }
    for (const sx of [-1, 1]) { const X = sx * (a - 0.05); S([[X, 0, -c + 0.04], [X, 0, c - 0.04], [X, m, k - 0.03], [X, m, -k + 0.03]], wall, 1, 0); S([[X, m, -k + 0.03], [X, m, k - 0.03], [X, h - 0.02, 0], [X, h - 0.02, 0]], wall, 1, 0); }
    b._add(new THREE.CylinderGeometry(0.03, 0.03, w + 0.06, 6), x, y + h + 0.02, z, artTint(col, 1.15), [0, ry || 0, Math.PI / 2]);
  } else {                                 // saltbox: the ridge sits towards the back, with one long slope to the front
    const rz = -c * 0.42, R1 = [-a, h, rz], R2 = [a, h, rz];
    S([D, Cc, R2, R1], col, 6, 0); S([B, A, R1, R2], artTint(col, 0.94), 3, 0);
    for (const sx of [-1, 1]) { const X = sx * (a - 0.05); S([[X, 0, -c + 0.04], [X, 0, c - 0.04], [X, h - 0.02, rz], [X, h - 0.02, rz]], wall, 1, 0); }
    b._add(new THREE.CylinderGeometry(0.03, 0.03, w + 0.06, 6), x, y + h + 0.02, z + (ry ? 0 : rz), artTint(col, 1.15), [0, ry || 0, Math.PI / 2]);
  }
}
function artHouse(v) {
  // 24 cottages: six wall styles, four roof shapes and eight roof colours, mixed so neighbours rarely match
  const b = new MB(), palette = [0xbd6249, 0x628998, 0x718e64, 0xc59b4e, 0x8b789c, 0x9a4638, 0x45616d, 0xd8b45e], form = ((v / 6) | 0) % 4, roof = palette[(v * 3 + form * 5) % 8];
  const style = v % 6, wall = [0xffebcd, 0xf2d9ba, 0xe2d6c4, 0xf8efd9, 0xd7e2d8, 0xf0dfbf][style];
  const h = style === 2 ? 1.02 : style === 4 ? 0.68 : 0.79, ry = style === 1 || style === 5 ? Math.PI / 2 : 0;
  b.box(1.46, 0.1, 1.3, 0, 0, 0, ART.mortar).box(1.3, h, 1.08, 0, 0.1, 0, wall);
  for (let q = 0; q < 6; q++) b.box(0.205, 0.085, 0.04, -0.55 + q * 0.22, 0.105, 0.55, q % 2 ? ART.mortar : ART.limestone);
  if (style === 3) for (let q = 0; q < 6; q++) b.box(1.31, 0.06, 1.1, 0, 0.15 + q * 0.12, 0, q % 2 ? ART.timberLight : C.plank);
  else {
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.065, h, 0.065, sx * 0.63, 0.1, sz * 0.52, ART.timber);
    b.box(1.33, 0.055, 1.12, 0, 0.1 + h - 0.055, 0, ART.timber);
  }
  const peak = style === 2 ? 0.43 : style === 4 ? 0.65 : 0.56;
  if (form) artRoofForm(b, form, 0, h + 0.1, 0, ry ? 1.34 : 1.53, ry ? 1.52 : 1.35, form === 1 ? peak * 0.92 : form === 2 ? peak * 1.12 : peak * 1.05, roof, ry, wall);
  else artRoof(b, 0, h + 0.1, 0, ry ? 1.34 : 1.53, ry ? 1.52 : 1.35, peak, roof, ry, 5);
  // A small proper dormer gives the broad roof a recognisable handmade silhouette.
  if (form) { if (form === 2 && ry) artWindow(b, 0, h + 0.29, 0.55, 0.18, 0, false); }
  else if (!ry) {
    b.box(0.33, 0.24, 0.3, 0.16, h + 0.19, 0.37, wall);
    artRoof(b, 0.16, h + 0.43, 0.37, 0.4, 0.44, 0.2, artTint(roof, 0.93), Math.PI / 2, 2);
    artWindow(b, 0.16, h + 0.32, 0.529, 0.13, 0, false);
  } else artWindow(b, 0, h + 0.29, 0.55, 0.18, 0, false);
  artDoor(b, -0.28, 0.13, 0.563, style % 2 ? ART.teal : artTint(roof, 0.82), 0.27, 0.51);
  artWindow(b, 0.31, h * 0.5 + 0.2, 0.565, 0.235, style % 2 ? ART.timberLight : ART.teal, true);
  // Windows on the side are assembled in local space and rotated as one merged component.
  for (const side of [-1, 1]) {
    const wb = new MB(); artWindow(wb, 0, 0.51, 0, 0.22, roof, false); const m = wb.build();
    const before = b.col.length; b._add(m.geo, side * 0.655, 0, -0.1, 0xffffff, [0, side * Math.PI / 2, 0]); for (let i = 0; i < wb.col.length; i++) b.col[before + i] = wb.col[i];
    if (m.glow) b._add(m.glow, side * 0.655, 0, -0.1, 0, [0, side * Math.PI / 2, 0], true);
  }
  artChimney(b, 0.38, -0.25, 1.6, 1.03);
  artPot(b, -0.64, 0.08, 0.64, C.pink, 0.7); artPot(b, 0.69, 0.08, 0.63, C.white, 0.62);
  if (style === 2) { b.box(1.31, 0.045, 1.11, 0, 0.69, 0, ART.timber); for (const sx of [-1, 1]) artBeam(b, sx * 0.58, 0.73, 0.55, sx * 0.37, 1.09, 0.55, 0.02, ART.timber); }
  if (style === 4) { b.box(0.44, 0.42, 0.24, 0.28, 0.1, 0.61, wall); artWindow(b, 0.28, 0.34, 0.738, 0.24, 0, true); artRoof(b, 0.28, 0.52, 0.61, 0.53, 0.42, 0.19, roof, 0, 2); }
  return b.build();
}
function artForager() {
  const b = new MB();
  b.cyl(0.5, 0.53, 0.09, 12, -0.13, 0, -0.2, ART.mortar).cyl(0.49, 0.49, 0.53, 12, -0.13, 0.09, -0.2, ART.cream);
  for (let q = 0; q < 8; q++) { const a = q / 8 * TAU; b.cyl(0.025, 0.035, 0.6, 5, -0.13 + Math.cos(a) * 0.48, 0.04, -0.2 + Math.sin(a) * 0.48, ART.timber); }
  for (let q = 0; q < 6; q++) b.cone(0.69 - q * 0.085, 0.22, 12, -0.13, 0.58 + q * 0.095, -0.2, q % 2 ? 0xb99d59 : 0xccb46c, [0, q * 0.06, 0]);
  b.sph(0.07, -0.13, 1.3, -0.2, ART.timber, [1, 0.6, 1]);
  artDoor(b, -0.13, 0.09, 0.3, ART.teal, 0.25, 0.45); artWindow(b, 0.24, 0.43, 0.15, 0.15, 0, false);
  for (let q = 0; q < 3; q++) { const x = 0.38 + q * 0.2, z = 0.55 - q * 0.13; b.cyl(0.13, 0.09, 0.13, 10, x, 0.02, z, ART.timberLight); artRing(b, 0.12, 0.014, x, 0.15, z, ART.timber, [Math.PI / 2, 0, 0]); for (let k = 0; k < 5; k++) b.sph(0.04, x + Math.cos(k * 2.4) * 0.06, 0.16 + k * 0.004, z + Math.sin(k * 2.4) * 0.06, k % 2 ? C.red : 0x8f416c, null, 1); }
  artPot(b, -0.65, 0, 0.4, 0xb7a0d0, 0.85); artPot(b, -0.39, 0, 0.7, C.white, 0.7);
  b.box(0.04, 0.6, 0.04, 0.65, 0, -0.55, ART.timber).box(0.37, 0.2, 0.04, 0.65, 0.46, -0.55, ART.timberLight).sph(0.045, 0.6, 0.56, -0.52, C.red).sph(0.045, 0.71, 0.55, -0.52, C.pink);
  return b.build();
}
function artHarbour() {
  const b = new MB();
  for (let q = 0; q < 11; q++) b.box(1.82, 0.1, 0.157, 0, 0.025, -0.82 + q * 0.164, q % 3 ? ART.timberLight : C.plank);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.cyl(0.055, 0.065, 0.42, 8, sx * 0.83, -0.08, sz * 0.82, ART.timber).cyl(0.073, 0.073, 0.04, 8, sx * 0.83, 0.34, sz * 0.82, ART.limestone);
  b.box(0.98, 0.66, 0.77, -0.32, 0.13, -0.38, 0xdfe8e0);
  for (let q = 0; q < 6; q++) b.box(0.99, 0.014, 0.78, -0.32, 0.18 + q * 0.1, -0.38, 0xb5c9c0);
  artRoof(b, -0.32, 0.8, -0.38, 1.2, 1.02, 0.53, ART.slate, 0, 4);
  artDoor(b, -0.54, 0.13, 0.021, ART.slateDark, 0.23, 0.46); artWindow(b, -0.09, 0.48, 0.023, 0.2, 0, false);
  b.box(1.05, 0.055, 0.045, -0.32, 0.77, 0.03, ART.cream);
  b.cyl(0.026, 0.04, 1.94, 8, 0.68, 0.12, -0.62, ART.timber).sph(0.05, 0.68, 2.08, -0.62, ART.brass, null, 1);
  artCrate(b, 0.55, 0.13, 0.23, 0.29); artCrate(b, 0.55, 0.42, 0.23, 0.23); artCrate(b, 0.22, 0.13, 0.55, 0.25);
  artBarrel(b, -0.61, 0.13, 0.57, 0.75);
  for (let q = 0; q < 3; q++) artRing(b, 0.13 - q * 0.024, 0.013, -0.23, 0.145 + q * 0.01, 0.65, 0xd4bf86, [Math.PI / 2, 0, 0]);
  // Mooring ropes and a life ring give the landing a maritime silhouette.
  artBeam(b, -0.83, 0.3, 0.82, -0.83, 0.27, 0.1, 0.011, 0xe0ca99);
  artRing(b, 0.105, 0.032, -0.79, 0.52, 0.03, ART.cream); artRing(b, 0.105, 0.033, -0.79, 0.52, 0.032, C.red, [0, 0, 0], Math.PI / 4);
  b.box(0.08, 0.26, 0.08, 0.76, 0.13, 0.72, C.iron).box(0.23, 0.045, 0.06, 0.76, 0.33, 0.72, C.iron);
  return b.build();
}
function artLighthouse() {
  const b = new MB();
  b.cyl(0.83, 0.91, 0.2, 16, 0, 0, 0, ART.mortar).cyl(0.73, 0.82, 0.15, 16, 0, 0.2, 0, ART.limestone);
  for (let q = 0; q < 5; q++) {
    const y = 0.35 + q * 0.49, rb = 0.54 - q * 0.046, rt = rb - 0.046;
    b.cyl(rt, rb, 0.49, 16, 0, y, 0, q % 2 ? 0xf6edd6 : 0xbb604c);
    b.cyl(rb + 0.009, rb + 0.009, 0.022, 16, 0, y, 0, q % 2 ? ART.cream : 0xd17b61);
  }
  artDoor(b, 0, 0.35, 0.542, ART.slateDark, 0.26, 0.47);
  for (const p of [[-0.04, 1.15, 0.467], [0.03, 2.03, 0.385]]) { artWindow(b, p[0], p[1], p[2], 0.13, 0, false); }
  b.cyl(0.48, 0.39, 0.08, 16, 0, 2.8, 0, ART.limestone).cyl(0.51, 0.51, 0.045, 16, 0, 2.88, 0, ART.slateDark);
  for (let q = 0; q < 16; q++) { const a = q / 16 * TAU; b.cyl(0.012, 0.012, 0.22, 4, Math.cos(a) * 0.47, 2.92, Math.sin(a) * 0.47, ART.slateDark); }
  artRing(b, 0.47, 0.017, 0, 3.15, 0, ART.slateDark, [Math.PI / 2, 0, 0]);
  b.cyl(0.27, 0.27, 0.04, 12, 0, 2.96, 0, ART.brass);
  b.glow(0.38, 0.32, 0.38, 0, 3.17, 0);
  for (let q = 0; q < 8; q++) { const a = q / 8 * TAU; b.cyl(0.017, 0.017, 0.38, 4, Math.cos(a) * 0.25, 2.99, Math.sin(a) * 0.25, ART.slateDark); }
  b.cone(0.39, 0.34, 12, 0, 3.35, 0, ART.slate).cyl(0.4, 0.4, 0.025, 12, 0, 3.34, 0, ART.slateDark).sph(0.065, 0, 3.72, 0, ART.brass, null, 1);
  artBeam(b, 0, 3.74, 0, 0, 3.97, 0, 0.013, ART.brass); artBeam(b, -0.15, 3.89, 0, 0.15, 3.89, 0, 0.011, ART.brass);
  for (let q = 0; q < 3; q++) b.box(0.48 + q * 0.09, 0.07, 0.18, 0, 0.24 - q * 0.07, 0.64 + q * 0.12, ART.limestone);
  artPot(b, -0.63, 0.2, 0.21, C.white, 0.65);
  return b.build();
}
function artCathedral() {
  const b = new MB(), st = 0xe8ddc6, dark = 0xada38f, rf = ART.slate;
  b.box(2.73, 0.1, 2.7, 0, 0, 0, dark).box(2.57, 0.055, 2.56, 0, 0.1, 0, st);
  b.box(1.22, 1.43, 2.1, 0, 0.155, -0.18, st);
  artRoof(b, 0, 1.58, -0.18, 2.3, 1.48, 0.76, rf, Math.PI / 2, 6);
  b.box(2.2, 0.96, 0.72, 0, 0.155, -0.35, st); artRoof(b, 0, 1.11, -0.35, 2.4, 0.94, 0.46, rf, 0, 4);
  for (const side of [-1, 1]) {
    const x = side * 0.82;
    b.box(0.62, 2.13, 0.66, x, 0.15, 0.8, st);
    for (const y of [0.2, 0.87, 1.61, 2.23]) b.box(0.67, 0.06, 0.71, x, y, 0.8, dark);
    // Open belfry. The animation module may hang a moving bell in this opening.
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.085, 0.48, 0.085, x + sx * 0.265, 2.29, 0.8 + sz * 0.285, st);
    b.box(0.72, 0.08, 0.76, x, 2.77, 0.8, dark);
    b.cone(0.47, 0.77, 4, x, 2.85, 0.8, rf, [0, Math.PI / 4, 0]);
    b.sph(0.05, x, 3.64, 0.8, ART.brass, null, 1); artBeam(b, x, 3.68, 0.8, x, 3.91, 0.8, 0.012, ART.brass); artBeam(b, x - 0.075, 3.81, 0.8, x + 0.075, 3.81, 0.8, 0.012, ART.brass);
    for (const y of [0.7, 1.43, 2.03]) { artArch(b, x, y, 1.145, 0.18, 0.37, dark, ART.slateDark, 0.025); b.glow(0.115, 0.22, 0.025, x, y + 0.15, 1.165); b.box(0.018, 0.25, 0.035, x, y + 0.025, 1.184, ART.brass); }
    for (const zz of [-0.98, -0.33, 0.31]) {
      b.box(0.12, 1.02, 0.15, side * 0.71, 0.15, zz, dark).box(0.18, 0.12, 0.23, side * 0.77, 0.15, zz, st);
      artBeam(b, side * 0.96, 0.46, zz, side * 0.68, 1.26, zz, 0.055, st);
      const wb = new MB(); artArch(wb, 0, 0.65, 0, 0.2, 0.57, dark, ART.slateDark, 0.03); wb.glow(0.12, 0.34, 0.02, 0, 0.88, 0.027); wb.box(0.018, 0.4, 0.03, 0, 0.69, 0.046, ART.brass);
      const mm = wb.build(), off = b.col.length; b._add(mm.geo, side * 0.62, 0, zz + 0.22, 0xffffff, [0, side * Math.PI / 2, 0]); for (let i = 0; i < wb.col.length; i++) b.col[off + i] = wb.col[i]; if (mm.glow) b._add(mm.glow, side * 0.62, 0, zz + 0.22, 0, [0, side * Math.PI / 2, 0], true);
    }
  }
  // The nave's great rose window, with a stone rim and eight coloured petal lights.
  artArch(b, 0, 0.15, 0.9, 0.49, 0.82, dark, ART.timber, 0.09);
  b.box(0.024, 0.7, 0.115, 0, 0.15, 0.907, ART.brass);
  artRing(b, 0.305, 0.052, 0, 1.48, 0.906, dark);
  b._add(new THREE.CircleGeometry(0.278, 16), 0, 1.48, 0.91, ART.slateDark);
  for (let q = 0; q < 8; q++) {
    const a = q / 8 * TAU, x = Math.cos(a) * 0.175, y = 1.48 + Math.sin(a) * 0.175;
    b.sph(0.077, x, y, 0.928, [0xd5b969, 0x79b5c1, 0xcd8e93, 0xa9b982][q % 4], [0.65, 1, 0.2], 1);
    artBeam(b, 0, 1.48, 0.947, Math.cos(a) * 0.275, 1.48 + Math.sin(a) * 0.275, 0.947, 0.013, st);
  }
  b.glow(0.115, 0.115, 0.03, 0, 1.48, 0.95, [0, 0, Math.PI / 4]);
  b.cone(0.14, 0.82, 8, 0, 2.32, -0.35, rf).sph(0.045, 0, 3.17, -0.35, ART.brass, null, 1);
  for (let q = 0; q < 3; q++) b.box(0.82 + q * 0.12, 0.04, 0.18, 0, 0.12 - q * 0.04, 1.04 + q * 0.12, st);
  for (const side of [-1, 1]) artPot(b, side * 1.13, 0.15, 1.12, C.white, 0.7);
  return b.build();
}
function artGreatHive() {
  const b = new MB(), gold = 0xe7b446, amber = 0xba7c2e, cream = 0xffe9a0;
  b.cyl(1.33, 1.43, 0.12, 18, 0, 0, 0, ART.mortar).cyl(1.24, 1.32, 0.12, 18, 0, 0.12, 0, ART.limestone);
  const profile = [[1.0, 1.04, 0.33], [1.07, 1.0, 0.32], [1.0, 1.07, 0.31], [0.87, 1.0, 0.31], [0.71, 0.87, 0.3], [0.51, 0.71, 0.28], [0.28, 0.51, 0.26], [0.12, 0.28, 0.18]];
  let y = 0.24;
  profile.forEach((r, q) => {
    b.cyl(r[0], r[1], r[2], 24, 0, y, 0, q % 2 ? gold : 0xf0c15a);
    artRing(b, r[1] + 0.013, 0.03, 0, y + 0.015, 0, amber, [Math.PI / 2, 0, 0]);
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU + (q % 2) * 0.26, rr = (r[0] + r[1]) / 2 + 0.005; b.sph(0.025, Math.sin(a) * rr, y + r[2] * 0.55, Math.cos(a) * rr, cream, [1, 0.8, 1], 1); }
    y += r[2];
  });
  artArch(b, 0, 0.26, 1.055, 0.42, 0.68, amber, 0x5b3e2b, 0.1);
  b.box(0.022, 0.48, 0.12, 0, 0.27, 1.065, gold).sph(0.027, -0.07, 0.49, 1.13, cream, null, 1).sph(0.027, 0.07, 0.49, 1.13, cream, null, 1);
  // Six-sided honeycomb windows with real raised frames.
  for (const q of [0, 1, 2, 3]) {
    const a = q * Math.PI / 2, r = 1.015, xx = Math.sin(a) * r, zz = Math.cos(a) * r;
    const hg = new THREE.TorusGeometry(0.14, 0.026, 4, 6); b._add(hg, xx, 1.26, zz, amber, [0, a, 0]);
    b.glow(0.16, 0.2, 0.025, xx + Math.sin(a) * 0.005, 1.26, zz + Math.cos(a) * 0.005, [0, a, 0]);
    b._add(new THREE.TorusGeometry(0.09, 0.018, 4, 6), Math.sin(a) * 0.635, 2.03, Math.cos(a) * 0.635, cream, [0, a, 0]);
  }
  // Crown: a sculpted queen bee with curved wings, legs and an antennaed face.
  b.cyl(0.18, 0.24, 0.09, 12, 0, y, 0, amber);
  b.sph(0.2, 0, y + 0.23, 0, gold, [1.4, 0.9, 1], 1);
  for (const x of [-0.08, 0.08]) b.box(0.045, 0.33, 0.32, x, y + 0.065, 0, amber);
  b.sph(0.13, -0.28, y + 0.26, 0, amber, [0.85, 1, 1], 1);
  b.sph(0.19, 0.025, y + 0.43, 0.17, cream, [0.65, 0.25, 1.35], 1).sph(0.19, 0.025, y + 0.43, -0.17, cream, [0.65, 0.25, 1.35], 1);
  for (const z of [-0.065, 0.065]) { artBeam(b, -0.3, y + 0.35, z, -0.39, y + 0.49, z * 1.8, 0.012, amber); b.sph(0.028, -0.39, y + 0.49, z * 1.8, gold, null, 1); }
  for (const side of [-1, 1]) {
    b.box(0.19, 0.33, 0.19, side * 1.04, 0.22, 0.77, ART.limestone).glow(0.1, 0.13, 0.1, side * 1.04, 0.64, 0.77).cone(0.12, 0.12, 6, side * 1.04, 0.71, 0.77, amber);
    artPot(b, side * 0.73, 0.24, 1.07, side > 0 ? C.pink : C.white, 0.65);
  }
  for (let q = 0; q < 3; q++) b.box(0.62 + q * 0.14, 0.04, 0.13, 0, 0.2 - q * 0.055, 1.15 + q * 0.08, ART.limestone);
  return b.build();
}

// Most workshop silhouettes were already varied; they now receive actual shingle courses,
// joinery, trade-specific props and garden pots using one merged mesh each.
const artOriginals = Object.assign({}, MODEL_FN);
Object.assign(MODEL_FN, { center: artCenter, house: artHouse, forager: artForager, harbour: artHarbour, lighthouse: artLighthouse, cathedral: artCathedral, greathive: artGreatHive });
function artDress(type, fn) { const old = artOriginals[type]; if (old) MODEL_FN[type] = (v) => { const b = new MB(); fn(b, v || 0); return artMerge(old(v || 0), b.build()); }; }
artDress('lumber', (b) => {
  artRoof(b, -0.2, 0.64, -0.25, 1.32, 1.17, 0.51, 0x658371, 0, 4);
  for (let q = 0; q < 3; q++) b.box(0.045, 0.6, 0.05, -0.68 + q * 0.48, 0.02, 0.225, ART.timber);
  artCrate(b, -0.59, 0, 0.64, 0.25); artPot(b, -0.78, 0, -0.66, 0, 0.7);
  for (let q = 0; q < 4; q++) b.cyl(0.025, 0.025, 0.004, 8, 0.96, 0.1 + (q % 2) * 0.14, -0.43 + Math.floor(q / 2) * 0.19, ART.timber, [0, 0, Math.PI / 2]);
});
artDress('bakery', (b) => {
  artRoof(b, -0.1, 0.78, -0.2, 1.48, 1.32, 0.61, 0xc39557, 0, 5);
  for (let q = 0; q < 8; q++) b.box(0.426, 0.015, 0.426, 0.62, 0.16 + q * 0.16, -0.4, 0xe1bd91);
  artPot(b, -0.77, 0, 0.59, C.pink, 0.7);
  for (let q = 0; q < 3; q++) b.box(0.012, 0.015, 0.07, -0.12 + q * 0.05, 0.5, 0.43, ART.cream, [0, 0.5, 0]);
});
artDress('fisher', (b) => { artRoof(b, -0.2, 0.79, -0.3, 1.1, 1.04, 0.47, ART.slate, 0, 4); for (let q = 0; q < 5; q++) b.box(0.91, 0.013, 0.81, -0.2, 0.28 + q * 0.1, -0.3, 0xbbcfc7); artRing(b, 0.1, 0.025, 0.29, 0.56, 0.125, C.white); });
artDress('store', (b) => { artRoof(b, 0, 0.83, -0.2, 1.68, 1.4, 0.67, ART.slateDark, 0, 5); for (let q = 0; q < 9; q++) b.box(0.01, 0.76, 0.02, -0.7 + q * 0.175, 0.06, 0.397, ART.timber); artCrate(b, 0.66, 0.56, 0.67, 0.22); artBeam(b, -0.15, 0.13, 0.44, -0.15, 0.56, 0.44, 0.015, ART.cream); });
artDress('farm', (b) => { artRoof(b, -0.5, 0.8, -1.0, 1.76, 1.0, 0.51, 0x746d5b, 0, 4); for (let q = 0; q < 11; q++) b.box(0.012, 0.7, 0.02, -1.24 + q * 0.145, 0.04, -0.585, 0xa94e3d); b.box(1.65, 0.045, 0.05, -0.5, 0.73, -0.58, ART.cream); artBarrel(b, -1.17, 0, -0.34, 0.67); });
artDress('well', (b) => { artRoof(b, 0, 0.82, 0, 0.84, 0.62, 0.27, ART.terracotta, 0, 3); for (let q = 0; q < 10; q++) { const a = q / 10 * TAU; b.box(0.12, 0.06, 0.09, Math.cos(a) * 0.29, 0.2, Math.sin(a) * 0.29, q % 2 ? ART.limestone : ART.mortar, [0, -a, 0]); } artRing(b, 0.06, 0.008, 0.05, 0.56, 0, ART.timber); });
artDress('windmill', (b) => { for (let q = 0; q < 9; q++) b.cyl(0.58 - q * 0.016, 0.58 - q * 0.016, 0.014, 12, 0, 0.2 + q * 0.145, 0, 0xd6d0bd); artRing(b, 0.635, 0.017, 0, 0.81, 0, ART.timber, [Math.PI / 2, 0, 0]); artDoor(b, 0, 0.2, 0.58, ART.teal, 0.24, 0.42); artPot(b, -0.6, 0, 0.42, C.pink, 0.7); });
artDress('tavern', (b) => { artRoof(b, 0, 1.1, -0.15, 1.82, 1.58, 0.73, 0x99728b, 0, 5); artBarrel(b, -0.77, 0, 0.58, 0.75); artPot(b, 0.78, 0, 0.62, C.pink, 0.75); });
artDress('quarry', (b) => { for (let q = 0; q < 4; q++) for (let j = 0; j < 2; j++) b.box(0.21, 0.09, 0.02, -0.63 + q * 0.25, 0.07 + j * 0.39, 0.135, (q + j) % 2 ? ART.limestone : ART.mortar); artBarrel(b, -0.72, 0, 0.53, 0.65); });
artDress('apiary', (b) => { for (const p of [[-0.85, 0.5], [0.6, 0.72], [0.8, -0.6]]) artPot(b, p[0], 0, p[1], C.pink, 0.55); for (let q = 0; q < 7; q++) b.box(0.04, 0.23, 0.035, -0.85 + q * 0.28, 0, -0.91, ART.cream); b.box(1.7, 0.025, 0.03, 0, 0.16, -0.91, ART.cream); });
artDress('market', (b) => { artCrate(b, -0.7, 0, 0.62, 0.26); artBarrel(b, 0.73, 0, 0.7, 0.8); artPot(b, 0.6, 0, -0.7, C.white, 0.65); });
artDress('shipyard', (b) => { artCrate(b, -0.75, 0.1, 0.73, 0.25); for (let q = 0; q < 3; q++) artRing(b, 0.13 - q * 0.025, 0.012, 0.39, 0.17, 0.82, 0xd5bd88, [Math.PI / 2, 0, 0]); artBeam(b, -0.65, 0.3, -0.62, -0.65, 1.3, 0.55, 0.025, ART.timberLight); });
artDress('flowers', (b, v) => { for (let q = 0; q < 7; q++) { const a = q * 2.4, x = Math.sin(a) * 0.27, z = Math.cos(a) * 0.27, col = [C.pink, C.white, 0xb7a0d0, C.gold][(q + v) % 4]; for (let p = 0; p < 5; p++) b.sph(0.035, x + Math.sin(p * TAU / 5) * 0.035, 0.29 + (q % 2) * 0.07, z + Math.cos(p * TAU / 5) * 0.035, col, [1, 0.45, 1]); b.sph(0.02, x, 0.3 + (q % 2) * 0.07, z, C.gold); } });
artDress('school', (b) => { artRoof(b, 0, 0.78, -0.2, 1.52, 1.26, 0.61, ART.terracotta, 0, 5); artWindow(b, -0.42, 0.5, 0.325, 0.22, ART.teal, true); artWindow(b, 0.42, 0.5, 0.325, 0.22, ART.teal, true); artPot(b, 0.7, 0, 0.54, C.gold, 0.7); });
artDress('weaver', (b) => { artRoof(b, -0.2, 0.76, -0.3, 1.42, 1.26, 0.59, ART.teal, 0, 5); artWindow(b, 0.05, 0.5, 0.23, 0.23, 0, true); for (let q = 0; q < 3; q++) b.cyl(0.045, 0.045, 0.13, 7, 0.5 + q * 0.12, 0.2, 0.55, [C.roofB, C.pink, C.gold][q]); });
artDress('ciderpress', (b) => { artRoof(b, -0.25, 0.7, -0.3, 1.22, 1.16, 0.53, 0x93805c, 0, 5); artPot(b, -0.73, 0, 0.49, 0, 0.7); artCrate(b, -0.25, 0.17, 0.7, 0.22); });
artDress('townhouse', (b, v) => { artRoof(b, 0, 1.42, 0, 1.62, 1.48, 0.77, [0xbd6249, 0x628998, 0x718e64, 0xc59b4e, 0x8b789c][v % 5], 0, 6); for (const x of [-0.34, 0.34]) artWindow(b, x, 1.08, 0.616, 0.19, 0, true); artPot(b, -0.69, 0.1, 0.64, C.pink, 0.68); });
artDress('townhall', (b) => { artRoof(b, 0, 1.06, -0.25, 1.7, 1.34, 0.61, ART.slate, 0, 5); artRing(b, 0.18, 0.023, 0, 1.765, 0.045, ART.brass); for (let q = 0; q < 12; q++) { const a = q * TAU / 12; b.sph(0.012, Math.sin(a) * 0.135, 1.765 + Math.cos(a) * 0.135, 0.061, ART.timber); } for (const x of [-0.5, 0.5]) artWindow(b, x, 0.6, 0.325, 0.2, 0, true); });
artDress('pastry', (b) => { artRoof(b, 0, 0.88, 0, 1.58, 1.44, 0.63, 0x9b819f, 0, 5); artPot(b, -0.7, 0.1, 0.65, C.white, 0.65); b.box(0.023, 0.31, 0.045, 0.25, 0.37, 0.586, ART.cream); });
artDress('tailor', (b) => { artRoof(b, 0, 1.35, 0, 1.58, 1.42, 0.59, ART.slate, 0, 5); for (const x of [-0.32, 0.32]) artWindow(b, x, 1.12, 0.586, 0.19, 0, true); artPot(b, 0.73, 0.1, 0.64, C.pink, 0.66); });
artDress('coop', (b) => { artRoof(b, -0.15, 0.86, -0.3, 1.02, 1.22, 0.45, ART.terracotta, Math.PI / 2, 4); for (let q = 0; q < 6; q++) b.box(0.24, 0.018, 0.045, -0.15, 0.06 + q * 0.05, 0.56 - q * 0.07, ART.timberLight); artPot(b, -0.7, 0, 0.62, C.gold, 0.6); });
artDress('greenhouse', (b) => { for (const x of [-0.71, -0.36, 0, 0.36, 0.71]) { artBeam(b, x, 0.65, 0.365, x, 1.09, -0.15, 0.016, ART.cream); artBeam(b, x, 0.65, -0.665, x, 1.09, -0.15, 0.016, ART.cream); } artPot(b, -0.77, 0, 0.44, C.pink, 0.65); artPot(b, 0.77, 0, 0.44, C.white, 0.65); });
artDress('academy', (b) => { artRing(b, 0.43, 0.025, 0, 1.16, -0.3, ART.brass, [Math.PI / 2, 0, 0]); for (const x of [-0.55, -0.18, 0.18, 0.55]) { b.cyl(0.09, 0.09, 0.055, 8, x, 0.83, 0.46, ART.limestone).cyl(0.085, 0.085, 0.05, 8, x, 0.15, 0.46, ART.limestone); } artPot(b, -0.76, 0.14, -0.64, 0, 0.7); artPot(b, 0.76, 0.14, -0.64, 0, 0.7); });
artDress('belltower', (b) => { for (let q = 0; q < 7; q++) b.box(0.57 - q * 0.012, 0.013, 0.57 - q * 0.012, 0, 0.3 + q * 0.19, 0, 0xd6d0bd); for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.04, 0.5, 0.04, sx * 0.245, 1.68, sz * 0.245, ART.limestone); });
artDress('bandstand', (b) => { artRing(b, 0.78, 0.024, 0, 0.98, 0, ART.cream, [Math.PI / 2, 0, 0]); for (let q = 0; q < 8; q++) { const a = q / 8 * TAU + 0.39; artBeam(b, Math.cos(a) * 0.72, 0.75, Math.sin(a) * 0.72, Math.cos(a + 0.3) * 0.7, 0.98, Math.sin(a + 0.3) * 0.7, 0.015, ART.cream); } });
artDress('gazebo', (b) => { artRing(b, 0.43, 0.022, 0, 0.78, 0, ART.cream, [Math.PI / 2, 0, 0]); for (let q = 0; q < 6; q++) { const a = q / 6 * TAU; artPot(b, Math.cos(a) * 0.45, 0.1, Math.sin(a) * 0.45, C.pink, 0.4); } });
function artLantern() {
  const b = new MB();
  b.cyl(0.1, 0.13, 0.055, 10, 0, 0, 0, ART.mortar).cyl(0.055, 0.075, 0.09, 8, 0, 0.055, 0, ART.slateDark).cyl(0.023, 0.032, 0.65, 8, 0, 0.14, 0, ART.slateDark);
  artBeam(b, 0, 0.78, 0, 0.17, 0.82, 0, 0.022, ART.slateDark); artBeam(b, 0, 0.62, 0, 0.15, 0.79, 0, 0.012, ART.slateDark);
  artRing(b, 0.047, 0.012, 0.17, 0.79, 0, ART.slateDark);
  b.cyl(0.085, 0.065, 0.035, 6, 0.17, 0.745, 0, ART.slateDark).cone(0.115, 0.09, 6, 0.17, 0.78, 0, ART.slateDark).cyl(0.068, 0.085, 0.035, 6, 0.17, 0.565, 0, ART.slateDark);
  b.glow(0.105, 0.145, 0.105, 0.17, 0.67, 0);
  for (let q = 0; q < 6; q++) { const a = q / 6 * TAU; artBeam(b, 0.17 + Math.cos(a) * 0.075, 0.6, Math.sin(a) * 0.075, 0.17 + Math.cos(a) * 0.075, 0.745, Math.sin(a) * 0.075, 0.007, ART.slateDark); }
  b.sph(0.028, 0.17, 0.89, 0, ART.brass, null, 1).sph(0.021, 0.17, 0.55, 0, ART.brass, null, 1);
  return b.build();
}
function artBench() {
  const b = new MB();
  for (const x of [-0.3, 0.3]) {
    artBeam(b, x, 0.02, 0.12, x, 0.24, 0.07, 0.024, ART.slateDark); artBeam(b, x, 0.02, -0.13, x, 0.45, -0.2, 0.024, ART.slateDark);
    artBeam(b, x, 0.22, -0.16, x, 0.22, 0.15, 0.023, ART.slateDark);
    artBeam(b, x, 0.23, 0.1, x, 0.34, 0.1, 0.015, ART.slateDark); artBeam(b, x, 0.35, 0.11, x, 0.39, -0.18, 0.018, ART.slateDark);
  }
  for (let q = 0; q < 4; q++) b.box(0.77, 0.035, 0.067, 0, 0.23, -0.12 + q * 0.075, q % 2 ? ART.timberLight : 0xbc9361);
  for (let q = 0; q < 3; q++) b.box(0.77, 0.05, 0.03, 0, 0.32 + q * 0.065, -0.19 - q * 0.009, q % 2 ? ART.timberLight : 0xbc9361, [-0.12, 0, 0]);
  return b.build();
}
Object.assign(MODEL_FN, { lantern: artLantern, bench: artBench });
artDress('fountain', (b) => { artRing(b, 0.76, 0.055, 0, 0.24, 0, ART.limestone, [Math.PI / 2, 0, 0]); artRing(b, 0.335, 0.026, 0, 0.93, 0, ART.limestone, [Math.PI / 2, 0, 0]); for (let q = 0; q < 12; q++) { const a = q * TAU / 12; b.box(0.1, 0.085, 0.05, Math.sin(a) * 0.81, 0.1, Math.cos(a) * 0.81, q % 2 ? ART.mortar : ART.limestone, [0, a, 0]); } });
artDress('garden', (b) => { for (const p of [[-0.76, 0.68], [0.74, -0.69]]) artPot(b, p[0], 0, p[1], C.pink, 0.55); });
