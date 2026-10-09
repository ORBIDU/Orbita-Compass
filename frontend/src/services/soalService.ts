import type { ExamId, PracticeLog } from "@/types/practice";
import type { CheckedAnswer, PracticeResultView, PracticeSessionView, TryoutReport, TryoutView } from "@/types/soal";
import * as server from "@/data/practiceServer";
import type { PracticeSession, PracticeStore, TryoutAttempt } from "@/data/practiceServer";
import type { PlanState } from "@/data/actionPlanEngine";
import { readLocal, writeLocal } from "@/lib/localStore";
import { getActionPlan, getPlanSettings, planKey } from "./actionPlanService";
import { logKey } from "./practiceLog";
import { getToken } from "./http";

// Latihan dan tryout (API_CONTRACT 12.5–12.6). Logika penilaian ada di
// data/practiceServer.ts ("server" simulasi) dan dipakai di kedua mode:
// - mode dummy: disimpan di data dummy akun;
// - mode backend: disimpan di browser per akun, sampai endpoint tersedia.
// Halaman hanya menerima soal tanpa kunci (PublicQuestion).

function localStore(userId: string): PracticeStore {
  const sessionsKey = `orbita_sessions_${userId}`;
  const attemptsKey = `orbita_attempts_${userId}`;
  return {
    now: () => new Date(),
    loadPlan: async () => readLocal<PlanState>(planKey(userId)),
    savePlan: async (s) => writeLocal(planKey(userId), s),
    loadLog: async () => readLocal<PracticeLog>(logKey(userId)) ?? { free: [], tryouts: [] },
    saveLog: async (l) => writeLocal(logKey(userId), l),
    loadSessions: async () => readLocal<Record<string, PracticeSession>>(sessionsKey) ?? {},
    saveSessions: async (s) => writeLocal(sessionsKey, s),
    loadAttempts: async () => readLocal<Record<string, TryoutAttempt>>(attemptsKey) ?? {},
    saveAttempts: async (a) => writeLocal(attemptsKey, a),
    // Status siswa di backend diturunkan dari data backend (studentService).
    markActive: async () => undefined,
  };
}

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/practiceMock");

async function store(userId: string): Promise<PracticeStore> {
  if (USE_MOCK) return (await mock()).mockPracticeStore(getToken());
  return localStore(userId);
}

/** Buka latihan (Action Plan atau sesi latihan bebas yang sudah ada). */
export async function openPractice(userId: string, grade: number, sessionId: string): Promise<PracticeSessionView> {
  // Membaca Action Plan dulu supaya latihan hari ini sudah "dibekukan" dan bisa ditemukan.
  if (!sessionId.startsWith("bebas-")) await getActionPlan(userId, grade);
  return server.getPractice(await store(userId), sessionId);
}

/** Mulai latihan bebas satu subtes/mapel (sesi baru). */
export async function startFreePractice(userId: string, exam: ExamId, subject: string): Promise<PracticeSessionView> {
  return server.startPractice(await store(userId), { exam, subject });
}

/** "Cek jawaban": jawaban dikunci, kunci + pembahasan soal ini saja. */
export async function checkAnswer(userId: string, sessionId: string, questionId: string, choice: number): Promise<CheckedAnswer> {
  return server.checkAnswer(await store(userId), sessionId, questionId, choice);
}

/** Selesaikan latihan: memperbarui Action Plan atau riwayat latihan bebas (satu sumber, practiceService). */
export async function finishPractice(userId: string, sessionId: string): Promise<void> {
  return server.finishPractice(await store(userId), sessionId);
}

export async function getPracticeResult(userId: string, grade: number, sessionId: string): Promise<PracticeResultView> {
  if (!sessionId.startsWith("bebas-")) await getActionPlan(userId, grade);
  return server.practiceResult(await store(userId), sessionId);
}

/** Buka tryout. 403 = paket terkunci, 409 = sudah selesai (arahkan ke laporan). */
export async function openTryout(userId: string, packageId: string): Promise<TryoutView> {
  const settings = await getPlanSettings(userId).catch(() => null);
  return server.openTryout(await store(userId), packageId, settings);
}

export async function saveTryoutAnswer(userId: string, packageId: string, questionId: string, choice: number | null, flagged: boolean): Promise<void> {
  return server.saveTryoutAnswer(await store(userId), packageId, questionId, choice, flagged);
}

/** true = seluruh tryout selesai dan sudah dinilai. */
export async function finishTryoutSection(userId: string, packageId: string): Promise<boolean> {
  return server.finishSection(await store(userId), packageId);
}

export async function getTryoutReport(userId: string, packageId: string): Promise<TryoutReport> {
  return server.tryoutReport(await store(userId), packageId);
}
