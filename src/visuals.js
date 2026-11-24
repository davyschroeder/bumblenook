// ---------- art direction: a sunlit, handcrafted island miniature ----------
// Decorative geometry is instanced, independent of the economy, and rebuilt from the island seed.
const ENV = { rim: null, motes: null, stars: null, sky: null };
function initEnvironment() {
  const faces = [];
  for (let q = 0; q < 6; q++) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const cx = cv.getContext('2d'), gr = cx.createLinearGradient(0, 0, 0, 64);
    if (q === 2) { gr.addColorStop(0, '#b9d4dc'); gr.addColorStop(1, '#d8e3d7'); }
    else if (q === 3) { gr.addColorStop(0, '#839370'); gr.addColorStop(1, '#697d68'); }
    else { gr.addColorStop(0, '#9cbdca'); gr.addColorStop(.48, '#e7dfc5'); gr.addColorStop(.54, '#bec7a0'); gr.addColorStop(1, '#78876b'); }
    cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64); faces.push(cv);
  }
  ENV.sky = new THREE.CubeTexture(faces); ENV.sky.encoding = THREE.sRGBEncoding; ENV.sky.needsUpdate = true;
  scene.environment = ENV.sky;
  MAT.main.envMapIntensity = .26;
  ENV.rim = new THREE.DirectionalLight(0xc0e0d8, .22); ENV.rim.position.set(-28, 19, -24); scene.add(ENV.rim);

  // Soft pollen in the sunshine and a few firefly-like specks at dusk.
  const r = mulberry32(71823), n = 64, pos = new Float32Array(n * 3), phase = new Float32Array(n);
  for (let q = 0; q < n; q++) { pos[q*3] = (r()-.5)*29; pos[q*3+1] = .3+r()*4.8; pos[q*3+2] = (r()-.5)*29; phase[q] = r()*TAU; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos,3)); geo.setAttribute('aPhase',new THREE.BufferAttribute(phase,1));
  const mat = new THREE.ShaderMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{time:SWAY.uTime,night:{value:0},tint:{value:new THREE.Color(0xffe5a3)},strength:{value:.3}},
    vertexShader:`uniform float time; attribute float aPhase; varying float alpha;
      void main(){ vec3 p=position; p.x+=sin(time*.18+aPhase)*.7;p.z+=cos(time*.15+aPhase)*.5;p.y+=sin(time*.52+aPhase)*.13;
        vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(48./max(1.,-mv.z),1.1,3.8);
        alpha=.3+.7*pow(.5+.5*sin(time*.72+aPhase),2.); }`,
    fragmentShader:`uniform vec3 tint;uniform float strength;varying float alpha;
      void main(){float d=length(gl_PointCoord-.5);float a=(1.-smoothstep(.08,.5,d))*alpha*strength;if(a<.01)discard;gl_FragColor=vec4(tint,a);}`});
  ENV.motes=new THREE.Points(geo,mat); ENV.motes.frustumCulled=false; scene.add(ENV.motes);

  const sp=new Float32Array(150*3), ss=new Float32Array(150);
  for(let q=0;q<150;q++){const a=r()*TAU,h=.25+r()*.65,rad=110;sp[q*3]=Math.cos(a)*rad*Math.sqrt(1-h*h);sp[q*3+1]=h*rad;sp[q*3+2]=Math.sin(a)*rad*Math.sqrt(1-h*h);ss[q]=r()*TAU;}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));sg.setAttribute('aPhase',new THREE.BufferAttribute(ss,1));
  const sm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:SWAY.uTime,fade:{value:0}},
    vertexShader:`attribute float aPhase;uniform float time;varying float alpha;void main(){alpha=.55+.45*sin(aPhase+time*.7);gl_PointSize=1.2+alpha;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform float fade;varying float alpha;void main(){float a=(1.-smoothstep(.05,.5,length(gl_PointCoord-.5)))*alpha*fade;gl_FragColor=vec4(.82,.91,1.,a);}`});
  ENV.stars=new THREE.Points(sg,sm);ENV.stars.frustumCulled=false;scene.add(ENV.stars);
}

function buildShoreDetails() {
  if (W.shoreDecor || !worldGroup || !W.type) return;
  const g = new THREE.Group(); W.shoreDecor = g; W.shoreAt = Object.create(null); worldGroup.add(g);
  const peb = new MB();
  peb.sph(.10,-.08,.055,0,0xb9bba7,[1.45,.6,1],1).sph(.073,.11,.035,.08,0xe4d9b7,[1.2,.55,.85],1);
  peb.sph(.043,.02,.024,-.13,0xf0dfc5,[1,.4,1],1).sph(.034,-.16,.023,.13,0x879e94,[1,.6,1],1);
  // A little scallop shell in the sand.
  for(let q=0;q<5;q++){const a=-.8+q*.4;peb.cyl(.008,.013,.065,4,.11+Math.sin(a)*.026,.012,-.11+Math.cos(a)*.025,0xffead5,[1.55,0,a]);}
  const reed=new MB();
  for(let q=0;q<5;q++){const a=q*2.4,x=Math.cos(a)*.13,z=Math.sin(a)*.1,h=.28+(q%3)*.1;
    reed.cone(.022,h,3,x,0,z,q%2?0x819e68:0xa9b675,[0,0,Math.sin(a)*.18]);
    if(q%2===0)reed.cyl(.012,.014,h*.85,4,x,0,z,0x7c9157).cyl(.025,.027,.085,5,x,h*.8,z,0x94714d);
  }
  const wood=new MB();
  wood.cyl(.064,.079,.58,8,0,.09,0,0xc5ac85,[0,0,Math.PI/2]);
  wood.cyl(.025,.041,.24,5,.08,.13,.03,0xb59b73,[.6,0,.7]);
  wood.sph(.08,-.25,.07,0,0xdbc7a4,[.4,1,1],1);
  const specs=[{geo:peb.build().geo,points:[]},{geo:reed.build().geo,points:[]},{geo:wood.build().geo,points:[]}];
  const r=mulberry32(W.seed+8049);
  for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){
    const k=tileIdx(i,j);if(W.occ[k]||W.natK[k])continue;
    let kind=-1;
    if(W.type[k]===T_SAND){const chance=r();if(chance<.21)kind=0;else if(chance<.24)kind=2;}
    else if(W.type[k]===T_GRASS&&W.tileH[k]<.21&&r()<.35)kind=1;
    if(kind<0)continue;
    const x=tileX(i)+(r()-.5)*.55,z=tileX(j)+(r()-.5)*.55;
    specs[kind].points.push({k,x,z,y:heightAt(x,z)+.008,s:.7+r()*.7,a:r()*TAU});
  }
  for(const spec of specs){
    if(!spec.points.length){spec.geo.dispose();continue;}
    const m=new THREE.InstancedMesh(spec.geo,MAT.main,spec.points.length);m.castShadow=false;m.receiveShadow=true;
    for(let q=0;q<spec.points.length;q++){const p=spec.points[q];_m4.compose(_v.set(p.x,p.y,p.z),_q.setFromAxisAngle(AXIS_Y,p.a),_s.setScalar(p.s));m.setMatrixAt(q,_m4);(W.shoreAt[p.k]||(W.shoreAt[p.k]=[])).push({mesh:m,idx:q});}
    m.instanceMatrix.needsUpdate=true;g.add(m);
  }
}

function environmentTick(dt,t) {
  if(!ENV.rim)return;
  if(!W.shoreDecor)buildShoreDetails();
  ENV.rim.intensity=lerp(.23,.095,DAY.glow)*(1-RAINK*.35);
  const night=smooth(.45,.95,DAY.glow),low=SET.gfx==='low';
  ENV.motes.visible=!low&&RAINK<.5&&G.season!==3;
  ENV.motes.position.set(CAM.tx,0,CAM.tz);
  ENV.motes.material.uniforms.strength.value=lerp(.22,.63,night);
  ENV.motes.material.uniforms.tint.value.set(G.season===2?0xffc186:0xffe8ad);
  ENV.stars.visible=!low&&night>.1&&RAINK<.4;ENV.stars.material.uniforms.fade.value=night*(1-RAINK);
  if(W.shoreDecor)W.shoreDecor.visible=!low;
  // Reflected daylight should never turn the nighttime miniature into a daytime one.
  const reflection=lerp(.36,.07,DAY.glow);
  MAT.build.envMapIntensity=reflection;MAT.main.envMapIntensity=reflection*.7;
}
