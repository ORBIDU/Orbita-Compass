import type { ProfileResponse, StudentProfileDetail } from "@/types/backend";
import type { StudentStatus } from "@/types/student";
import { ApiError } from "@/services/http";
import { accountFromToken, updateAccount, type MockAccount } from "./db";
import { findMajor, findUniversity } from "./data/ptn";
import { delay } from "@/lib/delay";
import { simulateCompass } from "./compassEngine";
import { demoPlanState } from "./data/actionPlan";

/**
 * Profil lengkap seperti respons GET /profile, disesuaikan dengan status:
 * saat status "baru", hasil tes dan hasil Compass disembunyikan.
 */
export function buildProfileDetail(account: MockAccount): StudentProfileDetail | null {
  if (!account.profile) return null;
  const sudahAsesmen = account.status !== "baru";
  return {
    ...account.profile,
    academicRecords: account.academicRecords,
    // Hanya field yang ada di backend; capaian/penyelenggara/sertifikat lewat achievementService.
    achievements: account.achievements.map(({ rank: _r, organizer: _o, certificateName: _c, ...a }) => a),
    reflection: account.reflection,
    assessment: sudahAsesmen ? account.assessment : null,
    targetPtn: findUniversity(account.profile.targetPtnId),
    targetMajor: findMajor(account.profile.targetMajorId),
  };
}

export function requireAccount(token: string | null): MockAccount {
  const account = accountFromToken(token);
  if (!account) throw new ApiError(401, "Sesi kamu sudah berakhir. Silakan masuk lagi.");
  return account;
}

/** Tiruan GET /profile. */
export async function mockGetProfile(token: string | null): Promise<ProfileResponse> {
  await delay();
  const profile = buildProfileDetail(requireAccount(token));
  if (!profile) throw new ApiError(404, "Profil siswa belum ada.");
  return { profile };
}

export async function mockGetStatus(token: string | null): Promise<StudentStatus> {
  await delay(150);
  return requireAccount(token).status;
}

/**
 * Hanya untuk panel Mode Demo. Kalau akun belum punya hasil tes, status
 * "sudah_asesmen"/"aktif" diberi hasil tes contoh supaya halaman bisa dicoba.
 */
export async function mockSetStatus(token: string | null, status: StudentStatus): Promise<StudentStatus> {
  const account = requireAccount(token);
  updateAccount(account.id, (a) => {
    a.status = status;
    if (status !== "baru" && a.assessmentGrade === null) a.assessmentGrade = a.profile?.grade ?? null;
    if (status !== "baru" && !a.assessment && a.profile) {
      a.assessment = {
        id: `asm-${a.id}`,
        profileId: a.profile.id,
        technology: 72,
        research: 68,
        creativity: 80,
        leadership: 64,
        communication: 76,
        updatedAt: new Date().toISOString(),
      };
    }
    // Action Plan: "aktif" = punya rencana (contoh desain kalau belum ada);
    // status lain = belum ada rencana. Rencananya disimpan dulu, tidak dihapus.
    if (status === "aktif" && !a.actionPlan) {
      a.actionPlan = a.actionPlanStash ?? demoPlanState(new Date());
      a.actionPlanStash = null;
    } else if (status !== "aktif" && a.actionPlan) {
      a.actionPlanStash = a.actionPlan;
      a.actionPlan = null;
    }
    // Riwayat latihan/tryout: disimpan dulu saat status bukan "aktif", kembali saat "aktif".
    if (status === "aktif" && a.practiceStash) {
      a.practiceLog = a.practiceStash.log;
      a.practiceSessions = a.practiceStash.sessions;
      a.tryoutAttempts = a.practiceStash.attempts;
      a.practiceStash = null;
    } else if (status !== "aktif" && !a.practiceStash) {
      a.practiceStash = { log: a.practiceLog, sessions: a.practiceSessions, attempts: a.tryoutAttempts };
      a.practiceLog = { free: [], tryouts: [] };
      a.practiceSessions = {};
      a.tryoutAttempts = {};
    }
    // Siswa yang sudah asesmen di Mode Demo dianggap sudah membuka Compass.
    if (status !== "baru" && !a.compassAnalysis && a.assessment && a.profile) {
      a.compassAnalysis = simulateCompass(a.assessment, a.academicRecords.map((r) => r.score), a.achievements.length, a.profile.id);
    }
  });
  return status;
}
