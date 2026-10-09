import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { EXAM_COPY, LATIHAN, SUBJECT_DESC, SUBJECT_DESC_FALLBACK } from "@/content/siapUjian";
import { formatDayName } from "@/lib/datetime";
import type { ExamOverview } from "@/types/practice";
import { SESSION_SIZE } from "@/config/practice";

/** Kartu latihan Action Plan hari ini untuk ujian ini. */
function TodayCard({ overview }: { overview: ExamOverview }) {
  const copy = EXAM_COPY[overview.exam];
  const plan = overview.plan;
  const pending = plan?.today.find((p) => p.status !== "done") ?? null;

  let title: string;
  let note: string;
  let cta: { to: string; label: string } | null = null;
  let done = false;
  if (!plan) {
    title = LATIHAN.today.none(copy.short);
    note = LATIHAN.today.noPlan;
  } else if (pending) {
    title = LATIHAN.today.title(pending.title, pending.questions);
    note = LATIHAN.today.note;
    cta = { to: ROUTES.latihan(pending.id), label: LATIHAN.today.cta[pending.status === "in_progress" ? "in_progress" : "todo"] };
  } else if (plan.today.length > 0) {
    title = LATIHAN.today.allDone(copy.short);
    note = LATIHAN.today.allDoneNote;
    done = true;
  } else {
    title = LATIHAN.today.none(copy.short);
    note = plan.next ? `${LATIHAN.today.noneNext(formatDayName(plan.next.date))} ${LATIHAN.today.noneNote}` : LATIHAN.today.noneNote;
  }

  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-[18px] border border-rim-soft bg-white p-4 sm:px-5 md:grid-cols-[44px_minmax(0,1fr)_auto]">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${done ? "bg-tint-green-bg text-tint-green-fg" : "bg-tint-orange-bg text-tint-orange-fg"}`}>
        {done ? <CheckCircle2 size={22} aria-hidden="true" /> : <CalendarCheck size={22} strokeWidth={1.9} aria-hidden="true" />}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[15px] font-semibold text-space-2">{title}</span>
        <span className="text-[13px] leading-normal text-prose">{note}</span>
      </span>
      <div className="col-span-2 flex flex-wrap gap-2 md:col-span-1">
        {cta && (
          <Link to={cta.to} className="flex h-[42px] items-center rounded-[10px] bg-orbit-1 px-4 text-sm font-semibold text-white hover:brightness-95">
            {cta.label}
            {pending && <span className="sr-only">: {pending.title}</span>}
          </Link>
        )}
        <Link
          to={ROUTES.actionPlan}
          className="flex h-[42px] items-center rounded-[10px] border-[1.5px] border-rim px-3.5 text-sm font-semibold text-space-1 hover:bg-surface-soft"
        >
          {LATIHAN.today.openPlan}
        </Link>
      </div>
    </div>
  );
}

/** Tab Latihan Soal: latihan hari ini + kartu per subtes/mapel dengan akurasi. */
export default function LatihanTab({ overview }: { overview: ExamOverview }) {
  const copy = EXAM_COPY[overview.exam];
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <TodayCard overview={overview} />

      {overview.missingElectives && (
        <p className="rounded-[14px] bg-surface-blue px-4 py-3 text-[13px] leading-normal text-space-1">
          {LATIHAN.missingElectives}{" "}
          <Link to={ROUTES.actionPlan} className="font-semibold text-orbit-1 underline">
            {LATIHAN.missingElectivesCta}
          </Link>
        </p>
      )}

      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 className="text-lg font-bold text-space-2">{copy.heading(overview.subjects.length)}</h2>
        <span className="text-[13px] text-prose">{LATIHAN.sessionNote(SESSION_SIZE)}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {overview.subjects.map((s) => {
          const weak = s.subject === overview.weakest?.subject;
          const code = overview.exam === "tka" ? (s.subject === s.name ? null : s.subject) : s.subject;
          return (
            <article
              key={s.subject}
              className={`flex flex-col gap-3 rounded-[18px] border-[1.5px] bg-white p-4 lg:p-5 ${weak ? "border-tint-orange-line" : "border-rim-soft"}`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <span className="flex min-w-0 flex-col gap-0.5">
                  {code && <span className={`text-xs font-bold ${weak ? "text-tint-orange-fg" : "text-orbit-1"}`}>{code}</span>}
                  <h3 className="text-base font-bold leading-snug text-space-2">{s.name}</h3>
                </span>
                {weak && (
                  <span className="shrink-0 rounded-full bg-tint-orange-bg px-2 py-0.5 text-[11px] font-bold text-tint-orange-fg">{LATIHAN.weakest}</span>
                )}
              </div>
              <p className="text-[13px] leading-normal text-prose">{SUBJECT_DESC[s.subject] ?? SUBJECT_DESC_FALLBACK}</p>
              {s.accuracy !== null ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between gap-2 text-xs text-prose">
                    <span className="tabular-nums">{LATIHAN.answered(s.answered)}</span>
                    <span className={`font-bold tabular-nums ${weak ? "text-tint-orange-fg" : "text-space-2"}`}>{LATIHAN.accuracy(s.accuracy)}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={s.accuracy}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${s.name}: ${LATIHAN.accuracy(s.accuracy)}`}
                    className="h-1.5 rounded-full bg-surface-track"
                  >
                    <div className={`h-full rounded-full ${weak ? "bg-sun-1" : "bg-orbit-1"}`} style={{ width: `${s.accuracy}%` }} />
                  </div>
                </div>
              ) : (
                <span className="text-xs text-prose-dim">{LATIHAN.noData}</span>
              )}
              <Link
                to={ROUTES.latihanBebas(overview.exam, s.subject)}
                className="mt-auto flex h-10 items-center gap-1.5 self-start rounded-[10px] border-[1.5px] border-rim px-3.5 text-[13px] font-semibold text-orbit-1 hover:bg-surface-sky"
              >
                {LATIHAN.start}
                <span className="sr-only">: {s.name}</span>
                <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
