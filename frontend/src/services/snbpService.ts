import type { SnbpCampus, SnbpChoice, SnbpDraft, SnbpInput, SnbpResult } from "@/types/snbp";
import { SNBP_CAMPUS_TYPES } from "@/types/snbp";
import { rationalizeSnbp } from "@/data/snbpEngine";
import { aiDelay } from "@/lib/delay";
import { readLocal, writeLocal } from "@/lib/localStore";
import { getUniversities } from "./ptnService";
import { getToken, request } from "./http";

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/snbpMock");

// Siap SNBP. Backend belum menyimpan isian SNBP, dan GET /ptn/rationalization
// hanya menghitung rapor + bonus prestasi (tanpa pilihan prodi, TKA, dan
// prestasi terpilih), jadi belum dipakai (API_CONTRACT bagian 12). Sementara:
// - isian: data dummy di mode dummy, browser per akun di mode backend;
// - rasionalisasi: simulasi (mocks/snbpEngine.ts) di kedua mode;
// - target prodi: PUT /profile (sudah ada) di mode backend.

const draftKey = (userId: string) => `orbidu_snbp_${userId}`;

export async function getSnbpDraft(userId: string): Promise<SnbpDraft | null> {
  if (USE_MOCK) return (await mock()).mockGetSnbpDraft(getToken());
  return readLocal<SnbpDraft>(draftKey(userId));
}

export async function saveSnbpDraft(userId: string, draft: SnbpDraft): Promise<void> {
  if (USE_MOCK) return (await mock()).mockSaveSnbpDraft(getToken(), draft);
  writeLocal(draftKey(userId), draft);
}

const MAX_PAGES = 10;
let campusCache: Promise<SnbpCampus[]> | null = null;

async function loadCampuses(): Promise<SnbpCampus[]> {
  const all: SnbpCampus[] = [];
  for (const type of SNBP_CAMPUS_TYPES) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await getUniversities({ type, page, limit: 100 });
      for (const u of res.universities) {
        all.push({
          id: u.id,
          name: u.name,
          type: u.type,
          majors: u.majors.map((m) => ({ id: m.id, name: m.name })).sort((a, b) => a.name.localeCompare(b.name, "id")),
        });
      }
      if (!res.pagination.hasMore) break;
    }
  }
  return all.filter((c) => c.majors.length > 0).sort((a, b) => a.name.localeCompare(b.name, "id"));
}

/** Kampus peserta SNBP (PTN akademik, PTN vokasi, PTKIN) beserta prodinya. Disimpan selama sesi. */
export function getSnbpCampuses(): Promise<SnbpCampus[]> {
  if (!campusCache) {
    campusCache = loadCampuses().catch((err) => {
      campusCache = null;
      throw err;
    });
  }
  return campusCache;
}

/** Hitung peluang per pilihan (simulasi sementara, jeda 2–3 detik). */
export async function rationalize(input: SnbpInput): Promise<SnbpResult> {
  if (USE_MOCK) return (await mock()).mockRationalizeSnbp(getToken(), input);
  await aiDelay();
  return rationalizeSnbp(input);
}

/**
 * Simpan target prodi di kampus tertentu (tingkat kedua di API_CONTRACT 9.1).
 * Backend: PUT /profile hanya dengan targetPtnId + targetMajorId; field lain tidak berubah.
 */
export async function setTargetProdi(target: SnbpChoice | null): Promise<void> {
  if (USE_MOCK) return (await mock()).mockSetTargetProdi(getToken(), target);
  await request("/profile", {
    method: "PUT",
    body: { targetPtnId: target?.universityId ?? null, targetMajorId: target?.majorId ?? null },
  });
}
