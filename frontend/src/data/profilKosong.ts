import type { SchoolProfile } from "@/types/profil";

// Sementara, dipakai juga di mode backend sampai endpoint data diri dari
// sekolah ada (GET /profile/school, API_CONTRACT 13.1): semua field kosong,
// tampil "Belum diisi sekolah".

export const EMPTY_SCHOOL_PROFILE: SchoolProfile = {
  identity: { gender: null, birthPlace: null, birthDate: null, nis: null, nisn: null, religion: null },
  address: { street: null, rt: null, rw: null, village: null, district: null, city: null, province: null, postalCode: null },
  contact: { studentPhone: null, guardianPhone: null, fatherName: null, fatherJob: null, motherName: null, motherJob: null, guardianName: null },
  family: { parentStatus: null, livingWith: null, fatherEducation: null, motherEducation: null, socioEconomic: null, educationAid: null, childOrder: null, siblingCount: null },
  special: { specialNeeds: null, specialNeedsTypes: null, colorBlind: null, notes: null },
  updatedAt: null,
};
