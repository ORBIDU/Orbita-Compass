// Bentuk data hasil latihan dan tryout (Siap SNBT/TKA/SKD, Action Plan,
// kartu Performa Dashboard). Satu sumber: services/practiceService.ts.
// Belum ada endpoint yang cocok; lihat docs/API_CONTRACT.md bagian 12.4.

import type { UjianKey } from "@/config/navigation";
import type { PlanCategory, PlanPractice } from "./actionPlan";

export type ExamId = UjianKey;

/** Kategori Action Plan untuk tiap ujian. */
export const EXAM_CATEGORY: Record<ExamId, PlanCategory> = { snbt: "SNBT", tka: "TKA", skd: "Kedinasan" };

/** Hasil satu sesi latihan bebas (di luar Action Plan). */
export interface FreePracticeResult {
  id: string;
  exam: ExamId;
  /** Kode subtes SNBT, nama mapel TKA, atau kode tes SKD. */
  subject: string;
  questions: number;
  correct: number;
  completedAt: string;
}

/** Satu paket tryout (urutannya menentukan paket mana yang terbuka). */
export interface TryoutPackage {
  id: string;
  exam: ExamId;
  name: string;
  order: number;
}

/** Hasil tryout yang sudah selesai. */
export interface TryoutResult {
  packageId: string;
  exam: ExamId;
  /** Skor total: SNBT rata-rata 0–1000, TKA rata-rata 0–100, SKD jumlah (maks. 550). */
  score: number;
  /** Skor per subtes/mapel dengan skala yang sama. */
  subscores: Record<string, number>;
  completedAt: string;
}

/** Simpanan hasil latihan bebas dan tryout per siswa. */
export interface PracticeLog {
  free: FreePracticeResult[];
  tryouts: TryoutResult[];
}

export interface SubjectStat {
  subject: string;
  name: string;
  /** Soal yang sudah dikerjakan (latihan Action Plan + latihan bebas). */
  answered: number;
  correct: number;
  /** 0–100, null = belum ada latihan. */
  accuracy: number | null;
}

export type TryoutStatus = "done" | "open" | "locked";

export interface TryoutItem {
  pkg: TryoutPackage;
  status: TryoutStatus;
  result: TryoutResult | null;
  /** Nama paket sebelumnya (untuk "Terbuka setelah …"). */
  previousName: string | null;
}

/** Ringkasan satu ujian untuk halaman Siap SNBT/TKA/SKD. */
export interface ExamOverview {
  exam: ExamId;
  subjects: SubjectStat[];
  tryouts: TryoutItem[];
  /** Gabungan semua subtes. null = belum ada latihan. */
  accuracy: { answered: number; correct: number; percent: number } | null;
  /** Paling perlu dilatih (aturan di practiceService.weakestSubject). null = belum ada data. */
  weakest: { subject: string; from: "practice" | "tryout" } | null;
  /** true untuk TKA tanpa pengaturan mapel pilihan di Action Plan. */
  missingElectives: boolean;
  /** Latihan Action Plan ujian ini hari ini dan hari belajar berikutnya. null = belum ada rencana. */
  plan: { today: PlanPractice[]; next: { date: string; count: number } | null } | null;
}

/** Skor maksimum per subtes untuk tiap ujian (SKD per tes, sisanya sama untuk semua). */
export const SUBSCORE_MAX: Record<ExamId, (subject: string) => number> = {
  snbt: () => 1000,
  tka: () => 100,
  skd: (s) => ({ TWK: 150, TIU: 175, TKP: 225 })[s] ?? 0,
};

/** Skor total maksimum. */
export const SCORE_MAX: Record<ExamId, number> = { snbt: 1000, tka: 100, skd: 550 };
