import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PERSIAPAN_ICON, PERSIAPAN_LABEL, ROUTES } from "@/config/navigation";
import { useDismiss } from "@/lib/useDismiss";
import { NAV_ICON_CLASS, navItemClasses } from "./navStyles";
import PersiapanList from "./PersiapanList";

/**
 * Dropdown "Persiapan" di header desktop: tombol dengan aria-expanded yang
 * membuka daftar link biasa (bukan role="menu", karena tidak memakai tombol
 * panah). Tab berpindah antar-link; Escape menutup dan fokus kembali ke tombol.
 */
export default function PersiapanMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const { pathname } = useLocation();
  const active = pathname.startsWith(ROUTES.persiapan);
  const close = useCallback(() => setOpen(false), []);

  useDismiss(ref, open, close, buttonRef);
  // Tutup saat pindah halaman.
  useEffect(close, [pathname, close]);

  const Icon = PERSIAPAN_ICON;

  return (
    <div ref={ref} className="relative flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={listId}
        className={navItemClasses(active)}
      >
        <Icon size={18} aria-hidden="true" className={NAV_ICON_CLASS} />
        {PERSIAPAN_LABEL}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div id={listId} className="absolute left-0 top-full z-50 w-72 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-rim-soft">
          <PersiapanList />
        </div>
      )}
    </div>
  );
}
