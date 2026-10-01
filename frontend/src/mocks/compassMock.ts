import type { CompassAnalyzeResponse, CompassResultResponse } from "@/types/backend";
import { ApiError } from "@/services/http";
import { updateAccount } from "./db";
import { simulateCompass } from "./compassEngine";
import { requireAccount } from "./studentMock";
import { aiDelay, delay } from "./delay";

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
