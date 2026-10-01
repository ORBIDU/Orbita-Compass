// Bentuk data halaman ORBIDU Compass (/portal/compass).
// Yang belum ada di backend dicatat di docs/API_CONTRACT.md bagian 9.

import type { CompassAnalysis } from "./backend";
import type { BidangKey, FitLabel } from "./jurusan";

/**
 * Satu jurusan rekomendasi Compass. `slug` dan `bidang` terisi jika nama dari
 * Compass cocok dengan katalog jurusan; jika tidak (mis. nama prodi dari
 * backend), jurusan tetap ditampilkan tanpa link detail.
 */
export interface CompassRecommendation {
  /** Nama dari katalog jika cocok, selain itu nama asli dari Compass. */
  name: string;
  slug: string | null;
  bidang: BidangKey | null;
  fit: FitLabel;
  /** Alasan singkat dari Compass (boleh kosong). */
  rationale: string | null;
}

export interface CompassResult {
  analysis: CompassAnalysis;
  /** Berurutan sesuai Compass, tanpa duplikat. */
  recommendations: CompassRecommendation[];
}

/** Target jurusan dari Compass (jurusan katalog, bukan prodi di kampus tertentu). */
export interface CompassTarget {
  slug: string | null;
  name: string;
  setAt: string;
}

/** Jalur pendidikan menurut jenis kampus. */
export type PathKey = "s1ptn" | "vokasi" | "pts" | "ptln" | "kedinasan";

export interface PathOption {
  prodi: string;
  kampus: string;
  kota: string;
}

export interface PathGroup {
  key: PathKey;
  /** Label kecocokan terbaik dari jurusan rekomendasi yang dibuka di jalur ini. */
  fit: FitLabel;
  options: PathOption[];
  /** Jumlah pilihan sebelum dipotong untuk ditampilkan. */
  total: number;
}

/** Jalur yang disembunyikan beserta alasannya. */
export interface HiddenPath {
  key: PathKey;
  reason: "notAligned" | "noCampus" | "noData";
}
