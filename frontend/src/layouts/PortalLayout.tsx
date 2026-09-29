import { Suspense, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toDisplayUser } from "@/lib/user";
import { ROUTES } from "@/config/navigation";
import PortalHeader from "@/components/portal/PortalHeader";
import PortalNav from "@/components/portal/PortalNav";
import DemoModePanel from "@/components/dev/DemoModePanel";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Kerangka semua halaman portal: header + menu di atas, isi halaman di bawah.
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
    <div className="flex h-dvh flex-col overflow-hidden bg-page">
      <header className="z-40 shrink-0 bg-white shadow-card">
        <PortalHeader user={toDisplayUser(user)} onLogout={handleLogout} />
        <PortalNav />
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <DemoModePanel />
    </div>
  );
}
