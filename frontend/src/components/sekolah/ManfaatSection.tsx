import { BookOpen, CloudLightning, PenTool, UserRound, type LucideIcon } from "lucide-react";
import { SEKOLAH_MANFAAT } from "@/content/untukSekolah";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import MascotFigure from "@/components/mascot/MascotFigure";
import { CONTAINER } from "@/components/landing/primitives";
import Reveal from "@/components/landing/motion/Reveal";
import { StarShape } from "@/components/landing/motion/Sky";
import gelombangAtas from "@/assets/publik/sekolah/gelombang-navy-atas.svg";
import gelombangBawah from "@/assets/publik/sekolah/gelombang-putih-bawah.svg";

const ICON: Record<(typeof SEKOLAH_MANFAAT.cards)[number]["icon"], LucideIcon> = {
  personal: UserRound,
  terintegrasi: BookOpen,
  terarah: CloudLightning,
  terukur: PenTool,
};

/** Bintang kuning kecil di latar (posisi persen seperti desain). */
const STARS = [
  { left: "88%", top: "12%", size: 22, delay: "0s" },
  { left: "5.5%", top: "20%", size: 16, delay: "-1.2s" },
  { left: "97%", top: "70%", size: 20, delay: "-2.1s" },
  { left: "25%", top: "78%", size: 20, delay: "-0.6s" },
  { left: "4%", top: "84%", size: 15, delay: "-2.8s" },
  { left: "51%", top: "86%", size: 14, delay: "-1.7s" },
];

/** "Apa yang Didapat Sekolah?": latar navy bergelombang, empat kartu kaca. */
export default function ManfaatSection() {
  const ref = usePauseOffscreen<HTMLElement>();
  const M = SEKOLAH_MANFAAT;

  return (
    <section ref={ref} aria-labelledby="sekolah-manfaat" className="on-dark relative">
      <img src={gelombangAtas} alt="" aria-hidden="true" className="block h-auto w-full" />
      <div className="relative -mt-px bg-sekolah-navy pb-24 pt-6 lg:pb-40 lg:pt-10">
        {STARS.map((s) => (
          <StarShape
            key={s.left + s.top}
            className="absolute text-sekolah-bintang motion-safe:animate-ob-kelip"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
          />
        ))}
        <div className={`${CONTAINER} relative flex flex-col items-center xl:max-w-[1360px]`}>
          <h2 id="sekolah-manfaat" className="text-center text-[28px] font-bold leading-tight text-white lg:text-[44px]">
            {M.titleLead}
            <span className="text-sun-2">{M.titleAccent}</span>
          </h2>
          <div className="mt-10 grid w-full gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
            {M.cards.map((card, i) => {
              const Icon = ICON[card.icon];
              return (
                <Reveal
                  key={card.title}
                  delay={i * 100}
                  className="rounded-2xl border border-white/25 bg-kaca-navy p-6 backdrop-blur-sm lg:min-h-[346px] lg:p-7"
                >
                  <span className="flex h-[70px] w-[70px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sun-1">
                    <Icon size={32} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-white lg:text-2xl">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-night-sub lg:text-base">{card.body}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
      <img src={gelombangBawah} alt="" aria-hidden="true" className="relative -mt-[8.8%] block h-auto w-full" />
      {/* Maskot di pojok kanan bawah, menumpang di gelombang (seperti desain). */}
      <svg
        viewBox="130 120 380 250"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[1%] right-[8%] w-[110px] overflow-visible sm:w-[150px] lg:w-[200px]"
      >
        <MascotFigure tilt={-8} />
      </svg>
    </section>
  );
}
