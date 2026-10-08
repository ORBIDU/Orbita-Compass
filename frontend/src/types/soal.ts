// Bentuk data soal, sesi latihan, dan tryout. Kunci jawaban hanya ada di
// BankQuestion (dibaca "server": mocks/practiceServer.ts). Halaman pengerjaan
// hanya menerima PublicQuestion. Lihat docs/API_CONTRACT.md bagian 12.5–12.6.

import type { ExamId } from "./practice";

/** Soal lengkap di bank (TIDAK pernah dikirim ke halaman pengerjaan). */
export interface BankQuestion {
  id: string;
  exam: ExamId;
  subject: string;
  /** Bacaan untuk soal literasi (boleh kosong). */
  passage?: string;
  text: string;
  options: string[];
  /** Indeks pilihan yang benar (TKP: pilihan dengan poin tertinggi). */
  answer: number;
  explanation: string;
  /** Khusus TKP: poin 1–5 untuk tiap pilihan. */
  points?: number[];
}

/** Soal yang dikirim ke halaman pengerjaan: tanpa kunci, pembahasan, dan poin. */
export type PublicQuestion = Pick<BankQuestion, "id" | "subject" | "passage" | "text" | "options">;

/** Jawaban latihan yang sudah dicek (dikunci, tidak bisa diubah). */
export interface CheckedAnswer {
  choice: number;
  correct: boolean;
  answer: number;
  explanation: string;
  /** TKP: poin pilihan siswa. */
  points?: number;
}

export interface PracticeSessionView {
  id: string;
  exam: ExamId;
  subject: string;
  subjectName: string;
  title: string;
  /** Tanggal Action Plan (YYYY-MM-DD) atau null untuk latihan bebas. */
  planDate: string | null;
  questions: PublicQuestion[];
  answers: Record<string, CheckedAnswer>;
  startedAt: string;
  finished: boolean;
}

/** Satu soal di pembahasan (hasil latihan atau laporan tryout). */
export interface ReviewItem {
  no: number;
  question: PublicQuestion;
  choice: number | null;
  answer: number;
  explanation: string;
  correct: boolean;
  flagged: boolean;
  /** TKP: poin tiap pilihan. */
  points?: number[];
}

export interface PracticeResultView {
  id: string;
  exam: ExamId;
  subject: string;
  subjectName: string;
  title: string;
  planDate: string | null;
  correct: number;
  total: number;
  unanswered: number;
  finishedAt: string;
  items: ReviewItem[];
}

export type SectionStatus = "done" | "active" | "pending";

export interface TryoutView {
  packageId: string;
  name: string;
  exam: ExamId;
  sections: { subject: string; name: string; count: number; status: SectionStatus }[];
  /** Subtes yang sedang dikerjakan. null = semua subtes sudah selesai. */
  current: { subject: string; name: string; index: number; questions: PublicQuestion[]; deadline: string; durationSec: number } | null;
  answers: Record<string, number>;
  flags: string[];
  /** Waktu "server", untuk menghitung selisih dengan jam perangkat. */
  serverNow: string;
  /** Subtes yang baru saja ditutup otomatis karena waktunya habis saat halaman ditutup. */
  expired: string[];
}

export interface TryoutReport {
  packageId: string;
  name: string;
  exam: ExamId;
  score: number;
  previous: { name: string; score: number } | null;
  correct: number;
  total: number;
  unanswered: number;
  timeUsedSec: number;
  completedAt: string;
  subjects: { subject: string; name: string; correct: number; total: number; score: number; max: number }[];
  items: (ReviewItem & { subject: string })[];
}
