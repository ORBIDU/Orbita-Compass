import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { ROUTES } from "@/config/navigation";

interface WaliKelengkapanProfilProps {
  kelengkapan: {
    lengkapPct: number;
    lengkapCount: number;
    belumCount: number;
    totalCount: number;
  };
}

export default function WaliKelengkapanProfil({ kelengkapan }: WaliKelengkapanProfilProps) {
  return (
    <div className="flex flex-col justify-between rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
      <div>
        <h2 className="text-base font-bold text-space-2 sm:text-lg">
          Kelengkapan Data Profil
        </h2>
        <p className="text-xs text-prose-dim">
          Status kelengkapan biodata, rapor, dan minat siswa
        </p>
      </div>

      <div className="my-6 flex flex-col items-center">
        {/* Progress Ring / Percentage Box */}
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-surface-soft bg-surface-blue">
          <div className="text-center">
            <span className="text-2xl font-bold tracking-tight text-orbit-1">
              {kelengkapan.lengkapPct}%
            </span>
            <span className="block text-[10px] font-semibold uppercase text-prose-dim">
              Tercapai
            </span>
          </div>
        </div>

        {/* Breakdown Status */}
        <div className="mt-5 grid w-full grid-cols-2 gap-3 border-t border-rim-soft pt-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-success">
              <CheckCircle2 size={15} />
              <span className="text-xl font-bold">{kelengkapan.lengkapCount}</span>
            </div>
            <span className="text-xs text-prose-dim">Lengkap</span>
          </div>

          <div className="flex flex-col items-center border-l border-rim-soft">
            <div className="flex items-center gap-1.5 text-danger">
              <AlertCircle size={15} />
              <span className="text-xl font-bold">{kelengkapan.belumCount}</span>
            </div>
            <span className="text-xs text-prose-dim">Belum Lengkap</span>
          </div>
        </div>
      </div>

      <Link
        to={ROUTES.walikelasSiswa}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-surface-soft text-sm font-semibold text-space-2 transition hover:bg-surface-blue hover:text-orbit-1"
      >
        <span>Lihat Data Siswa</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
