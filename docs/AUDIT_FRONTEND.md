# Audit Frontend ORBITA (Fase 0)

> Dasar audit: `CLAUDE.md`, `docs/SPEK_SISWA.md`, `BACKEND_MAP.md`, dan seluruh isi `frontend/`.
> Dikerjakan pada 2026-09-28. Tidak ada file kode yang diubah.
> Build dicoba ke folder sementara (bukan `frontend/dist`) dan **berhasil**.

---

## Ringkasan singkat

- Frontend saat ini adalah **satu aplikasi besar tanpa router**. Perpindahan halaman memakai `useState` di `App.tsx`, sehingga URL tidak pernah berubah.
- **Hampir semua data ditulis langsung di komponen.** Hanya login dan Compass yang memanggil backend, dan hasil Compass pun **tidak ditampilkan**.
- Tampilan sudah banyak dan cukup kaya, jadi bisa dijadikan bahan. Namun strukturnya perlu dibongkar: ada banyak komponen dobel, file dengan 2.000+ baris, dan kode mati.
- Token warna sudah ada di `tailwind.config.js`, tetapi **tidak dipakai sama sekali**. Warna, gradient, dan font ditulis ulang ribuan kali secara inline.

---

## 1. Stack, library, dan cara menjalankan

### Stack

| Bagian | Isi |
|---|---|
| Framework | React 19 + Vite 8 |
| Bahasa | TypeScript (file `.tsx`). Namun `typescript` **tidak terpasang** dan `strict: false`, sehingga error tipe tidak pernah dicek. Vite hanya membuang tipenya. |
| Styling | Tailwind CSS 3 + banyak `style={{ ... }}` inline |
| Lint | oxlint (`npm run lint`) |
| Alias | `@/` → `frontend/src/` |

### Library yang terpasang (`package.json`)

| Library | Dipakai? |
|---|---|
| `react`, `react-dom` | Ya |
| `lucide-react` (ikon) | Ya, banyak |
| `recharts` (grafik) | Ya, di Compass, Rapor, Siap PTN, Siap SKD, dan Latihan TKA |
| `react-router-dom` 7 | **Terpasang tetapi tidak dipakai sama sekali** |
| `tailwindcss`, `postcss`, `autoprefixer` | Ya |

Folder `src/app/components/ui/` berisi **48 komponen shadcn** yang butuh 37 paket (Radix UI, `class-variance-authority`, `cmdk`, `vaul`, `sonner`, dan lain-lain). **Paket-paket itu tidak terpasang.** Build tetap berhasil karena tidak ada halaman yang meng-import komponen tersebut. Kalau salah satunya di-import, build akan gagal.

### Cara menjalankan

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # hasil ke frontend/dist
```

Alamat backend diatur oleh `VITE_API_BASE_URL` (default `http://localhost:5000/api/v1`). Belum ada `.env` maupun `.env.example` di `frontend/`.

Tanpa backend, login otomatis masuk sebagai akun demo "Ahmad Rizki" jika request gagal (`App.tsx:73`). Namun setelah halaman di-refresh, `getMeApi` gagal, token dihapus, dan pengguna terlempar kembali ke landing. Lihat risiko nomor 5.

### Struktur folder saat ini

```
frontend/src/
├── main.tsx                ← render <App />
├── app/
│   ├── App.tsx             ← 2.628 baris: auth, navbar, "router", dan SELURUH halaman Profil
│   ├── *Page.tsx           ← 14 file halaman (total ±17.000 baris bersama App.tsx)
│   └── components/
│       ├── ui/             ← 48 komponen shadcn (tidak dipakai, dependensi belum terpasang)
│       └── figma/ImageWithFallback.tsx
├── imports/                ← hasil ekspor Figma (posisi absolut, tidak responsif)
│   ├── OrbitaHome, OrbitaProfile, OrbitaFaq   ← dipakai di Landing
│   ├── Dashboard, DashboardSebelum, AsideSidebarNavigationShell ← tidak dipakai
│   └── pasted_text/        ← catatan konsep (bukan kode)
├── services/api.ts         ← fetchApi + 25 fungsi API (baru 4 yang dipakai)
└── styles/                 ← index.css, tailwind.css, theme.css (variabel shadcn), fonts.css
```

---

## 2. Halaman yang ada vs peta halaman SPEK

Saat ini tidak ada route. Kolom "Kondisi sekarang" berisi nilai `activePage` di `App.tsx`.

| Route di SPEK | Kondisi sekarang | File sekarang | Usulan |
|---|---|---|---|
| `/` Landing | `landing`, dengan tab internal Home/Profile/FAQ/Explore | `LandingPage.tsx` + `imports/Orbita*` | Tab Profile dan FAQ dilebur menjadi section di `/`. Tab Explore dipindah ke `/jurusan`. |
| `/jurusan` | Tab "Explore" di landing, dan `kampus` di portal | `JurusanPage.tsx` | Satu halaman untuk publik dan portal (lihat risiko nomor 9) |
| `/jurusan/:id` | Detail muncul lewat state `ptnView = "detail"` di dalam `JurusanPage` | `JurusanPage.tsx` | Jadikan route sendiri |
| `/masuk` | `LoginModal` (modal di atas landing) | `App.tsx:57` | Jadikan halaman |
| `/daftar` | **Tidak ada.** Tombol "Daftar" hanya membuka modal login. | – | Buat baru |
| `/portal` | `dashboard` | `DashboardPage.tsx` | – |
| `/portal/analisis-potensi` | `profil` (tab Minat Bakat, Prestasi, Nilai Rapor) | `App.tsx` (`StudentProfiling`) + `RaporPage.tsx` | Pindahkan dari `App.tsx` ke file sendiri |
| `/portal/compass` | `compass` | `CompassPage.tsx` | – |
| `/portal/beasiswa` | **Tidak ada** (hanya 2 kartu beasiswa di Compass) | – | Buat baru |
| `/portal/action-plan` | `action` | `ActionPlanPage.tsx` | – |
| `/portal/persiapan/snbp` | `snbp` → `SiapPTNPage` tab SNBP → `SNBPRationalizationFlow` | `SiapPTNPage.tsx`, `SNBPPage.tsx` | Pisahkan dari Siap PTN |
| `/portal/persiapan/snbt` | `utbk` dan `ptn` → `SiapPTNPage` tab SNBT | `SiapPTNPage.tsx` | Jadikan template bersama |
| `/portal/persiapan/tka` | `tka` | `LatihanTKAPage.tsx` | Jadikan template bersama |
| `/portal/persiapan/skd` | `skd` | `SiapSKDPage.tsx` | Jadikan template bersama |
| (Siap Mandiri "Segera hadir") | `mandiri`, sudah berupa halaman | `SiapMandiriPage.tsx` | Jadikan item menu nonaktif, tanpa route |
| `/portal/profil` | Overlay `InformasiPribadiPage` (tab Data Diri) yang dibuka dari avatar | `App.tsx` (`BiodataForm`) | Jadikan route |
| Di luar cakupan | `konsultasi` | `KonsulasiPage.tsx` | Hapus dari menu. File disimpan dulu. |

**Kode yang tidak terjangkau dari menu mana pun (kode mati):**
- `UTBKPage.tsx` (1.621 baris)
- `SNBPPlannerPage` dan `SNBPPreparationFlow` di `SNBPPage.tsx`, yang ikut membuat `TKAPracticePage.tsx` (1.131 baris) tidak terpakai
- `imports/Dashboard`, `imports/DashboardSebelum`, `imports/AsideSidebarNavigationShell`
- `components/ui/*` dan `default_shadcn_theme.css`

---

## 3. Status tiap halaman terhadap SPEK

Legenda: ✅ sudah sesuai · 🟡 perlu diubah · ❌ belum ada

| # | Halaman | Status | Alasan singkat |
|---|---|---|---|
| 1 | **Landing** | 🟡 Perlu dirombak | Masih memakai navbar dengan 4 tab dan tombol melayang "Masuk ke Portal" (keduanya harus dihapus). Headline berbeda ("Raih Kampus Impianmu"). Belum ada maskot, section Untuk Sekolah, maupun Dasar Ilmiah. Hasil ekspor Figma memakai posisi absolut dan lebar piksel tetap, sehingga tidak responsif. Footer masih "© 2024" (hardcode). |
| 2 | **Explore Jurusan** | 🟡 Perlu diubah | Tampilannya kaya (kartu, detail, alumni, perbandingan), tetapi datanya 100% hardcode (`ALL_JURUSAN`, `DETAIL_DB`, `UNI_DB`, `ALUMNI_DB`). Belum memakai `/ptn/majors`. Belum ada filter kota/jenis kampus, pagination, maupun route detail. Tidak ada kelas responsif sama sekali. |
| 3 | **Masuk & Daftar** | 🟡 / ❌ | Masuk berupa modal sederhana, tanpa layout 65/35, `AuthAnimationSlot`, maupun lupa password. Halaman Daftar belum ada. |
| 4 | **Kerangka portal** | 🟡 Perlu diubah | Header sudah memuat logo, "Student Portal", notifikasi, dan menu akun. Namun: menu bernama "Tryout" (harus "Persiapan"), masih ada Siap UTBK, Konsultasi BK, dan Siap Mandiri yang bisa diklik, dan tidak ada menu Analisis Potensi terpisah. Di HP, menu berupa bottom nav dengan 10 item, bukan drawer. Belum ada overlay gembok maupun status siswa. |
| 5 | **Dashboard** | 🟡 Perlu diubah | Susunan kartu sudah mirip SPEK. Namun semua angka hardcode: tanggal "Sabtu, 19 Juli 2026", sapaan selalu "Selamat pagi", skor 624, dan jurusan 96%. Radar memakai sumbu `PI` (bukan PBM/PPU sesuai 7 subtes SNBT). Belum ada variasi per status. |
| 6 | **Analisis Potensi** | 🟡 Perlu diubah besar | Tab "Tes Minat Bakat" saat ini berisi **tes eksternal lewat guru BK** (hasil "ENFJ", langkah "Jadwalkan Tes"), bukan tes di aplikasi. Kuesioner yang ada ("Refleksi Diri") hanya **23 soal** dalam 7 bagian dengan jenis campuran (Likert, pilihan ganda, ranking), **sudah terisi jawaban contoh**, dan tidak tersimpan. SPEK meminta 42 soal skala 1–5. Prestasi hanya bisa tambah/hapus (belum bisa ubah), tanpa field peringkat, penyelenggara, dan sertifikat. Rapor sudah hanya-baca ✅, tetapi berisi semester 1–6 dengan data hardcode, dan tren hanya menampilkan semester 1–4. |
| 7 | **Orbita Compass** | 🟡 Perlu diubah | Hasil API diambil lalu **dibuang** (`setAnalysis` tidak pernah dibaca). Semua isi hardcode. Masih menampilkan persentase untuk minat/kompetensi dan beasiswa ("eligMatch 94"), padahal SPEK meminta label. Skor Sistem Informasi tidak konsisten (96 di satu bagian, 94 di bagian lain), sementara Dashboard menampilkan 96. Belum ada kondisi terkunci. |
| 8 | **Explore Beasiswa** | ❌ Belum ada | Hanya ada 2 kartu beasiswa hardcode di Compass. |
| 9 | **Action Plan** | 🟡 Perlu diubah | Paling dekat dengan SPEK: sudah ada fokus (SNBT/TKA/Kedinasan), kalender bulanan, modal Re-plan, dan tambah aktivitas. Namun tanggal dan bulan dikunci ("Senin, 24 Agustus", "Agustus 2026"). Belum ada filter Minggu Ini/Terlewat/Belum Selesai/Selesai, geser tugas terlewat, kartu gaya Englishnesia, maupun penyusun tugas otomatis. |
| 10a | **Siap SNBP** | 🟡 Perlu diubah | Alur Input → Review → Analisis → Hasil sudah ada, termasuk TKA wajib/pilihan, prestasi, dan 2 pilihan kampus. Namun input TKA memakai skala **0–1000** (SPEK: 0–100), hasil memakai "Tinggi/Sedang" (SPEK: Aman/Waspada/Berisiko), dan pilihan awal diisi otomatis (UGM dan Unsri). Masih bercampur dengan Siap PTN dan halaman "Cari Tahu". |
| 10b | **Siap SNBT / TKA / SKD** | 🟡 Perlu dirombak | Ketiganya dibuat terpisah dengan kode yang mirip-mirip (tab Latihan, Tryout, dan Performance/Laporan). Belum ada template bersama, TO berurutan, timer + tandai ragu + navigasi nomor secara konsisten, maupun judul "Siap SNBT". Semua soal dan skor hardcode. |
| 11 | **Profil** | 🟡 Perlu diubah | `BiodataForm` sudah memuat sebagian besar field. Namun masih ada golongan darah (harus dihapus) dan "riwayat penyakit" (harus diganti buta warna). Belum ada kunci 🔒 per field maupun tombol simpan melayang. Semua sudah terisi data contoh "Ahmad Rizki Pratama". Masih bergabung dengan tab Prestasi dan Rapor, padahal SPEK memisahkannya. |

---

## 4. Data yang masih hardcode di komponen

Semuanya melanggar aturan data nomor 1 di `CLAUDE.md` dan perlu dipindah ke `services/` + `mocks/`.

| File | Data hardcode |
|---|---|
| `App.tsx` | Daftar booking BK awal, notifikasi (3 item), user demo untuk fallback login, `INIT_REFLEKSI` (jawaban kuesioner terisi), hasil tes eksternal (ENFJ, dan lain-lain), `MAJOR_EVIDENCE`, `CONF` (skor keyakinan), `SAMPLE_ACADEMIC` / `SAMPLE_NON_ACADEMIC` (prestasi), `INIT_FORM` (biodata lengkap Ahmad Rizki), `MATA_PELAJARAN`, opsi kategori/tingkat |
| `DashboardPage.tsx` | Tanggal, sapaan, misi hari ini, nilai radar, skor tryout 624, timeline seleksi (tanggal SNBT/SKD), 3 jurusan teratas beserta persentasenya |
| `CompassPage.tsx` | `EDU_PATHS` (jalur, jurusan, kampus, dan persentase), skor 92% dan 89%, 2 beasiswa, `PROFILE_ITEMS`, langkah loading |
| `JurusanPage.tsx` | `ALL_JURUSAN`, `DETAIL_DB`, `ALL_KEDINASAN`, `KD_DETAIL_DB`, `UNI_DB`, `ALUMNI_DB`, rekomendasi AI dan alasannya |
| `ActionPlanPage.tsx` | `TODAY_DATE = 24`, `MONTH_LABEL`, `FIRST_DAY`, `SCHEDULE` (jadwal satu bulan), progress fokus |
| `RaporPage.tsx` | `RAPOR` (nilai semester 1–6), `TREND_DATA`, rekomendasi AI rapor |
| `SiapPTNPage.tsx` | Materi, submateri, `TKA_DATA`, `UNIVS`, `UNIV_LIST`, `JURUSAN_LIST`, `PASSING_GRADE`, `RADAR_DATA`, `TREND_DATA` |
| `SNBPPage.tsx` | Prestasi terpilih awal, pilihan kampus awal, `GOAL_DATA`, daftar kampus/jurusan, waktu "18 Juli 2026" |
| `LatihanTKAPage.tsx` | `TKA_DATA`, `TREND_DATA`, `PERFORMA`, `RIWAYAT` |
| `SiapSKDPage.tsx` | `MATERI_DATA`, `SCHOOLS`, `SKOR_TREND` |
| `SiapMandiriPage.tsx` | `KAMPUS_LIST`, `MATERI_LIST` |
| `KonsulasiPage.tsx` | `GURU_BK`, slot hari dan jam (di luar cakupan) |
| `imports/Orbita*` | Semua teks landing, "© 2024 ORBITA" |

Satu-satunya data yang benar-benar dari API adalah nama dan kelas pengguna (dari `/auth/me`).

---

## 5. Komponen yang bisa dipakai ulang dan komponen yang dobel

### Dobel (ditulis ulang di beberapa file)

| Pola | Muncul di |
|---|---|
| Radar SVG (`SvgRadar` / `MiniRadar`) | `CompassPage`, `JurusanPage`, `SNBPPage`, `UTBKPage`, `DashboardPage` (5 versi) |
| Segmented control (`SegCtrl`) | `SiapPTNPage`, `SiapSKDPage`, `LatihanTKAPage` |
| Badge status materi + badge tingkat kesulitan | `SiapPTNPage` (`TKAStatusBadge`, `TKADiffBadge`), `LatihanTKAPage` (sama persis), `SiapSKDPage` (`StatusBadge`, `DifficultyBadge`) |
| Modal konfigurasi latihan | `TKAConfigModal` ×2, `ConfigModal` di SKD |
| Pemilih subtes | `TKASubtestPicker` ×2, `SubtestPicker` di SKD |
| Guided learning / daftar materi | `TKAGuidedLearning` (SiapPTN), `GuidedTab` (LatihanTKA), `GuidedLearning` (SKD) |
| Halaman hasil latihan | `HasilLatihanPage` (SiapPTN), `HasilLatihanTKAPage` |
| Halaman "Cari Tahu" | `SiapPTNPage` dan `SiapSKDPage` |
| Grafik tren (`TrendLine`, `SvgLineChart`) | `TKAPracticePage`, `UTBKPage`, `RaporPage` (padahal `recharts` sudah terpasang) |
| Helper `shuffle`, `formatTime` | `TKAPracticePage`, `UTBKPage` |
| `Divider`, `SectionLabel`, `Timeline` | `App.tsx`, `SiapPTNPage` |
| Logo ORBITA dengan gradient | `OrbLogo` di `App.tsx` dan versi teks di `LandingNav` |
| Konstanta `PP`, `BLUE`, `CYAN` | Didefinisikan ulang di hampir setiap file. `BLUE` bahkan punya dua nilai berbeda (`#0965fa` dan `#2563EB`). |

### Kandidat komponen bersama

- **Dasar:** `Card`, `Button` (varian: utama biru, CTA oranye, outline), `Badge`, `SegmentedControl`, `Tabs`, `Modal`, `ProgressBar`, `EmptyState`, `LockedOverlay`, `PageHeader`, `Logo`.
- **Form:** `Field`, `Input`, `Select`, `Textarea` (sudah ada versi lokalnya di `App.tsx:577–600`, tinggal dipindah), `LikertScale` (`App.tsx:616`).
- **Grafik:** `RadarChart` (satu versi), `TrendChart` (pakai recharts).
- **Persiapan:** `SubtestPicker`, `MateriList`, `PracticeConfigModal`, `QuestionRunner` (soal + timer + navigasi nomor + ragu-ragu), `ResultReport`. Kelimanya menjadi isi template `/portal/persiapan/:ujian`.
- **Lainnya:** `AccordionSection` dan `QuestionBlock` (`App.tsx`) untuk tes minat bakat, serta `ImageWithFallback` (`components/figma`) yang cocok dipakai untuk `MascotSlot`.

---

## 6. Apakah warna, gradient, dan font sudah terpusat?

**Belum.**

| Aspek | Temuan |
|---|---|
| Warna | Tailwind sudah punya token yang benar (`space-1/2`, `orbit-1/2`, `sun-1/2`, `cloud`), tetapi **dipakai 0 kali**. Di `src/app` ada **3.204 kode hex** dengan **136 warna berbeda**. Contoh: `#0965fa` ditulis 307 kali. Ada pula warna di luar palet: `#2563EB` sebagai "BLUE" di 3 file, `#0085ff` dan `#0052ff` di Dashboard, ungu `#8b5cf6`/`#7c3aed`, dan `#f59e0b` untuk tombol Daftar. |
| Gradient | 129 `linear-gradient` inline. Gradient biru ditulis dengan minimal 4 variasi (90deg, 135deg, 180deg, dengan/tanpa spasi). Gradient **navy `#15234D → #101A33` tidak dipakai sama sekali**. Landing memakai `rgba(16,20,33,…)`. |
| Font | Poppins dimuat **dua kali** (di `index.html` dan `styles/fonts.css`), dan Inter ikut dimuat walaupun tidak dipakai. `fontFamily: PP` ditulis inline **1.439 kali**, padahal Tailwind `font-sans` sudah Poppins. **Pecita belum ada**: folder `src/assets/fonts/` belum dibuat. |
| Variabel CSS | `styles/theme.css` berisi variabel ala shadcn (`--primary`, `--accent`, dan lain-lain) plus tema `.dark` yang tidak dipakai. `--accent` = oranye, sedangkan `--chart-*` masih warna bawaan shadcn. |
| Radius dan bayangan | Nilai ditulis bebas (`rounded-[20px]`, `rounded-2xl`, `rounded-3xl`, bayangan inline beragam). Belum ada token "kartu". |
| Warna latar | Tidak konsisten: `#f5f6fb`, `#f8f9fc`, `#f8fafc`. |

---

## 7. Risiko dan hal membingungkan sebelum Fase 1

1. **`index.html` memanggil `/src/main.jsx`, padahal filenya `main.tsx`.** Saat ini tetap jalan karena Vite mencocokkan ekstensinya sendiri, tetapi hal ini mudah membingungkan. Sebaiknya diperbaiki.
2. **TypeScript tidak terpasang dan tidak ada pengecekan tipe.** Setiap error tipe baru ketahuan saat runtime. Saran: pasang `typescript` dan tambah script `typecheck`. Ini library baru, jadi **perlu izin**.
3. **Folder `components/ui` (shadcn) adalah jebakan.** Terlihat siap pakai, tetapi 37 paket dependensinya tidak terpasang. Pilihannya: hapus folder itu, atau pasang paketnya (**perlu izin**). Saran saya: hapus, lalu buat komponen dasar sendiri yang sederhana dengan Tailwind.
4. **File raksasa dan kode mati.** `SiapPTNPage` (2.721 baris), `App.tsx` (2.628), dan `SNBPPage` (2.115) sulit diubah dengan aman. Kode mati (bagian 2) sebaiknya dihapus di Fase 1 agar tidak ikut diedit tanpa sengaja. **Perlu persetujuan** sebelum menghapus.
5. **Login demo otomatis saat backend mati** (`App.tsx:73`) bertentangan dengan saklar `VITE_USE_MOCK`. Mode dummy terjadi diam-diam, lalu hilang saat refresh. Di Fase 1, fallback ini diganti dengan saklar yang jelas.
6. **Isi SPEK berbeda dengan kode:**
   - Tes minat bakat di kode adalah tes eksternal dari guru BK plus kuesioner 23 soal campuran, sedangkan SPEK meminta 42 soal skala 1–5. Soal yang ada tidak bisa langsung dipindah ke `asesmen.json` tanpa diubah bentuknya.
   - Belum ada rumus untuk mengubah jawaban tes menjadi 5 skor backend (technology, research, creativity, leadership, communication). Rumus sementara perlu ditentukan.
   - Skala TKA 0–1000 di kode vs 0–100 di SPEK.
   - Sumbu radar Dashboard (`PI`) tidak sesuai 7 subtes SNBT.
7. **Status siswa (`baru`, `sudah_asesmen`, `aktif`) tidak ada di backend.**
   - `sudah_asesmen` bisa ditebak dari ada tidaknya `profile.assessment`.
   - `aktif` tidak bisa ditentukan karena riwayat tryout belum punya endpoint.
   - Riwayat tes per kelas juga belum ada.
   Semuanya perlu dicatat di API_CONTRACT dan disimulasikan di mocks.
8. **Nama panggilan tidak ada di backend.** Sapaan Dashboard sementara memakai kata pertama nama lengkap, sampai field ini tersedia.
9. **`/jurusan` publik vs menu portal "Explore Jurusan".** Perlu diputuskan apakah menu portal membuka `/jurusan` dengan header publik, atau halaman yang sama ditampilkan di dalam layout portal (misalnya `/portal/jurusan`). Saran saya: satu komponen halaman, dan jika pengguna sudah login, halaman itu dibungkus layout portal. URL tetap `/jurusan`.
10. **Keamanan backend yang berdampak ke frontend:**
    - `answerIndex` ikut terkirim dari `/ptn/practice/questions`, jadi frontend wajib menyembunyikannya sampai soal disubmit.
    - `register` menerima field `role`, jadi frontend tidak boleh mengirimnya.
    - Hasil Compass dari backend saat ini masih jawaban cadangan.
11. **Responsif belum siap untuk layar 360px.** Beberapa halaman (Jurusan, Rapor, SKD, Latihan TKA, Mandiri, Konsultasi) tidak punya kelas responsif sama sekali. Hasil ekspor Figma memakai lebar piksel tetap.
12. **Ukuran bundle 1,27 MB dalam satu file JS.** Dengan router, halaman bisa dimuat per bagian (`lazy`) agar landing lebih cepat.
13. **Lokasi file `API_CONTRACT.md` belum ditentukan di CLAUDE.md.** Saran: `docs/API_CONTRACT.md`, bersebelahan dengan SPEK.
14. **File Pecita belum ada.** Sesuai CLAUDE.md, perlu ditanyakan ke Maulana. Sampai filenya ada, token `font-accent` akan jatuh ke font cadangan.
15. `CLAUDE.md`, `BACKEND_MAP.md`, dan `docs/` belum di-commit ke git.

---

## Rencana Fase 1: Fondasi

Tujuan: setelah Fase 1 selesai, aplikasi punya URL sungguhan, satu sumber design token, lapisan data (services + mocks), status siswa + Mode Demo, dan kerangka portal sesuai SPEK. **Isi halaman lama belum dirombak.** Halaman lama hanya "ditempel" ke route barunya agar tetap bisa dibuka. Perombakan isi dilakukan di Fase 2–8.

### Keputusan yang perlu Maulana jawab dulu

1. Boleh menghapus kode mati (`UTBKPage.tsx`, `TKAPracticePage.tsx`, bagian mati di `SNBPPage.tsx`, `imports/Dashboard*`, `imports/AsideSidebarNavigationShell`, `components/ui/`, `default_shadcn_theme.css`)?
2. Boleh memasang `typescript` (dev dependency) untuk pengecekan tipe?
3. File font Pecita: sudah ada atau belum?
4. Lokasi `API_CONTRACT.md`: setuju di `docs/`?

### A. Design token

| File | Aksi | Isi |
|---|---|---|
| `frontend/tailwind.config.js` | Ubah | Tambah `backgroundImage`: `gradient-navy`, `gradient-orbit`, dan `gradient-sun`. Tambah `fontFamily.accent` (Pecita), `boxShadow.card`, `borderRadius.card` (20px), warna `page` (latar portal), dan warna teks (`ink`, `muted`). Hapus token shadcn `sidebar` yang tidak dipakai. |
| `frontend/src/styles/fonts.css` | Ubah | `@font-face` Pecita dari `src/assets/fonts/`. Hapus import Google Fonts yang dobel dan Inter. |
| `frontend/src/styles/theme.css` | Ubah | Rapikan variabel: buang tema `.dark` yang tidak dipakai dan samakan latar. |
| `frontend/index.html` | Ubah | Perbaiki `main.jsx` → `main.tsx`. Poppins dimuat di satu tempat saja. |
| `frontend/src/assets/fonts/` | Buat | Tempat file Pecita (menunggu file). |

### B. Lapisan data: services, mocks, dan saklar dummy

| File | Aksi | Isi |
|---|---|---|
| `frontend/.env.example` | Buat | `VITE_API_BASE_URL`, `VITE_USE_MOCK=true` |
| `frontend/src/services/http.ts` | Buat | `fetchApi` dipindah dari `api.ts`, ditambah penanganan error berbahasa Indonesia |
| `frontend/src/services/config.ts` | Buat | Membaca `VITE_USE_MOCK` dan menyediakan `USE_MOCK` |
| `frontend/src/services/authService.ts` | Buat | `login`, `register` (tanpa `role`), `getMe`, `logout`. Otomatis memakai mock jika `USE_MOCK`. |
| `frontend/src/services/studentService.ts` | Buat | `getProfile` dan `getStudentStatus` (status diturunkan dari data, atau dari mock) |
| `frontend/src/services/ptnService.ts` | Buat | `getMajors` dan `getUniversities` (bentuk sama dengan respons API asli), untuk persiapan Fase 2 |
| `frontend/src/services/api.ts` | Ubah → hapus | Isinya dipindah ke file-file di atas. Import lama diarahkan ulang. |
| `frontend/src/mocks/delay.ts` | Buat | Helper jeda (termasuk 2–3 detik untuk simulasi AI) |
| `frontend/src/mocks/db.ts` | Buat | "Database" dummy di memori + `localStorage`: akun demo, profil, dan status |
| `frontend/src/mocks/authMock.ts` | Buat | Login/daftar dummy dengan respons sama seperti `/auth/login` dan `/auth/register` |
| `frontend/src/mocks/studentMock.ts` | Buat | Profil dummy per status (`baru`, `sudah_asesmen`, `aktif`) |
| `frontend/src/mocks/ptnMock.ts` | Buat | Sampel jurusan dan kampus berbentuk respons `/ptn/majors` dan `/ptn/universities` |

Fungsi fallback login di `LoginModal` dihapus dan diganti dengan saklar ini.

### C. Status siswa dan Mode Demo

| File | Aksi | Isi |
|---|---|---|
| `frontend/src/context/AuthContext.tsx` | Buat | Menyimpan user login, `login`, `logout`, dan memulihkan sesi saat halaman dibuka |
| `frontend/src/context/StudentStatusContext.tsx` | Buat | Status `baru` / `sudah_asesmen` / `aktif` + helper `isLocked(fitur)` |
| `frontend/src/components/dev/DemoModePanel.tsx` | Buat | Panel kecil yang hanya muncul jika `VITE_USE_MOCK=true`, untuk mengganti status |

### D. Routing

| File | Aksi | Isi |
|---|---|---|
| `frontend/src/router.tsx` | Buat | `createBrowserRouter` berisi semua route SPEK, halaman dimuat dengan `lazy` |
| `frontend/src/routes/RequireAuth.tsx` | Buat | Mengalihkan ke `/masuk` jika belum login |
| `frontend/src/main.tsx` | Ubah | `RouterProvider` + provider Auth dan Status |
| `frontend/src/app/App.tsx` | Ubah (dikecilkan) | Navbar, `LoginModal`, dan rangkaian `activePage === ...` dihapus. `StudentProfiling` beserta isinya dipindah apa adanya ke `app/AnalisisPotensiPage.tsx`, dan `BiodataForm` ke `app/ProfilPage.tsx`. |
| Halaman lama yang memakai `onNavigate` | Ubah sedikit | `onNavigate("compass")` diganti `useNavigate()` ke route baru. Isi halaman tidak diubah. |

Pemetaan route sementara (isi masih halaman lama):

| Route | Komponen |
|---|---|
| `/` | `LandingPage` (sementara, dirombak di Fase 2) |
| `/jurusan`, `/jurusan/:id` | `JurusanPage` (sementara) |
| `/masuk`, `/daftar` | Halaman form sederhana (dirombak di Fase 3) |
| `/portal` | `DashboardPage` |
| `/portal/analisis-potensi` | `AnalisisPotensiPage` (hasil pindahan dari `App.tsx`) |
| `/portal/compass` | `CompassPage` |
| `/portal/beasiswa` | `PlaceholderPage` ("Segera dibangun di Fase 5") |
| `/portal/action-plan` | `ActionPlanPage` |
| `/portal/persiapan/snbp` | `SNBPRationalizationFlow` |
| `/portal/persiapan/:ujian` | `snbt` → `SiapPTNPage` (tab SNBT), `tka` → `LatihanTKAPage`, `skd` → `SiapSKDPage` (sementara, sebelum dijadikan template di Fase 7) |
| `/portal/profil` | `ProfilPage` (hasil pindahan dari `App.tsx`) |
| `*` | Halaman 404 berbahasa Indonesia |

### E. Kerangka portal

| File | Aksi | Isi |
|---|---|---|
| `frontend/src/layouts/PortalLayout.tsx` | Buat | Header + menu + `<Outlet />` + `DemoModePanel` |
| `frontend/src/layouts/PublicLayout.tsx` | Buat | Wadah halaman publik (tanpa navbar untuk landing) |
| `frontend/src/components/portal/PortalHeader.tsx` | Buat | Logo + "Student Portal", notifikasi, menu akun (nama, kelas, Profil, Keluar) |
| `frontend/src/components/portal/PortalNav.tsx` | Buat | Menu: Dashboard, Analisis Potensi, Orbita Compass, Action Plan, Persiapan, Explore Jurusan. Menu aktif ditentukan dari URL. |
| `frontend/src/components/portal/PersiapanMenu.tsx` | Buat | Dropdown Siap SNBP/TKA/SNBT/SKD + Siap Mandiri "Segera hadir" (nonaktif) |
| `frontend/src/components/portal/MobileDrawer.tsx` | Buat | Menu HP berupa drawer (mengganti bottom nav) |
| `frontend/src/components/ui/Logo.tsx` | Buat | Satu logo ORBITA untuk semua halaman |
| `frontend/src/components/ui/Card.tsx`, `Button.tsx`, `EmptyState.tsx`, `LockedOverlay.tsx` | Buat | Komponen dasar yang langsung dipakai kerangka portal dan halaman placeholder |
| `frontend/src/app/PlaceholderPage.tsx`, `NotFoundPage.tsx` | Buat | Untuk route yang belum dibangun dan route 404 |

Folder `components/ui` yang baru ini **menggantikan** folder shadcn lama (jika penghapusan disetujui). Jika tidak disetujui, komponen baru akan diletakkan di `components/base/` agar tidak bercampur.

### F. Dokumen

| File | Aksi | Isi |
|---|---|---|
| `docs/API_CONTRACT.md` | Buat | Kebutuhan awal: field status siswa, riwayat asesmen per kelas, nama panggilan, register tanpa `role`, soal tanpa `answerIndex`, dan riwayat tryout |
| `docs/SPEK_SISWA.md` | Ubah | Centang Fase 0 dan Fase 1 |

### Cara mengecek di akhir Fase 1

1. `npm run build` berhasil (ditambah `typecheck` jika TypeScript disetujui).
2. Dengan `VITE_USE_MOCK=true`, aplikasi bisa login tanpa backend. Mode Demo bisa mengganti ketiga status, dan bagian yang terkunci menampilkan gembok.
3. Setiap URL di peta halaman bisa dibuka langsung, tombol back browser berfungsi, dan `/portal/*` mengarah ke `/masuk` jika belum login.
4. Menu aktif sesuai URL, dan drawer HP berfungsi di lebar 360px.
5. Kerangka portal dan komponen baru tidak memakai `fontFamily: PP` atau hex inline, tetapi token Tailwind.
