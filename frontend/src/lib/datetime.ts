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

/**
 * "2 September 2026": satu format untuk semua tanggal "Diperbarui …",
 * "Dianalisis …", dan tanggal lahir. Tanggal tanpa jam ("2009-05-15") dibaca
 * sebagai tanggal lokal, bukan UTC.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso.length === 10 ? `${iso}T00:00:00` : iso));
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

// ─── Tanggal tanpa jam (YYYY-MM-DD, jam perangkat) ───────────────────────────

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "2026-09-30" menurut jam lokal perangkat. */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** "2026-09-30" → Date jam 00.00 lokal. */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** 0 = Senin … 6 = Minggu. */
export function weekdayOf(key: string): number {
  return (fromDateKey(key).getDay() + 6) % 7;
}

/** "2026-09" + 1 → "2026-10" */
export function addMonths(yearMonth: string, delta: number): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

/** Hari terakhir bulan "YYYY-MM". */
export function lastDayOfMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split("-").map(Number);
  return toDateKey(new Date(y, m, 0));
}

/** "Rabu, 30 September" */
export function formatDayName(key: string): string {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long" }).format(fromDateKey(key));
}

/** "Rabu" */
export function formatWeekday(key: string): string {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(fromDateKey(key));
}

/** "28 Sep" */
export function formatDayMonthKey(key: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(fromDateKey(key));
}

/** "September 2026" untuk "2026-09". */
export function formatMonthYear(yearMonth: string): string {
  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(fromDateKey(`${yearMonth}-01`));
}
