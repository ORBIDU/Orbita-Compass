/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" → pakai data dummy dari src/mocks/ */
  readonly VITE_USE_MOCK?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
