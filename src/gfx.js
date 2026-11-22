// ---------- gfx: the look. A soft glow, a miniature depth of field and colour grading on top of the picture,
// and in the world itself contact shadows, pools of light at night and painted detail in the grass. ----------
const GFX = { on: false, broken: false, rt: null, slow: 0, frames: 0, t: 0 };
const _gs = new THREE.Vector2();
const POST_VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
function gfxWanted() { return SET.gfx === 'high' && !GFX.broken && renderer && renderer.capabilities.isWebGL2; }
function gfxBuild() {
  const float = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const type = float ? THREE.HalfFloatType : THREE.UnsignedByteType;
  const opt = { type, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  GFX.rt = new THREE.WebGLRenderTarget(4, 4, { type, samples: 4, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  GFX.b0 = new THREE.WebGLRenderTarget(4, 4, opt); GFX.b1 = new THREE.WebGLRenderTarget(4, 4, opt);
  GFX.c0 = new THREE.WebGLRenderTarget(4, 4, opt); GFX.c1 = new THREE.WebGLRenderTarget(4, 4, opt);
  GFX.scene = new THREE.Scene(); GFX.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mk = (frag, uniforms) => new THREE.ShaderMaterial({ vertexShader: POST_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
  // what is bright enough to glow, at a quarter of the size
  GFX.mBright = mk(`uniform sampler2D t; uniform vec2 px; uniform float thr; varying vec2 vUv;
    void main(){
      vec3 c = (texture2D(t, vUv + px*vec2(-1.,-1.)).rgb + texture2D(t, vUv + px*vec2(1.,-1.)).rgb + texture2D(t, vUv + px*vec2(-1.,1.)).rgb + texture2D(t, vUv + px*vec2(1.,1.)).rgb)*.25;
      c = min(c, vec3(4.));
      float l = dot(c, vec3(.2126, .7152, .0722));
      gl_FragColor = vec4(c*smoothstep(thr, thr + .35, l), 1.);
    }`, { t: { value: null }, px: { value: new THREE.Vector2() }, thr: { value: 0.8 } });
  GFX.mBlur = mk(`uniform sampler2D t; uniform vec2 d; varying vec2 vUv;
    void main(){
      vec3 c = texture2D(t, vUv).rgb*.227;
      c += (texture2D(t, vUv + d*1.385).rgb + texture2D(t, vUv - d*1.385).rgb)*.316;
      c += (texture2D(t, vUv + d*3.231).rgb + texture2D(t, vUv - d*3.231).rgb)*.0703;
      gl_FragColor = vec4(c, 1.);
    }`, { t: { value: null }, d: { value: new THREE.Vector2() } });
  GFX.mFinal = mk(`uniform sampler2D tScene, tBloom, tWide; uniform vec2 px; uniform float bloomK, blurK, focusY, vig, night, time, warm;
    varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453); }
    void main(){
      // miniature look: sharp in a band across the middle, softer towards the top and bottom
      float b = smoothstep(.17, .56, abs(vUv.y - focusY))*blurK;
      vec3 c = texture2D(tScene, vUv).rgb;
      if (b > .02) {
        vec2 r = px*b;
        vec3 s = c*2.;
        s += texture2D(tScene, vUv + r*vec2(1., .0)).rgb + texture2D(tScene, vUv + r*vec2(-1., .0)).rgb;
        s += texture2D(tScene, vUv + r*vec2(.0, 1.)).rgb + texture2D(tScene, vUv + r*vec2(.0, -1.)).rgb;
        s += texture2D(tScene, vUv + r*vec2(.7, .7)).rgb + texture2D(tScene, vUv + r*vec2(-.7, .7)).rgb;
        s += texture2D(tScene, vUv + r*vec2(.7, -.7)).rgb + texture2D(tScene, vUv + r*vec2(-.7, -.7)).rgb;
        s += (texture2D(tScene, vUv + r*vec2(1.9, .8)).rgb + texture2D(tScene, vUv + r*vec2(-1.9, -.8)).rgb + texture2D(tScene, vUv + r*vec2(.8, -1.9)).rgb + texture2D(tScene, vUv + r*vec2(-.8, 1.9)).rgb)*.5;
        c = s/12.;
      }
      vec3 glow = texture2D(tBloom, vUv).rgb + texture2D(tWide, vUv).rgb*.8;
      c += glow*bloomK;
      // highlights roll off softly instead of clipping
      vec3 hi = max(c - .72, 0.);
      c = min(c, vec3(.72)) + .28*(1. - exp(-hi/.28));
      // grading: a little more contrast and colour, warm lights, cool shadows
      float l = dot(c, vec3(.2126, .7152, .0722));
      c = mix(vec3(l), c, 1.1);
      c = mix(c, c*c*(3. - 2.*c), .16);
      c *= mix(vec3(.95, .99, 1.07), vec3(1.05, 1.005, .94), smoothstep(.04, .6, l)*warm + (1. - warm)*.5);
      vec2 q = vUv - .5;
      c *= 1. - vig*smoothstep(.22, .95, dot(q, q)*2.2);
      c = pow(max(c, 0.), vec3(1./2.2));
      c += (hash(vUv*913. + time) - .5)/255.;
      gl_FragColor = vec4(c, 1.);
    }`, { tScene: { value: null }, tBloom: { value: null }, tWide: { value: null }, px: { value: new THREE.Vector2() }, bloomK: { value: 0.5 }, blurK: { value: 3 }, focusY: { value: 0.5 }, vig: { value: 0.3 }, night: { value: 0 }, time: SWAY.uTime, warm: { value: 1 } });
  GFX.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), GFX.mFinal); GFX.quad.frustumCulled = false;
  GFX.scene.add(GFX.quad);
}
function gfxResize() {
  if (!GFX.rt) return;
  const s = renderer.getDrawingBufferSize(_gs), w = Math.max(4, s.x | 0), h = Math.max(4, s.y | 0);
  GFX.rt.setSize(w, h);
  GFX.b0.setSize(w >> 2, h >> 2); GFX.b1.setSize(w >> 2, h >> 2);
  GFX.c0.setSize(w >> 3, h >> 3); GFX.c1.setSize(w >> 3, h >> 3);
  GFX.mBright.uniforms.px.value.set(1 / w, 1 / h); GFX.mFinal.uniforms.px.value.set(1 / w, 1 / h);
  GFX.w = w; GFX.h = h;
}
function gfxApply() {
  const want = gfxWanted();
  if (want && !GFX.rt) { try { gfxBuild(); } catch (e) { GFX.broken = true; } }
  GFX.on = want && !GFX.broken;
  if (GFX.on) gfxResize();
  if (W.water) W.water.material.uniforms.lin.value = GFX.on ? 1 : 0;
}
function gfxPass(mat, target) { GFX.quad.material = mat; renderer.setRenderTarget(target); renderer.render(GFX.scene, GFX.cam); }
function gfxRender(dt) {
  if (!GFX.on) { renderer.render(scene, camera); return; }
  const night = DAY.glow, u = GFX.mFinal.uniforms;
  renderer.setRenderTarget(GFX.rt); renderer.render(scene, camera);
  GFX.mBright.uniforms.t.value = GFX.rt.texture; GFX.mBright.uniforms.thr.value = lerp(0.8, 0.5, night);
  gfxPass(GFX.mBright, GFX.b0);
  const bu = GFX.mBlur.uniforms, blur = (src, dst, x, y) => { bu.t.value = src.texture; bu.d.value.set(x / src.width, y / src.height); gfxPass(GFX.mBlur, dst); };
  blur(GFX.b0, GFX.b1, 1, 0); blur(GFX.b1, GFX.b0, 0, 1);
  blur(GFX.b0, GFX.c1, 1, 0); blur(GFX.c1, GFX.c0, 0, 1); blur(GFX.c0, GFX.c1, 1.6, 0); blur(GFX.c1, GFX.c0, 0, 1.6);
  u.tScene.value = GFX.rt.texture; u.tBloom.value = GFX.b0.texture; u.tWide.value = GFX.c0.texture;
  u.bloomK.value = lerp(0.3, 0.5, night) + RAINK * 0.08;
  u.blurK.value = (UIS.photo ? 4.4 : 3.1) * clamp(CAM.dist / 24, 0.55, 1.25) * (GFX.h / 900);
  u.focusY.value = 0.48; u.vig.value = lerp(0.26, 0.42, night); u.warm.value = 1 - night * 0.6;
  gfxPass(GFX.mFinal, null);
  // phones that cannot keep up fall back to the plain picture by themselves, unless the player chose this setting
  if (!SET.gfxSet && G.started && !UIS.paused) {
    GFX.t += dt; GFX.frames++;
    if (GFX.t > 5) { if (GFX.frames / GFX.t < 21) { SET.gfx = 'mid'; saveSettings(); applySettings(); refreshSettingsUI(); } GFX.t = 0; GFX.frames = 0; }
  }
}

// ----- in the world -----
let _blobTex, _poolTex, POOL_MAT, BLOB_MAT;
function softTexture(square) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const g = cv.getContext('2d');
  if (square) { g.filter = 'blur(13px)'; g.fillStyle = '#fff'; g.beginPath(); g.roundRect ? g.roundRect(26, 26, 76, 76, 12) : g.rect(26, 26, 76, 76); g.fill(); }
  else { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(0.25, 'rgba(255,255,255,.5)'); gr.addColorStop(0.6, 'rgba(255,255,255,.13)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
  return new THREE.CanvasTexture(cv);
}
const _flatGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
// a soft dark patch under a building, so it sits on the ground instead of floating on it
function addContactShadow(g, size, k) {
  if (!BLOB_MAT) { _blobTex = softTexture(true); BLOB_MAT = new THREE.MeshBasicMaterial({ color: 0x1b2416, map: _blobTex, transparent: true, opacity: 0.4, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); }
  const m = new THREE.Mesh(_flatGeo, BLOB_MAT); m.scale.set(size * 1.5 * (k || 1), 1, size * 1.5 * (k || 1)); m.position.y = 0.03; m.renderOrder = 0;
  g.add(m); g.userData.blob = m; return m;
}
// warm light on the ground around lanterns, fires and lit windows; fades in with the night
function addLightPool(g, radius, x, z) {
  if (!POOL_MAT) { _poolTex = softTexture(false); POOL_MAT = new THREE.MeshBasicMaterial({ color: 0xffb65c, map: _poolTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }); }
  const m = new THREE.Mesh(_flatGeo, POOL_MAT); m.scale.set(radius * 2, 1, radius * 2); m.position.set(x || 0, 0.05, z || 0); m.renderOrder = 2;
  g.add(m); return m;
}
const POOLS = { lantern: 2.3, center: 4.2, house: 2.1, tavern: 3, bakery: 2.4, market: 2.6, lighthouse: 3.4, school: 2.4, academy: 2.6, cathedral: 3.6, belltower: 2.2, greathive: 3.4, bathhouse: 2.6, townhall: 3.2 };
function dressBuilding(g, type) {
  const d = BT[type]; if (!d || d.flat) return;
  if (type !== 'lantern' && type !== 'flowers' && type !== 'bench' && type !== 'sapling') addContactShadow(g, d.size, d.size === 1 ? 0.8 : 1);
  if (POOLS[type]) addLightPool(g, POOLS[type]);
}
function gfxTick() {
  if (POOL_MAT) { POOL_MAT.opacity = DAY.glow * (GFX.on ? 0.3 : 0.24); POOL_MAT.visible = DAY.glow > 0.02; }
  if (BLOB_MAT) BLOB_MAT.opacity = lerp(0.42, 0.3, DAY.glow) * (G.season === 3 ? 0.75 : 1);
  if (W.water) { const u = W.water.material.uniforms; u.sunK.value = clamp(1 - DAY.glow * 1.2, 0, 1) * (1 - RAINK * 0.7); }
}
// the ground: flat triangles keep their colour, with a little painted variation inside each of them
function terrainMaterial() {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = 'varying vec3 vWp;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vWp = (modelMatrix*vec4(transformed, 1.)).xyz;');
    sh.fragmentShader = `varying vec3 vWp;
      float tHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
      float tNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
        return mix(mix(tHash(i), tHash(i + vec2(1., 0.)), f.x), mix(tHash(i + vec2(0., 1.)), tHash(i + vec2(1., 1.)), f.x), f.y); }
      ` + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      float tn = tNoise(vWp.xz*.55)*.5 + tNoise(vWp.xz*2.1 + 7.)*.32 + tNoise(vWp.xz*6.3 + 19.)*.18;
      diffuseColor.rgb *= .9 + .2*tn;
      diffuseColor.rgb *= .9 + .1*smoothstep(-.15, .3, vWp.y);`);
  };
  return m;
}

// buildings: surfaces drawn into the flat colours. Roofs get rows of shingles, timber gets planks,
// stone gets blocks and plaster a soft, uneven wash; everything is a touch darker where it meets the ground.
function buildingMaterial() {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true });
  m.extensions = { derivatives: true };
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = 'varying vec3 vOP; varying vec3 vON;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vOP = position; vON = normal;');
    sh.fragmentShader = `varying vec3 vOP; varying vec3 vON;
      float bHash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1)))*43758.5453); }
      float bNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
        return mix(mix(bHash(i), bHash(i + vec2(1., 0.)), f.x), mix(bHash(i + vec2(0., 1.)), bHash(i + vec2(1., 1.)), f.x), f.y); }
      float bLine(float x, float w){ float f = fract(x), a = fwidth(x)*1.2; return 1. - smoothstep(w, w + a + .02, f); }
      ` + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      {
        vec3 bc = diffuseColor.rgb, an = abs(normalize(vON));
        float mx = max(bc.r, max(bc.g, bc.b)), mn = min(bc.r, min(bc.g, bc.b)), sat = (mx - mn)/max(mx, .001);
        float pxs = fwidth(vOP.x) + fwidth(vOP.y) + fwidth(vOP.z);
        float fade = clamp(1.7 - pxs*30., 0., 1.), pat = 0.;
        float hz = an.x > an.z ? vOP.z : vOP.x;
        if (an.y > .22 && an.y < .97 && vOP.y > .4) {
          vec2 tg = normalize(vec2(vON.z, -vON.x) + vec2(1e-4));
          float u = dot(vOP.xz, tg)*6.5, v = vOP.y/max(sqrt(1. - an.y*an.y), .2)*8.;
          float row = floor(v); u += mod(row, 2.)*.5;
          pat = (bHash(vec2(floor(u), row)) - .5)*.2 - bLine(v, .12)*.22 - bLine(u, .06)*.12;
        } else if (an.y <= .22) {
          if (sat < .17 && mx < .62) {
            float v = vOP.y*8.5, row = floor(v), u = hz*5. + mod(row, 2.)*.5;
            pat = (bHash(vec2(floor(u), row)) - .5)*.2 - bLine(v, .09)*.2 - bLine(u, .06)*.15;
          } else if (bc.g/max(bc.r, .001) > .3 && bc.b < bc.g*.8 && sat > .45 && mx < .8) {
            float v = vOP.y*9.;
            pat = (bHash(vec2(floor(v), 3.)) - .5)*.16 - bLine(v, .1)*.2 + (bNoise(vec2(hz*26., v*1.5)) - .5)*.1;
          } else {
            pat = (bNoise(vec2(hz, vOP.y)*8.) - .5)*.1 + (bNoise(vec2(hz, vOP.y)*27.) - .5)*.05 - (1. - smoothstep(.1, .34, vOP.y))*.07;
          }
        } else pat = (bNoise(vOP.xz*11.) - .5)*.08;
        diffuseColor.rgb *= 1. + pat*fade;
        diffuseColor.rgb *= .84 + .16*smoothstep(0., .2, vOP.y);
      }`);
  };
  return m;
}
MAT.build = buildingMaterial();
