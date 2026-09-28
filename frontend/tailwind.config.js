/** @type {import('tailwindcss').Config} */

// ─── Design token ORBITA ─────────────────────────────────────────────────────
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

const gradient = (from, to) => `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
        // Garis pembatas: DEFAULT untuk border kartu/input, soft untuk pemisah tipis
        line: {
          DEFAULT: "#E5E7EB",
          soft: "rgba(0, 0, 0, 0.08)",
        },
        // Warna status (kalender, badge, validasi)
        success: "#22C55E",
        warning: "#F1AD00",
        danger: "#EF4444",
      },
      backgroundImage: {
        "gradient-navy": gradient(brand["space-1"], brand["space-2"]),
        "gradient-orbit": gradient(brand["orbit-1"], brand["orbit-2"]),
        "gradient-sun": gradient(brand["sun-1"], brand["sun-2"]),
      },
      fontFamily: {
        // Font utama untuk semua teks
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        // Font aksen, hanya untuk 1–3 kata penekanan. Cadangannya Poppins
        // supaya tampilan tetap rapi selama file Pecita belum ada.
        accent: ["Pecita", "Poppins", "ui-sans-serif", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        // Kartu utama (rentang 16–24px sesuai design system)
        card: "20px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 8px 32px rgba(15, 23, 42, 0.10)",
        cta: "0 8px 24px rgba(9, 101, 250, 0.30)",
      },
      // Animasi berikut belum dipakai halaman mana pun. Disimpan sebagai bahan
      // AuthAnimationSlot (Fase 3); hapus jika ternyata tidak dipakai.
      keyframes: {
        launchFade: {
          '0%, 20%': { opacity: '1' },
          '28%': { opacity: '0' },
          '96%, 100%': { opacity: '0' },
        },
        portalGrow: {
          '0%, 16%': { width: '10px', height: '10px', opacity: '0' },
          '24%': { width: '180px', height: '180px', opacity: '1' },
          '32%, 100%': { width: '10px', height: '10px', opacity: '0' },
        },
        lidTop: {
          '0%, 26%': { transform: 'translateY(-100%)' },
          '29%': { transform: 'translateY(0%)' },
          '42%, 100%': { transform: 'translateY(-100%)' },
        },
        lidBottom: {
          '0%, 26%': { transform: 'translateY(100%)' },
          '29%': { transform: 'translateY(0%)' },
          '42%, 100%': { transform: 'translateY(100%)' },
        },
        galaxyFade: {
          '0%, 27%': { opacity: '0' },
          '32%, 90%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        windFade: {
          '0%, 44%': { opacity: '0' },
          '48%, 60%': { opacity: '1' },
          '64%, 100%': { opacity: '0' },
        },
        logoFade: {
          '0%, 56%': { opacity: '0', transform: 'scale(0.85)' },
          '62%, 84%': { opacity: '1', transform: 'scale(1)' },
          '90%, 100%': { opacity: '0', transform: 'scale(1.05)' },
        },
        wipeAcross: {
          '0%, 88%': { transform: 'translateX(-100%)' },
          '98%, 100%': { transform: 'translateX(0%)' },
        },
        flamePulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(1.2)', opacity: '1' },
        },
        streakUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-160vh)' },
        },
        ringSpin: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
      },
      animation: {
        launchFade: 'launchFade 20s linear infinite',
        portalGrow: 'portalGrow 20s ease-in-out infinite',
        lidTop: 'lidTop 20s ease-in-out infinite',
        lidBottom: 'lidBottom 20s ease-in-out infinite',
        galaxyFade: 'galaxyFade 20s ease-in-out infinite',
        windFade: 'windFade 20s ease-in-out infinite',
        logoFade: 'logoFade 20s ease-in-out infinite',
        wipeAcross: 'wipeAcross 20s ease-in-out infinite',
        flamePulse: 'flamePulse 0.5s ease-in-out infinite alternate',
        streakUp: 'streakUp 0.6s linear infinite',
        ringSpin: 'ringSpin 20s linear infinite',
      },
    },
  },
  plugins: [],
}
