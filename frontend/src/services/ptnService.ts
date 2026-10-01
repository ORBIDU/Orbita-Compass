import type { MajorsResponse, UniversitiesResponse } from "@/types/backend";
import { mockGetMajors, mockGetUniversities } from "@/mocks/ptnMock";
import { USE_MOCK } from "./config";
import { request, toQuery } from "./http";

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

export function getMajors(query: MajorQuery = {}): Promise<MajorsResponse> {
  if (USE_MOCK) return mockGetMajors(query);
  return request<MajorsResponse>(`/ptn/majors${toQuery({ ...query })}`);
}

export function getUniversities(query: UniversityQuery = {}): Promise<UniversitiesResponse> {
  if (USE_MOCK) return mockGetUniversities(query);
  return request<UniversitiesResponse>(`/ptn/universities${toQuery({ ...query })}`);
}
