import type { Major, University } from "@/types/backend";

// CONTOH DATA. Sampel kecil yang bentuknya sama dengan tabel University dan
// Major di backend. Nama, kode, kota, dan jenis kampus diambil dari seed
// backend; daya tampung dan passing grade memakai rumus yang sama dengan
// seed backend, jadi angkanya juga hanya estimasi, bukan data resmi.

export const MOCK_UNIVERSITIES: University[] = [
  { id: "univ-311", code: "311", name: "Universitas Indonesia", city: "Depok / Jakarta", type: "PTN Akademik", accreditation: "Unggul", logoUrl: null },
  { id: "univ-332", code: "332", name: "Institut Teknologi Bandung", city: "Bandung", type: "PTN Akademik", accreditation: "Unggul", logoUrl: null },
  { id: "univ-333", code: "333", name: "Universitas Padjadjaran", city: "Sumedang / Bandung", type: "PTN Akademik", accreditation: "Unggul", logoUrl: null },
  { id: "univ-361", code: "361", name: "Universitas Gadjah Mada", city: "Yogyakarta", type: "PTN Akademik", accreditation: "Unggul", logoUrl: null },
  { id: "univ-382", code: "382", name: "Institut Teknologi Sepuluh Nopember", city: "Surabaya", type: "PTN Akademik", accreditation: "Unggul", logoUrl: null },
  { id: "univ-181", code: "181", name: "Universitas Sriwijaya", city: "Palembang", type: "PTN Akademik", accreditation: "Unggul", logoUrl: null },
  { id: "univ-409", code: "409", name: "Politeknik Negeri Jakarta", city: "Depok / Jakarta", type: "PTN Vokasi", accreditation: "Unggul", logoUrl: null },
  { id: "univ-909", code: "909", name: "UIN Syarif Hidayatullah Jakarta", city: "Tangerang Selatan", type: "PTKIN", accreditation: "Unggul", logoUrl: null },
  { id: "univ-ptk-01", code: "PTK-01", name: "PKN STAN (Politeknik Keuangan Negara STAN)", city: "Tangerang Selatan", type: "PTK Kedinasan", accreditation: "Unggul", logoUrl: null },
  { id: "univ-ptk-03", code: "PTK-03", name: "Politeknik Statistika STIS (BPS)", city: "Jakarta Timur", type: "PTK Kedinasan", accreditation: "Unggul", logoUrl: null },
  // PTS: backend belum punya datanya (hanya tipe "PTS" di skema). Contoh untuk filter jenis kampus.
  { id: "univ-pts-01", code: "PTS-01", name: "BINUS University", city: "Jakarta Barat", type: "PTS", accreditation: "Unggul", logoUrl: null },
  { id: "univ-pts-02", code: "PTS-02", name: "Universitas Telkom", city: "Bandung", type: "PTS", accreditation: "Unggul", logoUrl: null },
  { id: "univ-pts-03", code: "PTS-03", name: "Universitas Ciputra", city: "Surabaya", type: "PTS", accreditation: "Unggul", logoUrl: null },
];

interface ProgramTemplate {
  slug: string;
  name: string;
  category: string;
  baseCapacity: number;
  passingAvg: number;
}

// Sama dengan programTemplates di backend-api/prisma/scrape_all_146_ptn.ts.
const PROGRAMS: ProgramTemplate[] = [
  { slug: "informatika", name: "Teknik Informatika / Ilmu Komputer", category: "Saintek", baseCapacity: 120, passingAvg: 89.0 },
  { slug: "sistem-informasi", name: "Sistem Informasi", category: "Saintek", baseCapacity: 90, passingAvg: 86.5 },
  { slug: "kedokteran", name: "Kedokteran (Pendidikan Dokter)", category: "Saintek", baseCapacity: 140, passingAvg: 94.5 },
  { slug: "teknik-elektro", name: "Teknik Elektro", category: "Saintek", baseCapacity: 100, passingAvg: 85.5 },
  { slug: "teknik-sipil", name: "Teknik Sipil", category: "Saintek", baseCapacity: 120, passingAvg: 84.5 },
  { slug: "sains-data", name: "Sains Data & Data Science", category: "Saintek", baseCapacity: 70, passingAvg: 87.0 },
  { slug: "manajemen", name: "Manajemen", category: "Soshum", baseCapacity: 160, passingAvg: 87.5 },
  { slug: "akuntansi", name: "Akuntansi", category: "Soshum", baseCapacity: 150, passingAvg: 86.5 },
  { slug: "hukum", name: "Ilmu Hukum", category: "Soshum", baseCapacity: 200, passingAvg: 87.0 },
  { slug: "psikologi", name: "Psikologi", category: "Soshum", baseCapacity: 160, passingAvg: 88.5 },
  { slug: "ilmu-komunikasi", name: "Ilmu Komunikasi", category: "Soshum", baseCapacity: 110, passingAvg: 88.0 },
];

const KEDINASAN_PROGRAMS: Record<string, ProgramTemplate[]> = {
  "PTK-01": [
    { slug: "akuntansi-publik", name: "D4 Akuntansi Sektor Publik", category: "Kedinasan", baseCapacity: 480, passingAvg: 88.5 },
    { slug: "manajemen-keuangan-negara", name: "D4 Manajemen Keuangan Negara", category: "Kedinasan", baseCapacity: 360, passingAvg: 87.0 },
  ],
  "PTK-03": [
    { slug: "komputasi-statistik", name: "D4 Komputasi Statistik", category: "Kedinasan", baseCapacity: 250, passingAvg: 91.5 },
    { slug: "statistika", name: "D4 Statistika", category: "Kedinasan", baseCapacity: 200, passingAvg: 90.0 },
  ],
};

const TOP_TIER = ["311", "332", "361", "382"];

function buildMajor(univ: University, prog: ProgramTemplate): Major {
  // Kedinasan dan PTS tidak lewat SNBP/SNBT, seluruh kuota masuk jalur mandiri.
  if (prog.category === "Kedinasan" || univ.type === "PTS") {
    return {
      id: `major-${univ.code}-${prog.slug}`,
      universityId: univ.id,
      name: prog.name,
      category: prog.category,
      capacity: prog.baseCapacity,
      capacitySnbp: 0,
      capacitySnbt: 0,
      capacityMandiri: prog.baseCapacity,
      passingGrade: prog.passingAvg,
      accreditation: "Unggul",
    };
  }
  const capacitySnbp = Math.round(prog.baseCapacity * 0.3);
  const capacitySnbt = Math.round(prog.baseCapacity * 0.45);
  const capacityMandiri = Math.round(prog.baseCapacity * 0.25);
  const bonus = TOP_TIER.includes(univ.code) ? 2.5 : -2.0;
  return {
    id: `major-${univ.code}-${prog.slug}`,
    universityId: univ.id,
    name: prog.name,
    category: prog.category,
    capacity: capacitySnbp + capacitySnbt + capacityMandiri,
    capacitySnbp,
    capacitySnbt,
    capacityMandiri,
    passingGrade: Math.min(96, Math.round((prog.passingAvg + bonus) * 10) / 10),
    accreditation: "Unggul",
  };
}

function programsFor(univ: University): ProgramTemplate[] {
  if (univ.type === "PTK Kedinasan") return KEDINASAN_PROGRAMS[univ.code] ?? [];
  if (univ.type === "PTS") return PROGRAMS.filter((p) => p.slug !== "kedokteran");
  // Sama seperti seed backend: politeknik hanya membuka prodi teknik & manajemen.
  if (univ.type === "PTN Vokasi") {
    return PROGRAMS.filter((p) => p.name.includes("Teknik") || p.name.includes("Manajemen"));
  }
  return PROGRAMS;
}

export const MOCK_MAJORS: Major[] = MOCK_UNIVERSITIES.flatMap((univ) =>
  programsFor(univ).map((prog) => buildMajor(univ, prog)),
);

export function findUniversity(id: string | null): University | null {
  return MOCK_UNIVERSITIES.find((u) => u.id === id) ?? null;
}

export function findMajor(id: string | null): Major | null {
  return MOCK_MAJORS.find((m) => m.id === id) ?? null;
}
