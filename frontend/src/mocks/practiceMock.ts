import type { PracticeLog } from "@/types/practice";
import { updateAccount, type MockAccount } from "./db";
import { requireAccount } from "./studentMock";
import { delay } from "@/lib/delay";
import type { PracticeStore } from "@/data/practiceServer";

// Tiruan penyimpanan latihan dan tryout per akun (API_CONTRACT 12.4–12.6).
// Logika "server"-nya ada di practiceServer.ts dan dipakai lewat mockPracticeStore.

export async function mockGetPracticeLog(token: string | null): Promise<PracticeLog> {
  await delay(200);
  return structuredClone(requireAccount(token).practiceLog);
}

/** PracticeStore di atas data dummy akun yang login. */
export function mockPracticeStore(token: string | null): PracticeStore {
  const account = (): MockAccount => requireAccount(token);
  const write = async (change: (a: MockAccount) => void) => {
    await delay(60);
    updateAccount(account().id, change);
  };
  const read = async <T,>(pick: (a: MockAccount) => T): Promise<T> => {
    await delay(60);
    return structuredClone(pick(account()));
  };
  return {
    now: () => new Date(),
    loadPlan: () => read((a) => a.actionPlan),
    savePlan: (state) => write((a) => void (a.actionPlan = structuredClone(state))),
    loadLog: () => read((a) => a.practiceLog),
    saveLog: (log) => write((a) => void (a.practiceLog = structuredClone(log))),
    loadSessions: () => read((a) => a.practiceSessions),
    saveSessions: (sessions) => write((a) => void (a.practiceSessions = structuredClone(sessions))),
    loadAttempts: () => read((a) => a.tryoutAttempts),
    saveAttempts: (attempts) => write((a) => void (a.tryoutAttempts = structuredClone(attempts))),
    markActive: () =>
      write((a) => {
        if (a.status === "sudah_asesmen") a.status = "aktif";
      }),
  };
}
