import type { MeUser } from "@/types/backend";

const GRADE_ROMAN: Record<number, string> = { 10: "X", 11: "XI", 12: "XII" };

/**
 * Satu format kelas untuk semua halaman: "Kelas XII". Jurusan SMA (IPA/IPS)
 * sengaja tidak ditampilkan karena backend mengisi "IPA" untuk semua siswa
 * baru (docs/API_CONTRACT.md bagian 2.2).
 */
export function formatKelas(grade: number | null | undefined): string {
  if (!grade) return "";
  return `Kelas ${GRADE_ROMAN[grade] ?? grade}`;
}

/** Data user yang siap ditampilkan (header, menu akun, sapaan). */
export interface DisplayUser {
  id: string;
  email: string;
  name: string;
  /**
   * Nama sapaan: nama panggilan dari profil. Kalau kosong (backend belum punya
   * field-nya, docs/API_CONTRACT.md bagian 2.3), memakai kata pertama nama lengkap.
   */
  nickname: string;
  initials: string;
  /** Contoh: "Kelas XII", "Guru BK" (lihat formatKelas) */
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
    kelas = formatKelas(user.profile.grade);
  } else {
    kelas = user.role === "BK_TEACHER" ? "Guru BK" : user.role === "ADMIN" ? "Administrator" : "";
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    nickname: user.profile?.nickname?.trim() || words[0] || user.name,
    initials: initials.toUpperCase(),
    kelas,
    role: user.role,
    avatarUrl: user.avatarUrl ?? null,
  };
}
