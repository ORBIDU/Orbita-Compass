import type { BidangKey, CampusGroup, CampusOffering, FitLabel, JurusanDetail, JurusanSummary } from "@/types/jurusan";
import type { CompassAnalysis, MajorWithUniversity } from "@/types/backend";
import type { CompassHighlights } from "@/types/dashboard";
import type { CompassRecommendation, CompassResult, HiddenPath, PathGroup, PathKey } from "@/types/compass";
import { JURUSAN_CATALOG } from "@/data/jurusan";
import { delay } from "@/lib/delay";
import { BIDANG } from "@/config/bidang";
import { getMajors } from "./ptnService";
import { getCompassResult } from "./compassService";

// Backend belum punya katalog jurusan yang dikelompokkan per nama jurusan
// (hanya /ptn/majors per kampus). Katalog sementara selalu memakai data
// contoh, di mode dummy maupun backend. Daftar kampus dan label kecocokan
// sudah memakai ptnService dan compassService (ikut saklar VITE_USE_MOCK).
// Kebutuhannya dicatat di docs/API_CONTRACT.md.

function toSummary({ slug, name, bidang, description, imageUrl }: JurusanDetail): JurusanSummary {
  return { slug, name, bidang, description, imageUrl };
}

const normalize = (text: string) => text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();

/**
 * Jenis lembaga di tab hero /jurusan: "umum" = PTN & PTS (semua bidang selain
 * Kedinasan), "kedinasan" = sekolah kedinasan saja.
 */
export type JenisLembaga = "umum" | "kedinasan";

const cocokJenis = (bidang: BidangKey, jenis: JenisLembaga) => (jenis === "kedinasan" ? bidang === "kedinasan" : bidang !== "kedinasan");

export interface JurusanQuery {
  search?: string;
  bidang?: BidangKey | null;
  jenis?: JenisLembaga;
}

/** Katalog jurusan untuk /jurusan, sudah difilter pencarian dan bidang. */
export async function getJurusanList({ search = "", bidang = null, jenis = "umum" }: JurusanQuery = {}): Promise<JurusanSummary[]> {
  await delay(150);
  const q = normalize(search);
  return JURUSAN_CATALOG.filter((j) => {
    if (!cocokJenis(j.bidang, jenis)) return false;
    if (bidang && j.bidang !== bidang) return false;
    if (!q) return true;
    return [j.name, j.description, BIDANG[j.bidang].label].some((t) => normalize(t).includes(q));
  })
    .map(toSummary)
    .sort((a, b) => a.name.localeCompare(b.name, "id"));
}

/** Jumlah jurusan per bidang untuk satu jenis lembaga (angka di chip filter). */
export function countByBidang(jenis: JenisLembaga = "umum"): Record<BidangKey, number> {
  const counts = {} as Record<BidangKey, number>;
  for (const j of JURUSAN_CATALOG) if (cocokJenis(j.bidang, jenis)) counts[j.bidang] = (counts[j.bidang] ?? 0) + 1;
  return counts;
}

/** Detail jurusan, atau null jika slug tidak dikenal. */
export async function getJurusanDetail(slug: string): Promise<JurusanDetail | null> {
  await delay(150);
  return JURUSAN_CATALOG.find((j) => j.slug === slug) ?? null;
}

/** Jurusan lain yang mirip (urutan sesuai data). */
export function getSimilarJurusan(detail: JurusanDetail): JurusanSummary[] {
  return detail.similar
    .map((slug) => JURUSAN_CATALOG.find((j) => j.slug === slug))
    .filter((j): j is JurusanDetail => Boolean(j))
    .map(toSummary);
}

// ─── Kampus yang membuka jurusan ─────────────────────────────────────────────

/** Mengelompokkan University.type backend ke 4 jenis kampus di filter. */
export function campusGroupOf(type: string): CampusGroup {
  const t = type.toUpperCase();
  // PTKIN (UIN/IAIN/STAIN) adalah perguruan tinggi negeri, bukan kedinasan.
  if (t.startsWith("PTKIN")) return "PTN";
  if (t.includes("KEDINASAN") || t.startsWith("PTK")) return "Kedinasan";
  if (t.startsWith("PTS")) return "PTS";
  if (t.startsWith("PTLN")) return "PTLN";
  // PTN Akademik, PTN Vokasi, PTKIN
  return "PTN";
}

const GROUP_ORDER: CampusGroup[] = ["PTN", "PTS", "Kedinasan", "PTLN"];
const MAX_PAGES = 5;

/**
 * Kampus yang membuka jurusan ini, diambil dari GET /ptn/majors (per kampus)
 * lalu dicocokkan dengan nama prodi di `detail.ptn`.
 */
export async function getCampusesForJurusan(detail: JurusanDetail): Promise<CampusOffering[]> {
  const { search, names } = detail.ptn;
  const wanted = names?.map(normalize);
  const majors: MajorWithUniversity[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await getMajors({ search, page, limit: 100 });
    majors.push(...res.majors);
    if (!res.pagination.hasMore) break;
  }

  const seen = new Set<string>();
  const offerings: CampusOffering[] = [];
  for (const m of majors) {
    const name = normalize(m.name);
    const matches = wanted ? wanted.includes(name) : name.includes(normalize(search));
    if (!matches || seen.has(m.universityId)) continue;
    seen.add(m.universityId);
    offerings.push({
      id: m.id,
      universityName: m.university.name,
      majorName: m.name,
      city: m.university.city,
      group: campusGroupOf(m.university.type),
      campusType: m.university.type,
      logoUrl: m.university.logoUrl,
    });
  }

  return offerings.sort(
    (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.universityName.localeCompare(b.universityName, "id"),
  );
}

// ─── Jalur pendidikan untuk Compass ───────────────────────────────────────────

/** Urutan jalur di halaman Compass. */
export const PATH_ORDER: PathKey[] = ["s1ptn", "vokasi", "pts", "ptln", "kedinasan"];

/** Mengelompokkan University.type backend ke jalur pendidikan. */
export function pathOf(campusType: string): PathKey {
  const t = campusType.toUpperCase();
  if (t.includes("VOKASI")) return "vokasi";
  if (t.startsWith("PTKIN")) return "s1ptn";
  if (t.includes("KEDINASAN") || t.startsWith("PTK")) return "kedinasan";
  if (t.startsWith("PTS")) return "pts";
  if (t.startsWith("PTLN")) return "ptln";
  return "s1ptn";
}

const MAX_PATH_OPTIONS = 6;

/**
 * Jalur pendidikan untuk jurusan rekomendasi teratas (yang ada di katalog):
 * kampus yang membuka jurusan itu dikelompokkan per jalur. Jalur tanpa
 * pilihan disembunyikan beserta alasannya.
 */
export function getEducationPaths(
  recommendations: CompassRecommendation[],
  limitJurusan = 3,
): Promise<{ groups: PathGroup[]; hidden: HiddenPath[] }> {
  // Disimpan sementara per daftar rekomendasi, karena halaman Compass dan
  // Beasiswa sama-sama memakainya dan setiap jurusan butuh beberapa permintaan.
  const key = JSON.stringify([limitJurusan, recommendations.map((r) => [r.slug ?? r.name, r.fit, r.bidang])]);
  let cached = pathCache.get(key);
  if (!cached) {
    cached = buildEducationPaths(recommendations, limitJurusan).catch((err) => {
      pathCache.delete(key);
      throw err;
    });
    pathCache.set(key, cached);
  }
  return cached;
}

const pathCache = new Map<string, Promise<{ groups: PathGroup[]; hidden: HiddenPath[] }>>();

/**
 * Jalur dari ORBIDU Compass yang tampil untuk siswa (dipakai label "Cocok
 * dengan jalurmu" di beasiswa). null = belum ada hasil Compass.
 */
export async function getStudentPathKeys(): Promise<PathKey[] | null> {
  const result = await getCompassRecommendations();
  if (!result) return null;
  const { groups } = await getEducationPaths(result.recommendations);
  return groups.map((g) => g.key);
}

async function buildEducationPaths(
  recommendations: CompassRecommendation[],
  limitJurusan: number,
): Promise<{ groups: PathGroup[]; hidden: HiddenPath[] }> {
  const top = recommendations.filter((r) => r.slug).slice(0, limitJurusan);
  const perJurusan = await Promise.all(
    top.map(async (r) => {
      const detail = JURUSAN_CATALOG.find((j) => j.slug === r.slug);
      return { rec: r, offerings: detail ? await getCampusesForJurusan(detail) : [] };
    }),
  );

  const groups = new Map<PathKey, PathGroup & { seen: Set<string> }>();
  for (const { rec, offerings } of perJurusan) {
    for (const o of offerings) {
      const key = pathOf(o.campusType);
      const g = groups.get(key) ?? { key, fit: rec.fit, options: [], total: 0, seen: new Set<string>() };
      if (rec.fit === "Sangat sesuai") g.fit = "Sangat sesuai";
      if (!g.seen.has(o.id)) {
        g.seen.add(o.id);
        g.total += 1;
        if (g.options.length < MAX_PATH_OPTIONS) g.options.push({ prodi: o.majorName, kampus: o.universityName, kota: o.city });
      }
      groups.set(key, g);
    }
  }

  const aligned = new Set(recommendations.map((r) => r.bidang));
  const visible: PathGroup[] = [];
  const hidden: HiddenPath[] = [];
  for (const key of PATH_ORDER) {
    const g = groups.get(key);
    if (g) {
      const { seen: _seen, ...group } = g;
      visible.push(group);
    } else if (key === "kedinasan" && !aligned.has("kedinasan")) {
      hidden.push({ key, reason: "notAligned" });
    } else if (key === "ptln") {
      // Belum ada data kampus luar negeri sama sekali (API_CONTRACT 6.3).
      hidden.push({ key, reason: "noData" });
    } else {
      hidden.push({ key, reason: "noCampus" });
    }
  }
  return { groups: visible, hidden };
}

// ─── Label kecocokan dari Compass ────────────────────────────────────────────

/** Batas skor Compass untuk label "Sangat sesuai". Skornya sendiri tidak ditampilkan. */
const STRONG_FIT_MIN = 80;

interface RecommendedMajor {
  name?: string;
  match_pct?: number;
}

function parseRecommended(json: string): RecommendedMajor[] {
  try {
    const value: unknown = JSON.parse(json);
    return Array.isArray(value) ? (value as RecommendedMajor[]) : [];
  } catch {
    return [];
  }
}

interface RecommendedMajorFull extends RecommendedMajor {
  rationale?: string;
}

/**
 * SATU-SATUNYA tempat rekomendasi Compass dicocokkan ke katalog jurusan.
 * Dipakai halaman Compass, kartu Dashboard, dan label di /jurusan, supaya
 * hasilnya sama di semua halaman.
 *
 * Nama dari Compass (mis. nama prodi backend "Teknik Informatika / Ilmu
 * Komputer") dicocokkan lewat nama katalog dan `ptn.names`; satu nama bisa
 * cocok ke beberapa jurusan. Nama yang tidak ada di katalog tetap disertakan
 * tanpa `slug` (ditampilkan tanpa link detail). Duplikat memakai label terkuat.
 */
export function matchRecommendations(analysis: CompassAnalysis): CompassRecommendation[] {
  const out: CompassRecommendation[] = [];
  const bySlug = new Map<string, CompassRecommendation>();
  const unmatched = new Set<string>();

  for (const rec of parseRecommended(analysis.recommendedMajors) as RecommendedMajorFull[]) {
    if (!rec.name?.trim()) continue;
    const recName = normalize(rec.name);
    const fit: FitLabel = (rec.match_pct ?? 0) >= STRONG_FIT_MIN ? "Sangat sesuai" : "Sesuai";
    const rationale = rec.rationale?.trim() || null;
    const matches = JURUSAN_CATALOG.filter((j) => [j.name, ...(j.ptn.names ?? [])].map(normalize).includes(recName));

    if (matches.length === 0) {
      if (unmatched.has(recName)) continue;
      unmatched.add(recName);
      out.push({ name: rec.name.trim(), slug: null, bidang: null, fit, rationale });
      continue;
    }
    for (const j of matches) {
      const prev = bySlug.get(j.slug);
      if (prev) {
        if (fit === "Sangat sesuai") prev.fit = fit;
        continue;
      }
      const item: CompassRecommendation = { name: j.name, slug: j.slug, bidang: j.bidang, fit, rationale };
      bySlug.set(j.slug, item);
      out.push(item);
    }
  }
  return out;
}

/** Hasil Compass terakhir beserta rekomendasi yang sudah dicocokkan. null = belum pernah analisis. */
export async function getCompassRecommendations(): Promise<CompassResult | null> {
  const analysis = await getCompassResult();
  if (!analysis) return null;
  return { analysis, recommendations: matchRecommendations(analysis) };
}

/** Jurusan katalog untuk nama prodi dari backend (lewat `ptn.names`/`ptn.search`), atau null. */
export function catalogForProdi(prodiName: string): JurusanDetail | null {
  const name = normalize(prodiName);
  return (
    JURUSAN_CATALOG.find((j) => (j.ptn.names ? j.ptn.names.map(normalize).includes(name) : name.includes(normalize(j.ptn.search)))) ??
    null
  );
}

/** Detail katalog untuk slug, atau null. */
export function catalogEntry(slug: string): JurusanDetail | null {
  return JURUSAN_CATALOG.find((j) => j.slug === slug) ?? null;
}

/**
 * Label kecocokan per slug jurusan, dari hasil Compass terakhir.
 * Belum pernah analisis → objek kosong (tidak ada label, tidak ada angka palsu).
 */
export async function getFitLabels(): Promise<Record<string, FitLabel>> {
  const result = await getCompassRecommendations();
  if (!result) return {};
  return Object.fromEntries(result.recommendations.filter((r) => r.slug).map((r) => [r.slug as string, r.fit]));
}

/**
 * Ringkasan Compass untuk kartu Dashboard: bidang yang paling selaras (bidang
 * rekomendasi teratas yang ada di katalog) dan `limit` jurusan teratas.
 * Belum pernah analisis atau tidak ada rekomendasi → null.
 */
export async function getCompassHighlights(limit = 3): Promise<CompassHighlights | null> {
  const result = await getCompassRecommendations();
  if (!result || result.recommendations.length === 0) return null;
  const topWithField = result.recommendations.find((r) => r.bidang);
  return {
    analyzedAt: result.analysis.analyzedAt,
    bidang: topWithField?.bidang ?? null,
    bidangFit: topWithField?.fit ?? result.recommendations[0].fit,
    jurusan: result.recommendations.slice(0, limit).map(({ slug, name, bidang, fit }) => ({ slug, name, bidang, fit })),
  };
}
