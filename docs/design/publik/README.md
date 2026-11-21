# Referensi desain situs publik ORBIDU (Fase 10)

Desain dari Figma (ekspor SVG, lebar 1728), menggantikan `docs/design/landing/`
untuk tampilan halaman publik. File di sini hanya **pratinjau JPG**; SVG aslinya
(±17 MB, teksnya sudah jadi path) tidak disimpan di git. Minta ke tim desain
kalau butuh ukuran atau aset pasti.

| File | Halaman | Route |
|---|---|---|
| `Beranda-Desktop.jpg` | Beranda | `/` |
| `UntukSekolah-Desktop.jpg` | Untuk Sekolah | `/untuk-sekolah` |
| `EksplorJurusan-Desktop.jpg` | Eksplor Jurusan | `/jurusan` |
| `LatihanSoal-Desktop.jpg` | Latihan Soal | `/latihan-soal` |
| `FAQ-Desktop.jpg` | FAQ + Hubungi Kami | `/faq` |

Belum ada: desain HP dan desain halaman **Tentang Kami**. Tentang Kami (`/tentang-kami`) disusun sendiri dengan gaya yang sama; minta tim UI/UX meninjaunya.

## Yang sengaja berbeda dari desain
Keputusan Fase 10 (lihat `docs/SPEK_SISWA.md` bagian 1):
- Tombol **"Daftar"** diganti **"Berlangganan"** (WhatsApp): ORBIDU tidak punya pendaftaran mandiri.
- Semua teks memakai **Poppins** (desain memakai Plus Jakarta Sans dan Inter di beberapa bagian).
- Tampilan HP disusun sendiri dari desain desktop.
- Angka jumlah PTN/PTS di kartu jurusan hanya tampil kalau dihitung dari data kampus asli.
- Teks yang tidak sesuai kondisi produk diganti (mis. "Sumber Terpercaya & Teruji" selama bank soal masih contoh, nama lama "ORBITA").
- Form "Kirim Pesan" dikirim lewat WhatsApp sampai backend punya endpoint pesan.
- Tahun di footer otomatis (desain: © 2025).
- **Untuk Sekolah:** judul kartu Wali Kelas di desain sama dengan kartu Siswa, jadi diganti "Ikuti perkembangan siswa di kelasmu."; poin Guru BK yang muncul dua kali ("Memberikan catatan atau arahan") diganti; "umpan balik yang konstruktif secara real-time" menjadi "umpan balik yang membangun" (belum ada fitur real-time); salah ketik ("ekplorais", "leih", "unutk") diperbaiki; "HOW IT WORKS" menjadi "Cara kerjanya"; link "Pelajari tahap ini" di kartu peran menjadi "Tanya tim kami" (WhatsApp sekolah) karena belum ada halaman rinciannya.
- Di hero Untuk Sekolah ditambah bulan dan dua lapis gunung di belakang pohon kiri.
- **Awan di semua hero** memakai bentuk awan lembut dari hero Tentang Kami (`components/landing/motion/Cloud.tsx`), di posisi awan desain. Di Eksplor Jurusan (hero ringkas) awan diturunkan ke depan matahari supaya tetap terlihat.
- **Beranda, section Masalah:** gelembung di desktop disusun dua baris ("Masih bingung" sejajar "Kalau aku suka", "PTN, PTS" sejajar "Aku gatau") atas permintaan pemilik produk.
- **Hero Eksplor Jurusan** dibuat ringkas (±50% tinggi desain) supaya daftar jurusan cepat terlihat; emoji topi wisuda diganti ikon garis.
- **FAQ:** judul "Temukan Jawabanmu Disini" menjadi "di Sini"; kategori disesuaikan dengan fitur yang ada (Tentang ORBIDU, Cara Menggunakan, Jurusan & Kampus, Action Plan, Untuk Sekolah); "CONTACT US" menjadi "Hubungi Kami"; janji "merespons dalam 1×24 jam kerja" tidak dipakai karena belum pasti; "Base Radar" ditulis "Lokasi" dari `brand.ts`.

## Interaksi
Semua gerakan memakai CSS (geser, putar, transparansi), mati kalau `prefers-reduced-motion`, dan berhenti saat bagiannya tidak terlihat di layar (`lib/usePauseOffscreen.ts`).

- **Hero Beranda** (`src/assets/publik/hero-angkasa.svg`, animasi di dalam SVG):
  - tiga meteor jatuh diagonal berulang (satu lebih kecil dan samar);
  - dua orbit putus-putus "mengalir" berlawanan arah; planet putih berjalan di orbit dalam dan planet biru kecil di orbit luar (membesar saat di depan, mengecil saat di belakang maskot);
  - planet oranye mengambang dengan kilau berdenyut, permukaan planet biru besar bergeser pelan seperti berputar, cahaya biru berdenyut;
  - bintang berkelip, roket kecil sesekali melintas, awan di tepi kiri panel bergeser pelan;
  - kalau animasi dikurangi, planet kembali ke posisi desain asli.
- **Hero Untuk Sekolah**: meteor, bintang berkelip, bimasakti berkilau, awan bergeser, pohon bergoyang, siswa dan roket melayang bersama dengan api berkedip, bulan bercahaya. Lapisan diambil dari SVG desain ke `src/assets/publik/sekolah/`.
- **Hero FAQ** (lapisan dari SVG desain ke `src/assets/publik/faq/`): bulan bercahaya, awan bergeser, pohon bergoyang, bintang berkelip, meteor, bola tanda tanya melayang.
- **Hero Eksplor Jurusan** (lapisan dari SVG desain ke `src/assets/publik/jurusan/`): matahari bercahaya, awan bergeser, pohon bergoyang, bintang berkelip, dua meteor tipis. Tombol "Coba Orbita Compass" di desain ditulis dengan nama baru "Coba ORBIDU Compass".
- **Hero Tentang Kami**: langit fajar, matahari terbit perlahan lalu bercahaya, tiga lapis gunung, awan bergeser, meteor dan bintang di langit atas.
- Kartu dan langkah di halaman publik muncul halus saat pertama kali terlihat (`components/landing/motion/Reveal.tsx`).
