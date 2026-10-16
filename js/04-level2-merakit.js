/* ============================================================
   04-level2-merakit.js
   Level 2: Merakit komputer
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 2: meja rakit ---------- */
MK('asm');
var l2items=[];
var L2DEFS=[
  {id:'monitor',name:'Monitor',icon:'🖥️',spot:[-3.0,3.4],hold:0.5,fs:0.55,l2:true,build:function(g){makeMonitor(g,0,0,0);}},
  {id:'keyboard',name:'Keyboard',icon:'⌨️',spot:[-6.2,1.9],hold:0.6,l2:true,build:function(g){makeKeyboard(g,0,0,0);}},
  {id:'mouse',name:'Mouse',icon:'🖱️',spot:[-6.4,-0.85],hold:1.5,l2:true,build:function(g){makeMouse(g,0,0,0);}},
  {id:'power',name:'Kabel Power',icon:'🔌',spot:[-1.5,5.8],hold:1.2,l2:true,build:function(g){mkCoil(g,0x2B3A67,0xFFFFFF,2);}},
  {id:'hdmi',name:'Kabel HDMI',icon:'📺',spot:[7.4,4.7],hold:1.2,l2:true,build:function(g){mkCoil(g,0xFF6F59,0x1B2559,1);}},
  {id:'usbcable',name:'Kabel USB',icon:'🔗',spot:[-7.8,2.6],hold:1.2,l2:true,build:function(g){mkCoil(g,0x7A5CFF,0xC8CFE3,1);}}
];
function allItems(){return items.concat(l2items,l3items,l5items,l8items);}
L2DEFS.forEach(function(d,i){
  var g=grp(world,d.spot[0],0,d.spot[1],0);
  var model=grp(g,0,0.42,0,0);d.build(model);model.scale.setScalar(d.fs||1);
  var ring=new THREE.Mesh(new THREE.RingGeometry(0.42,0.56,28),BM(0x14B8A6,{transparent:true,opacity:0.95,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2;ring.position.y=0.02;g.add(ring);
  var it={def:d,g:g,model:model,ring:ring,state:'free',got:false,ph:i*1.1+0.5};
  var o={id:'l2item:'+d.id,isItem:true,item:it,group:g,name:d.name,type:'KOMPONEN',range:1.7,bias:0.6,active:false,pos:new THREE.Vector3(d.spot[0],0.5,d.spot[1]),mats:collectMats(model)};
  g.visible=false;it.rec=o;l2items.push(it);interactables.push(o);
});
function labelSprite(parent,text,x,y,z,w){
  var t=canvasTex(256,64,function(c,cw,ch){c.fillStyle='#1B2559';rr(c,3,3,cw-6,ch-6,18);c.fill();label(c,text,cw/2,ch/2+2,text.length>10?26:34,'#FFFFFF');});
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t.tex,transparent:true,depthTest:false}));
  sp.scale.set(w,w/4,1);sp.position.set(x,y,z);sp.renderOrder=9;sp.visible=false;parent.add(sp);return sp;
}
var asmG=grp(world,5.3,0,5.4,Math.PI), deskG=grp(asmG,0,0,0,0);
(function(){
  box(deskG,3,0.12,1.4,L(0xF3C98B),0,0.94,0);
  [[-1.4,-0.6],[1.4,-0.6],[-1.4,0.6],[1.4,0.6]].forEach(function(q){box(deskG,0.1,0.88,0.1,L(0x4A5FC1),q[0],0.44,q[1]);});
  box(deskG,2.8,0.55,0.05,L(0x5A70D6),0,0.6,-0.62);
  box(deskG,0.8,0.7,1.1,L(0x5A70D6),1.0,0.5,0);
  box(deskG,0.3,0.05,0.04,L(0xFFC83D),1.0,0.62,0.56);
})();
addSolid(5.3,5.4,3.0,1.4);
var ghostMat=BM(0x14B8A6,{transparent:true,opacity:0.35});
function ghostBox(w,h,d,x,y,z){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),ghostMat);m.position.set(x,y,z);m.visible=false;asmG.add(m);return m;}
var ghosts={monitor:ghostBox(1.5,0.95,0.12,0,1.5,-0.35),keyboard:ghostBox(1.2,0.07,0.42,0,1.04,0.3),mouse:ghostBox(0.42,0.1,0.36,1.0,1.06,0.3)};
var glabels={monitor:labelSprite(asmG,'MONITOR',0,2.2,-0.35,0.9),keyboard:labelSprite(asmG,'KEYBOARD',0,1.4,0.3,0.9),mouse:labelSprite(asmG,'MOUSE',1.0,1.4,0.3,0.7)};
var cpuG=makeCPU(asmG,-1.15,1.0,-0.15);
var cpuLabel=labelSprite(asmG,'CPU: PASANG KABEL',-1.15,2.05,-0.15,1.5);
box(world,0.22,0.22,0.06,L(0xFFFFFF),6.9,0.4,6.96);
box(world,0.05,0.07,0.02,L(0x1B2559),6.85,0.42,6.925);
box(world,0.05,0.07,0.02,L(0x1B2559),6.95,0.42,6.925);
var asmSignT=canvasTex(512,128,function(x,w,h){
  var open=!!(state&&state.stageDone);
  x.fillStyle=open?'#14B8A6':'#1B2559';rr(x,4,4,w-8,h-8,26);x.fill();
  label(x,'MEJA RAKIT',w/2,h*0.4,60,'#FFFFFF');
  label(x,open?'LEVEL 2 · RAKIT KOMPUTER':'LEVEL 2 · TERKUNCI',w/2,h*0.78,30,open?'#FFF3C9':'#FFC83D');
});
plane(world,2.6,0.65,BM(0xFFFFFF,{map:asmSignT.tex}),5.3,3.2,6.95,0,Math.PI);
var asmRec={id:'asm',isAsm:true,group:deskG,name:'Meja Rakit',type:'TEMPAT',range:3.3,bias:0.2,active:true,pos:new THREE.Vector3(5.3,1.0,5.4),mats:collectMats(deskG)};
var cpuRec={id:'cpu-rakit',isCpu:true,group:cpuG,name:'CPU Meja Rakit',type:'TEMPAT',range:2.6,bias:0.25,active:true,pos:new THREE.Vector3(6.45,1.0,5.55),mats:collectMats(cpuG)};
interactables.push(asmRec,cpuRec);
var asmArrow=new THREE.Sprite(new THREE.SpriteMaterial({map:arrowTex.tex,transparent:true,depthTest:false}));
asmArrow.scale.set(0.9,0.9,0.9);asmArrow.position.set(5.3,3.7,5.4);asmArrow.renderOrder=10;asmArrow.visible=false;scene.add(asmArrow);

var asmParts={}, boot={active:false,t:0,last:0}, scr={p:-1};
var bootT=canvasTex(512,320,function(x,w,h){
  var p=scr.p;
  if(p<0){x.fillStyle='#131B33';x.fillRect(0,0,w,h);return;}
  if(p<0.2){
    x.fillStyle='#05070F';x.fillRect(0,0,w,h);x.fillStyle='#9FE8B8';
    x.font='700 24px monospace';x.textAlign='left';x.textBaseline='alphabetic';
    x.fillText('KOMP-BIOS v1.0',24,44);x.fillText('Memeriksa memori ... OK',24,80);x.fillText('Mencari disk ... OK',24,116);
    if(Math.floor(p*40)%2===0){x.fillRect(24,134,14,24);}
    return;
  }
  if(p<1){
    var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2B3A8F');g.addColorStop(1,'#14B8A6');x.fillStyle=g;x.fillRect(0,0,w,h);
    label(x,'KOMP-OS',w/2,h*0.36,78,'#FFFFFF');
    var k=(p-0.2)/0.8;
    x.fillStyle='rgba(255,255,255,.3)';rr(x,96,196,320,24,12);x.fill();
    x.fillStyle='#FFC83D';rr(x,96,196,Math.max(24,320*k),24,12);x.fill();
    label(x,'Memuat... '+Math.round(k*100)+'%',w/2,256,28,'#FFFFFF');
    return;
  }
  var g2=x.createLinearGradient(0,0,0,h);g2.addColorStop(0,'#8EDBFF');g2.addColorStop(1,'#DDF6FF');x.fillStyle=g2;x.fillRect(0,0,w,h);
  label(x,'Selamat datang di Lab Komputer!',w/2,70,34,'#1B2559');
  label(x,'Komputer berhasil dirakit',w/2,114,28,'#0C7A6F');
  [['#FF6F59','Tulis'],['#FFC83D','Gambar'],['#14B8A6','Main']].forEach(function(ic,i){
    var ix=96+i*120;x.fillStyle=ic[0];rr(x,ix,150,72,72,16);x.fill();x.lineWidth=4;x.strokeStyle='#1B2559';x.stroke();
    label(x,ic[1],ix+36,246,24,'#1B2559');
  });
  x.fillStyle='#1B2559';x.fillRect(0,h-36,w,36);label(x,'SYSTEM ONLINE',w/2,h-18,22,'#5EEAFF');
});
var CABLE_PORT={power:'power',hdmi:'hdmi',usbcable:'usb'};
var COMP_KINDS=['monitor','keyboard','mouse'];
var KIND_NAMES={monitor:'Monitor',keyboard:'Keyboard',mouse:'Mouse',power:'Kabel Power',hdmi:'Kabel HDMI',usbcable:'Kabel USB'};
var OK_MSG={
  monitor:'Bagus! Monitor sudah terpasang. Monitor menampilkan gambar.',
  keyboard:'Bagus! Keyboard sudah terpasang.',
  mouse:'Bagus! Mouse sudah terpasang.',
  power:'Bagus! Kabel power sudah terpasang. Ia mengalirkan listrik.',
  hdmi:'Bagus! Kabel monitor sudah terpasang. HDMI mengirim gambar ke layar.',
  usbcable:'Bagus! Kabel USB sudah terpasang.'
};
var PORT_HINT={power:'Port POWER punya dua lubang pipih dan satu lubang bulat.',hdmi:'Port HDMI berbentuk datar dengan sudut miring.',usb:'Port USB berbentuk persegi panjang kecil.'};
var PORTS=[
  {id:'power',label:'POWER',svg:'<svg viewBox="0 0 64 48" aria-hidden="true"><rect x="4" y="4" width="56" height="40" rx="12" fill="#2B3A67"/><rect x="17" y="12" width="7" height="15" rx="2" fill="#FFC83D"/><rect x="40" y="12" width="7" height="15" rx="2" fill="#FFC83D"/><circle cx="32" cy="35" r="4" fill="#FFC83D"/></svg>'},
  {id:'hdmi',label:'HDMI',svg:'<svg viewBox="0 0 64 48" aria-hidden="true"><path d="M6 8h52v18l-8 14H14L6 26z" fill="#2B3A67"/><rect x="16" y="16" width="32" height="7" rx="2" fill="#FF6F59"/></svg>'},
  {id:'usb',label:'USB',svg:'<svg viewBox="0 0 64 48" aria-hidden="true"><rect x="6" y="10" width="52" height="28" rx="5" fill="#2B3A67"/><rect x="12" y="20" width="40" height="8" rx="2" fill="#7A5CFF"/></svg>'}
];
function startLevel2(){
  state.l2Active=true;state.level=2;updateStats();
  l2items.forEach(function(it){it.g.visible=true;it.rec.active=true;});
  asmSignT.redraw();updateMission();
}
function installComp(kind){
  if(kind==='monitor'){var m=makeMonitor(asmG,0,1.0,-0.35);plane(m,1.3,0.72,BM(0xFFFFFF,{map:bootT.tex}),0,0.83,0.068,0,0);asmParts.monitor=layerWalk(m,AREA_L.asm);}
  else if(kind==='keyboard'){asmParts.keyboard=layerWalk(makeKeyboard(asmG,0,1.0,0.3),AREA_L.asm);}
  else if(kind==='mouse'){asmParts.mouse=layerWalk(makeMouse(asmG,1.0,1.0,0.3),AREA_L.asm);}
  ghosts[kind].visible=false;glabels[kind].visible=false;
}
function addCable(kind){
  var c={
    power:[0x1B2559,[[6.45,1.15,6.12],[6.5,0.95,6.5],[6.55,0.55,6.8],[6.83,0.42,6.93]]],
    hdmi:[0xFF6F59,[[6.45,1.5,6.1],[6.1,1.68,6.1],[5.6,1.52,5.95],[5.3,1.36,5.85]]],
    usbcable:[0x7A5CFF,[[6.2,1.3,5.15],[5.95,1.06,5.0],[5.65,1.045,4.98],[5.4,1.045,5.08]]]
  }[kind];
  layerWalk(tube(world,c[1],0.03,c[0]),AREA_L.asm);
}
function afterInstall(it,kind){
  state.inv[state.sel]=null;it.state='installed';it.g.visible=false;
  for(var i=0;i<3;i++){if(state.inv[i]){state.sel=i;break;}}
  state.l2in[kind]=true;state.l2n++;
  addXP(20);sfx.reward();refreshInv();updateMission();
  if(state.l2n>=6){startBoot();}
  else{say(OK_MSG[kind]+' Tinggal '+(6-state.l2n)+' lagi!');}
}
function startBoot(){
  boot.active=true;boot.t=0;boot.last=0;scr.p=0;bootT.redraw();
  [262,330,392,523].forEach(function(f,i){tone(f,i*0.18,0.3);});
  say('Semua komponen terpasang! Komputer mulai menyala...',true);
  updateMission();
}
function finishLevel2(){
  state.l2Done=true;state.levelsDone[2]=true;
  addXP(100,1);sfx.reward();confetti();updateMission();
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 2 · MERAKIT KOMPUTER</div><h2>MISSION COMPLETE</h2><p>Komputer menyala! Kamu berhasil merakit komputer sendiri.</p><p>+100 XP · ⭐ +1</p><p>🔓 Level 3: Input, Proses, Output terbuka</p></div>';
  t.hidden=false;setTimeout(hideToast,7000);
  say('Hebat! Misi selesai!');
  openDoor(3);
}
function useAsm(){
  if(!state.stageDone){say('Level 2 masih terkunci. Selesaikan Level 1 dulu, ya!');return;}
  if(state.l2Done||boot.active){say('Komputer ini sudah menyala!');return;}
  var it=heldItem();
  if(!it){
    var miss=[];Object.keys(KIND_NAMES).forEach(function(k){if(!state.l2in[k]){miss.push(KIND_NAMES[k]);}});
    say('Meja Rakit masih butuh: '+miss.join(', ')+'.');return;
  }
  var k=it.def.id;
  if(COMP_KINDS.indexOf(k)>=0){
    if(state.l2in[k]){say(KIND_NAMES[k]+' sudah terpasang. Cari komponen lain.');return;}
    installComp(k);afterInstall(it,k);
  }else if(CABLE_PORT[k]){
    say('Belum tepat. Kabel dipasang di port belakang CPU. Dekati CPU lalu tekan E.');sfx.close();
  }else{
    say('Belum tepat. '+it.def.name+' tidak dipakai untuk merakit komputer.');sfx.close();
  }
}
function useCpu(){
  if(!state.stageDone){say('Level 2 masih terkunci. Selesaikan Level 1 dulu, ya!');return;}
  if(state.l2Done||boot.active){say('Komputer ini sudah menyala!');return;}
  var it=heldItem();
  if(!it){say('Ini CPU. Bawa kabel ke sini, lalu pilih port yang cocok.');return;}
  var k=it.def.id;
  if(CABLE_PORT[k]){
    if(state.l2in[k]){say(KIND_NAMES[k]+' sudah terpasang.');return;}
    openPort(it);
  }else if(COMP_KINDS.indexOf(k)>=0){
    say('Belum tepat. '+it.def.name+' dipasang di atas meja, bukan di CPU.');sfx.close();
  }else if(k==='lan'){
    say('Kabel LAN dipakai untuk jaringan. Kita pakai nanti!');
  }else{
    say('Belum tepat. Coba cari port yang sesuai.');sfx.close();
  }
}
function buildPort(){
  var box=$('#ports');box.textContent='';
  PORTS.forEach(function(pt,i){
    var kind=pt.id==='usb'?'usbcable':pt.id;
    var b=document.createElement('button');b.type='button';
    b.className='portb'+(state.l2in[kind]?' done':'');
    b.setAttribute('data-p',pt.id);
    b.innerHTML=pt.svg+'<span>'+pt.label+'</span><small>tekan '+(i+1)+'</small>';
    b.addEventListener('click',function(){choosePort(i);});
    box.appendChild(b);
  });
}
function openPort(it){
  state.panelOpen=true;state.portOpen=true;state.portWrong=0;unlock();
  buildPort();
  $('#port-sub').textContent='Kamu membawa: '+it.def.name+'. Pilih port yang cocok di belakang CPU.';
  var m=$('#port-msg');m.textContent='';m.className='port-msg';
  $('#port').hidden=false;$('#prompt').hidden=true;lastPrompt=null;sfx.open();
}
function closePort(){
  state.panelOpen=false;state.portOpen=false;$('#port').hidden=true;sfx.close();idleT=0;
}
function choosePort(i){
  if(!state.portOpen){return;}
  var pt=PORTS[i];if(!pt){return;}
  var it=heldItem();if(!it){closePort();return;}
  var kind=it.def.id, want=CABLE_PORT[kind], msg=$('#port-msg');
  if(want===pt.id){
    closePort();addCable(kind);afterInstall(it,kind);
  }else{
    state.portWrong++;sfx.close();
    msg.className='port-msg bad';msg.textContent='Belum tepat. Coba cari port yang sesuai.';
    say('Belum tepat. Coba cari port yang sesuai.');
    if(state.portWrong>=2){
      msg.textContent+=' Petunjuk: '+PORT_HINT[want];
      Array.prototype.forEach.call($('#ports').children,function(b){if(b.getAttribute('data-p')===want){b.className='portb hl';}});
    }
  }
}
$('#port-close').addEventListener('click',closePort);
$('#port').addEventListener('click',function(e){if(e.target===this){closePort();}});
