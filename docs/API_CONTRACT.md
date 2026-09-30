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
- Saat naik kelas, status kembali `baru` dan hasil tes lama disimpan sebagai riwayat.
- Tabel `Assessment` saat ini unik per profil (hanya 1 hasil), jadi riwayat tidak bisa disimpan.
- **Usulan:** tambah kolom `grade` dan `completedAt`, hapus batasan unik, lalu tambah endpoint:

```
GET /assessment/history
→ { "history": [ { "grade": 10, "completedAt": "…", "technology": 80, "research": 70, "creativity": 75, "leadership": 60, "communication": 72 } ] }
```

### 3.3 Menyimpan jawaban tes per bagian 🔴
- SPEK meminta simpan otomatis tiap bagian (42 soal, 7 bagian). `POST /assessment` hanya menerima 5 skor akhir.
- **Usulan:** `PUT /assessment/answers` dengan body `{ "section": 1, "answers": { "q1": 4, "q2": 5 } }`, dan `GET /assessment/answers` untuk melanjutkan tes. Detailnya ditentukan di Fase 4.

---

## 4. Kebutuhan lain yang sudah diketahui

Belum ada bentuk final. Dirinci saat fasenya dikerjakan.

| Kebutuhan | Fase | Status |
|---|---|---|
| Katalog jurusan per **nama jurusan** (bukan per kampus) dengan `slug`, bidang, deskripsi, `imageUrl`, mapel pendukung, prospek karier. Sementara frontend memakai `mocks/data/jurusan.ts` di mode dummy maupun backend (`services/jurusanService.ts`). Bentuk final ditulis di Tahap 2B. | 2 | 🔴 |
| Prestasi: ubah, field peringkat/penyelenggara, upload sertifikat | 4 | 🔴 |
| Hasil Compass sungguhan (sekarang selalu jawaban cadangan, lihat `BACKEND_MAP.md` poin 10) | 5 | 🟡 |
| Data beasiswa (daftar, filter, detail) | 5 | 🔴 |
| Action Plan: fokus, hari belajar, penyusun tugas otomatis, geser tugas terlewat | 6 | 🔴 |
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
