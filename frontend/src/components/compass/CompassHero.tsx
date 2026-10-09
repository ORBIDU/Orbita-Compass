import { BIDANG } from "@/config/bidang";
import { COMPASS_HERO, DIMENSION_LABEL } from "@/content/compass";
import { DIMENSIONS, type Aspect } from "@/lib/compassInsights";
import type { Assessment } from "@/types/backend";
import type { BidangKey, FitLabel } from "@/types/jurusan";
import RadarChart, { type RadarAxis } from "@/components/ui/RadarChart";

const FIELD_FIT = { "Sangat sesuai": "Sangat selaras", Sesuai: "Selaras" } as const;

/** Posisi label radar 5 dimensi (viewBox desain "-44 -16 328 238", pusat 120,110). */
const LABEL_AT: Record<string, RadarAxis["labelAt"]> = {
  technology: { x: 120, y: 4, anchor: "middle" },
  research: { x: 218, y: 80, anchor: "start" },
  creativity: { x: 180, y: 206, anchor: "start" },
  leadership: { x: 60, y: 206, anchor: "end" },
  communication: { x: 22, y: 80, anchor: "end" },
};

function AspectCard({ aspect, name }: { aspect: Aspect; name: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-night-text/20 bg-white/[0.07] px-3.5 py-3">
      <span className="text-[13px] text-night-text">{name}</span>
      <span className="text-sm font-semibold text-night-light">{aspect.label}</span>
      <div aria-hidden="true" className="grid grid-cols-5 gap-[3px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-[5px] rounded-[3px] ${i <= aspect.level ? "bg-night-accent" : "bg-night-text/25"}`} />
        ))}
      </div>
    </div>
  );
}

interface CompassHeroProps {
  bidang: BidangKey | null;
  fit: FitLabel | null;
  summary: string;
  aspects: Aspect[];
  assessment: Assessment | null;
}

/** Hero navy: bidang paling selaras, ringkasan, 3 aspek (label + bar), radar minat. */
export default function CompassHero({ bidang, fit, summary, aspects, assessment }: CompassHeroProps) {
  const axes: RadarAxis[] | null = assessment
    ? DIMENSIONS.map((d) => ({ key: d, label: DIMENSION_LABEL[d], ratio: assessment[d] / 100, labelAt: LABEL_AT[d] }))
    : null;
  const radarText = assessment ? DIMENSIONS.map((d) => `${DIMENSION_LABEL[d]} ${assessment[d]}`).join(", ") : "";

  return (
    <section
      aria-labelledby="compass-arah"
      className="on-dark relative grid gap-6 overflow-hidden rounded-card-lg bg-portal-hero-sm px-5 py-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-10 lg:bg-portal-hero lg:px-9 lg:py-8"
    >
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold text-night-text">{COMPASS_HERO.eyebrow}</span>
        <h2 id="compass-arah" className="text-[26px] font-bold leading-tight tracking-[-0.5px] text-night-light lg:text-[34px] lg:tracking-[-0.6px]">
          {bidang ? BIDANG[bidang].label : COMPASS_HERO.noField}
        </h2>
        {bidang && fit && (
          <span className="self-start rounded-full bg-night-positive-bg px-3 py-1 text-[13px] font-semibold text-night-positive">{FIELD_FIT[fit]}</span>
        )}
        {summary && <p className="max-w-[560px] text-sm leading-relaxed text-night-sub lg:text-[15px]">{summary}</p>}
        <div className="mt-1.5 grid max-w-[600px] grid-cols-1 gap-3 sm:grid-cols-3">
          {aspects.map((a) => (
            <AspectCard key={a.key} aspect={a} name={COMPASS_HERO.aspects[a.key]} />
          ))}
        </div>
      </div>
      {axes && (
        <div className="flex flex-col items-center gap-1.5">
          <RadarChart
            axes={axes}
            cx={120}
            cy={110}
            r={90}
            viewBox="-44 -16 328 238"
            tone="dark"
            spokes
            ariaLabel={COMPASS_HERO.radarLabel(radarText)}
            className="h-auto w-full max-w-[300px]"
          />
          <span className="text-xs text-night-text">{COMPASS_HERO.radarCaption}</span>
        </div>
      )}
    </section>
  );
}
