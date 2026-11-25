// ---------- ui: camera, input (mouse + touch), HUD ----------
const $ = (id) => document.getElementById(id);
const ic = (n) => '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
const CAM = { tx: 0, tz: 0, dist: 30, yaw: 0.75, gx: 0, gz: 0, gd: 30, gyaw: 0.75, pitch: 0.8, follow: null, attract: true };
const UIS = { undo: [], photo: false, build: null, sel: null, tab: 'dorp', dirty: true, panel: null, thumbs: {}, speed: 1, paused: false, touch: false, shown: {} };
let ghost, ghostTile, ghostFrame, ghostX, selRing, radRing;
const _ray = new THREE.Raycaster(), _ndc = new THREE.Vector2();

function camState() { return [+CAM.gx.toFixed(2), +CAM.gz.toFixed(2), +CAM.gd.toFixed(1), +CAM.gyaw.toFixed(2)]; }
function camRestore(a) { CAM.gx = CAM.tx = a[0]; CAM.gz = CAM.tz = a[1]; CAM.gd = CAM.dist = a[2]; CAM.gyaw = CAM.yaw = a[3]; }
function hearK(x, z) { return clamp(1 - Math.hypot(x - CAM.tx, z - CAM.tz) / (CAM.dist * 0.9 + 5), 0, 1); }
function focusOn(x, z, d) { CAM.gx = x; CAM.gz = z; if (d) CAM.gd = Math.min(CAM.gd, d); }
// centre a spot in the part of the screen that is not covered by menus (matters most on phones)
function focusFree(x, z, d) {
  if (d) CAM.gd = Math.min(CAM.gd, d);
  const m = $('mid').getBoundingClientRect(), dy = (m.top + m.bottom) / 2 - window.innerHeight / 2;
  const upp = 2 * CAM.gd * Math.tan(camera.fov * Math.PI / 360) / window.innerHeight, sp = Math.sin(CAM.pitch);
  CAM.gx = x - Math.sin(CAM.gyaw) * dy * upp / sp; CAM.gz = z - Math.cos(CAM.gyaw) * dy * upp / sp; CAM.follow = null;
}
function updateCamera(dt) {
  if (CAM.attract) CAM.gyaw += dt * 0.05;
  if (CAM.follow) { if (G.villagers.includes(CAM.follow)) { CAM.gx = CAM.follow.x; CAM.gz = CAM.follow.z; } else CAM.follow = null; }
  const r = Math.hypot(CAM.gx, CAM.gz), maxR = HALF - 5;
  if (r > maxR) { CAM.gx *= maxR / r; CAM.gz *= maxR / r; }
  const k = 1 - Math.exp(-dt * 9);
  CAM.tx += (CAM.gx - CAM.tx) * k; CAM.tz += (CAM.gz - CAM.tz) * k; CAM.dist += (CAM.gd - CAM.dist) * k; CAM.yaw += (CAM.gyaw - CAM.yaw) * k;
  CAM.pitch = clamp(lerp(0.6, 0.95, smooth(11, 46, CAM.dist)) + (CAM.tilt || 0), 0.2, 1.4);
  const ty = Math.max(0, heightAt(CAM.tx, CAM.tz)), cp = Math.cos(CAM.pitch);
  camera.position.set(CAM.tx + Math.sin(CAM.yaw) * cp * CAM.dist, ty + Math.sin(CAM.pitch) * CAM.dist, CAM.tz + Math.cos(CAM.yaw) * cp * CAM.dist);
  camera.lookAt(CAM.tx, ty + 0.3, CAM.tz);
}
function panBy(dx, dy) {
  const upp = 2 * CAM.dist * Math.tan(camera.fov * Math.PI / 360) / window.innerHeight;
  const rx = Math.cos(CAM.yaw), rz = -Math.sin(CAM.yaw), fx = -Math.sin(CAM.yaw), fz = -Math.cos(CAM.yaw), sp = Math.sin(CAM.pitch);
  const mx = -rx * dx * upp + fx * dy * upp / sp, mz = -rz * dx * upp + fz * dy * upp / sp;
  CAM.gx += mx; CAM.gz += mz; CAM.tx += mx; CAM.tz += mz; CAM.follow = null;
}
function zoomBy(f) { CAM.gd = clamp(CAM.gd * f, 9, 48); }
function groundAt(cx, cy) {
  const rc = renderer.domElement.getBoundingClientRect();
  _ndc.set((cx - rc.left) / rc.width * 2 - 1, -((cy - rc.top) / rc.height) * 2 + 1);
  _ray.setFromCamera(_ndc, camera);
  const o = _ray.ray.origin, d = _ray.ray.direction;
  if (d.y >= -0.01) return null;
  let h = 0.3, x = 0, z = 0;
  for (let q = 0; q < 4; q++) { const t = (h - o.y) / d.y; x = o.x + d.x * t; z = o.z + d.z * t; h = Math.max(0, heightAt(x, z)); }
  return { x, z };
}
function screenOf(x, y, z) {
  _v.set(x, y, z).project(camera);
  const rc = renderer.domElement.getBoundingClientRect();
  return { x: (_v.x + 1) / 2 * rc.width + rc.left, y: (1 - _v.y) / 2 * rc.height + rc.top, ok: _v.z < 1 };
}

// ----- toasts and floating numbers -----
function toast(text, kind) {
  if (!G.started) return;
  const box = $('toasts'), el = document.createElement('div');
  el.className = 'toast ' + (kind || ''); el.textContent = trText(text);
  box.appendChild(el);
  while (box.children.length > 3) box.removeChild(box.firstChild);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, kind === 'quest' ? 6500 : 3800);
}
const floats = [];
function floatText(x, y, z, text, res) {
  if (floats.length > 24 || !G.started) return;
  const el = document.createElement('div');
  el.className = 'float'; el.innerHTML = (res ? ic(res) : '') + '<span>' + trText(text) + '</span>';
  $('floats').appendChild(el);
  floats.push({ el, x, y, z, t: 0 });
}
function updateFloats(dt) {
  for (let q = floats.length - 1; q >= 0; q--) {
    const f = floats[q]; f.t += dt;
    if (f.t > 1.4) { f.el.remove(); floats.splice(q, 1); continue; }
    const s = screenOf(f.x, f.y + f.t * 0.6, f.z);
    f.el.style.transform = 'translate(' + Math.round(s.x) + 'px,' + Math.round(s.y) + 'px) translate(-50%,-50%)';
    f.el.style.opacity = s.ok ? String(clamp((1.4 - f.t) * 2.5, 0, 1)) : '0';
  }
}
function uiDirty() { UIS.dirty = true; }

// ----- build mode -----
function initMarkers() {
  ghost = new THREE.Group(); ghost.visible = false; scene.add(ghost);
  ghostTile = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xffd257, transparent: true, opacity: 0.55, depthTest: false }));
  ghostTile.rotation.x = -Math.PI / 2; ghostTile.renderOrder = 5; ghostTile.visible = false; scene.add(ghostTile);
  // a bright square frame around the footprint, so the spot reads clearly against the grass
  ghostFrame = new THREE.Mesh(new THREE.RingGeometry(0.64, 0.78, 4, 1, Math.PI / 4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, depthTest: false, side: THREE.DoubleSide }));
  ghostFrame.rotation.x = -Math.PI / 2; ghostFrame.renderOrder = 7; ghostFrame.visible = false; scene.add(ghostFrame);
  // a cross on spots that do not work, so the difference is a shape and not only a colour
  const xb = new MB(); xb.box(1.25, 0.02, 0.13, 0, 0, 0, 0xffffff, [0, Math.PI / 4, 0]).box(1.25, 0.02, 0.13, 0, 0, 0, 0xffffff, [0, -Math.PI / 4, 0]);
  ghostX = new THREE.Mesh(xb.build().geo, new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true })); ghostX.renderOrder = 8; ghostX.visible = false; scene.add(ghostX);
  selRing = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 40), new THREE.MeshBasicMaterial({ color: 0xffd257, transparent: true, opacity: 0.95, depthTest: false, side: THREE.DoubleSide }));
  selRing.rotation.x = -Math.PI / 2; selRing.renderOrder = 6; selRing.visible = false; scene.add(selRing);
  radRing = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 72), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthTest: false, side: THREE.DoubleSide }));
  radRing.rotation.x = -Math.PI / 2; radRing.renderOrder = 6; radRing.visible = false; scene.add(radRing);
}
function lockReason(type) {
  const d = BT[type];
  if (d.max && G.buildings.filter((q) => q.type === type).length >= d.max) return 'Already built';
  const sc = scnOf(); if (sc && sc.ban.includes(type)) return 'Not in this challenge';
  if (G.mode === 'sandbox') return null;
  if ((d.lvl || 0) > G.level) return 'Unlocks at ' + LEVELS[d.lvl].name;
  if (d.after && !countDone(d.after)) return 'Build the ' + BT[d.after].name + ' first';
  if (d.tech && !G.tech[d.tech]) return 'Research: ' + TECHS.find((q) => q.id === d.tech).name;
  if (d.ach && !G.ach[d.ach]) return 'Badge: ' + ACH.find((q) => q.id === d.ach).name;
  return null;
}
function startBuild(type) {
  select(null); closePanel();
  if (UIS.build && UIS.build.type === type) { stopBuild(); return; }
  UIS.build = { type, rot: 0, i: -1, j: -1, has: false, reason: null };
  TUT.focused = '';
  while (ghost.children.length) ghost.remove(ghost.children[0]);
  if (type !== 'path') {
    const m = getModel(type, 0), mesh = new THREE.Mesh(m.geo, MAT.ghostOk);
    ghost.add(mesh);
    if (type === 'windmill') { const bl = new THREE.Mesh(cachedGeo('blades', mBlades), MAT.ghostOk); bl.position.set(0, 1.6, 0.6); ghost.add(bl); }
    if (type === 'tree') mesh.scale.setScalar(0.5);
  }
  hideGhost();
  document.body.classList.add('building');
  if (!UIS.touch && UIS.lastMouse) moveGhost(UIS.lastMouse.x, UIS.lastMouse.y);
  sfx('click'); uiDirty();
}
function hideGhost() { ghost.visible = false; ghostTile.visible = false; ghostFrame.visible = false; ghostX.visible = false; }
function stopBuild() { UIS.build = null; hideGhost(); radRing.visible = false; document.body.classList.remove('building'); uiDirty(); }
const placeReason = (B, i, j) => lockReason(B.type) || canPlace(B.type, i, j) || sealsOff(B.type, i, j, B.rot) || (canAfford(BT[B.type].cost) ? null : 'Not enough resources');
function setGhostAt(i, j) {
  const B = UIS.build, d = BT[B.type];
  B.i = i; B.j = j; B.has = true;
  B.reason = placeReason(B, i, j);
  const cx = i + d.size / 2 - HALF, cz = j + d.size / 2 - HALF;
  B.reach = null;
  if (d.radius && !B.reason) {
    const r2 = d.radius * d.radius; let n = 0;
    if (B.type === 'lumber') { for (const t of trees) if (t && t.state === 0 && dist2(t.x, t.z, cx, cz) <= r2) n++; }
    else if (B.type === 'forager') { for (const bu of bushes) if (!bu.gone && dist2(bu.x, bu.z, cx, cz) <= r2) n++; }
    else for (const rk of rocks) if (rk.amount > 0 && dist2(rk.x, rk.z, cx, cz) <= r2) n++;
    B.reach = [n, B.type === 'lumber' ? 'trees' : B.type === 'forager' ? 'berry bushes' : 'rocks'];
  }
  let y = 0.1;
  if (i >= 0 && j >= 0 && i + d.size <= N && j + d.size <= N) y = footprintHeight(i, j, d.size);
  B.y = y;
  ghost.position.set(cx, y, cz); ghost.rotation.y = B.rot * Math.PI / 2; ghost.visible = true;
  const mat = B.reason ? MAT.ghostBad : MAT.ghostOk;
  ghost.traverse((o) => { if (o.isMesh) o.material = mat; });
  ghostTile.position.set(cx, y + 0.06, cz); ghostTile.scale.set(d.size, d.size, 1); ghostTile.visible = true;
  ghostTile.material.color.set(B.reason ? 0xff3b2e : 0xffd257);
  ghostFrame.position.set(cx, y + 0.09, cz); ghostFrame.visible = true; ghostFrame.material.color.set(B.reason ? 0xff3b2e : 0xffffff); ghostFrame.userData.s = d.size;
  ghostX.visible = !!B.reason; ghostX.position.set(cx, y + 0.12, cz); ghostX.scale.set(d.size, 1, d.size);
  if (d.radius) { radRing.visible = true; radRing.position.set(cx, y + 0.12, cz); radRing.scale.setScalar(d.radius); } else radRing.visible = false;
}
function moveGhost(cx, cy) {
  const B = UIS.build; if (!B) return;
  const p = groundAt(cx, cy); if (!p) return;
  const s = BT[B.type].size, i = Math.round(p.x + HALF - s / 2), j = Math.round(p.z + HALF - s / 2);
  if (i !== B.i || j !== B.j || !B.has) { setGhostAt(i, j); uiDirty(); }
}
function rotateGhost() { const B = UIS.build; if (!B) return; B.rot = (B.rot + 1) % 4; if (B.has) setGhostAt(B.i, B.j); sfx('click'); }
function confirmBuild(keep) {
  const B = UIS.build; if (!B || !B.has) return false;
  const d = BT[B.type];
  B.reason = lockReason(B.type) || canPlace(B.type, B.i, B.j) || sealsOff(B.type, B.i, B.j, B.rot) || (canAfford(d.cost) ? null : 'Not enough resources');
  if (B.reason) { toast(B.reason, 'bad'); sfx('error'); setGhostAt(B.i, B.j); uiDirty(); return false; }
  pay(d.cost);
  const nb = placeBuilding(B.type, B.i, B.j, B.rot);
  if (nb) { UIS.undo.push({ id: nb.id, b: nb }); if (UIS.undo.length > 20) UIS.undo.shift(); }
  sfx('place', 1);
  puff(B.i + d.size / 2 - HALF, ghost.position.y + 0.1, B.j + d.size / 2 - HALF, [0xe8d9b0, 0xcdb588], 6, { spread: d.size * 0.35, speed: 0.8, up: 0.8, life: 0.5, size: 0.08 });
  if (d.quick || keep) { setGhostAt(B.i, B.j); if (UIS.touch) { hideGhost(); B.has = false; } }
  else stopBuild();
  uiDirty(); return true;
}

// ----- selection -----
function select(sel) {
  UIS.sel = sel; CAM.follow = null;
  if (!sel) { if (UIS.panel && (UIS.panel.kind === 'b' || UIS.panel.kind === 'v' || UIS.panel.kind === 's')) closePanel(); selRing.visible = false; if (!UIS.build) radRing.visible = false; return; }
  if (sel.kind === 'b') openBuildingPanel(sel.ref); else if (sel.kind === 's') openSitePanel(sel.ref); else openVillagerPanel(sel.ref);
  sfx('click');
}
function updateMarkers(t) {
  if (UIS.build && ghost.visible) {
    ghost.position.y = UIS.build.y + 0.07 + Math.sin(t * 4) * 0.05;
    ghostFrame.scale.setScalar(ghostFrame.userData.s * (1 + Math.sin(t * 5) * 0.035));
    ghostTile.material.opacity = 0.5 + Math.sin(t * 5) * 0.14;
  }
  const s = UIS.sel;
  if (!s) { selRing.visible = false; return; }
  if (s.kind === 's') { selRing.visible = true; selRing.position.set(s.ref.x, s.ref.y + 0.08, s.ref.z); selRing.scale.setScalar(0.72 + Math.sin(t * 4) * 0.03); return; }
  if (s.kind === 'v') {
    const v = s.ref;
    if (!G.villagers.includes(v)) { select(null); return; }
    selRing.visible = v.mesh.visible; selRing.position.set(v.x, v.y + 0.06, v.z); selRing.scale.setScalar(0.34 + Math.sin(t * 5) * 0.03);
  } else {
    const b = s.ref;
    if (!G.bmap.has(b.id)) { select(null); return; }
    selRing.visible = true; selRing.position.set(b.cx, b.y + 0.08, b.cz); selRing.scale.setScalar(b.size * 0.72 + Math.sin(t * 4) * 0.03);
    if (b.def.radius) { radRing.visible = true; radRing.position.set(b.cx, b.y + 0.12, b.cz); radRing.scale.setScalar(b.def.radius); }
  }
}
function tapAt(cx, cy, touch) {
  if (!G.started || UIS.photo) return;
  if (UIS.build) {
    const d = BT[UIS.build.type];
    moveGhost(cx, cy);
    if (!UIS.build.has) return;
    if (!touch || d.quick) confirmBuild(UIS.shift);
    else { setGhostAt(UIS.build.i, UIS.build.j); focusFree(ghost.position.x, ghost.position.z); uiDirty(); }
    return;
  }
  let best = null, bd = touch ? 34 : 24;
  for (const v of G.villagers) {
    if (!v.mesh.visible) continue;
    const s = screenOf(v.x, v.y + 0.35, v.z), d = Math.hypot(s.x - cx, s.y - cy);
    if (s.ok && d < bd) { bd = d; best = v; }
  }
  if (best) { select({ kind: 'v', ref: best }); return; }
  const p = groundAt(cx, cy);
  if (p) {
    const i = worldToTile(p.x), j = worldToTile(p.z);
    if (inGrid(i, j)) {
      const k = tileIdx(i, j), b = G.bmap.get(W.occ[k]);
      if (b) { select({ kind: 'b', ref: b }); return; }
      if (W.natK[k] === NAT_SITE) { select({ kind: 's', ref: W.sites[W.natI[k]] }); return; }
    }
  }
  select(null);
}

// ----- pointer input -----
function initInput() {
  const cv = renderer.domElement, ptrs = new Map();
  let drag = null, gest = null;
  const two = () => { const a = [...ptrs.values()]; return { d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y), a: Math.atan2(a[1].y - a[0].y, a[1].x - a[0].x), mx: (a[0].x + a[1].x) / 2, my: (a[0].y + a[1].y) / 2 }; };
  cv.addEventListener('pointerdown', (e) => {
    UIS.touch = e.pointerType !== 'mouse';
    document.body.classList.toggle('touch', UIS.touch);
    try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const paint = !!(G.started && UIS.build && BT[UIS.build.type].flat && e.button === 0 && ptrs.size === 1);
    if (paint) paintAt(e.clientX, e.clientY);
    if (ptrs.size === 1) drag = { paint, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, moved: false, button: e.button, rot: e.button !== 0 || e.ctrlKey, t: performance.now() };
    else if (ptrs.size === 2) { drag = null; gest = two(); }
    CAM.attract = CAM.attract && !G.started;
  });
  cv.addEventListener('pointermove', (e) => {
    const p = ptrs.get(e.pointerId);
    if (p) { p.x = e.clientX; p.y = e.clientY; }
    if (!G.started) return;
    if (gest && ptrs.size === 2) {
      const n = two();
      zoomBy(gest.d / Math.max(n.d, 1));
      let da = n.a - gest.a; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      CAM.gyaw += da; CAM.yaw += da;
      panBy(n.mx - gest.mx, n.my - gest.my);
      gest = n; return;
    }
    if (drag && p && drag.paint) { paintAt(e.clientX, e.clientY); drag.moved = true; return; }
    if (drag && p) {
      const dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
      if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > (UIS.touch ? 9 : 5)) drag.moved = true;
      if (drag.moved) { if (drag.rot) { CAM.gyaw -= dx * 0.006; CAM.yaw -= dx * 0.006; zoomBy(Math.exp(dy * 0.004)); } else panBy(dx, dy); }
      drag.lx = e.clientX; drag.ly = e.clientY;
    } else if (e.pointerType === 'mouse') { UIS.lastMouse = { x: e.clientX, y: e.clientY }; if (UIS.build) moveGhost(e.clientX, e.clientY); }
  });
  const up = (e, cancel) => {
    const had = ptrs.delete(e.pointerId);
    if (drag && had && !cancel && !drag.moved && !drag.paint && drag.button === 0 && performance.now() - drag.t < 700) tapAt(e.clientX, e.clientY, e.pointerType !== 'mouse');
    if (ptrs.size < 2) gest = null;
    drag = null;
  };
  cv.addEventListener('pointerup', (e) => up(e, false));
  cv.addEventListener('pointercancel', (e) => up(e, true));
  cv.addEventListener('contextmenu', (e) => e.preventDefault());
  // a tap on the island must not turn into a click on a panel that opens under the finger
  cv.addEventListener('touchend', (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
  cv.addEventListener('wheel', (e) => { e.preventDefault(); if (G.started) zoomBy(Math.exp(clamp(e.deltaY, -120, 120) * 0.0016)); }, { passive: false });
  const keys = {};
  UIS.keys = keys;
  window.addEventListener('keydown', (e) => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    keys[e.code] = true; UIS.shift = e.shiftKey;
    if (!G.started) return;
    if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); undoLast(); return; }
    if (e.code === 'Escape' && UIS.photo) { photoMode(false); return; }
    if (e.code === 'Escape') { if (!$('modal').hidden) closeModal(); else if (UIS.build) stopBuild(); else select(null); }
    else if (e.code === 'KeyR') rotateGhost();
    else if (e.code === 'Space') { e.preventDefault(); setSpeed(UIS.paused ? UIS.speed : 0); }
    else if (e.code === 'Digit1') setSpeed(1); else if (e.code === 'Digit2') setSpeed(2); else if (e.code === 'Digit3') setSpeed(3);
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; UIS.shift = e.shiftKey; });
  window.addEventListener('blur', () => { for (const k of Object.keys(keys)) keys[k] = false; });
}
function paintAt(x, y) {            // paths are laid by dragging
  const B = UIS.build; if (!B) return;
  moveGhost(x, y);
  if (B.has && !B.reason) confirmBuild(true);
}
function keyCamera(dt) {
  const k = UIS.keys; if (!k || !G.started) return;
  const sp = 520 * dt; let dx = 0, dy = 0;
  if (k.KeyA || k.ArrowLeft) dx += sp; if (k.KeyD || k.ArrowRight) dx -= sp;
  if (k.KeyW || k.ArrowUp) dy += sp; if (k.KeyS || k.ArrowDown) dy -= sp;
  if (dx || dy) panBy(dx, dy);
  if (k.KeyQ) CAM.gyaw += dt * 1.6; if (k.KeyE) CAM.gyaw -= dt * 1.6;
}
function setSpeed(s) {
  if (s === 0) UIS.paused = true; else { UIS.paused = false; UIS.speed = s; }
  for (const b of document.querySelectorAll('#speed button')) b.setAttribute('aria-pressed', String(+b.dataset.s === (UIS.paused ? 0 : UIS.speed)));
}

// ----- thumbnails: every build button shows the real model -----
function renderThumbs() {
  let r;
  try { r = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true }); } catch (e) { return; }
  const temporary = [];
  try {
    // Render once at startup; larger transparent portraits reveal the new model details.
    r.setPixelRatio(1); r.setSize(176, 176); r.outputEncoding = THREE.sRGBEncoding;
    r.setClearColor(0x000000, 0);
    const sc = new THREE.Scene();
    sc.add(new THREE.HemisphereLight(0xe9f5ff, 0x8b8e60, 0.9));
    const dl = new THREE.DirectionalLight(0xffefd4, 1.05); dl.position.set(-3, 7, 6); sc.add(dl);
    const rim = new THREE.DirectionalLight(0xb8e3ef, 0.28); rim.position.set(4, 3, -4); sc.add(rim);
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
    const glow = new THREE.MeshBasicMaterial({ color: 0xffd491 });
    const crops = new THREE.MeshLambertMaterial({ color: 0xd9c04f });
    const shadowTexture = softTexture(false);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x091f17, map: shadowTexture, transparent: true, opacity: 0.25, depthWrite: false });
    const shadowGeo = new THREE.PlaneGeometry(1, 1);
    const shadow = new THREE.Mesh(shadowGeo, shadowMat); shadow.rotation.x = -Math.PI / 2; sc.add(shadow);
    temporary.push(glow, crops, shadowMat, shadowGeo, shadowTexture);
    const p = new THREE.Vector3();
    for (const type of Object.keys(BT)) {
      if (type === 'center') continue;
      const g = new THREE.Group();
      if (type === 'path') {
        const b = new MB(); b.box(1.5, 0.08, 1.5, 0, 0, 0, 0xc6c3a3);
        for (let q = 0; q < 9; q++) b.box(0.43, 0.04, 0.43, -0.48 + (q % 3) * 0.48, 0.08, -0.48 + ((q / 3) | 0) * 0.48, q % 2 ? 0xd8d0b6 : 0xeee0bd, [0, (q % 3 - 1) * 0.035, 0]);
        const pathGeo = b.build().geo; temporary.push(pathGeo);
        g.add(new THREE.Mesh(pathGeo, MAT.main));
      } else {
        const m = getModel(type, type === 'house' ? 0 : type === 'flowers' ? 1 : 0);
        g.add(new THREE.Mesh(m.geo, MAT.build));
        if (m.glow) g.add(new THREE.Mesh(m.glow, glow));
        if (type === 'windmill') { const bl = new THREE.Mesh(cachedGeo('blades', mBlades), MAT.main); bl.position.set(0, 1.6, 0.6); bl.rotation.z = 0.4; g.add(bl); }
        if (type === 'farm') { const cr = new THREE.Mesh(cachedGeo('crops', mCrops), crops); g.add(cr); }
      }
      sc.add(g);
      const box = new THREE.Box3().setFromObject(g), c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
      cam.position.set(c.x + 6, c.y + 5.2, c.z + 7.5); cam.lookAt(c); cam.updateMatrixWorld(true);
      // Fit the actual camera-space silhouette, keeping tall landmarks and broad farms equally legible.
      let extent = 0;
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
        p.set(x, y, z).applyMatrix4(cam.matrixWorldInverse); extent = Math.max(extent, Math.abs(p.x), Math.abs(p.y));
      }
      const rad = Math.max(0.3, extent * 1.12);
      cam.left = -rad; cam.right = rad; cam.top = rad; cam.bottom = -rad; cam.updateProjectionMatrix();
      shadow.position.set(c.x, box.min.y - 0.012, c.z);
      shadow.scale.set(Math.max(0.7, size.x * 1.2), Math.max(0.7, size.z * 1.2), 1);
      r.render(sc, cam);
      UIS.thumbs[type] = r.domElement.toDataURL('image/png');
      sc.remove(g);
    }
  } catch (e) { /* buttons fall back to text only */ }
  for (const o of temporary) o.dispose();
  r.dispose(); if (r.forceContextLoss) r.forceContextLoss();
}

// ----- HUD -----
const costHtml = (cost) => Object.keys(cost || {}).map((r) => '<span class="cost' + (G.res[r] < cost[r] ? ' lack' : '') + '">' + ic(r) + cost[r] + '</span>').join('');
function buildBar() {
  $('tabs').innerHTML = CATS.map((c) => '<button type="button" role="tab" data-tab="' + c[0] + '" aria-selected="' + (UIS.tab === c[0]) + '">' + c[1] + '</button>').join('');
  $('items').innerHTML = Object.keys(BT).filter((t) => BT[t].cat === UIS.tab).map((t) => {
    const d = BT[t], th = UIS.thumbs[t];
    return '<button type="button" class="item" data-type="' + t + '">' + (th ? '<img alt="" src="' + th + '">' : '<span class="noimg"></span>') +
      '<span class="nm">' + d.name + '</span><span class="lock" hidden></span><span class="costs">' + costHtml(d.cost) + '</span></button>';
  }).join('');
  $('items').scrollLeft = 0;
}
function refreshBar() {
  for (const el of document.querySelectorAll('#items .item')) {
    const t = el.dataset.type, d = BT[t], lock = lockReason(t);
    el.classList.toggle('poor', !!lock || !canAfford(d.cost));
    el.classList.toggle('on', !!UIS.build && UIS.build.type === t);
    const lk = el.querySelector('.lock'), cs = el.querySelector('.costs');
    lk.hidden = !lock; cs.hidden = !!lock;
    if (lock) lk.textContent = lock; else { const h = costHtml(d.cost); if (cs.dataset.h !== h) { cs.innerHTML = h; cs.dataset.h = h; } }
  }
}
function refreshTop() {
  const show = { wood: 1, stone: 1, food: 1, grain: G.res.grain > 0 || countDone('farm') > 0, honey: G.res.honey > 0 || countDone('apiary') > 0, wool: G.res.wool > 0 || countDone('pasture') > 0, cloth: G.res.cloth > 0 || countDone('weaver') > 0, brick: G.res.brick > 0 || countDone('brickworks') > 0, cider: G.res.cider > 0 || countDone('ciderpress') > 0, coins: G.res.coins > 0 || countDone('market') > 0 };
  for (const r of NEW_RES) show[r] = G.res[r] > 0;
  for (const r of Object.keys(RES)) {
    const el = $('r-' + r);
    el.hidden = !show[r];
    const n = Math.floor(G.res[r]), tx = el.querySelector('b');
    el.classList.toggle('full', n >= capOf(r));
    if (tx.textContent !== String(n)) { tx.textContent = n; if (UIS.shown[r] !== undefined && n > UIS.shown[r]) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } }
    UIS.shown[r] = n;
  }
  $('r-food').classList.toggle('warn', G.hungry || G.res.food < G.villagers.length * 2);
  $('r-pop').querySelector('b').textContent = G.villagers.length + '/' + bedCount();
  $('r-happy').querySelector('b').textContent = Math.round(G.happy) + '%';
  $('r-happy').classList.toggle('warn', G.happy < 40);
  const h = (5 + G.time * 24) % 24, hh = Math.floor(h), mm = Math.floor((h - hh) * 6) * 10;
  $('day').textContent = SEASONS[G.season] + ' \u00b7 day ' + G.day;
  $('r-rp').hidden = !G.rp && !countDone('academy'); $('r-rp').querySelector('b').textContent = G.rp;
  $('c-undo').hidden = !canUndo();
  $('time').textContent = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
  $('clock').classList.toggle('night', isNight());
  const qc = $('quest');
  $('q-n').textContent = lifeCardText(LEVELS[G.level].name + ' \u00b7 ' + G.quest + ' of ' + QUESTS.length + ' goals');
  setH('q-list', TRACKS.map((t) => {
    const q = goalOf(t);
    if (!q) return '<span class="qg done"><i>' + t.name + '</i><span class="qx">All done</span></span>';
    const p = q.prog();
    return '<span class="qg"><i>' + t.name + '</i><span class="qx">' + q.text + '</span><b>' + Math.min(p[0], p[1]) + '/' + p[1] + '</b></span>';
  }).join(''));
  qc.hidden = !G.started;
  const nm = G.missions.length, rdy = G.missions.some((m) => G.res[m.res] >= m.n), rq = $('q-req');
  rq.hidden = !nm; rq.textContent = nm + (nm === 1 ? ' request' : ' requests') + (rdy ? ' \u00b7 ready to deliver' : ''); rq.classList.toggle('ready', rdy);
}
function refreshPlace() {
  const B = UIS.build, el = $('place');
  el.hidden = !B;
  if (!B) return;
  // the chosen spot is judged again while you wait: once the wood or stone has come in, Place works straight away
  if (B.has && placeReason(B, B.i, B.j) !== B.reason) setGhostAt(B.i, B.j);
  const d = BT[B.type];
  $('p-name').textContent = d.name; $('p-desc').textContent = d.desc;
  const ch = costHtml(d.cost); if ($('p-cost').dataset.h !== ch) { $('p-cost').innerHTML = ch; $('p-cost').dataset.h = ch; }
  const lock = lockReason(B.type);
  const few = B.has && !B.reason && B.reach && B.reach[0] < 4;
  const good = B.reach ? (few ? 'Only ' : '') + B.reach[0] + ' ' + B.reach[1] + ' in reach' : 'Good spot';
  const msg = lock || (B.has ? B.reason : null) || (!B.has ? (UIS.touch ? 'Tap the island to pick a spot' : 'Click the island to place it') : good + (UIS.touch && !d.quick ? '. Tap Place.' : ''));
  $('p-msg').textContent = msg; $('p-msg').classList.toggle('bad', !!(lock || (B.has && B.reason) || few));
  $('p-rot').hidden = d.size === 1 && B.type !== 'lantern' && B.type !== 'bench';
  $('p-ok').hidden = !(UIS.touch && !d.quick);
  $('p-ok').disabled = !B.has || !!B.reason;
}

// ----- side panel -----
function closePanel() { $('panel').hidden = true; UIS.panel = null; }
function openPanel(kind, ref, title, sub, body, update) {
  $('pn-title').textContent = title; $('pn-sub').textContent = sub || '';
  $('pn-body').innerHTML = body; $('panel').hidden = false; $('pn-body').scrollTop = 0;
  UIS.panel = { kind, ref, update, at: performance.now() };
  if (update) update();
}
const stepper = (id, label) => '<div class="row"><span class="grow" id="' + id + '-l">' + label + '</span><button type="button" class="sq" id="' + id + '-m" aria-label="Fewer">' + ic('minus') + '</button><b class="cnt" id="' + id + '-n">0</b><button type="button" class="sq plus" id="' + id + '-p" aria-label="More">' + ic('plus') + '</button></div>';
function openBuildingPanel(b) {
  const d = b.def, up = UPGRADES[b.type];
  let h = '<p class="status" id="b-status"></p>';
  if (d.job) h += stepper('bw', JOBS[d.job].plural) + '<p class="note" id="b-free"></p>';
  if (b.type === 'farm') h += '<div class="bar"><i id="b-grow"></i></div>';
  if (d.beds) h += '<p class="note" id="b-res"></p>';
  if (b.type === 'market') h += '<div class="trades" id="b-trades">' + TRADES.map((t, n) => '<button type="button" class="trade" data-trade="' + n + '">' + ic(t.give) + t.n + '<span class="arr">&rarr;</span>' + ic(t.get) + t.m + '</button>').join('') + '</div>';
  if (b.type === 'academy') h += '<h3>Research</h3><p class="note" id="b-rp"></p><div id="b-tech"></div>';
  if (b.type === 'townhall') h += '<h3>Town improvements</h3><div id="b-civic"></div>';
  if (b.type === 'shipyard') h += '<h3>Expedition</h3><p class="note" id="b-exp"></p><div class="row"><span class="grow pline" id="b-expc"></span><button type="button" class="btn" id="b-expgo">Set sail</button></div>';
  if (d.storage) h += '<p class="note" id="b-cap"></p>';
  h += lifePanelHtml(b);
  if (up) h += '<div id="b-up"></div>';
  if (b.type !== 'center') h += '<div class="row end"><button type="button" class="btn ghost" id="b-demo">Demolish</button></div>';
  openPanel('b', b, nameOf(b), d.job ? 'Workplace' : d.beds ? 'Home' : d.storage ? 'Storage' : 'Village', h, () => {
    $('pn-title').textContent = nameOf(b);
    const slots = slotsOf(b);
    let st = b.up ? up.desc : d.desc;
    if (!b.done) st = 'Under construction: ' + Math.round(b.progress * 100) + '%' + (b.builders ? '' : '. Waiting for a free villager.');
    else if (b.warn && b.workers.length) st = b.warn;
    else if (d.job && !b.workers.length) st = 'Nobody works here yet. Add a villager.';
    else if (b.type === 'apiary') st = b.bonus ? 'The bees are thriving: double honey.' : d.desc;
    $('b-status').textContent = st; $('b-status').classList.toggle('bad', !!(b.done && ((b.warn && b.workers.length) || (d.job && !b.workers.length))));
    if (d.job) {
      const freeV = G.villagers.filter((v) => !v.job && !v.child), free = freeV.length, gift = freeV.filter((v) => v.talent === d.job).length;
      $('bw-n').textContent = b.workers.length + '/' + slots;
      $('bw-m').disabled = !b.workers.length; $('bw-p').disabled = !b.done || b.workers.length >= slots || !free;
      $('b-free').textContent = !b.done ? 'Workers can start once it is built.' : b.workers.length >= slots ? 'Fully staffed. Minus sends a villager back to building.'
        : free ? free + ' free villager' + (free === 1 ? '' : 's') + ' available' + (gift ? ', ' + gift + ' with a talent for this job' : '') + '. Plus puts one to work here.' : 'No free villagers. Take someone off another job or build cottages.';
    }
    lifePanelUpdate(b);
    if (b.type === 'farm') $('b-grow').style.width = Math.round(b.growth * 100) + '%';
    if (d.beds) $('b-res').textContent = b.type === 'center' ? 'Tents for 4 villagers without a cottage.' : 'Residents (' + b.residents.length + '/' + bedsOf(b) + '): ' + (b.residents.map((v) => v.name).join(', ') || 'nobody yet');
    if (b.type === 'market') {
      const ok = b.done && b.workers.length > 0;
      for (const el of document.querySelectorAll('#b-trades .trade')) { const t = TRADES[+el.dataset.trade]; el.disabled = !ok || !canAfford({ [t.give]: t.n }); }
    }
    if (b.type === 'academy') {
      $('b-rp').textContent = 'Insight: ' + G.rp + '. Every scholar adds 1 insight every few moments.';
      setH('b-tech', TECHS.map((t) => {
        const blk = techBlock(t), got = !!G.tech[t.id], lost = !!(t.alt && G.tech[t.alt]);
        const head = t.alt && TECHS.indexOf(t) < TECHS.findIndex((q) => q.id === t.alt) ? '<p class="note pick">Choose one of these two:</p>' : '';
        return head + '<div class="tech' + (got ? ' got' : lost ? ' lost' : '') + '"><div class="grow"><b>' + t.name + '</b><span>' + t.desc + '</span>' + (!got && t.need && !G.tech[t.need] ? '<span class="why">' + blk + '</span>' : '') + '</div>' +
          (got ? '<span class="tick">Done</span>' : lost ? '<span class="tick no">Not chosen</span>' : '<button type="button" class="btn" data-tech="' + t.id + '"' + (blk ? ' disabled' : '') + '><span class="cost">' + ic('rp') + t.cost + '</span><span class="cost">' + ic('coins') + t.coins + '</span></button>') + '</div>';
      }).join(''));
    }
    if (b.type === 'townhall') setH('b-civic', !b.done ? '' : CIVICS.map((c) => '<div class="tech' + (G.civic[c.id] ? ' got' : '') + '"><div class="grow"><b>' + c.name + '</b><span>' + c.desc + '</span></div>' + (G.civic[c.id] ? '<span class="tick">Done</span>' : '<button type="button" class="btn" data-civic="' + c.id + '"' + (canAfford({ coins: c.cost }) ? '' : ' disabled') + '><span class="cost">' + ic('coins') + c.cost + '</span></button>') + '</div>').join(''));
    if (b.type === 'shipyard') { const blk = !b.done ? 'none' : expBlock(); $('b-exp').textContent = !b.done ? '' : blk || 'Ready to sail. The ship is away for a little over a day and comes home with coins and a treasure.'; setH('b-expc', costHtml(EXP_COST)); $('b-expgo').disabled = !!blk; }
    if (d.storage) $('b-cap').textContent = 'The village can store ' + capOf('wood') + ' each of wood, stone, food and grain, and ' + capOf('honey') + ' of finer goods. Every Storehouse adds room.';
    if (up) {
      const blk = upgradeBlock(b);
      setH('b-up', b.up || !b.done ? '' : '<h3>Upgrade</h3><p class="note"><b>' + up.name + '</b>: ' + up.desc + '</p><div class="row"><span class="grow pline">' + costHtml(up.cost) + '</span><button type="button" class="btn" id="b-upg"' + (blk ? ' disabled' : '') + '>Upgrade</button></div>' + (blk ? '<p class="note">' + blk + '</p>' : ''));
    }
  });
}
function openSitePanel(s) {
  const K = SITE_KINDS[s.kind];
  openPanel('s', s, K.name, 'Old site', '<p class="status">' + K.text + '</p><p class="note" id="s-note"></p><div class="row end"><button type="button" class="btn" id="s-go">Send an explorer</button></div>', () => {
    const blk = exploreBlock(s);
    $('s-note').textContent = blk || 'A villager will walk there and take a careful look.';
    $('s-go').disabled = !!blk; $('s-go').hidden = s.found;
  });
}
function showLetter(ch) {
  $('l-who').textContent = 'A letter from ' + ch.who; $('l-title').textContent = ch.title; $('l-text').textContent = ch.text; $('l-task').textContent = ch.task + '.';
  openModal('letter');
}
// ----- undo, photo mode, settings -----
function canUndo() { return UIS.undo.some((u) => G.bmap.has(u.id) && (!u.b.done || u.b.def.flat)); }
function undoLast() {
  while (UIS.undo.length) {
    const u = UIS.undo.pop(), b = u.b;
    if (!G.bmap.has(u.id) || (b.done && !b.def.flat)) continue;
    demolish(b, true); toast('Undone: ' + b.def.name + '. Everything was refunded.', '');
    if (UIS.sel && UIS.sel.ref === b) select(null);
    uiDirty(); return true;
  }
  return false;
}
function photoMode(on) {
  UIS.photo = on; document.body.classList.toggle('photo', on);
  if (on) { closeModal(); stopBuild(); select(null); closePanel(); UIS.photoTime = G.time; UIS.photoPaused = UIS.paused; UIS.paused = true; $('ph-time').value = String(Math.round(G.time * 100)); }
  else { G.time = UIS.photoTime; CAM.tilt = 0; setSpeed(UIS.photoPaused ? 0 : UIS.speed); }
}
function refreshSettingsUI() {
  $('m-gfx').textContent = 'Graphics: ' + (SET.gfx === 'low' ? 'light (faster)' : SET.gfx === 'mid' ? 'plain' : 'beautiful');
  $('m-big').textContent = 'Text size: ' + (SET.big ? 'large' : 'normal');
  $('m-lang').textContent = 'Language: ' + (SET.lang === 'nl' ? 'Nederlands' : 'English');
}
function openVillagerPanel(v) {
  let h = '<p class="status" id="v-say"></p><p class="note" id="v-home"></p>' + lifeVillagerHtml() + '<div class="chips" id="v-jobs"></div><div class="row end"><button type="button" class="btn ghost" id="v-follow">Follow</button><button type="button" class="btn ghost" id="v-free">Set free</button></div>';
  openPanel('v', v, v.name, '', h, () => {
    $('pn-sub').textContent = JOBS[v.job ? v.job.def.job : 'free'].title;
    $('v-say').textContent = v.say + (G.hungry ? ' (hungry)' : '');
    $('v-home').textContent = (v.home ? 'Lives in a cottage.' : 'Sleeps in a tent on the green.') + ' Has a talent for ' + JOBS[v.talent].title.toLowerCase() + ' work' + (v.job && v.job.def.job === v.talent ? ' and works 30% faster here.' : '.');
    lifeVillagerUpdate(v);
    $('v-free').hidden = !v.job;
    $('v-follow').setAttribute('aria-pressed', String(CAM.follow === v));
    const open = {};
    if (!v.child) for (const b of G.buildings) if (b.done && b.def.job && b.workers.length < slotsOf(b) && b !== v.job) open[b.def.job] = 1;
    const html = Object.keys(open).map((j) => '<button type="button" class="chip" data-job="' + j + '">Become a ' + JOBS[j].title.toLowerCase() + '</button>').join('');
    const box = $('v-jobs'); if (box.dataset.h !== html) { box.innerHTML = html; box.dataset.h = html; }
  });
}
function openPeoplePanel() {
  select(null); UIS.sawPeople = true;
  const jobs = Object.keys(JOBS).filter((j) => j !== 'free');
  let h = '<div class="row"><span class="grow">Free (builders)</span><b class="cnt" id="pj-free">0</b></div>';
  for (const j of jobs) h += '<div id="pj-' + j + '-row">' + stepper('pj-' + j, JOBS[j].plural) + '</div>';
  h += '<p class="note">Free villagers build whatever you place.</p><div class="list" id="p-list"></div>';
  openPanel('people', null, 'Villagers', '', h, () => {
    $('pn-sub').textContent = G.villagers.length + ' villagers, ' + bedCount() + ' beds';
    const free = G.villagers.filter((v) => !v.job && !v.child).length;
    $('pj-free').textContent = free;
    for (const j of jobs) {
      const bs = G.buildings.filter((b) => b.done && b.def.job === j), slots = bs.reduce((n, b) => n + slotsOf(b), 0), n = jobCount(j);
      $('pj-' + j + '-row').hidden = !bs.length;
      $('pj-' + j + '-n').textContent = n + '/' + slots; $('pj-' + j + '-m').disabled = !n; $('pj-' + j + '-p').disabled = n >= slots || !free;
    }
    const html = G.villagers.map((v, n) => '<button type="button" class="person" data-v="' + n + '"><b>' + v.name + '</b><span>' + JOBS[v.job ? v.job.def.job : 'free'].title + (v.job && v.job.def.job === v.talent ? ' \u2605' : '') + '</span></button>').join('');
    const box = $('p-list'); if (box.dataset.h !== html) { box.innerHTML = html; box.dataset.h = html; }
  });
}
function openHappyPanel() {
  select(null);
  openPanel('happy', null, 'Happiness', '', '<div id="h-parts"></div><p class="note">Happy villagers work faster, and new settlers only come to a pleasant village.</p>', () => {
    $('pn-sub').textContent = Math.round(G.happy) + '% content';
    const html = '<div class="row"><span class="grow">Base</span><b class="cnt">45</b></div>' + G.happyParts.map((p) => '<div class="row"><span class="grow">' + p[0] + '</span><b class="cnt ' + (p[1] < 0 ? 'neg' : '') + '">' + (p[1] > 0 ? '+' : '') + p[1] + '</b></div>').join('');
    const box = $('h-parts'); if (box.dataset.h !== html) { box.innerHTML = html; box.dataset.h = html; }
  });
}
const setH = (id, html) => { const el = $(id); if (el.dataset.h !== html) { el.innerHTML = html; el.dataset.h = html; } };
function openVillagePanel() {
  select(null);
  const h = '<div id="vl-scn"></div><div id="vl-daily"></div><div id="vl-needs"></div><p class="note" id="vl-unlocks"></p><div id="vl-story"></div>' +
    '<h3>Goals</h3><div id="vl-goals"></div>' +
    '<h3>Requests</h3><div id="vl-missions"></div>' +
    '<h3>Festival</h3><p class="note" id="vl-fest-note"></p><div class="row end"><button type="button" class="btn" id="vl-fest">Hold a festival</button></div>' +
    '<h3>Badges</h3><div class="badges" id="vl-badges"></div><h3>Almanac</h3><div class="alms" id="vl-alm"></div><h3>News</h3><div id="vl-news"></div>';
  openPanel('village', null, 'Bumblenook', '', h, () => {
    $('pn-sub').textContent = LEVELS[G.level].name + ' \u00b7 ' + SEASONS[G.season].toLowerCase() + ', day ' + G.day;
    lifeVillageUpdate();
    const D = G.daily, best = D ? dailyBest(D.date) : null;
    setH('vl-daily', D ? '<h3>Daily island</h3><p class="status">' + DAILY_GOALS[D.goal].text + (D.done ? ': done in ' + D.score.toFixed(1) + ' days!' : ' as fast as you can.') + '</p><p class="note">' + (best !== null ? 'Your best today: ' + best.toFixed(1) + ' days.' : 'Everyone gets the same island today.') + '</p>' : '');
    const ch = STORY[G.story], sp = ch && G.storyOn ? ch.prog() : null;
    setH('vl-story', G.mode !== 'normal' ? '' : sp ? '<h3>Letter from ' + ch.who + '</h3><p class="status">' + ch.title + '</p><p class="note">' + ch.task + ' (' + Math.max(0, Math.min(sp[0], sp[1])) + '/' + sp[1] + ')</p><div class="row end"><button type="button" class="btn ghost" id="vl-letter">Read the letter</button></div>'
      : !ch ? '<h3>Letters</h3><p class="note">Every letter has been answered. Thank you, from all of us.</p>' : '');
    setH('vl-alm', '<p class="note">Fish caught: ' + FISH.filter((f) => G.fish[f.id]).length + ' of ' + FISH.length + '</p>' + FISH.map((f) => '<span class="alm' + (G.fish[f.id] ? ' got' : '') + '">' + (G.fish[f.id] ? f.name + ' \u00d7' + G.fish[f.id] : '?') + '</span>').join('') +
      '<p class="note">Old sites explored: ' + W.sites.filter((q) => q.found).length + ' of ' + W.sites.length + '</p>' + W.sites.map((q) => '<span class="alm' + (q.found ? ' got' : '') + '">' + (q.found ? SITE_KINDS[q.kind].name : '?') + '</span>').join('') +
      (countDone('shipyard') || Object.keys(G.treasure).length ? '<p class="note">Treasures brought home: ' + Object.keys(G.treasure).length + ' of ' + TREASURES.length + '</p>' + TREASURES.map((q) => '<span class="alm' + (G.treasure[q.id] ? ' got' : '') + '">' + (G.treasure[q.id] ? q.name : '?') + '</span>').join('') : ''));
    setH('vl-news', G.news.length ? G.news.map((q) => '<p class="note">' + q + '</p>').join('') : '<p class="note">Nothing to report yet.</p>');
    const nx = G.level + 1, more = nx < LEVELS.length;
    setH('vl-needs', more ? '<p class="status">Next: <b>' + LEVELS[nx].name + '</b></p>' + levelNeeds(nx).map((r) => '<div class="need"><span class="grow">' + r[0] + '</span><span class="bar"><i style="width:' + Math.round(clamp(r[1] / r[2] * 100, 0, 100)) + '%"></i></span><b class="cnt">' + Math.min(r[1], r[2]) + '/' + r[2] + '</b></div>').join('')
      : '<p class="status">Bumblenook is as grand as a harbour town gets.</p>');
    const un = more ? unlocksAt(nx) : [];
    $('vl-unlocks').textContent = un.length ? 'Unlocks: ' + un.join(', ') + '.' : '';
    setH('vl-goals', TRACKS.map((t) => {
      const q = goalOf(t);
      if (!q) return '<div class="goal done"><b>' + t.name + '</b><p class="note">Every goal on this path is done.</p></div>';
      const p = q.prog();
      return '<div class="goal"><b>' + t.name + '</b><p class="status">' + q.text + '</p><div class="need"><span class="bar"><i style="width:' + Math.round(clamp(p[0] / p[1] * 100, 0, 100)) + '%"></i></span><b class="cnt">' + Math.min(p[0], p[1]) + '/' + p[1] + '</b></div><p class="note">' + q.hint + '</p></div>';
    }).join(''));
    setH('vl-missions', G.missions.length ? G.missions.map((m) => {
      const left = m.ship ? 'Until the ship sails' : m.until - G.clock > DAY_LEN ? '2 days left' : 'Until tomorrow';
      return '<div class="mis"><p>' + m.text + '</p><div class="row"><span class="grow note">' + left + '</span><span class="cost' + (G.res[m.res] < m.n ? ' lack' : '') + '">' + ic(m.res) + m.n + '</span><span class="arr">&rarr;</span><span class="cost">' + ic('coins') + m.coins + '</span>' +
        '<button type="button" class="btn" data-mission="' + m.id + '"' + (G.res[m.res] < m.n ? ' disabled' : '') + '>Deliver</button></div></div>';
    }).join('') : '<p class="note">' + (G.level < 1 ? 'Villagers start asking for things once the camp is a Hamlet.' : 'Nobody is asking for anything right now. Check back soon.') + '</p>');
    const fb = festivalBlock();
    $('vl-fest-note').textContent = fb || 'Costs 30 food and 5 honey. Lifts happiness by 15 for most of a day, with fireworks.';
    $('vl-fest').disabled = !!fb; $('vl-fest').textContent = G.season === 3 ? 'Hold a Winter Fair' : 'Hold a festival';
    if (!fb && G.season === 3) $('vl-fest-note').textContent = 'In winter this is a Winter Fair: the same cost, 20 extra happiness and coins from visitors.';
    setH('vl-badges', ACH.map((a) => '<div class="badge' + (G.ach[a.id] ? ' got' : '') + '"><b>' + a.name + '</b><span>' + a.desc + '</span></div>').join(''));
  });
}
function jobStep(job, dir) {
  const bs = G.buildings.filter((b) => b.done && b.def.job === job);
  if (dir > 0) { const b = bs.find((q) => q.workers.length < slotsOf(q)); if (b && assignWorker(b)) sfx('click'); else sfx('error'); }
  else { const b = bs.slice().reverse().find((q) => q.workers.length); if (b && unassignWorker(b)) sfx('click'); }
  uiDirty();
}
function initPanelEvents() {
  $('panel').addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    const P = UIS.panel; if (!P || performance.now() - P.at < 320) return;
    if (t.id === 'pn-close') { if (UIS.sel) select(null); else closePanel(); return; }
    if (P.kind === 'b') {
      const b = P.ref;
      if (lifePanelClick(t)) { /* handled */ }
      else if (t.id === 'bw-p') { if (assignWorker(b)) sfx('click'); else sfx('error'); }
      else if (t.id === 'bw-m') { if (unassignWorker(b)) sfx('click'); }
      else if (t.dataset.trade) doTrade(TRADES[+t.dataset.trade]);
      else if (t.dataset.tech) research(t.dataset.tech);
      else if (t.dataset.civic) buyCivic(t.dataset.civic);
      else if (t.id === 'b-expgo') startExpedition();
      else if (t.id === 'b-upg') upgradeBuilding(b);
      else if (t.id === 'b-demo') {
        if (t.dataset.sure) { demolish(b); select(null); }
        else { t.dataset.sure = '1'; t.textContent = 'Sure? Tap again'; t.classList.add('danger'); setTimeout(() => { if (t.isConnected) { delete t.dataset.sure; t.textContent = 'Demolish'; t.classList.remove('danger'); } }, 3000); }
      }
    } else if (P.kind === 'v') {
      const v = P.ref;
      if (t.id === 'v-free' && v.job) { unassignWorker(v.job, v); sfx('click'); }
      else if (t.id === 'v-follow') { CAM.follow = CAM.follow === v ? null : v; if (CAM.follow) CAM.gd = Math.min(CAM.gd, 16); }
      else if (t.dataset.job) {
        let best = null, bd = 1e9;
        for (const b of G.buildings) { if (!b.done || b.def.job !== t.dataset.job || b.workers.length >= slotsOf(b)) continue; const d = dist2(b.cx, b.cz, v.x, v.z); if (d < bd) { bd = d; best = b; } }
        if (best && assignWorker(best, v)) sfx('click');
      }
    } else if (P.kind === 's') {
      if (t.id === 's-go') exploreSite(P.ref);
    } else if (P.kind === 'village') {
      if (t.id === 'vl-letter' && STORY[G.story]) { showLetter(STORY[G.story]); return; }
      if (t.dataset.mission) { const m = G.missions.find((q) => q.id === +t.dataset.mission); if (m) deliverMission(m); }
      else if (t.id === 'vl-fest') holdFestival();
    } else if (P.kind === 'people') {
      if (t.dataset.v) { const v = G.villagers[+t.dataset.v]; if (v) { select({ kind: 'v', ref: v }); focusOn(v.x, v.z, 18); } return; }
      const m = /^pj-(\w+)-([mp])$/.exec(t.id); if (m) jobStep(m[1], m[2] === 'p' ? 1 : -1);
    }
    uiDirty();
  });
}

// ----- modal: menu and help -----
function closeModal() { if (G.pending && !$('m-event').hidden) return; $('modal').hidden = true; }       // an event waits for an answer
function openModal(which) {
  $('m-menu').hidden = which !== 'menu'; $('m-help').hidden = which !== 'help'; $('m-win').hidden = which !== 'win'; $('m-letter').hidden = which !== 'letter'; $('m-final').hidden = which !== 'final'; $('m-event').hidden = which !== 'event'; $('m-chal').hidden = which !== 'chal';
  refreshSettingsUI(); translateDom();
  $('modal').hidden = false;
  $('m-sound').setAttribute('aria-pressed', String(AU.soundOn)); $('m-music').setAttribute('aria-pressed', String(AU.musicOn));
}
function winMoment() { setTimeout(() => { openModal('win'); }, 2500); }
function enterGame() {
  G.started = true; CAM.attract = false; if (!UIS.hadSave) CAM.gd = 22;
  $('start').hidden = true; $('hud').hidden = false;
  document.body.classList.add('playing');
  buildBar(); setSpeed(1); uiDirty();
  if (G.pending) showChoice();
}
function initHud() {
  $('tabs').addEventListener('click', (e) => { const t = e.target.closest('button'); if (!t) return; UIS.tab = t.dataset.tab; buildBar(); uiDirty(); sfx('click'); });
  $('items').addEventListener('click', (e) => { const t = e.target.closest('.item'); if (t) startBuild(t.dataset.type); });
  $('p-rot').addEventListener('click', rotateGhost);
  $('p-stop').addEventListener('click', () => { stopBuild(); sfx('click'); });
  $('p-ok').addEventListener('click', () => confirmBuild(false));
  $('speed').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) { setSpeed(+t.dataset.s); sfx('click'); } });
  $('res').addEventListener('click', (e) => { const t = e.target.closest('.rc'); if (!t || t.id === 'r-pop' || t.id === 'r-happy') return; if (UIS.panel && UIS.panel.kind === 'ledger') closePanel(); else openLedgerPanel(); sfx('click'); });
  $('r-pop').addEventListener('click', () => { if (UIS.panel && UIS.panel.kind === 'people') closePanel(); else openPeoplePanel(); sfx('click'); });
  $('r-happy').addEventListener('click', () => { if (UIS.panel && UIS.panel.kind === 'happy') closePanel(); else openHappyPanel(); sfx('click'); });
  $('quest').addEventListener('click', () => { if (UIS.panel && UIS.panel.kind === 'village') closePanel(); else openVillagePanel(); sfx('click'); });
  $('c-l').addEventListener('click', () => { CAM.gyaw += Math.PI / 4; });
  $('c-r').addEventListener('click', () => { CAM.gyaw -= Math.PI / 4; });
  $('c-in').addEventListener('click', () => zoomBy(0.75));
  $('c-out').addEventListener('click', () => zoomBy(1.33));
  $('menu').addEventListener('click', () => { openModal('menu'); sfx('click'); });
  $('modal').addEventListener('click', (e) => {
    if (e.target === $('modal')) { closeModal(); return; }
    const t = e.target.closest('button'); if (!t) return;
    const a = t.dataset.act;
    if (t.dataset.scn) { startScenario(t.dataset.scn); return; }
    if (a === 'ev0' || a === 'ev1') { const n = a === 'ev1' ? 1 : 0; $('m-event').hidden = true; resolveChoice(n); closeModal(); return; }
    if (a === 'close') closeModal();
    else if (a === 'help') openModal('help');
    else if (a === 'back') openModal('menu');
    else if (a === 'sound') { setSound(!AU.soundOn); t.setAttribute('aria-pressed', String(AU.soundOn)); }
    else if (a === 'music') { setMusic(!AU.musicOn); t.setAttribute('aria-pressed', String(AU.musicOn)); }
    else if (a === 'save') { toast(saveGame() ? 'Village saved in this browser.' : 'Saving isn\'t possible here.', 'good'); closeModal(); }
    else if (a === 'full') { const el = document.documentElement; try { if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen().catch(() => toast('Full screen isn\'t available here.', 'bad')); else toast('Full screen isn\'t available here.', 'bad'); } catch (er) { /* optional */ } closeModal(); }
    else if (a === 'gfx') { SET.gfx = SET.gfx === 'high' ? 'mid' : SET.gfx === 'mid' ? 'low' : 'high'; SET.gfxSet = true; saveSettings(); applySettings(); refreshSettingsUI(); }
    else if (a === 'big') { SET.big = !SET.big; saveSettings(); applySettings(); refreshSettingsUI(); }
    else if (a === 'lang') { SET.lang = SET.lang === 'nl' ? 'en' : 'nl'; _i18nDirty = true; TUT.key = ''; saveSettings(); applySettings(); refreshSettingsUI(); if (G.started) refreshUI(); translateDom(); }
    else if (a === 'photo') photoMode(true);
    else if (a === 'new') {
      if (t.dataset.sure) { const md = G.mode; closeModal(); stopBuild(); select(null); closePanel(); clearSave(md); UIS.undo.length = 0; newGame(md === 'daily' ? dailySeed(todayKey()) : (Math.random() * 1e6) | 0, md); centerCamera(); G.started = true; buildBar(); uiDirty(); toast('A fresh island. Have fun!', 'good'); }
      else { t.dataset.sure = '1'; t.textContent = 'Sure? Your current village will be lost'; setTimeout(() => { delete t.dataset.sure; t.textContent = 'New island'; }, 3500); }
    }
    sfx('click');
  });
  $('s-new').addEventListener('click', () => { audioInit(); clearSave('normal'); UIS.hadSave = false; newGame((Math.random() * 1e6) | 0, 'normal'); centerCamera(); enterGame(); sfx('done'); });
  const startMode = (mode) => {
    audioInit();
    const sv = readSave(mode);
    if (sv) { try { loadGame(sv); UIS.hadSave = true; } catch (e) { UIS.hadSave = false; } } else UIS.hadSave = false;
    if (!UIS.hadSave) { newGame(mode === 'daily' ? dailySeed(todayKey()) : (Math.random() * 1e6) | 0, mode); centerCamera(); }
    enterGame(); sfx('done');
    toast(mode === 'daily' ? 'Daily island: ' + DAILY_GOALS[G.daily.goal].text + ' as fast as you can.' : 'Sandbox: everything is unlocked and free. Build whatever you like.', 'quest');
  };
  $('s-daily').addEventListener('click', () => startMode('daily'));
  $('s-sand').addEventListener('click', () => startMode('sandbox'));
  $('s-chal').addEventListener('click', () => { openChallenges(); sfx('click'); });
  $('c-undo').addEventListener('click', () => { if (!undoLast()) sfx('error'); });
  $('ph-exit').addEventListener('click', () => photoMode(false));
  $('ph-up').addEventListener('click', () => { CAM.tilt = clamp((CAM.tilt || 0) - 0.12, -0.5, 0.5); });
  $('ph-down').addEventListener('click', () => { CAM.tilt = clamp((CAM.tilt || 0) + 0.12, -0.5, 0.5); });
  $('ph-time').addEventListener('input', (e) => { G.time = clamp(+e.target.value / 100, 0, 0.99); });
  $('s-cont').addEventListener('click', () => { audioInit(); enterGame(); sfx('done'); });
  initPanelEvents(); initTutorial();
}
function centerCamera() { const c = G.center; CAM.gx = CAM.tx = c.cx; CAM.gz = CAM.tz = c.cz; CAM.gd = CAM.dist = 22; }
function refreshUI() {
  refreshTop(); refreshBar(); refreshPlace();
  if (UIS.panel && UIS.panel.update) UIS.panel.update();
  refreshLabels(); tutUpdate(); translateDom();
  UIS.dirty = false;
}
