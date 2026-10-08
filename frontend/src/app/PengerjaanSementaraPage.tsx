import { useNavigate } from "react-router-dom";
import { ArrowLeft, Hourglass } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { PENGERJAAN_SEMENTARA } from "@/content/siapUjian";

/**
 * SEMENTARA (Tahap 7B): tujuan tombol Kerjakan/Lanjutkan/Mulai latihan/Lihat
 * laporan. Diganti halaman pengerjaan soal dan laporan di Tahap 7C.
 * Tampil tanpa menu portal, seperti halaman pengerjaan nantinya.
 */
export default function PengerjaanSementaraPage() {
  const navigate = useNavigate();
  return (
    <main className="portal-site flex min-h-dvh items-center justify-center bg-surface-soft px-4">
      <div className="flex max-w-[440px] flex-col items-center gap-3 rounded-card-lg border border-rim-soft bg-white px-6 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint-blue-bg text-orbit-1">
          <Hourglass size={26} aria-hidden="true" />
        </span>
        <h1 className="text-xl font-bold text-space-2">{PENGERJAAN_SEMENTARA.title}</h1>
        <p className="text-sm leading-relaxed text-prose">{PENGERJAAN_SEMENTARA.body}</p>
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(ROUTES.portal))}
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-rim px-4 text-sm font-semibold text-space-1 hover:bg-surface-soft"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {PENGERJAAN_SEMENTARA.back}
        </button>
      </div>
    </main>
  );
}
