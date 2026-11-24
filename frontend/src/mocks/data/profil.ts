import type { SchoolProfile } from "@/types/profil";

// Data diri contoh dari "pihak kurikulum sekolah" (mode dummy), mengikuti
// docs/design/portal/Portal-Profil.dc.html. Bukan data asli siswa.

/** Akun siswa@orbidu.id: data lengkap. */
export const SISWA_SCHOOL_PROFILE: SchoolProfile = {
  identity: { gender: "L", birthPlace: "Palembang", birthDate: "2009-05-15", nis: "2425001234", nisn: "0098765432", religion: "Islam" },
  address: {
    street: "Jl. Mawar No. 12",
    rt: "003",
    rw: "005",
    village: "Sungai Pangeran",
    district: "Ilir Timur I",
    city: "Palembang",
    province: "Sumatera Selatan",
    postalCode: "30127",
  },
  contact: {
    studentPhone: "0812-3456-7890",
    guardianPhone: "0813-9876-5432",
    fatherName: "Hendra Pratama",
    fatherJob: "Wiraswasta",
    motherName: "Siti Rahma",
    motherJob: "Guru",
    guardianName: null,
  },
  family: {
    parentStatus: "Orang tua lengkap",
    livingWith: "Ayah dan ibu",
    fatherEducation: "S1",
    motherEducation: "S1",
    socioEconomic: "Cukup",
    educationAid: [],
    childOrder: 1,
    siblingCount: 2,
  },
  special: { specialNeeds: false, specialNeedsTypes: [], colorBlind: false, notes: null },
  updatedAt: "2026-09-02T08:00:00.000Z",
};

/** Akun budi@orbidu.id: sebagian belum diisi sekolah (untuk menguji tampilan kosong). */
export const BUDI_SCHOOL_PROFILE: SchoolProfile = {
  identity: { gender: "L", birthPlace: "Bandung", birthDate: "2009-02-03", nis: null, nisn: "0091234567", religion: null },
  address: { street: "Jl. Dago No. 45", rt: null, rw: null, village: "Lebakgede", district: "Coblong", city: "Bandung", province: "Jawa Barat", postalCode: null },
  contact: { studentPhone: "0857-1111-2222", guardianPhone: null, fatherName: "Agus Setiawan", fatherJob: null, motherName: "Rina Marlina", motherJob: null, guardianName: null },
  family: { parentStatus: null, livingWith: null, fatherEducation: null, motherEducation: null, socioEconomic: null, educationAid: null, childOrder: null, siblingCount: null },
  special: { specialNeeds: null, specialNeedsTypes: null, colorBlind: null, notes: null },
  updatedAt: "2026-08-20T08:00:00.000Z",
};
