import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/navigation";

// Pembungkus sementara untuk halaman lama: menyambungkan prop lama
// (onClose, defaultTab) ke router. Isi halaman tidak diubah.
// Setiap halaman dimuat terpisah (lazy) supaya landing lebih cepat terbuka.

const LandingPage = lazy(() => import("@/app/LandingPage"));
const InformasiPribadiPage = lazy(() =>
  import("@/app/StudentProfiling").then((m) => ({ default: m.InformasiPribadiPage })),
);

/** Beranda baru (Fase 2) tidak butuh prop apa pun. */
export function LandingRoute() {
  return <LandingPage />;
}

export function ProfilRoute() {
  const navigate = useNavigate();
  return <InformasiPribadiPage onClose={() => navigate(ROUTES.portal)} defaultTab="data-diri" />;
}
