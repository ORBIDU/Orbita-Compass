import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { HEADER, NAV } from "@/content/landing";
import { ROUTES } from "@/config/navigation";
import Logo from "@/components/ui/Logo";
import { useDismiss } from "@/lib/useDismiss";
import { CONTAINER, pillClasses } from "./primitives";
import { useLandingNav } from "./useLandingNav";

const ITEM = "flex items-center rounded-full px-4 py-2 text-[15px] transition-colors xl:px-5";
const ITEM_ACTIVE = "bg-white font-semibold text-orbit-1 shadow-card ring-1 ring-rim-soft";
const ITEM_IDLE = "font-medium text-prose hover:text-space-2";

/** Link ke section beranda (`/#faq`) tidak pernah ditandai aktif. */
const isSectionLink = (to: string) => to.includes("#");

/**
 * Header semua halaman publik (desain docs/design/publik): logo, menu di tengah,
 * Masuk + Berlangganan di kanan. Di bawah lg menu pindah ke panel yang dibuka
 * tombol hamburger.
 */
export default function PublicHeader() {
  const { loggedIn, portalTo, subscribeHref } = useLandingNav();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const { pathname, hash } = useLocation();

  const close = useCallback(() => setOpen(false), []);
  useDismiss(panelRef, open, close, buttonRef);

  // Pindah halaman atau section → panel menu tertutup.
  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  function navClass(to: string, mobile: boolean) {
    return ({ isActive }: { isActive: boolean }) => {
      const active = isActive && !isSectionLink(to);
      if (mobile) {
        return `flex min-h-12 items-center rounded-xl px-4 text-base ${active ? "bg-surface-blue font-semibold text-orbit-1" : "font-medium text-space-1 hover:bg-surface-soft"}`;
      }
      return `${ITEM} ${active ? ITEM_ACTIVE : ITEM_IDLE}`;
    };
  }

  const accountLinks = (mobile: boolean) =>
    loggedIn ? (
      <Link to={portalTo} className={pillClasses("blue", mobile ? "h-12 w-full" : "h-11 px-5 text-[15px]")}>
        {HEADER.bukaPortal}
      </Link>
    ) : (
      <>
        <Link
          to={ROUTES.masuk}
          className={
            mobile
              ? pillClasses("outline", "h-12 w-full")
              : "flex h-11 items-center px-2 text-[15px] font-semibold text-space-1 transition hover:text-orbit-1"
          }
        >
          {HEADER.masuk}
        </Link>
        <a
          href={subscribeHref}
          target="_blank"
          rel="noopener noreferrer"
          className={pillClasses("sun", mobile ? "h-12 w-full" : "h-11 px-5 text-[15px]")}
        >
          {HEADER.berlangganan}
        </a>
      </>
    );

  return (
    <div ref={panelRef} className="sticky top-0 z-30 border-b border-rim-soft bg-white/95 backdrop-blur">
      <header className={`${CONTAINER} flex h-16 items-center justify-between gap-4 lg:h-20`}>
        <Link to={ROUTES.landing} aria-label={HEADER.logoLabel} className="shrink-0">
          <Logo size="sm" className="lg:hidden" />
          <Logo size="md" className="hidden lg:inline-flex" />
        </Link>

        <nav aria-label={NAV.label} className="hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full bg-surface-soft p-1.5 ring-1 ring-rim-soft">
            {NAV.items.map((item) => (
              <li key={item.label}>
                <NavLink to={item.to} end={item.to === ROUTES.landing} className={navClass(item.to, false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">{accountLinks(false)}</div>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? NAV.close : NAV.open}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-rim-soft text-space-1 transition hover:bg-surface-soft lg:hidden"
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </header>

      {open && (
        <div id={panelId} className="border-t border-rim-soft bg-white shadow-card lg:hidden">
          <nav aria-label={NAV.label} className={`${CONTAINER} flex flex-col gap-1 py-3`}>
            {NAV.items.map((item) => (
              <NavLink key={item.label} to={item.to} end={item.to === ROUTES.landing} className={navClass(item.to, true)}>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2.5 border-t border-rim-soft pt-4">{accountLinks(true)}</div>
          </nav>
        </div>
      )}
    </div>
  );
}
