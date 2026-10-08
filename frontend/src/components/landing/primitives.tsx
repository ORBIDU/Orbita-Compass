import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";

// Potongan kecil yang dipakai berulang di beranda dan halaman publik.

/** Lebar isi halaman publik: 1200px di desktop, dengan jarak tepi di HP. */
export const CONTAINER = "mx-auto w-full max-w-[1200px] px-5 sm:px-8 xl:px-0";

/** Jarak atas-bawah section beranda. */
export const SECTION_Y = "py-[72px] lg:py-[120px]";

/** Chip bernomor oranye (1 Potensi, 2 Arah, dan seterusnya). */
export function StepChip({ no, label, size = "md", className = "" }: { no: number; label: string; size?: "sm" | "md"; className?: string }) {
  const small = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-rim bg-white font-semibold text-space-1 ${
        small ? "h-7 gap-1.5 pl-1 pr-2.5 text-xs" : "h-8 pl-[5px] pr-3.5 text-[13px]"
      } ${className}`}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-sun-1 text-space-2 ${small ? "h-5 w-5 text-[11px]" : "h-[22px] w-[22px] text-xs"}`}
      >
        {no}
      </span>
      {label}
    </span>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-balance text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-space-2 lg:text-[44px] lg:leading-[1.15] lg:tracking-[-0.8px] ${className}`}>
      {children}
    </h2>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-base leading-[1.65] text-prose lg:text-lg lg:leading-[1.7] ${className}`}>{children}</p>;
}

/** Teks aksen tulisan tangan (Pecita, cadangan Caveat). */
export function Accent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-accent text-[30px] font-bold leading-[1.1] lg:text-4xl ${className}`}>{children}</p>;
}

// ─── Tombol berbentuk pil ─────────────────────────────────────────────────────

type PillVariant = "sun" | "blue" | "outline";

const PILL_VARIANT: Record<PillVariant, string> = {
  // CTA paling penting: gradient oranye
  sun: "bg-gradient-sun-x text-space-2 shadow-sun hover:brightness-105",
  // Aksi utama: biru
  blue: "bg-orbit-1 text-white hover:bg-orbit-1/90",
  outline: "border-[1.5px] border-rim-strong bg-white font-medium text-space-1 hover:bg-surface-soft",
};

export function pillClasses(variant: PillVariant, extra = "") {
  return `inline-flex items-center justify-center gap-2.5 rounded-full px-6 text-base font-semibold transition ${PILL_VARIANT[variant]} ${extra}`;
}

type PillIcon = "right" | "down" | "none";

function PillIconEl({ icon }: { icon: PillIcon }) {
  if (icon === "none") return null;
  const Icon = icon === "down" ? ArrowDown : ArrowRight;
  return <Icon size={19} strokeWidth={2.2} aria-hidden="true" />;
}

interface PillCommon {
  variant?: PillVariant;
  icon?: PillIcon;
  className?: string;
  children: ReactNode;
}

/** Tombol pil yang berpindah halaman di dalam aplikasi. */
export function PillLink({ to, variant = "blue", icon = "right", className = "", children }: PillCommon & { to: string }) {
  return (
    <Link to={to} className={pillClasses(variant, className)}>
      {children}
      <PillIconEl icon={icon} />
    </Link>
  );
}

/** Tombol pil ke situs luar (mis. WhatsApp Berlangganan), dibuka di tab baru. */
export function PillExternal({ href, variant = "blue", icon = "right", className = "", children }: PillCommon & { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={pillClasses(variant, className)}>
      {children}
      <PillIconEl icon={icon} />
    </a>
  );
}

/** Tombol pil untuk aksi (scroll, dll.). */
export function PillButton({
  variant = "blue",
  icon = "right",
  className = "",
  children,
  ...props
}: PillCommon & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type="button" className={pillClasses(variant, className)} {...props}>
      {children}
      <PillIconEl icon={icon} />
    </button>
  );
}

/** Link ke situs luar (WhatsApp, Instagram, dll.), selalu dibuka di tab baru. */
export function ExternalLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
