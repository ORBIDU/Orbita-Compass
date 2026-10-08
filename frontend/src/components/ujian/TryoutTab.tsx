import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { EXAM_COPY, TRYOUT } from "@/content/siapUjian";
import { formatDayMonth } from "@/lib/datetime";
import type { ExamOverview } from "@/types/practice";

/** Tab Tryout: paket terbuka berurutan + aturan dan catatan skala skor. */
export default function TryoutTab({ overview }: { overview: ExamOverview }) {
  const copy = EXAM_COPY[overview.exam];
  // Pesan dari halaman tryout, mis. paket yang masih terkunci dibuka lewat URL.
  const notice = (useLocation().state as { notice?: string } | null)?.notice ?? null;
  return (
    <div className="flex flex-col gap-4">
      {notice && (
        <p role="alert" className="rounded-[14px] bg-surface-peach px-4 py-3 text-[13px] leading-normal text-tint-orange-ink">
          {notice}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ol className="flex flex-col gap-3">
          {overview.tryouts.map(({ pkg, status, result, previousName }) => (
            <li
              key={pkg.id}
              className={`grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-[18px] border-[1.5px] p-4 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:px-5 ${
                status === "open" ? "border-orbit-1 bg-white" : status === "locked" ? "border-rim-soft bg-field-bg" : "border-rim-soft bg-white"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-[14px] sm:h-12 sm:w-12 ${
                  status === "done" ? "bg-tint-green-bg text-tint-green-fg" : status === "open" ? "bg-tint-blue-bg text-orbit-1" : "bg-rim-faint text-field-hint"
                }`}
              >
                {status === "done" ? (
                  <CheckCircle2 size={22} strokeWidth={1.9} aria-label={TRYOUT.statusLabel.done} />
                ) : status === "open" ? (
                  <PlayCircle size={22} strokeWidth={1.9} aria-label={TRYOUT.statusLabel.open} />
                ) : (
                  <Lock size={20} strokeWidth={1.9} aria-label={TRYOUT.statusLabel.locked} />
                )}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className={`text-base font-bold ${status === "locked" ? "text-prose-dim" : "text-space-2"}`}>{pkg.name}</h3>
                <span className="text-[13px] leading-normal text-prose">
                  {status === "done" ? TRYOUT.doneMeta : status === "open" ? copy.tryoutFormat(overview.tryoutMinutes) : TRYOUT.lockedMeta(previousName ?? "")}
                </span>
              </div>
              <div className="col-start-2 flex flex-wrap items-center gap-3 sm:col-start-3 sm:justify-end">
                {status === "done" && result && (
                  <>
                    <span className="flex flex-col sm:items-end">
                      <span className="text-xl font-bold tabular-nums text-space-2">{result.score}</span>
                      <span className="text-[11px] text-prose-dim">{TRYOUT.doneDate(formatDayMonth(result.completedAt))}</span>
                    </span>
                    <Link
                      to={ROUTES.laporan(pkg.id)}
                      className="flex h-10 items-center rounded-[10px] border-[1.5px] border-rim px-3.5 text-[13px] font-semibold text-orbit-1 hover:bg-surface-sky"
                    >
                      {TRYOUT.report}
                      <span className="sr-only">: {pkg.name}</span>
                    </Link>
                  </>
                )}
                {status === "open" && (
                  <Link to={ROUTES.tryout(pkg.id)} className="flex h-[42px] items-center rounded-[10px] bg-orbit-1 px-[18px] text-sm font-semibold text-white hover:brightness-95">
                    {TRYOUT.start}
                    <span className="sr-only">: {pkg.name}</span>
                  </Link>
                )}
                {status === "locked" && (
                  <span className="hidden text-xs font-semibold text-prose-dim sm:inline">{TRYOUT.lockedShort(previousName ?? "")}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
        <aside className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-4 sm:p-[22px]">
          <h2 className="text-base font-bold text-space-2">{TRYOUT.asideTitle}</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-normal text-prose">
            <li>{copy.tryoutFormat(overview.tryoutMinutes)}</li>
            {TRYOUT.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="rounded-xl bg-surface-soft p-3 text-xs leading-normal text-prose">{copy.scaleNote}</p>
        </aside>
      </div>
    </div>
  );
}
