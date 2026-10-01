// Teks halaman Masuk & Daftar, mengikuti docs/design/auth.
// Nama brand diambil dari config/brand.ts.

import { BRAND } from "@/config/brand";

export type AuthMode = "masuk" | "daftar";

export const MIN_PASSWORD = 8;

export const AUTH_PANEL = {
  greeting: `Hi, ${BRAND.audience}!`,
  title: "Setiap siswa punya orbitnya sendiri.",
  subtitle: "Kenali dirimu. Temukan arahmu. Mulai langkahmu.",
  homeLabel: `${BRAND.name}, kembali ke beranda`,
  backLabel: "Kembali ke beranda",
};

export const AUTH_TOGGLE = {
  label: "Pilih Masuk atau Daftar",
  masuk: "Masuk",
  daftar: "Daftar",
};

export const AUTH_MODES: Record<
  AuthMode,
  { title: string; subtitle: string; submit: string; submitting: string; switchText: string; switchCta: string }
> = {
  masuk: {
    title: "Selamat datang kembali",
    subtitle: "Masuk untuk melanjutkan rencana dan latihanmu.",
    submit: "Masuk",
    submitting: "Memeriksa...",
    switchText: "Belum punya akun?",
    switchCta: "Daftar",
  },
  daftar: {
    title: "Mulai perjalananmu",
    subtitle: "Buat akun dan mulai kenali potensimu.",
    submit: "Daftar",
    submitting: "Mendaftarkan...",
    switchText: "Sudah punya akun?",
    switchCta: "Masuk",
  },
};

export const AUTH_FIELDS = {
  name: { label: "Nama lengkap", placeholder: "Nama sesuai data sekolah" },
  email: { label: "Email", placeholder: "nama@email.com" },
  passwordMasuk: { label: "Password", placeholder: "Masukkan password" },
  passwordDaftar: { label: "Password", placeholder: `Minimal ${MIN_PASSWORD} karakter` },
  schoolName: { label: "Nama sekolah", placeholder: "Contoh: SMA Negeri 1 Palembang" },
  grade: { label: "Kelas", options: [10, 11, 12] as const, optionLabel: (k: number) => `Kelas ${k}` },
  city: { label: "Kota", placeholder: "Palembang" },
  // Syarat & Ketentuan dan Kebijakan Privasi belum punya halaman, jadi sementara
  // tampil sebagai teks tebal. Ubah jadi link setelah halamannya dibuat
  // (lihat SPEK_SISWA.md bagian "Sebelum rilis").
  consent: {
    before: "Aku dan orang tua/wali setuju dengan ",
    terms: "Syarat & Ketentuan",
    between: " serta ",
    privacy: "Kebijakan Privasi",
    after: ` ${BRAND.name}.`,
  },
};

export const AUTH_ERRORS = {
  emailEmpty: "Email wajib diisi.",
  emailFormat: "Format email belum benar. Contoh: nama@email.com",
  passwordEmpty: "Password wajib diisi.",
  passwordShort: `Password minimal ${MIN_PASSWORD} karakter.`,
  nameShort: "Tulis nama lengkapmu (minimal 3 huruf).",
  schoolEmpty: "Nama sekolah wajib diisi.",
  gradeEmpty: "Pilih kelasmu.",
  cityEmpty: "Kota wajib diisi.",
  consentEmpty: "Centang persetujuan ini bersama orang tua/wali untuk melanjutkan.",
  masukFallback: "Gagal masuk. Coba lagi.",
  daftarFallback: "Gagal mendaftar. Coba lagi.",
};

export const AUTH_FORGOT = {
  trigger: "Lupa password?",
  title: "Reset password lewat WhatsApp",
  body: `Untuk sementara, reset password dibantu langsung oleh tim ${BRAND.name}. Kirim pesan dengan email akunmu, nanti kami bantu.`,
  cta: `Chat WhatsApp ${BRAND.name}`,
};

/** Petunjuk akun demo, hanya tampil di mode dummy (VITE_USE_MOCK=true). */
export const AUTH_DEMO_HINT = {
  label: "Mode dummy · akun demo",
  email: "siswa@orbita.id",
  password: "password123",
};
