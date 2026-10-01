import type { CompassAnalysis, CompassAnalyzeResponse, CompassResultResponse } from "@/types/backend";
import type { CompassTarget } from "@/types/compass";
import { mockAnalyzeCompass, mockGetCompassResult, mockGetInputsUpdatedAt, mockGetTarget, mockSetTarget } from "@/mocks/compassMock";
import { readLocal, writeLocal } from "@/lib/localStore";
import { USE_MOCK } from "./config";
import { getToken, request } from "./http";
import { getProfile } from "./studentService";

/** Hasil analisis Compass terakhir, atau null jika belum pernah dianalisis. */
export async function getCompassResult(): Promise<CompassAnalysis | null> {
  const data = USE_MOCK
    ? await mockGetCompassResult(getToken())
    : await request<CompassResultResponse>("/compass/result");
  return data.analysis;
}

/** Menjalankan analisis Compass baru. Di mode dummy memakan waktu 2–3 detik. */
export async function analyzeCompass(): Promise<CompassAnalysis> {
  const data = USE_MOCK
    ? await mockAnalyzeCompass(getToken())
    : await request<CompassAnalyzeResponse>("/compass/analyze", { method: "POST" });
  return data.analysis;
}

// ─── Target jurusan ──────────────────────────────────────────────────────────
// Target di Compass adalah JURUSAN katalog (mis. Sistem Informasi), berbeda
// dari target prodi di kampus tertentu untuk Siap SNBP (`targetMajorId`
// backend). Backend belum punya tempat untuk target jurusan (API_CONTRACT
// 9.1), jadi di mode backend disimpan di browser per akun.

const targetKey = (userId: string) => `orbita_compass_target_${userId}`;

export async function getTarget(userId: string): Promise<CompassTarget | null> {
  if (USE_MOCK) return (await mockGetTarget(getToken())).target;
  return readLocal<CompassTarget>(targetKey(userId));
}

/** null = hapus target. */
export async function setTarget(userId: string, target: { slug: string | null; name: string } | null): Promise<CompassTarget | null> {
  if (USE_MOCK) return (await mockSetTarget(getToken(), target)).target;
  const next: CompassTarget | null = target ? { ...target, setAt: new Date().toISOString() } : null;
  writeLocal(targetKey(userId), next);
  return next;
}

// ─── Perlu analisis ulang? ───────────────────────────────────────────────────

/**
 * Waktu terakhir data masukan Compass (tes, prestasi, rapor) berubah.
 * Dipakai untuk mengaktifkan "Perbarui analisis" hanya jika ada data baru,
 * karena setiap analisis AI memakan kuota. Backend belum mengirim nilai ini
 * (API_CONTRACT 9.2), jadi dihitung dari tanggal data di GET /profile;
 * prestasi yang dihapus belum terdeteksi.
 */
export async function getInputsUpdatedAt(): Promise<string | null> {
  if (USE_MOCK) return (await mockGetInputsUpdatedAt(getToken())).inputsUpdatedAt;
  const profile = await getProfile();
  const dates = [
    profile.assessment?.updatedAt,
    ...profile.achievements.map((a) => a.createdAt),
    ...profile.academicRecords.map((r) => r.createdAt),
  ].filter((d): d is string => Boolean(d));
  return dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : null;
}
