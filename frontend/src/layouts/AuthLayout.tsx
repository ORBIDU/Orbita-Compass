import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { ROUTES } from "@/config/navigation";
import Logo from "@/components/ui/Logo";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Kerangka sementara halaman Masuk dan Daftar (tema navy).
 * Tata letak 65/35 dengan AuthAnimationSlot dibuat di Fase 3.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-dvh bg-gradient-navy px-4 py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Link to={ROUTES.landing} aria-label="ORBITA, ke beranda" className="self-start">
          <Logo size="sm" />
        </Link>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
