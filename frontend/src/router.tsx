import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import PortalLayout from "@/layouts/PortalLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdaptiveLayout from "@/layouts/AdaptiveLayout";
import PageLoader from "@/components/ui/PageLoader";
import { GuestOnly, RequireAuth } from "@/routes/guards";
import {
  ActionPlanRoute,
  AnalisisPotensiRoute,
  CompassRoute,
  DashboardRoute,
  LandingRoute,
  PersiapanRoute,
  ProfilRoute,
  SiapSnbpRoute,
} from "@/routes/legacyRoutes";

const MasukPage = lazy(() => import("@/app/MasukPage"));
const DaftarPage = lazy(() => import("@/app/DaftarPage"));
const BeasiswaPage = lazy(() => import("@/app/BeasiswaPage"));
const NotFoundPage = lazy(() => import("@/app/NotFoundPage"));
const JurusanListPage = lazy(() => import("@/app/JurusanListPage"));
const JurusanDetailPage = lazy(() => import("@/app/JurusanDetailPage"));

/** Landing tidak memakai layout, jadi butuh Suspense sendiri. */
const withSuspense = (node: ReactNode) => <Suspense fallback={<PageLoader fullscreen />}>{node}</Suspense>;

// Peta halaman sesuai docs/SPEK_SISWA.md.
export const router = createBrowserRouter([
  // ── Publik ────────────────────────────────────────────────────────────────
  { path: "/", element: withSuspense(<LandingRoute />) },
  {
    // Satu halaman untuk tamu dan siswa: layout mengikuti status login.
    path: "/jurusan",
    element: <AdaptiveLayout />,
    children: [
      { index: true, element: <JurusanListPage /> },
      { path: ":slug", element: <JurusanDetailPage /> },
    ],
  },
  {
    element: <GuestOnly />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/masuk", element: <MasukPage /> },
          { path: "/daftar", element: <DaftarPage /> },
        ],
      },
    ],
  },

  // ── Portal (wajib login) ──────────────────────────────────────────────────
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/portal",
        element: <PortalLayout />,
        children: [
          { index: true, element: <DashboardRoute /> },
          { path: "analisis-potensi", element: <AnalisisPotensiRoute /> },
          { path: "compass", element: <CompassRoute /> },
          { path: "beasiswa", element: <BeasiswaPage /> },
          { path: "action-plan", element: <ActionPlanRoute /> },
          { path: "persiapan/snbp", element: <SiapSnbpRoute /> },
          { path: "persiapan/:ujian", element: <PersiapanRoute /> },
          { path: "profil", element: <ProfilRoute /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },

  // ── Tidak ditemukan ───────────────────────────────────────────────────────
  { element: <AdaptiveLayout />, children: [{ path: "*", element: <NotFoundPage /> }] },
]);
