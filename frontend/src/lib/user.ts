import type { MeUser } from "@/types/backend";

const GRADE_ROMAN: Record<number, string> = { 10: "X", 11: "XI", 12: "XII" };

/** Data user yang siap ditampilkan (header, menu akun, sapaan). */
export interface DisplayUser {
  id: string;
  email: string;
  name: string;
  /**
   * Nama sapaan. Backend belum punya field nama panggilan
   * (docs/API_CONTRACT.md), jadi sementara memakai kata pertama nama lengkap.
   */
  nickname: string;
  initials: string;
  /** Contoh: "Kelas XII IPA", "Guru BK" */
  kelas: string;
  role: MeUser["role"];
  avatarUrl: string | null;
}

export function toDisplayUser(user: MeUser): DisplayUser {
  const words = user.name.trim().split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2 ? `${words[0][0]}${words[1][0]}` : (words[0] ?? "?").slice(0, 2);

  let kelas: string;
  if (user.profile) {
    const grade = GRADE_ROMAN[user.profile.grade] ?? String(user.profile.grade);
    kelas = `Kelas ${grade} ${user.profile.majorTrack}`.trim();
  } else {
    kelas = user.role === "BK_TEACHER" ? "Guru BK" : user.role === "ADMIN" ? "Administrator" : "";
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    nickname: words[0] ?? user.name,
    initials: initials.toUpperCase(),
    kelas,
    role: user.role,
    avatarUrl: user.avatarUrl ?? null,
  };
}
