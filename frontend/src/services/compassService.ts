import type { CompassAnalysis, CompassAnalyzeResponse, CompassResultResponse } from "@/types/backend";
import { mockAnalyzeCompass, mockGetCompassResult } from "@/mocks/compassMock";
import { USE_MOCK } from "./config";
import { getToken, request } from "./http";

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
