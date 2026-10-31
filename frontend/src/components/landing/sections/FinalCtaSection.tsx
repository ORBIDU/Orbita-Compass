import { FINAL_CTA } from "@/content/landing";
import MascotFigure from "@/components/mascot/MascotFigure";
import { CONTAINER, PillExternal, PillLink } from "../primitives";
import { useLandingNav } from "../useLandingNav";

/** Ajakan penutup di latar navy dengan garis orbit samar (footer ada di PublicLayout). */
export default function FinalCtaSection() {
  const { loggedIn, portalTo, subscribeHref } = useLandingNav();

  return (
    <section className="on-dark relative overflow-hidden bg-gradient-navy py-20 lg:py-32">
      {/* Garis orbit samar seperti desain */}
      <svg viewBox="0 0 1728 650" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
        <g fill="none" strokeWidth="1.5" className="stroke-night-text [stroke-opacity:0.18]">
          <ellipse cx="865" cy="330" rx="380" ry="330" />
          <ellipse cx="1235" cy="290" rx="200" ry="200" />
          <ellipse cx="490" cy="370" rx="195" ry="195" />
          <path d="M490 175 L1235 90" />
          <path d="M490 565 L1235 490" />
        </g>
      </svg>

      <div className={`${CONTAINER} relative flex flex-col items-center gap-4 text-center lg:gap-5`}>
        <svg viewBox="130 120 380 250" aria-hidden="true" className="h-12 w-[72px] overflow-visible lg:h-14 lg:w-20">
          <MascotFigure ring="solid" animated={false} />
        </svg>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-night-sub lg:text-sm">{FINAL_CTA.kicker}</p>
        <h2 className="text-balance text-[32px] font-medium leading-[1.15] tracking-[-1px] lg:text-[64px]">
          <span className="block text-night-light">{FINAL_CTA.titleTop}</span>
          <span className="block text-sun-2">{FINAL_CTA.titleBottom}</span>
        </h2>
        <p className="max-w-[640px] text-base leading-[1.6] text-night-sub lg:text-lg">{FINAL_CTA.subtitle}</p>
        {loggedIn ? (
          <PillLink to={portalTo} variant="sun" className="mt-4 h-[54px] lg:px-7">
            {FINAL_CTA.ctaLoggedIn}
          </PillLink>
        ) : (
          <PillExternal href={subscribeHref} variant="sun" className="mt-4 h-[54px] lg:px-7">
            {FINAL_CTA.cta}
          </PillExternal>
        )}
      </div>
    </section>
  );
}
