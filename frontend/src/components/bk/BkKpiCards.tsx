import { Link } from "react-router-dom";
import { AlertTriangle, ArrowUpRight, ClipboardList, Users } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import type { BkKpi } from "@/types/bk";

interface BkKpiCardsProps {
  kpi: BkKpi;
}

export default function BkKpiCards({ kpi }: BkKpiCardsProps) {
  const cards = [
    {
      label: "Total Siswa",
      value: kpi.totalSiswa,
      sub: "Siswa aktif semester ini",
      to: ROUTES.bkSiswa,
      icon: Users,
      colorClass: "text-orbit-1",
      borderClass: "border-t-orbit-1",
      iconWrapClass: "bg-tint-blue-bg text-tint-blue-fg",
    },
    {
      label: "Siswa Prioritas",
      value: kpi.siswaPrioritas,
      sub: "Membutuhkan pendampingan",
      to: `${ROUTES.bkSiswa}?prioritas=pendampingan`,
      icon: AlertTriangle,
      colorClass: "text-danger",
      borderClass: "border-t-danger",
      iconWrapClass: "bg-alert-bg text-danger",
    },
    {
      label: "Belum Tes Minat",
      value: kpi.belumTesMinat,
      sub: "Belum mengisi asesmen",
      to: `${ROUTES.bkSiswa}?tesMinat=belum`,
      icon: ClipboardList,
      colorClass: "text-warning",
      borderClass: "border-t-warning",
      iconWrapClass: "bg-tint-amber-bg text-tint-amber-fg",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.label}
            to={card.to}
            className={`group flex flex-col rounded-card border border-rim-soft border-t-4 ${card.borderClass} bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.iconWrapClass}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-prose-dim">
                  {card.label}
                </span>
              </div>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="text-prose-faint transition-colors group-hover:text-orbit-1"
              />
            </div>

            <span className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${card.colorClass}`}>
              {card.value}
            </span>
            <span className="mt-1.5 text-xs text-prose-dim">{card.sub}</span>
          </Link>
        );
      })}
    </div>
  );
}
