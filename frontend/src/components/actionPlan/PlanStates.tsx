import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { AP_LOCKED, AP_SETUP } from "@/content/actionPlan";

/** Status "baru": Action Plan terkunci, ajak isi Gambaran Minat Bakat. */
export function LockedPlan() {
  return (
    <section className="flex flex-col items-center gap-3 rounded-card-lg border border-rim-soft bg-white px-5 py-10 text-center sm:px-12 sm:py-14">
      <span className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-rim-faint text-prose">
        <Lock size={28} aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold text-space-2 lg:text-[22px]">{AP_LOCKED.title}</h2>
      <p className="max-w-[560px] text-sm leading-relaxed text-prose lg:text-[15px]">{AP_LOCKED.body}</p>
      <Link
        to={ROUTES.analisisPotensi}
        className="mt-2 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-sun-x px-[22px] text-[15px] font-semibold text-space-2 hover:brightness-105"
      >
        {AP_LOCKED.cta}
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </section>
  );
}

/** Sudah tes, belum punya rencana: ajak mengatur rencana. */
export function SetupHero({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="grid gap-6 overflow-hidden rounded-card-lg bg-portal-hero-sm px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-10 lg:bg-portal-hero lg:px-11 lg:py-10">
      <div className="flex flex-col gap-3.5">
        <h2 className="text-[22px] font-bold leading-tight text-night-light lg:text-[28px]">{AP_SETUP.title}</h2>
        <p className="max-w-[560px] text-sm leading-relaxed text-night-sub lg:text-[15px]">{AP_SETUP.body}</p>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="mt-2 inline-flex h-[50px] items-center justify-center gap-2 self-stretch rounded-xl bg-gradient-sun-x px-6 text-[15px] font-semibold text-space-2 hover:brightness-105 sm:self-start"
        >
          {AP_SETUP.cta}
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
      <ol className="flex flex-col gap-2.5">
        {AP_SETUP.steps.map((step, i) => (
          <li key={step.title} className="flex items-center gap-3.5 rounded-2xl bg-white/[0.08] px-4 py-3.5">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${
                i === 0 ? "bg-sun-1 text-space-2" : "bg-white/[0.14] text-night-light"
              }`}
            >
              {i + 1}
            </span>
            <span className="flex flex-col">
              <span className="text-[15px] font-semibold text-night-light">{step.title}</span>
              <span className="text-[13px] text-night-text">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
