import { COMPLETENESS } from "@/content/analisis";

/** done = lengkap, partial = sebagian, wait = menunggu pihak lain (sekolah), todo = tugas siswa. */
export type CompletenessKind = "done" | "partial" | "wait" | "todo";

export interface CompletenessItem {
  key: "test" | "rapor" | "prestasi" | "cert";
  kind: CompletenessKind;
  text: string;
  earned: number;
  max: number;
}

export interface CompletenessInput {
  sectionsDone: number;
  sectionsTotal: number;
  raporAvailable: boolean;
  achievementCount: number;
  withCertificate: number;
  /** false di mode backend: sertifikat belum bisa diunggah, jadi tidak dihitung. */
  certificateSupported: boolean;
}

/**
 * Kelengkapan profil (SPEK bagian 6): tes 40 × bagian selesai ÷ 7, rapor 30,
 * minimal satu prestasi 20, sertifikat 10 × proporsi prestasi bersertifikat.
 * Jika sertifikat belum bisa diunggah (mode backend), persentase dihitung
 * dari 90 poin sisanya.
 */
export function computeCompleteness(input: CompletenessInput): { pct: number; items: CompletenessItem[]; hint: string } {
  const { sectionsDone, sectionsTotal, raporAvailable, achievementCount, withCertificate, certificateSupported } = input;
  const items: CompletenessItem[] = [];

  const testDone = sectionsDone >= sectionsTotal;
  items.push({
    key: "test",
    kind: testDone ? "done" : sectionsDone > 0 ? "partial" : "todo",
    text: testDone ? COMPLETENESS.testDone : sectionsDone > 0 ? COMPLETENESS.testPartial(sectionsDone, sectionsTotal) : COMPLETENESS.testEmpty,
    earned: (40 * Math.min(sectionsDone, sectionsTotal)) / sectionsTotal,
    max: 40,
  });

  items.push({
    key: "rapor",
    kind: raporAvailable ? "done" : "wait",
    text: raporAvailable ? COMPLETENESS.raporDone : COMPLETENESS.raporWait,
    earned: raporAvailable ? 30 : 0,
    max: 30,
  });

  items.push({
    key: "prestasi",
    kind: achievementCount > 0 ? "done" : "todo",
    text: achievementCount > 0 ? COMPLETENESS.prestasiDone(achievementCount) : COMPLETENESS.prestasiEmpty,
    earned: achievementCount > 0 ? 20 : 0,
    max: 20,
  });

  if (certificateSupported) {
    const missing = achievementCount - withCertificate;
    items.push({
      key: "cert",
      kind: achievementCount > 0 && missing === 0 ? "done" : "todo",
      text: achievementCount === 0 ? COMPLETENESS.certEmpty : missing === 0 ? COMPLETENESS.certDone : COMPLETENESS.certMissing(missing),
      earned: achievementCount > 0 ? (10 * withCertificate) / achievementCount : 0,
      max: 10,
    });
  }

  const earned = items.reduce((sum, i) => sum + i.earned, 0);
  const max = items.reduce((sum, i) => sum + i.max, 0);
  const pct = Math.round((earned / max) * 100);

  const todo = items
    .filter((i) => i.kind === "todo" || i.kind === "partial")
    .map((i) => COMPLETENESS.hintParts[i.key as keyof typeof COMPLETENESS.hintParts])
    .filter(Boolean);
  const hint = COMPLETENESS.hint([...new Set(todo)], !raporAvailable);

  return { pct, items, hint };
}

/** "22,9" (maks. satu angka di belakang koma). */
export function formatPoints(n: number): string {
  return (Math.round(n * 10) / 10).toLocaleString("id-ID", { maximumFractionDigits: 1 });
}
