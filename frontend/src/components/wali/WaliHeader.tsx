import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Users } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/config/navigation";
import { useDismiss } from "@/lib/useDismiss";
import type { WaliTeacherProfile } from "@/types/wali";

interface WaliHeaderProps {
  wali: WaliTeacherProfile;
  onLogout?: () => void;
}

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

export default function WaliHeader({ wali, onLogout }: WaliHeaderProps) {
  const {
    open: notifOpen,
    setOpen: setNotifOpen,
    ref: notifRef,
    buttonRef: notifBtnRef,
    panelId: notifId,
  } = useDropdown();

  const {
    open: accOpen,
    setOpen: setAccOpen,
    ref: accRef,
    buttonRef: accBtnRef,
    panelId: accId,
  } = useDropdown();

  return (
    <header className="z-40 h-[72px] shrink-0 border-b border-rim-soft bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Kiri: Logo ORBIDU & Tag Wali Kelas */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to={ROUTES.walikelas} className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="h-5 w-px bg-rim-soft" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-space-2 sm:text-sm">
              Wali Kelas
            </span>
            <span className="rounded-full bg-tint-blue-bg px-2.5 py-0.5 text-[11px] font-semibold text-tint-blue-fg">
              {wali.kelas}
            </span>
          </div>
        </div>

        {/* Tengah: Navigasi Utama */}
        <nav aria-label="Menu Wali Kelas" className="flex h-full items-stretch gap-1 sm:gap-2">
          <NavLink
            to={ROUTES.walikelas}
            end
            className={({ isActive }) =>
              [
                "flex h-full items-center gap-2 border-b-2 px-3 text-sm transition-colors",
                isActive
                  ? "border-orbit-1 font-semibold text-orbit-1"
                  : "border-transparent font-medium text-prose hover:text-space-2",
              ].join(" ")
            }
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            <span>Beranda</span>
          </NavLink>
          <NavLink
            to={ROUTES.walikelasSiswa}
            className={({ isActive }) =>
              [
                "flex h-full items-center gap-2 border-b-2 px-3 text-sm transition-colors",
                isActive
                  ? "border-orbit-1 font-semibold text-orbit-1"
                  : "border-transparent font-medium text-prose hover:text-space-2",
              ].join(" ")
            }
          >
            <Users size={18} aria-hidden="true" />
            <span>Data Siswa</span>
          </NavLink>
        </nav>

        {/* Kanan: Notifikasi & Profil Akun (Tanpa role switcher) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bell Notifikasi */}
          <div ref={notifRef} className="relative">
            <button
              ref={notifBtnRef}
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              aria-expanded={notifOpen}
              aria-controls={notifId}
              aria-label="Notifikasi"
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-rim-soft bg-white text-space-1 transition-colors hover:bg-surface-soft"
            >
              <Bell size={19} aria-hidden="true" />
            </button>
            {notifOpen && (
              <div
                id={notifId}
                className="absolute right-0 top-full z-50 mt-2 w-[min(340px,calc(100vw-2rem))] rounded-2xl bg-white shadow-card-hover ring-1 ring-rim-soft"
              >
                <div className="flex items-center justify-between border-b border-rim-soft px-4 py-3">
                  <p className="text-sm font-semibold text-space-2">Notifikasi Guru BK</p>
                  <span className="rounded-full bg-tint-blue-bg px-2 py-0.5 text-[11px] font-semibold text-tint-blue-fg">
                    3 Baru
                  </span>
                </div>
                <div className="p-3 text-xs space-y-2 max-h-[300px] overflow-y-auto">
                  <div className="p-2.5 rounded-xl bg-surface-soft hover:bg-surface-blue transition">
                    <p className="font-semibold text-space-2">Candra Wijaya</p>
                    <p className="text-prose-dim">Catatan konseling baru ditambahkan Guru BK</p>
                    <span className="text-[10px] text-prose-faint mt-1 block">2 jam lalu</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-soft hover:bg-surface-blue transition">
                    <p className="font-semibold text-space-2">Bela Saputri</p>
                    <p className="text-prose-dim">Rekomendasi pendampingan diperbarui</p>
                    <span className="text-[10px] text-prose-faint mt-1 block">Kemarin</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Akun Guru */}
          <div ref={accRef} className="relative">
            <button
              ref={accBtnRef}
              type="button"
              onClick={() => setAccOpen((v) => !v)}
              aria-expanded={accOpen}
              aria-controls={accId}
              aria-label={`Menu akun ${wali.name}`}
              className="flex items-center gap-2.5 rounded-full transition-colors hover:bg-surface-soft sm:h-11 sm:rounded-[14px] sm:border sm:border-rim-soft sm:bg-white sm:pl-1.5 sm:pr-2.5"
            >
              <Avatar
                initials={wali.initials}
                className="h-10 w-10 text-[13px] sm:h-8 sm:w-8 bg-gradient-sun text-white font-bold"
              />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block max-w-[140px] truncate text-sm font-semibold text-space-2">
                  {wali.name}
                </span>
                <span className="block text-[11px] text-prose">
                  {wali.kelas}
                </span>
              </span>
              <ChevronDown size={15} aria-hidden="true" className="hidden text-prose sm:block" />
            </button>
            {accOpen && (
              <div
                id={accId}
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-rim-soft"
              >
                <div className="border-b border-rim-soft px-3 pb-3 pt-2">
                  <p className="truncate text-sm font-semibold text-space-2">{wali.name}</p>
                  <p className="text-xs text-prose">NIP. {wali.nip}</p>
                  <p className="mt-1 text-xs font-medium text-orbit-1">Wali Kelas {wali.kelas}</p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAccOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="flex min-h-10 w-full items-center gap-2.5 rounded-xl px-3 text-xs font-semibold text-danger transition-colors hover:bg-alert-bg"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
