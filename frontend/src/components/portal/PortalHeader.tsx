import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import type { DisplayUser } from "@/lib/user";
import { useDismiss } from "@/lib/useDismiss";
import Logo from "@/components/ui/Logo";
import EmptyState from "@/components/ui/EmptyState";
import MobileDrawer from "./MobileDrawer";

interface PortalHeaderProps {
  user: DisplayUser;
  onLogout: () => void;
}

const iconButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink-soft transition-colors hover:bg-page";

/** Dropdown kecil yang menutup sendiri saat klik di luar, Escape, atau pindah halaman. */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  useEffect(close, [pathname, close]);
  return { open, setOpen, ref };
}

function NotificationMenu() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Notifikasi" className={iconButton}>
        <Bell size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(320px,calc(100vw-2rem))] rounded-2xl bg-white shadow-card-hover ring-1 ring-line">
          <p className="border-b border-line-soft px-4 py-3 text-sm font-semibold text-ink">Notifikasi</p>
          {/* Backend belum punya notifikasi: tampilkan apa adanya, tanpa contoh palsu. */}
          <EmptyState icon={Bell} title="Belum ada notifikasi" description="Pengingat Action Plan dan hasil tryout akan muncul di sini." className="py-8" />
        </div>
      )}
    </div>
  );
}

function AccountMenu({ user, onLogout }: PortalHeaderProps) {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menu akun"
        className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-1 transition-colors hover:bg-page sm:pr-2"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-orbit text-xs font-bold text-white">
          {user.initials}
        </span>
        <span className="hidden text-left md:block">
          <span className="block max-w-[160px] truncate text-sm font-semibold text-ink">{user.name}</span>
          <span className="block text-xs text-ink-muted">{user.kelas}</span>
        </span>
        <ChevronDown size={14} className="hidden text-ink-faint sm:block" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-line">
          <div className="border-b border-line-soft px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-xs text-ink-muted">{user.kelas}</p>
            <p className="truncate text-xs text-ink-faint">{user.email}</p>
          </div>
          <Link to={ROUTES.profil} role="menuitem" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-page">
            <UserRound size={16} /> Profil
          </Link>
          <button type="button" role="menuitem" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger hover:bg-page">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}

/** Header portal: logo + "Student Portal", notifikasi, dan menu akun. */
export default function PortalHeader({ user, onLogout }: PortalHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Buka menu" className={`${iconButton} lg:hidden`}>
            <Menu size={18} />
          </button>
          <Link to={ROUTES.portal} aria-label="ORBITA, ke Dashboard" className="shrink-0">
            <Logo size="sm" />
          </Link>
          <span className="hidden h-6 w-px bg-line sm:block" />
          <span className="hidden text-[11px] font-semibold uppercase tracking-widest text-ink-faint sm:block">Student Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationMenu />
          <AccountMenu user={user} onLogout={onLogout} />
        </div>
      </div>
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} user={user} onLogout={onLogout} />
    </>
  );
}
