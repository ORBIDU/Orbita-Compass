import { Link, useParams } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { EXAM_COPY } from "@/content/siapUjian";
import { HASIL } from "@/content/pengerjaan";
import { useAuth } from "@/context/AuthContext";
import { formatLongDate } from "@/lib/datetime";
import { useAsync } from "@/lib/useAsync";
import { ApiError } from "@/services/http";
import { getPracticeResult } from "@/services/soalService";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import ReviewList from "@/components/pengerjaan/ReviewList";

/** Hasil + pembahasan latihan (/portal/latihan/:id/hasil), Action Plan maupun latihan bebas. */
export default function LatihanHasilPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const result = useAsync(() => getPracticeResult(user?.id ?? "", user?.profile?.grade ?? 12, id), [user?.id, id]);

  if (result.loading && !result.data) return <PageLoader />;
  if (result.error || !result.data) {
    const message = result.error instanceof ApiError ? result.error.message : null;
    return (
      <div className="flex-1 overflow-y-auto bg-surface-soft px-4 py-8">
        <div className="mx-auto max-w-[560px]">
          {message ? <p className="rounded-card border border-rim-soft bg-white p-6 text-center text-sm text-prose">{message}</p> : <PanelError onRetry={result.reload} />}
        </div>
      </div>
    );
  }

  const r = result.data;
  const fromPlan = r.planDate !== null;
  const back = fromPlan ? { to: ROUTES.actionPlan, label: HASIL.backPlan } : { to: ROUTES.persiapanUjian(r.exam), label: HASIL.backSiap(EXAM_COPY[r.exam].title) };
  const percent = r.total ? Math.round((r.correct / r.total) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-[22px] lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{HASIL.latihanTitle(r.title)}</h1>
            <p className="text-sm text-prose lg:text-[15px]">{HASIL.latihanDone(formatLongDate(new Date(r.finishedAt)))}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {!fromPlan && (
              <Link
                to={ROUTES.latihanBebas(r.exam, r.subject)}
                className="flex h-[46px] items-center gap-2 rounded-xl bg-orbit-1 px-4 text-sm font-semibold text-white hover:brightness-95"
              >
                <RotateCcw size={16} aria-hidden="true" />
                {HASIL.again}
              </Link>
            )}
            <Link to={back.to} className="flex h-[46px] items-center gap-2 rounded-xl border-[1.5px] border-rim bg-white px-4 text-sm font-semibold text-space-1 hover:bg-surface-soft">
              <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
              {back.label}
            </Link>
          </div>
        </div>

        <section aria-label={HASIL.accuracy} className="grid gap-3 rounded-card-lg bg-portal-hero-sm p-5 sm:grid-cols-3 sm:p-7 lg:bg-portal-hero">
          {[
            { label: HASIL.correct, value: HASIL.correctOf(r.correct, r.total) },
            { label: HASIL.unanswered, value: HASIL.unansweredValue(r.unanswered) },
            { label: HASIL.accuracy, value: `${percent}%` },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5 rounded-2xl bg-white/[0.08] p-4">
              <span className="text-xs text-night-text">{s.label}</span>
              <span className="text-[22px] font-bold tabular-nums text-night-light">{s.value}</span>
            </div>
          ))}
        </section>

        <ReviewList items={r.items} withFlags={false} />
      </div>
    </div>
  );
}
