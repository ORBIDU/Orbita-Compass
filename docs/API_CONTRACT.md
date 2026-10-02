# Kontrak API: kebutuhan frontend ke backend

> Dokumen ini dikelola oleh tim frontend. Isinya endpoint dan perubahan yang
> **dibutuhkan frontend tetapi belum ada** (atau belum aman) di `backend-api/`.
> Kondisi backend saat ini ada di `BACKEND_MAP.md`.
>
> Selama endpoint di sini belum ada, frontend memakai data dummy di
> `frontend/src/mocks/` dengan bentuk data yang sama seperti tertulis di sini.
> Jadi saat backend siap, cukup ganti isi service di `frontend/src/services/`.

Status: 🔴 belum ada · 🟡 ada tetapi perlu diubah · ✅ sudah sesuai

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

### 1.2 Register menerima field `role` 🔴
- `POST /auth/register` menerima `role` dari body, sehingga siapa pun bisa mendaftar sebagai `ADMIN`.
- **Dibutuhkan:** abaikan `role` dari body. Register publik selalu `STUDENT`. Akun guru BK dan admin dibuat oleh admin.
- **Frontend:** `RegisterPayload` tidak punya field `role`, dan body disusun satu per satu.

### 1.3 Endpoint admin tidak memeriksa role 🔴
- **Dibutuhkan:** middleware `requireRole("ADMIN")` untuk semua `/admin/*`, dan `requireRole("STUDENT" | "BK_TEACHER")` di endpoint yang sesuai.

### 1.4 Tidak ada cek kepemilikan data 🔴
- `DELETE /achievements/:id`, `PATCH/DELETE /action-plans/:id`, `PATCH/DELETE /bk/bookings/:id` hanya memakai `id`.
- **Dibutuhkan:** pastikan data milik user yang login sebelum diubah atau dihapus. Jika bukan miliknya, kirim `404`.

### 1.5 Kunci jawaban ikut terkirim 🔴
- `GET /ptn/practice/questions` mengirim `answerIndex`.
- **Dibutuhkan:** soal dikirim tanpa kunci. Penilaian dan pembahasan dikirim oleh backend **setelah** jawaban disubmit (lihat 5.2).
- **Frontend:** tidak pernah menampilkan kunci sebelum soal disubmit.

---

## 2. Auth dan profil

### 2.1 Pesan error berbahasa Inggris 🟡
- Contoh: `"Invalid credentials"`. Sementara diterjemahkan di `frontend/src/services/http.ts`.
- **Usulan:** tambah `code` yang stabil di respons error, misalnya `{ "error": "...", "code": "INVALID_CREDENTIALS" }`, supaya frontend tidak bergantung pada teks pesan.

### 2.2 Register mengisi nilai bawaan palsu 🟡
- Jika tidak dikirim, backend mengisi `schoolName: "SMA Negeri 1 Jakarta"`, `grade: 12`, `majorTrack: "IPA"`, dan `city: "Jakarta"`.
- Form Daftar di SPEK tidak menanyakan jurusan SMA, sehingga semua siswa baru tercatat "IPA".
- **Dibutuhkan:** field yang tidak dikirim disimpan kosong (`null`), bukan diisi contoh. Jurusan SMA diisi sekolah atau admin.
- **Mode dummy** saat ini meniru perilaku backend (mengisi "IPA").

### 2.3 Field profil yang belum ada 🔴
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

### 2.4 Persetujuan orang tua/wali saat daftar 🔴
Form Daftar (Fase 3) mewajibkan kotak "Aku dan orang tua/wali setuju dengan Syarat & Ketentuan serta Kebijakan Privasi ORBIDU." Pengguna ORBIDU siswa SMA yang sebagian besar belum dewasa, jadi persetujuan ini perlu bisa dibuktikan.

- Frontend **sudah mengirim** `parentConsent: true` di body `POST /auth/register`. Backend saat ini mengabaikannya (tidak disimpan, tidak divalidasi).
- **Dibutuhkan:**
  - `POST /auth/register` menolak pendaftaran siswa jika `parentConsent` bukan `true` → `400 { "error": "Parent consent is required", "code": "PARENT_CONSENT_REQUIRED" }`.
  - Simpan di tabel `User` atau `StudentProfile`:
    ```jsonc
    {
      "parentConsent": true,
      "parentConsentAt": "2026-09-30T07:36:06.154Z",  // diisi SERVER saat register, bukan dikirim browser
      "termsVersion": "2026-09"                       // opsional: versi S&K yang disetujui
    }
    ```
  - `GET /auth/me` ikut mengirim `parentConsent` dan `parentConsentAt`.
- **Mode dummy** mencatat `parentConsentAt` (waktu daftar) di akun dummy.

### 2.5 Reset password 🔴
- Belum ada endpoint lupa/reset password. Sementara, "Lupa password?" di halaman Masuk mengarahkan ke WhatsApp ORBIDU dan tim mereset manual.
- **Usulan:** `POST /auth/forgot-password` `{ "email": "..." }` → selalu `200` (tidak membocorkan email terdaftar atau tidak), lalu `POST /auth/reset-password` `{ "token": "...", "password": "..." }` dengan token sekali pakai yang kedaluwarsa.

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

## 4. Kebutuhan lain yang sudah diketahui

Belum ada bentuk final. Dirinci saat fasenya dikerjakan.

| Kebutuhan | Fase | Status |
|---|---|---|
| Katalog jurusan per nama jurusan, data PTS dan PTLN, label kecocokan per jurusan (lihat bagian 6) | 2 | 🔴 |
| Prestasi: ubah, field capaian/penyelenggara, upload sertifikat (lihat bagian 8.1) | 4 | 🔴 |
| Hasil Compass sungguhan (sekarang selalu jawaban cadangan, lihat `BACKEND_MAP.md` poin 10; rincian di bagian 9) | 5 | 🟡 |
| Data beasiswa (daftar, filter, detail, simpan; lihat bagian 10) | 5 | 🔴 |
| Action Plan: fokus, hari belajar, penyusun tugas otomatis, geser tugas terlewat (ringkasan harian Dashboard: bagian 7.1) | 6 | 🔴 |
| Rasionalisasi SNBP dengan input TKA, prestasi terpilih, dan 2 target | 7 | 🟡 |
| Bank soal lengkap, soal tanpa kunci, paket tryout berurutan, riwayat tryout | 7 | 🔴 |

---

## 5. Catatan bentuk respons

### 5.1 Field JSON string
- `Reflection.interests`, `Reflection.careerGoals`, dan semua field rekomendasi di `CompassAnalysis` dikirim sebagai **teks JSON** (keterbatasan SQLite).
- Frontend mem-parse-nya di service.
- Jika backend pindah ke PostgreSQL, sebaiknya dikirim sebagai array/objek asli. Beri tahu tim frontend agar service ikut diubah.

### 5.2 Penilaian tryout
- `POST /ptn/practice/submit` saat ini menghitung skor dari jumlah soal yang **dijawab**, bukan yang benar.
- **Dibutuhkan:** backend menilai jawaban dan mengirim hasil per soal:

```jsonc
{
  "result": {
    "totalScore": 612, "maxScore": 1000,
    "correctCount": 14, "totalQuestions": 20,
    "perSubtest": [ { "subtest": "PU", "correct": 3, "total": 4 } ],
    "answers": [ { "questionId": "…", "chosenIndex": 2, "answerIndex": 1, "explanation": "…" } ]
  }
}
```

### 5.3 Target kampus dan prodi tidak saling cocok (data seed)
- Di seed backend, akun `siswa@orbita.id` punya `targetPtn` Universitas Indonesia, tetapi `targetMajor`-nya milik kampus lain (`targetMajor.universityId` ≠ `targetPtnId`). Penyebabnya, `seed.ts` mencari prodi dengan `findFirst({ name: { contains: "Komputer" } })` tanpa menyaring kampus.
- **Dibutuhkan:** `PUT /profile` memastikan `targetMajorId` milik `targetPtnId`, dan seed memilih prodi dari kampus yang sama.

## 6. Katalog jurusan (Fase 2)

Frontend menampilkan jurusan **per nama jurusan** (mis. "Informatika"), bukan per kampus seperti `GET /ptn/majors`. Sementara katalognya ada di `frontend/src/mocks/data/jurusan.ts` dan dipakai di mode dummy maupun backend (`services/jurusanService.ts`). Tipe lengkapnya: `frontend/src/types/jurusan.ts`.

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

### 7.1 Rencana hari ini dan fokus belajar 🟡
Sekarang frontend memakai `GET /action-plans` lalu menyaring tugas yang tenggatnya hari ini. Yang belum ada: **fokus belajar** siswa dan **perkiraan durasi** tugas, jadi di mode backend kartu tidak bisa menampilkan "Sekitar 65 menit lagi" dan hero tidak tahu fokusnya.

```
GET /dashboard/today
→ {
    "focus": ["SNBT", "TKA"],          // null = siswa belum pernah mengatur fokus
    "tasks": [
      { "id": "…", "title": "20 soal Penalaran Matematika", "minutes": 25, "category": "SNBT", "done": true }
    ]
  }
```

- `category` memakai `SNBT` | `TKA` | `SKD` (kategori lama seperti `Rapor`/`BK` boleh tetap ada).
- `ActionPlanItem` perlu kolom `minutes`. Fokus disimpan per siswa (dirinci di Fase 6).
- Tanggal "hari ini" mengikuti zona waktu siswa (WIB/WITA/WIT), bukan UTC server.

### 7.2 Hasil latihan terakhir per ujian 🔴
Belum ada endpoint untuk membaca riwayat latihan/tryout (`TryoutSession` hanya ditulis lewat `POST /ptn/practice/submit`). Di mode backend kartu Performa selalu tampil sebagai empty state, dan status siswa `aktif` tidak bisa muncul.

```
GET /practice/summary
→ {
    "snbt": { "label": "Tryout #3", "completedAt": "2026-09-26T09:00:00Z", "score": 624, "previousScore": 606,
              "subtests": { "PU": 690, "PPU": 650, "PBM": 610, "PK": 640, "LBI": 600, "LBE": 520, "PM": 660 } },
    "tka":  { "label": "Latihan Matematika", "completedAt": "2026-09-28T09:00:00Z", "correct": 16, "total": 20 },
    "skd":  null                        // null = belum pernah latihan
  }
```

- Skor subtes SNBT pada skala 0–1000 (sama dengan radar). `previousScore` null jika baru sekali tryout.
- `TryoutSession.type` perlu dibedakan `SNBT`/`TKA`/`SKD` dan menyimpan skor per subtes, bukan hanya `totalScore`.

### 7.3 Timeline seleksi 🔴
Jadwal sekarang disimpan di `frontend/src/mocks/data/timeline.ts` sebagai **perkiraan** dan harus diedit manual tiap tahun.

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

### 7.5 Nama panggilan 🔴
Sapaan Dashboard ("Selamat pagi, Rizki!") memakai `profile.nickname`, yang sudah diusulkan di bagian 2.3 tetapi belum ada di backend.

- `GET /auth/me` dan `GET /profile` mengirim `profile.nickname` (string atau `null`); `PUT /profile` menerimanya.
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
| Target **prodi di kampus tertentu** | Siap SNBP (Fase 7) | Sistem Informasi Universitas Sriwijaya | `StudentProfile.targetMajorId` + `targetPtnId` (sudah ada) |

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
Sementara frontend memakai contoh data `frontend/src/mocks/data/beasiswa.ts` (di mode dummy maupun backend), diberi label "Contoh data".

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

