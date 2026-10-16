/* ============================================================
   15-cek-misi.js
   Tombol "Cek Misi": tujuan, instruksi, dan langkah tiap level
   ============================================================ */
'use strict';
var MISI_INFO={
  1:{n:'Mengenal Komputer',
    goal:'Mengenali 8 perangkat komputer dan tahu fungsinya.',
    why:'Sebelum merakit atau memperbaiki komputer, kamu harus tahu nama dan tugas tiap perangkatnya.',
    steps:['Dengarkan KOMP-BOT: ia menyebut satu perangkat yang harus dicari.','Ikuti panah dan petunjuk, lalu dekati perangkat bertanda ?.','Klik/sentuh perangkat itu atau tekan E untuk membaca fungsinya.','Ulangi sampai ke-8 perangkat dikenali (Keyboard, Mouse, Monitor, CPU, Speaker, Printer, Router, Switch).']},
  2:{n:'Merakit Komputer',
    goal:'Merakit komputer sampai bisa menyala.',
    why:'Komputer hanya bekerja bila komponennya terpasang dan kabelnya tersambung ke port yang benar.',
    steps:['Ambil Monitor, Keyboard, dan Mouse (bercincin hijau) dengan klik/E. Tas muat 3 benda.','Bawa ke Meja Rakit, lalu klik/E di bayangan tempat pemasangannya.','Klik/E di CPU untuk membuka port belakang.','Pilih kabel yang tepat: Power untuk listrik, HDMI untuk gambar ke monitor, USB untuk keyboard dan mouse.','Setelah semua terpasang, komputer menyala sendiri.']},
  3:{n:'Input, Proses, Output',
    goal:'Menaruh 6 perangkat di area INPUT, PROSES, atau OUTPUT yang benar.',
    why:'Input memasukkan data, Proses mengolahnya, Output menampilkan hasilnya. Ini cara kerja semua komputer.',
    steps:['Ambil perangkat bercincin ungu (tas muat 3, tekan Q untuk meletakkan).','Tanyakan pada diri sendiri: perangkat ini memasukkan data, mengolah, atau menampilkan hasil?','Bawa ke area yang sesuai, lalu klik/E di area itu.','Bila salah, perangkat kembali dan boleh dicoba lagi. Selesai setelah ke-6 perangkat benar.']},
  4:{n:'Teknisi Komputer',
    goal:'Menemukan penyebab dan memperbaiki 3 komputer yang rusak.',
    why:'Teknisi tidak menebak: ia memeriksa bagian satu per satu sampai menemukan sumber masalahnya.',
    steps:['Baca masalah yang disebut KOMP-BOT (misal monitor gelap).','Periksa bagian bertanda ? dengan klik/E. Kabel ada di belakang meja, jalan memutar.','Bagian yang rusak berubah jadi tanda !.','Dekati bagian bertanda !, lalu klik/E untuk memperbaikinya.','Ulangi sampai 3 kasus selesai.']},
  5:{n:'Jaringan Komputer',
    goal:'Menghubungkan PC ke Internet dengan 3 kabel LAN: PC → Switch → Router → Internet.',
    why:'Jaringan membuat komputer bisa bertukar data. PC tersambung ke Switch (membagi koneksi ke banyak komputer), Switch ke Router (menghubungkan ke jaringan lain), Router ke Internet.',
    steps:['Ambil kabel LAN bercincin biru dari lantai (klik/E).','Klik/E di port pertama, misalnya Port LAN di PC. Satu ujung kabel terpasang.','Bawa ujung satunya ke perangkat berikutnya (Switch), lalu klik/E di port-nya.','Ulangi dengan kabel lain: Switch → Router, lalu Router → Internet.','Bila urutan salah, kabel dilepas dan kamu boleh mencoba lagi. Layar jaringan berubah jadi CONNECTED saat selesai.']},
  6:{n:'Keamanan Komputer',
    goal:'Memilih tindakan yang aman di 4 situasi digital.',
    why:'Keamanan digital melindungi data dan komputer dari virus, penipuan, dan kebiasaan ceroboh.',
    steps:['Temukan 4 situasi bertanda !: satu flashdisk di lantai dan tiga komputer di lab.','Klik/E untuk membuka situasi itu.','Baca pertanyaannya, lalu pilih tindakan yang paling aman (tombol atau angka 1, 2, 3).','Bila salah, baca penjelasannya dan coba lagi.']},
  7:{n:'Algoritma',
    goal:'Menyusun urutan perintah agar robot sampai ke komputer di 3 puzzle.',
    why:'Algoritma adalah urutan langkah yang jelas untuk menyelesaikan masalah. Komputer hanya mengikuti langkah yang kita susun.',
    steps:['Dekati Konsol Robot bertanda ! di dekat arena, lalu klik/E.','Susun blok FORWARD, LEFT, RIGHT, BACK sesuai jalan robot.','Tekan RUN dan lihat robot berjalan.','Bila meleset, tekan Hapus atau Ulang lalu perbaiki urutannya.','Selesaikan 3 puzzle.']},
  8:{n:'Misi Besar',
    goal:'Menyelesaikan 6 tugas lab lalu menyalakan seluruh laboratorium.',
    why:'Di sini semua yang sudah kamu pelajari dipakai bersama: merakit, jaringan, dan mencetak hasil kerja.',
    steps:['Pasang Monitor, Keyboard, dan Mouse di komputer meja belakang kanan.','Perbaiki jaringan dengan kabel LAN biru dan sambungkan printer dengan Kabel Printer (bercincin oranye).','Klik/E di komputer untuk menyalakannya.','Buka program LAPORAN dan jalankan.','Kirim hasilnya ke printer di sisi kanan lab. Seluruh lab akan menyala.']}
};
function curMisiLevel(){
  return state.l8Active?8:state.l7Active?7:state.l6Active?6:state.l5Active?5:state.l4Active?4:state.l2Done?3:state.stageDone?2:1;
}
function openBrief(){
  if(state.panelOpen||state.mode!=='play'){return;}
  var lv=curMisiLevel(), m=MISI_INFO[lv], now=$('#m-text').textContent;
  $('#brief-h').textContent='Level '+lv+' · '+m.n;
  $('#brief-goal').textContent=m.goal;
  $('#brief-why').textContent=m.why;
  $('#brief-now').textContent=now||'Ikuti petunjuk KOMP-BOT.';
  var ol=$('#brief-steps');ol.textContent='';
  m.steps.forEach(function(s){var li=document.createElement('li');li.textContent=s;ol.appendChild(li);});
  state.panelOpen=true;state.briefOpen=true;unlock();
  $('#brief').hidden=false;$('#prompt').hidden=true;lastPrompt=null;sfx.open();
}
function closeBrief(){
  state.panelOpen=false;state.briefOpen=false;$('#brief').hidden=true;sfx.close();idleT=0;
}
$('#brief-btn').addEventListener('click',function(){if(state.briefOpen){closeBrief();}else{openBrief();}});
$('#brief-close').addEventListener('click',closeBrief);
$('#brief').addEventListener('click',function(e){if(e.target===this){closeBrief();}});
window.addEventListener('keydown',function(e){
  if(state.mode!=='play'||e.repeat){return;}
  if(e.code==='KeyM'||(e.key||'').toLowerCase()==='m'){if(state.briefOpen){closeBrief();}else{openBrief();}}
  else if(state.briefOpen&&(e.code==='Escape'||e.code==='KeyE'||e.code==='Enter')){closeBrief();}
});
