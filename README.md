# 🧭 Orbita Compass

> **Platform analitik & mentor akademik berbasis AI untuk siswa SMA/SMK/MA Indonesia yang mempersiapkan diri masuk Perguruan Tinggi Negeri (PTN) dan Sekolah Kedinasan.**

Orbita Compass membantu siswa memahami potensi diri, merencanakan jalur studi (SNBP, SNBT, Mandiri, Kedinasan), berlatih soal CBT, dan mendapatkan bimbingan dari Guru BK — semuanya dalam satu platform terpadu.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/mauinGit/Orbita-Compass)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://python.org)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-orange)](https://ai.google.dev)

---

## 📋 Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Arsitektur Sistem](#-arsitektur-sistem)
3. [Tech Stack](#-tech-stack)
4. [Struktur Folder](#-struktur-folder)
5. [Prasyarat (Requirements)](#-prasyarat-requirements)
6. [Panduan Setup & Instalasi](#-panduan-setup--instalasi)
7. [Menjalankan Sistem](#-menjalankan-sistem)
8. [Akun Demo Bawaan](#-akun-demo-bawaan)
9. [Dokumentasi API](#-dokumentasi-api)
10. [Data & Database](#-data--database)
11. [Algoritma & Rumus Perhitungan](#-algoritma--rumus-perhitungan)
12. [Keamanan & Konfigurasi Environment](#-keamanan--konfigurasi-environment)
13. [Panduan Kontribusi](#-panduan-kontribusi)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🎯 **Dashboard Siswa** | Ringkasan profil, target PTN, kuota SNBP/SNBT/Mandiri real-time, radar keselarasan AI |
| 🧭 **Orbita Compass AI** | Analisis keselarasan minat × bakat × nilai rapor menggunakan Gemini 2.0 Flash |
| 📊 **Potensi Diri** | Asesmen 5 dimensi (Teknologi, Riset, Kreativitas, Kepemimpinan, Komunikasi) |
| 🏫 **Eksplor Jurusan & PTN** | 1.895 Prodi + 149 Kampus real dengan Lazy Load Pagination, filter rumpun, dan pencarian |
| 📝 **Siap PTN — UTBK** | Simulator CBT UTBK SNBT dengan penilaian IRT (0–1000 poin), 7 subtes |
| 🏛️ **Siap SKD Kedinasan** | Simulator CBT SKD resmi (TWK, TIU, TKP) dengan skala 0–550 poin |
| 📅 **Action Plan & Agenda** | Kalender persiapan + notifikasi WhatsApp via Open-WA |
| 👨‍🏫 **Konsultasi Guru BK** | Booking janji sesi bimbingan akademik tatap muka/daring |
| 📄 **Import Rapor** | Impor nilai rapor via file Excel (e-Rapor) atau OCR PDF |

---

## 🏗️ Arsitektur Sistem

Orbita Compass dibangun menggunakan pola **Hybrid Monorepo** dengan tiga layanan yang berjalan secara independen namun saling terhubung:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                    http://localhost:5173                         │
│                  React 19 + Vite + Tailwind                     │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API SERVER                           │
│                    http://localhost:5000                         │
│             Node.js + Express + TypeScript + Prisma ORM         │
│                    Database: SQLite (dev.db)                     │
└────────────────────┬──────────────────────┬─────────────────────┘
                     │                      │
              Auth / JWT             AI Request (Axios)
                     │                      │
                     │                      ▼
                     │     ┌──────────────────────────────────┐
                     │     │         AI ENGINE                │
                     │     │     http://localhost:8000        │
                     │     │  Python FastAPI + Gemini 2.0 +   │
                     │     │    Numpy Scoring Engine          │
                     │     └──────────────────────────────────┘
                     │
              ┌──────┴──────┐
              │  SQLite DB  │
              │  (dev.db)   │
              │  Prisma ORM │
              └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (`frontend/`)
| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 19.x | Framework UI utama |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | 3.x | Styling & design system |
| React Router DOM | 7.x | Client-side routing |
| Recharts | 3.x | Visualisasi grafik radar & chart |

### Backend API (`backend-api/`)
| Teknologi | Versi | Fungsi |
|---|---|---|
| Node.js | 22.x | Runtime JavaScript server |
| Express | 4.x | Framework HTTP API |
| TypeScript | 5.x | Type-safe development |
| Prisma ORM | 6.x | Database ORM & migrations |
| SQLite | - | Database lokal (dev), dapat upgrade ke PostgreSQL |
| bcryptjs | 2.x | Hashing password |
| jsonwebtoken | 9.x | JWT Authentication |
| Zod | 3.x | Validasi skema request body |
| Nodemon | 3.x | Auto-restart server saat development |

### AI Engine (`ai-engine/`)
| Teknologi | Versi | Fungsi |
|---|---|---|
| Python | 3.10+ | Runtime AI engine |
| FastAPI | 0.115+ | Framework HTTP microservice |
| Uvicorn | 0.30+ | ASGI server |
| Pydantic | 2.8+ | Validasi data model |
| Numpy | 1.26+ | Komputasi numerik scoring |
| google-genai | 0.1+ | Gemini 2.0 Flash API client |
| python-dotenv | 1.0+ | Pembacaan environment variables |

---

## 📁 Struktur Folder

```
Orbita-Compass/
│
├── 📄 package.json              ← Root launcher (npm run dev menjalankan semua sekaligus)
├── 📄 .gitignore                ← File yang dikecualikan dari Git
├── 📄 README.md
│
├── 💻 frontend/
│   ├── src/
│   │   ├── pages/               ← 8 halaman utama aplikasi
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CompassPage.jsx
│   │   │   ├── PotensiDiriPage.jsx
│   │   │   ├── EksplorJurusanPage.jsx
│   │   │   ├── SiapPTNPage.jsx
│   │   │   ├── SiapSKDPage.jsx
│   │   │   ├── ActionPlanPage.jsx
│   │   │   ├── KonsultasiPage.jsx
│   │   │   └── AuthPage.jsx
│   │   ├── components/          ← Komponen UI reusable
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopHeader.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx  ← Global auth state management
│   │   ├── services/
│   │   │   └── api.js           ← Semua fungsi pemanggil API backend
│   │   └── layouts/
│   │       └── AppLayout.jsx    ← Layout utama dengan sidebar
│   └── package.json
│
├── ⚙️ backend-api/
│   ├── src/
│   │   ├── controllers/         ← Logika bisnis tiap modul
│   │   │   ├── authController.ts
│   │   │   ├── profileController.ts
│   │   │   ├── ptnController.ts
│   │   │   ├── compassController.ts
│   │   │   ├── actionPlanController.ts
│   │   │   ├── bkController.ts
│   │   │   └── raporImportController.ts
│   │   ├── routes/              ← Definisi endpoint API
│   │   ├── middleware/
│   │   │   └── auth.ts          ← JWT middleware authentication
│   │   ├── services/
│   │   │   └── notificationService.ts  ← Open-WA WhatsApp notifikasi
│   │   └── server.ts            ← Entry point Express server
│   ├── prisma/
│   │   ├── schema.prisma        ← Definisi 13 model database
│   │   ├── seed.ts              ← Seed user demo & data awal
│   │   ├── seed_kedinasan.ts    ← Seed 12 Sekolah Kedinasan
│   │   └── seed_questions.ts   ← Seed bank soal UTBK & SKD
│   ├── .env.example             ← Template konfigurasi environment
│   └── package.json
│
└── 🤖 ai-engine/
    ├── main.py                  ← FastAPI app, endpoint, CORS
    ├── scoring.py               ← Algoritma scoring multi-rumpun
    ├── llm_pipeline.py          ← Gemini 2.0 Flash integration
    ├── requirements.txt         ← Dependensi Python
    └── .env.example             ← Template API key Gemini
```

---

## 📦 Prasyarat (Requirements)

Pastikan sudah terinstall di komputer:

| Kebutuhan | Versi Minimum | Cara Cek |
|---|---|---|
| **Node.js** | 18.x atau lebih baru | `node --version` |
| **npm** | 9.x atau lebih baru | `npm --version` |
| **Python** | 3.10 atau lebih baru | `python --version` |
| **pip** | 22.x atau lebih baru | `pip --version` |
| **Git** | 2.x atau lebih baru | `git --version` |

---

## 🚀 Panduan Setup & Instalasi

### Langkah 1 — Klon Repository

```bash
git clone https://github.com/mauinGit/Orbita-Compass.git
cd Orbita-Compass
```

### Langkah 2 — Salin & Isi File Environment

**Backend API:**
```bash
cp backend-api/.env.example backend-api/.env
```
Buka file `backend-api/.env` dan sesuaikan nilai berikut:
```env
PORT=5000
DATABASE_URL="file:./dev.db"          # SQLite untuk development
JWT_SECRET="ganti_dengan_string_acak_panjang"
AI_ENGINE_URL="http://localhost:8000"
```

**AI Engine:**
```bash
cp ai-engine/.env.example ai-engine/.env
```
Buka file `ai-engine/.env` dan isi API key Gemini:
```env
PORT=8000
GEMINI_API_KEY="isi_api_key_gemini_dari_aistudio.google.com"
```

> 💡 API key Gemini bisa didapat gratis di [Google AI Studio](https://aistudio.google.com/app/apikey)

### Langkah 3 — Install Semua Dependensi

```bash
# Instalasi launcher & concurrently (di root folder)
npm install

# Instalasi dependensi frontend
cd frontend && npm install && cd ..

# Instalasi dependensi backend
cd backend-api && npm install && cd ..

# Instalasi dependensi Python AI engine
cd ai-engine && pip install -r requirements.txt && cd ..
```

### Langkah 4 — Setup Database & Seed Data

```bash
cd backend-api

# Buat/sinkronkan struktur database dari schema Prisma
npx prisma db push

# Seed data: user demo, 149 PTN & Kedinasan, 1.895 prodi, bank soal
npx ts-node prisma/seed.ts
npx ts-node prisma/seed_kedinasan.ts
npx ts-node prisma/seed_questions.ts

cd ..
```

> ⚠️ Jika muncul error `EPERM` karena file `query_engine-windows.dll.node` terkunci di Windows, hentikan semua proses Node.js terlebih dahulu: `Stop-Process -Name "node" -Force`

---

## ▶️ Menjalankan Sistem

### Satu Perintah (Direkomendasikan)

Dari root folder, cukup jalankan:

```bash
npm run dev
```

Secara otomatis akan menjalankan ketiga layanan secara bersamaan dengan output berwarna berbeda:

```
[FE]  ➜  Local:   http://localhost:5173   ← Aplikasi Web
[BE]  ➜  Running: http://localhost:5000   ← Backend API
[AI]  ➜  Running: http://localhost:8000   ← AI Engine
```

### Perintah Terpisah (Opsional)

Jika ingin menjalankan masing-masing layanan secara terpisah di terminal berbeda:

```bash
# Terminal 1 — Frontend Web
npm run dev:fe

# Terminal 2 — Backend API
npm run dev:be

# Terminal 3 — AI Engine Python
npm run dev:ai
```

---

## 👤 Akun Demo Bawaan

Setelah seed selesai, gunakan akun berikut untuk langsung mencoba aplikasi:

> **Password untuk semua akun: `password123`**

| Email | Role | Keterangan |
|---|---|---|
| `siswa@orbita.id` | 🎓 Siswa Saintek | Profil siswa IPA dengan rapor & target PTN |
| `budi@orbita.id` | 🎓 Siswa Soshum | Profil siswa IPS dengan data asesmen |
| `gurubk@orbita.id` | 👨‍🏫 Guru BK | Dapat menerima & mengelola jadwal konsultasi |
| `admin@orbita.id` | 👑 Administrator | Akses penuh ke seluruh sistem |

---

## 📡 Dokumentasi API

Base URL: `http://localhost:5000/api/v1`

Endpoint yang memerlukan autentikasi harus menyertakan header:
```
Authorization: Bearer <JWT_TOKEN>
```

### 🔐 Autentikasi
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Daftar akun baru |
| `POST` | `/auth/login` | ❌ | Login & dapatkan JWT token |
| `GET` | `/auth/me` | ✅ | Ambil data user yang sedang login |

### 👤 Profil & Rapor
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/profile` | ✅ | Ambil profil siswa lengkap |
| `PUT` | `/profile` | ✅ | Update data profil siswa |
| `GET` | `/rapor` | ✅ | Ambil nilai rapor semua semester |
| `POST` | `/rapor` | ✅ | Simpan/update nilai rapor |
| `POST` | `/rapor/import-excel` | ✅ | Impor nilai rapor dari file Excel e-Rapor |
| `POST` | `/rapor/upload-pdf` | ✅ | Impor nilai rapor via OCR dari PDF rapor |
| `POST` | `/achievements` | ✅ | Tambah prestasi/sertifikat baru |
| `DELETE` | `/achievements/:id` | ✅ | Hapus prestasi berdasarkan ID |
| `POST` | `/assessment` | ✅ | Simpan/update skor asesmen minat bakat |

### 🏫 Data PTN & Simulator
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/ptn/universities?page=1&limit=30&city=&type=` | ❌ | Daftar universitas (dengan pagination) |
| `GET` | `/ptn/majors?page=1&limit=25&category=&search=` | ❌ | Daftar prodi (dengan lazy load pagination) |
| `GET` | `/ptn/rationalization` | ✅ | Kalkulasi rasionalisasi SNBP siswa |
| `GET` | `/ptn/practice/questions?category=utbk` | ❌ | Ambil bank soal UTBK atau SKD |
| `POST` | `/ptn/practice/submit` | ✅ | Submit jawaban & hitung skor CBT |

### 🧭 Compass AI
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/compass/analyze` | ✅ | Jalankan analisis keselarasan AI (Gemini) |
| `GET` | `/compass/result` | ✅ | Ambil hasil analisis AI terakhir |

### 📅 Action Plan
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/action-plans` | ✅ | Ambil semua agenda persiapan siswa |
| `POST` | `/action-plans` | ✅ | Buat agenda baru |
| `PATCH` | `/action-plans/:id/complete` | ✅ | Tandai agenda selesai/belum |
| `DELETE` | `/action-plans/:id` | ✅ | Hapus agenda berdasarkan ID |

### 👨‍🏫 Bimbingan Konseling (BK)
| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/bk/teachers` | ❌ | Daftar Guru BK yang tersedia |
| `GET` | `/bk/bookings` | ✅ | Riwayat booking konsultasi siswa |
| `POST` | `/bk/bookings` | ✅ | Buat booking jadwal konsultasi baru |
| `PATCH` | `/bk/bookings/:id/status` | ✅ | Update status booking (Guru BK) |
| `DELETE` | `/bk/bookings/:id` | ✅ | Batalkan booking |

---

## 🗄️ Data & Database

### Database Schema (13 Model)

```
User → StudentProfile → AcademicRecord   (Nilai Rapor Smt 1-5)
                     → Achievement       (Prestasi & Sertifikat)
                     → Assessment        (Asesmen 5 Dimensi)
                     → CompassAnalysis   (Hasil AI Gemini)
                     → TryoutSession     (Hasil Simulasi CBT)
                     → ActionPlanItem    (Agenda Persiapan)
                     → Reflection        (Minat & Tujuan Karir)

University → Major    (Data PTN & Program Studi)

BkBooking             (Booking Konsultasi Guru BK)

QuestionBank          (Bank Soal UTBK & SKD)
```

### Sumber Data Real (Resmi)

| Sumber | Jumlah | Tipe |
|---|---|---|
| PTN Akademik | 76 | UI, ITB, UGM, Unair, Undip, ITS, dll. |
| Politeknik Vokasi Negeri | 44 | Pens, PNJ, Polban, PENS, dll. |
| PTKIN (UIN/IAIN/STAIN) | 26 | UIN Jakarta, UIN Sunan Kalijaga, dll. |
| Sekolah Kedinasan (PTK) | 12 | PKN STAN, IPDN, STIS, STIN, SSN, STMKG, dll. |
| **Total Institusi** | **158** | — |
| **Total Program Studi** | **1.895** | Dengan kuota SNBP, SNBT, dan Mandiri terpisah |
| Bank Soal UTBK | 7 subtes | PU, PBM, PM, LBE, PK, PPU, PI |
| Bank Soal SKD Kedinasan | 3 subtes | TWK, TIU, TKP |

---

## 📐 Algoritma & Rumus Perhitungan

### 1. Indeks Konsistensi Akademik

$$\text{Consistency} = \mu_{\text{rapor}} - (0.5 \times \sigma_{\text{rapor}})$$

- Semakin konsisten nilai antar semester, semakin tinggi indeks.
- Nilai deviasi standar yang tinggi menurunkan skor secara adil.

### 2. Rasionalisasi SNBP

$$\text{Skor SNBP} = \min\left(100, \; \text{round}\left(0.85 \times \mu_{\text{rapor}} + 2.5 \times N_{\text{prestasi}}\right)\right)$$

- Nilai rapor berkontribusi 85%, prestasi memberikan bonus maksimal.

### 3. Confidence Score AI (Keandalan Rekomendasi)

$$\text{Confidence} = 0.45 \times S_{\text{Rapor}} + 0.35 \times S_{\text{Asesmen}} + 0.20 \times S_{\text{Prestasi}}$$

- Semakin lengkap data siswa, semakin tinggi keandalan rekomendasi AI.

### 4. Skor Simulasi UTBK SNBT

$$\text{IRT Score} = \text{round}\left(\frac{\sum_{\text{Benar}} (1 + w_j)}{\sum_{\text{Total}} (1 + w_j)} \times 1000\right)$$

- Skala: **0 – 1000 poin** (IRT / Item Response Theory).
- $w_j$ = bobot kesulitan soal (`difficultyWeight`).

### 5. Skor Simulasi SKD Kedinasan

$$\text{SKD Score} = \text{round}\left(\frac{N_{\text{Benar}}}{N_{\text{Total}}} \times 550\right)$$

- Skala: **0 – 550 poin** (TWK maks 150, TIU maks 175, TKP maks 225).

---

## 🔒 Keamanan & Konfigurasi Environment

### File Environment yang Dibutuhkan

> ⚠️ **JANGAN pernah commit file `.env` ke Git.** File `.env` sudah masuk daftar `.gitignore` secara otomatis.

**`backend-api/.env`**
```env
# Server
PORT=5000

# Database
# Untuk development lokal (SQLite):
DATABASE_URL="file:./dev.db"
# Untuk production (PostgreSQL):
# DATABASE_URL="postgresql://user:password@host:5432/orbita_db?schema=public"

# JWT
JWT_SECRET="string_acak_panjang_minimal_32_karakter"

# AI Engine URL
AI_ENGINE_URL="http://localhost:8000"

# WhatsApp Open-WA (opsional, untuk notifikasi)
OPENWA_API_URL="http://localhost:8080"
OPENWA_SESSION_ID="orbita-session"
```

**`ai-engine/.env`**
```env
PORT=8000
GEMINI_API_KEY="dapatkan_dari_aistudio.google.com"
```

### Cara Menjaga `.env` Lokal Tidak Terhapus Saat `git pull`

Jalankan perintah ini **sekali** di komputer masing-masing setelah membuat file `.env`:

```bash
git update-index --skip-worktree backend-api/.env
git update-index --skip-worktree ai-engine/.env
```

Setelah itu, Git akan mengabaikan file `.env` lokal meski ada perubahan di remote repository.

### Keamanan Sistem
- ✅ Password di-hash menggunakan **bcryptjs** (salt rounds: 10).
- ✅ Autentikasi menggunakan **JWT Bearer Token** dengan expiry 7 hari.
- ✅ File `.env` dan `dev.db` **tidak pernah di-push** ke GitHub.
- ✅ CORS dikonfigurasi di backend dan AI engine.
- ✅ Error handler terpusat (tidak membocorkan stack trace ke client).

---

## 🤝 Panduan Kontribusi

Kontribusi sangat disambut! Ikuti langkah berikut:

1. **Fork** repository ini.
2. Buat branch baru: `git checkout -b feat/nama-fitur-kamu`
3. Lakukan perubahan dan commit: `git commit -m "feat: tambah fitur X"`
4. Push ke branch kamu: `git push origin feat/nama-fitur-kamu`
5. Buat **Pull Request** ke branch `main`.

### Konvensi Commit Message
Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):
```
feat:     Fitur baru
fix:      Perbaikan bug
docs:     Perubahan dokumentasi
refactor: Refactoring kode
security: Perbaikan keamanan
```

---

## 📄 Lisensi

[MIT License](LICENSE) © 2026 Orbita Compass Team — Naufal & Contributors.

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk siswa Indonesia yang berjuang menuju kampus impian.</p>
  <b>Orbita Compass — Temukan Arahmu, Raih Tujuanmu 🚀</b>
</div>
