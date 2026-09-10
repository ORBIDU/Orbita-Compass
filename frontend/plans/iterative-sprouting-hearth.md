# ORBITA Student Portal — Deskripsi UI Lengkap untuk AI Slicing

> Dokumen ini berisi deskripsi detail seluruh halaman Student Portal **ORBITA** agar AI Agent dapat melakukan UI slicing yang akurat. Gunakan deskripsi ini sebagai single source of truth untuk layout, warna, tipografi, dan perilaku interaktif.

---

## FONDASI DESAIN GLOBAL

### Warna Utama
| Token | Nilai | Penggunaan |
|-------|-------|------------|
| BLUE | `#0965fa` | Tombol utama, link, aksen aktif |
| CYAN | `#00b2dd` | Ujung gradient (pair dengan BLUE) |
| ORANGE | `#ff7000` | Aksen ranking, SKD badge |
| YELLOW | `#f1ad00` | Target icon, bintang reward |
| Page BG | `#f5f6fb` / `#f8fafc` | Background halaman |
| Card BG | `#ffffff` | Semua card/panel |
| Dark Text | `#1a1d2e` / `#0f172a` | Teks utama |
| Mid Gray | `#64748b` | Teks sekunder |
| Light Gray | `#94a3b8` | Placeholder, label kecil |
| Border | `rgba(0,0,0,0.06–0.1)` | Border card default |
| Success | `#22c55e` | Status selesai, positif |

### Tipografi
- **Font family:** Poppins, sans-serif (semua elemen)
- **Scale:** 9px (micro label) → 10px → 11px → 12px → 13px (body) → 14px → 15px (section header) → 18px → 22px → 24px → 28px+ (hero)
- **Font weight:** regular, semibold (600), bold (700), font-black (900)

### Border Radius Scale
| Nama | Nilai | Pakai untuk |
|------|-------|-------------|
| `md` | 8px | Checkbox, badge kecil |
| `lg` | 10px | Tombol kecil, badge |
| `xl` | 12px | Input, tombol medium |
| `2xl` | 16px | Card kecil, chip |
| `3xl` | 24px | Card utama |

### Gradient Utama
```
Linear: 135deg, #0965fa → #00b2dd   (hero, tombol utama)
Linear: 90deg,  #0965fa → #00b2dd   (tombol, progress fill)
```

### Shadow Card
```
0 4px 24px rgba(0,0,0,0.04)   (card default)
0 8px 24px rgba(0,0,0,0.06)   (card prominent)
```

---

## SHELL APLIKASI (App.tsx)

### Layout Grid
- **Desktop:** Sidebar 280px fixed left + main content area (sisa lebar)
- **Mobile:** Sidebar tersembunyi, bottom navigation bar
- **Background shell:** `#f5f6fb`

### Sidebar
- **Background:** white
- **Border kanan:** `1px solid #f1f5f9`
- **Shadow:** `1px 0 8px rgba(0,0,0,0.03)`

#### Logo "ORBITA" (atas sidebar)
- Font: Poppins, 28px, bold
- "ORB" → gradient text `#0965fa → #00b2dd`
- "ITA" → gradient text `#ff7000 → #f1ad00`
- Subtext "Student Portal": 10px, semibold, `#64748b`, tracking-wide

#### Navigasi Sidebar (NavItem)
**State Aktif:**
- Background: `linear-gradient(90deg, #0965fa, #00b2dd)`
- Border kanan: `4px solid #00288e`
- Teks: white, 14px, semibold, letter-spacing 0.28px
- Icon: white, 18×18px
- Padding: 14px vertikal, 4px horizontal

**State Inaktif:**
- Background: transparent; hover: `#f5f6fb`
- Teks: `#444653`, 14px
- Icon: `#444653`

#### Struktur Menu (3 grup)
```
[UTAMA]
  • Dashboard Utama
  • Action Plan (Misi Harian)

[PROFIL & ANALISIS]
  • Potensi Diri (Refleksi & Rapor)
  • Orbita Kompas (Hasil Akhir)

[PERSIAPAN PTN]
  • Siap PTN
  • Siap SKD
  • Eksplor Jurusan
  • Konsultasi Guru BK
```

Label grup: 10px, bold, uppercase, tracking-wider, `#94a3af`

### Top Header Bar
- Background: white, border-bottom slate-100
- Padding: px-6~8, py-3.5

**Search Bar:**
- Background: slate-50, border slate-200/60
- Placeholder: "Cari jurusan, kampus, atau misi..."
- Focus: border-blue-300, ring-2 ring-blue-100

**Notifikasi Button:**
- 44×44px, rounded, bg-slate-50
- Badge oranye `#ff7000` (w-2 h-2)
- Popover 320px: judul "Notifikasi", badge "3 Baru" (bg-blue-50, text `#0965fa`)

**Profil Dropdown:**
- Avatar: 36×36px, rounded, gradient BLUE→CYAN, teks "AR" white 12px bold
- Nama "Ahmad Rizki" 12px bold, kelas "Kelas XII IPA 1" 11px
- Menu: Informasi Profil / Refleksi & Rapor / Keluar (text rose-600)

### Mobile Bottom Navigation
- Fixed bottom, bg-white, border-top
- 4 tab utama: Home, Siap PTN, Misi, Profil
- Aktif: bg-blue-50, text `#0965fa`; Inaktif: text-slate-500

---

## HALAMAN 1: DASHBOARD UTAMA (DashboardPage.tsx)

### Background
`#f5f6fb`, padding 20–24px, max-width ~600px centered

### Urutan Seksi (atas ke bawah)
1. Hero Banner
2. Ringkasan Harian
3. Today's Action Plan
4. Timeline Seleksi
5. Grid 2 kolom: Orbita Kompas + Performa

---

### ① HERO BANNER

**Container:**
- Background: `linear-gradient(135deg, #0965fa 0%, #00b2dd 100%)`
- Rounded 3xl (24px), padding p-6
- Dua lingkaran dekoratif semi-transparan (opacity 0.07 dan 0.05)

**Konten:**
- Tanggal: "Sabtu, 19 Juli 2026" | 12px, white/70%
- Greeting: "Selamat Pagi, Dhiya 👋" | 22px, font-black, white
- Subtitle: "Yuk, lanjutkan perjalananmu bersama Orbita!" | 13px, white/70%
- Quick Stats Badge: background `rgba(255,255,255,0.15)`, rounded-xl
  - 🏆 "Top 35%" label "Ranking" | 13px font-black, white

---

### ② RINGKASAN HARIAN

**Container:** White, rounded-3xl, border `#e2e8f0`, shadow `0 4px 24px rgba(0,0,0,0.04)`, p-6

**Header:** Sparkles icon (`#0965fa`) + "Ringkasan Harian" | 14px font-bold

**Body text** (13px, `#64748b`, leading-relaxed):
> "Hari ini kamu telah menyelesaikan dua sesi latihan dengan akurasi 84%. Penalaran Matematika masih menjadi kekuatanmu, sedangkan Literasi Bahasa Indonesia dapat menjadi prioritas belajar berikutnya."

---

### ③ TODAY'S ACTION PLAN

**Container:** White, rounded-3xl, border `rgba(0,0,0,0.06)`, p-5

**Header:**
- Kiri: Target icon (yellow `#f1ad00`) + "Today's Action Plan" | 15px font-black
- Kanan: "View All →" button | 11px font-bold, text blue, no bg

**3 Mission Rows** (dipisah `divide-y divide-rgba(0,0,0,0.05)`):

Setiap row:
- Icon bulat `w-9 h-9` rounded-xl (done: `#f0fdf4`; progress: `#eff6ff`; pending: `#f8faff`)
- Judul: 13px font-bold, `#1a1d2e`
- Status:
  - **Progress:** progress bar gradient `#0965fa→#00b2dd` (h-1.5), teks `{cur}/{max}` abu
  - **Pending:** "Belum dimulai" 10px abu
  - **Done:** "✔ Selesai" 10px green, badge check hijau `w-7 h-7`
- Action button (jika belum done): `px-3 py-1.5` rounded-lg, 11px font-black, white on blue

| # | Judul | Status | Progress |
|---|-------|--------|---------|
| 1 | "20 soal Penalaran Matematika" | progress | 12/20 |
| 2 | "Review TO #4" | pending | 0/1 |
| 3 | "Latihan Soal UTBK" | done | 1/1 |

**Footer:** "View All Action Plan →" | full-width, py-2.5, border, rounded-xl, text blue

---

### ④ TIMELINE SELEKSI

**Container:** White, rounded-3xl, border, shadow-sm, p-5

**Header:** CalendarCheck icon (`#0965fa`) + "Timeline Seleksi" | 15px font-black

**3 Timeline Items** (masing-masing rounded-2xl, border, p-3.5, flex gap-3):

| Item | Label | Subtitle | Aksen | BG | Countdown |
|------|-------|----------|-------|----|-----------|
| SNBP | "SNBP" | "Seleksi Nasional Berdasarkan Prestasi" | `#0965fa` | `#eff6ff` | "Belum tersedia" badge abu |
| SNBT | "SNBT" | "Seleksi Nasional Berdasarkan Tes" | `#7c3aed` | `#f5f3ff` | "9 Hari" badge ungu, "Pengumuman Hasil · 28 Jul 2026" |
| SKD | "SKD Kedinasan" | "Seleksi Kompetensi Dasar" | `#0d9488` | `#f0fdfa` | "27 Hari" badge teal, "Pelaksanaan SKD · 15 Agt 2026" |

Icon kotak `w-8 h-8` rounded-xl dengan Calendar icon white, bg = warna aksen.
Countdown badge: `px-2.5 py-1` rounded-lg, 10px font-black, white on aksen-color.

---

### ⑤ GRID 2 KOLOM: ORBITA KOMPAS + PERFORMA

`grid-cols-2 gap-3`, keduanya white, rounded-2xl, border, shadow-sm, p-4

#### Kartu ORBITA KOMPAS (kiri)

**Header:** Compass icon + "Orbita Kompas" | 12px font-black
**Subtitle:** "Jurusan yang sangat direkomendasikan" | 9px font-bold, `#9ca3af`

**Top Match Box** (bg `#eff6ff`, border `1.5px solid #0965fa20`, px-3 py-2.5):
- Badge: 🥇 "#1 Match" | 10px abu
- Judul: "Sistem Informasi" | 13px font-black
- Persentase: "93%" | 18px font-black, `#0965fa`

**Rekomendasi lain** (2 item, bg `#f8faff`, rounded-lg, px-2 py-1.5, 10px):
- 🥈 "Teknik Informatika" — 91%
- 🥉 "Ilmu Komputer" — 87%

**Tombol:** "Lihat Orbita Kompas →" | full-width, py-2, rounded-xl, 10px font-black, white, gradient bg `#0965fa→#00b2dd`

#### Kartu PERFORMA (kanan)

**Header:** TrendingUp icon + "Performa" | 12px font-black

**Konten atas (flexbox):**
- Kiri:
  - Label "Rata-Rata Skor Tryout" | 9px abu
  - Skor: "624" | 28px font-black, `#0965fa`
  - Trend: TrendingUp icon hijau + "+18" 10px font-black hijau + "pts" abu
- Kanan:
  - Label "Ranking" | 9px abu
  - "Top 35%" | 16px font-black, `#ff7000`

**Radar Chart** (SVG 108px):
- Axes: PU, PK, LI, LE, PM
- Values: 88, 74, 71, 80, 91
- Warna polygon: `#0965fa`, filled with low opacity

**Tombol:** "Lihat Performa →" | full-width, py-2, rounded-xl, border, 10px font-black, text blue

---

## HALAMAN 2: ACTION PLAN (ActionPlanPage.tsx)

### Background & Layout
- Background: `#f8fafc`
- Max-width ~640px, padding px-4
- Dua view: Main View dan Leaderboard View (toggle via state `showLb`)

---

### VIEW A: MAIN ACTION PLAN

#### A1 — HERO / HEADER CARD

**Container:** White, rounded-3xl, border, shadow-sm, p-7

**Header row (flex, justify-between):**
- Kiri:
  - Judul "Action Plan" | 22px font-bold, dark
  - Deskripsi: 13px, `#64748b`, leading-relaxed, max-w-md
    > "Rencana belajarmu disusun berdasarkan target yang ingin kamu capai. Pilih fokus belajarmu hari ini agar sistem dapat menyesuaikan rekomendasi aktivitas secara otomatis."
- Kanan: Tombol "Ubah Target" | 13px font-bold, white on blue, px-5 py-2.5, rounded-2xl

**Target section:**

Label "TARGET PERSIAPAN" | 11px font-bold, uppercase, tracking-widest, abu, mb-3

Layout: flex row, gap-3

**Card PTN** (rounded-2xl, border, p-4):
- Label "PTN TARGET" | 9px, uppercase, abu
- Program: "Sistem Informasi" | 13px font-bold
- Universitas: "Universitas Indonesia" | 11px abu
- Link "Lihat Target" | 11px font-bold, border `#0965fa30`, blue text

**Card Kedinasan** (struktur sama):
- Sekolah: "PKN STAN"
- Program: "D4 Akuntansi Sektor Publik"

**Bintang Belajar Card** (w-[178px], flex-col, rounded-2xl, border, p-4):
- Header: ⭐ + "Bintang Belajar" | 11px font-bold
- Icon `i` tooltip: bg `#f1f5f9`, cursor-default
  - Hover tooltip (absolute, bg `#0f172a`, rounded-xl, w-52, p-3, 10px white):
    > "Setiap aktivitas yang diselesaikan memberikan Bintang Belajar. Bintang menentukan peringkat Leaderboard."
- Jumlah bintang: `{totalStars}` | 26px font-bold, dark
- "+12 minggu ini" | 10px, `#22c55e`
- Tombol "Lihat Leaderboard" | 11px font-bold, border `#0965fa30`, blue, full-width, mt-auto, py-2

---

#### A2 — FOKUS HARI INI

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Judul:** "Fokus Hari Ini" | 15px font-bold
**Deskripsi:** 12px, abu, leading-relaxed
> "Pilih target yang ingin kamu fokuskan hari ini. Daftar aktivitas akan disesuaikan secara otomatis."

**3 Chip Multi-select** (flex gap-2):
- "Persiapan SNBP", "Persiapan SNBT", "Persiapan SKD"
- px-4 py-2, rounded-2xl, 12px font-semibold, border, transition
- **Aktif:** bg BLUE, text white, border BLUE, ✓ icon (11px, stroke-width 3)
- **Inaktif:** bg white, text `#374151`, border `rgba(0,0,0,0.1)`

---

#### A3 — TODAY'S MISSION

**Container:** White, rounded-3xl, border, shadow-sm, overflow-hidden

**Header (px-6 pt-6 pb-4, flex, justify-between):**
- Kiri:
  - "Today's Mission" | 15px font-bold
  - "{doneCount} / {total} selesai" | 12px, `#94a3b8`
- Kanan (Circular Progress Ring SVG 48×48):
  - Background circle: r=18, stroke `#f1f5f9`, width 5
  - Progress circle: stroke BLUE, dasharray/offset dari persentase, rotate -90deg, stroke-linecap round, transition 0.5s
  - Center text: "{pct}%" | 10px font-bold, blue

**Empty state** (jika tidak ada fokus dipilih):
- py-10, text-center, 13px abu
- "Pilih fokus belajar di atas untuk melihat misi hari ini."

**Task Rows** (divide-y divide-rgba(0,0,0,0.04)):

Setiap row (px-6 py-4, flex gap-4):
- **Checkbox** w-5 h-5 rounded-md, shrink-0:
  - Done: bg BLUE, ✓ white 11px stroke-3
  - Not done: transparent, border `#d1d5db`
- **Konten (flex-1):**
  - Badge chip + stars (flex gap-2, mb-1):
    - Badge: `inline-block px-2 py-0.5` rounded-md, 10px font-bold
      - SNBP: bg `#eff6ff`, text `#1d4ed8`
      - SNBT: bg `#f0fdf4`, text `#15803d`
      - SKD: bg `#fff7ed`, text `#c2410c`
      - General: bg `#f8faff`, text `#475569`
    - Stars: ⭐ "+{n}" | 10px, abu
  - Judul task: 13px font-bold (done: line-through + abu)
  - Deskripsi: 11px, `#94a3b8`
- **Tombol aksi** (jika belum done): shrink-0, `px-4 py-1.5` rounded-xl, 11px font-bold, white on blue

**Contoh tasks** (max 5, tergantung fokus dipilih):
- "Guided Practice: Penalaran Matematika" (+5⭐)
- "Mini Tryout SNBT" (+8⭐)
- "Review Pembahasan TO #4" (+3⭐)
- "Latihan TKA: Biologi" (+5⭐)
- "Tryout Lengkap SKD" (+15⭐)

---

#### A4 — TARGET MINGGU INI

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Judul:** "Target Minggu Ini" | 15px font-bold, mb-5

**5 Checklist items** (setiap item flex gap-3, py-2):
- Checkbox w-5 h-5 rounded-md:
  - Done: bg BLUE, ✓ white
  - Not done: transparent, border `1.5px solid #d1d5db`
- Label: 13px font-semibold (done: line-through + abu)

Items:
1. ✅ "Ikuti 1 Tryout SNBT"
2. ☐ "Selesaikan 2 Guided Practice"
3. ☐ "Latihan TKA sebanyak 2 sesi"
4. ✅ "Guided Learning TWK"
5. ☐ "Review seluruh pembahasan minggu ini"

---

#### A5 — TARGET BULAN INI

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Judul:** "Target Bulan Ini" | 15px font-bold, mb-5

**Grid 2×2, gap-3:**

Setiap goal card (rounded-2xl, border, p-4):
- Label: 11px abu
- Progress count: 18px font-bold, dark — format `{cur} / {max}`
- Progress bar: bg `#f1f5f9`, h-1.5, rounded-full; fill bg BLUE, transition 0.5s

| Label | Cur | Max |
|-------|-----|-----|
| Tryout Lengkap | 2 | 4 |
| Latihan Soal | 18 | 30 |
| Guided Learning | 12 | 20 |
| Review Materi | 8 | 12 |

---

#### A6 — PROGRESS BELAJAR

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Judul:** "Progress Belajar" | 15px font-bold

**3 Progress Bars:**
- Label kiri: "SNBP" / "SNBT" / "SKD" | 12px font-semibold
- Persentase kanan: "72%" / "64%" / "58%" | 12px font-bold, blue
- Bar: bg `#f1f5f9`, h-2, rounded-full; fill gradient BLUE→CYAN, transition

---

#### Modal: UBAH TARGET

**Overlay:** Fixed inset-0 z-50, `bg-black/30 backdrop-blur-[2px]`

**Modal container:** White, rounded-3xl, shadow-2xl, max-w-md, max-h-[90vh], overflow-y-auto

**Sticky header (px-7 pt-7 pb-4, border-b):**
- "Target Persiapan" | 18px font-bold
- Deskripsi: 12px, `#64748b`
- Close button (X icon): w-8 h-8, rounded-xl, bg `#f5f6fb`

**Body (px-7 py-6, gap-5):**

**Section PTN** (rounded-2xl, border — aktif: `#0965fa`, inaktif: `rgba(0,0,0,0.08)`):
- Toggle header: Checkbox w-5 h-5 rounded-md + "PTN" 14px font-bold + "Persiapan SNBP & SNBT" 11px abu
- Jika dicentang, muncul 2 `<select>`:
  - "Universitas": 20 opsi (UI, ITB, UGM, UNAIR, UNDIP, ITS, UNPAD, UNS, UNHAS, UNSRI, dst.)
  - "Program Studi": Sistem Informasi, Teknik Informatika, Ilmu Komputer, dst.
  - Styling: w-full px-3 py-2.5, rounded-xl, border, 13px, appearance-none

**Section Kedinasan** (struktur identik):
- "Sekolah Kedinasan": PKN STAN, IPDN, STIS, POLSTAT, dst.
- "Program Studi": D4 Akuntansi Sektor Publik, D4 Manajemen Keuangan, dst.

**Tombol footer (flex gap-3):**
- "Batal": flex-1, py-3, rounded-2xl, 13px, abu, border
- "Simpan": flex-1, py-3, rounded-2xl, 13px font-bold, white on BLUE

---

#### Toast Notification

**Position:** Fixed bottom-8, left-1/2 transform -translateX-1/2, z-50

**Container:** Rounded-2xl, bg `#0f172a`, shadow-xl, flex gap-3, px-5 py-3.5, min-w-[260px]

**Konten:**
- Icon: w-7 h-7, rounded-lg, bg `#22c55e`, ✓ white 13px stroke-3
- Judul: "Aktivitas berhasil diselesaikan" | 13px font-bold, white
- Sub: "+{n} Bintang Belajar" | 11px, `#94a3b8`

Auto-dismiss setelah 2800ms.

---

### VIEW B: LEADERBOARD

#### B1 — HERO CARD

**Container:** Rounded-3xl, gradient `135deg, #0965fa → #0ea5e9`, px-7 pt-7 pb-6

**Konten:**
- Label: "ORBITA COMPASS" | 11px font-bold, uppercase, tracking `0.14em`, white/60%
- Judul: "Leaderboard" | 24px font-bold, white
- **Grid 2 kolom, gap-3 (info boxes, bg white/10, rounded-2xl, px-4 py-3):**
  - Box 1: label "PERIODE" (9px uppercase white/50%) + "1 – 30 Sep 2026" (13px font-bold white)
  - Box 2: label "RESET DALAM" + "12 Hari · 08 Jam"
- **Peringkatmu section** (bg white/15, rounded-2xl, px-5 py-4, flex justify-between):
  - Kiri:
    - "PERINGKATMU" | 10px font-bold uppercase tracking-widest white/50%
    - "#8" | 40px font-bold white
  - Kanan:
    - ⭐ + total bintang | 20px font-bold white
    - Badge "↑ Naik 3 peringkat" | 10px font-semibold, bg `#4ade80/20`, text `#4ade80`, rounded-full

---

#### B2 — TOP 3 PODIUM

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Judul:** "Top 3" | 13px font-bold

**Podium** (flex items-end gap-3, urutan visual: 2nd–1st–3rd):

| Posisi | Medal | Avatar BG | Avatar Text | Bar BG | Bar Height |
|--------|-------|-----------|-------------|--------|------------|
| 2nd 🥈 | 🥈 | `#e2e8f0` | `#64748b` | `#e2e8f0` | 56px |
| 1st 🥇 | 🥇 | `#fef9c3` | `#92400e` | `#fbbf24` | 80px |
| 3rd 🥉 | 🥉 | `#fee2e2` | `#991b1b` | `#fb923c` | 40px |

Avatar: w-11 h-11, rounded-2xl, border white/shadow, 14px font-bold
Nama: 12–13px font-bold, `#0f172a`, center
Stars: ⭐ + count | 11px font-semibold, abu
Bar: rounded-t-xl, nomor ranking (white/90 text)

---

#### B3 — LEADERBOARD LENGKAP

**Container:** White, rounded-3xl, border, shadow-sm, overflow-hidden

**Header area (px-5 pt-5 pb-4):**
- Judul "Peringkat Bulan Ini" | 13px font-bold
- Search input: w-full px-4 py-2.5, rounded-xl, 12px, bg `#f8fafc`, border, placeholder "Cari siswa..."
- **Filter class pills (flex gap-1.5):**
  - "Semua" | "Kelas X" | "Kelas XI" | "Kelas XII"
  - Aktif: bg BLUE, white, border BLUE
  - Inaktif: bg white, abu, border light
  - flex-1, py-1.5, rounded-xl, 11px font-semibold

**Rows** (divide-y divide-rgba(0,0,0,0.04), px-4 py-3):
- Rank badge: `#rank` | 12px font-bold, w-7
  - Top 3: gold; Current user: blue; Lainnya: abu
- Avatar w-8 h-8, rounded-xl, 12px font-bold
- Nama 13px font-semibold + "(Kamu)" jika current user
- Stars: ⭐ + count | 12px font-bold
- Trend: ↑ green `#22c55e` / ↓ red `#ef4444` / — abu `#94a3b8`
- Row current user: bg `#eff6ff`

---

#### B4 — POSISIMU SAAT INI

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Judul:** "Posisimu Saat Ini" | 13px font-bold

**Rank display (flex gap-4):**
- Badge rank: w-16 h-16, rounded-2xl, 22px font-bold, bg `#0965fa12`, border `#0965fa25`, text blue
- Kanan:
  - "Bintang Belajar" + ⭐ + total | 16px font-bold
  - "Top 12% dari seluruh siswa" | 11px abu

**Separator:** h-px bg-rgba(0,0,0,0.06)

**Target box** (rounded-2xl, p-4, border `#0965fa15`, bg `#0965fa08`):
- Label: "TARGET BERIKUTNYA — TOP 5" | 10px font-bold uppercase tracking-widest, blue
- Konten: "Masih membutuhkan" + ⭐ + "42 Bintang" (right-aligned, 16px bold, blue)
- Penjelasan: 11px abu, leading-relaxed

**Tombol:** "Lihat Action Plan" | full-width, py-3, rounded-2xl, 13px font-bold, white on BLUE

---

#### B5 — CARA MENDAPATKAN BINTANG

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Judul:** "Cara Mendapatkan Bintang Belajar" | 13px font-bold

**Grid 2 kolom, gap-2:**

| Aktivitas | Bintang | BG | Text |
|-----------|---------|----|----|
| Guided Practice | +5 | `#eff6ff` | `#1d4ed8` |
| Custom Practice | +5 | `#f0fdf4` | `#15803d` |
| Review Pembahasan | +3 | `#fff7ed` | `#c2410c` |
| Mini Tryout | +8 | `#fdf4ff` | `#7e22ce` |
| Tryout Lengkap | +15 | `#fefce8` | `#854d0e` |
| Selesaikan seluruh misi harian | Bonus +5 | `#f0fdfa` | `#0f766e` |

Setiap item: rounded-2xl, px-4 py-3, flex justify-between, 11px font-semibold

**Footer note:** "Bintang hanya diberikan setelah aktivitas berhasil diselesaikan." | 10px, `#94a3b8`

---

#### B6 — HALL OF CONSISTENCY

**Container:** White, rounded-3xl, border, shadow-sm, p-6

**Header (flex justify-between):**
- Judul: "Hall of Consistency" | 13px font-bold
- "Lihat Arsip" button | 11px font-semibold, blue, border `#0965fa30`

**Deskripsi:** 11px abu, leading-relaxed
> "Siswa dengan konsistensi belajar terbaik setiap bulan."

**3 cards (flex gap-2):**

| Bulan | BG | Border |
|-------|----|----|
| September | `#fef9c3` | `#fde68a` |
| Agustus | `#e0f2fe` | `#bae6fd` |
| Juli | `#f0fdf4` | `#bbf7d0` |

Setiap card: rounded-2xl, header bulan (10px font-bold abu, px-3 py-2, border-b), body: 🥇 + nama 13px font-bold + reward 10px abu

---

#### B7 — MONTHLY REWARD

**Container:** White, rounded-3xl, border, shadow-sm, overflow-hidden

**Top illustration** (h-28, flex center, border-b, bg `linear-gradient(135deg, #fef9c3, #fde68a)`):
- 🏆 emoji text-3xl + "Reward Eksklusif Top 3" | 11px font-bold, `#92400e`

**Content (p-6):**
- Label: "REWARD BULAN INI" | 10px, uppercase, tracking-widest, abu
- Judul: "Live Session SNBT & SKD" | 16px font-bold, dark
- Deskripsi: 12px, `#64748b`, leading-relaxed
- **Info grid 3 kolom** (rounded-xl, bg `#f8fafc`, border, p-2.5, center, 9px label / 12px bold value):
  - "Peserta" / "Top 3"
  - "Durasi" / "120 Menit"
  - "Tanggal" / "28 Sep"
- **Tombol:** "Lihat Detail" | full-width, py-2.5, rounded-2xl, 12px font-bold, border, abu

---

## HALAMAN 3: SIAP PTN (SiapPTNPage.tsx)

### Background & Header Nav

**Background:** `#f8fafc`

**Top Navigation** (white, border-b, px-6 py-4, sticky):
- Logo + Judul "Siap PTN"
- **Segmented control SNBP/SNBT** (`variant="colored"`):
  - Aktif: gradient `135deg, #0965fa → #00b2dd`, text white
  - Inaktif: bg `#f1f5f9`, text `#64748b`
- **Tombol "Panduan PTN":**
  - BG: light blue gradient tint
  - Border: `#0965fa40`
  - Text: `#0965fa`, 12px font-bold

---

### TAB SNBT — Sub-tab: TRYOUT

#### TryoutWizard Langkah 1: Pilih Target

**Container:** White, rounded-3xl, border, p-6, shadow-sm

**Judul:** "Pilih Target Universitas" | 15px font-bold

**Dropdown 1 — Universitas:**
- `<select>` full-width, px-3 py-2.5, rounded-xl, border, 13px, appearance-none
- ChevronDown icon overlay di ujung kanan
- Opsi: 20 universitas Indonesia (UI, ITB, UGM, UNAIR, UNDIP, ITS, UNPAD, UNS, UNHAS, UNSRI, UNEJ, UNNES, UIN Jakarta, UNSOED, UPN Veteran, UNILA, UNIB, UNJA, UNDIKSHA, POLINES, dst.)

**Dropdown 2 — Program Studi:**
- Sama dengan Dropdown 1
- Opsi: 36 jurusan (Sistem Informasi, Teknik Informatika, Ilmu Komputer, Matematika, Teknik Kimia, dll.)

**Confirmation Chip** (muncul ketika keduanya dipilih):
- Rounded-xl, bg `#eff6ff`, border `#0965fa30`, text `#0965fa`, 11px font-semibold
- "✓ {nama_univ} — {nama_jurusan}"

**Tombol:** "Lanjut ke Analisis →" | full-width, py-3, rounded-2xl, 13px font-bold, white on BLUE (hanya aktif jika keduanya dipilih)

#### TryoutWizard Langkah 2: Analisis Skor

**Container:** White, rounded-3xl, border, p-6, shadow-sm

**Judul:** "Analisis Skor" | 15px font-bold
**Sub:** "Passing Grade {nama_jurusan} di {nama_univ}" | 12px abu

**Card passing grade** (rounded-2xl, bg `#eff6ff`, border `#0965fa20`, p-6, text-center):
- Label: "PASSING GRADE" | 10px font-bold, uppercase, tracking-widest, `#0965fa`
- Angka: besar 48px font-black, `#0965fa`

**Tombol:** "Mulai Tryout →" | full-width, py-3, rounded-2xl, 13px font-bold, white on blue

---

### TAB SNBT — Sub-tab: PERFORMA

**Layout:** Grid `grid-cols-[1fr_auto]`, gap-4

**Trend Skor chart** (kiri, full-width):
- Title: "Trend Skor" | 14px font-bold
- LineChart (Recharts), ResponsiveContainer, 200px height
- Line color: `#0965fa`, strokeWidth 2.5
- CartesianGrid stroke `#f1f5f9`
- Custom tooltip: bg white, border, rounded-lg, shadow

**Prediksi Skor card** (kanan, w-[200px]):
- White, rounded-2xl, border, p-4
- Judul: "Prediksi Skor" | 12px font-bold
- Skor: 36px font-black, `#0965fa`
- Label: "Estimasi" | 10px abu

---

## HALAMAN 4: ORBITA KOMPAS (CompassPage.tsx)

### Background & Layout
Background `#f8fafc`, full-page, multi-section

### Struktur Konten

#### Header Card
- Gradient hero: `135deg, #0965fa → #00b2dd`, rounded-3xl, p-8
- Judul: "Orbita Kompas" | 28px font-bold, white
- Deskripsi: 14px, white/70%
- Badge "Powered by AI" | 10px, white/80%, border white/30%

#### Top Recommendations Section
- Grid 3 kolom, gap-4
- Setiap card: white, rounded-3xl, border, p-6, shadow-sm
- Rank medal (🥇🥈🥉) + jurusan + universitas + match %
- Progress bar: fill gradient BLUE→CYAN
- Tombol "Lihat Detail" | border, blue text, rounded-xl

#### Radar Chart Card
- White, rounded-3xl, border, p-6
- SVG radar 5 dimensi: Minat, Nilai Akademik, Potensi, Karir, Jalur Masuk
- Polygon fill `#0965fa` + opacity, vertex dots blue

#### Dimension Score Cards (5-grid)
- Grid 5 kolom (atau 2+3), gap-3
- Setiap card: rounded-2xl, border, p-4, bg tint per dimensi
- Label dimensi + skor persentase + progress bar

#### Career Path Section
- Title: "Prospek Karir" | 15px font-bold
- 3 kolom: Nama karir + industri + gaji estimasi
- Setiap item: white, rounded-2xl, border, p-4

---

## HALAMAN 5: SIAP SKD (SiapSKDPage.tsx)

### Background & Nav
Background `#f8fafc`, header nav dengan segmented control TWK/TIU/TKP/Tryout

### Tab Latihan (Guided Learning langsung)

**GuidedLearning component:**
- Mirip struktur LatihanTKA
- Subject cards: bg white, rounded-3xl, border, px-8 py-7, shadow
- Sub-materi items: rounded-2xl, border, px-6 py-5
- Tombol per item: "Mulai" / "Lanjutkan" / "Selesai"
- Progress bar horizontal dalam setiap materi

**Kategori SKD:**
- TWK (Tes Wawasan Kebangsaan) — warna: biru
- TIU (Tes Intelegensi Umum) — warna: teal/hijau
- TKP (Tes Karakteristik Pribadi) — warna: ungu

---

## HALAMAN 6: LATIHAN TKA (LatihanTKAPage.tsx)

### Background & Header
Background `#f8faff`, sticky header white, border-b

### Layout
Max-width 6xl, px-10 py-8

### Hero Section
- Label: "Tes Kemampuan Akademik" | 11px, bold, uppercase, `#2563EB`
- Judul: 36px bold, `#0f172a`
- Sub: 15px, `#64748b`, max-w-[560px]

### Segmented Control (Tabs)
- BG: `#f1f5f9`
- Aktif: bg white, shadow `0 1px 4px rgba(0,0,0,0.1)`, 13px semibold
- Tabs: "Guided Practice" | "Riwayat Latihan"

### Tab Guided Practice

**Subject Cards** (per mapel):
- White, rounded-3xl, border `#E5E7EB`, px-8 py-7, shadow `0 8px 24px rgba(0,0,0,0.06)`
- Badge mapel: w-10 h-10, colored bg, 11px bold uppercase, white text
- Judul: 22px bold, `#0f172a`
- Progress bar + % warna mapel
- AI Rekomendasi strip: border, rounded-xl, bg `{color}0d`, 12px

**Materi Ittems:**
- White, rounded-2xl, border, px-6 py-5
- Horizontal flex: index/check + nama + badges (Dasar/Menengah/Sulit) + progress + tombol

**Warna per mapel:**
| Kode | Mapel | Warna |
|------|-------|-------|
| MTK | Matematika | `#2563EB` |
| BIN | Bahasa Indonesia | `#059669` |
| BIG | Bahasa Inggris | `#d97706` |
| FIS | Fisika | `#7c3aed` |
| KIM | Kimia | `#e11d48` |
| BIO | Biologi | `#16a34a` |
| EKO | Ekonomi | `#0284c7` |
| GEO | Geografi | `#ca8a04` |
| SOS | Sosiologi | `#9333ea` |

### Tab Riwayat Latihan

**Summary Cards (3 kolom):**
- White, rounded-3xl, border, px-6 py-6, shadow `0 8px 24px rgba(0,0,0,0.06)`
- Judul 12px uppercase tracking, value 32px bold

**Performa per Mapel Table:**
- 3 kolom: Mata Pelajaran | Akurasi | Status
- Header 10px uppercase bold tracking, `#94a3b8`
- Trend icons: ↑ `#22c55e`, ↓ `#ef4444`, — `#94a3b8`

**Riwayat Items:**
- White, rounded-2xl, border, px-6 py-5
- Akurasi circle (w-14 h-14, rounded-2xl, color: ≥80 green, ≥70 amber, <70 red)
- Info: nama mapel + mode badge + tanggal + durasi

---

## HALAMAN 7: SNBP RASIONALISASI (SNBPPage.tsx)

### Layout
Background `#f8fafc`, max-w-4xl, px-6 md:px-10

### Stepper Bar (4 langkah)
- White, rounded-3xl, border, p-4, shadow
- Selesai: w-8 h-8, bg `#10b981`, white, ✓ icon
- Aktif: w-8 h-8, bg `#0965fa`, white, angka
- Pending: w-8 h-8, bg `#f1f5f9`, `#94a3b8`
- Label: "Input Data" → "Review Data" → "Analisis" → "Hasil"

### Langkah 1: Input Data

**A. Data Akademik:**
- Grid 5 kolom: S1–S5, avg score per semester
- Overall avg: bg `#eff6ff`, border `#dbeafe`, text `#0965fa`, 21px font-extrabold

**B. Nilai TKA:**
- Wajib: 3 kolom (B. Indonesia, Matematika, B. Inggris) — input number
- Pilihan: grid checkboxes, max 2
- Aktif: bg `#eff6ff/80`, border `#0965fa`, text `#0965fa` font-bold
- Disabled: bg `#f8fafc`, text `#94a3b8`, cursor-not-allowed

**C. Prestasi:**
- Checkbox items (max 3): Olimpiade, Programming, OSIS, Volunteer
- Selected: bg `#f0fdf4/70`, border `#10b981`, text emerald

**D. Target SNBP:**
- 2 kolom: Pilihan 1 & 2
- Setiap pilihan: bg `#f8fafc`, p-5, rounded-2xl
- Dropdown: universitas + program studi

### Langkah 3: Processing (Animasi)

- Spinner: w-24 h-24, rounded-3xl, gradient bg, animated ping
- Terminal box: bg `#1a1d2e`, px-8 py-5, rounded-2xl
  - Text `#00b2dd` monospace: "ORBITA AI · NLP Analysis"
- Checklist progress: grid bg `#f8fafc`, p-5, rounded-2xl

### Langkah 4: Hasil

8 section output — lihat detail di eksplorasi sebelumnya, termasuk:
- Ringkasan target (2 kolom)
- Radar chart profil akademik
- Cards: Hal yang perlu diperhatikan, Strategi pilihan, Rekomendasi prodi, Kesimpulan

---

## KOMPONEN REUSABLE

### SegCtrl (Segmented Control)
```
Props: options, value, onChange, variant?: "default" | "colored"
Default: bg #f1f5f9, active: bg white + shadow
Colored: active: gradient 135deg #0965fa → #00b2dd + white text
```

### ProgressBar
```
Props: value (0–100), color?
BG: #f1f5f9, rounded-full, h variable
Fill: gradient atau solid color, transition 0.5s
```

### BadgeChip
```
Props: label, color scheme (snbp|snbt|skd|general)
Inline-block, px-2 py-0.5, rounded-md, 10px font-bold
```

### MiniRadar (SVG)
```
Size: 108px, axes: 5, values: 0–100
Grid: concentric pentagons, stroke #f1f5f9
Data polygon: fill #0965fa + opacity, vertices blue dots
```

### CircularProgress (SVG)
```
Size: 48px, r: 18, strokeWidth: 5
BG circle: #f1f5f9
Progress: #0965fa, stroke-linecap round, -90deg rotation, transition 0.5s
Center text: {pct}%, 10px font-bold blue
```

---

## CATATAN IMPLEMENTASI

1. **Font:** Import Poppins dari Google Fonts dengan weights 400, 500, 600, 700, 900
2. **Semua teks menggunakan font-family Poppins** — tidak ada font system default
3. **Card standard:** `bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 md:p-6`
4. **Tombol primary:** `bg-[#0965fa] text-white font-bold rounded-2xl px-5 py-2.5 hover:opacity-90 transition-all`
5. **Tombol secondary:** `border border-[#0965fa30] text-[#0965fa] font-semibold rounded-xl px-4 py-2 hover:bg-[#f0f6ff]`
6. **Page wrapper:** `min-h-screen bg-[#f5f6fb] px-4 py-5 max-w-[640px] mx-auto`
7. **Gradients selalu disebut** dalam urutan yang sama: `#0965fa` (kiri/atas) → `#00b2dd` (kanan/bawah)
8. **Semua badge label dalam UPPERCASE** dengan tracking-widest untuk micro-labels (9–11px)
9. **Dividers antar rows:** `divide-y divide-[rgba(0,0,0,0.04)]` atau `border-b border-[rgba(0,0,0,0.05)]`
10. **Hover states:** Biasanya `hover:opacity-90` untuk tombol solid, `hover:bg-[#f8faff]` untuk tombol outline
