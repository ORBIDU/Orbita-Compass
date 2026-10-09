import { lazy, Suspense, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toDisplayUser } from "@/lib/user";
import { ROUTES } from "@/config/navigation";
import PortalHeader from "@/components/portal/PortalHeader";
import BottomNav from "@/components/portal/BottomNav";
import PageLoader from "@/components/ui/PageLoader";

// Panel Mode Demo hanya ada di mode dummy. Dimuat terpisah di cabang USE_MOCK
// supaya panel dan data dummy (src/mocks/) tidak ikut di build mode backend.
const DemoModePanel = USE_MOCK ? lazy(() => import("@/components/dev/DemoModePanel")) : null;

/**
 * Kerangka semua halaman portal (docs/design/portal): header di atas, isi
 * halaman di bawah. Desktop: menu ada di header. HP/tablet: menu bawah.
 * Setiap halaman mengatur scroll-nya sendiri di dalam <main>.
 */
export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.landing, { replace: true });
  }, [logout, navigate]);

  // RequireAuth / AdaptiveLayout memastikan user sudah ada sebelum layout ini tampil.
  if (!user) return <PageLoader fullscreen />;

  return (
    <div className="portal-site flex h-dvh flex-col overflow-hidden bg-page">
      <header className="z-40 shrink-0 border-b border-rim-soft bg-white">
        <PortalHeader user={toDisplayUser(user)} onLogout={handleLogout} />
      </header>
      {/* Ruang bawah di HP supaya isi halaman tidak tertutup menu bawah. */}
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pb-[calc(68px+env(safe-area-inset-bottom))] lg:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
      {DemoModePanel && (
        <Suspense fallback={null}>
          <DemoModePanel />
        </Suspense>
      )}
    </div>
  );
}
