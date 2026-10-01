import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/navigation";

// Halaman lama berpindah halaman dengan onNavigate("compass"), onNavigate("tka"),
// dan seterusnya (kode halaman sebelum ada router). Tabel ini menerjemahkannya
// ke URL baru. Hapus berkas ini setelah semua halaman lama dirombak.
const LEGACY_PAGE_TO_ROUTE: Record<string, string | null> = {
  landing: ROUTES.landing,
  dashboard: ROUTES.portal,
  profil: ROUTES.analisisPotensi,
  compass: ROUTES.compass,
  action: ROUTES.actionPlan,
  snbp: ROUTES.persiapanSnbp,
  ptn: ROUTES.persiapanUjian("snbt"),
  utbk: ROUTES.persiapanUjian("snbt"),
  tka: ROUTES.persiapanUjian("tka"),
  skd: ROUTES.persiapanUjian("skd"),
  kampus: ROUTES.jurusan,
  // Di luar cakupan tahap ini / belum tersedia: tombolnya tidak melakukan apa-apa.
  mandiri: null,
  konsultasi: null,
};

/** Fungsi pengganti prop onNavigate lama. */
export function useLegacyNavigate(): (page: string) => void {
  const navigate = useNavigate();
  return useCallback(
    (page: string) => {
      const to = LEGACY_PAGE_TO_ROUTE[page];
      if (to) navigate(to);
      else if (import.meta.env.DEV) console.info(`[legacyNav] Halaman "${page}" belum tersedia.`);
    },
    [navigate],
  );
}
