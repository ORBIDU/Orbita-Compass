// Teks halaman Siap SNBT, Siap TKA, dan Siap SKD (satu template),
// mengikuti docs/design/portal/Portal-SiapUjian.dc.html.

import { BRAND } from "@/config/brand";
import type { ExamId } from "@/types/practice";

export const UJIAN_HEADER = {
  breadcrumbHome: "Dashboard",
  breadcrumbSection: "Persiapan",
};

const duration = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} jam${m % 60 ? ` ${m % 60} menit` : ""}` : `${m} menit`);

export interface ExamCopy {
  title: string;
  description: string;
  /** Nama ujian di kalimat, mis. "SNBT". */
  short: string;
  /** Chip jadwal; `{bulan}` diisi bulan perkiraan dari timeline seleksi. */
  schedule: (monthYear: string | null) => string;
  heading: (count: number) => string;
  sessionSize: string;
  /** Format tryout; `minutes` dihitung dari jumlah soal dan detik per soal (config/practice.ts). */
  tryoutFormat: (minutes: number) => string;
  scaleNote: string;
  /** Satuan skor di kartu Performance. */
  scoreUnit: string;
}

export const EXAM_COPY: Record<ExamId, ExamCopy> = {
  snbt: {
    title: "Siap SNBT",
    description: "Latihan soal, tryout, dan pantauan skor untuk 7 subtes UTBK-SNBT.",
    short: "SNBT",
    schedule: (m) => (m ? `UTBK-SNBT, perkiraan ${m}` : "UTBK-SNBT, jadwal mengikuti SNPMB"),
    heading: () => "7 subtes UTBK-SNBT",
    sessionSize: "20 soal",
    tryoutFormat: (m) => `7 subtes sesuai format UTBK-SNBT, sekitar ${duration(m)}.`,
    scaleNote: `Skor tryout ${BRAND.name} memakai skala 0–1000 sebagai perkiraan, tidak sama persis dengan skor resmi UTBK.`,
    scoreUnit: "skala 0–1000",
  },
  tka: {
    title: "Siap TKA",
    description: "Latihan soal, tryout, dan pantauan nilai untuk mapel wajib dan mapel pilihan TKA-mu.",
    short: "TKA",
    schedule: (m) => (m ? `TKA SMA, perkiraan ${m}` : "TKA SMA, jadwal mengikuti Kemendikdasmen"),
    heading: (n) => (n > 3 ? `3 mapel wajib dan ${n - 3} mapel pilihan` : "3 mapel wajib"),
    sessionSize: "15 soal",
    tryoutFormat: (m) => `Mapel wajib dan mapel pilihan yang kamu atur di Action Plan, sekitar ${duration(m)}.`,
    scaleNote: `Nilai tryout ${BRAND.name} memakai skala 0–100 sebagai perkiraan. Skala nilai resmi mengikuti sertifikat TKA.`,
    scoreUnit: "skala 0–100",
  },
  skd: {
    title: "Siap SKD",
    description: "Latihan soal, tryout, dan pantauan skor Seleksi Kompetensi Dasar untuk sekolah kedinasan.",
    short: "SKD",
    schedule: () => "SKD, mengikuti jadwal tiap instansi",
    heading: () => "3 subtes SKD",
    sessionSize: "20 soal",
    tryoutFormat: (m) => `TWK, TIU, dan TKP dalam satu sesi, sekitar ${duration(m)}.`,
    scaleNote: `Skor tryout ${BRAND.name} mengikuti susunan SKD dengan total maksimal 550 (TWK 150, TIU 175, TKP 225), sebagai latihan.`,
    scoreUnit: "maks. 550",
  },
};

/** Penjelasan singkat tiap subtes/mapel. Mapel tanpa penjelasan memakai `fallback`. */
export const SUBJECT_DESC: Record<string, string> = {
  PU: "Penalaran induktif, deduktif, dan kuantitatif.",
  PPU: "Pemahaman bacaan, kosakata, dan kaidah bahasa.",
  PBM: "Memahami isi teks dan menyunting tulisan.",
  PK: "Konsep dasar matematika dan logika angka.",
  LBI: "Membaca dan menalar teks berbahasa Indonesia.",
  LBE: "Membaca dan menalar teks berbahasa Inggris.",
  PM: "Memecahkan masalah sehari-hari dengan matematika.",
  Matematika: "Bilangan, aljabar, geometri, dan data.",
  "Bahasa Indonesia": "Teks, kebahasaan, dan literasi.",
  "Bahasa Inggris": "Reading dan language use.",
  "Matematika Tingkat Lanjut": "Fungsi, kalkulus dasar, dan statistika.",
  "Bahasa Indonesia Tingkat Lanjut": "Analisis teks sastra dan nonsastra.",
  "Bahasa Inggris Tingkat Lanjut": "Teks akademik dan analisis bahasa.",
  Fisika: "Mekanika, listrik, dan gelombang.",
  Kimia: "Struktur atom, reaksi, dan stoikiometri.",
  Biologi: "Sel, genetika, dan ekosistem.",
  Ekonomi: "Konsep ekonomi, pasar, dan akuntansi dasar.",
  Sosiologi: "Interaksi sosial, kelompok, dan perubahan sosial.",
  Geografi: "Bumi, penduduk, dan pemetaan.",
  Sejarah: "Peristiwa dan tokoh sejarah Indonesia dan dunia.",
  TWK: "Pancasila, UUD 1945, NKRI, dan Bhinneka Tunggal Ika.",
  TIU: "Kemampuan verbal, numerik, dan figural.",
  TKP: "Pelayanan publik, jejaring kerja, dan profesionalisme.",
};
export const SUBJECT_DESC_FALLBACK = "Mapel pilihan TKA-mu.";

export const UJIAN_TABS = [
  { id: "latihan", label: "Latihan Soal" },
  { id: "tryout", label: "Tryout" },
  { id: "performance", label: "Performance" },
] as const;
export type UjianTab = (typeof UJIAN_TABS)[number]["id"];

export const LATIHAN = {
  today: {
    note: "Latihan ini disiapkan Action Plan untuk hari ini.",
    allDone: (exam: string) => `Latihan ${exam} hari ini selesai`,
    allDoneNote: "Mantap! Kamu tetap bisa latihan bebas di bawah.",
    none: (exam: string) => `Tidak ada latihan ${exam} hari ini`,
    noneNext: (date: string) => `Latihan berikutnya: ${date}.`,
    noneNote: "Kamu tetap bisa latihan bebas di bawah.",
    noPlan: "Belum ada rencana belajar. Atur di Action Plan supaya latihan disiapkan tiap hari belajar.",
    title: (title: string, questions: number) => `${title}, ${questions} soal`,
    cta: { todo: "Kerjakan", in_progress: "Lanjutkan" },
    openPlan: "Buka Action Plan",
  },
  sessionNote: (size: string) => `Satu sesi latihan berisi ${size}, dengan pembahasan setiap kali kamu menjawab.`,
  answered: (n: number) => `${n} soal dikerjakan`,
  accuracy: (p: number) => `Akurasi ${p}%`,
  noData: "Belum ada latihan",
  weakest: "Paling perlu dilatih",
  start: "Mulai latihan",
  missingElectives: "Mapel pilihan TKA belum diatur. Pilih fokus TKA dan mapel pilihanmu di Action Plan supaya ikut dilatih.",
  missingElectivesCta: "Atur di Action Plan",
};

export const TRYOUT = {
  doneMeta: "Selesai, lihat skor per subtes dan pembahasannya",
  doneDate: (date: string) => `Selesai ${date}`,
  report: "Lihat laporan",
  start: "Kerjakan",
  lockedMeta: (prev: string) => `Terbuka setelah ${prev} selesai`,
  lockedShort: (prev: string) => `Terbuka setelah ${prev}`,
  asideTitle: "Sebelum mulai tryout",
  rules: ["Waktu berjalan per subtes dan tidak bisa dijeda.", "Siapkan tempat yang tenang dan koneksi internet yang stabil.", "Paket berikutnya terbuka setelah paket sebelumnya selesai."],
  statusLabel: { done: "Selesai", open: "Tersedia", locked: "Terkunci" },
};

export const PERFORMANCE = {
  lastScore: "Skor tryout terakhir",
  first: "Pertama",
  delta: (diff: number) => (diff === 0 ? "Sama" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)}`),
  deltaLabel: (diff: number) => (diff === 0 ? "Sama dengan tryout sebelumnya" : `${diff > 0 ? "Naik" : "Turun"} ${Math.abs(diff)} dari tryout sebelumnya`),
  lastName: (name: string, date: string) => `${name}, ${date}`,
  noTryout: "Belum ada tryout",
  noTryoutBody: "Kerjakan tryout pertamamu untuk melihat skor.",
  toTryout: "Buka tab Tryout",
  accuracy: "Akurasi latihan",
  accuracyFrom: (n: number) => `dari ${n} soal latihan`,
  noPractice: "Belum ada latihan",
  noPracticeBody: "Mulai latihan per subtes di tab Latihan Soal.",
  toPractice: "Buka tab Latihan Soal",
  weakest: "Paling perlu dilatih",
  weakestNote: "Porsinya ditambah di Action Plan",
  weakestFromTryout: "Dari skor tryout terakhir",
  trendTitle: "Tren skor tryout",
  trendLabel: (exam: string) => `Grafik tren skor tryout ${exam}`,
  notYet: "Belum dikerjakan",
  trendEmpty: "Grafik muncul setelah kamu menyelesaikan tryout pertama.",
  subTitle: "Skor per subtes, tryout terakhir",
  subEmpty: "Skor per subtes muncul setelah tryout pertama.",
};
