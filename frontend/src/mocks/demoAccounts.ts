// Akun demo mode dummy (sama dengan seed backend dan src/mocks/db.ts).
// Hanya dimuat di mode dummy, jadi email dan password demo tidak ikut di
// build mode backend.

/** Petunjuk akun demo, hanya tampil di mode dummy (VITE_USE_MOCK=true). */
export const AUTH_DEMO_HINT = {
  label: "Mode dummy · akun demo",
  password: "password123",
  accounts: [
    { email: "siswa@orbita.id", note: "siswa aktif" },
    { email: "dimas@orbita.id", note: "login pertama" },
    { email: "walkel@orbita.id", note: "wali kelas" },
    { email: "gurubk@orbita.id", note: "guru BK" },
  ],
};
