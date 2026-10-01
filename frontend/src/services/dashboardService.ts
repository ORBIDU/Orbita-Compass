import type { PracticeSummary, TimelineEvent, TodayPlan } from "@/types/dashboard";
import { mockGetPracticeSummary, mockGetTodayPlan } from "@/mocks/dashboardMock";
import { SELECTION_TIMELINE } from "@/mocks/data/timeline";
import { delay } from "@/mocks/delay";
import { USE_MOCK } from "./config";
import { getToken, request } from "./http";

/** Item GET /action-plans (hanya field yang dipakai). */
interface BackendActionPlanItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
}

/** "2026-09-30" menurut jam lokal perangkat. */
function localDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Fokus belajar dan tugas hari ini.
 * Backend: tugas diambil dari GET /action-plans yang tenggatnya hari ini.
 * Backend belum menyimpan fokus belajar dan durasi tugas (API_CONTRACT 7.1),
 * jadi keduanya kosong.
 */
export async function getTodayPlan(now = new Date()): Promise<TodayPlan> {
  if (USE_MOCK) return mockGetTodayPlan(getToken());
  const data = await request<{ items: BackendActionPlanItem[] }>("/action-plans");
  const today = localDateKey(now);
  return {
    focus: null,
    tasks: data.items
      .filter((item) => localDateKey(new Date(item.dueDate)) === today)
      .map((item) => ({ id: item.id, title: item.title, minutes: null, category: item.category, done: item.completed })),
  };
}

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
  const thisMonth = localDateKey(now).slice(0, 7);
  return SELECTION_TIMELINE.filter((e) => e.month >= thisMonth).slice(0, limit);
}
