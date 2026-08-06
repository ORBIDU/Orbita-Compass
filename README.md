# 🧭 Orbita Compass — Platform Analitis & Mentor Akademik PTN/Kedinasan berbasis Gemini AI

Platform *Student Profiling, Rasionalisasi SNBP, Simulator UTBK & SKD Kedinasan, serta Guidance Counseling* untuk siswa SMA/SMK/MA Indonesia.

---

## 🏗️ Arsitektur Monorepo

Repository ini dibangun menggunakan pola **Hybrid Monorepo** dengan 3 layanan utama:

- 💻 **`frontend/`**: Single Page Application (React + Vite + Tailwind CSS + React ErrorBoundary) — *Port 5173*
- ⚙️ **`backend-api/`**: Server Express API (Node.js + TypeScript + Prisma ORM) — *Port 5000*
- 🤖 **`ai-engine/`**: Microservice AI (Python FastAPI + Gemini 2.0 Flash LLM + Numpy Scoring Engine) — *Port 8000*

---

## 🚀 Panduan Setup & Cara Menjalankan

### 1. Kloning Repository & Setup `.env`
```bash
git clone https://github.com/mauinGit/Orbita-Compass.git
cd Orbita-Compass

# Salin file environment bawaan
cp backend-api/.env.example backend-api/.env
cp ai-engine/.env.example ai-engine/.env
```

### 2. Instalasi Dependensi & Ingest Database
```bash
# Install dependensi frontend & backend
cd frontend && npm install && cd ..
cd backend-api && npm install && npx prisma db push && cd ..
cd ai-engine && pip install -r requirements.txt && cd ..

# Install launcher monorepo
npm install
```

### 3. Jalankan Seluruh Sistem (1-Command Launcher)
Dari root directory `Orbita-Compass`, jalankan:
```bash
npm run dev
```

Layanan akan aktif otomatis di:
- 🖥️ **Frontend Web**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend API**: [http://localhost:5000](http://localhost:5000)
- 🤖 **AI Engine**: [http://localhost:8000](http://localhost:8000)

---

## 🔑 Akun Demo Bawaan (Quick Login)

Gunakan akun berikut untuk mencoba fitur dengan role yang berbeda (Password: `password123`):
- 🎓 **Siswa Saintek**: `siswa@orbita.id`
- 🎓 **Siswa Soshum**: `budi@orbita.id`
- 👨‍🏫 **Guru BK Konselor**: `gurubk@orbita.id`
- 👑 **Administrator**: `admin@orbita.id`

---

## 📊 Fitur Utama & Data Terintegrasi

- **149 Perguruan Tinggi Real**: 137 PTN Resmi Sidata SNPMB + 12 Perguruan Tinggi Kedinasan (PKN STAN, IPDN, STIS, STIN, SSN, STMKG, dll.).
- **1.895 Program Studi Real**: Lengkap dengan kuota terpisah jalur **SNBP**, **SNBT**, dan **Mandiri/Kedinasan**.
- **Gemini 2.0 AI Compass**: Analisis keselarasan profil siswa & rekomendasi karier multi-rumpun.
- **Simulator CBT & Skor IRT**: Latihan UTBK SNBT (0–1000 IRT) & SKD Kedinasan (TWK, TIU, TKP skala 550 Poin).
- **Guru BK Counseling**: Sesi janji temu bimbingan akademik tatap muka / daring.
- **Action Plan & Open-WA**: Kalender agenda persiapan kelulusan dengan notifikasi WhatsApp.

---

## 📄 Lisensi
[MIT License](LICENSE) © 2026 Orbita Compass Team.
