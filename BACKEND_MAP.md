# Peta Backend Orbita Compass

> Ringkasan hasil membaca seluruh kode di `backend-api/` (dan `ai-engine/` yang dipanggil olehnya).
> Jumlah data diambil dari database lokal `backend-api/prisma/dev.db` pada 2026-09-28.
> File ini tidak masuk git, jadi isi database di komputer lain bisa berbeda.

---

## 1. Tech stack dan cara menjalankan

### Teknologi

| Bagian | Teknologi | Keterangan |
|---|---|---|
| Bahasa | TypeScript 5 (dijalankan dengan `ts-node`) | |
| Server HTTP | Express 4 | Semua rute ada di bawah `/api/v1` |
| Database | SQLite (`prisma/dev.db`) lewat Prisma ORM 6 | Skema di `prisma/schema.prisma`. Belum ada folder `migrations/` |
| Login | JWT (`jsonwebtoken`), berlaku 7 hari | Password di-hash dengan `bcryptjs` |
| Dokumentasi API | Swagger UI di `http://localhost:5000/api-docs` | Ditulis manual di `src/config/swaggerConfig.ts` |
| Koneksi ke AI | `axios` ke AI Engine (Python FastAPI, port 8000) | Lihat `src/utils/aiClient.ts` |
| Validasi | `zod` terpasang, **tetapi tidak dipakai di mana pun** | |

### Struktur folder

```
backend-api/
├── src/
│   ├── server.ts            ← titik awal: pasang middleware & semua rute
│   ├── config/              ← koneksi Prisma + definisi Swagger
│   ├── middleware/auth.ts   ← cek token JWT (authenticateToken)
│   ├── routes/              ← daftar URL → fungsi controller
│   ├── controllers/         ← logika tiap fitur
│   ├── services/            ← notifikasi WhatsApp/Email (belum dipakai)
│   └── utils/aiClient.ts    ← memanggil AI Engine
└── prisma/
    ├── schema.prisma        ← definisi tabel
    ├── seed.ts              ← isi data awal (PTN + akun demo)
    └── seed_*.ts, scrape_*.ts ← skrip pengisi data tambahan
```

### Cara menjalankan

```bash
# 1. Masuk folder & install
cd backend-api
npm install

# 2. Siapkan environment
cp .env.example .env        # isi: PORT, DATABASE_URL, JWT_SECRET, AI_ENGINE_URL

# 3. Buat database & isi data awal
npx prisma generate
npx prisma db push          # atau: npm run prisma:migrate
npm run db:seed             # 134 PTN + prodi + 4 akun demo
npx ts-node prisma/seed_kedinasan.ts   # opsional: 12 sekolah kedinasan
npx ts-node prisma/seed_questions.ts   # opsional: bank soal latihan

# 4. Jalankan server (port 5000)
npm run dev
```

Semua layanan (frontend, backend, dan AI) juga bisa dijalankan sekaligus dari root project dengan `npm run dev`.

**Akun demo** (semua memakai password `password123`):

| Email | Role |
|---|---|
| `siswa@orbita.id` | STUDENT (Ahmad Rizki, IPA, profil paling lengkap) |
| `budi@orbita.id` | STUDENT (Budi Pratama, IPS, hanya punya asesmen) |
| `gurubk@orbita.id` | BK_TEACHER |
| `admin@orbita.id` | ADMIN |

---

## 2. Daftar endpoint API

Base URL: `http://localhost:5000`

Keterangan kolom **Login**:
- 🔒 wajib mengirim header `Authorization: Bearer <token>`
- 🌐 terbuka tanpa login

### Sistem

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| GET | `/health` | 🌐 | Cek server hidup | – | `{ status, service, docs, timestamp }` |
| GET | `/api-docs` | 🌐 | Halaman Swagger | – | Halaman HTML |

### Auth (`/api/v1/auth`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| POST | `/auth/register` | 🌐 | Daftar akun baru. Jika role STUDENT, profil siswa langsung dibuat | `{ email, password, name, role?, schoolName?, grade?, majorTrack?, city? }` | `{ message, token, user{ id, email, name, role, profile } }` |
| POST | `/auth/login` | 🌐 | Login | `{ email, password }` | `{ message, token, user{ ... , profile } }` |
| GET | `/auth/me` | 🔒 | Data user yang sedang login beserta profil lengkap | – | `{ user }` + profile (rapor, prestasi, refleksi, asesmen, target PTN/prodi) |

### Profil, rapor, prestasi, asesmen (`/api/v1`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| GET | `/profile` | 🔒 | Ambil profil siswa | – | `{ profile }` (lengkap seperti `/auth/me`) |
| PUT | `/profile` | 🔒 | Ubah atau buat profil | `{ schoolName, grade, majorTrack, city, targetPtnId, targetMajorId }` | `{ message, profile }` |
| GET | `/rapor` | 🔒 | Ambil semua nilai rapor | – | `{ academicRecords: [...] }` |
| POST | `/rapor` | 🔒 | Simpan atau ubah nilai (upsert per semester + mapel) | `{ records: [{ semester, subject, score, kkm? }] }` | `{ message, records }` |
| POST | `/rapor/import-excel` | 🔒 | Import massal banyak siswa: buat akun dan isi rapor | `{ schoolData: [{ studentName, email?, nisn?, grade?, majorTrack?, schoolName?, city?, records: [...] }] }` | `{ message, importedStudentsCount, importedRecordsCount }` |
| POST | `/rapor/upload-pdf` | 🔒 | "OCR" rapor dari PDF. **Masih palsu**, lihat bagian 6 | `{ pdfBase64, semester? }` | `{ message, extractedRecords }` |
| POST | `/achievements` | 🔒 | Tambah prestasi | `{ title, category?, level?, year? }` | `{ message, achievement }` |
| DELETE | `/achievements/:id` | 🔒 | Hapus prestasi | – | `{ message }` |
| POST | `/assessment` | 🔒 | Simpan skor minat bakat (5 dimensi) | `{ technology, research, creativity, leadership, communication }` (0–100) | `{ message, assessment }` |

### Orbita Compass AI (`/api/v1/compass`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| POST | `/compass/analyze` | 🔒 | Kumpulkan data siswa, kirim ke AI Engine, simpan hasilnya | – | `{ message, analysis }` (confidenceScore, alignment %, aiSummary, dan field JSON-string: topStrengths, recommendedMajors, recommendedUnivs, recommendedCareers) |
| GET | `/compass/result` | 🔒 | Ambil hasil analisis terakhir | – | `{ analysis }` atau `{ analysis: null }` |

AI Engine (`ai-engine/`, port 8000) hanya punya dua endpoint: `GET /health` dan `POST /analyze-compass`.

### PTN, jurusan, dan latihan soal (`/api/v1/ptn`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| GET | `/ptn/universities` | 🌐 | Daftar kampus dengan pagination | Query: `city?, type?, page=1, limit=30` (maks. 100) | `{ universities: [... + majors], pagination{ page, limit, totalCount, totalPages, hasMore } }` |
| GET | `/ptn/majors` | 🌐 | Daftar prodi dengan pagination | Query: `category?, search?, page=1, limit=25` | `{ majors: [... + university], pagination }` |
| GET | `/ptn/rationalization` | 🔒 | Hitung peluang SNBP dari rata-rata rapor + bonus prestasi | – | `{ averageScore, achievementBonus, totalSNBPScore, chanceCategory, targetPtn, targetMajor, advice }` |
| GET | `/ptn/practice/questions` | 🌐 | Ambil soal latihan | Query: `category=utbk\|skd\|tka\|mandiri, campus?` | `{ category, campus, questions: [{ id, subtest, question, options, answerIndex, ... }] }` |
| POST | `/ptn/practice/submit` | 🔒 | Kirim jawaban tryout dan simpan skor | `{ type: "UTBK"\|"SKD", userAnswers: { ... } }` | `{ message, result{ session, totalScore, maxScore, correctCount, totalQuestions } }` |

### Konsultasi Guru BK (`/api/v1/bk`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| GET | `/bk/teachers` | 🌐 | Daftar guru BK | – | `{ teachers: [{ id, name, email, avatarUrl }] }` |
| GET | `/bk/bookings` | 🔒 | Siswa melihat booking miliknya; guru melihat booking yang ditujukan kepadanya | – | `{ bookings: [... + student, teacher] }` |
| POST | `/bk/bookings` | 🔒 | Buat booking (status awal `PENDING`) | `{ teacherId, bookingDate, timeSlot, topic, notes? }` | `{ message, booking }` |
| PATCH | `/bk/bookings/:id/status` | 🔒 | Ubah status atau catatan guru | `{ status?, teacherNotes? }` | `{ message, booking }` |
| DELETE | `/bk/bookings/:id` | 🔒 | Hapus booking | – | `{ message }` |

### Action plan (`/api/v1/action-plans`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| GET | `/action-plans` | 🔒 | Daftar agenda, diurutkan berdasarkan tenggat | – | `{ items, actionPlans }` (isi keduanya sama) |
| POST | `/action-plans` | 🔒 | Tambah agenda | `{ title, dueDate, description?, category?, notifyEmail?, notifyWa? }` | `{ message, item }` |
| PATCH | `/action-plans/:id/complete` | 🔒 | Tandai selesai atau belum | `{ completed: boolean }` | `{ message, item }` |
| DELETE | `/action-plans/:id` | 🔒 | Hapus agenda | – | `{ message }` |

### Feedback (`/api/v1/feedback`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| GET | `/feedback` | 🌐 | 10 ulasan terbaru + rata-rata rating | – | `{ feedbacks, averageRating, totalFeedbacks }` |
| POST | `/feedback` | 🔒 | Kirim ulasan | `{ rating (1–5), comment?, category? }` | `{ message, feedback }` |

### Admin (`/api/v1/admin`)

| Method | URL | Login | Fungsi | Kirim | Terima |
|---|---|---|---|---|---|
| GET | `/admin/stats` | 🔒 | Statistik jumlah user, kampus, prodi, tryout, dan lain-lain | – | `{ stats{ totalUsers, totalStudents, totalTeachers, totalUniversities, totalMajors, totalTryouts, totalCompassAnalyses, totalBkBookings } }` |
| GET | `/admin/users` | 🔒 | Semua user beserta ringkasan profil | – | `{ users }` |
| PATCH | `/admin/users/:id/role` | 🔒 | Ganti role user | `{ role: STUDENT\|BK_TEACHER\|ADMIN }` | `{ message, user }` |

> **Endpoint yang sudah benar-benar dipakai frontend** hanya `auth/login`, `auth/me`, `compass/analyze`, dan `compass/result`. Fungsi lain di `frontend/src/services/api.ts` sudah ditulis tetapi belum dipanggil oleh halaman mana pun, sehingga halaman lain masih memakai data statis di kode frontend.

---

## 3. Tabel database

Semua ID berupa UUID (teks). Field bertanda "JSON string" berisi teks JSON karena SQLite tidak punya tipe array.

| # | Tabel | Isinya | Kolom utama |
|---|---|---|---|
| 1 | **User** | Akun login | `email` (unik), `passwordHash`, `name`, `role` (STUDENT / BK_TEACHER / ADMIN), `avatarUrl` |
| 2 | **StudentProfile** | Profil siswa (1 user = 1 profil) | `userId`, `schoolName`, `grade` (10–12), `majorTrack` (IPA/IPS/Merdeka), `city`, `targetPtnId`, `targetMajorId` |
| 3 | **AcademicRecord** | Nilai rapor | `profileId`, `semester` (1–5), `subject`, `score`, `kkm` (default 75). Unik per (profil, semester, mapel) |
| 4 | **Achievement** | Prestasi | `profileId`, `title`, `category` (Academic/Non-Academic), `level` (School…International), `year` |
| 5 | **Reflection** | Refleksi diri (1 per siswa) | `interests`, `careerGoals` (JSON string), `motivation` |
| 6 | **Assessment** | Skor minat bakat (1 per siswa) | `technology`, `research`, `creativity`, `leadership`, `communication` (0–100) |
| 7 | **CompassAnalysis** | Riwayat hasil analisis AI | `confidenceScore`, `interestAlignmentPct`, `competencyAlignmentPct`, `careerAlignmentStatus` (ALIGNED/PARTIAL/MISALIGNED), `aiSummary`, `topStrengths`, `recommendedMajors`, `recommendedUnivs`, `recommendedCareers` (JSON string), `analyzedAt` |
| 8 | **University** | Data kampus | `code` (unik), `name`, `city`, `type` (PTN Akademik / PTN Vokasi / PTKIN / PTK Kedinasan), `accreditation`, `logoUrl` |
| 9 | **Major** | Data prodi | `universityId`, `name`, `category` (Saintek/Soshum/Vokasi/Kedinasan), `capacity`, `capacitySnbp`, `capacitySnbt`, `capacityMandiri`, `passingGrade`, `accreditation` |
| 10 | **BkBooking** | Janji konsultasi BK | `studentId`, `teacherId`, `bookingDate`, `timeSlot`, `topic`, `notes`, `teacherNotes`, `status` (PENDING/CONFIRMED/COMPLETED/CANCELLED) |
| 11 | **TryoutSession** | Riwayat tryout | `profileId`, `type` (UTBK/SKD/…), `totalScore`, `answersJson` |
| 12 | **ActionPlanItem** | Agenda dan pengingat | `profileId`, `title`, `description`, `category`, `dueDate`, `completed`, `notifyEmail`, `notifyWa` |
| 13 | **QuestionBank** | Bank soal latihan | `category` (utbk/skd/tka/mandiri), `subtest`, `question`, `optionsJson`, `answerIndex`, `difficultyWeight` |
| 14 | **SystemFeedback** | Ulasan pengguna | `userId`, `rating` (1–5), `comment`, `category` |

Relasi singkatnya:

```
User ─1:1─ StudentProfile ─1:N─ AcademicRecord, Achievement, CompassAnalysis, TryoutSession, ActionPlanItem
                          ─1:1─ Reflection, Assessment
                          ─N:1─ University (target), Major (target)
User ─1:N─ BkBooking (sebagai siswa dan sebagai guru), SystemFeedback
University ─1:N─ Major
```

---

## 4. Role pengguna

Ada tiga role di enum `Role`. **Backend belum memeriksa role sama sekali.** Middleware `auth.ts` hanya memastikan token valid, jadi pembagian di bawah ini adalah maksud desainnya, bukan aturan yang benar-benar dijaga oleh kode.

| Role | Yang dimaksudkan | Yang benar-benar terjadi di kode |
|---|---|---|
| **STUDENT** | Mengisi profil, rapor, prestasi, dan asesmen; menjalankan analisis Compass; latihan soal; membuat action plan; booking BK; memberi feedback | Semua fitur siswa berjalan. Endpoint profil, rapor, compass, tryout, dan action plan butuh `StudentProfile`, sehingga guru dan admin akan mendapat 404 |
| **BK_TEACHER** | Melihat booking dari siswa, mengonfirmasi, dan memberi catatan | Satu-satunya perbedaan di kode: di `GET /bk/bookings`, guru melihat booking yang ditujukan kepadanya. Namun siswa juga bisa memanggil `PATCH /bk/bookings/:id/status` |
| **ADMIN** | Melihat statistik, daftar user, mengubah role | Endpoint `/admin/*` **bisa diakses user mana pun yang sudah login**, termasuk siswa |

---

## 5. Status data

Legenda:
- ✅ **Ada data**: tabel ada dan sudah terisi
- 🟡 **Baru struktur**: tabel dan endpoint sudah ada, tetapi datanya kosong, sangat sedikit, atau hanya contoh/dummy
- ❌ **Belum ada**: tidak ada tabel maupun endpoint

| Data | Status | Detail |
|---|---|---|
| **Kampus** | ✅ Ada (kualitas data dummy) | 146 baris: 70 PTN Akademik, 38 PTN Vokasi, 26 PTKIN, dan 12 Kedinasan. Nama dan kota sesuai kenyataan, tetapi **semua akreditasi diisi "Unggul"** dan **tidak ada logo**. Klaim "146 PTN" sebenarnya 134 PTN + 12 kedinasan, karena ada kode ganda (911, 912, 913, 921) di daftar. |
| **Jurusan (prodi)** | ✅ Ada (hasil template) | 1.570 baris, tetapi hanya **50 nama prodi unik**. Setiap PTN diberi 14 prodi yang sama (Informatika, Kedokteran, Hukum, dll.). Daya tampung dan passing grade **dihitung dengan rumus**, bukan data resmi. Skrip bernama "scraper" **tidak benar-benar mengambil data dari internet**. Kategori "Vokasi" ada di skema tetapi tidak ada datanya. README menyebut 1.895 prodi dan 149 kampus, tidak cocok dengan database. |
| **Beasiswa** | ❌ Belum ada | Tidak ada tabel, endpoint, maupun seed. Teks tentang beasiswa hanya muncul sebagai teks statis di frontend. |
| **Soal tes minat bakat** | ❌ Soal belum ada · 🟡 hasilnya baru struktur | Tabel `Assessment` hanya menyimpan 5 skor akhir. Tidak ada tabel atau endpoint untuk **soal** tes minat bakat; pertanyaannya masih ditulis langsung di frontend. Data: 2 asesmen (akun demo). Tabel `Reflection` (1 baris) **tidak punya endpoint untuk menyimpan**. |
| **Prestasi** | 🟡 Baru struktur | CRUD tersedia (tambah dan hapus; **belum ada edit**). Data: 2 baris milik akun demo. Frontend belum memanggil endpoint ini. |
| **Rapor** | 🟡 Baru struktur | GET/POST berfungsi, import Excel massal berfungsi (dalam bentuk JSON, **bukan file .xlsx**). Upload PDF masih palsu. Data: 11 nilai milik 1 siswa demo, dengan hanya 2–3 mapel. Frontend belum memanggil endpoint ini. |
| **Tryout** | 🟡 Baru struktur | Bank soal: **8 soal** di database (5 UTBK, 3 SKD). Seed juga berisi 2 soal TKA dan 2 soal Mandiri yang belum masuk ke database lokal. `TryoutSession`: 0 baris. Perhitungan skor belum benar (lihat bagian 6). |
| **Action plan** | 🟡 Baru struktur | CRUD lengkap kecuali edit judul/tanggal. Data: 0 baris. Notifikasi WA/Email ada kodenya tetapi **tidak pernah dipanggil**. |

Untuk perbandingan, data lain: User 4 · StudentProfile 2 · CompassAnalysis 2 (keduanya hasil fallback) · BkBooking 0 · SystemFeedback 0.

---

## 6. Bagian yang belum selesai atau janggal

### 🔴 Keamanan (paling penting)

1. **Siapa saja bisa mendaftar sebagai ADMIN.** `POST /auth/register` menerima `role: "ADMIN"` langsung dari body request (`authController.ts`).
2. **Endpoint admin tidak dicek role-nya.** Siswa yang login bisa membuka `/admin/users` dan mengubah role siapa pun menjadi ADMIN (`adminRoutes.ts`).
3. **Data milik orang lain bisa diubah atau dihapus.** Endpoint berikut hanya memakai `id` tanpa mengecek pemiliknya:
   - `DELETE /achievements/:id`
   - `PATCH/DELETE /action-plans/:id`
   - `PATCH/DELETE /bk/bookings/:id`
4. **Kunci jawaban ikut terkirim.** `GET /ptn/practice/questions` mengirim `answerIndex` ke browser, sehingga siswa bisa melihat jawaban benar.
5. **Import Excel bisa dipakai siapa saja yang login** untuk membuat akun baru dengan password bawaan `password123`.
6. **JWT secret bawaan tertulis di kode dan di `.env.example`.** Jika `.env` lupa diisi, token bisa dipalsukan.
7. Belum ada validasi input (zod terpasang tetapi tidak dipakai), dan `status` booking bisa diisi teks apa pun.

### 🟠 Logika yang salah atau masih palsu

8. **Skor tryout tidak memeriksa jawaban.** `submitPracticeAnswers` menghitung "benar" dari *jumlah soal yang dijawab*, bukan dari yang benar. Jumlah soal juga di-hardcode (5 untuk UTBK, 3 untuk SKD).
9. **Upload PDF rapor adalah mock.** Isi file diabaikan, lalu 5 nilai palsu (Matematika 92, Fisika 90, dan seterusnya) **ditulis ke rapor siswa dan menimpa nilai asli**.
10. **Analisis AI jatuh ke jawaban cadangan (fallback).** Kedua baris `CompassAnalysis` di database berisi nilai statis dari `aiClient.ts` (skor 85/88/82, ringkasan "Siswa menunjukkan potensi yang kuat…"). Artinya hasil tersebut bukan dari AI. Penyebab yang paling mungkin: `Reflection.interests` disimpan sebagai JSON string, sedangkan AI Engine mengharapkan array, sehingga request ditolak (422). Kemungkinan lain adalah AI Engine sedang tidak berjalan. Error ini ditelan diam-diam, sehingga frontend tetap menampilkan hasil seolah-olah berhasil.
11. **Nilai default menyembunyikan data kosong.** Beberapa contoh:
    - `compassController` memakai `|| 88.5` dan sejenisnya, sehingga skor 0 berubah menjadi 88.5.
    - Asesmen memakai `|| 70`, sehingga skor 0 tersimpan sebagai 70.
    - Rata-rata feedback bernilai 4.8 walaupun belum ada ulasan.
    - Target PTN dan prodi otomatis menjadi "UI / Teknik Informatika" jika kosong.
12. Field `name` yang dikirim ke AI Engine berisi **email**, bukan nama siswa.
13. Rasionalisasi SNBP hanya berupa `rata-rata × 0.85 + 2.5 per prestasi`. Rumus ini tidak memperhitungkan prodi, daya tampung, atau passing grade.

### 🟡 Belum selesai atau tidak konsisten

14. **Notifikasi WA/Email** (`notificationService.ts`) tidak dipanggil dari mana pun dan tidak ada penjadwal (cron). `OPENWA_API_URL` juga tidak ada di `.env.example`.
15. **Tidak ada endpoint** untuk: menyimpan Reflection, mengedit prestasi atau action plan, membaca riwayat tryout, mengelola bank soal, mengelola data kampus/prodi, dan beasiswa.
16. Skrip seed tumpang-tindih: `scrape_and_seed_ptn.ts` dan `snpmb_full_scraper.ts` tidak dipakai oleh `seed.ts`, tetapi berisi daftar PTN yang kodenya bentrok (misalnya UIN Alauddin berkode 907 di satu file dan 925 di file lain). `seed_kedinasan.ts` dan `seed_questions.ts` tidak ada di script npm.
17. `GET /ptn/universities` ikut mengambil **semua prodi** tiap kampus. Respons jadi berat, padahal ada endpoint `/ptn/majors` sendiri.
18. Model Gemini di `ai-engine/llm_pipeline.py` adalah `gemini-2.0-flash`, sedangkan README menyebut 2.5 Flash.
19. Komentar kode menyebut "PostgreSQL", padahal yang dipakai SQLite. Belum ada folder `prisma/migrations`, sehingga perubahan skema tidak tercatat.
20. Swagger ditulis manual dan belum mencakup semua endpoint (misalnya import rapor, achievements, assessment, feedback, admin).
21. `GET /action-plans` mengirim data yang sama dua kali (`items` dan `actionPlans`).
22. Rapor dibatasi semester 1–5 menurut komentar skema, tetapi tidak ada validasinya.
23. Hampir semua endpoint belum dipakai frontend (lihat catatan di akhir bagian 2).
