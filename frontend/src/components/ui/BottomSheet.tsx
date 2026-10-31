import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { UI } from "@/content/common";

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Bagian bawah yang selalu terlihat (mis. tombol "Lihat 4 beasiswa"). */
  footer?: ReactNode;
  closeLabel?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Lembar dari bawah layar untuk HP/tablet (<1024px). Tutup lewat tombol X,
 * klik latar, atau Escape; fokus tetap di dalam lalu kembali ke pembuka.
 */
export default function BottomSheet({ title, onClose, children, footer, closeLabel = UI.close }: BottomSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, []);

  return createPortal(
    <div className="portal-site fixed inset-0 z-[70] flex items-end lg:hidden">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-space-2/45" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[85dvh] w-full flex-col rounded-t-[24px] bg-white pt-2 shadow-lift focus:outline-none"
      >
        <div aria-hidden="true" className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-rim" />
        <div className="mb-1 flex shrink-0 items-center justify-between px-6">
          <h2 id={titleId} className="text-[17px] font-bold text-space-2">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-3 flex h-11 w-11 items-center justify-center rounded-xl text-prose hover:bg-surface-soft"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className={`min-h-0 flex-1 overflow-y-auto px-3 ${footer ? "pb-3" : "pb-[calc(16px+env(safe-area-inset-bottom))]"}`}>{children}</div>
        {footer && <div className="shrink-0 border-t border-rim-soft px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
