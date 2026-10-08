import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, LayoutGrid, LogOut, TriangleAlert } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import BottomSheet from "@/components/ui/BottomSheet";
import { PENGERJAAN_ERROR, SAMPLE_LABEL, SESSION } from "@/content/pengerjaan";

/** Kerangka halaman pengerjaan: tanpa menu portal, soal di kiri, nomor soal di kanan (laptop). */
export function RunLayout({ header, children, aside, notice }: { header: ReactNode; children: ReactNode; aside: ReactNode; notice?: ReactNode }) {
  return (
    <div className="portal-site flex min-h-dvh flex-col bg-surface-soft text-space-2">
      {header}
      <div className="mx-auto grid w-full max-w-[1280px] flex-1 items-start gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 lg:px-8 lg:py-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-3">
          {notice}
          {children}
          <p className="text-xs text-prose-dim">{SAMPLE_LABEL}</p>
        </div>
        {aside}
      </div>
    </div>
  );
}

/** Panel nomor soal: kartu samping di laptop, tombol + bottom sheet di HP. */
/** `children` menerima fungsi tutup, supaya memilih nomor di HP juga menutup sheet. */
export function NumberPanel({ title, children }: { title: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside aria-label={title} className="hidden flex-col gap-4 rounded-card border border-rim-soft bg-white p-[22px] lg:sticky lg:top-[92px] lg:flex">
        <h2 className="text-base font-bold">{title}</h2>
        {children(() => undefined)}
      </aside>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-rim bg-white text-sm font-semibold text-space-1 lg:hidden"
      >
        <LayoutGrid size={16} aria-hidden="true" />
        {SESSION.navOpen}
      </button>
      {open && (
        <BottomSheet title={title} onClose={() => setOpen(false)} closeLabel={SESSION.navClose}>
          {children(() => setOpen(false))}
        </BottomSheet>
      )}
    </>
  );
}

/** Jendela konfirmasi (keluar / selesai). */
export function ConfirmDialog({
  kind,
  title,
  body,
  ok,
  cancel,
  busy,
  onOk,
  onCancel,
}: {
  kind: "exit" | "finish";
  title: string;
  body: string;
  ok: string;
  cancel: string;
  busy?: boolean;
  onOk: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog
      title={title}
      role="alertdialog"
      showClose={false}
      busy={busy}
      onClose={onCancel}
      widthClass="max-w-[480px]"
      icon={
        <span className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${kind === "exit" ? "bg-rim-faint text-space-1" : "bg-tint-orange-bg text-tint-orange-fg"}`}>
          {kind === "exit" ? <LogOut size={24} aria-hidden="true" /> : <AlertTriangle size={24} aria-hidden="true" />}
        </span>
      }
    >
      <p className="-mt-1 text-[15px] leading-relaxed text-prose">{body}</p>
      <div className="mt-1 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <button
          type="button"
          data-autofocus
          onClick={onCancel}
          disabled={busy}
          className="h-[46px] rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-50"
        >
          {cancel}
        </button>
        <button
          type="button"
          onClick={onOk}
          disabled={busy}
          aria-busy={busy}
          className="h-[46px] rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-wait disabled:opacity-70"
        >
          {ok}
        </button>
      </div>
    </Dialog>
  );
}

/** Halaman pengerjaan tidak bisa dibuka (mis. latihan belum terbuka, soal contoh belum ada). */
export function RunError({ message, backTo, backLabel }: { message: string; backTo: string; backLabel?: string }) {
  return (
    <main className="portal-site flex min-h-dvh items-center justify-center bg-surface-soft px-4">
      <div className="flex max-w-[440px] flex-col items-center gap-3 rounded-card-lg border border-rim-soft bg-white px-6 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint-orange-bg text-tint-orange-fg">
          <TriangleAlert size={26} aria-hidden="true" />
        </span>
        <h1 className="text-xl font-bold text-space-2">{PENGERJAAN_ERROR.title}</h1>
        <p className="text-sm leading-relaxed text-prose">{message}</p>
        <Link to={backTo} className="mt-2 inline-flex h-11 items-center rounded-xl border-[1.5px] border-rim px-4 text-sm font-semibold text-space-1 hover:bg-surface-soft">
          {backLabel ?? PENGERJAAN_ERROR.back}
        </Link>
      </div>
    </main>
  );
}

/** Pemberitahuan di atas soal (mis. waktu subtes habis). */
export function RunNotice({ children, tone = "warn" }: { children: ReactNode; tone?: "warn" | "error" }) {
  return (
    <p role="status" className={`rounded-[14px] px-4 py-3 text-[13px] leading-normal ${tone === "warn" ? "bg-surface-peach text-tint-orange-ink" : "bg-alert-bg text-alert-fg"}`}>
      {children}
    </p>
  );
}
