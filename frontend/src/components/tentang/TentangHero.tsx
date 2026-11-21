import { Link } from "react-router-dom";
import { TENTANG_HERO } from "@/content/tentangKami";
import { ROUTES } from "@/config/navigation";
import { whatsappLink } from "@/config/brand";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, Starfield } from "@/components/landing/motion/Sky";
import Hills from "@/components/landing/motion/Hills";
import Cloud from "@/components/landing/motion/Cloud";
import { PillExternal, pillClasses } from "@/components/landing/primitives";
import tanah from "@/assets/publik/sekolah/sekolah-tanah.svg";

/**
 * Hero Tentang Kami (belum ada desain, disusun dengan gaya situs publik):
 * langit fajar, matahari terbit yang naik pelan, tiga lapis gunung, awan, meteor.
 */
export default function TentangHero() {
  const ref = usePauseOffscreen<HTMLElement>();
  const H = TENTANG_HERO;

  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-fajar">
      <Starfield count={50} seed={23} maxTop={40} />
      <Meteors
        meteors={[
          { left: 70, top: 2, duration: 9, delay: -1, length: 200 },
          { left: 95, top: 12, duration: 12, delay: -6, length: 170 },
          { left: 45, top: -4, duration: 15, delay: -11, length: 150 },
        ]}
      />

      {/* Matahari terbit di belakang gunung. */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[90px] left-[52%] w-[clamp(150px,18vw,270px)] sm:bottom-[110px] lg:bottom-[150px] lg:left-[58%]">
        <div className="motion-safe:animate-ob-terbit">
          <span className="absolute inset-[-45%] rounded-full bg-[radial-gradient(circle,rgba(255,200,110,0.55),transparent_65%)] motion-safe:animate-ob-denyut" />
          <span className="relative block aspect-square rounded-full bg-matahari shadow-[0_0_80px_20px_rgba(255,170,80,0.45)]" />
        </div>
      </div>

      <Cloud className="bottom-[120px] left-[8%] w-[clamp(120px,14vw,220px)] opacity-80 sm:bottom-[160px] lg:bottom-auto lg:left-[56%] lg:top-[44%] [animation-duration:16s]" />
      <Cloud className="bottom-[170px] left-[70%] w-[clamp(90px,10vw,170px)] opacity-60 sm:bottom-[220px] lg:bottom-auto lg:left-[78%] lg:top-[30%] [animation-direction:alternate-reverse]" />
      <Cloud className="-left-[2%] top-[62%] hidden w-[clamp(110px,12vw,200px)] opacity-50 sm:block [animation-duration:20s]" />

      {/* Tiga lapis gunung, makin dekat makin gelap. */}
      <Hills className="h-[170px] sm:h-[220px] lg:h-[300px]" />
      <img src={tanah} alt="" aria-hidden="true" className="pointer-events-none absolute bottom-[-2px] left-0 h-auto w-full" />

      <div className="relative mx-auto flex min-h-[640px] w-full max-w-[1600px] flex-col px-5 pb-[230px] pt-14 sm:px-8 sm:pb-[300px] sm:pt-20 lg:min-h-[min(48vw,760px)] lg:px-[min(7vw,120px)] lg:pb-[320px] lg:pt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sun-2">{H.kicker}</p>
        <h1 className="mt-4 max-w-[760px] text-balance text-[32px] font-bold leading-[1.18] tracking-[-0.6px] text-white sm:text-[44px] lg:text-[clamp(40px,3.9vw,64px)]">
          {H.titleLead}
          <span className="text-sun-2">{H.titleAccent}</span>
        </h1>
        <p className="mt-5 max-w-[620px] text-base leading-[1.65] text-night-sub lg:text-lg">{H.body}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PillExternal href={whatsappLink("faq")} variant="sun" icon="none" className="h-12 px-7 lg:h-[54px]">
            {H.primary}
          </PillExternal>
          <Link to={ROUTES.untukSekolah} className={pillClasses("outline", "h-12 border-white/40 bg-white/10 px-7 text-white hover:bg-white/20 lg:h-[54px]")}>
            {H.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
