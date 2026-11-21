import type { CSSProperties } from "react";
import { FAQ_HERO } from "@/content/faq";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, StarShape } from "@/components/landing/motion/Sky";
import Siluet from "@/components/landing/motion/Siluet";
import bukitKiri from "@/assets/publik/faq/faq-bukit-kiri.svg";
import bukitKanan from "@/assets/publik/faq/faq-bukit-kanan.svg";
import bukitBawah from "@/assets/publik/faq/faq-bukit-bawah.svg";
import bulan from "@/assets/publik/faq/faq-bulan.svg";
import awan1 from "@/assets/publik/faq/faq-awan-1.svg";
import awan2 from "@/assets/publik/faq/faq-awan-2.svg";
import awan3 from "@/assets/publik/faq/faq-awan-3.svg";
import awan4 from "@/assets/publik/faq/faq-awan-4.svg";
import awan5 from "@/assets/publik/faq/faq-awan-5.svg";
import pohonGelap from "@/assets/publik/faq/faq-pohon-gelap.svg";
import pohonA from "@/assets/publik/faq/faq-pohon-a.svg";
import pohonB from "@/assets/publik/faq/faq-pohon-b.svg";
import pohonC from "@/assets/publik/faq/faq-pohon-c.svg";

/** Posisi dalam persen "panggung" 1731 × 799 (hero docs/design/publik/FAQ-Desktop.jpg). */
const at = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / 1731) * 100}%`,
  top: `${(y / 799) * 100}%`,
  width: `${(w / 1731) * 100}%`,
});

const SWAY = "origin-bottom motion-safe:animate-ob-goyang";

/** Bintang dari desain (x, y, lebar, jeda animasi). */
const STARS: [number, number, number, string][] = [
  [1633, 697, 54, "0s"],
  [506, 217, 34, "-1.1s"],
  [126, 181, 34, "-2.3s"],
  [160, 672, 34, "-0.6s"],
  [1460, 156, 34, "-1.5s"],
  [1208, 664, 34, "-1.8s"],
  [1096, 420, 21, "-2.9s"],
];

/**
 * Ilustrasi malam dari desain: bukit, bulan, awan, pohon, bintang, dan bola tanda tanya.
 * Bentuk dan posisi sama dengan desain; bukit, awan, dan pohon digambar sebagai siluet bergradasi.
 */
function HeroArt({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-[1731/799] ${className}`}>
      <Siluet src={bukitKiri} fill="bg-bukit-malam" style={at(0, 197, 440)} />
      <Siluet src={bukitKanan} fill="bg-bukit-malam" style={at(519, 118, 1212)} />
      <img src={bulan} alt="" className="absolute h-auto max-w-none select-none motion-safe:animate-ob-denyut" style={at(579.5, 75.4, 267.5)} />
      <Siluet src={awan1} fill="bg-awan-malam" className="motion-safe:animate-ob-awan" style={at(94, 237, 715)} />
      <Siluet src={awan2} fill="bg-awan-malam" className="motion-safe:animate-ob-awan [animation-direction:alternate-reverse] [animation-duration:16s]" style={at(-29, 301, 715)} />
      <Siluet src={awan3} fill="bg-awan-malam" className="motion-safe:animate-ob-awan [animation-duration:18s]" style={at(171, 498, 715)} />
      <Siluet src={pohonGelap} fill="bg-pohon-malam-gelap" className={`${SWAY} [animation-duration:7s]`} style={at(278, 407, 410)} />
      <Siluet src={bukitBawah} fill="bg-bukit-malam-dekat" style={at(0, 600, 1731)} />
      <Siluet src={pohonA} fill="bg-pohon-malam" className={`${SWAY} [animation-delay:-1.2s]`} style={at(639, 372, 163)} />
      <Siluet src={pohonB} fill="bg-pohon-malam" className={`${SWAY} [animation-delay:-2.6s] [animation-duration:6s]`} style={at(122, 422, 98)} />
      <Siluet src={pohonC} fill="bg-pohon-malam" className={`${SWAY} [animation-delay:-3.4s]`} style={at(-15, 459, 127)} />
      <Siluet src={awan4} fill="bg-awan-malam" className="motion-safe:animate-ob-awan [animation-duration:20s]" style={at(1059, 684, 715)} />
      <Siluet src={awan5} fill="bg-awan-malam" className="motion-safe:animate-ob-awan [animation-direction:alternate-reverse]" style={at(-215, 633, 715)} />
      {STARS.map(([x, y, w, delay]) => (
        <StarShape key={`${x}-${y}`} className="absolute text-white/60 motion-safe:animate-ob-kelip" style={{ ...at(x, y, w), animationDelay: delay }} />
      ))}

      {/* Bola tanda tanya */}
      <div className="absolute aspect-square motion-safe:animate-ob-melayang" style={at(1350, 455, 292)}>
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-orbit text-[clamp(56px,8vw,150px)] font-bold leading-none text-white shadow-[0_18px_60px_rgba(9,101,250,0.55)]">
          ?
        </div>
      </div>
    </div>
  );
}

/** Hero FAQ (docs/design/publik/FAQ-Desktop.jpg): langit malam biru dengan ilustrasi desain dan panel kaca berisi judul. */
export default function FaqHero() {
  const ref = usePauseOffscreen<HTMLElement>();

  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-faq-hero pb-[60vw] sm:pb-[44vw] lg:aspect-[1731/799] lg:max-h-[640px] lg:min-h-[480px] lg:pb-0">
      <Meteors
        meteors={[
          { left: 60, top: -4, duration: 10, delay: -1, length: 200 },
          { left: 92, top: 10, duration: 13, delay: -7, length: 170 },
        ]}
      />
      {/* HP: ilustrasi dilebarkan dan digeser supaya pohon depan dan bola tanda tanya terlihat. */}
      <HeroArt className="bottom-0 left-0 w-[160%] -translate-x-[37.5%] sm:w-[120%] sm:-translate-x-[16%] lg:w-full lg:translate-x-0" />

      <div className="relative px-5 pt-12 sm:px-8 sm:pt-16 lg:absolute lg:inset-0 lg:flex lg:items-center lg:px-[7%] lg:pb-[10%] lg:pt-0">
        <div className="lg:w-[min(78%,1040px)] lg:rounded-[28px] lg:border lg:border-white/20 lg:bg-white/10 lg:px-[5%] lg:py-[3.2%] lg:backdrop-blur-sm">
          <h1 className="text-balance text-[32px] font-bold leading-[1.15] tracking-[-0.6px] text-white sm:text-[44px] lg:text-[clamp(40px,4vw,68px)]">{FAQ_HERO.title}</h1>
          <p className="mt-3 max-w-[640px] text-base leading-[1.6] text-night-sub lg:mt-4 lg:text-[clamp(16px,1.3vw,22px)]">{FAQ_HERO.body}</p>
        </div>
      </div>
    </section>
  );
}
