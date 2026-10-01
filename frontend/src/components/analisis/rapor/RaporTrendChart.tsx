import { CartesianGrid, LabelList, Line, LineChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { RAPOR } from "@/content/analisis";
import { averageScore } from "@/lib/rapor";
import type { RaporSemester } from "@/types/analisis";

interface RaporTrendChartProps {
  semesters: RaporSemester[];
  subject: string;
  /** Label sumbu pendek (HP) atau panjang (desktop). */
  compact: boolean;
}

/**
 * Grafik nilai satu mapel + rata-rata semua mapel per semester (Recharts).
 * Warna diambil dari token lewat kelas Tailwind dan `currentColor`.
 */
export default function RaporTrendChart({ semesters, subject, compact }: RaporTrendChartProps) {
  const data = semesters.map((s) => {
    const score = s.subjects.find((x) => x.subject === subject)?.score ?? null;
    const avg = averageScore(s.subjects);
    return {
      name: compact ? RAPOR.semShort(s.semester) : RAPOR.semLong(s.semester, s.ongoing),
      subject: score,
      avg: avg === null ? null : Math.round(avg * 10) / 10,
      ongoing: s.ongoing,
    };
  });
  const values = data.flatMap((d) => [d.subject, d.avg]).filter((v): v is number => v !== null);
  const min = values.length ? Math.max(0, Math.floor((Math.min(...values) - 3) / 5) * 5) : 70;
  const ticks = Array.from({ length: (100 - min) / 5 + 1 }, (_, i) => min + i * 5);
  const ongoing = data.find((d) => d.ongoing);

  return (
    <div role="img" aria-label={RAPOR.chartLabel(subject)} className="h-[196px] w-full text-prose-dim lg:h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 22, right: compact ? 4 : 8, bottom: 4, left: compact ? -18 : -4 }}>
          <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.15} />
          {ongoing && (
            // Sumbu X berupa titik (lebar pita 0), jadi pita "Belum tersedia" digambar sendiri selebar `band` px.
            <ReferenceArea
              x1={ongoing.name}
              x2={ongoing.name}
              ifOverflow="visible"
              shape={(props: { x?: number; y?: number; height?: number }) => {
                const band = compact ? 36 : 120;
                const x = (props.x ?? 0) - band / 2;
                const y = props.y ?? 0;
                const h = props.height ?? 0;
                return (
                  <g>
                    <rect x={x} y={y} width={band} height={h} className="fill-surface-soft" />
                    {!compact && (
                      <text x={x + band / 2} y={y + h / 2} textAnchor="middle" className="fill-field-hint text-xs">
                        {RAPOR.notAvailable}
                      </text>
                    )}
                  </g>
                );
              }}
            />
          )}
          <XAxis dataKey="name" padding={{ left: compact ? 14 : 30, right: compact ? 18 : 60 }} tickLine={false} axisLine={{ stroke: "currentColor", strokeOpacity: 0.3 }} tick={{ fontSize: compact ? 10 : 11, fill: "currentColor" }} interval={0} />
          <YAxis domain={[min, 100]} ticks={ticks} tickLine={false} axisLine={false} tick={{ fontSize: compact ? 10 : 11, fill: "currentColor" }} width={44} />
          <Line
            type="linear"
            dataKey="avg"
            className="text-rim-box"
            stroke="currentColor"
            strokeWidth={2}
            strokeDasharray="6 5"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line
            type="linear"
            dataKey="subject"
            className="text-orbit-1"
            stroke="currentColor"
            strokeWidth={3}
            dot={{ r: compact ? 4.5 : 5, fill: "white", stroke: "currentColor", strokeWidth: 2.5 }}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={false}
          >
            <LabelList dataKey="subject" position="top" offset={10} className="fill-tint-blue-fg text-xs font-bold" />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
