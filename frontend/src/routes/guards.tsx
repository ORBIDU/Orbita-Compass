import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { ROUTES } from "@/config/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { BRAND } from "@/config/brand";
import { activationStep, fromState, portalTarget } from "@/lib/activation";

/**
 * Halaman yang wajib login. Belum login → ke /masuk, lalu kembali ke halaman
 * asal. Akun yang belum aktivasi (password awal, belum ada persetujuan) selalu
 * diarahkan ke /aktivasi dulu.
 */
export function RequireAuth() {
  const { status, user } = useAuth();
  const location = useLocation();
  if (status === "loading") return <PageLoader fullscreen label={`Memuat ${BRAND.name}...`} />;
  if (status === "guest") return <Navigate to={ROUTES.masuk} replace state={{ from: location.pathname }} />;
  if (activationStep(user) && location.pathname !== ROUTES.aktivasi) {
    return <Navigate to={ROUTES.aktivasi} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

/**
 * Halaman Masuk. Satu-satunya tempat yang menentukan tujuan setelah berhasil
 * masuk (form tidak berpindah sendiri, supaya tidak saling balapan).
 */
export function GuestOnly() {
  const { status, user } = useAuth();
  const { status: studentStatus, ready } = useStudentStatus();
  const location = useLocation();

  if (status === "loading") return <PageLoader fullscreen label={`Memuat ${BRAND.name}...`} />;
  if (status === "authenticated") {
    const from = fromState(location.state);
    if (activationStep(user)) return <Navigate to={ROUTES.aktivasi} replace state={{ from }} />;
    if (user?.role === "STUDENT" && !ready) return <PageLoader fullscreen label="Menyiapkan portal..." />;
    return <Navigate to={portalTarget(studentStatus, from)} replace />;
  }
  return <Outlet />;
}

/** Alamat lama /daftar: tidak ada pendaftaran mandiri, jadi ke /masuk (halaman asal ikut dibawa). */
export function DaftarRedirect() {
  const { state } = useLocation();
  return <Navigate to={ROUTES.masuk} replace state={state} />;
}
