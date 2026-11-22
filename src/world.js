// ---------- world: terrain, water, nature, sky, particles ----------
const T_WATER = 0, T_SAND = 1, T_GRASS = 2, T_ROCK = 3;
const NAT_NONE = 0, NAT_TREE = 1, NAT_ROCK = 2, NAT_BUSH = 3;
const MAXT = 1100, MAXR = 260, MAXB = 240, MAXTUFT = 1800, MAXFLOWER = 700;

const W = {};            // world data for the current island
let scene, camera, renderer, worldGroup, sun, hemi;
const SWAY = { uTime: { value: 0 } };
const trees = [], rocks = [], bushes = [];

function genHeight(i, j, seed) {
  const x = (i - HALF) / HALF, z = (j - HALF) / HALF;
  let d = Math.hypot(x, z);
  d += (fbm(i * 0.07 + 10, j * 0.07 + 10, seed, 3) - 0.5) * 0.36;
  const m = 1 - smooth(0.52, 0.92, d);
  const e = m * 1.25 - 0.28;
  if (e <= 0) return e * 2.2;
  let y = Math.pow(e, 0.8) * 0.5 + (fbm(i * 0.16, j * 0.16, seed + 5, 3) - 0.5) * 0.14 * m;
  const hill = Math.max(0, fbm(i * 0.085 + 40, j * 0.085 + 7, seed + 9, 3) - 0.6);
  y += hill * hill * 42 * m;
  return Math.max(y, 0.02);
}
const vh = (i, j) => W.h[j * (N + 1) + i];
function heightAt(x, z) {
  const fx = clamp(x + HALF, 0, N - 0.001), fz = clamp(z + HALF, 0, N - 0.001);
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
  return lerp(lerp(vh(i, j), vh(i + 1, j), u), lerp(vh(i, j + 1), vh(i + 1, j + 1), u), v);
}
function computeTile(i, j, classify) {
  const a = vh(i, j), b = vh(i + 1, j), c = vh(i, j + 1), d = vh(i + 1, j + 1), k = tileIdx(i, j);
  const avg = (a + b + c + d) / 4;
  W.tileH[k] = avg;
  W.slope[k] = Math.max(a, b, c, d) - Math.min(a, b, c, d);
  if (classify) W.type[k] = avg < 0.035 ? T_WATER : avg < 0.13 ? T_SAND : avg > 1.05 ? T_ROCK : T_GRASS;
}

const COL = {};
function initColors() {
  const mk = (h) => new THREE.Color(h);
  Object.assign(COL, {
    sandA: mk(0xf1dfa9), sandB: mk(0xe7d197), wetA: mk(0xcfc08c), deep: mk(0x5f958f),
    grassA: mk(0xa3d15e), grassB: mk(0x86c250), grassC: mk(0x74b24a), grassH: mk(0x93ab5c),
    rockA: mk(0xaaa79c), rockB: mk(0x908e87), rockT: mk(0xcfcbc0),
    pathA: mk(0xdcc79c), pathB: mk(0xcdb588), dirt: mk(0xb99d6c), field: mk(0x8a6240),
    autumn: mk(0xc9a84a), snow: mk(0xf2f6fa), summer: mk(0xb8cf5a),
  });
}
function tileColor(k, i, j, tri, out) {
  const t = W.type[k], n = hash2(i, j, W.seed + tri * 31), hgt = W.tileH[k];
  if (W.paint[k] === 1) out.copy(COL.pathA).lerp(COL.pathB, n);
  else if (W.paint[k] === 2) out.copy(COL.dirt).lerp(COL.pathB, n * 0.4);
  else if (W.paint[k] === 3) out.copy(COL.field).lerp(COL.dirt, n * 0.25);
  else if (t === T_WATER) out.copy(COL.wetA).lerp(COL.deep, clamp(-hgt / 0.9, 0, 1));
  else if (t === T_SAND) out.copy(COL.sandA).lerp(COL.sandB, n);
  else if (t === T_ROCK) { out.copy(COL.rockA).lerp(COL.rockB, n); if (hgt > 1.9) out.lerp(COL.rockT, 0.6); }
  else {
    const patch = fbm(i * 0.13 + 3, j * 0.13 + 8, W.seed + 77, 2);
    out.copy(COL.grassA).lerp(COL.grassB, n).lerp(COL.grassC, smooth(0.45, 0.7, patch) * 0.8);
    if (hgt > 0.62) out.lerp(COL.grassH, smooth(0.62, 1.05, hgt));
    if (W.season === 1) out.lerp(COL.summer, 0.16); else if (W.season === 2) out.lerp(COL.autumn, 0.3);
  }
  if (W.season === 3 && t !== T_WATER) out.lerp(COL.snow, W.paint[k] ? 0.3 : t === T_SAND ? 0.3 : t === T_ROCK ? 0.55 : 0.8 - n * 0.1);
}
// writes the two triangles of a tile into the terrain buffers
function refreshTile(i, j) {
  const k = tileIdx(i, j), o = k * 18;
  const P = W.tPos, Cc = W.tCol, Nn = W.tNor;
  const x0 = i - HALF, z0 = j - HALF, x1 = x0 + 1, z1 = z0 + 1;
  const a = vh(i, j), b = vh(i + 1, j), c = vh(i, j + 1), d = vh(i + 1, j + 1);
  let v;
  if ((i + j) & 1) v = [x0, a, z0, x0, c, z1, x1, d, z1, x0, a, z0, x1, d, z1, x1, b, z0];
  else v = [x0, a, z0, x0, c, z1, x1, b, z0, x1, b, z0, x0, c, z1, x1, d, z1];
  for (let q = 0; q < 18; q++) P[o + q] = v[q];
  for (let t = 0; t < 2; t++) {
    const p = o + t * 9;
    const ux = P[p + 3] - P[p], uy = P[p + 4] - P[p + 1], uz = P[p + 5] - P[p + 2];
    const wx = P[p + 6] - P[p], wy = P[p + 7] - P[p + 1], wz = P[p + 8] - P[p + 2];
    let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    tileColor(k, i, j, t, _c);
    for (let q = 0; q < 3; q++) {
      Nn[p + q * 3] = nx; Nn[p + q * 3 + 1] = ny; Nn[p + q * 3 + 2] = nz;
      Cc[p + q * 3] = _c.r; Cc[p + q * 3 + 1] = _c.g; Cc[p + q * 3 + 2] = _c.b;
    }
  }
  W.tDirty = true;
}
function paintTile(k, v) { W.paint[k] = v; refreshTile(k % N, (k / N) | 0); }
function flattenArea(i0, j0, size, y) {
  for (let j = j0; j <= j0 + size; j++) for (let i = i0; i <= i0 + size; i++) W.h[j * (N + 1) + i] = y;
  for (let j = j0 - 1; j <= j0 + size; j++) for (let i = i0 - 1; i <= i0 + size; i++) {
    if (!inGrid(i, j)) continue;
    computeTile(i, j, false); refreshTile(i, j); natRefreshY(tileIdx(i, j));
  }
  W.hmapDirty = true;
}
function footprintHeight(i0, j0, size) {
  let s = 0, n = 0;
  for (let j = j0; j <= j0 + size; j++) for (let i = i0; i <= i0 + size; i++) { s += vh(i, j); n++; }
  return Math.max(s / n, 0.09);
}

function buildTerrain() {
  W.tPos = new Float32Array(N * N * 18); W.tCol = new Float32Array(N * N * 18); W.tNor = new Float32Array(N * N * 18);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) refreshTile(i, j);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(W.tPos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(W.tCol, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(W.tNor, 3));
  W.terrain = new THREE.Mesh(g, terrainMaterial());
  W.terrain.receiveShadow = true;
  worldGroup.add(W.terrain);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshBasicMaterial({ color: 0x2f7f93 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.9;
  worldGroup.add(floor);
}

function buildWater() {
  W.hmapData = new Uint8Array((N + 1) * (N + 1) * 4);
  W.hmap = new THREE.DataTexture(W.hmapData, N + 1, N + 1, THREE.RGBAFormat);
  W.hmap.magFilter = W.hmap.minFilter = THREE.LinearFilter;
  updateHmap();
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      hmap: { value: W.hmap }, time: SWAY.uTime, lin: { value: 0 }, sunK: { value: 1 }, tint: { value: new THREE.Color(1, 1, 1) },
      shallow: { value: new THREE.Color(0x7fdcd6) }, deep: { value: new THREE.Color(0x2f8fb5) },
      fogC: { value: new THREE.Color(0xffffff) }, fogN: { value: 60 }, fogF: { value: 160 },
    },
    vertexShader: `varying vec3 wp; varying float vd;
      void main(){ vec4 w = modelMatrix*vec4(position,1.); wp = w.xyz; vec4 mv = viewMatrix*w; vd = -mv.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform sampler2D hmap; uniform float time, lin, sunK; uniform vec3 tint, shallow, deep, fogC; uniform float fogN, fogF;
      varying vec3 wp; varying float vd;
      void main(){
        vec2 uv = (wp.xz + ${HALF.toFixed(1)}) / ${N.toFixed(1)};
        vec2 tuv = (uv*${N.toFixed(1)} + .5) / ${(N + 1).toFixed(1)};
        float h = texture2D(hmap, clamp(tuv, 0., 1.)).r*4. - 2.;
        float inside = step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.);
        float depth = mix(1.6, -h, inside);
        float w = sin(wp.x*1.3 + time*.9)*sin(wp.z*1.1 - time*.7);
        vec3 col = mix(shallow, deep, smoothstep(0., .95, depth));
        float sp = sin(wp.x*3.1 + time*1.3 + sin(wp.z*2.3 + time))*sin(wp.z*2.7 - time*1.1);
        col += smoothstep(.9, 1., sp)*.1;
        float sw = sin(wp.x*.55 + wp.z*.32 + time*.45) + sin(wp.x*.21 - wp.z*.63 - time*.33);
        col *= 1. + .05*sw*smoothstep(.2, 1., depth);
        float gl = sin(wp.x*7.3 + time*2.1 + sin(wp.z*5.1 - time*1.3)*1.7)*sin(wp.z*6.7 - time*1.7 + sin(wp.x*4.3 + time)*1.4);
        col += vec3(1., .95, .8)*smoothstep(.93, 1., gl)*(.35 + .35*sw*.5)*sunK*smoothstep(.15, .7, depth);
        float band = sin(depth*24. - time*1.5 + w*1.6);
        float foam = smoothstep(.5, .9, band)*smoothstep(.4, .08, depth);
        foam = max(foam, smoothstep(.075, .02, depth));
        col = mix(col, vec3(1.), foam*.8);
        float alpha = max(mix(.6, .96, smoothstep(0., .7, depth)), foam);
        col *= tint;
        col = mix(col, fogC, smoothstep(fogN, fogF, vd));
        gl_FragColor = vec4(mix(pow(col, vec3(1./2.2)), col, lin), alpha);
      }`,
  });
  W.water = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), mat);
  W.water.rotation.x = -Math.PI / 2;
  W.water.renderOrder = 1;
  worldGroup.add(W.water);
}
function updateHmap() {
  for (let q = 0; q < (N + 1) * (N + 1); q++) {
    W.hmapData[q * 4] = clamp(Math.round((W.h[q] + 2) / 4 * 255), 0, 255); W.hmapData[q * 4 + 3] = 255;
  }
  W.hmap.needsUpdate = true; W.hmapDirty = false;
}

// ----- nature -----
const TREE_TINT = [[0x6fb04a, 0x5fa243, 0x84c057, 0x9fc94f, 0x79b94f, 0xe2a23c], [0x3f8a55, 0x357a4c, 0x4a9660]];
function buildNatureMeshes() {
  const mkMat = (sway) => {
    const m = new THREE.MeshLambertMaterial({ color: 0xffffff });
    if (sway) m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = SWAY.uTime;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float ph = instanceMatrix[3][0]*.9 + instanceMatrix[3][2]*.7;
          transformed.x += sin(uTime*1.6 + ph)*.05*position.y;
          transformed.z += cos(uTime*1.3 + ph*1.3)*.035*position.y;
        #endif`);
    };
    return m;
  };
  const flat = (g) => { const n = g.index ? g.toNonIndexed() : g; n.computeVertexNormals(); return n; };
  let b = new MB(); b.cyl(0.06, 0.1, 0.55, 5, 0, 0, 0, 0xffffff);
  const trunkG = b.build().geo;
  b = new MB(); b.sph(0.46, 0, 0.86, 0, 0xffffff, [1, 0.92, 1]); b.sph(0.32, 0.12, 1.26, 0.05, 0xffffff); b.sph(0.26, -0.26, 0.98, 0.12, 0xffffff);
  const roundG = b.build().geo;
  b = new MB(); b.cone(0.48, 0.6, 6, 0, 0.36, 0, 0xffffff); b.cone(0.38, 0.55, 6, 0, 0.72, 0, 0xffffff); b.cone(0.26, 0.5, 6, 0, 1.08, 0, 0xffffff);
  const pineG = b.build().geo;
  const mk = (g, mat, max, shadow) => {
    const m = new THREE.InstancedMesh(g, mat, max);
    m.castShadow = shadow; m.receiveShadow = true; m.frustumCulled = false; m.count = max;
    for (let q = 0; q < max; q++) { m.setMatrixAt(q, ZERO_M); m.setColorAt(q, _c.set(0xffffff)); }
    worldGroup.add(m); return m;
  };
  W.mTrunk = mk(trunkG, new THREE.MeshLambertMaterial({ color: 0x8a5d3b }), MAXT, true);
  W.mRound = mk(roundG, mkMat(true), MAXT, true);
  W.mPine = mk(pineG, mkMat(true), MAXT, true);
  W.mRock = mk(flat(new THREE.DodecahedronGeometry(0.42, 0)), new THREE.MeshLambertMaterial({ color: 0xffffff }), MAXR, true);
  b = new MB(); b.sph(0.3, 0, 0.2, 0, 0xffffff, [1, 0.75, 1]); b.sph(0.2, 0.2, 0.18, 0.1, 0xffffff, [1, 0.8, 1]);
  W.mBush = mk(b.build().geo, mkMat(false), MAXB, true);
  b = new MB();
  for (const p of [[0.1, 0.36, 0.2], [-0.2, 0.3, 0.12], [0.24, 0.26, -0.08], [-0.05, 0.4, -0.12], [0.28, 0.3, 0.2], [-0.24, 0.22, -0.14], [0.02, 0.3, 0.28]])
    b.sph(0.055, p[0], p[1], p[2], 0xffffff);
  W.mBerry = mk(b.build().geo, new THREE.MeshLambertMaterial({ color: 0xd9304a }), MAXB, false);
  b = new MB(); b.cone(0.035, 0.2, 3, 0, 0, 0, 0xffffff, [0, 0, 0.25]); b.cone(0.035, 0.26, 3, 0.05, 0, 0.03, 0xffffff); b.cone(0.03, 0.18, 3, -0.04, 0, 0.05, 0xffffff, [0.3, 0, -0.2]);
  W.mTuft = mk(b.build().geo, mkMat(true), MAXTUFT, false);
  b = new MB(); b.cyl(0.012, 0.012, 0.14, 3, 0, 0, 0, 0x5c9a45); b.sph(0.05, 0, 0.16, 0, 0xffffff, [1, 0.6, 1]);
  W.mFlower = mk(b.build().geo, new THREE.MeshLambertMaterial({ vertexColors: true }), MAXFLOWER, false);
  W.tuftAt = new Int16Array(N * N); W.flowerAt = new Int16Array(N * N);
  W.nTuft = 0; W.nFlower = 0;
}
function setTreeMatrix(t) {
  const mF = t.kind ? W.mPine : W.mRound;
  if (t.state === 2) { W.mTrunk.setMatrixAt(t.idx, ZERO_M); mF.setMatrixAt(t.idx, ZERO_M); }
  else {
    let s = t.sc * (0.28 + 0.72 * t.size);
    if (t.state === 1 && t.fall > 0.75) s *= 1 - (t.fall - 0.75) / 0.25;
    _q.setFromAxisAngle(AXIS_Y, t.rot);
    if (t.state === 1) { _q2.setFromAxisAngle(AXIS_Z, Math.min(t.fall / 0.6, 1) ** 2 * 1.5); _q.multiply(_q2); }
    const sh = t.shake > 0 ? Math.sin(t.shake * 40) * 0.035 * t.shake : 0;
    _m4.compose(_v.set(t.x + sh, t.y, t.z), _q, _s.set(s, s, s));
    W.mTrunk.setMatrixAt(t.idx, _m4); mF.setMatrixAt(t.idx, _m4);
  }
  W.mTrunk.instanceMatrix.needsUpdate = true; mF.instanceMatrix.needsUpdate = true;
}
function addTree(i, j, kind, size, r) {
  const k = tileIdx(i, j);
  let idx = trees.findIndex((t) => t.state === 2);
  if (idx < 0) { if (trees.length >= MAXT) return null; idx = trees.length; trees.push(null); }
  const x = tileX(i) + (r() - 0.5) * 0.5, z = tileX(j) + (r() - 0.5) * 0.5;
  const t = { idx, i, j, k, kind, size, x, z, y: heightAt(x, z), rot: r() * TAU, sc: 0.8 + r() * 0.45, tint: 0, state: 0, fall: 0, shake: 0, res: false };
  const tints = TREE_TINT[kind];
  t.tint = kind === 0 && r() < 0.06 ? tints[5] : tints[(r() * (kind ? 3 : 5)) | 0];
  trees[idx] = t;
  W.natK[k] = NAT_TREE; W.natI[k] = idx;
  (kind ? W.mRound : W.mPine).setMatrixAt(idx, ZERO_M);
  const mF = kind ? W.mPine : W.mRound;
  mF.setColorAt(idx, _c.set(t.tint)); mF.instanceColor.needsUpdate = true;
  (kind ? W.mRound : W.mPine).instanceMatrix.needsUpdate = true;
  setTreeMatrix(t); hideDeco(k);
  return t;
}
function removeTree(t) {
  t.state = 2; t.res = false; setTreeMatrix(t);
  if (W.natK[t.k] === NAT_TREE && W.natI[t.k] === t.idx) W.natK[t.k] = NAT_NONE;
}
function setRockMatrix(rk) {
  if (rk.amount <= 0) W.mRock.setMatrixAt(rk.idx, ZERO_M);
  else {
    const s = rk.sc * (0.5 + 0.5 * rk.amount / rk.max);
    _q.setFromEuler(_e.set(rk.rot * 0.3, rk.rot, 0));
    _m4.compose(_v.set(rk.x, rk.y + 0.1 * s, rk.z), _q, _s.set(s * 1.15, s * 0.85, s));
    W.mRock.setMatrixAt(rk.idx, _m4);
  }
  W.mRock.instanceMatrix.needsUpdate = true;
}
function addRock(i, j, amount, r) {
  if (rocks.length >= MAXR) return null;
  const k = tileIdx(i, j), x = tileX(i) + (r() - 0.5) * 0.2, z = tileX(j) + (r() - 0.5) * 0.2;
  const rk = { idx: rocks.length, i, j, k, x, z, y: heightAt(x, z), amount, max: 36, rot: r() * TAU, sc: 0.9 + r() * 0.5 };
  rocks.push(rk);
  W.natK[k] = NAT_ROCK; W.natI[k] = rk.idx; W.solid[k] = 1;
  W.mRock.setColorAt(rk.idx, _c.set(pick([0xb3b0a6, 0xa19e96, 0xc0bcb0]))); W.mRock.instanceColor.needsUpdate = true;
  setRockMatrix(rk); hideDeco(k);
  return rk;
}
function setBushMatrix(bu) {
  if (bu.gone) { W.mBush.setMatrixAt(bu.idx, ZERO_M); W.mBerry.setMatrixAt(bu.idx, ZERO_M); }
  else {
    _q.setFromAxisAngle(AXIS_Y, bu.rot);
    _m4.compose(_v.set(bu.x, bu.y, bu.z), _q, _s.set(bu.sc, bu.sc, bu.sc));
    W.mBush.setMatrixAt(bu.idx, _m4);
    W.mBerry.setMatrixAt(bu.idx, bu.ripe ? _m4 : ZERO_M);
  }
  W.mBush.instanceMatrix.needsUpdate = true; W.mBerry.instanceMatrix.needsUpdate = true;
}
function addBush(i, j, r, ripe, timer) {
  if (bushes.length >= MAXB) return null;
  const k = tileIdx(i, j), x = tileX(i) + (r() - 0.5) * 0.4, z = tileX(j) + (r() - 0.5) * 0.4;
  const bu = { idx: bushes.length, i, j, k, x, z, y: heightAt(x, z), rot: r() * TAU, sc: 0.9 + r() * 0.35, ripe: ripe !== false, timer: timer || 0, res: false, gone: false };
  bushes.push(bu);
  W.natK[k] = NAT_BUSH; W.natI[k] = bu.idx;
  W.mBush.setColorAt(bu.idx, _c.set(pick([0x4f9a48, 0x5aa550, 0x468c44]))); W.mBush.instanceColor.needsUpdate = true;
  setBushMatrix(bu); hideDeco(k);
  return bu;
}
function hideDeco(k) {
  if (!W.tuftAt) return;
  if (W.tuftAt[k]) { W.mTuft.setMatrixAt(W.tuftAt[k] - 1, ZERO_M); W.mTuft.instanceMatrix.needsUpdate = true; W.tuftAt[k] = 0; }
  if (W.flowerAt[k]) { W.mFlower.setMatrixAt(W.flowerAt[k] - 1, ZERO_M); W.mFlower.instanceMatrix.needsUpdate = true; W.flowerAt[k] = 0; }
}
function clearNat(k) {
  const kind = W.natK[k];
  if (kind === NAT_TREE) removeTree(trees[W.natI[k]]);
  else if (kind === NAT_BUSH) { const bu = bushes[W.natI[k]]; bu.gone = true; bu.ripe = false; setBushMatrix(bu); W.natK[k] = NAT_NONE; }
  hideDeco(k);
}
function natRefreshY(k) {
  const kind = W.natK[k];
  if (kind === NAT_TREE) { const t = trees[W.natI[k]]; t.y = heightAt(t.x, t.z); setTreeMatrix(t); }
  else if (kind === NAT_ROCK) { const rk = rocks[W.natI[k]]; rk.y = heightAt(rk.x, rk.z); setRockMatrix(rk); }
  else if (kind === NAT_BUSH) { const bu = bushes[W.natI[k]]; bu.y = heightAt(bu.x, bu.z); setBushMatrix(bu); }
}
function scatterDeco(r) {
  const FC = [0xffffff, 0xffe066, 0xf59ab5, 0xb48ae0, 0xff8a5c];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = tileIdx(i, j);
    if (W.type[k] !== T_GRASS || W.natK[k] || W.occ[k]) continue;
    if (r() < 0.5 && W.nTuft < MAXTUFT) {
      const x = tileX(i) + (r() - 0.5) * 0.8, z = tileX(j) + (r() - 0.5) * 0.8, s = 0.7 + r() * 0.7;
      _m4.compose(_v.set(x, heightAt(x, z), z), _q.setFromAxisAngle(AXIS_Y, r() * TAU), _s.set(s, s, s));
      W.mTuft.setMatrixAt(W.nTuft, _m4); W.mTuft.setColorAt(W.nTuft, _c.set(pick([0x7fbf4d, 0x6fae45, 0x95cc58])));
      W.tuftAt[k] = ++W.nTuft;
    }
    const fl = fbm(i * 0.2 + 50, j * 0.2 + 3, W.seed + 31, 2);
    if (fl > 0.56 && r() < 0.55 && W.nFlower < MAXFLOWER) {
      const x = tileX(i) + (r() - 0.5) * 0.8, z = tileX(j) + (r() - 0.5) * 0.8, s = 0.8 + r() * 0.6;
      _m4.compose(_v.set(x, heightAt(x, z), z), _q.setFromAxisAngle(AXIS_Y, r() * TAU), _s.set(s, s, s));
      W.mFlower.setMatrixAt(W.nFlower, _m4); W.mFlower.setColorAt(W.nFlower, _c.set(FC[(fl * 37 + r() * 1.6) % 5 | 0]));
      W.flowerAt[k] = ++W.nFlower;
    }
  }
  W.mTuft.instanceMatrix.needsUpdate = true; W.mTuft.instanceColor.needsUpdate = true;
  W.mFlower.instanceMatrix.needsUpdate = true; W.mFlower.instanceColor.needsUpdate = true;
}
function generateNature(clear) {
  const r = mulberry32(W.seed * 7 + 3);
  const far = (i, j, d) => Math.hypot(i - clear.i, j - clear.j) > d;
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = tileIdx(i, j), t = W.type[k];
    if (t === T_ROCK) { if (r() < 0.3) addRock(i, j, 36, r); else if (r() < 0.12) addTree(i, j, 1, 1, r); continue; }
    if (t !== T_GRASS) continue;
    if (!far(i, j, 5.5)) continue;
    const f = fbm(i * 0.11 + 20, j * 0.11 + 60, W.seed + 13, 3);
    const bq = fbm(i * 0.19 + 90, j * 0.19 + 14, W.seed + 23, 2);
    if (r() < 0.012) addRock(i, j, 36, r);
    else if (bq > 0.66 && r() < 0.4 && f < 0.56) addBush(i, j, r);
    else if (f > 0.53 && r() < 0.62) addTree(i, j, W.tileH[k] > 0.6 || fbm(i * 0.05, j * 0.05, W.seed + 41, 2) > 0.56 ? 1 : 0, 0.75 + r() * 0.25, r);
    else if (r() < 0.035) addTree(i, j, r() < 0.3 ? 1 : 0, 0.7 + r() * 0.3, r);
  }
  // guarantee starter resources near the plaza: berries, a copse and a few rocks
  const ring = (count, d0, d1, fn) => {
    let placed = 0, tries = 0;
    const a0 = r() * TAU;
    while (placed < count && tries++ < 400) {
      const a = a0 + (r() - 0.5) * 1.1, d = d0 + r() * (d1 - d0);
      const i = Math.round(clear.i + Math.cos(a) * d), j = Math.round(clear.j + Math.sin(a) * d);
      if (!inGrid(i, j)) continue;
      const k = tileIdx(i, j);
      if (W.type[k] !== T_GRASS || W.natK[k]) continue;
      fn(i, j); placed++;
    }
  };
  ring(9, 6, 9.5, (i, j) => addBush(i, j, r));
  ring(22, 6.5, 11, (i, j) => addTree(i, j, 0, 0.8 + r() * 0.2, r));
  ring(5, 7, 11, (i, j) => addRock(i, j, 36, r));
  W.treeTarget = trees.filter((t) => t.state === 0).length;
  scatterDeco(r);
}

// ----- particles (unlit little chunks) -----
const PART_MAX = 320;
const parts = [];
let partMesh;
function initParticles() {
  const g = new THREE.IcosahedronGeometry(0.5, 0);
  partMesh = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ color: 0xffffff }), PART_MAX);
  partMesh.frustumCulled = false;
  for (let q = 0; q < PART_MAX; q++) { partMesh.setMatrixAt(q, ZERO_M); partMesh.setColorAt(q, _c.set(0xffffff)); }
  scene.add(partMesh);
}
function puff(x, y, z, color, n, o) {
  o = o || {};
  for (let q = 0; q < n; q++) {
    if (parts.length >= PART_MAX) return;
    const sp = o.speed === undefined ? 0.8 : o.speed;
    parts.push({
      x: x + rand(-1, 1) * (o.spread || 0.1), y: y + rand(0, 1) * (o.spread || 0.1), z: z + rand(-1, 1) * (o.spread || 0.1),
      vx: rand(-1, 1) * sp, vy: (o.up === undefined ? 1.2 : o.up) * rand(0.6, 1.2), vz: rand(-1, 1) * sp,
      g: o.grav === undefined ? 3 : o.grav, life: 0, max: (o.life || 0.7) * rand(0.7, 1.2),
      s: (o.size || 0.07) * rand(0.7, 1.3), grow: o.grow || 0, color: Array.isArray(color) ? pick(color) : color, lit: !o.glow,
    });
  }
}
function updateParticles(dt, lightK) {
  let q = 0;
  for (let p = parts.length - 1; p >= 0; p--) {
    const a = parts[p]; a.life += dt;
    if (a.life >= a.max) { parts.splice(p, 1); continue; }
    a.vy -= a.g * dt; a.x += a.vx * dt; a.y += a.vy * dt; a.z += a.vz * dt;
  }
  for (; q < parts.length; q++) {
    const a = parts[q], t = a.life / a.max, s = (a.s + a.grow * t) * (t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1);
    _m4.compose(_v.set(a.x, a.y, a.z), _q.identity(), _s.set(s, s, s));
    partMesh.setMatrixAt(q, _m4);
    _c.set(a.color); if (a.lit) _c.multiplyScalar(lightK);
    partMesh.setColorAt(q, _c);
  }
  for (; q < (partMesh.userData.last || 0); q++) partMesh.setMatrixAt(q, ZERO_M);
  partMesh.userData.last = parts.length;
  partMesh.instanceMatrix.needsUpdate = true; partMesh.instanceColor.needsUpdate = true;
}

// ----- critters: bees, butterflies, fireflies -----
const CRIT_MAX = 160;
let critMesh; const crits = [];
function initCritters() {
  critMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.7, 1.5), new THREE.MeshBasicMaterial({ color: 0xffffff }), CRIT_MAX);
  critMesh.frustumCulled = false;
  for (let q = 0; q < CRIT_MAX; q++) { critMesh.setMatrixAt(q, ZERO_M); critMesh.setColorAt(q, _c.set(0xffffff)); }
  scene.add(critMesh);
}
function addCritter(type, x, y, z, r) {      // type 0 bee, 1 butterfly, 2 firefly
  if (crits.length >= CRIT_MAX) return;
  crits.push({ type, x, y, z, r, ph: Math.random() * 100, sp: rand(0.7, 1.3), col: type === 0 ? 0xffc21a : type === 1 ? pick([0xffffff, 0xffd84d, 0xf58fb0, 0x8fd0ff]) : 0xe6ff7a });
}
function updateCritters(t, night) {
  for (let q = 0; q < crits.length; q++) {
    const c = crits[q];
    const vis = c.type === 2 ? night > 0.5 : night < 0.6;
    if (!vis) { critMesh.setMatrixAt(q, ZERO_M); continue; }
    const a = t * c.sp * (c.type === 0 ? 2.4 : 0.9) + c.ph;
    const x = c.x + Math.cos(a) * c.r * (0.6 + 0.4 * Math.sin(a * 0.37)), z = c.z + Math.sin(a * 1.13) * c.r;
    const y = c.y + Math.sin(a * 1.7) * 0.12 + (c.type === 1 ? Math.abs(Math.sin(a * 6)) * 0.05 : 0);
    const s = c.type === 0 ? 0.035 : c.type === 1 ? 0.05 : 0.03 + 0.02 * Math.sin(a * 3);
    const flap = c.type === 1 ? 0.3 + Math.abs(Math.sin(t * 14 + c.ph)) : 1;
    _m4.compose(_v.set(x, y, z), _q.setFromAxisAngle(AXIS_Y, -a), _s.set(s * (c.type === 1 ? 2.2 * flap : 1), s, s));
    critMesh.setMatrixAt(q, _m4);
  }
  critMesh.instanceMatrix.needsUpdate = true;
}
function rebuildCritters(homes) {
  for (let q = 0; q < CRIT_MAX; q++) critMesh.setMatrixAt(q, ZERO_M);
  crits.length = 0;
  for (const h of homes) for (let q = 0; q < h.n; q++) addCritter(h.type, h.x, h.y, h.z, h.r);
  const r = mulberry32(W.seed + 99);
  let tries = 0, bf = 0, ff = 0;
  while (tries++ < 600 && (bf < 16 || ff < 34)) {
    const i = (r() * N) | 0, j = (r() * N) | 0, k = tileIdx(i, j);
    if (W.type[k] !== T_GRASS) continue;
    if (W.flowerAt[k] && bf < 16) { addCritter(1, tileX(i), W.tileH[k] + 0.35, tileX(j), 0.8); bf++; }
    else if (ff < 34 && (W.natK[k] === NAT_TREE || r() < 0.15)) { addCritter(2, tileX(i), W.tileH[k] + 0.5 + r() * 0.5, tileX(j), 0.9); ff++; }
  }
  for (let q = 0; q < crits.length; q++) critMesh.setColorAt(q, _c.set(crits[q].col));
  critMesh.instanceColor.needsUpdate = true;
}

// ----- clouds & birds -----
const clouds = [], birds = [];
function initSky() {
  const cm = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  W.cloudMat = cm;
  for (let q = 0; q < 7; q++) {
    const b = new MB();
    const n = 3 + ((Math.random() * 3) | 0);
    for (let p = 0; p < n; p++) b.sph(rand(1.2, 2.1), (p - n / 2) * 1.6 + rand(-0.3, 0.3), rand(-0.2, 0.3), rand(-0.6, 0.6), 0xffffff, [1, 0.55, 0.85], 1);
    const m = new THREE.Mesh(b.build().geo, cm.clone());
    m.position.set(rand(-50, 50), rand(15, 18), rand(-40, 40));
    m.castShadow = true; m.userData.v = rand(0.25, 0.5);
    scene.add(m); clouds.push(m);
  }
  const bm = new THREE.MeshBasicMaterial({ color: 0x3b3f4a, side: THREE.DoubleSide });
  const wg = new THREE.BufferGeometry();
  wg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -0.06, 0.28, 0, 0, 0, 0, 0.08], 3));
  for (let q = 0; q < 6; q++) {
    const g = new THREE.Group();
    const l = new THREE.Mesh(wg, bm), r = new THREE.Mesh(wg, bm); r.scale.x = -1;
    g.add(l, r); g.userData = { l, r, a: Math.random() * TAU, rad: rand(10, 24), h: rand(4.8, 6.2), sp: rand(0.12, 0.2) * (q % 2 ? 1 : -1), ph: Math.random() * 9 };
    scene.add(g); birds.push(g);
  }
}
function updateSky(dt, t, night) {
  for (const c of clouds) {
    c.position.x += c.userData.v * dt; if (c.position.x > 62) { c.position.x = -62; c.position.z = rand(-40, 40); }
    // a cloud drifting through the camera fades out instead of clipping (it keeps its shadow)
    const tg = (camera.position.y > c.position.y ? 0.5 : 0.92) * clamp((camera.position.distanceTo(c.position) - 8) / 9, 0, 1);
    c.material.opacity += (tg - c.material.opacity) * 0.08;
  }
  for (const b of birds) {
    const u = b.userData; u.a += u.sp * dt;
    b.position.set(Math.cos(u.a) * u.rad, u.h + Math.sin(t * 0.5 + u.ph) * 0.3, Math.sin(u.a) * u.rad);
    b.visible = night < 0.5 && b.position.distanceTo(camera.position) > 7;
    b.rotation.y = -u.a + (u.sp > 0 ? 0 : Math.PI) - Math.PI / 2;
    const f = Math.sin(t * 9 + u.ph) * 0.7;
    u.l.rotation.z = f; u.r.rotation.z = -f;
  }
}

// ----- rain streaks around whatever the camera looks at -----
const RAIN_N = 240; let rainMesh; const rainDrops = [];
function initRain() {
  rainMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.014, 0.55, 0.014), new THREE.MeshBasicMaterial({ color: 0xd6ecf8, transparent: true, opacity: 0.5, depthWrite: false }), RAIN_N);
  rainMesh.frustumCulled = false; rainMesh.visible = false; scene.add(rainMesh);
  for (let q = 0; q < RAIN_N; q++) rainDrops.push({ x: rand(-17, 17), z: rand(-17, 17), y: rand(0, 15), v: rand(13, 18) });
}
function updateRain(dt, cx, cz) {
  RAINK += ((G.rain > 0 ? 1 : 0) - RAINK) * Math.min(1, dt * 0.8);
  rainMesh.visible = RAINK > 0.03;
  if (!rainMesh.visible) return;
  const snow = G.season === 3;
  rainMesh.material.opacity = (snow ? 0.95 : 0.5) * RAINK;
  _q.setFromEuler(_e.set(0, 0, snow ? 0 : 0.12));
  for (let q = 0; q < RAIN_N; q++) {
    const d = rainDrops[q]; d.y -= d.v * dt * (snow ? 0.16 : 1);
    if (snow) d.x += Math.sin(d.y * 1.3 + q) * dt * 0.5;
    if (d.y < 0) { d.y += 15; d.x = rand(-17, 17); d.z = rand(-17, 17); if (!snow && Math.random() < 0.06) puff(cx + d.x, Math.max(0.05, heightAt(cx + d.x, cz + d.z)) + 0.03, cz + d.z, 0xe6f4fb, 1, { speed: 0.3, up: 0.5, life: 0.25, size: 0.03 }); }
    _m4.compose(_v.set(cx + d.x, d.y, cz + d.z), _q, snow ? _s.set(4.5, 0.12, 4.5) : _s.set(1, 1, 1)); rainMesh.setMatrixAt(q, _m4);
  }
  rainMesh.instanceMatrix.needsUpdate = true;
}

// ----- day / night -----
const DAYKEYS = [
  // t, sun colour, sun int, sky, ground, hemi int, background, glow, water tint
  [0.00, 0xffb07a, 0.55, 0xffd9c0, 0x7a6a5a, 0.62, 0xf6c7a2, 0.7, 0xe6c2b0],
  [0.06, 0xfff0d2, 1.0, 0xcfe8ff, 0x8a9a6a, 0.72, 0xa9def2, 0.0, 0xffffff],
  [0.34, 0xffffff, 1.12, 0xd6efff, 0x93a86f, 0.78, 0x9cd8f4, 0.0, 0xffffff],
  [0.57, 0xffe6b8, 1.0, 0xdfeaff, 0x93a070, 0.72, 0xa8d8ec, 0.0, 0xffffff],
  [0.655, 0xff985a, 0.72, 0xffc9a0, 0x6a5a5a, 0.6, 0xf3a27c, 0.55, 0xf0b9a0],
  [0.73, 0x9db2ff, 0.4, 0x6577bd, 0x262d4d, 0.74, 0x1c2749, 1.0, 0x5f6fa8],
  [0.94, 0x9db2ff, 0.4, 0x6577bd, 0x262d4d, 0.74, 0x1c2749, 1.0, 0x5f6fa8],
  [1.00, 0xffb07a, 0.55, 0xffd9c0, 0x7a6a5a, 0.62, 0xf6c7a2, 0.7, 0xe6c2b0],
];
const DAY = { glow: 0, lightK: 1, bg: new THREE.Color() };
const _kc = DAYKEYS.map((k) => ({ sun: new THREE.Color(k[1]), sky: new THREE.Color(k[3]), gr: new THREE.Color(k[4]), bg: new THREE.Color(k[6]), wt: new THREE.Color(k[8]) }));
const GLOW_DAY = new THREE.Color(0x2d3d50), GLOW_NIGHT = new THREE.Color(0xffd27a);
function applyDaylight(t, target) {
  let a = 0;
  while (a < DAYKEYS.length - 2 && t >= DAYKEYS[a + 1][0]) a++;
  const k0 = DAYKEYS[a], k1 = DAYKEYS[a + 1], f = clamp((t - k0[0]) / (k1[0] - k0[0]), 0, 1), c0 = _kc[a], c1 = _kc[a + 1];
  sun.color.copy(c0.sun).lerp(c1.sun, f); sun.intensity = lerp(k0[2], k1[2], f);
  hemi.color.copy(c0.sky).lerp(c1.sky, f); hemi.groundColor.copy(c0.gr).lerp(c1.gr, f); hemi.intensity = lerp(k0[5], k1[5], f);
  DAY.bg.copy(c0.bg).lerp(c1.bg, f);
  scene.background = DAY.bg; scene.fog.color.copy(DAY.bg);
  DAY.glow = lerp(k0[7], k1[7], f);
  if (RAINK > 0.01) { DAY.bg.lerp(_c2.set(0x8fa3b0), RAINK * 0.45); sun.intensity *= 1 - RAINK * 0.4; scene.fog.color.copy(DAY.bg); }
  DAY.lightK = clamp(sun.intensity * 0.55 + hemi.intensity * 0.6, 0.3, 1.1);
  MAT.glow.color.copy(GLOW_DAY).lerp(GLOW_NIGHT, DAY.glow);
  const wu = W.water.material.uniforms;
  wu.tint.value.copy(c0.wt).lerp(c1.wt, f); wu.fogC.value.copy(DAY.bg); wu.fogN.value = scene.fog.near; wu.fogF.value = scene.fog.far;
  // sun path: rises in the east, moon parks high
  const night = t > 0.7 && t < 0.97;
  if (night) _v.set(-0.45, 0.8, -0.35);
  else { const tt = t >= 0.97 ? t - 1 : t; const an = lerp(0.12, Math.PI - 0.12, (tt + 0.03) / 0.73); _v.set(Math.cos(an) * 0.85, Math.sin(an) * 0.8 + 0.28, 0.5); }
  _v.normalize();
  sun.position.copy(target).addScaledVector(_v, 60);
  sun.target.position.copy(target); sun.target.updateMatrixWorld();
}

function glowTexture() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const g = cv.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,214,130,1)'); gr.addColorStop(0.35, 'rgba(255,180,80,.45)'); gr.addColorStop(1, 'rgba(255,160,60,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; return t;
}
let GLOW_MAT;
function makeGlowSprite(size) {
  if (!GLOW_MAT) GLOW_MAT = new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });
  const s = new THREE.Sprite(GLOW_MAT); s.scale.setScalar(size); return s;
}

function resetWorld(seed) {
  if (worldGroup) {
    scene.remove(worldGroup);
    worldGroup.traverse((o) => { if (o.isInstancedMesh) o.dispose(); });
    if (W.terrain) W.terrain.geometry.dispose();
  }
  worldGroup = new THREE.Group(); scene.add(worldGroup);
  trees.length = 0; rocks.length = 0; bushes.length = 0;
  for (const k of Object.keys(W)) if (k !== 'cloudMat') delete W[k];
  W.seed = seed;
  W.h = new Float32Array((N + 1) * (N + 1));
  W.tileH = new Float32Array(N * N); W.slope = new Float32Array(N * N); W.type = new Uint8Array(N * N);
  W.occ = new Int16Array(N * N); W.solid = new Uint8Array(N * N); W.paint = new Uint8Array(N * N);
  W.natK = new Uint8Array(N * N); W.natI = new Int16Array(N * N); W.fence = new Uint8Array(N * N); W.nav = 1;
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) W.h[j * (N + 1) + i] = genHeight(i, j, seed);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) computeTile(i, j, true);
  buildTerrain(); buildWater(); buildNatureMeshes();
}
