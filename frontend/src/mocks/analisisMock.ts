import type { AcademicRecord, Achievement, Assessment } from "@/types/backend";
import type { AsesmenAnswers, AsesmenDraft, AssessmentHistoryEntry, AssessmentScores } from "@/types/analisis";
import { ApiError } from "@/services/http";
import { updateAccount, type MockAchievement } from "./db";
import { requireAccount } from "./studentMock";
import { delay } from "./delay";

// Tiruan endpoint Analisis Potensi. Yang sudah ada di backend meniru bentuk
// responsnya (POST /assessment, /achievements, GET /rapor); sisanya mengikuti
// usulan di docs/API_CONTRACT.md bagian 3 dan 8.

// ─── Gambaran Minat Bakat ────────────────────────────────────────────────────

/** Usulan GET /assessment/draft (API_CONTRACT 3.3). */
export async function mockGetDraft(token: string | null): Promise<AsesmenDraft | null> {
  await delay(150);
  const account = requireAccount(token);
  return account.assessmentDraft ? structuredClone(account.assessmentDraft) : null;
}

/** Usulan PUT /assessment/draft (API_CONTRACT 3.3). */
export async function mockSaveDraft(token: string | null, answers: AsesmenAnswers, sectionIndex: number): Promise<AsesmenDraft> {
  await delay(200);
  const account = requireAccount(token);
  const draft: AsesmenDraft = { answers: structuredClone(answers), sectionIndex, savedAt: new Date().toISOString() };
  updateAccount(account.id, (a) => {
    a.assessmentDraft = draft;
  });
  return draft;
}

/**
 * Tiruan POST /assessment (skor 5 dimensi) + menyimpan jawaban lengkap
 * (usulan API_CONTRACT 3.3). Status siswa ikut menjadi "sudah_asesmen".
 * Kalau tes sebelumnya diisi di kelas lain, tes lama masuk riwayat.
 */
export async function mockSubmitAssessment(
  token: string | null,
  scores: AssessmentScores,
  answers: AsesmenAnswers,
): Promise<{ message: string; assessment: Assessment }> {
  await delay(400);
  const account = requireAccount(token);
  if (!account.profile) throw new ApiError(404, "Profil siswa belum ada.");
  const profile = account.profile;
  const now = new Date().toISOString();

  const updated = updateAccount(account.id, (a) => {
    const previous = a.assessment;
    if (previous && a.assessmentGrade !== null && a.assessmentGrade !== profile.grade) {
      const entry: AssessmentHistoryEntry = { grade: a.assessmentGrade, completedAt: previous.updatedAt, topBidang: null };
      a.assessmentHistory = [entry, ...a.assessmentHistory.filter((h) => h.grade !== entry.grade)];
    }
    a.assessment = { id: previous?.id ?? `asm-${a.id}`, profileId: profile.id, ...scores, updatedAt: now };
    a.assessmentAnswers = structuredClone(answers);
    a.assessmentGrade = profile.grade;
    a.assessmentDraft = null;
    if (a.status === "baru") a.status = "sudah_asesmen";
  });
  return { message: "Assessment updated successfully", assessment: updated!.assessment! };
}

/** Usulan GET /assessment/history (API_CONTRACT 3.2). */
export async function mockGetAssessmentRecord(token: string | null): Promise<{
  latest: { completedAt: string; grade: number; answers: AsesmenAnswers | null } | null;
  previous: AssessmentHistoryEntry[];
}> {
  await delay(150);
  const account = requireAccount(token);
  const done = account.status !== "baru" && account.assessment;
  return {
    latest: done
      ? {
          completedAt: account.assessment!.updatedAt,
          grade: account.assessmentGrade ?? account.profile?.grade ?? 0,
          answers: account.assessmentAnswers ? structuredClone(account.assessmentAnswers) : null,
        }
      : null,
    previous: structuredClone(account.assessmentHistory),
  };
}

// ─── Prestasi ────────────────────────────────────────────────────────────────

export interface MockAchievementBody {
  title: string;
  category: string;
  level: string;
  year: number;
  rank: string | null;
  organizer: string | null;
  certificateName: string | null;
}

/** Usulan GET /achievements dengan field lengkap (API_CONTRACT 8.1). */
export async function mockListAchievements(token: string | null): Promise<{ achievements: MockAchievement[] }> {
  await delay(200);
  return { achievements: structuredClone(requireAccount(token).achievements) };
}

/** Tiruan POST /achievements (+ field usulan). */
export async function mockAddAchievement(token: string | null, body: MockAchievementBody): Promise<{ message: string; achievement: Achievement }> {
  await delay(400);
  const account = requireAccount(token);
  if (!body.title) throw new ApiError(400, "Nama prestasi wajib diisi.");
  if (!account.profile) throw new ApiError(404, "Profil siswa belum ada.");
  const achievement: MockAchievement = {
    id: `ach-${Date.now().toString(36)}`,
    profileId: account.profile.id,
    createdAt: new Date().toISOString(),
    ...body,
  };
  updateAccount(account.id, (a) => {
    a.achievements = [achievement, ...a.achievements];
    a.inputsUpdatedAt = new Date().toISOString();
  });
  return { message: "Achievement added successfully", achievement };
}

/** Usulan PUT /achievements/:id (API_CONTRACT 8.1). */
export async function mockUpdateAchievement(token: string | null, id: string, body: MockAchievementBody): Promise<{ message: string; achievement: Achievement }> {
  await delay(400);
  const account = requireAccount(token);
  const index = account.achievements.findIndex((a) => a.id === id);
  if (index < 0) throw new ApiError(404, "Prestasi tidak ditemukan.");
  const achievement: MockAchievement = { ...account.achievements[index], ...body };
  updateAccount(account.id, (a) => {
    a.achievements[index] = achievement;
    a.inputsUpdatedAt = new Date().toISOString();
  });
  return { message: "Achievement updated successfully", achievement };
}

/** Tiruan DELETE /achievements/:id (dummy sudah memeriksa pemiliknya). */
export async function mockDeleteAchievement(token: string | null, id: string): Promise<{ message: string }> {
  await delay(300);
  const account = requireAccount(token);
  if (!account.achievements.some((a) => a.id === id)) throw new ApiError(404, "Prestasi tidak ditemukan.");
  updateAccount(account.id, (a) => {
    a.achievements = a.achievements.filter((x) => x.id !== id);
    a.inputsUpdatedAt = new Date().toISOString();
  });
  return { message: "Achievement deleted successfully" };
}

// ─── Nilai rapor ─────────────────────────────────────────────────────────────

/** Tiruan GET /rapor. */
export async function mockGetRapor(token: string | null): Promise<{ academicRecords: AcademicRecord[] }> {
  await delay(200);
  return { academicRecords: structuredClone(requireAccount(token).academicRecords) };
}
