# Computer Adventure: Misi di Laboratorium Komputer

Game edukasi 3D (Three.js) untuk anak SD. Tidak perlu build atau npm.

## Cara menjalankan
1. Buka folder ini di VS Code.
2. Pasang ekstensi **Live Server**, klik kanan `index.html` > **Open with Live Server**
   (atau klik dua kali `index.html`).
3. Komputer harus online (Three.js r128 dan font dimuat dari internet).

## Struktur
```
index.html                  <- kerangka halaman (menu, HUD, panel). Hanya HTML.
css/
  01-dasar.css              <- warna, font, reset
  02-hud.css                <- HUD, bubble KOMP-BOT, tombol E, panel perangkat, efek
  03-kontrol-dan-menu.css   <- kontrol sentuh, menu awal
  04-misi-dan-panel-level.css <- kartu misi, tas, panel Level 4-8, layar akhir
  05-layar-kecil.css        <- tampilan HP / layar kecil
js/                         <- dimuat berurutan oleh index.html (URUTAN PENTING)
  01-dasar.js               <- renderer, scene, kamera, helper bentuk, tekstur kanvas
  02-dunia.js               <- lantai, dinding, meja, jaringan, printer, server, ruang (layer)
  03-perangkat-dan-tas.js   <- objek Level 1, tas, ambil/letakkan benda
  04-level2-merakit.js      <- Level 2: merakit komputer
  05-level3-ipo.js          <- Level 3: input, proses, output
  06-level4-teknisi.js      <- Level 4: teknisi komputer
  07-level5-jaringan.js     <- Level 5: jaringan
  08-level6-keamanan.js     <- Level 6: keamanan digital
  09-level7-algoritma.js    <- Level 7: algoritma (robot + blok perintah)
  10-level8-misi-besar.js   <- Level 8: misi besar (final)
  11-karakter-hud-suara.js  <- karakter, KOMP-BOT, state, HUD, dialog, efek bunyi
  12-level1-panel-badge.js  <- Level 1 (tantangan), badge, panel perangkat, layar akhir
  13-ruang-pintu-panduan.js <- ruang, pintu, banner tujuan, panah penunjuk arah
  14-input-menu-loop.js     <- input keyboard/mouse/sentuh, menu awal, loop utama
  15-cek-misi.js            <- tombol Cek Misi (tujuan, instruksi, langkah tiap level)
build_single.py             <- membuat satu file HTML dari folder ini (opsional)
```

## Catatan
- Semua file JS berbagi satu ruang nama global (bukan modul ES), jadi fungsi dan
  variabel bisa dipakai antar-file. Daftar variabel bersama dideklarasikan di
  `js/01-dasar.js`. Jangan ubah urutan `<script>` di `index.html`.
- Untuk mengganti isi sebuah level, cari file `level*.js` yang sesuai.
- Untuk mengubah tampilan HP, edit `css/05-layar-kecil.css`.
