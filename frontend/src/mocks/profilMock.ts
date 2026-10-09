import type { SchoolProfile } from "@/types/profil";
import { ApiError } from "@/services/http";
import { PASSWORD_DIALOG } from "@/content/profil";
import { updateAccount } from "./db";
import { requireAccount } from "./studentMock";
import { delay } from "@/lib/delay";

// Tiruan data Profil (API_CONTRACT bagian 13). Data diri dari sekolah hanya
// bisa dibaca; siswa hanya mengubah nama panggilan, foto, dan password.

export async function mockGetProfil(token: string | null): Promise<{
  school: SchoolProfile;
  nickname: string | null;
  avatarUrl: string | null;
  parentConsentAt: string | null;
}> {
  await delay(250);
  const a = requireAccount(token);
  return {
    school: structuredClone(a.schoolProfile),
    nickname: a.profile?.nickname ?? null,
    avatarUrl: a.avatarUrl,
    parentConsentAt: a.parentConsentAt ?? null,
  };
}

/** Tiruan PUT /profile/nickname. */
export async function mockSetNickname(token: string | null, nickname: string): Promise<void> {
  await delay(300);
  const a = requireAccount(token);
  updateAccount(a.id, (acc) => {
    if (acc.profile) acc.profile.nickname = nickname;
  });
}

/** Tiruan POST /profile/avatar (mode dummy: gambar kecil disimpan sebagai pratinjau). */
export async function mockSetAvatar(token: string | null, dataUrl: string | null): Promise<void> {
  await delay(400);
  const a = requireAccount(token);
  updateAccount(a.id, (acc) => {
    acc.avatarUrl = dataUrl;
  });
}

/** Tiruan PUT /auth/password: password sekarang dicek dulu. */
export async function mockChangePassword(token: string | null, current: string, next: string): Promise<void> {
  await delay(500);
  const a = requireAccount(token);
  if (a.password !== current) throw new ApiError(400, PASSWORD_DIALOG.currentWrong);
  updateAccount(a.id, (acc) => {
    acc.password = next;
  });
}
