/* ============================================================
   12-level1-panel-badge.js
   Level 1 (tantangan), badge, panel perangkat, layar akhir
   (dimuat berurutan oleh index.html; berbagi satu ruang nama global)
   ============================================================ */
'use strict';

/* ---------- level 1: tantangan, badge, kemajuan ---------- */
var CHALLENGES=[
  {id:'keyboard',name:'Keyboard',badge:'keyboard',ok:'Betul! Keyboard dipakai untuk mengetik.',hint:'Petunjuk: alat untuk mengetik, ada di depan monitor.'},
  {id:'mouse',name:'Mouse',badge:'mouse',ok:'Betul! Mouse dipakai untuk menggerakkan pointer.',hint:'Petunjuk: perangkat kecil di dekat keyboard.'},
  {id:'monitor',name:'Monitor',ok:'Betul! Monitor menampilkan gambar.',hint:'Petunjuk: layar besar yang menampilkan gambar.'},
  {id:'cpu',name:'CPU',ok:'Betul! CPU adalah otak komputer.',hint:'Petunjuk: kotak biru di samping monitor.'},
  {id:'speaker',name:'Speaker',ok:'Betul! Speaker mengeluarkan suara.',hint:'Petunjuk: kotak merah kecil di dekat monitor.'},
  {id:'printer',name:'Printer',ok:'Betul! Printer mencetak ke kertas.',hint:'Petunjuk: mesin besar di meja sisi kanan lab.'},
  {id:'router',name:'Router',ok:'Betul! Router menghubungkan jaringan.',hint:'Petunjuk: perangkat berantena di meja JARINGAN.'},
  {id:'switch',name:'Switch',ok:'Betul! Switch menghubungkan banyak komputer.',hint:'Petunjuk: kotak datar berlampu di meja JARINGAN.'}
];
var LEVELS=['Mengenal Komputer','Merakit Komputer','Input, Proses, Output','Teknisi Komputer','Jaringan Komputer','Keamanan Komputer','Algoritma','Misi Besar'];
var BADGES=[
  {id:'explorer',name:'Computer Explorer',how:'Selesaikan Level 1'},
  {id:'mouse',name:'Mouse Master',how:'Temukan Mouse di Level 1'},
  {id:'keyboard',name:'Keyboard Master',how:'Temukan Keyboard di Level 1'},
  {id:'tech',name:'Junior Technician',how:'Selesaikan Level 4'},
  {id:'net',name:'Network Explorer',how:'Selesaikan Level 5'},
  {id:'safe',name:'Cyber Safety Hero',how:'Selesaikan Level 6'},
  {id:'algo',name:'Algorithm Master',how:'Selesaikan Level 7'},
  {id:'eng',name:'Junior Computer Engineer',how:'Selesaikan Level 8'}
];
function unlock(){try{if(document.pointerLockElement){document.exitPointerLock();}}catch(e){}}
function pickChallenge(excl){
  var pool=CHALLENGES.filter(function(c){return !state.chDoneIds[c.id]&&!state.checked[c.id];});
  if(!pool.length){return null;}
  var alt=pool.filter(function(c){return c.id!==excl;});
  return (alt.length?alt:pool)[0];
}
function startChallenge(prefix,excl){
  var c=pickChallenge(excl);
  if(!c){return false;}
  state.ch=c;state.chStarted=true;state.hintOn=false;state.wrongN=0;chT=0;
  updateMission();
  say((prefix||'')+'Yuk, cari '+c.name+'!');
  return true;
}
function awardBadge(id){
  if(state.badges[id]){return;}
  state.badges[id]=true;state.nBadges++;
  $('#nbadge').textContent=state.nBadges;popEl($('#badge-pill'));
  var b=BADGES.filter(function(x){return x.id===id;})[0];
  var d=document.createElement('div');d.className='bpop';d.textContent='🏆 Badge baru: '+b.name;
  app.appendChild(d);setTimeout(function(){d.remove();},3700);
}
function chip(cls,no,title,sub){
  var li=document.createElement('li');li.className='chip '+cls;
  var n=document.createElement('span');n.className='no';n.textContent=no;
  var w=document.createElement('div');
  var b=document.createElement('b');b.textContent=title;
  var sm=document.createElement('small');sm.textContent=sub;
  w.appendChild(b);w.appendChild(sm);li.appendChild(n);li.appendChild(w);
  return li;
}
function buildProg(){
  var lv=$('#prog-levels'), bd=$('#prog-badges');lv.textContent='';bd.textContent='';
  LEVELS.forEach(function(name,i){
    var no=i+1, done=!!state.levelsDone[no], open=no===1||!!state.levelsDone[no-1];
    var cls=done?'done':(open?'open':'lock');
    var sub=done?'Selesai ✓':(open?(no<=8?'Sedang dimainkan':'Terbuka · segera hadir'):'🔒 Terkunci');
    lv.appendChild(chip(cls,String(no),name,sub));
  });
  BADGES.forEach(function(b){
    var got=!!state.badges[b.id];
    bd.appendChild(chip(got?'done':'lock',got?'🏆':'🔒',b.name,got?'Sudah didapat':b.how));
  });
}
function openProg(){
  if(state.panelOpen||state.mode!=='play'){return;}
  buildProg();state.panelOpen=true;state.progOpen=true;unlock();
  $('#prog').hidden=false;$('#prompt').hidden=true;lastPrompt=null;sfx.open();
}
function closeProg(){
  state.panelOpen=false;state.progOpen=false;$('#prog').hidden=true;sfx.close();idleT=0;
}

/* ---------- panel dan interaksi ---------- */
var tut={step:0};
function openPanel(o){
  state.panelOpen=true;state.current=o;state.openedAtTut=tut.step;
  if(tut.step<3){tut.step=3;}
  state.justFound=false;state.res=null;
  unlock();
  $('#p-tag').textContent=o.type;
  $('#p-name').textContent=o.name;
  $('#p-desc').textContent=o.id==='door'?(state.area===1?'Pintu terkunci. Kenali semua perangkat dulu!':'Pintu terkunci. Selesaikan misi di ruang ini dulu!'):o.desc;
  $('#p-fact').textContent=o.fact;
  var lines=[];
  if(o.counted&&!state.checked[o.id]){
    state.checked[o.id]=true;state.nChecked++;state.justFound=true;
    addXP(10);sfx.reward();
    lines.push('Perangkat baru ditemukan! +10 XP');
  }else{sfx.open();}
  var c=state.ch;
  if(c&&o.counted){
    if(o.id===c.id){
      state.res={correct:true,c:c};
      state.ch=null;state.chDoneIds[c.id]=true;state.chDone++;
      lines.push('Tantangan benar! +10 XP ⭐');
      setTimeout(function(){addXP(10,1);sfx.reward();},600);
      if(c.badge){awardBadge(c.badge);}
    }else{
      state.wrongN++;state.res={wrong:true,c:c};
      lines.push('Hebat! Sekarang cari '+c.name+'.');
    }
  }
  if(state.nChecked===COUNT&&!state.stageDone){state.pendingFinish=true;}
  updateMission();
  var nw=$('#p-new');nw.textContent='';
  lines.forEach(function(t){var d=document.createElement('div');d.textContent=t;nw.appendChild(d);});
  nw.className='p-new';
  nw.hidden=!lines.length;
  $('#panel').hidden=false;
  $('#prompt').hidden=true;
}
function closePanel(){
  if(!state.panelOpen){return;}
  if(state.progOpen){closeProg();return;}
  if(state.briefOpen){closeBrief();return;}
  if(state.finalOpen){hideFinal();return;}
  if(state.algoOpen){closeAlgo();return;}
  if(state.choiceOpen){closeChoice();return;}
  if(state.portOpen){closePort();return;}
  state.panelOpen=false;$('#panel').hidden=true;sfx.close();
  var o=state.current;state.current=null;idleT=0;
  var res=state.res;state.res=null;
  var tutorial=state.openedAtTut<3;
  var found=state.justFound;state.justFound=false;
  var done=state.pendingFinish;state.pendingFinish=false;
  if(res&&res.correct){
    if(!startChallenge(res.c.ok+' ',res.c.id)&&!done){say(res.c.ok);}
  }else if(res&&res.wrong){
    var w='Itu '+o.name.split(' /')[0]+'. Sekarang kita cari '+res.c.name+', yuk!';
    if(state.wrongN>=2){state.hintOn=true;w+=' '+res.c.hint;}
    say(w);
  }else if(o&&o.counted){
    if(!state.chStarted){startChallenge((tutorial?'Hebat! ':'')+o.bot+' ',o.id);}
    else if(!done){
      var left=COUNT-state.nChecked;
      say(o.bot+(found&&left>0?' Tinggal '+left+' perangkat lagi!':''));
    }
  }else if(o&&tutorial){
    say('Hebat! Sekarang cari perangkat bertanda ?.');
  }
  if(done){setTimeout(finishStage,450);}
}
function confetti(){
  if(reduceMotion){return;}
  var cols=['#FFC83D','#14B8A6','#FF6F59','#7A5CFF','#FF8FB5'];
  for(var i=0;i<36;i++){
    var c=document.createElement('div');c.className='confetti';
    c.style.left=Math.random()*100+'%';c.style.background=cols[i%cols.length];
    c.style.animationDuration=(2+Math.random()*2)+'s';c.style.animationDelay=(Math.random()*0.6)+'s';
    app.appendChild(c);setTimeout((function(el){return function(){el.remove();};})(c),4800);
  }
}
function finishStage(){
  state.stageDone=true;state.levelsDone[1]=true;
  addXP(100,1);updateMission();sfx.reward();confetti();
  awardBadge('explorer');
  var t=$('#toast');
  t.innerHTML='<div class="t-card card"><div class="t-k">LEVEL 1 · MENGENAL KOMPUTER</div><h2>MISSION COMPLETE</h2><p>Semua perangkat dikenali dan semua tantangan selesai!</p><div class="t-badge">🏆 Computer Explorer</div><p>+100 XP · ⭐ +1</p><p>🔓 Level 2: Merakit Komputer terbuka</p></div>';
  t.hidden=false;
  setTimeout(hideToast,7000);
  say('Hebat! Misi selesai!');
  openDoor(2);
}
