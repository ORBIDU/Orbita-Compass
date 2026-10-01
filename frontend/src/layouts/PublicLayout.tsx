import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import ConsultButton from "@/components/landing/ConsultButton";
import SimpleFooter from "@/components/landing/SimpleFooter";
import { CONTAINER } from "@/components/landing/primitives";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Kerangka halaman publik selain beranda (mis. /jurusan saat belum login):
 * header yang sama dengan beranda (logo, Daftar, Masuk), footer ringkas,
 * dan tombol konsultasi. Halaman di-scroll seperti dokumen biasa.
 */
export default function PublicLayout() {
  const { pathname } = useLocation();

  // Pindah halaman → mulai dari atas lagi.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="public-site flex min-h-dvh flex-col overflow-x-clip bg-white">
      <div className="sticky top-0 z-30 border-b border-rim bg-white/95 backdrop-blur">
        <div className={CONTAINER}>
          <LandingHeader className="lg:h-[88px]" />
        </div>
      </div>
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <SimpleFooter />
      <ConsultButton />
    </div>
  );
}
