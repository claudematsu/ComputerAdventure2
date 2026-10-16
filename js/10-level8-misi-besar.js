/* ============================================================
   10-level8-misi-besar.js
   Level 8: Misi Besar (final)
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 8: misi besar ---------- */
MK('l8');
var l8items=[];
var L8={built:false,active:false,done:false,s:[false,false,false,false,false,false],inst:{},scr:'off',p:0,pt:0,light:1,lightTo:1,print:null,busy:false,idle:0,key:null,P:null,ovs:[],marks:[],deskRec:null,prnRec:null,paper:null,sockP:null,sockU:null};
L8.sCount=function(){return L8.s.filter(Boolean).length;};
var L8TASKS=['Pasang komputer','Perbaiki jaringan','Hubungkan printer','Nyalakan komputer','Jalankan program','Cetak hasil'];
var L8SPOTS=[[-4.4,-0.85],[0,-0.85],[4.4,-0.85],[-5.0,3.0],[-7.3,-1.9],[-3.2,2.8],[6.4,1.4],[-6.4,2.9]];
var L8DEFS=[
  {id:'l8-monitor',kind:'monitor',name:'Monitor',icon:'🖥️',hold:0.5,fs:0.55,l8:true,build:function(g){makeMonitor(g,0,0,0);}},
  {id:'l8-keyboard',kind:'keyboard',name:'Keyboard',icon:'⌨️',hold:0.6,l8:true,build:function(g){makeKeyboard(g,0,0,0);}},
  {id:'l8-mouse',kind:'mouse',name:'Mouse',icon:'🖱️',hold:1.5,l8:true,build:function(g){makeMouse(g,0,0,0);}},
  {id:'l8-printercable',kind:'printercable',name:'Kabel Printer',icon:'🖨️',hold:1.2,l8:true,build:function(g){mkCoil(g,0x7A5CFF,0xC8CFE3,1);}}
];
L8DEFS.forEach(function(d,i){
  var g=grp(world,0,0,0,0);
  var model=grp(g,0,0.42,0,0);d.build(model);model.scale.setScalar(d.fs||1);
  var ring=new THREE.Mesh(new THREE.RingGeometry(0.42,0.56,28),BM(0xFF8A3D,{transparent:true,opacity:0.95,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2;ring.position.y=0.02;g.add(ring);
  var it={def:d,g:g,model:model,ring:ring,state:'free',got:false,ph:i*0.8+0.3};
  var o={id:'l8item:'+d.kind,isItem:true,item:it,group:g,name:d.name,type:'MISI BESAR',range:1.7,bias:0.6,active:false,pos:new THREE.Vector3(0,0.5,0),mats:collectMats(model)};
  g.visible=false;it.rec=o;l8items.push(it);interactables.push(o);
});
MK('shell');
function drawL8(x,w,h){
  var s=L8.scr,p=L8.p;
  x.textAlign='center';x.textBaseline='middle';x.setLineDash([]);
  if(s==='off'){x.fillStyle='#131B33';x.fillRect(0,0,w,h);return;}
  if(s==='boot'){
    if(p<0.25){
      x.fillStyle='#05070F';x.fillRect(0,0,w,h);x.fillStyle='#9FE8B8';
      x.font='700 24px monospace';x.textAlign='left';x.textBaseline='alphabetic';
      x.fillText('KOMP-BIOS v1.0',24,44);x.fillText('Memeriksa memori ... OK',24,80);x.fillText('Mencari disk ... OK',24,116);return;
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
    label(x,'Komputer menyala!',w/2,56,40,'#1B2559');
    x.lineWidth=4;x.strokeStyle='#1B2559';
    x.fillStyle='#FFC83D';rr(x,78,96,140,116,18);x.fill();x.stroke();
    label(x,'LAPORAN',148,166,26,'#1B2559');
    x.fillStyle='#FF6F59';rr(x,238,96,80,80,16);x.fill();x.stroke();label(x,'Tulis',278,196,20,'#1B2559');
    x.fillStyle='#14B8A6';rr(x,338,96,80,80,16);x.fill();x.stroke();label(x,'Main',378,196,20,'#1B2559');
    label(x,'Buka program LAPORAN',w/2,260,28,'#0C7A6F');return;
  }
  if(s==='run'){
    x.fillStyle='#1B2559';x.fillRect(0,0,w,h);
    label(x,'LAPORAN LAB',w/2,70,46,'#FFC83D');
    label(x,'Program berjalan...',w/2,140,30,'#FFFFFF');
    x.fillStyle='rgba(255,255,255,.25)';rr(x,76,184,360,30,15);x.fill();
    x.fillStyle='#7CF2B5';rr(x,76,184,Math.max(30,360*Math.min(1,p)),30,15);x.fill();
    label(x,Math.round(Math.min(1,p)*100)+'%',w/2,256,30,'#FFFFFF');return;
  }
  if(s==='done'||s==='sent'){
    x.fillStyle=s==='done'?'#14B8A6':'#2B3A8F';x.fillRect(0,0,w,h);
    label(x,s==='done'?'Laporan siap!':'Mencetak...',w/2,84,52,'#FFFFFF');
    label(x,s==='done'?'Kirim hasil ke printer':'Kertas keluar dari printer',w/2,160,30,'#E9FFF8');
    x.fillStyle='#FFFFFF';rr(x,206,198,100,80,12);x.fill();x.lineWidth=4;x.strokeStyle='#1B2559';x.stroke();
    x.fillStyle='#1B2559';x.fillRect(222,214,68,6);x.fillRect(222,230,68,6);x.fillRect(222,246,44,6);
    return;
  }
  if(s==='online'){
    var g3=x.createLinearGradient(0,0,0,h);g3.addColorStop(0,'#14B8A6');g3.addColorStop(1,'#2B3A8F');x.fillStyle=g3;x.fillRect(0,0,w,h);
    label(x,'SYSTEM ONLINE',w/2,h*0.42,68,'#FFFFFF');
    label(x,'Laboratorium siap digunakan',w/2,h*0.66,28,'#FFF3C9');
  }
}
var l8T=canvasTex(512,320,drawL8);
var sysT=canvasTex(512,320,function(x,w,h){
  var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#14B8A6');g.addColorStop(1,'#2B3A8F');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.textAlign='center';x.textBaseline='middle';
  label(x,'SYSTEM ONLINE',w/2,h*0.42,68,'#FFFFFF');
  label(x,'Laboratorium siap digunakan',w/2,h*0.66,28,'#FFF3C9');
});
function setL8Scr(m){L8.scr=m;L8.p=0;L8.pt=0;l8T.redraw();}
function l8Socket(x,y,z,face){
  var g=grp(world,x,y,z,0), zf=face==='z';
  box(g,zf?0.2:0.04,0.14,zf?0.04:0.2,L(0xFF8A3D),0,0,0);
  box(g,zf?0.13:0.05,0.08,zf?0.05:0.13,L(0x131B33),zf?0:-0.005,0,zf?0.005:0);
  var plug=grp(g,zf?0:-0.07,0,zf?0.07:0,0);box(plug,0.1,0.08,0.08,L(0x7A5CFF),0,0,0);plug.visible=false;
  return {g:g,plug:plug};
}
function buildL8(){
  if(L8.built){return;}
  L8.built=true;
  var P=otherDesks[2];L8.P=P;
  layerWalk(plane(P.monitor,1.3,0.72,BM(0xFFFFFF,{map:l8T.tex}),0,0.83,0.076,0,0),P.monitor.__layer||0);
  /* papan status jaringan di dinding */
  plane(world,1.7,1.06,BM(0xFFFFFF,{map:netT.tex}),8.96,2.55,-3.4,0,-Math.PI/2);
  labelSprite(scene,'STATUS JARINGAN',8.6,3.25,-3.4,1.5).visible=true;
  /* layar SYSTEM ONLINE untuk semua monitor */
  var mons=[otherDesks[0].monitor,otherDesks[1].monitor,otherDesks[3].monitor,otherDesks[4].monitor,hero.monitor];
  if(svc.mon){mons.push(svc.mon);}
  mons.forEach(function(m){var pl=plane(m,1.3,0.72,BM(0xFFFFFF,{map:sysT.tex}),0,0.83,0.082,0,0);layerWalk(pl,m.__layer||0);pl.visible=false;L8.ovs.push(pl);});
  /* colokan printer dan colokan USB di PC */
  L8.sockP=l8Socket(7.46,1.2,0.65,'x');L8.sockU=l8Socket(3.12,1.28,-2.93,'z');
  L8.lblP=labelSprite(scene,'PRINTER',7.35,1.75,0.65,0.9);L8.lblU=labelSprite(scene,'PC (USB)',3.12,1.8,-2.93,0.9);
  /* kertas */
  var pp=grp(world,7.52,1.04,0.2,0);box(pp,0.34,0.012,0.26,L(0xFFFFFF),0,0,0);
  var ptx=canvasTex(128,96,function(x,w,h){x.fillStyle='#FFFFFF';x.fillRect(0,0,w,h);label(x,'LAPORAN',w/2,34,22,'#1B2559');x.fillStyle='#1B2559';x.fillRect(18,54,92,5);x.fillRect(18,68,92,5);});
  plane(pp,0.3,0.22,BM(0xFFFFFF,{map:ptx.tex}),0,0.008,0,-Math.PI/2,Math.PI/2);
  pp.visible=false;L8.paper=pp;
  /* interaktif */
  L8.deskRec={id:'l8-desk',isL8:true,kind:'desk',group:P.g,name:'Komputer Utama',type:'MISI BESAR',range:3.1,bias:3,active:false,pos:new THREE.Vector3(4.4,1.1,-3.45),mats:collectMats(P.cpu)};
  L8.prnRec={id:'l8-printer',isL8:true,kind:'printer',group:printerG,name:'Printer',type:'MISI BESAR',range:2.4,bias:3,active:false,pos:new THREE.Vector3(7.2,1.2,0.4),mats:collectMats(printerG)};
  interactables.push(L8.deskRec,L8.prnRec);
  [[4.4,3.0,-3.45],[7.2,2.3,0.4]].forEach(function(q){
    var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:warnTex.tex,transparent:true,depthTest:false}));
    sp.scale.set(0.55,0.55,0.55);sp.renderOrder=9;sp.position.set(q[0],q[1],q[2]);sp.visible=false;scene.add(sp);
    L8.marks.push({sp:sp,y:q[1]});
  });
}
function startLevel8(){
  var _m=snap();buildL8();claim('l8',_m);
  L8.active=true;state.l8Active=true;state.level=8;updateStats();
  L8.light=1;L8.lightTo=0;
  var P=L8.P;P.monitor.visible=false;P.keyboard.visible=false;P.mouse.visible=false;
  setL8Scr('off');
  /* benda */
  var pool=L8SPOTS.slice().sort(function(){return Math.random()-0.5;});
  l8items.forEach(function(it,i){
    var sp=pool[i];
    it.g.position.set(sp[0],0,sp[1]);it.rec.pos.set(sp[0],0.5,sp[1]);
    it.g.visible=true;it.rec.active=true;
  });
  /* putuskan satu sambungan jaringan */
  var keys=['sw-rt','rt-net'];L8.key=keys[Math.floor(Math.random()*keys.length)];
  if(nw.tubes[L8.key]){nw.tubes[L8.key].visible=false;}
  (nw.lp[L8.key]||[]).forEach(function(id){var pt=nw.ports[id];pt.occ=null;pt.plug.visible=false;});
  nw.links[L8.key]=false;nw.nLinks=2;nw.broken=true;nw.done=false;netT.redraw();
  nw.ports.pc.rec.active=false;nw.ports.pc.label.visible=false;
  var cab=l5items[l5items.length-1];
  var cs=pool[4];
  scene.add(cab.g);cab.g.position.set(cs[0],0,cs[1]);cab.g.rotation.set(0,0,0);cab.g.scale.setScalar(1);cab.g.visible=true;
  cab.ring.visible=true;cab.state='free';cab.model.scale.setScalar(cab.def.fs||1);cab.model.position.y=0.42;
  if(cab.l5){cab.l5.end=null;}
  cab.rec.active=true;cab.rec.pos.set(cs[0],0.5,cs[1]);
  /* tempat tugas */
  L8.deskRec.active=true;L8.prnRec.active=true;
  L8.lblP.visible=true;L8.lblU.visible=true;
  L8.marks.forEach(function(m){m.sp.visible=true;});
  updateMission();
}
function l8Tags(){return L8TASKS.map(function(t,i){return {t:t,ok:!!L8.s[i],cur:false};});}
function l8Next(){
  var s=L8.s;
  if(!s[0]){return 'Pasang Monitor, Keyboard, dan Mouse di komputer meja belakang kanan.';}
  if(!s[1]||!s[2]){
    var m=[];if(!s[1]){m.push('perbaiki jaringan (kabel LAN biru)');}if(!s[2]){m.push('sambungkan printer (Kabel Printer)');}
    return 'Tugas berikutnya: '+m.join(' dan ')+'.';
  }
  if(!s[3]){return 'Nyalakan komputer: tekan E di komputer meja belakang kanan.';}
  if(!s[4]){return 'Jalankan program LAPORAN di komputer.';}
  return 'Kirim hasil ke printer di sisi kanan lab.';
}
function l8Label(t){
  var it=heldItem(), s=L8.s;
  if(t.kind==='desk'){
    if(it&&it.def.l8){return 'Pasang';}
    if(s[0]&&s[1]&&s[2]&&!s[3]){return 'Nyalakan';}
    if(s[3]&&!s[4]){return 'Jalankan';}
    return 'Periksa';
  }
  if(it&&it.def.l8&&it.def.kind==='printercable'){return 'Colokkan';}
  if(s[4]&&!s[5]){return 'Cetak';}
  return 'Periksa';
}
function l8Consume(it){
  state.inv[state.sel]=null;it.state='installed';it.g.visible=false;
  for(var i=0;i<3;i++){if(state.inv[i]){state.sel=i;break;}}
  refreshInv();
}
function useL8(rec){
  if(!state.l7Done||!L8.active||L8.done){return;}
  L8.idle=0;lastPrompt=null;
  if(rec.kind==='desk'){useL8Desk();}else{useL8Printer();}
}
function useL8Desk(){
  var it=heldItem(), s=L8.s;
  if(it&&it.def.l8){
    var k=it.def.kind;
    if(k==='monitor'||k==='keyboard'||k==='mouse'){
      if(L8.inst[k]){say(it.def.name+' sudah terpasang. Cari benda lain.');sfx.close();return;}
      L8.P[k].visible=true;L8.inst[k]=true;
      if(k==='monitor'){L8.P.monitor.visible=true;}
      l8Consume(it);addXP(20);sfx.reward();
      var n=(L8.inst.monitor?1:0)+(L8.inst.keyboard?1:0)+(L8.inst.mouse?1:0);
      if(n>=3){s[0]=true;say('Komputer terpasang! Tugas berikutnya: perbaiki jaringan dan sambungkan printer.');}
      else{say('Bagus! '+it.def.name+' terpasang. Tinggal '+(3-n)+' lagi!');}
      updateMission();return;
    }
    say('Belum tepat. '+it.def.name+' dipasang di printer, bukan di komputer.');sfx.close();return;
  }
  if(it&&it.def.l5){say('Kabel LAN dipakai di pojok JARINGAN, bukan di komputer ini.');sfx.close();return;}
  if(!s[0]){say('Komputer ini butuh Monitor, Keyboard, dan Mouse. Cari benda bercincin oranye!');return;}
  if(!s[3]){
    if(!(s[1]&&s[2])){
      var ms=[];if(!s[1]){ms.push('perbaiki jaringan');}if(!s[2]){ms.push('sambungkan printer');}
      say('Sebelum menyalakan komputer, '+ms.join(' dan ')+' dulu.');return;
    }
    if(L8.busy){say('Tunggu sebentar, komputer sedang menyala...');return;}
    L8.busy=true;setL8Scr('boot');
    [262,330,392,523].forEach(function(f,i){tone(f,i*0.18,0.3);});
    say('Komputer mulai menyala...');return;
  }
  if(!s[4]){
    if(L8.busy||L8.scr!=='desk'){say('Tunggu sebentar...');return;}
    L8.busy=true;setL8Scr('run');sfx.open();say('Program LAPORAN berjalan...');return;
  }
  if(!s[5]){say('Laporan sudah siap! Kirim hasilnya ke printer.');return;}
}
function useL8Printer(){
  var it=heldItem(), s=L8.s;
  if(it&&it.def.l8&&it.def.kind==='printercable'){
    if(s[2]){say('Printer sudah terhubung.');return;}
    L8.sockP.plug.visible=true;L8.sockU.plug.visible=true;
    layerWalk(tube(world,[[7.46,1.2,0.65],[7.1,0.6,0.7],[7.0,0.06,0.2],[5.8,0.05,-0.9],[3.6,0.05,-1.3],[3.0,0.06,-2.0],[3.0,0.06,-2.3],[3.05,0.7,-2.45],[3.1,1.06,-2.6],[3.12,1.28,-2.93]],0.03,0x7A5CFF),AREA_L.l8);
    l8Consume(it);s[2]=true;addXP(30);sfx.reward();
    say('Bagus! Printer terhubung ke komputer lewat kabel.');updateMission();return;
  }
  if(it&&it.def.l8){say('Belum tepat. '+it.def.name+' dipasang di komputer.');sfx.close();return;}
  if(!s[2]){say('Printer ini belum terhubung. Ambil Kabel Printer, lalu colokkan di sini.');return;}
  if(!s[4]){say('Printer menunggu hasil dari komputer. Jalankan program LAPORAN dulu!');return;}
  if(!s[5]){
    if(L8.print){return;}
    L8.print={t:0};L8.busy=true;L8.paper.visible=true;L8.paper.position.x=7.52;
    setL8Scr('sent');[392,440,392,440].forEach(function(f,i){tone(f,i*0.2,0.15,'square',0.06);});
    say('Mengirim hasil ke printer...');return;
  }
}
function l8NetFixed(){
  nw.broken=false;L8.s[1]=true;
  addXP(30);sfx.reward();updateMission();
  say('Jaringan tersambung lagi! Papan status di dinding menunjukkan CONNECTED.');
}
function showFinal(){
  $('#f-xp').textContent='⭐ '+state.stars+' bintang';
  $('#f-st').textContent=state.xp+' XP';
  $('#f-bd').textContent='🏆 '+state.nBadges+' badge';
  state.panelOpen=true;state.finalOpen=true;unlock();
  $('#prompt').hidden=true;$('#final').hidden=false;
}
function hideFinal(){
  state.panelOpen=false;state.finalOpen=false;$('#final').hidden=true;idleT=0;
}
function restartGame(){
  try{location.reload();}catch(e){try{location.href=location.href;}catch(e2){}}
}
function finishLevel8(){
  L8.done=true;state.l8Done=true;state.levelsDone[8]=true;
  L8.lightTo=1;L8.ovs.forEach(function(p){p.visible=true;});
  setL8Scr('online');
  L8.marks.forEach(function(m){m.sp.visible=false;});
  L8.deskRec.active=false;L8.prnRec.active=false;
  addXP(100,1);sfx.reward();confetti();awardBadge('eng');updateMission();
  [523,659,784,1047,1319].forEach(function(f,i){tone(f,i*0.12,0.3);});
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 8 · MISI BESAR</div><h2>SYSTEM ONLINE</h2><p>Mission Complete! Seluruh laboratorium menyala lagi.</p><div class="t-badge">🏆 JUNIOR COMPUTER ENGINEER</div><p>+100 XP · ⭐ +1</p><p>Kamu menamatkan Computer Adventure!</p></div>';
  t.hidden=false;setTimeout(hideToast,9000);
  say('Hebat! Kamu sekarang Junior Computer Engineer!');
  $('#restart').hidden=false;
  setTimeout(function(){hideToast();showFinal();},4500);
}
