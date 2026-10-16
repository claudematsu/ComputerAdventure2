/* ============================================================
   02-dunia.js
   Dunia 3D: lantai, dinding, meja, jaringan, printer, server, rak, ruang (layer area)
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- bangun dunia ---------- */
var solids=[];
function addSolid(cx,cz,w,d){solids.push({x0:cx-w/2,x1:cx+w/2,z0:cz-d/2,z1:cz+d/2});}
var blinkers=[];
var specs=[];
/* ---------- ruang (area): lapisan tampilan ---------- */
var AREA_L={shell:0,deskH:1,desk0:2,desk1:3,desk2:4,desk3:5,desk4:6,net:7,printer:8,server:9,cab:10,rack:11,tech:12,plants:13,board:14,door:15,asm:16,l3:17,l4:18,l5:19,l6:20,l7:21,l8:22,off:30};
var areaMask=1, marks=[], WALLS=[];
function snap(){return {w:world.children.length,s:scene.children.length,sol:solids.length};}
function layerWalk(o,n){o.__layer=n;if(o.layers&&o.layers.set){o.layers.set(n);}var c=o.children;if(c&&c.length){for(var i=0;i<c.length;i++){layerWalk(c[i],n);}}return o;}
function claim(name,a,b){
  var n=AREA_L[name];if(!n){return;}
  world.children.slice(a.w,b?b.w:undefined).forEach(function(o){layerWalk(o,n);});
  scene.children.slice(a.s,b?b.s:undefined).forEach(function(o){layerWalk(o,n);});
  for(var i=a.sol;i<(b?b.sol:solids.length);i++){solids[i].layer=n;}
}
function MK(name){marks.push({n:name,m:snap()});}
function closeMarks(){
  for(var i=0;i<marks.length;i++){claim(marks[i].n,marks[i].m,marks[i+1]?marks[i+1].m:snap());}
  marks=[];
  specs.forEach(function(sp){if(sp.sprite&&sp.group&&sp.group.__layer){layerWalk(sp.sprite,sp.group.__layer);}});
}

/* tanah di luar dan lantai */
plane(scene,90,90,L(0xBDE8CC),0,-0.05,0,-Math.PI/2,0).receiveShadow=true;
box(world,18.6,0.25,14.6,L(0x6B7BDA),0,-0.14,0);
var floor=plane(world,18,14,new THREE.MeshLambertMaterial({map:floorT.tex}),0,0.001,0,-Math.PI/2,0);
floor.receiveShadow=true;

/* dinding: bidang satu sisi, tembus pandang dari luar */
function wall(w,h,color,x,y,z,ry,shadow){var m=plane(world,w,h,L(color),x,y,z,0,ry);m.receiveShadow=!!shadow;if(h===4.5){WALLS.push(m);}return m;}
wall(18,4.5,0xBDEBD5,0,2.25,-7,0,true);
wall(18,4.5,0xD7D0FF,0,2.25,7,Math.PI,true);
wall(14,4.5,0xFFE9A8,9,2.25,0,-Math.PI/2,true);
wall(14,4.5,0xFFD1C2,-9,2.25,0,Math.PI/2,true);
[[18,0,-6.985,0],[18,0,6.985,Math.PI],[14,8.985,0,-Math.PI/2],[14,-8.985,0,Math.PI/2]].forEach(function(a){
  var horiz=Math.abs(a[3])<0.1||Math.abs(a[3]-Math.PI)<0.1;
  var x=horiz?a[1]:a[1], z=a[2];
  wall(a[0],0.42,0x6B7BDA,x,0.21,z,a[3]);
  wall(a[0],0.16,0xFFFFFF,x,3.45,z,a[3]);
});

/* papan tulis, pintu, tanda */
function sign(p,w,h,x,y,z,ry,draw){
  var t=canvasTex(512,Math.round(512*h/w),draw);
  plane(p,w,h,BM(0xFFFFFF,{map:t.tex,transparent:true}),x,y,z,0,ry);
  return t;
}
// papan informasi
MK('board');
var boardG=grp(world,-3.2,0,-6.9,0);
box(boardG,5.5,2.4,0.1,L(0xC9D3EE),0,2.55,0);
box(boardG,5.5,0.08,0.2,L(0x8C9AD0),0,1.32,0.08);
var boardT=canvasTex(1024,430,function(x,w,h){
  x.fillStyle='#FFFFFF';x.fillRect(0,0,w,h);
  label(x,'SELAMAT DATANG DI LAB KOMPUTER',w/2,62,52,'#1B2559');
  label(x,'Komputer bekerja dengan 3 langkah',w/2,118,30,'#5A6AA8');
  var cols=[['INPUT','memasukkan data','#14B8A6','#FFFFFF'],['PROSES','mengolah data','#FFC83D','#1B2559'],['OUTPUT','menampilkan hasil','#FF6F59','#FFFFFF']];
  cols.forEach(function(c,i){
    var bx=56+i*322;
    x.fillStyle=c[2];rr(x,bx,160,276,170,22);x.fill();x.lineWidth=5;x.strokeStyle='#1B2559';x.stroke();
    label(x,c[0],bx+138,225,56,c[3]);label(x,c[1],bx+138,288,27,c[3]);
    if(i<2){x.fillStyle='#1B2559';x.beginPath();x.moveTo(bx+286,225);x.lineTo(bx+312,245);x.lineTo(bx+286,265);x.closePath();x.fill();}
  });
  label(x,'Ayo kenali perangkat di lab ini!',w/2,388,32,'#1B2559');
});
plane(boardG,5.3,2.22,BM(0xFFFFFF,{map:boardT.tex}),0,2.55,0.056,0,0);
MK('shell');

MK('door');
// pintu
var doorG=grp(world,5.8,0,-6.88,0);
box(doorG,2.4,3.4,0.14,L(0x16877D),0,1.7,0);
box(doorG,1.9,3.1,0.12,L(0x2FCB8F),0,1.55,0.06);
box(doorG,0.64,0.74,0.04,L(0xBFE9FF),0,2.3,0.14);
sph(doorG,0.08,L(0xFFC83D),0.7,1.4,0.16,10,8);
box(doorG,0.34,0.26,0.08,L(0xFFC83D),0,1.15,0.16);
var lockArc=new THREE.Mesh(new THREE.TorusGeometry(0.09,0.028,8,14,Math.PI),L(0xC9981A));
lockArc.position.set(0,1.27,0.16);doorG.add(lockArc);
var doorSignT=sign(doorG,2.6,0.6,0,3.78,0.1,0,function(x,w,h){
  var op=!!(state&&state.doorTo);
  x.fillStyle=op?'#14B8A6':'#1B2559';rr(x,4,4,w-8,h-8,26);x.fill();
  label(x,'AREA BERIKUTNYA',w/2,h*0.38,54,'#FFC83D');
  label(x,op?'MASUK ▶':'TERKUNCI',w/2,h*0.74,40,'#FFFFFF');
});
MK('shell');

// tanda dinding
MK('net');
sign(world,3.4,0.8,8.97,3.0,-4.2,-Math.PI/2,function(x,w,h){x.fillStyle='#1B2559';rr(x,4,4,w-8,h-8,28);x.fill();label(x,'JARINGAN',w/2,h/2+4,70,'#5EEAFF');});
MK('tech');
sign(world,3.4,0.8,-6.5,3.2,6.97,Math.PI,function(x,w,h){x.fillStyle='#1B2559';rr(x,4,4,w-8,h-8,28);x.fill();label(x,'AREA TEKNISI',w/2,h/2+4,66,'#FFC83D');});
MK('rack');
sign(world,4.6,0.8,-8.97,3.2,-1.8,Math.PI/2,function(x,w,h){x.fillStyle='#1B2559';rr(x,4,4,w-8,h-8,24);x.fill();label(x,'LEMARI & RAK PERANGKAT',w/2,h/2+4,44,'#FFFFFF');});
MK('printer');
sign(world,3.2,0.8,8.97,3.0,0.2,-Math.PI/2,function(x,w,h){x.fillStyle='#1B2559';rr(x,4,4,w-8,h-8,28);x.fill();label(x,'PRINTER',w/2,h/2+4,70,'#FF9A8B');});

MK('shell');
/* meja komputer */
function chair(x,z,color){
  var g=grp(world,x,0,z,0);
  cyl(g,0.06,0.06,0.5,L(0x4A5FC1),0,0.3,0,8);
  cyl(g,0.4,0.42,0.06,L(0x4A5FC1),0,0.05,0,5);
  box(g,0.7,0.1,0.65,L(color),0,0.58,0);
  box(g,0.7,0.7,0.1,L(color),0,0.98,0.3);
  addSolid(x,z,0.7,0.7);
}

function makeMonitor(parent,x,y,z,hero){
  var m=grp(parent,x,y,z,0), navy=0x2B3A67;
  box(m,0.7,0.05,0.45,L(navy),0,0.025,0);
  box(m,0.14,0.3,0.1,L(navy),0,0.2,-0.02);
  box(m,1.5,0.92,0.1,L(navy),0,0.81,0);
  box(m,1.34,0.76,0.02,L(0x131B33),0,0.83,0.055);
  plane(m,0.5,0.18,BM(0xFFFFFF,{transparent:true,opacity:0.07}),-0.3,1.0,0.069,0,0);
  box(m,0.08,0.03,0.02,BM(0xFF9F1C),0.62,0.4,0.058);
  return m;
}
function makeKeyboard(parent,x,y,z){
  var k=grp(parent,x,y,z,0);
  box(k,1.2,0.07,0.42,L(0xF2F5FD),0,0.035,0);
  plane(k,1.12,0.34,new THREE.MeshLambertMaterial({map:kbT.tex}),0,0.072,0,-Math.PI/2,0);
  return k;
}
function makeMouse(parent,x,y,z){
  var m=grp(parent,x,y,z,0);
  box(m,0.55,0.01,0.46,L(0x3B82F6),0,0.005,0.02);
  var body=sph(m,1,L(0x5CCFC6),0,0.085,0,14,10);body.scale.set(0.13,0.075,0.2);
  box(m,0.01,0.006,0.1,L(0x1B2559),0,0.152,-0.07);
  box(m,0.03,0.012,0.05,L(0x1B2559),0,0.155,-0.1);
  return m;
}
function makeCPU(parent,x,y,z){
  var c=grp(parent,x,y,z,0);
  box(c,0.5,1.1,0.8,L(0xBBD3FF),0,0.55,0);
  box(c,0.5,0.06,0.8,L(0x8FB0F2),0,1.1,0);
  box(c,0.3,0.06,0.02,L(0x2B3A67),0,0.9,0.41);
  cyl(c,0.07,0.07,0.04,L(0xFFFFFF),0,0.64,0.42,14).rotation.x=Math.PI/2;
  sph(c,0.025,BM(0x35E08A),0.14,0.64,0.42,8,6);
  box(c,0.1,0.03,0.02,L(0x2B3A67),-0.12,0.42,0.41);
  box(c,0.1,0.03,0.02,L(0x2B3A67),0.12,0.42,0.41);
  for(var i=0;i<5;i++){box(c,0.3,0.02,0.02,L(0x7C9BE0),0,0.28-i*0.05,0.41);}
  return c;
}
function makeSpeaker(parent,x,y,z){
  var s=grp(parent,x,y,z,0);
  box(s,0.36,0.58,0.32,L(0xFF7B6B),0,0.29,0);
  cyl(s,0.12,0.12,0.03,L(0x1B2559),0,0.17,0.165,16).rotation.x=Math.PI/2;
  cyl(s,0.05,0.05,0.04,L(0x5EEAFF),0,0.17,0.17,12).rotation.x=Math.PI/2;
  cyl(s,0.06,0.06,0.03,L(0x1B2559),0,0.44,0.165,14).rotation.x=Math.PI/2;
  return s;
}

function buildDesk(x,z,hero,ry,bare){
  var g=grp(world,x,0,z,ry||0), top=L(0xF3C98B), leg=0x4A5FC1;
  box(g,3,0.12,1.4,top,0,0.94,0);
  [[-1.4,-0.6],[1.4,-0.6],[-1.4,0.6],[1.4,0.6]].forEach(function(p){box(g,0.1,0.88,0.1,L(leg),p[0],0.44,p[1]);});
  box(g,2.8,0.55,0.05,L(0x5A70D6),0,0.6,-0.62);
  box(g,0.8,0.7,1.1,L(0x5A70D6),1.0,0.5,0);
  box(g,0.3,0.05,0.04,L(0xFFC83D),1.0,0.62,0.56);
  var parts={};
  parts.monitor=makeMonitor(g,0,1.0,-0.35);
  parts.keyboard=makeKeyboard(g,0,1.0,0.3);
  parts.mouse=makeMouse(g,1.0,1.0,0.3);
  parts.cpu=makeCPU(g,-1.15,1.0,-0.15);
  if(hero){parts.speaker=makeSpeaker(g,1.2,1.0,-0.3);}
  if(!bare){
    tube(g,[[0,1.04,-0.58],[-0.45,1.03,-0.64],[-0.95,1.04,-0.6],[-1.1,1.1,-0.5]],0.02,0x1B2559);
    tube(g,[[1.0,1.02,0.22],[1.0,1.02,-0.05],[0.85,1.02,-0.45],[0.4,1.02,-0.62]],0.014,0x1B2559);
  }
  addSolid(x,z,3.0,1.4);
  parts.g=g;
  return parts;
}
var chairColors=[0xFF6F59,0x14B8A6,0xFFC83D,0x7A5CFF,0xFF8FB5,0x3B82F6];
var deskX=[-4.4,0,4.4], ci=0, hero=null, otherDesks=[];
deskX.forEach(function(x,k){MK('desk'+k);otherDesks.push(buildDesk(x,-3.2,false));chair(x,-1.95,chairColors[ci++%6]);MK('shell');});
deskX.forEach(function(x,k){MK(x===0?'deskH':(k===0?'desk3':'desk4'));var p=buildDesk(x,0.6,x===0);if(x===0){hero=p;}else{otherDesks.push(p);}chair(x,1.85,chairColors[ci++%6]);MK('shell');});

function table(g,w,d,h,topColor,legColor){
  box(g,w,0.1,d,L(topColor),0,h-0.05,0);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(s){box(g,0.1,h-0.1,0.1,L(legColor),s[0]*(w/2-0.1),(h-0.1)/2,s[1]*(d/2-0.1));});
}

MK('net');
/* pojok jaringan: router, switch, kabel LAN */
var netG=grp(world,7.9,0,-4.2,-Math.PI/2);
table(netG,3.2,1.2,0.9,0xFFE0A3,0x4A5FC1);
addSolid(7.9,-4.2,1.2,3.2);
var routerG=grp(netG,-0.85,0.9,0.05,0);
routerG.scale.set(1.25,1.25,1.25);
box(routerG,0.9,0.14,0.55,L(0xFFFFFF),0,0.07,0);
box(routerG,0.92,0.04,0.2,L(0x3B82F6),0,0.12,0.15);
[-1,1].forEach(function(s){
  var a=cyl(routerG,0.025,0.025,0.55,L(0x2B3A67),s*0.38,0.4,-0.2,8);a.rotation.z=-s*0.15;
  sph(routerG,0.04,L(0x2B3A67),s*0.38-s*0.04,0.67,-0.2,8,6);
});
[0x35E08A,0x35E08A,0xFFB020,0x5EEAFF].forEach(function(c,i){
  var m=BM(c);box(routerG,0.06,0.035,0.02,m,-0.25+i*0.14,0.075,0.28);
  blinkers.push({m:m,on:c,off:0x23314F,ph:rnd()*6});
});
var switchG=grp(netG,0.7,0.9,0.05,0);
box(switchG,1.3,0.14,0.5,L(0x31406E),0,0.07,0);
for(var pi=0;pi<8;pi++){
  box(switchG,0.09,0.07,0.02,L(0x0F1633),-0.5+pi*0.143,0.05,0.255);
  var lm=BM(0x35E08A);box(switchG,0.035,0.022,0.02,lm,-0.5+pi*0.143,0.115,0.255);
  blinkers.push({m:lm,on:0x35E08A,off:0x1E5B3F,ph:rnd()*6});
}
tube(netG,[[0.28,0.99,0.32],[0.1,1.0,0.52],[-0.3,1.0,0.52],[-0.58,0.99,0.4]],0.018,0xFFC83D);

MK('shell');MK('printer');
/* printer */
var prtT=grp(world,7.9,0,0.2,-Math.PI/2);
table(prtT,2.0,1.2,0.9,0xFFE0A3,0x4A5FC1);
addSolid(7.9,0.2,1.2,2.0);
var printerG=grp(prtT,0,0.9,0,0);
box(printerG,1.2,0.5,0.85,L(0xF1F3FA),0,0.25,0);
box(printerG,1.2,0.06,0.85,L(0xC7CEE8),0,0.53,0);
box(printerG,0.9,0.08,0.02,L(0x2B3A67),0,0.22,0.43);
box(printerG,0.9,0.03,0.4,L(0x9AA6C9),0,0.1,0.62);
box(printerG,0.7,0.012,0.5,L(0xFFFFFF),0,0.13,0.64);
var pf=box(printerG,0.8,0.02,0.5,L(0xFFFFFF),0,0.78,-0.3);pf.rotation.x=0.6;
box(printerG,0.42,0.04,0.2,L(0x2B3A67),0.35,0.57,0.18);
[0x35E08A,0xFFC83D,0xFF6F59].forEach(function(c,i){cyl(printerG,0.03,0.03,0.03,L(c),0.25+i*0.1,0.6,0.18,10);});

MK('shell');MK('server');
/* server */
var srvG=grp(world,8.3,0,3.6,-Math.PI/2);
box(srvG,1.1,2.6,1.2,L(0x39456F),0,1.3,0);
for(var si=0;si<7;si++){
  box(srvG,0.96,0.28,0.04,L(0x4B5A8C),0,0.3+si*0.33,0.61);
  for(var li=0;li<3;li++){
    var cc=[0x35E08A,0x5EEAFF,0xFFB020][(si+li)%3];
    var sm=BM(cc);box(srvG,0.05,0.05,0.02,sm,-0.36+li*0.1,0.3+si*0.33,0.635);
    blinkers.push({m:sm,on:cc,off:0x1B2548,ph:rnd()*6});
  }
  box(srvG,0.4,0.03,0.02,L(0x2B3A67),0.2,0.3+si*0.33,0.635);
}
addSolid(8.3,3.6,1.2,1.1);

MK('shell');MK('cab');
/* lemari dan rak perangkat */
var cabG=grp(world,-8.45,0,-3.8,Math.PI/2);
box(cabG,2.8,2.4,0.9,L(0x6FA8FF),0,1.2,0);
[-1,1].forEach(function(s){
  box(cabG,1.3,2.2,0.04,L(0x9CC6FF),s*0.68,1.2,0.46);
  box(cabG,0.06,0.45,0.06,L(0xFFC83D),s*0.14,1.2,0.5);
});
addSolid(-8.45,-3.8,0.9,2.8);

MK('rack');
var rackG=grp(world,-8.55,0,0.2,Math.PI/2);
[-1,1].forEach(function(s){box(rackG,0.08,2.5,0.7,L(0xE0A82E),s*1.56,1.25,0);});
box(rackG,3.2,2.5,0.04,L(0xF2D79A),0,1.25,-0.34);
var itemCols=[0xD9A05B,0xFF6F59,0x14B8A6,0x7A5CFF,0xFFFFFF,0x3B82F6,0xFFC83D];
for(var lv=0;lv<4;lv++){
  var ly=0.05+lv*0.7;
  box(rackG,3.2,0.06,0.7,L(0xE0A82E),0,ly,0);
  var cx=-1.45;
  while(cx<1.3){
    var iw=0.3+rnd()*0.35, ih=0.22+rnd()*0.32;
    box(rackG,iw,ih,0.3+rnd()*0.25,L(itemCols[Math.floor(rnd()*itemCols.length)]),cx+iw/2,ly+0.03+ih/2,0.02);
    cx+=iw+0.08+rnd()*0.12;
  }
}
addSolid(-8.55,0.2,0.8,3.2);

MK('tech');
/* area teknisi */
var matT=canvasTex(512,332,function(x,w,h){
  x.fillStyle='#1B2559';x.fillRect(0,0,w,h);x.fillStyle='#FFC83D';
  for(var i=-h;i<w;i+=44){x.beginPath();x.moveTo(i,0);x.lineTo(i+22,0);x.lineTo(i+22+h,h);x.lineTo(i+h,h);x.fill();}
  x.fillStyle='#FFF0B8';x.fillRect(26,26,w-52,h-52);
  label(x,'AREA TEKNISI',w/2,h/2,50,'#1B2559');
});
plane(world,4,2.6,BM(0xFFFFFF,{map:matT.tex}),-6.5,0.012,4.5,-Math.PI/2,0);
var benchG=grp(world,-6.5,0,6.35,Math.PI);
table(benchG,2.8,1.0,0.95,0xC8A06A,0x6B7BDA);
addSolid(-6.5,6.35,2.8,1.0);
var tb=box(benchG,0.7,0.3,0.35,L(0xFF4D4D),-0.8,1.1,0);
box(benchG,0.72,0.06,0.37,L(0xC93030),-0.8,1.27,0);
var handle=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.025,6,12,Math.PI),L(0x2B3A67));handle.position.set(-0.8,1.28,0);benchG.add(handle);
cyl(benchG,0.04,0.04,0.2,L(0xFFC83D),0.3,1.0,0.1,8).rotation.z=Math.PI/2;
cyl(benchG,0.012,0.012,0.22,L(0xAAB4D4),0.5,1.0,0.1,6).rotation.z=Math.PI/2;
tube(benchG,[[0.7,0.97,-0.1],[0.9,0.97,0.1],[1.1,0.97,-0.05],[0.95,0.97,-0.2]],0.02,0x3B82F6);
var pegT=canvasTex(512,280,function(x,w,h){
  x.fillStyle='#E9D8B4';x.fillRect(0,0,w,h);
  x.fillStyle='rgba(120,90,50,.35)';
  for(var i=14;i<w;i+=28){for(var j=14;j<h;j+=28){x.beginPath();x.arc(i,j,3,0,6.3);x.fill();}}
  x.lineWidth=4;x.strokeStyle='#1B2559';
  x.fillStyle='#FF6F59';rr(x,60,50,34,150,12);x.fill();x.stroke();
  x.fillStyle='#3B82F6';rr(x,140,70,120,30,12);x.fill();x.stroke();rr(x,140,120,90,30,12);x.fill();x.stroke();
  x.fillStyle='#FFC83D';rr(x,300,50,40,160,14);x.fill();x.stroke();
  x.fillStyle='#14B8A6';rr(x,390,60,70,120,16);x.fill();x.stroke();
});
plane(world,2.6,1.42,BM(0xFFFFFF,{map:pegT.tex}),-6.5,2.0,6.96,0,Math.PI);

MK('shell');
function plant(x,z){
  var g=grp(world,x,0,z,0);
  cyl(g,0.32,0.24,0.5,L(0xFF8F5A),0,0.25,0,10);
  sph(g,0.38,L(0x3CCB7F),0,0.85,0,10,8);sph(g,0.28,L(0x28B56C),0.2,1.2,0.05,10,8);sph(g,0.26,L(0x4BDB92),-0.18,1.15,-0.05,10,8);
  addSolid(x,z,0.6,0.6);
}
MK('plants');plant(8.2,6.2);plant(-8.2,6.2);plant(-8.3,-6.3);MK('shell');

world.updateMatrixWorld(true);
