import type { PracticeLog } from "@/types/practice";
import { updateAccount } from "./db";
import { requireAccount } from "./studentMock";
import { delay } from "./delay";
import { EMPTY_PRACTICE_LOG } from "./data/tryout";

// Tiruan riwayat latihan bebas dan tryout (docs/API_CONTRACT.md bagian 12.4).
// Di Mode Demo, status "aktif" = sudah punya riwayat latihan/tryout; status
// lain menampilkan kondisi sebelum itu tanpa menghapus datanya.

export async function mockGetPracticeLog(token: string | null): Promise<PracticeLog> {
  await delay(200);
  const account = requireAccount(token);
  if (account.status !== "aktif") return structuredClone(EMPTY_PRACTICE_LOG);
  return structuredClone(account.practiceLog);
}

export async function mockSavePracticeLog(token: string | null, log: PracticeLog): Promise<void> {
  await delay(100);
  const account = requireAccount(token);
  updateAccount(account.id, (a) => {
    a.practiceLog = structuredClone(log);
  });
}
