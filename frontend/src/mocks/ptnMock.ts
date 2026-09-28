import type { MajorsResponse, Pagination, UniversitiesResponse } from "@/types/backend";
import type { MajorQuery, UniversityQuery } from "@/services/ptnService";
import { MOCK_MAJORS, MOCK_UNIVERSITIES, findUniversity } from "./data/ptn";
import { delay } from "./delay";

// Filter, urutan, dan batas limit meniru backend-api/src/controllers/ptnController.ts.

function paginate<T>(items: T[], page = 1, limit: number, defaultLimit: number) {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || defaultLimit));
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / limitNum);
  const pagination: Pagination = { page: pageNum, limit: limitNum, totalCount, totalPages, hasMore: pageNum < totalPages };
  return { slice: items.slice((pageNum - 1) * limitNum, pageNum * limitNum), pagination };
}

const contains = (text: string, part: string) => text.toLowerCase().includes(part.toLowerCase());
const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "id");

/** Tiruan GET /ptn/majors. */
export async function mockGetMajors({ category, search, page, limit }: MajorQuery = {}): Promise<MajorsResponse> {
  await delay();
  const filtered = MOCK_MAJORS.filter(
    (m) => (!category || m.category === category) && (!search || contains(m.name, search)),
  ).sort(byName);
  const { slice, pagination } = paginate(filtered, page, limit ?? 25, 25);
  return {
    majors: slice.map((m) => ({ ...m, university: findUniversity(m.universityId)! })),
    pagination,
  };
}

/** Tiruan GET /ptn/universities. */
export async function mockGetUniversities({ city, type, page, limit }: UniversityQuery = {}): Promise<UniversitiesResponse> {
  await delay();
  const filtered = MOCK_UNIVERSITIES.filter(
    (u) => (!city || contains(u.city, city)) && (!type || u.type === type),
  ).sort(byName);
  const { slice, pagination } = paginate(filtered, page, limit ?? 30, 30);
  return {
    universities: slice.map((u) => ({ ...u, majors: MOCK_MAJORS.filter((m) => m.universityId === u.id) })),
    pagination,
  };
}
