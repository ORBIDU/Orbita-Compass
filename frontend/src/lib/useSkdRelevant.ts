import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { getSkdRelevance } from "@/services/practiceService";
import { PLAN_CHANGED_EVENT } from "./persiapan";
import { useAsync } from "./useAsync";

/**
 * true jika Siap SKD relevan untuk siswa yang login (lihat lib/persiapan.ts).
 * Dihitung ulang saat status atau rencana Action Plan berubah. Selama dimuat
 * atau bukan siswa: false.
 */
export function useSkdRelevant(): boolean {
  return useSkdRelevance().relevant;
}

/**
 * Relevansi Siap SKD + apakah perlu keterangan "Kurang selaras dengan profilmu"
 * (hanya jika sudah ada hasil Compass dan aturan tidak terpenuhi; sama dengan
 * jendela Atur rencana). Dipakai menu Persiapan, yang selalu menampilkan SKD.
 */
export function useSkdRelevance(): { relevant: boolean; mismatch: boolean } {
  const { user } = useAuth();
  const { status } = useStudentStatus();
  const enabled = user?.role === "STUDENT" && status !== null && status !== "baru";
  const state = useAsync(() => getSkdRelevance(user?.id ?? ""), [user?.id, status], enabled);
  const { reload } = state;

  useEffect(() => {
    window.addEventListener(PLAN_CHANGED_EVENT, reload);
    return () => window.removeEventListener(PLAN_CHANGED_EVENT, reload);
  }, [reload]);

  const loaded = enabled && state.data !== undefined;
  return { relevant: loaded && state.data!.relevant, mismatch: loaded && state.data!.hasCompass && !state.data!.relevant };
}
