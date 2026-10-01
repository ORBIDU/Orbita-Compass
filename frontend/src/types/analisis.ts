// Bentuk data halaman Analisis Potensi (/portal/analisis-potensi).
// Yang belum ada di backend dicatat di docs/API_CONTRACT.md bagian 3 dan 8.

import type { BidangKey } from "./jurusan";

// ─── Gambaran Minat Bakat (src/data/asesmen.json) ───────────────────────────

/** 5 dimensi skor yang diterima POST /assessment (0–100). */
export type AssessmentDimension = "technology" | "research" | "creativity" | "leadership" | "communication";

/** Bobot SEMENTARA sebuah pilihan ke dimensi skor (lihat lib/asesmenScoring.ts). */
export type DimensionWeights = Partial<Record<AssessmentDimension, number>>;

export interface AsesmenOption {
  label: string;
  dims?: DimensionWeights;
}

interface QuestionBase {
  id: string;
  text: string;
}

/** Skala 1–5. `labels` = teks ujung kiri dan kanan. */
export interface LikertQuestion extends QuestionBase {
  type: "likert";
  labels: [string, string];
}

export interface SingleQuestion extends QuestionBase {
  type: "single";
  options: AsesmenOption[];
}

/** Pilihan ganda dengan batas `max` pilihan. */
export interface MultiQuestion extends QuestionBase {
  type: "multi";
  max: number;
  options: AsesmenOption[];
}

/** Urutkan semua pilihan; nomor 1 paling penting. */
export interface RankingQuestion extends QuestionBase {
  type: "ranking";
  options: AsesmenOption[];
}

export type AsesmenQuestion = LikertQuestion | SingleQuestion | MultiQuestion | RankingQuestion;

export interface AsesmenSection {
  id: string;
  title: string;
  description: string;
  questions: AsesmenQuestion[];
}

export interface AsesmenDoc {
  /** "placeholder" sampai soal final dari Bu Putri masuk. */
  status: "placeholder" | "final";
  version: string;
  sections: AsesmenSection[];
}

/**
 * Jawaban per id soal: angka (skala), teks pilihan (tunggal),
 * daftar pilihan (ganda), atau urutan lengkap (urutan).
 */
export type AsesmenAnswer = number | string | string[];
export type AsesmenAnswers = Record<string, AsesmenAnswer>;

export interface AsesmenDraft {
  answers: AsesmenAnswers;
  /** Indeks bagian terakhir yang dibuka, supaya bisa dilanjutkan. */
  sectionIndex: number;
  /** null = belum pernah disimpan. */
  savedAt: string | null;
}

export type AssessmentScores = Record<AssessmentDimension, number>;

/** Satu baris "Riwayat per kelas". */
export interface AssessmentHistoryEntry {
  grade: number;
  completedAt: string;
  /** Bidang paling selaras saat itu. null = tidak diketahui. */
  topBidang: BidangKey | null;
}

/** Hasil tes terbaru, untuk kartu "Gambaran Minat Bakat selesai". */
export interface AssessmentSummary {
  completedAt: string;
  grade: number;
  /** Jawaban tes terbaru. null jika tidak tersimpan (mis. diisi sebelum fitur ini ada). */
  answers: AsesmenAnswers | null;
  /** Riwayat kelas sebelumnya (tanpa tes terbaru), terbaru di atas. */
  previous: AssessmentHistoryEntry[];
}

// ─── Prestasi ────────────────────────────────────────────────────────────────

export type AchievementKind = "akademik" | "nonakademik";

export const ACHIEVEMENT_LEVELS = ["Sekolah", "Kota/Kabupaten", "Provinsi", "Nasional", "Internasional"] as const;
export type AchievementLevel = (typeof ACHIEVEMENT_LEVELS)[number];

export interface AchievementItem {
  id: string;
  title: string;
  kind: AchievementKind;
  /** Tingkat. Nilai backend yang tidak dikenal ditampilkan apa adanya. */
  level: string;
  /** Capaian, mis. "Juara 1". Belum ada di backend. */
  rank: string | null;
  /** Penyelenggara. Belum ada di backend. */
  organizer: string | null;
  year: number;
  /** Nama file sertifikat. Belum ada di backend. */
  certificateName: string | null;
}

export interface AchievementInput {
  title: string;
  kind: AchievementKind;
  level: AchievementLevel;
  rank: string;
  organizer: string;
  year: number;
  /** undefined = tidak diubah; null = dihapus; string = nama file baru. */
  certificateName?: string | null;
}

// ─── Nilai rapor ─────────────────────────────────────────────────────────────

export interface RaporSubjectScore {
  subject: string;
  score: number;
}

export interface RaporSemester {
  semester: number;
  /** "Ganjil" | "Genap" */
  term: "Ganjil" | "Genap";
  /** 10, 11, atau 12 */
  grade: number;
  /** "2024/2025" */
  schoolYear: string;
  /** Kosong jika belum diinput. */
  subjects: RaporSubjectScore[];
  /** true untuk semester yang sedang berjalan (nilainya belum ada). */
  ongoing: boolean;
}

export interface RaporData {
  semesters: RaporSemester[];
  /** Tanggal terakhir nilai diperbarui. null jika belum ada nilai. */
  updatedAt: string | null;
}
