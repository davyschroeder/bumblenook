// ---------- audio: everything is synthesised, no files ----------
const AU = { ctx: null, master: null, sfx: null, music: null, soundOn: true, musicOn: true, next: 0, step: 0, noise: null, amb: null };
function audioInit() {
  if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    const ctx = AU.ctx = new AC();
    AU.master = ctx.createGain(); AU.master.gain.value = 0.9; AU.master.connect(ctx.destination);
    AU.sfx = ctx.createGain(); AU.sfx.gain.value = AU.soundOn ? 0.55 : 0; AU.sfx.connect(AU.master);
    AU.music = ctx.createGain(); AU.music.gain.value = AU.musicOn ? 0.32 : 0; AU.music.connect(AU.master);
    const len = ctx.sampleRate, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    AU.noise = buf;
    // soft surf: looping filtered noise with a slow swell
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 520;
    AU.amb = ctx.createGain(); AU.amb.gain.value = 0.05;
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.13; lg.gain.value = 0.03;
    lfo.connect(lg); lg.connect(AU.amb.gain); lfo.start();
    src.connect(f); f.connect(AU.amb); AU.amb.connect(AU.sfx); src.start();
    const rs = ctx.createBufferSource(), rf = ctx.createBiquadFilter(); rs.buffer = buf; rs.loop = true; rf.type = 'highpass'; rf.frequency.value = 2200;
    AU.rain = ctx.createGain(); AU.rain.gain.value = 0; rs.connect(rf); rf.connect(AU.rain); AU.rain.connect(AU.sfx); rs.start();
    AU.next = ctx.currentTime + 0.3;
  } catch (e) { AU.ctx = null; }
}
function setSound(on) { AU.soundOn = on; if (AU.sfx) AU.sfx.gain.value = on ? 0.55 : 0; }
function setMusic(on) { AU.musicOn = on; if (AU.music) AU.music.gain.value = on ? 0.32 : 0; }
function tone(freq, dur, type, vol, when, dest, slide) {
  if (!AU.ctx) return;
  const t = when || AU.ctx.currentTime, o = AU.ctx.createOscillator(), g = AU.ctx.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest || AU.sfx); o.start(t); o.stop(t + dur + 0.05);
}
function noiseHit(dur, freq, q, vol, type) {
  if (!AU.ctx) return;
  const t = AU.ctx.currentTime, s = AU.ctx.createBufferSource(), f = AU.ctx.createBiquadFilter(), g = AU.ctx.createGain();
  s.buffer = AU.noise; f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(AU.sfx); s.start(t, Math.random() * 0.5, dur + 0.05);
}
// vol scales with distance from what the camera looks at
function sfx(name, k) {
  if (!AU.ctx || !AU.soundOn) return;
  k = k === undefined ? 1 : k; if (k < 0.04) return;
  const t = AU.ctx.currentTime;
  switch (name) {
    case 'chop': noiseHit(0.09, 900, 1.2, 0.5 * k); tone(150, 0.09, 'triangle', 0.25 * k, t, null, 80); break;
    case 'mine': noiseHit(0.05, 3200, 3, 0.35 * k); tone(1300 + Math.random() * 300, 0.07, 'square', 0.05 * k); break;
    case 'hammer': noiseHit(0.05, 1500, 2, 0.35 * k); tone(320, 0.06, 'triangle', 0.15 * k, t, null, 200); break;
    case 'fall': noiseHit(0.5, 300, 0.7, 0.4 * k, 'lowpass'); break;
    case 'pick': tone(900, 0.06, 'sine', 0.1 * k, t, null, 1300); break;
    case 'splash': noiseHit(0.3, 1800, 0.8, 0.22 * k); break;
    case 'drop': tone(520, 0.08, 'sine', 0.12 * k, t, null, 340); break;
    case 'place': noiseHit(0.12, 400, 0.8, 0.5, 'lowpass'); tone(330, 0.12, 'triangle', 0.2, t + 0.03); tone(495, 0.16, 'triangle', 0.18, t + 0.1); break;
    case 'done': [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, 'triangle', 0.2, t + i * 0.09)); break;
    case 'quest': [659, 784, 988, 1319, 1568].forEach((f, i) => tone(f, 0.4, 'sine', 0.18, t + i * 0.1)); break;
    case 'coin': tone(1320, 0.08, 'square', 0.07, t); tone(1760, 0.2, 'square', 0.07, t + 0.07); break;
    case 'pop': tone(420, 0.14, 'sine', 0.25, t, null, 880); break;
    case 'click': tone(700, 0.04, 'triangle', 0.1); break;
    case 'error': tone(220, 0.14, 'sawtooth', 0.09, t, null, 150); break;
    case 'bell': [880, 660, 880].forEach((f, i) => { tone(f, 1.4, 'sine', 0.16 * k, t + i * 0.55); tone(f * 2.76, 0.6, 'sine', 0.04 * k, t + i * 0.55); }); break;
    case 'boom': noiseHit(0.5, 200, 0.6, 0.5, 'lowpass'); tone(1200 + Math.random() * 600, 0.5, 'sine', 0.05, t + 0.05, null, 400); break;
  }
}
// gentle generative music-box tune over slow chords
const CHORDS = [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17], [0, 4, 7, 14], [4, 7, 11, 16], [5, 9, 12, 14], [7, 11, 14, 19]];
const PENTA = [0, 2, 4, 7, 9];
const CHORDS_W = [[9, 12, 16, 19], [5, 9, 12, 16], [0, 4, 7, 11], [7, 11, 14, 17], [9, 12, 16, 21], [2, 5, 9, 12], [5, 9, 12, 14], [4, 8, 11, 14]];
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
function pluck(note, t, vol, dur) {
  const ctx = AU.ctx, o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = midi(note); o2.frequency.value = midi(note) * 2.005;
  const g2 = ctx.createGain(); g2.gain.value = 0.25;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(AU.music);
  o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
}
function audioTick(night) {
  const ctx = AU.ctx;
  if (!ctx || ctx.state !== 'running') return;
  if (AU.rain) AU.rain.gain.value = RAINK * 0.07;
  const morning = G.time < 0.2, winter = G.season === 3, chords = winter ? CHORDS_W : CHORDS;      // brisk mornings, slower nights, a wistful key in winter
  const beat = night > 0.5 ? 0.46 : morning ? 0.32 : winter ? 0.4 : 0.36;
  if (AU.next < ctx.currentTime - 1) AU.next = ctx.currentTime + 0.1;
  while (AU.next < ctx.currentTime + 0.25) {
    const s = AU.step++, bar = (s >> 3) % chords.length, ch = chords[bar], pos = s & 7, t = AU.next;
    if (AU.musicOn) {
      if (pos === 0) { pluck(36 + ch[0] + (ch[0] > 6 ? 0 : 12), t, 0.3, 2.6); pluck(48 + ch[1], t + 0.02, 0.1, 2.4); pluck(48 + ch[2], t + 0.04, 0.1, 2.4); }
      if (pos === 4 && Math.random() < 0.6) pluck(48 + ch[2], t, 0.1, 1.6);
      const p = night > 0.5 ? 0.3 : morning ? 0.72 : 0.55;
      if (Math.random() < p || pos === 0) {
        const src = Math.random() < 0.65 ? ch : PENTA;
        pluck(72 + src[(Math.random() * src.length) | 0] + (Math.random() < 0.2 ? 12 : 0), t + (Math.random() < 0.15 ? beat / 2 : 0), 0.14, 1.3);
      }
    }
    if (AU.soundOn) {
      if (night < 0.5 && Math.random() < 0.05) { const f = 2400 + Math.random() * 1400; for (let i = 0; i < 3; i++) tone(f, 0.07, 'sine', 0.03, t + i * 0.11, null, f * 1.25); }
      if (night > 0.5 && pos % 2 === 0 && Math.random() < 0.5) for (let i = 0; i < 3; i++) tone(4300, 0.03, 'sine', 0.012, t + i * 0.05);
    }
    AU.next += beat;
  }
}
