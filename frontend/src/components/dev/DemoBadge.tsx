import { DEMO_LABEL } from "@/content/common";

/**
 * Penanda situs demo, tampil di semua halaman saat VITE_USE_MOCK=true
 * (dipasang di main.tsx). Letaknya di pojok kiri bawah; di HP naik ke atas
 * menu bawah portal (aturan `.demo-badge` di styles/index.css). Tidak bisa
 * diklik supaya tidak menghalangi tombol di bawahnya.
 */
export default function DemoBadge() {
  return (
    <div
      role="note"
      className="demo-badge pointer-events-none fixed bottom-[calc(8px+env(safe-area-inset-bottom))] left-2 z-[90] rounded-md bg-space-2/85 px-2 ring-1 ring-white/30 py-0.5 text-[11px] font-semibold leading-4 text-white"
    >
      {DEMO_LABEL}
    </div>
  );
}
