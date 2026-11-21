import { Suspense, useCallback, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import BkHeader from "@/components/bk/BkHeader";
import PageLoader from "@/components/ui/PageLoader";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { toDisplayUser } from "@/lib/user";
import { useAsync } from "@/lib/useAsync";
import { getBkProfile } from "@/services/bkService";
import type { BkTeacherProfile } from "@/types/bk";

export default function BkLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.landing, { replace: true });
  }, [logout, navigate]);

  const { data: profile } = useAsync(() => getBkProfile(), []);

  // Nama dan foto dari akun yang masuk; NIP/jabatan/semester dari profil Guru BK.
  const bkProfile: BkTeacherProfile = useMemo(() => {
    const base: BkTeacherProfile = profile ?? {
      id: "",
      name: "",
      nip: "",
      jabatan: "Konselor",
      sekolah: "",
      semester: "",
      tahunAjaran: "",
      initials: "",
    };
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
      <BkHeader guru={bkProfile} onLogout={handleLogout} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
