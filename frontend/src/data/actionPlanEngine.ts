import type {
  DurationOption,
  PlanCategory,
  PlanDuration,
  PlanPractice,
  PlanSettings,
  PlanSettingsInput,
  Weekday,
} from "@/types/actionPlan";
import { KEDINASAN_TESTS, TKA_REQUIRED } from "@/types/actionPlan";
import { SNBT_SUBTESTS } from "@/types/dashboard";
import { addDays, formatMonthYear, lastDayOfMonth, weekdayOf } from "@/lib/datetime";
import { SELECTION_TIMELINE } from "./timeline";
import { PRACTICES_PER_DAY, SESSION_SIZE, sessionMinutes } from "@/config/practice";

// Sementara, dipakai juga di mode backend sampai endpoint Action Plan (/study-plan dan latihan harian, API_CONTRACT 11.1–11.2) ada.
//
// Simulasi "AI penyusun Action Plan" (aturan data nomor 4 di CLAUDE.md).
// Aturannya sederhana:
// - Latihan hanya muncul di hari belajar yang dipilih siswa, di dalam masa rencana.
// - Jumlah latihan per hari mengikuti waktu belajar (30/60/90 menit → 2/3/4 latihan).
// - Kategori bergiliran di antara fokus yang dipilih.
// - Subtes/mapel dipilih acak berbobot: skor terendah dapat porsi lebih.
//   Acaknya tetap per tanggal, jadi isi hari tidak berubah setiap halaman dibuka.
// - Hari ini dan hari yang sudah lewat "dibekukan" (disimpan), jadi mengatur
//   ulang rencana hanya mengubah hari yang akan datang.

/** Data rencana yang disimpan (mode dummy: di akun; mode backend: di browser). */
export interface PlanState {
  settings: PlanSettings;
  /** Latihan yang sudah dibekukan: hari ini dan hari yang sudah lewat. */
  days: Record<string, PlanPractice[]>;
  /** Tanggal terakhir yang sudah dibekukan (YYYY-MM-DD). */
  frozenThrough: string;
}

/** Skor 0–1 per `${kategori}:${subtes}`. Makin rendah, makin perlu dilatih. */
export type Weakness = Record<string, number>;

/** Ukuran satu latihan per kategori (config/practice.ts: SESSION_SIZE dan detik per soal). */
export const PRACTICE_SIZE: Record<PlanCategory, { questions: number; minutes: number }> = {
  SNBT: { questions: SESSION_SIZE, minutes: sessionMinutes("snbt") },
  TKA: { questions: SESSION_SIZE, minutes: sessionMinutes("tka") },
  Kedinasan: { questions: SESSION_SIZE, minutes: sessionMinutes("skd") },
};

/** Skor anggapan untuk subtes yang belum punya data. */
const DEFAULT_SCORE = 0.6;

export const weaknessKey = (category: PlanCategory, subject: string) => `${category}:${subject}`;

export function practiceTitle(category: PlanCategory, subject: string): string {
  if (category === "SNBT") return `Latihan ${SNBT_SUBTESTS.find((s) => s.key === subject)?.name ?? subject}`;
  if (category === "TKA") return `Latihan TKA ${subject}`;
  return `Latihan ${KEDINASAN_TESTS.find((t) => t.key === subject)?.name ?? subject}`;
}

function subjectsFor(category: PlanCategory, settings: Pick<PlanSettings, "tkaElectives">): string[] {
  if (category === "SNBT") return SNBT_SUBTESTS.map((s) => s.key);
  if (category === "TKA") return [...TKA_REQUIRED, ...settings.tkaElectives];
  return KEDINASAN_TESTS.map((t) => t.key);
}

// ─── Acak yang tetap (seeded) ────────────────────────────────────────────────

function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Nomor hari sejak 1970 (untuk giliran kategori). */
function dayNumber(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

// ─── Penyusun latihan ────────────────────────────────────────────────────────

export function isStudyDay(settings: PlanSettings, date: string): boolean {
  return date >= settings.startDate && date <= settings.endDate && settings.studyDays.includes(weekdayOf(date) as Weekday);
}

/** Latihan untuk satu hari belajar, semuanya belum dikerjakan. */
export function generateDay(settings: PlanSettings, date: string, weakness: Weakness): PlanPractice[] {
  const random = seededRandom(hashString(`${date}|${settings.focus.join(",")}|${settings.tkaElectives.join(",")}`));
  const count = PRACTICES_PER_DAY[settings.minutesPerDay];
  const offset = dayNumber(date);
  const used = new Set<string>();
  const out: PlanPractice[] = [];

  for (let i = 0; i < count; i++) {
    const category = settings.focus[(i + offset) % settings.focus.length];
    let pool = subjectsFor(category, settings).filter((s) => !used.has(weaknessKey(category, s)));
    if (pool.length === 0) pool = subjectsFor(category, settings);
    // Bobot (1 − skor)²: subtes dengan skor terendah lebih sering muncul.
    const weights = pool.map((s) => (1 - (weakness[weaknessKey(category, s)] ?? DEFAULT_SCORE)) ** 2 + 0.02);
    let pick = random() * weights.reduce((a, b) => a + b, 0);
    let index = 0;
    while (index < pool.length - 1 && pick >= weights[index]) pick -= weights[index++];
    const subject = pool[index];
    used.add(weaknessKey(category, subject));
    out.push({
      id: `${date}-${i + 1}`,
      category,
      subject,
      title: practiceTitle(category, subject),
      ...PRACTICE_SIZE[category],
      status: "todo",
      answered: 0,
      correct: null,
    });
  }
  return out;
}

/** Bekukan hari yang belum dibekukan sampai `today`. true jika ada perubahan. */
export function freezeThrough(state: PlanState, today: string, weakness: Weakness): boolean {
  if (state.frozenThrough >= today) return false;
  let date = addDays(state.frozenThrough, 1);
  while (date <= today) {
    if (isStudyDay(state.settings, date)) state.days[date] = generateDay(state.settings, date, weakness);
    date = addDays(date, 1);
  }
  state.frozenThrough = today;
  return true;
}

/** Semua latihan dari awal sampai akhir rencana: yang dibekukan + hari yang akan datang. */
export function buildDays(state: PlanState, weakness: Weakness): Record<string, PlanPractice[]> {
  const days: Record<string, PlanPractice[]> = structuredClone(state.days);
  let date = addDays(state.frozenThrough, 1);
  while (date <= state.settings.endDate) {
    if (isStudyDay(state.settings, date)) days[date] = generateDay(state.settings, date, weakness);
    date = addDays(date, 1);
  }
  return days;
}

/**
 * Skor per subtes: rata-rata hasil latihan di rencana ini. Kalau belum ada,
 * pakai skor tryout SNBT (0–1000) atau nilai rapor (0–100) dari `fallback`.
 */
export function buildWeakness(days: Record<string, PlanPractice[]>, fallback: Weakness): Weakness {
  const sums = new Map<string, { correct: number; total: number }>();
  for (const list of Object.values(days)) {
    for (const p of list) {
      if (p.status !== "done" || p.correct === null) continue;
      const key = weaknessKey(p.category, p.subject);
      const s = sums.get(key) ?? { correct: 0, total: 0 };
      s.correct += p.correct;
      s.total += p.questions;
      sums.set(key, s);
    }
  }
  const out: Weakness = { ...fallback };
  for (const [key, s] of sums) if (s.total > 0) out[key] = s.correct / s.total;
  return out;
}

// ─── Durasi ──────────────────────────────────────────────────────────────────

/** Bulan perkiraan ujian dari timeline seleksi (sumber yang sama dengan Dashboard). */
function examMonth(prefix: "utbk-" | "tka-", today: string): string | null {
  const thisMonth = today.slice(0, 7);
  return SELECTION_TIMELINE.find((e) => e.id.startsWith(prefix) && e.month >= thisMonth)?.month ?? null;
}

export function durationOptions(today: string): DurationOption[] {
  const out: DurationOption[] = [];
  const utbk = examMonth("utbk-", today);
  const tka = examMonth("tka-", today);
  // Label pendek supaya tidak terpotong di HP 360px; bulan perkiraan jadi keterangan.
  if (utbk) out.push({ value: "utbk", label: "Sampai UTBK-SNBT", note: `UTBK-SNBT perkiraan ${formatMonthYear(utbk)}` });
  if (tka) out.push({ value: "tka", label: "Sampai TKA", note: `TKA perkiraan ${formatMonthYear(tka)}` });
  out.push({ value: "4w", label: "4 minggu" }, { value: "8w", label: "8 minggu" });
  return out;
}

/** Hari terakhir rencana. Ujian: akhir bulan perkiraannya. Minggu: dihitung dari `from`. */
export function endDateFor(duration: PlanDuration, from: string): string {
  if (duration === "4w") return addDays(from, 4 * 7 - 1);
  if (duration === "8w") return addDays(from, 8 * 7 - 1);
  const month = examMonth(duration === "utbk" ? "utbk-" : "tka-", from);
  return month ? lastDayOfMonth(month) : addDays(from, 8 * 7 - 1);
}

/**
 * Terapkan pengaturan baru. Rencana pertama mulai hari ini. Rencana yang
 * diatur ulang berlaku mulai besok: hari ini dan hari yang sudah lewat tetap.
 */
export function applySettings(
  state: PlanState | null,
  input: PlanSettingsInput,
  today: string,
  weakness: Weakness,
  nowIso: string,
): PlanState {
  const clean: PlanSettingsInput = {
    ...input,
    tkaElectives: input.focus.includes("TKA") ? input.tkaElectives : [],
    studyDays: [...input.studyDays].sort((a, b) => a - b),
  };
  if (!state) {
    return {
      settings: { ...clean, startDate: today, endDate: endDateFor(clean.duration, today), updatedAt: nowIso },
      days: {},
      frozenThrough: addDays(today, -1),
    };
  }
  const next: PlanState = structuredClone(state);
  freezeThrough(next, today, weakness);
  next.settings = {
    ...clean,
    startDate: state.settings.startDate,
    endDate: endDateFor(clean.duration, addDays(today, 1)),
    updatedAt: nowIso,
  };
  return next;
}
