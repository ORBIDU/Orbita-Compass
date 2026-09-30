/** Kunci bidang/rumpun jurusan. Warna dan ikon tiap bidang ada di config/bidang.ts. */
export type BidangKey =
  | "teknologi"
  | "kesehatan"
  | "sosial"
  | "hukum"
  | "ekonomi"
  | "teknik"
  | "desain"
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
