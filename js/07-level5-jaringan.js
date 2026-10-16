/* ============================================================
   07-level5-jaringan.js
   Level 5: Jaringan komputer
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 5: jaringan komputer ---------- */
MK('l5');
var l5items=[];
var nw={built:false,ports:{},links:{},tubes:{},lp:{},broken:false,nLinks:0,wrongN:0,idle:0,done:false,lineM:null,arrow:null};
var NCHAIN={pc:0,sw:1,rt:2,net:3};
var NLINK={
  'pc-sw':{name:'PC → Switch',ok:'Bagus! PC terhubung ke Switch. Switch menghubungkan beberapa komputer dalam satu jaringan.'},
  'sw-rt':{name:'Switch → Router',ok:'Bagus! Switch terhubung ke Router. Router membantu menghubungkan jaringan ke jaringan lain.'},
  'rt-net':{name:'Router → Internet',ok:'Bagus! Router terhubung ke Internet.'}
};
var NPORTS={
  pc:{dev:'pc',name:'Port LAN di PC',label:'PC',p:[3.37,1.5,-2.93],face:'z'},
  sw1:{dev:'sw',name:'Port Switch',label:'SWITCH',p:[7.52,0.96,-3.14],face:'x'},
  sw2:{dev:'sw',name:'Port Switch',label:'SWITCH',p:[7.52,0.96,-3.86],face:'x'},
  rt1:{dev:'rt',name:'Port Router',label:'ROUTER',p:[7.45,0.99,-4.7],face:'x'},
  rt2:{dev:'rt',name:'Port Router',label:'ROUTER',p:[7.45,0.99,-5.4],face:'x'},
  net:{dev:'net',name:'Colokan Internet',label:'INTERNET',p:[8.73,1.0,-6.3],face:'x'}
};
var DEVNAME={pc:'PC',sw:'Switch',rt:'Router',net:'Internet'};
function drawNet(x,w,h){
  var l=nw.links, all=!!nw.done;
  x.textAlign='center';x.textBaseline='middle';
  var g=x.createLinearGradient(0,0,0,h);
  if(all){g.addColorStop(0,'#14B8A6');g.addColorStop(1,'#2B3A8F');}else{g.addColorStop(0,'#2B3A8F');g.addColorStop(1,'#131B33');}
  x.fillStyle=g;x.fillRect(0,0,w,h);
  label(x,all?'CONNECTED':'BELUM TERHUBUNG',w/2,56,all?66:40,all?'#FFFFFF':'#FFC83D');
  var xs=[64,192,320,448], nm=['PC','SWITCH','ROUTER','INTERNET'], ks=['pc-sw','sw-rt','rt-net'];
  for(var i=0;i<3;i++){
    var on=!!l[ks[i]];
    x.lineWidth=on?10:6;x.strokeStyle=on?'#7CF2B5':'#6E7BB0';x.lineCap='round';
    x.setLineDash(on?[]:[10,10]);
    x.beginPath();x.moveTo(xs[i]+42,176);x.lineTo(xs[i+1]-42,176);x.stroke();
  }
  x.setLineDash([]);
  for(var j=0;j<4;j++){
    var lit=(j>0&&l[ks[j-1]])||(j<3&&l[ks[j]]);
    x.fillStyle=lit?'#FFC83D':'#DCE4F7';rr(x,xs[j]-42,138,84,76,16);x.fill();
    x.lineWidth=4;x.strokeStyle='#1B2559';x.setLineDash([]);x.stroke();
    label(x,nm[j],xs[j],176,j===3?17:20,'#1B2559');
  }
  label(x,all?'Internet siap dipakai!':'Pasang kabel LAN dari PC sampai Internet',w/2,262,all?30:24,all?'#FFFFFF':'#B9C6F0');
}
var netT=canvasTex(512,320,drawNet);
var L5SPOTS=[[-4.4,-0.85],[0,-0.85],[4.4,-0.85],[-5.0,3.0],[2.4,2.9],[-7.3,-1.9],[2.6,5.9],[-3.2,2.8],[6.4,1.4]];
[1,2,3].forEach(function(n,i){
  var d={id:'l5-lan'+n,name:'Kabel LAN',icon:'🔗',hold:1.2,l5:true,build:function(g){mkCoil(g,0x14B8A6,0x3B82F6,1);}};
  var g=grp(world,0,0,0,0);
  var model=grp(g,0,0.42,0,0);d.build(model);
  var ring=new THREE.Mesh(new THREE.RingGeometry(0.42,0.56,28),BM(0x3B82F6,{transparent:true,opacity:0.95,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2;ring.position.y=0.02;g.add(ring);
  var it={def:d,g:g,model:model,ring:ring,state:'free',got:false,ph:i*1.2+0.4,l5:{end:null}};
  var o={id:'l5item:'+n,isItem:true,item:it,group:g,name:d.name,type:'KABEL',range:1.7,bias:0.6,active:false,pos:new THREE.Vector3(0,0.5,0),mats:collectMats(model)};
  g.visible=false;it.rec=o;l5items.push(it);interactables.push(o);
});
MK('shell');
function setNetLine(a,b){
  var dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,len=Math.sqrt(dx*dx+dy*dy+dz*dz)||0.001;
  nw.lineM.position.set((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);
  nw.lineM.scale.set(1,len,1);
  nw.lineM.quaternion.setFromUnitVectors(nw.up,new THREE.Vector3(dx/len,dy/len,dz/len));
}
function buildNetwork(){
  if(nw.built){return;}
  nw.built=true;
  layerWalk(plane(otherDesks[2].monitor,1.3,0.72,BM(0xFFFFFF,{map:netT.tex}),0,0.83,0.068,0,0),AREA_L.desk2);
  nw.up=new THREE.Vector3(0,1,0);
  nw.lineM=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,1,6),L(0x14B8A6));
  nw.lineM.visible=false;scene.add(nw.lineM);
  /* colokan Internet di dinding */
  var ig=grp(world,8.86,1.25,-6.3,0);
  box(ig,0.2,0.7,0.8,L(0x2B3A67),0,0,0);
  sph(ig,0.28,L(0x3B9BFF),-0.12,0.66,0,14,10);
  sph(ig,0.1,L(0x3CCB7F),-0.34,0.72,0.1,8,6);sph(ig,0.09,L(0x3CCB7F),-0.3,0.6,-0.12,8,6);
  labelSprite(scene,'INTERNET',8.5,2.35,-6.3,1.3).visible=true;
  /* access point */
  var ap=grp(world,8.86,2.7,-1.7,0);
  cyl(ap,0.34,0.34,0.08,L(0xFFFFFF),0,0,0,18).rotation.z=Math.PI/2;
  sph(ap,0.2,L(0xEAF6FF),-0.1,0,0,12,8);
  box(ap,0.03,0.06,0.06,BM(0x35E08A),-0.28,0.08,0);
  labelSprite(scene,'ACCESS POINT',8.5,3.4,-1.7,1.5).visible=true;
  var apRec={id:'ap',group:ap,name:'Access Point',type:'PERANGKAT JARINGAN',desc:'Access Point membagi sinyal Wi-Fi supaya laptop dan tablet bisa ikut terhubung tanpa kabel.',fact:'Wi-Fi adalah sambungan jaringan tanpa kabel.',bot:'',range:2.6,bias:0,active:true,pos:new THREE.Vector3(8.8,1.4,-1.7),mats:collectMats(ap)};
  interactables.push(apRec);
  /* port */
  Object.keys(NPORTS).forEach(function(id){
    var d=NPORTS[id], g=grp(world,d.p[0],d.p[1],d.p[2],0), z=d.face==='z';
    box(g,z?0.2:0.04,0.14,z?0.04:0.2,L(0x14B8A6),0,0,0);
    box(g,z?0.13:0.05,0.08,z?0.05:0.13,L(0x131B33),z?0:-0.005,0,z?0.005:0);
    var plug=grp(g,z?0:-0.07,0,z?0.07:0,0);
    box(plug,0.1,0.08,0.08,L(0x3B82F6),0,0,0);
    plug.visible=false;
    var sp=labelSprite(scene,d.label,d.p[0]+(z?0:-0.1),d.p[1]+0.42,d.p[2],0.75);sp.visible=true;
    var wp=new THREE.Vector3(d.p[0],d.p[1],d.p[2]);
    var pt={id:id,def:d,plug:plug,occ:null,label:sp};
    pt.rec={id:'port:'+id,isNetPort:true,pid:id,group:g,name:d.name,type:'PORT',range:1.3,bias:1.2,active:false,pos:wp,mats:collectMats(g)};
    nw.ports[id]=pt;interactables.push(pt.rec);
  });
  nw.arrow=new THREE.Sprite(new THREE.SpriteMaterial({map:arrowTex.tex,transparent:true,depthTest:false}));
  nw.arrow.scale.set(0.9,0.9,0.9);nw.arrow.position.set(7.9,3.2,-4.3);nw.arrow.renderOrder=10;nw.arrow.visible=false;scene.add(nw.arrow);
}
function startLevel5(){
  var _m=snap();buildNetwork();claim('l5',_m);
  state.l5Active=true;state.level=5;updateStats();
  var pool=L5SPOTS.slice().sort(function(){return Math.random()-0.5;});
  l5items.forEach(function(it,i){
    var sp=pool[i];
    it.g.position.set(sp[0],0,sp[1]);it.rec.pos.set(sp[0],0.5,sp[1]);
    it.g.visible=true;it.rec.active=true;
  });
  Object.keys(nw.ports).forEach(function(k){nw.ports[k].rec.active=true;});
  netT.redraw();
  updateMission();
}
function resetCable(it){
  var c=it.l5;
  if(c&&c.end){var pt=nw.ports[c.end];pt.occ=null;pt.plug.visible=false;c.end=null;}
}
function netPath(key,a,b){
  var A=a.def.p,B=b.def.p;
  if(key==='pc-sw'){return [A,[A[0],1.06,-2.7],[4.5,1.04,-2.62],[5.7,1.04,-2.65],[6.1,0.5,-2.8],[6.5,0.06,-3.0],[6.9,0.06,B[2]],[7.3,0.7,B[2]],B];}
  if(key==='sw-rt'){return [A,[7.3,1.04,A[2]+(B[2]-A[2])/3],[7.3,1.04,A[2]+2*(B[2]-A[2])/3],B];}
  return [A,[7.25,0.9,A[2]-0.1],[7.2,0.4,-5.95],[7.9,0.1,-6.35],[8.5,0.3,-6.35],B];
}
function netHint(){
  var ks=['pc-sw','sw-rt','rt-net'];
  for(var i=0;i<3;i++){if(!nw.links[ks[i]]){return 'Petunjuk: hubungkan '+NLINK[ks[i]].name+' dulu.';}}
  return '';
}
function netWrong(da,db){
  if(da===db){return 'Belum tepat. Satu kabel harus menghubungkan dua perangkat yang berbeda.';}
  var s=[da,db].sort().join('-');
  if(s==='net-pc'){return 'Belum tepat. PC tidak langsung ke Internet. Lewat Switch dan Router dulu.';}
  if(s==='pc-rt'){return 'Belum tepat. PC harus ke Switch dulu, baru ke Router.';}
  if(s==='net-sw'){return 'Belum tepat. Switch tidak langsung ke Internet. Lewat Router dulu.';}
  return 'Belum tepat. Ingat urutannya: PC → Switch → Router → Internet.';
}
function useNetPort(rec){
  var pt=nw.ports[rec.pid], it=heldItem();
  if(!state.l4Done){say('Level 5 masih terkunci. Selesaikan Level 4 dulu, ya!');return;}
  if(nw.done){say('Jaringan sudah tersambung. Hebat!');return;}
  if(!it){say(pt.def.name+'. Ambil kabel LAN bercincin biru, lalu colokkan di sini.');return;}
  if(!it.def.l5){say('Ini bukan kabel LAN. Cari kabel LAN bercincin biru.');sfx.close();return;}
  if(pt.occ){say('Port ini sudah terpasang kabel. Pilih port lain.');sfx.close();return;}
  var c=it.l5;nw.idle=0;
  if(!c.end){
    c.end=pt.id;pt.occ=it;pt.plug.visible=true;sfx.open();lastPrompt=null;
    say('Satu ujung kabel terpasang. Bawa ujung satunya ke perangkat berikutnya!');
    return;
  }
  var a=nw.ports[c.end], da=a.def.dev, db=pt.def.dev;
  var diff=Math.abs(NCHAIN[da]-NCHAIN[db]);
  var key=NCHAIN[da]<NCHAIN[db]?da+'-'+db:db+'-'+da;
  if(diff!==1||nw.links[key]){
    resetCable(it);nw.wrongN++;sfx.close();lastPrompt=null;
    var m=diff===1?'Sambungan ini sudah ada.':netWrong(da,db);
    if(nw.wrongN>=2){m+=' '+netHint();}
    say(m);return;
  }
  var first=NCHAIN[da]<NCHAIN[db]?a:pt, second=first===a?pt:a;
  pt.plug.visible=true;pt.occ=it;
  nw.tubes[key]=layerWalk(tube(world,netPath(key,first,second),0.03,0x14B8A6),AREA_L.l5);nw.lp[key]=[first.id,second.id];
  nw.links[key]=true;nw.nLinks++;c.end=null;
  state.inv[state.sel]=null;it.state='installed';it.g.visible=false;
  for(var i=0;i<3;i++){if(state.inv[i]){state.sel=i;break;}}
  addXP(20);sfx.reward();refreshInv();netT.redraw();updateMission();
  if(nw.nLinks>=3){
    nw.done=true;netT.redraw();
    if(state.l5Done){l8NetFixed();return;}
    say('Jaringan tersambung! Data dari PC mengalir lewat Switch dan Router sampai ke Internet.',true);
    setTimeout(finishLevel5,1300);
  }else{say(NLINK[key].ok+' Tinggal '+(3-nw.nLinks)+' sambungan lagi!');}
}
function finishLevel5(){
  state.l5Done=true;state.levelsDone[5]=true;
  addXP(30);sfx.reward();confetti();awardBadge('net');updateMission();
  setTimeout(function(){addXP(100,1);},600);
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 5 · JARINGAN KOMPUTER</div><h2>MISSION COMPLETE</h2><p>PC sudah terhubung ke Internet lewat Switch dan Router!</p><div class="t-badge">🏆 Network Explorer</div><p>+130 XP · ⭐ +1</p><p>🔓 Level 6: Keamanan Komputer terbuka</p></div>';
  t.hidden=false;setTimeout(hideToast,7000);
  say('Hebat! Misi selesai!');
  openDoor(6);
}
function linkTags(){
  return ['pc-sw','sw-rt','rt-net'].map(function(k){return {t:NLINK[k].name,ok:!!nw.links[k],cur:false};});
}
