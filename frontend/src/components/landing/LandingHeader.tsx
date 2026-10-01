import { Link } from "react-router-dom";
import { HEADER } from "@/content/landing";
import { ROUTES } from "@/config/navigation";
import Logo from "@/components/ui/Logo";
import { useLandingNav } from "./useLandingNav";

const BTN = "flex h-11 items-center rounded-xl px-4 text-sm font-semibold transition sm:px-6 sm:text-[15px]";

/** Header halaman publik tanpa navbar: logo, Daftar, dan Masuk. */
export default function LandingHeader({ className = "" }: { className?: string }) {
  const { loggedIn } = useLandingNav();
  return (
    <header className={`relative z-10 flex h-16 items-center justify-between gap-3 lg:h-24 ${className}`}>
      <Link to={ROUTES.landing} aria-label={HEADER.logoLabel} className="shrink-0">
        <Logo size="sm" className="lg:hidden" />
        <Logo size="md" className="hidden lg:inline-flex" />
      </Link>
      <div className="flex items-center gap-2 sm:gap-2.5">
        {loggedIn ? (
          <Link to={ROUTES.portal} className={`${BTN} bg-orbit-1 text-white hover:bg-orbit-1/90`}>
            {HEADER.bukaPortal}
          </Link>
        ) : (
          <>
            <Link to={ROUTES.daftar} className={`${BTN} bg-orbit-1 text-white hover:bg-orbit-1/90`}>
              {HEADER.daftar}
            </Link>
            <Link to={ROUTES.masuk} className={`${BTN} border-[1.5px] border-orbit-1 bg-white text-orbit-1 hover:bg-cloud`}>
              {HEADER.masuk}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
