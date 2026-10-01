import { useCallback, useEffect, useState, type DependencyList } from "react";

export interface AsyncState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
  /** Muat ulang (mis. tombol "Coba lagi"). */
  reload: () => void;
}

/**
 * Menjalankan fungsi async saat `deps` berubah dan menyimpan hasilnya.
 * Hasil permintaan lama diabaikan jika deps sudah berubah lagi.
 * `enabled: false` = tidak memuat apa pun (mis. bagian yang terkunci).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList, enabled = true): AsyncState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(enabled);
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    fn()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: unknown) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // fn sengaja tidak dimasukkan: pemanggil menentukan kapan memuat ulang lewat deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, attempt]);

  return { data, error, loading, reload };
}
