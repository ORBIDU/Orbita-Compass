import { CalendarCheck, Check } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { LOCKED, PLAN } from "@/content/dashboard";
import type { AsyncState } from "@/lib/useAsync";
import type { PlanTask, TodayPlan } from "@/types/dashboard";
import { CardButton, CardError, CardLink, CardSkeleton, DashCard, EmptyPanel, LockedPanel } from "./DashCard";

/** Warna tag kategori tugas. Kategori lain (dari data backend lama) memakai abu-abu. */
const CATEGORY_TAG: Record<string, string> = {
  SNBT: "bg-tint-blue-bg text-tint-blue-fg",
  TKA: "bg-tint-orange-bg text-tint-orange-fg",
  SKD: "bg-tint-navy-bg text-tint-navy-fg",
};
const OTHER_TAG = "bg-surface-track text-prose";

/** Jumlah tugas yang ditampilkan sebelum "+N tugas lainnya": HP 3, desktop 4. */
const VISIBLE = { mobile: 3, desktop: 4 };

/** Cincin progres oranye dengan persentase di tengah. */
function ProgressRing({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 shrink-0 lg:h-16 lg:w-16">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="8" className="stroke-rim-soft" />
      {pct > 0 && (
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform="rotate(-90 32 32)"
          className="stroke-sun-1"
        />
      )}
      <text x="32" y="37" textAnchor="middle" className="fill-space-2 text-[15px] font-bold">
        {pct}%
      </text>
    </svg>
  );
}

function TaskRow({ task, hideOnMobile }: { task: PlanTask; hideOnMobile: boolean }) {
  const meta = task.minutes !== null ? PLAN.minutes(task.minutes) : null;
  return (
    <li className={`min-h-14 items-center gap-3 rounded-[14px] border border-rim-soft px-3 lg:min-h-[52px] lg:px-3.5 ${hideOnMobile ? "hidden lg:flex" : "flex"}`}>
      <span
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] border-2 ${
          task.done ? "border-tint-green-fg bg-tint-green-fg" : "border-rim-box bg-white"
        }`}
      >
        {task.done && <Check size={13} strokeWidth={3.2} aria-hidden="true" className="text-white" />}
      </span>
      <span className="sr-only">{task.done ? PLAN.doneLabel : PLAN.todoLabel}:</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`text-sm font-medium ${task.done ? "text-prose-dim line-through" : "text-space-2"}`}>{task.title}</span>
        {/* HP: kategori ikut di baris kecil. Desktop: kategori jadi tag di kanan. */}
        <span className="text-xs text-prose-dim lg:hidden">{[task.category, meta].filter(Boolean).join(", ")}</span>
        {meta && <span className="hidden text-xs text-prose-dim lg:block">{meta}</span>}
      </span>
      <span className={`hidden shrink-0 rounded-full px-[9px] py-[3px] text-[11px] font-semibold lg:inline ${CATEGORY_TAG[task.category] ?? OTHER_TAG}`}>
        {task.category}
      </span>
    </li>
  );
}

function PlanBody({ plan }: { plan: TodayPlan }) {
  if (plan.tasks.length === 0) {
    const empty = plan.focus ? PLAN.emptyToday : PLAN.emptyNoFocus;
    return (
      <EmptyPanel
        icon={CalendarCheck}
        title={empty.title}
        body={empty.body}
        action={<CardButton to={ROUTES.actionPlan}>{empty.cta}</CardButton>}
      />
    );
  }

  const total = plan.tasks.length;
  const done = plan.tasks.filter((t) => t.done).length;
  const pct = Math.round((done / total) * 100);
  const minutesLeft = plan.tasks.every((t) => t.minutes !== null)
    ? plan.tasks.filter((t) => !t.done).reduce((sum, t) => sum + (t.minutes ?? 0), 0)
    : null;
  const detail = done === total ? PLAN.allDone : minutesLeft !== null ? PLAN.remaining(minutesLeft) : null;
  const visible = plan.tasks.slice(0, VISIBLE.desktop);
  const moreMobile = total - VISIBLE.mobile;
  const moreDesktop = total - VISIBLE.desktop;

  return (
    <div className="flex flex-col gap-3.5 lg:gap-4">
      <div className="flex items-center gap-3.5 rounded-2xl bg-surface-soft px-3.5 py-3 lg:gap-4 lg:px-4 lg:py-3.5">
        <ProgressRing pct={pct} />
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-space-2 lg:text-base">{PLAN.summary(done, total)}</span>
          {detail && <span className="text-xs text-prose lg:text-[13px]">{detail}</span>}
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {visible.map((task, i) => (
          <TaskRow key={task.id} task={task} hideOnMobile={i >= VISIBLE.mobile} />
        ))}
      </ul>
      {moreMobile > 0 && (
        <span className="lg:hidden">
          <CardLink to={ROUTES.actionPlan}>{PLAN.more(moreMobile)}</CardLink>
        </span>
      )}
      {moreDesktop > 0 && (
        <span className="hidden lg:block">
          <CardLink to={ROUTES.actionPlan}>{PLAN.more(moreDesktop)}</CardLink>
        </span>
      )}
    </div>
  );
}

/** Kartu "Rencana hari ini": ringkasan tugas Action Plan untuk hari ini. */
export default function TodayPlanCard({ locked, state }: { locked: boolean; state: AsyncState<TodayPlan> }) {
  const aside = (
    <CardLink to={ROUTES.actionPlan}>
      <span className="lg:hidden">{PLAN.linkShort}</span>
      <span className="hidden lg:inline">{PLAN.link}</span>
    </CardLink>
  );

  let body;
  if (locked) body = <LockedPanel description={LOCKED.plan} />;
  else if (state.loading) body = <CardSkeleton />;
  else if (state.error || !state.data) body = <CardError onRetry={state.reload} />;
  else body = <PlanBody plan={state.data} />;

  return (
    <DashCard id="dash-plan" title={PLAN.title} aside={locked ? undefined : aside}>
      {body}
    </DashCard>
  );
}
