import type { MeUser } from "@/types/backend";
import { NICKNAME_MAX, type ProfilView, type SchoolProfile } from "@/types/profil";
import { EMPTY_SCHOOL_PROFILE } from "@/data/profilKosong";
import { readLocal, writeLocal } from "@/lib/localStore";
import { getToken } from "./http";

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/profilMock");

// Profil siswa (API_CONTRACT bagian 13). Data diri diisi pihak kurikulum
// sekolah dan hanya dibaca siswa. Siswa hanya mengubah nama panggilan, foto,
// dan password. Dengan backend asli:
// - data diri: hanya yang sudah ada di backend (nama, email, kelas, sekolah, kota);
// - nama panggilan dan foto: disimpan di browser per akun;
// - ganti password: belum tersedia.

interface LocalProfil {
  nickname: string | null;
  avatarUrl: string | null;
}
const localKey = (userId: string) => `orbidu_profil_${userId}`;
const readLocalProfil = (userId: string): LocalProfil => readLocal<LocalProfil>(localKey(userId)) ?? { nickname: null, avatarUrl: null };

export async function getProfil(user: MeUser): Promise<ProfilView> {
  const base = {
    name: user.name,
    email: user.email,
    grade: user.profile?.grade ?? null,
    schoolName: user.profile?.schoolName?.trim() || null,
  };
  if (USE_MOCK) {
    const data = await (await mock()).mockGetProfil(getToken());
    return { ...base, ...data, savedOnServer: true, canChangePassword: true };
  }
  const local = readLocalProfil(user.id);
  const school: SchoolProfile = structuredClone(EMPTY_SCHOOL_PROFILE);
  school.address.city = user.profile?.city?.trim() || null;
  return {
    ...base,
    school,
    nickname: local.nickname,
    avatarUrl: local.avatarUrl,
    parentConsentAt: undefined,
    savedOnServer: false,
    canChangePassword: false,
  };
}

export async function setNickname(userId: string, nickname: string): Promise<void> {
  const value = nickname.trim().slice(0, NICKNAME_MAX);
  if (USE_MOCK) return (await mock()).mockSetNickname(getToken(), value);
  writeLocal(localKey(userId), { ...readLocalProfil(userId), nickname: value });
}

/** `dataUrl` = gambar yang sudah dikecilkan (lib/avatar.ts). null = hapus foto. */
export async function setAvatar(userId: string, dataUrl: string | null): Promise<void> {
  if (USE_MOCK) return (await mock()).mockSetAvatar(getToken(), dataUrl);
  writeLocal(localKey(userId), { ...readLocalProfil(userId), avatarUrl: dataUrl });
}

export async function changePassword(current: string, next: string): Promise<void> {
  if (USE_MOCK) return (await mock()).mockChangePassword(getToken(), current, next);
  throw new Error("Ganti password belum tersedia di backend (API_CONTRACT 13.3).");
}

/**
 * Mode backend: gabungkan nama panggilan dan foto yang tersimpan di browser ke
 * data user, supaya sapaan Dashboard dan avatar header ikut berubah.
 */
export function withLocalProfil(user: MeUser): MeUser {
  if (USE_MOCK) return user;
  const local = readLocalProfil(user.id);
  return {
    ...user,
    avatarUrl: local.avatarUrl ?? user.avatarUrl ?? null,
    profile: user.profile ? { ...user.profile, nickname: local.nickname ?? user.profile.nickname ?? null } : user.profile,
  };
}
