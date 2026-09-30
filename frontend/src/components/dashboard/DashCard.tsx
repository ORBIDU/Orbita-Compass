import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, RotateCcw, type LucideIcon } from "lucide-react";
import { LOAD_ERROR, LOCKED, RETRY } from "@/content/dashboard";

interface DashCardProps {
  id: string;
  title: string;
  /** Link/teks kecil di kanan judul. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Kartu putih Dashboard dengan judul (docs/design/portal). */
export function DashCard({ id, title, aside, children, className = "" }: DashCardProps) {
  return (
    <section
      aria-labelledby={id}
      className={`relative flex min-w-0 flex-col gap-3.5 rounded-card border border-rim-soft bg-white p-5 lg:gap-[18px] lg:p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="text-[17px] font-bold text-space-2 lg:text-lg">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** Link kecil di kanan judul kartu. */
export function CardLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="flex min-h-9 shrink-0 items-center rounded text-[13px] font-semibold text-orbit-1 hover:underline lg:min-h-8 lg:text-sm">
      {children}
    </Link>
  );
}

/** Tombol biru solid di dalam kartu. */
export function CardButton({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orbit-1 px-[18px] text-sm font-semibold text-white transition hover:brightness-95 ${className}`}
    >
      {children}
    </Link>
  );
}

const EMPTY_TONE = {
  blue: "bg-tint-blue-bg text-orbit-1",
  orange: "bg-tint-orange-bg text-tint-orange-fg",
} as const;

interface EmptyPanelProps {
  icon: LucideIcon;
  tone?: keyof typeof EMPTY_TONE;
  title: string;
  body: string;
  action?: ReactNode;
}

/** Empty state bergaris putus-putus di dalam kartu: jujur, dengan ajakan bertindak. */
export function EmptyPanel({ icon: Icon, tone = "blue", title, body, action }: EmptyPanelProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-field-rim bg-surface-soft p-6 text-center">
      <span className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${EMPTY_TONE[tone]}`}>
        <Icon size={26} aria-hidden="true" />
      </span>
      <p className="text-base font-semibold text-space-2">{title}</p>
      <p className="max-w-[380px] text-sm leading-relaxed text-prose">{body}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/**
 * Isi kartu yang terkunci (status "baru"): kerangka abu-abu buram, bukan
 * angka contoh, dengan gembok dan penjelasan singkat di atasnya.
 */
export function LockedPanel({ description, lines = 4 }: { description: string; lines?: number }) {
  return (
    <div className="relative flex min-h-[260px] flex-1 flex-col">
      <div aria-hidden="true" className="flex flex-1 flex-col gap-3 opacity-60 blur-[3px]">
        <div className="flex items-center gap-4 rounded-2xl bg-surface-soft p-4">
          <span className="h-14 w-14 rounded-full border-8 border-rim-soft" />
          <span className="flex flex-1 flex-col gap-2">
            <span className="h-3.5 w-2/3 rounded-full bg-rim-soft" />
            <span className="h-3 w-1/2 rounded-full bg-rim-faint" />
          </span>
        </div>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="h-12 rounded-[14px] border border-rim-soft bg-surface-soft" />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-space-2 text-white">
          <Lock size={22} aria-hidden="true" />
        </span>
        <p className="text-[15px] font-semibold text-space-2">{LOCKED.title}</p>
        <p className="max-w-[320px] text-[13px] leading-normal text-prose">{description}</p>
      </div>
    </div>
  );
}

/** Kerangka saat data kartu sedang dimuat. */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div role="status" aria-label="Memuat" className="flex flex-1 animate-pulse flex-col gap-3">
      <span className="h-20 rounded-2xl bg-surface-soft" />
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="h-12 rounded-[14px] bg-surface-soft" />
      ))}
    </div>
  );
}

/** Pesan gagal memuat + tombol coba lagi. */
export function CardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-surface-soft p-6 text-center">
      <p className="text-sm text-prose">{LOAD_ERROR}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-rim px-4 text-sm font-semibold text-orbit-1 hover:bg-white"
      >
        <RotateCcw size={15} aria-hidden="true" /> {RETRY}
      </button>
    </div>
  );
}
