import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PERSIAPAN_ICON, PERSIAPAN_LABEL, ROUTES } from "@/config/navigation";
import { useDismiss } from "@/lib/useDismiss";
import { NAV_ICON_CLASS, navItemClasses } from "./navStyles";
import PersiapanList from "./PersiapanList";

/** Dropdown "Persiapan" di header desktop. */
export default function PersiapanMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const active = pathname.startsWith(ROUTES.persiapan);
  const close = useCallback(() => setOpen(false), []);

  useDismiss(ref, open, close);
  // Tutup saat pindah halaman.
  useEffect(close, [pathname, close]);

  const Icon = PERSIAPAN_ICON;

  return (
    <div ref={ref} className="relative flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={navItemClasses(active)}
      >
        <Icon size={18} aria-hidden="true" className={NAV_ICON_CLASS} />
        {PERSIAPAN_LABEL}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="menu" className="absolute left-0 top-full z-50 w-72 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-rim-soft">
          <PersiapanList itemRole="menuitem" />
        </div>
      )}
    </div>
  );
}
