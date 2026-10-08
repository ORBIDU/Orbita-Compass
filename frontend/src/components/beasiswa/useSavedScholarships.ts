import { useCallback, useEffect, useState } from "react";
import { CARD } from "@/content/beasiswa";
import { getSavedScholarships, setScholarshipSaved } from "@/services/beasiswaService";

/**
 * Daftar beasiswa yang disimpan siswa. Tampilan langsung berubah saat
 * diklik, lalu dikembalikan jika penyimpanan gagal.
 */
export function useSavedScholarships(userId: string, enabled = true) {
  const [ids, setIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !userId) return;
    let active = true;
    getSavedScholarships(userId)
      .then((list) => active && setIds(list))
      .catch(() => active && setIds([]))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [userId, enabled]);

  const toggle = useCallback(
    async (id: string) => {
      if (busyId) return;
      const wasSaved = ids.includes(id);
      const before = ids;
      setIds(wasSaved ? ids.filter((x) => x !== id) : [...ids, id]);
      setBusyId(id);
      setError(null);
      try {
        setIds(await setScholarshipSaved(userId, id, !wasSaved));
      } catch {
        setIds(before);
        setError(CARD.saveError);
      } finally {
        setBusyId(null);
      }
    },
    [busyId, ids, userId],
  );

  return { ids, loaded, busyId, error, toggle };
}
