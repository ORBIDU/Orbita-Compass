import type { ProfileResponse, StudentProfileDetail } from "@/types/backend";
import type { StudentStatus } from "@/types/student";
import { ApiError } from "@/services/http";
import { accountFromToken, updateAccount, type MockAccount } from "./db";
import { findMajor, findUniversity } from "./data/ptn";
import { delay } from "./delay";
import { simulateCompass } from "./compassEngine";

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
    achievements: account.achievements,
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
    // Siswa yang sudah asesmen di Mode Demo dianggap sudah membuka Compass.
    if (status !== "baru" && !a.compassAnalysis && a.assessment && a.profile) {
      a.compassAnalysis = simulateCompass(a.assessment, a.academicRecords.map((r) => r.score), a.achievements.length, a.profile.id);
    }
  });
  return status;
}
