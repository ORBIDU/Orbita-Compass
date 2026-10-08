// Bentuk data Dashboard (/portal). Sebagian besar belum punya endpoint
// backend; bentuknya dicatat di docs/API_CONTRACT.md bagian 7.

import type { BidangKey, FitLabel } from "./jurusan";

/** Jenis Persiapan di kartu Performa (fokus Action Plan memakai PlanCategory). */
export type ExamKey = "SNBT" | "TKA" | "SKD";

/** 7 subtes UTBK-SNBT, urutan sesuai radar di desain. */
export const SNBT_SUBTESTS = [
  { key: "PU", name: "Penalaran Umum" },
  { key: "PPU", name: "Pengetahuan dan Pemahaman Umum" },
  { key: "PBM", name: "Pemahaman Bacaan dan Menulis" },
  { key: "PK", name: "Pengetahuan Kuantitatif" },
  { key: "LBI", name: "Literasi dalam Bahasa Indonesia" },
  { key: "LBE", name: "Literasi dalam Bahasa Inggris" },
  { key: "PM", name: "Penalaran Matematika" },
] as const;

export type SnbtSubtest = (typeof SNBT_SUBTESTS)[number]["key"];

/** Skala skor SNBT yang dipakai radar (skor per subtes 0–1000). */
export const SNBT_MAX_SCORE = 1000;

export interface SnbtResult {
  /** Nama paket, mis. "Tryout #1" */
  label: string;
  /** Tanggal selesai (ISO) */
  completedAt: string;
  score: number;
  /** Skor tryout sebelumnya, untuk selisih. null = baru sekali tryout. */
  previousScore: number | null;
  subtests: Record<SnbtSubtest, number>;
  /** Paling perlu dilatih, aturan sama dengan Siap SNBT (practiceService.weakestSubject). */
  weakest: SnbtSubtest | null;
}

/**
 * Baris TKA: nilai tryout terakhir, atau (kalau belum pernah tryout) akurasi
 * latihan TKA dengan label berbeda supaya tidak terbaca sebagai nilai tryout.
 */
export type TkaSummary =
  | { kind: "tryout"; label: string; completedAt: string; score: number }
  | { kind: "accuracy"; percent: number; answered: number };

export interface SkdResult {
  label: string;
  completedAt: string;
  score: number;
}

/** Hasil terakhir tiap jenis Persiapan. null = belum ada data. Sumber: practiceService. */
export interface PracticeSummary {
  snbt: SnbtResult | null;
  tka: TkaSummary | null;
  skd: SkdResult | null;
}

export interface TimelineEvent {
  id: string;
  /** Bulan perkiraan, format "YYYY-MM" */
  month: string;
  title: string;
  note: string;
  /** Warna penanda: TKA oranye, lainnya biru. */
  tone: "orange" | "blue";
}

/** Ringkasan ORBIDU Compass untuk kartu Dashboard. */
export interface CompassHighlights {
  analyzedAt: string;
  /** null jika tidak ada rekomendasi yang cocok dengan katalog. */
  bidang: BidangKey | null;
  /** Label keselarasan bidang, tanpa persentase. */
  bidangFit: FitLabel;
  /** `slug`/`bidang` null = nama dari Compass tidak ada di katalog (tanpa link). */
  jurusan: { slug: string | null; name: string; bidang: BidangKey | null; fit: FitLabel }[];
}
