import type { Achievement } from "@/types/backend";
import type { AchievementInput, AchievementItem, AchievementKind, AchievementLevel } from "@/types/analisis";
import {
  mockAddAchievement,
  mockDeleteAchievement,
  mockListAchievements,
  mockUpdateAchievement,
  type MockAchievementBody,
} from "@/mocks/analisisMock";
import type { MockAchievement } from "@/mocks/db";
import { USE_MOCK } from "./config";
import { getToken, request } from "./http";
import { getProfile } from "./studentService";

/**
 * Backend baru punya tambah dan hapus prestasi dengan field title, category,
 * level, year (API_CONTRACT 8.1). Mengubah prestasi, capaian, penyelenggara,
 * dan unggah sertifikat hanya tersedia di mode dummy.
 */
export const ACHIEVEMENT_FULL_SUPPORT = USE_MOCK;

// Nilai `level` dan `category` yang dipakai backend (lihat seed backend).
const LEVEL_TO_BACKEND: Record<AchievementLevel, string> = {
  Sekolah: "School",
  "Kota/Kabupaten": "City",
  Provinsi: "Province",
  Nasional: "National",
  Internasional: "International",
};
const LEVEL_FROM_BACKEND: Record<string, AchievementLevel> = Object.fromEntries(
  Object.entries(LEVEL_TO_BACKEND).map(([id, en]) => [en.toLowerCase(), id as AchievementLevel]),
);
const KIND_TO_BACKEND: Record<AchievementKind, string> = { akademik: "Academic", nonakademik: "Non-Academic" };

function kindOf(category: string): AchievementKind {
  return /non/i.test(category) ? "nonakademik" : "akademik";
}

function toItem(a: MockAchievement | Achievement): AchievementItem {
  const extra = a as MockAchievement;
  return {
    id: a.id,
    title: a.title,
    kind: kindOf(a.category),
    level: LEVEL_FROM_BACKEND[a.level.toLowerCase()] ?? a.level,
    rank: extra.rank ?? null,
    organizer: extra.organizer ?? null,
    year: a.year,
    certificateName: extra.certificateName ?? null,
  };
}

function toBody(input: AchievementInput, previousCertificate: string | null): MockAchievementBody {
  return {
    title: input.title.trim(),
    category: KIND_TO_BACKEND[input.kind],
    level: LEVEL_TO_BACKEND[input.level],
    year: input.year,
    rank: input.rank.trim() || null,
    organizer: input.organizer.trim() || null,
    certificateName: input.certificateName === undefined ? previousCertificate : input.certificateName,
  };
}

export async function listAchievements(): Promise<AchievementItem[]> {
  const list = USE_MOCK ? (await mockListAchievements(getToken())).achievements : (await getProfile()).achievements;
  return list.map(toItem).sort((a, b) => b.year - a.year);
}

export async function addAchievement(input: AchievementInput): Promise<void> {
  const body = toBody(input, null);
  if (USE_MOCK) {
    await mockAddAchievement(getToken(), body);
    return;
  }
  // Backend hanya menerima field ini; sisanya belum didukung (form menyembunyikannya).
  const { title, category, level, year } = body;
  await request("/achievements", { method: "POST", body: { title, category, level, year } });
}

export async function updateAchievement(id: string, input: AchievementInput, previous: AchievementItem): Promise<void> {
  if (!USE_MOCK) throw new Error("Mengubah prestasi belum didukung backend (API_CONTRACT 8.1).");
  await mockUpdateAchievement(getToken(), id, toBody(input, previous.certificateName));
}

export async function deleteAchievement(id: string): Promise<void> {
  if (USE_MOCK) {
    await mockDeleteAchievement(getToken(), id);
    return;
  }
  await request(`/achievements/${encodeURIComponent(id)}`, { method: "DELETE" });
}
