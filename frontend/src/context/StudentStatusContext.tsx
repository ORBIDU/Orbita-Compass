import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MeUser } from "@/types/backend";
import type { LockableFeature, StudentStatus } from "@/types/student";
import * as studentService from "@/services/studentService";
import { useAuth } from "./AuthContext";

interface StudentStatusContextValue {
  /** null = bukan siswa, belum login, atau masih dimuat. */
  status: StudentStatus | null;
  loading: boolean;
  /** true setelah status untuk user saat ini selesai dimuat (berhasil atau gagal). */
  ready: boolean;
  /** true jika bagian ini harus tampil dengan overlay gembok. */
  isLocked: (feature: LockableFeature) => boolean;
  /** Khusus Mode Demo (VITE_USE_MOCK=true). */
  setDemoStatus: (status: StudentStatus) => Promise<void>;
}

// Sesuai docs/SPEK_SISWA.md bagian 5: saat status "baru", Kompas, Performa,
// dan Action Plan terkunci. Status lain tidak mengunci apa pun; bagian yang
// datanya belum ada tampil sebagai empty state, bukan gembok.
const LOCKED_WHEN_BARU: LockableFeature[] = ["compass", "actionPlan", "performa"];

const StudentStatusContext = createContext<StudentStatusContextValue | null>(null);

export function StudentStatusProvider({ children }: { children: ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState<StudentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  // User yang statusnya sudah selesai dimuat, supaya "ready" tidak pernah benar untuk user yang lama.
  const [loadedFor, setLoadedFor] = useState<MeUser | null>(null);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    studentService
      .getStudentStatus(user)
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setLoadedFor(user);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isLocked = useCallback(
    (feature: LockableFeature) => status === "baru" && LOCKED_WHEN_BARU.includes(feature),
    [status],
  );

  const setDemoStatus = useCallback(
    async (next: StudentStatus) => {
      await studentService.setDemoStatus(next);
      // Data profil (mis. hasil tes) ikut berubah sesuai status, jadi ambil ulang user.
      await refreshUser();
    },
    [refreshUser],
  );

  const ready = user !== null && loadedFor === user && !loading;

  const value = useMemo(
    () => ({ status, loading, ready, isLocked, setDemoStatus }),
    [status, loading, ready, isLocked, setDemoStatus],
  );

  return <StudentStatusContext.Provider value={value}>{children}</StudentStatusContext.Provider>;
}

export function useStudentStatus(): StudentStatusContextValue {
  const ctx = useContext(StudentStatusContext);
  if (!ctx) throw new Error("useStudentStatus harus dipakai di dalam <StudentStatusProvider>.");
  return ctx;
}
