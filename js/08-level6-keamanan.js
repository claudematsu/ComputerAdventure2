/* ============================================================
   08-level6-keamanan.js
   Level 6: Keamanan digital
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 6: keamanan digital ---------- */
var SITS=[
  {id:'usb',short:'Flashdisk',name:'Flashdisk di Lantai',bot:'Flashdisk ini bukan milik kita. Apa yang sebaiknya dilakukan?',
   opts:[{t:'Colokkan ke komputer',bad:'Jangan! Flashdisk asing bisa membawa virus ke komputer sekolah.'},
         {t:'Berikan kepada guru',safe:true},
         {t:'Bawa pulang',bad:'Itu bukan milikmu. Pemiliknya mungkin mencarinya, dan isinya bisa berbahaya.'}],
   ok:'Pilihan aman! Guru akan mencari pemiliknya dan memeriksa flashdisk itu dengan aman.'},
  {id:'phish',short:'Pesan hadiah',name:'Pesan Hadiah di Layar',bot:'Ada pesan: kamu menang HP gratis! Kamu disuruh klik tautan dan menulis password. Apa yang kamu lakukan?',
   opts:[{t:'Klik tautan dan tulis password',bad:'Jangan! Pesan hadiah seperti ini biasanya penipuan untuk mencuri password.'},
         {t:'Tutup pesan dan beri tahu guru',safe:true},
         {t:'Kirim pesan ini ke teman',bad:'Jangan disebar! Temanmu bisa tertipu juga.'}],
   ok:'Pilihan aman! Pesan hadiah yang meminta password itu penipuan. Menutupnya dan melapor sudah tepat.'},
  {id:'pass',short:'Password',name:'Membuat Password',bot:'Kamu membuat password baru untuk akunmu. Password mana yang paling aman?',
   opts:[{t:'12345',str:0.1,bad:'Terlalu mudah ditebak. Orang lain bisa menebaknya dalam sekejap.'},
         {t:'budi2015',str:0.3,bad:'Nama dan tahun lahir mudah ditebak orang lain.'},
         {t:'Kp7#Lm29',str:1,safe:true}],
   ok:'Pilihan aman! Password kuat memakai huruf besar, angka, dan simbol, dan tidak memakai namamu. Jangan beri tahu siapa pun!'},
  {id:'chat',short:'Chat orang asing',name:'Chat dengan Orang Asing',bot:'Orang yang tidak kamu kenal meminta alamat rumah dan fotomu lewat chat. Apa yang kamu lakukan?',
   opts:[{t:'Kirim alamat rumahku',bad:'Jangan! Orang asing tidak boleh tahu alamat rumahmu.'},
         {t:'Jangan kirim, ceritakan ke guru atau orang tua',safe:true},
         {t:'Kirim fotoku saja',bad:'Jangan! Foto pribadi juga tidak boleh dikirim ke orang asing.'}]
   ,ok:'Pilihan aman! Jangan beri data pribadi ke orang asing, dan ceritakan ke orang dewasa yang kamu percaya.'}
];
var SIT={};SITS.forEach(function(q){q.scr='base';q.solved=false;q.seen=false;q.wrong=0;SIT[q.id]=q;});
var sec={built:false,nSolved:0,nSeen:0,wrongN:0,idle:0,cur:null,fly:null,shake:0,usb:null,sprites:{},recs:{}};
function drawSec(id){return function(x,w,h){
  var q=SIT[id], st=q.scr;
  x.textAlign='center';x.textBaseline='middle';x.setLineDash([]);x.lineWidth=4;x.strokeStyle='#1B2559';
  function okCheck(cy){
    x.fillStyle='#FFC83D';x.beginPath();x.arc(w/2,cy,32,0,Math.PI*2);x.fill();x.stroke();
    x.lineWidth=8;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(w/2-14,cy);x.lineTo(w/2-3,cy+12);x.lineTo(w/2+16,cy-12);x.stroke();
  }
  if(st==='bad'&&id!=='pass'){
    x.fillStyle='#B93A25';x.fillRect(0,0,w,h);
    label(x,id==='phish'?'PERINGATAN!':'JANGAN!',w/2,84,58,'#FFFFFF');
    label(x,id==='phish'?'Passwordmu dicuri penipu':'Data pribadimu bocor',w/2,160,32,'#FFE0DA');
    label(x,id==='phish'?'Jangan klik tautan aneh':'Orang asing tidak boleh tahu',w/2,208,28,'#FFE0DA');return;
  }
  if(st==='ok'&&id!=='pass'){
    x.fillStyle='#14B8A6';x.fillRect(0,0,w,h);
    label(x,id==='phish'?'Pesan penipuan ditutup':'Kamu aman!',w/2,90,id==='phish'?38:52,'#FFFFFF');
    label(x,id==='phish'?'Sudah dilaporkan ke guru':'Sudah cerita ke orang dewasa',w/2,150,28,'#E9FFF8');
    okCheck(228);return;
  }
  if(id==='phish'){
    x.fillStyle='#CFE6FF';x.fillRect(0,0,w,h);
    x.fillStyle='#FFF3C9';rr(x,40,26,w-80,h-52,20);x.fill();x.stroke();
    label(x,'SELAMAT!!!',w/2,76,54,'#FF6F59');
    label(x,'Kamu menang HP gratis!',w/2,134,32,'#1B2559');
    label(x,'Klik di sini dan tulis passwordmu',w/2,176,23,'#1B2559');
    x.fillStyle='#FF6F59';rr(x,150,208,212,56,28);x.fill();x.stroke();
    label(x,'KLIK DI SINI',w/2,237,28,'#FFFFFF');return;
  }
  if(id==='pass'){
    x.fillStyle='#E8F0FF';x.fillRect(0,0,w,h);
    label(x,'Buat password baru',w/2,52,38,'#1B2559');
    x.fillStyle='#FFFFFF';rr(x,60,96,w-120,68,16);x.fill();x.stroke();
    if(st==='base'){label(x,'• • • • • • • •',w/2,131,40,'#8C9AD0');label(x,'Pilih password yang aman',w/2,222,26,'#4A5FC1');return;}
    label(x,q.typed||'',w/2,131,40,'#1B2559');
    var good=st==='ok', str=q.str||0;
    x.fillStyle='#DCE4F7';rr(x,60,190,w-120,30,15);x.fill();x.stroke();
    x.fillStyle=good?'#22CC66':(str>0.2?'#FFB020':'#FF4D4D');rr(x,60,190,Math.max(30,(w-120)*str),30,15);x.fill();x.stroke();
    label(x,good?'KUAT! Password aman':(str>0.2?'Kurang kuat':'Lemah! Mudah ditebak'),w/2,258,30,good?'#0C7A6F':'#B93A25');
    return;
  }
  if(id==='chat'){
    x.fillStyle='#F3EDFF';x.fillRect(0,0,w,h);
    x.fillStyle='#7A5CFF';rr(x,24,18,w-48,44,14);x.fill();x.stroke();
    label(x,'Teman Baru (tidak dikenal)',w/2,41,24,'#FFFFFF');
    x.fillStyle='#FFFFFF';rr(x,40,84,300,56,18);x.fill();x.stroke();label(x,'Hai! Rumahmu di mana?',190,112,22,'#1B2559');
    x.fillStyle='#FFFFFF';rr(x,40,152,380,56,18);x.fill();x.stroke();label(x,'Kirim alamat dan fotomu dong!',230,180,22,'#1B2559');
    x.fillStyle='#FFFFFF';rr(x,40,236,w-80,50,25);x.fill();x.stroke();label(x,'Tulis pesan...',w/2,261,22,'#8C9AD0');
  }
};}
var secT={phish:canvasTex(512,320,drawSec('phish')),pass:canvasTex(512,320,drawSec('pass')),chat:canvasTex(512,320,drawSec('chat'))};
var SEC_SPOTS=[[-2.2,2.9],[2.4,3.1],[-6.4,-1.0],[6.2,0.9],[1.9,-0.9],[-1.9,-0.9],[-6.4,2.9]];
var TEACHER_BOX=[-6.9,1.1,-6.4];
function setSitScr(q,m){q.scr=m;if(secT[q.id]){secT[q.id].redraw();}}
function buildSecurity(){
  if(sec.built){return;}
  sec.built=true;
  /* meja guru */
  var tg=grp(world,-6.9,0,-6.4,0);
  box(tg,1.8,0.1,0.9,L(0xB98350),0,0.95,0);
  box(tg,0.1,0.95,0.8,L(0x8C5A32),-0.8,0.47,0);box(tg,0.1,0.95,0.8,L(0x8C5A32),0.8,0.47,0);
  var bx=grp(tg,0.1,1.0,0,0);box(bx,0.5,0.32,0.4,L(0xFFC83D),0,0.16,0);box(bx,0.3,0.03,0.04,L(0x1B2559),0,0.325,0.05);
  sph(tg,0.1,L(0xFF4D4D),-0.55,1.1,0.1,10,8);
  addSolid(-6.9,-6.4,1.8,0.9);
  sign(world,2.2,0.55,-6.9,2.5,-6.95,0,function(x,w,h){x.fillStyle='#1B2559';rr(x,4,4,w-8,h-8,22);x.fill();label(x,'MEJA GURU',w/2,h*0.5,52,'#FFFFFF');});
  labelSprite(scene,'KOTAK TEMUAN',-6.8,2.0,-6.4,1.3).visible=true;
  /* flashdisk */
  var ug=grp(world,0,0,0,0), um=grp(ug,0,0.14,0,0);
  sec.usbMat=L(0x3B82F6);
  box(um,0.14,0.05,0.34,sec.usbMat,0,0,0);box(um,0.1,0.03,0.12,L(0xC8CFE3),0,0,-0.23);box(um,0.12,0.06,0.1,L(0xFF6F59),0,0.005,0.1);
  var ur=new THREE.Mesh(new THREE.RingGeometry(0.42,0.56,28),BM(0xFF6F59,{transparent:true,opacity:0.95,side:THREE.DoubleSide}));
  ur.rotation.x=-Math.PI/2;ur.position.y=0.02;ug.add(ur);
  sec.usb={g:ug,m:um,ring:ur};
  ug.visible=false;
  /* penanda dan interaktif */
  var defs={
    usb:{pos:new THREE.Vector3(0,0.5,0),range:1.7,group:um,my:1.2},
    phish:{pos:new THREE.Vector3(-4.4,1.8,-3.55),range:2.6,desk:0,my:2.75},
    pass:{pos:new THREE.Vector3(0,1.8,-3.55),range:2.6,desk:1,my:2.75},
    chat:{pos:new THREE.Vector3(-4.4,1.8,0.25),range:2.8,desk:3,my:2.75}
  };
  SITS.forEach(function(q){
    var d=defs[q.id], grpm=d.group;
    if(d.desk!==undefined){
      var mon=otherDesks[d.desk].monitor;
      layerWalk(plane(mon,1.3,0.72,BM(0xFFFFFF,{map:secT[q.id].tex}),0,0.83,0.068,0,0),mon.__layer||0);
      grpm=mon;
    }
    var rec={id:'sit:'+q.id,isSit:true,sit:q,group:grpm,name:q.name,type:'SITUASI',range:d.range,bias:1.5,active:false,pos:d.pos,mats:collectMats(grpm)};
    q.rec=rec;interactables.push(rec);sec.recs[q.id]=rec;
    var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:warnTex.tex,transparent:true,depthTest:false}));
    sp.scale.set(0.55,0.55,0.55);sp.renderOrder=9;sp.visible=false;scene.add(sp);
    q.sprite=sp;q.my=d.my;q.sy=d.my;
  });
}
function startLevel6(){
  var _m=snap();buildSecurity();claim('l6',_m);
  state.l6Active=true;state.level=6;updateStats();
  var sp=SEC_SPOTS[Math.floor(Math.random()*SEC_SPOTS.length)];
  sec.usb.g.position.set(sp[0],0,sp[1]);sec.usb.g.visible=true;
  SIT.usb.rec.pos.set(sp[0],0.5,sp[1]);
  SITS.forEach(function(q){
    q.rec.active=true;q.scr='base';q.solved=false;q.seen=false;q.wrong=0;
    var px=q.rec.pos;q.sprite.position.set(px.x,q.id==='usb'?1.3:2.75,px.z);q.sy=q.sprite.position.y;q.sprite.visible=true;
    if(secT[q.id]){secT[q.id].redraw();}
  });
  updateMission();
}
function openChoice(q){
  if(!state.l6Active||q.solved){return;}
  state.panelOpen=true;state.choiceOpen=true;sec.cur=q;q.wrong=0;sec.idle=0;unlock();
  if(!q.seen){q.seen=true;sec.nSeen++;addXP(10);updateMission();}
  q.shown=q.opts.slice().sort(function(){return Math.random()-0.5;});
  var box=$('#choice-opts');box.textContent='';
  q.shown.forEach(function(o,i){
    var b=document.createElement('button');b.type='button';b.className='optb';
    b.innerHTML='<kbd>'+(i+1)+'</kbd><span></span>';b.lastChild.textContent=o.t;
    b.addEventListener('click',function(){chooseOpt(i);});
    box.appendChild(b);
  });
  $('#choice-h').textContent=q.name;$('#choice-q').textContent=q.bot;
  $('#choice-msg').textContent='';
  app.classList.add('choice-on');$('#choice').hidden=false;$('#prompt').hidden=true;lastPrompt=null;sfx.open();
}
function closeChoice(){
  var q=sec.cur;
  state.panelOpen=false;state.choiceOpen=false;$('#choice').hidden=true;app.classList.remove('choice-on');sfx.close();idleT=0;
  if(q&&!q.solved){setSitScr(q,'base');sec.shake=0;if(sec.usbMat){sec.usbMat.color.setHex(0x3B82F6);}}
  sec.cur=null;
}
function chooseOpt(i){
  var q=sec.cur;if(!state.choiceOpen||!q){return;}
  var o=q.shown[i];if(!o){return;}
  if(o.safe){solveSit(q,o);return;}
  q.wrong++;sec.wrongN++;sfx.close();
  var rf=$('#redflash');rf.className='';void rf.offsetWidth;rf.className='go';
  if(q.id==='pass'){q.typed=o.t;q.str=o.str;}
  setSitScr(q,'bad');
  if(q.id==='usb'){sec.shake=1.2;sec.usbMat.color.setHex(0xFF4D4D);}
  var m=$('#choice-msg');m.textContent=o.bad+(q.wrong>=2?' Petunjuk: pilih tindakan yang paling aman untukmu.':'');
  if(q.wrong>=2){
    Array.prototype.forEach.call($('#choice-opts').children,function(b,k){if(q.shown[k].safe){b.className='optb hl';}});
  }
}
function solveSit(q,o){
  q.solved=true;sec.nSolved++;
  state.panelOpen=false;state.choiceOpen=false;$('#choice').hidden=true;app.classList.remove('choice-on');sec.cur=null;idleT=0;
  q.rec.active=false;lastPrompt=null;
  if(q.id==='pass'){q.typed=o.t;q.str=1;}
  setSitScr(q,'ok');
  if(q.id==='usb'){
    sec.usbMat.color.setHex(0x3B82F6);sec.shake=0;
    var st=sec.usb.g.position;
    sec.fly={t:0,x0:st.x,z0:st.z};
  }
  addXP(30);sfx.reward();say(q.ok);
  q.sprite.material.map=okTex.tex;q.sprite.material.needsUpdate=true;
  updateMission();
  if(sec.nSolved>=SITS.length){setTimeout(finishLevel6,2200);}
}
function finishLevel6(){
  state.l6Done=true;state.levelsDone[6]=true;
  SITS.forEach(function(q){q.sprite.visible=false;});
  addXP(100,1);sfx.reward();confetti();awardBadge('safe');updateMission();
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 6 · KEAMANAN KOMPUTER</div><h2>MISSION COMPLETE</h2><p>Kamu memilih tindakan yang aman di 4 situasi!</p><div class="t-badge">🏆 Cyber Safety Hero</div><p>+100 XP · ⭐ +1</p><p>🔓 Level 7: Algoritma terbuka</p></div>';
  t.hidden=false;setTimeout(hideToast,7000);
  say('Hebat! Misi selesai!');
  openDoor(7);
}
function sitTags(){return SITS.map(function(q){return {t:q.short,ok:q.solved,cur:false};});}
