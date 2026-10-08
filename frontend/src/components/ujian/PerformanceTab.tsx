import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { EXAM_COPY, PERFORMANCE } from "@/content/siapUjian";
import { formatDayMonth } from "@/lib/datetime";
import { SUBSCORE_MAX, type ExamOverview } from "@/types/practice";

/** Kartu kosong kecil dengan ajakan pindah tab. */
function EmptyNote({ title, body, action, onAction }: { title: string; body: string; action: string; onAction: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-lg font-bold text-space-2">{title}</span>
      <span className="text-[13px] leading-normal text-prose">{body}</span>
      <button type="button" onClick={onAction} className="mt-1 self-start text-[13px] font-semibold text-orbit-1 hover:underline">
        {action}
      </button>
    </div>
  );
}

/** Tab Performance: skor terakhir, akurasi, subtes terlemah, tren tryout, skor per subtes. */
export default function PerformanceTab({ overview, onTab }: { overview: ExamOverview; onTab: (tab: "latihan" | "tryout") => void }) {
  const copy = EXAM_COPY[overview.exam];
  const done = overview.tryouts.filter((t) => t.result);
  const last = done[done.length - 1] ?? null;
  const prev = done[done.length - 2] ?? null;
  const next = overview.tryouts.find((t) => t.status === "open") ?? null;
  const diff = last && prev ? last.result!.score - prev.result!.score : null;

  const subjectName = (key: string) => overview.subjects.find((s) => s.subject === key)?.name ?? key;
  const max = SUBSCORE_MAX[overview.exam];
  const weakest = overview.weakest;

  const chartData = [
    ...done.map((t) => ({ name: t.pkg.name, score: t.result!.score })),
    ...(next ? [{ name: next.pkg.name, score: null as number | null }] : []),
  ];
  const scores = done.map((t) => t.result!.score);
  const lo = scores.length ? Math.min(...scores) : 0;
  const hi = scores.length ? Math.max(...scores) : 0;
  const pad = Math.max(10, Math.round((hi - lo) * 0.6) || Math.round(hi * 0.1));

  const bars = last
    ? overview.subjects
        .filter((s) => last.result!.subscores[s.subject] !== undefined)
        .map((s) => ({ ...s, value: last.result!.subscores[s.subject], ratio: last.result!.subscores[s.subject] / (max(s.subject) || 1) }))
    : [];
  const minRatio = bars.length ? Math.min(...bars.map((b) => b.ratio)) : 0;

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
        <div className="flex flex-col gap-1 rounded-[18px] border border-rim-soft bg-white p-4 lg:p-5">
          {last ? (
            <>
              <span className="text-[13px] text-prose">{PERFORMANCE.lastScore}</span>
              <span className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-[30px] font-bold tabular-nums text-space-2">{last.result!.score}</span>
                <span
                  aria-label={diff === null ? undefined : PERFORMANCE.deltaLabel(diff)}
                  className={`rounded-full px-2 py-0.5 text-[13px] font-bold tabular-nums ${
                    diff === null || diff === 0 ? "bg-surface-track text-prose" : diff > 0 ? "bg-tint-green-bg text-tint-green-fg" : "bg-tint-orange-bg text-tint-orange-fg"
                  }`}
                >
                  {diff === null ? PERFORMANCE.first : PERFORMANCE.delta(diff)}
                </span>
              </span>
              <span className="text-xs text-prose-dim">{PERFORMANCE.lastName(last.pkg.name, formatDayMonth(last.result!.completedAt))}</span>
            </>
          ) : (
            <EmptyNote title={PERFORMANCE.noTryout} body={PERFORMANCE.noTryoutBody} action={PERFORMANCE.toTryout} onAction={() => onTab("tryout")} />
          )}
        </div>
        <div className="flex flex-col gap-1 rounded-[18px] border border-rim-soft bg-white p-4 lg:p-5">
          {overview.accuracy ? (
            <>
              <span className="text-[13px] text-prose">{PERFORMANCE.accuracy}</span>
              <span className="text-[30px] font-bold tabular-nums text-space-2">{overview.accuracy.percent}%</span>
              <span className="text-xs tabular-nums text-prose-dim">{PERFORMANCE.accuracyFrom(overview.accuracy.answered)}</span>
            </>
          ) : (
            <EmptyNote title={PERFORMANCE.noPractice} body={PERFORMANCE.noPracticeBody} action={PERFORMANCE.toPractice} onAction={() => onTab("latihan")} />
          )}
        </div>
        <div className="flex flex-col gap-1 rounded-[18px] border border-tint-orange-line bg-surface-peach p-4 lg:p-5">
          <span className="text-[13px] text-tint-orange-ink">{PERFORMANCE.weakest}</span>
          <span className="text-xl font-bold text-space-2">{weakest ? subjectName(weakest.subject) : "–"}</span>
          <span className="text-xs text-tint-orange-ink">
            {!weakest ? PERFORMANCE.noPracticeBody : weakest.from === "practice" ? PERFORMANCE.weakestNote : PERFORMANCE.weakestFromTryout}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-5">
        <section aria-labelledby="pu-tren" className="flex flex-col gap-3.5 rounded-card border border-rim-soft bg-white p-4 sm:p-[22px]">
          <h2 id="pu-tren" className="text-[17px] font-bold text-space-2">
            {PERFORMANCE.trendTitle}
          </h2>
          {done.length > 0 ? (
            <div role="img" aria-label={`${PERFORMANCE.trendLabel(copy.short)}: ${done.map((t) => `${t.pkg.name} ${t.result!.score}`).join(", ")}`} className="h-[220px] w-full text-prose-dim">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 24, right: 24, bottom: 4, left: -8 }}>
                  <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.15} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    padding={{ left: 24, right: 24 }}
                    tick={(props: unknown) => {
                      const { x, y, payload } = props as { x?: number; y?: number; payload?: { value: string } };
                      const pending = next && payload?.value === next.pkg.name;
                      return (
                        <g transform={`translate(${x ?? 0},${y ?? 0})`}>
                          <text dy={14} textAnchor="middle" className="fill-prose-dim text-[11px]">
                            {payload?.value}
                          </text>
                          {pending && (
                            <text dy={28} textAnchor="middle" className="fill-field-hint text-[10px]">
                              {PERFORMANCE.notYet}
                            </text>
                          )}
                        </g>
                      );
                    }}
                    height={40}
                  />
                  <YAxis domain={[Math.max(0, lo - pad), hi + pad]} tickLine={false} axisLine={false} width={44} tick={{ fill: "currentColor", fontSize: 11 }} allowDecimals={false} />
                  <Line type="linear" dataKey="score" connectNulls={false} stroke="currentColor" className="text-orbit-1" strokeWidth={3} dot={({ cx, cy, index }: { cx?: number; cy?: number; index?: number }) =>
                      cy === undefined || cy === null ? <g key={index} /> : <circle key={index} cx={cx} cy={cy} r={5} strokeWidth={2.5} className="fill-white stroke-orbit-1" />
                    } isAnimationActive={false}>
                    <LabelList dataKey="score" position="top" offset={10} className="fill-tint-blue-fg text-xs font-bold" />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-prose">{PERFORMANCE.trendEmpty}</p>
          )}
          <p className="text-xs leading-normal text-prose-dim">{copy.scaleNote}</p>
        </section>

        <section aria-labelledby="pu-sub" className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-4 sm:p-[22px]">
          <h2 id="pu-sub" className="text-[17px] font-bold text-space-2">
            {PERFORMANCE.subTitle}
          </h2>
          {bars.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {bars.map((b) => {
                const weak = b.ratio === minRatio;
                return (
                  <li key={b.subject} className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-x-3 gap-y-1 text-[13px] sm:grid-cols-[170px_minmax(0,1fr)_48px]">
                    <span className={`text-space-1 ${weak ? "font-bold" : "font-medium"}`}>{b.name}</span>
                    <span className={`text-right font-bold tabular-nums sm:col-start-3 sm:row-start-1 ${weak ? "text-tint-orange-fg" : "text-space-2"}`}>{b.value}</span>
                    <span aria-hidden="true" className="col-span-2 h-2.5 rounded-full bg-rim-faint sm:col-span-1 sm:col-start-2 sm:row-start-1">
                      <span className={`block h-full rounded-full ${weak ? "bg-sun-1" : "bg-orbit-1"}`} style={{ width: `${Math.min(100, b.ratio * 100)}%` }} />
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-prose">{PERFORMANCE.subEmpty}</p>
          )}
        </section>
      </div>
    </div>
  );
}
