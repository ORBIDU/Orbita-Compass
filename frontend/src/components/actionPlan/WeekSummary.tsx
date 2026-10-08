import { AP_CATEGORY_LABEL, AP_SUMMARY } from "@/content/actionPlan";
import { addDays, formatDayMonthKey, weekdayOf } from "@/lib/datetime";
import type { PlanCategory, PlanPractice } from "@/types/actionPlan";
import { CATEGORY_STYLE } from "./planStyle";

interface WeekSummaryProps {
  today: string;
  focus: PlanCategory[];
  days: Record<string, PlanPractice[]>;
}

/** Ringkasan minggu ini (Senin–Minggu): progres per fokus dan total latihan. */
export default function WeekSummary({ today, focus, days }: WeekSummaryProps) {
  const monday = addDays(today, -weekdayOf(today));
  const sunday = addDays(monday, 6);
  const weekDates = Object.keys(days).filter((d) => d >= monday && d <= sunday && days[d].length > 0);
  const items = weekDates.flatMap((d) => days[d]);
  const done = items.filter((p) => p.status === "done").length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  // Kategori yang ada di minggu ini ikut ditampilkan walau fokusnya sudah diganti.
  const categories = [...new Set<PlanCategory>([...focus, ...items.map((p) => p.category)])];

  return (
    <section
      aria-label={AP_SUMMARY.label}
      className="grid gap-5 rounded-card border border-rim-soft bg-white p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-8 lg:px-6 lg:py-[22px] xl:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div className="flex flex-col gap-2.5">
        <h2 className="text-[13px] font-semibold text-prose">{AP_SUMMARY.focusTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {categories.map((c) => {
            const list = items.filter((p) => p.category === c);
            const n = list.filter((p) => p.status === "done").length;
            const style = CATEGORY_STYLE[c];
            return (
              <div key={c} className={`flex flex-col gap-2 rounded-[14px] px-3.5 py-3 ${style.card}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-bold">{AP_CATEGORY_LABEL[c]}</span>
                  <span className="text-xs tabular-nums text-prose">{AP_SUMMARY.focusCount(n, list.length)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/80">
                  <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${list.length ? (n / list.length) * 100 : 0}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2.5 border-t border-rim-faint pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-semibold text-prose">{AP_SUMMARY.week(formatDayMonthKey(monday), formatDayMonthKey(sunday))}</span>
          <span className="text-lg font-bold tabular-nums text-space-2">{pct}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={AP_SUMMARY.label}
          className="h-2.5 rounded-full bg-surface-track"
        >
          <div className="h-full rounded-full bg-gradient-orbit-x" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-prose">
          <span className="tabular-nums">
            <strong className="text-space-2">{done}</strong> {AP_SUMMARY.weekDone} {AP_SUMMARY.weekDoneSuffix(items.length)}
          </span>
          <span className="tabular-nums">
            <strong className="text-space-2">{weekDates.length}</strong> {AP_SUMMARY.studyDays}
          </span>
        </div>
      </div>
    </section>
  );
}
