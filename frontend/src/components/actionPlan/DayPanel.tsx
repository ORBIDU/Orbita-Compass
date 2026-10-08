import { forwardRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, FileText, Lock, Sparkles } from "lucide-react";
import { AP_CALENDAR, AP_CATEGORY_LABEL, AP_DAY } from "@/content/actionPlan";
import { formatDayName, formatWeekday } from "@/lib/datetime";
import { PLAN_CATEGORIES, type PlanPractice, type PlanSettings } from "@/types/actionPlan";
import { CATEGORY_STYLE, DAY_STYLE, dayStatusOf, practiceUrl } from "./planStyle";

interface DayPanelProps {
  date: string;
  list: PlanPractice[] | undefined;
  today: string;
  settings: PlanSettings;
  /** Hari belajar berikutnya, ditampilkan kalau hari ini bukan hari belajar. */
  next: { date: string; count: number } | null;
  onSelect: (date: string) => void;
}

/** Cincin kecil "selesai/total" di kanan judul. */
function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 19;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label={AP_DAY.ring(done, total)} className="h-12 w-12 shrink-0">
      <circle cx="24" cy="24" r={r} fill="none" strokeWidth="6" className="stroke-surface-track" />
      {done > 0 && (
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(c * done) / total} ${c}`}
          transform="rotate(-90 24 24)"
          className="stroke-sun-1"
        />
      )}
      <text x="24" y="28" textAnchor="middle" className="fill-space-2 text-xs font-bold">
        {done}/{total}
      </text>
    </svg>
  );
}

function PracticeRow({ p, locked, opensOn }: { p: PlanPractice; locked: boolean; opensOn: string }) {
  const style = CATEGORY_STYLE[p.category];
  const done = p.status === "done";
  return (
    <li
      className={`grid grid-cols-[40px_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-2xl border border-rim-soft px-3.5 py-3.5 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:gap-x-3.5 lg:grid-cols-[44px_minmax(0,1fr)] xl:grid-cols-[44px_minmax(0,1fr)_auto] sm:px-4 ${
        done ? "bg-surface-soft/60" : "bg-white"
      }`}
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${style.tile}`}>
        <FileText size={22} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold leading-snug text-space-2">{p.title}</h3>
        <span className="flex flex-wrap items-center gap-2 text-xs text-prose-dim">
          <span className={`rounded-full px-[9px] py-0.5 font-semibold ${style.tile}`}>{AP_CATEGORY_LABEL[p.category]}</span>
          <span className="tabular-nums">{AP_DAY.meta(p.questions, p.minutes)}</span>
        </span>
        {p.status === "in_progress" && (
          <span className="flex items-center gap-2.5">
            <span
              role="progressbar"
              aria-valuenow={p.answered}
              aria-valuemin={0}
              aria-valuemax={p.questions}
              aria-label={AP_DAY.progress(p.answered, p.questions)}
              className="h-1.5 max-w-[260px] flex-1 rounded-full bg-surface-track"
            >
              <span className="block h-full rounded-full bg-orbit-1" style={{ width: `${(p.answered / p.questions) * 100}%` }} />
            </span>
            <span className="text-xs tabular-nums text-tint-blue-fg">{AP_DAY.progress(p.answered, p.questions)}</span>
          </span>
        )}
        {done && p.correct !== null && (
          <span className="flex items-center gap-1.5 text-[13px] font-semibold tabular-nums text-tint-green-fg">
            <CheckCircle2 size={16} strokeWidth={2.4} aria-hidden="true" />
            {AP_DAY.result(p.correct, p.questions)}
          </span>
        )}
      </div>
      {locked ? (
        <span className="col-start-2 flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-tint-amber-fg sm:col-start-3 lg:col-start-2 xl:col-start-3">
          <Lock size={14} strokeWidth={2.2} aria-hidden="true" />
          {opensOn}
        </span>
      ) : (
        <Link
          to={practiceUrl(p)}
          className={`col-start-2 inline-flex h-10 items-center justify-center justify-self-start whitespace-nowrap rounded-[10px] border-[1.5px] px-4 text-[13px] font-semibold sm:col-start-3 lg:col-start-2 xl:col-start-3 ${
            done ? "border-rim bg-white text-orbit-1 hover:bg-surface-sky" : "border-orbit-1 bg-orbit-1 text-white hover:brightness-95"
          }`}
        >
          {AP_DAY.cta[p.status]}
          <span className="sr-only">: {p.title}</span>
        </Link>
      )}
    </li>
  );
}

function EmptyDay({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-soft px-6 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-rim-faint text-prose">
        <CalendarDays size={22} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="text-[15px] font-semibold text-space-2">{title}</span>
      <span className="text-sm text-prose">{body}</span>
      {children}
    </div>
  );
}

/** Daftar latihan untuk tanggal yang dipilih di kalender. */
const DayPanel = forwardRef<HTMLElement, DayPanelProps>(function DayPanel({ date, list, today, settings, next, onSelect }, ref) {
  const items = list ?? [];
  const status = dayStatusOf(date, items, today);
  const future = date > today;
  const done = items.filter((p) => p.status === "done").length;
  const questions = items.reduce((a, p) => a + p.questions, 0);
  const minutes = items.reduce((a, p) => a + p.minutes, 0);
  const chip = status ? { label: AP_CALENDAR.status[status], cls: DAY_STYLE[status].chip } : { label: AP_CALENDAR.status.none, cls: "bg-rim-faint text-prose" };
  const dayFocus = PLAN_CATEGORIES.filter((c) => items.some((p) => p.category === c));
  const note = status === "unfinished" ? AP_DAY.note.unfinished : future ? AP_DAY.note.future : AP_DAY.note.focus(dayFocus);

  let empty = null;
  if (items.length === 0) {
    if (date < settings.startDate) {
      empty = <EmptyDay title={AP_DAY.notStarted.title} body={AP_DAY.notStarted.body(formatDayName(settings.startDate))} />;
    } else if (date > settings.endDate) {
      empty = <EmptyDay title={AP_DAY.ended.title} body={AP_DAY.ended.body} />;
    } else {
      empty = (
        <EmptyDay title={AP_DAY.rest.title} body={AP_DAY.rest.body}>
          {date === today && next && (
            <div className="mt-2 flex flex-col items-center gap-2.5 rounded-xl border border-rim-soft bg-white px-4 py-3">
              <span className="text-sm font-semibold text-space-2">{AP_DAY.next(formatDayName(next.date), next.count)}</span>
              <button
                type="button"
                onClick={() => onSelect(next.date)}
                className="inline-flex h-10 items-center rounded-[10px] border-[1.5px] border-rim bg-white px-4 text-[13px] font-semibold text-orbit-1 hover:bg-surface-sky"
              >
                {AP_DAY.showNext}
              </button>
            </div>
          )}
        </EmptyDay>
      );
    }
  }

  return (
    <section
      ref={ref}
      aria-labelledby="ap-day"
      aria-live="polite"
      className="flex scroll-mt-4 flex-col gap-4 rounded-card border border-rim-soft bg-white p-4 sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-2">
            <h2 id="ap-day" className="text-lg font-bold text-space-2 sm:text-[19px]">
              {formatDayName(date)}
            </h2>
            <span className={`rounded-full px-2.5 py-[3px] text-xs font-semibold ${chip.cls}`}>{chip.label}</span>
          </span>
          {items.length > 0 && <span className="text-[13px] tabular-nums text-prose">{AP_DAY.summary(items.length, questions, minutes)}</span>}
        </div>
        {items.length > 0 && <ProgressRing done={done} total={items.length} />}
      </div>

      {items.length > 0 ? (
        <>
          <ul className="flex flex-col gap-2.5">
            {items.map((p) => (
              <PracticeRow key={p.id} p={p} locked={future} opensOn={AP_DAY.opensOn(formatWeekday(date))} />
            ))}
          </ul>
          <p className="flex items-start gap-2 text-[13px] leading-normal text-prose">
            <Sparkles size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-orbit-1" />
            {note}
          </p>
        </>
      ) : (
        empty
      )}
    </section>
  );
});

export default DayPanel;
