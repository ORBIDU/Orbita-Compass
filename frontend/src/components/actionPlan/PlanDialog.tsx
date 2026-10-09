import { useState, type ReactNode } from "react";
import { Loader2, Sparkles } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { SelectField } from "@/components/ui/FormField";
import { AP_CATEGORY_LABEL, AP_DIALOG } from "@/content/actionPlan";
import { practicesPerWeek } from "@/data/actionPlanEngine";
import {
  MAX_FOCUS,
  MAX_TKA_ELECTIVES,
  PLAN_CATEGORIES,
  TKA_ELECTIVES,
  type PlanCategory,
  type PlanDuration,
  type PlanMinutes,
  type PlanOptions,
  type PlanSettingsInput,
  type Weekday,
} from "@/types/actionPlan";

interface PlanDialogProps {
  /** Pengaturan sekarang. null = belum punya rencana. */
  initial: PlanSettingsInput | null;
  options: PlanOptions;
  onClose: () => void;
  onApply: (input: PlanSettingsInput) => Promise<void>;
}

const MINUTES: PlanMinutes[] = [60, 30, 90];
const SHORT_DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function Legend({ title, count }: { title: string; count: string }) {
  return (
    <legend className="flex w-full justify-between gap-3 pb-2.5 text-sm font-semibold text-space-1">
      {title}
      <span className="font-medium tabular-nums text-prose">{count}</span>
    </legend>
  );
}

function OptionButton({
  pressed,
  disabled,
  onClick,
  className,
  children,
  label,
}: {
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  className: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`border-[1.5px] font-[inherit] transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/** Jendela "Atur rencana" / "Atur ulang rencana". */
export default function PlanDialog({ initial, options, onClose, onApply }: PlanDialogProps) {
  const [focus, setFocus] = useState<PlanCategory[]>(initial?.focus ?? []);
  const [electives, setElectives] = useState<string[]>(initial?.tkaElectives ?? []);
  const [days, setDays] = useState<Weekday[]>(initial?.studyDays ?? [0, 2, 4]);
  const [duration, setDuration] = useState<PlanDuration>(
    initial && options.durations.some((d) => d.value === initial.duration) ? initial.duration : options.durations[0].value,
  );
  const [minutes, setMinutes] = useState<PlanMinutes>(initial?.minutesPerDay ?? 60);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canApply = focus.length > 0 && days.length > 0;
  const suggested = options.suggestedElectives;
  // Saran ditaruh paling depan, sisanya sesuai urutan daftar resmi.
  const electiveList = [...suggested, ...TKA_ELECTIVES.filter((e) => !suggested.includes(e))];

  function toggleFocus(c: PlanCategory) {
    const adding = !focus.includes(c);
    setFocus((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : prev.length < MAX_FOCUS ? [...prev, c] : prev));
    // Pertama kali memilih TKA: isi mapel pilihan dengan saran (tetap bisa diubah).
    if (adding && c === "TKA") setElectives((prev) => (prev.length ? prev : suggested.slice(0, MAX_TKA_ELECTIVES)));
  }

  function toggleElective(e: string) {
    setElectives((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : prev.length < MAX_TKA_ELECTIVES ? [...prev, e] : prev));
  }

  function toggleDay(d: Weekday) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  async function apply() {
    if (!canApply || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onApply({ focus, tkaElectives: focus.includes("TKA") ? electives : [], studyDays: days, duration, minutesPerDay: minutes });
    } catch {
      setError(AP_DIALOG.error);
      setBusy(false);
    }
  }

  return (
    <Dialog title={initial ? AP_DIALOG.titleEdit : AP_DIALOG.titleNew} onClose={onClose} widthClass="max-w-[600px]" busy={busy}>
      <p className="-mt-2 text-sm text-prose">{initial ? AP_DIALOG.subtitle : AP_DIALOG.subtitleNew}</p>

      <fieldset className="flex flex-col">
        <Legend title={AP_DIALOG.focus} count={AP_DIALOG.focusCount(focus.length, MAX_FOCUS)} />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {PLAN_CATEGORIES.map((c) => {
            const on = focus.includes(c);
            const mismatch = c === "Kedinasan" && options.kedinasanFit === false;
            return (
              <OptionButton
                key={c}
                pressed={on}
                disabled={!on && focus.length >= MAX_FOCUS}
                onClick={() => toggleFocus(c)}
                className={`flex min-h-[64px] flex-col items-start gap-1 rounded-[14px] p-3 text-left sm:min-h-[76px] ${
                  on ? "border-orbit-1 bg-surface-blue" : "border-rim bg-white hover:bg-surface-soft"
                }`}
              >
                <span className="text-[15px] font-bold text-space-2">
                  {AP_CATEGORY_LABEL[c]}
                </span>
                <span className="text-xs leading-snug text-prose">
                  {AP_DIALOG.focusOptions[c]}
                  {mismatch && <span className="text-tint-orange-fg">. {AP_DIALOG.kedinasanMismatch}</span>}
                </span>
              </OptionButton>
            );
          })}
        </div>
      </fieldset>

      {focus.includes("TKA") && (
        <fieldset className="flex flex-col" aria-describedby="ap-electives-hint">
          <Legend title={AP_DIALOG.electives} count={AP_DIALOG.electivesCount(electives.length, MAX_TKA_ELECTIVES)} />
          <p id="ap-electives-hint" className="-mt-1 mb-2.5 text-xs leading-normal text-prose">
            {AP_DIALOG.electivesHint}
            {suggested.length > 0 && ` ${AP_DIALOG.suggestedHint}`}
          </p>
          <div className="flex max-h-[168px] flex-wrap gap-2 overflow-y-auto rounded-xl p-0.5">
            {electiveList.map((e) => {
              const on = electives.includes(e);
              return (
                <OptionButton
                  key={e}
                  pressed={on}
                  disabled={!on && electives.length >= MAX_TKA_ELECTIVES}
                  onClick={() => toggleElective(e)}
                  className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ${
                    on ? "border-orbit-1 bg-surface-blue text-space-2" : "border-rim bg-white text-space-1 hover:bg-surface-soft"
                  }`}
                >
                  {e}
                  {suggested.includes(e) && (
                    <span className="rounded-full bg-tint-green-bg px-1.5 py-px text-[10px] font-semibold text-tint-green-fg">{AP_DIALOG.suggested}</span>
                  )}
                </OptionButton>
              );
            })}
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col">
        <Legend title={AP_DIALOG.days} count={AP_DIALOG.daysCount(days.length)} />
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {SHORT_DAYS.map((label, i) => {
            const d = i as Weekday;
            const on = days.includes(d);
            return (
              <OptionButton
                key={label}
                pressed={on}
                label={AP_DIALOG.dayNames[i]}
                onClick={() => toggleDay(d)}
                className={`h-[46px] rounded-xl text-[13px] font-semibold sm:text-sm ${
                  on ? "border-orbit-1 bg-orbit-1 text-white" : "border-field-rim bg-white text-space-1 hover:bg-surface-soft"
                }`}
              >
                {label}
              </OptionButton>
            );
          })}
        </div>
      </fieldset>

      <div className="grid items-start gap-3 sm:grid-cols-2">
        <SelectField
          label={AP_DIALOG.duration}
          value={duration}
          onChange={(e) => setDuration(e.target.value as PlanDuration)}
          options={options.durations}
          hint={options.durations.find((d) => d.value === duration)?.note}
          className="text-sm lg:text-sm"
        />
        <SelectField
          label={AP_DIALOG.minutes}
          value={String(minutes)}
          onChange={(e) => setMinutes(Number(e.target.value) as PlanMinutes)}
          options={MINUTES.map((m) => ({ value: String(m), label: AP_DIALOG.minutesOption(m) }))}
          className="text-sm lg:text-sm"
        />
      </div>

      <div className="flex items-center gap-2.5 rounded-xl bg-surface-blue px-3.5 py-3 text-[13px] leading-normal text-space-1">
        <Sparkles size={18} aria-hidden="true" className="shrink-0 text-orbit-1" />
        <span className="tabular-nums">{AP_DIALOG.estimate(practicesPerWeek({ studyDays: days, minutesPerDay: minutes }))}</span>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-alert-bg px-4 py-2.5 text-sm text-alert-fg">
          {error}
        </p>
      )}
      {!canApply && <p className="text-xs text-prose-dim">{AP_DIALOG.needFocus}</p>}

      <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="h-[46px] rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-50"
        >
          {AP_DIALOG.cancel}
        </button>
        <button
          type="button"
          onClick={apply}
          disabled={!canApply || busy}
          aria-busy={busy}
          className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-orbit-1 px-[22px] text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45 aria-busy:cursor-wait aria-busy:opacity-80"
        >
          {busy && <Loader2 size={16} aria-hidden="true" className="motion-safe:animate-spin" />}
          {busy ? AP_DIALOG.applying : AP_DIALOG.apply}
        </button>
      </div>
    </Dialog>
  );
}
