# Kontrak API: kebutuhan frontend ke backend

> Dokumen ini dikelola oleh tim frontend. Isinya endpoint dan perubahan yang
> **dibutuhkan frontend tetapi belum ada** (atau belum aman) di `backend-api/`.
> Kondisi backend saat ini ada di `BACKEND_MAP.md`.
>
> Selama endpoint di sini belum ada, frontend memakai data dummy di
> `frontend/src/mocks/` dengan bentuk data yang sama seperti tertulis di sini.
> Jadi saat backend siap, cukup ganti isi service di `frontend/src/services/`.

Status: 🔴 belum ada · 🟡 ada tetapi perlu diubah · ✅ sudah sesuai

## Ringkasan

Semua kebutuhan di bawah dikerjakan di `backend-api/` (Naufal), kecuali yang
diberi catatan lain. Detail tiap baris ada di bagian yang disebut.

| Bagian | Isi | Status | Menunggu |
|---|---|---|---|
| 1 | Keamanan: `passwordHash` di respons, register terbuka, endpoint admin tanpa cek peran, cek kepemilikan data, kunci jawaban terkirim | 🔴 | Naufal (prioritas tertinggi) |
| 2 | Auth dan profil: pesan error, nilai bawaan palsu, field profil, dua persetujuan, reset password, token kedaluwarsa 403 | 🔴 🟡 | Naufal |
| 3 | Status siswa, riwayat tes per kelas, simpan jawaban tes, skor 5 dimensi | 🔴 | Naufal; aturan skor dari Bu Putri |
| 4 | Ringkasan kebutuhan per fase | — | — |
| 5 | Catatan bentuk respons: field JSON string, target kampus/prodi tidak cocok di seed | 🟡 | Naufal |
| 6 | Katalog jurusan per nama, kampus pembuka, label kecocokan | 🔴 🟡 | Naufal + tim data |
| 7 | Dashboard: rencana hari ini, hasil latihan, timeline seleksi, notifikasi | 🔴 | Naufal |
| 8 | Analisis Potensi: prestasi lengkap, rapor per semester | 🟡 | Naufal |
| 9 | ORBIDU Compass: target jurusan, kapan analisis ulang, rekomendasi yang bisa dicocokkan | 🔴 🟡 | Naufal |
| 10 | Explore Beasiswa: katalog dan beasiswa tersimpan | 🔴 | Naufal + tim data |
| 11 | Action Plan: pengaturan, latihan harian, hasil per latihan | 🔴 | Naufal |
| 12 | Persiapan: Siap SNBP, rasionalisasi, riwayat latihan, bank soal, tryout | 🔴 | Naufal + tim data (bank soal); rumus disetujui tim |
| 13 | Profil: data diri dari sekolah, hak ubah siswa, nama panggilan/foto/password | 🔴 | Naufal + sekolah |
| 14 | Akun berlangganan: admin membuat akun, wajib ganti password awal | 🔴 | Naufal |
| 15 | Portal Wali Kelas: peran `WALI_KELAS`, profil wali, dashboard kelas, daftar dan detail siswa, impor rapor | 🔴 | Naufal |
| 16 | Portal Guru BK: profil konselor, dashboard sekolah, daftar & detail siswa lintas kelas, catatan konseling | 🔴 | Naufal |
| 17 | Pesan "Hubungi Kami" dari halaman FAQ (publik) | 🔴 | Naufal |

---

## 1. Keamanan (prioritas tertinggi)

Temuan di bawah **tidak bisa diperbaiki dari frontend**. Frontend hanya bisa
menghindari pemakaiannya.

### 1.1 `passwordHash` ikut terkirim di respons 🔴

Hasil pengecekan kode backend (2026-09-28):

| Endpoint | Mengirim `passwordHash`? | Penyebab |
|---|---|---|
| `POST /auth/register` | ✅ Tidak | Field `user` disusun manual (`authController.ts:48`) |
| `POST /auth/login` | ✅ Tidak | Field `user` disusun manual (`authController.ts:89`) |
| `GET /auth/me` | 🔴 **Ya**, terbukti saat uji 2026-09-28 (respons berisi hash bcrypt `$2a$10$…`) | `prisma.user.findUnique` hanya memakai `include`, tanpa `select`, jadi semua kolom `User` ikut terkirim (`authController.ts:107–125`) |
| `GET /admin/users` | ✅ Tidak | Memakai `select` tanpa `passwordHash` (`adminController.ts:47–67`) |
| `PATCH /admin/users/:id/role` | 🔴 **Ya** | Mengembalikan hasil `prisma.user.update` apa adanya (`adminController.ts:83–88`) |
| `GET /bk/bookings` | ✅ Tidak | `student` dan `teacher` memakai `select: { id, name, email }` (`bkController.ts:62–63`) |
| `GET /bk/teachers` | ✅ Tidak | Memakai `select` (`bkController.ts:7–15`) |
| `GET /feedback` | ✅ Tidak | `user` memakai `select: { name, role }` |

**Yang dibutuhkan:**
- `passwordHash` harus dihapus dari **semua** respons backend.
- Cara paling aman: buat satu `select` bersama untuk data user publik (`id, email, name, role, avatarUrl, createdAt, updatedAt`) dan pakai di semua query yang mengembalikan user. Dengan begitu endpoint baru tidak bisa lupa.

**Sementara di frontend:** `authService.getMe()` membuang `passwordHash` sebelum data disimpan ke state.

### 1.2 Register terbuka untuk umum dan menerima field `role` 🔴
- `POST /auth/register` bisa dipanggil siapa saja dan menerima `role` dari body, sehingga siapa pun bisa mendaftar sebagai `ADMIN`.
- **Keputusan tim:** ORBIDU hanya untuk siswa yang sudah berlangganan. **Tidak ada pendaftaran mandiri**; semua akun dibuat admin (bagian 14).
- **Dibutuhkan:** `POST /auth/register` **ditutup untuk publik**: wajib login sebagai `ADMIN` (`requireRole("ADMIN")`), atau dihapus dan diganti `POST /admin/students` (bagian 14.1). `role` tetap tidak boleh diambil mentah dari body siswa; admin yang menentukan peran lewat endpoint admin. Ini sekaligus menutup celah daftar sebagai `ADMIN`.
- **Frontend:** halaman Daftar dan `authService.register` sudah dihapus. Frontend tidak memanggil `POST /auth/register` sama sekali.

### 1.3 Endpoint admin tidak memeriksa role 🔴
- **Dibutuhkan:** middleware `requireRole("ADMIN")` untuk semua `/admin/*`, dan `requireRole("STUDENT" | "BK_TEACHER")` di endpoint yang sesuai.

### 1.4 Tidak ada cek kepemilikan data 🔴
- `DELETE /achievements/:id`, `PATCH/DELETE /action-plans/:id`, `PATCH/DELETE /bk/bookings/:id` hanya memakai `id`.
- **Dibutuhkan:** pastikan data milik user yang login sebelum diubah atau dihapus. Jika bukan miliknya, kirim `404`.

### 1.5 Kunci jawaban ikut terkirim 🔴
- `GET /ptn/practice/questions` mengirim `answerIndex`.
- **Dibutuhkan:** soal dikirim tanpa kunci. Penilaian dan pembahasan dikirim oleh backend **setelah** jawaban disubmit (lihat 5.2).
- **Frontend:** tidak pernah menampilkan kunci sebelum soal disubmit. Halaman pengerjaan hanya menerima soal tanpa kunci; bentuk endpoint pengganti di bagian 12.5–12.6. Sementara `GET /ptn/practice/questions` tidak dipakai.
- **Update PR #6 (Naufal):** `GET /ptn/practice/questions` sudah tidak mengirim `answerIndex`, tetapi kunci jawaban masih bisa diambil lewat endpoint baru di 1.6.

### 1.6 Endpoint pembuat soal AI terbuka untuk umum 🔴
- `POST /ptn/practice/generate-ai` (dari PR #6) bisa dipanggil **tanpa login**. Responsnya berisi soal lengkap dengan `answerIndex` dan `explanation`, termasuk soal yang diambil dari arsip bank soal (`master_questions.json`) saat Gemini tidak dipakai. Dengan `saveToBank: true`, siapa pun juga bisa menambah soal ke tabel `QuestionBank`, dan setiap panggilan bisa memakai kuota Gemini.
- **Dibutuhkan:** `authenticateToken` + `requireRole("ADMIN")` (atau peran tim konten) di endpoint ini. `GET /ptn/practice/blueprints` boleh tetap publik kalau isinya hanya taksonomi tanpa contoh soal berkunci.
- **Frontend:** tidak memakai endpoint ini.

---

## 2. Auth dan profil

### 2.1 Pesan error berbahasa Inggris 🟡
- Contoh: `"Invalid credentials"`. Sementara diterjemahkan di `frontend/src/services/http.ts`.
- **Usulan:** tambah `code` yang stabil di respons error, misalnya `{ "error": "...", "code": "INVALID_CREDENTIALS" }`, supaya frontend tidak bergantung pada teks pesan.

### 2.2 Register mengisi nilai bawaan palsu 🟡
- Jika tidak dikirim, backend mengisi `schoolName: "SMA Negeri 1 Jakarta"`, `grade: 12`, `majorTrack: "IPA"`, dan `city: "Jakarta"`.
- Jurusan SMA tidak ditanyakan, sehingga semua siswa baru tercatat "IPA".
- **Dibutuhkan:** field yang tidak dikirim disimpan kosong (`null`), bukan diisi contoh. Berlaku juga untuk akun buatan admin (bagian 14.1). Jurusan SMA diisi sekolah atau admin.
- **Mode dummy:** akun demo tidak lagi dibuat lewat form Daftar (sudah dihapus).

### 2.3 Field profil yang belum ada 🔴
> **Diperbarui di Fase 8:** bentuk lengkap dan aturan siapa yang boleh mengubah ada di **bagian 13**. Ringkasan di bawah dipertahankan sebagai riwayat.

Dibutuhkan oleh `/portal/profil` (SPEK bagian 11) dan sapaan Dashboard.

`PUT /profile` perlu menerima dan `GET /profile` perlu mengirim:

```jsonc
{
  "nickname": "Rizki",                 // nama panggilan, untuk sapaan Dashboard
  "nis": "2425001234",                 // 🔒 diisi admin
  "nisn": "0087654321",                // 🔒 diisi admin
  "gender": "L",                       // 🔒 "L" | "P"
  "birthPlace": "Jakarta",
  "birthDate": "2008-05-15",
  "religion": "Islam",
  "photoUrl": null,
  "address": { "street": "", "village": "", "district": "", "city": "", "province": "", "postalCode": "" },
  "phone": "0812…",
  "family": {
    "fatherName": "", "motherName": "",
    "fatherJob": "", "motherJob": "",
    "fatherEducation": "", "motherEducation": "",
    "guardianPhone": "",
    "parentStatus": "", "livingWith": "",
    "childOrder": 1, "siblingCount": 2
  },
  "extra": {
    "socioEconomic": null,             // opsional, untuk rekomendasi beasiswa
    "colorBlind": null,                // opsional: true | false | null
    "specialNeeds": null               // opsional
  }
}
```

- Field 🔒 hanya boleh diubah admin. `PUT /profile` dari siswa harus mengabaikannya.
- **Alasan:** SPEK memisahkan data yang diisi sekolah (terkunci) dan data yang diisi siswa.

### 2.4 Persetujuan orang tua/wali dan Syarat & Ketentuan 🔴
Pengguna ORBIDU siswa SMA yang sebagian besar belum dewasa, jadi persetujuan perlu bisa dibuktikan. Karena akun dibuat admin (bagian 14), persetujuan **tidak lagi diberikan saat daftar**, melainkan saat **login pertama** di halaman Aktivasi (`/aktivasi`, SPEK bagian 3). Ada **dua persetujuan terpisah, keduanya wajib**:
1. "Orang tua/wali sudah mengetahui dan menyetujui aku memakai ORBIDU."
2. "Aku setuju dengan Syarat & Ketentuan dan Kebijakan Privasi ORBIDU."

- **Dibutuhkan:**
  - Kolom di `User` (atau `StudentProfile`), masing-masing dengan waktunya sendiri:
    ```jsonc
    {
      "parentConsentAt": "2026-10-09T07:36:06.154Z",  // null = belum
      "termsAcceptedAt": "2026-10-09T07:36:06.154Z",  // null = belum
      "termsVersion": "2026-10"                        // opsional: versi S&K yang disetujui
    }
    ```
  - Endpoint untuk siswa yang sedang login:
    ```
    POST /auth/consent   ← { "parentConsent": true, "termsAccepted": true }
                         → 204
                         | 400 { "error": "Both consents are required", "code": "CONSENT_REQUIRED" }
    ```
    Waktu diisi **server**, bukan dikirim browser. Persetujuan yang sudah tercatat tidak ditimpa.
  - `GET /auth/me` ikut mengirim `parentConsentAt` dan `termsAcceptedAt` (`null` kalau belum).
  - Endpoint portal siswa sebaiknya menolak (`403`, `code: "ACTIVATION_REQUIRED"`) selama salah satu persetujuan masih `null` atau `mustChangePassword` masih `true`, supaya aturan ini tidak hanya dijaga frontend.
- **Frontend:** halaman Aktivasi memanggil `POST /auth/consent`. Selama `/auth/me` belum mengirim kedua field ini, langkah ini **dilewati** di mode backend (`frontend/src/lib/activation.ts`). Mode dummy sudah menyimpan dua waktu persetujuan per akun (`parentConsentAt`, `termsAcceptedAt`). Status persetujuan orang tua/wali juga tampil di kartu Akun halaman Profil (bagian 13.3).

### 2.5 Reset password 🔴
- Belum ada endpoint lupa/reset password. Sementara, "Lupa password?" di halaman Masuk mengarahkan ke WhatsApp ORBIDU dan tim mereset manual. Setelah reset manual oleh admin, akun sebaiknya kembali diberi `mustChangePassword: true` (bagian 14.2).
- **Usulan:** `POST /auth/forgot-password` `{ "email": "..." }` → selalu `200` (tidak membocorkan email terdaftar atau tidak), lalu `POST /auth/reset-password` `{ "token": "...", "password": "..." }` dengan token sekali pakai yang kedaluwarsa.

### 2.6 Token kedaluwarsa dikirim sebagai 403 🟡
- Middleware `auth.ts` mengirim `403 { "error": "Invalid or expired token" }` untuk token yang tidak valid atau kedaluwarsa, padahal itu artinya **belum terautentikasi** (seharusnya `401`). `403` sebaiknya hanya untuk "sudah login tetapi tidak berhak".
- **Dibutuhkan:** token tidak valid/kedaluwarsa → `401`. Pakai `403` hanya untuk akses yang ditolak karena peran atau kepemilikan data (bagian 1.3–1.4).
- **Frontend sementara:** `http.ts` menganggap `401` **dan** `403` dengan pesan `Invalid or expired token`/`Access token required` sebagai sesi berakhir: token dihapus, siswa dibawa ke `/masuk` dengan pesan "Sesimu sudah berakhir", lalu kembali ke halaman tadi (termasuk `?query`) setelah masuk lagi. `403` lain tampil "Kamu tidak punya akses ke bagian ini."

---

## 3. Status siswa dan riwayat asesmen

### 3.1 Status siswa 🔴
- Frontend membutuhkan status `baru` / `sudah_asesmen` / `aktif` untuk mengunci bagian portal (SPEK "Status siswa").
- **Sementara:** diturunkan di frontend (`studentService.getStudentStatus`): ada `profile.assessment` → `sudah_asesmen`, tidak ada → `baru`. Status `aktif` tidak bisa ditentukan karena riwayat latihan/tryout belum punya endpoint, sehingga dengan backend sungguhan status `aktif` belum pernah muncul.
- **Usulan:** tambahkan ke `GET /auth/me` dan `GET /profile`:

```jsonc
{ "studentStatus": "baru" | "sudah_asesmen" | "aktif" }
```

Atau cukup kirim jumlah sesi latihan/tryout (`tryoutCount`), lalu frontend yang menurunkan status.

### 3.2 Riwayat asesmen per kelas 🔴
- Saat naik kelas, status kembali `baru` dan hasil tes lama disimpan sebagai riwayat. Tab Gambaran Minat Bakat menampilkan "Riwayat per kelas": kelas, tanggal, dan bidang paling selaras (tanpa jawaban lama).
- Tabel `Assessment` saat ini unik per profil (hanya 1 hasil) dan tidak menyimpan kelas, jadi riwayat tidak bisa disimpan. Dengan backend asli, riwayat hanya berisi tes terbaru.
- **Usulan:** tambah kolom `grade` dan `completedAt`, hapus batasan unik, lalu tambah endpoint:

```
GET /assessment/history
→ { "latest": { "grade": 12, "completedAt": "2026-09-12T08:00:00Z" },
    "previous": [ { "grade": 11, "completedAt": "2025-08-08T08:00:00Z", "topBidang": "teknologi" } ] }
```

- `topBidang` = bidang jurusan rekomendasi teratas Compass saat tes itu (kunci bidang, lihat `frontend/src/config/bidang.ts`).

### 3.3 Menyimpan jawaban tes 🔴
- Tes disimpan otomatis setiap jawaban berubah, dan siswa bisa melanjutkan dari bagian terakhir. Setelah selesai, "Lihat jawabanku" menampilkan jawaban tes terbaru. `POST /assessment` hanya menerima 5 skor akhir.
- **Sementara:** mode dummy menyimpan draft dan jawaban di data dummy; mode backend menyimpannya di browser (`localStorage`, per akun), jadi hilang jika pindah perangkat.
- **Usulan:**

```
GET /assessment/draft  → { "draft": { "answers": { "s1q1": 4, "s2q1": "Mencari informasi lewat internet", "s2q2": ["Teman"], "s5q3": ["…", "…"] }, "sectionIndex": 4, "savedAt": "…" } | null }
PUT /assessment/draft  ← { "answers": { … }, "sectionIndex": 4 }   → { "draft": { … } }
POST /assessment/submit ← { "answers": { … }, "questionSetVersion": "placeholder-2026-10" }
                       → { "assessment": { …5 skor… }, "grade": 12, "completedAt": "…" }
GET /assessment/answers → { "answers": { … } | null }        // jawaban tes terbaru
```

- Bentuk jawaban: angka 1–5 (skala), teks pilihan (pilihan tunggal), daftar pilihan (pilihan ganda), urutan lengkap (urutan). Id soal mengikuti `frontend/src/data/asesmen.json`.

### 3.4 Penilaian skor 5 dimensi 🔴
- Soal masih **placeholder** (23 soal lama, 7 bagian) sampai 42 soal final dari Bu Putri siap.
- Skor 5 dimensi sekarang dihitung di frontend (`frontend/src/lib/asesmen.ts`, `scoreAnswers`) dengan bobot **sementara** di `asesmen.json`. Aturan ini belum disetujui Bu Putri, jadi rekomendasi Compass dari skor ini hanya untuk demo.
- **Dibutuhkan:** penilaian dipindah ke backend (`POST /assessment/submit` di atas menerima jawaban mentah lalu menghitung skor), dengan aturan yang disetujui Bu Putri.
- `POST /assessment` saat ini mengganti skor `0` dengan `70` (`Number(x || 70)`), sehingga skor nol berubah jadi angka palsu. Frontend sementara memberi skor minimal 20. Backend sebaiknya memvalidasi rentang 0–100 tanpa mengganti nilai.

---

## 4. Kebutuhan per fase

Daftar kebutuhan menurut fase pengerjaan frontend. Bentuk endpoint lengkapnya ada di bagian yang disebut di tiap baris.

| Kebutuhan | Fase | Status |
|---|---|---|
| Katalog jurusan per nama jurusan, data PTS dan PTLN, label kecocokan per jurusan (lihat bagian 6) | 2 | 🔴 |
| Prestasi: ubah, field capaian/penyelenggara, upload sertifikat (lihat bagian 8.1) | 4 | 🔴 |
| Hasil Compass sungguhan (sekarang selalu jawaban cadangan, lihat `BACKEND_MAP.md` poin 10; rincian di bagian 9) | 5 | 🟡 |
| Data beasiswa (daftar, filter, detail, simpan; lihat bagian 10) | 5 | 🔴 |
| Action Plan: pengaturan rencana, latihan harian buatan AI, hasil per latihan (lihat bagian 11) | 6 | 🔴 |
| Siap SNBP: isian tersimpan, status eligible, nilai TKA, rasionalisasi dengan 2 pilihan prodi, daya tampung dan keketatan prodi (lihat bagian 12) | 7 | 🔴 |
| Bank soal lengkap, soal tanpa kunci, paket tryout berurutan, riwayat latihan dan tryout, sesi latihan, timer tryout dari server (lihat bagian 12.4–12.6) | 7 | 🔴 |
| Profil: data diri dari sekolah, nama panggilan, foto, ganti password (lihat bagian 13) | 8 | 🔴 |
| Akun berlangganan: register khusus admin, admin membuat akun siswa (satuan/massal), wajib ganti password awal, dua persetujuan (lihat bagian 1.2, 2.4, 14) | 9 | 🔴 |

---

## 5. Catatan bentuk respons

### 5.1 Field JSON string
- `Reflection.interests`, `Reflection.careerGoals`, dan semua field rekomendasi di `CompassAnalysis` dikirim sebagai **teks JSON** (keterbatasan SQLite).
- Frontend mem-parse-nya di service.
- Jika backend pindah ke PostgreSQL, sebaiknya dikirim sebagai array/objek asli. Beri tahu tim frontend agar service ikut diubah.

### 5.2 Penilaian tryout (lihat 12.6)
- `POST /ptn/practice/submit` yang ada menghitung skor dari jumlah soal yang **dijawab**, bukan yang benar. Frontend tidak memakainya.
- Bentuk penilaian yang dibutuhkan (dinilai di server, skor per subtes, kunci dan pembahasan hanya setelah selesai) sudah dirinci di **bagian 12.6**. Bagian ini tidak lagi punya bentuk respons sendiri supaya tidak ada dua versi.

### 5.3 Target kampus dan prodi tidak saling cocok (data seed)
- Di seed backend, akun `siswa@orbita.id` punya `targetPtn` Universitas Indonesia, tetapi `targetMajor`-nya milik kampus lain (`targetMajor.universityId` ≠ `targetPtnId`). Penyebabnya, `seed.ts` mencari prodi dengan `findFirst({ name: { contains: "Komputer" } })` tanpa menyaring kampus.
- **Dibutuhkan:** `PUT /profile` memastikan `targetMajorId` milik `targetPtnId`, dan seed memilih prodi dari kampus yang sama.

## 6. Katalog jurusan (Fase 2)

Frontend menampilkan jurusan **per nama jurusan** (mis. "Informatika"), bukan per kampus seperti `GET /ptn/majors`. Sementara katalognya ada di `frontend/src/data/jurusan.ts` dan dipakai di mode dummy maupun backend (`services/jurusanService.ts`). Tipe lengkapnya: `frontend/src/types/jurusan.ts`.

### 6.1 Daftar jurusan 🔴

```
GET /jurusan?search=informatika&bidang=teknologi&page=1&limit=24
→ {
    "items": [
      { "slug": "informatika", "name": "Informatika", "bidang": "teknologi",
        "description": "…", "imageUrl": null }
    ],
    "counts": { "teknologi": 6, "kesehatan": 5 },   // jumlah per bidang, untuk chip filter
    "pagination": { "page": 1, "limit": 24, "totalCount": 44, "totalPages": 2, "hasMore": true }
  }
```

- `bidang`: `teknologi | sains | kesehatan | teknik | ekonomi | hukum | sosial | pendidikan | desain | pertanian | kedinasan`.
- **Alasan:** halaman `/jurusan` (pencarian + filter bidang) dan carousel beranda.

### 6.2 Detail jurusan 🔴

```
GET /jurusan/:slug
→ {
    "slug": "informatika", "name": "Informatika", "bidang": "teknologi",
    "description": "…", "imageUrl": null,
    "degree": "S1", "rumpun": "Saintek", "jalur": ["SNBP", "SNBT", "Mandiri"],
    "about": ["paragraf 1", "paragraf 2"],
    "topics": ["Algoritma dan Pemrograman", "Struktur Data"],
    "careers": [{ "title": "Software Engineer", "description": "Membangun aplikasi web dan mobile" }],
    "supportingSubjects": ["Matematika", "Informatika", "Bahasa Inggris"],
    "similar": ["sistem-informasi", "ilmu-komputer", "statistika"]
  }
```

- Slug tidak dikenal → `404`.
- **Alasan:** halaman `/jurusan/:slug`.

### 6.3 Kampus yang membuka jurusan 🔴

Sementara frontend mencari lewat `GET /ptn/majors?search=` lalu mencocokkan nama prodi (daftar nama per jurusan ada di field `ptn` di data katalog). Cara ini rapuh karena bergantung pada nama prodi.

```
GET /jurusan/:slug/kampus?type=PTN&city=Bandung
→ { "campuses": [
      { "majorId": "…", "majorName": "Teknik Informatika", "university":
        { "id": "…", "name": "Institut Teknologi Bandung", "city": "Bandung", "type": "PTN", "logoUrl": null } }
    ] }
```

- `Major` perlu relasi ke katalog jurusan (mis. kolom `jurusanSlug`).
- `University.type` perlu nilai yang konsisten untuk filter: `PTN`, `PTS`, `Kedinasan`, `PTLN`. Saat ini ada `PTN Akademik`, `PTN Vokasi`, `PTKIN`, dan `PTK Kedinasan`; frontend mengelompokkannya sendiri (`campusGroupOf`).
- **Data PTS dan PTLN belum ada** di backend. Mode dummy memakai 3 PTS contoh; PTLN tampil sebagai empty state.
- `logoUrl` kampus semuanya masih `null`.

### 6.4 Label kecocokan per jurusan 🟡

Kartu jurusan menampilkan "Sangat sesuai" / "Sesuai" dari hasil Compass (tanpa persentase). Sementara frontend mencocokkan `recommendedMajors[].name` (nama prodi backend) ke katalog lewat nama, lalu memakai `match_pct ≥ 80` sebagai "Sangat sesuai".

- **Usulan:** `recommendedMajors` menyertakan `jurusanSlug` dan label yang sudah jadi, mis. `{ "jurusanSlug": "informatika", "fit": "Sangat sesuai" }`, supaya aturan labelnya ada di backend.

---

## 7. Dashboard (Fase 4)

Dipakai `/portal` (SPEK bagian 5). Service: `frontend/src/services/dashboardService.ts`, bentuk data: `frontend/src/types/dashboard.ts`.

### 7.1 Rencana hari ini 🔴
Kartu "Rencana hari ini" dan hero Dashboard memakai sumber yang sama dengan Action Plan (bagian 11), sehingga isinya hanya latihan soal. Frontend tidak lagi memakai `GET /action-plans`.

Ringkasan yang dibutuhkan (bisa dihitung frontend dari 11.2, atau disediakan backend):
```
GET /study-plan/today
→ {
    "focus": ["SNBT", "TKA"],                 // null = belum punya rencana
    "tasks": [ /* PlanPractice hari ini, bagian 11.2 */ ],
    "next": { "date": "2026-10-04", "count": 3 } | null   // hari belajar berikutnya
  }
```
- Tanggal "hari ini" mengikuti zona waktu siswa (WIB/WITA/WIT), bukan UTC server.

### 7.2 Hasil latihan terakhir per ujian 🔴
Kartu Performa Dashboard dihitung frontend dari sumber yang sama dengan Siap SNBT/TKA/SKD (`frontend/src/services/practiceService.ts`, bagian 12.4), jadi angkanya selalu sama. Backend cukup menyediakan riwayat di 12.4; ringkasan ini boleh dihitung frontend atau disediakan sebagai jalan pintas:

```
GET /practice/summary
→ {
    "snbt": { "label": "Tryout #1", "completedAt": "2026-09-26T08:42:00Z", "score": 657, "previousScore": 634,
              "subtests": { "PU": 840, "PPU": 680, "PBM": 680, "PK": 680, "LBI": 520, "LBE": 520, "PM": 680 },
              "weakest": "PPU" },
    "tka":  { "kind": "tryout", "label": "Tryout #1", "completedAt": "2026-09-20T09:00:00Z", "score": 72 }
          | { "kind": "accuracy", "percent": 71, "answered": 195 },     // belum pernah tryout TKA
    "skd":  null                        // null = belum ada tryout SKD
  }
```

- Skor subtes SNBT pada skala 0–1000 (sama dengan radar). `previousScore` null jika baru sekali tryout.
- **`weakest` (paling perlu dilatih)** memakai satu aturan untuk Dashboard dan Siap SNBT: akurasi latihan terendah; kalau belum ada latihan, skor terendah (relatif terhadap skor maksimum) di tryout terakhir.
- Baris TKA memakai nilai tryout TKA terakhir. Kalau belum pernah tryout, frontend menampilkan akurasi latihan dengan label berbeda ("Akurasi latihan 71%") supaya tidak terbaca sebagai nilai tryout.
- Baris SKD hanya tampil jika Siap SKD relevan (12.4) atau sudah ada hasil SKD.

### 7.3 Timeline seleksi 🔴
Jadwal sekarang disimpan di `frontend/src/data/timeline.ts` sebagai **perkiraan** dan harus diedit manual tiap tahun.

```
GET /timeline?from=2026-10
→ { "events": [ { "id": "tka-2026", "month": "2026-11", "title": "Tes Kemampuan Akademik (TKA)",
                  "note": "Perkiraan, untuk siswa kelas XII", "tone": "orange", "isOfficial": false } ] }
```

- `isOfficial: true` setelah jadwal resmi SNPMB/instansi diumumkan, supaya catatan "Perkiraan" bisa dihapus.
- Dikelola admin, tidak perlu login untuk membaca.

### 7.4 Notifikasi 🔴
Tombol notifikasi di header sekarang hanya menampilkan "Belum ada notifikasi" dan tanpa titik "belum dibaca".

```
GET /notifications            → { "items": [ { "id": "…", "title": "…", "body": "…", "link": "/portal/action-plan", "readAt": null, "createdAt": "…" } ], "unreadCount": 1 }
PATCH /notifications/:id/read → { "message": "…" }
```

- Sumber: pengingat Action Plan (`notifyEmail`/`notifyWa` sudah ada di `ActionPlanItem`) dan hasil tryout.

### 7.5 Nama panggilan (lihat 13.3) 🔴
Sapaan Dashboard ("Selamat pagi, Rizki!") memakai `profile.nickname`.

- Bentuk endpoint mengikuti **bagian 13.3**: siswa mengubahnya lewat `PUT /profile/nickname` (bukan `PUT /profile`), dan `GET /auth/me` serta `GET /profile` mengirim `profile.nickname` (string atau `null`).
- Selama kosong, frontend memakai kata pertama nama lengkap (dengan backend asli: "Selamat malam, Ahmad!"). Mode dummy sudah mengisi `"Rizki"` dan `"Budi"`.

---

## 8. Analisis Potensi (Fase 4)

Dipakai `/portal/analisis-potensi` (SPEK bagian 6). Service: `assessmentService`, `achievementService`, `raporService`; bentuk data: `frontend/src/types/analisis.ts`.

### 8.1 Prestasi lengkap 🟡
Sudah ada `POST /achievements` (`title, category, level, year`) dan `DELETE /achievements/:id`. Yang belum ada:

- **Field** `rank` (capaian, mis. "Juara 2"), `organizer` (penyelenggara), dan `certificateUrl` / `certificateName`.
- **Ubah:** `PUT /achievements/:id` dengan body yang sama seperti tambah.
- **Unggah sertifikat:** `POST /achievements/:id/certificate` (multipart, PDF/JPG/PNG maks. 2 MB) → `{ "certificateUrl": "…", "certificateName": "piagam.pdf" }`.
- **Daftar:** `GET /achievements` (sekarang hanya lewat `GET /profile`).
- **Nilai tetap:** `category` = `Academic` | `Non-Academic`; `level` = `School` | `City` | `Province` | `National` | `International` (frontend menampilkan Sekolah s.d. Internasional).
- `DELETE /achievements/:id` belum memeriksa pemilik prestasi (bagian 1.4).
- **Sementara:** dengan backend asli, tombol Ubah, isian capaian/penyelenggara, dan unggah sertifikat disembunyikan, dengan catatan "Mengubah prestasi dan mengunggah sertifikat belum tersedia saat ini. Untuk mengoreksi, hapus lalu tambahkan ulang." Item sertifikat tidak dihitung di Kelengkapan profil (persentase dari 90 poin).

### 8.2 Nilai rapor per semester 🟡
`GET /rapor` sudah mengirim `{ semester, subject, score }`. Yang belum ada:

- **Kelas dan tahun ajaran** per semester. Sementara dihitung frontend dari kelas siswa sekarang (`frontend/src/lib/rapor.ts`; tahun ajaran mulai Juli).
- **Tanggal diperbarui** dan sumber (e-Rapor). Sementara memakai `createdAt` terbaru dari nilai rapor.
- **Usulan:** `GET /rapor` → `{ "semesters": [ { "semester": 1, "grade": 10, "schoolYear": "2024/2025", "updatedAt": "…", "source": "e-Rapor", "subjects": [ { "subject": "Matematika", "score": 86 } ] } ] }`.
- Data seed backend baru berisi 2–3 mapel; format Kurikulum Merdeka berisi ±13–14 mapel per semester. Rapor hanya dibaca siswa; input dari sekolah (import e-Rapor).

---

## 9. ORBIDU Compass (Fase 5)

Dipakai `/portal/compass` (SPEK bagian 7). Service: `compassService`, `jurusanService.getCompassRecommendations` / `getEducationPaths`; bentuk data: `frontend/src/types/compass.ts`.

### 9.1 Target jurusan 🔴
Ada **dua tingkat target** yang berbeda, jangan dicampur:

| Target | Dipilih di | Contoh | Disimpan di |
|---|---|---|---|
| Target **jurusan** (jurusan katalog) | ORBIDU Compass | Sistem Informasi | **Belum ada** (usulan di bawah) |
| Target **prodi di kampus tertentu** | Siap SNBP, tombol "Jadikan target prodi" (Fase 7) | Sistem Informasi Universitas Sriwijaya | `StudentProfile.targetMajorId` + `targetPtnId` lewat `PUT /profile` (sudah ada, sudah dipakai) |

Target jurusan dipakai untuk mengarahkan rencana belajar, Siap SNBP (memilih prodi di kampus untuk jurusan itu), dan Performance.

```
GET /compass/target → { "target": { "jurusanSlug": "sistem-informasi", "name": "Sistem Informasi", "setAt": "…" } | null }
PUT /compass/target ← { "jurusanSlug": "sistem-informasi", "name": "Sistem Informasi" }   // null = hapus
                    → { "target": { … } }
```

- `jurusanSlug` boleh `null` jika jurusan dari Compass tidak ada di katalog (disimpan dengan `name` saja).
- **Sementara:** mode dummy menyimpan di data dummy; mode backend menyimpan di browser (`localStorage`, per akun).

### 9.2 Kapan perlu analisis ulang 🔴
Tombol "Perbarui analisis" hanya aktif jika data masukan (tes, prestasi, rapor) berubah setelah `analyzedAt`, karena setiap analisis AI memakai kuota.

- **Usulan:** `GET /compass/result` ikut mengirim `inputsUpdatedAt` (waktu terakhir tes, prestasi, atau rapor berubah, termasuk penghapusan), atau langsung `needsRefresh: true|false`.
- **Sementara:** frontend menghitung dari tanggal di `GET /profile` (`assessment.updatedAt`, `achievements[].createdAt`, `academicRecords[].createdAt`). Prestasi yang **dihapus** belum terdeteksi di mode backend.
- Sebaiknya backend juga menolak `POST /compass/analyze` jika tidak ada data baru (mis. `409 { "code": "ANALYSIS_UP_TO_DATE" }`), supaya kuota tidak terbuang karena klik berulang.

### 9.3 Rekomendasi jurusan yang bisa dicocokkan 🟡
`recommendedMajors` berisi nama prodi bebas (`{ name, match_pct, rationale }`). Jawaban cadangan backend memakai `target_major` atau "Teknik Informatika", yang tidak ada di katalog jurusan, sehingga tampil tanpa link detail dan bidangnya tidak diketahui ("Bidang belum bisa ditentukan").

- **Usulan:** setiap item menyertakan `jurusanSlug` dan label jadi (`"fit": "Sangat sesuai" | "Sesuai"`), lihat juga bagian 6.4.
- Sebaiknya juga `topField` (kunci bidang, mis. `"teknologi"`) supaya "Bidang paling selaras" tidak perlu ditebak dari jurusan pertama.
- Galat AI Engine jangan ditelan diam-diam (`BACKEND_MAP.md` poin 10): kirim penanda `"source": "ai" | "fallback"` supaya frontend bisa memberi tahu siswa.

### 9.4 Aspek keselarasan dan jalur pendidikan 🟡
- Aspek **Akademik** dan **Prestasi** di hero sekarang disimpulkan frontend dari rapor dan prestasi (`frontend/src/lib/compassInsights.ts`, aturan sederhana). Usulan: `GET /compass/result` mengirim `aspects: [{ "key": "minat" | "akademik" | "prestasi", "level": 1–5 }]` hasil analisis.
- **Jalur pendidikan** dikelompokkan dari `University.type` lewat `GET /ptn/majors` (bisa sampai 15 permintaan untuk 3 jurusan). Usulan: `GET /compass/paths` → `{ "groups": [ { "key": "s1ptn" | "vokasi" | "pts" | "ptln" | "kedinasan", "fit": "…", "options": [ { "prodi", "kampus", "kota" } ] } ], "hidden": [ { "key", "reason" } ] }`.
- Data PTS dan PTLN belum ada di backend (bagian 6.3), jadi jalur itu selalu disembunyikan di mode backend.

---

## 10. Explore Beasiswa (Fase 5)

Dipakai `/portal/beasiswa` dan bagian beasiswa di Compass (SPEK bagian 8). Service: `frontend/src/services/beasiswaService.ts`; bentuk data: `frontend/src/types/beasiswa.ts`.

### 10.1 Katalog beasiswa 🔴
Sementara frontend memakai contoh data `frontend/src/data/beasiswa.ts` (di mode dummy maupun backend), diberi label "Contoh data".

```
GET /scholarships
→ { "scholarships": [ {
      "id": "kip-kuliah",
      "name": "KIP Kuliah",
      "organizer": "Pemerintah Indonesia",
      "provider": "pemerintah",               // pemerintah | kampus | daerah | swasta | luarNegeri | kedinasan
      "levels": ["S1", "D3/D4"],
      "location": "Dalam negeri",             // Dalam negeri | Luar negeri
      "aid": ["Biaya kuliah penuh", "Biaya hidup"],   // + Biaya kuliah sebagian | Ikatan dinas
      "paths": ["s1ptn", "vokasi", "pts"],    // jalur dari Compass (bagian 9.4)
      "coverage": "…", "requirements": ["…"], "documents": ["…"],
      "period": "Bersamaan dengan seleksi masuk",
      "officialUrl": "https://…" | null,
      "note": "Cek syarat ekonomi",           // catatan singkat di kartu Compass
      "updatedAt": "…"
    } ] }
```

- Filter (jenjang, lokasi, jenis bantuan, pencarian) sekarang dikerjakan frontend. Jika katalog membesar, tambahkan query `?level=&location=&aid=&q=` dan pagination.
- `paths` menentukan label "Cocok dengan jalurmu" (hanya jalur/jenjang, bukan kelayakan). Kelayakan sebenarnya tetap ditentukan penyelenggara.
- Data dikelola admin/tim konten, termasuk periode pendaftaran yang berubah tiap tahun.

### 10.2 Beasiswa tersimpan 🔴
```
GET    /scholarships/saved        → { "ids": ["kip-kuliah", "pemda"] }
PUT    /scholarships/:id/save     → { "ids": [ … ] }
DELETE /scholarships/:id/save     → { "ids": [ … ] }
```

- **Sementara:** mode dummy menyimpan di data dummy; mode backend menyimpan di browser (`localStorage`, per akun), jadi tidak terbawa ke perangkat lain.

---

## 11. Action Plan (Fase 6)

Dipakai `/portal/action-plan` dan kartu "Rencana hari ini" di Dashboard (SPEK bagian 9). Service: `frontend/src/services/actionPlanService.ts`; bentuk data: `frontend/src/types/actionPlan.ts`.

**Kenapa `/action-plans` tidak dipakai:** endpoint itu berisi tugas manual (`title`, `description`, `dueDate`, `completed`), sedangkan Action Plan sekarang hanya berisi latihan soal yang disusun AI per hari belajar, lengkap dengan jumlah soal, progres, dan skor. Endpoint lama dibiarkan (tidak diubah).

**Sementara:** mode dummy menyimpan di data dummy akun; mode backend menyimpan di browser (`localStorage`, kunci `orbita_action_plan_<userId>`), jadi tidak terbawa ke perangkat lain. Penyusun latihan masih simulasi di frontend (`frontend/src/data/actionPlanEngine.ts`).

### 11.1 Pengaturan rencana 🔴
```
GET /study-plan            → { "settings": PlanSettings | null }
PUT /study-plan            ← PlanSettingsInput
                           → { "settings": PlanSettings }

PlanSettingsInput = {
  "focus": ["SNBT", "TKA"],                   // 1–2 dari SNBT | TKA | Kedinasan
  "tkaElectives": ["Matematika Tingkat Lanjut", "Fisika"],   // maks. 2, kosong jika TKA tidak dipilih
  "studyDays": [0, 2, 4, 6],                  // 0 = Senin … 6 = Minggu
  "duration": "utbk",                         // utbk | tka | 4w | 8w
  "minutesPerDay": 60                         // 30 | 60 | 90
}
PlanSettings = PlanSettingsInput + {
  "startDate": "2026-09-14",                  // hari pertama rencana, tetap saat diatur ulang
  "endDate": "2027-04-30",                    // dihitung server dari duration
  "updatedAt": "…"
}
```
- **Mapel pilihan TKA** dipilih siswa sendiri (sesuai pendaftaran TKA-nya), bukan diambil dari rapor. Daftar yang valid: Matematika/Bahasa Indonesia/Bahasa Inggris Tingkat Lanjut, Fisika, Kimia, Biologi, Ekonomi, Sosiologi, Geografi, Sejarah, Antropologi, PPKn, Bahasa Arab, Jerman, Prancis, Jepang, Korea, Mandarin. Saran awal di frontend dari Compass dan rapor hanya bantuan.
- `endDate` untuk `utbk`/`tka` = akhir bulan perkiraan ujian dari timeline seleksi (bagian 7.3).
- **PUT pertama** berlaku mulai hari ini. **PUT berikutnya** hanya menyusun ulang hari setelah hari ini; latihan hari ini dan riwayat sebelumnya tidak boleh berubah.
- Validasi: fokus 1–2 item unik, minimal 1 hari belajar, `tkaElectives` ≤ 2 dan hanya dari daftar di atas.

### 11.2 Latihan harian yang disusun AI 🔴
```
GET /study-plan/days?from=2026-09-01&to=2026-10-31
→ { "days": {
      "2026-10-02": [ PlanPractice, … ]       // hanya hari belajar
    } }

PlanPractice = {
  "id": "…",
  "category": "SNBT",                         // SNBT | TKA | Kedinasan
  "subject": "PM",                            // kode subtes SNBT, nama mapel TKA, atau TWK/TIU/TKP
  "title": "Latihan Penalaran Matematika",
  "questions": 20,
  "minutes": 25,
  "status": "in_progress",                    // todo | in_progress | done
  "answered": 6,
  "correct": null                             // terisi setelah selesai
}
```
- Jumlah latihan per hari mengikuti `minutesPerDay` (frontend: 30/60/90 menit → 2/3/4 latihan). Kategori bergiliran di antara fokus.
- **Subtes dengan skor terendah mendapat porsi lebih**: skor diambil dari hasil latihan di rencana, lalu tryout terakhir/nilai rapor, lalu dibagi rata jika belum ada data.
- Hari yang akan datang boleh dikirim sebagai perkiraan (tampil terkunci "Terbuka Jumat"); isi soalnya baru disusun saat harinya tiba. Hari ini dan hari yang sudah lewat harus tetap (tidak disusun ulang).
- Soal dan kunci jawaban **tidak** ikut di respons ini (lihat bagian 1.5); dikirim terpisah saat latihan dibuka di Fase 7.

### 11.3 Hasil per latihan 🔴
```
PUT  /study-plan/practices/:id/progress  ← { "answered": 6 }
                                         → { "practice": PlanPractice }
POST /study-plan/practices/:id/submit    ← { "answers": [ … ] }
                                         → { "practice": PlanPractice, "review": [ … ] }   // pembahasan setelah submit
```
- Penilaian dilakukan server (bagian 5.2), bukan dari kunci jawaban yang dikirim ke frontend.
- Latihan di hari yang sudah lewat tetap bisa dikerjakan; latihan di tanggal yang akan datang ditolak sampai harinya tiba.
- Hasil ini dipakai ulang untuk bobot subtes terlemah (11.2) dan kartu Performa Dashboard (bagian 7.2).

---

## 12. Persiapan (Fase 7)

Dipakai `/portal/persiapan/*`. Bagian ini diisi bertahap: 12.1–12.2 di Tahap 7A (Siap SNBP), sisanya di Tahap 7B–7C.

### 12.1 Isian Siap SNBP 🔴
Service: `frontend/src/services/snbpService.ts`; bentuk data: `frontend/src/types/snbp.ts`.

```
GET /snbp/draft  → { "draft": SnbpDraft | null }
PUT /snbp/draft  ← SnbpDraft  → { "draft": SnbpDraft }

SnbpDraft = {
  "eligible": "menunggu",                     // menunggu | eligible | tidak (diisi siswa sendiri)
  "tkaEnabled": true,
  "tkaScores": { "Matematika": "82,5", "Fisika": "" },   // teks isian, 0–100, boleh kosong
  "achievementIds": ["…"],                    // maks. 3, dari /achievements
  "choices": [ { "universityId": "…", "majorId": "…" }, null ],   // pilihan 1 dan 2
  "result": SnbpResult | null,                // hasil terakhir (12.2)
  "updatedAt": "…"
}
```
- **Status eligible** diisi siswa sendiri karena ditentukan sekolah. Idealnya nanti diisi sekolah/admin dan siswa hanya membaca.
- **Nilai TKA** sebaiknya disimpan per siswa sebagai data sendiri (bukan hanya di isian SNBP), karena juga dipakai Siap TKA. Mapel pilihan TKA diambil dari pengaturan Action Plan (bagian 11.1).
- Rapor (`/rapor`) dan prestasi (`/achievements`) tidak disalin; frontend membacanya langsung.
- **Sementara:** mode dummy menyimpan di data dummy; mode backend menyimpan di browser (`localStorage`, kunci `orbita_snbp_<userId>`).

### 12.2 Rasionalisasi SNBP 🔴
`GET /ptn/rationalization` yang ada belum dipakai karena hanya menghitung rata-rata rapor + bonus prestasi untuk satu target, tanpa pilihan prodi, nilai TKA, dan prestasi terpilih. Sementara frontend memakai simulasi (`frontend/src/data/snbpEngine.ts`, ditandai "Cara hitung sementara") di kedua mode.

```
POST /snbp/rationalization
← {
    "choices": [ { "universityId": "…", "majorId": "…" } ],   // 1–2 pilihan
    "achievementIds": ["…"],                                  // maks. 3
    "tkaScores": { "Matematika": 82.5 } | null
  }
→ {
    "result": {
      "computedAt": "…",
      "choices": [ {
        "universityId": "…", "universityName": "Universitas Indonesia",
        "majorId": "…", "majorName": "Sistem Informasi",
        "category": "aman",                    // aman | waspada | berisiko (tanpa persentase)
        "factors": [ { "direction": "up", "text": "Rata-rata rapor 85,7 dan naik di setiap semester" } ]
      } ],
      "strategy": "…",
      "suggestions": [ "…" ]
    }
  }
```
- Server membaca rapor semester 1–5 dan prestasi sendiri dari data siswa; frontend tidak mengirim nilai rapor.
- **Faktor hanya dari data yang benar-benar ada**: rata-rata dan tren rapor, mapel pendukung prodi, prestasi terpilih, nilai TKA, semester yang belum ada.
- **Data daya tampung dan keketatan per prodi dibutuhkan** untuk rasionalisasi yang lebih akurat (daya tampung SNBP resmi, jumlah peminat, dan keketatan tahun sebelumnya). **Hasil sekarang belum memperhitungkannya**, sehingga dua pilihan bisa berkategori sama; ini juga disebut di catatan "Ini estimasi, bukan jaminan" di halaman. Kolom `capacitySnbp` dan `passingGrade` di tabel `Major` sekarang hasil rumus seed, bukan data resmi, jadi tidak dipakai.
- Rumus akhir perlu disetujui tim sebelum dipakai siswa.

### 12.3 Kampus peserta SNBP 🟡
Daftar kampus diambil dari `GET /ptn/universities?type=PTN Akademik|PTN Vokasi|PTKIN` (sudah ada), lengkap dengan prodinya.
- Kampus peserta SNBP berubah tiap tahun mengikuti SNPMB; perlu penanda resmi per tahun (mis. `University.snbpYear`).
- `GET /ptn/universities` mengirim semua prodi tiap kampus (`BACKEND_MAP.md` poin 17). Untuk pilihan prodi cukup `{ id, name }`.
- Target prodi di seed backend tidak cocok dengan kampusnya (bagian 5.3), jadi pilihan 1 akun demo `siswa@orbita.id` tidak terisi otomatis di mode backend.

### 12.4 Riwayat latihan, akurasi, dan paket tryout 🔴
Dipakai Siap SNBT/TKA/SKD (`/portal/persiapan/:ujian?tab=latihan|tryout|performance`), kartu Performa Dashboard (7.2), dan bobot subtes terlemah di Action Plan (11.2). Service: `frontend/src/services/practiceService.ts` + `practiceLog.ts`; bentuk data: `frontend/src/types/practice.ts`.

**Sementara:** mode dummy menyimpan di data dummy; mode backend menyimpan di browser (`localStorage`, kunci `orbita_practice_<userId>`). Endpoint `/ptn/practice/*` yang ada belum dipakai karena `GET /ptn/practice/questions` mengirim kunci jawaban (bagian 1.5) dan riwayat `TryoutSession` belum bisa dibaca; penggantinya dirinci di 12.5–12.6.

```
GET /exams/:exam/subjects          // exam = snbt | tka | skd
→ { "subjects": [ { "subject": "PU", "name": "Penalaran Umum" } ] }
   // TKA: 3 mapel wajib + mapel pilihan dari pengaturan rencana (11.1)

GET /practice/stats?exam=snbt
→ { "subjects": [ { "subject": "PU", "answered": 100, "correct": 71 } ] }
   // gabungan latihan Action Plan yang selesai (11.3) + latihan bebas

GET /tryouts?exam=snbt
→ { "packages": [
      { "id": "snbt-to-0", "name": "Tryout Diagnostik", "order": 0,
        "status": "done",                          // done | open | locked (berurutan)
        "result": { "score": 606, "subscores": { "PU": 670 }, "completedAt": "…" } },
      { "id": "snbt-to-2", "name": "Tryout #2", "order": 2, "status": "open", "result": null }
    ] }
```
- **Paket berurutan:** paket berikutnya terbuka setelah paket sebelumnya selesai; urutan dan isi paket diatur tim konten.
- **Skala skor (perkiraan, bukan skor resmi):** SNBT rata-rata subtes 0–1000; TKA rata-rata mapel 0–100; SKD jumlah TWK (maks. 150) + TIU (175) + TKP (225) = 550. Catatan skala tampil di tab Tryout dan Performance.
- `TryoutSession.type` perlu dibedakan `SNBT`/`TKA`/`SKD`, menyimpan paket, skor per subtes, dan waktu selesai.
- **Relevansi Siap SKD** dihitung frontend dari dua data yang sudah ada: Compass merekomendasikan jurusan Kedinasan, atau fokus Action Plan berisi Kedinasan (`frontend/src/lib/persiapan.ts`). Baris SKD di Dashboard dan kartu Siap SKD di "Langkah selanjutnya" Compass hanya tampil jika relevan. Menu Persiapan **selalu** menampilkan Siap SKD; jika sudah ada hasil Compass dan aturan tidak terpenuhi, item menu diberi keterangan "Kurang selaras dengan profilmu" (sama dengan jendela Atur rencana).
- Halaman Siap tidak menampilkan perbandingan dengan "skor target jurusan" karena datanya tidak ada.

### 12.5 Bank soal dan sesi latihan 🔴
Dipakai `/portal/latihan/:id` dan `/portal/latihan/:id/hasil`. Service: `frontend/src/services/soalService.ts`; "server" simulasi: `frontend/src/data/practiceServer.ts`; bentuk data: `frontend/src/types/soal.ts`.

**Sementara:** bank soal contoh 75 soal di `frontend/src/data/soal/` (diberi label "Contoh soal"). **Semua paket tryout contoh memakai soal yang sama; bank resmi harus punya soal berbeda per paket.** Satu sesi latihan berisi 5 soal (`SESSION_SIZE`). Mode dummy menyimpan sesi di data dummy; mode backend di browser (`orbita_sessions_<userId>`). Di mode dummy bank contoh ikut terunduh browser (tidak ada server); jaminan kunci tidak bocor baru ada di backend.

```
POST /practice-sessions
← { "planPracticeId": "2026-10-02-3" }                 // latihan Action Plan (sesi yang sama dibuka lagi)
 | { "exam": "snbt", "subject": "PM" }                 // latihan bebas (sesi baru)
→ { "session": {
      "id": "…", "exam": "snbt", "subject": "PM", "title": "Latihan Penalaran Matematika",
      "planDate": "2026-10-02" | null, "startedAt": "…", "finished": false,
      "questions": [ { "id": "…", "subject": "PM", "passage": "…"?, "text": "…", "options": ["…"] } ],   // TANPA kunci
      "answers": { "<questionId>": { "choice": 0, "correct": false, "answer": 1, "explanation": "…", "points": 3? } }
    } }
GET  /practice-sessions/:id                            → { "session": … }     // sama dengan di atas
POST /practice-sessions/:id/answers  ← { "questionId": "…", "choice": 2 }
                                     → { "choice": 2, "correct": true, "answer": 2, "explanation": "…", "points"? }
POST /practice-sessions/:id/finish   → { "result": PracticeResult }
GET  /practice-sessions/:id/result   → { "result": { "correct": 4, "total": 5, "unanswered": 0, "finishedAt": "…", "items": [ ReviewItem ] } }
```
**Kewajiban backend:**
- Soal dikirim **tanpa** `answerIndex`, pembahasan, dan poin. `answers` hanya berisi soal yang sudah dicek siswa.
- **Jawaban yang sudah dicek tidak bisa diubah**: `POST …/answers` untuk soal yang sudah dijawab mengembalikan hasil yang tersimpan (pilihan baru diabaikan), termasuk setelah refresh.
- Latihan Action Plan di tanggal yang akan datang ditolak (`403`, "Latihan ini baru terbuka hari …"); latihan di hari yang sudah lewat tetap bisa dikerjakan.
- `finish` memperbarui latihan Action Plan (status, `answered`, `correct`; bagian 11.3) atau riwayat latihan bebas (12.4). Soal yang belum dijawab tidak dihitung benar.
- `result` hanya untuk sesi yang sudah selesai (`409` jika belum).
- TKP: setiap pilihan bernilai 1–5 poin; "benar" = pilihan 5 poin.

### 12.6 Tryout: percobaan, timer, dan laporan 🔴
Dipakai `/portal/tryout/:paket` dan `/portal/tryout/:paket/laporan`.

```
GET  /tryouts/:paket/attempt
→ { "attempt": {
      "packageId": "snbt-to-2", "name": "Tryout #2", "exam": "snbt",
      "sections": [ { "subject": "PU", "name": "Penalaran Umum", "count": 5, "status": "done|active|pending" } ],
      "current": { "subject": "PPU", "index": 1, "questions": [ PublicQuestion ], "deadline": "…", "durationSec": 450 } | null,
      "answers": { "<questionId>": 1 }, "flags": ["<questionId>"],
      "serverNow": "…",                    // untuk selisih jam perangkat
      "expired": ["Penalaran Umum"]        // subtes yang ditutup otomatis karena waktunya habis
    } }
PUT  /tryouts/:paket/attempt/answers  ← { "questionId": "…", "choice": 1 | null, "flagged": true }
POST /tryouts/:paket/attempt/sections/current/finish  → { "finished": false }   // true = tryout selesai dan sudah dinilai
GET  /tryouts/:paket/report
→ { "report": { "score": 657, "previous": { "name": "Tryout Diagnostik", "score": 634 } | null,
                "correct": 20, "total": 35, "unanswered": 0, "timeUsedSec": 2520, "completedAt": "…",
                "subjects": [ { "subject": "LBE", "name": "…", "correct": 2, "total": 5, "score": 520, "max": 1000 } ],
                "items": [ ReviewItem + subject + flagged ] } }    // kunci dan pembahasan, hanya setelah selesai
```
**Kewajiban backend:**
- **Paket terkunci ditolak** (`403`, "Tryout ini terbuka setelah … selesai"); frontend mengarahkan ke tab Tryout dengan pesan itu.
- **Paket yang sudah selesai tidak bisa dimulai ulang** (`409`); frontend mengarahkan ke laporannya.
- **Timer dari server:** saat subtes dimulai, server menyimpan `startedAt` dan `deadline` (= mulai + jumlah soal × detik per soal). Sisa waktu selalu `deadline − sekarang`, jadi refresh atau menutup halaman tidak mereset waktu. Saat attempt dibuka lagi setelah deadline lewat, subtes itu ditutup dengan jawaban yang tersimpan, lalu subtes berikutnya dimulai saat dibuka.
- Jawaban dan ragu-ragu disimpan setiap berubah. Jawaban untuk subtes yang sudah ditutup atau setelah deadline (toleransi 2 detik) ditolak (`409`).
- Soal tanpa kunci selama tryout; penilaian di server saat subtes terakhir selesai; kunci dan pembahasan hanya di laporan.
- **Skor (perkiraan, sementara):** SNBT per subtes 200 + 800 × benar/total, total = rata-rata; TKA per mapel 100 × benar/total, total = rata-rata; SKD TWK 150 × benar/total, TIU 175 × benar/total, TKP 225 × poin/(5 × total), total = jumlah (maks. 550). Rumus resmi perlu disetujui tim.
- Durasi contoh per soal: SNBT 90 detik, TKA 120 detik, SKD 60 detik (`frontend/src/config/practice.ts`).
- Hasil tryout masuk riwayat (12.4), sehingga Siap SNBT/TKA/SKD, kartu Performa Dashboard, dan bobot Action Plan ikut berubah.

---

## 13. Profil (Fase 8)

Dipakai `/portal/profil` (SPEK bagian 11). Service: `frontend/src/services/profileService.ts`; bentuk data: `frontend/src/types/profil.ts`; contoh: `frontend/src/mocks/data/profil.ts`.

**Keputusan tim:** data diri siswa diisi **pihak kurikulum sekolah**. Siswa hanya bisa melihat, kecuali **nama panggilan, foto, dan password**.

### 13.1 Data diri dari sekolah 🔴
Kolom yang sudah ada: `User.name`, `User.email`, `User.avatarUrl`, `StudentProfile.grade`, `schoolName`, `city`. Yang **belum ada di Prisma**:

```
GET /profile/school
→ { "school": {
      "identity": { "gender": "L" | "P" | null, "birthPlace": "Palembang", "birthDate": "2009-05-15",
                    "nis": "…", "nisn": "…", "religion": "Islam" },
      "address":  { "street": "…", "rt": "003", "rw": "005", "village": "…", "district": "…",
                    "city": "Palembang", "province": "Sumatera Selatan", "postalCode": "30127" },   // province: salah satu dari 38 provinsi
      "contact":  { "studentPhone": "…", "guardianPhone": "…", "fatherName": "…", "fatherJob": "…",
                    "motherName": "…", "motherJob": "…", "guardianName": null },
      "family":   { "parentStatus": "…", "livingWith": "…", "fatherEducation": "S1", "motherEducation": "S1",
                    "socioEconomic": "Cukup", "educationAid": ["KIP"] | [], "childOrder": 1, "siblingCount": 2 },
      "special":  { "specialNeeds": false, "specialNeedsTypes": [], "colorBlind": false, "notes": null },
      "updatedAt": "2026-09-02T08:00:00Z"
    } }
```
- Semua field boleh `null` (= belum diisi sekolah). Frontend menampilkannya "Belum diisi sekolah", tanpa nilai contoh.
- `majorTrack` (IPA/IPS) **tidak** ditampilkan: Kurikulum Merdeka tidak memakai jurusan, dan backend mengisi "IPA" untuk semua siswa baru (bagian 2.2).
- Field lama yang dihapus dari desain: golongan darah, riwayat penyakit, "email siswa" kedua (email akun saja).

**Endpoint untuk pihak sekolah/admin** (peran baru atau `ADMIN`, dengan cek peran di server):
```
PUT  /admin/students/:userId/profile   ← { "name"?, "grade"?, "schoolName"?, "city"?, "school": { … sama dengan di atas } }
POST /admin/students/import            ← file Excel/CSV dari sistem sekolah (Dapodik/e-rapor)
                                       → { "updated": 120, "errors": [ { "row": 5, "message": "NISN tidak valid" } ] }
```
Import ini sebaiknya digabung dengan pembuatan akun massal di bagian 14.1: satu file yang sama bisa membuat akun baru sekaligus mengisi data diri.

### 13.2 Siswa hanya boleh mengubah nickname, avatar, dan password 🔴
- `PUT /profile` dari siswa **harus menolak** (atau mengabaikan) `schoolName`, `grade`, `majorTrack`, dan `city`. Sekarang siswa bisa mengubah semuanya lewat API, dan `PUT /profile` membuat profil dengan nilai bawaan palsu jika belum ada (bagian 2.2). Pengecualian: `targetPtnId`/`targetMajorId` (target prodi dari Siap SNBP, bagian 9.1) tetap boleh diubah siswa.
- `POST /rapor`, `POST /rapor/import-excel`, dan `POST /rapor/upload-pdf` **hanya untuk sekolah/admin**. Sekarang siswa bisa menulis nilai rapornya sendiri.
- Prestasi (`/achievements`) tetap diisi siswa (keputusan Fase 4).

### 13.3 Nama panggilan, foto, dan password 🔴
```
PUT  /profile/nickname   ← { "nickname": "Rizki" }          // 1–20 karakter, di-trim
                         → { "nickname": "Rizki" }
POST /profile/avatar     ← multipart: file (image/jpeg | image/png, maks. 2 MB)
                         → { "avatarUrl": "https://…" }      // server mengecilkan dan menyimpan
DELETE /profile/avatar   → { "avatarUrl": null }
PUT  /auth/password      ← { "currentPassword": "…", "newPassword": "…" }
                         → 204   |   400 { "error": "Password sekarang salah" }
```
- Password baru: min. 8 karakter, berisi huruf dan angka, berbeda dari password lama. Server **wajib** mengecek password lama dan memberi batas percobaan.
- `nickname` dikirim di `GET /auth/me` dan `GET /profile` (dipakai sapaan Dashboard); `avatarUrl` sudah ada di `User`.
- **Sementara:** mode dummy menyimpan di data dummy. Mode backend menyimpan nama panggilan dan foto (gambar 256 px) di browser per akun (`orbita_profil_<userId>`, digabung ke data user saat `/auth/me` dibaca) dengan catatan "Tersimpan di perangkat ini"; ganti password dinonaktifkan dengan catatan.
- Status persetujuan orang tua/wali di kartu Akun membaca `parentConsentAt` (bagian 2.4); dengan backend asli ditulis "belum bisa ditampilkan".

### 13.4 Kondisi keluarga dan kondisi khusus: syarat sebelum diisi data asli 🔴
Data ini sensitif (kondisi ekonomi, kebutuhan khusus, buta warna) dan hanya boleh terlihat oleh siswa itu sendiri, guru BK, dan wali kelas. **Jangan isi dengan data asli siswa sebelum:**
- endpoint admin diberi cek peran (`BACKEND_MAP.md` bagian 6, poin endpoint admin terbuka; bagian 1.3 dokumen ini),
- `passwordHash` tidak lagi terkirim di respons (bagian 1.1),
- ada cek kepemilikan data (bagian 1.4), dan
- akses guru BK/wali kelas dibatasi ke siswa di sekolah/kelasnya.

Frontend menyembunyikan dua bagian ini secara default (Tampilkan/Sembunyikan), tapi itu hanya untuk privasi di layar, bukan pengamanan data.

---

## 14. Akun berlangganan (Fase 9)

**Keputusan tim:** ORBIDU hanya bisa diakses siswa yang sudah berlangganan. Akun dibuat admin (pihak ORBIDU atau sekolah, belum diputuskan), jadi **tidak ada pendaftaran mandiri**. Dipakai halaman Masuk dan Aktivasi (SPEK bagian 3). Service: `frontend/src/services/authService.ts` (`setFirstPassword`, `saveConsents`); aturan langkah: `frontend/src/lib/activation.ts`; contoh: akun `dimas@orbita.id` di `frontend/src/mocks/db.ts`.

### 14.1 Admin membuat akun siswa 🔴
Wajib `requireRole("ADMIN")` (atau peran sekolah baru dengan cek peran dan batas sekolahnya sendiri).
```
POST /admin/students
← { "name": "Dimas Saputra", "email": "dimas@sekolah.sch.id", "schoolName": "SMA Negeri 1 Palembang",
    "grade": 10, "city": "Palembang",
    "initialPassword": "…"            // opsional; kalau kosong server membuat password acak
  }
→ 201 { "user": { "id": "…", "email": "…", "name": "…", "role": "STUDENT" },
        "initialPassword": "…" }      // hanya dikirim sekali, untuk dibagikan ke siswa
| 409 { "error": "User with this email already exists" }

POST /admin/students/bulk             ← file CSV/Excel: name, email, schoolName, grade, city (boleh ditambah kolom data diri bagian 13.1)
→ { "created": 118, "skipped": 2,
    "accounts": [ { "row": 2, "email": "…", "initialPassword": "…" } ],
    "errors":   [ { "row": 7, "message": "Email sudah terdaftar" } ] }
```
- Akun baru selalu `role: "STUDENT"`, `mustChangePassword: true`, `parentConsentAt: null`, `termsAcceptedAt: null`.
- Password awal tidak pernah disimpan dalam bentuk asli; hanya dikirim sekali di respons pembuatan akun.
- Profil siswa dibuat dari data admin, **tanpa** nilai bawaan palsu (bagian 2.2).
- **Pertanyaan terbuka:** kalau langganan bisa berakhir, perlu kolom mis. `subscriptionEndsAt`. Login akun yang langganannya habis ditolak `403 { "code": "SUBSCRIPTION_INACTIVE" }`, dan frontend akan menampilkan ajakan berlangganan lagi.

### 14.2 Wajib ganti password awal 🔴
- Kolom baru `User.mustChangePassword` (boolean, default `true` untuk akun buatan admin). Dikirim di `GET /auth/me`.
- Endpoint untuk siswa yang sedang login:
  ```
  POST /auth/first-password   ← { "newPassword": "…" }
                              → 204
                              | 400 { "error": "New password must differ from the initial password" }
                              | 409 { "error": "Password already changed" }   // mustChangePassword sudah false
  ```
  Hanya berlaku selama `mustChangePassword` masih `true`; password lama tidak ditanya lagi karena baru saja dipakai untuk masuk. Server mengecek aturan password (min. 8 karakter, huruf dan angka) dan bahwa password baru **berbeda** dari password awal, lalu mengubah `mustChangePassword` menjadi `false`.
- Setelah itu ganti password biasa memakai `PUT /auth/password` (bagian 13.3).
- Setelah admin mereset password (bagian 2.5), `mustChangePassword` kembali `true`.
- **Frontend:** halaman Aktivasi langkah 1. Selama `/auth/me` belum mengirim `mustChangePassword`, langkah ini dilewati di mode backend.

---

## 15. Portal Wali Kelas (`/walikelas`)

Dibuat di PR #7 (akira4n). Sementara hanya berjalan di mode dummy: `frontend/src/services/waliService.ts` memakai `frontend/src/mocks/waliMock.ts`, dan di mode backend setiap fungsi melempar error "Endpoint backend … belum tersedia" (halaman menampilkan pesan gagal memuat). Bentuk data mengikuti `frontend/src/types/wali.ts`.

### 15.1 Peran `WALI_KELAS` 🔴
- Enum `Role` di `schema.prisma` baru berisi `STUDENT`, `BK_TEACHER`, `ADMIN`. Frontend sudah mengenal `WALI_KELAS` (`types/backend.ts`) dan mengarahkannya ke `/walikelas` setelah masuk.
- **Dibutuhkan:** tambah `WALI_KELAS` ke enum `Role`, plus relasi wali ↔ kelas (satu wali memegang satu kelas di satu tahun ajaran), supaya setiap endpoint di bawah hanya mengembalikan siswa di kelasnya sendiri (cek kepemilikan, lihat 1.4).

### 15.2 Endpoint yang dibutuhkan 🔴
Semua wajib `authenticateToken` + `requireRole("WALI_KELAS")`.
```
GET  /walikelas/profile        → WaliTeacherProfile   { id, name, nip, kelas, semester, tahunAjaran, avatarUrl?, initials }
GET  /walikelas/dashboard      → WaliDashboardData    (KPI, distribusi nilai, tren semester, kelengkapan profil, catatan BK)
GET  /walikelas/students       → StudentSummary[]
GET  /walikelas/students/:id   → StudentDetail        (404 kalau siswa bukan di kelas wali ini)
POST /profile/rapor/import-excel  (multipart: file, semester, tahunAjaran) → { "success": true, "count": 36 }
```
- `import-excel` sudah ada, tetapi sejak PR #6 hanya untuk `ADMIN` dan `BK_TEACHER`. Kalau wali kelas yang mengimpor rapor, `WALI_KELAS` perlu ditambahkan dan dibatasi ke siswa di kelasnya.
- `initials` boleh dihitung di frontend dari `name`; kirim `null` untuk kolom yang belum ada, jangan nilai contoh.

---

## 16. Portal Guru BK (`/bk`)

Sementara berjalan di mode dummy: `frontend/src/services/bkService.ts` memakai `frontend/src/mocks/bkMock.ts`, dan di mode backend setiap fungsi melempar error `"Endpoint backend … belum tersedia"` hingga endpoint siap. Bentuk data mengikuti `frontend/src/types/bk.ts`.

### 16.1 Kondisi backend saat ini 🟡
- Peran `BK_TEACHER` sudah ada di `schema.prisma` dan akun seed `gurubk@orbita.id` sudah tersedia (`password123`).
- Endpoint `/bk/teachers` dan `/bk/bookings` (jadwal konseling) sudah ada, namun belum ada endpoint agregasi dashboard sekolah, pemantauan siswa lintas kelas, tryout summary, maupun catatan konseling terstruktur untuk Portal Guru BK.

### 16.2 Endpoint yang dibutuhkan 🔴
Semua endpoint di bawah wajib `authenticateToken` + `requireRole("BK_TEACHER")`:
```
GET  /bk/profile                 → BkTeacherProfile   { id, name, nip, jabatan, sekolah, semester, tahunAjaran, avatarUrl?, initials }
GET  /bk/dashboard               → BkDashboardData    (KPI sekolah, AI monitoring mingguan, peta potensi X/XI/XII, aktivitas terkini)
GET  /bk/students                → BkStudentSummary[] (daftar siswa lintas kelas beserta status tes minat & prioritas pendampingan)
GET  /bk/students/:id            → BkStudentDetail    (profil, absensi, rapor semester 1–6, tryout SNBT/TKA/SKD, minat & rekomendasi, prestasi, catatan BK)
POST /bk/students/:id/notes      ← CreateBkNoteInput  { tanggal, konselor, topik, catatan, rekomendasi, tindakLanjut, prioritas }
                                 → 201 BkNoteItem
```
- `GET /bk/students` dan `GET /bk/students/:id` dibatasi ke siswa pada sekolah konselor yang login.
- Catatan konseling baru (`POST /bk/students/:id/notes`) juga dapat diteruskan sebagai notifikasi ke Wali Kelas siswa terkait (bagian 15).

## 17. Pesan "Hubungi Kami" (`/faq`, Fase 10)

Sementara form "Kirim Pesan Langsung" di `/faq` (`frontend/src/components/faq/FaqKontak.tsx`) membuka WhatsApp dengan pesan yang sudah terisi (`whatsappTextLink` di `frontend/src/config/brand.ts`). Tidak ada data yang dikirim ke backend.

### 17.1 Endpoint yang dibutuhkan 🔴
```
POST /contact-messages           (publik, tanpa login)
  ← { nama: string, email?: string, peran: "Sekolah" | "Guru BK" | "Wali Kelas" | "Partner" | "Siswa" | "Lainnya", pesan: string }
  → 201 { id: string, createdAt: string }
  → 400 { error: string, code: "INVALID_INPUT" }   (nama/pesan kosong, email tidak valid, pesan terlalu panjang)
  → 429 { error: string, code: "RATE_LIMITED" }
```
- **Alasan:** pesan sekolah dan calon partner bisa dicatat dan ditindaklanjuti tim, tidak hanya bergantung pada WhatsApp.
- Karena publik, perlu batas jumlah kiriman per IP dan batas panjang pesan (mis. 2.000 karakter) di backend.
- Saat endpoint siap, form tetap menampilkan tautan WhatsApp sebagai alternatif.
