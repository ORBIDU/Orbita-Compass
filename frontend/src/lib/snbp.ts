// Bantuan Siap SNBP: ringkasan rapor semester 1–5 dan isi awal pilihan 1.

import type { RaporData } from "@/types/analisis";
import type { CompassTarget } from "@/types/compass";
import type { SnbpCampus, SnbpChoice } from "@/types/snbp";
import { catalogForProdi } from "@/services/jurusanService";
import { averageScore } from "./rapor";

/** Semester yang dipakai SNBP. */
export const SNBP_SEMESTERS = [1, 2, 3, 4, 5];

export interface RaporSummary {
  /** Rata-rata per semester 1–5; null = belum ada nilainya. */
  perSemester: { semester: number; average: number | null }[];
  available: { semester: number; average: number }[];
  missing: number[];
  /** Rata-rata semua semester yang ada. null = rapor kosong. */
  average: number | null;
  /** Rata-rata per mapel dari semester yang ada. */
  subjects: Record<string, number>;
}

export function summarizeRapor(rapor: RaporData | null): RaporSummary {
  const perSemester = SNBP_SEMESTERS.map((semester) => {
    const sem = rapor?.semesters.find((s) => s.semester === semester);
    // Nilai 0 dipakai seed untuk mapel yang belum diambil di semester itu.
    const scores = (sem?.subjects ?? []).filter((s) => s.score > 0);
    return { semester, average: averageScore(scores) };
  });
  const available = perSemester.filter((s): s is { semester: number; average: number } => s.average !== null);
  const sums = new Map<string, number[]>();
  for (const sem of rapor?.semesters ?? []) {
    if (sem.semester > 5) continue;
    for (const s of sem.subjects) if (s.score > 0) sums.set(s.subject, [...(sums.get(s.subject) ?? []), s.score]);
  }
  const subjects: Record<string, number> = {};
  for (const [subject, list] of sums) subjects[subject] = list.reduce((a, b) => a + b, 0) / list.length;
  return {
    perSemester,
    available,
    missing: perSemester.filter((s) => s.average === null).map((s) => s.semester),
    average: available.length ? available.reduce((a, s) => a + s.average, 0) / available.length : null,
    subjects,
  };
}

export type ChoiceSource = "profile" | "compass";

/**
 * Isi awal pilihan 1: target prodi di profil → target jurusan Compass
 * (kampus pertama yang membukanya) → kosong.
 */
export function defaultFirstChoice(
  campuses: SnbpCampus[],
  profileTarget: { universityId: string | null; majorId: string | null },
  compassTarget: CompassTarget | null,
): { choice: SnbpChoice; source: ChoiceSource } | null {
  const { universityId, majorId } = profileTarget;
  if (universityId && majorId && campuses.some((c) => c.id === universityId && c.majors.some((m) => m.id === majorId))) {
    return { choice: { universityId, majorId }, source: "profile" };
  }
  if (compassTarget?.slug) {
    for (const campus of campuses) {
      const major = campus.majors.find((m) => catalogForProdi(m.name)?.slug === compassTarget.slug);
      if (major) return { choice: { universityId: campus.id, majorId: major.id }, source: "compass" };
    }
  }
  return null;
}
