// File halaman (chunk) bisa gagal dimuat kalau situs baru saja di-update
// saat siswa masih membuka versi lama: nama file lama sudah tidak ada.
// Solusinya muat ulang halaman, tapi hanya SEKALI supaya tidak berulang terus
// kalau masalahnya lain (mis. internet putus).

const KEY = "orbidu_reload_at";
/** Muat ulang otomatis berikutnya baru boleh setelah jeda ini. */
const WINDOW_MS = 10_000;

/** true kalau error berasal dari file halaman yang gagal dimuat. */
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(message);
}

/**
 * Menandai bahwa halaman akan dimuat ulang, dan mengembalikan false kalau
 * baru saja dimuat ulang (atau sessionStorage tidak bisa dipakai).
 */
export function claimReload(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last < WINDOW_MS) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
}
