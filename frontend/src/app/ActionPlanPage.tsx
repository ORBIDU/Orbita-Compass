import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Compass, RefreshCw } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { AP_HEADER } from "@/content/actionPlan";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { useAsync } from "@/lib/useAsync";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { applyPlan, getActionPlan, getPlanOptions } from "@/services/actionPlanService";
import type { ActionPlanView, PlanSettingsInput } from "@/types/actionPlan";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import { LockedPlan, SetupHero } from "@/components/actionPlan/PlanStates";
import WeekSummary from "@/components/actionPlan/WeekSummary";
import PlanCalendar from "@/components/actionPlan/PlanCalendar";
import DayPanel from "@/components/actionPlan/DayPanel";
import PlanDialog from "@/components/actionPlan/PlanDialog";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * Action Plan (/portal/action-plan), sesuai docs/design/portal/Portal-ActionPlan.dc.html
 * dan SPEK bagian 9. Tiga kondisi: terkunci (status "baru"), belum ada rencana,
 * dan aktif (kalender + daftar latihan per tanggal).
 */
export default function ActionPlanPage() {
  usePageTitle(AP_HEADER.title);
  const { user } = useAuth();
  const { status, ready } = useStudentStatus();
  const userId = user?.id ?? "";
  const grade = user?.profile?.grade ?? 12;
  const tested = status !== null && status !== "baru";
  // Tanggal "hari ini" diambil saat halaman dibuka.
  const [now] = useState(() => new Date());

  const plan = useAsync(() => getActionPlan(userId, grade, now), [userId, status], tested);
  const options = useAsync(() => getPlanOptions(grade, now), [userId, status], tested);

  // Hasil "Terapkan rencana" menimpa hasil muat awal tanpa memuat ulang.
  const [applied, setApplied] = useState<ActionPlanView | null>(null);
  useEffect(() => setApplied(null), [userId, status]);
  // Data lama diabaikan saat status berganti ke "baru" (terkunci) atau sedang dimuat ulang.
  const view = tested && !plan.loading ? (applied ?? plan.data ?? null) : tested ? applied : null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [month, setMonth] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useReducedMotion();
  const dayRef = useRef<HTMLElement>(null);
  const scrollToDay = useRef(false);

  const today = view?.today ?? "";
  const shownMonth = month ?? today.slice(0, 7);
  const shownDate = selected ?? today;

  // HP: memilih tanggal menggulir ke daftar latihan (kalender ada di atasnya).
  useEffect(() => {
    if (!scrollToDay.current) return;
    scrollToDay.current = false;
    dayRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [selected, reducedMotion]);

  function select(date: string, source: "click" | "key" | "next") {
    if (source === "next") setMonth(date.slice(0, 7));
    if (!isDesktop && source !== "key") scrollToDay.current = true;
    setSelected(date);
  }

  async function apply(input: PlanSettingsInput) {
    const next = await applyPlan(userId, grade, input, new Date());
    setApplied(next);
    setDialogOpen(false);
    setSelected(null);
    setMonth(null);
  }

  if (!user || !ready || status === null) return <PageLoader />;

  let body;
  if (!tested) body = <LockedPlan />;
  else if (plan.loading && !view) body = <PanelSkeleton />;
  else if (plan.error && !view) body = <PanelError onRetry={plan.reload} />;
  else if (!view) body = <SetupHero onOpen={() => setDialogOpen(true)} />;
  else {
    const { settings, days } = view;
    const minMonth = [settings.startDate.slice(0, 7), today.slice(0, 7)].sort()[0];
    const maxMonth = [settings.endDate.slice(0, 7), today.slice(0, 7)].sort()[1];
    const nextDate = Object.keys(days)
      .filter((d) => d > today && days[d].length > 0)
      .sort()[0];
    body = (
      <>
        <WeekSummary today={today} focus={settings.focus} days={days} />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[540px_minmax(0,1fr)]">
          {/* Laptop: kalender tetap di tempat saat daftar latihan di-scroll. */}
          <div className="lg:sticky lg:top-4">
            <PlanCalendar
              month={shownMonth}
              onMonthChange={setMonth}
              minMonth={minMonth}
              maxMonth={maxMonth}
              selected={shownDate}
              onSelect={select}
              today={today}
              days={days}
            />
          </div>
          <DayPanel
            ref={dayRef}
            date={shownDate}
            list={days[shownDate]}
            today={today}
            settings={settings}
            next={nextDate ? { date: nextDate, count: days[nextDate].length } : null}
            onSelect={(d) => select(d, "next")}
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-6 lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex max-w-[700px] flex-col gap-1.5 lg:gap-2">
            <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
              <Link to={ROUTES.portal} className="rounded hover:text-space-2 hover:underline">
                {AP_HEADER.breadcrumbHome}
              </Link>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <span aria-current="page" className="font-semibold text-space-2">
                {AP_HEADER.title}
              </span>
            </nav>
            <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{AP_HEADER.title}</h1>
            <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{AP_HEADER.description}</p>
          </div>
          <div className="grid gap-2.5 sm:flex sm:flex-wrap lg:shrink-0 lg:flex-nowrap">
            <Link
              to={ROUTES.compass}
              className="flex h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border-[1.5px] border-rim bg-white px-4 text-sm font-semibold text-space-1 hover:bg-surface-sky"
            >
              <Compass size={18} strokeWidth={1.9} aria-hidden="true" />
              {AP_HEADER.compass}
            </Link>
            {view && (
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                aria-haspopup="dialog"
                className="flex h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orbit-1 px-[18px] text-sm font-semibold text-white hover:brightness-95"
              >
                <RefreshCw size={18} strokeWidth={2} aria-hidden="true" />
                {AP_HEADER.replan}
              </button>
            )}
          </div>
        </div>

        {body}
      </div>

      {dialogOpen && options.data && (
        <PlanDialog initial={view?.settings ?? null} options={options.data} onClose={() => setDialogOpen(false)} onApply={apply} />
      )}
      {dialogOpen && options.error && !options.data ? <OptionsError onRetry={options.reload} /> : null}
    </div>
  );
}

/** Bahan jendela rencana gagal dimuat (jarang terjadi). */
function OptionsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-[420px] lg:bottom-6">
      <PanelError onRetry={onRetry} />
    </div>
  );
}
