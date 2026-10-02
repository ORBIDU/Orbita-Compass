import {
  SCHOLARSHIP_AID,
  SCHOLARSHIP_LEVELS,
  SCHOLARSHIP_LOCATIONS,
  type Scholarship,
  type ScholarshipAid,
  type ScholarshipFilters,
  type ScholarshipLevel,
  type ScholarshipLocation,
} from "@/types/beasiswa";
import type { PathKey } from "@/types/compass";

// ─── Filter di URL ───────────────────────────────────────────────────────────
// Contoh: /portal/beasiswa?jenjang=s1&lokasi=dalam-negeri&bantuan=biaya-hidup&cocok=1&disimpan=1&q=kip

const LEVEL_SLUG: Record<ScholarshipLevel, string> = { S1: "s1", "D3/D4": "d3-d4" };
const LOCATION_SLUG: Record<ScholarshipLocation, string> = { "Dalam negeri": "dalam-negeri", "Luar negeri": "luar-negeri" };
const AID_SLUG: Record<ScholarshipAid, string> = {
  "Biaya kuliah penuh": "kuliah-penuh",
  "Biaya kuliah sebagian": "kuliah-sebagian",
  "Biaya hidup": "biaya-hidup",
  "Ikatan dinas": "ikatan-dinas",
};

function fromSlugs<T extends string>(raw: string | null, all: readonly T[], slugs: Record<T, string>): T[] {
  if (!raw) return [];
  const wanted = raw.split(",");
  return all.filter((v) => wanted.includes(slugs[v]));
}

export const EMPTY_FILTERS: ScholarshipFilters = { q: "", levels: [], locations: [], aid: [], matchOnly: false, savedOnly: false };

export function filtersFromParams(params: URLSearchParams): ScholarshipFilters {
  return {
    q: params.get("q") ?? "",
    levels: fromSlugs(params.get("jenjang"), SCHOLARSHIP_LEVELS, LEVEL_SLUG),
    locations: fromSlugs(params.get("lokasi"), SCHOLARSHIP_LOCATIONS, LOCATION_SLUG),
    aid: fromSlugs(params.get("bantuan"), SCHOLARSHIP_AID, AID_SLUG),
    matchOnly: params.get("cocok") === "1",
    savedOnly: params.get("disimpan") === "1",
  };
}

export function filtersToParams(f: ScholarshipFilters): Record<string, string> {
  const out: Record<string, string> = {};
  if (f.q.trim()) out.q = f.q.trim();
  if (f.levels.length) out.jenjang = f.levels.map((v) => LEVEL_SLUG[v]).join(",");
  if (f.locations.length) out.lokasi = f.locations.map((v) => LOCATION_SLUG[v]).join(",");
  if (f.aid.length) out.bantuan = f.aid.map((v) => AID_SLUG[v]).join(",");
  if (f.matchOnly) out.cocok = "1";
  if (f.savedOnly) out.disimpan = "1";
  return out;
}

/** Jumlah filter aktif (untuk tombol "Filter" di HP); pencarian tidak dihitung. */
export function activeFilterCount(f: ScholarshipFilters): number {
  return f.levels.length + f.locations.length + f.aid.length + (f.matchOnly ? 1 : 0) + (f.savedOnly ? 1 : 0);
}

// ─── Pencocokan ──────────────────────────────────────────────────────────────

/**
 * "Cocok dengan jalurmu": HANYA melihat jalur pendidikan dari ORBIDU Compass
 * (yang sekaligus menentukan jenjang S1 atau D3/D4). Kelayakan sebenarnya
 * (mis. kondisi ekonomi) ditentukan penyelenggara.
 */
export function matchesPath(s: Scholarship, studentPaths: PathKey[] | null): boolean {
  return Boolean(studentPaths?.length) && s.paths.some((p) => studentPaths!.includes(p));
}

const norm = (t: string) => t.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();

type Group = "levels" | "locations" | "aid";

/** Cocok dengan semua filter, kecuali grup `skip` (dipakai untuk angka di tiap pilihan). */
function passes(s: Scholarship, f: ScholarshipFilters, studentPaths: PathKey[] | null, saved: string[], skip?: Group): boolean {
  if (f.q.trim()) {
    const q = norm(f.q);
    if (![s.name, s.organizer].some((t) => norm(t).includes(q))) return false;
  }
  if (skip !== "levels" && f.levels.length && !s.levels.some((v) => f.levels.includes(v))) return false;
  if (skip !== "locations" && f.locations.length && !f.locations.includes(s.location)) return false;
  if (skip !== "aid" && f.aid.length && !s.aid.some((v) => f.aid.includes(v))) return false;
  if (f.matchOnly && !matchesPath(s, studentPaths)) return false;
  if (f.savedOnly && !saved.includes(s.id)) return false;
  return true;
}

export function applyFilters(list: Scholarship[], f: ScholarshipFilters, studentPaths: PathKey[] | null, saved: string[]): Scholarship[] {
  return list.filter((s) => passes(s, f, studentPaths, saved));
}

/** Jumlah hasil untuk tiap pilihan, jika pilihan itu ikut dipilih. */
export function optionCounts(list: Scholarship[], f: ScholarshipFilters, studentPaths: PathKey[] | null, saved: string[]) {
  const count = (group: Group, has: (s: Scholarship) => boolean) =>
    list.filter((s) => passes(s, f, studentPaths, saved, group) && has(s)).length;
  return {
    levels: Object.fromEntries(SCHOLARSHIP_LEVELS.map((v) => [v, count("levels", (s) => s.levels.includes(v))])) as Record<ScholarshipLevel, number>,
    locations: Object.fromEntries(SCHOLARSHIP_LOCATIONS.map((v) => [v, count("locations", (s) => s.location === v)])) as Record<ScholarshipLocation, number>,
    aid: Object.fromEntries(SCHOLARSHIP_AID.map((v) => [v, count("aid", (s) => s.aid.includes(v))])) as Record<ScholarshipAid, number>,
  };
}
