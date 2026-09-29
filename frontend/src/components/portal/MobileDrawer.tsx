import { useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, UserRound, X } from "lucide-react";
import {
  PERSIAPAN_ICON,
  PERSIAPAN_ITEMS,
  PERSIAPAN_LABEL,
  PORTAL_NAV_AFTER,
  PORTAL_NAV_BEFORE,
  ROUTES,
  type NavItem,
} from "@/config/navigation";
import type { DisplayUser } from "@/lib/user";
import Logo from "@/components/ui/Logo";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  user: DisplayUser;
  onLogout: () => void;
}

const itemClass = (active: boolean) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
    active ? "bg-cloud text-orbit-1" : "text-ink-soft hover:bg-page"
  }`;

function DrawerLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.end} className={({ isActive }) => itemClass(isActive)}>
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
}

/** Menu portal versi HP/tablet (< 1024px), muncul dari kiri. */
export default function MobileDrawer({ open, onClose, user, onLogout }: MobileDrawerProps) {
  const { pathname } = useLocation();
  const PersiapanIcon = PERSIAPAN_ICON;

  // Tutup saat pindah halaman.
  useEffect(onClose, [pathname, onClose]);

  // Escape menutup drawer, dan halaman di belakang tidak ikut ter-scroll.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Dirender langsung di <body> supaya selalu berada di atas header dan tombol Mode Demo.
  return createPortal(
    <div className={`fixed inset-0 z-[70] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-space-2/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`absolute inset-y-0 left-0 flex w-[min(300px,85vw)] flex-col bg-white shadow-card-hover transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted hover:bg-page"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-line-soft px-4 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-orbit text-sm font-bold text-white">
            {user.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
            <span className="block truncate text-xs text-ink-muted">{user.kelas}</span>
          </span>
        </div>

        <nav aria-label="Menu utama (HP)" className="flex-1 overflow-y-auto px-3 py-3">
          <div className="flex flex-col gap-1">
            {PORTAL_NAV_BEFORE.map((item) => (
              <DrawerLink key={item.to} item={item} />
            ))}
          </div>

          <p className="mb-1 mt-4 flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            <PersiapanIcon size={14} /> {PERSIAPAN_LABEL}
          </p>
          <div className="flex flex-col gap-1">
            {PERSIAPAN_ITEMS.map((item) => {
              const Icon = item.icon;
              if (!item.to) {
                return (
                  <span key={item.label} aria-disabled className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-faint">
                    <Icon size={18} />
                    {item.label}
                    <span className="ml-auto rounded-full bg-page px-2 py-0.5 text-[10px] font-semibold text-ink-muted">Segera hadir</span>
                  </span>
                );
              }
              return (
                <NavLink key={item.label} to={item.to} className={({ isActive }) => itemClass(isActive)}>
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-1">
            {PORTAL_NAV_AFTER.map((item) => (
              <DrawerLink key={item.to} item={item} />
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-1 border-t border-line-soft px-3 py-3">
          <NavLink to={ROUTES.profil} className={({ isActive }) => itemClass(isActive)}>
            <UserRound size={18} /> Profil
          </NavLink>
          <button type="button" onClick={onLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger hover:bg-page">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
