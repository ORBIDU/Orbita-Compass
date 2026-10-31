# 📚 Orbidu CBT & AI Question Engine — Panduan & Dokumentasi

Modul ini adalah mesin bank soal dan generator soal AI berbasis kurikulum seleksi nasional Indonesia (**SNBT/UTBK Kemdikbud BPPP**, **SKD Kedinasan BKN**, dan **TKA**). 

Modul ini dirancang **modular (*plug and play*)** sehingga dapat digunakan langsung pada portal utama Orbita-Compass, maupun di-*spin-off* untuk situs publik terpisah seperti `siap-snbp.orbidu.com`.

---

## 🎯 1. Ringkasan Aset yang Telah Dibuat

1. **1.051 Butir Soal Autentik Terstruktur**:
   - **SKD Kedinasan (CAT BKN)**: 110 butir (TWK: 30, TIU: 35, TKP: 45) lengkap dengan pembahasan resmi.
   - **TKA (Tes Kemampuan Akademik)**: 675 butir mencakup 15 mata pelajaran SMA/SMK (Matematika Saintek, Fisika, Kimia, Biologi, Sosiologi, Ekonomi, Geografi, Sejarah, PPKN, B. Indonesia, B. Inggris, Antropologi).
   - **UTBK Asli 2024 (Kemdikbud BPPP)**: 141 butir (PU, PBM, PPU, LBI, LBE).
   - **SNBT Standar Bimbel (Alternatifa ALTO 001)**: 125 butir lengkap untuk seluruh 7 subtes (PU, PPU, PBM, LBI, LBE, PK, PM).
2. **AI Question Blueprint (25 Subtes)**:
   - Berisi taksonomi, panduan distribusi kesulitan (HOTS), tone bahasa akademis, dan contoh soal autentik (*few-shot exemplars*) untuk memandu Gemini AI.
3. **Layanan AI Generator Modular (`aiQuestionService.ts`)**:
   - Menghasilkan butir soal baru dengan Gemini 2.0 Flash (`response_mime_type: "application/json"`).
   - Memiliki *graceful fallback* dari arsip 1.051 soal agar sistem tidak pernah *crash* bila kuota habis atau offline.

---

## 📂 2. Struktur Berkas

```
backend-api/
├── prisma/
│   ├── data/
│   │   ├── master_questions.json    # 1.051 soal siap pakai (1,8 MB)
│   │   └── question_blueprints.json # Taksonomi & template AI (123 KB)
│   ├── schema.prisma                # Model QuestionBank (dengan topic & explanation)
│   └── seed_questions.ts            # Seeder batch PostgreSQL
├── scripts/
│   ├── extract_soal_archive.py      # Ekstraktor arsip zip 300MB
│   └── test_ai_generator.ts         # Script uji coba generator AI lokal
└── src/
    ├── services/
    │   └── aiQuestionService.ts     # Engine generator soal (Plug-and-Play)
    ├── controllers/
    │   └── ptnController.ts         # Controller CBT & AI Generator
    └── routes/
        └── ptnRoutes.ts             # Route endpoint API
docs/
└── BANK_SOAL_README.md              # Dokumentasi lengkap modul ini
```

---

## ⚡ 3. Cara Penggunaan (CLI Scripts)

Jalankan perintah ini dari dalam folder `backend-api`:

```bash
# 1. Memasukkan seluruh 1.051 soal ke database PostgreSQL (QuestionBank)
npm run db:seed:questions

# 2. Mengetes kemampuan generator AI secara lokal tanpa server
npx ts-node scripts/test_ai_generator.ts

# 3. Menjalankan ulang ekstraksi jika arsip zip diperbarui
npm run extract:soal
```

---

## 🌐 4. Endpoint API & Alur Penggunaan

### A. Untuk Siswa (Pengerjaan Latihan / Tryout)
* **Ambil Soal (Aman tanpa bocoran kunci/pembahasan):**
  ```http
  GET /api/v1/ptn/practice/questions?category=snbt&subtest=Penalaran%20Umum&limit=10
  ```
  *Respon:* Mengembalikan daftar butir soal, opsi A–E, bobot kesulitan. Field `answerIndex` dan `explanation` disembunyikan.

* **Submit Jawaban & Koreksi Otomatis di Server:**
  ```http
  POST /api/v1/ptn/practice/submit
  Authorization: Bearer <token_siswa>
  Content-Type: application/json

  {
    "type": "UTBK",
    "userAnswers": {
      "id-soal-1": 2,
      "id-soal-2": 0
    }
  }
  ```
  *Respon:* Server mengoreksi di backend, menghitung skor skala 0–1000 (atau 0–550 untuk SKD), dan mengembalikan skor beserta **kunci & pembahasan lengkap**.

---

### B. Untuk Admin / Dapur Konten (Memperbanyak Bank Soal)
* **Melihat Blueprint & Subtes yang Tersedia:**
  ```http
  GET /api/v1/ptn/practice/blueprints
  ```

* **Generate Soal Baru secara Batch dengan AI:**
  ```http
  POST /api/v1/ptn/practice/generate-ai
  Content-Type: application/json

  {
    "category": "snbt",
    "subtest": "Penalaran Umum",
    "topic": "Silogisme & Penarikan Kesimpulan",
    "count": 5,
    "difficulty": "medium",
    "saveToBank": true
  }
  ```
  *Catatan:* Jika `saveToBank: true`, hasil generate langsung tersimpan permanen di database `QuestionBank`.

---

## 🔌 5. Implementasi untuk *Spin-Off* (`siap-snbp.orbidu.com`)

Karena modul ini **Plug-and-Play**:

1. **Gunakan Backend yang Sama:**
   Web publik `siap-snbp.orbidu.com` dapat langsung menembak API `GET /ptn/practice/questions` dan `POST /ptn/practice/submit` milik backend ini.
2. **Tanpa Biaya Token AI per Siswa:**
   Siswa umum yang latihan gratis di web publik mengambil soal yang sudah ada di database `QuestionBank`. Server sangat cepat (< 50ms) dan nol biaya API token.
3. **Jika Ingin Dipisah Menjadi Microservice Mandiri:**
   Cukup salin:
   - `backend-api/src/services/aiQuestionService.ts`
   - Folder `backend-api/prisma/data/` (berisi JSON bank soal & blueprint)
   Maka service generator soal siap berjalan di server mana pun tanpa dependensi ke tabel user/rapor.
