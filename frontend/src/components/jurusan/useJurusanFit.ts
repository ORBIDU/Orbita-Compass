import { useEffect, useState } from "react";
import type { FitLabel } from "@/types/jurusan";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { getFitLabels } from "@/services/jurusanService";

/**
 * Label kecocokan Compass per slug jurusan. Hanya untuk siswa yang sudah
 * login dan sudah asesmen; selain itu selalu objek kosong.
 */
export function useJurusanFit(): Record<string, FitLabel> {
  const { status: authStatus } = useAuth();
  const { status } = useStudentStatus();
  const eligible = authStatus === "authenticated" && (status === "sudah_asesmen" || status === "aktif");
  const [labels, setLabels] = useState<Record<string, FitLabel>>({});

  useEffect(() => {
    if (!eligible) {
      setLabels({});
      return;
    }
    let active = true;
    getFitLabels()
      .then((l) => active && setLabels(l))
      .catch(() => active && setLabels({}));
    return () => {
      active = false;
    };
  }, [eligible]);

  return labels;
}
