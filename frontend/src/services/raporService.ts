import type { AcademicRecord } from "@/types/backend";
import type { RaporData } from "@/types/analisis";
import { mockGetRapor } from "@/mocks/analisisMock";
import { buildRapor } from "@/lib/rapor";
import { USE_MOCK } from "./config";
import { getToken, request } from "./http";

/** Nilai rapor (hanya baca, diinput sekolah) yang sudah disusun per semester. */
export async function getRapor(grade: number, now = new Date()): Promise<RaporData> {
  const { academicRecords } = USE_MOCK
    ? await mockGetRapor(getToken())
    : await request<{ academicRecords: AcademicRecord[] }>("/rapor");
  return buildRapor(academicRecords, grade, now);
}
