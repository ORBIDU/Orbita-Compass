import type {
  AsesmenAnswer,
  AsesmenAnswers,
  AsesmenDoc,
  AsesmenQuestion,
  AsesmenSection,
  AssessmentDimension,
  AssessmentScores,
} from "@/types/analisis";

// ─── Status jawaban ──────────────────────────────────────────────────────────

/** Jawaban awal soal urutan: urutan pilihan seperti di file soal. */
export function defaultRanking(q: Extract<AsesmenQuestion, { type: "ranking" }>): string[] {
  return q.options.map((o) => o.label);
}

/** true jika soal sudah dijawab dengan bentuk yang benar. */
export function isAnswered(q: AsesmenQuestion, answer: AsesmenAnswer | undefined): boolean {
  if (answer === undefined) return false;
  switch (q.type) {
    case "likert":
      return typeof answer === "number" && answer >= 1 && answer <= 5;
    case "single":
      return typeof answer === "string" && q.options.some((o) => o.label === answer);
    case "multi":
      return Array.isArray(answer) && answer.length > 0 && answer.length <= q.max;
    case "ranking":
      // Urutan dianggap terjawab sejak ditampilkan (desain: urutan awal sudah jadi jawaban).
      return Array.isArray(answer) && answer.length === q.options.length;
  }
}

export function answeredCount(section: AsesmenSection, answers: AsesmenAnswers): number {
  return section.questions.filter((q) => isAnswered(q, answers[q.id])).length;
}

export function isSectionDone(section: AsesmenSection, answers: AsesmenAnswers): boolean {
  return answeredCount(section, answers) === section.questions.length;
}

export function doneSectionCount(doc: AsesmenDoc, answers: AsesmenAnswers): number {
  return doc.sections.filter((s) => isSectionDone(s, answers)).length;
}

/** Nomor soal berurutan di seluruh tes (bagian 2 melanjutkan nomor bagian 1, dst.). */
export function questionNumbers(doc: AsesmenDoc): Record<string, number> {
  const numbers: Record<string, number> = {};
  let n = 0;
  for (const s of doc.sections) for (const q of s.questions) numbers[q.id] = ++n;
  return numbers;
}

/**
 * Jawaban soal urutan yang belum pernah disentuh diisi urutan awal, supaya
 * ikut tersimpan dan dihitung terjawab (sesuai desain).
 */
export function withDefaultRankings(section: AsesmenSection, answers: AsesmenAnswers): AsesmenAnswers {
  let next = answers;
  for (const q of section.questions) {
    if (q.type === "ranking" && !isAnswered(q, answers[q.id])) {
      next = { ...next, [q.id]: defaultRanking(q) };
    }
  }
  return next;
}

/** Teks jawaban untuk tampilan "Lihat jawabanku". */
export function formatAnswer(q: AsesmenQuestion, answer: AsesmenAnswer | undefined): string {
  if (!isAnswered(q, answer)) return "Belum dijawab";
  if (q.type === "likert") return `${answer} dari 5 (${q.labels[0]} → ${q.labels[1]})`;
  if (q.type === "single") return String(answer);
  if (q.type === "multi") return (answer as string[]).join(", ");
  return (answer as string[]).map((label, i) => `${i + 1}. ${label}`).join("  ");
}

// ─── Skor 5 dimensi (SEMENTARA) ──────────────────────────────────────────────

/*
 * ⚠️ ATURAN SEMENTARA, BELUM DISETUJUI BU PUTRI.
 * Backend (POST /assessment) butuh 5 skor 0–100, sedangkan soal masih
 * placeholder. Skor dihitung dari bobot `dims` di src/data/asesmen.json:
 * - pilihan tunggal/ganda yang dipilih menambah bobotnya,
 * - soal urutan: bobot dikali posisi (nomor 1 penuh, terakhir 0),
 * - soal skala tidak dipakai (belum punya bobot).
 * Skor = 20 + 80 × (poin ÷ poin maksimum dimensi itu). Dasar 20 dipakai
 * karena backend mengganti skor 0 dengan 70 (API_CONTRACT bagian 3.4).
 * Rekomendasi Compass dari skor ini hanya untuk demo; penilaian final
 * harus dipindah ke backend.
 */

const DIMENSIONS: AssessmentDimension[] = ["technology", "research", "creativity", "leadership", "communication"];
const BASE = 20;

function weightOf(option: { dims?: Partial<Record<AssessmentDimension, number>> } | undefined, dim: AssessmentDimension): number {
  return option?.dims?.[dim] ?? 0;
}

/** Poin maksimum yang mungkin per dimensi untuk satu soal. */
function maxPoints(q: AsesmenQuestion, dim: AssessmentDimension): number {
  if (q.type === "single" || q.type === "ranking") return Math.max(0, ...q.options.map((o) => weightOf(o, dim)));
  if (q.type === "multi") {
    return q.options
      .map((o) => weightOf(o, dim))
      .sort((a, b) => b - a)
      .slice(0, q.max)
      .reduce((a, b) => a + b, 0);
  }
  return 0;
}

function earnedPoints(q: AsesmenQuestion, answer: AsesmenAnswer | undefined, dim: AssessmentDimension): number {
  if (!isAnswered(q, answer)) return 0;
  if (q.type === "single") return weightOf(q.options.find((o) => o.label === answer), dim);
  if (q.type === "multi") return (answer as string[]).reduce((sum, label) => sum + weightOf(q.options.find((o) => o.label === label), dim), 0);
  if (q.type === "ranking") {
    const order = answer as string[];
    const last = Math.max(1, order.length - 1);
    // Ambil pilihan dengan nilai tertinggi setelah dikali posisinya.
    return Math.max(0, ...order.map((label, i) => weightOf(q.options.find((o) => o.label === label), dim) * (1 - i / last)));
  }
  return 0;
}

/** Skor 5 dimensi dari jawaban (aturan SEMENTARA, lihat catatan di atas). */
export function scoreAnswers(doc: AsesmenDoc, answers: AsesmenAnswers): AssessmentScores {
  const scores = {} as AssessmentScores;
  for (const dim of DIMENSIONS) {
    let earned = 0;
    let max = 0;
    for (const s of doc.sections) {
      for (const q of s.questions) {
        earned += earnedPoints(q, answers[q.id], dim);
        max += maxPoints(q, dim);
      }
    }
    scores[dim] = max > 0 ? Math.round(BASE + ((100 - BASE) * earned) / max) : BASE;
  }
  return scores;
}
