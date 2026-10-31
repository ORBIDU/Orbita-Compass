import type { PlanPractice, PlanSettings } from "@/types/actionPlan";
import { KEDINASAN_TESTS, TKA_REQUIRED } from "@/types/actionPlan";
import { SNBT_SUBTESTS, type PracticeSummary, type SnbtSubtest } from "@/types/dashboard";
import {
  EXAM_CATEGORY,
  SUBSCORE_MAX,
  type ExamId,
  type ExamOverview,
  type PracticeLog,
  type SubjectStat,
  type TryoutItem,
  type TryoutResult,
} from "@/types/practice";
import { EXAM_COPY } from "@/content/siapUjian";
import { formatMonthYear } from "@/lib/datetime";
import { isSkdRelevant } from "@/lib/persiapan";
import { SELECTION_TIMELINE } from "@/data/timeline";
import { tryoutItems } from "@/data/tryout";
import { tryoutSubjects } from "@/data/practiceServer";
import { SECONDS_PER_QUESTION, SESSION_SIZE } from "@/config/practice";
import { getActionPlan, getPlanSettings } from "./actionPlanService";
import { getCompassRecommendations } from "./jurusanService";
import { getPracticeLog } from "./practiceLog";

// Satu sumber data hasil latihan untuk Siap SNBT/TKA/SKD, Action Plan, dan
// kartu Performa Dashboard (API_CONTRACT 12.4):
// - akurasi per subtes = latihan Action Plan yang selesai + latihan bebas;
// - tryout = riwayat paket tryout (practiceLog).

/** Daftar subtes/mapel ujian. TKA: mapel wajib + mapel pilihan dari Action Plan. */
export function examSubjects(exam: ExamId, settings: PlanSettings | null): { subject: string; name: string }[] {
  if (exam === "snbt") return SNBT_SUBTESTS.map((s) => ({ subject: s.key, name: s.name }));
  if (exam === "skd") return KEDINASAN_TESTS.map((t) => ({ subject: t.key, name: t.name }));
  const electives = settings?.focus.includes("TKA") ? settings.tkaElectives : [];
  return [...TKA_REQUIRED, ...electives].map((s) => ({ subject: s, name: s }));
}

/** Chip jadwal dari timeline seleksi (sumber yang sama dengan Dashboard). */
export function examSchedule(exam: ExamId, now = new Date()): string {
  const prefix = exam === "snbt" ? "utbk-" : exam === "tka" ? "tka-" : null;
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const event = prefix ? SELECTION_TIMELINE.find((e) => e.id.startsWith(prefix) && e.month >= thisMonth) : null;
  return EXAM_COPY[exam].schedule(event ? formatMonthYear(event.month) : null);
}

const byDate = (a: TryoutResult, b: TryoutResult) => a.completedAt.localeCompare(b.completedAt);

export { tryoutItems };

/** Latihan Action Plan yang selesai untuk kategori ujian ini. */
function donePlanPractices(days: Record<string, PlanPractice[]>, exam: ExamId): PlanPractice[] {
  return Object.values(days)
    .flat()
    .filter((p) => p.category === EXAM_CATEGORY[exam] && p.status === "done" && p.correct !== null);
}

function subjectStats(exam: ExamId, settings: PlanSettings | null, days: Record<string, PlanPractice[]>, log: PracticeLog): SubjectStat[] {
  const plan = donePlanPractices(days, exam);
  const free = log.free.filter((f) => f.exam === exam);
  return examSubjects(exam, settings).map(({ subject, name }) => {
    let answered = 0;
    let correct = 0;
    for (const p of plan) {
      if (p.subject !== subject) continue;
      answered += p.questions;
      correct += p.correct ?? 0;
    }
    for (const f of free) {
      if (f.subject !== subject) continue;
      answered += f.questions;
      correct += f.correct;
    }
    return { subject, name, answered, correct, accuracy: answered ? Math.round((correct / answered) * 100) : null };
  });
}

/**
 * Subtes yang paling perlu dilatih, satu aturan untuk Siap SNBT/TKA/SKD dan
 * Dashboard: akurasi latihan terendah; kalau belum ada latihan, skor
 * terendah (relatif terhadap skor maksimum) di tryout terakhir.
 */
export function weakestSubject(exam: ExamId, stats: SubjectStat[], lastTryout: TryoutResult | null): { subject: string; from: "practice" | "tryout" } | null {
  const withData = stats.filter((s) => s.answered > 0);
  if (withData.length > 0) {
    const min = withData.reduce((a, s) => (s.correct / s.answered < a.correct / a.answered ? s : a));
    return { subject: min.subject, from: "practice" };
  }
  if (!lastTryout) return null;
  const max = SUBSCORE_MAX[exam];
  const entries = Object.entries(lastTryout.subscores).filter(([k]) => max(k) > 0);
  if (entries.length === 0) return null;
  const [subject] = entries.reduce((a, e) => (e[1] / max(e[0]) < a[1] / max(a[0]) ? e : a));
  return { subject, from: "tryout" };
}

const lastResult = (items: TryoutItem[]) =>
  items
    .map((t) => t.result)
    .filter((r): r is TryoutResult => r !== null)
    .sort(byDate)
    .pop() ?? null;

/** Semua data halaman Siap SNBT/TKA/SKD. */
export async function getExamOverview(userId: string, grade: number, exam: ExamId, now = new Date()): Promise<ExamOverview> {
  const [plan, log] = await Promise.all([getActionPlan(userId, grade, now), getPracticeLog(userId)]);
  const settings = plan?.settings ?? null;
  const subjects = subjectStats(exam, settings, plan?.days ?? {}, log);
  const answered = subjects.reduce((a, s) => a + s.answered, 0);
  const correct = subjects.reduce((a, s) => a + s.correct, 0);
  const tryouts = tryoutItems(exam, log);
  return {
    exam,
    subjects,
    tryouts,
    accuracy: answered ? { answered, correct, percent: Math.round((correct / answered) * 100) } : null,
    weakest: weakestSubject(exam, subjects, lastResult(tryouts)),
    tryoutMinutes: Math.round((tryoutSubjects(exam, settings).length * SESSION_SIZE * SECONDS_PER_QUESTION[exam]) / 60),
    missingElectives: exam === "tka" && !(settings?.focus.includes("TKA") && settings.tkaElectives.length > 0),
    plan: plan ? planForExam(plan.days, plan.today, exam) : null,
  };
}

/** Latihan ujian ini hari ini, dan hari belajar berikutnya yang punya latihan ujian ini. */
function planForExam(days: Record<string, PlanPractice[]>, today: string, exam: ExamId) {
  const ofExam = (d: string) => (days[d] ?? []).filter((p) => p.category === EXAM_CATEGORY[exam]);
  const nextDate = Object.keys(days)
    .filter((d) => d > today && ofExam(d).length > 0)
    .sort()[0];
  return { today: ofExam(today), next: nextDate ? { date: nextDate, count: ofExam(nextDate).length } : null };
}

/** Hasil terakhir tiap ujian untuk kartu Performa Dashboard (sumber sama dengan Siap SNBT/TKA/SKD). */
export async function getPracticeSummary(userId: string, grade: number, now = new Date()): Promise<PracticeSummary> {
  const [plan, log] = await Promise.all([getActionPlan(userId, grade, now), getPracticeLog(userId)]);
  const lastTwo = (exam: ExamId) => {
    const done = tryoutItems(exam, log)
      .filter((t) => t.result)
      .map((t) => ({ name: t.pkg.name, result: t.result! }))
      .sort((a, b) => byDate(a.result, b.result));
    return { last: done[done.length - 1] ?? null, prev: done[done.length - 2] ?? null };
  };

  const snbt = lastTwo("snbt");
  const tka = lastTwo("tka");
  const skd = lastTwo("skd");
  const snbtStats = subjectStats("snbt", plan?.settings ?? null, plan?.days ?? {}, log);
  const snbtWeakest = weakestSubject("snbt", snbtStats, snbt.last?.result ?? null);
  const tkaStats = subjectStats("tka", plan?.settings ?? null, plan?.days ?? {}, log);
  const tkaAnswered = tkaStats.reduce((a, s) => a + s.answered, 0);
  const tkaCorrect = tkaStats.reduce((a, s) => a + s.correct, 0);

  return {
    snbt: snbt.last
      ? {
          label: snbt.last.name,
          completedAt: snbt.last.result.completedAt,
          score: snbt.last.result.score,
          previousScore: snbt.prev?.result.score ?? null,
          subtests: snbt.last.result.subscores as Record<SnbtSubtest, number>,
          weakest: (snbtWeakest?.subject ?? null) as SnbtSubtest | null,
        }
      : null,
    tka: tka.last
      ? { kind: "tryout", label: tka.last.name, completedAt: tka.last.result.completedAt, score: tka.last.result.score }
      : tkaAnswered
        ? { kind: "accuracy", percent: Math.round((tkaCorrect / tkaAnswered) * 100), answered: tkaAnswered }
        : null,
    skd: skd.last ? { label: skd.last.name, completedAt: skd.last.result.completedAt, score: skd.last.result.score } : null,
  };
}

/**
 * Apakah Siap SKD relevan untuk siswa (aturan di lib/persiapan.ts): Compass
 * merekomendasikan Kedinasan atau fokus Action Plan berisi Kedinasan.
 */
export async function getSkdRelevance(userId: string): Promise<{ relevant: boolean; hasCompass: boolean }> {
  const [compass, settings] = await Promise.all([
    getCompassRecommendations().catch(() => null),
    getPlanSettings(userId).catch(() => null),
  ]);
  return { relevant: isSkdRelevant(compass?.recommendations ?? [], settings?.focus ?? []), hasCompass: compass !== null };
}
