import type { PlanCategory, PlanPractice, PlanSettings } from "@/types/actionPlan";
import { KEDINASAN_TESTS, TKA_REQUIRED } from "@/types/actionPlan";
import { SNBT_SUBTESTS } from "@/types/dashboard";
import { EXAM_CATEGORY, SUBSCORE_MAX, type ExamId, type PracticeLog, type TryoutResult } from "@/types/practice";
import type {
  BankQuestion,
  CheckedAnswer,
  PracticeResultView,
  PracticeSessionView,
  PublicQuestion,
  ReviewItem,
  TryoutReport,
  TryoutView,
} from "@/types/soal";
import { SECONDS_PER_QUESTION } from "@/config/practice";
import { ApiError } from "@/services/http";
import { formatWeekday, toDateKey } from "@/lib/datetime";
import { PRACTICE_SERVER_MSG } from "@/content/pengerjaan";
import type { PlanState } from "./actionPlanEngine";
import { bankFor, findQuestion } from "./data/soal";
import { TRYOUT_PACKAGES, tryoutItems } from "./data/tryout";

// "SERVER" SIMULASI untuk latihan dan tryout (API_CONTRACT 12.5–12.6).
// Hanya file ini yang membaca kunci jawaban di bank. Halaman pengerjaan hanya
// menerima PublicQuestion; kunci dan pembahasan dikirim setelah jawaban
// dikunci (latihan) atau setelah tryout selesai (laporan). Aturan yang sama
// wajib dipegang backend. Dipakai di mode dummy (data akun) dan mode backend
// (browser per akun) lewat PracticeStore.

export interface PracticeSession {
  id: string;
  exam: ExamId;
  subject: string;
  planPracticeId: string | null;
  planDate: string | null;
  questionIds: string[];
  /** id soal → indeks pilihan. Sekali tersimpan tidak bisa diubah. */
  answers: Record<string, number>;
  startedAt: string;
  finishedAt: string | null;
}

export interface TryoutSection {
  subject: string;
  questionIds: string[];
  startedAt: string | null;
  deadline: string | null;
  finishedAt: string | null;
}

export interface TryoutAttempt {
  packageId: string;
  exam: ExamId;
  sections: TryoutSection[];
  /** Indeks subtes yang sedang berjalan (= sections.length jika semua selesai). */
  current: number;
  answers: Record<string, number>;
  flags: string[];
  startedAt: string;
  finishedAt: string | null;
}

export interface PracticeStore {
  now(): Date;
  loadPlan(): Promise<PlanState | null>;
  savePlan(state: PlanState): Promise<void>;
  loadLog(): Promise<PracticeLog>;
  saveLog(log: PracticeLog): Promise<void>;
  loadSessions(): Promise<Record<string, PracticeSession>>;
  saveSessions(sessions: Record<string, PracticeSession>): Promise<void>;
  loadAttempts(): Promise<Record<string, TryoutAttempt>>;
  saveAttempts(attempts: Record<string, TryoutAttempt>): Promise<void>;
  /** Siswa sudah punya data latihan → status "aktif" (mode dummy). */
  markActive(): Promise<void>;
}

// ─── Bantuan umum ────────────────────────────────────────────────────────────

const EXAM_OF: Record<PlanCategory, ExamId> = { SNBT: "snbt", TKA: "tka", Kedinasan: "skd" };

export function subjectName(exam: ExamId, subject: string): string {
  if (exam === "snbt") return SNBT_SUBTESTS.find((s) => s.key === subject)?.name ?? subject;
  if (exam === "skd") return KEDINASAN_TESTS.find((t) => t.key === subject)?.name ?? subject;
  return subject;
}

const toPublic = ({ id, subject, passage, text, options }: BankQuestion): PublicQuestion => ({
  id,
  subject,
  text,
  options,
  ...(passage ? { passage } : {}),
});

const isCorrect = (q: BankQuestion, choice: number | undefined) => choice === q.answer;

function checked(q: BankQuestion, choice: number): CheckedAnswer {
  return {
    choice,
    correct: isCorrect(q, choice),
    answer: q.answer,
    explanation: q.explanation,
    ...(q.points ? { points: q.points[choice] } : {}),
  };
}

function review(questionIds: string[], answers: Record<string, number>, flags: string[] = []): (ReviewItem & { subject: string })[] {
  return questionIds.map((id, i) => {
    const q = findQuestion(id)!;
    const choice = answers[id] ?? null;
    return {
      no: i + 1,
      subject: q.subject,
      question: toPublic(q),
      choice,
      answer: q.answer,
      explanation: q.explanation,
      correct: choice !== null && isCorrect(q, choice),
      flagged: flags.includes(id),
      ...(q.points ? { points: q.points } : {}),
    };
  });
}

/**
 * Skor satu subtes (perkiraan): SNBT 200–1000, TKA 0–100, SKD TWK/TIU
 * proporsional terhadap maksimumnya, TKP dari poin pilihan.
 */
export function scoreSubject(exam: ExamId, subject: string, questionIds: string[], answers: Record<string, number>): number {
  const qs = questionIds.map((id) => findQuestion(id)!);
  const total = qs.length || 1;
  const correct = qs.filter((q) => isCorrect(q, answers[q.id])).length;
  if (exam === "snbt") return Math.round(200 + (800 * correct) / total);
  if (exam === "tka") return Math.round((100 * correct) / total);
  const max = SUBSCORE_MAX.skd(subject);
  if (subject === "TKP") {
    const points = qs.reduce((sum, q) => sum + (answers[q.id] !== undefined ? (q.points?.[answers[q.id]] ?? 0) : 0), 0);
    return Math.round((max * points) / (5 * total));
  }
  return Math.round((max * correct) / total);
}

/** Skor total: SNBT dan TKA rata-rata subtes, SKD jumlah. */
export function totalScore(exam: ExamId, subscores: Record<string, number>): number {
  const values = Object.values(subscores);
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return exam === "skd" ? sum : Math.round(sum / values.length);
}

/**
 * Jawaban contoh untuk riwayat yang tidak punya rincian per soal (data contoh):
 * `correct` soal pertama benar, sisanya salah, `count` soal dijawab.
 */
export function sampleAnswers(questionIds: string[], count: number, correct: number): Record<string, number> {
  const answers: Record<string, number> = {};
  questionIds.slice(0, count).forEach((id, i) => {
    const q = findQuestion(id)!;
    answers[id] = i < correct ? q.answer : (q.answer + 1) % q.options.length;
  });
  return answers;
}

// ─── Latihan ─────────────────────────────────────────────────────────────────

function findPlanPractice(state: PlanState | null, id: string): { date: string; practice: PlanPractice } | null {
  if (!state) return null;
  for (const [date, list] of Object.entries(state.days)) {
    const practice = list.find((p) => p.id === id);
    if (practice) return { date, practice };
  }
  return null;
}

function sessionView(s: PracticeSession, title: string): PracticeSessionView {
  const answers: Record<string, CheckedAnswer> = {};
  for (const [id, choice] of Object.entries(s.answers)) answers[id] = checked(findQuestion(id)!, choice);
  return {
    id: s.id,
    exam: s.exam,
    subject: s.subject,
    subjectName: subjectName(s.exam, s.subject),
    title,
    planDate: s.planDate,
    questions: s.questionIds.map((id) => toPublic(findQuestion(id)!)),
    answers,
    startedAt: s.startedAt,
    finished: s.finishedAt !== null,
  };
}

const practiceTitle = (exam: ExamId, subject: string) => `Latihan ${exam === "tka" ? "TKA " : ""}${subjectName(exam, subject)}`;

/** Buat/ambil sesi latihan untuk latihan Action Plan. Riwayat contoh disusun dari jumlah benar. */
async function planSession(store: PracticeStore, planPracticeId: string): Promise<{ session: PracticeSession; title: string; sessions: Record<string, PracticeSession> }> {
  // Id latihan rencana diawali tanggalnya (YYYY-MM-DD-n). Hari yang akan datang belum dibuka.
  const today = toDateKey(store.now());
  const idDate = planPracticeId.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(idDate) && idDate > today) throw new ApiError(403, PRACTICE_SERVER_MSG.notYet(formatWeekday(idDate)));
  const found = findPlanPractice(await store.loadPlan(), planPracticeId);
  if (!found) throw new ApiError(404, PRACTICE_SERVER_MSG.notFound);
  const { date, practice } = found;
  const exam = EXAM_OF[practice.category];
  const bank = bankFor(exam, practice.subject);
  if (bank.length === 0) throw new ApiError(404, PRACTICE_SERVER_MSG.noBank);

  const sessions = await store.loadSessions();
  let session = sessions[planPracticeId];
  if (!session) {
    const questionIds = bank.map((q) => q.id);
    const done = practice.status === "done";
    session = {
      id: planPracticeId,
      exam,
      subject: practice.subject,
      planPracticeId,
      planDate: date,
      questionIds,
      // Riwayat contoh hanya punya jumlah benar/dijawab, jadi rincian jawabannya disusun dari bank.
      answers: done
        ? sampleAnswers(questionIds, questionIds.length, practice.correct ?? 0)
        : sampleAnswers(questionIds, practice.answered, Math.ceil(practice.answered / 2)),
      startedAt: store.now().toISOString(),
      finishedAt: done ? store.now().toISOString() : null,
    };
    sessions[planPracticeId] = session;
    await store.saveSessions(sessions);
  }
  return { session, title: practice.title, sessions };
}

/** Mulai atau lanjutkan latihan. `free` = latihan bebas (sesi baru setiap kali). */
export async function startPractice(
  store: PracticeStore,
  req: { planPracticeId: string } | { exam: ExamId; subject: string },
): Promise<PracticeSessionView> {
  if ("planPracticeId" in req) {
    const { session, title } = await planSession(store, req.planPracticeId);
    return sessionView(session, title);
  }
  const bank = bankFor(req.exam, req.subject);
  if (bank.length === 0) throw new ApiError(404, PRACTICE_SERVER_MSG.noBank);
  const now = store.now();
  const sessions = await store.loadSessions();
  const session: PracticeSession = {
    id: `bebas-${req.exam}-${now.getTime().toString(36)}`,
    exam: req.exam,
    subject: req.subject,
    planPracticeId: null,
    planDate: null,
    questionIds: bank.map((q) => q.id),
    answers: {},
    startedAt: now.toISOString(),
    finishedAt: null,
  };
  sessions[session.id] = session;
  await store.saveSessions(sessions);
  return sessionView(session, practiceTitle(req.exam, req.subject));
}

/** Ambil sesi yang sudah ada (latihan bebas atau Action Plan). */
export async function getPractice(store: PracticeStore, sessionId: string): Promise<PracticeSessionView> {
  const sessions = await store.loadSessions();
  const s = sessions[sessionId];
  if (s) return sessionView(s, s.planPracticeId ? (findPlanPractice(await store.loadPlan(), s.planPracticeId)?.practice.title ?? practiceTitle(s.exam, s.subject)) : practiceTitle(s.exam, s.subject));
  if (sessionId.startsWith("bebas-")) throw new ApiError(404, PRACTICE_SERVER_MSG.notFound);
  return startPractice(store, { planPracticeId: sessionId });
}

/** "Cek jawaban": jawaban dikunci; kunci dan pembahasan hanya untuk soal ini. */
export async function checkAnswer(store: PracticeStore, sessionId: string, questionId: string, choice: number): Promise<CheckedAnswer> {
  const sessions = await store.loadSessions();
  const s = sessions[sessionId];
  if (!s || !s.questionIds.includes(questionId)) throw new ApiError(404, PRACTICE_SERVER_MSG.notFound);
  const q = findQuestion(questionId)!;
  // Jawaban yang sudah dicek tidak bisa diubah (termasuk lewat refresh).
  if (s.answers[questionId] !== undefined) return checked(q, s.answers[questionId]);
  if (s.finishedAt) throw new ApiError(409, PRACTICE_SERVER_MSG.finished);
  if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length) throw new ApiError(400, PRACTICE_SERVER_MSG.invalid);
  s.answers[questionId] = choice;
  await store.saveSessions(sessions);

  if (s.planPracticeId) {
    const plan = await store.loadPlan();
    const found = findPlanPractice(plan, s.planPracticeId);
    if (plan && found && found.practice.status !== "done") {
      found.practice.answered = Object.keys(s.answers).length;
      found.practice.status = "in_progress";
      await store.savePlan(plan);
    }
  }
  return checked(q, choice);
}

/** Selesaikan latihan: soal yang belum dijawab tidak dihitung benar. */
export async function finishPractice(store: PracticeStore, sessionId: string): Promise<void> {
  const sessions = await store.loadSessions();
  const s = sessions[sessionId];
  if (!s) throw new ApiError(404, PRACTICE_SERVER_MSG.notFound);
  if (s.finishedAt) return;
  const now = store.now().toISOString();
  s.finishedAt = now;
  await store.saveSessions(sessions);
  const correct = s.questionIds.filter((id) => isCorrect(findQuestion(id)!, s.answers[id])).length;

  if (s.planPracticeId) {
    const plan = await store.loadPlan();
    const found = findPlanPractice(plan, s.planPracticeId);
    if (plan && found) {
      Object.assign(found.practice, { status: "done", answered: s.questionIds.length, correct, questions: s.questionIds.length });
      await store.savePlan(plan);
    }
  } else {
    const log = await store.loadLog();
    log.free.push({ id: s.id, exam: s.exam, subject: s.subject, questions: s.questionIds.length, correct, completedAt: now });
    await store.saveLog(log);
  }
  await store.markActive();
}

/** Hasil + pembahasan latihan (hanya setelah selesai). */
export async function practiceResult(store: PracticeStore, sessionId: string): Promise<PracticeResultView> {
  let s = (await store.loadSessions())[sessionId];
  if (!s && !sessionId.startsWith("bebas-")) s = (await planSession(store, sessionId)).session;
  if (!s) throw new ApiError(404, PRACTICE_SERVER_MSG.notFound);
  if (!s.finishedAt) throw new ApiError(409, PRACTICE_SERVER_MSG.notFinished);
  const items = review(s.questionIds, s.answers);
  const title = s.planPracticeId ? (findPlanPractice(await store.loadPlan(), s.planPracticeId)?.practice.title ?? practiceTitle(s.exam, s.subject)) : practiceTitle(s.exam, s.subject);
  return {
    id: s.id,
    exam: s.exam,
    subject: s.subject,
    subjectName: subjectName(s.exam, s.subject),
    title,
    planDate: s.planDate,
    correct: items.filter((i) => i.correct).length,
    total: items.length,
    unanswered: items.filter((i) => i.choice === null).length,
    finishedAt: s.finishedAt,
    items,
  };
}

// ─── Tryout ──────────────────────────────────────────────────────────────────

/** Subtes tryout: SNBT 7, SKD 3, TKA mapel wajib + mapel pilihan yang punya soal contoh. */
export function tryoutSubjects(exam: ExamId, settings: PlanSettings | null): string[] {
  if (exam === "snbt") return SNBT_SUBTESTS.map((s) => s.key);
  if (exam === "skd") return KEDINASAN_TESTS.map((t) => t.key);
  const electives = settings?.focus.includes(EXAM_CATEGORY.tka) ? settings.tkaElectives : [];
  return [...TKA_REQUIRED, ...electives].filter((s) => bankFor("tka", s).length > 0);
}

const durationOf = (exam: ExamId, count: number) => count * SECONDS_PER_QUESTION[exam];

export function newAttempt(packageId: string, exam: ExamId, subjects: string[], now: Date): TryoutAttempt {
  return {
    packageId,
    exam,
    sections: subjects.map((subject) => ({ subject, questionIds: bankFor(exam, subject).map((q) => q.id), startedAt: null, deadline: null, finishedAt: null })),
    current: 0,
    answers: {},
    flags: [],
    startedAt: now.toISOString(),
    finishedAt: null,
  };
}

/** Hasil tryout dari jawaban yang tersimpan (penilaian di "server"). */
export function gradeAttempt(a: TryoutAttempt, completedAt: string): TryoutResult {
  const subscores: Record<string, number> = {};
  for (const sec of a.sections) subscores[sec.subject] = scoreSubject(a.exam, sec.subject, sec.questionIds, a.answers);
  return { packageId: a.packageId, exam: a.exam, score: totalScore(a.exam, subscores), subscores, completedAt };
}

function startSection(a: TryoutAttempt, now: Date) {
  const sec = a.sections[a.current];
  if (!sec || sec.startedAt) return;
  sec.startedAt = now.toISOString();
  sec.deadline = new Date(now.getTime() + durationOf(a.exam, sec.questionIds.length) * 1000).toISOString();
}

async function finalize(store: PracticeStore, a: TryoutAttempt, now: Date) {
  a.finishedAt = now.toISOString();
  const log = await store.loadLog();
  log.tryouts = log.tryouts.filter((t) => t.packageId !== a.packageId);
  log.tryouts.push(gradeAttempt(a, a.finishedAt));
  await store.saveLog(log);
  await store.markActive();
}

function tryoutView(a: TryoutAttempt, name: string, now: Date, expired: string[]): TryoutView {
  const sec = a.sections[a.current];
  return {
    packageId: a.packageId,
    name,
    exam: a.exam,
    sections: a.sections.map((s, i) => ({
      subject: s.subject,
      name: subjectName(a.exam, s.subject),
      count: s.questionIds.length,
      status: s.finishedAt ? "done" : i === a.current ? "active" : "pending",
    })),
    current:
      sec && !a.finishedAt
        ? {
            subject: sec.subject,
            name: subjectName(a.exam, sec.subject),
            index: a.current,
            questions: sec.questionIds.map((id) => toPublic(findQuestion(id)!)),
            deadline: sec.deadline!,
            durationSec: durationOf(a.exam, sec.questionIds.length),
          }
        : null,
    answers: a.answers,
    flags: a.flags,
    serverNow: now.toISOString(),
    expired,
  };
}

/**
 * Buka tryout. Paket terkunci ditolak (403), paket yang sudah selesai
 * diarahkan ke laporan (409). Waktu dihitung dari deadline yang tersimpan,
 * jadi refresh atau menutup halaman tidak mereset timer; subtes yang
 * waktunya habis saat halaman ditutup langsung dikumpulkan.
 */
export async function openTryout(store: PracticeStore, packageId: string, settings: PlanSettings | null): Promise<TryoutView> {
  const pkg = TRYOUT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) throw new ApiError(404, PRACTICE_SERVER_MSG.notFound);
  const now = store.now();
  const attempts = await store.loadAttempts();
  let a = attempts[packageId];
  const item = tryoutItems(pkg.exam, await store.loadLog()).find((t) => t.pkg.id === packageId)!;
  if (item.status === "done" || a?.finishedAt) throw new ApiError(409, PRACTICE_SERVER_MSG.tryoutDone);
  if (item.status === "locked") throw new ApiError(403, PRACTICE_SERVER_MSG.tryoutLocked(item.previousName ?? ""));

  if (!a) a = attempts[packageId] = newAttempt(packageId, pkg.exam, tryoutSubjects(pkg.exam, settings), now);
  const expired: string[] = [];
  while (a.current < a.sections.length) {
    const sec = a.sections[a.current];
    if (sec.deadline && now.getTime() >= new Date(sec.deadline).getTime()) {
      sec.finishedAt = sec.deadline;
      expired.push(subjectName(a.exam, sec.subject));
      a.current++;
      continue;
    }
    startSection(a, now);
    break;
  }
  if (a.current >= a.sections.length) await finalize(store, a, now);
  await store.saveAttempts(attempts);
  return tryoutView(a, pkg.name, now, expired);
}

/** Simpan jawaban dan ragu-ragu satu soal (otomatis setiap berubah). */
export async function saveTryoutAnswer(store: PracticeStore, packageId: string, questionId: string, choice: number | null, flagged: boolean): Promise<void> {
  const attempts = await store.loadAttempts();
  const a = attempts[packageId];
  if (!a || a.finishedAt) throw new ApiError(409, PRACTICE_SERVER_MSG.tryoutDone);
  const sec = a.sections[a.current];
  if (!sec || !sec.questionIds.includes(questionId)) throw new ApiError(409, PRACTICE_SERVER_MSG.sectionClosed);
  if (sec.deadline && store.now().getTime() > new Date(sec.deadline).getTime() + 2000) throw new ApiError(409, PRACTICE_SERVER_MSG.timeUp);
  if (choice === null) delete a.answers[questionId];
  else a.answers[questionId] = choice;
  a.flags = flagged ? [...new Set([...a.flags, questionId])] : a.flags.filter((id) => id !== questionId);
  await store.saveAttempts(attempts);
}

/** Selesaikan subtes yang sedang berjalan. true = seluruh tryout selesai. */
export async function finishSection(store: PracticeStore, packageId: string): Promise<boolean> {
  const attempts = await store.loadAttempts();
  const a = attempts[packageId];
  if (!a) throw new ApiError(404, PRACTICE_SERVER_MSG.notFound);
  if (a.finishedAt) return true;
  const now = store.now();
  const sec = a.sections[a.current];
  if (sec) sec.finishedAt = now.toISOString();
  a.current++;
  if (a.current >= a.sections.length) await finalize(store, a, now);
  await store.saveAttempts(attempts);
  return a.finishedAt !== null;
}

/** Laporan tryout, termasuk kunci dan pembahasan (hanya setelah selesai). */
export async function tryoutReport(store: PracticeStore, packageId: string): Promise<TryoutReport> {
  const pkg = TRYOUT_PACKAGES.find((p) => p.id === packageId);
  const a = (await store.loadAttempts())[packageId];
  if (!pkg || !a) throw new ApiError(404, PRACTICE_SERVER_MSG.noReport);
  if (!a.finishedAt) throw new ApiError(409, PRACTICE_SERVER_MSG.notFinished);
  const log = await store.loadLog();
  const result = log.tryouts.find((t) => t.packageId === packageId) ?? gradeAttempt(a, a.finishedAt);
  const earlier = tryoutItems(pkg.exam, log)
    .filter((t) => t.result && t.result.completedAt < result.completedAt)
    .sort((x, y) => x.result!.completedAt.localeCompare(y.result!.completedAt))
    .pop();
  const items = a.sections.flatMap((s) => review(s.questionIds, a.answers, a.flags)).map((it, i) => ({ ...it, no: i + 1 }));
  const timeUsedSec = a.sections.reduce((sum, s) => {
    if (!s.startedAt || !s.finishedAt) return sum;
    return sum + Math.max(0, (new Date(s.finishedAt).getTime() - new Date(s.startedAt).getTime()) / 1000);
  }, 0);
  return {
    packageId,
    name: pkg.name,
    exam: pkg.exam,
    score: result.score,
    previous: earlier?.result ? { name: earlier.pkg.name, score: earlier.result.score } : null,
    correct: items.filter((i) => i.correct).length,
    total: items.length,
    unanswered: items.filter((i) => i.choice === null).length,
    timeUsedSec: Math.round(timeUsedSec),
    completedAt: result.completedAt,
    subjects: a.sections.map((s) => {
      const qs = items.filter((i) => i.subject === s.subject);
      return {
        subject: s.subject,
        name: subjectName(a.exam, s.subject),
        correct: qs.filter((i) => i.correct).length,
        total: qs.length,
        score: result.subscores[s.subject] ?? 0,
        max: SUBSCORE_MAX[a.exam](s.subject),
      };
    }),
    items,
  };
}
