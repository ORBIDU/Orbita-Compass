import { useCallback, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MOBILE_NAV, PERSIAPAN_ICON, PERSIAPAN_LABEL, ROUTES } from "@/config/navigation";
import BottomSheet from "@/components/ui/BottomSheet";
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
  const persiapanActive = pathname.startsWith(ROUTES.persiapan);
  const PersiapanIcon = PERSIAPAN_ICON;

  // BottomSheet sendiri yang mengembalikan fokus ke tombol Persiapan.
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  // Tutup sheet saat pindah halaman (mis. setelah memilih Siap SNBT).
  useEffect(() => setSheetOpen(false), [pathname]);

  return (
    <>
      <nav
        aria-label="Menu portal"
        data-bottom-nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-rim-soft bg-white pb-[env(safe-area-inset-bottom)] shadow-nav-up lg:hidden"
      >
        <div className="grid h-[68px] grid-cols-5">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const inSection = item.activeFor?.some((p) => pathname.startsWith(p)) ?? false;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => itemClass(isActive || inSection)}>
                {({ isActive }) => (
                  <>
                    <span className={pillClass(isActive || inSection)}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="max-w-full truncate px-0.5">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
          <button
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

/** Bottom sheet pilihan Persiapan. */
function PersiapanSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet title={PERSIAPAN_LABEL} onClose={onClose}>
      <div className="flex flex-col gap-1">
        <PersiapanList />
      </div>
    </BottomSheet>
  );
}
