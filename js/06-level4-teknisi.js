/* ============================================================
   06-level4-teknisi.js
   Level 4: Teknisi komputer (troubleshooting)
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 4: teknisi komputer ---------- */
var svc={built:false,n:0,cause:null,found:false,fixed:false,checkedN:0,busy:false,scr:'off',p:0,pt:0,idle:0,blink:0,list:[],byId:{}};
var SVX=-0.5, SVZ=4.7;
function SW(lx,ly,lz){return new THREE.Vector3(SVX-lx,ly,SVZ-lz);}
function winBar(x,w,title){
  x.fillStyle='#FFFFFF';rr(x,28,22,w-56,262,18);x.fill();x.lineWidth=4;x.strokeStyle='#1B2559';x.stroke();
  x.fillStyle='#14B8A6';rr(x,28,22,w-56,44,18);x.fill();x.stroke();
  label(x,title,w/2,45,26,'#FFFFFF');
}
function drawSvc(x,w,h){
  var s=svc.scr, p=svc.p;
  x.textAlign='center';x.textBaseline='middle';
  if(s==='off'){x.fillStyle='#131B33';x.fillRect(0,0,w,h);return;}
  if(s==='nosignal'){
    x.fillStyle='#0A1A3A';x.fillRect(0,0,w,h);
    label(x,'TIDAK ADA SINYAL',w/2,h*0.42,50,'#5EEAFF');
    label(x,'Kabel monitor belum terhubung',w/2,h*0.62,26,'#B9C6F0');return;
  }
  if(s==='boot'){
    if(p<0.25){
      x.fillStyle='#05070F';x.fillRect(0,0,w,h);x.fillStyle='#9FE8B8';
      x.font='700 24px monospace';x.textAlign='left';x.textBaseline='alphabetic';
      x.fillText('KOMP-BIOS v1.0',24,44);x.fillText('Memeriksa memori ... OK',24,80);x.fillText('Mencari disk ... OK',24,116);
      return;
    }
    var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2B3A8F');g.addColorStop(1,'#14B8A6');x.fillStyle=g;x.fillRect(0,0,w,h);
    var k=Math.min(1,(p-0.25)/0.75);
    label(x,'KOMP-OS',w/2,h*0.36,78,'#FFFFFF');
    x.fillStyle='rgba(255,255,255,.3)';rr(x,96,196,320,24,12);x.fill();
    x.fillStyle='#FFC83D';rr(x,96,196,Math.max(24,320*k),24,12);x.fill();
    label(x,'Memuat... '+Math.round(k*100)+'%',w/2,256,28,'#FFFFFF');return;
  }
  if(s==='desk'){
    var g2=x.createLinearGradient(0,0,0,h);g2.addColorStop(0,'#8EDBFF');g2.addColorStop(1,'#DDF6FF');x.fillStyle=g2;x.fillRect(0,0,w,h);
    label(x,'Komputer menyala lagi!',w/2,80,40,'#1B2559');
    label(x,'Masalah sudah diperbaiki',w/2,128,28,'#0C7A6F');
    [['#FF6F59','Tulis'],['#FFC83D','Gambar'],['#14B8A6','Main']].forEach(function(ic,i){
      var ix=96+i*120;x.fillStyle=ic[0];rr(x,ix,170,72,72,16);x.fill();x.lineWidth=4;x.strokeStyle='#1B2559';x.stroke();
      label(x,ic[1],ix+36,268,24,'#1B2559');
    });
    return;
  }
  if(s==='kbbad'||s==='kbok'){
    x.fillStyle='#CFE6FF';x.fillRect(0,0,w,h);
    winBar(x,w,'Menulis');
    label(x,'Ketik sapaanmu di sini:',w/2,104,30,'#1B2559');
    x.fillStyle='#F1F4FC';rr(x,56,134,w-112,66,14);x.fill();x.lineWidth=3;x.strokeStyle='#1B2559';x.stroke();
    if(s==='kbok'){
      x.textAlign='left';x.font='800 34px '+FONT;x.fillStyle='#1B2559';x.fillText('Halo KOMP-BOT!',78,168);x.textAlign='center';
    }else if(svc.blink){x.fillStyle='#1B2559';x.fillRect(80,146,5,42);}
    x.fillStyle=s==='kbok'?'#14B8A6':'#FF6F59';rr(x,56,218,w-112,50,25);x.fill();x.stroke();
    label(x,s==='kbok'?'Keyboard berfungsi!':'Keyboard tidak merespons',w/2,244,28,'#FFFFFF');
    return;
  }
  if(s==='spbad'||s==='spok'){
    var ok=s==='spok';
    x.fillStyle='#2B1F5C';x.fillRect(0,0,w,h);
    label(x,'Lagu Ceria',w/2,50,32,'#FFC83D');
    x.fillStyle='#FFFFFF';rr(x,150,120,36,60,6);x.fill();
    x.beginPath();x.moveTo(184,120);x.lineTo(238,86);x.lineTo(238,214);x.lineTo(184,180);x.closePath();x.fill();
    x.lineCap='round';
    if(ok){
      x.strokeStyle='#5EEAFF';x.lineWidth=9;
      [28,52,76].forEach(function(r){x.beginPath();x.arc(238,150,r,-0.8,0.8);x.stroke();});
    }else{
      x.strokeStyle='#FF6F59';x.lineWidth=12;
      x.beginPath();x.moveTo(280,116);x.lineTo(340,184);x.moveTo(340,116);x.lineTo(280,184);x.stroke();
    }
    label(x,ok?'Suara terdengar!':'Tidak ada suara',w/2,262,32,ok?'#7CF2B5':'#FF9A8B');
    return;
  }
  if(s==='all'){
    var g3=x.createLinearGradient(0,0,0,h);g3.addColorStop(0,'#2B3A8F');g3.addColorStop(1,'#14B8A6');x.fillStyle=g3;x.fillRect(0,0,w,h);
    label(x,'SEMUA MASALAH TERATASI',w/2,60,36,'#FFFFFF');
    ['Monitor menyala','Keyboard berfungsi','Speaker bersuara'].forEach(function(t,i){
      var cy=124+i*56;
      x.fillStyle='#FFC83D';x.beginPath();x.arc(120,cy,20,0,Math.PI*2);x.fill();x.lineWidth=4;x.strokeStyle='#1B2559';x.stroke();
      x.lineWidth=6;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(110,cy);x.lineTo(118,cy+9);x.lineTo(132,cy-9);x.stroke();
      x.textAlign='left';x.font='800 30px '+FONT;x.fillStyle='#FFFFFF';x.fillText(t,160,cy+2);x.textAlign='center';
    });
  }
}
var svcT=canvasTex(512,320,drawSvc);
function drawSvcSign(x,w,h){
  var done=!!(state&&state.l4Done), n=svc.n, c=(!done&&CASES)?CASES[n]:null;
  x.fillStyle=done?'#14B8A6':'#1B2559';rr(x,4,4,w-8,h-8,26);x.fill();
  label(x,'MEJA SERVIS',w/2,h*0.36,56,'#FFFFFF');
  label(x,done?'LEVEL 4 · SELESAI':(c?'KASUS '+(n+1)+' · '+c.short:'LEVEL 4 · TEKNISI'),w/2,h*0.76,28,'#FFC83D');
}
var svcSignT=canvasTex(512,128,drawSvcSign);

function plugMesh(parent,col,p){
  var g=grp(parent,p[0],p[1],p[2],0);
  box(g,0.11,0.08,0.08,L(col),0,0,0);
  box(g,0.05,0.05,0.06,L(0xC8CFE3),0.075,0,0);
  return g;
}
function cableCP(parent,okPts,badPts,col,plugCol){
  var okG=grp(parent,0,0,0,0), badG=grp(parent,0,0,0,0);
  tube(okG,okPts,0.028,col);tube(badG,badPts,0.028,col);
  plugMesh(okG,plugCol,okPts[okPts.length-1]);plugMesh(badG,plugCol,badPts[badPts.length-1]);
  return {root:parent,setBad:function(v){okG.visible=!v;badG.visible=v;},groups:[okG,badG]};
}
function buttonCP(parent,p,ry,badColor){
  var g=grp(parent,p[0],p[1],p[2],ry);
  box(g,0.16,0.16,0.03,L(0x2B3A67),0,0,0);
  cyl(g,0.05,0.05,0.04,L(0xE9EEFF),0,0,0.03,12).rotation.x=Math.PI/2;
  var led=BM(0x35E08A);box(g,0.04,0.025,0.02,led,0,0.115,0.01);
  return {setBad:function(v){led.color.setHex(v?badColor:0x35E08A);},groups:[g]};
}
function knobCP(parent,p){
  var g=grp(parent,p[0],p[1],p[2],0), kn=grp(g,0,0,0,0);
  cyl(g,0.075,0.075,0.02,L(0x2B3A67),0,0,0,16).rotation.x=Math.PI/2;
  cyl(kn,0.05,0.05,0.05,L(0xE9EEFF),0,0,0.03,14).rotation.x=Math.PI/2;
  box(kn,0.016,0.045,0.02,L(0xFF6F59),0,0.028,0.058);
  return {setBad:function(v){kn.rotation.z=v?2.4:-0.5;},groups:[g]};
}
function clipCP(parent,p){
  var g=grp(parent,p[0],p[1],p[2],0);
  var a=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.014,6,14),L(0x3B82F6));a.rotation.x=-Math.PI/2;a.scale.set(1.5,1,1);a.castShadow=true;g.add(a);
  var b=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.014,6,14),L(0x3B82F6));b.rotation.x=-Math.PI/2;b.position.set(0.1,0.01,0.03);b.scale.set(1.4,1,1);b.castShadow=true;g.add(b);
  sph(g,0.035,L(0xC98A4B),-0.18,0.01,0.08,8,6);sph(g,0.028,L(0xC98A4B),0.26,0.01,-0.07,8,6);
  return {setBad:function(v){g.visible=v;},groups:[g]};
}

var CPDEF={
  power:{name:'Kabel Power',act:'Colokkan',ok:'Kabel power terpasang kuat di stop kontak.',bad:'Masalah ditemukan! Kabel power terlepas dari stop kontak, jadi listrik tidak mengalir.',fix:'Bagus! Kabel power sudah dicolokkan. Listrik mengalir lagi.',pos:[-1.15,0.35,-1.3]},
  hdmi:{name:'Kabel Monitor',act:'Pasang',ok:'Kabel monitor (HDMI) terpasang kuat.',bad:'Masalah ditemukan! Kabel monitor terlepas, jadi gambar tidak sampai ke layar.',fix:'Bagus! Kabel monitor sudah terpasang. Gambar bisa tampil lagi.',pos:[-0.5,1.4,-0.5]},
  mbtn:{name:'Tombol Power Monitor',act:'Nyalakan',ok:'Tombol power monitor menyala hijau.',bad:'Masalah ditemukan! Tombol power monitor mati. Lampunya merah.',fix:'Bagus! Monitor sudah dinyalakan.',pos:[0.55,1.4,-0.45]},
  usb:{name:'Kabel Keyboard',act:'Colokkan',ok:'Kabel keyboard terpasang di port USB.',bad:'Masalah ditemukan! Kabel keyboard terlepas dari port USB.',fix:'Bagus! Kabel keyboard sudah dipasang di port USB.',pos:[-0.6,1.1,0.12]},
  key:{name:'Tombol Keyboard',act:'Bersihkan',ok:'Semua tombol keyboard bergerak lancar.',bad:'Masalah ditemukan! Ada klip kertas yang menyangkut di antara tombol.',fix:'Bagus! Klip kertas sudah dibuang. Tombol bisa ditekan lagi.',pos:[0.3,1.1,0.32]},
  restart:{name:'Tombol Restart',act:'Restart',ok:'Komputer berjalan lancar, tidak perlu di-restart.',bad:'Masalah ditemukan! Komputer sedang macet. Ia perlu di-restart.',fix:'Bagus! Komputer sudah di-restart dan keyboard bekerja lagi.',pos:[-1.3,1.75,0.27]},
  audio:{name:'Kabel Audio',act:'Pasang',ok:'Kabel audio terpasang kuat di speaker.',bad:'Masalah ditemukan! Kabel audio terlepas dari speaker.',fix:'Bagus! Kabel audio sudah dipasang. Suara bisa mengalir ke speaker.',pos:[0.5,1.25,-0.62]},
  vol:{name:'Volume Speaker',act:'Naikkan',ok:'Volume speaker sudah cukup keras.',bad:'Masalah ditemukan! Volume speaker diputar sampai paling kecil.',fix:'Bagus! Volume speaker sudah dinaikkan.',pos:[1.29,1.08,-0.1]},
  spwr:{name:'Tombol Power Speaker',act:'Nyalakan',ok:'Speaker sudah menyala. Lampunya hijau.',bad:'Masalah ditemukan! Speaker belum dinyalakan. Lampunya merah.',fix:'Bagus! Speaker sudah dinyalakan.',pos:[1.3,1.12,-0.47]}
};
var CASES=[
  {id:'monitor',short:'MONITOR GELAP',title:'Monitor tidak menyala',points:['power','hdmi','mbtn'],
    intro:'Layar monitor ini gelap! Periksa bagian bertanda ?: kabel power, kabel monitor, dan tombol power. Kabel ada di belakang meja.',
    screen:function(c){return c==='hdmi'?'nosignal':'off';}},
  {id:'keyboard',short:'KEYBOARD MATI',title:'Keyboard tidak berfungsi',points:['usb','key','restart'],
    intro:'Sekarang keyboard tidak berfungsi! Tombol ditekan, tapi tulisan tidak muncul. Periksa bagian bertanda ?.',
    screen:function(){return 'kbbad';}},
  {id:'speaker',short:'SPEAKER BISU',title:'Speaker tidak bersuara',points:['audio','vol','spwr'],
    intro:'Terakhir: speaker tidak bersuara! Periksa kabel audio, volume, dan tombol power speaker.',
    screen:function(){return 'spbad';}}
];

function buildService(){
  if(svc.built){return;}
  svc.built=true;
  var P=buildDesk(SVX,SVZ,true,Math.PI,true), g=P.g;
  plane(P.monitor,1.3,0.72,BM(0xFFFFFF,{map:svcT.tex}),0,0.83,0.068,0,0);svc.mon=P.monitor;
  /* stop kontak di dinding */
  var op=SW(-1.15,0.45,-2.26);
  box(world,0.3,0.3,0.05,L(0xFFFFFF),op.x,op.y,6.96);
  box(world,0.04,0.09,0.02,L(0x1B2559),op.x-0.06,op.y+0.02,6.925);box(world,0.04,0.09,0.02,L(0x1B2559),op.x+0.06,op.y+0.02,6.925);
  plane(world,2.6,0.65,BM(0xFFFFFF,{map:svcSignT.tex}),SVX,3.2,6.95,0,Math.PI);
  /* port di belakang CPU */
  [1.35,1.25,1.15,1.05].forEach(function(py,i){box(g,0.1,0.05,0.02,L(0x2B3A67),-1.15+(i%2?0.1:-0.1),py+(i>1?-0.18:0),-0.555);});
  var vis={};
  vis.power=cableCP(g,
    [[-1.15,1.25,-0.57],[-1.15,1.1,-0.8],[-1.15,0.5,-0.85],[-1.15,0.06,-1.3],[-1.15,0.08,-1.9],[-1.15,0.4,-2.2]],
    [[-1.15,1.25,-0.57],[-1.15,1.1,-0.8],[-1.15,0.5,-0.85],[-1.15,0.06,-1.3],[-0.85,0.05,-1.6]],0x1B2559,0xFFFFFF);
  vis.hdmi=cableCP(g,
    [[-1.0,1.55,-0.57],[-0.8,1.7,-0.6],[-0.45,1.6,-0.5],[-0.25,1.42,-0.43]],
    [[-1.0,1.55,-0.57],[-0.8,1.7,-0.6],[-0.6,1.1,-0.5],[-0.45,1.03,-0.2]],0xFF6F59,0x1B2559);
  vis.mbtn=buttonCP(P.monitor,[0.55,0.4,-0.06],Math.PI,0xFF4D4D);
  vis.usb=cableCP(g,
    [[-0.58,1.05,0.12],[-0.7,1.06,0.14],[-0.85,1.25,0.16],[-0.91,1.35,0.12]],
    [[-0.58,1.05,0.12],[-0.7,1.06,0.14],[-0.76,1.03,0.3],[-0.7,1.03,0.45]],0x7A5CFF,0xC8CFE3);
  vis.key=clipCP(g,[0.3,1.1,0.32]);
  vis.restart=buttonCP(P.cpu,[-0.1,0.78,0.42],0,0xFFB020);
  vis.audio=cableCP(g,
    [[-0.95,1.4,-0.58],[-0.4,1.2,-0.62],[0.4,1.2,-0.62],[0.95,1.3,-0.55],[1.1,1.4,-0.48]],
    [[-0.95,1.4,-0.58],[-0.4,1.2,-0.62],[0.4,1.2,-0.62],[0.7,1.05,-0.6],[0.85,1.03,-0.5]],0x14B8A6,0x3B82F6);
  vis.vol=knobCP(P.speaker,[0.09,0.08,0.19]);
  vis.spwr=buttonCP(P.speaker,[0.1,0.15,-0.17],Math.PI,0xFF4D4D);
  Object.keys(CPDEF).forEach(function(id,i){
    var d=CPDEF[id], v=vis[id], wp=SW(d.pos[0],d.pos[1],d.pos[2]);
    var mats=[];v.groups.forEach(function(gg){collectMats(gg).forEach(function(m){if(mats.indexOf(m)<0){mats.push(m);}});});
    var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:qTex.tex,transparent:true,depthTest:false}));
    sp.scale.set(0.5,0.5,0.5);sp.renderOrder=9;sp.visible=false;
    sp.position.set(wp.x,Math.max(wp.y+0.55,1.95),wp.z);scene.add(sp);
    var cp={id:id,def:d,vis:v,sprite:sp,baseY:sp.position.y,st:'new',ph:i*0.8,inCase:false};
    cp.rec={id:'cp:'+id,isCheck:true,cp:cp,group:g,name:d.name,type:'PERIKSA',range:1.3,bias:0.5,active:false,pos:wp,mats:mats};
    interactables.push(cp.rec);svc.list.push(cp);svc.byId[id]=cp;
    v.setBad(false);
  });
  svc.arrow=new THREE.Sprite(new THREE.SpriteMaterial({map:arrowTex.tex,transparent:true,depthTest:false}));
  svc.arrow.scale.set(0.9,0.9,0.9);svc.arrow.position.set(SVX,3.5,SVZ);svc.arrow.renderOrder=10;svc.arrow.visible=false;scene.add(svc.arrow);
}
function setScreen(m){svc.scr=m;svc.p=0;svc.pt=0;svcT.redraw();}
function startLevel4(){
  var _m=snap();buildService();claim('l4',_m);
  state.l4Active=true;state.level=4;updateStats();
  if(hitsSolid(pos.x,pos.z,R)){pos.z=3.2;vel.set(0,0,0);}
  startCase(0,true);
}
function startCase(n,silent){
  var c=CASES[n];
  svc.n=n;svc.busy=false;svc.found=false;svc.fixed=false;svc.checkedN=0;svc.idle=0;
  svc.cause=c.points[Math.floor(Math.random()*c.points.length)];
  svc.list.forEach(function(cp){
    var inCase=c.points.indexOf(cp.id)>=0;
    cp.inCase=inCase;cp.st='new';cp.rec.active=inCase;
    cp.vis.setBad(inCase&&cp.id===svc.cause);
    cp.sprite.visible=inCase;
  });
  setScreen(c.screen(svc.cause));
  svcSignT.redraw();
  lastPrompt=null;
  updateMission();
  if(!silent){say(c.intro);}
}
function useCheck(rec){
  var cp=rec.cp, c=CASES[svc.n];
  if(!state.l4Active||state.l4Done){return;}
  if(svc.busy){say('Tunggu sebentar, komputer sedang bekerja...');return;}
  svc.idle=0;lastPrompt=null;
  if(cp.st==='bad'){
    cp.vis.setBad(false);cp.st='fixed';svc.fixed=true;svc.busy=true;
    addXP(30);sfx.reward();say(cp.def.fix);
    if(c.id==='monitor'){setScreen('boot');[262,330,392,523].forEach(function(f,i){tone(f,0.3+i*0.18,0.3);});}
    else if(c.id==='keyboard'){setScreen('kbok');}
    else{setScreen('spok');[523,659,784,659,523,784].forEach(function(f,i){tone(f,0.2+i*0.2,0.25,'square',0.07);});}
    updateMission();
    setTimeout(caseSolved,c.id==='monitor'?3800:3000);
  }else if(cp.st==='new'){
    svc.checkedN++;
    if(cp.id===svc.cause){
      cp.st='bad';svc.found=true;addXP(20);sfx.reward();
      say(cp.def.bad+' Tekan E lagi untuk memperbaikinya.');
    }else{
      cp.st='ok';addXP(10);sfx.open();
      say(cp.def.ok+' Bukan ini penyebabnya.');
    }
    updateMission();
  }else{
    say(cp.def.name+' sudah diperiksa dan normal. Periksa bagian lain, ya!');
  }
}
function caseSolved(){
  var n=svc.n;
  svc.list.forEach(function(cp){cp.rec.active=false;cp.sprite.visible=false;});
  state.l4n=n+1;
  lastPrompt=null;
  if(n<CASES.length-1){
    var d=document.createElement('div');d.className='bpop';d.textContent='✓ Kasus '+(n+1)+' selesai!';
    app.appendChild(d);setTimeout(function(){d.remove();},3700);
    updateMission();
    say('Komputer pulih! Tapi tunggu... ada masalah baru.');
    svc.busy=true;
    setTimeout(function(){startCase(n+1);},2600);
  }else{finishLevel4();}
}
function finishLevel4(){
  state.l4Done=true;state.levelsDone[4]=true;
  setScreen('all');svcSignT.redraw();
  addXP(100,1);sfx.reward();confetti();awardBadge('tech');updateMission();
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 4 · TEKNISI KOMPUTER</div><h2>MISSION COMPLETE</h2><p>Kamu menemukan penyebab dan memperbaiki 3 masalah komputer!</p><div class="t-badge">🏆 Junior Technician</div><p>+100 XP · ⭐ +1</p><p>🔓 Level 5: Jaringan Komputer terbuka</p></div>';
  t.hidden=false;setTimeout(hideToast,7000);
  say('Hebat! Misi selesai!');
  openDoor(5);
}
function caseTags(){
  return CASES.map(function(c,i){return {t:c.short.charAt(0)+c.short.slice(1).toLowerCase(),ok:i<state.l4n,cur:i===svc.n&&!state.l4Done};});
}
function pointTags(){
  var c=CASES[svc.n];
  return c.points.map(function(id){var cp=svc.byId[id];return {t:CPDEF[id].name,ok:cp.st==='ok'||cp.st==='fixed',cur:cp.st==='bad'};});
}
