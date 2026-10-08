// Bentuk data Siap SNBP (/portal/persiapan/snbp). Belum ada endpoint backend
// yang cocok; bentuknya dicatat di docs/API_CONTRACT.md bagian 12.

/** Status eligible SNBP yang diisi siswa sendiri (ditentukan sekolah). */
export type EligibleStatus = "menunggu" | "eligible" | "tidak";

export const MAX_SNBP_ACHIEVEMENTS = 3;

/** Jenis kampus yang ikut SNBP (University.type di backend). */
export const SNBP_CAMPUS_TYPES = ["PTN Akademik", "PTN Vokasi", "PTKIN"] as const;

/** Satu pilihan prodi di kampus tertentu. */
export interface SnbpChoice {
  universityId: string;
  majorId: string;
}

/** Isian Siap SNBP yang disimpan supaya tidak hilang saat halaman dibuka lagi. */
export interface SnbpDraft {
  eligible: EligibleStatus;
  tkaEnabled: boolean;
  /** Nilai TKA per mapel, sebagai teks isian (boleh kosong). */
  tkaScores: Record<string, string>;
  achievementIds: string[];
  /** [pilihan 1, pilihan 2]; null = belum dipilih. */
  choices: [SnbpChoice | null, SnbpChoice | null];
  /** Hasil rasionalisasi terakhir. null = belum pernah dihitung. */
  result: SnbpResult | null;
  updatedAt: string;
}

/** Data yang dikirim untuk dihitung. */
export interface SnbpInput {
  /** Rata-rata per semester yang sudah ada nilainya. */
  semesters: { semester: number; average: number }[];
  /** Semester yang dipakai SNBP tapi belum ada nilainya (mis. [5]). */
  missingSemesters: number[];
  /** Rata-rata nilai per mapel dari semester yang ada. */
  subjects: Record<string, number>;
  /** Nilai TKA yang diisi (0–100). null = tidak diisi. */
  tka: Record<string, number> | null;
  achievements: { title: string; level: string; hasCertificate: boolean }[];
  choices: {
    universityId: string;
    universityName: string;
    majorId: string;
    majorName: string;
    /** Mapel pendukung dari katalog jurusan (kosong jika prodi tidak cocok dengan katalog). */
    supportingSubjects: string[];
  }[];
}

export type SnbpCategory = "aman" | "waspada" | "berisiko";

export interface SnbpFactor {
  /** up = menambah peluang, down = mengurangi. */
  direction: "up" | "down";
  text: string;
}

export interface SnbpChoiceResult {
  universityId: string;
  universityName: string;
  majorId: string;
  majorName: string;
  category: SnbpCategory;
  factors: SnbpFactor[];
}

export interface SnbpResult {
  computedAt: string;
  choices: SnbpChoiceResult[];
  strategy: string;
  suggestions: string[];
}

/** Kampus peserta SNBP beserta prodinya (untuk pilihan prodi). */
export interface SnbpCampus {
  id: string;
  name: string;
  type: string;
  majors: { id: string; name: string }[];
}
