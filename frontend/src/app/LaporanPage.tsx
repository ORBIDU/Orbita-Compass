import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { EXAM_COPY } from "@/content/siapUjian";
import { HASIL, LAPORAN, joinNames } from "@/content/pengerjaan";
import { useAuth } from "@/context/AuthContext";
import { formatLongDate } from "@/lib/datetime";
import { useAsync } from "@/lib/useAsync";
import { ApiError } from "@/services/http";
import { getTryoutReport } from "@/services/soalService";
import type { TryoutReport } from "@/types/soal";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError } from "@/components/ui/PanelState";
import ReviewList from "@/components/pengerjaan/ReviewList";
import { usePageTitle } from "@/lib/usePageTitle";

/**
 * Subtes terendah dan terkuat (relatif terhadap skor maksimum), dihitung dari
 * laporan. Nilai seri masuk kelompok yang sama (maks. 3 nama) supaya tidak acak.
 */
function focusOf(report: TryoutReport) {
  const ratio = (s: TryoutReport["subjects"][number]) => s.score / (s.max || 1);
  const ratios = report.subjects.map(ratio);
  const min = Math.min(...ratios);
  const max = Math.max(...ratios);
  const weak = report.subjects.filter((s) => ratio(s) === min);
  const strong = max > min ? report.subjects.filter((s) => ratio(s) === max) : [];
  return { weak: weak.slice(0, 3), strong: strong.slice(0, 3), lowest: weak.map((s) => s.subject) };
}

/** Laporan tryout (/portal/tryout/:paket/laporan), sesuai Portal-Laporan.dc.html. */
export default function LaporanPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const report = useAsync(() => getTryoutReport(user?.id ?? "", id), [user?.id, id]);
  usePageTitle(report.data ? LAPORAN.title(report.data.name, EXAM_COPY[report.data.exam].short) : null);

  if (report.loading && !report.data) return <PageLoader />;
  if (report.error || !report.data) {
    const message = report.error instanceof ApiError ? report.error.message : null;
    return (
      <div className="flex-1 overflow-y-auto bg-surface-soft px-4 py-8">
        <div className="mx-auto max-w-[560px]">
          {message ? <p className="rounded-card border border-rim-soft bg-white p-6 text-center text-sm text-prose">{message}</p> : <PanelError onRetry={report.reload} />}
        </div>
      </div>
    );
  }

  const r = report.data;
  const copy = EXAM_COPY[r.exam];
  const diff = r.previous ? r.score - r.previous.score : null;
  const { weak, strong, lowest } = focusOf(r);
  const backTo = `${ROUTES.persiapanUjian(r.exam)}?tab=tryout`;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-[22px] lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-1.5 lg:gap-2">
            <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
              <span>{HASIL.breadcrumbSection}</span>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <Link to={backTo} className="rounded hover:text-space-2 hover:underline">
                {copy.title}
              </Link>
              <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
              <span aria-current="page" className="font-semibold text-space-2">
                {LAPORAN.breadcrumb(r.name)}
              </span>
            </nav>
            <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{LAPORAN.title(r.name, copy.short)}</h1>
            <p className="text-sm text-prose lg:text-[15px]">{LAPORAN.doneAt(formatLongDate(new Date(r.completedAt)))}</p>
          </div>
          <Link
            to={backTo}
            className="flex h-[46px] items-center gap-2 self-start rounded-xl border-[1.5px] border-rim bg-white px-4 text-sm font-semibold text-space-1 hover:bg-surface-soft lg:self-auto"
          >
            <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
            {LAPORAN.backTryout(copy.title)}
          </Link>
        </div>

        <section aria-label={LAPORAN.scoreLabel[r.exam]} className="on-dark grid gap-6 rounded-card-lg bg-portal-hero-sm p-5 sm:p-7 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:gap-9 lg:bg-portal-hero lg:px-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-night-text">{LAPORAN.scoreLabel[r.exam]}</span>
            <span className="flex items-baseline gap-3">
              <span className="text-5xl font-bold leading-none tabular-nums text-night-light lg:text-[56px]">{r.score}</span>
              {diff !== null && (
                <span className={`rounded-full px-2.5 py-[3px] text-sm font-bold tabular-nums ${diff >= 0 ? "bg-night-positive-bg text-night-positive" : "bg-white/10 text-night-chip"}`}>
                  {diff > 0 ? "+" : diff < 0 ? "−" : ""}
                  {Math.abs(diff)}
                </span>
              )}
            </span>
            <span className="text-[13px] text-night-text">{r.previous && diff !== null ? LAPORAN.deltaFrom(diff, r.previous.name, r.previous.score) : LAPORAN.first}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: LAPORAN.correct, value: HASIL.correctOf(r.correct, r.total) },
              { label: LAPORAN.unanswered, value: HASIL.unansweredValue(r.unanswered) },
              { label: LAPORAN.timeUsed, value: LAPORAN.duration(r.timeUsedSec) },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5 rounded-2xl bg-white/[0.08] p-4">
                <span className="text-xs text-night-text">{s.label}</span>
                <span className="text-[22px] font-bold tabular-nums text-night-light">{s.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-night-dim lg:col-span-2">{copy.scaleNote}</p>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-6">
          <section aria-labelledby="lp-sub" className="overflow-hidden rounded-card border border-rim-soft bg-white">
            <h2 id="lp-sub" className="border-b border-rim-soft px-4 py-4 text-[17px] font-bold text-space-2 sm:px-6">
              {LAPORAN.perSubject}
            </h2>
            <table className="w-full text-sm">
              <thead className="bg-field-bg text-left text-xs font-semibold text-prose-dim">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-semibold sm:px-6">{LAPORAN.cols.subject}</th>
                  <th scope="col" className="px-2 py-2.5 font-semibold">{LAPORAN.cols.correct}</th>
                  <th scope="col" className="px-2 py-2.5 font-semibold">{LAPORAN.cols.score}</th>
                  <th scope="col" className="hidden w-[30%] px-4 py-2.5 sm:table-cell sm:px-6">
                    <span className="sr-only">{LAPORAN.cols.score}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {r.subjects.map((s) => {
                  const isLow = lowest.includes(s.subject);
                  return (
                    <tr key={s.subject} className={`border-t border-rim-faint ${isLow ? "bg-surface-peach/40" : ""}`}>
                      <th scope="row" className={`px-4 py-3 text-left sm:px-6 ${isLow ? "font-bold" : "font-medium"} text-space-2`}>
                        <span className="flex flex-wrap items-center gap-2">
                          {s.name}
                          {isLow && <span className="rounded-full bg-tint-orange-bg px-2 py-0.5 text-[11px] font-bold text-tint-orange-fg">{LAPORAN.lowest}</span>}
                        </span>
                      </th>
                      <td className="whitespace-nowrap px-2 py-3 tabular-nums text-prose">{HASIL.correctOf(s.correct, s.total)}</td>
                      <td className={`px-2 py-3 font-bold tabular-nums ${isLow ? "text-tint-orange-fg" : "text-space-2"}`}>{s.score}</td>
                      <td className="hidden px-4 py-3 sm:table-cell sm:px-6">
                        <span aria-hidden="true" className="block h-2 rounded-full bg-rim-faint">
                          <span className={`block h-full rounded-full ${isLow ? "bg-sun-1" : "bg-orbit-1"}`} style={{ width: `${(s.score / (s.max || 1)) * 100}%` }} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          <aside className="flex flex-col gap-3 rounded-card border border-tint-orange-line bg-surface-peach p-4 sm:p-[22px]">
            <h2 className="text-base font-bold text-space-2">{LAPORAN.focusTitle}</h2>
            <p className="text-sm leading-relaxed text-space-1">{LAPORAN.focusWeak(joinNames(weak.map((s) => s.name)))}</p>
            {strong.length > 0 && <p className="text-sm leading-relaxed text-space-1">{LAPORAN.focusStrong(joinNames(strong.map((s) => s.name)))}</p>}
            <Link to={ROUTES.actionPlan} className="flex h-11 items-center self-start rounded-xl bg-orbit-1 px-4 text-sm font-semibold text-white hover:brightness-95">
              {LAPORAN.focusCta}
            </Link>
          </aside>
        </div>

        <ReviewList items={r.items} subjects={r.subjects.map((s) => ({ subject: s.subject, name: s.name }))} withFlags />
      </div>
    </div>
  );
}
