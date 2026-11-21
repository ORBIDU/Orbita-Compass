/** @type {import('tailwindcss').Config} */

// ─── Design token ORBIDU ─────────────────────────────────────────────────────
// Satu-satunya tempat warna, gradient, dan font didefinisikan.
// Di komponen, pakai kelas Tailwind-nya (mis. `bg-orbit-1`, `bg-gradient-orbit`,
// `font-accent`), jangan tulis ulang kode hex atau `fontFamily` inline.

const brand = {
  // Navy: latar gelap (landing, auth, footer)
  "space-1": "#15234D",
  "space-2": "#101A33",
  // Biru: aksi utama, tab aktif, progress, link
  "orbit-1": "#0965FA",
  "orbit-2": "#00B2DD",
  // Oranye: CTA paling penting dan highlight (dipakai hemat)
  "sun-1": "#FF7000",
  "sun-2": "#F1AD00",
  // Biru sangat muda: latar chip/badge biru
  cloud: "#EFF6FF",
};

// Warna ilustrasi maskot dan planet (dipakai SVG lewat kelas fill-/stroke-/stop-).
const mascot = {
  // light/dark/glow dipakai lewat theme() di gradien SVG (MascotFigure, AuthVideoSlot).
  light: "#8CC8FF",
  mid: "#1F7BFF",
  dark: "#0445B8",
  glow: "#3D8BFF",
  highlight: "#B5DCFF",
  cap: "#1E2F62",
  cheek: "#FF8FB1",
  orbit: "#6E9BEA",
  "orbit-soft": "#8FB8FF",
};

const gradient = (from, to) => `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
const gradientX = (from, to) => `linear-gradient(90deg, ${from}, ${to})`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        // Header portal lengkap (ikon menu + nama akun) butuh ±1372px.
        // Di bawah ini ikon dan nama disembunyikan supaya menu tetap satu baris.
        nav: "1400px",
      },
      colors: {
        ...brand,
        // Latar halaman portal (terang)
        page: "#F5F6FB",
        // Teks: utama → paling samar
        ink: {
          DEFAULT: "#1A1D2E",
          soft: "#374151",
          muted: "#6B7280",
          faint: "#9CA3AF",
        },
        // Garis pembatas: DEFAULT untuk border kartu/input, soft untuk border bawaan semua elemen (styles/theme.css)
        line: {
          DEFAULT: "#E5E7EB",
          soft: "rgba(0, 0, 0, 0.08)",
        },
        // Warna status (validasi, KPI dan status impor portal Wali Kelas)
        success: "#22C55E",
        warning: "#F1AD00",
        danger: "#EF4444",

        // ── Landing & halaman publik (desain docs/design/landing) ──
        // Teks isi dan teks redup di latar terang
        // dim digelapkan supaya teks kecil tetap ≥4,5:1 di putih dan latar abu/biru muda.
        prose: { DEFAULT: "#4A5877", dim: "#5F6B8A", faint: "#9AA6C0" },
        // Garis dan border
        rim: { DEFAULT: "#DCE4F2", strong: "#C9D5EA", dash: "#9DB6E3", soft: "#E3E9F3", faint: "#EEF2F8", box: "#B8C4DB", upload: "#C2CFE6" },
        // Latar section dan permukaan
        surface: {
          soft: "#F5F8FC",
          blue: "#EEF4FF",
          sky: "#F2F6FF",
          bubble: "#F0F5FE",
          peach: "#FFF4EA",
          track: "#E6ECF7",
          // Latar tombol pilihan dua (mis. Akademik | Non-akademik)
          toggle: "#E9EEF6",
        },
        // Pasangan latar + teks untuk chip/label
        tint: {
          "orange-bg": "#FFF1E6", "orange-fg": "#B34700",
          "blue-bg": "#E8F0FE", "blue-fg": "#0B3FA8",
          "teal-bg": "#E3F6FB", "teal-fg": "#006F8C",
          // Peringatan lembut (sertifikat belum ada, tugas siswa di kelengkapan profil)
          "orange-rim": "#FFB066", "orange-ink": "#7A3300", "orange-line": "#FFD2AD",
          "green-bg": "#E3F5EC", "green-fg": "#0A7A45",
          "navy-bg": "#E9ECF4", "navy-fg": "#15234D",
          "amber-bg": "#FFF1CC", "amber-fg": "#8A5A00",
          // Action Plan: kategori Kedinasan, tanggal terjadwal, dan tanggal hari ini yang dipilih
          "purple-bg": "#EFEBFB", "purple-fg": "#5B3FC4", "purple-dot": "#6B4FD1",
          "amber-soft": "#FFF4D6",
          "blue-deep": "#0747B8",
        },
        // Sampul kartu jurusan per tema warna (latar + ikon)
        cover: {
          "blue-bg": "#E3EDFF", "blue-ink": "#0B57D0",
          "orange-bg": "#FFE9D6", "orange-ink": "#B34700",
          "teal-bg": "#D9F3F9", "teal-ink": "#006F8C",
          "navy-bg": "#DDE3F2", "navy-ink": "#15234D",
          "amber-bg": "#FFF1CC", "amber-ink": "#8A5A00",
        },
        // Halaman Untuk Sekolah (docs/design/publik/UntukSekolah-Desktop.jpg)
        sekolah: { navy: "#121F41", judul: "#1E3A6E", bintang: "#8B7A45", garis: "#FBBF24" },
        // Gunung di hero Tentang Kami: makin dekat makin gelap
        gunung: { jauh: "#7A86C2", tengah: "#3F4E8C", dekat: "#1F2B57" },
        // Teks di latar navy (Final CTA dan footer)
        night: { light: "#F4F7FF", sub: "#C8D4EE", text: "#A9B8D9", dim: "#8394BC", chip: "#DCE6FF", line: "rgba(169, 184, 217, 0.18)", positive: "#7BE3A6", "positive-bg": "rgba(46, 204, 113, 0.18)" },
        // Hijau WhatsApp yang cukup gelap untuk teks putih (5,4:1).
        whatsapp: "#127A40",
        mascot,

        // ── Masuk & Daftar (desain docs/design/auth) ──
        // Input form: latar, border, placeholder, dan latar tombol pilih mode
        // hint hanya untuk placeholder dan kontrol nonaktif (2,9:1), bukan teks yang harus dibaca.
        field: { bg: "#F8FAFD", rim: "#D5DEEE", hint: "#8A96B2", track: "#F0F4FA" },
        // Banner error dan border input yang salah
        alert: { bg: "#FDECEC", fg: "#B42318", rim: "#D92D20" },
        // Sapaan font aksen di panel navy auth
        "night-accent": "#FF8A1F",
      },
      backgroundImage: {
        "gradient-navy": gradient(brand["space-1"], brand["space-2"]),
        "gradient-orbit": gradient(brand["orbit-1"], brand["orbit-2"]),
        "gradient-sun": gradient(brand["sun-1"], brand["sun-2"]),
        // Versi horizontal untuk tombol CTA dan progress bar
        "gradient-sun-x": gradientX(brand["sun-1"], brand["sun-2"]),
        "gradient-orbit-x": gradientX(brand["orbit-1"], brand["orbit-2"]),
        // Beranda Fase 10 (docs/design/publik): section Masalah dan garis buku tulis di "Tenang"
        "masalah-glow": "linear-gradient(180deg, #FFFFFF 0%, #E3EEFB 100%)",
        "buku-garis": "repeating-linear-gradient(180deg, transparent 0 36px, #DCEBFA 36px 38px)",
        // Panel video auth: desktop (kiri 65%) dan banner HP
        "auth-glow":
          "radial-gradient(620px 520px at 50% 46%, rgba(9,101,250,0.34), rgba(9,101,250,0) 70%), radial-gradient(360px 300px at 82% 82%, rgba(255,112,0,0.12), rgba(255,112,0,0) 70%), linear-gradient(180deg, #15234D 0%, #101A33 100%)",
        "auth-glow-sm":
          "radial-gradient(260px 200px at 50% 58%, rgba(9,101,250,0.38), rgba(9,101,250,0) 70%), linear-gradient(180deg, #15234D 0%, #101A33 100%)",
        // Hero Dashboard portal: desktop dan HP (docs/design/portal)
        "portal-hero":
          "radial-gradient(520px 260px at 82% 50%, rgba(9,101,250,0.38), rgba(9,101,250,0) 70%), linear-gradient(120deg, #15234D 0%, #101A33 100%)",
        "portal-hero-sm":
          "radial-gradient(260px 200px at 90% 20%, rgba(9,101,250,0.4), rgba(9,101,250,0) 70%), linear-gradient(140deg, #15234D 0%, #101A33 100%)",
        // Hero Untuk Sekolah (docs/design/publik/UntukSekolah-Desktop.jpg)
        "sekolah-hero": "linear-gradient(90deg, #121C37 31.6%, #33509D 100%)",
        // Hero Tentang Kami: langit fajar (hangat hanya di bawah supaya teks putih tetap terbaca) dan matahari
        fajar: "linear-gradient(180deg, #15234D 0%, #233A78 45%, #3D5193 62%, #B97E9C 78%, #FFB98A 90%, #FFE0B2 100%)",
        matahari: "radial-gradient(circle at 40% 35%, #FFF3C4 0%, #FFD36E 40%, #FF9A3C 100%)",
        // Garis putus-putus biru (Tentang Kami: perjalanan)
        "garis-x": "repeating-linear-gradient(90deg, #00B2DD 0 6px, transparent 6px 14px)",
        "garis-y": "repeating-linear-gradient(180deg, #00B2DD 0 6px, transparent 6px 14px)",
        // Hero Eksplor Jurusan: langit pagi (docs/design/publik/EksplorJurusan-Desktop.jpg)
        "jurusan-langit": "linear-gradient(180deg, #6DCAFF 0%, #FFFFFF 60.6%, #FFEEC3 100%)",
        // Kartu kaca di section "Apa yang Didapat Sekolah?"
        "kaca-navy": "linear-gradient(150deg, rgba(137,149,182,0.28), rgba(24,46,106,0.15) 40%, rgba(18,31,65,0.3))",
        // Garis linimasa "Cara kerjanya": kuning ke biru
        "linimasa": "linear-gradient(180deg, #FBBF24 0%, #F59E0B 45%, #01B2DD 75%, #0965FA 100%)",
        // Sorotan bidang di kartu ORBIDU Compass
        "compass-soft": "linear-gradient(120deg, #EEF4FF, #E4F6FB)",
      },
      fontFamily: {
        // Font utama untuk semua teks
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        // Font aksen, hanya untuk 1–3 kata penekanan. Caveat (Google Fonts)
        // menjadi cadangan selama file Pecita belum tersedia.
        accent: ["Pecita", "Caveat", "Segoe Print", "cursive"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        // Kartu utama (rentang 16–24px sesuai design system)
        card: "20px",
        "card-lg": "24px",
        panel: "32px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 8px 32px rgba(15, 23, 42, 0.10)",
        cta: "0 8px 24px rgba(9, 101, 250, 0.30)",
        // Landing
        soft: "0 16px 36px rgba(16, 26, 51, 0.08)",
        lift: "0 24px 50px rgba(16, 26, 51, 0.12)",
        chip: "0 8px 20px rgba(16, 26, 51, 0.08)",
        bubble: "0 12px 30px rgba(16, 26, 51, 0.16)",
        sun: "0 14px 30px rgba(255, 112, 0, 0.25)",
        // Tombol mode aktif (Masuk/Daftar)
        tab: "0 4px 12px rgba(16, 26, 51, 0.10)",
        // Menu bawah portal di HP
        "nav-up": "0 -8px 24px rgba(16, 26, 51, 0.06)",
        // Jendela dialog (tambah prestasi, konfirmasi hapus)
        dialog: "0 30px 80px rgba(16, 26, 51, 0.30)",
        // Tombol aktif di pilihan dua
        toggle: "0 3px 10px rgba(16, 26, 51, 0.08)",
      },
      dropShadow: {
        // Bayangan maskot kecil (tombol konsultasi)
        mascot: "0 10px 14px rgba(16, 26, 51, 0.22)",
      },
      keyframes: {
        // Animasi landing dan auth (mati otomatis lewat motion-safe / prefers-reduced-motion)
        "ob-float": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "ob-blink": { "0%, 92%, 100%": { transform: "scaleY(1)" }, "94%": { transform: "scaleY(0.08)" }, "96%": { transform: "scaleY(1)" } },
        "ob-flow": { to: { strokeDashoffset: "-480" } },
        "ob-twinkle": { "0%, 100%": { opacity: "0.3", transform: "scale(0.7)" }, "50%": { opacity: "1", transform: "scale(1.15)" } },
        "ob-hop": {
          "0%, 55%, 100%": { transform: "translateY(0)" },
          "15%": { transform: "translateY(-18px)" },
          "30%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-7px)" },
        },
        // Ilustrasi hero halaman publik (Beranda, Untuk Sekolah, Tentang Kami).
        "ob-kelip": { "0%, 100%": { opacity: "0.2" }, "50%": { opacity: "1" } },
        "ob-meteor": {
          "0%": { transform: "translateX(0)", opacity: "0" },
          "6%": { opacity: "1" },
          "55%": { opacity: "1" },
          "70%, 100%": { transform: "translateX(-120vw)", opacity: "0" },
        },
        "ob-awan": { from: { transform: "translateX(-24px)" }, to: { transform: "translateX(24px)" } },
        "ob-goyang": { from: { transform: "rotate(-1.6deg)" }, to: { transform: "rotate(1.6deg)" } },
        "ob-melayang": { from: { transform: "translateY(6px) rotate(-1deg)" }, to: { transform: "translateY(-12px) rotate(1.5deg)" } },
        "ob-api": { from: { transform: "scaleX(0.82)", opacity: "0.85" }, to: { transform: "scaleX(1.12)", opacity: "1" } },
        "ob-kilau": { from: { opacity: "0.65" }, to: { opacity: "1" } },
        "ob-terbit": { from: { transform: "translateY(18%)" }, to: { transform: "translateY(0)" } },
        "ob-denyut": { from: { transform: "scale(0.94)", opacity: "0.75" }, to: { transform: "scale(1.06)", opacity: "1" } },
        "ob-muncul": { from: { transform: "translateY(24px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        // Garis putus-putus yang "mengalir" (bg-garis-x / bg-garis-y, satu pola = 14px)
        "ob-garis-x": { to: { backgroundPosition: "28px 0" } },
        "ob-garis-y": { to: { backgroundPosition: "0 28px" } },
      },
      animation: {
        "ob-float": "ob-float 6s ease-in-out infinite",
        "ob-blink": "ob-blink 5.5s infinite",
        "ob-flow": "ob-flow 18s linear infinite",
        "ob-twinkle": "ob-twinkle 4.2s ease-in-out infinite",
        "ob-hop": "ob-hop 2.6s ease-in-out infinite",
        "ob-kelip": "ob-kelip 3.2s ease-in-out infinite",
        "ob-meteor": "ob-meteor 9s linear infinite",
        "ob-awan": "ob-awan 14s ease-in-out infinite alternate",
        "ob-goyang": "ob-goyang 5s ease-in-out infinite alternate",
        "ob-melayang": "ob-melayang 4.5s ease-in-out infinite alternate",
        "ob-api": "ob-api 0.16s ease-in-out infinite alternate",
        "ob-kilau": "ob-kilau 5s ease-in-out infinite alternate",
        "ob-terbit": "ob-terbit 3.5s cubic-bezier(.22,.8,.3,1) both",
        "ob-denyut": "ob-denyut 4s ease-in-out infinite alternate",
        "ob-muncul": "ob-muncul 0.7s cubic-bezier(.22,.8,.3,1) both",
        "ob-garis-x": "ob-garis-x 1.6s linear infinite",
        "ob-garis-y": "ob-garis-y 1.6s linear infinite",
      },
    },
  },
  plugins: [],
}
