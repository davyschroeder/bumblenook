// ---------- core: constants, maths, low-poly model builder ----------
const N = 56;               // island grid is N x N tiles, one tile = one world unit
const HALF = N / 2;
const TAU = Math.PI * 2;
THREE.ColorManagement.legacyMode = false;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const tileIdx = (i, j) => j * N + i;
const inGrid = (i, j) => i >= 0 && j >= 0 && i < N && j < N;
const tileX = (i) => i + 0.5 - HALF;
const worldToTile = (x) => Math.floor(x + HALF);

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x, y, seed) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(hash2(xi, yi, seed), hash2(xi + 1, yi, seed), u),
              lerp(hash2(xi, yi + 1, seed), hash2(xi + 1, yi + 1, seed), u), v);
}
function fbm(x, y, seed, oct) {
  let s = 0, a = 0.5, f = 1, n = 0;
  for (let o = 0; o < (oct || 4); o++) { s += a * vnoise(x * f, y * f, seed + o * 17); n += a; a *= 0.5; f *= 2; }
  return s / n;
}

const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
const _e = new THREE.Euler(), _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
const _c = new THREE.Color(), _c2 = new THREE.Color();
const ZERO_M = new THREE.Matrix4().makeScale(0, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0), AXIS_Z = new THREE.Vector3(0, 0, 1), AXIS_X = new THREE.Vector3(1, 0, 0);

// Merges coloured primitives into one flat-shaded geometry (plus an optional "glow" geometry for windows).
// a box with its edges cut off: catches the light on its corners instead of looking like a crate
function bevelBox(w, h, d, bv) {
  const a = w / 2, b = h / 2, c = d / 2, out = [];
  const P = (ax, sx, sy, sz) => [sx * (ax === 0 ? a : a - bv), sy * (ax === 1 ? b : b - bv), sz * (ax === 2 ? c : c - bv)];
  const tri = (p, q, r) => {
    const ux = q[0] - p[0], uy = q[1] - p[1], uz = q[2] - p[2], vx = r[0] - p[0], vy = r[1] - p[1], vz = r[2] - p[2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    if (nx * (p[0] + q[0] + r[0]) + ny * (p[1] + q[1] + r[1]) + nz * (p[2] + q[2] + r[2]) < 0) out.push(...p, ...r, ...q); else out.push(...p, ...q, ...r);
  };
  const quad = (p, q, r, s) => { tri(p, q, r); tri(p, r, s); };
  for (const s of [-1, 1]) {
    quad(P(0, s, -1, -1), P(0, s, 1, -1), P(0, s, 1, 1), P(0, s, -1, 1));
    quad(P(1, -1, s, -1), P(1, 1, s, -1), P(1, 1, s, 1), P(1, -1, s, 1));
    quad(P(2, -1, -1, s), P(2, 1, -1, s), P(2, 1, 1, s), P(2, -1, 1, s));
    for (const t of [-1, 1]) {
      quad(P(1, -1, s, t), P(1, 1, s, t), P(2, 1, s, t), P(2, -1, s, t));       // edges along x
      quad(P(0, s, -1, t), P(0, s, 1, t), P(2, s, 1, t), P(2, s, -1, t));       // edges along y
      quad(P(0, s, t, -1), P(0, s, t, 1), P(1, s, t, 1), P(1, s, t, -1));       // edges along z
      for (const r of [-1, 1]) tri(P(0, s, t, r), P(1, s, t, r), P(2, s, t, r));
    }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); return g;
}
class MB {
  constructor() { this.pos = []; this.col = []; this.gpos = []; }
  _add(geo, x, y, z, color, rot, glow, scl) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    _e.set(rot ? rot[0] || 0 : 0, rot ? rot[1] || 0 : 0, rot ? rot[2] || 0 : 0);
    _q.setFromEuler(_e);
    if (scl) _s.set(scl[0], scl[1], scl[2]); else _s.set(1, 1, 1);
    _m4.compose(_v.set(x, y, z), _q, _s);
    g.applyMatrix4(_m4);
    const p = g.attributes.position.array;
    if (glow) { for (let i = 0; i < p.length; i++) this.gpos.push(p[i]); }
    else {
      _c.set(color);
      // painted look: every part is a little lighter at the top than at the bottom
      let lo = 1e9, hi = -1e9;
      for (let i = 1; i < p.length; i += 3) { if (p[i] < lo) lo = p[i]; if (p[i] > hi) hi = p[i]; }
      const span = hi - lo, grad = span > 0.16 ? Math.min(0.2, 0.08 + span * 0.1) : 0;
      for (let i = 0; i < p.length; i += 3) {
        const k = grad ? 1 - grad * 0.55 + grad * (p[i + 1] - lo) / span : 1;
        this.pos.push(p[i], p[i + 1], p[i + 2]); this.col.push(_c.r * k, _c.g * k, _c.b * k);
      }
    }
    g.dispose(); if (g !== geo) geo.dispose();
    return this;
  }
  // y is always the BOTTOM of the primitive (except sph: centre)
  box(w, h, d, x, y, z, color, rot) { const m = Math.min(w, h, d); return this._add(m >= 0.15 ? bevelBox(w, h, d, Math.min(0.03, m * 0.12)) : new THREE.BoxGeometry(w, h, d), x, y + h / 2, z, color, rot); }
  cyl(rt, rb, h, seg, x, y, z, color, rot) { return this._add(new THREE.CylinderGeometry(rt, rb, h, seg), x, y + h / 2, z, color, rot); }
  cone(r, h, seg, x, y, z, color, rot) { return this._add(new THREE.ConeGeometry(r, h, seg), x, y + h / 2, z, color, rot); }
  sph(r, x, y, z, color, scl, detail) { return this._add(new THREE.IcosahedronGeometry(r, detail || 0), x, y, z, color, null, false, scl); }
  // gable roof: ridge runs along X, base rectangle w x d at height y
  gable(w, h, d, x, y, z, color, ry) {
    const a = w / 2, b = d / 2;
    const P = [[-a, 0, -b], [a, 0, -b], [a, 0, b], [-a, 0, b], [-a, h, 0], [a, h, 0]];
    const F = [[3, 2, 5], [3, 5, 4], [1, 0, 4], [1, 4, 5], [0, 3, 4], [2, 1, 5], [0, 1, 2], [0, 2, 3]];
    const arr = [];
    for (const f of F) for (const k of f) arr.push(P[k][0], P[k][1], P[k][2]);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    return this._add(g, x, y, z, color, [0, ry || 0, 0]);
  }
  glow(w, h, d, x, y, z, rot) { return this._add(new THREE.BoxGeometry(w, h, d), x, y, z, 0, rot, true); }
  build() {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    geo.computeVertexNormals();
    let glow = null;
    if (this.gpos.length) {
      glow = new THREE.BufferGeometry();
      glow.setAttribute('position', new THREE.Float32BufferAttribute(this.gpos, 3));
    }
    return { geo, glow };
  }
}

const C = {
  wood: 0x986b4c, woodD: 0x594431, woodL: 0xcfa578, plank: 0xb58358, plaster: 0xffedcc, plasterD: 0xe7cba2,
  stone: 0x9ca59d, stoneD: 0x667a74, stoneL: 0xcdd2bc, roofR: 0xbf593e, roofB: 0x397c8a, roofG: 0x4f866b,
  roofY: 0xdfa637, roofP: 0x8d5c9e, thatch: 0xdcb95a, white: 0xf8f4ea, red: 0xd2483a, leaf: 0x6fae4a,
  leafD: 0x4e8f3f, gold: 0xf5b63c, dark: 0x3a2a1f, blue: 0x4a90c2, soil: 0x7c5637, wheat: 0xe6c450,
  honey: 0xf0a422, pink: 0xe98ba2, bread: 0xcc8d47, iron: 0x55565c, skin: [0xf2c7a0, 0xe0a878, 0xb97a4e, 0x8a5a38],
  hair: [0x3a2a1f, 0x6b4529, 0xc98f3d, 0xd9d2c4, 0xa5482e],
};

const MAT = {
  main: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0.015 }),
  build: null,
  glow: new THREE.MeshBasicMaterial({ color: 0x2d3d50 }),
  ghostOk: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.82, depthWrite: false }),
  ghostBad: new THREE.MeshBasicMaterial({ color: 0xff3b2e, transparent: true, opacity: 0.72, depthWrite: false }),
};
