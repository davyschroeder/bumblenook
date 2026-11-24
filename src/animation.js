// ---------- living details: cloth, hand tools, bell swings, fountain water and sailing boats ----------
// Uses the same pause-aware clock as the character/building animation and no external assets.
const ANIMATION = { time: { value: 0 }, cloth: Object.create(null), water: null };
function villagerToolGeo(kind) {
  return cachedGeo('tool:' + kind, () => {
    const b = new MB();
    b.cyl(0.009,0.013,0.205,6,0,-0.03,0,C.woodL);
    if(kind==='axe') {
      b.box(0.067,0.057,0.018,0.025,0.145,0,0x798991).box(0.016,0.072,0.022,0.061,0.137,0,0xc9d7d7);
      b.box(0.026,0.044,0.03,-0.018,0.15,0,C.iron);
    } else if(kind==='pick') {
      b.box(0.16,0.022,0.024,0,0.168,0,0x8c9da5,[0,0,0.12]);
      b.cone(0.017,0.075,5,0.095,0.132,0,0xabb9bf,[0,0,-0.5]);
    } else b.box(0.088,0.04,0.045,0,0.148,0,C.iron);
    return b.build().geo;
  });
}
function livingGroup(g, ex) {
  if (!ex.living) { ex.living = new THREE.Group(); g.add(ex.living); }
  return ex.living;
}
function clothMaterial(color, stripe) {
  const key=color+':'+stripe;
  if (ANIMATION.cloth[key]) return ANIMATION.cloth[key];
  const mat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:0.95,metalness:0,side:THREE.DoubleSide});
  mat.onBeforeCompile=(sh)=>{
    sh.uniforms.clothTime=ANIMATION.time;
    sh.vertexShader='attribute float clothPin; uniform float clothTime;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float flutter=sin(clothTime*2.7+position.x*8.-position.y*3.)*.7+sin(clothTime*4.1+position.x*14.+position.y*5.)*.3;
      transformed.z += flutter*clothPin*.065;
      transformed.y -= clothPin*clothPin*.023;
    `);
  };
  mat.customProgramCacheKey=()=> 'bumblenook-cloth-v1';
  ANIMATION.cloth[key]=mat;return mat;
}
function makeCloth(w,h,color,stripe,vertical) {
  const key='cloth:'+w+':'+h+':'+color+':'+stripe+':'+!!vertical;
  const geo=cachedGeo(key,()=>{
    const geo=new THREE.PlaneGeometry(w,h,14,6);geo.translate(w/2,-h/2,0);
    const uv=geo.attributes.uv, colors=new Float32Array(uv.count*3),pin=new Float32Array(uv.count);
    const c=new THREE.Color();
    for(let i=0;i<uv.count;i++){
      const x=uv.getX(i),y=uv.getY(i),bands=vertical?y:x;
      c.set(stripe&&Math.floor(bands*5)%2?stripe:color);
      c.multiplyScalar(0.94+0.06*y);colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
      pin[i]=vertical?1-y:x;
    }
    geo.setAttribute('color',new THREE.BufferAttribute(colors,3));geo.setAttribute('clothPin',new THREE.BufferAttribute(pin,1));
    return geo;
  });
  const m=new THREE.Mesh(geo,clothMaterial(color,stripe));m.castShadow=true;m.receiveShadow=true;return m;
}
function extraChain(type,fn){const previous=EXTRA_FN[type];EXTRA_FN[type]=(g,ex)=>{if(previous)previous(g,ex);fn(g,ex);};}
function addFlag(g,ex,x,y,z,w,h,color,stripe){const m=makeCloth(w,h,color,stripe,false);m.position.set(x,y,z);livingGroup(g,ex).add(m);return m;}
extraChain('center',(g,ex)=>addFlag(g,ex,0.03,1.86,-1.2,0.60,0.36,C.gold,C.dark));
extraChain('harbour',(g,ex)=>addFlag(g,ex,0.70,1.98,-0.62,0.40,0.26,0xf6e9c7,0x3d7184));
// The separate flagpole is cloth too, instead of a solid plank.
MODEL_FN.flag=()=>{
  const b=new MB();b.cyl(0.09,0.11,0.08,10,0,0,0,C.stone).cyl(0.022,0.028,1.5,8,0,0.08,0,C.woodL).sph(0.04,0,1.6,0,C.gold,null,1);
  b.cyl(0.035,0.035,0.025,8,0,0.12,0,C.gold);return b.build();
};
extraChain('flag',(g,ex)=>addFlag(g,ex,0.025,1.51,0,0.46,0.3,C.gold,C.dark));
// Cathedral bells are free to move in their open belfries.
extraChain('cathedral',(g,ex)=>{
  const geo=cachedGeo('living-bell',()=>{
    const b=new MB();b.sph(0.09,0,-0.09,0,0xe7ad42,[1,1.1,1],1).cyl(0.083,0.143,0.13,14,0,-0.21,0,0xe7ad42).cyl(0.148,0.148,0.025,14,0,-0.215,0,0xffd77c).cyl(0.015,0.015,0.09,6,0,-0.23,0,C.iron).sph(0.028,0,-0.25,0,C.dark,null,1);return b.build().geo;
  });
  ex.bells=[];
  for(const x of [-0.82,0.82]){const bell=new THREE.Mesh(geo,MAT.main);bell.position.set(x,2.64,0.8);bell.castShadow=true;livingGroup(g,ex).add(bell);ex.bells.push(bell);}
});
// Water takes a continuous curved path from the upper bowl into the pool.
function fountainPoint(a,p,out){
  const r=0.25+p*0.37;
  return out.set(Math.cos(a)*r,0.92-0.67*p+Math.sin(p*Math.PI)*0.21,Math.sin(a)*r);
}
extraChain('fountain',(g,ex)=>{
  if(!ANIMATION.water)ANIMATION.water=new THREE.MeshStandardMaterial({color:0xbbeeed,roughness:0.22,metalness:0.08,transparent:true,opacity:0.72,depthWrite:false});
  const arcs=cachedGeo('fountain-streams',()=>{
    const b=new MB();
    for(let q=0;q<6;q++){
      const a=q/6*TAU,points=[];for(let j=0;j<=12;j++)points.push(fountainPoint(a,j/12,new THREE.Vector3()));
      b._add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,0.008,4,false),0,0,0,0xd1f6f0);
    }
    return b.build().geo;
  });
  ex.waterArcs=new THREE.Mesh(arcs,ANIMATION.water);livingGroup(g,ex).add(ex.waterArcs);
  ex.drops=new THREE.InstancedMesh(cachedGeo('waterdrop',()=>new THREE.IcosahedronGeometry(1,1)),ANIMATION.water,12);ex.drops.frustumCulled=false;livingGroup(g,ex).add(ex.drops);
  ex.ripples=[];
  const ring=cachedGeo('fountain-ripple',()=>new THREE.RingGeometry(0.21,0.224,40).rotateX(-Math.PI/2));
  for(let q=0;q<3;q++){
    const m=new THREE.Mesh(ring,new THREE.MeshBasicMaterial({color:0xd5ffff,transparent:true,opacity:0.3,depthWrite:false,side:THREE.DoubleSide}));m.position.y=0.245;livingGroup(g,ex).add(m);ex.ripples.push(m);
  }
});
// A little hearth flicker for the freestanding braziers.
extraChain('brazier',(g,ex)=>{
  const geo=cachedGeo('brazier-living-flame',()=>{const b=new MB();b.cone(0.09,0.28,7,0,0.42,0,0xff9638).cone(0.055,0.21,6,0.012,0.42,0.01,0xffdb77);return b.build().geo;});
  ex.flame=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true}));livingGroup(g,ex).add(ex.flame);
});
function animateLivingBuilding(b,u,dt,t){
  if(u.bells){
    const morning=smooth(0.17,0.22,G.time)*(1-smooth(0.25,0.29,G.time));
    const festival=G.festival>0?0.7:0;
    for(let q=0;q<u.bells.length;q++)u.bells[q].rotation.z=Math.sin(t*3.2+q*0.65)*Math.max(morning,festival)*0.28;
  }
  if(u.drops){
    for(let q=0;q<12;q++){
      const a=(q%6)/6*TAU,p=(t*0.85+(q/6|0)*0.5+q*0.07)%1;
      fountainPoint(a,p,_v);_m4.compose(_v,_q.identity(),_s.set(0.013,0.022,0.013));u.drops.setMatrixAt(q,_m4);
    }
    u.drops.instanceMatrix.needsUpdate=true;
    u.waterArcs.scale.y=1+Math.sin(t*1.1)*0.008;
    u.ripples.forEach((m,q)=>{const p=(t*0.55+q/3)%1;m.scale.setScalar(1+p*1.7);m.material.opacity=Math.sin(p*Math.PI)*0.2;});
  }
}
// Modelled plank hull and gunwales. Sails are attached separately and deform in the wind.
function livingBoatGeo(){
  const b=new MB();
  b.sph(0.5,0,0.13,0,0x825238,[1.75,0.5,0.63],2).box(1.25,0.045,0.43,0,0.235,0,C.woodL);
  for(let q=0;q<7;q++)b.box(0.022,0.012,0.43,-0.54+q*0.18,0.277,0,C.woodD);
  for(const side of [-1,1]){
    b.box(1.22,0.045,0.035,0,0.27,side*0.244,C.woodD).box(1.1,0.021,0.03,0,0.166,side*0.278,C.gold);
    for(let q=0;q<5;q++)b.box(0.027,0.12,0.027,-0.48+q*0.24,0.18,side*0.25,C.woodL);
  }
  b.box(0.38,0.16,0.32,-0.42,0.28,0,0xc38d59).gable(0.44,0.12,0.39,-0.42,0.43,0,0x3d7184);
  b.cyl(0.024,0.037,1.52,8,0.1,0.26,0,C.woodD).box(0.035,0.035,0.86,0.12,1.59,0,C.woodL);
  b.box(0.015,0.015,0.77,0.12,0.67,0,C.woodD).box(0.018,0.56,0.018,-0.6,0.29,0,C.woodD,[0,0,-0.6]);
  b.box(0.18,0.16,0.18,0.5,0.28,0.05,C.woodL,[0,0.4,0]).cyl(0.08,0.08,0.18,10,0.55,0.28,-0.15,C.woodD);
  b.cyl(0.083,0.083,0.018,10,0.55,0.31,-0.15,C.iron).cyl(0.083,0.083,0.018,10,0.55,0.42,-0.15,C.iron);
  return b.build().geo;
}
mBoat=livingBoatGeo;
function animateBoatCloth(m,dt,t){
  if(!m.userData.livingSail){
    const cloth=makeCloth(0.8,0.89,0xf9efd7,0xe3ac46,true);cloth.position.set(0.15,1.56,-0.4);cloth.rotation.y=-Math.PI/2;m.add(cloth);
    const flag=makeCloth(0.2,0.12,0xd46349,0,false);flag.position.set(0.11,1.8,0);m.add(flag);
    m.userData.livingSail=cloth;
  }
  m.userData.livingSail.rotation.y=-Math.PI/2+Math.sin(t*0.4)*0.035;
}
