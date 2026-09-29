import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PERSIAPAN_ICON, PERSIAPAN_ITEMS, PERSIAPAN_LABEL, ROUTES } from "@/config/navigation";
import { useDismiss } from "@/lib/useDismiss";
import { navItemClasses } from "./navStyles";

/** Dropdown "Persiapan" di menu desktop. */
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={navItemClasses(active)}
      >
        <Icon size={16} />
        {PERSIAPAN_LABEL}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div role="menu" className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-line">
          {PERSIAPAN_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            const content = (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cloud text-orbit-1">
                  <ItemIcon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    {item.label}
                    {!item.to && (
                      <span className="rounded-full bg-page px-2 py-0.5 text-[10px] font-semibold text-ink-muted">Segera hadir</span>
                    )}
                  </span>
                  <span className="block text-xs text-ink-muted">{item.description}</span>
                </span>
              </>
            );
            if (!item.to) {
              return (
                <div key={item.label} role="menuitem" aria-disabled className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 opacity-60">
                  {content}
                </div>
              );
            }
            return (
              <NavLink
                key={item.label}
                to={item.to}
                role="menuitem"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${isActive ? "bg-cloud" : "hover:bg-page"}`
                }
              >
                {content}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
