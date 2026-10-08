import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Info } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { SNBP_ELIGIBLE, SNBP_STEPS } from "@/content/siapSnbp";
import type { EligibleStatus } from "@/types/snbp";

export type SnbpStep = 0 | 1 | 2;

/** Catatan eligible + pilihan status yang diisi siswa sendiri. */
export function EligibleBar({ value, onChange }: { value: EligibleStatus; onChange: (v: EligibleStatus) => void }) {
  const [before, after] = SNBP_ELIGIBLE.body.split(SNBP_ELIGIBLE.bodyStrong);
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface-blue px-4 py-3.5 lg:flex-row lg:items-center lg:gap-3.5 lg:px-[18px]">
      <div className="flex flex-1 gap-3">
        <Info size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-orbit-1 lg:mt-0" />
        <p className="text-sm leading-normal text-space-1">
          {before}
          <strong>{SNBP_ELIGIBLE.bodyStrong}</strong>
          {after}
          {value === "tidak" && (
            <>
              {" "}
              <span className="font-semibold">{SNBP_ELIGIBLE.notEligible}</span>{" "}
              <Link to={ROUTES.persiapanUjian("snbt")} className="font-semibold text-orbit-1 underline">
                {SNBP_ELIGIBLE.notEligibleCta}
              </Link>
            </>
          )}
        </p>
      </div>
      <label className="flex shrink-0 flex-col gap-1.5 text-[13px] font-semibold text-space-1 sm:flex-row sm:items-center sm:gap-2">
        {SNBP_ELIGIBLE.label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as EligibleStatus)}
          className="h-10 rounded-[10px] border-[1.5px] border-rim-strong bg-white px-2.5 text-[13px] text-space-2"
        >
          {SNBP_ELIGIBLE.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

/** Penanda langkah 1-2-3. */
export function StepIndicator({ step }: { step: SnbpStep }) {
  return (
    <ol aria-label="Langkah rasionalisasi" className="grid grid-cols-3 gap-2 rounded-card border border-rim-soft bg-white px-3 py-3.5 sm:gap-4 sm:px-6 sm:py-[18px]">
      {SNBP_STEPS.map((s, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li key={s.label} aria-current={current ? "step" : undefined} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3 sm:text-left">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold tabular-nums sm:h-9 sm:w-9 ${
                done ? "border-tint-green-fg bg-tint-green-fg text-white" : current ? "border-orbit-1 bg-orbit-1 text-white" : "border-field-rim bg-white text-prose-dim"
              }`}
            >
              {done ? <Check size={16} strokeWidth={3} aria-label="Selesai" /> : i + 1}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className={`text-[13px] text-space-2 sm:text-[15px] ${current ? "font-bold" : "font-medium"}`}>{s.label}</span>
              <span className="hidden text-xs text-prose-dim md:block">{s.sub}</span>
            </span>
            {i < 2 && <span aria-hidden="true" className={`ml-1 hidden h-0.5 flex-1 rounded lg:block ${done ? "bg-tint-green-fg" : "bg-rim-soft"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

const LETTER_TONE = {
  blue: "bg-tint-blue-bg text-tint-blue-fg",
  orange: "bg-tint-orange-bg text-tint-orange-fg",
  green: "bg-tint-green-bg text-tint-green-fg",
  purple: "bg-tint-purple-bg text-tint-purple-fg",
};

/** Kartu bagian input (A–D). */
export function SectionCard({
  id,
  letter,
  tone,
  title,
  extra,
  aside,
  children,
}: {
  id: string;
  letter: string;
  tone: keyof typeof LETTER_TONE;
  title: string;
  extra?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3.5 rounded-card border border-rim-soft bg-white p-4 sm:px-6 sm:py-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 id={id} className="flex items-center gap-2.5 text-[17px] font-bold text-space-2">
          <span aria-hidden="true" className={`flex h-7 w-7 items-center justify-center rounded-lg text-[13px] ${LETTER_TONE[tone]}`}>
            {letter}
          </span>
          {title}
          {extra && <span className="text-[13px] font-medium text-prose-dim">{extra}</span>}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
