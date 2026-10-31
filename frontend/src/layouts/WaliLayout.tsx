import { Suspense, useCallback, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import WaliHeader from "@/components/wali/WaliHeader";
import PageLoader from "@/components/ui/PageLoader";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { toDisplayUser } from "@/lib/user";
import { MOCK_WALI_PROFILE } from "@/mocks/waliMock";
import type { WaliTeacherProfile } from "@/types/wali";

export default function WaliLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.landing, { replace: true });
  }, [logout, navigate]);

  const waliProfile: WaliTeacherProfile = useMemo(() => {
    if (!user) return MOCK_WALI_PROFILE;
    const display = toDisplayUser(user);
    return {
      ...MOCK_WALI_PROFILE,
      id: user.id,
      name: user.name,
      initials: display.initials,
      avatarUrl: user.avatarUrl ?? undefined,
    };
  }, [user]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-page">
      <WaliHeader wali={waliProfile} onLogout={handleLogout} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
