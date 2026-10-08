// Bentuk data halaman Profil (/portal/profil). Data diri diisi pihak
// kurikulum sekolah dan hanya bisa dibaca siswa. Kolom yang belum ada di
// backend dicatat di docs/API_CONTRACT.md bagian 13.
// Semua nilai boleh null = belum diisi sekolah.

export type Gender = "L" | "P";

export interface SchoolIdentity {
  gender: Gender | null;
  birthPlace: string | null;
  /** YYYY-MM-DD */
  birthDate: string | null;
  nis: string | null;
  nisn: string | null;
  religion: string | null;
}

export interface SchoolAddress {
  street: string | null;
  rt: string | null;
  rw: string | null;
  village: string | null;
  district: string | null;
  /** Kota/kabupaten. Mode backend memakai StudentProfile.city kalau kosong. */
  city: string | null;
  /** Salah satu dari 38 provinsi (PROVINCES). */
  province: string | null;
  postalCode: string | null;
}

export interface SchoolContact {
  studentPhone: string | null;
  guardianPhone: string | null;
  fatherName: string | null;
  fatherJob: string | null;
  motherName: string | null;
  motherJob: string | null;
  guardianName: string | null;
}

export interface SchoolFamily {
  parentStatus: string | null;
  livingWith: string | null;
  fatherEducation: string | null;
  motherEducation: string | null;
  socioEconomic: string | null;
  /** Mis. ["KIP"]; [] = tidak ada; null = belum diisi. */
  educationAid: string[] | null;
  childOrder: number | null;
  siblingCount: number | null;
}

export interface SchoolSpecial {
  specialNeeds: boolean | null;
  specialNeedsTypes: string[] | null;
  colorBlind: boolean | null;
  notes: string | null;
}

/** Data diri dari sekolah (hanya dibaca siswa). */
export interface SchoolProfile {
  identity: SchoolIdentity;
  address: SchoolAddress;
  contact: SchoolContact;
  family: SchoolFamily;
  special: SchoolSpecial;
  /** Terakhir diperbarui pihak sekolah (ISO). null = belum pernah. */
  updatedAt: string | null;
}

/** Data lengkap halaman Profil. */
export interface ProfilView {
  name: string;
  email: string;
  grade: number | null;
  schoolName: string | null;
  school: SchoolProfile;
  nickname: string | null;
  avatarUrl: string | null;
  /** Waktu persetujuan orang tua/wali (ISO). null = belum tercatat; undefined = belum bisa dibaca. */
  parentConsentAt: string | null | undefined;
  /** false = nama panggilan/foto disimpan di browser (mode backend). */
  savedOnServer: boolean;
  /** false = ganti password belum tersedia (mode backend). */
  canChangePassword: boolean;
}

export const NICKNAME_MAX = 20;
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_TYPES = ["image/jpeg", "image/png"];

/** 38 provinsi Indonesia. */
export const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Bengkulu", "Sumatera Selatan",
  "Kepulauan Bangka Belitung", "Lampung", "Banten", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta",
  "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah",
  "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara", "Papua", "Papua Barat",
  "Papua Barat Daya", "Papua Selatan", "Papua Tengah", "Papua Pegunungan",
] as const;
