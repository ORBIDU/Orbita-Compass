import { BarChart3, Crosshair } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/navigation";
import { LOCKED, PERFORMA } from "@/content/dashboard";
import { formatDayMonth } from "@/lib/datetime";
import type { AsyncState } from "@/lib/useAsync";
import { SNBT_SUBTESTS, type ExamKey, type PracticeSummary } from "@/types/dashboard";
import { CardButton, CardError, CardLink, CardSkeleton, DashCard, EmptyPanel, LockedPanel } from "./DashCard";
import SnbtRadar from "./SnbtRadar";

// "Lihat performa" membuka tab Performance di Siap SNBT.
const PERFORMA_URL = `${ROUTES.persiapanUjian("snbt")}?tab=performance`;

const EXAM_URL: Record<ExamKey, string> = {
  SNBT: ROUTES.persiapanUjian("snbt"),
  TKA: ROUTES.persiapanUjian("tka"),
  SKD: ROUTES.persiapanUjian("skd"),
};

function DeltaBadge({ diff }: { diff: number }) {
  const tone = diff > 0 ? "bg-tint-green-bg text-tint-green-fg" : diff < 0 ? "bg-tint-orange-bg text-tint-orange-fg" : "bg-surface-track text-prose";
  return (
    <span className={`mb-1 whitespace-nowrap rounded-full px-[9px] py-[3px] text-[11px] font-semibold lg:mb-1.5 lg:text-xs ${tone}`}>
      <span className="lg:hidden">{PERFORMA.delta(diff, true)}</span>
      <span className="hidden lg:inline">{PERFORMA.delta(diff, false)}</span>
    </span>
  );
}

interface ResultRow {
  exam: ExamKey;
  meta: string;
  value: string | null;
}

function rowsOf(summary: PracticeSummary, showSkd: boolean): ResultRow[] {
  const { snbt, tka, skd } = summary;
  const rows: ResultRow[] = [
    { exam: "SNBT", meta: snbt ? `${snbt.label}, ${formatDayMonth(snbt.completedAt)}` : PERFORMA.noPractice, value: snbt ? String(snbt.score) : null },
    !tka
      ? { exam: "TKA", meta: PERFORMA.noPractice, value: null }
      : tka.kind === "tryout"
        ? { exam: "TKA", meta: `${tka.label}, ${formatDayMonth(tka.completedAt)}`, value: String(tka.score) }
        : // Belum pernah tryout: akurasi latihan, dengan label berbeda dari nilai tryout.
          { exam: "TKA", meta: PERFORMA.tkaAccuracyMeta(tka.answered), value: PERFORMA.tkaAccuracy(tka.percent) },
  ];
  // Siap SKD hanya ditampilkan kalau relevan (lib/persiapan.ts), kecuali sudah ada hasilnya.
  if (showSkd || skd) {
    rows.push({ exam: "SKD", meta: skd ? `${skd.label}, ${formatDayMonth(skd.completedAt)}` : PERFORMA.noPractice, value: skd ? String(skd.score) : null });
  }
  return rows;
}

function PerformanceBody({ summary, showSkd }: { summary: PracticeSummary; showSkd: boolean }) {
  const { snbt } = summary;
  if (!snbt && !summary.tka && !summary.skd) {
    return (
      <EmptyPanel
        icon={BarChart3}
        tone="orange"
        title={PERFORMA.empty.title}
        body={PERFORMA.empty.body}
        action={<CardButton to={ROUTES.persiapanUjian("snbt")}>{PERFORMA.empty.cta}</CardButton>}
      />
    );
  }

  const weakest = snbt?.weakest ?? null;
  const weakestName = weakest ? SNBT_SUBTESTS.find((s) => s.key === weakest)?.name : null;

  return (
    <div
      className={`grid items-center gap-4 lg:gap-6 ${
        snbt ? "md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)]" : ""
      }`}
    >
      {snbt && (
        <SnbtRadar scores={snbt.subtests} weakest={weakest} label={PERFORMA.radarLabel} className="mx-auto h-auto w-[236px] md:w-full md:max-w-[260px]" />
      )}
      <div className="flex min-w-0 flex-col gap-3.5">
        {snbt && (
          <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1 lg:justify-start">
            <div className="flex flex-col">
              <span className="whitespace-nowrap text-xs text-prose lg:text-[13px]">{PERFORMA.lastScore}</span>
              <span className="text-[32px] font-bold leading-tight tracking-[-1px] text-space-2 lg:text-[38px]">{snbt.score}</span>
            </div>
            {snbt.previousScore !== null && <DeltaBadge diff={snbt.score - snbt.previousScore} />}
          </div>
        )}
        {weakest && weakestName && (
          <div className="flex items-start gap-2.5 rounded-[14px] bg-surface-peach px-3 py-3 lg:px-3.5">
            <Crosshair size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-tint-orange-fg" />
            <p className="text-[13px] leading-normal text-space-1 lg:text-sm">
              <strong className="font-semibold">{PERFORMA.weakest}</strong> {weakestName} ({weakest}).
            </p>
          </div>
        )}
        <ul className="flex flex-col border-t border-rim-soft">
          {rowsOf(summary, showSkd).map((row) => (
            <li key={row.exam} className="flex min-h-14 items-center justify-between gap-3 border-b border-rim-soft py-2 text-sm last:border-b-0 lg:min-h-0 lg:py-2.5">
              <span className="flex min-w-0 flex-col">
                <span className="font-semibold text-space-2">{PERFORMA.rows[row.exam]}</span>
                <span className="truncate text-xs text-prose-dim">{row.meta}</span>
              </span>
              {row.value !== null ? (
                <span className="shrink-0 font-bold text-space-2">{row.value}</span>
              ) : (
                <Link to={EXAM_URL[row.exam]} className="flex min-h-11 shrink-0 items-center rounded font-semibold text-orbit-1 hover:underline lg:min-h-8">
                  {PERFORMA.start}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Kartu "Performa latihan": radar 7 subtes SNBT dan hasil terakhir tiap Persiapan. */
export default function PerformanceCard({ locked, state, showSkd }: { locked: boolean; state: AsyncState<PracticeSummary>; showSkd: boolean }) {
  const aside = (
    <CardLink to={PERFORMA_URL}>
      <span className="lg:hidden">{PERFORMA.linkShort}</span>
      <span className="hidden lg:inline">{PERFORMA.link}</span>
    </CardLink>
  );

  let body;
  if (locked) body = <LockedPanel description={LOCKED.performa} />;
  else if (state.loading) body = <CardSkeleton />;
  else if (state.error || !state.data) body = <CardError onRetry={state.reload} />;
  else body = <PerformanceBody summary={state.data} showSkd={showSkd} />;

  return (
    <DashCard id="dash-performa" title={PERFORMA.title} aside={locked ? undefined : aside}>
      {body}
    </DashCard>
  );
}
