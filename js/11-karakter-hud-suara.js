/* ============================================================
   11-karakter-hud-suara.js
   Karakter, KOMP-BOT, state, HUD, dialog, efek bunyi
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

closeMarks();
/* ---------- karakter dan KOMP-BOT ---------- */
function buildKid(gender){
  var girl=gender==='girl';
  var skin=0xFFD3AE, shirt=girl?0xFF6F9C:0x14B8A6, bottom=girl?0x7A5CFF:0x2B3A8F, hairC=girl?0x4B2E1B:0x2B1A10, bagC=girl?0xFFC83D:0xFF6F59;
  var root=new THREE.Group(), legs=[], arms=[];
  [-1,1].forEach(function(s){
    var p=new THREE.Group();p.position.set(s*0.14,0.58,0);root.add(p);
    if(girl){cyl(p,0.075,0.065,0.44,L(skin),0,-0.28,0,10);cyl(p,0.08,0.08,0.1,L(0xFFFFFF),0,-0.43,0,10);}
    else{cyl(p,0.1,0.09,0.5,L(bottom),0,-0.28,0,10);}
    box(p,0.18,0.1,0.28,L(girl?0xFF4D6D:0xFFFFFF),0,-0.53,0.04);
    legs.push(p);
  });
  cyl(root,0.24,0.27,0.55,L(shirt),0,0.85,0,12);
  if(girl){cyl(root,0.27,0.4,0.26,L(bottom),0,0.62,0,14);}
  else{cyl(root,0.275,0.275,0.06,L(0x1B2559),0,0.6,0,12);}
  [-1,1].forEach(function(s){
    var p=new THREE.Group();p.position.set(s*0.34,1.06,0);root.add(p);
    cyl(p,0.08,0.075,0.2,L(shirt),0,-0.1,0,10);
    cyl(p,0.065,0.06,0.26,L(skin),0,-0.31,0,10);
    sph(p,0.075,L(skin),0,-0.47,0,10,8);
    arms.push(p);
  });
  sph(root,0.34,L(skin),0,1.46,0,16,12);
  sph(root,0.06,L(skin),-0.34,1.46,0,8,6);sph(root,0.06,L(skin),0.34,1.46,0,8,6);
  var hair=new THREE.Mesh(new THREE.SphereGeometry(0.365,16,10,0,Math.PI*2,0,1.85),L(hairC));
  hair.position.set(0,1.49,-0.03);hair.rotation.x=-0.6;hair.castShadow=true;root.add(hair);
  if(girl){
    [-1,1].forEach(function(s){
      sph(root,0.13,L(hairC),s*0.37,1.3,-0.06,10,8);
      sph(root,0.055,L(0xFFC83D),s*0.33,1.44,-0.05,8,6);
    });
  }else{
    sph(root,0.1,L(hairC),0.08,1.8,0.1,8,6);
  }
  [-1,1].forEach(function(s){sph(root,0.05,BM(0x1B2559),s*0.12,1.45,0.3,8,6);});
  var smile=new THREE.Mesh(new THREE.TorusGeometry(0.08,0.014,6,12,Math.PI),BM(0x1B2559));
  smile.position.set(0,1.375,0.325);smile.rotation.z=Math.PI;root.add(smile);
  [-1,1].forEach(function(s){var ch=new THREE.Mesh(new THREE.CircleGeometry(0.045,10),BM(0xFF8FA3,{transparent:true,opacity:0.65}));ch.position.set(s*0.2,1.39,0.285);root.add(ch);});
  var bag=grp(root,0,0.88,-0.3,0);
  box(bag,0.42,0.52,0.16,L(bagC),0,0,0);
  box(bag,0.3,0.2,0.05,L(0xFFFFFF),0,-0.1,-0.1);
  /* titik pegang: di depan perut, di antara kedua tangan yang terangkat ke depan */
  var hold=grp(root,0,0.8,0.36,0);
  root.traverse(function(o){if(o.isMesh){o.castShadow=true;}});
  return {root:root,legs:legs,arms:arms,hold:hold};
}
function buildBot(){
  var r=new THREE.Group(), white=0xF4F8FF, blue=0x3B82F6;
  cyl(r,0.2,0.26,0.34,L(white),0,0,0,14);
  sph(r,0.06,BM(0x5EEAFF),0,0.03,0.22,8,6);
  var head=sph(r,0.27,L(white),0,0.4,0,16,12);head.scale.set(1,0.85,1);
  box(r,0.38,0.22,0.06,L(0x1B2559),0,0.42,0.22);
  box(r,0.07,0.1,0.02,BM(0x5EEAFF),-0.09,0.43,0.255);
  box(r,0.07,0.1,0.02,BM(0x5EEAFF),0.09,0.43,0.255);
  cyl(r,0.015,0.015,0.2,L(0x1B2559),0,0.72,0,6);
  sph(r,0.05,BM(0xFFC83D),0,0.84,0,8,6);
  [-1,1].forEach(function(s){
    cyl(r,0.06,0.06,0.08,L(blue),s*0.27,0.4,0,10).rotation.z=Math.PI/2;
    box(r,0.07,0.22,0.07,L(white),s*0.3,0.03,0);
    sph(r,0.05,L(blue),s*0.3,-0.1,0,8,6);
  });
  var th=cyl(r,0.1,0.02,0.14,BM(0xFF9F1C),0,-0.24,0,10);th.castShadow=false;
  r.traverse(function(o){if(o.isMesh){o.castShadow=true;}});
  return r;
}

/* ---------- state ---------- */
var state={mode:'menu',gender:'boy',xp:0,stars:0,level:1,checked:{},nChecked:0,panelOpen:false,sound:true,current:null,stageDone:false,pendingFinish:false,justFound:false,openedAtTut:3,badges:{},nBadges:0,levelsDone:{},ch:null,chDoneIds:{},chDone:0,chStarted:false,hintOn:false,wrongN:0,res:null,progOpen:false,briefOpen:false};
var chT=0;
state.inv=[null,null,null];state.sel=0;state.placed=0;state.trainDone=false;state.itemHint=false;state.pickN=0;
state.l2Active=false;state.l2Done=false;state.l2n=0;state.l2in={};state.portOpen=false;state.portWrong=0;
state.l3Active=false;state.l3Done=false;state.l3n=0;
state.l4Active=false;state.l4Done=false;state.l4n=0;
state.l5Active=false;state.l5Done=false;
state.l6Active=false;state.l6Done=false;state.choiceOpen=false;
state.l7Active=false;state.l7Done=false;state.algoOpen=false;state.algoView=false;
state.l8Active=false;state.l8Done=false;
state.finalOpen=false;state.doorTo=0;state.area=1;state.transition=false;
var SPAWN=new THREE.Vector3(0,0,4.6);
var pos=SPAWN.clone(), vel=new THREE.Vector3();
var yaw=0, pitch=0.42, camDist=4.6, kidFace=Math.PI, phase=0, armWave=1, holdBlend=0;
var kid=null, bot=buildBot();
scene.add(bot);
bot.position.set(1.3,1.9,4.2);
function setKid(g){
  if(kid){scene.remove(kid.root);}
  state.gender=g;kid=buildKid(g);scene.add(kid.root);
  kid.root.position.copy(pos);
}
setKid('boy');

/* ---------- HUD ---------- */
function popEl(el){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
function updateStats(){$('#lvl').textContent=state.level;$('#xp').textContent=state.xp;$('#stars').textContent=state.stars;}
function updateMission(){
  var lab=$('#m-label'), tx=$('#m-text'), cap=$('#m-cap'), ul=$('#objs'), rows=[], tot=CHALLENGES.length;
  var l2c=['monitor','keyboard','mouse'].filter(function(k){return state.l2in[k];}).length;
  var l2k=['power','hdmi','usbcable'].filter(function(k){return state.l2in[k];}).length;
  if(state.l8Done){
    lab.textContent='MISI BESAR SELESAI';tx.textContent='SYSTEM ONLINE! Seluruh laboratorium menyala.';
    rows=[{t:'Selesaikan 6 tugas lab',n:6,tot:6,tags:l8Tags()},{t:'Nyalakan seluruh lab',n:1,tot:1}];
    cap.textContent='Kamu Junior Computer Engineer!';
  }else if(state.l8Active){
    lab.textContent='MISI BESAR · LEVEL 8';
    tx.textContent=l8Next();
    rows=[{t:'Selesaikan 6 tugas lab',n:L8.sCount(),tot:6,tags:l8Tags()},{t:'Nyalakan seluruh lab',n:0,tot:1}];
    cap.textContent='Cari benda bercincin oranye dan kabel LAN biru.';
  }else if(state.l7Done){
    lab.textContent='LEVEL 7 SELESAI';tx.textContent='Pintu ke ruang berikutnya terbuka!';
    rows=[{t:'Buka Konsol Robot',n:1,tot:1},{t:'Selesaikan 3 puzzle',n:3,tot:3,tags:puzTags()}];
    cap.textContent='Algoritma = urutan langkah menyelesaikan masalah.';
  }else if(state.l7Active){
    lab.textContent='MISI LEVEL 7 · ALGORITMA';
    tx.textContent='Susun blok FORWARD, LEFT, RIGHT, BACK agar robot sampai ke komputer.';
    rows=[{t:'Buka Konsol Robot',n:algo.opened?1:0,tot:1},{t:'Selesaikan 3 puzzle',n:algo.solved.filter(Boolean).length,tot:3,tags:puzTags()}];
    cap.textContent='Dekati konsol bertanda !, susun langkah, lalu tekan RUN.';
  }else if(state.l6Done){
    lab.textContent='LEVEL 6 SELESAI';tx.textContent='Pintu ke ruang berikutnya terbuka!';
    rows=[{t:'Temukan 4 situasi',n:4,tot:4},{t:'Pilih tindakan yang aman',n:4,tot:4,tags:sitTags()}];
    cap.textContent='Kamu jadi pahlawan keamanan digital!';
  }else if(state.l6Active){
    lab.textContent='MISI LEVEL 6 · KEAMANAN DIGITAL';
    tx.textContent='Temukan 4 situasi bertanda !, lalu pilih tindakan yang aman.';
    rows=[{t:'Temukan 4 situasi',n:sec.nSeen,tot:4},{t:'Pilih tindakan yang aman',n:sec.nSolved,tot:4,tags:sitTags()}];
    cap.textContent='Satu flashdisk di lantai dan tiga komputer.';
  }else if(state.l5Done){
    lab.textContent='LEVEL 5 SELESAI';tx.textContent='Pintu ke ruang berikutnya terbuka!';
    rows=[{t:'Ambil 3 kabel LAN',n:3,tot:3},{t:'Hubungkan PC sampai Internet',n:3,tot:3,tags:linkTags()}];
    cap.textContent='Kamu paham cara kerja jaringan sederhana!';
  }else if(state.l5Active){
    var l5g=l5items.filter(function(i){return i.got;}).length;
    lab.textContent='MISI LEVEL 5 · JARINGAN KOMPUTER';
    tx.textContent='Ambil kabel LAN bercincin biru, lalu hubungkan PC → Switch → Router → Internet.';
    rows=[{t:'Ambil 3 kabel LAN',n:l5g,tot:3},{t:'Hubungkan PC sampai Internet',n:nw.nLinks,tot:3,tags:linkTags()}];
    cap.textContent='Colokkan satu ujung, lalu bawa ujung satunya ke perangkat berikutnya.';
  }else if(state.l4Done){
    lab.textContent='LEVEL 4 SELESAI';tx.textContent='Pintu ke ruang berikutnya terbuka!';
    rows=[{t:'Selesaikan 3 kasus',n:3,tot:3,tags:caseTags()},{t:'Cari penyebab dan perbaiki',n:1,tot:1}];
    cap.textContent='Kamu sudah jadi teknisi komputer!';
  }else if(state.l4Active){
    var c4=CASES[svc.n];
    lab.textContent='MISI LEVEL 4 · TEKNISI KOMPUTER';
    tx.textContent=svc.fixed?'Komputer sedang diperbaiki...':(svc.found?'Masalah ditemukan! Dekati bagian bertanda ! lalu perbaiki.':'Kasus '+(svc.n+1)+': '+c4.title+'. Periksa bagian bertanda ?');
    rows=[{t:'Selesaikan 3 kasus',n:state.l4n,tot:3,tags:caseTags()},{t:'Cari penyebab dan perbaiki',n:svc.fixed?1:0,tot:1,tags:pointTags()}];
    cap.textContent='Periksa satu per satu. Bagian yang rusak bertanda !';
  }else if(state.l3Done){
    lab.textContent='LEVEL 3 SELESAI';tx.textContent='Pintu ke ruang berikutnya terbuka!';
    rows=[{t:'Temukan 6 perangkat',n:6,tot:6},{t:'Taruh di area yang benar',sub:'INPUT · PROSES · OUTPUT',n:6,tot:6}];
    cap.textContent='Kamu paham input, proses, dan output!';
  }else if(state.l2Done){
    var l3f=l3items.filter(function(i){return i.got;}).length;
    lab.textContent='MISI LEVEL 3 · INPUT, PROSES, OUTPUT';
    tx.textContent='Ambil perangkat bercincin ungu, lalu bawa ke area yang benar.';
    rows=[{t:'Temukan 6 perangkat',n:l3f,tot:6},{t:'Taruh di area yang benar',sub:'INPUT · PROSES · OUTPUT',n:state.l3n,tot:6}];
    cap.textContent='Tas muat 3 benda. Tekan Q untuk meletakkan.';
  }else if(state.stageDone){
    lab.textContent='MISI LEVEL 2 · MERAKIT KOMPUTER';
    tx.textContent=l2c<3?'Ambil komponen bercincin hijau, lalu pasang di Meja Rakit.':(l2k<3?'Sekarang pasang kabel di port belakang CPU.':'Komputer sedang menyala...');
    rows=[{t:'Pasang komponen di meja',sub:'Monitor, Keyboard, Mouse',n:l2c,tot:3},{t:'Pasang kabel di port CPU',sub:'Power, HDMI, USB',n:l2k,tot:3}];
    cap.textContent='Setelah semua terpasang, komputer menyala!';
  }else{
    lab.textContent='MISI LEVEL 1 · MENGENAL KOMPUTER';
    if(state.ch){tx.textContent='Sekarang: temukan '+state.ch.name+'!';}
    else if(state.nChecked>=COUNT){tx.textContent='Semua perangkat sudah dikenal!';}
    else{tx.textContent='Dekati perangkat bertanda ? lalu tekan E.';}
    rows=[{t:'Kenali dan cari 8 perangkat',n:state.nChecked,tot:COUNT,chips:true}];
    cap.textContent='Ikuti panah dan cari perangkat yang diminta KOMP-BOT.';
  }
  ul.textContent='';
  rows.forEach(function(r){
    var li=document.createElement('li'), done=r.n>=r.tot;
    li.className='obj'+(done?' done':'');
    var ck=document.createElement('span');ck.className='ck';ck.textContent=done?'✓':'';
    var ot=document.createElement('div');ot.className='ot';
    var tt=document.createElement('span');tt.textContent=r.t;ot.appendChild(tt);
    if(r.chips){
      var sm=document.createElement('small');
      CHALLENGES.forEach(function(c){
        var sp=document.createElement('span');
        sp.className='cn'+(state.checked[c.id]?' ok':'')+((state.ch&&state.ch.id===c.id)?' cur':'');
        sp.textContent=(state.checked[c.id]?'✓ ':'')+c.name;sm.appendChild(sp);
      });
      ot.appendChild(sm);
    }else if(r.tags){
      var sm3=document.createElement('small');
      r.tags.forEach(function(tg){var sp3=document.createElement('span');sp3.className='cn'+(tg.ok?' ok':'')+(tg.cur?' cur':'');sp3.textContent=(tg.ok?'✓ ':'')+tg.t;sm3.appendChild(sp3);});
      ot.appendChild(sm3);
    }else if(r.sub){var sm2=document.createElement('small');sm2.textContent=r.sub;ot.appendChild(sm2);}
    var cnt=document.createElement('b');cnt.className='on';cnt.textContent=r.n+'/'+r.tot;
    li.appendChild(ck);li.appendChild(ot);li.appendChild(cnt);ul.appendChild(li);
  });
  updateGoal();
}
function floatText(t){var d=document.createElement('div');d.className='float';d.textContent=t;$('#fx').appendChild(d);setTimeout(function(){d.remove();},1400);}
function addXP(n,stars){
  state.xp+=n;if(stars){state.stars+=stars;}
  updateStats();popEl($('#xp-pill'));if(stars){popEl($('#star-pill'));}
  floatText('+'+n+' XP');
}

/* dialog KOMP-BOT */
var typeTimer=null, hideTimer=null;
function say(text,sticky){
  var box=$('#bot-dialog'), el=$('#bot-text');
  box.classList.remove('show');void box.offsetWidth;box.classList.add('show');
  clearInterval(typeTimer);clearTimeout(hideTimer);tone(988,0,0.08,'sine',0.07);tone(1319,0.08,0.11,'sine',0.07);
  var i=0;el.textContent='';
  typeTimer=setInterval(function(){i+=2;el.textContent=text.slice(0,i);if(i>=text.length){clearInterval(typeTimer);}},18);
  if(!sticky){hideTimer=setTimeout(function(){box.classList.remove('show');},5200+text.length*70);}
}

/* suara */
var ac=null;
function audio(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}return ac;}
function tone(f,t0,d,type,v){
  var a=audio();if(!a||!state.sound){return;}
  var o=a.createOscillator(), g=a.createGain(), t=a.currentTime+t0;
  o.type=type||'triangle';o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v||0.12,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
  o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+0.05);
}
var sfx={
  open:function(){tone(660,0,0.12);tone(880,0.08,0.14);},
  close:function(){tone(520,0,0.1);},
  reward:function(){[523,659,784,1047].forEach(function(f,i){tone(f,i*0.09,0.22);});}
};
$('#snd').addEventListener('click',function(){
  state.sound=!state.sound;this.textContent=state.sound?'🔊':'🔇';this.setAttribute('aria-pressed',String(state.sound));
});
