import { lazy, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toDisplayUser } from "@/lib/user";
import { useLegacyNavigate } from "@/lib/legacyNav";
import { ROUTES, UJIAN_KEYS, type UjianKey } from "@/config/navigation";
import type { ProfileTab } from "@/app/StudentProfiling";
import { FeatureGate } from "./guards";

// Pembungkus sementara untuk halaman lama: menyambungkan prop lama
// (onNavigate, onBack, currentUser) ke router. Isi halaman tidak diubah.
// Setiap halaman dimuat terpisah (lazy) supaya landing lebih cepat terbuka.

const LandingPage = lazy(() => import("@/app/LandingPage"));
const DashboardPage = lazy(() => import("@/app/DashboardPage"));
const CompassPage = lazy(() => import("@/app/CompassPage"));
const ActionPlanPage = lazy(() => import("@/app/ActionPlanPage"));
const SiapPTNPage = lazy(() => import("@/app/SiapPTNPage"));
const LatihanTKAPage = lazy(() => import("@/app/LatihanTKAPage"));
const SiapSKDPage = lazy(() => import("@/app/SiapSKDPage"));
const StudentProfiling = lazy(() => import("@/app/StudentProfiling").then((m) => ({ default: m.StudentProfiling })));
const InformasiPribadiPage = lazy(() =>
  import("@/app/StudentProfiling").then((m) => ({ default: m.InformasiPribadiPage })),
);
const NotFoundPage = lazy(() => import("@/app/NotFoundPage"));
export const JurusanPage = lazy(() => import("@/app/JurusanPage"));

export function LandingRoute() {
  const navigate = useNavigate();
  const { status } = useAuth();
  return (
    <LandingPage
      onMasuk={() => navigate(status === "authenticated" ? ROUTES.portal : ROUTES.masuk)}
      onDaftar={() => navigate(ROUTES.daftar)}
    />
  );
}

export function DashboardRoute() {
  const onNavigate = useLegacyNavigate();
  const { user } = useAuth();
  return <DashboardPage onNavigate={onNavigate} currentUser={user ? toDisplayUser(user) : null} />;
}

export function AnalisisPotensiRoute() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("minat-bakat");
  return <StudentProfiling activeTab={activeTab} setActiveTab={setActiveTab} />;
}

export function CompassRoute() {
  const onNavigate = useLegacyNavigate();
  return (
    <FeatureGate feature="compass">
      <CompassPage onNavigate={onNavigate} />
    </FeatureGate>
  );
}

export function ActionPlanRoute() {
  const onNavigate = useLegacyNavigate();
  return (
    <FeatureGate feature="actionPlan">
      <ActionPlanPage onNavigate={onNavigate} />
    </FeatureGate>
  );
}

export function SiapSnbpRoute() {
  const onNavigate = useLegacyNavigate();
  return <SiapPTNPage key="snbp" onNavigate={onNavigate} defaultTab="snbp" />;
}

/** /portal/persiapan/:ujian → tka, snbt, atau skd. Ujian lain → 404. */
export function PersiapanRoute() {
  const { ujian } = useParams();
  const onNavigate = useLegacyNavigate();
  const navigate = useNavigate();

  if (!UJIAN_KEYS.includes(ujian as UjianKey)) return <NotFoundPage />;

  switch (ujian as UjianKey) {
    case "snbt":
      return <SiapPTNPage key="snbt" onNavigate={onNavigate} defaultTab="snbt" />;
    case "tka":
      return <LatihanTKAPage onBack={() => navigate(ROUTES.persiapanSnbp)} />;
    case "skd":
      return <SiapSKDPage />;
  }
}

export function ProfilRoute() {
  const navigate = useNavigate();
  return <InformasiPribadiPage onClose={() => navigate(ROUTES.portal)} defaultTab="data-diri" />;
}
