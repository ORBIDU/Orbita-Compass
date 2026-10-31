import type { UjianKey } from "./navigation";
import type { PlanMinutes, PlanSettingsInput } from "@/types/actionPlan";

// Pengaturan ukuran latihan dan waktu tryout, di satu tempat.

/**
 * Jumlah soal per sesi latihan. Sementara 5 karena bank soal contoh hanya
 * berisi 5 soal per subtes/mapel; kembalikan ke 20 (SNBT/SKD) dan 15 (TKA)
 * saat bank soal resmi tersedia.
 */
export const SESSION_SIZE = 5;

/** Detik per soal untuk menghitung durasi subtes tryout dan perkiraan menit latihan. */
export const SECONDS_PER_QUESTION: Record<UjianKey, number> = { snbt: 90, tka: 120, skd: 60 };

/** Perkiraan menit untuk satu sesi latihan. */
export const sessionMinutes = (exam: UjianKey) => Math.ceil((SESSION_SIZE * SECONDS_PER_QUESTION[exam]) / 60);

/**
 * Batas sisa waktu subtes tryout (detik) yang diumumkan sekali ke pembaca
 * layar. Batas yang lebih panjang dari durasi subtes dilewati.
 */
export const TIME_WARNING_SECONDS = [300, 60];

/** Jumlah latihan Action Plan per hari belajar, menurut waktu belajar (menit). */
export const PRACTICES_PER_DAY: Record<PlanMinutes, number> = { 30: 2, 60: 3, 90: 4 };

/** Perkiraan jumlah latihan per minggu (ditampilkan di jendela Atur rencana). */
export function practicesPerWeek(input: Pick<PlanSettingsInput, "studyDays" | "minutesPerDay">): number {
  return input.studyDays.length * PRACTICES_PER_DAY[input.minutesPerDay];
}
