// Teks umum yang dipakai banyak halaman.

import { BRAND } from "@/config/brand";

export const LOAD_ERROR = "Bagian ini gagal dimuat.";
export const RETRY = "Coba lagi";

/** Label kecil yang selalu tampil di mode dummy (VITE_USE_MOCK=true). */
export const DEMO_LABEL = "Versi demo, data contoh";

/**
 * Cara mendapatkan akun (tidak ada pendaftaran mandiri). Dipakai halaman
 * Masuk, FAQ beranda, dan kartu ajakan di detail jurusan. Teks sementara yang
 * netral; ganti di sini kalau tim sudah memutuskan siapa yang membuat akun.
 */
export const ACCOUNT_ACCESS = {
  note: "Akunmu dibuat setelah berlangganan.",
  question: "Belum punya akun?",
  cta: `Hubungi tim ${BRAND.name}`,
  /** Kalimat lengkap untuk tempat tanpa link (mis. jawaban FAQ). */
  full: `Akunmu dibuat setelah berlangganan. Belum punya akun? Hubungi tim ${BRAND.name}.`,
  /** Label tombol utama untuk tamu (membuka WhatsApp). */
  subscribe: "Berlangganan",
};

/** Halaman error (errorElement router) saat komponen crash atau file halaman gagal dimuat. */
export const ERROR_PAGE = {
  title: "Ada yang tidak beres di halaman ini",
  body: "Coba muat ulang halaman. Kalau masih terjadi, kembali dulu lalu buka lagi beberapa saat kemudian.",
  reload: "Muat ulang",
  home: "Kembali ke beranda",
  portal: "Kembali ke Dashboard",
  updating: "Memuat versi terbaru...",
  /** Hanya tampil di mode development. */
  detail: "Detail error (hanya terlihat saat development)",
};

/** Judul tab browser untuk halaman yang tidak punya judul di content lain (lib/usePageTitle.ts). */
export const PAGE_TITLES = {
  dashboard: "Dashboard",
  masuk: "Masuk",
  aktivasi: "Aktivasi akun",
  notFound: "Halaman tidak ditemukan",
  error: "Terjadi kesalahan",
  latihan: "Latihan",
};

