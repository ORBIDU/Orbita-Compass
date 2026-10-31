// Teks halaman ORBIDU Compass, mengikuti docs/design/portal/Portal-Compass.dc.html.

import { BRAND } from "@/config/brand";
import type { PathKey } from "@/types/compass";

export const COMPASS_HEADER = {
  breadcrumbHome: "Dashboard",
  title: BRAND.compassName,
  description: "Arah pendidikan yang disusun dari gambaran minat bakat, prestasi, dan nilai rapormu, lengkap dengan alasannya.",
  analyzedAt: (date: string) => `Dianalisis ${date}`,
  trialQuestions: "Soal versi uji coba",
  trialQuestionsHint: "Soal Gambaran Minat Bakat masih versi uji coba, jadi hasil ini belum final.",
  refresh: "Perbarui analisis",
  refreshing: "Menganalisis...",
  upToDate: "Hasil sudah sesuai data terbaru",
  hasNewData: "Ada data baru sejak analisis terakhir",
  refreshError: "Analisis gagal diperbarui. Coba lagi sebentar lagi.",
};

export const COMPASS_LOCKED = {
  title: `${BRAND.compassName} terbuka setelah Gambaran Minat Bakat`,
  body: "Rekomendasi disusun dari jawaban tesmu, ditambah prestasi dan nilai rapor. Isi tesnya dulu, bisa dicicil per bagian.",
  cta: "Isi Gambaran Minat Bakat",
  benefitsTitle: "Yang akan kamu dapatkan",
  benefits: [
    "Bidang yang paling selaras dengan dirimu",
    "Jurusan yang bisa kamu eksplorasi, beserta alasannya",
    "Jalur pendidikan dan beasiswa yang bisa dicoba",
  ],
};

export const COMPASS_EMPTY = {
  title: "Analisis belum dijalankan",
  body: `Tes minat bakatmu sudah tersimpan. Jalankan analisis supaya ${BRAND.compassName} menyusun rekomendasi jurusanmu.`,
  cta: "Jalankan analisis",
};

export const COMPASS_DISCLAIMER = "Rekomendasi ini bahan pertimbangan, bukan keputusan. Diskusikan hasilnya dengan guru BK dan orang tuamu.";

export const COMPASS_HERO = {
  eyebrow: "Bidang paling selaras",
  noField: "Bidang belum bisa ditentukan",
  radarCaption: "Gambaran minat dari tesmu",
  radarLabel: (parts: string) => `Radar 5 dimensi minat: ${parts}`,
  aspects: { minat: "Minat", akademik: "Akademik", prestasi: "Prestasi" },
};

/** Label tingkat keselarasan aspek (tanpa persentase). */
export const ASPECT_LEVEL = {
  5: "Sangat selaras",
  4: "Selaras",
  3: "Cukup selaras",
  2: "Perlu dieksplorasi",
  waitingRapor: "Menunggu nilai rapor",
  noAchievement: "Belum ada prestasi",
  unrelatedAchievement: "Belum terkait bidang ini",
} as const;

export const DIMENSION_LABEL = {
  technology: "Teknologi",
  research: "Riset",
  creativity: "Kreativitas",
  leadership: "Kepemimpinan",
  communication: "Komunikasi",
} as const;

export const RECOMMENDATIONS = {
  title: "Jurusan yang bisa kamu eksplorasi",
  subtitle: "Pilih satu sebagai target supaya rencana belajar dan rasionalisasi SNBP-mu lebih terarah.",
  targetChip: (name: string) => `Target: ${name}`,
  view: "Lihat jurusan",
  setTarget: "Jadikan target",
  isTarget: "Target kamu",
  targetError: "Target gagal disimpan. Coba lagi.",
  notInCatalog: "Belum ada di katalog jurusan",
  why: {
    minatTop: (dim: string) => `Minat ${dim.toLowerCase()} paling tinggi`,
    minatSecond: (dim: string) => `Minat ${dim.toLowerCase()} menonjol`,
    raporRising: (subject: string) => `${subject} naik terus`,
    raporHigh: (subject: string, score: number, semester: number) => `${subject} ${score} di semester ${semester}`,
    prestasi: (title: string, level: string) => `${title} (${level})`,
  },
  empty: "Compass belum memberi rekomendasi jurusan. Coba perbarui analisis setelah datamu bertambah.",
};

export const PATHS = {
  title: "Jalur pendidikan",
  subtitle: "Kampus yang membuka jurusan rekomendasimu, dikelompokkan per jalur.",
  names: {
    s1ptn: { title: "S1 PTN", sub: "Perguruan tinggi negeri" },
    vokasi: { title: "D4 Vokasi", sub: "Politeknik dan vokasi negeri" },
    pts: { title: "PTS", sub: "Perguruan tinggi swasta" },
    ptln: { title: "PTLN", sub: "Perguruan tinggi luar negeri" },
    kedinasan: { title: "Kedinasan", sub: "Sekolah kedinasan" },
  } as Record<PathKey, { title: string; sub: string }>,
  show: "Lihat pilihan",
  showing: "Sedang ditampilkan",
  listTitle: (path: string) => `Pilihan di jalur ${path}`,
  sampleData: "Contoh data",
  more: (n: number) => `+${n} pilihan lain`,
  hidden: {
    notAligned: (path: string) => `${path} tidak ditampilkan karena belum selaras dengan profilmu saat ini.`,
    noCampus: (path: string) => `${path} tidak ditampilkan karena belum ada data kampus untuk jurusan rekomendasimu.`,
    noData: (path: string) => `${path} tidak ditampilkan karena data kampusnya belum tersedia.`,
  },
  empty: "Belum ada data kampus untuk jurusan rekomendasimu.",
};

export const WHY = {
  title: `Kenapa ${BRAND.name} merekomendasikan ini`,
  tes: { title: "Dari Gambaran Minat Bakat", link: "Lihat jawaban tes", empty: "Hasil tes belum tersedia." },
  prestasi: { title: "Dari prestasi", link: "Lihat prestasi", empty: "Belum ada prestasi tercatat. Tambahkan supaya analisis makin lengkap." },
  rapor: { title: "Dari nilai rapor", link: "Lihat nilai rapor", empty: "Nilai rapor belum diinput sekolah." },
  tesTop: (a: string, b: string) => `${a} dan ${b.toLowerCase()} adalah minat paling kuat`,
  tesThird: (a: string) => `${a} juga cukup menonjol`,
  tesLowest: (a: string) => `${a} paling rendah, masih bisa dieksplorasi`,
  prestasiItem: (rank: string | null, title: string, level: string) => `${rank ? `${rank} ` : ""}${title} (${level})`,
  raporTop: (a: string, va: number, b: string, vb: number, sem: number) => `${a} ${va} dan ${b} ${vb} di semester ${sem}`,
  raporRising: (n: number) => `Rata-rata naik ${n} semester berturut-turut`,
  raporAverage: (avg: string, sem: number) => `Rata-rata semester ${sem}: ${avg}`,
  raporLowest: (s: string, v: number) => `${s} ${v}, masih bisa ditingkatkan`,
  noteTitle: `Catatan ${BRAND.name}.`,
  /** Saran penutup jika dua rekomendasi teratas ada di bidang yang sama. */
  noteCompare: (a: string, b: string) =>
    `Kalau kamu ragu antara ${a} dan ${b}, coba bandingkan isi kuliahnya di halaman jurusan dan ngobrol dengan guru BK.`,
  noteGeneric: "Bandingkan isi kuliah jurusan-jurusan di atas dan diskusikan dengan guru BK sebelum memutuskan.",
};

export const NEXT_STEPS = {
  title: "Langkah selanjutnya",
  items: [
    { key: "snbp", title: "Siap SNBP", desc: "Cek peluangmu lewat rapor dan prestasi, lalu tentukan strategi pilihan.", cta: "Mulai rasionalisasi" },
    { key: "tka", title: "Siap TKA", desc: "Nilai TKA ikut dipakai untuk SNBP. Latihan mapel wajib dan pilihanmu.", cta: "Mulai latihan" },
    { key: "snbt", title: "Siap SNBT", desc: "Latihan per subtes UTBK dan ikuti tryout berkala.", cta: "Mulai latihan" },
    // Hanya tampil jika ada jurusan Kedinasan di rekomendasi.
    { key: "skd", title: "Siap SKD", desc: "Latihan Seleksi Kompetensi Dasar untuk sekolah kedinasan.", cta: "Mulai latihan" },
  ] as const,
};

