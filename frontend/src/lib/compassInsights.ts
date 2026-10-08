// Menyusun penjelasan halaman Compass dari data yang benar-benar ada:
// hasil Compass, skor tes, prestasi, dan rapor. Kalau datanya tidak ada,
// bagian itu kosong (tidak ada klaim tanpa sumber).

import type { Assessment, CompassAnalysis } from "@/types/backend";
import type { AchievementItem, RaporData } from "@/types/analisis";
import type { BidangKey } from "@/types/jurusan";
import type { CompassRecommendation } from "@/types/compass";
import { ASPECT_LEVEL, DIMENSION_LABEL, RECOMMENDATIONS, WHY } from "@/content/compass";
import { averageScore, formatScore } from "./rapor";

export type Dimension = keyof typeof DIMENSION_LABEL;
export const DIMENSIONS: Dimension[] = ["technology", "research", "creativity", "leadership", "communication"];

// ─── Aturan pencocokan (SEMENTARA, sederhana dan bisa dijelaskan) ───────────

/** Dimensi minat yang paling dekat dengan tiap bidang jurusan. */
const BIDANG_DIMENSION: Record<BidangKey, Dimension> = {
  teknologi: "technology",
  sains: "research",
  kesehatan: "research",
  teknik: "technology",
  ekonomi: "leadership",
  hukum: "communication",
  sosial: "communication",
  pendidikan: "communication",
  desain: "creativity",
  pertanian: "research",
  kedinasan: "leadership",
};

/** Mapel pendukung bawaan per bidang, dipakai jika katalog jurusan belum mengisinya. */
const BIDANG_SUBJECTS: Record<BidangKey, string[]> = {
  teknologi: ["Matematika", "Informatika"],
  sains: ["Matematika", "Fisika"],
  kesehatan: ["Biologi", "Kimia"],
  teknik: ["Matematika", "Fisika"],
  ekonomi: ["Matematika", "Ekonomi"],
  hukum: ["Pendidikan Pancasila", "Bahasa Indonesia"],
  sosial: ["Sosiologi", "Bahasa Indonesia"],
  pendidikan: ["Bahasa Indonesia", "Bahasa Inggris"],
  desain: ["Seni Budaya", "Informatika"],
  pertanian: ["Biologi", "Kimia"],
  kedinasan: ["Pendidikan Pancasila", "Bahasa Indonesia"],
};

/** Kata kunci judul prestasi yang dianggap berhubungan dengan bidang. */
const BIDANG_KEYWORDS: Record<BidangKey, string[]> = {
  teknologi: ["informatika", "komputer", "hackathon", "coding", "robot", "programming", "aplikasi", "teknologi"],
  sains: ["matematika", "statistika", "sains", "fisika", "data", "olimpiade"],
  kesehatan: ["biologi", "kesehatan", "kimia", "pmr", "medis"],
  teknik: ["fisika", "robot", "teknik", "rekayasa", "matematika"],
  ekonomi: ["ekonomi", "bisnis", "akuntansi", "wirausaha", "usaha"],
  hukum: ["debat", "hukum", "pancasila", "konstitusi"],
  sosial: ["debat", "sosial", "relawan", "osis", "pidato", "jurnalis"],
  pendidikan: ["mengajar", "pidato", "bahasa", "osis"],
  desain: ["desain", "seni", "lukis", "fotografi", "film", "musik"],
  pertanian: ["pertanian", "lingkungan", "biologi"],
  kedinasan: ["paskibra", "pramuka", "osis", "kepemimpinan"],
};

const SUBJECT_ALIASES: Record<string, string[]> = {
  "pendidikan pancasila": ["pendidikan pancasila", "ppkn", "pkn"],
  ppkn: ["pendidikan pancasila", "ppkn", "pkn"],
};

const LEVEL_RANK: Record<string, number> = { Internasional: 5, Nasional: 4, Provinsi: 3, "Kota/Kabupaten": 2, Sekolah: 1 };

const norm = (s: string) => s.toLowerCase().trim();

function subjectMatches(raporSubject: string, wanted: string): boolean {
  const r = norm(raporSubject);
  // Mapel "tingkat lanjut" tidak ikut dihitung sebagai mapel dasarnya.
  if (r.includes("tingkat lanjut")) return false;
  return (SUBJECT_ALIASES[norm(wanted)] ?? [norm(wanted)]).some((w) => r === w || r.startsWith(`${w} `));
}

function relatedAchievements(bidang: BidangKey, achievements: AchievementItem[]): AchievementItem[] {
  const words = BIDANG_KEYWORDS[bidang];
  return achievements
    .filter((a) => words.some((w) => norm(a.title).includes(w)))
    .sort((a, b) => (LEVEL_RANK[b.level] ?? 0) - (LEVEL_RANK[a.level] ?? 0));
}

/** Dimensi tes diurutkan dari skor tertinggi. */
export function rankedDimensions(assessment: Assessment | null): Dimension[] {
  if (!assessment) return [];
  return [...DIMENSIONS].sort((a, b) => assessment[b] - assessment[a]);
}

/** Semester terakhir yang sudah punya nilai. */
function latestSemester(rapor: RaporData | null) {
  const filled = rapor?.semesters.filter((s) => s.subjects.length > 0) ?? [];
  return { filled, latest: filled[filled.length - 1] ?? null };
}

// ─── Aspek di hero (label + 5 bar, tanpa persen) ────────────────────────────

export interface Aspect {
  key: "minat" | "akademik" | "prestasi";
  label: string;
  /** Jumlah bar terisi (0–5). */
  level: number;
}

function levelLabel(level: number): string {
  return ASPECT_LEVEL[Math.max(2, Math.min(5, level)) as 2 | 3 | 4 | 5];
}

export function buildAspects(
  analysis: CompassAnalysis,
  topBidang: BidangKey | null,
  rapor: RaporData | null,
  achievements: AchievementItem[],
): Aspect[] {
  // Minat: keselarasan minat dari hasil Compass (berbasis tes).
  const interest = analysis.interestAlignmentPct;
  const minatLevel = interest >= 85 ? 5 : interest >= 70 ? 4 : interest >= 55 ? 3 : 2;

  // Akademik: rata-rata mapel pendukung bidang teratas di semester terakhir.
  const { latest } = latestSemester(rapor);
  let akademik: Aspect;
  if (!latest) {
    akademik = { key: "akademik", label: ASPECT_LEVEL.waitingRapor, level: 0 };
  } else {
    const wanted = topBidang ? BIDANG_SUBJECTS[topBidang] : [];
    const support = latest.subjects.filter((s) => wanted.some((w) => subjectMatches(s.subject, w)));
    const avg = averageScore(support.length ? support : latest.subjects) ?? 0;
    const lvl = avg >= 90 ? 5 : avg >= 85 ? 4 : avg >= 78 ? 3 : 2;
    akademik = { key: "akademik", label: levelLabel(lvl), level: lvl };
  }

  // Prestasi: prestasi yang berhubungan dengan bidang teratas, menurut tingkatnya.
  let prestasi: Aspect;
  if (achievements.length === 0) {
    prestasi = { key: "prestasi", label: ASPECT_LEVEL.noAchievement, level: 0 };
  } else {
    const related = topBidang ? relatedAchievements(topBidang, achievements) : [];
    const best = related[0] ? (LEVEL_RANK[related[0].level] ?? 1) : 0;
    if (best === 0) prestasi = { key: "prestasi", label: ASPECT_LEVEL.unrelatedAchievement, level: 1 };
    else {
      const lvl = best >= 4 ? 5 : best === 3 ? 4 : 3;
      prestasi = { key: "prestasi", label: levelLabel(lvl), level: lvl };
    }
  }

  return [{ key: "minat", label: levelLabel(minatLevel), level: minatLevel }, akademik, prestasi];
}

// ─── Chip alasan per jurusan ─────────────────────────────────────────────────

export type WhyKind = "minat" | "rapor" | "prestasi" | "compass";
export interface WhyChip {
  kind: WhyKind;
  text: string;
}

/**
 * Maksimal 3 alasan untuk satu jurusan. Setiap alasan hanya muncul kalau
 * datanya mendukung; jurusan di luar katalog memakai alasan dari Compass.
 */
export function whyChips(
  rec: CompassRecommendation,
  supportingSubjects: string[],
  assessment: Assessment | null,
  rapor: RaporData | null,
  achievements: AchievementItem[],
): WhyChip[] {
  if (!rec.bidang) return rec.rationale ? [{ kind: "compass", text: rec.rationale }] : [];
  const chips: WhyChip[] = [];

  const dims = rankedDimensions(assessment);
  const dim = BIDANG_DIMENSION[rec.bidang];
  if (dims[0] === dim) chips.push({ kind: "minat", text: RECOMMENDATIONS.why.minatTop(DIMENSION_LABEL[dim]) });
  else if (dims[1] === dim) chips.push({ kind: "minat", text: RECOMMENDATIONS.why.minatSecond(DIMENSION_LABEL[dim]) });

  const { filled, latest } = latestSemester(rapor);
  if (latest) {
    const wanted = supportingSubjects.length ? supportingSubjects : BIDANG_SUBJECTS[rec.bidang];
    const candidates = latest.subjects
      .filter((s) => wanted.some((w) => subjectMatches(s.subject, w)))
      .sort((a, b) => b.score - a.score);
    const best = candidates[0];
    if (best) {
      const series = filled.map((sem) => sem.subjects.find((s) => s.subject === best.subject)?.score).filter((v): v is number => v !== undefined);
      const rising = series.length >= 3 && series.every((v, i) => i === 0 || v > series[i - 1]);
      if (rising) chips.push({ kind: "rapor", text: RECOMMENDATIONS.why.raporRising(best.subject) });
      else if (best.score >= 85) chips.push({ kind: "rapor", text: RECOMMENDATIONS.why.raporHigh(best.subject, best.score, latest.semester) });
    }
  }

  const related = relatedAchievements(rec.bidang, achievements)[0];
  if (related) chips.push({ kind: "prestasi", text: RECOMMENDATIONS.why.prestasi(related.title, related.level) });

  return chips.slice(0, 3);
}

// ─── Kolom "Kenapa ORBIDU merekomendasikan ini" ─────────────────────────────

export interface WhyColumns {
  tes: string[];
  prestasi: string[];
  rapor: string[];
}

export function buildWhyColumns(assessment: Assessment | null, rapor: RaporData | null, achievements: AchievementItem[]): WhyColumns {
  const tes: string[] = [];
  const dims = rankedDimensions(assessment);
  if (assessment && dims.length === 5) {
    tes.push(WHY.tesTop(DIMENSION_LABEL[dims[0]], DIMENSION_LABEL[dims[1]]));
    if (assessment[dims[2]] >= 60) tes.push(WHY.tesThird(DIMENSION_LABEL[dims[2]]));
    tes.push(WHY.tesLowest(DIMENSION_LABEL[dims[4]]));
  }

  const prestasi = [...achievements]
    .sort((a, b) => (LEVEL_RANK[b.level] ?? 0) - (LEVEL_RANK[a.level] ?? 0) || b.year - a.year)
    .slice(0, 3)
    .map((a) => WHY.prestasiItem(a.rank, a.title, a.level));

  const raporLines: string[] = [];
  const { filled, latest } = latestSemester(rapor);
  if (latest) {
    const sorted = [...latest.subjects].sort((a, b) => b.score - a.score);
    if (sorted.length >= 2) raporLines.push(WHY.raporTop(sorted[0].subject, sorted[0].score, sorted[1].subject, sorted[1].score, latest.semester));
    const avgs = filled.map((s) => averageScore(s.subjects) ?? 0);
    let rising = 0;
    for (let i = avgs.length - 1; i > 0 && avgs[i] > avgs[i - 1]; i--) rising++;
    if (rising >= 2) raporLines.push(WHY.raporRising(rising + 1));
    else raporLines.push(WHY.raporAverage(formatScore(avgs[avgs.length - 1]), latest.semester));
    const lowest = sorted[sorted.length - 1];
    if (lowest && sorted.length >= 3) raporLines.push(WHY.raporLowest(lowest.subject, lowest.score));
  }

  return { tes, prestasi, rapor: raporLines };
}
