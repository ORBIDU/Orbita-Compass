// Pengaturan lapisan data, dibaca dari file .env (lihat .env.example).

/*
 * Saklar mode dummy: `USE_MOCK` (true → semua service memakai data dummy dari
 * src/mocks/, tanpa backend). Tidak diekspor dari sini: nilainya konstanta
 * global yang diisi vite.config.js (`define`) dari VITE_USE_MOCK, dan
 * dideklarasikan di src/vite-env.d.ts. Dengan begitu cabang dummy dibuang
 * dari build mode backend. Kode dari src/mocks/ hanya boleh dimuat lewat
 * import() di dalam cabang USE_MOCK, jangan diimpor di bagian atas file.
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api/v1" : "/api/v1");

/** Kunci localStorage untuk token login (sama di mode dummy dan backend). */
export const TOKEN_KEY = "orbidu_token";
