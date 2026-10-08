import { ROUTES } from "@/config/navigation";
import type { PlanCategory, PlanPractice } from "@/types/actionPlan";

/** Warna per kategori: ikon/chip, titik kalender, dan progress bar. */
export const CATEGORY_STYLE: Record<PlanCategory, { tile: string; dot: string; bar: string; card: string }> = {
  SNBT: { tile: "bg-tint-blue-bg text-tint-blue-fg", dot: "bg-orbit-1", bar: "bg-orbit-1", card: "bg-tint-blue-bg text-tint-blue-fg" },
  TKA: { tile: "bg-tint-orange-bg text-tint-orange-fg", dot: "bg-sun-1", bar: "bg-sun-1", card: "bg-tint-orange-bg text-tint-orange-fg" },
  Kedinasan: { tile: "bg-tint-purple-bg text-tint-purple-fg", dot: "bg-tint-purple-dot", bar: "bg-tint-purple-dot", card: "bg-tint-purple-bg text-tint-purple-fg" },
};

/** Tujuan tombol latihan: Kerjakan/Lanjutkan → pengerjaan, Lihat pembahasan → hasil. */
export function practiceUrl(p: PlanPractice): string {
  return p.status === "done" ? ROUTES.latihanHasil(p.id) : ROUTES.latihan(p.id);
}

export type DayStatus = "done" | "unfinished" | "today" | "scheduled";

/** Status satu tanggal di kalender. null = bukan hari belajar. */
export function dayStatusOf(date: string, list: PlanPractice[] | undefined, today: string): DayStatus | null {
  if (!list || list.length === 0) return null;
  if (date === today) return "today";
  if (date > today) return "scheduled";
  return list.every((p) => p.status === "done") ? "done" : "unfinished";
}

/** Warna sel kalender per status. */
export const DAY_STYLE: Record<DayStatus, { cell: string; chip: string; legend: string }> = {
  done: { cell: "bg-tint-green-bg text-tint-green-fg", chip: "bg-tint-green-bg text-tint-green-fg", legend: "bg-tint-green-bg" },
  unfinished: { cell: "bg-alert-bg text-alert-fg", chip: "bg-alert-bg text-alert-fg", legend: "bg-alert-bg" },
  today: { cell: "bg-orbit-1 text-white", chip: "bg-tint-blue-bg text-tint-blue-fg", legend: "bg-orbit-1" },
  scheduled: { cell: "bg-tint-amber-soft text-tint-amber-fg", chip: "bg-tint-amber-soft text-tint-amber-fg", legend: "bg-tint-amber-soft" },
};
