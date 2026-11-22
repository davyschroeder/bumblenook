// ---------- tutorial: world badges + a small coach that follows what the player is doing ----------
const labels = new Map();
function refreshLabels() {          // which buildings carry a badge, and what it says
  const need = new Set();
  if (G.started) for (const b of G.buildings) {
    if (!b.mesh) continue;
    let html = null, cls = '', say = '';
    if (!b.done) { html = ic('hammer') + '<b>' + Math.round(b.progress * 100) + '%</b>'; cls = 'site' + (b.builders ? '' : ' wait'); say = b.def.name + ' under construction'; }
    else if (b.def.job && b.workers.length < slotsOf(b)) {
      html = ic('pop') + '<b>' + b.workers.length + '/' + slotsOf(b) + '</b><i>' + ic('plus') + '</i>'; cls = 'job' + (b.workers.length ? '' : ' empty');
      say = b.def.name + ': ' + b.workers.length + ' of ' + slotsOf(b) + ' workers. Open to add one';
    }
    if (!html) continue;
    need.add(b.id);
    let L = labels.get(b.id);
    if (!L) { const el = document.createElement('button'); el.type = 'button'; el.dataset.b = b.id; $('labels').appendChild(el); L = { el, b, h: '' }; labels.set(b.id, L); }
    if (L.h !== html + cls) { L.el.className = 'wl ' + cls; L.el.innerHTML = html; L.el.setAttribute('aria-label', say); L.h = html + cls; }
  }
  if (G.started && hasTech('cartography')) for (const q of W.sites) {       // cartography marks unexplored sites
    if (q.found) continue;
    const id = 's' + q.n; need.add(id);
    if (!labels.get(id)) { const el = document.createElement('button'); el.type = 'button'; el.dataset.b = id; el.className = 'wl site wait'; el.innerHTML = '<b>?</b>'; el.setAttribute('aria-label', 'Unexplored site'); $('labels').appendChild(el); labels.set(id, { el, b: { cx: q.x, cz: q.z, y: q.y, size: 1 }, h: '?' }); }
  }
  for (const [id, L] of labels) if (!need.has(id)) { L.el.remove(); labels.delete(id); }
}
function positionLabels() {
  for (const L of labels.values()) {
    const b = L.b, s = screenOf(b.cx, b.y + (b.size > 2 ? 1.5 : b.size > 1 ? 1.75 : 1.2), b.cz);
    L.el.style.transform = 'translate(' + Math.round(s.x) + 'px,' + Math.round(s.y) + 'px) translate(-50%,-100%)';
    L.el.style.visibility = s.ok ? 'visible' : 'hidden';
  }
}

const TUT = { cur: null, key: '', spot: {}, focused: '' };
function tutSpot(type) {            // a good first spot: plenty in reach, not far from the green
  const d = BT[type], c = G.center, old = TUT.spot[type];
  if (old && !canPlace(type, old.i, old.j)) return old;
  let best = null, bs = -1e9; const r2 = d.radius * d.radius;
  for (let j = 3; j < N - 4; j++) for (let i = 3; i < N - 4; i++) {
    const cx = i + d.size / 2 - HALF, cz = j + d.size / 2 - HALF, dc = Math.hypot(cx - c.cx, cz - c.cz);
    if (dc < 4 || dc > 13 || canPlace(type, i, j)) continue;
    let n = 0;
    if (type === 'lumber') { for (const t of trees) if (t && t.state === 0 && dist2(t.x, t.z, cx, cz) <= r2) n++; }
    else for (const bu of bushes) if (!bu.gone && dist2(bu.x, bu.z, cx, cz) <= r2) n++;
    let clear = 0; eachTile(i, j, d.size, (k) => { if (!W.natK[k]) clear++; });
    const s = Math.min(n, 14) * 1.2 - dc * 0.9 + clear * 0.8;
    if (s > bs && !sealsOff(type, i, j, 0)) { bs = s; best = { i, j, x: cx, z: cz, y: footprintHeight(i, j, d.size) }; }
  }
  return (TUT.spot[type] = best);
}
function guideBuild(type, tab, tabName, why, what) {
  const B = UIS.build, d = BT[type], tap = UIS.touch ? 'Tap' : 'Click';
  if (!B || B.type !== type) {
    if (UIS.tab !== tab) return { text: why + ' Open the <b>' + tabName + '</b> tab.', el: document.querySelector('#tabs button[data-tab="' + tab + '"]') };
    return { text: why + ' Pick the <b>' + d.name + '</b>.', el: document.querySelector('.item[data-type="' + type + '"]'), scroll: true };
  }
  const sp = tutSpot(type);
  if (!sp) return { text: tap + ' a free spot on the grass near ' + what + '.' };
  if (TUT.focused !== type) { TUT.focused = type; focusFree(sp.x, sp.z, 24); }
  if (B.has && !B.reason && UIS.touch) return { text: 'Good spot: the white outline shows where it will stand. Tap <b>Place</b>.', el: $('p-ok'), top: true };
  if (B.has && B.reason && B.reason !== 'Not enough resources') return { text: 'Not there: ' + B.reason.toLowerCase() + '. ' + tap + ' the marked spot instead.', world: sp };
  return { text: tap + ' the marked spot. It is close to ' + what + ', so the walk is short. A white outline means you can build there.', world: sp };
}
function tutCompute() {
  if (!G.started || G.tut >= 6 || !$('modal').hidden) return null;
  const lum = G.buildings.find((b) => b.type === 'lumber'), tap = UIS.touch ? 'Tap' : 'Click';
  if (G.tut === 0) { if (lum) G.tut = 1; else return guideBuild('lumber', 'grond', 'Materials', 'Welcome to Bumblenook! Your villagers need wood first.', 'trees'); }
  if (G.tut === 1 || G.tut === 2) { if (!lum) { G.tut = 0; return null; } }
  if (G.tut === 1) {
    if (lum.done) G.tut = 2;
    else return { text: 'Free villagers walk over and build it. The hammer badge shows the progress.' + (UIS.speed < 3 ? ' In a hurry? Use <b>3&times;</b> at the top.' : ''), b: lum };
  }
  if (G.tut === 2) {
    if (lum.workers.length >= 2) G.tut = 3;
    else if (UIS.panel && UIS.panel.kind === 'b' && UIS.panel.ref === lum) return { text: 'This is how villagers get a job: tap <b>+</b> to send a free villager to work here. Minus sends one back.', el: $('bw-p') };
    else return { text: 'Now put villagers to work. ' + tap + ' the Lumber Hut (or its badge).', b: lum };
  }
  if (G.tut === 3) {
    if (G.buildings.some((b) => b.type === 'forager')) G.tut = 4;
    else {
      if (UIS.panel && UIS.panel.kind === 'b' && !UIS.build) return { text: 'Nice, two woodcutters! Close this panel to carry on.', el: $('pn-close') };
      return guideBuild('forager', 'voedsel', 'Food', 'Villagers eat every day.', 'red berry bushes');
    }
  }
  if (G.tut === 4) {
    if (UIS.sawPeople) G.tut = 5;
    else return { text: 'This button lists every villager and job. You can move people between jobs there too.', el: $('r-pop') };
  }
  if (G.tut === 5) return { text: 'That is all you need. Next, build <b>Cottages</b> in the Village tab so new settlers arrive. Tap the goal card any time for your next goal, requests from villagers, badges and what unlocks when the village grows.', el: $('quest'), ok: true };
  return null;
}
function tutUpdate() {
  const c = TUT.cur = tutCompute(), root = $('coach');
  if (!c) { root.hidden = true; TUT.key = ''; return; }
  const key = c.text + (c.ok ? '1' : '0');
  if (key !== TUT.key) {
    TUT.key = key; $('coach-text').innerHTML = trText(c.text); $('coach-ok').hidden = !c.ok;
    $('coach-step').textContent = 'Tip ' + (Math.min(G.tut, 5) + 1) + ' of 6';
    if (c.scroll && c.el && c.el.scrollIntoView) c.el.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  tutPosition();
}
function tutPosition() {
  const c = TUT.cur, root = $('coach');
  if (!c) return;
  const W_ = window.innerWidth, H_ = window.innerHeight, ring = $('coach-ring'), box = $('coach-box');
  let r = null;
  if (c.el) {
    if (c.el.isConnected && c.el.offsetParent) { const q = c.el.getBoundingClientRect(); r = { x: q.left - 5, y: q.top - 5, w: q.width + 10, h: q.height + 10, rad: '16px' }; }
  } else if (c.b || c.world) {
    const s = c.b ? screenOf(c.b.cx, c.b.y + 0.5, c.b.cz) : screenOf(c.world.x, c.world.y + 0.2, c.world.z);
    const R = clamp(900 / CAM.dist, 30, 62);
    // keep the marker inside the free part of the screen, never on top of the menus
    const m = $('mid').getBoundingClientRect();
    if (s.ok) r = { x: clamp(s.x, m.left + R, m.right - R) - R, y: clamp(s.y, m.top + R, m.bottom - R) - R, w: R * 2, h: R * 2, rad: '50%' };
  }
  root.hidden = false;
  const bw = box.offsetWidth, bh = box.offsetHeight;
  let bx, by;
  if (!r) { ring.hidden = true; bx = (W_ - bw) / 2; by = H_ * 0.3; }
  else {
    ring.hidden = false;
    ring.style.transform = 'translate(' + Math.round(r.x) + 'px,' + Math.round(r.y) + 'px)';
    ring.style.width = Math.round(r.w) + 'px'; ring.style.height = Math.round(r.h) + 'px'; ring.style.borderRadius = r.rad;
    bx = clamp(r.x + r.w / 2 - bw / 2, 12, W_ - bw - 12);
    const below = r.y + r.h + 12, above = r.y - bh - 12;
    by = (r.y + r.h / 2 > H_ / 2 && above > 50) || below + bh > H_ - 8 ? above : below;
    by = clamp(by, 50, H_ - bh - 8);
    if (c.top) by = $('mid').getBoundingClientRect().top;      // keep the island in view while confirming a spot
  }
  box.style.transform = 'translate(' + Math.round(bx) + 'px,' + Math.round(by) + 'px)';
}
function initTutorial() {
  $('labels').addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (UIS.build) stopBuild();
    if (t.dataset.b[0] === 's') { select({ kind: 's', ref: W.sites[+t.dataset.b.slice(1)] }); return; }
    const b = G.bmap.get(+t.dataset.b); if (!b) return;
    select({ kind: 'b', ref: b });
  });
  $('coach-skip').addEventListener('click', () => { G.tut = 6; sfx('click'); tutUpdate(); });
  $('coach-ok').addEventListener('click', () => { G.tut = 6; sfx('done'); tutUpdate(); });
}

// A lived-in village for the title screen, so the first thing you see is what the island can become.
function buildShowcase() {
  const c = G.center;
  for (let j = c.j - 1; j <= c.j + 3; j++) for (let i = c.i - 1; i <= c.i + 3; i++) {
    if (i >= c.i && i < c.i + 3 && j >= c.j && j < c.j + 3) continue;
    if (!canPlace('path', i, j)) placeBuilding('path', i, j, 0, { silent: true });
  }
  const list = ['house', 'house', 'well', 'bakery', 'market', 'house', 'lumber', 'forager', 'farm', 'house', 'apiary', 'flowers', 'flowers', 'flowers', 'lantern', 'lantern',
    'house', 'tavern', 'windmill', 'fountain', 'pasture', 'academy', 'store', 'house', 'pond', 'orchard', 'bench', 'lantern', 'quarry', 'house', 'fisher', 'bench', 'flowers', 'house', 'lantern', 'flowers', 'bench', 'lantern'];
  for (const t of list) {
    const s = BT[t].size; let best = null, bd = 1e9;
    for (let j = 3; j < N - 4; j++) for (let i = 3; i < N - 4; i++) {
      if (canPlace(t, i, j)) continue;
      const d = Math.hypot(i + s / 2 - HALF - c.cx, j + s / 2 - HALF - c.cz);
      if (d < 3.4 || d >= bd) continue;
      let crowded = false;
      if (s > 1) for (let q = j - 1; q <= j + s && !crowded; q++) for (let p = i - 1; p <= i + s; p++) {
        const o = inGrid(p, q) ? G.bmap.get(W.occ[tileIdx(p, q)]) : null;
        if (o && o.size > 1) { crowded = true; break; }
      }
      if (!crowded) { bd = d; best = [i, j]; }
    }
    if (!best) continue;
    const dx = c.cx - (best[0] + s / 2 - HALF), dz = c.cz - (best[1] + s / 2 - HALF);
    const rot = Math.abs(dz) > Math.abs(dx) ? (dz > 0 ? 0 : 2) : dx > 0 ? 1 : 3;
    const b = placeBuilding(t, best[0], best[1], rot, { done: true, silent: true });
    onBuilt(b, true);
  }
  for (let q = 0; q < 12; q++) { const a = q / 12 * TAU; spawnVillager(c.cx + Math.cos(a) * 2.6, c.cz + Math.sin(a) * 2.6); }
  for (const b of G.buildings) while (b.done && b.def.job && b.workers.length < slotsOf(b) && G.villagers.filter((v) => !v.job).length > 2) if (!assignWorker(b)) break;
  Object.assign(G.res, { wood: 140, stone: 90, food: 160, grain: 12, honey: 5, coins: 30 });
  G.time = 0.47; G.demo = true; G.tut = 6;
  assignHomes(); calcHappy(); G.happy = G.happyTarget;
}
