/* ============================================================
   05-level3-ipo.js
   Level 3: Input, Proses, Output
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 3: input, proses, output ---------- */
MK('l3');
var l3items=[];
function mkPrinter(g){
  box(g,1.2,0.5,0.85,L(0xF1F3FA),0,0.25,0);
  box(g,1.2,0.06,0.85,L(0xC7CEE8),0,0.53,0);
  box(g,0.9,0.08,0.02,L(0x2B3A67),0,0.22,0.43);
  box(g,0.9,0.03,0.4,L(0x9AA6C9),0,0.1,0.62);
  box(g,0.7,0.012,0.5,L(0xFFFFFF),0,0.13,0.64);
  var pf=box(g,0.8,0.02,0.5,L(0xFFFFFF),0,0.78,-0.3);pf.rotation.x=0.6;
}
var L3DEFS=[
  {id:'l3-keyboard',name:'Keyboard',icon:'⌨️',zone:'input',hold:0.6,l3:true,build:function(g){makeKeyboard(g,0,0,0);},ok:'Keyboard memasukkan huruf dan angka ke komputer.',hint:'Benda ini dipakai untuk mengetik, yaitu memasukkan data.'},
  {id:'l3-mouse',name:'Mouse',icon:'🖱️',zone:'input',hold:1.5,l3:true,build:function(g){makeMouse(g,0,0,0);},ok:'Mouse memasukkan perintah gerak pointer ke komputer.',hint:'Benda ini kita gerakkan dengan tangan untuk memberi perintah.'},
  {id:'l3-cpu',name:'CPU',icon:'🧠',zone:'proc',hold:0.6,fs:0.5,l3:true,build:function(g){makeCPU(g,0,0,0);},ok:'CPU memproses data. Ia otak komputer.',hint:'Benda ini berpikir dan mengolah data.'},
  {id:'l3-monitor',name:'Monitor',icon:'🖥️',zone:'out',hold:0.5,fs:0.55,l3:true,build:function(g){makeMonitor(g,0,0,0);},ok:'Monitor menampilkan hasil kerja komputer.',hint:'Benda ini menampilkan gambar dan tulisan, yaitu hasil kerja.'},
  {id:'l3-speaker',name:'Speaker',icon:'🔊',zone:'out',hold:1.2,l3:true,build:function(g){makeSpeaker(g,0,0,0);},ok:'Speaker mengeluarkan suara, hasil kerja komputer.',hint:'Benda ini mengeluarkan suara.'},
  {id:'l3-printer',name:'Printer',icon:'🖨️',zone:'out',hold:0.5,fs:0.5,l3:true,build:mkPrinter,ok:'Printer mencetak hasil kerja ke kertas.',hint:'Benda ini mencetak hasil ke kertas.'}
];
var L3SPOTS=[[-4.4,-0.85],[0,-0.85],[4.4,-0.85],[-5.0,3.0],[1.2,3.1],[4.6,3.3],[-7.3,-1.9],[0.3,6.1],[2.6,6.1],[-3.0,5.6]];
L3DEFS.forEach(function(d,i){
  var g=grp(world,0,0,0,0);
  var model=grp(g,0,0.42,0,0);d.build(model);model.scale.setScalar(d.fs||1);
  var ring=new THREE.Mesh(new THREE.RingGeometry(0.42,0.56,28),BM(0x7A5CFF,{transparent:true,opacity:0.95,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2;ring.position.y=0.02;g.add(ring);
  var it={def:d,g:g,model:model,ring:ring,state:'free',got:false,ph:i*0.9+0.2,wrongN:0};
  var o={id:'l3item:'+d.id,isItem:true,item:it,group:g,name:d.name,type:'PERANGKAT',range:1.7,bias:0.6,active:false,pos:new THREE.Vector3(0,0.5,0),mats:collectMats(model)};
  g.visible=false;it.rec=o;l3items.push(it);interactables.push(o);
});
var ZONES={
  input:{label:'INPUT',sub:'memasukkan data',color:0x14B8A6,x:-4.0},
  proc:{label:'PROSES',sub:'mengolah data',color:0xFFC83D,x:0},
  out:{label:'OUTPUT',sub:'menampilkan hasil',color:0xFF6F59,x:4.0}
};
Object.keys(ZONES).forEach(function(k){
  var z=ZONES[k], zg=grp(world,z.x,0,-5.6,0);
  z.g=zg;z.padMat=L(z.color);
  box(zg,2.6,0.08,1.9,z.padMat,0,0.04,0);
  var tx=canvasTex(256,192,function(x,w,h){
    x.fillStyle='rgba(255,255,255,.9)';rr(x,10,10,w-20,h-20,22);x.fill();
    label(x,z.label,w/2,h*0.42,k==='proc'?50:56,'#1B2559');
    label(x,z.sub,w/2,h*0.76,22,'#5A6AA8');
  });
  plane(zg,2.3,1.7,BM(0xFFFFFF,{map:tx.tex}),0,0.092,0,-Math.PI/2,0);
  z.flashMesh=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.9),BM(0x22CC66,{transparent:true,opacity:0}));
  z.flashMesh.rotation.x=-Math.PI/2;z.flashMesh.position.y=0.1;zg.add(z.flashMesh);
  z.l1=labelSprite(zg,z.label,0,1.75,0,1.5);
  z.l2=labelSprite(zg,z.sub,0,1.4,0,1.3);
  z.pop=new THREE.Sprite(new THREE.SpriteMaterial({map:okTex.tex,transparent:true,depthTest:false}));
  z.pop.scale.set(0.6,0.6,0.6);z.pop.visible=false;z.pop.renderOrder=10;zg.add(z.pop);
  z.flash=0;z.shake=0;z.popT=0;z.n=0;
  z.rec={id:'zone-'+k,isZone:true,zone:k,group:zg,name:'Area '+z.label,type:'AREA',range:2.4,bias:0.3,active:true,pos:new THREE.Vector3(z.x,0.4,-5.6),mats:[z.padMat]};
  interactables.push(z.rec);
});
var l3Arrow=new THREE.Sprite(new THREE.SpriteMaterial({map:arrowTex.tex,transparent:true,depthTest:false}));
l3Arrow.scale.set(0.9,0.9,0.9);l3Arrow.position.set(0,3.4,-5.6);l3Arrow.renderOrder=10;l3Arrow.visible=false;scene.add(l3Arrow);
MK('shell');

function startLevel3(){
  state.l3Active=true;state.level=3;updateStats();
  var pool=L3SPOTS.slice().sort(function(){return Math.random()-0.5;});
  l3items.forEach(function(it,i){
    var sp=pool[i];
    it.g.position.set(sp[0],0,sp[1]);it.rec.pos.set(sp[0],0.5,sp[1]);
    it.g.visible=true;it.rec.active=true;
  });
  Object.keys(ZONES).forEach(function(k){ZONES[k].l1.visible=true;ZONES[k].l2.visible=true;});
  updateMission();
}
function flashZone(z,ok){
  z.flashMesh.material.color.setHex(ok?0x22CC66:0xFF3030);
  z.flash=0.8;
  if(ok){z.popT=1;}else{z.shake=0.45;}
}
function sortItem(it,z){
  state.inv[state.sel]=null;it.state='sorted';
  var idx=z.n++;
  z.g.add(it.g);
  it.g.position.set((idx-1)*0.85,0,0.05);it.g.rotation.set(0,0,0);it.g.scale.setScalar(1);it.g.visible=true;
  it.model.position.y=0.12;it.model.rotation.y=0;it.model.scale.setScalar(it.def.fs||1);
  it.ring.visible=false;
  z.pop.position.x=(idx-1)*0.85;
  for(var i=0;i<3;i++){if(state.inv[i]){state.sel=i;break;}}
  state.l3n++;
  flashZone(z,true);addXP(20);sfx.reward();refreshInv();updateMission();
  var left=6-state.l3n;
  if(left===0){say('Benar! '+it.def.ok+' Semua perangkat sudah di tempat yang benar!',true);setTimeout(finishLevel3,900);}
  else{say('Benar! '+it.def.ok+' Tinggal '+left+' lagi!');}
}
function useZone(rec){
  if(!state.l2Done){say('Level 3 masih terkunci. Selesaikan Level 2 dulu, ya!');return;}
  if(state.l3Done){say('Kamu sudah memilah semua perangkat. Hebat!');return;}
  var z=ZONES[rec.zone], it=heldItem();
  if(!it){say('Ini area '+z.label+' ('+z.sub+'). Bawa perangkat ke sini, lalu tekan E.');return;}
  if(!it.def.l3){say('Benda ini bukan bagian Level 3. Letakkan dengan Q, lalu ambil perangkat bercincin ungu.');sfx.close();return;}
  if(it.def.zone===rec.zone){sortItem(it,z);}
  else{
    it.wrongN++;sfx.close();flashZone(z,false);
    say(it.wrongN>=2?'Belum tepat. Petunjuk: '+it.def.hint:'Belum tepat. Apakah '+it.def.name+' memasukkan, mengolah, atau menampilkan data?');
  }
}
function finishLevel3(){
  state.l3Done=true;state.levelsDone[3]=true;
  addXP(30);sfx.reward();confetti();updateMission();
  setTimeout(function(){addXP(100,1);},600);
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 3 · INPUT, PROSES, OUTPUT</div><h2>MISSION COMPLETE</h2><p>Kamu memilah semua perangkat dengan benar!</p><p>+130 XP · ⭐ +1</p><p>🔓 Level 4: Teknisi Komputer terbuka</p></div>';
  t.hidden=false;setTimeout(hideToast,7000);
  say('Hebat! Misi selesai!');
  openDoor(4);
}
