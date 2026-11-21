import type { CSSProperties } from "react";
import { SEKOLAH_HERO } from "@/content/untukSekolah";
import { whatsappLink } from "@/config/brand";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, Starfield, type MeteorSpec } from "@/components/landing/motion/Sky";
import { PillExternal } from "@/components/landing/primitives";
import Siluet from "@/components/landing/motion/Siluet";
import bimasakti from "@/assets/publik/sekolah/sekolah-bimasakti.svg";
import awan from "@/assets/publik/sekolah/awan-abu.svg";
import pohonKanan from "@/assets/publik/sekolah/sekolah-pohon-kanan.svg";
import pohonKecil from "@/assets/publik/sekolah/sekolah-pohon-kecil.svg";
import pohonKiri from "@/assets/publik/sekolah/sekolah-pohon-kiri.svg";
import roket from "@/assets/publik/sekolah/sekolah-roket.svg";
import api from "@/assets/publik/sekolah/sekolah-roket-api.svg";
import siswa from "@/assets/publik/sekolah/sekolah-siswa.svg";
import maskotMini from "@/assets/publik/sekolah/sekolah-maskot-mini.svg";
import tanah from "@/assets/publik/sekolah/sekolah-tanah.svg";

/**
 * Posisi lapisan dalam persen "panggung" berukuran desain 1730 × 836
 * (hero docs/design/publik/UntukSekolah-Desktop.jpg, y 96–932).
 * x/1730, (y − 96)/836, lebar/1730.
 */
const at = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / 1730) * 100}%`,
  top: `${((y - 96) / 836) * 100}%`,
  width: `${(w / 1730) * 100}%`,
});

const METEORS: MeteorSpec[] = [
  { left: 30, top: 6, duration: 8, delay: -1, length: 200 },
  { left: 62, top: 2, duration: 10, delay: -6, length: 240 },
  { left: 88, top: 18, duration: 12, delay: -3.5, length: 180 },
  { left: 75, top: 40, duration: 14, delay: -10, length: 140 },
];

const IMG = "pointer-events-none absolute h-auto max-w-none select-none";

/** Ilustrasi hero: langit, bimasakti, bulan, bukit, awan, pohon (siluet halus), dan siswa di atas roket. */
function HeroArt({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-[1730/836] ${className}`}>
      <img src={bimasakti} alt="" className={`${IMG} motion-safe:animate-ob-kilau`} style={at(603, 180, 1127)} />

      {/* Bulan dan dua lapis bukit halus. */}
      <span
        className="absolute aspect-square rounded-full bg-bulan shadow-[0_0_40px_14px_rgba(255,231,163,0.35)] motion-safe:animate-ob-denyut"
        style={{ ...at(1205, 128, 62) }}
      />
      <svg viewBox="0 0 1730 300" preserveAspectRatio="none" className="absolute w-full" style={{ left: 0, top: `${((600 - 96) / 836) * 100}%`, height: "38%" }}>
        <path d="M0 140 C180 90 300 60 460 80 C640 102 720 170 900 160 C1080 150 1180 90 1360 100 C1520 108 1640 150 1730 160 V300 H0Z" className="fill-gunung-tengah" opacity="0.5" />
        <path d="M0 210 C200 170 360 150 540 175 C720 200 820 235 1000 225 C1180 215 1300 185 1480 195 C1600 202 1680 215 1730 220 V300 H0Z" className="fill-gunung-dekat" opacity="0.85" />
      </svg>

      {/* Awan dan pohon dari desain: bentuk dan posisi sama, digambar sebagai siluet bergradasi. */}
      <Siluet src={awan} fill="bg-awan-malam" className="motion-safe:animate-ob-awan" style={at(45, 693, 719)} />
      <Siluet src={awan} fill="bg-awan-malam" className="motion-safe:animate-ob-awan [animation-direction:alternate-reverse] [animation-duration:18s]" style={at(1398, 157, 719)} />
      <Siluet src={awan} fill="bg-awan-malam" className="motion-safe:animate-ob-awan [animation-duration:20s]" style={at(982, 775, 719)} />
      <Siluet src={pohonKanan} fill="bg-pohon-malam" className="origin-bottom motion-safe:animate-ob-goyang" style={at(1568, 278, 224)} />

      {/* Siswa dan roket bergerak bersama; api roket berkedip. Ketiganya berbagi viewBox yang sama. */}
      <div className="absolute aspect-[545/535] motion-safe:animate-ob-melayang" style={at(1135, 345, 545)}>
        <img src={api} alt="" className="absolute inset-0 h-full w-full origin-[76%_76%] motion-safe:animate-ob-api" />
        <img src={roket} alt="" className="absolute inset-0 h-full w-full" />
        <img src={siswa} alt="" className="absolute inset-0 h-full w-full" />
      </div>
      <img src={maskotMini} alt="" className={IMG} style={at(1570, 411, 90)} />

      <Siluet src={pohonKecil} fill="bg-pohon-malam" className="origin-bottom motion-safe:animate-ob-goyang [animation-delay:-2s]" style={at(482, 678, 275)} />
      <Siluet src={pohonKiri} fill="bg-pohon-malam" className="origin-bottom motion-safe:animate-ob-goyang [animation-delay:-3.5s] [animation-duration:6s]" style={at(28, 409, 433)} />
      <img src={tanah} alt="" className={IMG} style={at(0, 804, 1730)} />
    </div>
  );
}

/** Hero Untuk Sekolah (desain docs/design/publik/UntukSekolah-Desktop.jpg). */
export default function SekolahHero() {
  const ref = usePauseOffscreen<HTMLElement>();
  const H = SEKOLAH_HERO;

  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-sekolah-hero lg:aspect-[1730/836] lg:max-h-[880px] lg:min-h-[520px]">
      <Starfield count={70} seed={11} maxTop={80} />
      <Meteors meteors={METEORS} />

      {/* Desktop: ilustrasi memenuhi hero (menempel kanan kalau hero dibatasi tingginya). */}
      <HeroArt className="hidden lg:block lg:bottom-0 lg:right-0 lg:h-full" />

      <div className="relative px-5 pb-6 pt-12 sm:px-8 sm:pt-16 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[60%] lg:flex-col lg:justify-center lg:px-0 lg:pb-[6%] lg:pl-[10%] lg:pt-0">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.6px] text-white sm:text-[42px] lg:text-[clamp(34px,3.6vw,64px)] lg:leading-[1.25]">
          <span className="lg:block lg:whitespace-nowrap">{H.titleTop} </span>
          {H.titleLead}
          <span className="text-sun-1">{H.titleAccent}</span>
        </h1>
        <p className="mt-4 max-w-[620px] text-base leading-[1.65] text-night-sub lg:mt-5 lg:max-w-[min(36vw,620px)] lg:text-[clamp(15px,1.15vw,19px)]">
          {H.body.before}
          <strong className="font-bold text-white">{H.body.brand}</strong>
          {H.body.after}
        </p>
        <PillExternal href={whatsappLink("sekolah")} variant="sun" icon="none" className="mt-6 min-h-12 w-full px-6 py-3 text-center text-[15px] leading-snug sm:w-auto sm:self-start lg:mt-8 lg:h-[56px] lg:px-9 lg:text-base">
          {H.cta}
        </PillExternal>
      </div>

      {/* HP dan tablet: potongan kanan ilustrasi (siswa di roket) di bawah teks. */}
      <div className="relative aspect-[10/9] w-full overflow-hidden sm:aspect-[16/10] lg:hidden">
        <HeroArt className="bottom-0 right-[-6%] w-[210%] sm:right-[-4%] sm:w-[150%]" />
      </div>
    </section>
  );
}
