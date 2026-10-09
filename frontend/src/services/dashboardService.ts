import type { TimelineEvent } from "@/types/dashboard";
import { toDateKey } from "@/lib/datetime";
import { SELECTION_TIMELINE } from "@/data/timeline";
import { delay } from "@/lib/delay";

/**
 * Timeline seleksi mulai bulan ini (maks. `limit` agenda). Jadwal perkiraan,
 * selalu dari data contoh karena belum ada endpoint (API_CONTRACT 7.3).
 */
export async function getSelectionTimeline(now = new Date(), limit = 5): Promise<TimelineEvent[]> {
  await delay(100);
  const thisMonth = toDateKey(now).slice(0, 7);
  return SELECTION_TIMELINE.filter((e) => e.month >= thisMonth).slice(0, limit);
}
