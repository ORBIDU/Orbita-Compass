/** Kunci bidang/rumpun jurusan. Label, warna, dan ikon tiap bidang ada di config/bidang.ts. */
export type BidangKey =
  | "teknologi"
  | "sains"
  | "kesehatan"
  | "teknik"
  | "ekonomi"
  | "hukum"
  | "sosial"
  | "pendidikan"
  | "desain"
  | "pertanian"
  | "kedinasan";

/**
 * Ringkasan satu jurusan (dikelompokkan per nama jurusan, bukan per kampus).
 * Belum ada endpoint backend-nya; lihat docs/API_CONTRACT.md.
 */
export interface JurusanSummary {
  /** Dipakai di URL /jurusan/:slug */
  slug: string;
  name: string;
  bidang: BidangKey;
  description: string;
  /** Foto sampul. null → tampil sampul warna + ikon bidang. */
  imageUrl: string | null;
}

export type JalurKey = "SNBP" | "SNBT" | "Mandiri" | "Kedinasan";

export type CareerIcon = "code" | "chart" | "monitor" | "shield" | "sparkles" | "user" | "briefcase";

export interface Career {
  title: string;
  description: string;
  icon?: CareerIcon;
}

/** Detail lengkap untuk halaman /jurusan/:slug. Bagian yang kosong tampil sebagai empty state. */
export interface JurusanDetail extends JurusanSummary {
  /** Jenjang, mis. "S1", "D4". */
  degree: string;
  /** Rumpun seleksi, mis. "Saintek", "Soshum", "Kedinasan". */
  rumpun: string;
  jalur: JalurKey[];
  /** Paragraf "Tentang Jurusan". Kosong → pakai `description`. */
  about: string[];
  topics: string[];
  careers: Career[];
  supportingSubjects: string[];
  /** Slug jurusan lain yang mirip. */
  similar: string[];
  /**
   * Cara mencari kampus yang membuka jurusan ini lewat ptnService.
   * `search` dikirim ke GET /ptn/majors; `names` (opsional) menyaring nama
   * prodi yang persis cocok, supaya "Manajemen" tidak ikut "D4 Manajemen Aset".
   */
  ptn: { search: string; names?: string[] };
}

/** Label kecocokan dari Compass. Sengaja tanpa persentase. */
export type FitLabel = "Sangat sesuai" | "Sesuai";

/** Pengelompokan jenis kampus untuk filter di halaman detail. */
export type CampusGroup = "PTN" | "PTS" | "Kedinasan" | "PTLN";

export interface CampusOffering {
  /** id prodi (Major.id) */
  id: string;
  universityName: string;
  majorName: string;
  city: string;
  group: CampusGroup;
  /** Jenis kampus asli dari backend, mis. "PTN Vokasi" (dipakai jalur di Compass). */
  campusType: string;
  logoUrl: string | null;
}
