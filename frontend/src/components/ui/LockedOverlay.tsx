import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { ButtonLink } from "./Button";

interface LockedOverlayProps {
  /** Bagian yang dikunci. Tetap tampil samar di belakang gembok. */
  children: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
  className?: string;
}

/**
 * Bagian yang terkunci karena status siswa: isinya dibuat samar dan tidak
 * bisa diklik, dengan satu tombol ajakan yang jelas di atasnya.
 */
export default function LockedOverlay({ children, title, description, actionLabel, actionTo, className = "" }: LockedOverlayProps) {
  return (
    <div className={`relative isolate flex min-h-0 flex-1 flex-col overflow-hidden ${className}`}>
      <div aria-hidden inert className="pointer-events-none flex min-h-0 flex-1 select-none flex-col opacity-40 blur-[3px]">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-page/40 p-4">
        <div className="w-full max-w-sm rounded-card bg-white p-6 text-center shadow-card-hover">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-navy text-white">
            <Lock size={22} />
          </div>
          <p className="text-base font-bold text-ink">{title}</p>
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
          <ButtonLink to={actionTo} variant="cta" className="mt-5 w-full">
            {actionLabel}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
