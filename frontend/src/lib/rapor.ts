import type { AcademicRecord } from "@/types/backend";
import type { RaporData, RaporSemester } from "@/types/analisis";

// Backend hanya menyimpan nomor semester per nilai, tanpa kelas dan tahun
// ajaran (API_CONTRACT 8.2). Keduanya dihitung dari kelas siswa sekarang:
// tahun ajaran mulai Juli; semester ganjil Juli–Desember, genap Januari–Juni.

const JULY = 6;

/** Tahun awal tahun ajaran yang sedang berjalan, mis. 2026 untuk 2026/2027. */
function schoolYearStart(now: Date): number {
  return now.getMonth() >= JULY ? now.getFullYear() : now.getFullYear() - 1;
}

/** Semester yang sedang berjalan (1–6) untuk siswa kelas `grade`. */
export function currentSemester(grade: number, now: Date): number {
  const sem = (grade - 10) * 2 + (now.getMonth() >= JULY ? 1 : 2);
  return Math.min(6, Math.max(1, sem));
}

export function gradeOfSemester(semester: number): number {
  return 10 + Math.floor((semester - 1) / 2);
}

/** Menyusun nilai per semester. Semester berjalan yang belum ada nilainya ditandai `ongoing`. */
export function buildRapor(records: AcademicRecord[], grade: number, now: Date): RaporData {
  if (records.length === 0) return { semesters: [], updatedAt: null };

  const current = currentSemester(grade, now);
  const lastWithScores = Math.max(...records.map((r) => r.semester));
  const lastShown = Math.min(6, Math.max(current, lastWithScores));
  const thisYear = schoolYearStart(now);

  const semesters: RaporSemester[] = [];
  for (let semester = 1; semester <= lastShown; semester++) {
    const semGrade = gradeOfSemester(semester);
    const start = thisYear - (grade - semGrade);
    const subjects = records
      .filter((r) => r.semester === semester)
      .map((r) => ({ subject: r.subject, score: r.score }));
    semesters.push({
      semester,
      term: semester % 2 === 1 ? "Ganjil" : "Genap",
      grade: semGrade,
      schoolYear: `${start}/${start + 1}`,
      subjects,
      ongoing: subjects.length === 0 && semester === current,
    });
  }

  const updatedAt = records.reduce((latest, r) => (r.createdAt > latest ? r.createdAt : latest), records[0].createdAt);
  return { semesters, updatedAt };
}

export function averageScore(subjects: { score: number }[]): number | null {
  if (subjects.length === 0) return null;
  return subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length;
}

/** "86,0" (satu angka di belakang koma, format Indonesia). */
export function formatScore(value: number): string {
  return value.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** "semester 1 sampai 4" / "semester 5" */
export function semesterRange(semesters: number[]): string {
  if (semesters.length === 0) return "";
  if (semesters.length === 1) return `semester ${semesters[0]}`;
  return `semester ${semesters[0]} sampai ${semesters[semesters.length - 1]}`;
}
