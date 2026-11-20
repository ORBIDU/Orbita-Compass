import { Link } from "react-router-dom";
import { TENTANG_HERO } from "@/content/tentangKami";
import { ROUTES } from "@/config/navigation";
import { whatsappLink } from "@/config/brand";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, Starfield } from "@/components/landing/motion/Sky";
import { PillExternal, pillClasses } from "@/components/landing/primitives";
import tanah from "@/assets/publik/sekolah/sekolah-tanah.svg";

/** Awan putih lembut (bentuk sederhana), bergeser pelan. */
function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 80" aria-hidden="true" className={`pointer-events-none absolute h-auto motion-safe:animate-ob-awan ${className}`}>
      <g className="fill-white">
        <ellipse cx="70" cy="52" rx="58" ry="26" />
        <ellipse cx="118" cy="38" rx="46" ry="34" />
        <ellipse cx="160" cy="54" rx="48" ry="24" />
        <rect x="20" y="52" width="190" height="26" rx="13" />
      </g>
    </svg>
  );
}

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
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-[170px] w-full sm:h-[220px] lg:h-[300px]">
        <path d="M0 150 C120 120 180 60 260 70 C340 80 380 150 470 140 C560 130 620 40 720 50 C820 60 860 140 960 130 C1060 120 1110 60 1200 70 C1290 80 1360 130 1440 120 V320 H0Z" className="fill-gunung-jauh" />
        <path d="M0 210 C90 180 150 120 240 130 C330 140 400 210 500 200 C600 190 650 120 760 125 C870 130 920 205 1030 200 C1140 195 1200 140 1300 150 C1370 157 1410 180 1440 185 V320 H0Z" className="fill-gunung-tengah" />
        <path d="M0 260 C120 240 200 200 320 215 C440 230 520 270 650 262 C780 254 860 222 990 232 C1120 242 1200 275 1320 266 C1380 262 1420 255 1440 252 V320 H0Z" className="fill-gunung-dekat" />
      </svg>
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
