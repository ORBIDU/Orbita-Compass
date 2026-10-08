import type { Scholarship } from "@/types/beasiswa";
import { mockGetSaved, mockListScholarships, mockSetSaved } from "@/mocks/beasiswaMock";
import { SCHOLARSHIP_SAMPLES } from "@/mocks/data/beasiswa";
import { delay } from "@/mocks/delay";
import { readLocal, writeLocal } from "@/lib/localStore";
import { USE_MOCK } from "./config";
import { getToken } from "./http";

// Backend belum punya katalog beasiswa maupun beasiswa tersimpan
// (API_CONTRACT bagian 10). Katalog selalu memakai contoh data (diberi label
// di halaman). Beasiswa tersimpan: data dummy di mode dummy, browser per akun
// di mode backend.

/** true selama katalog beasiswa masih contoh data. */
export const SCHOLARSHIPS_ARE_SAMPLES = true;

export async function listScholarships(): Promise<Scholarship[]> {
  if (USE_MOCK) return (await mockListScholarships()).scholarships;
  await delay(150);
  return structuredClone(SCHOLARSHIP_SAMPLES);
}

const savedKey = (userId: string) => `orbita_beasiswa_saved_${userId}`;

export async function getSavedScholarships(userId: string): Promise<string[]> {
  if (USE_MOCK) return (await mockGetSaved(getToken())).ids;
  return readLocal<string[]>(savedKey(userId)) ?? [];
}

/** Simpan atau batalkan simpan satu beasiswa. Mengembalikan daftar terbaru. */
export async function setScholarshipSaved(userId: string, id: string, saved: boolean): Promise<string[]> {
  if (USE_MOCK) return (await mockSetSaved(getToken(), id, saved)).ids;
  const rest = (readLocal<string[]>(savedKey(userId)) ?? []).filter((x) => x !== id);
  const next = saved ? [...rest, id] : rest;
  writeLocal(savedKey(userId), next);
  return next;
}
