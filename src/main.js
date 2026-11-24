// ---------- main: boot + frame loop ----------
let _last = 0, _abs = 0, _uiT = 0, _saveT = 0, _shadowR = 0;
function stepSim(h) {
  G.time += h / DAY_LEN;
  if (G.time >= 1) { G.time -= 1; newDay(); }
  simTick(h);
  for (let q = 0; q < G.villagers.length; q++) updateVillager(G.villagers[q], h);
  separate(h);
}
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setPixelRatio(SET.gfx === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, UIS.coarse ? 1.75 : 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.fov = w < h ? Math.min(52, 32 / Math.sqrt(w / h)) : 32;
  camera.updateProjectionMatrix();
  gfxResize();
}
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - _last) / 1000 || 0.016); _last = now; _abs += dt;
  keyCamera(dt); updateCamera(dt);
  const sp = G.started ? (UIS.paused || G.pending ? 0 : UIS.speed) : G.demo ? 1 : 0;      // the village waits while you decide on an event
  if (sp > 0) {
    const asleep = isNight() && G.villagers.length > 0 && G.villagers.every((v) => v.state === 'sleep');
    let rem = dt * sp * (asleep ? 4 : 1);
    while (rem > 1e-5) { const h = Math.min(rem, 0.05); stepSim(h); rem -= h; }
  }
  const adt = sp > 0 ? dt * Math.min(sp, 2.2) : G.started ? 0 : dt;
  if (G.started) { positionLabels(); tutPosition(); }
  for (const v of G.villagers) if (v.mesh.visible) { animateVillager(v, adt); lifeAnimate(v); }
  animateBuildings(adt, _abs);
  environmentTick(dt, _abs);
  SWAY.uTime.value = _abs;
  updateRain(dt, CAM.tx, CAM.tz); updateWildlife(adt, _abs);
  applyDaylight(G.time, _v2.set(CAM.tx, 0, CAM.tz));
  if (GLOW_MAT) GLOW_MAT.opacity = DAY.glow * 0.85;
  seasonLight();
  const sr = clamp(CAM.dist * 0.8, 14, 34);
  if (Math.abs(sr - _shadowR) > 1) {
    _shadowR = sr; const c = sun.shadow.camera;
    c.left = -sr; c.right = sr; c.top = sr; c.bottom = -sr; c.updateProjectionMatrix();
  }
  updateParticles(dt, DAY.lightK); updateCritters(_abs, DAY.glow); updateSky(dt, _abs, DAY.glow); updateMarkers(_abs); updateFloats(dt);
  audioTick(DAY.glow);
  if (W.tDirty) { const a = W.terrain.geometry.attributes; a.position.needsUpdate = a.color.needsUpdate = a.normal.needsUpdate = true; if(a.aSurface)a.aSurface.needsUpdate=true; W.tDirty = false; }
  if (W.hmapDirty) updateHmap();
  if (G.critDirty) {
    G.critDirty = false; const homes = [];
    for (const b of G.buildings) {
      if (!b.done) continue;
      if (b.type === 'greathive') homes.push({ type: 0, x: b.cx, y: b.y + 1.5, z: b.cz, r: 1.5, n: 14 });
      if (b.type === 'apiary') homes.push({ type: 0, x: b.cx, y: b.y + 0.6, z: b.cz, r: 0.8, n: 7 });
      else if (b.type === 'flowers') homes.push({ type: 0, x: b.cx, y: b.y + 0.42, z: b.cz, r: 0.3, n: 1 });
    }
    rebuildCritters(homes);
  }
  _uiT -= dt;
  if (G.started && (UIS.dirty || _uiT <= 0)) { _uiT = 0.25; refreshUI(); }
  _saveT += dt; if (_saveT > 40) { _saveT = 0; saveGame(); }
  gfxTick(); gfxRender(dt);
}
function boot(hotData) {
  const cv = $('c');
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) {
    document.body.classList.add('webgl-unavailable'); $('start').classList.add('ready', 'webgl-unavailable');
    $('s-tag').textContent = 'Your browser could not start 3D graphics. Enable hardware acceleration in your browser settings, then reload. Bumblenook needs WebGL.';
    for (const id of ['s-new', 's-cont', 's-daily', 's-sand', 's-chal']) $(id).disabled = true;
    return;
  }
  UIS.coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  UIS.touch = UIS.coarse; document.body.classList.toggle('touch', UIS.touch);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene(); scene.fog = new THREE.Fog(0xa9def2, 60, 170);
  camera = new THREE.PerspectiveCamera(32, 1, 1, 400);
  hemi = new THREE.HemisphereLight(0xd6efff, 0x93a86f, 0.75); scene.add(hemi);
  sun = new THREE.DirectionalLight(0xffffff, 1.1); sun.castShadow = true;
  const sm = UIS.coarse ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm);
  sun.shadow.camera.near = 5; sun.shadow.camera.far = 140; sun.shadow.bias = -0.00025; sun.shadow.normalBias = 0.028;
  scene.add(sun, sun.target);
  initColors(); initParticles(); initCritters(); initSky(); initRain(); initWildlife(); initMarkers(); loadSettings(); initEnvironment();
  const save = (hotData && hotData.save) || readSave();
  UIS.hadSave = false;
  if (save) { try { loadGame(save); UIS.hadSave = true; } catch (e) { UIS.hadSave = false; } }
  if (!UIS.hadSave) { newGame((Math.random() * 1e6) | 0); buildShowcase(); centerCamera(); CAM.gd = CAM.dist = 27; }
  renderThumbs(); initHud(); initInput(); resize(); applySettings();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
  window.addEventListener('pagehide', saveGame);
  $('s-cont').hidden = !UIS.hadSave;
  if (UIS.hadSave) $('s-new').classList.add('second');
  translateDom();
  $('start').classList.add('ready');
  if (hotData && hotData.save && UIS.hadSave) enterGame();
  _last = performance.now();
  requestAnimationFrame(frame);
}
const _hot = window.claude && window.claude.hot;
if (_hot && _hot.snapshot) _hot.snapshot(() => ({ save: G.started ? serialize() : null }));
if (_hot && _hot.ready) _hot.ready(boot); else boot((_hot && _hot.data) || {});
