import type { PracticeLog } from "@/types/practice";
import { gradeAttempt, newAttempt, sampleAnswers, tryoutSubjects, type TryoutAttempt } from "../practiceServer";
import { DEMO_PLAN_INPUT } from "./actionPlan";

// Riwayat tryout contoh akun demo siswa (fokus SNBT + TKA), disusun dari
// jawaban atas bank soal contoh supaya "Lihat laporan" punya pembahasan.
// Skornya dihitung "server" (practiceServer), bukan ditulis langsung.
// Kenaikan dibuat wajar: SNBT satu soal lebih banyak benar (+23), TKA dua soal (+8).

/** [paket, mulai (ISO), menit per subtes yang dipakai, jumlah benar per subtes (urutan subtes)] */
const SEED: [string, string, number, number[]][] = [
  ["snbt-to-0", "2026-09-01T08:00:00.000Z", 6, [3, 3, 3, 3, 2, 2, 3]],
  ["snbt-to-1", "2026-09-26T08:00:00.000Z", 6, [4, 3, 3, 3, 2, 2, 3]],
  ["tka-to-0", "2026-09-06T08:00:00.000Z", 8, [3, 4, 3, 3, 2]],
  ["tka-to-1", "2026-09-20T08:00:00.000Z", 8, [3, 4, 3, 4, 3]],
];

export function demoTryoutData(): { log: PracticeLog; attempts: Record<string, TryoutAttempt> } {
  const settings = { ...DEMO_PLAN_INPUT, startDate: "", endDate: "", updatedAt: "" };
  const log: PracticeLog = { free: [], tryouts: [] };
  const attempts: Record<string, TryoutAttempt> = {};
  for (const [packageId, start, minutes, correct] of SEED) {
    const exam = packageId.startsWith("snbt") ? "snbt" : "tka";
    const a = newAttempt(packageId, exam, tryoutSubjects(exam, settings), new Date(start));
    let t = new Date(start).getTime();
    a.sections.forEach((sec, i) => {
      Object.assign(a.answers, sampleAnswers(sec.questionIds, sec.questionIds.length, correct[i] ?? 0));
      sec.startedAt = new Date(t).toISOString();
      sec.deadline = new Date(t + 30 * 60_000).toISOString();
      t += minutes * 60_000;
      sec.finishedAt = new Date(t).toISOString();
    });
    a.current = a.sections.length;
    a.finishedAt = new Date(t).toISOString();
    attempts[packageId] = a;
    log.tryouts.push(gradeAttempt(a, a.finishedAt));
  }
  return { log, attempts };
}
