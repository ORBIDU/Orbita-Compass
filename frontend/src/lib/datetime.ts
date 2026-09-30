// Format tanggal dan sapaan waktu (bahasa Indonesia, jam perangkat).

/**
 * Sapaan sesuai jam (docs/SPEK_SISWA.md bagian 5):
 * pagi 04.00–10.59, siang 11.00–14.59, sore 15.00–17.59, malam 18.00–03.59.
 */
export function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h >= 4 && h < 11) return "Selamat pagi";
  if (h >= 11 && h < 15) return "Selamat siang";
  if (h >= 15 && h < 18) return "Selamat sore";
  return "Selamat malam";
}

/** "Rabu, 30 September 2026" */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

/** "12 Sep 2026" */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

/** "26 Sep" (tanpa tahun) */
export function formatDayMonth(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(iso));
}

/** "2026-11" → { month: "Nov", year: "2026" } */
export function splitMonth(yearMonth: string): { month: string; year: string } {
  const [y, m] = yearMonth.split("-").map(Number);
  const month = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(new Date(y, m - 1, 1));
  return { month, year: String(y) };
}
