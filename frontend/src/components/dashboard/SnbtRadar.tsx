import { SNBT_MAX_SCORE, SNBT_SUBTESTS, type SnbtSubtest } from "@/types/dashboard";
import RadarChart, { type RadarAxis } from "@/components/ui/RadarChart";

/** Posisi label tiap subtes, mengikuti desain (viewBox 260×256). */
const LABEL_AT: Record<SnbtSubtest, RadarAxis["labelAt"]> = {
  PU: { x: 130, y: 18, anchor: "middle" },
  PPU: { x: 214, y: 60, anchor: "start" },
  PBM: { x: 233, y: 158, anchor: "start" },
  PK: { x: 178, y: 243, anchor: "middle" },
  LBI: { x: 82, y: 243, anchor: "middle" },
  LBE: { x: 27, y: 158, anchor: "end" },
  PM: { x: 46, y: 60, anchor: "end" },
};

interface SnbtRadarProps {
  scores: Record<SnbtSubtest, number>;
  /** Subtes terlemah, ditandai oranye. */
  weakest: SnbtSubtest;
  label: string;
  className?: string;
}

/** Radar skor 7 subtes SNBT (0–1000), seperti di desain Dashboard. */
export default function SnbtRadar({ scores, weakest, label, className = "" }: SnbtRadarProps) {
  const axes: RadarAxis[] = SNBT_SUBTESTS.map((s) => ({
    key: s.key,
    label: s.key,
    ratio: scores[s.key] / SNBT_MAX_SCORE,
    highlight: s.key === weakest,
    labelAt: LABEL_AT[s.key],
  }));
  const summary = SNBT_SUBTESTS.map((s) => `${s.key} ${scores[s.key]}`).join(", ");
  return <RadarChart axes={axes} cx={130} cy={130} r={100} viewBox="0 0 260 256" ariaLabel={`${label}: ${summary}`} className={className} />;
}
