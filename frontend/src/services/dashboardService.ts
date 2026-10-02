import type { PracticeSummary, TimelineEvent } from "@/types/dashboard";
import { mockGetPracticeSummary } from "@/mocks/dashboardMock";
import { toDateKey } from "@/lib/datetime";
import { SELECTION_TIMELINE } from "@/mocks/data/timeline";
import { delay } from "@/mocks/delay";
import { USE_MOCK } from "./config";
import { getToken } from "./http";

/**
 * Hasil latihan/tryout terakhir untuk SNBT, TKA, dan SKD.
 * Backend belum punya endpoint riwayat latihan (API_CONTRACT 7.2), jadi di
 * mode backend selalu kosong dan kartu Performa tampil sebagai empty state.
 */
export async function getPracticeSummary(): Promise<PracticeSummary> {
  if (USE_MOCK) return mockGetPracticeSummary(getToken());
  return { snbt: null, tka: null, skd: null };
}

/**
 * Timeline seleksi mulai bulan ini (maks. `limit` agenda). Jadwal perkiraan,
 * selalu dari data contoh karena belum ada endpoint (API_CONTRACT 7.3).
 */
export async function getSelectionTimeline(now = new Date(), limit = 5): Promise<TimelineEvent[]> {
  await delay(100);
  const thisMonth = toDateKey(now).slice(0, 7);
  return SELECTION_TIMELINE.filter((e) => e.month >= thisMonth).slice(0, limit);
}
