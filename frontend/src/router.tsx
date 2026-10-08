import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import PortalLayout from "@/layouts/PortalLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdaptiveLayout from "@/layouts/AdaptiveLayout";
import PageLoader from "@/components/ui/PageLoader";
import { DaftarRedirect, GuestOnly, RequireAuth } from "@/routes/guards";

const LandingPage = lazy(() => import("@/app/LandingPage"));
const ProfilPage = lazy(() => import("@/app/ProfilPage"));

const AuthPage = lazy(() => import("@/app/AuthPage"));
const AktivasiPage = lazy(() => import("@/app/AktivasiPage"));
const DashboardPage = lazy(() => import("@/app/DashboardPage"));
const AnalisisPotensiPage = lazy(() => import("@/app/AnalisisPotensiPage"));
const CompassPage = lazy(() => import("@/app/CompassPage"));
const BeasiswaPage = lazy(() => import("@/app/BeasiswaPage"));
const ActionPlanPage = lazy(() => import("@/app/ActionPlanPage"));
const SiapSnbpPage = lazy(() => import("@/app/SiapSnbpPage"));
const SiapUjianPage = lazy(() => import("@/app/SiapUjianPage"));
const LatihanRunPage = lazy(() => import("@/app/LatihanRunPage"));
const TryoutRunPage = lazy(() => import("@/app/TryoutRunPage"));
const LatihanHasilPage = lazy(() => import("@/app/LatihanHasilPage"));
const LaporanPage = lazy(() => import("@/app/LaporanPage"));
const NotFoundPage = lazy(() => import("@/app/NotFoundPage"));
const JurusanListPage = lazy(() => import("@/app/JurusanListPage"));
const JurusanDetailPage = lazy(() => import("@/app/JurusanDetailPage"));

/** Landing tidak memakai layout, jadi butuh Suspense sendiri. */
const withSuspense = (node: ReactNode) => <Suspense fallback={<PageLoader fullscreen />}>{node}</Suspense>;

// Peta halaman sesuai docs/SPEK_SISWA.md.
export const router = createBrowserRouter([
  // ── Publik ────────────────────────────────────────────────────────────────
  { path: "/", element: withSuspense(<LandingPage />) },
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
        children: [{ path: "/masuk", element: <AuthPage /> }],
      },
    ],
  },
  // Akun dibuat setelah berlangganan; tidak ada pendaftaran mandiri.
  { path: "/daftar", element: <DaftarRedirect /> },

  // ── Portal (wajib login) ──────────────────────────────────────────────────
  {
    element: <RequireAuth />,
    children: [
      // Login pertama: ganti password awal dan persetujuan, sebelum portal.
      { element: <AuthLayout />, children: [{ path: "/aktivasi", element: <AktivasiPage /> }] },
      {
        path: "/portal",
        element: <PortalLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "analisis-potensi", element: <AnalisisPotensiPage /> },
          // Compass, Action Plan, dan Profil mengatur tampilan terkunci/kosongnya sendiri.
          { path: "compass", element: <CompassPage /> },
          { path: "beasiswa", element: <BeasiswaPage /> },
          // Action Plan juga mengatur tampilan terkunci sendiri.
          { path: "action-plan", element: <ActionPlanPage /> },
          { path: "persiapan/snbp", element: <SiapSnbpPage /> },
          { path: "persiapan/:ujian", element: <SiapUjianPage /> },
          { path: "latihan/:id/hasil", element: <LatihanHasilPage /> },
          { path: "tryout/:id/laporan", element: <LaporanPage /> },
          { path: "profil", element: <ProfilPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      // Pengerjaan soal tampil tanpa menu portal (hasil dan laporan tetap di dalam portal).
      { path: "/portal/latihan/:id", element: withSuspense(<LatihanRunPage />) },
      { path: "/portal/tryout/:id", element: withSuspense(<TryoutRunPage />) },
    ],
  },

  // ── Tidak ditemukan ───────────────────────────────────────────────────────
  { element: <AdaptiveLayout />, children: [{ path: "*", element: <NotFoundPage /> }] },
]);
