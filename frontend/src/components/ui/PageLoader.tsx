import { Loader2 } from "lucide-react";
import { UI } from "@/content/common";

/** Tanda sedang memuat. `fullscreen` untuk layar penuh (cek sesi saat halaman dibuka). */
export default function PageLoader({ fullscreen = false, label = UI.loadingPage }: { fullscreen?: boolean; label?: string }) {
  if (fullscreen) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-gradient-navy text-white">
        <Loader2 size={36} className="motion-safe:animate-spin" />
        <p className="text-sm font-medium text-white/80">{label}</p>
      </div>
    );
  }
  return (
    <div role="status" className="flex flex-1 items-center justify-center gap-3 py-16 text-ink-muted">
      <Loader2 size={22} className="motion-safe:animate-spin text-orbit-1" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
