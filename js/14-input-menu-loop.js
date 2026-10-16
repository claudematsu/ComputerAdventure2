/* ============================================================
   14-input-menu-loop.js
   Input keyboard/mouse/sentuh, menu awal, loop utama
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- input ---------- */
var keys={}, dragging=false, camMode=false, FPP_D=0.9;
function isFPP(){return camDist<FPP_D;}
function lookBy(dx,dy,k){
  yaw-=dx*0.0028*k;
  pitch=clamp(pitch+dy*0.0024*k,isFPP()?-1.2:0.05,1.25);
}
function setCamMode(on){
  camMode=!!on;app.classList.toggle('cam-on',camMode);
  if(on){try{var p=canvas.requestPointerLock();if(p&&p.catch){p.catch(function(){});}}catch(e){}}
  else{try{if(document.pointerLockElement){document.exitPointerLock();}}catch(e){}}
}
document.addEventListener('pointerlockchange',function(){
  if(camMode&&document.pointerLockElement!==canvas&&camLocked){setCamMode(false);}
  camLocked=document.pointerLockElement===canvas;
});
var camLocked=false;
function zoomBy(d){camDist=clamp(camDist+d,0,9);if(camDist>=FPP_D&&camDist<FPP_D+0.4&&d>0){camDist=FPP_D+0.4;}}
document.addEventListener('gesturestart',function(e){e.preventDefault();});
var MOVE_KEYS=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];
window.addEventListener('keydown',function(e){
  if(state.mode==='play'&&MOVE_KEYS.indexOf(e.code)>=0){e.preventDefault();}
  keys[e.code]=true;
  if(e.code==='Escape'&&camMode){setCamMode(false);}
  if(state.mode==='play'&&!state.panelOpen){if(e.code==='Equal'||e.code==='NumpadAdd'){zoomBy(-0.5);}else if(e.code==='Minus'||e.code==='NumpadSubtract'){zoomBy(0.5);}}
  if(state.mode!=='play'||e.repeat){return;}
  if(state.algoOpen&&algoKey(e)){e.preventDefault();return;}
  var kch=(e.key||'').toLowerCase();
  if(e.code==='KeyE'||kch==='e'){tryInteract();}
  else if(e.code==='KeyB'||kch==='b'){if(state.progOpen){closeProg();}else{openProg();}}
  else if(e.code==='KeyQ'||kch==='q'){dropActive();}
  else if(e.code==='Digit1'||e.code==='Digit2'||e.code==='Digit3'){var dn=+e.code.slice(5)-1;if(state.portOpen){choosePort(dn);}else if(state.choiceOpen){chooseOpt(dn);}else{selectSlot(dn);}}
  else if(state.panelOpen&&(e.code==='Escape'||e.code==='Enter'||e.code==='Space')){closePanel();}
});
window.addEventListener('keyup',function(e){keys[e.code]=false;});
window.addEventListener('blur',function(){keys={};dragging=false;});
function lockPointer(){} /* tidak dipakai lagi: kursor tetap bebas supaya bisa klik benda */
var press=null, lastTouchT=-1e9;
function tapPick(cx,cy){
  /* pilih benda terdekat dari titik klik/sentuh (jarak layar), seperti Roblox */
  var r=canvas.getBoundingClientRect(), best=null, bd=64, v=new THREE.Vector3();
  camera.updateMatrixWorld();
  for(var i=0;i<interactables.length;i++){
    var o=interactables[i];
    if(o.active===false){continue;}
    if(o.group&&o.group.__layer&&!((areaMask>>o.group.__layer)&1)){continue;}
    v.copy(o.pos);v.y=Math.max(v.y,0.6);v.project(camera);
    if(v.z>1){continue;}
    var d=Math.hypot((v.x*0.5+0.5)*r.width+r.left-cx,(-v.y*0.5+0.5)*r.height+r.top-cy);
    if(d<bd){bd=d;best=o;}
  }
  return best;
}
function tapAt(cx,cy){
  if(state.mode!=='play'||state.panelOpen||state.algoOpen||state.progOpen||state.portOpen||state.choiceOpen){return;}
  var o=tapPick(cx,cy);if(!o){return;}
  if(Math.hypot(o.pos.x-pos.x,o.pos.z-pos.z)>o.range+0.9){say('Dekati '+o.name+' dulu, lalu klik lagi.');return;}
  target=o;tryInteract();
}
canvas.addEventListener('contextmenu',function(e){e.preventDefault();});
canvas.addEventListener('mousedown',function(e){
  if(state.mode!=='play'||performance.now()-lastTouchT<700){return;}
  if(e.button===2){if(!state.panelOpen){setCamMode(!camMode);}return;}
  if(camMode&&e.button===0){tryInteract();return;}
  dragging=true;press={x:e.clientX,y:e.clientY,moved:0,btn:e.button};
});
window.addEventListener('mouseup',function(e){
  dragging=false;
  if(press&&press.btn===0&&press.moved<6&&e.target===canvas){tapAt(e.clientX,e.clientY);}
  press=null;
});
document.addEventListener('mousemove',function(e){
  if(state.mode!=='play'||state.panelOpen){return;}
  if(dragging&&press){
    press.moved+=Math.abs(e.movementX)+Math.abs(e.movementY);
    if(press.moved>=6){lookBy(e.movementX,e.movementY,1);}
  }else if(camMode){
    lookBy(e.movementX,e.movementY,1);
  }else if(e.target===canvas&&performance.now()-lastTouchT>700){
    canvas.style.cursor=tapPick(e.clientX,e.clientY)?'pointer':'';
  }
});
canvas.addEventListener('wheel',function(e){
  if(state.mode!=='play'){return;}
  e.preventDefault();zoomBy(e.deltaY*0.004);
},{passive:false});

/* sentuh */
var joy={x:0,y:0}, joyId=null, lookId=null, lastLook={x:0,y:0}, tapInfo=null;
function enableTouch(){app.classList.add('touch');}
try{if(matchMedia('(pointer: coarse)').matches){enableTouch();}}catch(e){}
window.addEventListener('touchstart',enableTouch,{passive:true});
var joyEl=$('#joy'), knob=$('#joy-knob');
function joyMove(t){
  var r=joyEl.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
  var dx=t.clientX-cx, dy=t.clientY-cy, len=Math.hypot(dx,dy), max=48;
  if(len>max){dx=dx/len*max;dy=dy/len*max;}
  knob.style.transform='translate('+dx+'px,'+dy+'px)';
  joy.x=dx/max;joy.y=-dy/max;
}
function joyEnd(){joyId=null;joy.x=0;joy.y=0;knob.style.transform='';}
joyEl.addEventListener('touchstart',function(e){e.preventDefault();var t=e.changedTouches[0];joyId=t.identifier;joyMove(t);},{passive:false});
joyEl.addEventListener('touchmove',function(e){e.preventDefault();for(var i=0;i<e.changedTouches.length;i++){if(e.changedTouches[i].identifier===joyId){joyMove(e.changedTouches[i]);}}},{passive:false});
joyEl.addEventListener('touchend',function(e){for(var i=0;i<e.changedTouches.length;i++){if(e.changedTouches[i].identifier===joyId){joyEnd();}}});
joyEl.addEventListener('touchcancel',joyEnd);
$('#ebtn').addEventListener('touchstart',function(e){e.preventDefault();tryInteract();},{passive:false});
$('#qbtn').addEventListener('touchstart',function(e){e.preventDefault();dropActive();},{passive:false});
$('#qbtn').addEventListener('click',dropActive);
$('#zin').addEventListener('click',function(){zoomBy(-0.7);});
$('#zout').addEventListener('click',function(){zoomBy(0.7);});
$('#prompt').addEventListener('click',function(){tryInteract();});
canvas.addEventListener('touchstart',function(e){
  if(state.mode!=='play'||lookId!==null){return;}
  var t=e.changedTouches[0];lookId=t.identifier;lastLook={x:t.clientX,y:t.clientY};
  tapInfo={x:t.clientX,y:t.clientY,t:performance.now(),moved:0};lastTouchT=performance.now();
},{passive:true});
var pinchD=0;
canvas.addEventListener('touchmove',function(e){
  e.preventDefault();
  if(e.targetTouches.length>=2){
    var a=e.targetTouches[0], b=e.targetTouches[1], dd=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
    if(pinchD){zoomBy((pinchD-dd)*0.012);}
    pinchD=dd;tapInfo=null;lastLook={x:a.clientX,y:a.clientY};return;
  }
  pinchD=0;
  for(var i=0;i<e.changedTouches.length;i++){
    var t=e.changedTouches[i];
    if(t.identifier===lookId&&!state.panelOpen){
      if(tapInfo){tapInfo.moved+=Math.abs(t.clientX-lastLook.x)+Math.abs(t.clientY-lastLook.y);}
      lookBy(t.clientX-lastLook.x,t.clientY-lastLook.y,2.0);
      lastLook={x:t.clientX,y:t.clientY};
    }
  }
},{passive:false});
function lookEnd(e){for(var i=0;i<e.changedTouches.length;i++){if(e.changedTouches[i].identifier===lookId){lookId=null;}}}
canvas.addEventListener('touchend',function(e){
  pinchD=0;
  var t=e.changedTouches[0];lastTouchT=performance.now();
  if(tapInfo&&t&&t.identifier===lookId&&tapInfo.moved<10&&performance.now()-tapInfo.t<450){
    if(e.cancelable){e.preventDefault();}
    tapAt(t.clientX,t.clientY);
  }
  tapInfo=null;lookEnd(e);
},{passive:false});
canvas.addEventListener('touchcancel',function(e){tapInfo=null;lookEnd(e);});

/* ---------- menu ---------- */
function pickChar(g){
  setKid(g);
  $('#ch-boy').setAttribute('aria-pressed',String(g==='boy'));
  $('#ch-girl').setAttribute('aria-pressed',String(g==='girl'));
}
$('#ch-boy').addEventListener('click',function(){pickChar('boy');});
$('#ch-girl').addEventListener('click',function(){pickChar('girl');});
$('#start').addEventListener('click',function(){
  var a=audio();if(a&&a.resume){a.resume();}
  state.mode='play';
  $('#menu').hidden=true;$('#hud').hidden=false;
  yaw=0;pitch=0.42;kidFace=Math.PI;
  updateStats();updateMission();
  canvas.focus();
  say(app.classList.contains('touch')?'Halo! Aku KOMP-BOT. Geser joystick untuk jalan, sentuh benda untuk memakainya!':'Halo! Aku KOMP-BOT. Jalan pakai W, A, S, D. Klik benda atau tekan E untuk memakainya!',true);
});

/* ---------- loop utama ---------- */
var SPEED=4.3, R=0.4, T=0;
var camLook=new THREE.Vector3(0,1.2,4.6), lookT=new THREE.Vector3(), camWant=new THREE.Vector3();
camera.position.set(1.5,1.9,8.2);
var menuA=0;

function moveAxis(dx,dz){
  var nx=clamp(pos.x+dx,-8.55,8.55), nz=clamp(pos.z+dz,-6.55,6.55);
  for(var i=0;i<solids.length;i++){
    var s=solids[i];
    if(s.layer&&!((areaMask>>s.layer)&1)){continue;}
    if(nx>s.x0-R&&nx<s.x1+R&&nz>s.z0-R&&nz<s.z1+R){
      if(dx!==0){nx=dx>0?s.x0-R:s.x1+R;}
      else if(dz!==0){nz=dz>0?s.z0-R:s.z1+R;}
    }
  }
  pos.x=nx;pos.z=nz;
}

function update(dt){
  var play=state.mode==='play';
  if(camMode&&(state.panelOpen||!play)){setCamMode(false);}
  var fpp=isFPP();
  if(!fpp&&pitch<0.05){pitch=0.05;}
  var ix=0, iz=0;
  if(play&&!state.panelOpen){
    if(keys.KeyW||keys.ArrowUp){iz+=1;}
    if(keys.KeyS||keys.ArrowDown){iz-=1;}
    if(keys.KeyA){ix-=1;}
    if(keys.KeyD){ix+=1;}
    ix+=joy.x;iz+=joy.y;
    if(keys.ArrowLeft){yaw+=1.9*dt;}
    if(keys.ArrowRight){yaw-=1.9*dt;}
  }
  var len=Math.hypot(ix,iz);if(len>1){ix/=len;iz/=len;}
  var fx=-Math.sin(yaw), fz=-Math.cos(yaw), rx=Math.cos(yaw), rz=-Math.sin(yaw);
  var k=Math.min(1,dt*12);
  vel.x+=((fx*iz+rx*ix)*SPEED-vel.x)*k;
  vel.z+=((fz*iz+rz*ix)*SPEED-vel.z)*k;
  if(Math.abs(vel.x)<0.01){vel.x=0;}
  if(Math.abs(vel.z)<0.01){vel.z=0;}
  if(vel.x!==0){moveAxis(vel.x*dt,0);}
  if(vel.z!==0){moveAxis(0,vel.z*dt);}

  /* karakter */
  var sp=Math.hypot(vel.x,vel.z), kk=Math.min(1,sp/SPEED);
  if(play){
    /* menghadap sesuai arah yang ditekan pemain (bukan kecepatan yang tertinggal) */
    if(len>0.1){kidFace=Math.atan2(fx*iz+rx*ix,fz*iz+rz*ix);}
    else if(fpp){kidFace=Math.atan2(fx,fz);}
    kid.root.rotation.y=lerpAngle(kid.root.rotation.y,kidFace,Math.min(1,dt*16));
  }else{
    var toCam=Math.atan2(camera.position.x-pos.x,camera.position.z-pos.z);
    kid.root.rotation.y=lerpAngle(kid.root.rotation.y,toCam,Math.min(1,dt*6));
  }
  phase+=sp*dt*2.6;
  kid.root.position.set(pos.x,Math.abs(Math.sin(phase))*0.05*kk+(play?0:Math.sin(T*2)*0.012),pos.z);
  kid.legs[0].rotation.x=Math.sin(phase)*0.8*kk;
  kid.legs[1].rotation.x=-Math.sin(phase)*0.8*kk;
  armWave+=((play?0:1)-armWave)*Math.min(1,dt*6);
  holdBlend+=((play&&heldItem()?1:0)-holdBlend)*Math.min(1,dt*10);
  /* membawa benda: kedua lengan terangkat ke depan dan sedikit merapat ke tengah */
  var sw=1-holdBlend*0.85;
  kid.arms[0].rotation.x=-Math.sin(phase)*0.7*kk*sw-1.0*holdBlend;
  kid.arms[1].rotation.x=Math.sin(phase)*0.7*kk*sw-1.0*holdBlend;
  kid.arms[0].rotation.z=0.4*holdBlend;
  kid.arms[1].rotation.z=armWave*(2.5+(reduceMotion?0:Math.sin(T*7)*0.25))-0.4*holdBlend;

  /* KOMP-BOT mengikuti */
  var bx=pos.x+rx*1.25-fx*0.1, bz=pos.z+rz*1.25-fz*0.1;
  bx=clamp(bx,-8.5,8.5);bz=clamp(bz,-6.5,6.5);
  var bk=1-Math.exp(-dt*3.2);
  bot.position.x+=(bx-bot.position.x)*bk;
  bot.position.z+=(bz-bot.position.z)*bk;
  bot.position.y=1.95+(reduceMotion?0:Math.sin(T*2.4)*0.09);
  bot.rotation.y=lerpAngle(bot.rotation.y,Math.atan2(pos.x-bot.position.x,pos.z-bot.position.z),Math.min(1,dt*5));
  bot.rotation.z=clamp((bx-bot.position.x)*-0.2,-0.2,0.2);

  /* kamera */
  if(play){
    var cp=Math.cos(pitch);
    kid.root.visible=!fpp;
    camWant.set(pos.x+Math.sin(yaw)*camDist*cp,1.4+Math.sin(pitch)*camDist,pos.z+Math.cos(yaw)*camDist*cp);
    camWant.x=clamp(camWant.x,-13,13);camWant.z=clamp(camWant.z,-11,11);camWant.y=clamp(camWant.y,0.8,8);
    lookT.set(pos.x,1.4,pos.z);
    if(fpp){
      var cpp=Math.cos(pitch);
      camWant.set(pos.x-Math.sin(yaw)*0.12,1.55,pos.z-Math.cos(yaw)*0.12);
      lookT.set(camWant.x-Math.sin(yaw)*3*cpp,1.55-Math.sin(pitch-0.1)*3,camWant.z-Math.cos(yaw)*3*cpp);
    }
    if(state.algoView){
      var asp=camera.aspect||1.6, tf=Math.tan((camera.fov||60)*Math.PI/360);
      var need=4.9/(2*tf*Math.min(asp,1.8)), dd=Math.max(4.4,need), ox=0.66*dd, oy=0.75*dd;
      camWant.set(2.5+ox,Math.min(0.2+oy,7.5),4.6);lookT.set(2.5,0.2,4.6);
    }
  }else{
    kid.root.visible=true;
    if(!reduceMotion){menuA=Math.sin(T*0.45)*0.55;}
    camWant.set(pos.x+Math.sin(menuA)*3.9,1.85,pos.z+Math.cos(menuA)*3.9);
    lookT.set(pos.x,1.1,pos.z);
  }
  camera.position.lerp(camWant,1-Math.exp(-dt*(play?(fpp?40:9):4)));
  camLook.lerp(lookT,1-Math.exp(-dt*(fpp&&play?40:10)));
  camera.lookAt(camLook);

  /* penanda dan lampu berkedip */
  for(var i=0;i<interactables.length;i++){
    var s=interactables[i];
    if(s.sprite){
      var hint=!!(state.ch&&state.ch.id===s.id);
      var want=hint?arrowTex.tex:(state.checked[s.id]?okTex.tex:qTex.tex);
      if(s.sprite.material.map!==want){s.sprite.material.map=want;s.sprite.material.needsUpdate=true;}
      s.sprite.position.y=s.baseY+(reduceMotion?0:Math.sin(T*(hint?6:3)+i)*(hint?0.14:0.07));
      var sc=hint?0.85:0.55+(state.checked[s.id]||reduceMotion?0:Math.sin(T*4+i)*0.04);
      s.sprite.scale.set(sc,sc,sc);
    }
  }
  for(var b=0;b<blinkers.length;b++){var bl=blinkers[b];bl.m.color.setHex(Math.sin(T*3+bl.ph)>-0.2?bl.on:bl.off);}

  var AI=allItems();
  for(var q=0;q<AI.length;q++){
    var fi=AI[q];
    if(fi.state==='free'){
      fi.model.position.y=0.42+(reduceMotion?0:Math.sin(T*2.2+fi.ph)*0.07);
      if(!reduceMotion){fi.model.rotation.y+=dt*0.9;}
      var rs=1+(reduceMotion?0:Math.sin(T*3+fi.ph)*0.06);fi.ring.scale.set(rs,rs,rs);
    }
  }

  if(state.l2Active){
    var l2on=!state.l2Done;
    ghostMat.opacity=reduceMotion?0.35:0.25+0.15*Math.sin(T*4);
    for(var gk in ghosts){var gs=l2on&&!state.l2in[gk];ghosts[gk].visible=gs;glabels[gk].visible=gs;}
    cpuLabel.visible=l2on&&!(state.l2in.power&&state.l2in.hdmi&&state.l2in.usbcable);
    asmArrow.visible=l2on&&!boot.active;
    asmArrow.position.y=3.7+(reduceMotion?0:Math.sin(T*4)*0.15);
    if(boot.active){
      boot.t+=dt;scr.p=Math.min(1.02,boot.t/4);
      if(boot.t-boot.last>0.12){boot.last=boot.t;bootT.redraw();}
      if(boot.t>=4.5){boot.active=false;scr.p=1.02;bootT.redraw();finishLevel2();}
    }
  }

  if(state.l3Active){
    var hi3=heldItem();
    l3Arrow.visible=!state.l3Done&&!!(hi3&&hi3.def.l3);
    l3Arrow.position.y=3.4+(reduceMotion?0:Math.sin(T*4)*0.15);
    var ZK=Object.keys(ZONES);
    for(var zi=0;zi<ZK.length;zi++){
      var zz=ZONES[ZK[zi]];
      if(zz.flash>0){zz.flash-=dt;zz.flashMesh.material.opacity=Math.max(0,zz.flash/0.8)*0.65;}else{zz.flashMesh.material.opacity=0;}
      if(zz.shake>0){zz.shake-=dt;zz.g.position.x=zz.x+(reduceMotion?0:Math.sin(T*70)*0.07*Math.min(1,zz.shake/0.2));}else{zz.g.position.x=zz.x;}
      if(zz.popT>0){zz.popT-=dt;zz.pop.visible=true;zz.pop.position.y=0.5+(1-zz.popT)*0.9;}else{zz.pop.visible=false;}
    }
  }

  if(state.l4Active){
    var on4=!state.l4Done;
    svc.arrow.visible=on4&&svc.checkedN===0&&!svc.busy;
    svc.arrow.position.y=3.5+(reduceMotion?0:Math.sin(T*4)*0.15);
    for(var ci4=0;ci4<svc.list.length;ci4++){
      var cp4=svc.list[ci4];
      if(!cp4.rec.active){continue;}
      var w4=cp4.st==='bad'?warnTex.tex:(cp4.st==='new'?qTex.tex:okTex.tex);
      if(cp4.sprite.material.map!==w4){cp4.sprite.material.map=w4;cp4.sprite.material.needsUpdate=true;}
      cp4.sprite.position.y=cp4.baseY+(reduceMotion?0:Math.sin(T*(cp4.st==='bad'?6:3)+cp4.ph)*0.08);
    }
    if(svc.scr==='boot'){
      svc.p+=dt/2.6;svc.pt+=dt;
      if(svc.p>=1){svc.scr='desk';svcT.redraw();}
      else if(svc.pt>0.1){svc.pt=0;svcT.redraw();}
    }
    if(svc.scr==='kbbad'){
      var bl4=Math.floor(T*2)%2;
      if(bl4!==svc.blink){svc.blink=bl4;svcT.redraw();}
    }
    if(play&&!state.panelOpen&&on4&&!svc.busy){
      svc.idle+=dt;
      if(svc.idle>40){
        svc.idle=0;
        say(svc.found?'Bagian bertanda ! bermasalah. Dekati lalu tekan E untuk memperbaikinya.':'Periksa bagian bertanda ? satu per satu. Kabel ada di belakang meja, ayo jalan memutar!');
      }
    }
  }

  if(state.l5Active){
    var hi5=heldItem(), cab=hi5&&hi5.def.l5?hi5:null;
    nw.arrow.visible=!nw.done&&!!cab;
    nw.arrow.position.y=3.2+(reduceMotion?0:Math.sin(T*4)*0.15);
    if(cab&&cab.l5.end){
      var pe=nw.ports[cab.l5.end].def.p;
      setNetLine({x:pe[0],y:pe[1],z:pe[2]},{x:pos.x,y:1.0,z:pos.z});nw.lineM.visible=true;
    }else{nw.lineM.visible=false;}
    if(play&&!state.panelOpen&&!nw.done){
      nw.idle+=dt;
      if(nw.idle>40){
        nw.idle=0;
        say(cab?'Colokkan kabel ke port di PC, Switch, Router, atau Internet. '+netHint():'Cari kabel LAN bercincin biru di lantai.');
      }
    }
  }

  if(state.l6Active){
    SITS.forEach(function(q,i){
      if(q.sprite.visible){q.sprite.position.y=q.sy+(reduceMotion?0:Math.sin(T*3+i)*0.08);}
    });
    if(sec.shake>0){
      sec.shake-=dt;
      sec.usb.m.position.x=(reduceMotion?0:Math.sin(T*60)*0.04);
      if(sec.shake<=0){sec.usbMat.color.setHex(0x3B82F6);sec.usb.m.position.x=0;}
    }
    if(sec.fly){
      sec.fly.t+=dt/1.3;
      var ft=Math.min(1,sec.fly.t), ug2=sec.usb.g;
      ug2.position.x=sec.fly.x0+(TEACHER_BOX[0]-sec.fly.x0)*ft;
      ug2.position.z=sec.fly.z0+(TEACHER_BOX[2]-sec.fly.z0)*ft;
      ug2.position.y=Math.sin(ft*Math.PI)*1.1+(TEACHER_BOX[1]-0.14)*ft;
      sec.usb.ring.visible=false;
      if(ft>=1){ug2.visible=false;sec.fly=null;}
    }
    if(play&&!state.panelOpen&&!state.l6Done){
      sec.idle+=dt;
      if(sec.idle>40){sec.idle=0;say('Cari situasi bertanda !: flashdisk di lantai dan tiga komputer di lab.');}
    }
  }

  if(state.l7Active){
    algoUpdate(dt,T);
    if(play&&!state.panelOpen&&!state.l7Done){
      algo.idle+=dt;
      if(algo.idle>40){algo.idle=0;say('Dekati Konsol Robot bertanda ! di dekat arena, lalu tekan E.');}
    }
  }

  if(state.l8Active){
    if(Math.abs(L8.light-L8.lightTo)>0.002){
      L8.light+=(L8.lightTo-L8.light)*Math.min(1,dt*(L8.lightTo>L8.light?1.4:6));
      hemi.intensity=0.82*(0.4+0.6*L8.light);sun.intensity=0.55*(0.3+0.7*L8.light);
    }
    L8.marks.forEach(function(m,i){if(m.sp.visible){m.sp.position.y=m.y+(reduceMotion?0:Math.sin(T*3+i*1.7)*0.08);}});
    if(L8.scr==='boot'){
      L8.p+=dt/3;L8.pt+=dt;
      if(L8.p>=1){setL8Scr('desk');L8.busy=false;L8.s[3]=true;addXP(20);sfx.reward();say('Komputer menyala! Buka program LAPORAN dengan E.');updateMission();}
      else if(L8.pt>0.1){L8.pt=0;l8T.redraw();}
    }else if(L8.scr==='run'){
      L8.p+=dt/2.5;L8.pt+=dt;
      if(L8.p>=1){setL8Scr('done');L8.busy=false;L8.s[4]=true;addXP(30);sfx.reward();say('Program selesai! Laporan siap. Kirim hasilnya ke printer.');updateMission();}
      else if(L8.pt>0.1){L8.pt=0;l8T.redraw();}
    }
    if(L8.print){
      L8.print.t+=dt;
      var pk=Math.min(1,L8.print.t/2);
      L8.paper.position.x=7.52-0.26*pk;
      if(L8.print.t>=2.6){
        L8.print=null;L8.busy=false;L8.s[5]=true;addXP(30);sfx.reward();updateMission();
        say('Cetak selesai! Sekarang nyalakan seluruh lab...',true);
        setTimeout(finishLevel8,900);
      }
    }
    if(play&&!state.panelOpen&&!state.l8Done&&!L8.busy){
      L8.idle+=dt;
      if(L8.idle>40){L8.idle=0;say(l8Next());}
    }
  }

  updateGuideHUD();

  /* target interaksi, tutorial, petunjuk */
  if(play&&!state.panelOpen){
    target=pickTarget();
    setHL(target);
    if(hl){var kp=0.35+0.15*Math.sin(T*6);hl.mats.forEach(function(m){m.emissive.setHex(0xFFD84A);m.emissiveIntensity=kp;});}
    if(target!==lastPrompt){
      lastPrompt=target;
      var pr=$('#prompt');
      if(target){
        $('#pr-main').textContent=(target.id==='door'&&state.doorTo)?'Masuk':target.isL8?l8Label(target):target.isAlgo?'Pakai':target.isSit?'Periksa':target.isNetPort?(heldItem()&&heldItem().def.l5?'Colokkan':'Lihat'):target.isCheck?(target.cp.st==='bad'?target.cp.def.act:'Periksa'):target.isItem?'Pick Up':((target.isCrate||target.isAsm||target.isCpu||target.isZone)&&heldItem()?'Place':'Interact');
        $('#pr-sub').textContent=target.name;pr.hidden=false;
        if(target.isItem&&!state.itemHint&&tut.step>=3){state.itemHint=true;say('Benda berkilau ini bisa diambil. Klik/sentuh bendanya atau tekan E.');}
      }else{pr.hidden=true;}
    }
    if(tut.step===0&&Math.hypot(pos.x-SPAWN.x,pos.z-SPAWN.z)>3){tut.step=1;if(!startChallenge('Bagus! ')){say('Bagus! Sekarang coba dekati komputer.',true);}}
    else if(tut.step===1&&target){tut.step=2;say(app.classList.contains('touch')?'Sudah dekat! Sentuh benda atau tombol E, ya.':'Sudah dekat! Klik benda atau tekan E, ya.',true);}
    idleT+=dt;
    if(state.ch){
      chT+=dt;
      if(!state.hintOn&&chT>28){state.hintOn=true;say(state.ch.hint);}
    }
    if(tut.step>=3&&!state.stageDone&&idleT>35){idleT=0;say(state.ch?'Ingat, kita sedang mencari '+state.ch.name+'!':'Cari tanda ? yang melayang. Dekati perangkatnya lalu tekan E.');}
  }else if(state.panelOpen){
    setHL(null);lastPrompt=null;
  }
}

setArea(1,false);
var last=performance.now();
function frame(now){
  requestAnimationFrame(frame);
  var dt=Math.min(0.05,(now-last)/1000);last=now;T+=dt;
  update(dt);
  renderer.render(scene,camera);
}
requestAnimationFrame(frame);

try{
  if(document.fonts&&document.fonts.load){
    Promise.all([document.fonts.load('800 40px "Baloo 2"'),document.fonts.load('700 16px "Nunito"')]).then(function(){
      redrawables.forEach(function(r){r.redraw();});
    }).catch(function(){});
  }
}catch(e){}
