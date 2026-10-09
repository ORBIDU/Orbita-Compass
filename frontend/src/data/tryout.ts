import type { ExamId, PracticeLog, TryoutItem, TryoutPackage, TryoutResult } from "@/types/practice";

// Sementara, dipakai juga di mode backend sampai endpoint paket tryout (API_CONTRACT 12.4) ada.
//
// CONTOH DATA paket tryout. Paket terbuka berurutan: paket berikutnya terbuka
// setelah paket sebelumnya selesai. Semua paket contoh memakai soal yang sama
// (src/data/soal); bank resmi harus punya soal berbeda per paket.

const NAMES: Record<ExamId, string[]> = {
  snbt: ["Tryout Diagnostik", "Tryout #1", "Tryout #2", "Tryout #3", "Tryout #4"],
  tka: ["Tryout Diagnostik", "Tryout #1", "Tryout #2", "Tryout #3"],
  skd: ["Tryout Diagnostik", "Tryout #1", "Tryout #2", "Tryout #3"],
};

export const TRYOUT_PACKAGES: TryoutPackage[] = (Object.keys(NAMES) as ExamId[]).flatMap((exam) =>
  NAMES[exam].map((name, order) => ({ id: `${exam}-to-${order}`, exam, name, order })),
);

export const EMPTY_PRACTICE_LOG: PracticeLog = { free: [], tryouts: [] };

const byDate = (a: TryoutResult, b: TryoutResult) => a.completedAt.localeCompare(b.completedAt);

/** Status paket tryout berurutan: selesai → paket pertama yang belum selesai terbuka → sisanya terkunci. */
export function tryoutItems(exam: ExamId, log: PracticeLog): TryoutItem[] {
  const packages = TRYOUT_PACKAGES.filter((p) => p.exam === exam).sort((a, b) => a.order - b.order);
  let openGiven = false;
  return packages.map((pkg, i) => {
    const result = log.tryouts.filter((t) => t.packageId === pkg.id).sort(byDate).pop() ?? null;
    let status: TryoutItem["status"] = "locked";
    if (result) status = "done";
    else if (!openGiven) {
      status = "open";
      openGiven = true;
    }
    return { pkg, status, result, previousName: i > 0 ? packages[i - 1].name : null };
  });
}
