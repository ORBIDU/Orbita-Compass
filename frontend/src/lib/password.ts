import { MIN_PASSWORD } from "@/content/auth";

export type PasswordProblem = "short" | "mix" | "same";

/**
 * Aturan password baru (Profil dan aktivasi akun): minimal MIN_PASSWORD
 * karakter, campuran huruf dan angka, dan berbeda dari password lama kalau
 * diketahui. Pesannya diambil masing-masing halaman dari content/.
 */
export function passwordProblem(next: string, current?: string): PasswordProblem | null {
  if (next.length < MIN_PASSWORD) return "short";
  if (!/[a-zA-Z]/.test(next) || !/\d/.test(next)) return "mix";
  if (current !== undefined && next === current) return "same";
  return null;
}
