import { TIMELINE } from "@/content/dashboard";
import { splitMonth } from "@/lib/datetime";
import type { AsyncState } from "@/lib/useAsync";
import type { TimelineEvent } from "@/types/dashboard";
import { CardError, CardSkeleton } from "./DashCard";

const TONE = {
  orange: "bg-tint-orange-bg text-tint-orange-fg",
  blue: "bg-tint-blue-bg text-tint-blue-fg",
} as const;

/** Kartu "Timeline seleksi": jadwal perkiraan, selalu tampil di semua status. */
export default function TimelineCard({ state }: { state: AsyncState<TimelineEvent[]> }) {
  let body;
  if (state.loading) body = <CardSkeleton lines={4} />;
  else if (state.error || !state.data) body = <CardError onRetry={state.reload} />;
  else if (state.data.length === 0) body = <p className="py-4 text-sm text-prose">{TIMELINE.empty}</p>;
  else
    body = (
      <ol className="flex flex-col">
        {state.data.map((e) => {
          const { month, year } = splitMonth(e.month);
          return (
            <li key={e.id} className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 border-b border-rim-faint py-2 last:border-b-0 lg:grid-cols-[56px_minmax(0,1fr)] lg:gap-3.5 lg:py-2.5">
              <span className={`flex h-[50px] flex-col items-center justify-center rounded-xl leading-tight lg:h-[52px] ${TONE[e.tone]}`}>
                <span className="text-[13px] font-bold lg:text-sm">{month}</span>
                <span className="text-[10px] lg:text-[11px]">{year}</span>
              </span>
              <span className="flex min-w-0 flex-col justify-center gap-0.5">
                <span className="text-sm font-semibold text-space-2">{e.title}</span>
                <span className="text-xs text-prose-dim">{e.note}</span>
              </span>
            </li>
          );
        })}
      </ol>
    );

  return (
    <section aria-labelledby="dash-timeline" className="flex min-w-0 flex-col gap-2.5 rounded-card border border-rim-soft bg-white p-5 lg:gap-3.5 lg:p-6">
      <div className="flex flex-col gap-0.5">
        <h2 id="dash-timeline" className="text-[17px] font-bold text-space-2 lg:text-lg">
          {TIMELINE.title}
        </h2>
        <p className="text-xs text-prose-dim lg:text-[13px]">{TIMELINE.subtitle}</p>
      </div>
      {body}
    </section>
  );
}
