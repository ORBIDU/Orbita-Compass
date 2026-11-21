import { HERO } from "@/content/landing";
import { whatsappLink } from "@/config/brand";
import MascotSlot from "@/components/mascot/MascotSlot";
import angkasa from "@/assets/publik/hero-angkasa.svg";
import sekolah from "@/assets/publik/hero-sekolah.webp";
import { CONTAINER, PillButton, PillExternal, PillLink } from "../primitives";
import { useLandingNav } from "../useLandingNav";

/**
 * Hero beranda (docs/design/publik/Beranda-Desktop.jpg).
 * Panel angkasa (blob navy, planet, dua meteor yang jatuh berulang) adalah satu
 * SVG dari desain; animasi meteornya ada di dalam SVG itu dan mati sendiri
 * kalau prefers-reduced-motion. Maskot di atasnya memakai MascotSlot.
 * Desktop: panel di kanan, tinggi hero mengikuti rasio panel (1142:1018 dari 66% lebar;
 * 60% di lebar 1024–1279 supaya teks tidak menabrak blob).
 */
export default function HeroSection() {
  const { loggedIn, portalTo, scrollTo } = useLandingNav();

  return (
    <section className="relative overflow-hidden bg-white lg:min-h-[53.5vw] xl:min-h-[min(58.8vw,1018px)]">
      {/* Panel angkasa. Kotak dalam selalu berasio desain (posisi maskot dalam persen tetap pas) dan
          menempel di kiri: kalau hero lebih tinggi, yang terpotong sisi kanan, tepi blob tidak mendekati teks. */}
      <div className="relative aspect-[1142/1018] w-full sm:ml-auto sm:w-[85%] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[60%] lg:overflow-hidden xl:w-[66%]">
        <div className="absolute left-0 top-0 aspect-[1142/1018] h-full">
          <img src={angkasa} alt="" className="absolute inset-0 h-full w-full" />
          {/* Kotak MascotSlot dihitung dari posisi maskot di desain (relatif ke panel). */}
          <div className="absolute left-[48.2%] top-[27.6%] h-[26.3%] w-[35.6%]">
            <MascotSlot className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} relative flex flex-col lg:min-h-[53.5vw] xl:min-h-[min(58.8vw,1018px)]`}>
        <div className="flex flex-col gap-4 pt-4 lg:max-w-[min(52vw,780px)] lg:gap-6 lg:pt-[8vw] xl:pt-[min(16.5vw,290px)]">
          <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-0.8px] sm:text-5xl lg:text-[3.3vw] xl:text-[min(3.7vw,68px)]">
            <span className="block bg-gradient-orbit-x bg-clip-text text-transparent lg:whitespace-nowrap">{HERO.titleTop}</span>
            <span className="block bg-gradient-sun-x bg-clip-text text-transparent lg:whitespace-nowrap">{HERO.titleBottom}</span>
          </h1>
          <p className="max-w-[600px] text-base leading-[1.6] text-space-2 lg:max-w-[42vw] lg:text-lg xl:max-w-[600px] xl:text-xl">{HERO.subtitle}</p>
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
            <PillButton variant="outline" icon="none" onClick={() => scrollTo("masalah")} className="h-12 lg:h-[52px]">
              {HERO.secondaryCta}
            </PillButton>
          </div>
        </div>

        <img
          src={sekolah}
          alt={HERO.schoolAlt}
          width={850}
          height={734}
          className="mt-10 w-[min(78%,360px)] self-center lg:ml-[12%] lg:mt-auto lg:w-[16vw] lg:self-start lg:pt-8 xl:w-[min(22vw,420px)]"
        />
      </div>
    </section>
  );
}
