// Penyimpanan kecil di browser (localStorage) untuk data yang belum punya
// endpoint backend. localStorage bisa gagal (mode private, penyimpanan
// diblokir), jadi selalu dibungkus try/catch.

export function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** null = hapus. */
export function writeLocal(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* abaikan: data tetap ada di layar sampai halaman ditutup */
  }
}
