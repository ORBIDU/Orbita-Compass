import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { ROUTES } from "@/config/navigation";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Kerangka halaman publik selain landing (mis. /jurusan saat belum login):
 * logo di kiri, tombol Masuk dan Daftar di kanan.
 */
export default function PublicLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-page">
      <header className="z-40 shrink-0 bg-white shadow-card">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to={ROUTES.landing} aria-label="ORBITA, ke beranda">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <ButtonLink to={ROUTES.masuk} variant="ghost" size="sm">
              Masuk
            </ButtonLink>
            <ButtonLink to={ROUTES.daftar} variant="cta" size="sm">
              Daftar
            </ButtonLink>
          </div>
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
