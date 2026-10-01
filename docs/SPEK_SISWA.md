# Spesifikasi Frontend ORBIDU — Sisi Siswa

Di luar cakupan tahap ini: Konsultasi Guru BK, feedback, portal guru BK, wali kelas, dan admin.

## Keputusan sementara (bisa diubah)
- Nama brand resmi **ORBIDU** (sebelumnya ORBITA). Semua teks yang terlihat pengguna memakai `frontend/src/config/brand.ts`. Nama file, variabel, route, dan email akun demo (`siswa@orbita.id`, dll., harus sama dengan seed backend) tidak diubah.
- Menu "Tryout" berganti nama menjadi **Persiapan**.
- Halaman Daftar tetap ada untuk siswa (memakai `/auth/register`). Bisa berubah kalau nanti akun siswa dibuat sekolah.
- Tes gambaran minat bakat: 42 soal dalam 7 bagian, skala 1–5. Soal yang sudah ada di kode dipindah ke `frontend/src/data/asesmen.json`; soal final dari Bu Putri menyusul. Hasil diolah jadi 5 skor sesuai backend: technology, research, creativity, leadership, communication.
- Prestasi langsung dihitung tanpa verifikasi guru.
- Nilai TKA memakai skala 0–100 (perlu dicek ulang ke aturan resmi).
- Rapor memakai format Kurikulum Merdeka: satu nilai akhir per mapel, semester 1–5.
- Profil: golongan darah dihapus, riwayat penyakit diganti "buta warna" (opsional), kondisi sosial ekonomi opsional dengan penjelasan tujuan.
- `/jurusan` memakai satu komponen halaman untuk semua pengunjung. Belum login → dibungkus layout publik; sudah login → dibungkus layout portal. URL tetap `/jurusan` (tidak ada `/portal/jurusan`). Menu portal "Explore Jurusan" mengarah ke `/jurusan`.

## Status siswa
Status menentukan bagian yang terkunci:
- `baru`: belum mengisi tes minat bakat (akun baru atau baru naik kelas).
- `sudah_asesmen`: tes selesai, belum pernah latihan atau tryout.
- `aktif`: sudah punya data latihan atau tryout.

Saat naik kelas, status kembali ke `baru` dan hasil tes lama disimpan sebagai riwayat per kelas.
Buat panel kecil "Mode Demo" yang hanya muncul saat `VITE_USE_MOCK=true`, untuk berpindah status dan melihat semua kondisi halaman.

## Peta halaman
Publik: `/` Landing, `/jurusan` Explore Jurusan, `/jurusan/:slug` Detail Jurusan, `/masuk`, `/daftar`.
Portal (wajib login): `/portal` Dashboard, `/portal/analisis-potensi`, `/portal/compass`, `/portal/beasiswa`, `/portal/action-plan`, `/portal/persiapan/snbp`, `/portal/persiapan/:ujian` (tka, snbt, skd), `/portal/profil`.
Kalau route yang sudah ada berbeda, usulkan penyesuaiannya di Fase 0.

## 1. Landing (`/`)
Acuan desain: `docs/design/landing/Home-Desktop.dc.html` (1440px) dan `Home-Mobile.dc.html` (390px). Teks mengikuti desain persis dan disimpan di `frontend/src/content/landing.ts`, bukan di komponen. Nama, tagline, dan kontak diambil dari `frontend/src/config/brand.ts`.
- Nama brand **ORBIDU**, tagline "The Smart Way to Shape Your Future". Nomor WhatsApp, email, Instagram, dan LinkedIn masih ditandai "BELUM DIPASTIKAN" di `brand.ts` dan wajib dicek sebelum rilis.
- Header tanpa navbar: logo di kiri, tombol Daftar dan Masuk di kanan. Kalau sudah login, keduanya diganti satu tombol "Buka Portal".
- Urutan section:
  1. **Hero**: "Hi, Bifriends!" (font aksen), judul, subjudul, CTA "Mulai Perjalanan" (tamu → `/daftar`, sudah login → `/portal`) dan "Kenali ORBIDU" (scroll ke section Masalah). Visual planet berbintang, orbit, lima chip langkah, dan maskot. Di bawahnya deretan logo kampus (masih placeholder).
  2. **Masalah**: "Masih bingung harus mulai dari mana?" dengan enam gelembung pertanyaan, lalu "Tenang, Bifriends!".
  3. **Kenali Dirimu** (1 Potensi): CTA "Kenali Dirimu" (tamu → `/daftar`, sudah login → `/portal/analisis-potensi`).
  4. **ORBIDU Compass** (2 Arah): Profil → Pilihan untuk dieksplorasi → Jalur yang bisa ditempuh.
  5. **Eksplorasi Pilihan** (3 Pilihan): carousel kartu jurusan dan tombol "Lihat Jurusan Lainnya" → `/jurusan`.
  6. **Action Plan** (4 Persiapan): CTA "Mulai Action Plan" (tamu → `/daftar`, sudah login → `/portal/action-plan`).
  7. **FAQ**: tiga kategori (Tentang ORBIDU, Untuk Bifriends, Untuk Sekolah) + tombol "Tanya lewat WhatsApp".
  8. **Final CTA** "Ready to find your orbit, Bifriends?" + tombol "Hadirkan ORBIDU di Sekolahmu" (WhatsApp), lalu **footer**.
- Footer: Jelajahi (Beranda, Explore Jurusan, FAQ), Akun (Masuk, Mulai Perjalanan), Hubungi kami (email, Instagram, LinkedIn, lokasi), © tahun berjalan (otomatis). Link "Untuk Sekolah" dan "Tentang Kami" disembunyikan sampai halamannya dibuat.
- Tombol **"Ayo konsultasi!"** dengan maskot melompat menempel di pojok kanan bawah layar (`position: fixed`) di semua halaman publik (beranda, `/jurusan`, `/jurusan/:slug`) dan membuka WhatsApp. Tidak tampil di halaman Masuk/Daftar dan portal.
- **Carousel jurusan** digeser dengan tombol panah dan swipe, tanpa scrollbar horizontal maupun vertikal yang terlihat. Desktop: 4 kartu per halaman. HP: 1 kartu dengan sebagian kartu berikutnya terlihat. Kartu membuka `/jurusan/:slug`.
- **MascotSlot**: maskot hero versi SVG dari desain. Desktop: mata mengikuti kursor. HP: menoleh ke titik sentuhan. Semua animasi mati jika `prefers-reduced-motion`. Nanti diganti model 3D tanpa mengubah halaman.
- Font aksen Pecita, dengan Caveat sebagai cadangan sampai file Pecita tersedia.
- Tidak boleh ada scroll horizontal. Dicek di lebar 360px, 768px, dan 1440px.

## 2. Explore Jurusan (`/jurusan`, publik) dan Detail Jurusan (`/jurusan/:slug`)
Acuan desain detail: `docs/design/landing/Jurusan-Detail.dc.html` (desktop).
- Katalog jurusan dikelompokkan **per nama jurusan** (bukan per kampus), masing-masing punya `slug`. Konten dari `JurusanPage` lama dipindah ke `frontend/src/mocks/` (tanpa persentase "match", perkiraan gaji, dan daftar alumni karena tidak bisa dipertanggungjawabkan).
- `/jurusan`: grid kartu jurusan yang sama dengan carousel beranda, dengan **pencarian** dan **filter bidang**. Chip filter turun ke baris baru kalau tidak muat (tidak digeser). Tanpa filter kota atau jenis kampus. Tanpa scroll horizontal.
- `/jurusan/:slug`: sesuai desain detail (tentang jurusan, apa yang dipelajari, prospek karier, kampus yang membuka, mapel pendukung, jalur masuk, ajakan "Cocok nggak sih buatku?", jurusan lain yang mirip). Harus responsif walaupun desain HP-nya belum ada.
- Daftar **"Kampus yang membuka jurusan ini"** diambil dari `ptnService`, dengan **filter jenis kampus** (PTN, PTS, Kedinasan, PTLN) dan **filter kota**.
- Kalau siswa sudah login dan sudah asesmen, kartu jurusan menampilkan **label kecocokan dari Compass** ("Sangat sesuai" atau "Sesuai"), bukan persentase.
- Foto jurusan belum ada: tampil sampul berwarna dengan ikon per bidang. Field `imageUrl` sudah disiapkan untuk foto asli.
- Tombol konsultasi di HP: gelembung teks tampil beberapa detik saat halaman dibuka, lalu mengecil jadi maskot saja supaya tidak menutupi konten. Di desktop gelembung selalu tampil.
- Data: backend belum punya katalog per nama jurusan beserta deskripsi, mapel pendukung, dan prospek karier, juga belum punya data PTS dan PTLN → dummy + catat di `docs/API_CONTRACT.md`.

## 3. Masuk & Daftar (`/masuk`, `/daftar`)
Acuan desain: `docs/design/auth/Auth-Desktop.dc.html` (1440px) dan `Auth-Mobile.dc.html` (390px). `Brief-Animasi.dc.html` hanya untuk tim animasi. Teks disimpan di `frontend/src/content/auth.ts`.
- Satu halaman (`AuthPage`) untuk dua route. Tombol **Masuk | Daftar** di atas form dan link di bawah form mengganti URL antara `/masuk` dan `/daftar` tanpa reload. Halaman asal (dari `RequireAuth`) ikut terbawa, jadi setelah login siswa kembali ke halaman yang tadi dibuka.
- **Desktop (≥1024px)**: kiri 65% berisi `AuthVideoSlot` setinggi layar (logo ke beranda di kiri atas, "Hi, Bifriends! / Setiap siswa punya orbitnya sendiri." di kiri bawah), kanan 35% berisi form.
- **HP dan tablet**: `AuthVideoSlot` menjadi banner 240px di atas form, dengan tombol kembali ke beranda dan logo. Lebar form dibatasi 440px.
- **`AuthVideoSlot`**: video autoplay, muted, loop, playsInline, object-fit cover, dengan poster. Path video dan poster (versi desktop dan HP) diatur di `frontend/src/config/authMedia.ts`. Selama file belum ada, tampil ilustrasi maskot, orbit, dan bintang dari desain. Jika `prefers-reduced-motion`, video tidak diputar: yang tampil poster (atau ilustrasi diam). Video gagal dimuat → poster/ilustrasi. Hanya satu versi video yang dipasang sesuai lebar layar.
- **Masuk**: email dan password (bisa ditampilkan/disembunyikan). "Lupa password?" membuka info bahwa reset password sementara dilakukan lewat WhatsApp ORBIDU (link dari `brand.ts`).
- **Daftar**: nama lengkap, email, password (minimal 8 karakter), nama sekolah, kelas (tombol 10/11/12), kota, dan kotak persetujuan orang tua/wali yang wajib dicentang. Body sama dengan `POST /auth/register` (`name, email, password, schoolName, grade, city`) ditambah `parentConsent`. Field `role` tidak pernah dikirim.
- **Validasi**: pesan per field di bawah input dan fokus pindah ke field salah paling atas. Error dari server tampil di banner merah `role="alert"` ("Email atau password salah.", "Email ini sudah terdaftar.") dan input email diberi border merah. Tombol kirim menampilkan status loading dan tidak bisa diklik dua kali.
- **Aksesibilitas**: label di setiap input, autocomplete (`name`, `email`, `current-password`, `new-password`), `aria-pressed` di tombol mode dan tombol kelas, cincin fokus kuning.
- Setelah berhasil → `/portal` (atau halaman asal). Kalau status `baru` (termasuk akun yang baru daftar), langsung ke Analisis Potensi.
- Tombol konsultasi tidak tampil di halaman ini.
- Data: backend belum menyimpan persetujuan orang tua/wali dan belum punya reset password → dicatat di `docs/API_CONTRACT.md` bagian 2.4 dan 2.5.

## 4. Kerangka portal
Acuan desain: `docs/design/portal/PortalHeader.dc.html` (desktop) dan menu bawah di `Portal-Dashboard-HP.dc.html`.
- **Desktop (≥1024px)**: satu baris header 72px berisi logo (ke beranda), menu Dashboard, Analisis Potensi, ORBIDU Compass, Action Plan, Persiapan ▾, Explore Jurusan, lalu notifikasi dan menu akun. Menu aktif ditandai garis bawah biru (`aria-current="page"`). Ikon menu dan nama akun baru tampil mulai 1400px supaya menu tetap satu baris di layar 1024–1399px.
- **Dropdown Persiapan**: Siap SNBP, Siap TKA, Siap SNBT, Siap SKD, dan Siap Mandiri berlabel "Segera hadir" yang tidak bisa diklik.
- **HP dan tablet (<1024px)**: header 60px (logo, notifikasi, avatar) dan menu bawah 5 item: Dashboard, Analisis, Compass, Rencana, Persiapan. "Persiapan" membuka bottom sheet berisi pilihan yang sama dengan dropdown desktop. Tidak ada drawer.
- **Menu akun**: nama, kelas, email, Profil, Explore Jurusan, Keluar. Di HP, Explore Jurusan dibuka lewat menu akun dan kartu di Dashboard.
- **Format kelas** sama di semua halaman: "Kelas XII" (fungsi `formatKelas()`), tanpa jurusan SMA karena nilai "IPA" dari backend masih bawaan palsu.
- **Notifikasi**: daftar kosong yang jujur, tanpa titik "belum dibaca", sampai endpoint-nya ada (API_CONTRACT 7.4).
- Bagian yang terkunci karena status tampil dengan gembok dan penjelasan singkat. Satu tombol ajakan yang jelas ada di hero Dashboard.
- Panel Mode Demo yang sudah ada dipakai apa adanya (tidak dibuat ulang); di HP letaknya dinaikkan di atas menu bawah.

## 5. Dashboard (`/portal`)
Acuan desain: `docs/design/portal/Portal-Dashboard.dc.html` (1440px) dan `Portal-Dashboard-HP.dc.html` (390px). Teks di `frontend/src/content/dashboard.ts`, data lewat `dashboardService` dan `jurusanService.getCompassHighlights()`.
- **Hero navy**: tanggal otomatis ("Kamis, 1 Oktober 2026") dan sapaan sesuai jam: pagi (04.00–10.59), siang (11.00–14.59), sore (15.00–17.59), malam (18.00–03.59). Nama yang dipakai: **nama panggilan** dari profil; kalau kosong, kata pertama nama lengkap.
- **Kartu dan urutannya** (HP satu kolom dengan urutan yang sama):
  - Rencana hari ini: cincin progres, jumlah tugas selesai, perkiraan menit tersisa, dan daftar tugas (desktop 4, HP 3, sisanya "+N tugas lainnya").
  - Performa latihan: radar 7 subtes SNBT (PU, PPU, PBM, PK, LBI, LBE, PM) dari tryout terakhir dengan subtes terlemah ditandai oranye, skor terakhir dan selisihnya, lalu hasil terakhir Siap SNBT, TKA, dan SKD ("Mulai" jika belum ada). "Lihat performa" membuka halaman Siap SNBT (tab Performance belum bisa dibuka lewat URL).
  - ORBIDU Compass: bidang yang paling selaras dan 3 jurusan teratas dengan label "Sangat sesuai"/"Sesuai" (tanpa persentase), menuju `/jurusan/:slug`.
  - Timeline seleksi (selalu tampil): 5 agenda mulai bulan ini, dengan catatan "Jadwal perkiraan. Jadwal resmi mengikuti SNPMB dan instansi terkait."
  - Explore Jurusan → `/jurusan`.
- **Per status**:
  - `baru`: Rencana, Performa, dan Compass terkunci (kerangka abu-abu buram, tanpa angka contoh). Hero berisi satu CTA besar "Isi Gambaran Minat Bakat".
  - `sudah_asesmen`: Compass terbuka. Rencana mengajak "Atur fokus belajar" kalau fokus belum diatur. Performa kosong dengan ajakan "Mulai latihan pertama".
  - `aktif`: semua terisi. Hero menampilkan progres tugas hari ini, chip kelas, dan fokus belajar.
- Semua kartu punya kondisi memuat, gagal (dengan "Coba lagi"), dan kosong yang jujur.
- Data: fokus belajar, durasi tugas, riwayat latihan, timeline, notifikasi, dan nama panggilan belum ada di backend → API_CONTRACT bagian 7. Dengan backend asli, status `aktif` belum bisa muncul.

## 6. Analisis Potensi (`/portal/analisis-potensi`)
Acuan desain: `docs/design/portal/Portal-Analisis.dc.html` (desktop) dan `Portal-Analisis-HP.dc.html` (390px). Teks di `frontend/src/content/analisis.ts`.
- **Header**: breadcrumb (desktop), judul, deskripsi, dan kartu **Kelengkapan profil** (%) dengan daftar yang menjelaskan apa yang masih kurang. Rumus: tes 40 × bagian selesai ÷ 7, nilai rapor 30, minimal satu prestasi 20, sertifikat 10 × proporsi prestasi bersertifikat. Nilai rapor yang belum ada ditulis "menunggu input dari sekolah" (bukan tugas siswa). Dengan backend asli, sertifikat belum bisa diunggah sehingga persentase dihitung dari 90 poin.
- **Tab** tersimpan di URL: `?tab=minat` (bawaan), `?tab=prestasi`, `?tab=rapor`, dengan chip status ("4/7" atau "Selesai", jumlah prestasi, "Sem 1–4" atau "Belum ada"). Panah kiri/kanan berpindah tab.
- **Gambaran Minat Bakat**:
  - Soal dari `frontend/src/data/asesmen.json` (sekarang **placeholder**: 23 soal lama dalam 7 bagian). Jenis soal: skala 1–5, pilihan tunggal, pilihan ganda dengan batas (pilihan lain nonaktif saat batas tercapai), dan urutan dengan tombol naik/turun.
  - Desktop: panel kiri berisi progres dan daftar bagian; HP: kartu progres dengan daftar bagian yang bisa dibuka-tutup. Nomor soal berlanjut antarbagian.
  - Jawaban tersimpan otomatis setiap berubah ("Tersimpan otomatis pukul …"); tombol Simpan dan **Simpan & Analisis** di bagian terakhir, aktif setelah semua bagian lengkap.
  - Simpan & Analisis → layar "AI sedang memahami profilmu" dengan tiga langkah → `POST /assessment` + `POST /compass/analyze` → status `sudah_asesmen` → pindah ke Compass.
  - Skor 5 dimensi dihitung dengan aturan **sementara** (bobot di `asesmen.json`, kode di `frontend/src/lib/asesmen.ts`).
  - Setelah selesai: kartu "Diisi pada [tanggal] saat kelas [X]", tombol ke Compass, "Lihat jawabanku" (hanya untuk tes terbaru, jika jawabannya tersimpan), dan **Riwayat per kelas** (kelas, tanggal, bidang paling selaras; tanpa tombol "Lihat").
- **Prestasi**: pilihan Akademik | Non-akademik dengan jumlah, tombol Tambah prestasi, jendela tambah/ubah (nama, tingkat Sekolah s.d. Internasional, capaian, penyelenggara, tahun, sertifikat PDF/JPG/PNG maks. 2 MB; di mode dummy hanya nama file), dan konfirmasi hapus. Prestasi tanpa sertifikat ditandai oranye. Dengan backend asli: tombol Ubah, capaian, penyelenggara, dan unggah sertifikat disembunyikan dengan catatan.
- **Nilai Rapor** (hanya baca, diinput sekolah, format Kurikulum Merdeka): info + sumber "e-Rapor Kemendikdasmen" dan tanggal diperbarui, grafik tren per mapel (Recharts) dengan garis rata-rata semua mapel dan semester berjalan "Belum tersedia", lalu rapor per semester (tabel di desktop, kartu di HP) dengan detail nilai tiap mapel. Kosong → "Nilai rapormu belum diinput sekolah".
- Data: draft dan jawaban tes, riwayat per kelas, penilaian di backend, prestasi lengkap, dan kelas/tahun ajaran rapor belum ada di backend → API_CONTRACT bagian 3 dan 8.

## 7. ORBIDU Compass (`/portal/compass`)
Acuan desain: `docs/design/portal/Portal-Compass.dc.html`. Teks di `frontend/src/content/compass.ts`.
- **Status `baru`**: kartu terkunci "ORBIDU Compass terbuka setelah Gambaran Minat Bakat" dengan daftar manfaat dan tombol ke tes. Sudah tes tetapi belum pernah dianalisis → empty state dengan tombol "Jalankan analisis".
- **Kepala halaman**: tanggal "Dianalisis …", chip **"Soal versi uji coba"** selama `asesmen.json` masih placeholder, dan tombol **Perbarui analisis**. Tombol hanya aktif jika ada data baru (tes, prestasi, atau rapor) setelah tanggal analisis; jika tidak, tampil "Hasil sudah sesuai data terbaru". Alasannya: setiap analisis dengan AI asli memakai kuota API.
- **Hero navy**: bidang paling selaras (bidang rekomendasi teratas yang ada di katalog) + label "Sangat selaras/Selaras", ringkasan dari hasil Compass, tiga aspek **Minat / Akademik / Prestasi** berupa label + 5 bar (tanpa persen), dan radar 5 dimensi minat dari tes.
  - Minat: keselarasan minat dari hasil Compass.
  - Akademik: rata-rata mapel pendukung bidang teratas di semester terakhir ("Menunggu nilai rapor" jika belum ada).
  - Prestasi: tingkat prestasi yang berhubungan dengan bidang teratas.
  - Label "Kompetensi" di desain diganti karena tidak punya sumber data.
- **Jurusan yang bisa kamu eksplorasi**: sampai 5 jurusan dengan label "Sangat sesuai/Sesuai" dari sumber yang sama dengan Dashboard dan `/jurusan` (`jurusanService.matchRecommendations`), bidang, dan maksimal 3 chip alasan yang hanya muncul jika datanya mendukung (minat tertinggi, mapel pendukung yang tinggi/naik terus, prestasi yang berhubungan). Nama dari Compass yang tidak ada di katalog tetap tampil tanpa link "Lihat jurusan".
- **Target jurusan**: satu jurusan bisa dijadikan target ("Jadikan target" / "Target kamu"). Ini target **jurusan katalog**, berbeda dari target **prodi di kampus tertentu** untuk Siap SNBP. Disimpan lewat `compassService` (API_CONTRACT 9.1).
- **Jalur pendidikan**: kampus yang membuka 3 jurusan rekomendasi teratas, dikelompokkan per jalur (S1 PTN, D4 Vokasi, PTS, PTLN, Kedinasan) dari jenis kampus di `ptnService`. Kartu jalur bisa dibuka untuk melihat prodi, kampus, dan kota. Jalur tanpa pilihan disembunyikan dengan alasannya (belum selaras, belum ada data kampus, atau data belum tersedia). Label "Contoh data" hanya di mode dummy.
- **Kenapa ORBIDU merekomendasikan ini**: tiga kolom dari tes (dimensi minat tertinggi dan terendah), prestasi (3 tertinggi), dan rapor (2 mapel tertinggi, tren rata-rata, 1 mapel yang bisa ditingkatkan), masing-masing dengan link ke tab Analisis Potensi, plus "Catatan ORBIDU".
- **Langkah selanjutnya**: Siap SNBP, Siap TKA, Siap SNBT; Siap SKD hanya jika ada jurusan Kedinasan di rekomendasi.
- **Beasiswa yang bisa dicoba**: 3 beasiswa yang cocok + tombol ke `/portal/beasiswa` (Tahap 5B).
- Data: `POST /compass/analyze` dan `GET /compass/result` sudah ada, tetapi hasilnya masih jawaban cadangan (bukan AI) dengan nama prodi yang belum tentu ada di katalog. Mode dummy menyimpulkan dari 5 skor tes, rata-rata rapor, dan jumlah prestasi. Kebutuhan lain di API_CONTRACT bagian 9.

## 8. Explore Beasiswa (`/portal/beasiswa`)
- Daftar beasiswa dengan filter jenjang, dalam/luar negeri, dan jenis bantuan.
- Detail: penyelenggara, syarat utama, cakupan, periode pendaftaran, tautan resmi.
- Backend belum punya data beasiswa → dummy (diberi tanda contoh) + catat di API_CONTRACT.

## 9. Action Plan (`/portal/action-plan`)
- Fokus Minggu Ini: pilih maksimal 2 dari SNBT, TKA, dan Kedinasan, dengan progress masing-masing. Ringkasan hari belajar, jumlah aktivitas, dan progress minggu ini.
- Kalender bulanan: warna kotak menunjukkan status hari (hijau selesai, merah terlewat, biru hari ini, kuning ada jadwal). Titik kecil menunjukkan kategori (SNBT, TKA, Kedinasan, Personal).
- Daftar tugas berupa kartu seperti Englishnesia (judul, kategori, progress, jumlah soal, estimasi waktu), dengan filter Minggu Ini, Terlewat, Belum Selesai, dan Selesai beserta jumlahnya.
- Panel Hari Ini: target hari ini + rekomendasi ORBIDU.
- Modal Re-plan: pilih hari belajar (frekuensi dihitung otomatis dari jumlah hari), fokus (maks. 2), dan durasi rencana (jumlah minggu atau sampai tanggal ujian).
- Penyusun tugas (simulasi AI): SNBT → 7 subtes SNBT; TKA → mapel wajib dan pilihan; SKD → TWK, TIU, TKP. Prioritaskan subtes dengan skor terendah; kalau belum ada data, bagi rata.
- Tugas terlewat ditawarkan untuk digeser ke hari belajar berikutnya.
- Siswa bisa menambah tugas Personal sendiri.
- Data: CRUD `/action-plans` sudah ada (tanpa ubah). Pengaturan fokus, hari belajar, dan pembuatan tugas otomatis belum ada → catat di API_CONTRACT.

## 10. Persiapan

### Siap SNBP (`/portal/persiapan/snbp`)
Rasionalisasi 3 langkah: Input Data → Review → Hasil.
- A. Data akademik: rata-rata rapor semester 1–5, otomatis dari profil.
- B. Nilai TKA (opsional): wajib Bahasa Indonesia, Matematika, Bahasa Inggris; mapel pilihan maksimal 2.
- C. Prestasi: pilih maksimal 3 dari data prestasi di Analisis Potensi.
- D. Target: 2 pilihan kampus + prodi dari data PTN.
- Info bahwa SNBP hanya untuk siswa eligible yang ditentukan sekolah.
- Hasil: kategori Aman, Waspada, atau Berisiko per pilihan, faktor yang mempengaruhi, saran, dan catatan bahwa ini estimasi.
- Data: `GET /ptn/rationalization` sudah ada, tapi rumusnya belum memperhitungkan prodi dan daya tampung, dan belum menerima input TKA, prestasi terpilih, maupun target → catat di API_CONTRACT.

### Siap TKA, Siap SNBT, Siap SKD (`/portal/persiapan/:ujian`)
Satu template dipakai tiga kali, bedanya hanya di konfigurasi:
- SNBT: PU, PPU, PBM, PK, LBI, LBE, PM.
- TKA: Bahasa Indonesia, Matematika, Bahasa Inggris + 2 mapel pilihan.
- SKD: TWK, TIU, TKP.

Tiga tab:
- Latihan Soal: pilih subtes, progress per subtes, rekomendasi fokus (subtes dengan akurasi terendah), pengerjaan soal dengan pembahasan setelah menjawab.
- Tryout: paket TO terbuka berurutan (TO berikutnya terbuka setelah sebelumnya selesai). Halaman pengerjaan dengan timer, navigasi nomor soal, tandai ragu-ragu, dan konfirmasi submit. Laporan hasil per subtes.
- Performance: tren skor, prediksi dibanding target jurusan, skor per subtes, dan subtes terlemah.

Judul halaman memakai "Siap SNBT" (bukan "Siap PTN"), tanpa toggle SNBP/SNBT.
Data: bank soal backend baru 8 soal dan kunci jawabannya ikut terkirim; riwayat tryout belum punya endpoint → dummy + catat di API_CONTRACT.

## 11. Profil (`/portal/profil`)
Hanya berisi data diri; Prestasi dan Rapor tetap di Analisis Potensi.
Field bertanda 🔒 diisi admin dan hanya bisa dibaca, dengan catatan "Hubungi wali kelas jika ada data yang salah".
- Data Diri: nama lengkap 🔒, nama panggilan, jenis kelamin 🔒, NIS 🔒, NISN 🔒, kelas 🔒, jurusan 🔒, tempat & tanggal lahir, agama, foto profil.
- Alamat & Kontak: alamat lengkap, kelurahan/desa, kecamatan, kota/kabupaten, provinsi, kode pos, No. HP/WhatsApp, email.
- Data Keluarga: nama ayah & ibu, pekerjaan ayah & ibu, pendidikan ayah & ibu, No. HP orang tua/wali, status orang tua, tinggal bersama, anak ke-, jumlah saudara kandung.
- Informasi Tambahan (opsional, tujuan dijelaskan): kondisi sosial ekonomi keluarga (untuk rekomendasi beasiswa), buta warna (beberapa prodi mensyaratkannya), berkebutuhan khusus (untuk info akses kampus).
- Tombol simpan melayang dengan status "Data berhasil disimpan".
- Data: backend baru menyimpan sekolah, kelas, jurusan, dan kota → field lainnya dicatat di API_CONTRACT.

## Fase pengerjaan
- [x] Fase 0 — Audit frontend (tanpa mengubah kode)
- [x] Fase 1 — Fondasi: design token, lapisan services + mocks + saklar dummy, status siswa + Mode Demo, routing, kerangka portal, API_CONTRACT.md awal
- [x] Fase 2 — Landing + Explore Jurusan
- [x] Fase 3 — Masuk & Daftar
- [x] Fase 4 — Dashboard + Analisis Potensi
- [ ] Fase 5 — ORBIDU Compass + Explore Beasiswa
- [ ] Fase 6 — Action Plan
- [ ] Fase 7 — Persiapan
- [ ] Fase 8 — Profil
- [ ] Fase 9 — Finishing: cek tampilan HP, empty state, konsistensi angka antarhalaman, rapikan API_CONTRACT.md

## Sebelum rilis
Hal yang sengaja ditunda dan wajib dibereskan sebelum ORBIDU dipakai siswa:
- Halaman **Syarat & Ketentuan** dan **Kebijakan Privasi** wajib dibuat. Setelah itu, teks keduanya di kotak persetujuan form Daftar (`AUTH_FIELDS.consent` di `frontend/src/content/auth.ts`, sekarang teks tebal biasa) diubah menjadi link.
- Nomor WhatsApp, email, Instagram, dan LinkedIn bertanda "BELUM DIPASTIKAN" di `frontend/src/config/brand.ts` wajib dicek (dipakai juga oleh "Lupa password?").
- Backend menyimpan persetujuan orang tua/wali beserta waktunya (`docs/API_CONTRACT.md` bagian 2.4).
- Ganti soal placeholder di `frontend/src/data/asesmen.json` dengan 42 soal final dari Bu Putri (ubah `status` menjadi `"final"`), lalu pastikan jumlah bagian/soal yang disebut di beranda (`frontend/src/content/landing.ts`), FAQ, dan Dashboard ("7 bagian, bisa dicicil") sesuai.
- Penilaian skor 5 dimensi dipindah ke backend dan disetujui Bu Putri (`docs/API_CONTRACT.md` bagian 3.4). Sebelum itu, rekomendasi Compass dari tes hanya untuk demo.
