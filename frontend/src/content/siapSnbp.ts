// Teks halaman Siap SNBP, mengikuti docs/design/portal/Portal-SiapSNBP.dc.html.

import { BRAND } from "@/config/brand";
import type { EligibleStatus, SnbpCategory } from "@/types/snbp";

export const SNBP_HEADER = {
  breadcrumbHome: "Dashboard",
  breadcrumbSection: "Persiapan",
  title: "Siap SNBP",
  description: "Perkirakan peluangmu di SNBP dari nilai rapor, nilai TKA, prestasi, dan pilihan prodi, lalu susun strategi pendaftaranmu.",
};

export const SNBP_ELIGIBLE = {
  body: "SNBP hanya bisa diikuti siswa eligible yang ditentukan sekolah berdasarkan peringkat dan kuota. Hasil rasionalisasi tetap berguna untuk menyusun strategi, termasuk kalau nanti kamu lewat SNBT.",
  bodyStrong: "eligible",
  label: "Status eligible",
  options: [
    { value: "menunggu", label: "Menunggu pengumuman sekolah" },
    { value: "eligible", label: "Eligible" },
    { value: "tidak", label: "Tidak eligible" },
  ] as { value: EligibleStatus; label: string }[],
  notEligible: "Kamu tetap bisa melihat hasilnya sebagai bahan strategi. Fokus utamamu sekarang SNBT.",
  notEligibleCta: "Buka Siap SNBT",
};

export const SNBP_STEPS = [
  { label: "Input data", sub: "Rapor, TKA, prestasi, prodi" },
  { label: "Review", sub: "Periksa sebelum dihitung" },
  { label: "Hasil", sub: "Peluang dan strategi" },
];

export const SNBP_RAPOR = {
  title: "Nilai rapor",
  auto: "Otomatis dari Analisis Potensi",
  semester: (n: number) => `Semester ${n}`,
  missing: "Belum ada",
  average: "Rata-rata",
  note: (used: string, missing: string | null) =>
    missing
      ? `SNBP memakai nilai semester 1 sampai 5. Untuk sekarang dihitung dari ${used}, dan ${missing} ikut masuk setelah rapornya diinput sekolah.`
      : `SNBP memakai nilai semester 1 sampai 5. Rata-rata dihitung dari ${used}.`,
  emptyTitle: "Nilai rapormu belum diinput sekolah",
  emptyBody: "Rasionalisasi SNBP butuh nilai rapor. Kalau rapor sudah dibagikan tapi belum muncul, tanyakan ke wali kelasmu.",
};

export const SNBP_TKA = {
  title: "Nilai TKA",
  optional: "(opsional)",
  toggle: "Aku sudah punya nilai TKA",
  off: "Nilai TKA biasanya keluar beberapa minggu setelah tes. Tanpa nilai TKA, rasionalisasi tetap jalan memakai rapor dan prestasi.",
  required: "Mapel wajib",
  electives: "Mapel pilihan",
  fromPlan: "Dari pengaturan Action Plan",
  noPlan: "Mapel pilihan TKA diambil dari pengaturan Action Plan. Pilih fokus TKA dan mapel pilihanmu di sana dulu.",
  noPlanCta: "Atur di Action Plan",
  placeholder: "0–100",
  hint: "Isi sesuai sertifikat hasil TKA. Kosongkan mapel yang belum ada nilainya.",
  invalid: "Isi angka 0 sampai 100.",
};

export const SNBP_ACHIEVEMENTS = {
  title: "Prestasi pendukung",
  count: (n: number, max: number) => `${n} dari ${max} dipilih`,
  body: "Pilih maksimal 3 prestasi yang paling relevan dengan prodi pilihanmu. Diambil dari tab Prestasi di Analisis Potensi.",
  noFile: "Sertifikat belum diunggah",
  meta: (level: string, rank: string | null, year: number) => [level, rank, year].filter(Boolean).join(", "),
  empty: "Belum ada prestasi di Analisis Potensi. Prestasi tidak wajib, tapi bisa menambah peluang.",
  emptyCta: "Tambah prestasi",
};

export const SNBP_CHOICES = {
  title: "Pilihan prodi",
  choice: (n: number) => `Pilihan ${n}`,
  optional: "Opsional",
  fromProfile: "Dari target prodimu",
  fromCompass: `Dari target ${BRAND.compassName}`,
  campus: "Kampus",
  prodi: "Prodi",
  campusPlaceholder: "Pilih kampus",
  prodiPlaceholder: "Pilih prodi",
  prodiDisabled: "Pilih kampus dulu",
  clear: "Kosongkan",
  campusNote: "Daftar kampus berisi PTN akademik, PTN vokasi, dan PTKIN. Kampus peserta SNBP mengikuti ketentuan resmi SNPMB setiap tahun.",
  rulesNote: "Aturan pemilihan prodi SNBP bisa berubah tiap tahun. Cek ketentuan terbaru di laman resmi SNPMB sebelum mendaftar.",
  same: "Pilihan 2 sama dengan pilihan 1. Pilih prodi atau kampus lain.",
};

export const SNBP_CHECK = {
  title: "Kelengkapan data",
  rapor: "Nilai rapor",
  raporOk: (sems: string) => `Sem ${sems}`,
  raporMissing: "Belum ada",
  tka: "Nilai TKA",
  tkaOk: "Diisi",
  optional: "Opsional",
  achievements: "Prestasi",
  achievementsOk: (n: number) => `${n} dipilih`,
  achievementsNone: "Belum dipilih",
  choices: "Pilihan prodi",
  choicesOk: (n: number) => `${n} pilihan`,
  choicesNone: "Belum dipilih",
  next: "Lanjut ke review",
  needRapor: "Butuh nilai rapor untuk melanjutkan.",
  needChoice: "Pilih minimal satu prodi untuk melanjutkan.",
  needValidTka: "Perbaiki nilai TKA yang belum sesuai.",
};

export const SNBP_REVIEW = {
  title: "Periksa lagi datamu",
  edit: "Ubah",
  rows: { rapor: "Nilai rapor", tka: "Nilai TKA", achievements: "Prestasi", choices: "Pilihan prodi" },
  rapor: (avg: string, sems: string) => `Rata-rata ${avg} dari ${sems}`,
  tkaNone: "Tidak diisi",
  none: "Tidak ada",
  choice: (n: number, prodi: string, kampus: string) => `Pilihan ${n}: ${prodi}, ${kampus}.`,
  asideTitle: "Sebelum dihitung",
  missingSem: (missing: string, used: string) => `${missing} belum tersedia, jadi hasil memakai ${used}.`,
  noTka: "Nilai TKA belum diisi. Tidak apa-apa, ini opsional.",
  noAchievement: "Belum ada prestasi yang dipilih. Rasionalisasi tetap jalan dari rapor.",
  calculate: "Lihat hasil rasionalisasi",
  calculating: "Menghitung peluangmu...",
  back: "Kembali ke input",
  error: "Rasionalisasi gagal dihitung. Coba lagi.",
};

export const SNBP_RESULT = {
  category: { aman: "Aman", waspada: "Waspada", berisiko: "Berisiko" } as Record<SnbpCategory, string>,
  scale: ["Berisiko", "Waspada", "Aman"],
  factorsTitle: "Yang mempengaruhi",
  up: "Menambah peluang",
  down: "Mengurangi peluang",
  target: "Jadikan target prodi",
  isTarget: "Target prodi utama",
  targetError: "Target gagal disimpan. Coba lagi.",
  strategyTitle: "Strategi dan saran",
  planCta: "Atur latihan SNBT di Action Plan",
  recalc: "Hitung ulang",
  computedAt: (date: string) => `Dihitung ${date}`,
  disclaimerStrong: "Ini estimasi, bukan jaminan.",
  disclaimer: `Hasilnya dihitung dari rapor, prestasi, nilai TKA (kalau diisi), dan pilihan prodimu. ${BRAND.name} belum memakai data resmi daya tampung dan keketatan tiap prodi, jadi gunakan sebagai bahan diskusi dengan guru BK.`,
  temporary: "Cara hitung sementara, menunggu rumus resmi dari tim.",
};

/** Kalimat faktor dan saran yang disusun simulasi rasionalisasi (mocks/snbpEngine.ts). */
export const SNBP_FACTORS = {
  raporHigh: (avg: string, trend: string) => `Rata-rata rapor ${avg}${trend}`,
  raporLow: (avg: string) => `Rata-rata rapor ${avg} masih di bawah 80`,
  trendUp: " dan naik di setiap semester",
  trendMostlyUp: " dan cenderung naik",
  trendDown: (avg: string) => `Rata-rata rapor ${avg}, tapi nilainya turun di semester terakhir`,
  supportUp: (subjects: string) => `${subjects}, mapel pendukung prodi ini, di atas rata-rata nilaimu`,
  supportDown: (subjects: string) => `${subjects}, mapel pendukung prodi ini, di bawah rata-rata nilaimu`,
  achievement: (title: string, level: string) => `Prestasi ${title} tingkat ${level.toLowerCase()}`,
  tkaUp: (avg: string) => `Rata-rata nilai TKA ${avg}`,
  tkaDown: (avg: string) => `Rata-rata nilai TKA ${avg} masih di bawah 70`,
  missingSem: (sems: string) => `${sems} belum ikut dihitung`,
};

export const SNBP_STRATEGY = {
  bothSame: (cat: string) =>
    `Kedua pilihan berada di kategori ${cat}. Persaingan tiap prodi belum ikut dihitung, jadi cek daya tampung dan peminatnya di laman SNPMB sebelum menentukan urutan.`,
  mixed: (first: string, second: string) =>
    `Pilihan 1 ${first}, pilihan 2 ${second}. Kombinasi satu pilihan realistis dan satu pilihan impian umum dipakai, asalkan urutannya sesuai prioritasmu.`,
  single: (cat: string) => `Pilihanmu berada di kategori ${cat}. Pertimbangkan menambah pilihan 2 sebagai cadangan.`,
  risky: "Peluang SNBP-mu masih menantang. Jadikan SNBT jalur utama dan tetap jaga nilai rapormu.",
  uploadCertificate: (title: string) => `Unggah sertifikat ${title} supaya bisa dilampirkan.`,
  keepSemester: (sem: string, subjects: string | null) =>
    subjects ? `Jaga nilai ${sem}, terutama ${subjects}.` : `Jaga nilai ${sem}.`,
  addTka: "Isi nilai TKA setelah keluar, lalu hitung ulang.",
  snbtBackup: "Tetap siapkan SNBT sebagai jalur cadangan.",
};
