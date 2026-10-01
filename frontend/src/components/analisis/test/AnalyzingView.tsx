import { Check } from "lucide-react";
import { ANALYZING } from "@/content/analisis";

interface AnalyzingViewProps {
  /** Langkah yang sedang berjalan (0–2). Langkah sebelumnya ditandai selesai. */
  step: number;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
}

function Spinner({ size, stroke }: { size: number; stroke: number }) {
  const r = (size - stroke) / 2;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={c} cy={c} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-track" />
      <path
        d={`M${c} ${stroke / 2}a${r} ${r} 0 01${r} ${r}`}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="stroke-orbit-1 motion-safe:animate-spin"
        style={{ transformOrigin: `${c}px ${c}px`, transformBox: "view-box" }}
      />
    </svg>
  );
}

/** Layar "AI sedang memahami profilmu" dengan tiga langkah (simulasi + panggilan analisis). */
export default function AnalyzingView({ step, error, onRetry, onBack }: AnalyzingViewProps) {
  return (
    <section
      aria-live="polite"
      aria-busy={!error}
      className="flex flex-col items-center gap-3.5 rounded-card border border-rim-soft bg-white px-5 py-12 text-center lg:px-12 lg:py-14"
    >
      {!error && <Spinner size={64} stroke={6} />}
      <h2 className="text-xl font-bold text-space-2 lg:text-[22px]">{ANALYZING.title}</h2>
      <p className="max-w-[520px] text-sm leading-relaxed text-prose lg:text-[15px]">{ANALYZING.body}</p>
      <ul className="mt-2 flex flex-col gap-2.5 text-left">
        {ANALYZING.steps.map((label, i) => {
          const done = i < step;
          const current = i === step && !error;
          return (
            <li key={label} className={`flex items-center gap-2.5 text-sm ${done ? "text-space-1" : current ? "font-semibold text-space-2" : "text-field-hint"}`}>
              {done ? (
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-tint-green-fg text-white">
                  <Check size={12} strokeWidth={3.4} aria-hidden="true" />
                </span>
              ) : current ? (
                <Spinner size={22} stroke={3} />
              ) : (
                <span className="h-[22px] w-[22px] shrink-0 rounded-full border-2 border-field-rim" />
              )}
              {label}
            </li>
          );
        })}
      </ul>
      {error && (
        <div className="mt-3 flex flex-col items-center gap-3">
          <p role="alert" className="rounded-xl bg-alert-bg px-4 py-3 text-sm text-alert-fg">
            {error}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button type="button" onClick={onBack} className="h-11 rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-space-1 hover:bg-surface-soft">
              {ANALYZING.back}
            </button>
            <button type="button" onClick={onRetry} className="h-11 rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95">
              {ANALYZING.retry}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
