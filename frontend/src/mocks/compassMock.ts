import type { CompassAnalyzeResponse, CompassResultResponse } from "@/types/backend";
import type { CompassTarget } from "@/types/compass";
import { ApiError } from "@/services/http";
import { updateAccount } from "./db";
import { simulateCompass } from "./compassEngine";
import { requireAccount } from "./studentMock";
import { aiDelay, delay } from "@/lib/delay";

/** Tiruan POST /compass/analyze. */
export async function mockAnalyzeCompass(token: string | null): Promise<CompassAnalyzeResponse> {
  const account = requireAccount(token);
  if (!account.profile) throw new ApiError(404, "Profil siswa belum ada.");
  if (account.status === "baru" || !account.assessment) {
    throw new ApiError(400, "Isi tes gambaran minat bakat dulu supaya Compass bisa menganalisis profilmu.");
  }
  await aiDelay();
  const analysis = simulateCompass(
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

/** Usulan GET /compass/target (API_CONTRACT 9.1). */
export async function mockGetTarget(token: string | null): Promise<{ target: CompassTarget | null }> {
  await delay(150);
  return { target: requireAccount(token).compassTarget };
}

/** Usulan PUT /compass/target (API_CONTRACT 9.1). null = hapus target. */
export async function mockSetTarget(token: string | null, target: { slug: string | null; name: string } | null): Promise<{ target: CompassTarget | null }> {
  await delay(250);
  const account = requireAccount(token);
  const next: CompassTarget | null = target ? { ...target, setAt: new Date().toISOString() } : null;
  updateAccount(account.id, (a) => {
    a.compassTarget = next;
  });
  return { target: next };
}

/**
 * Usulan `inputsUpdatedAt` di GET /compass/result (API_CONTRACT 9.2): waktu
 * terakhir tes, prestasi, atau rapor berubah.
 */
export async function mockGetInputsUpdatedAt(token: string | null): Promise<{ inputsUpdatedAt: string | null }> {
  await delay(100);
  const a = requireAccount(token);
  const dates = [
    a.status !== "baru" ? a.assessment?.updatedAt : undefined,
    ...a.achievements.map((x) => x.createdAt),
    ...a.academicRecords.map((r) => r.createdAt),
    a.inputsUpdatedAt ?? undefined,
  ].filter((d): d is string => Boolean(d));
  return { inputsUpdatedAt: dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : null };
}
