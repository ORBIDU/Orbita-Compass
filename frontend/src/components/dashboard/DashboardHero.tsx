import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { HERO } from "@/content/dashboard";
import { formatLongDate, greetingFor } from "@/lib/datetime";
import { makeStars } from "@/lib/stars";
import type { StudentStatus } from "@/types/student";
import type { TodayPlan } from "@/types/dashboard";
import MascotFigure from "@/components/mascot/MascotFigure";

interface DashboardHeroProps {
  now: Date;
  nickname: string;
  kelas: string;
  status: StudentStatus;
  /** undefined = masih dimuat atau gagal dimuat. */
  plan: TodayPlan | undefined;
}

/** Titik oranye di orbit hero desktop (koordinat desain); dua terakhir samar. */
const ORBIT_DOTS: [number, number, boolean][] = [
  [17, 90, true],
  [52, 54, true],
  [171, 46, true],
  [246, 70, false],
  [207, 104, false],
];

function CtaLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-sun-x px-[22px] text-[15px] font-semibold text-space-2 transition hover:brightness-105"
    >
      {children}
      <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
    </Link>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="flex h-7 items-center rounded-full border border-night-chip/20 bg-white/10 px-2.5 text-xs text-night-chip lg:h-[30px] lg:px-3 lg:text-[13px]">
      {children}
    </span>
  );
}

/** Kotak sambutan navy di atas Dashboard: tanggal, sapaan, dan langkah berikutnya sesuai status. */
export default function DashboardHero({ now, nickname, kelas, status, plan }: DashboardHeroProps) {
  const stars = useMemo(() => makeStars(28, 11), []);

  let body: string | null = null;
  let cta: { to: string; label: string } | null = null;
  let note: string | null = null;
  let chips: string[] = [];

  if (status === "baru") {
    body = HERO.baru.body;
    cta = { to: ROUTES.analisisPotensi, label: HERO.baru.cta };
    note = HERO.baru.note;
  } else if (plan && !plan.focus && plan.tasks.length === 0) {
    body = HERO.noFocus.body;
    cta = { to: ROUTES.actionPlan, label: HERO.noFocus.cta };
  } else if (plan) {
    const done = plan.tasks.filter((t) => t.done).length;
    body = plan.tasks.length > 0 ? HERO.progress(done, plan.tasks.length) : HERO.noTaskToday;
    chips = [kelas, ...(plan.focus?.length ? [HERO.focusChip(plan.focus)] : [])].filter(Boolean);
  }

  return (
    <section className="relative overflow-hidden rounded-[22px] bg-portal-hero-sm px-5 py-[22px] lg:grid lg:min-h-[196px] lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center lg:gap-6 lg:rounded-card-lg lg:bg-portal-hero lg:px-10 lg:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity * 0.7 }}
          />
        ))}
      </div>

      {/* Maskot kecil di pojok kanan atas (HP). */}
      <svg viewBox="0 0 88 96" aria-hidden="true" className="absolute right-2 top-2 h-24 w-24 lg:hidden">
        <g transform="translate(44 52) scale(0.236) translate(-320 -270)">
          <MascotFigure ring="solid" lookX={-2} lookY={2} animated={false} />
        </g>
      </svg>

      <div className="relative flex flex-col gap-2 lg:gap-2.5">
        <span className="text-[13px] text-night-text lg:text-sm">{formatLongDate(now)}</span>
        <h1 className="max-w-[230px] text-2xl font-bold leading-tight text-night-light sm:max-w-none lg:text-[32px] lg:tracking-[-0.5px]">
          {greetingFor(now)}, {nickname}!
        </h1>
        {body && <p className="max-w-[620px] text-sm leading-relaxed text-night-sub lg:text-base">{body}</p>}
        {chips.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5 lg:gap-2">
            {chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}
        {cta && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <CtaLink to={cta.to}>{cta.label}</CtaLink>
            {note && <span className="text-sm text-night-text">{note}</span>}
          </div>
        )}
      </div>

      {/* Orbit + maskot (desktop). */}
      <svg viewBox="0 0 260 150" aria-hidden="true" className="relative hidden h-[150px] w-[260px] overflow-visible lg:block">
        <g transform="rotate(-12 130 78)">
          <ellipse cx="130" cy="78" rx="120" ry="34" fill="none" strokeWidth="1.4" className="stroke-mascot-orbit-soft [stroke-opacity:0.45]" />
          {ORBIT_DOTS.map(([cx, cy, solid]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" className={`fill-sun-1 ${solid ? "" : "[fill-opacity:0.35]"}`} />
          ))}
        </g>
        <g transform="translate(130.5 72) scale(0.255) translate(-320 -270)">
          <MascotFigure ring="solid" lookX={2} animated={false} />
        </g>
      </svg>
    </section>
  );
}
