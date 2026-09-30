import type { BidangKey, CampusGroup, CampusOffering, FitLabel, JurusanDetail, JurusanSummary } from "@/types/jurusan";
import type { MajorWithUniversity } from "@/types/backend";
import { FEATURED_SLUGS, JURUSAN_CATALOG } from "@/mocks/data/jurusan";
import { delay } from "@/mocks/delay";
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

export interface JurusanQuery {
  search?: string;
  bidang?: BidangKey | null;
}

/** Katalog jurusan untuk /jurusan, sudah difilter pencarian dan bidang. */
export async function getJurusanList({ search = "", bidang = null }: JurusanQuery = {}): Promise<JurusanSummary[]> {
  await delay(150);
  const q = normalize(search);
  return JURUSAN_CATALOG.filter((j) => {
    if (bidang && j.bidang !== bidang) return false;
    if (!q) return true;
    return [j.name, j.description, BIDANG[j.bidang].label].some((t) => normalize(t).includes(q));
  })
    .map(toSummary)
    .sort((a, b) => a.name.localeCompare(b.name, "id"));
}

/** Jumlah jurusan per bidang (untuk angka di chip filter). */
export function countByBidang(): Record<BidangKey, number> {
  const counts = {} as Record<BidangKey, number>;
  for (const j of JURUSAN_CATALOG) counts[j.bidang] = (counts[j.bidang] ?? 0) + 1;
  return counts;
}

/** Jurusan unggulan untuk carousel beranda. */
export async function getFeaturedJurusan(): Promise<JurusanSummary[]> {
  await delay(150);
  return FEATURED_SLUGS.map((slug) => JURUSAN_CATALOG.find((j) => j.slug === slug))
    .filter((j): j is JurusanDetail => Boolean(j))
    .map(toSummary);
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
      logoUrl: m.university.logoUrl,
    });
  }

  return offerings.sort(
    (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.universityName.localeCompare(b.universityName, "id"),
  );
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

/**
 * Label kecocokan per slug jurusan, dari hasil Compass terakhir.
 * Nama jurusan di Compass (nama prodi backend, mis. "Teknik Informatika /
 * Ilmu Komputer") dicocokkan ke katalog lewat nama dan `ptn.names`.
 * Belum pernah analisis → objek kosong (tidak ada label, tidak ada angka palsu).
 */
export async function getFitLabels(): Promise<Record<string, FitLabel>> {
  const analysis = await getCompassResult();
  if (!analysis) return {};

  const labels: Record<string, FitLabel> = {};
  for (const rec of parseRecommended(analysis.recommendedMajors)) {
    if (!rec.name) continue;
    const recName = normalize(rec.name);
    const label: FitLabel = (rec.match_pct ?? 0) >= STRONG_FIT_MIN ? "Sangat sesuai" : "Sesuai";
    for (const j of JURUSAN_CATALOG) {
      const aliases = [j.name, ...(j.ptn.names ?? [])].map(normalize);
      if (!aliases.includes(recName)) continue;
      // Kalau satu jurusan muncul dua kali, pakai label yang lebih kuat.
      if (labels[j.slug] !== "Sangat sesuai") labels[j.slug] = label;
    }
  }
  return labels;
}
