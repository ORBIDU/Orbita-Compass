import { Link } from "react-router-dom";
import { MessageSquareText, ChevronRight } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import type { BkNotificationItem } from "@/types/wali";

interface WaliBkNotificationCardProps {
  notifications: BkNotificationItem[];
}

export default function WaliBkNotificationCard({ notifications }: WaliBkNotificationCardProps) {
  const priorityBadge = (p: string) => {
    switch (p) {
      case "Tinggi":
        return "bg-alert-bg text-alert-fg border-alert-rim";
      case "Sedang":
        return "bg-tint-amber-bg text-tint-amber-fg border-tint-amber-fg/30";
      default:
        return "bg-tint-green-bg text-tint-green-fg border-tint-green-fg/30";
    }
  };

  return (
    <div className="rounded-card border border-rim-soft bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between border-b border-rim-soft pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tint-blue-bg text-tint-blue-fg">
            <MessageSquareText size={18} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-space-2 sm:text-lg">
              Notifikasi Guru BK
            </h2>
            <p className="text-xs text-prose-dim">
              Catatan dan hasil pendampingan konseling siswa kelasmu
            </p>
          </div>
        </div>

        <Link
          to={ROUTES.walikelasSiswa}
          className="text-xs font-semibold text-orbit-1 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="mt-4 divide-y divide-rim-soft">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 transition first:pt-0 last:pb-0 hover:bg-surface-soft/60 px-2 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityBadge(
                  item.prioritas
                )}`}
              >
                {item.prioritas}
              </span>
              <div>
                <p className="text-sm font-semibold text-space-2">{item.nama}</p>
                <p className="text-xs text-prose">{item.pesan}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-prose-faint hidden sm:inline-block">
                {item.waktu}
              </span>
              <Link
                to={ROUTES.walikelasDetailSiswa(item.studentId)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-rim-soft bg-white text-space-2 transition hover:bg-surface-blue hover:text-orbit-1"
                aria-label={`Lihat detail ${item.nama}`}
              >
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
