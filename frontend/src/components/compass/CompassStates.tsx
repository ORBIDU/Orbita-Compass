import { Link } from "react-router-dom";
import { ArrowRight, Building2, Compass, ListChecks, Lock, Sparkles } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { COMPASS_EMPTY, COMPASS_LOCKED } from "@/content/compass";

const BENEFIT_ICONS = [Compass, ListChecks, Building2];

/** Status "baru": Compass terkunci, ajak isi Gambaran Minat Bakat. */
export function LockedCompass() {
  return (
    <section className="grid gap-6 rounded-card-lg border border-rim-soft bg-white p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-12 lg:p-14">
      <div className="flex flex-col gap-3.5">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rim-faint text-prose">
          <Lock size={26} aria-hidden="true" />
        </span>
        <h2 className="text-[22px] font-bold leading-tight text-space-2 lg:text-[26px]">{COMPASS_LOCKED.title}</h2>
        <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{COMPASS_LOCKED.body}</p>
        <Link
          to={ROUTES.analisisPotensi}
          className="mt-1.5 inline-flex h-[50px] items-center justify-center gap-2 self-stretch rounded-xl bg-gradient-sun-x px-[22px] text-[15px] font-semibold text-space-2 hover:brightness-105 sm:self-start"
        >
          {COMPASS_LOCKED.cta}
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>
      <div className="flex flex-col gap-3.5 rounded-[18px] bg-surface-soft p-5 lg:p-6">
        <span className="text-[15px] font-bold text-space-2">{COMPASS_LOCKED.benefitsTitle}</span>
        <ul className="flex flex-col gap-3.5">
          {COMPASS_LOCKED.benefits.map((text, i) => {
            const Icon = BENEFIT_ICONS[i];
            return (
              <li key={text} className="flex gap-3 text-sm leading-normal text-space-1">
                <Icon size={20} aria-hidden="true" className="shrink-0 text-orbit-1" />
                {text}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Sudah tes tetapi analisis belum pernah dijalankan (mungkin terjadi dengan backend asli). */
export function EmptyCompass({ onAnalyze, busy, error }: { onAnalyze: () => void; busy: boolean; error: string | null }) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-card border border-rim-soft bg-white px-5 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint-blue-bg text-orbit-1">
        <Compass size={26} aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold text-space-2">{COMPASS_EMPTY.title}</h2>
      <p className="max-w-[460px] text-sm leading-relaxed text-prose">{COMPASS_EMPTY.body}</p>
      {error && (
        <p role="alert" className="rounded-xl bg-alert-bg px-4 py-2.5 text-sm text-alert-fg">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={busy}
        aria-busy={busy}
        className="mt-1 inline-flex h-12 items-center gap-2 rounded-xl bg-orbit-1 px-5 text-[15px] font-semibold text-white hover:brightness-95 disabled:cursor-wait disabled:opacity-75"
      >
        <Sparkles size={16} aria-hidden="true" />
        {COMPASS_EMPTY.cta}
      </button>
    </section>
  );
}
