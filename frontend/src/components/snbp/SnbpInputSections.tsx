import { Link } from "react-router-dom";
import { Check, FileWarning } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { SNBP_ACHIEVEMENTS, SNBP_CHOICES, SNBP_RAPOR, SNBP_TKA } from "@/content/siapSnbp";
import { formatScore } from "@/lib/rapor";
import type { ChoiceSource, RaporSummary } from "@/lib/snbp";
import { semesterRange } from "@/data/snbpEngine";
import { TKA_REQUIRED } from "@/types/actionPlan";
import type { AchievementItem } from "@/types/analisis";
import { MAX_SNBP_ACHIEVEMENTS, type SnbpCampus, type SnbpChoice } from "@/types/snbp";
import { SectionCard } from "./SnbpShared";

// ─── A. Nilai rapor ──────────────────────────────────────────────────────────

export function RaporSection({ summary }: { summary: RaporSummary }) {
  const empty = summary.average === null;
  return (
    <SectionCard
      id="sn-a"
      letter="A"
      tone="blue"
      title={SNBP_RAPOR.title}
      aside={<span className="rounded-full bg-tint-green-bg px-2.5 py-[3px] text-xs font-semibold text-tint-green-fg">{SNBP_RAPOR.auto}</span>}
    >
      {empty ? (
        <div className="flex items-start gap-3.5 rounded-[14px] bg-alert-bg p-4 sm:p-5">
          <FileWarning size={22} aria-hidden="true" className="shrink-0 text-alert-fg" />
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold text-space-2">{SNBP_RAPOR.emptyTitle}</span>
            <span className="text-sm leading-normal text-prose">{SNBP_RAPOR.emptyBody}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5">
            {summary.perSemester.map((s) => (
              <div
                key={s.semester}
                className={`flex flex-col gap-0.5 rounded-[14px] px-2 py-3 text-center ${s.average === null ? "bg-surface-soft" : "bg-surface-bubble"}`}
              >
                <span className="text-xs text-prose-dim">{SNBP_RAPOR.semester(s.semester)}</span>
                {s.average === null ? (
                  <span className="text-[13px] font-semibold text-prose-dim">{SNBP_RAPOR.missing}</span>
                ) : (
                  <span className="text-xl font-bold tabular-nums text-space-2">{formatScore(s.average)}</span>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-0.5 rounded-[14px] bg-orbit-1 px-2 py-3 text-center">
              <span className="text-xs text-night-chip">{SNBP_RAPOR.average}</span>
              <span className="text-xl font-bold tabular-nums text-white">{formatScore(summary.average!)}</span>
            </div>
          </div>
          <p className="text-[13px] leading-normal text-prose">
            {SNBP_RAPOR.note(
              semesterRange(summary.available.map((s) => s.semester)),
              summary.missing.length ? semesterRange(summary.missing) : null,
            )}
          </p>
        </>
      )}
    </SectionCard>
  );
}

// ─── B. Nilai TKA ────────────────────────────────────────────────────────────

/** "86,5" / "86.5" → 86.5. null = kosong, NaN = tidak valid. */
export function parseTka(text: string | undefined): number | null {
  const t = (text ?? "").trim().replace(",", ".");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : NaN;
}

interface TkaSectionProps {
  enabled: boolean;
  onToggle: () => void;
  scores: Record<string, string>;
  onChange: (subject: string, value: string) => void;
  /** null = belum ada pengaturan Action Plan / belum memilih TKA. */
  electives: string[] | null;
}

function TkaField({ subject, value, onChange }: { subject: string; value: string; onChange: (v: string) => void }) {
  const invalid = Number.isNaN(parseTka(value));
  const id = `tka-${subject.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-[13px] font-semibold text-space-1">
      {subject}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={SNBP_TKA.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-err` : undefined}
        className={`h-[46px] rounded-xl border-[1.5px] bg-field-bg px-3 text-base text-space-2 placeholder:text-field-hint focus:outline-none focus:ring-2 lg:text-[15px] ${
          invalid ? "border-alert-rim focus:ring-alert-rim/20" : "border-field-rim focus:border-orbit-1 focus:ring-orbit-1/20"
        }`}
      />
      {invalid && (
        <span id={`${id}-err`} className="text-xs font-normal text-alert-fg">
          {SNBP_TKA.invalid}
        </span>
      )}
    </label>
  );
}

export function TkaSection({ enabled, onToggle, scores, onChange, electives }: TkaSectionProps) {
  return (
    <SectionCard
      id="sn-b"
      letter="B"
      tone="orange"
      title={SNBP_TKA.title}
      extra={SNBP_TKA.optional}
      aside={
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          className="flex min-h-10 items-center gap-2.5 px-1 text-[13px] font-semibold text-space-1"
        >
          {SNBP_TKA.toggle}
          <span aria-hidden="true" className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${enabled ? "bg-orbit-1" : "bg-rim-strong"}`}>
            <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-[left] ${enabled ? "left-[19px]" : "left-[3px]"}`} />
          </span>
        </button>
      }
    >
      {!enabled ? (
        <p className="text-sm leading-relaxed text-prose">{SNBP_TKA.off}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold text-prose">{SNBP_TKA.required}</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {TKA_REQUIRED.map((s) => (
              <TkaField key={s} subject={s} value={scores[s] ?? ""} onChange={(v) => onChange(s, v)} />
            ))}
          </div>
          <span className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-prose">
            {SNBP_TKA.electives}
            {electives && <span className="rounded-full bg-tint-blue-bg px-2 py-0.5 text-xs font-semibold text-tint-blue-fg">{SNBP_TKA.fromPlan}</span>}
          </span>
          {electives && electives.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {electives.map((s) => (
                <TkaField key={s} subject={s} value={scores[s] ?? ""} onChange={(v) => onChange(s, v)} />
              ))}
            </div>
          ) : (
            <p className="text-[13px] leading-normal text-prose">
              {SNBP_TKA.noPlan}{" "}
              <Link to={ROUTES.actionPlan} className="font-semibold text-orbit-1 underline">
                {SNBP_TKA.noPlanCta}
              </Link>
            </p>
          )}
          <span className="text-xs text-prose-dim">{SNBP_TKA.hint}</span>
        </div>
      )}
    </SectionCard>
  );
}

// ─── C. Prestasi ─────────────────────────────────────────────────────────────

export function AchievementSection({
  items,
  selected,
  onToggle,
}: {
  items: AchievementItem[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const full = selected.length >= MAX_SNBP_ACHIEVEMENTS;
  return (
    <SectionCard
      id="sn-c"
      letter="C"
      tone="green"
      title={SNBP_ACHIEVEMENTS.title}
      aside={
        <span className={`text-[13px] font-semibold tabular-nums ${full ? "text-tint-green-fg" : "text-prose"}`}>
          {SNBP_ACHIEVEMENTS.count(selected.length, MAX_SNBP_ACHIEVEMENTS)}
        </span>
      }
    >
      {items.length === 0 ? (
        <p className="text-sm leading-normal text-prose">
          {SNBP_ACHIEVEMENTS.empty}{" "}
          <Link to={`${ROUTES.analisisPotensi}?tab=prestasi`} className="font-semibold text-orbit-1 underline">
            {SNBP_ACHIEVEMENTS.emptyCta}
          </Link>
        </p>
      ) : (
        <>
          <p className="text-[13px] leading-normal text-prose">{SNBP_ACHIEVEMENTS.body}</p>
          <div role="group" aria-labelledby="sn-c" className="flex flex-col gap-2">
            {items.map((a) => {
              const on = selected.includes(a.id);
              const disabled = !on && full;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  disabled={disabled}
                  onClick={() => onToggle(a.id)}
                  className={`flex min-h-[60px] items-center gap-3 rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    on ? "border-orbit-1 bg-surface-sky" : "border-rim-soft bg-white hover:bg-surface-soft"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 ${on ? "border-orbit-1 bg-orbit-1" : "border-rim-box bg-white"}`}
                  >
                    {on && <Check size={12} strokeWidth={3.4} className="text-white" />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-semibold text-space-2">{a.title}</span>
                    <span className="text-xs text-prose-dim">{SNBP_ACHIEVEMENTS.meta(a.level, a.rank, a.year)}</span>
                    {!a.certificateName && <span className="text-xs font-semibold text-tint-orange-fg sm:hidden">{SNBP_ACHIEVEMENTS.noFile}</span>}
                  </span>
                  {!a.certificateName && (
                    <span className="hidden shrink-0 text-xs font-semibold text-tint-orange-fg sm:inline">{SNBP_ACHIEVEMENTS.noFile}</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ─── D. Pilihan prodi ────────────────────────────────────────────────────────

const selectClass =
  "h-[46px] w-full rounded-xl border-[1.5px] border-field-rim bg-white px-2.5 text-sm text-space-2 focus:border-orbit-1 focus:outline-none focus:ring-2 focus:ring-orbit-1/20 disabled:bg-field-bg disabled:text-field-hint";

function ChoiceCard({
  index,
  campuses,
  value,
  onChange,
  source,
}: {
  index: number;
  campuses: SnbpCampus[];
  value: SnbpChoice | null;
  onChange: (c: SnbpChoice | null) => void;
  source: ChoiceSource | null;
}) {
  const campus = campuses.find((c) => c.id === value?.universityId) ?? null;
  const campusId = `sn-campus-${index}`;
  const prodiId = `sn-prodi-${index}`;
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-rim-soft bg-surface-soft p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold text-space-2">{SNBP_CHOICES.choice(index + 1)}</span>
        {source ? (
          <span className="rounded-full bg-tint-blue-bg px-2 py-0.5 text-[11px] font-semibold text-tint-blue-fg">
            {source === "profile" ? SNBP_CHOICES.fromProfile : SNBP_CHOICES.fromCompass}
          </span>
        ) : index === 1 ? (
          <span className="text-[11px] text-prose-dim">{SNBP_CHOICES.optional}</span>
        ) : null}
      </div>
      <label htmlFor={campusId} className="flex flex-col gap-1.5 text-[13px] font-semibold text-space-1">
        {SNBP_CHOICES.campus}
        <select
          id={campusId}
          value={value?.universityId ?? ""}
          onChange={(e) => {
            const next = campuses.find((c) => c.id === e.target.value);
            onChange(next ? { universityId: next.id, majorId: "" } : null);
          }}
          className={selectClass}
        >
          <option value="">{SNBP_CHOICES.campusPlaceholder}</option>
          {campuses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor={prodiId} className="flex flex-col gap-1.5 text-[13px] font-semibold text-space-1">
        {SNBP_CHOICES.prodi}
        <select
          id={prodiId}
          value={value?.majorId ?? ""}
          disabled={!campus}
          onChange={(e) => campus && onChange({ universityId: campus.id, majorId: e.target.value })}
          className={selectClass}
        >
          <option value="">{campus ? SNBP_CHOICES.prodiPlaceholder : SNBP_CHOICES.prodiDisabled}</option>
          {campus?.majors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      {value && (
        <button type="button" onClick={() => onChange(null)} className="self-start text-[13px] font-semibold text-orbit-1 hover:underline">
          {SNBP_CHOICES.clear}
          <span className="sr-only"> {SNBP_CHOICES.choice(index + 1)}</span>
        </button>
      )}
    </div>
  );
}

export function ChoiceSection({
  campuses,
  choices,
  onChange,
  firstSource,
  duplicate,
}: {
  campuses: SnbpCampus[];
  choices: [SnbpChoice | null, SnbpChoice | null];
  onChange: (index: 0 | 1, c: SnbpChoice | null) => void;
  firstSource: ChoiceSource | null;
  duplicate: boolean;
}) {
  return (
    <SectionCard id="sn-d" letter="D" tone="purple" title={SNBP_CHOICES.title}>
      <p className="text-[13px] leading-normal text-prose">{SNBP_CHOICES.campusNote}</p>
      <div className="grid gap-3.5 md:grid-cols-2">
        <ChoiceCard index={0} campuses={campuses} value={choices[0]} onChange={(c) => onChange(0, c)} source={firstSource} />
        <ChoiceCard index={1} campuses={campuses} value={choices[1]} onChange={(c) => onChange(1, c)} source={null} />
      </div>
      {duplicate && (
        <p role="alert" className="text-[13px] text-alert-fg">
          {SNBP_CHOICES.same}
        </p>
      )}
      <p className="text-[13px] leading-normal text-prose">{SNBP_CHOICES.rulesNote}</p>
    </SectionCard>
  );
}
