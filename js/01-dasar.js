/* ============================================================
   01-dasar.js
   Dasar: renderer, scene, kamera, helper bentuk, tekstur kanvas
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* Variabel global yang diisi di file lain. Dideklarasikan dulu di sini supaya
   aman dipakai saat semua file dimuat berurutan. */
var solids, blinkers, specs, AREA_L, areaMask, marks, WALLS, floor, boardG, boardT, doorG,
    lockArc, doorSignT, chairColors, deskX, ci, hero, otherDesks, netG, routerG, switchG,
    prtT, printerG, pf, srvG, cabG, rackG, itemCols, matT, benchG, tb, handle, pegT, INFO,
    COUNT, SECOND_DY, interactables, ITEMDEFS, items, crateG, crateRec, CRATE_SLOTS, l2items,
    L2DEFS, asmG, deskG, ghostMat, ghosts, glabels, cpuG, cpuLabel, asmSignT, asmRec, cpuRec,
    asmArrow, asmParts, boot, scr, bootT, CABLE_PORT, COMP_KINDS, KIND_NAMES, OK_MSG,
    PORT_HINT, PORTS, l3items, L3DEFS, L3SPOTS, ZONES, l3Arrow, svc, SVX, SVZ, svcT, svcSignT,
    CPDEF, CASES, l5items, nw, NCHAIN, NLINK, NPORTS, DEVNAME, netT, L5SPOTS, SITS, SIT, sec,
    secT, SEC_SPOTS, TEACHER_BOX, AX0, AZ0, ACELL, ACOLS, AROWS, MAXB, ADIR, ARY, CMD, PUZ,
    algo, l8items, L8, L8TASKS, L8SPOTS, L8DEFS, l8T, sysT, state, chT, SPAWN, pos, vel, yaw,
    pitch, camDist, kidFace, phase, armWave, kid, bot, typeTimer, hideTimer, ac, sfx,
    CHALLENGES, LEVELS, BADGES, tut, BASE_ALL, WALL0, AREAS, doorArrow, DOOR_POS, DEVIC,
    target, hl, lastPrompt, idleT, keys, dragging, MOVE_KEYS, joy, joyId, lookId, lastLook,
    joyEl, knob, SPEED, R, T, camLook, lookT, camWant, menuA, last;

var $=function(s){return document.querySelector(s);};
var app=$('#app'), canvas=$('#c');
if(typeof THREE==='undefined'){ $('#nogl').hidden=false; throw new Error('Three.js belum termuat (butuh internet).'); }
var renderer;
try{ renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true}); }
catch(err){ $('#nogl').hidden=false; throw err; }

var reduceMotion=false;
try{ reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
var FONT="'Baloo 2','Trebuchet MS','Arial Rounded MT Bold',sans-serif";
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerpAngle(a,b,t){var d=((b-a+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return a+d*t;}

/* ---------- renderer, scene, kamera ---------- */
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
var scene=new THREE.Scene();
scene.background=new THREE.Color(0xCDEBFF);
var camera=new THREE.PerspectiveCamera(60,1,0.1,80);
var hemi=new THREE.HemisphereLight(0xFFFFFF,0xBFD6F5,0.82);scene.add(hemi);
var sun=new THREE.DirectionalLight(0xFFF3DC,0.55);
sun.position.set(7,15,9);
sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-13;sun.shadow.camera.right=13;sun.shadow.camera.top=11;sun.shadow.camera.bottom=-11;
sun.shadow.camera.near=2;sun.shadow.camera.far=40;
sun.shadow.bias=-0.0006;
scene.add(sun);
var world=new THREE.Group();
scene.add(world);

function resize(){
  var w=app.clientWidth||innerWidth, h=app.clientHeight||innerHeight;
  if(typeof state!=='undefined'&&state&&state.algoView&&typeof algoLayout==='function'){setTimeout(function(){algoLayout(true);},0);}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  renderer.setSize(w,h,false);
  camera.aspect=w/h;
  camera.fov=camera.aspect<1?78:60;
  camera.updateProjectionMatrix();
}
if(window.ResizeObserver){ new ResizeObserver(resize).observe(app); }
window.addEventListener('resize',resize);
resize();

/* ---------- helper bentuk ---------- */
function L(c,o){return new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));}
function BM(c,o){return new THREE.MeshBasicMaterial(Object.assign({color:c},o||{}));}
function put(p,m,x,y,z){m.position.set(x||0,y||0,z||0);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;}
function box(p,w,h,d,mat,x,y,z){return put(p,new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat),x,y,z);}
function cyl(p,rt,rb,h,mat,x,y,z,seg){return put(p,new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||14),mat),x,y,z);}
function sph(p,r,mat,x,y,z,ws,hs){return put(p,new THREE.Mesh(new THREE.SphereGeometry(r,ws||14,hs||10),mat),x,y,z);}
function plane(p,w,h,mat,x,y,z,rx,ry){var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,0);p.add(m);return m;}
function grp(p,x,y,z,ry){var g=new THREE.Group();g.position.set(x||0,y||0,z||0);g.rotation.y=ry||0;p.add(g);return g;}
function tube(p,pts,r,color){
  var c=new THREE.CatmullRomCurve3(pts.map(function(a){return new THREE.Vector3(a[0],a[1],a[2]);}));
  var m=new THREE.Mesh(new THREE.TubeGeometry(c,18,r,6,false),L(color));
  m.castShadow=true;p.add(m);return m;
}
var seed=11;
function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}

/* ---------- tekstur kanvas ---------- */
var redrawables=[];
function rr(x,px,py,w,h,r){x.beginPath();x.moveTo(px+r,py);x.arcTo(px+w,py,px+w,py+h,r);x.arcTo(px+w,py+h,px,py+h,r);x.arcTo(px,py+h,px,py,r);x.arcTo(px,py,px+w,py,r);x.closePath();}
function canvasTex(w,h,draw){
  var c=document.createElement('canvas');c.width=w;c.height=h;
  var x=c.getContext('2d');draw(x,w,h);
  var t=new THREE.CanvasTexture(c);
  t.anisotropy=4;
  var o={tex:t,redraw:function(){x.clearRect(0,0,w,h);draw(x,w,h);t.needsUpdate=true;}};
  redrawables.push(o);
  return o;
}
function label(x,str,cx,cy,size,color){x.font='800 '+size+'px '+FONT;x.textAlign='center';x.textBaseline='middle';x.fillStyle=color;x.fillText(str,cx,cy);}

var floorT=canvasTex(128,128,function(x,w,h){
  x.fillStyle='#D3ECF8';x.fillRect(0,0,w,h);
  x.fillStyle='#EBF8FD';x.fillRect(0,0,64,64);x.fillRect(64,64,64,64);
  x.strokeStyle='rgba(110,150,200,.35)';x.lineWidth=2;x.strokeRect(1,1,w-2,h-2);
});
floorT.tex.wrapS=floorT.tex.wrapT=THREE.RepeatWrapping;
floorT.tex.repeat.set(9,7);

var kbT=canvasTex(512,192,function(x,w,h){
  x.fillStyle='#DFE6F6';x.fillRect(0,0,w,h);
  var rows=[13,12,11,9], kw=(w-30)/13, kh=36, gap=5, y=12;
  rows.forEach(function(n,ri){
    var off=15+ri*kw*0.35;
    for(var i=0;i<n;i++){
      x.fillStyle=(ri===1&&i===11)||(ri===2&&i===10)?'#FF6F59':'#FFFFFF';
      rr(x,off+i*kw+gap/2,y,kw-gap,kh,6);x.fill();
      x.strokeStyle='#9AA8D0';x.lineWidth=2;x.stroke();
    }
    y+=kh+gap+3;
  });
  x.fillStyle='#14B8A6';rr(x,110,y,290,kh,8);x.fill();x.strokeStyle='#1B2559';x.lineWidth=2;x.stroke();
});

function markerTex(kind){
  return canvasTex(128,128,function(x){
    x.fillStyle=kind==='q'?'#FFC83D':(kind==='w'?'#FF6F59':'#27C281');
    x.beginPath();x.arc(64,64,54,0,Math.PI*2);x.fill();
    x.lineWidth=8;x.strokeStyle='#1B2559';x.stroke();
    if(kind==='q'){label(x,'?',64,70,84,'#1B2559');}
    else if(kind==='w'){label(x,'!',64,70,84,'#FFFFFF');}
    else{x.lineWidth=14;x.lineCap='round';x.lineJoin='round';x.strokeStyle='#FFFFFF';x.beginPath();x.moveTo(36,66);x.lineTo(56,86);x.lineTo(94,44);x.stroke();}
  });
}
var qTex=markerTex('q'), okTex=markerTex('ok'), warnTex=markerTex('w');
var arrowTex=canvasTex(128,128,function(x){
  x.fillStyle='#FF6F59';x.beginPath();x.arc(64,64,54,0,Math.PI*2);x.fill();
  x.lineWidth=8;x.strokeStyle='#1B2559';x.stroke();
  x.fillStyle='#FFFFFF';x.beginPath();x.moveTo(38,50);x.lineTo(90,50);x.lineTo(64,92);x.closePath();x.fill();
});
