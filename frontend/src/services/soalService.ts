import type { ExamId, PracticeLog } from "@/types/practice";
import type { CheckedAnswer, PracticeResultView, PracticeSessionView, TryoutReport, TryoutView } from "@/types/soal";
import * as server from "@/mocks/practiceServer";
import type { PracticeSession, PracticeStore, TryoutAttempt } from "@/mocks/practiceServer";
import type { PlanState } from "@/mocks/actionPlanEngine";
import { mockPracticeStore } from "@/mocks/practiceMock";
import { readLocal, writeLocal } from "@/lib/localStore";
import { getActionPlan, getPlanSettings, planKey } from "./actionPlanService";
import { logKey } from "./practiceLog";
import { USE_MOCK } from "./config";
import { getToken } from "./http";

// Latihan dan tryout (API_CONTRACT 12.5–12.6). Logika penilaian ada di
// mocks/practiceServer.ts ("server" simulasi) dan dipakai di kedua mode:
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

const store = (userId: string) => (USE_MOCK ? mockPracticeStore(getToken()) : localStore(userId));

/** Buka latihan (Action Plan atau sesi latihan bebas yang sudah ada). */
export async function openPractice(userId: string, grade: number, sessionId: string): Promise<PracticeSessionView> {
  // Membaca Action Plan dulu supaya latihan hari ini sudah "dibekukan" dan bisa ditemukan.
  if (!sessionId.startsWith("bebas-")) await getActionPlan(userId, grade);
  return server.getPractice(store(userId), sessionId);
}

/** Mulai latihan bebas satu subtes/mapel (sesi baru). */
export function startFreePractice(userId: string, exam: ExamId, subject: string): Promise<PracticeSessionView> {
  return server.startPractice(store(userId), { exam, subject });
}

/** "Cek jawaban": jawaban dikunci, kunci + pembahasan soal ini saja. */
export function checkAnswer(userId: string, sessionId: string, questionId: string, choice: number): Promise<CheckedAnswer> {
  return server.checkAnswer(store(userId), sessionId, questionId, choice);
}

/** Selesaikan latihan: memperbarui Action Plan atau riwayat latihan bebas (satu sumber, practiceService). */
export function finishPractice(userId: string, sessionId: string): Promise<void> {
  return server.finishPractice(store(userId), sessionId);
}

export async function getPracticeResult(userId: string, grade: number, sessionId: string): Promise<PracticeResultView> {
  if (!sessionId.startsWith("bebas-")) await getActionPlan(userId, grade);
  return server.practiceResult(store(userId), sessionId);
}

/** Buka tryout. 403 = paket terkunci, 409 = sudah selesai (arahkan ke laporan). */
export async function openTryout(userId: string, packageId: string): Promise<TryoutView> {
  const settings = await getPlanSettings(userId).catch(() => null);
  return server.openTryout(store(userId), packageId, settings);
}

export function saveTryoutAnswer(userId: string, packageId: string, questionId: string, choice: number | null, flagged: boolean): Promise<void> {
  return server.saveTryoutAnswer(store(userId), packageId, questionId, choice, flagged);
}

/** true = seluruh tryout selesai dan sudah dinilai. */
export function finishTryoutSection(userId: string, packageId: string): Promise<boolean> {
  return server.finishSection(store(userId), packageId);
}

export function getTryoutReport(userId: string, packageId: string): Promise<TryoutReport> {
  return server.tryoutReport(store(userId), packageId);
}
