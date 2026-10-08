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
