import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicHeader from "@/components/landing/PublicHeader";
import PublicFooter from "@/components/landing/PublicFooter";
import ConsultButton from "@/components/landing/ConsultButton";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Kerangka semua halaman publik (beranda, dan /jurusan saat belum login):
 * navbar, footer, dan tombol konsultasi (desain docs/design/publik).
 * Halaman di-scroll seperti dokumen biasa.
 */
export default function PublicLayout() {
  const { pathname, hash } = useLocation();

  // Pindah halaman → mulai dari atas lagi. Alamat dengan #section di-scroll
  // oleh halamannya sendiri (lib/useHashScroll.ts).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hanya saat halaman berganti
  }, [pathname]);

  return (
    <div className="public-site flex min-h-dvh flex-col overflow-x-clip bg-white">
      <PublicHeader />
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <PublicFooter />
      <ConsultButton />
    </div>
  );
}
