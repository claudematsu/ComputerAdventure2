/* ============================================================
   13-ruang-pintu-panduan.js
   Ruang, pintu, banner tujuan, panah penunjuk arah
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- ruang, pintu, tujuan, panah, suara ---------- */
var BASE_ALL=['deskH','desk0','desk1','desk2','desk3','desk4','net','printer','server','cab','rack','tech','plants','board','door'];
var WALL0=[0xBDEBD5,0xD7D0FF,0xFFE9A8,0xFFD1C2];
function tintWalls(c){return [c,c,c,c];}
var AREAS=[null,
  {name:'RUANG 1',sub:'Kenalan dengan perangkat',lay:BASE_ALL,floor:0xFFFFFF,walls:WALL0,intro:''},
  {name:'RUANG 2',sub:'Merakit komputer',lay:['asm','door'],floor:0xDFFFEF,walls:tintWalls(0xB9F0D2),intro:'Selamat datang di ruang merakit! Ambil benda berwarna hijau, lalu pasang di meja.'},
  {name:'RUANG 3',sub:'Input, Proses, Output',lay:['l3','board','door'],floor:0xFFF5D0,walls:tintWalls(0xFFE9A8),intro:'Di sini kita belajar input, proses, dan output. Ambil benda ungu, lalu taruh di tempat yang benar.'},
  {name:'RUANG 4',sub:'Teknisi komputer',lay:['l4','tech','door'],floor:0xEAE5FF,walls:tintWalls(0xD7D0FF),intro:'Aduh, komputernya rusak! Yuk, periksa bagian yang ada tanda tanya.'},
  {name:'RUANG 5',sub:'Jaringan komputer',lay:['l5','net','desk2','door'],floor:0xDDF3FF,walls:tintWalls(0xBFE3FF),intro:'Ini ruang jaringan! Ambil kabel biru, lalu sambungkan komputer sampai ke internet.'},
  {name:'RUANG 6',sub:'Keamanan komputer',lay:['l6','desk0','desk1','desk3','door'],floor:0xFFE6E0,walls:tintWalls(0xFFD1C2),intro:'Hati-hati di dunia digital! Cari tanda seru, lalu pilih yang paling aman.'},
  {name:'RUANG 7',sub:'Algoritma',lay:['l7','door'],floor:0xF1E6FF,walls:tintWalls(0xE2D3FF),intro:'Ayo bantu robot sampai ke komputer! Susun langkah-langkahnya, ya.'},
  {name:'MISI BESAR',sub:'Nyalakan lab kembali',lay:BASE_ALL.concat(['l5','l8']),floor:0xFFFFFF,walls:WALL0,intro:'Ini misi besar! Ayo nyalakan lab kembali.'}
];
var doorArrow=new THREE.Sprite(new THREE.SpriteMaterial({map:arrowTex.tex,transparent:true,depthTest:false}));
doorArrow.scale.set(0.9,0.9,0.9);doorArrow.position.set(5.8,4.3,-6.6);doorArrow.renderOrder=10;doorArrow.visible=false;scene.add(doorArrow);
var DOOR_POS={x:5.8,z:-6.4};
function setArea(n,place){
  var A=AREAS[n],m=1;
  A.lay.forEach(function(k){m|=(1<<AREA_L[k]);});
  areaMask=m;camera.layers.mask=m;
  WALLS.forEach(function(w,i){w.material.color.setHex(A.walls[i%A.walls.length]);});
  floor.material.color.setHex(A.floor);
  state.area=n;
  if(place){pos.set(5.8,0,-5.2);vel.set(0,0,0);yaw=Math.PI;pitch=0.4;}
}
function refreshDoor(){
  doorSignT.redraw();lockArc.visible=!state.doorTo;doorArrow.visible=!!state.doorTo;
}
function openDoor(n){
  state.doorTo=n;refreshDoor();updateGoal();
  setTimeout(function(){if(state.doorTo===n&&!state.panelOpen){say('Pintunya sudah terbuka. Yuk, masuk!');}},2400);
}
function clearBag(){
  for(var i=0;i<3;i++){var it=state.inv[i];if(it){it.state='installed';it.g.visible=false;if(it.rec){it.rec.active=false;}state.inv[i]=null;}}
  state.sel=0;refreshInv();
}
function showBanner(n){
  var A=AREAS[n],b=$('#areabanner');
  b.textContent=A.name;var sm=document.createElement('small');sm.textContent=A.sub;b.appendChild(sm);
  b.hidden=false;setTimeout(function(){b.hidden=true;},2800);
}
function enterNext(){
  var n=state.doorTo;if(!n||state.transition){return;}
  state.transition=true;$('#fade').className='on';sfx.open();
  setTimeout(function(){
    state.doorTo=0;refreshDoor();clearBag();
    setArea(n,true);
    ({2:startLevel2,3:startLevel3,4:startLevel4,5:startLevel5,6:startLevel6,7:startLevel7,8:startLevel8})[n]();
    updateMission();updateGoal();
    $('#fade').className='';state.transition=false;
    showBanner(n);say(AREAS[n].intro);
  },520);
}
/* tujuan singkat untuk anak */
var DEVIC={monitor:'🖥️',keyboard:'⌨️',mouse:'🖱️',cpu:'🧠',speaker:'🔊',printer:'🖨️',router:'📡',switch:'🔀'};
function heldKind(){var h=heldItem();return h?h.def:null;}
function goalFor(){
  if(state.doorTo){return {ic:'🚪',tx:'Masuk pintu hijau',n:0,tot:0};}
  var a=state.area,d=heldKind();
  if(a===1){
    if(state.ch){return {ic:DEVIC[state.ch.id]||'🔍',tx:'Cari '+state.ch.name,n:state.nChecked,tot:COUNT};}
    return {ic:'🔍',tx:'Dekati tanda ?',n:state.nChecked,tot:COUNT};
  }
  if(a===2){
    var c2=['monitor','keyboard','mouse'].filter(function(k){return state.l2in[k];}).length;
    if(d&&d.l2){return {ic:'🛠️',tx:CABLE_PORT[d.id]?'Pasang di CPU':'Pasang di meja',n:state.l2n,tot:6};}
    return {ic:'🟢',tx:c2<3?'Ambil benda hijau':'Ambil kabel hijau',n:state.l2n,tot:6};
  }
  if(a===3){
    if(d&&d.l3){return {ic:'📥',tx:'Taruh di area',n:state.l3n,tot:6};}
    return {ic:'🟣',tx:'Ambil benda ungu',n:state.l3n,tot:6};
  }
  if(a===4){
    if(svc.fixed){return {ic:'✨',tx:'Hebat!',n:state.l4n,tot:3};}
    if(svc.found){return {ic:'🔧',tx:'Perbaiki tanda !',n:state.l4n,tot:3};}
    return {ic:'🔍',tx:'Periksa tanda ?',n:state.l4n,tot:3};
  }
  if(a===5){
    if(d&&d.l5){return {ic:'🔌',tx:'Colokkan kabel',n:nw.nLinks,tot:3};}
    return {ic:'🔵',tx:'Ambil kabel biru',n:nw.nLinks,tot:3};
  }
  if(a===6){return {ic:'❗',tx:'Cari tanda !',n:sec.nSolved,tot:4};}
  if(a===7){return {ic:'🤖',tx:'Tolong robot',n:algo.solved.filter(Boolean).length,tot:3};}
  if(state.l8Done){return {ic:'🏆',tx:'Selesai!',n:6,tot:6};}
  var s=L8.s;
  if(!s[0]){return {ic:'🟠',tx:(d&&d.l8)?'Pasang di komputer':'Ambil benda oranye',n:L8.sCount(),tot:6};}
  if(!s[1]){return {ic:'🔵',tx:(d&&d.l5)?'Colokkan kabel biru':'Ambil kabel biru',n:L8.sCount(),tot:6};}
  if(!s[2]){return {ic:'🖨️',tx:(d&&d.l8)?'Colokkan ke printer':'Ambil kabel printer',n:L8.sCount(),tot:6};}
  if(!s[3]){return {ic:'💡',tx:'Nyalakan komputer',n:L8.sCount(),tot:6};}
  if(!s[4]){return {ic:'▶️',tx:'Jalankan program',n:L8.sCount(),tot:6};}
  return {ic:'🖨️',tx:'Cetak hasil',n:L8.sCount(),tot:6};
}
function updateGoal(){
  var g=goalFor();
  $('#g-ic').textContent=g.ic;$('#g-tx').textContent=g.tx;
  var p=$('#g-pips');p.textContent='';
  for(var i=0;i<g.tot;i++){var d=document.createElement('i');if(i<g.n){d.className='on';}p.appendChild(d);}
}
/* panah penunjuk arah */
function nearestFree(list,filter){
  var best=null,bd=1e9;
  list.forEach(function(it){
    if(it.state!=='free'||!it.rec.active){return;}
    if(filter&&!filter(it)){return;}
    var d=Math.hypot(it.rec.pos.x-pos.x,it.rec.pos.z-pos.z);if(d<bd){bd=d;best=it.rec.pos;}
  });
  return best;
}
function guidePos(){
  if(state.doorTo){return DOOR_POS;}
  var a=state.area,d=heldKind(),i;
  if(a===1){
    if(state.stageDone){return null;}
    var id=state.ch?state.ch.id:null;
    if(!id){var un=specs.filter(function(q){return q.counted&&!state.checked[q.id];});un.sort(function(p,q){return Math.hypot(p.pos.x-pos.x,p.pos.z-pos.z)-Math.hypot(q.pos.x-pos.x,q.pos.z-pos.z);});return un.length?un[0].pos:null;}
    for(i=0;i<specs.length;i++){if(specs[i].id===id&&specs[i].counted){return specs[i].pos;}}
    return null;
  }
  if(a===2){
    if(d&&d.l2){return CABLE_PORT[d.id]?cpuRec.pos:asmRec.pos;}
    return nearestFree(l2items)||asmRec.pos;
  }
  if(a===3){
    if(d&&d.l3){return ZONES.proc.rec.pos;}
    return nearestFree(l3items)||ZONES.proc.rec.pos;
  }
  if(a===4){
    var cps=svc.list.filter(function(c){return c.rec.active;});
    for(i=0;i<cps.length;i++){if(cps[i].st==='bad'){return cps[i].rec.pos;}}
    for(i=0;i<cps.length;i++){if(cps[i].st==='new'){return cps[i].rec.pos;}}
    return null;
  }
  if(a===5){
    if(nw.done){return null;}
    if(d&&d.l5){return nw.ports.sw1.rec.pos;}
    return nearestFree(l5items)||nw.ports.sw1.rec.pos;
  }
  if(a===6){
    var us=SITS.filter(function(q){return !q.solved;});
    us.sort(function(p,q){return Math.hypot(p.rec.pos.x-pos.x,p.rec.pos.z-pos.z)-Math.hypot(q.rec.pos.x-pos.x,q.rec.pos.z-pos.z);});
    return us.length?us[0].rec.pos:null;
  }
  if(a===7){return state.algoOpen?null:algo.rec.pos;}
  if(state.l8Done){return null;}
  var s=L8.s;
  if(!s[0]){
    if(d&&d.l8&&(d.kind==='monitor'||d.kind==='keyboard'||d.kind==='mouse')){return L8.deskRec.pos;}
    return nearestFree(l8items,function(it){return it.def.kind!=='printercable'&&!L8.inst[it.def.kind];})||L8.deskRec.pos;
  }
  if(!s[1]){
    if(d&&d.l5){return nw.ports.sw1.rec.pos;}
    return nearestFree(l5items)||nw.ports.sw1.rec.pos;
  }
  if(!s[2]){
    if(d&&d.l8&&d.kind==='printercable'){return L8.prnRec.pos;}
    return nearestFree(l8items,function(it){return it.def.kind==='printercable';})||L8.prnRec.pos;
  }
  if(!s[5]&&s[4]){return L8.prnRec.pos;}
  return L8.deskRec.pos;
}
function updateGuideHUD(){
  var g=$('#guide');
  if(state.mode!=='play'||state.panelOpen||state.transition){g.hidden=true;return;}
  var gp=guidePos();if(!gp){g.hidden=true;return;}
  var dx=gp.x-pos.x,dz=gp.z-pos.z,dist=Math.hypot(dx,dz);
  if(dist<1.7){g.hidden=true;return;}
  var fx=-Math.sin(yaw),fz=-Math.cos(yaw);
  var ang=Math.atan2(dx*(-fz)+dz*fx,dx*fx+dz*fz);
  $('#g-ar').style.transform='rotate('+ang+'rad)';
  $('#g-d').textContent=Math.round(dist)+' m';
  g.hidden=false;
}
$('#f-again').addEventListener('click',restartGame);
$('#f-stay').addEventListener('click',hideFinal);
$('#restart').addEventListener('click',function(){if(state.l8Done&&!state.panelOpen){showFinal();}});
$('.mission').addEventListener('click',function(){this.classList.toggle('open');});
$('#goal').addEventListener('click',function(){$('.mission').classList.toggle('open');});
function hideToast(){$('#toast').hidden=true;}
$('#toast').addEventListener('click',hideToast);
$('#badge-pill').addEventListener('click',function(){if(state.progOpen){closeProg();}else{openProg();}});
$('#prog-close').addEventListener('click',closeProg);
$('#prog').addEventListener('click',function(e){if(e.target===this){closeProg();}});
$('#p-close').addEventListener('click',closePanel);

var target=null, hl=null, lastPrompt=null, idleT=0;
function setHL(o){
  if(hl===o){return;}
  if(hl){hl.mats.forEach(function(m){m.emissive.setHex(0);m.emissiveIntensity=1;});}
  hl=o;
}
function pickTarget(){
  var fx=-Math.sin(yaw), fz=-Math.cos(yaw), best=null, bs=1e9;
  for(var i=0;i<interactables.length;i++){
    var o=interactables[i], dx=o.pos.x-pos.x, dz=o.pos.z-pos.z, d=Math.hypot(dx,dz);
    if(o.active===false||d>o.range){continue;}
    if(o.group&&o.group.__layer&&!((areaMask>>o.group.__layer)&1)){continue;}
    var dot=d>0.001?(dx*fx+dz*fz)/d:1;
    if(dot<0.25&&d>1.4){continue;}
    var sc=d-dot*1.2-(o.bias||0);
    if(sc<bs){bs=sc;best=o;}
  }
  return best;
}
function tryInteract(){
  if(state.mode!=='play'){return;}
  if(!$('#toast').hidden){hideToast();return;}
  if(state.panelOpen){closePanel();return;}
  if(target){
    if(target.isItem){pickUp(target);}
    else if(target.isCrate){useCrate();}
    else if(target.isAsm){useAsm();}
    else if(target.isCpu){useCpu();}
    else if(target.isZone){useZone(target);}
    else if(target.isCheck){useCheck(target);}
    else if(target.isNetPort){useNetPort(target);}
    else if(target.isSit){openChoice(target.sit);}
    else if(target.id==='door'&&state.doorTo){enterNext();}
    else if(target.isAlgo){openAlgo();}
    else if(target.isL8){useL8(target);}
    else{openPanel(target);}
  }
}
