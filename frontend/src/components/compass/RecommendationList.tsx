import { Link } from "react-router-dom";
import { Check, Crosshair, Flag, Sparkles, TrendingUp, Trophy, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { BIDANG } from "@/config/bidang";
import { RECOMMENDATIONS } from "@/content/compass";
import type { WhyChip, WhyKind } from "@/lib/compassInsights";
import type { CompassRecommendation, CompassTarget } from "@/types/compass";
import FitBadge from "@/components/jurusan/FitBadge";

const WHY_ICON: Record<WhyKind, { icon: LucideIcon; className: string }> = {
  minat: { icon: Crosshair, className: "text-orbit-1" },
  rapor: { icon: TrendingUp, className: "text-tint-green-fg" },
  prestasi: { icon: Trophy, className: "text-tint-orange-fg" },
  compass: { icon: Sparkles, className: "text-orbit-1" },
};

export interface RecommendationRow {
  rec: CompassRecommendation;
  why: WhyChip[];
}

interface RecommendationListProps {
  rows: RecommendationRow[];
  target: CompassTarget | null;
  savingKey: string | null;
  error: string | null;
  onToggleTarget: (rec: CompassRecommendation) => void;
}

/** Kunci target: slug jika ada di katalog, selain itu nama. */
export const targetKeyOf = (r: { slug: string | null; name: string }) => r.slug ?? `nama:${r.name}`;

/** "Jurusan yang bisa kamu eksplorasi" + pilih satu sebagai target. */
export default function RecommendationList({ rows, target, savingKey, error, onToggleTarget }: RecommendationListProps) {
  const targetKey = target ? targetKeyOf(target) : null;

  return (
    <section aria-labelledby="compass-rek" className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="flex flex-col gap-1">
          <h2 id="compass-rek" className="text-lg font-bold text-space-2 lg:text-xl">
            {RECOMMENDATIONS.title}
          </h2>
          <p className="text-sm text-prose">{RECOMMENDATIONS.subtitle}</p>
        </div>
        {target && (
          <span aria-live="polite" className="flex items-center gap-2 self-start rounded-xl bg-tint-green-bg px-3 py-2 text-[13px] font-semibold text-tint-green-fg lg:shrink-0 lg:self-auto">
            <Check size={16} strokeWidth={2.4} aria-hidden="true" />
            {RECOMMENDATIONS.targetChip(target.name)}
          </span>
        )}
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-alert-bg px-4 py-2.5 text-sm text-alert-fg">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="rounded-[18px] border border-rim-soft bg-white p-5 text-sm text-prose">{RECOMMENDATIONS.empty}</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {rows.map(({ rec, why }, i) => {
            const key = targetKeyOf(rec);
            const isTarget = key === targetKey;
            const saving = savingKey === key;
            return (
              <li
                key={key}
                className={`grid grid-cols-[36px_minmax(0,1fr)] items-start gap-x-3.5 gap-y-3 rounded-[18px] border-[1.5px] bg-white p-4 lg:grid-cols-[36px_minmax(0,1fr)_auto] lg:items-center lg:gap-4 lg:px-5 lg:py-[18px] ${
                  isTarget ? "border-tint-green-fg" : "border-rim-soft"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-field-track text-[15px] font-bold tabular-nums text-prose">{i + 1}</span>
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h3 className="text-base font-bold text-space-2 lg:text-[17px]">{rec.name}</h3>
                    <FitBadge label={rec.fit} />
                    <span className="text-[13px] text-prose-dim">{rec.bidang ? BIDANG[rec.bidang].label : RECOMMENDATIONS.notInCatalog}</span>
                  </div>
                  {why.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {why.map((w) => {
                        const { icon: Icon, className } = WHY_ICON[w.kind];
                        return (
                          <li key={w.text} className="flex items-center gap-1.5 rounded-lg bg-surface-soft px-2.5 py-1 text-[13px] text-space-1">
                            <Icon size={14} strokeWidth={2.2} aria-hidden="true" className={`shrink-0 ${className}`} />
                            {w.text}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className="col-span-2 flex flex-wrap gap-2 lg:col-span-1 lg:flex-nowrap">
                  {rec.slug && (
                    <Link
                      to={ROUTES.jurusanDetail(rec.slug)}
                      className="flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-[10px] border border-rim px-3 text-[13px] font-semibold text-space-1 hover:bg-surface-soft lg:flex-none lg:px-3.5"
                    >
                      {RECOMMENDATIONS.view}
                    </Link>
                  )}
                  <button
                    type="button"
                    aria-pressed={isTarget}
                    disabled={savingKey !== null}
                    onClick={() => onToggleTarget(rec)}
                    className={`flex h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] border-[1.5px] px-3 text-[13px] lg:px-3.5 font-semibold transition-colors disabled:cursor-wait lg:flex-none ${
                      isTarget ? "border-tint-green-fg bg-tint-green-fg text-white" : "border-orbit-1 bg-white text-orbit-1 hover:bg-surface-sky"
                    } ${saving ? "opacity-70" : ""}`}
                  >
                    {isTarget ? <Check size={14} strokeWidth={2.4} aria-hidden="true" /> : <Flag size={14} strokeWidth={2.2} aria-hidden="true" />}
                    {isTarget ? RECOMMENDATIONS.isTarget : RECOMMENDATIONS.setTarget}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
