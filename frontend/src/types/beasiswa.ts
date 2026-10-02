// Bentuk data Explore Beasiswa (/portal/beasiswa). Backend belum punya
// katalog beasiswa; bentuk ini diusulkan di docs/API_CONTRACT.md bagian 10.

import type { PathKey } from "./compass";

export const SCHOLARSHIP_LEVELS = ["S1", "D3/D4"] as const;
export type ScholarshipLevel = (typeof SCHOLARSHIP_LEVELS)[number];

export const SCHOLARSHIP_LOCATIONS = ["Dalam negeri", "Luar negeri"] as const;
export type ScholarshipLocation = (typeof SCHOLARSHIP_LOCATIONS)[number];

export const SCHOLARSHIP_AID = ["Biaya kuliah penuh", "Biaya kuliah sebagian", "Biaya hidup", "Ikatan dinas"] as const;
export type ScholarshipAid = (typeof SCHOLARSHIP_AID)[number];

/** Jenis penyelenggara, menentukan ikon dan warna kartu. */
export type ScholarshipProvider = "pemerintah" | "kampus" | "daerah" | "swasta" | "luarNegeri" | "kedinasan";

export interface Scholarship {
  id: string;
  name: string;
  organizer: string;
  provider: ScholarshipProvider;
  levels: ScholarshipLevel[];
  location: ScholarshipLocation;
  aid: ScholarshipAid[];
  /** Jalur pendidikan (dari ORBIDU Compass) yang bisa memakai beasiswa ini. */
  paths: PathKey[];
  coverage: string;
  requirements: string[];
  documents: string[];
  period: string;
  /** Situs resmi. null = belum ada (contoh data). */
  officialUrl: string | null;
  /** Catatan singkat di kartu Compass, mis. "Cek syarat ekonomi". */
  note: string;
}

/** Filter halaman beasiswa (tersimpan di URL). */
export interface ScholarshipFilters {
  q: string;
  levels: ScholarshipLevel[];
  locations: ScholarshipLocation[];
  aid: ScholarshipAid[];
  /** Hanya yang cocok dengan jalur dari ORBIDU Compass. */
  matchOnly: boolean;
  /** Hanya yang disimpan. */
  savedOnly: boolean;
}
