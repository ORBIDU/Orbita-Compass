# ORBITA — Panduan untuk AI Agent

## Tentang proyek
ORBITA adalah platform AI yang membantu siswa SMA memetakan jurusan dan kampus sejak kelas 10, lalu menyusun langkah persiapannya. Rekomendasi diambil dari tes gambaran minat bakat, prestasi, dan nilai rapor.

Struktur repo:
- `frontend/` → React + Vite + Tailwind. Area kerja utama.
- `backend-api/` → Express + Prisma (dikerjakan Naufal). JANGAN diubah.
- `ai-engine/` → FastAPI + Gemini. JANGAN diubah.
- `BACKEND_MAP.md` → kondisi backend saat ini.
- `docs/SPEK_SISWA.md` → spesifikasi lengkap sisi siswa. Baca bagian yang relevan sebelum mengerjakan halaman.

Pemilik frontend: Maulana (vibe coder). Jelaskan setiap perubahan dengan bahasa Indonesia yang sederhana.

## Aturan kerja
1. Kerjakan per fase sesuai `docs/SPEK_SISWA.md`. Sebelum menulis kode, jelaskan rencana singkat dan file yang akan diubah.
2. Ikuti stack dan pola yang sudah ada. Jangan memasang library baru tanpa bertanya dulu.
3. Pola yang muncul lebih dari sekali dijadikan komponen.
4. Semua teks UI berbahasa Indonesia, santai tapi sopan, untuk siswa SMA.
5. Responsif mulai lebar 360px. Cek tampilan HP untuk setiap halaman.
6. Di akhir fase: jalankan build, perbaiki error, centang checklist di SPEK_SISWA.md, ringkas perubahan, dan usulkan pesan commit. Jangan push.

## Aturan data
1. Komponen tidak boleh berisi data hardcode. Semua data lewat `frontend/src/services/`.
2. Data dummy ada di `frontend/src/mocks/`. Saklar `VITE_USE_MOCK=true` di `.env` membuat semua service memakai dummy, termasuk login, sehingga frontend bisa jalan tanpa backend.
3. Kalau endpoint sudah ada (lihat BACKEND_MAP.md), bentuk data dummy harus sama dengan respons API aslinya. Kalau belum ada, tentukan bentuknya lalu catat di `API_CONTRACT.md` (method, URL, request, response, alasan dibutuhkan).
4. Fitur AI (Compass, rasionalisasi SNBP, penyusun Action Plan, rekomendasi latihan) disimulasikan di `mocks/` dengan aturan sederhana dan jeda 2–3 detik.
5. Data kosong tampil sebagai empty state yang jujur dengan ajakan bertindak. Jangan pernah mengganti nilai kosong dengan angka palsu.
6. Frontend tidak pernah mengirim field `role` saat register, dan tidak menampilkan kunci jawaban sebelum soal disubmit.
7. Masalah keamanan backend (BACKEND_MAP.md bagian 6) tidak diperbaiki dari frontend. Cukup catat kebutuhannya di API_CONTRACT.md.

## Design system
Semua token warna, gradient, dan font didefinisikan di satu tempat (konfigurasi Tailwind), tidak ditulis ulang per komponen.

Gradient linear:
- Navy #15234D → #101A33: background gelap (landing, auth, footer).
- Biru #0965FA → #00B2DD: aksi utama, tab aktif, progress, link.
- Oranye #FF7000 → #F1AD00: CTA paling penting dan highlight. Dipakai hemat.

Font:
- Poppins: font utama untuk semua teks.
- Pecita: font aksen, hanya untuk 1–3 kata penekanan (misalnya di hero). Di-host sendiri di `frontend/src/assets/fonts/`. Kalau filenya belum ada, tanyakan ke Maulana.

Gaya: kartu putih dengan sudut membulat besar (16–24px), bayangan lembut, ikon sederhana. Portal siswa bertema terang; landing dan auth bertema navy gelap.