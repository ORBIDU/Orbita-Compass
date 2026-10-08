import type { SnbpDraft, SnbpInput, SnbpResult } from "@/types/snbp";
import { ApiError } from "@/services/http";
import { updateAccount } from "./db";
import { requireAccount } from "./studentMock";
import { aiDelay, delay } from "./delay";
import { rationalizeSnbp } from "./snbpEngine";
import { findMajor } from "./data/ptn";

// Tiruan data Siap SNBP (docs/API_CONTRACT.md bagian 12).

export async function mockGetSnbpDraft(token: string | null): Promise<SnbpDraft | null> {
  await delay(200);
  const account = requireAccount(token);
  return account.snbp ? structuredClone(account.snbp) : null;
}

export async function mockSaveSnbpDraft(token: string | null, draft: SnbpDraft): Promise<void> {
  await delay(100);
  const account = requireAccount(token);
  updateAccount(account.id, (a) => {
    a.snbp = structuredClone(draft);
  });
}

/** Tiruan POST /snbp/rationalization (simulasi, jeda 2–3 detik). */
export async function mockRationalizeSnbp(token: string | null, input: SnbpInput): Promise<SnbpResult> {
  requireAccount(token);
  await aiDelay();
  return rationalizeSnbp(input);
}

/** Tiruan PUT /profile dengan { targetPtnId, targetMajorId } (target prodi di kampus). */
export async function mockSetTargetProdi(token: string | null, target: { universityId: string; majorId: string } | null): Promise<void> {
  await delay(250);
  const account = requireAccount(token);
  if (target && findMajor(target.majorId)?.universityId !== target.universityId) {
    throw new ApiError(400, "Prodi tidak ditemukan di kampus ini.");
  }
  updateAccount(account.id, (a) => {
    if (!a.profile) return;
    a.profile.targetPtnId = target?.universityId ?? null;
    a.profile.targetMajorId = target?.majorId ?? null;
    a.profile.updatedAt = new Date().toISOString();
  });
}
