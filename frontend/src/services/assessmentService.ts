import asesmenJson from "@/data/asesmen.json";
import type { MeUser } from "@/types/backend";
import type { AsesmenAnswers, AsesmenDoc, AsesmenDraft, AssessmentSummary } from "@/types/analisis";
import { mockGetAssessmentRecord, mockGetDraft, mockSaveDraft, mockSubmitAssessment } from "@/mocks/analisisMock";
import { scoreAnswers } from "@/lib/asesmen";
import { USE_MOCK } from "./config";
import { getToken, request } from "./http";

/** Soal Gambaran Minat Bakat. Masih PLACEHOLDER sampai soal final dari Bu Putri masuk. */
export const ASESMEN = asesmenJson as AsesmenDoc;

// Backend belum menyimpan draft jawaban dan jawaban lengkap (API_CONTRACT 3.3),
// jadi di mode backend keduanya disimpan di browser per akun. localStorage bisa
// gagal (mode private), sehingga selalu dibungkus try/catch.

const draftKey = (userId: string) => `orbita_asesmen_draft_${userId}`;
const answersKey = (userId: string) => `orbita_asesmen_answers_${userId}`;

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* abaikan: jawaban tetap ada di layar sampai halaman ditutup */
  }
}

/** Jawaban yang belum dikirim. null = belum pernah mengisi. */
export async function getDraft(userId: string): Promise<AsesmenDraft | null> {
  if (USE_MOCK) return mockGetDraft(getToken());
  return readLocal<AsesmenDraft>(draftKey(userId));
}

/** Simpan otomatis jawaban (dipanggil setiap jawaban berubah). */
export async function saveDraft(userId: string, answers: AsesmenAnswers, sectionIndex: number): Promise<AsesmenDraft> {
  if (USE_MOCK) return mockSaveDraft(getToken(), answers, sectionIndex);
  const draft: AsesmenDraft = { answers, sectionIndex, savedAt: new Date().toISOString() };
  writeLocal(draftKey(userId), draft);
  return draft;
}

/**
 * Kirim tes: skor 5 dimensi (aturan SEMENTARA di lib/asesmen.ts) ke
 * POST /assessment. Setelah ini pemanggil menjalankan analisis Compass.
 */
export async function submitAssessment(userId: string, answers: AsesmenAnswers): Promise<void> {
  const scores = scoreAnswers(ASESMEN, answers);
  if (USE_MOCK) {
    await mockSubmitAssessment(getToken(), scores, answers);
    return;
  }
  await request("/assessment", { method: "POST", body: scores });
  writeLocal(answersKey(userId), answers);
  writeLocal(draftKey(userId), null);
}

/**
 * Ringkasan tes terbaru dan riwayat kelas sebelumnya. null = belum pernah
 * menyelesaikan tes (atau sedang mengisi ulang setelah naik kelas).
 * Backend belum punya riwayat per kelas (API_CONTRACT 3.2): hanya tes terbaru.
 */
export async function getAssessmentSummary(user: MeUser): Promise<AssessmentSummary | null> {
  if (USE_MOCK) {
    const record = await mockGetAssessmentRecord(getToken());
    return record.latest ? { ...record.latest, previous: record.previous } : null;
  }
  const assessment = user.profile?.assessment;
  if (!assessment || !user.profile) return null;
  return {
    completedAt: assessment.updatedAt,
    grade: user.profile.grade,
    answers: readLocal<AsesmenAnswers>(answersKey(user.id)),
    previous: [],
  };
}
