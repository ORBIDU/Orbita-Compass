import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import PortalLayout from "@/layouts/PortalLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdaptiveLayout from "@/layouts/AdaptiveLayout";
import PublicLayout from "@/layouts/PublicLayout";
import PageLoader from "@/components/ui/PageLoader";
// Tidak lazy: halaman error harus tetap bisa tampil walau file halaman lain gagal dimuat.
import ErrorPage from "@/app/ErrorPage";
import { DaftarRedirect, GuestOnly, RequireAuth, RequireBk, RequireWali } from "@/routes/guards";

const LandingPage = lazy(() => import("@/app/LandingPage"));
const UntukSekolahPage = lazy(() => import("@/app/UntukSekolahPage"));
const TentangKamiPage = lazy(() => import("@/app/TentangKamiPage"));
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

// Portal Wali Kelas
const WaliLayout = lazy(() => import("@/layouts/WaliLayout"));
const WaliDashboardPage = lazy(() => import("@/app/wali/WaliDashboardPage"));
const WaliStudentListPage = lazy(() => import("@/app/wali/WaliStudentListPage"));
const WaliStudentDetailPage = lazy(() => import("@/app/wali/WaliStudentDetailPage"));

// Portal Guru BK
const BkLayout = lazy(() => import("@/layouts/BkLayout"));
const BkDashboardPage = lazy(() => import("@/app/bk/BkDashboardPage"));
const BkStudentListPage = lazy(() => import("@/app/bk/BkStudentListPage"));
const BkStudentDetailPage = lazy(() => import("@/app/bk/BkStudentDetailPage"));

/** Halaman tanpa layout (pengerjaan soal) butuh Suspense sendiri. */
const withSuspense = (node: ReactNode) => <Suspense fallback={<PageLoader fullscreen />}>{node}</Suspense>;

// Peta halaman sesuai docs/SPEK_SISWA.md.
// errorElement: komponen crash atau file halaman gagal dimuat → halaman error
// berbahasa Indonesia. Di dalam layout (portal, /jurusan) error tampil di
// dalam kerangka, jadi header dan menu tetap bisa dipakai.
export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      // ── Publik ──────────────────────────────────────────────────────────────
      // Beranda selalu memakai layout publik, juga untuk siswa yang sudah masuk.
      {
        element: <PublicLayout />,
        children: [
          {
            errorElement: <ErrorPage inLayout />,
            children: [
              { path: "/", element: <LandingPage /> },
              { path: "/untuk-sekolah", element: <UntukSekolahPage /> },
              { path: "/tentang-kami", element: <TentangKamiPage /> },
            ],
          },
        ],
      },
      {
        // Satu halaman untuk tamu dan siswa: layout mengikuti status login.
        path: "/jurusan",
        element: <AdaptiveLayout />,
        children: [
          {
            errorElement: <ErrorPage inLayout />,
            children: [
              { index: true, element: <JurusanListPage /> },
              { path: ":slug", element: <JurusanDetailPage /> },
            ],
          },
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

      // ── Portal (wajib login) ────────────────────────────────────────────────
      {
        element: <RequireAuth />,
        children: [
          // Login pertama: ganti password awal dan persetujuan, sebelum portal.
          { element: <AuthLayout />, children: [{ path: "/aktivasi", element: <AktivasiPage /> }] },
          {
            path: "/portal",
            element: <PortalLayout />,
            children: [
              {
                errorElement: <ErrorPage inLayout />,
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
            ],
          },
          // Pengerjaan soal tampil tanpa menu portal (hasil dan laporan tetap di dalam portal).
          { path: "/portal/latihan/:id", element: withSuspense(<LatihanRunPage />) },
          { path: "/portal/tryout/:id", element: withSuspense(<TryoutRunPage />) },
        ],
      },

      // ── Portal Wali Kelas (wajib login) ─────────────────────────────────────
      {
        element: <RequireWali />,
        children: [
          {
            path: "/walikelas",
            element: <WaliLayout />,
            children: [
              {
                errorElement: <ErrorPage inLayout />,
                children: [
                  { index: true, element: <WaliDashboardPage /> },
                  { path: "siswa", element: <WaliStudentListPage /> },
                  { path: "siswa/:id", element: <WaliStudentDetailPage /> },
                ],
              },
            ],
          },
        ],
      },

      // ── Portal Guru BK (wajib login) ────────────────────────────────────────
      {
        element: <RequireBk />,
        children: [
          {
            path: "/bk",
            element: <BkLayout />,
            children: [
              {
                errorElement: <ErrorPage inLayout />,
                children: [
                  { index: true, element: <BkDashboardPage /> },
                  { path: "siswa", element: <BkStudentListPage /> },
                  { path: "siswa/:id", element: <BkStudentDetailPage /> },
                ],
              },
            ],
          },
        ],
      },

      // ── Tidak ditemukan ─────────────────────────────────────────────────────
      { element: <AdaptiveLayout />, children: [{ path: "*", element: <NotFoundPage /> }] },
    ],
  },
]);
