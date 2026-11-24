import type { CSSProperties } from "react";
import { Compass, Footprints, Sparkles, type LucideIcon } from "lucide-react";
import { TENTANG_HERO } from "@/content/tentangKami";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, Starfield, type MeteorSpec } from "@/components/landing/motion/Sky";
import Cloud from "@/components/landing/motion/Cloud";
import MascotFigure from "@/components/mascot/MascotFigure";
import { PillButton } from "@/components/landing/primitives";
import pohonKanan from "@/assets/publik/sekolah/sekolah-pohon-kanan.svg";
import pohonKecil from "@/assets/publik/sekolah/sekolah-pohon-kecil.svg";
import pohonKiri from "@/assets/publik/sekolah/sekolah-pohon-kiri.svg";
import roket from "@/assets/publik/sekolah/sekolah-roket.svg";
import api from "@/assets/publik/sekolah/sekolah-roket-api.svg";
import tanah from "@/assets/publik/sekolah/sekolah-tanah.svg";

/** Posisi dalam persen panggung 1730 × 836 (sama dengan hero Untuk Sekolah). */
const at = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / 1730) * 100}%`,
  top: `${((y - 96) / 836) * 100}%`,
  width: `${(w / 1730) * 100}%`,
});

const METEORS: MeteorSpec[] = [
  { left: 35, top: 4, duration: 8, delay: -1, length: 200 },
  { left: 68, top: 0, duration: 10, delay: -6, length: 240 },
  { left: 92, top: 16, duration: 12, delay: -3.5, length: 180 },
];

const IMG = "pointer-events-none absolute h-auto max-w-none select-none";

/** Label perjalanan di sekitar maskot: posisi (persen kotak roket) dan ikon. */
const STEP_STYLE: { pos: string; Icon: LucideIcon; tone: string; delay: string }[] = [
  { pos: "left-[-6%] top-[2%]", Icon: Sparkles, tone: "bg-sun-1/20 text-sun-2", delay: "[animation-delay:-0.5s]" },
  { pos: "right-[-4%] top-[44%]", Icon: Compass, tone: "bg-orbit-1/25 text-orbit-2", delay: "[animation-delay:-2s]" },
  { pos: "left-[2%] top-[66%]", Icon: Footprints, tone: "bg-tint-green-bg/20 text-night-positive", delay: "[animation-delay:-3.5s]" },
];

/** Ilustrasi: pohon, awan, tanah, dan maskot di atas roket dengan tiga label perjalanan. */
function HeroArt({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-[1730/836] ${className}`}>
      <Cloud className="opacity-80" style={at(1560, 150, 420)} />
      <Cloud className="opacity-70 [animation-direction:alternate-reverse] [animation-duration:16s]" style={at(1180, 760, 420)} />
      <Cloud className="opacity-70 [animation-duration:20s]" style={at(160, 760, 380)} />
      <img src={pohonKanan} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang`} style={at(1568, 278, 224)} />

      {/* Maskot dan roket bergerak bersama; api roket berkedip. Roket dan api berbagi viewBox yang sama. */}
      <div className="absolute aspect-[545/535] motion-safe:animate-ob-melayang" style={at(1105, 300, 545)}>
        <img src={api} alt="" className="absolute inset-0 h-full w-full origin-[76%_76%] motion-safe:animate-ob-api" />
        <img src={roket} alt="" className="absolute inset-0 h-full w-full" />
        <svg viewBox="148 138 344 248" className="absolute left-[22%] top-[2%] w-[60%] overflow-visible">
          <MascotFigure tilt={-12} lookX={4} lookY={-2} animated={false} ring="gradient" />
        </svg>
        {TENTANG_HERO.steps.map((label, i) => {
          const s = STEP_STYLE[i];
          return (
            <span
              key={label}
              className={`absolute flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-space-1/85 px-2.5 py-1.5 text-[clamp(10px,0.85vw,14px)] font-semibold text-white shadow-card backdrop-blur-sm motion-safe:animate-ob-melayang ${s.pos} ${s.delay}`}
            >
              <span className={`flex h-[1.9em] w-[1.9em] items-center justify-center rounded-lg ${s.tone}`}>
                <s.Icon className="h-[1.1em] w-[1.1em]" strokeWidth={2.2} />
              </span>
              {label}
            </span>
          );
        })}
      </div>

      <img src={pohonKecil} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang [animation-delay:-2s]`} style={at(482, 678, 275)} />
      <img src={pohonKiri} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang [animation-delay:-3.5s] [animation-duration:6s]`} style={at(28, 409, 433)} />
      <img src={tanah} alt="" className={IMG} style={at(0, 804, 1730)} />
    </div>
  );
}

/** Hero Tentang Kami (docs/design/publik/TentangKami-Desktop.webp). */
export default function TentangHero() {
  const ref = usePauseOffscreen<HTMLElement>();
  const H = TENTANG_HERO;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-sekolah-hero lg:aspect-[1730/836] lg:max-h-[880px] lg:min-h-[520px]">
      <Starfield count={70} seed={23} maxTop={80} />
      <Meteors meteors={METEORS} />

      <HeroArt className="hidden lg:block lg:bottom-0 lg:right-0 lg:h-full" />

      <div className="relative px-5 pb-6 pt-12 sm:px-8 sm:pt-16 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[56%] lg:flex-col lg:justify-center lg:px-0 lg:pb-[8%] lg:pl-[10%] lg:pt-0">
        <h1 className="text-[34px] font-bold leading-[1.2] tracking-[-0.6px] sm:text-[46px] lg:text-[clamp(38px,3.9vw,68px)]">
          <span className="block text-white">{H.titleTop}</span>
          <span className="block text-sun-1">{H.titleAccent}</span>
        </h1>
        <p className="mt-4 max-w-[620px] text-base leading-[1.65] text-night-sub lg:mt-5 lg:max-w-[min(40vw,640px)] lg:text-[clamp(15px,1.15vw,19px)]">
          {H.body.before}
          <strong className="font-bold text-white">{H.body.brand}</strong>
          {H.body.after}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8">
          <PillButton variant="sun" icon="none" onClick={() => scrollTo("cerita")} className="h-12 px-7 lg:h-[52px]">
            {H.primary}
          </PillButton>
          <PillButton variant="outline" icon="none" onClick={() => scrollTo("misi")} className="h-12 border-white/30 bg-white/10 px-7 text-white hover:bg-white/20 lg:h-[52px]">
            {H.secondary}
          </PillButton>
        </div>
      </div>

      {/* HP dan tablet: potongan kanan ilustrasi (maskot di roket) di bawah teks. */}
      <div className="relative aspect-[10/9] w-full overflow-hidden sm:aspect-[16/10] lg:hidden">
        <HeroArt className="bottom-0 right-[-6%] w-[210%] sm:right-[-4%] sm:w-[150%]" />
      </div>
    </section>
  );
}
