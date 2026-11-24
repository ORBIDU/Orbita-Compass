import type { PracticeLog } from "@/types/practice";
import { readLocal } from "@/lib/localStore";
import { getToken } from "./http";

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/practiceMock");

// Penyimpanan riwayat latihan bebas dan tryout (API_CONTRACT 12.4). Dipisah
// dari practiceService supaya actionPlanService bisa membacanya tanpa saling impor.
// Endpoint /ptn/practice/* belum dipakai: soalnya mengirim kunci jawaban
// (BACKEND_MAP poin 4) dan riwayatnya belum bisa dibaca. Sementara:
// mode dummy di data dummy, mode backend di browser per akun.

export const logKey = (userId: string) => `orbidu_practice_${userId}`;

export async function getPracticeLog(userId: string): Promise<PracticeLog> {
  if (USE_MOCK) return (await mock()).mockGetPracticeLog(getToken());
  return readLocal<PracticeLog>(logKey(userId)) ?? { free: [], tryouts: [] };
}
