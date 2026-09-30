# ORBIDU Frontend

Aplikasi web siswa ORBIDU: React 19 + Vite + Tailwind CSS + React Router.
Spesifikasi halaman ada di `../docs/SPEK_SISWA.md`, panduan kerja di `../CLAUDE.md`.

## Menjalankan

```bash
cd frontend
npm install
cp .env.example .env     # lihat bagian "Pengaturan .env" di bawah
npm run dev              # buka http://localhost:5173
```

Perintah lain:

| Perintah | Fungsi |
|---|---|
| `npm run build` | Membuat versi produksi di `dist/` |
| `npm run typecheck` | Memeriksa error tipe TypeScript |
| `npm run lint` | Memeriksa kode dengan oxlint |
| `npm run preview` | Mencoba hasil build secara lokal |

## Pengaturan `.env`

File `.env` **tidak masuk git**. Buat dari contohnya:

```bash
cp .env.example .env
```

(Di Windows tanpa Git Bash: salin file `.env.example` lalu ganti namanya menjadi `.env`.)

Isi yang penting:

| Variabel | Nilai | Artinya |
|---|---|---|
| `VITE_USE_MOCK` | `true` | **Mode dummy.** Semua data (termasuk login) diambil dari `src/mocks/`, jadi frontend bisa jalan **tanpa backend**. Di pojok kiri bawah portal muncul panel **Mode Demo** untuk mengganti status siswa (baru / sudah asesmen / aktif). Data dummy tersimpan di browser dan bisa dikembalikan ke awal dari panel itu. |
| `VITE_USE_MOCK` | `false` | **Mode backend.** Semua data diambil dari `backend-api` di alamat `VITE_API_BASE_URL`. Backend harus sudah menyala (`npm run dev` di folder `backend-api`). Panel Mode Demo tidak muncul. |
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | Alamat backend, hanya dipakai saat `VITE_USE_MOCK=false`. |

Akun demo (sama di mode dummy dan di seed backend), password `password123`:

- `siswa@orbita.id` (status "aktif" di mode dummy)
- `budi@orbita.id` (status "sudah asesmen" di mode dummy)

> ⚠️ **Setiap kali `.env` diubah, server harus dinyalakan ulang.** Hentikan `npm run dev` (Ctrl+C) lalu jalankan lagi. Vite hanya membaca `.env` saat server mulai; refresh browser saja tidak cukup.

## Struktur folder

```
src/
├── main.tsx            ← titik awal: provider login/status + router
├── router.tsx          ← peta semua URL
├── config/            ← brand.ts (nama, tagline, kontak), navigation.ts (URL & menu), bidang.ts
├── content/           ← teks halaman statis (beranda, FAQ)
├── layouts/            ← kerangka halaman (portal, publik, auth)
├── routes/             ← penjaga halaman (wajib login, gembok status) + pembungkus halaman lama
├── components/
│   ├── ui/             ← komponen dasar: Button, Card, EmptyState, LockedOverlay, FormField, Logo
│   ├── landing/        ← header, section beranda, carousel, footer, tombol konsultasi
│   ├── mascot/         ← MascotFigure (SVG) dan MascotSlot (maskot hero interaktif)
│   ├── jurusan/        ← kartu dan sampul jurusan
│   ├── portal/         ← header, menu desktop, dropdown Persiapan, drawer HP
│   └── dev/            ← panel Mode Demo
├── context/            ← AuthContext (login) dan StudentStatusContext (status siswa)
├── services/           ← SATU-SATUNYA pintu data; memilih mock atau backend
├── mocks/              ← data dummy dengan bentuk sama seperti respons backend
├── types/              ← tipe data backend dan status siswa
├── lib/                ← fungsi bantu kecil
├── styles/             ← CSS dasar dan @font-face
├── assets/fonts/       ← tempat file font Pecita
└── app/                ← halaman-halaman (sebagian masih versi lama, dirombak per fase)
```

## Aturan singkat

- Warna, gradient, font, radius, dan bayangan hanya diambil dari token di `tailwind.config.js` (mis. `bg-gradient-orbit`, `text-ink`, `rounded-card`). Jangan menulis kode warna atau `fontFamily` langsung di komponen baru.
- Komponen tidak mengambil data sendiri; selalu lewat `src/services/`.
- Kebutuhan data yang belum ada di backend dicatat di `../docs/API_CONTRACT.md`.

## Deploy

Aplikasi memakai URL sungguhan (`/portal/compass`, `/jurusan`, dan seterusnya). Server hosting harus mengarahkan semua alamat yang tidak dikenal ke `index.html` (pengaturan "SPA fallback" atau "rewrite"), supaya halaman bisa dibuka langsung atau di-refresh.
