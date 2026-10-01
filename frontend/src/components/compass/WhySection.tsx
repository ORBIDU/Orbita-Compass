import { Link } from "react-router-dom";
import { Crosshair, Sparkles, TrendingUp, Trophy, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { WHY } from "@/content/compass";
import type { WhyColumns } from "@/lib/compassInsights";

const COLUMNS: { key: keyof WhyColumns; icon: LucideIcon; box: string; dot: string; tab: string }[] = [
  { key: "tes", icon: Crosshair, box: "bg-tint-blue-bg text-orbit-1", dot: "bg-orbit-1", tab: "minat" },
  { key: "prestasi", icon: Trophy, box: "bg-tint-orange-bg text-tint-orange-fg", dot: "bg-tint-orange-fg", tab: "prestasi" },
  { key: "rapor", icon: TrendingUp, box: "bg-tint-green-bg text-tint-green-fg", dot: "bg-tint-green-fg", tab: "rapor" },
];

/** "Kenapa ORBIDU merekomendasikan ini": alasan dari tes, prestasi, dan rapor + catatan. */
export default function WhySection({ columns, note }: { columns: WhyColumns; note: string }) {
  return (
    <section aria-labelledby="compass-why" className="flex flex-col gap-4 rounded-card border border-rim-soft bg-white p-4 lg:p-6">
      <h2 id="compass-why" className="text-lg font-bold text-space-2 lg:text-xl">
        {WHY.title}
      </h2>
      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        {COLUMNS.map(({ key, icon: Icon, box, dot, tab }) => {
          const copy = WHY[key];
          const items = columns[key];
          return (
            <div key={key} className="flex flex-col gap-2.5 rounded-2xl bg-surface-soft p-4 lg:p-[18px]">
              <span className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${box}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="text-[15px] font-bold text-space-2">{copy.title}</h3>
              </span>
              {items.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {items.map((t) => (
                    <li key={t} className="flex gap-2 text-sm leading-normal text-space-1">
                      <span aria-hidden="true" className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-prose">{copy.empty}</p>
              )}
              <Link to={`${ROUTES.analisisPotensi}?tab=${tab}`} className="mt-auto self-start rounded text-[13px] font-semibold text-orbit-1 hover:underline">
                {copy.link}
              </Link>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 rounded-[14px] bg-surface-blue px-4 py-4 lg:px-[18px]">
        <Sparkles size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-orbit-1" />
        <p className="text-sm leading-relaxed text-space-1">
          <strong className="font-semibold">{WHY.noteTitle}</strong> {note}
        </p>
      </div>
    </section>
  );
}
