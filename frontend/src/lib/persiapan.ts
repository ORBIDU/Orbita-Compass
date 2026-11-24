// Aturan relevansi Siap SKD, ditulis sekali dan dipakai di menu Persiapan,
// baris SKD kartu Performa Dashboard, dan "Langkah selanjutnya" Compass.

import type { PlanCategory } from "@/types/actionPlan";
import type { BidangKey } from "@/types/jurusan";

/** Siap SKD relevan jika Compass merekomendasikan jurusan Kedinasan atau fokus Action Plan berisi Kedinasan. */
export function isSkdRelevant(recommendations: { bidang: BidangKey | null }[], planFocus: PlanCategory[]): boolean {
  return recommendations.some((r) => r.bidang === "kedinasan") || planFocus.includes("Kedinasan");
}

/** Nama event yang dikirim saat rencana Action Plan berubah (relevansi SKD perlu dihitung ulang). */
export const PLAN_CHANGED_EVENT = "orbidu:plan-changed";
