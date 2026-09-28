import type { AlignmentStatus, Assessment, CompassAnalysis, CompassAnalyzeResponse, CompassResultResponse } from "@/types/backend";
import { ApiError } from "@/services/http";
import { updateAccount } from "./db";
import { MOCK_MAJORS, MOCK_UNIVERSITIES } from "./data/ptn";
import { requireAccount } from "./studentMock";
import { aiDelay, delay } from "./delay";

// SIMULASI AI. Aturan sederhana pengganti POST /compass/analyze:
// dimensi minat bakat tertinggi → rumpun jurusan, rata-rata rapor →
// keselarasan kompetensi, jumlah prestasi → tambahan keyakinan.
// Versi lengkapnya dikerjakan di Fase 5.

type Dimension = keyof Pick<Assessment, "technology" | "research" | "creativity" | "leadership" | "communication">;

const DIMENSION_LABEL: Record<Dimension, string> = {
  technology: "Teknologi",
  research: "Riset & Analisis",
  creativity: "Kreativitas",
  leadership: "Kepemimpinan",
  communication: "Komunikasi",
};

// Nama jurusan harus sama persis dengan data kampus dummy.
const DIMENSION_MAJORS: Record<Dimension, string[]> = {
  technology: ["Teknik Informatika / Ilmu Komputer", "Sistem Informasi", "Teknik Elektro"],
  research: ["Sains Data & Data Science", "Kedokteran (Pendidikan Dokter)", "Psikologi"],
  creativity: ["Ilmu Komunikasi", "Sistem Informasi", "Teknik Sipil"],
  leadership: ["Manajemen", "Ilmu Hukum", "Akuntansi"],
  communication: ["Ilmu Komunikasi", "Psikologi", "Ilmu Hukum"],
};

const DIMENSION_CAREERS: Record<Dimension, { title: string; skills: string[] }> = {
  technology: { title: "Software Engineer", skills: ["Pemrograman", "Logika", "Problem Solving"] },
  research: { title: "Data Analyst", skills: ["Statistika", "Analisis Data", "Riset"] },
  creativity: { title: "Content Strategist", skills: ["Kreativitas", "Menulis", "Desain"] },
  leadership: { title: "Business Manager", skills: ["Kepemimpinan", "Negosiasi", "Perencanaan"] },
  communication: { title: "Public Relations", skills: ["Komunikasi", "Presentasi", "Empati"] },
};

const round1 = (n: number) => Math.round(n * 10) / 10;

function analyze(assessment: Assessment, raporScores: number[], achievementCount: number, profileId: string): CompassAnalysis {
  const dims = (Object.keys(DIMENSION_LABEL) as Dimension[]).sort((a, b) => assessment[b] - assessment[a]);
  const [top1, top2] = dims;

  const interest = round1((assessment[top1] + assessment[top2]) / 2);
  const raporAvg = raporScores.length ? raporScores.reduce((s, n) => s + n, 0) / raporScores.length : null;
  // Tanpa rapor, kompetensi hanya diperkirakan dari rata-rata tes (ditandai di ringkasan).
  const competency = round1(
    raporAvg ?? dims.reduce((s, d) => s + assessment[d], 0) / dims.length,
  );
  const confidence = round1(Math.min(100, interest * 0.45 + competency * 0.45 + Math.min(achievementCount, 3) * 3.3));
  const status: AlignmentStatus = confidence >= 80 ? "ALIGNED" : confidence >= 65 ? "PARTIAL" : "MISALIGNED";

  const majorNames = [...new Set([...DIMENSION_MAJORS[top1], ...DIMENSION_MAJORS[top2]])].slice(0, 5);
  const recommendedMajors = majorNames.map((name, i) => ({
    name,
    match_pct: round1(Math.max(50, confidence - i * 3)),
    rationale: `Sesuai dengan minat ${DIMENSION_LABEL[i < 3 ? top1 : top2].toLowerCase()} kamu.`,
  }));

  const univIds = new Set(MOCK_MAJORS.filter((m) => majorNames.includes(m.name)).map((m) => m.universityId));
  const recommendedUnivs = MOCK_UNIVERSITIES.filter((u) => univIds.has(u.id))
    .slice(0, 3)
    .map((u) => ({ name: u.name, city: u.city, accreditation: u.accreditation }));

  const recommendedCareers = [top1, top2].map((d) => ({
    title: DIMENSION_CAREERS[d].title,
    description: `Karier yang memakai kekuatan ${DIMENSION_LABEL[d].toLowerCase()}.`,
    skills_required: DIMENSION_CAREERS[d].skills,
    growth_potential: "Tinggi",
  }));

  const raporNote = raporAvg === null ? " Nilai rapor belum ada, jadi kompetensi baru diperkirakan dari hasil tes." : "";

  return {
    id: `compass-${profileId}-${Date.now().toString(36)}`,
    profileId,
    confidenceScore: confidence,
    interestAlignmentPct: interest,
    competencyAlignmentPct: competency,
    careerAlignmentStatus: status,
    aiSummary: `Kekuatan utamamu ada di ${DIMENSION_LABEL[top1].toLowerCase()} dan ${DIMENSION_LABEL[top2].toLowerCase()}.${raporNote} (Simulasi mode dummy.)`,
    topStrengths: JSON.stringify([DIMENSION_LABEL[top1], DIMENSION_LABEL[top2]]),
    recommendedMajors: JSON.stringify(recommendedMajors),
    recommendedUnivs: JSON.stringify(recommendedUnivs),
    recommendedCareers: JSON.stringify(recommendedCareers),
    analyzedAt: new Date().toISOString(),
  };
}

/** Tiruan POST /compass/analyze. */
export async function mockAnalyzeCompass(token: string | null): Promise<CompassAnalyzeResponse> {
  const account = requireAccount(token);
  if (!account.profile) throw new ApiError(404, "Profil siswa belum ada.");
  if (account.status === "baru" || !account.assessment) {
    throw new ApiError(400, "Isi tes gambaran minat bakat dulu supaya Compass bisa menganalisis profilmu.");
  }
  await aiDelay();
  const analysis = analyze(
    account.assessment,
    account.academicRecords.map((r) => r.score),
    account.achievements.length,
    account.profile.id,
  );
  updateAccount(account.id, (a) => {
    a.compassAnalysis = analysis;
  });
  return { message: "Compass AI analysis completed successfully", analysis };
}

/** Tiruan GET /compass/result. Saat status "baru", hasil lama tidak ditampilkan. */
export async function mockGetCompassResult(token: string | null): Promise<CompassResultResponse> {
  await delay();
  const account = requireAccount(token);
  return { analysis: account.status === "baru" ? null : account.compassAnalysis };
}
