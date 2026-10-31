import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Search, UserRound } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/config/navigation";
import type { DisplayUser } from "@/lib/user";
import { useDismiss } from "@/lib/useDismiss";
import { BRAND } from "@/config/brand";
import Logo from "@/components/ui/Logo";
import EmptyState from "@/components/ui/EmptyState";
import PortalNav from "./PortalNav";
import { HEADER_MENU } from "@/content/common";

interface PortalHeaderProps {
  user: DisplayUser;
  onLogout: () => void;
}

const iconButton =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rim-soft bg-white text-space-1 transition-colors hover:bg-surface-soft";

/**
 * Dropdown kecil yang menutup sendiri saat klik di luar, Escape (fokus kembali
 * ke tombolnya), atau pindah halaman. Isinya daftar link/tombol biasa, bukan
 * role="menu", jadi cukup dijelajahi dengan Tab.
 */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const { pathname } = useLocation();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, buttonRef);
  useEffect(close, [pathname, close]);
  return { open, setOpen, ref, buttonRef, panelId };
}

function NotificationMenu() {
  const { open, setOpen, ref, buttonRef, panelId } = useDropdown();
  return (
    <div ref={ref} className="relative">
      {/* Belum ada data notifikasi, jadi tanpa titik "belum dibaca" (API_CONTRACT bagian 7.4). */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={HEADER_MENU.notifications}
        className={iconButton}
      >
        <Bell size={20} aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className="absolute right-0 top-full z-50 mt-2 w-[min(320px,calc(100vw-2rem))] rounded-2xl bg-white shadow-card-hover ring-1 ring-rim-soft">
          <p className="border-b border-rim-soft px-4 py-3 text-sm font-semibold text-space-2">{HEADER_MENU.notifications}</p>
          <EmptyState icon={Bell} title={HEADER_MENU.notificationsEmpty} description={HEADER_MENU.notificationsEmptyBody} className="py-8" />
        </div>
      )}
    </div>
  );
}

const menuItem = "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors hover:bg-surface-soft";

function AccountMenu({ user, onLogout }: PortalHeaderProps) {
  const { open, setOpen, ref, buttonRef, panelId } = useDropdown();
  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={HEADER_MENU.account(user.name)}
        className="flex items-center gap-2.5 rounded-full transition-colors hover:bg-surface-soft nav:h-12 nav:rounded-[14px] nav:border nav:border-rim-soft nav:bg-white nav:pl-1.5 nav:pr-2.5"
      >
        <Avatar src={user.avatarUrl} initials={user.initials} className="h-11 w-11 text-[13px] nav:h-9 nav:w-9" />
        <span className="hidden text-left leading-tight nav:block">
          <span className="block max-w-[160px] truncate text-sm font-semibold text-space-2">{user.name}</span>
          <span className="block text-xs text-prose">{user.kelas}</span>
        </span>
        <ChevronDown size={16} aria-hidden="true" className="hidden text-prose nav:block" />
      </button>
      {open && (
        <div id={panelId} className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-rim-soft">
          <div className="border-b border-rim-soft px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-space-2">{user.name}</p>
            {user.kelas && <p className="text-xs text-prose">{user.kelas}</p>}
            <p className="truncate text-xs text-prose-dim">{user.email}</p>
          </div>
          <div className="mt-1 flex flex-col">
            <Link to={ROUTES.profil} className={`${menuItem} text-space-1`}>
              <UserRound size={18} aria-hidden="true" /> {HEADER_MENU.profile}
            </Link>
            <Link to={ROUTES.jurusan} className={`${menuItem} text-space-1`}>
              <Search size={18} aria-hidden="true" /> {HEADER_MENU.explore}
            </Link>
            <button type="button" onClick={onLogout} className={`${menuItem} text-alert-fg`}>
              <LogOut size={18} aria-hidden="true" /> {HEADER_MENU.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Header portal (docs/design/portal/PortalHeader.dc.html).
 * Desktop: logo, menu dengan garis bawah untuk menu aktif, notifikasi, akun.
 * HP/tablet: logo, notifikasi, avatar. Menu pindah ke BottomNav.
 */
export default function PortalHeader({ user, onLogout }: PortalHeaderProps) {
  return (
    <div className="flex h-[60px] items-center gap-6 px-4 sm:px-6 lg:h-[72px] xl:gap-9 xl:px-10">
      <Link to={ROUTES.landing} aria-label={`${BRAND.name}, ke beranda`} className="shrink-0 rounded-lg">
        <Logo size="sm" />
      </Link>
      <PortalNav />
      <div className="ml-auto flex items-center gap-2 xl:gap-3">
        <NotificationMenu />
        <AccountMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  );
}
