import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { ROUTES } from "@/config/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { BRAND } from "@/config/brand";

/** Halaman portal: wajib login. Belum login → ke /masuk, lalu kembali ke halaman asal. */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "loading") return <PageLoader fullscreen label={`Memuat ${BRAND.name}...`} />;
  if (status === "guest") return <Navigate to={ROUTES.masuk} replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/**
 * Halaman Masuk/Daftar. Satu-satunya tempat yang menentukan tujuan setelah
 * berhasil masuk/daftar (halaman form tidak berpindah sendiri, supaya tidak
 * saling balapan). Sesuai SPEK bagian 3: status "baru" → Analisis Potensi;
 * selain itu → halaman yang tadi dibuka sebelum diminta login, atau /portal.
 */
export function GuestOnly() {
  const { status, user } = useAuth();
  const { status: studentStatus, ready } = useStudentStatus();
  const location = useLocation();

  if (status === "loading") return <PageLoader fullscreen label={`Memuat ${BRAND.name}...`} />;
  if (status === "authenticated") {
    if (user?.role === "STUDENT" && !ready) return <PageLoader fullscreen label="Menyiapkan portal..." />;
    const from = (location.state as { from?: string } | null)?.from;
    const to = studentStatus === "baru" ? ROUTES.analisisPotensi : (from ?? ROUTES.portal);
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
}
