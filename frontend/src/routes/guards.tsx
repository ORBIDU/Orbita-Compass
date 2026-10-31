import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { ROUTES } from "@/config/navigation";
import PageLoader from "@/components/ui/PageLoader";
import { activationStep, fromState, portalTarget } from "@/lib/activation";
import { UI } from "@/content/common";

/**
 * Halaman yang wajib login. Belum login → ke /masuk, lalu kembali ke halaman
 * asal. Akun yang belum aktivasi (password awal, belum ada persetujuan) selalu
 * diarahkan ke /aktivasi dulu.
 */
export function RequireAuth() {
  const { status, user } = useAuth();
  const location = useLocation();
  if (status === "loading") return <PageLoader fullscreen label={UI.loadingApp} />;
  // Halaman asal ikut ?query (mis. ?tab=performance), supaya kembali ke tempat yang sama.
  const from = location.pathname + location.search;
  if (status === "guest") return <Navigate to={ROUTES.masuk} replace state={{ from }} />;
  if (activationStep(user) && location.pathname !== ROUTES.aktivasi) {
    return <Navigate to={ROUTES.aktivasi} replace state={{ from }} />;
  }
  // Jika akun Wali Kelas masuk ke portal siswa (/portal/*), alihkan ke portal wali kelas
  if (user?.role === "WALI_KELAS") {
    return <Navigate to={ROUTES.walikelas} replace />;
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

  if (status === "loading") return <PageLoader fullscreen label={UI.loadingApp} />;
  if (status === "authenticated") {
    const from = fromState(location.state);
    if (activationStep(user)) return <Navigate to={ROUTES.aktivasi} replace state={{ from }} />;
    // Jika login sebagai Wali Kelas, arahkan ke /walikelas (bukan rute siswa /portal)
    if (user?.role === "WALI_KELAS") {
      const target = from && !from.startsWith("/portal") ? from : ROUTES.walikelas;
      return <Navigate to={target} replace />;
    }
    if (user?.role === "STUDENT" && !ready) return <PageLoader fullscreen label={UI.preparingPortal} />;
    return <Navigate to={portalTarget(studentStatus, from)} replace />;
  }
  return <Outlet />;
}

/**
 * Guard khusus portal Wali Kelas (/walikelas/*).
 * - Belum login -> diarahkan ke /masuk (membawa state.from).
 * - Belum aktivasi -> ke /aktivasi dulu.
 * - Login dengan peran selain Wali Kelas -> ditolak dan diarahkan ke /portal.
 * - Login sebagai Wali Kelas -> diizinkan masuk.
 */
export function RequireWali() {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") return <PageLoader fullscreen label={UI.loadingApp} />;
  const from = location.pathname + location.search;

  if (status === "guest") {
    return <Navigate to={ROUTES.masuk} replace state={{ from }} />;
  }
  if (activationStep(user)) return <Navigate to={ROUTES.aktivasi} replace state={{ from }} />;

  // Area ini khusus Wali Kelas; peran lain kembali ke portal
  if (user?.role !== "WALI_KELAS") {
    return <Navigate to={ROUTES.portal} replace />;
  }

  return <Outlet />;
}

/** Alamat lama /daftar: tidak ada pendaftaran mandiri, jadi ke /masuk (halaman asal ikut dibawa). */
export function DaftarRedirect() {
  const { state } = useLocation();
  return <Navigate to={ROUTES.masuk} replace state={state} />;
}
