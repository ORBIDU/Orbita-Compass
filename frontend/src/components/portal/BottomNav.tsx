import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { MOBILE_NAV, PERSIAPAN_ICON, PERSIAPAN_LABEL, ROUTES } from "@/config/navigation";
import PersiapanList from "./PersiapanList";

const itemClass = (active: boolean) =>
  `flex min-w-0 flex-col items-center justify-center gap-1 text-[11px] ${
    active ? "font-semibold text-orbit-1" : "font-medium text-prose"
  }`;

const pillClass = (active: boolean) =>
  `flex h-7 w-11 items-center justify-center rounded-full transition-colors ${active ? "bg-tint-blue-bg" : ""}`;

/**
 * Menu bawah portal untuk HP dan tablet (<1024px), sesuai
 * docs/design/portal/Portal-Dashboard-HP.dc.html. "Persiapan" membuka
 * bottom sheet berisi pilihan ujian.
 */
export default function BottomNav() {
  const { pathname } = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const persiapanActive = pathname.startsWith(ROUTES.persiapan);
  const PersiapanIcon = PERSIAPAN_ICON;

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Tutup sheet saat pindah halaman (mis. setelah memilih Siap SNBT).
  useEffect(() => setSheetOpen(false), [pathname]);

  return (
    <>
      <nav
        aria-label="Menu portal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-rim-soft bg-white pb-[env(safe-area-inset-bottom)] shadow-nav-up lg:hidden"
      >
        <div className="grid h-[68px] grid-cols-5">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => itemClass(isActive)}>
                {({ isActive }) => (
                  <>
                    <span className={pillClass(isActive)}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="max-w-full truncate px-0.5">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            aria-current={persiapanActive ? "page" : undefined}
            className={itemClass(persiapanActive)}
          >
            <span className={pillClass(persiapanActive)}>
              <PersiapanIcon size={20} aria-hidden="true" />
            </span>
            <span className="max-w-full truncate px-0.5">{PERSIAPAN_LABEL}</span>
          </button>
        </div>
      </nav>
      {sheetOpen && <PersiapanSheet onClose={closeSheet} />}
    </>
  );
}

/** Bottom sheet pilihan Persiapan. Tutup lewat tombol X, klik latar, atau Escape. */
function PersiapanSheet({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end lg:hidden">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-space-2/45" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[85dvh] w-full overflow-y-auto rounded-t-[24px] bg-white px-3 pb-[calc(16px+env(safe-area-inset-bottom))] pt-2 shadow-lift focus:outline-none"
      >
        <div aria-hidden="true" className="mx-auto mb-2 h-1 w-10 rounded-full bg-rim" />
        <div className="mb-1 flex items-center justify-between px-3">
          <h2 id={titleId} className="text-[17px] font-bold text-space-2">
            {PERSIAPAN_LABEL}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-prose hover:bg-surface-soft"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <PersiapanList />
        </div>
      </div>
    </div>,
    document.body,
  );
}
