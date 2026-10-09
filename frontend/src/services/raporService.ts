import type { AcademicRecord } from "@/types/backend";
import type { RaporData } from "@/types/analisis";
import { buildRapor } from "@/lib/rapor";
import { getToken, request } from "./http";

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/analisisMock");

/** Nilai rapor (hanya baca, diinput sekolah) yang sudah disusun per semester. */
export async function getRapor(grade: number, now = new Date()): Promise<RaporData> {
  const { academicRecords } = USE_MOCK
    ? await (await mock()).mockGetRapor(getToken())
    : await request<{ academicRecords: AcademicRecord[] }>("/rapor");
  return buildRapor(academicRecords, grade, now);
}
