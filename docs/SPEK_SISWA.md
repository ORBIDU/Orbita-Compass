# Spesifikasi Frontend ORBIDU — Sisi Siswa

Di luar cakupan tahap ini: Konsultasi Guru BK, feedback, portal guru BK, wali kelas, dan admin.

## Keputusan sementara (bisa diubah)
- Nama brand resmi **ORBIDU** (sebelumnya ORBITA). Semua teks yang terlihat pengguna memakai `frontend/src/config/brand.ts`. Nama file, variabel, route, dan email akun demo (`siswa@orbita.id`, dll., harus sama dengan seed backend) tidak diubah.
- Menu "Tryout" berganti nama menjadi **Persiapan**.
- **Tidak ada pendaftaran mandiri**: ORBIDU hanya untuk siswa yang sudah berlangganan, akun dibuat admin. Siapa yang membuat akun (tim ORBIDU atau sekolah) belum diputuskan, jadi teksnya netral dan disimpan di `frontend/src/content/common.ts` (`ACCOUNT_ACCESS`).
- Tes gambaran minat bakat: 42 soal dalam 7 bagian, skala 1–5. Soal yang sudah ada di kode dipindah ke `frontend/src/data/asesmen.json`; soal final dari Bu Putri menyusul. Hasil diolah jadi 5 skor sesuai backend: technology, research, creativity, leadership, communication.
- Prestasi langsung dihitung tanpa verifikasi guru.
- Nilai TKA memakai skala 0–100 (perlu dicek ulang ke aturan resmi).
- Rapor memakai format Kurikulum Merdeka: satu nilai akhir per mapel, semester 1–5.
- Profil: golongan darah dihapus, riwayat penyakit diganti "buta warna" (opsional), kondisi sosial ekonomi opsional dengan penjelasan tujuan.
- `/jurusan` dan `/jurusan/:slug` selalu tampil sebagai **situs publik** (layout publik), juga untuk siswa yang sudah masuk, sama seperti beranda. Siswa kembali ke portal lewat "Buka Portal" di navbar. URL tetap `/jurusan` (tidak ada `/portal/jurusan`). Menu portal "Explore Jurusan" mengarah ke `/jurusan`.

## Status siswa
Status menentukan bagian yang terkunci:
- `baru`: belum mengisi tes minat bakat (akun baru atau baru naik kelas).
- `sudah_asesmen`: tes selesai, belum pernah latihan atau tryout.
- `aktif`: sudah punya data latihan atau tryout.

Saat naik kelas, status kembali ke `baru` dan hasil tes lama disimpan sebagai riwayat per kelas.
Buat panel kecil "Mode Demo" yang hanya muncul saat `VITE_USE_MOCK=true`, untuk berpindah status dan melihat semua kondisi halaman.

## Peta halaman
Publik: `/` Landing, `/jurusan` Explore Jurusan, `/jurusan/:slug` Detail Jurusan, `/masuk` (`/daftar` dialihkan ke sini). Setelah masuk: `/aktivasi` untuk login pertama.
Portal (wajib login): `/portal` Dashboard, `/portal/analisis-potensi`, `/portal/compass`, `/portal/beasiswa`, `/portal/action-plan`, `/portal/persiapan/snbp`, `/portal/persiapan/:ujian` (tka, snbt, skd), `/portal/profil`.
Kalau route yang sudah ada berbeda, usulkan penyesuaiannya di Fase 0.

## 1. Situs publik (Fase 10)
Acuan desain: `docs/design/publik/` (Beranda, Untuk Sekolah, Eksplor Jurusan, Latihan Soal, FAQ; desktop 1728px, pratinjau JPG). Menggantikan `docs/design/landing/Home-*.dc.html`. Teks di `frontend/src/content/landing.ts`; nama, tagline, dan kontak dari `frontend/src/config/brand.ts`.

### Keputusan Fase 10
- **Navbar** di semua halaman publik (`PublicHeader`): logo, menu di tengah (Beranda, Untuk Sekolah, Eksplor Jurusan, Latihan Soal, FAQ), **Masuk** + **Berlangganan** di kanan. Kalau sudah login, keduanya diganti "Buka Portal" (wali kelas ke `/walikelas`). Di bawah lebar `lg` menu pindah ke panel hamburger.
  - Menu hanya tampil kalau halamannya sudah ada (Beranda, Untuk Sekolah, Eksplor Jurusan, Tentang Kami, FAQ). Latihan Soal menyusul di 10D.
- Tombol **"Daftar"** di desain diganti **"Berlangganan"** (WhatsApp). Tidak ada pendaftaran mandiri.
- Semua teks memakai **Poppins** (desain memakai Plus Jakarta Sans dan Inter di beberapa bagian).
- Desain HP belum ada; tampilan HP disusun dari desain desktop. Tetap dicek di 360px, 768px, 1440px tanpa scroll horizontal.
- **Footer** (`PublicFooter`): deskripsi, kolom Perjalanan dan Kolaborasi, © tahun berjalan (otomatis), lokasi dari `brand.ts`.
- Angka jumlah PTN/PTS di kartu jurusan hanya tampil kalau dihitung dari data kampus asli.
- Teks yang tidak sesuai kondisi produk diganti: klaim "Sumber Terpercaya & Teruji" selama bank soal masih contoh, nama lama "ORBITA", "Latihan Soal Mandiri" diberi label "Segera hadir".
- Form "Kirim Pesan" di FAQ dikirim lewat WhatsApp (pesan terisi otomatis) sampai backend punya endpoint pesan (catat di `docs/API_CONTRACT.md`).
- Tombol **"Ayo konsultasi!"** tetap menempel di pojok kanan bawah semua halaman publik (tidak ada di desain), tidak tampil di Masuk/Aktivasi dan portal.
- **Hero bergerak** di semua halaman publik (meteor, orbit dan planet, bintang, awan, roket, matahari/bulan, bukit, pohon). Maskot dan siswa tidak diubah gambarnya. Semua animasi mati jika `prefers-reduced-motion` dan berhenti saat tidak terlihat di layar. Rinciannya di `docs/design/publik/README.md` bagian Interaksi.
- Tidak memakai emoji/stiker sebagai ikon; pakai ikon garis lucide.
- Ilustrasi beranda diambil dari SVG desain ke `frontend/src/assets/publik/` (panel angkasa + meteor sebagai SVG, gedung sekolah + logo kampus sebagai WebP, siswa bingung sebagai SVG). Section "Masih bingung harus mulai darimana?" memakai gambar judul dan empat gambar gelembung dari tim UI/UX (`assets/publik/masalah/`); teks gelembung tetap HTML dari `content/landing.ts`. Di desktop gelembung tersusun dua baris ("Masih bingung" sejajar "Kalau aku suka", "PTN, PTS" sejajar "Aku gatau"); di HP zig-zag di atas ilustrasi.
- Lebar isi halaman publik mengikuti desain: margin tepi ±3,7% (maks. 64px), lebar isi maks. 1600px (`CONTAINER` di `components/landing/primitives.tsx`).

### Tahapan
- [x] 10A — Fondasi: desain disimpan, navbar + menu HP, footer baru, beranda masuk `PublicLayout`.
- [x] 10B — Beranda sesuai desain baru (hero angkasa + meteor, Masalah, "Tenang Bifriends, ada ORBIDU", 3 kartu Perjalanan, CTA penutup). Section FAQ di beranda dihapus setelah `/faq` jadi. Carousel jurusan dan section Kenali/Compass/Action Plan lama dihapus.
- [ ] 10C — Eksplor Jurusan (`/jurusan`) sesuai desain.
  - [x] Hero bergerak (dibuat ringkas, ±50% tinggi desain), tab PTN & PTS / Kedinasan, pencarian, ajakan Compass; `/jurusan` selalu memakai layout publik.
  - [ ] Kartu jurusan dan pengelompokan per bidang sesuai desain (sementara memakai kartu versi sekarang).
- [ ] 10D — Untuk Sekolah (`/untuk-sekolah`) dan Latihan Soal (`/latihan-soal`).
  - [x] Untuk Sekolah: hero bergerak (siswa di roket), kartu peran Siswa/Guru BK/Wali Kelas, "Apa yang Didapat Sekolah?", linimasa lima langkah dengan lanskap sekolah, CTA ke WhatsApp. Teks di `frontend/src/content/untukSekolah.ts`.
  - [ ] Latihan Soal.
- [x] Tentang Kami (`/tentang-kami`, desain dari tim: `docs/design/publik/TentangKami-Desktop.webp`, tanpa bagian "Hubungi Kami" karena sudah ada di `/faq`): hero navy dengan maskot di roket dan label Potensi/Arah/Langkah, Our Story, "Your journey, Your orbit" dengan diagram cabang pilihan, enam pilar misi, carousel Meet the Team (3 kartu, geser kiri/kanan, HP 1 kartu), ekosistem kolaborasi, CTA "Ready to find your orbit". Teks di `frontend/src/content/tentangKami.ts`.
  - [ ] Data tim (BELUM DIPASTIKAN): baru 3 dari 11 nama yang diketahui, semua foto belum ada (memakai avatar bawaan).
  - [ ] Ganti teks yang tidak terbaca di pratinjau desain dengan teks resmi, dan ilustrasi "Kebingungan Setelah SMA?" (sementara memakai siswa bingung dari beranda).
- [x] 10E — FAQ (`/faq`) dan Hubungi Kami: hero malam dengan ilustrasi desain dan bola tanda tanya, kategori di kiri (HP: tombol geser) dengan pertanyaan accordion per kategori, kartu Kontak Resmi, form "Kirim Pesan Langsung" yang membuka WhatsApp dengan pesan terisi. Teks di `frontend/src/content/faq.ts`. Menu FAQ dan link footer "Hubungi Kami" (`/faq#kontak`) mengarah ke sini.

### Aturan lama yang tetap berlaku
- **MascotSlot** (hero beranda): maskot versi SVG. Desktop: mata mengikuti kursor. HP: menoleh ke titik sentuhan. Nanti diganti model 3D tanpa mengubah halaman.
- Nomor WhatsApp, email, Instagram, LinkedIn, dan lokasi bertanda "BELUM DIPASTIKAN" di `brand.ts` wajib dicek sebelum rilis.
- "Bagaimana cara mendapatkan akun ORBIDU?" dijawab dengan teks `ACCOUNT_ACCESS` yang sama dengan halaman Masuk.

## 2. Explore Jurusan (`/jurusan`, publik) dan Detail Jurusan (`/jurusan/:slug`)
Acuan desain detail: `docs/design/landing/Jurusan-Detail.dc.html` (desktop).
- Katalog jurusan dikelompokkan **per nama jurusan** (bukan per kampus), masing-masing punya `slug`. Konten dari `JurusanPage` lama dipindah ke `frontend/src/mocks/` (tanpa persentase "match", perkiraan gaji, dan daftar alumni karena tidak bisa dipertanggungjawabkan).
- `/jurusan`: **hero sesuai desain** `docs/design/publik/EksplorJurusan-Desktop.jpg` (langit pagi, matahari, bukit, pohon, awan, bintang; bergerak pelan; tinggi ringkas), judul "Eksplor Jurusan", tab **PTN & PTS / Kedinasan** (`?jenis=kedinasan`), kotak **pencarian**, dan ajakan "Coba ORBIDU Compass" (tamu → Masuk lalu ke Compass; siswa → Compass). Di bawahnya "Semua Jurusan": **filter bidang** (hanya untuk PTN & PTS) dan grid kartu jurusan versi sekarang (kartu sesuai desain menyusul). Chip filter turun ke baris baru kalau tidak muat. Jenis, kata kunci, dan bidang disimpan di URL. Tanpa scroll horizontal.
- `/jurusan/:slug`: sesuai desain detail (tentang jurusan, apa yang dipelajari, prospek karier, kampus yang membuka, mapel pendukung, jalur masuk, ajakan "Cocok nggak sih buatku?" (tamu: tombol "Berlangganan" ke WhatsApp + link "Sudah punya akun? Masuk"), jurusan lain yang mirip). Harus responsif walaupun desain HP-nya belum ada.
- Daftar **"Kampus yang membuka jurusan ini"** diambil dari `ptnService`, dengan **filter jenis kampus** (PTN, PTS, Kedinasan, PTLN) dan **filter kota**.
- Kalau siswa sudah login dan sudah asesmen, kartu jurusan menampilkan **label kecocokan dari Compass** ("Sangat sesuai" atau "Sesuai"), bukan persentase.
- Foto jurusan belum ada: tampil sampul berwarna dengan ikon per bidang. Field `imageUrl` sudah disiapkan untuk foto asli.
- Tombol konsultasi di HP: gelembung teks tampil beberapa detik saat halaman dibuka, lalu mengecil jadi maskot saja supaya tidak menutupi konten. Di desktop gelembung selalu tampil.
- Data: backend belum punya katalog per nama jurusan beserta deskripsi, mapel pendukung, dan prospek karier, juga belum punya data PTS dan PTLN → dummy + catat di `docs/API_CONTRACT.md`.

## 3. Masuk dan Aktivasi akun (`/masuk`, `/aktivasi`)
Acuan desain: `docs/design/auth/Auth-Desktop.dc.html` (1440px) dan `Auth-Mobile.dc.html` (390px); bagian Daftar di desain tidak dipakai lagi (lihat README folder itu). `Brief-Animasi.dc.html` hanya untuk tim animasi. Teks disimpan di `frontend/src/content/auth.ts`; teks cara mendapatkan akun di `frontend/src/content/common.ts` (`ACCOUNT_ACCESS`).
- **Tidak ada pendaftaran mandiri.** ORBIDU hanya untuk siswa yang sudah berlangganan; akun dibuat admin (API_CONTRACT bagian 14). `/daftar` dialihkan ke `/masuk` (halaman asal ikut terbawa).
- **Kerangka (`AuthLayout`, dipakai Masuk dan Aktivasi)**:
  - Desktop (≥1024px): kiri 65% berisi `AuthVideoSlot` setinggi layar (logo ke beranda di kiri atas, "Hi, Bifriends! / Setiap siswa punya orbitnya sendiri." di kiri bawah), kanan 35% berisi form.
  - HP dan tablet: `AuthVideoSlot` menjadi banner 240px di atas form, dengan tombol kembali ke beranda dan logo. Lebar form dibatasi 440px.
  - `AuthVideoSlot`: video autoplay, muted, loop, playsInline, object-fit cover, dengan poster. Path video dan poster (versi desktop dan HP) diatur di `frontend/src/config/authMedia.ts`. Selama file belum ada, tampil ilustrasi maskot, orbit, dan bintang dari desain. Jika `prefers-reduced-motion`, video tidak diputar: yang tampil poster (atau ilustrasi diam). Video gagal dimuat → poster/ilustrasi. Hanya satu versi video yang dipasang sesuai lebar layar.
- **Masuk**: email dan password (bisa ditampilkan/disembunyikan). "Lupa password?" membuka info bahwa reset password sementara dilakukan lewat WhatsApp ORBIDU (link dari `brand.ts`). Di bawah form: "Akunmu dibuat setelah berlangganan. Belum punya akun? **Hubungi tim ORBIDU**." (link WhatsApp dengan pesan berlangganan). Mode dummy menampilkan akun demo `siswa@orbita.id` (siswa aktif) dan `dimas@orbita.id` (login pertama), password `password123`.
- **Aktivasi (`/aktivasi`), login pertama**: akun dibuat admin dengan password awal, jadi sebelum membuka portal siswa wajib:
  1. **Ganti password**: password baru dan ulangi. Minimal 8 karakter, campuran huruf dan angka (aturan sama dengan Profil, `frontend/src/lib/password.ts`), dan berbeda dari password awal (dicek server).
  2. **Dua persetujuan terpisah, keduanya wajib**: "Orang tua/wali sudah mengetahui dan menyetujui aku memakai ORBIDU." dan "Aku setuju dengan Syarat & Ketentuan dan Kebijakan Privasi ORBIDU." (teks tebal biasa sampai halamannya ada). Waktu masing-masing dicatat server.
  - Langkah yang sudah beres dilewati ("Langkah 1 dari 2", "Langkah 2 dari 2"). Saat pindah langkah, fokus pindah ke judul baru. Ada tombol "Bukan akunmu? Keluar".
  - Selama aktivasi belum selesai, semua halaman portal (dan `/masuk`) diarahkan ke `/aktivasi` (`RequireAuth`, `frontend/src/lib/activation.ts`).
  - **Mode backend**: backend belum mengirim `mustChangePassword`, `parentConsentAt`, dan `termsAcceptedAt`. Selama field itu tidak ada, aktivasi dilewati dan akun langsung masuk portal.
- **Validasi**: pesan per field di bawah input dan fokus pindah ke field salah paling atas. Error dari server tampil di banner merah `role="alert"` ("Email atau password salah.") dan input email diberi border merah. Tombol kirim menampilkan status loading dan tidak bisa diklik dua kali.
- **Aksesibilitas**: label di setiap input dan kotak centang, autocomplete (`email`, `current-password`, `new-password`), cincin fokus kuning.
- Setelah berhasil masuk (dan aktivasi selesai) → `/portal` atau halaman asal. Kalau status `baru`, langsung ke Analisis Potensi.
- Tombol konsultasi tidak tampil di halaman ini.
- Data: kebutuhan backend (register khusus admin, pembuatan akun siswa, penanda ganti password, persetujuan) → `docs/API_CONTRACT.md` bagian 1.2, 2.4, 2.5, dan 14.

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
  - Rencana hari ini: latihan soal Action Plan hari ini (sumber sama dengan bagian 9), dengan cincin progres, jumlah latihan selesai, perkiraan menit tersisa, dan daftar latihan (desktop 4, HP 3, sisanya "+N latihan lainnya"). Bukan hari belajar → "Latihan berikutnya: <hari, tanggal>, N latihan".
  - Performa latihan: radar 7 subtes SNBT (PU, PPU, PBM, PK, LBI, LBE, PM) dari tryout terakhir dengan subtes terlemah ditandai oranye, skor terakhir dan selisihnya, lalu hasil terakhir Siap SNBT, TKA, dan SKD ("Mulai" jika belum ada). "Lihat performa" membuka tab Performance Siap SNBT. Sumbernya sama dengan Siap SNBT/TKA/SKD (bagian 10); baris TKA memakai nilai tryout TKA terakhir atau akurasi latihan berlabel jika belum pernah tryout; baris SKD hanya jika Siap SKD relevan.
  - ORBIDU Compass: bidang yang paling selaras dan 3 jurusan teratas dengan label "Sangat sesuai"/"Sesuai" (tanpa persentase), menuju `/jurusan/:slug`.
  - Timeline seleksi (selalu tampil): 5 agenda mulai bulan ini, dengan catatan "Jadwal perkiraan. Jadwal resmi mengikuti SNPMB dan instansi terkait."
  - Explore Jurusan → `/jurusan`.
- **Per status**:
  - `baru`: Rencana, Performa, dan Compass terkunci (kerangka abu-abu buram, tanpa angka contoh). Hero berisi satu CTA besar "Isi Gambaran Minat Bakat".
  - `sudah_asesmen`: Compass terbuka. Rencana mengajak "Atur rencana belajar" kalau belum punya rencana. Performa kosong dengan ajakan "Mulai latihan pertama".
  - `aktif`: semua terisi. Hero menampilkan progres latihan hari ini, chip kelas, dan fokus belajar.
- Semua kartu punya kondisi memuat, gagal (dengan "Coba lagi"), dan kosong yang jujur.
- Data: rencana belajar (API_CONTRACT bagian 11), riwayat latihan, timeline, notifikasi, dan nama panggilan belum ada di backend → API_CONTRACT bagian 7. Dengan backend asli, status `aktif` belum bisa muncul.

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
Acuan desain: `docs/design/portal/Portal-Beasiswa.dc.html`. Teks di `frontend/src/content/beasiswa.ts`. Menu ORBIDU Compass ikut aktif di halaman ini (breadcrumb Dashboard › ORBIDU Compass › Explore Beasiswa).
- **Data**: contoh data di `frontend/src/data/beasiswa.ts` (6 jenis beasiswa), dengan label "Contoh data, menunggu data resmi dari tim" di halaman. Situs resmi yang belum pasti ditandai "BELUM DIPASTIKAN".
- **Filter** (panel kiri di desktop; tombol "Filter" yang membuka lembar dari bawah di HP, dengan tombol "Lihat N beasiswa"):
  - "Cocok dengan jalurku" (switch), jenjang (S1, D3/D4), lokasi kuliah (dalam/luar negeri), jenis bantuan (biaya kuliah penuh/sebagian, biaya hidup, ikatan dinas), dan "Hanya yang disimpan". Setiap pilihan menampilkan jumlah hasilnya.
  - Pencarian nama beasiswa atau penyelenggara, jumlah hasil, "Atur ulang", dan empty state "Belum ada beasiswa yang cocok dengan filtermu".
  - Semua filter tersimpan di URL, mis. `?jenjang=s1&lokasi=dalam-negeri&bantuan=biaya-hidup&cocok=1&disimpan=1&q=kip`.
- **"Cocok dengan jalurmu"** hanya melihat jalur pendidikan (dan jenjangnya) dari ORBIDU Compass, dengan catatan kelayakan bahwa penyelenggara yang menentukan. Status `baru` atau belum ada hasil Compass → switch nonaktif dengan alasannya, dan `?cocok=1` diabaikan.
- **Simpan**: tombol penanda di kartu dan jendela detail; tetap tersimpan setelah refresh (mode dummy di data dummy, mode backend di browser per akun).
- **Jendela detail** (komponen Dialog): cakupan, syarat utama, dokumen yang biasanya diminta, periode, tombol simpan, dan "Kunjungi situs resmi" (tab baru, `rel="noopener noreferrer"`). Tanpa situs resmi → keterangan untuk mencari dari penyelenggara.
- **Di halaman Compass**: "Beasiswa yang bisa kamu coba" menampilkan maksimal 3 beasiswa yang cocok dengan jalurmu (aturan sama), dengan tombol ke `/portal/beasiswa?cocok=1`.
- Data: backend belum punya katalog beasiswa dan beasiswa tersimpan → API_CONTRACT bagian 10.

## 9. Action Plan (`/portal/action-plan`)
Acuan desain: `docs/design/portal/Portal-ActionPlan.dc.html`. Teks di `frontend/src/content/actionPlan.ts`. Semua tugas berupa **latihan soal yang disusun AI** di hari belajar yang dipilih siswa. Tidak ada tugas manual atau tugas Personal.
- **Tiga kondisi**:
  - Terkunci (status `baru`): ajakan isi Gambaran Minat Bakat.
  - Belum ada rencana: hero "Susun rencana belajarmu" dengan 3 langkah dan tombol "Atur rencana".
  - Aktif: ringkasan minggu ini, kalender, dan daftar latihan per tanggal.
  - Kepala halaman: tombol "Cek ORBIDU Compass" (target jurusan tidak ditampilkan) dan, saat aktif, "Atur ulang rencana".
- **Kategori latihan**: SNBT (7 subtes), TKA (mapel wajib Matematika, Bahasa Indonesia, Bahasa Inggris + mapel pilihan siswa), Kedinasan (TWK, TIU, TKP).
- **Ringkasan minggu ini** (Senin–Minggu): progres per fokus, persentase minggu ini, jumlah latihan selesai, dan jumlah hari belajar.
- **Kalender**: cara utama melihat latihan.
  - Warna tanggal: Selesai (hijau), Belum selesai (merah muda), Hari ini (biru), Terjadwal (kuning). Titik kategori: SNBT biru, TKA oranye, Kedinasan ungu.
  - Navigasi bulan dibatasi dari awal sampai akhir rencana. Tombol panah memindah tanggal (±1 hari, ±1 minggu). Hari ini ditandai `aria-current="date"`.
  - Laptop (≥1024px): kalender `sticky` di bawah header saat daftar latihan di-scroll. HP: kalender di atas daftar, tidak sticky; klik tanggal menggulir ke daftar latihan.
- **Daftar latihan per tanggal**: judul, kategori, jumlah soal, perkiraan menit, dan cincin progres hari itu.
  - Selesai: "16 dari 20 benar" + "Lihat pembahasan".
  - Sedang dikerjakan: progres soal + "Lanjutkan".
  - Belum dikerjakan: "Kerjakan".
  - Hari yang sudah lewat tetap bisa dikerjakan. Tanggal yang akan datang terlihat tapi terkunci ("Terbuka Jumat").
  - Tombol sementara mengarah ke halaman Siap SNBT/TKA/SKD; halaman pengerjaan soal dibangun di Fase 7.
  - Tanggal kosong: "Rencana belajar belum dimulai", "Bukan hari belajar", atau "Rencana belajar sudah selesai". Kalau hari ini bukan hari belajar, tampil juga latihan berikutnya ("Latihan berikutnya: Senin, 5 Oktober, 3 latihan") dengan tombol untuk melihatnya.
- **Jendela "Atur rencana / Atur ulang rencana"**:
  - Fokus maksimal 2. Kedinasan diberi catatan "Kurang selaras dengan profilmu" kalau Compass tidak merekomendasikannya, tapi tetap bisa dipilih.
  - Kalau TKA dipilih: **mapel pilihan TKA** (maks. 2) dipilih siswa sendiri dari daftar mapel pilihan TKA. Saran awal (label "Saran") diambil dari mapel pendukung jurusan rekomendasi Compass, lalu nilai rapor tertinggi; keputusan tetap di siswa.
  - Hari belajar (jumlah per minggu dihitung otomatis), durasi (sampai UTBK-SNBT/TKA dengan bulan perkiraan dari timeline seleksi Dashboard, 4 minggu, atau 8 minggu), waktu belajar per hari (30/60/90 menit), dan perkiraan jumlah latihan per minggu.
  - Rencana pertama berlaku mulai hari ini. Rencana yang diatur ulang berlaku mulai besok: hari ini dan riwayat hari yang sudah lewat tidak berubah.
- **Penyusun latihan (simulasi AI, `frontend/src/data/actionPlanEngine.ts`)**:
  - 30/60/90 menit → 2/3/4 latihan per hari belajar. Kategori bergiliran di antara fokus.
  - Subtes/mapel dipilih acak berbobot (1 − skor)², jadi skor terendah dapat porsi lebih. Skor diambil dari hasil latihan di rencana; kalau belum ada, dari tryout SNBT terakhir atau nilai rapor; kalau belum ada juga, dianggap sama.
  - Acaknya tetap per tanggal (isi tidak berubah saat halaman dibuka ulang). Hari ini dan hari yang sudah lewat dibekukan; hari yang akan datang menyesuaikan hasil terbaru.
- **Dashboard**: kartu "Rencana hari ini" dan hero memakai sumber yang sama (`actionPlanService.getTodayPlan`), jadi isinya hanya latihan soal. Kalau hari ini bukan hari belajar, kartu menampilkan latihan berikutnya.
- **Mode Demo**: Aktif = punya rencana contoh desain (mulai Senin 14 September 2026, Sen/Rab/Jum/Min, fokus SNBT + TKA, hari ini 5 latihan dengan 2 selesai). Sudah Asesmen = belum ada rencana (rencana disimpan dulu, kembali saat pindah ke Aktif). Baru = terkunci.
- Data: endpoint `/action-plans` berisi tugas manual dan tidak dipakai. Mode backend menyimpan rencana di browser per akun sampai endpoint baru tersedia → API_CONTRACT bagian 11.

## 10. Persiapan
Acuan desain: `docs/design/portal/Portal-SiapSNBP.dc.html`, `Portal-SiapUjian.dc.html`, `Portal-Pengerjaan.dc.html`, `Portal-Laporan.dc.html`. Teks di `frontend/src/content/siapSnbp.ts`, `siapUjian.ts`, dan `pengerjaan.ts`. Angka dan nama subtes tidak ditulis di teks; semuanya dihitung dari data.

### Siap SNBP (`/portal/persiapan/snbp`)
- Catatan eligible di atas dengan status yang diisi siswa sendiri (Menunggu pengumuman sekolah / Eligible / Tidak eligible). Tidak eligible → ajakan ke Siap SNBT.
- Tiga langkah: Input data → Review → Hasil. Isian dan hasil terakhir tersimpan.
- **Input:**
  - A. Rapor semester 1–5 otomatis (`raporService`); semester yang belum ada ditandai "Belum ada". Rapor kosong → tombol lanjut nonaktif dengan alasannya.
  - B. Nilai TKA opsional (0–100): mapel wajib + mapel pilihan dari pengaturan Action Plan.
  - C. Prestasi maks. 3 dari `achievementService`; prestasi tanpa sertifikat ditandai.
  - D. Pilihan prodi 1 (wajib) dan 2 (opsional) dari kampus PTN Akademik, PTN Vokasi, dan PTKIN (`ptnService`), dengan catatan bahwa peserta SNBP mengikuti ketentuan resmi SNPMB. Pilihan 1 terisi dari target prodi di profil → target jurusan Compass → kosong, dengan label sumbernya.
- **Hasil** per pilihan: Aman / Waspada / Berisiko (tanpa persentase), faktor naik/turun hanya dari data yang ada, strategi dan saran, "Jadikan target prodi" (`PUT /profile`), catatan "Ini estimasi, bukan jaminan" wajib tampil. Simulasi penilaian sementara di `frontend/src/data/snbpEngine.ts`; daya tampung dan keketatan prodi belum dihitung (API_CONTRACT 12.2).

### Siap SNBT, Siap TKA, Siap SKD (`/portal/persiapan/:ujian?tab=latihan|tryout|performance`)
Satu template (`SiapUjianPage`), konfigurasi per ujian di `content/siapUjian.ts`:
- SNBT: PU, PPU, PBM, PK, LBI, LBE, PM. TKA: Matematika, Bahasa Indonesia, Bahasa Inggris + mapel pilihan dari Action Plan. SKD: TWK, TIU, TKP.
- Kepala halaman dengan chip jadwal dari timeline seleksi. Tab tersimpan di URL dan bisa digeser dengan tombol panah.
- **Latihan Soal:** kartu latihan hari ini dari Action Plan (ujian ini saja), lalu kartu per subtes/mapel dengan jumlah soal dan akurasi; akurasi terendah diberi label "Paling perlu dilatih". "Mulai latihan" membuka latihan bebas.
- **Tryout:** paket terbuka berurutan (selesai → skor + "Lihat laporan", berikutnya → "Kerjakan", sisanya terkunci), aturan tryout, catatan skala skor.
- **Performance:** skor tryout terakhir + kenaikan, akurasi latihan, "Paling perlu dilatih", tren skor tryout, skor per subtes tryout terakhir, catatan skala skor. Tidak ada perbandingan dengan skor target jurusan.
- **Siap SKD** selalu tampil di menu Persiapan (desktop dan bottom sheet HP). Relevan = Compass merekomendasikan Kedinasan atau fokus Action Plan berisi Kedinasan (`frontend/src/lib/persiapan.ts`); jika tidak relevan (dan sudah ada hasil Compass), item menu diberi keterangan "Kurang selaras dengan profilmu". Baris SKD Dashboard dan "Langkah selanjutnya" Compass tetap hanya tampil jika relevan.

### Pengerjaan soal (tanpa menu portal)
- Route: `/portal/latihan/:id` (latihan Action Plan atau sesi latihan bebas), `/portal/latihan/bebas?ujian=&subtes=` (mulai latihan bebas), `/portal/tryout/:paket`.
- **Mode Latihan:** pilih jawaban → "Cek jawaban" → benar/salah + pembahasan langsung. Nomor soal hijau/merah. Jawaban yang sudah dicek dikunci dan tidak bisa diubah, termasuk lewat refresh. Soal yang belum dijawab tidak dihitung benar.
- **Mode Tryout:** timer per subtes, Ragu-ragu, nomor soal (dijawab/belum/ragu-ragu), konfirmasi selesai yang menyebut jumlah soal belum dijawab dan ragu-ragu, konfirmasi keluar. Tidak ada pembahasan selama tryout.
  - Timer dihitung dari deadline yang disimpan saat subtes dimulai, jadi refresh atau menutup halaman tidak mereset waktu. Subtes yang waktunya habis saat halaman ditutup langsung dikumpulkan saat dibuka lagi. Waktu subtes berikutnya mulai saat subtes itu dibuka.
  - Jawaban dan ragu-ragu tersimpan otomatis setiap berubah.
  - Paket terkunci ditolak dan diarahkan ke tab Tryout dengan pesannya; paket yang sudah selesai diarahkan ke laporan.
- **Kunci jawaban** tidak pernah ada di data soal yang dikirim ke halaman pengerjaan. Penilaian dilakukan "server" (`frontend/src/data/practiceServer.ts`), seperti seharusnya di backend (API_CONTRACT 12.5–12.6).
- HP: nomor soal dibuka lewat tombol "Nomor soal" (bottom sheet).

### Hasil latihan dan laporan tryout
- `/portal/latihan/:id/hasil`: jawaban benar, tidak dijawab, akurasi, pembahasan (saringan Salah / Tidak dijawab / Semua). Latihan bebas punya tombol "Latihan lagi".
- `/portal/tryout/:paket/laporan`: skor + kenaikan dari tryout sebelumnya, jumlah benar, tidak dijawab, waktu dipakai, hasil per subtes (label "Terendah"), "Fokus berikutnya" ke Action Plan (subtes terendah dan terkuat dihitung dari laporan), pembahasan dengan saringan Salah / Ragu-ragu / Tidak dijawab / Semua dan pilihan subtes.

### Satu sumber data hasil latihan
`practiceService` + `soalService`: hasil latihan Action Plan memperbarui latihan itu di Action Plan; latihan bebas dan tryout masuk riwayat latihan. Dari sumber yang sama dihitung progres Action Plan, akurasi dan tryout di Siap SNBT/TKA/SKD, kartu Performa Dashboard, dan bobot subtes terlemah di Action Plan.

### Data contoh
- Bank soal contoh 75 soal di `frontend/src/data/soal/` (SNBT 5 × 7 subtes, TKA 5 × 3 mapel wajib + Matematika Tingkat Lanjut dan Fisika, SKD 5 × 3 tes; TKP dinilai 1–5 poin per pilihan). Mapel pilihan TKA lain tampil "Soal contoh untuk mapel ini belum tersedia".
- Satu sesi latihan berisi 5 soal (`SESSION_SIZE` di `frontend/src/config/practice.ts`); durasi per soal per ujian di file yang sama (SNBT 90 detik, TKA 120 detik, SKD 60 detik).
- Semua paket tryout contoh memakai soal yang sama. Riwayat contoh (Action Plan dan Tryout Diagnostik/#1) disusun dari jawaban atas bank contoh, jadi pembahasannya bisa dibuka.

## 11. Profil (`/portal/profil`)
Acuan desain: `docs/design/portal/Portal-Profil.dc.html`. Teks di `frontend/src/content/profil.ts`; data lewat `frontend/src/services/profileService.ts`.
- **Data diri diisi pihak kurikulum sekolah dan hanya bisa dibaca siswa**, ditampilkan sebagai daftar label–nilai (bukan kotak isian). Field kosong ditulis "Belum diisi sekolah", tanpa nilai contoh. Kotak info di atas menjelaskan hal ini dan tanggal "Diperbarui sekolah …".
- **Yang bisa diubah siswa hanya:**
  - nama panggilan (maks. 20 karakter, tidak boleh kosong; dipakai sapaan Dashboard; "Nama panggilan disimpan" baru tampil setelah tersimpan),
  - foto profil (JPG/PNG, maks. 2 MB; dikecilkan ke 256 px; ikut tampil di avatar header),
  - password, lewat jendela Ganti password (password sekarang dicek, password baru min. 8 karakter campuran huruf dan angka dan berbeda dari yang lama, ulangi harus sama).
- **Kolom kiri** (sticky di laptop, paling atas di HP): kartu identitas (foto, nama, kelas · sekolah, nama panggilan), Akun ORBIDU (email akun saja, ganti password, status persetujuan orang tua/wali), pintasan "Prestasi dan nilai rapor" ke Analisis Potensi.
- **Kolom kanan:**
  - Data diri: nama lengkap, jenis kelamin, tempat dan tanggal lahir, NIS, NISN, agama, kelas, sekolah (SMA).
  - Alamat tempat tinggal: alamat lengkap, RT/RW, kelurahan/desa, kecamatan, kota/kabupaten, provinsi (salah satu dari 38 provinsi), kode pos.
  - Kontak dan orang tua/wali: HP siswa, HP orang tua/wali, nama dan pekerjaan ayah, nama dan pekerjaan ibu, nama wali.
  - Kondisi keluarga: status orang tua, tinggal bersama, pendidikan ayah dan ibu, kondisi sosial ekonomi, bantuan pendidikan, anak ke-/jumlah saudara.
  - Kondisi khusus: berkebutuhan khusus (beserta jenisnya), buta warna, catatan tambahan.
  - Kondisi keluarga dan kondisi khusus disembunyikan secara default dengan tombol Tampilkan/Sembunyikan (`aria-expanded`) dan keterangan "Hanya terlihat olehmu, guru BK, dan wali kelas".
- **Tidak ada di Profil:** tab Prestasi dan Nilai Rapor (ada di Analisis Potensi), jurusan (IPA/IPS), email kedua, golongan darah, riwayat penyakit, dan bar simpan.
- **HP:** satu kolom, kartu identitas di atas, daftar label–nilai satu kolom.
- **Mode Demo:** akun siswa berisi data lengkap (SMA Negeri 1 Palembang); akun Budi sebagian kosong.
- **Dengan backend asli:** hanya nama, email, kelas, sekolah, dan kota yang tampil; field lain "Belum diisi sekolah". Nama panggilan dan foto disimpan di browser per akun ("Tersimpan di perangkat ini"); ganti password dinonaktifkan dengan catatan; status persetujuan "belum bisa ditampilkan". Kebutuhan backend → API_CONTRACT bagian 13.

## Fase pengerjaan
- [x] Fase 0 — Audit frontend (tanpa mengubah kode)
- [x] Fase 1 — Fondasi: design token, lapisan services + mocks + saklar dummy, status siswa + Mode Demo, routing, kerangka portal, API_CONTRACT.md awal
- [x] Fase 2 — Landing + Explore Jurusan
- [x] Fase 3 — Masuk & Daftar (Daftar dihapus, diganti Aktivasi akun saat login pertama)
- [x] Fase 4 — Dashboard + Analisis Potensi
- [x] Fase 5 — ORBIDU Compass + Explore Beasiswa
- [x] Fase 6 — Action Plan
- [x] Fase 7 — Persiapan
- [x] Fase 8 — Profil
- [x] Fase 9 — Finishing: cek tampilan HP, empty state, konsistensi angka antarhalaman, rapikan API_CONTRACT.md (Tahap 9A: build backend bersih, halaman error, sesi berakhir, kontras, judul tab; Tahap 9B: konsistensi teks, aset, bersih-bersih kode)
- [ ] Fase 10 — Situs publik baru (lihat bagian 1, Tahapan)

## Sebelum rilis
Hal yang sengaja ditunda dan wajib dibereskan sebelum ORBIDU dipakai siswa:
- Halaman **Syarat & Ketentuan** dan **Kebijakan Privasi** wajib dibuat. Setelah itu, teks keduanya di kotak persetujuan halaman Aktivasi (`AKTIVASI.consent.terms` di `frontend/src/content/auth.ts`, sekarang teks tebal biasa) diubah menjadi link.
- Nomor WhatsApp resmi wajib diisi di `brand.ts` sebelum tombol **Berlangganan** bisa dipakai (sekarang masih nomor contoh).
- Backend: register khusus admin, endpoint admin membuat akun siswa (satuan dan massal), penanda `mustChangePassword`, dan penyimpanan dua persetujuan (`docs/API_CONTRACT.md` bagian 1.2, 2.4, 14). Setelah itu alur Aktivasi juga berjalan di mode backend.
- Nomor WhatsApp, email, Instagram, dan LinkedIn bertanda "BELUM DIPASTIKAN" di `frontend/src/config/brand.ts` wajib dicek (dipakai juga oleh "Lupa password?").
- Backend menyimpan persetujuan orang tua/wali beserta waktunya (`docs/API_CONTRACT.md` bagian 2.4).
- Ganti soal placeholder di `frontend/src/data/asesmen.json` dengan 42 soal final dari Bu Putri (ubah `status` menjadi `"final"`), lalu pastikan jumlah bagian/soal yang disebut di beranda (`frontend/src/content/landing.ts`), FAQ, dan Dashboard ("7 bagian, bisa dicicil") sesuai.
- Penilaian skor 5 dimensi dipindah ke backend dan disetujui Bu Putri (`docs/API_CONTRACT.md` bagian 3.4). Sebelum itu, rekomendasi Compass dari tes hanya untuk demo.
- Ganti contoh data beasiswa (`frontend/src/data/beasiswa.ts`) dengan data resmi dari tim, cek ulang alamat situs resmi (KIP Kuliah bertanda "BELUM DIPASTIKAN"), lalu hapus label "Contoh data" (`SCHOLARSHIPS_ARE_SAMPLES`).
- Action Plan memakai endpoint backend (`docs/API_CONTRACT.md` bagian 11), bukan penyimpanan browser, supaya rencana dan progres latihan terbawa ke perangkat lain.
- Ganti bank soal contoh (`frontend/src/data/soal/`) dengan bank soal resmi dari tim data: soal berbeda per paket tryout, cukup untuk sesi 20 soal (SNBT/SKD) dan 15 soal (TKA), lalu kembalikan `SESSION_SIZE` dan hapus label "Contoh soal".
- Rumus rasionalisasi SNBP dan skor tryout (sekarang perkiraan sementara) disetujui tim, dan latihan/tryout memakai endpoint backend (API_CONTRACT 12.5–12.6) supaya kunci jawaban tidak pernah ada di browser.
- Data kondisi keluarga dan kondisi khusus di Profil baru boleh diisi data asli siswa setelah celah keamanan di `BACKEND_MAP.md` bagian 6 ditutup (endpoint admin terbuka tanpa cek peran, `passwordHash` terkirim di respons). Lihat `docs/API_CONTRACT.md` bagian 13.4.
- Profil memakai endpoint backend untuk nama panggilan, foto, dan ganti password (`docs/API_CONTRACT.md` bagian 13.3), bukan penyimpanan browser.
- `og:url` di `frontend/index.html` diisi setelah subdomain demo tersambung. `og:image` menunggu gambar 1200×630 dari Riza.
- Bank soal contoh beserta kunci jawabannya masih ikut di build mode backend (`frontend/src/data/practiceServer.ts` dan `frontend/src/data/soal/`). Hilang setelah latihan dan tryout memakai endpoint backend (`docs/API_CONTRACT.md` 12.5–12.6).
- Font aksen Pecita sementara dimatikan (memakai Caveat). Nyalakan lagi setelah file dan lisensinya ada; caranya di komentar `frontend/src/styles/fonts.css`.
