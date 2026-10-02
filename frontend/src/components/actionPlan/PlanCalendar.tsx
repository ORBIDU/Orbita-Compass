import { useEffect, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AP_CALENDAR, AP_CATEGORY_LABEL } from "@/content/actionPlan";
import { addDays, addMonths, formatDayName, formatMonthYear, lastDayOfMonth, weekdayOf } from "@/lib/datetime";
import { PLAN_CATEGORIES, type PlanPractice } from "@/types/actionPlan";
import { CATEGORY_STYLE, DAY_STYLE, dayStatusOf, type DayStatus } from "./planStyle";

interface PlanCalendarProps {
  /** Bulan yang tampil, "YYYY-MM". */
  month: string;
  onMonthChange: (month: string) => void;
  minMonth: string;
  maxMonth: string;
  selected: string;
  /** `source` dipakai halaman: di HP, klik tanggal menggulir ke daftar latihan. */
  onSelect: (date: string, source: "click" | "key") => void;
  today: string;
  days: Record<string, PlanPractice[]>;
}

const STATUS_ORDER: DayStatus[] = ["done", "unfinished", "today", "scheduled"];
const STATUS_LABEL: Record<DayStatus, string> = {
  done: AP_CALENDAR.status.done,
  unfinished: AP_CALENDAR.status.unfinished,
  today: AP_CALENDAR.status.today,
  scheduled: AP_CALENDAR.status.scheduled,
};

/**
 * Kalender Action Plan: warna = status hari, titik = kategori latihan.
 * Tombol panah memindah tanggal (±1 hari, ±1 minggu), termasuk ke bulan lain.
 */
export default function PlanCalendar({ month, onMonthChange, minMonth, maxMonth, selected, onSelect, today, days }: PlanCalendarProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const focusAfterRender = useRef(false);

  const first = `${month}-01`;
  const last = lastDayOfMonth(month);
  const leading = weekdayOf(first);
  const trailing = 6 - weekdayOf(last);
  const dates: string[] = [];
  for (let d = first; d <= addDays(last, trailing); d = addDays(d, 1)) dates.push(d);
  const visible = (date: string) => date >= first && date <= addDays(last, trailing);
  const tabStop = visible(selected) ? selected : first;

  useEffect(() => {
    if (!focusAfterRender.current) return;
    focusAfterRender.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${selected}"]`)?.focus();
  }, [selected, month]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = addDays(tabStop, step);
    const nextMonth = next.slice(0, 7);
    if (nextMonth < minMonth || nextMonth > maxMonth) return;
    focusAfterRender.current = true;
    if (!visible(next)) onMonthChange(nextMonth);
    onSelect(next, "key");
  }

  return (
    <section aria-labelledby="ap-cal" className="flex flex-col gap-3.5 rounded-card border border-rim-soft bg-white p-4 sm:p-[22px]">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label={AP_CALENDAR.prev}
          disabled={month <= minMonth}
          onClick={() => onMonthChange(addMonths(month, -1))}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-rim-soft bg-white text-space-1 hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <h2 id="ap-cal" aria-live="polite" className="text-[17px] font-bold capitalize text-space-2">
          {formatMonthYear(month)}
        </h2>
        <button
          type="button"
          aria-label={AP_CALENDAR.next}
          disabled={month >= maxMonth}
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-rim-soft bg-white text-space-1 hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      <p id="ap-cal-hint" className="sr-only">
        {AP_CALENDAR.hint}
      </p>
      <div ref={gridRef} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-1 text-center sm:gap-1.5">
        {AP_CALENDAR.weekdays.map((w) => (
          <span key={w} aria-hidden="true" className="text-xs font-semibold text-prose-dim">
            {w}
          </span>
        ))}
        {Array.from({ length: leading }, (_, i) => (
          <span key={`blank-${i}`} aria-hidden="true" />
        ))}
        {dates.map((date) => {
          const list = days[date];
          const status = dayStatusOf(date, list, today);
          const isSelected = date === selected;
          const outside = date > last;
          const categories = PLAN_CATEGORIES.filter((c) => list?.some((p) => p.category === c));
          const tone = status
            ? `${DAY_STYLE[status].cell} font-bold`
            : `bg-white font-medium ${outside ? "text-rim-box" : "text-space-1"} hover:bg-surface-soft`;
          const border = isSelected ? (status === "today" ? "border-tint-blue-deep" : "border-orbit-1") : "border-transparent";
          return (
            <button
              key={date}
              type="button"
              data-date={date}
              tabIndex={date === tabStop ? 0 : -1}
              aria-pressed={isSelected}
              aria-current={date === today ? "date" : undefined}
              aria-label={`${formatDayName(date)}, ${status ? STATUS_LABEL[status].toLowerCase() : AP_CALENDAR.status.none.toLowerCase()}`}
              aria-describedby="ap-cal-hint"
              onClick={() => onSelect(date, "click")}
              className={`flex h-[50px] flex-col items-center justify-center gap-1 rounded-xl border-2 text-[15px] tabular-nums sm:h-[60px] sm:gap-[5px] ${tone} ${border}`}
            >
              <span>{Number(date.slice(8))}</span>
              <span aria-hidden="true" className="flex h-1.5 gap-[3px]">
                {categories.map((c) => (
                  <span key={c} className={`h-1.5 w-1.5 rounded-full ${status === "today" ? "bg-white" : CATEGORY_STYLE[c].dot}`} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 border-t border-rim-faint pt-3 text-xs text-prose">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {STATUS_ORDER.map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`h-3 w-3 rounded ${DAY_STYLE[s].legend}`} />
              {STATUS_LABEL[s]}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {PLAN_CATEGORIES.map((c) => (
            <span key={c} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={`h-[7px] w-[7px] rounded-full ${CATEGORY_STYLE[c].dot}`} />
              {AP_CATEGORY_LABEL[c]}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
