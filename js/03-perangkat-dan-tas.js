/* ============================================================
   03-perangkat-dan-tas.js
   Objek yang bisa diperiksa (Level 1), tas, ambil/letakkan benda
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- objek interaktif ---------- */
var INFO={
  monitor:{name:'Monitor',type:'PERANGKAT OUTPUT',desc:'Monitor menampilkan gambar, tulisan, dan video dari komputer.',fact:'Layar tersusun dari titik-titik kecil bernama piksel.',bot:'Lewat monitor, kita bisa melihat kerja komputer!'},
  keyboard:{name:'Keyboard',type:'PERANGKAT INPUT',desc:'Keyboard digunakan untuk mengetik huruf, angka, dan simbol.',fact:'Susunan huruf Q W E R T Y di keyboard disebut QWERTY.',bot:'Mengetik jadi mudah dengan keyboard!'},
  mouse:{name:'Mouse',type:'PERANGKAT INPUT',desc:'Mouse digunakan untuk menggerakkan pointer di layar.',fact:'Mouse pertama di dunia terbuat dari kayu.',bot:'Benar! Mouse digunakan untuk menggerakkan pointer.'},
  cpu:{name:'CPU / System Unit',type:'PERANGKAT PROSES',desc:'CPU adalah otak komputer. Di sinilah komputer berpikir dan bekerja.',fact:'Komputer bisa menghitung miliaran langkah setiap detik.',bot:'CPU itu otaknya komputer. Keren, kan?'},
  speaker:{name:'Speaker',type:'PERANGKAT OUTPUT',desc:'Speaker mengeluarkan suara, seperti musik, video, dan suara game.',fact:'Speaker mengubah sinyal listrik menjadi getaran suara.',bot:'Sekarang komputer bisa bersuara!'},
  printer:{name:'Printer',type:'PERANGKAT OUTPUT',desc:'Printer mencetak tulisan atau gambar dari komputer ke kertas.',fact:'Hasil cetak di kertas sering disebut hardcopy.',bot:'Tugas sekolah bisa dicetak dengan printer.'},
  router:{name:'Router',type:'PERANGKAT JARINGAN',desc:'Router membantu menghubungkan jaringan ke jaringan lain, seperti ke internet.',fact:'Banyak router punya antena untuk mengirim sinyal Wi-Fi.',bot:'Router membuat komputer bisa terhubung ke internet.'},
  switch:{name:'Switch',type:'PERANGKAT JARINGAN',desc:'Switch menghubungkan beberapa komputer dalam satu jaringan supaya bisa saling berkirim data.',fact:'Kabel LAN dicolokkan ke lubang yang disebut port.',bot:'Switch itu seperti terminal untuk kabel LAN.'}
};
var COUNT=8;
function spec(id,group,dy,range,extra){specs.push(Object.assign({id:id,group:group,dy:dy,range:range||3.2,counted:!!INFO[id]},INFO[id]||{},extra||{}));}
spec('monitor',hero.monitor,1.7);
spec('keyboard',hero.keyboard,0.6);
spec('mouse',hero.mouse,0.5);
spec('cpu',hero.cpu,1.5);
spec('speaker',hero.speaker,0.95);
spec('printer',printerG,1.2);
spec('router',routerG,1.15);
spec('switch',switchG,0.65);
spec('server',srvG,2.7,3.4,{counted:false,name:'Server',type:'BONUS',desc:'Server adalah komputer besar yang menyimpan data dan melayani banyak komputer lain.',fact:'Situs web yang kamu buka tersimpan di sebuah server.',bot:''});
spec('board',boardG,0,4.2,{counted:false,name:'Papan Informasi',type:'BONUS',desc:'Komputer bekerja dengan tiga langkah: Input, Proses, lalu Output.',fact:'Keyboard dan mouse adalah input. Monitor dan speaker adalah output.',bot:''});
spec('door',doorG,0,3.6,{counted:false,name:'Pintu',type:'BONUS',desc:'Pintu ini terkunci. Kenali dulu semua perangkat di lab, ya!',fact:'Area berikutnya akan terbuka di tahap selanjutnya.',bot:''});

var SECOND_DY={monitor:1.7,keyboard:0.6,mouse:0.5,cpu:1.5};
otherDesks.forEach(function(p){
  ['monitor','keyboard','mouse','cpu'].forEach(function(id){spec(id,p[id],SECOND_DY[id],2.6,{noSprite:true});});
});
var interactables=[];
specs.forEach(function(s){
  var mats=[];
  s.group.traverse(function(c){if(c.isMesh&&c.material&&c.material.emissive&&mats.indexOf(c.material)<0){mats.push(c.material);}});
  s.mats=mats;
  s.pos=new THREE.Vector3();s.group.getWorldPosition(s.pos);
  if(s.counted&&!s.noSprite){
    var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:qTex.tex,transparent:true}));
    sp.scale.set(0.55,0.55,0.55);
    sp.position.set(s.pos.x,s.pos.y+s.dy,s.pos.z);
    s.baseY=sp.position.y;
    scene.add(sp);s.sprite=sp;
  }
  interactables.push(s);
});

/* ---------- tas dan benda yang bisa dibawa ---------- */
function mkUSB(g){
  box(g,0.36,0.08,0.15,L(0x3B82F6),0,0.04,0);
  box(g,0.18,0.05,0.11,L(0xD3DAEC),0.26,0.04,0);
  box(g,0.04,0.02,0.05,L(0x1B2559),0.3,0.04,0);
  var lp=new THREE.Mesh(new THREE.TorusGeometry(0.045,0.014,6,12),L(0xFFC83D));lp.position.set(-0.2,0.04,0);lp.rotation.x=Math.PI/2;g.add(lp);
}
function mkCoil(g,coilC,plugC,pins){
  for(var i=0;i<3;i++){
    var t=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.032,6,18),L(coilC));
    t.position.y=0.04+i*0.06;t.rotation.x=Math.PI/2;t.castShadow=true;g.add(t);
  }
  box(g,0.16,0.1,0.1,L(plugC),0.3,0.06,0);
  for(var k=0;k<pins;k++){box(g,0.07,0.02,0.02,L(0xC8CFE3),0.4,0.06+(k-(pins-1)/2)*0.04,0);}
}
var ITEMDEFS=[
  {id:'mouse',name:'Mouse',icon:'🖱️',spot:[-2.2,-0.85],hold:1.5,build:function(g){makeMouse(g,0,0,0);}},
  {id:'usb',name:'USB Flashdisk',icon:'💾',spot:[2.2,-0.85],hold:1.9,build:mkUSB},
  {id:'keyboard',name:'Keyboard',icon:'⌨️',spot:[6.3,2.6],hold:0.6,build:function(g){makeKeyboard(g,0,0,0);}},
  {id:'power',name:'Kabel Power',icon:'🔌',spot:[-5.8,4.3],hold:1.2,build:function(g){mkCoil(g,0x2B3A67,0xFFFFFF,2);}},
  {id:'hdmi',name:'Kabel HDMI',icon:'📺',spot:[3.0,4.6],hold:1.2,build:function(g){mkCoil(g,0xFF6F59,0x1B2559,1);}},
  {id:'lan',name:'Kabel LAN',icon:'🔗',spot:[5.8,-0.85],hold:1.2,build:function(g){mkCoil(g,0x14B8A6,0x3B82F6,1);}}
];
function collectMats(g){var m=[];g.traverse(function(c){if(c.isMesh&&c.material&&c.material.emissive&&m.indexOf(c.material)<0){m.push(c.material);}});return m;}
MK('off');
var items=[];
ITEMDEFS.forEach(function(d,i){
  var g=grp(world,d.spot[0],0,d.spot[1],0);
  var model=grp(g,0,0.42,0,0);d.build(model);
  var ring=new THREE.Mesh(new THREE.RingGeometry(0.42,0.56,28),BM(0xFFC83D,{transparent:true,opacity:0.9,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2;ring.position.y=0.02;g.add(ring);
  var it={def:d,g:g,model:model,ring:ring,state:'free',got:false,ph:i*1.3};
  var o={id:'item:'+d.id,isItem:true,item:it,group:g,name:d.name,type:'BENDA',range:1.7,bias:0.6,active:true,pos:new THREE.Vector3(d.spot[0],0.5,d.spot[1]),mats:collectMats(model)};
  it.rec=o;items.push(it);interactables.push(o);
});
var crateG=grp(world,-8.1,0,4.6,Math.PI/2);
(function(){
  var wood=L(0xD9A05B), band=L(0x3B82F6);
  box(crateG,1.1,0.08,1.0,wood,0,0.04,0);
  box(crateG,1.1,0.55,0.08,wood,0,0.3,0.46);
  box(crateG,1.1,0.55,0.08,wood,0,0.3,-0.46);
  box(crateG,0.08,0.55,1.0,wood,0.51,0.3,0);
  box(crateG,0.08,0.55,1.0,wood,-0.51,0.3,0);
  box(crateG,1.14,0.07,0.12,band,0,0.58,0.46);
  box(crateG,1.14,0.07,0.12,band,0,0.58,-0.46);
  sign(crateG,0.98,0.3,0,0.3,0.51,0,function(x,w,h){x.fillStyle='#1B2559';rr(x,4,4,w-8,h-8,22);x.fill();label(x,'KOTAK PERANGKAT',w/2,h/2+3,50,'#FFC83D');});
})();
addSolid(-8.1,4.6,1.0,1.1);
var crateRec={id:'crate',isCrate:true,group:crateG,name:'Kotak Perangkat',type:'TEMPAT',range:2.5,bias:0.3,active:true,pos:new THREE.Vector3(-8.1,0.4,4.6),mats:collectMats(crateG)};
interactables.push(crateRec);
MK('shell');
items.forEach(function(it){it.g.visible=false;it.rec.active=false;});crateRec.active=false;
var CRATE_SLOTS=[[-0.28,-0.2],[0,-0.2],[0.28,-0.2],[-0.28,0.2],[0,0.2],[0.28,0.2]];

function heldItem(){return state.inv[state.sel];}
function hitsSolid(x,z,r){
  for(var i=0;i<solids.length;i++){var s=solids[i];if(s.layer&&!((areaMask>>s.layer)&1)){continue;}if(x>s.x0-r&&x<s.x1+r&&z>s.z0-r&&z<s.z1+r){return true;}}
  return false;
}
function refreshInv(){
  var slots=document.querySelectorAll('#inv .slot'), n=0;
  for(var i=0;i<slots.length;i++){
    var it=state.inv[i], sl=slots[i];
    if(it){n++;}
    sl.querySelector('.si').textContent=it?it.def.icon:'';
    sl.querySelector('.sl').textContent=it?it.def.name:'';
    sl.className='slot'+(i===state.sel?' sel':'');
  }
  $('#inv-n').textContent=n+'/3';
  var AIL=allItems();for(var j=0;j<AIL.length;j++){if(AIL[j].state==='held'){AIL[j].g.visible=(AIL[j]===state.inv[state.sel]);}}
  $('#drop-btn').hidden=!heldItem();$('#qbtn').hidden=!heldItem();
  lastPrompt=null;
  if(typeof updateGoal==='function'&&state.mode==='play'){updateGoal();}
}
function selectSlot(i){
  if(state.mode!=='play'||state.panelOpen){return;}
  state.sel=i;refreshInv();sfx.open();
}
function pickUp(o){
  var it=o.item, idx=state.inv.indexOf(null);
  if(idx<0){say('Tasmu penuh! Tekan Q (atau tombol Letakkan) untuk meletakkan satu benda dulu.');sfx.close();return;}
  state.inv[idx]=it;state.sel=idx;it.state='held';o.active=false;it.ring.visible=false;
  it.g.rotation.set(0,0,0);it.g.scale.setScalar(it.def.hold);
  it.model.position.y=0;it.model.rotation.y=0;it.model.scale.setScalar(1);
  /* ukur ukuran benda, lalu pusatkan di titik pegang (tangan), bukan di depan wajah */
  scene.add(it.g);it.g.position.set(0,0,0);it.g.updateMatrixWorld(true);
  var bb=new THREE.Box3().setFromObject(it.model), bc=new THREE.Vector3();bb.getCenter(bc);
  kid.hold.add(it.g);
  it.g.position.set(-bc.x,-bc.y,-bb.min.z);
  if(!it.got){it.got=true;addXP(10);}
  sfx.reward();
  state.pickN++;
  say(state.pickN===1?'Kamu membawa '+it.def.name+'! Tekan Q (atau tombol Letakkan) untuk meletakkan benda':'Kamu membawa '+it.def.name+'.');
  refreshInv();
}
function dropActive(){
  if(state.mode!=='play'||state.panelOpen){return;}
  var it=heldItem();if(!it){return;}
  if(it.l5){resetCable(it);}
  var fx=Math.sin(kidFace), fz=Math.cos(kidFace), x=pos.x, z=pos.z;
  for(var d=0.95;d>=0;d-=0.25){
    var tx=clamp(pos.x+fx*d,-8.3,8.3), tz=clamp(pos.z+fz*d,-6.3,6.3);
    if(!hitsSolid(tx,tz,0.3)){x=tx;z=tz;break;}
  }
  scene.add(it.g);
  it.g.position.set(x,0,z);it.g.rotation.set(0,0,0);it.g.scale.setScalar(1);it.g.visible=true;
  it.ring.visible=true;it.state='free';it.model.scale.setScalar(it.def.fs||1);
  it.rec.active=true;it.rec.pos.set(x,0.5,z);
  state.inv[state.sel]=null;
  sfx.close();refreshInv();
}
function useCrate(){
  var it=heldItem();
  if(!it){say('Ini Kotak Perangkat. Ambil benda berkilau, lalu tekan E di sini untuk memasukkannya.');return;}
  if(it.def.l2){say('Komponen ini dipakai untuk merakit komputer. Bawa ke Meja Rakit!');return;}
  if(it.def.l3){say('Perangkat ini dipakai untuk Level 3. Bawa ke area INPUT, PROSES, atau OUTPUT!');return;}
  if(it.def.l5){say('Kabel LAN ini dipakai untuk jaringan. Bawa ke pojok JARINGAN!');return;}
  if(it.def.l8){say('Benda ini dipakai untuk Misi Besar. Bawa ke komputer di meja belakang kanan!');return;}
  state.inv[state.sel]=null;
  var slot=CRATE_SLOTS[state.placed%CRATE_SLOTS.length];
  state.placed++;it.state='placed';
  crateG.add(it.g);
  it.g.position.set(slot[0],0.1,slot[1]);it.g.rotation.set(0,0,0);it.g.scale.setScalar(it.def.hold*0.45);it.g.visible=true;
  for(var i=0;i<3;i++){if(state.inv[i]){state.sel=i;break;}}
  addXP(20);sfx.reward();
  var left=items.length-state.placed;
  refreshInv();updateMission();
  if(left===0&&!state.trainDone){
    state.trainDone=true;
    setTimeout(function(){
      addXP(30,1);sfx.reward();confetti();updateMission();
      var t=$('#toast');
      t.innerHTML='<div class="t-card card"><div class="t-k">LATIHAN · KOTAK PERANGKAT</div><h2>BAGUS SEKALI!</h2><p>Kamu sudah bisa mengambil, membawa, dan meletakkan perangkat.</p><p>+30 XP · ⭐ +1</p></div>';
      t.hidden=false;setTimeout(hideToast,6000);
      say('Siap! Di level berikutnya kita akan merakit komputer.');
    },700);
    say('Semua perangkat sudah masuk kotak!');
  }else{
    say('Bagus! '+it.def.name+' masuk ke kotak. Tinggal '+left+' benda lagi!');
  }
}
Array.prototype.forEach.call(document.querySelectorAll('#inv .slot'),function(b){
  b.addEventListener('mousedown',function(e){e.preventDefault();});
  b.addEventListener('click',function(){selectSlot(+b.getAttribute('data-i'));});
});
$('#drop-btn').addEventListener('mousedown',function(e){e.preventDefault();});
$('#drop-btn').addEventListener('click',dropActive);
