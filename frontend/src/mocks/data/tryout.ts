import type { ExamId, PracticeLog, TryoutPackage } from "@/types/practice";

// CONTOH DATA paket tryout. Paket terbuka berurutan: paket berikutnya terbuka
// setelah paket sebelumnya selesai. Isi soal ada di mocks/data/soal/ (Tahap 7C).

const NAMES: Record<ExamId, string[]> = {
  snbt: ["Tryout Diagnostik", "Tryout #1", "Tryout #2", "Tryout #3", "Tryout #4"],
  tka: ["Tryout Diagnostik", "Tryout #1", "Tryout #2", "Tryout #3"],
  skd: ["Tryout Diagnostik", "Tryout #1", "Tryout #2", "Tryout #3"],
};

export const TRYOUT_PACKAGES: TryoutPackage[] = (Object.keys(NAMES) as ExamId[]).flatMap((exam) =>
  NAMES[exam].map((name, order) => ({ id: `${exam}-to-${order}`, exam, name, order })),
);

/**
 * Riwayat contoh akun demo siswa (fokus SNBT + TKA), sesuai desain
 * Portal-SiapUjian.dc.html. Skor SNBT Tryout #1 sama dengan radar Dashboard.
 */
export const DEMO_PRACTICE_LOG: PracticeLog = {
  free: [],
  tryouts: [
    {
      packageId: "snbt-to-0",
      exam: "snbt",
      score: 606,
      subscores: { PU: 670, PPU: 630, PBM: 600, PK: 620, LBI: 590, LBE: 500, PM: 632 },
      completedAt: "2026-09-01T09:00:00.000Z",
    },
    {
      packageId: "snbt-to-1",
      exam: "snbt",
      score: 624,
      subscores: { PU: 690, PPU: 650, PBM: 610, PK: 640, LBI: 600, LBE: 520, PM: 660 },
      completedAt: "2026-09-26T09:00:00.000Z",
    },
    {
      packageId: "tka-to-0",
      exam: "tka",
      score: 68,
      subscores: { Matematika: 74, "Bahasa Indonesia": 76, "Bahasa Inggris": 60, "Matematika Tingkat Lanjut": 68, Fisika: 62 },
      completedAt: "2026-09-06T09:00:00.000Z",
    },
    {
      packageId: "tka-to-1",
      exam: "tka",
      score: 72,
      subscores: { Matematika: 80, "Bahasa Indonesia": 78, "Bahasa Inggris": 66, "Matematika Tingkat Lanjut": 72, Fisika: 64 },
      completedAt: "2026-09-20T09:00:00.000Z",
    },
  ],
};

export const EMPTY_PRACTICE_LOG: PracticeLog = { free: [], tryouts: [] };
