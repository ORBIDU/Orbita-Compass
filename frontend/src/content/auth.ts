// Teks halaman Masuk dan Aktivasi akun, mengikuti docs/design/auth.
// Nama brand diambil dari config/brand.ts. Tidak ada pendaftaran mandiri:
// akun dibuat setelah berlangganan (teks ajakan di content/common.ts).

import { BRAND } from "@/config/brand";

export const MIN_PASSWORD = 8;

export const AUTH_PANEL = {
  greeting: `Hi, ${BRAND.audience}!`,
  title: "Setiap siswa punya orbitnya sendiri.",
  subtitle: "Kenali dirimu. Temukan arahmu. Mulai langkahmu.",
  homeLabel: `${BRAND.name}, kembali ke beranda`,
  backLabel: "Kembali ke beranda",
};

export const AUTH_MASUK = {
  title: "Selamat datang kembali",
  subtitle: "Masuk untuk melanjutkan rencana dan latihanmu.",
  submit: "Masuk",
  submitting: "Memeriksa...",
};

export const AUTH_FIELDS = {
  email: { label: "Email", placeholder: "nama@email.com" },
  password: { label: "Password", placeholder: "Masukkan password" },
};

export const AUTH_ERRORS = {
  emailEmpty: "Email wajib diisi.",
  emailFormat: "Format email belum benar. Contoh: nama@email.com",
  passwordEmpty: "Password wajib diisi.",
  masukFallback: "Gagal masuk. Coba lagi.",
};

export const AUTH_FORGOT = {
  trigger: "Lupa password?",
  title: "Reset password lewat WhatsApp",
  body: `Untuk sementara, reset password dibantu langsung oleh tim ${BRAND.name}. Kirim pesan dengan email akunmu, nanti kami bantu.`,
  cta: `Chat WhatsApp ${BRAND.name}`,
};

/**
 * Aktivasi akun saat pertama masuk (/aktivasi): ganti password awal dari admin,
 * lalu dua persetujuan. Syarat & Ketentuan dan Kebijakan Privasi belum punya
 * halaman, jadi sementara tampil sebagai teks tebal. Ubah jadi link setelah
 * halamannya dibuat (lihat SPEK_SISWA.md bagian "Sebelum rilis").
 */
export const AKTIVASI = {
  step: (no: number, total: number) => `Langkah ${no} dari ${total}`,
  logout: "Bukan akunmu? Keluar",
  password: {
    title: "Buat password barumu",
    subtitle: "Akunmu masih memakai password awal dari admin. Ganti dulu dengan password yang hanya kamu ketahui.",
    next: "Password baru",
    nextPlaceholder: `Minimal ${MIN_PASSWORD} karakter`,
    nextHint: `Minimal ${MIN_PASSWORD} karakter, campuran huruf dan angka.`,
    repeat: "Ulangi password baru",
    repeatPlaceholder: "Ketik ulang password baru",
    submit: "Simpan password",
    submitting: "Menyimpan...",
  },
  consent: {
    title: "Satu langkah lagi",
    subtitle: "Baca dan centang dua persetujuan ini sebelum mulai memakai portal.",
    parent: `Orang tua/wali sudah mengetahui dan menyetujui aku memakai ${BRAND.name}.`,
    terms: {
      before: "Aku setuju dengan ",
      terms: "Syarat & Ketentuan",
      between: " dan ",
      privacy: "Kebijakan Privasi",
      after: ` ${BRAND.name}.`,
    },
    submit: "Masuk ke portal",
    submitting: "Menyimpan...",
  },
  errors: {
    nextEmpty: "Password baru wajib diisi.",
    tooShort: `Password baru minimal ${MIN_PASSWORD} karakter.`,
    needMix: "Gunakan campuran huruf dan angka.",
    mismatch: "Password tidak sama. Coba ketik ulang.",
    sameAsInitial: "Password baru harus berbeda dari password awal.",
    parentEmpty: "Centang persetujuan orang tua/wali untuk melanjutkan.",
    termsEmpty: "Centang persetujuan Syarat & Ketentuan untuk melanjutkan.",
    fallback: "Gagal menyimpan. Coba lagi.",
  },
};
