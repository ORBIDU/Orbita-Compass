import { Link } from "react-router-dom";
import { AlertTriangle, ArrowDown, ArrowRight, ArrowUp, Check, Flag, Info, Loader2, Sparkles } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { SNBP_CHECK, SNBP_CHOICES, SNBP_RESULT, SNBP_REVIEW } from "@/content/siapSnbp";
import type { SnbpCategory, SnbpResult } from "@/types/snbp";

// ─── Kelengkapan data (samping input) ────────────────────────────────────────

export interface CheckRow {
  label: string;
  note: string;
  state: "done" | "optional" | "missing";
}

export function CompletenessCard({
  rows,
  blocker,
  onNext,
}: {
  rows: CheckRow[];
  /** Alasan tombol lanjut nonaktif. null = boleh lanjut. */
  blocker: string | null;
  onNext: () => void;
}) {
  return (
    <aside className="flex flex-col gap-3.5 rounded-card border border-rim-soft bg-white p-4 sm:p-[22px] lg:sticky lg:top-4">
      <h2 className="text-base font-bold text-space-2">{SNBP_CHECK.title}</h2>
      <ul className="flex flex-col gap-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                r.state === "done"
                  ? "border-tint-green-fg bg-tint-green-fg text-white"
                  : r.state === "missing"
                    ? "border-alert-rim/40 bg-alert-bg text-alert-fg"
                    : "border-rim-box bg-white text-field-hint"
              }`}
            >
              {r.state === "done" ? <Check size={12} strokeWidth={3.2} /> : r.state === "missing" ? "!" : "·"}
            </span>
            <span className="flex-1 text-space-1">{r.label}</span>
            <span className="text-xs tabular-nums text-prose-dim">{r.note}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onNext}
        disabled={blocker !== null}
        aria-describedby={blocker ? "sn-blocker" : undefined}
        className="mt-1.5 flex h-[50px] items-center justify-center gap-2 rounded-xl bg-orbit-1 text-[15px] font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {SNBP_CHECK.next}
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
      {blocker && (
        <span id="sn-blocker" className="text-xs text-alert-fg">
          {blocker}
        </span>
      )}
    </aside>
  );
}

// ─── Langkah 2: Review ───────────────────────────────────────────────────────

export function ReviewStep({
  rows,
  notes,
  busy,
  error,
  onEdit,
  onCalculate,
}: {
  rows: { label: string; value: string }[];
  notes: { tone: "warn" | "info"; text: string }[];
  busy: boolean;
  error: string | null;
  onEdit: () => void;
  onCalculate: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section aria-labelledby="sn-rev" className="overflow-hidden rounded-card border border-rim-soft bg-white">
        <h2 id="sn-rev" className="border-b border-rim-soft px-4 py-4 text-lg font-bold text-space-2 sm:px-6 sm:py-5">
          {SNBP_REVIEW.title}
        </h2>
        <dl>
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-rim-faint px-4 py-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:px-6">
              <dt className="text-sm font-semibold text-prose">{r.label}</dt>
              <dd className="col-span-2 row-start-2 text-sm leading-relaxed text-space-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">{r.value}</dd>
              <dd className="col-start-2 row-start-1 sm:col-start-3">
                <button type="button" onClick={onEdit} className="min-h-9 px-1 text-[13px] font-semibold text-orbit-1 hover:underline">
                  {SNBP_REVIEW.edit}
                  <span className="sr-only"> {r.label}</span>
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <aside className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-4 sm:p-[22px]">
        <h2 className="text-base font-bold text-space-2">{SNBP_REVIEW.asideTitle}</h2>
        {notes.map((n) => (
          <div
            key={n.text}
            className={`flex gap-2.5 rounded-xl p-3 text-[13px] leading-normal ${n.tone === "warn" ? "bg-surface-peach text-tint-orange-ink" : "bg-surface-soft text-space-1"}`}
          >
            {n.tone === "warn" ? (
              <AlertTriangle size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-tint-orange-fg" />
            ) : (
              <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-prose" />
            )}
            {n.text}
          </div>
        ))}
        {error && (
          <p role="alert" className="rounded-xl bg-alert-bg px-3 py-2.5 text-[13px] text-alert-fg">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={onCalculate}
          disabled={busy}
          aria-busy={busy}
          className="mt-1 flex h-[50px] items-center justify-center gap-2 rounded-xl bg-gradient-sun-x text-[15px] font-semibold text-space-2 hover:brightness-105 disabled:cursor-wait disabled:opacity-80"
        >
          {busy ? <Loader2 size={16} aria-hidden="true" className="motion-safe:animate-spin" /> : <Sparkles size={16} aria-hidden="true" />}
          {busy ? SNBP_REVIEW.calculating : SNBP_REVIEW.calculate}
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={busy}
          className="h-11 rounded-xl border-[1.5px] border-rim bg-white text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-50"
        >
          {SNBP_REVIEW.back}
        </button>
      </aside>
    </div>
  );
}

// ─── Langkah 3: Hasil ────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<SnbpCategory, { chip: string; dot: string; bars: number; bar: string }> = {
  aman: { chip: "bg-tint-green-bg text-tint-green-fg", dot: "bg-tint-green-fg", bars: 3, bar: "bg-tint-green-fg" },
  waspada: { chip: "bg-tint-amber-soft text-tint-amber-fg", dot: "bg-sun-2", bars: 2, bar: "bg-sun-2" },
  berisiko: { chip: "bg-alert-bg text-alert-fg", dot: "bg-alert-fg", bars: 1, bar: "bg-alert-fg" },
};

export function ResultStep({
  result,
  targetMajorId,
  savingMajorId,
  targetError,
  onSetTarget,
  onRecalc,
  computedAt,
}: {
  result: SnbpResult;
  targetMajorId: string | null;
  savingMajorId: string | null;
  targetError: string | null;
  onSetTarget: (choice: { universityId: string; majorId: string }) => void;
  onRecalc: () => void;
  computedAt: string;
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
        {result.choices.map((c, i) => {
          const style = CATEGORY_STYLE[c.category];
          const isTarget = c.majorId === targetMajorId;
          return (
            <article key={c.majorId} className="flex flex-col gap-4 rounded-card border border-rim-soft bg-white p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-xs font-semibold text-prose-dim">{SNBP_CHOICES.choice(i + 1)}</span>
                  <h2 className="text-lg font-bold leading-snug text-space-2 sm:text-[19px]">{c.majorName}</h2>
                  <span className="text-sm text-prose">{c.universityName}</span>
                </div>
                <span className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold ${style.chip}`}>
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  {SNBP_RESULT.category[c.category]}
                </span>
              </div>
              <div aria-hidden="true" className="flex flex-col gap-1">
                <div className="grid grid-cols-3 gap-1">
                  {[0, 1, 2].map((b) => (
                    <span key={b} className={`h-2 rounded-full ${b < style.bars ? style.bar : "bg-surface-track"}`} />
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-field-hint">
                  {SNBP_RESULT.scale.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[13px] font-bold text-space-1">{SNBP_RESULT.factorsTitle}</h3>
                <ul className="flex flex-col gap-2">
                  {c.factors.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm leading-normal text-space-1">
                      <span
                        className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          f.direction === "up" ? "bg-tint-green-bg text-tint-green-fg" : "bg-tint-orange-bg text-tint-orange-fg"
                        }`}
                      >
                        {f.direction === "up" ? (
                          <ArrowUp size={11} strokeWidth={3.4} aria-label={SNBP_RESULT.up} />
                        ) : (
                          <ArrowDown size={11} strokeWidth={3.4} aria-label={SNBP_RESULT.down} />
                        )}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                aria-pressed={isTarget}
                disabled={savingMajorId !== null}
                aria-busy={savingMajorId === c.majorId}
                onClick={() => !isTarget && onSetTarget({ universityId: c.universityId, majorId: c.majorId })}
                className={`mt-auto flex h-[42px] items-center gap-2 self-start rounded-xl border-[1.5px] px-4 text-[13px] font-semibold disabled:cursor-wait disabled:opacity-70 ${
                  isTarget ? "border-orbit-1 bg-orbit-1 text-white" : "border-rim bg-white text-orbit-1 hover:bg-surface-sky"
                }`}
              >
                <Flag size={16} aria-hidden="true" />
                {isTarget ? SNBP_RESULT.isTarget : SNBP_RESULT.target}
              </button>
            </article>
          );
        })}
      </div>
      {targetError && (
        <p role="alert" className="text-[13px] text-alert-fg">
          {targetError}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-5">
        <section className="flex flex-col gap-3 rounded-card border border-rim-soft bg-white p-4 sm:p-6">
          <h2 className="text-[17px] font-bold text-space-2">{SNBP_RESULT.strategyTitle}</h2>
          <p className="text-sm leading-relaxed text-space-1">{result.strategy}</p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-normal text-prose">
            {result.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              to={ROUTES.actionPlan}
              className="flex h-11 items-center justify-center rounded-xl bg-orbit-1 px-4 text-sm font-semibold text-white hover:brightness-95"
            >
              {SNBP_RESULT.planCta}
            </Link>
            <button
              type="button"
              onClick={onRecalc}
              className="h-11 rounded-xl border-[1.5px] border-rim bg-white px-4 text-sm font-semibold text-space-1 hover:bg-surface-soft"
            >
              {SNBP_RESULT.recalc}
            </button>
          </div>
          <span className="text-xs text-prose-dim">
            {SNBP_RESULT.computedAt(computedAt)} · {SNBP_RESULT.temporary}
          </span>
        </section>
        <section className="flex gap-3 rounded-card bg-surface-blue p-4 text-[13px] leading-relaxed text-space-1 sm:p-5">
          <Info size={20} aria-hidden="true" className="mt-px shrink-0 text-orbit-1" />
          <p>
            <strong>{SNBP_RESULT.disclaimerStrong}</strong> {SNBP_RESULT.disclaimer}
          </p>
        </section>
      </div>
    </div>
  );
}
