import type { Scholarship } from "@/types/beasiswa";
import { SCHOLARSHIP_SAMPLES } from "@/data/beasiswa";
import { updateAccount } from "./db";
import { requireAccount } from "./studentMock";
import { delay } from "@/lib/delay";

// Tiruan endpoint beasiswa (usulan docs/API_CONTRACT.md bagian 10).

/** Usulan GET /scholarships. */
export async function mockListScholarships(): Promise<{ scholarships: Scholarship[] }> {
  await delay(200);
  return { scholarships: structuredClone(SCHOLARSHIP_SAMPLES) };
}

/** Usulan GET /scholarships/saved. */
export async function mockGetSaved(token: string | null): Promise<{ ids: string[] }> {
  await delay(120);
  return { ids: [...requireAccount(token).savedScholarships] };
}

/** Usulan PUT/DELETE /scholarships/:id/save. */
export async function mockSetSaved(token: string | null, id: string, saved: boolean): Promise<{ ids: string[] }> {
  await delay(200);
  const account = requireAccount(token);
  const updated = updateAccount(account.id, (a) => {
    const rest = a.savedScholarships.filter((x) => x !== id);
    a.savedScholarships = saved ? [...rest, id] : rest;
  });
  return { ids: [...(updated?.savedScholarships ?? [])] };
}
