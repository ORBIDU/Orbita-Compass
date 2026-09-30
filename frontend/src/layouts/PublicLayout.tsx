import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import ConsultButton from "@/components/landing/ConsultButton";
import { CONTAINER } from "@/components/landing/primitives";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Kerangka halaman publik selain beranda (mis. /jurusan saat belum login):
 * header yang sama dengan beranda (logo, Daftar, Masuk) dan tombol konsultasi.
 */
export default function PublicLayout() {
  return (
    <div className="public-site flex h-dvh flex-col overflow-hidden bg-page">
      <div className="z-30 shrink-0 border-b border-rim bg-white">
        <div className={CONTAINER}>
          <LandingHeader />
        </div>
      </div>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <ConsultButton />
    </div>
  );
}
