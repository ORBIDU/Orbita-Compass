import type {
  ActionPlanView,
  PlanOptions,
  PlanPractice,
  PlanSettings,
  PlanSettingsInput,
  TodayPlan,
} from "@/types/actionPlan";
import { TKA_ELECTIVES, TKA_REQUIRED } from "@/types/actionPlan";
import { EXAM_CATEGORY, SUBSCORE_MAX } from "@/types/practice";
import {
  applySettings,
  buildDays,
  buildWeakness,
  durationOptions,
  freezeThrough,
  weaknessKey,
  type PlanState,
  type Weakness,
} from "@/mocks/actionPlanEngine";
import { mockGetPlanState, mockSavePlanState } from "@/mocks/actionPlanMock";
import { aiDelay } from "@/mocks/delay";
import { readLocal, writeLocal } from "@/lib/localStore";
import { toDateKey } from "@/lib/datetime";
import { PLAN_CHANGED_EVENT } from "@/lib/persiapan";
import { getPracticeLog } from "./practiceLog";
import { getRapor } from "./raporService";
import { catalogEntry, getCompassRecommendations } from "./jurusanService";
import { USE_MOCK } from "./config";
import { getToken } from "./http";

// Action Plan: pengaturan rencana + latihan harian yang disusun AI.
// Endpoint /action-plans di backend berisi tugas manual dan tidak cocok, jadi
// belum dipakai (API_CONTRACT bagian 11). Sementara:
// - mode dummy: disimpan di data dummy akun;
// - mode backend: disimpan di browser (localStorage) per akun.
// Penyusun latihannya simulasi (mocks/actionPlanEngine.ts) di kedua mode.

const localKey = (userId: string) => `orbita_action_plan_${userId}`;

async function loadState(userId: string): Promise<PlanState | null> {
  if (USE_MOCK) return mockGetPlanState(getToken());
  return readLocal<PlanState>(localKey(userId));
}

async function saveState(userId: string, state: PlanState): Promise<void> {
  if (USE_MOCK) return mockSavePlanState(getToken(), state);
  writeLocal(localKey(userId), state);
}

/** Nilai rapor semester terakhir yang sudah terisi. */
async function latestRapor(grade: number, now: Date): Promise<{ subject: string; score: number }[]> {
  try {
    const rapor = await getRapor(grade, now);
    const filled = rapor.semesters.filter((s) => s.subjects.length > 0);
    return filled.length ? filled[filled.length - 1].subjects : [];
  } catch {
    return [];
  }
}

/** Skor awal sebelum ada hasil latihan di rencana: nilai rapor (TKA), lalu tryout terakhir tiap ujian. */
async function initialWeakness(userId: string, grade: number, now: Date): Promise<Weakness> {
  const out: Weakness = {};
  const tkaSubjects = new Set<string>([...TKA_REQUIRED, ...TKA_ELECTIVES]);
  for (const { subject, score } of await latestRapor(grade, now)) {
    if (tkaSubjects.has(subject) && score > 0) out[weaknessKey("TKA", subject)] = score / 100;
  }
  try {
    const { tryouts } = await getPracticeLog(userId);
    // Diurutkan dari yang lama, jadi tryout terbaru yang dipakai.
    for (const t of [...tryouts].sort((a, b) => a.completedAt.localeCompare(b.completedAt))) {
      for (const [subject, score] of Object.entries(t.subscores)) {
        const max = SUBSCORE_MAX[t.exam](subject);
        if (max > 0) out[weaknessKey(EXAM_CATEGORY[t.exam], subject)] = score / max;
      }
    }
  } catch {
    /* tanpa data tryout: pakai rapor atau anggap sama */
  }
  return out;
}

/** Pengaturan rencana saja (dipakai Siap SNBP untuk mapel pilihan TKA). null = belum ada rencana. */
export async function getPlanSettings(userId: string): Promise<PlanSettings | null> {
  return (await loadState(userId))?.settings ?? null;
}

/** Rencana lengkap. null = siswa belum mengatur rencana. */
export async function getActionPlan(userId: string, grade: number, now = new Date()): Promise<ActionPlanView | null> {
  const [state, initial] = await Promise.all([loadState(userId), initialWeakness(userId, grade, now)]);
  if (!state) return null;
  const today = toDateKey(now);
  const weakness = buildWeakness(state.days, initial);
  // Hari yang baru lewat dibekukan, supaya isinya tidak berubah lagi.
  if (freezeThrough(state, today, weakness)) await saveState(userId, state);
  return { settings: state.settings, today, days: buildDays(state, weakness) };
}

/** Terapkan pengaturan dari jendela "Atur rencana" (simulasi AI 2–3 detik). */
export async function applyPlan(userId: string, grade: number, input: PlanSettingsInput, now = new Date()): Promise<ActionPlanView> {
  const today = toDateKey(now);
  const [current, initial] = await Promise.all([loadState(userId), initialWeakness(userId, grade, now)]);
  const next = applySettings(current, input, today, buildWeakness(current?.days ?? {}, initial), now.toISOString());
  await aiDelay();
  await saveState(userId, next);
  // Fokus bisa berubah, jadi relevansi Siap SKD di menu perlu dihitung ulang.
  window.dispatchEvent(new Event(PLAN_CHANGED_EVENT));
  return { settings: next.settings, today, days: buildDays(next, buildWeakness(next.days, initial)) };
}

/** Mapel di Compass/rapor → nama mapel pilihan TKA. */
const ELECTIVE_ALIAS: Record<string, string> = {
  Matematika: "Matematika Tingkat Lanjut",
  "Bahasa Indonesia": "Bahasa Indonesia Tingkat Lanjut",
  "Bahasa Inggris": "Bahasa Inggris Tingkat Lanjut",
  "Pendidikan Pancasila": "PPKn",
};

function toElective(subject: string): string | null {
  if ((TKA_ELECTIVES as readonly string[]).includes(subject)) return subject;
  return ELECTIVE_ALIAS[subject] ?? null;
}

/**
 * Bahan jendela "Atur rencana": pilihan durasi, saran mapel pilihan TKA
 * (dari jurusan rekomendasi Compass, lalu nilai rapor tertinggi), dan apakah
 * Compass merekomendasikan kedinasan.
 */
export async function getPlanOptions(grade: number, now = new Date()): Promise<PlanOptions> {
  const compass = await getCompassRecommendations().catch(() => null);
  const suggested: string[] = [];
  const add = (subject: string) => {
    const e = toElective(subject);
    if (e && !suggested.includes(e) && suggested.length < 2) suggested.push(e);
  };
  for (const rec of (compass?.recommendations ?? []).filter((r) => r.slug).slice(0, 3)) {
    for (const s of catalogEntry(rec.slug!)?.supportingSubjects ?? []) add(s);
  }
  if (suggested.length < 2) {
    const rapor = (await latestRapor(grade, now)).filter((s) => (TKA_ELECTIVES as readonly string[]).includes(s.subject));
    for (const s of rapor.sort((a, b) => b.score - a.score)) add(s.subject);
  }
  return {
    durations: durationOptions(toDateKey(now)),
    suggestedElectives: suggested,
    kedinasanFit: compass ? compass.recommendations.some((r) => r.bidang === "kedinasan") : null,
  };
}

/** Ringkasan untuk kartu "Rencana hari ini" di Dashboard (sumber sama dengan Action Plan). */
export async function getTodayPlan(userId: string, grade: number, now = new Date()): Promise<TodayPlan> {
  const plan = await getActionPlan(userId, grade, now);
  if (!plan) return { focus: null, tasks: [], next: null };
  const nextDate = Object.keys(plan.days)
    .filter((d) => d > plan.today && plan.days[d].length > 0)
    .sort()[0];
  const tasks: PlanPractice[] = plan.days[plan.today] ?? [];
  return {
    focus: plan.settings.focus,
    tasks,
    next: nextDate ? { date: nextDate, count: plan.days[nextDate].length } : null,
  };
}
