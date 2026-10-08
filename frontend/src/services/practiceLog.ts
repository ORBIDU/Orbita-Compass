import type { PracticeLog } from "@/types/practice";
import { mockGetPracticeLog } from "@/mocks/practiceMock";
import { readLocal } from "@/lib/localStore";
import { USE_MOCK } from "./config";
import { getToken } from "./http";

// Penyimpanan riwayat latihan bebas dan tryout (API_CONTRACT 12.4). Dipisah
// dari practiceService supaya actionPlanService bisa membacanya tanpa saling impor.
// Endpoint /ptn/practice/* belum dipakai: soalnya mengirim kunci jawaban
// (BACKEND_MAP poin 4) dan riwayatnya belum bisa dibaca. Sementara:
// mode dummy di data dummy, mode backend di browser per akun.

export const logKey = (userId: string) => `orbita_practice_${userId}`;

export async function getPracticeLog(userId: string): Promise<PracticeLog> {
  if (USE_MOCK) return mockGetPracticeLog(getToken());
  return readLocal<PracticeLog>(logKey(userId)) ?? { free: [], tryouts: [] };
}
