import type { PracticeSummary, TodayPlan } from "@/types/dashboard";
import { EMPTY_PRACTICE } from "./db";
import { requireAccount } from "./studentMock";
import { delay } from "./delay";

// Di Mode Demo, status "aktif" berarti siswa sudah punya rencana belajar dan
// riwayat latihan. Status lain menampilkan kondisi sebelum itu tanpa menghapus
// datanya, supaya bisa bolak-balik ganti status.

/** Tiruan data "Rencana hari ini" (docs/API_CONTRACT.md bagian 7.1). */
export async function mockGetTodayPlan(token: string | null): Promise<TodayPlan> {
  await delay(250);
  const account = requireAccount(token);
  if (account.status !== "aktif" || !account.studyPlan) return { focus: null, tasks: [] };
  return structuredClone(account.studyPlan);
}

/** Tiruan hasil latihan terakhir per ujian (docs/API_CONTRACT.md bagian 7.2). */
export async function mockGetPracticeSummary(token: string | null): Promise<PracticeSummary> {
  await delay(250);
  const account = requireAccount(token);
  if (account.status !== "aktif") return EMPTY_PRACTICE;
  return structuredClone(account.practice);
}
