/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" → pakai data dummy dari src/mocks/ */
  readonly VITE_USE_MOCK?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * true → mode dummy (VITE_USE_MOCK=true). Diganti teks saat build oleh
 * vite.config.js (`define`), lihat catatan di src/services/config.ts.
 */
declare const USE_MOCK: boolean;
