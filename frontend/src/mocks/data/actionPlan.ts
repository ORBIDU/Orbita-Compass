import type { PlanCategory, PlanPractice, PlanSettingsInput } from "@/types/actionPlan";
import { addDays, toDateKey } from "@/lib/datetime";
import {
  PRACTICE_SIZE,
  endDateFor,
  generateDay,
  isStudyDay,
  practiceTitle,
  type PlanState,
} from "../actionPlanEngine";

// Rencana contoh akun demo, mengikuti docs/design/portal/Portal-ActionPlan.dc.html:
// mulai Senin 14 September 2026, hari belajar Senin/Rabu/Jumat/Minggu,
// fokus SNBT dan TKA. Riwayat 14–30 September sama dengan desain (Jumat 25
// September belum selesai). Hari ini selalu 5 latihan, 2 selesai dan 1 sedang
// dikerjakan (sama dengan kartu Dashboard), kalau hari ini hari belajar.

export const DEMO_PLAN_START = "2026-09-14";

export const DEMO_PLAN_INPUT: PlanSettingsInput = {
  focus: ["SNBT", "TKA"],
  tkaElectives: ["Matematika Tingkat Lanjut", "Fisika"],
  studyDays: [0, 2, 4, 6],
  duration: "utbk",
  minutesPerDay: 60,
};

/** [kategori, subtes/mapel, jumlah benar (null = belum dikerjakan)] */
type DemoItem = [PlanCategory, string, number | null];

const HISTORY: Record<string, DemoItem[]> = {
  "2026-09-14": [["SNBT", "PU", 14], ["TKA", "Matematika", 9]],
  "2026-09-16": [["SNBT", "PK", 13], ["SNBT", "LBI", 15]],
  "2026-09-18": [["SNBT", "PM", 15], ["TKA", "Bahasa Inggris", 10]],
  "2026-09-20": [["SNBT", "LBE", 11], ["SNBT", "PBM", 14]],
  "2026-09-21": [["SNBT", "PPU", 13], ["TKA", "Bahasa Indonesia", 12]],
  "2026-09-23": [["SNBT", "PU", 15], ["SNBT", "LBE", 12]],
  "2026-09-25": [["SNBT", "PK", null], ["TKA", "Fisika", null]],
  "2026-09-27": [["SNBT", "PM", 16], ["TKA", "Matematika", 11]],
  "2026-09-28": [["SNBT", "PU", 15], ["TKA", "Bahasa Indonesia", 12], ["SNBT", "PK", 14]],
  "2026-09-30": [["SNBT", "PM", 16], ["SNBT", "LBE", 13], ["TKA", "Matematika", 11], ["SNBT", "PU", 15], ["TKA", "Bahasa Inggris", 10]],
};

/** Hari ini: 2 selesai, 1 sedang dikerjakan (6 soal), 2 belum. */
const TODAY: { item: DemoItem; answered: number }[] = [
  { item: ["SNBT", "PM", 16], answered: 20 },
  { item: ["SNBT", "LBE", 13], answered: 20 },
  { item: ["TKA", "Matematika", null], answered: 6 },
  { item: ["SNBT", "PU", null], answered: 0 },
  { item: ["TKA", "Bahasa Inggris", null], answered: 0 },
];

function practice(date: string, index: number, [category, subject, correct]: DemoItem, answered?: number): PlanPractice {
  const size = PRACTICE_SIZE[category];
  const done = correct !== null;
  const progress = answered ?? (done ? size.questions : 0);
  return {
    id: `${date}-${index + 1}`,
    category,
    subject,
    title: practiceTitle(category, subject),
    ...size,
    status: done ? "done" : progress > 0 ? "in_progress" : "todo",
    answered: done ? size.questions : progress,
    correct,
  };
}

/** Rencana contoh dengan riwayat sampai hari ini. */
export function demoPlanState(now: Date): PlanState {
  const today = toDateKey(now);
  const state: PlanState = {
    settings: {
      ...DEMO_PLAN_INPUT,
      startDate: DEMO_PLAN_START,
      endDate: endDateFor(DEMO_PLAN_INPUT.duration, DEMO_PLAN_START),
      updatedAt: `${DEMO_PLAN_START}T07:00:00.000Z`,
    },
    days: {},
    frozenThrough: today,
  };

  let date = DEMO_PLAN_START;
  let n = 0;
  while (date < today) {
    if (HISTORY[date]) {
      state.days[date] = HISTORY[date].map((item, i) => practice(date, i, item));
    } else if (isStudyDay(state.settings, date)) {
      // Hari belajar setelah contoh desain: dianggap sudah dikerjakan dengan skor 60–85%.
      state.days[date] = generateDay(state.settings, date, {}).map((p) => {
        const correct = Math.round(p.questions * (0.6 + ((n++ * 7) % 26) / 100));
        return { ...p, status: "done", answered: p.questions, correct };
      });
    }
    date = addDays(date, 1);
  }
  if (isStudyDay(state.settings, today)) {
    state.days[today] = TODAY.map(({ item, answered }, i) => practice(today, i, item, answered));
  }
  return state;
}
