// Pengaturan lapisan data, dibaca dari file .env (lihat .env.example).

/** true → semua service memakai data dummy dari src/mocks/, tanpa backend. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

/** Kunci localStorage untuk token login (sama di mode dummy dan backend). */
export const TOKEN_KEY = "orbita_token";
