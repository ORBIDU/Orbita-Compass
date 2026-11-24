import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Users } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import { ROUTES } from "@/config/navigation";
import { useDismiss } from "@/lib/useDismiss";
import type { BkTeacherProfile } from "@/types/bk";

interface BkHeaderProps {
  guru: BkTeacherProfile;
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

const HEADER_ALERTS = [
  { id: "alert-1", studentId: 11, nama: "Dewi Kusuma", pesan: "Pengajuan konseling baru menunggu jadwal", waktu: "13:30" },
  { id: "alert-2", studentId: 3, nama: "Candra Wijaya", pesan: "Perlu evaluasi kehadiran minggu ini", waktu: "10:15" },
  { id: "alert-3", studentId: 5, nama: "Eka Pratama", pesan: "Belum mengisi Tes Minat Bakat", waktu: "Kemarin" },
];

export default function BkHeader({ guru, onLogout }: BkHeaderProps) {
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
        {/* Kiri: Logo ORBIDU & Tag Guru BK */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to={ROUTES.bk} className="flex items-center gap-2 shrink-0">
            <Logo size="sm" />
          </Link>
          <div className="hidden h-5 w-px bg-rim-soft sm:block" aria-hidden="true" />
          <div className="hidden items-center gap-2 sm:flex">
            <span className="whitespace-nowrap text-xs font-bold text-space-2 sm:text-sm">
              Guru BK
            </span>
            <span className="whitespace-nowrap rounded-full bg-tint-purple-bg px-2.5 py-0.5 text-[11px] font-semibold text-tint-purple-fg">
              {guru.jabatan || "Konselor"}
            </span>
          </div>
        </div>

        {/* Tengah: Navigasi Utama */}
        <nav aria-label="Menu Guru BK" className="flex h-full items-stretch gap-1 sm:gap-2">
          <NavLink
            to={ROUTES.bk}
            end
            className={({ isActive }) =>
              [
                "flex h-full items-center gap-2 border-b-2 px-2.5 text-sm transition-colors sm:px-3",
                isActive
                  ? "border-orbit-1 font-semibold text-orbit-1"
                  : "border-transparent font-medium text-prose hover:text-space-2",
              ].join(" ")
            }
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">Beranda</span>
          </NavLink>
          <NavLink
            to={ROUTES.bkSiswa}
            className={({ isActive }) =>
              [
                "flex h-full items-center gap-2 border-b-2 px-2.5 text-sm transition-colors sm:px-3",
                isActive
                  ? "border-orbit-1 font-semibold text-orbit-1"
                  : "border-transparent font-medium text-prose hover:text-space-2",
              ].join(" ")
            }
          >
            <Users size={18} aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">Data Siswa</span>
          </NavLink>
        </nav>

        {/* Kanan: Notifikasi & Profil Akun (Tanpa dropdown ganti role) */}
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
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rim-soft bg-white text-space-1 transition-colors hover:bg-surface-soft sm:h-11 sm:w-11"
            >
              <Bell size={19} aria-hidden="true" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-sun-1 ring-2 ring-white" aria-hidden="true" />
            </button>
            {notifOpen && (
              <div
                id={notifId}
                className="absolute right-0 top-full z-50 mt-2 w-[min(340px,calc(100vw-2rem))] rounded-2xl bg-white shadow-card-hover ring-1 ring-rim-soft"
              >
                <div className="flex items-center justify-between border-b border-rim-soft px-4 py-3">
                  <p className="text-sm font-semibold text-space-2">Notifikasi Konseling</p>
                  <span className="rounded-full bg-tint-purple-bg px-2 py-0.5 text-[11px] font-semibold text-tint-purple-fg">
                    {HEADER_ALERTS.length} Baru
                  </span>
                </div>
                <div className="max-h-[300px] space-y-2 overflow-y-auto p-3 text-xs">
                  {HEADER_ALERTS.map((item) => (
                    <Link
                      key={item.id}
                      to={`${ROUTES.bkDetailSiswa(item.studentId)}?tab=bk`}
                      onClick={() => setNotifOpen(false)}
                      className="block rounded-xl bg-surface-soft p-2.5 transition hover:bg-surface-blue"
                    >
                      <p className="font-semibold text-space-2">{item.nama}</p>
                      <p className="text-prose-dim">{item.pesan}</p>
                      <span className="mt-1 block text-[10px] text-prose-faint">{item.waktu}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Akun Konselor */}
          <div ref={accRef} className="relative">
            <button
              ref={accBtnRef}
              type="button"
              onClick={() => setAccOpen((v) => !v)}
              aria-expanded={accOpen}
              aria-controls={accId}
              aria-label={`Menu akun ${guru.name}`}
              className="flex items-center gap-2.5 rounded-full transition-colors hover:bg-surface-soft sm:h-11 sm:rounded-[14px] sm:border sm:border-rim-soft sm:bg-white sm:pl-1.5 sm:pr-2.5"
            >
              <Avatar
                src={guru.avatarUrl ?? null}
                initials={guru.initials}
                className="h-10 w-10 bg-gradient-orbit text-[13px] font-bold text-white sm:h-8 sm:w-8"
              />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block max-w-[150px] truncate text-sm font-semibold text-space-2">
                  {guru.name}
                </span>
                <span className="block text-[11px] text-prose">
                  {guru.jabatan || "Guru BK"}
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
                  <p className="truncate text-sm font-semibold text-space-2">{guru.name}</p>
                  {guru.nip && <p className="text-xs text-prose">NIP. {guru.nip}</p>}
                  <p className="mt-1 text-xs font-medium text-orbit-1">
                    Guru BK · {guru.jabatan || "Konselor"}
                  </p>
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
