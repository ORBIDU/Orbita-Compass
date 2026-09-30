import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { AUTH_PANEL } from "@/content/auth";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import AuthVideoSlot from "@/components/auth/AuthVideoSlot";
import Logo from "@/components/ui/Logo";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Kerangka halaman Masuk & Daftar (docs/design/auth).
 * - Desktop (≥1024px): kiri 65% video/animasi setinggi layar (tetap di tempat),
 *   kanan 35% form.
 * - HP & tablet: video menjadi banner 240px di atas form.
 * Tombol konsultasi sengaja tidak dipasang di sini.
 *
 * Hanya satu slot video yang dipasang (sesuai lebar layar), supaya browser
 * tidak mengunduh video desktop dan HP sekaligus.
 */
export default function AuthLayout() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  return (
    <div className="public-site min-h-dvh bg-white text-space-2 lg:grid lg:grid-cols-[minmax(0,65fr)_minmax(420px,35fr)]">
      {isDesktop ? (
        <AuthVideoSlot variant="panel" className="sticky top-0 h-dvh">
          <div className="absolute left-12 top-9">
            <Link to={ROUTES.landing} aria-label={AUTH_PANEL.homeLabel} className="inline-flex rounded-lg">
              <Logo tone="dark" />
            </Link>
          </div>
          <div className="absolute bottom-11 left-12 right-10 flex max-w-[560px] flex-col gap-1.5">
            <p className="font-accent text-[30px] font-bold leading-none text-night-accent">{AUTH_PANEL.greeting}</p>
            <p className="text-[26px] font-bold leading-tight text-night-light">{AUTH_PANEL.title}</p>
            <p className="text-[15px] leading-relaxed text-night-text">{AUTH_PANEL.subtitle}</p>
          </div>
        </AuthVideoSlot>
      ) : (
        <AuthVideoSlot variant="banner" className="h-60 rounded-b-[28px]">
          <div className="absolute left-3 right-4 top-3 flex items-center gap-1.5">
            <Link
              to={ROUTES.landing}
              aria-label={AUTH_PANEL.backLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.12] text-white transition hover:bg-white/20"
            >
              <ArrowLeft size={20} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <Logo size="sm" tone="dark" />
          </div>
        </AuthVideoSlot>
      )}

      <main className="flex px-5 pb-8 pt-6 sm:px-8 lg:min-h-dvh lg:px-12 lg:py-9">
        <div className="mx-auto w-full max-w-[440px] lg:my-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
