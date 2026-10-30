import { HERO } from "@/content/landing";
import LandingHeader from "../LandingHeader";
import HeroVisual from "../HeroVisual";
import { CONTAINER, PillButton, PillExternal, PillLink } from "../primitives";
import { useLandingNav } from "../useLandingNav";

export default function HeroSection() {
  const { loggedIn, portalTo, subscribeHref, scrollTo } = useLandingNav();

  return (
    <section className="relative overflow-hidden bg-hero-glow pb-14 lg:pb-20">
      <div className={CONTAINER}>
        <LandingHeader />

        <div className="flex flex-col lg:mt-2 lg:grid lg:grid-cols-[minmax(0,600px)_minmax(0,560px)] lg:items-center lg:gap-10">
          {/* Di HP visual tampil di atas teks, di desktop di kanan. */}
          <HeroVisual className="-mx-5 w-[calc(100%+2.5rem)] self-center sm:mx-auto sm:w-full sm:max-w-[520px] lg:order-2 lg:max-w-none" />

          <div className="mt-5 flex flex-col gap-3 lg:order-1 lg:mt-0 lg:gap-[22px]">
            <p className="font-accent text-[30px] font-bold leading-none text-sun-1 lg:text-4xl">{HERO.greeting}</p>
            <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-[-0.9px] text-space-2 lg:text-[52px] lg:leading-[1.06] lg:tracking-[-1.6px] xl:text-[62px]">
              {HERO.title}
            </h1>
            <p className="max-w-[520px] text-base leading-[1.65] text-prose lg:text-[19px]">{HERO.subtitle}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5 lg:mt-2.5">
              {loggedIn ? (
                <PillLink to={portalTo} variant="sun" className="h-[54px] lg:h-[58px] lg:px-7 lg:text-[17px]">
                  {HERO.primaryCtaLoggedIn}
                </PillLink>
              ) : (
                <PillExternal href={subscribeHref} variant="sun" className="h-[54px] lg:h-[58px] lg:px-7 lg:text-[17px]">
                  {HERO.primaryCta}
                </PillExternal>
              )}
              <PillButton variant="outline" icon="down" onClick={() => scrollTo("masalah")} className="h-[54px] lg:h-[58px] lg:text-[17px]">
                {HERO.secondaryCta}
              </PillButton>
            </div>
          </div>
        </div>

        {/* Logo kampus (masih placeholder) */}
        <div className="mt-6 flex flex-col gap-3 lg:mt-12 lg:gap-4">
          <span className="text-[13px] font-medium leading-normal text-prose lg:text-sm">{HERO.campusCaption}</span>
          <ul className="grid grid-cols-3 gap-2.5 md:grid-cols-6 lg:gap-4">
            {HERO.campusLogos.map((label, i) => (
              <li
                key={i}
                className="flex h-[52px] items-center justify-center rounded-xl border-[1.5px] border-dashed border-rim-strong bg-white text-center text-[11px] font-medium text-prose-dim lg:h-16 lg:rounded-[14px] lg:text-[13px]"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
