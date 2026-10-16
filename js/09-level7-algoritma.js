/* ============================================================
   09-level7-algoritma.js
   Level 7: Algoritma (robot dan blok perintah)
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 7: algoritma ---------- */
var AX0=1.4,AZ0=2.75,ACELL=0.75,ACOLS=3,AROWS=5,MAXB=10;
var ADIR=[[0,-1],[1,0],[0,1],[-1,0]], ARY=[Math.PI,Math.PI/2,0,-Math.PI/2];
var CMD={F:{n:'FORWARD',ic:'↑'},L:{n:'LEFT',ic:'←'},R:{n:'RIGHT',ic:'→'},B:{n:'BACK',ic:'↓'}};
var PUZ=[
  {start:[1,4],dir:0,goal:[2,2],obs:[],intro:'Puzzle 1: bantu robot sampai ke komputer. Robot menghadap ke atas. Contoh: FORWARD, FORWARD, RIGHT, FORWARD.'},
  {start:[1,4],dir:0,goal:[0,0],obs:[[1,2],[1,1],[2,0]],intro:'Puzzle 2: ada kardus yang menghalangi. Cari jalan memutar!'},
  {start:[2,1],dir:0,goal:[0,3],obs:[[1,1],[1,2],[1,3]],intro:'Puzzle 3: tembok kardus di tengah. Pakai LEFT, RIGHT, dan BACK dengan cerdik!'}
];
var algo={built:false,n:0,solved:[false,false,false],prog:[],run:null,fails:0,idle:0,opened:false,busy:false,ar:null,goalMat:null,obsG:[],bot:null};
function aX(c){return AX0+(c+0.5)*ACELL;}
function aZ(r){return AZ0+(r+0.5)*ACELL;}
function aBlocked(p,c,r){
  if(c<0||c>=ACOLS||r<0||r>=AROWS){return true;}
  for(var i=0;i<p.obs.length;i++){if(p.obs[i][0]===c&&p.obs[i][1]===r){return true;}}
  return false;
}
function aStep(p,st,cmd){
  var c=st.c,r=st.r,d=st.d;
  if(cmd==='L'){return {c:c,r:r,d:(d+3)%4};}
  if(cmd==='R'){return {c:c,r:r,d:(d+1)%4};}
  var dd=cmd==='F'?d:(d+2)%4;
  var nc=c+ADIR[dd][0],nr=r+ADIR[dd][1];
  if(aBlocked(p,nc,nr)){return null;}
  return {c:nc,r:nr,d:d};
}
function solvePuz(p){
  var q=[{c:p.start[0],r:p.start[1],d:p.dir,path:[]}],seen={};
  seen[p.start[0]+','+p.start[1]+','+p.dir]=1;
  while(q.length){
    var s0=q.shift();
    if(s0.c===p.goal[0]&&s0.r===p.goal[1]){return s0.path;}
    ['F','L','R','B'].forEach(function(cm){
      var n=aStep(p,s0,cm);if(!n){return;}
      var k=n.c+','+n.r+','+n.d;if(seen[k]){return;}seen[k]=1;
      q.push({c:n.c,r:n.r,d:n.d,path:s0.path.concat([cm])});
    });
  }
  return null;
}
function buildArena(){
  if(algo.built){return;}
  algo.built=true;
  var g=grp(world,0,0,0,0);
  for(var c=0;c<ACOLS;c++){for(var r=0;r<AROWS;r++){
    plane(g,ACELL-0.04,ACELL-0.04,BM((c+r)%2?0xCFEFFF:0xEAF8FF),aX(c),0.03,aZ(r),-Math.PI/2,0);
  }}
  var W=ACOLS*ACELL,H=AROWS*ACELL,cx=AX0+W/2,cz=AZ0+H/2;
  box(g,W+0.2,0.08,0.1,L(0x2B3A67),cx,0.04,AZ0-0.05);box(g,W+0.2,0.08,0.1,L(0x2B3A67),cx,0.04,AZ0+H+0.05);
  box(g,0.1,0.08,H,L(0x2B3A67),AX0-0.05,0.04,cz);box(g,0.1,0.08,H,L(0x2B3A67),AX0+W+0.05,0.04,cz);
  labelSprite(scene,'LAB ALGORITMA',cx,1.5,AZ0+0.1,1.7).visible=true;
  /* komputer tujuan */
  algo.goalG=grp(world,0,0,0,0);
  box(algo.goalG,0.5,0.05,0.35,L(0x2B3A67),0,0.03,0);
  box(algo.goalG,0.1,0.2,0.08,L(0x2B3A67),0,0.15,0);
  box(algo.goalG,0.46,0.34,0.05,L(0x2B3A67),0,0.42,0);
  algo.goalMat=BM(0x5EEAFF);
  box(algo.goalG,0.38,0.26,0.02,algo.goalMat,0,0.42,0.03);
  /* penanda start */
  var sr=new THREE.Mesh(new THREE.RingGeometry(0.2,0.3,20),BM(0xFFC83D,{transparent:true,opacity:0.95,side:THREE.DoubleSide}));
  sr.rotation.x=-Math.PI/2;sr.position.y=0.045;scene.add(sr);algo.startRing=sr;
  /* kardus penghalang */
  for(var i=0;i<4;i++){
    var o=grp(world,0,0,0,0);
    box(o,0.5,0.4,0.5,L(0xC98A4B),0,0.2,0);box(o,0.14,0.41,0.52,L(0xE8C48B),0,0.2,0);
    o.visible=false;algo.obsG.push(o);
  }
  /* robot kecil */
  var rb=new THREE.Group();
  box(rb,0.3,0.24,0.3,L(0xFF6F59),0,0.2,0);
  box(rb,0.26,0.22,0.24,L(0xFFFFFF),0,0.44,0);
  box(rb,0.18,0.09,0.03,L(0x1B2559),0,0.46,0.12);
  box(rb,0.04,0.05,0.02,BM(0x5EEAFF),-0.05,0.46,0.14);box(rb,0.04,0.05,0.02,BM(0x5EEAFF),0.05,0.46,0.14);
  cyl(rb,0.012,0.012,0.14,L(0x1B2559),0,0.62,0,6);sph(rb,0.035,BM(0xFFC83D),0,0.7,0,8,6);
  [-1,1].forEach(function(sg){cyl(rb,0.07,0.07,0.06,L(0x1B2559),sg*0.17,0.07,0,10).rotation.z=Math.PI/2;});
  rb.traverse(function(o){if(o.isMesh){o.castShadow=true;}});
  scene.add(rb);algo.bot=rb;
  /* konsol */
  var kg=grp(world,2.5,0,2.4,0);
  box(kg,1.0,0.08,0.55,L(0x4A5FC1),0,0.85,0);box(kg,0.08,0.85,0.5,L(0x2B3A67),-0.45,0.42,0);box(kg,0.08,0.85,0.5,L(0x2B3A67),0.45,0.42,0);
  box(kg,0.5,0.03,0.34,L(0x2B3A67),0,0.91,0.05);
  var lp=grp(kg,0,0.92,-0.1,0);box(lp,0.5,0.34,0.03,L(0x2B3A67),0,0.18,0);box(lp,0.44,0.28,0.02,BM(0x5EEAFF),0,0.18,0.02);
  var rec={id:'algo-console',isAlgo:true,group:kg,name:'Konsol Robot',type:'ALGORITMA',range:1.9,bias:1.5,active:false,pos:new THREE.Vector3(2.5,1.0,2.4),mats:collectMats(kg)};
  interactables.push(rec);algo.rec=rec;
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:warnTex.tex,transparent:true,depthTest:false}));
  sp.scale.set(0.55,0.55,0.55);sp.renderOrder=9;sp.position.set(2.5,1.9,2.4);scene.add(sp);algo.sprite=sp;
  algo.ar={c:0,r:0,d:0,x:0,z:0,ry:0,y:0};
}
function algoPlaceRobot(){
  var p=PUZ[algo.n], ar=algo.ar;
  ar.c=p.start[0];ar.r=p.start[1];ar.d=p.dir;ar.x=aX(ar.c);ar.z=aZ(ar.r);ar.ry=ARY[p.dir];ar.y=0.06;
}
function loadPuzzle(n){
  algo.n=n;algo.prog=[];algo.run=null;algo.fails=0;algo.busy=false;
  var p=PUZ[n];
  algo.goalG.position.set(aX(p.goal[0]),0.04,aZ(p.goal[1]));
  algo.startRing.position.set(aX(p.start[0]),0.045,aZ(p.start[1]));
  algo.obsG.forEach(function(o,i){
    var ob=p.obs[i];o.visible=!!ob;if(ob){o.position.set(aX(ob[0]),0.04,aZ(ob[1]));}
  });
  algoPlaceRobot();
  algo.goalMat.color.setHex(0x5EEAFF);
  algoRender();
}
function startLevel7(){
  var _m=snap();buildArena();claim('l7',_m);
  state.l7Active=true;state.level=7;updateStats();
  loadPuzzle(0);algo.rec.active=true;algo.sprite.visible=true;
  updateMission();
}
function algoRender(){
  var box=$('#a-prog');box.textContent='';
  for(var i=0;i<MAXB;i++){
    var b=document.createElement('button');b.type='button';
    var cm=algo.prog[i];
    b.className='aslot'+(cm?' f':'')+((algo.run&&algo.run.i===i)?' on':'');
    b.textContent=cm?(CMD[cm].ic+' '+CMD[cm].n):String(i+1);
    if(cm){b.setAttribute('data-c',cm);(function(k){b.addEventListener('click',function(){algoRemove(k);});})(i);}
    box.appendChild(b);
  }
  $('#a-title').textContent='PUZZLE '+(algo.n+1)+'/3';
  $('#a-goal').textContent='Bantu robot sampai ke komputer!';
  var dis=!!algo.busy;
  ['a-run','a-undo','a-clear'].forEach(function(id){$('#'+id).disabled=dis;});
  Array.prototype.forEach.call($('#a-pal').children,function(b){b.disabled=dis;});
}
function algoMsg(t,bad){var m=$('#a-msg');m.textContent=t;m.className='a-msg'+(bad?' bad':'');}
function algoAdd(cm){
  if(algo.busy||!state.algoOpen){return;}
  if(algo.prog.length>=MAXB){algoMsg('Slot penuh. Hapus satu blok dulu.',true);sfx.close();return;}
  algo.prog.push(cm);sfx.open();algoMsg('');algoRender();
}
function algoRemove(i){if(algo.busy){return;}algo.prog.splice(i,1);algoRender();}
function algoKey(e){
  var m={ArrowUp:'F',ArrowLeft:'L',ArrowRight:'R',ArrowDown:'B'};
  if(m[e.code]){algoAdd(m[e.code]);return true;}
  if(e.code==='Backspace'){if(!algo.busy){algo.prog.pop();algoRender();}return true;}
  if(e.code==='Enter'){algoRun();return true;}
  return false;
}
function algoLayout(on){
  var w=app.clientWidth||innerWidth,h=app.clientHeight||innerHeight,pnl=$('#algo');
  if(!on){camera.clearViewOffset();pnl.className='';return;}
  var side=w>=820&&w>h*1.05;
  pnl.className=side?'side':'';
  if(side){camera.setViewOffset(w,h,-Math.min(430,w*0.42)/2,0,w,h);}
  else{var ph=(+$('#algo .a-card').offsetHeight)||320;camera.setViewOffset(w,h,0,Math.round(ph/2),w,h);}
}
function openAlgo(){
  if(!state.l7Active||state.l7Done){return;}
  state.panelOpen=true;state.algoOpen=true;state.algoView=true;algo.opened=true;algo.idle=0;unlock();
  algoPlaceRobot();algo.run=null;algo.busy=false;
  algoMsg(PUZ[algo.n].intro);
  algoRender();
  app.classList.add('algo-on');$('#algo').hidden=false;algoLayout(true);
  $('#prompt').hidden=true;lastPrompt=null;sfx.open();
  say(PUZ[algo.n].intro);updateMission();
}
function closeAlgo(){
  state.panelOpen=false;state.algoOpen=false;state.algoView=false;
  $('#algo').hidden=true;app.classList.remove('algo-on');algoLayout(false);sfx.close();idleT=0;lastPrompt=null;
  algo.run=null;algo.busy=false;algoPlaceRobot();
}
function algoRun(){
  if(algo.busy||!state.algoOpen){return;}
  if(!algo.prog.length){algoMsg('Susun blok perintah dulu, ya!',true);sfx.close();return;}
  algoPlaceRobot();
  algo.busy=true;algo.run={i:-1,kind:null,t:0};
  algoMsg('Robot menjalankan algoritmamu...');algoRender();
}
function algoFail(msg){
  algo.fails++;sfx.close();
  if(algo.fails>=2){
    var sol=solvePuz(PUZ[algo.n]);
    if(sol){msg+=' Petunjuk: mulai dengan '+sol.slice(0,2).map(function(c){return CMD[c].n;}).join(', ')+'.';}
  }
  algoMsg(msg,true);say(msg);
  algo.run={i:-2,kind:'wait',t:0,after:'reset'};
  algoRender();
}
function algoSuccess(){
  var n=algo.n;
  algo.solved[n]=true;sfx.reward();addXP(30);
  algo.goalMat.color.setHex(0x7CF2B5);
  algo.run={i:-2,kind:'happy',t:0,after:'next'};
  var m='Algoritmamu berhasil!'+(n===0?' Algoritma adalah urutan langkah untuk menyelesaikan masalah.':'');
  algoMsg(m);say(m);
  updateMission();
}
function algoUpdate(dt,T){
  var ar=algo.ar, run=algo.run;
  if(run){
    run.t+=dt;
    if(run.kind==='wait'){
      if(run.t>1.3){algo.run=null;algo.busy=false;algoPlaceRobot();algoRender();}
    }else if(run.kind==='happy'){
      ar.y=0.06+Math.abs(Math.sin(run.t*7))*0.25;ar.ry+=dt*6;
      if(run.t>1.8){
        ar.y=0.06;
        if(algo.n<PUZ.length-1){closeAlgoSoft();loadPuzzle(algo.n+1);openAlgoNext();}
        else{closeAlgo();setTimeout(finishLevel7,300);}
      }
    }else{
      if(run.kind===null||run.t>=run.dur){
        if(run.kind){applyStep(run);}
        if(algo.run!==run){/* sudah diganti oleh hasil langkah */}
        else{
          run.i++;
          if(run.i>=algo.prog.length){algoFail('Robot belum sampai ke komputer. Periksa lagi urutan langkahmu!');}
          else{startStep(run);algoRender();}
        }
      }else{animStep(run);}
    }
  }
  algo.bot.position.set(ar.x,ar.y,ar.z);algo.bot.rotation.y=ar.ry;
  if(algo.sprite.visible){algo.sprite.position.y=1.9+(reduceMotion?0:Math.sin(T*3)*0.08);}
}
function closeAlgoSoft(){algo.run=null;algo.busy=false;}
function openAlgoNext(){
  algoMsg(PUZ[algo.n].intro);say(PUZ[algo.n].intro);algoRender();
}
function startStep(run){
  var cmd=algo.prog[run.i], ar=algo.ar, p=PUZ[algo.n];
  run.cmd=cmd;run.t=0;
  tone(330+run.i*40,0,0.1,'square',0.05);
  if(cmd==='L'||cmd==='R'){
    run.kind='turn';run.dur=0.45;run.ry0=ar.ry;run.ry1=ar.ry+(cmd==='L'?Math.PI/2:-Math.PI/2);
    run.d1=(ar.d+(cmd==='R'?1:3))%4;
  }else{
    var dd=cmd==='F'?ar.d:(ar.d+2)%4;
    var n=aStep(p,{c:ar.c,r:ar.r,d:ar.d},cmd);
    run.x0=ar.x;run.z0=ar.z;
    if(n){run.kind='move';run.dur=0.6;run.nc=n.c;run.nr=n.r;run.x1=aX(n.c);run.z1=aZ(n.r);}
    else{run.kind='bump';run.dur=0.5;run.x1=ar.x+ADIR[dd][0]*0.3;run.z1=ar.z+ADIR[dd][1]*0.3;}
  }
}
function animStep(run){
  var ar=algo.ar,k=Math.min(1,run.t/run.dur),e=k*k*(3-2*k);
  if(run.kind==='turn'){ar.ry=run.ry0+(run.ry1-run.ry0)*e;}
  else if(run.kind==='move'){ar.x=run.x0+(run.x1-run.x0)*e;ar.z=run.z0+(run.z1-run.z0)*e;ar.y=0.06+Math.sin(k*Math.PI)*0.06;}
  else if(run.kind==='bump'){var b=Math.sin(k*Math.PI);ar.x=run.x0+(run.x1-run.x0)*b;ar.z=run.z0+(run.z1-run.z0)*b;}
}
function applyStep(run){
  var ar=algo.ar,p=PUZ[algo.n];
  ar.y=0.06;
  if(run.kind==='turn'){ar.d=run.d1;ar.ry=ARY[ar.d];return;}
  if(run.kind==='move'){
    ar.c=run.nc;ar.r=run.nr;ar.x=aX(ar.c);ar.z=aZ(ar.r);
    if(ar.c===p.goal[0]&&ar.r===p.goal[1]){algoSuccess();}
    return;
  }
  if(run.kind==='bump'){ar.x=run.x0;ar.z=run.z0;algoFail('Ups, robot menabrak! Ada kardus atau tepi arena di depannya.');}
}
function finishLevel7(){
  state.l7Done=true;state.levelsDone[7]=true;
  algo.rec.active=false;algo.sprite.visible=false;
  addXP(100,1);sfx.reward();confetti();awardBadge('algo');updateMission();
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 7 · ALGORITMA</div><h2>MISSION COMPLETE</h2><p>Kamu menyusun algoritma untuk membantu robot sampai ke komputer!</p><div class="t-badge">🏆 Algorithm Master</div><p>+100 XP · ⭐ +1</p><p>🔓 Level 8: Misi Besar terbuka</p></div>';
  t.hidden=false;setTimeout(hideToast,7000);
  say('Hebat! Misi selesai!');
  openDoor(8);
}
function puzTags(){return PUZ.map(function(p,i){return {t:'Puzzle '+(i+1),ok:algo.solved[i],cur:false};});}
$('#a-pal').addEventListener('click',function(e){var b=e.target.closest?e.target.closest('button'):null;if(b&&b.getAttribute('data-c')){algoAdd(b.getAttribute('data-c'));}});
$('#a-run').addEventListener('click',algoRun);
$('#a-undo').addEventListener('click',function(){if(!algo.busy){algo.prog.pop();algoRender();}});
$('#a-clear').addEventListener('click',function(){if(!algo.busy){algo.prog=[];algoRender();}});
$('#a-close').addEventListener('click',closeAlgo);
