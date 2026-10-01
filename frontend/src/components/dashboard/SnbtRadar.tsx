import { SNBT_MAX_SCORE, SNBT_SUBTESTS, type SnbtSubtest } from "@/types/dashboard";

const CX = 130;
const CY = 130;
const R = 100;
/** Garis bantu di 1/3, 2/3, dan penuh. */
const RINGS = [1, 0.66, 0.33];

/** Posisi label tiap subtes, mengikuti desain (viewBox 260×256). */
const LABEL_POS: Record<SnbtSubtest, { x: number; y: number; anchor: "start" | "middle" | "end" }> = {
  PU: { x: 130, y: 18, anchor: "middle" },
  PPU: { x: 214, y: 60, anchor: "start" },
  PBM: { x: 233, y: 158, anchor: "start" },
  PK: { x: 178, y: 243, anchor: "middle" },
  LBI: { x: 82, y: 243, anchor: "middle" },
  LBE: { x: 27, y: 158, anchor: "end" },
  PM: { x: 46, y: 60, anchor: "end" },
};

function point(i: number, ratio: number): [number, number] {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / SNBT_SUBTESTS.length;
  return [CX + R * ratio * Math.cos(angle), CY + R * ratio * Math.sin(angle)];
}

const toPoints = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

interface SnbtRadarProps {
  scores: Record<SnbtSubtest, number>;
  /** Subtes terlemah, ditandai oranye. */
  weakest: SnbtSubtest;
  label: string;
  className?: string;
}

/** Radar skor 7 subtes SNBT (0–1000). Digambar dengan SVG seperti di desain. */
export default function SnbtRadar({ scores, weakest, label, className = "" }: SnbtRadarProps) {
  const data = SNBT_SUBTESTS.map((s, i) => point(i, Math.max(0, Math.min(1, scores[s.key] / SNBT_MAX_SCORE))));
  const summary = SNBT_SUBTESTS.map((s) => `${s.key} ${scores[s.key]}`).join(", ");

  return (
    <svg viewBox="0 0 260 256" role="img" aria-label={`${label}: ${summary}`} className={className}>
      {RINGS.map((ratio) => (
        <polygon
          key={ratio}
          points={toPoints(SNBT_SUBTESTS.map((_, i) => point(i, ratio)))}
          strokeWidth="1"
          className={`stroke-rim ${ratio === 1 ? "fill-surface-soft" : "fill-none"}`}
        />
      ))}
      <polygon points={toPoints(data)} strokeWidth="2" strokeLinejoin="round" className="fill-orbit-1/15 stroke-orbit-1" />
      {data.map(([x, y], i) => {
        const weak = SNBT_SUBTESTS[i].key === weakest;
        return <circle key={SNBT_SUBTESTS[i].key} cx={x} cy={y} r={weak ? 4 : 3.5} className={weak ? "fill-sun-1" : "fill-orbit-1"} />;
      })}
      {SNBT_SUBTESTS.map(({ key }) => {
        const pos = LABEL_POS[key];
        return (
          <text
            key={key}
            x={pos.x}
            y={pos.y}
            textAnchor={pos.anchor}
            className={`text-[11px] font-semibold ${key === weakest ? "fill-tint-orange-fg" : "fill-prose"}`}
          >
            {key}
          </text>
        );
      })}
    </svg>
  );
}
