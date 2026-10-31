import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Tombol ajakan bertindak, misalnya <ButtonLink>. */
  action?: ReactNode;
  className?: string;
  /** Judul sebagai heading (mis. 1 untuk halaman 404). Default: teks biasa, supaya urutan heading halaman tidak rusak. */
  headingLevel?: 1 | 2 | 3;
}

/**
 * Tampilan jujur saat data belum ada, selalu dengan ajakan bertindak.
 * Jangan pernah mengganti data kosong dengan angka palsu.
 */
export default function EmptyState({ icon: Icon, title, description, action, className = "", headingLevel }: EmptyStateProps) {
  const Title = headingLevel ? (`h${headingLevel}` as const) : "p";
  return (
    <div className={`flex flex-col items-center px-6 py-10 text-center ${className}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cloud text-orbit-1">
        <Icon size={26} aria-hidden="true" />
      </div>
      <Title className="text-base font-semibold text-ink">{title}</Title>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
