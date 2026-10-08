import { RotateCcw } from "lucide-react";
import { LOAD_ERROR, RETRY } from "@/content/common";

/** Kerangka saat isi tab sedang dimuat. */
export function PanelSkeleton() {
  return (
    <div role="status" aria-label="Memuat" className="flex animate-pulse flex-col gap-4">
      <span className="h-24 rounded-card bg-white" />
      <span className="h-64 rounded-card bg-white" />
    </div>
  );
}

/** Isi tab gagal dimuat, dengan tombol coba lagi. */
export function PanelError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-rim-soft bg-white p-8 text-center">
      <p className="text-sm text-prose">{LOAD_ERROR}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-rim px-4 text-sm font-semibold text-orbit-1 hover:bg-surface-soft"
      >
        <RotateCcw size={15} aria-hidden="true" /> {RETRY}
      </button>
    </div>
  );
}
