import type { WaliKpi } from "@/types/wali";

interface WaliKpiCardsProps {
  kpi: WaliKpi;
}

export default function WaliKpiCards({ kpi }: WaliKpiCardsProps) {
  const cards = [
    {
      label: "Rata-rata Nilai",
      value: kpi.rataRataNilai.toFixed(1).replace(".", ","),
      sub: `↑ +${kpi.deltaNilai.toFixed(1).replace(".", ",")} vs sem lalu`,
      colorClass: "text-orbit-1",
      borderClass: "border-t-orbit-1",
    },
    {
      label: "Nilai Tertinggi",
      value: kpi.nilaiTertinggi.toFixed(1).replace(".", ","),
      sub: kpi.namaTertinggi,
      colorClass: "text-success",
      borderClass: "border-t-success",
    },
    {
      label: "Nilai Terendah",
      value: kpi.nilaiTerendah.toFixed(1).replace(".", ","),
      sub: kpi.noteTerendah,
      colorClass: "text-danger",
      borderClass: "border-t-danger",
    },
    {
      label: "Ketuntasan",
      value: `${kpi.ketuntasanPct}%`,
      sub: `${kpi.tuntasCount} dari ${kpi.totalCount} siswa tuntas`,
      colorClass: "text-warning",
      borderClass: "border-t-warning",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex flex-col rounded-card border border-rim-soft border-t-4 ${card.borderClass} bg-white p-4 shadow-card sm:p-5`}
        >
          <span className={`text-2xl font-bold tracking-tight sm:text-3xl ${card.colorClass}`}>
            {card.value}
          </span>
          <span className="mt-1 text-xs font-semibold text-space-2 sm:text-sm">
            {card.label}
          </span>
          <span className="mt-1 text-[11px] text-prose-dim sm:text-xs">
            {card.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
