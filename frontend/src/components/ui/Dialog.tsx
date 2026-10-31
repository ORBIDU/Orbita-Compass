import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { UI } from "@/content/common";

interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** "alertdialog" untuk konfirmasi (mis. hapus). */
  role?: "dialog" | "alertdialog";
  /** Lebar maksimum, mis. "max-w-[560px]". */
  widthClass?: string;
  /** Ikon/hiasan di atas judul (dipakai dialog konfirmasi). */
  icon?: ReactNode;
  /** false = tanpa tombol X (dialog konfirmasi). */
  showClose?: boolean;
  closeLabel?: string;
  /** Selama true, Escape dan klik latar tidak menutup (mis. sedang menyimpan). */
  busy?: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Jendela modal: fokus pindah ke dalam dan tidak keluar (Tab berputar),
 * Escape atau klik latar menutup, lalu fokus kembali ke tombol pembuka.
 */
export default function Dialog({
  title,
  onClose,
  children,
  role = "dialog",
  widthClass = "max-w-[560px]",
  icon,
  showClose = true,
  closeLabel = UI.close,
  busy = false,
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    // Fokus ke isian pertama; kalau tidak ada, ke panel.
    const first = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !busyRef.current) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === firstItem || document.activeElement === panel)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, []);

  return createPortal(
    <div className="portal-site fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-space-2/45 px-4 py-6 sm:pt-24">
      <div aria-hidden="true" className="fixed inset-0" onClick={() => !busy && onClose()} />
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex w-full ${widthClass} flex-col gap-4 rounded-card-lg bg-white p-5 shadow-dialog focus:outline-none sm:p-7`}
      >
        {icon}
        <div className="flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-bold text-space-2 sm:text-xl">
            {title}
          </h2>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label={closeLabel}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-rim-soft bg-white text-space-1 hover:bg-surface-soft disabled:opacity-50"
            >
              <X size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
