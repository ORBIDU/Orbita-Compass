export interface RadarAxis {
  key: string;
  label: string;
  /** Nilai 0–1 (sudah dibagi skor maksimum). */
  ratio: number;
  /** Tandai sumbu ini (mis. subtes terlemah). */
  highlight?: boolean;
  /** Posisi teks label dalam koordinat viewBox. */
  labelAt: { x: number; y: number; anchor: "start" | "middle" | "end" };
}

interface RadarChartProps {
  axes: RadarAxis[];
  /** Pusat dan jari-jari dalam koordinat viewBox. */
  cx: number;
  cy: number;
  r: number;
  viewBox: string;
  /** "light" untuk kartu putih, "dark" untuk latar navy. */
  tone?: "light" | "dark";
  /** Gambar garis dari pusat ke tiap sudut. */
  spokes?: boolean;
  /** Teks untuk pembaca layar (sebutkan nilai tiap sumbu). */
  ariaLabel: string;
  className?: string;
}

const RINGS = [1, 0.66, 0.33];

const TONE = {
  light: {
    outer: "fill-surface-soft stroke-rim",
    ring: "fill-none stroke-rim",
    spoke: "stroke-rim",
    area: "fill-orbit-1/15 stroke-orbit-1",
    dot: "fill-orbit-1",
    dotHighlight: "fill-sun-1",
    label: "fill-prose",
    labelHighlight: "fill-tint-orange-fg",
  },
  dark: {
    outer: "fill-white/[0.04] stroke-night-text/35",
    ring: "fill-none stroke-night-text/25",
    spoke: "stroke-night-text/20",
    area: "fill-night-accent/25 stroke-night-accent",
    dot: "fill-night-accent",
    dotHighlight: "fill-night-accent",
    label: "fill-night-chip",
    labelHighlight: "fill-night-chip",
  },
} as const;

/** Radar SVG sederhana: sumbu pertama di atas, berputar searah jarum jam. */
export default function RadarChart({ axes, cx, cy, r, viewBox, tone = "light", spokes = false, ariaLabel, className = "" }: RadarChartProps) {
  const t = TONE[tone];
  const point = (i: number, ratio: number): [number, number] => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
    return [cx + r * ratio * Math.cos(angle), cy + r * ratio * Math.sin(angle)];
  };
  const toPoints = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const data = axes.map((a, i) => point(i, Math.max(0, Math.min(1, a.ratio))));

  return (
    <svg viewBox={viewBox} role="img" aria-label={ariaLabel} className={className}>
      {RINGS.map((ratio) => (
        <polygon key={ratio} points={toPoints(axes.map((_, i) => point(i, ratio)))} strokeWidth="1" className={ratio === 1 ? t.outer : t.ring} />
      ))}
      {spokes &&
        axes.map((a, i) => {
          const [x, y] = point(i, 1);
          return <line key={a.key} x1={cx} y1={cy} x2={x} y2={y} strokeWidth="1" className={t.spoke} />;
        })}
      <polygon points={toPoints(data)} strokeWidth="2" strokeLinejoin="round" className={t.area} />
      {data.map(([x, y], i) => (
        <circle key={axes[i].key} cx={x} cy={y} r={axes[i].highlight ? 4 : 3.5} className={axes[i].highlight ? t.dotHighlight : t.dot} />
      ))}
      {axes.map((a) => (
        <text
          key={a.key}
          x={a.labelAt.x}
          y={a.labelAt.y}
          textAnchor={a.labelAt.anchor}
          className={`text-[11px] font-semibold ${a.highlight ? t.labelHighlight : t.label}`}
        >
          {a.label}
        </text>
      ))}
    </svg>
  );
}
