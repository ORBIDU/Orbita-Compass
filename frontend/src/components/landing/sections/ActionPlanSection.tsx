import { ArrowRight, Check, Flag } from "lucide-react";
import { ACTION_PLAN } from "@/content/landing";
import { CONTAINER, H2, Lead, PillLink, SECTION_Y, StepChip } from "../primitives";
import { useLandingNav } from "../useLandingNav";

type TaskStatus = (typeof ACTION_PLAN.tasks)[number]["status"];

const TASK_ROW: Record<TaskStatus, string> = {
  done: "bg-surface-soft",
  high: "border-2 border-sun-1 bg-white",
  medium: "bg-surface-soft",
};

const TASK_TEXT: Record<TaskStatus, string> = {
  done: "text-prose-dim line-through",
  high: "font-semibold text-space-2",
  medium: "font-medium text-space-2",
};

const TASK_LABEL: Record<TaskStatus, string> = {
  done: "text-prose-dim",
  high: "rounded-full bg-tint-orange-bg px-2.5 py-[3px] text-tint-orange-fg",
  medium: "rounded-full bg-tint-blue-bg px-2.5 py-[3px] text-tint-blue-fg",
};

function PlanCard() {
  const { flow, goal, tasks, progress } = ACTION_PLAN;
  return (
    <div className="rounded-card-lg bg-surface-peach p-3.5 lg:rounded-panel lg:p-8">
      <div className="flex flex-col gap-4 rounded-[20px] bg-white p-[18px] shadow-soft lg:gap-[18px] lg:rounded-card-lg lg:p-[26px]">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold lg:text-[13px]">
          {flow.map((f, i) => (
            <span key={f} className="flex items-center gap-2.5">
              <span className="text-orbit-1">{f}</span>
              {i < flow.length - 1 && <ArrowRight size={14} strokeWidth={2.4} className="text-rim-dash" aria-hidden="true" />}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3.5 rounded-[18px] bg-surface-blue p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-orbit-1 text-white">
            <Flag size={22} strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-tint-blue-fg">{goal.label}</span>
            <span className="text-[15px] font-bold text-space-2 lg:text-[17px]">{goal.value}</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {tasks.map((t) => (
            <li key={t.text} className={`flex min-h-[52px] items-center gap-3 rounded-[14px] px-3.5 py-2 ${TASK_ROW[t.status]}`}>
              {t.status === "done" ? (
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-tint-green-fg text-white">
                  <Check size={13} strokeWidth={3.2} />
                </span>
              ) : (
                <span className={`h-[22px] w-[22px] shrink-0 rounded-[7px] border-2 ${t.status === "high" ? "border-sun-1" : "border-rim-strong"}`} />
              )}
              <span className={`grow text-sm lg:text-[15px] ${TASK_TEXT[t.status]}`}>{t.text}</span>
              <span className={`shrink-0 text-xs font-semibold ${TASK_LABEL[t.status]}`}>{t.label}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-prose">{progress.label}</span>
            <span className="font-semibold text-space-2">{progress.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface-track">
            <div className="h-full rounded-full bg-gradient-sun-x" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActionPlanSection() {
  const { actionPlanTo } = useLandingNav();

  return (
    <section id="action-plan" className={`scroll-mt-16 lg:scroll-mt-20 bg-white ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 xl:grid-cols-[640px_480px] xl:gap-20`}>
        {/* Di HP teks lebih dulu, di desktop kartu di kiri. */}
        <div className="flex flex-col gap-3.5 lg:order-2 lg:gap-[18px]">
          <StepChip no={ACTION_PLAN.step.no} label={ACTION_PLAN.step.label} className="self-start" />
          <H2>{ACTION_PLAN.title}</H2>
          <Lead>{ACTION_PLAN.body}</Lead>
          <PillLink to={actionPlanTo} className="mt-1.5 h-[52px] self-start text-[15px] lg:mt-2 lg:text-base">
            {ACTION_PLAN.cta}
          </PillLink>
        </div>
        <div className="lg:order-1">
          <PlanCard />
        </div>
      </div>
    </section>
  );
}
