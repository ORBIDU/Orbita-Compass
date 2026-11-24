import { Suspense, useCallback, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import WaliHeader from "@/components/wali/WaliHeader";
import PageLoader from "@/components/ui/PageLoader";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { toDisplayUser } from "@/lib/user";
import { useAsync } from "@/lib/useAsync";
import { getWaliProfile } from "@/services/waliService";
import type { WaliTeacherProfile } from "@/types/wali";

export default function WaliLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.landing, { replace: true });
  }, [logout, navigate]);

  const { data: profile } = useAsync(() => getWaliProfile(), []);

  // Nama dan foto dari akun yang masuk; kelas/NIP/semester dari profil wali (kosong selama dimuat).
  const waliProfile: WaliTeacherProfile = useMemo(() => {
    const base = profile ?? { id: "", name: "", nip: "", kelas: "", semester: "", tahunAjaran: "", initials: "" };
    if (!user) return base;
    const display = toDisplayUser(user);
    return {
      ...base,
      id: user.id,
      name: user.name,
      initials: display.initials,
      avatarUrl: user.avatarUrl ?? undefined,
    };
  }, [user, profile]);

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
