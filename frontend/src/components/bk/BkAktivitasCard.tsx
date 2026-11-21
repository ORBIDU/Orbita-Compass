import { Link } from "react-router-dom";
import { BellRing, CheckCircle2, ChevronRight, FilePenLine, Sparkles } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import type { BkActivityItem, BkActivityType } from "@/types/bk";

interface BkAktivitasCardProps {
  aktivitas: BkActivityItem[];
}

const ACTIVITY_STYLE: Record<
  BkActivityType,
  { icon: typeof CheckCircle2; wrap: string; labelClass: string }
> = {
  selesai: {
    icon: CheckCircle2,
    wrap: "bg-tint-green-bg text-tint-green-fg",
    labelClass: "text-space-2",
  },
  catatan: {
    icon: FilePenLine,
    wrap: "bg-tint-blue-bg text-tint-blue-fg",
    labelClass: "text-space-2",
  },
  ai: {
    icon: Sparkles,
    wrap: "bg-tint-purple-bg text-tint-purple-fg",
    labelClass: "text-tint-purple-fg",
  },
  pengajuan: {
    icon: BellRing,
    wrap: "bg-tint-amber-bg text-tint-amber-fg",
    labelClass: "text-space-2",
  },
};

export default function BkAktivitasCard({ aktivitas }: BkAktivitasCardProps) {
  return (
    <section
      aria-labelledby="bk-aktivitas-title"
      className="flex flex-col rounded-card border border-rim-soft bg-white shadow-card"
    >
      <div className="flex items-center justify-between border-b border-rim-soft px-5 py-4 sm:px-6">
        <div>
          <h2 id="bk-aktivitas-title" className="text-base font-bold text-space-2 sm:text-lg">
            Aktivitas Terkini
          </h2>
          <p className="mt-0.5 text-xs text-prose-dim">
            Ringkasan konseling dan pemantauan siswa hari ini
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-tint-blue-bg px-3 py-1 text-[11px] font-semibold text-tint-blue-fg">
          Hari Ini
        </span>
      </div>

      <div className="divide-y divide-rim-soft px-5 py-2 sm:px-6">
        {aktivitas.map((item) => {
          const style = ACTIVITY_STYLE[item.type];
          const Icon = style.icon;
          const rowContent = (
            <>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.wrap}`}
              >
                <Icon size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-bold ${style.labelClass}`}>
                  {item.nama}
                </p>
                <p className="truncate text-xs text-prose-dim">{item.aksi}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-surface-soft px-2.5 py-1 text-xs font-semibold text-prose-dim">
                {item.waktu}
              </span>
              {item.studentId && (
                <ChevronRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-prose-faint transition-colors group-hover:text-orbit-1"
                />
              )}
            </>
          );

          if (item.studentId) {
            return (
              <Link
                key={item.id}
                to={`${ROUTES.bkDetailSiswa(item.studentId)}?tab=bk`}
                className="group -mx-2 flex items-center gap-3.5 rounded-xl px-2 py-3.5 transition-colors hover:bg-surface-soft/70"
              >
                {rowContent}
              </Link>
            );
          }

          return (
            <div key={item.id} className="flex items-center gap-3.5 py-3.5">
              {rowContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
