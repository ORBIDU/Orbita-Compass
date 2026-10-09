import type { MajorsResponse, UniversitiesResponse } from "@/types/backend";
import { request, toQuery } from "./http";

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/ptnMock");

export interface MajorQuery {
  /** Saintek, Soshum, Vokasi, atau Kedinasan */
  category?: string;
  search?: string;
  page?: number;
  /** Default 25, maksimal 100 */
  limit?: number;
}

export interface UniversityQuery {
  city?: string;
  /** PTN Akademik, PTN Vokasi, PTKIN, atau PTK Kedinasan */
  type?: string;
  page?: number;
  /** Default 30, maksimal 100 */
  limit?: number;
}

export async function getMajors(query: MajorQuery = {}): Promise<MajorsResponse> {
  if (USE_MOCK) return (await mock()).mockGetMajors(query);
  return request<MajorsResponse>(`/ptn/majors${toQuery({ ...query })}`);
}

export async function getUniversities(query: UniversityQuery = {}): Promise<UniversitiesResponse> {
  if (USE_MOCK) return (await mock()).mockGetUniversities(query);
  return request<UniversitiesResponse>(`/ptn/universities${toQuery({ ...query })}`);
}
