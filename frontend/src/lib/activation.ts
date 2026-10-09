import type { MeUser } from "@/types/backend";
import type { StudentStatus } from "@/types/student";
import { ROUTES } from "@/config/navigation";

export type ActivationStep = "password" | "consent";

/**
 * Langkah aktivasi yang masih harus dikerjakan siswa saat pertama masuk, atau
 * null jika sudah beres. Field yang tidak dikirim (undefined, mis. backend
 * asli yang belum punya penandanya) dianggap tidak wajib, jadi /aktivasi
 * dilewati. Lihat API_CONTRACT 2.4 dan 14.2.
 */
export function activationStep(user: MeUser | null): ActivationStep | null {
  if (!user || user.role !== "STUDENT") return null;
  if (user.mustChangePassword === true) return "password";
  if (user.parentConsentAt === null || user.termsAcceptedAt === null) return "consent";
  return null;
}

/** Halaman asal yang dibawa lewat `state` saat diminta login atau aktivasi (bukan /aktivasi itu sendiri). */
export function fromState(state: unknown): string | undefined {
  const from = (state as { from?: string } | null)?.from;
  return from?.startsWith(ROUTES.aktivasi) ? undefined : from;
}

/**
 * Tujuan setelah berhasil masuk (atau selesai aktivasi), sesuai SPEK bagian 3:
 * status "baru" → Analisis Potensi; selain itu → halaman yang tadi dibuka
 * sebelum diminta login, atau /portal.
 */
export function portalTarget(studentStatus: StudentStatus | null, from: string | undefined): string {
  return studentStatus === "baru" ? ROUTES.analisisPotensi : (from ?? ROUTES.portal);
}
