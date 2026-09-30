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
- Desktop: kiri 65% berisi komponen `AuthAnimationSlot` (tempat animasi buatan tim, sementara placeholder bertema navy), kanan 35% berisi form. Berpindah Masuk ↔ Daftar tanpa reload.
- HP: animasi menjadi banner pendek di atas form.
- Masuk: email, password, lupa password (tampilan saja dulu).
- Daftar: nama lengkap, email, password, nama sekolah, kelas (10–12), kota. Jangan kirim field role.
- Setelah berhasil → `/portal`. Kalau status `baru`, arahkan ke Analisis Potensi dengan sambutan singkat.
- Validasi form dan pesan error berbahasa Indonesia.

## 4. Kerangka portal
- Header: logo + "Student Portal", notifikasi, menu akun (nama, kelas, Profil, Keluar).
- Menu: Dashboard, Analisis Potensi, ORBIDU Compass, Action Plan, Persiapan, Explore Jurusan.
- Dropdown Persiapan: Siap SNBP, Siap TKA, Siap SNBT, Siap SKD, dan Siap Mandiri berlabel "Segera hadir" yang tidak bisa diklik.
- Menu aktif harus sesuai halaman.
- HP: menu menjadi drawer.
- Bagian yang terkunci karena status tampil dengan overlay gembok dan satu tombol ajakan yang jelas.

## 5. Dashboard (`/portal`)
- Sapaan memakai nama panggilan akun yang login, menyesuaikan waktu: pagi (04.00–10.59), siang (11.00–14.59), sore (15.00–17.59), malam (18.00–03.59). Tanggal otomatis.
- Kartu:
  - Ringkasan harian + Today's Action Plan (dari Action Plan).
  - Performa: radar 7 subtes SNBT (PU, PPU, PBM, PK, LBI, LBE, PM) dan hasil terakhir Siap SNBT, TKA, dan SKD.
  - Timeline seleksi (selalu tampil).
  - ORBIDU Compass: 3 jurusan teratas.
  - Eksplor Jurusan → `/jurusan`.
- Per status:
  - `baru`: Kompas, Performa, dan Action Plan terkunci, dengan satu CTA besar "Isi Gambaran Minat Bakat".
  - `sudah_asesmen`: Kompas terbuka. Performa kosong dengan ajakan ke Persiapan. Action Plan mengajak memilih fokus kalau belum diatur.
  - `aktif`: semua terisi.

## 6. Analisis Potensi (`/portal/analisis-potensi`)
- Header dengan indikator Kelengkapan Profil (%) beserta keterangan apa yang masih kurang.
- Tab Gambaran Minat Bakat:
  - Belum diisi: pengantar singkat, lalu tes per bagian dengan progress bar, simpan otomatis tiap bagian, tombol Simpan dan Simpan & Analisis.
  - Setelah submit: loading "AI sedang memahami profilmu" (simulasi) → arahkan ke Compass.
  - Sudah diisi: kartu "Sudah diisi pada [tanggal] · Kelas [X]", tombol lihat hasil di Compass, dan riwayat per kelas.
- Tab Prestasi: sub-tab Akademik dan Non-Akademik. Bisa tambah, ubah, dan hapus. Field: judul, tingkat (Sekolah s.d. Internasional), peringkat, penyelenggara, tahun, file sertifikat. Endpoint ubah dan upload sertifikat belum ada → catat di API_CONTRACT.
- Tab Nilai Rapor: hanya baca (diinput sekolah). Berisi tren nilai per mapel, tabel per semester, dan detail rapor tiap semester. Sumber ditulis "e-Rapor Kemendikdasmen". Empty state: "Nilai rapormu belum diinput sekolah."

## 7. ORBIDU Compass (`/portal/compass`)
Terkunci jika status `baru`. Isinya berurutan:
1. Arah Pendidikan: bidang utama dengan satu skor kesesuaian. Minat, kompetensi, dan akademik dijelaskan dengan label (misalnya "Sangat selaras"), bukan persentase tambahan.
2. Rekomendasi jurusan: 3–5 jurusan, masing-masing satu skor. Angkanya harus sama dengan yang tampil di Dashboard.
3. Rekomendasi jalur: S1 PTN, D4/Vokasi, PTS, PTLN, dan Kedinasan. Jalur yang tidak relevan disembunyikan di semua halaman. Tombol "Lihat pilihan" menampilkan daftar jurusan dan kampus.
4. Justifikasi: catatan ORBIDU, detail minat/kompetensi/akademik, dan radar 5 dimensi.
5. Beasiswa yang bisa dicoba: tanpa persentase eligibility. Tampilkan label kecocokan dengan jalur dan syarat utamanya, plus tombol ke `/portal/beasiswa`.
6. Langkah Selanjutnya: ke Siap SNBP, Siap SNBT, dan Siap SKD (yang terakhir hanya jika Kedinasan relevan).

Data: `POST /compass/analyze` dan `GET /compass/result` sudah ada, tapi hasilnya sekarang masih jawaban cadangan (bukan AI). Dalam mode dummy, simulasikan dari 5 skor asesmen, rata-rata rapor, dan jumlah prestasi.

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
- [ ] Fase 3 — Masuk & Daftar
- [ ] Fase 4 — Dashboard + Analisis Potensi
- [ ] Fase 5 — ORBIDU Compass + Explore Beasiswa
- [ ] Fase 6 — Action Plan
- [ ] Fase 7 — Persiapan
- [ ] Fase 8 — Profil
- [ ] Fase 9 — Finishing: cek tampilan HP, empty state, konsistensi angka antarhalaman, rapikan API_CONTRACT.md