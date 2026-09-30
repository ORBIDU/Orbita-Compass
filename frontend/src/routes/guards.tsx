import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { ROUTES } from "@/config/navigation";
import type { LockableFeature } from "@/types/student";
import PageLoader from "@/components/ui/PageLoader";
import LockedOverlay from "@/components/ui/LockedOverlay";
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

const LOCK_COPY: Record<LockableFeature, { title: string; description: string }> = {
  compass: {
    title: `${BRAND.compassName} masih terkunci`,
    description: `Isi Gambaran Minat Bakat dulu supaya ${BRAND.name} bisa merekomendasikan jurusan yang cocok untukmu.`,
  },
  actionPlan: {
    title: "Action Plan masih terkunci",
    description: "Rencana belajarmu disusun dari hasil Gambaran Minat Bakat. Isi tesnya dulu, ya.",
  },
  performa: {
    title: "Performa masih terkunci",
    description: "Isi Gambaran Minat Bakat dulu, lalu mulai latihan untuk melihat perkembanganmu.",
  },
};

/** Membungkus bagian yang bisa terkunci karena status siswa (lihat StudentStatusContext). */
export function FeatureGate({ feature, children }: { feature: LockableFeature; children: ReactNode }) {
  const { user } = useAuth();
  const { ready, isLocked } = useStudentStatus();

  // Tunggu status siswa dimuat supaya isi halaman tidak sempat tampil lalu terkunci.
  if (user?.role === "STUDENT" && !ready) return <PageLoader />;

  if (!isLocked(feature)) return <>{children}</>;
  const copy = LOCK_COPY[feature];
  return (
    <LockedOverlay
      title={copy.title}
      description={copy.description}
      actionLabel="Isi Gambaran Minat Bakat"
      actionTo={ROUTES.analisisPotensi}
    >
      {children}
    </LockedOverlay>
  );
}
