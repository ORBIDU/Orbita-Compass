// Bentuk data Action Plan (/portal/action-plan) dan kartu "Rencana hari ini"
// di Dashboard. Belum ada endpoint backend yang cocok; bentuknya dicatat di
// docs/API_CONTRACT.md bagian 11.

/** Fokus seleksi yang bisa dipilih (maksimal 2). */
export const PLAN_CATEGORIES = ["SNBT", "TKA", "Kedinasan"] as const;
export type PlanCategory = (typeof PLAN_CATEGORIES)[number];
export const MAX_FOCUS = 2;

/** Mapel wajib TKA SMA. */
export const TKA_REQUIRED = ["Matematika", "Bahasa Indonesia", "Bahasa Inggris"] as const;

/** Mapel pilihan TKA SMA. Siswa memilih sendiri saat mendaftar TKA. */
export const TKA_ELECTIVES = [
  "Matematika Tingkat Lanjut",
  "Bahasa Indonesia Tingkat Lanjut",
  "Bahasa Inggris Tingkat Lanjut",
  "Fisika",
  "Kimia",
  "Biologi",
  "Ekonomi",
  "Sosiologi",
  "Geografi",
  "Sejarah",
  "Antropologi",
  "PPKn",
  "Bahasa Arab",
  "Bahasa Jerman",
  "Bahasa Prancis",
  "Bahasa Jepang",
  "Bahasa Korea",
  "Bahasa Mandarin",
] as const;
export const MAX_TKA_ELECTIVES = 2;

/** Tiga tes SKD sekolah kedinasan. */
export const KEDINASAN_TESTS = [
  { key: "TWK", name: "Tes Wawasan Kebangsaan" },
  { key: "TIU", name: "Tes Intelegensia Umum" },
  { key: "TKP", name: "Tes Karakteristik Pribadi" },
] as const;

/** 0 = Senin … 6 = Minggu. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type PlanDuration = "utbk" | "tka" | "4w" | "8w";
export type PlanMinutes = 30 | 60 | 90;

/** Pengaturan rencana yang dipilih siswa di jendela "Atur rencana". */
export interface PlanSettings {
  focus: PlanCategory[];
  /** Mapel pilihan TKA (maks. 2). Kosong jika TKA tidak dipilih. */
  tkaElectives: string[];
  studyDays: Weekday[];
  duration: PlanDuration;
  minutesPerDay: PlanMinutes;
  /** Hari pertama rencana (YYYY-MM-DD), tidak berubah saat rencana diatur ulang. */
  startDate: string;
  /** Hari terakhir rencana (YYYY-MM-DD). */
  endDate: string;
  updatedAt: string;
}

/** Isian jendela "Atur rencana". */
export type PlanSettingsInput = Pick<PlanSettings, "focus" | "tkaElectives" | "studyDays" | "duration" | "minutesPerDay">;

export type PracticeStatus = "todo" | "in_progress" | "done";

/** Satu latihan soal yang disusun AI untuk satu hari belajar. */
export interface PlanPractice {
  id: string;
  category: PlanCategory;
  /** Kode subtes SNBT, nama mapel TKA, atau kode tes SKD. */
  subject: string;
  title: string;
  questions: number;
  minutes: number;
  status: PracticeStatus;
  /** Soal yang sudah dijawab. */
  answered: number;
  /** Jawaban benar, hanya ada setelah selesai. */
  correct: number | null;
}

/** Rencana lengkap untuk halaman Action Plan. */
export interface ActionPlanView {
  settings: PlanSettings;
  /** Hari ini menurut jam perangkat (YYYY-MM-DD). */
  today: string;
  /** Latihan per tanggal, dari awal sampai akhir rencana (hanya hari belajar). */
  days: Record<string, PlanPractice[]>;
}

/** Pilihan durasi rencana. Tanggal ujian diambil dari timeline seleksi. */
export interface DurationOption {
  value: PlanDuration;
  label: string;
  /** Keterangan di bawah pilihan, mis. "UTBK-SNBT perkiraan April 2027". */
  note?: string;
}

/** Bahan jendela "Atur rencana". */
export interface PlanOptions {
  durations: DurationOption[];
  /** Saran mapel pilihan TKA dari Compass/rapor (siswa tetap memilih sendiri). */
  suggestedElectives: string[];
  /** false = Compass tidak merekomendasikan kedinasan. null = belum ada hasil Compass. */
  kedinasanFit: boolean | null;
}

/** Ringkasan untuk kartu "Rencana hari ini" di Dashboard. */
export interface TodayPlan {
  /** null = belum punya rencana. */
  focus: PlanCategory[] | null;
  tasks: PlanPractice[];
  /** Hari belajar berikutnya setelah hari ini. null = rencana sudah habis. */
  next: { date: string; count: number } | null;
}
