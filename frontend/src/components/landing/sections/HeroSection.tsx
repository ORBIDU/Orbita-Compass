import { HERO } from "@/content/landing";
import { whatsappLink } from "@/config/brand";
import MascotSlot from "@/components/mascot/MascotSlot";
import { Starfield } from "@/components/landing/motion/Sky";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import angkasa from "@/assets/publik/hero-angkasa.svg";
import sekolah from "@/assets/publik/hero-sekolah.webp";
import { CONTAINER, PillButton, PillExternal, PillLink } from "../primitives";
import { useLandingNav } from "../useLandingNav";

/**
 * Hero beranda (konsep dari docs/design/publik/Beranda-Desktop.jpg).
 * Seluruh hero berlatar langit malam yang mulus (tanpa tepi awan). Panel angkasa
 * (orbit, planet, meteor; animasinya ada di dalam SVG dan mati sendiri kalau
 * prefers-reduced-motion) memudar ke latar di sisi kiri (desktop) atau bawah (HP).
 * Maskot di atasnya memakai MascotSlot. Gedung sekolah berdiri di cakrawala planet.
 */
export default function HeroSection() {
  const { loggedIn, portalTo, scrollTo } = useLandingNav();
  const ref = usePauseOffscreen<HTMLElement>();

  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-angkasa-hero lg:min-h-[53.5vw] xl:min-h-[min(58.8vw,1018px)]">
      <Starfield count={40} seed={7} maxTop={90} />

      {/* Panel angkasa. Kotak dalam selalu berasio desain supaya posisi maskot (persen) tetap pas. */}
      <div className="relative aspect-[1142/1018] w-full [mask-image:linear-gradient(180deg,#000_78%,transparent)] sm:ml-auto sm:w-[85%] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[60%] lg:overflow-hidden lg:[mask-image:linear-gradient(90deg,transparent,#000_22%)] xl:w-[66%]">
        <div className="absolute left-0 top-0 aspect-[1142/1018] h-full">
          <img src={angkasa} alt="" className="absolute inset-0 h-full w-full" />
          {/* Kotak MascotSlot dihitung dari posisi maskot di desain (relatif ke panel). */}
          <div className="absolute left-[48.2%] top-[27.6%] h-[26.3%] w-[35.6%]">
            <MascotSlot className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Cakrawala planet tempat gedung sekolah berdiri: elips lebar yang hanya terlihat puncaknya. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 bottom-[-40px] h-[124px] w-[150%] rounded-t-[50%] border-t-2 border-mascot-orbit-soft/40 bg-angkasa-tanah sm:h-[150px] lg:h-[clamp(150px,13vw,220px)]"
      />

      <div className={`${CONTAINER} relative flex flex-col lg:min-h-[53.5vw] xl:min-h-[min(58.8vw,1018px)]`}>
        <div className="-mt-[14%] flex flex-col gap-4 sm:-mt-[8%] lg:mt-0 lg:max-w-[min(52vw,780px)] lg:gap-6 lg:pt-[8vw] xl:pt-[min(16.5vw,290px)]">
          <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-0.8px] sm:text-5xl lg:text-[3.3vw] xl:text-[min(3.7vw,68px)]">
            <span className="block bg-gradient-orbit-terang bg-clip-text text-transparent lg:whitespace-nowrap">{HERO.titleTop}</span>
            <span className="block bg-gradient-sun-x bg-clip-text text-transparent lg:whitespace-nowrap">{HERO.titleBottom}</span>
          </h1>
          <p className="max-w-[600px] text-base leading-[1.6] text-night-sub lg:max-w-[42vw] lg:text-lg xl:max-w-[600px] xl:text-xl">{HERO.subtitle}</p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-2">
            {loggedIn ? (
              <PillLink to={portalTo} variant="sun" className="h-12 lg:h-[52px]">
                {HERO.primaryCtaLoggedIn}
              </PillLink>
            ) : (
              <PillExternal href={whatsappLink("sekolah")} variant="sun" className="h-12 lg:h-[52px]">
                {HERO.primaryCta}
              </PillExternal>
            )}
            <PillButton
              variant="outline"
              icon="none"
              onClick={() => scrollTo("masalah")}
              className="h-12 border-white/40 bg-white/10 text-white hover:bg-white/20 lg:h-[52px]"
            >
              {HERO.secondaryCta}
            </PillButton>
          </div>
        </div>

        <img
          src={sekolah}
          alt={HERO.schoolAlt}
          width={850}
          height={734}
          className="relative mt-10 w-[min(70%,320px)] self-center lg:ml-[12%] lg:mt-auto lg:w-[16vw] lg:self-start lg:pt-8 xl:w-[min(22vw,420px)]"
        />
      </div>
    </section>
  );
}
