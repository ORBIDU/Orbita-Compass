import { BookOpenCheck, Compass, Footprints, HandHeart, Route, Scale, Search, Sparkles, UserRoundCheck, type LucideIcon } from "lucide-react";
import { TENTANG_ALASAN, TENTANG_PERJALANAN, TENTANG_PRINSIP } from "@/content/tentangKami";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import MascotFigure from "@/components/mascot/MascotFigure";
import { CONTAINER } from "@/components/landing/primitives";
import Reveal from "@/components/landing/motion/Reveal";

const KICKER = "text-sm font-semibold uppercase tracking-[0.14em] text-orbit-1";
const H2 = "mt-3 text-balance text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-space-2 lg:text-[42px]";

/** "Kenapa ORBIDU ada": teks di kiri, maskot dengan orbit berputar di kanan. */
export function AlasanSection() {
  const ref = usePauseOffscreen<HTMLElement>();
  const A = TENTANG_ALASAN;
  return (
    <section ref={ref} className="bg-white py-16 lg:py-28">
      <div className={`${CONTAINER} grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20 xl:max-w-[1360px]`}>
        <Reveal>
          <p className={KICKER}>{A.kicker}</p>
          <h2 className={H2}>{A.title}</h2>
          <div className="mt-6 flex flex-col gap-4 text-base leading-[1.75] text-prose lg:text-lg">
            {A.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
        <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[420px]">
          {/* Orbit berputar pelan dengan dua planet kecil. */}
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
            <circle cx="200" cy="200" r="180" fill="none" className="stroke-rim" strokeWidth="2" strokeDasharray="8 12" />
            <circle cx="200" cy="200" r="130" fill="none" className="stroke-rim-soft" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 motion-safe:animate-[spin_40s_linear_infinite]">
            <span className="absolute left-1/2 top-[5%] h-6 w-6 -translate-x-1/2 rounded-full bg-gradient-sun shadow-sun" />
          </div>
          <div className="absolute inset-[17.5%] motion-safe:animate-[spin_26s_linear_infinite_reverse]">
            <span className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-orbit-2" />
          </div>
          <svg viewBox="130 120 380 250" className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 overflow-visible">
            <MascotFigure />
          </svg>
        </div>
      </div>
    </section>
  );
}

const PRINSIP_ICON: Record<(typeof TENTANG_PRINSIP.items)[number]["icon"], LucideIcon> = {
  keputusan: UserRoundCheck,
  jujur: Scale,
  langkah: Footprints,
  bersama: HandHeart,
};

/** Empat prinsip dalam kartu. */
export function PrinsipSection() {
  const P = TENTANG_PRINSIP;
  return (
    <section className="bg-surface-soft py-16 lg:py-24">
      <div className={`${CONTAINER} xl:max-w-[1360px]`}>
        <div className="max-w-[640px]">
          <p className={KICKER}>{P.kicker}</p>
          <h2 className={H2}>{P.title}</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {P.items.map((item, i) => {
            const Icon = PRINSIP_ICON[item.icon];
            return (
              <Reveal key={item.title} delay={i * 100} className="flex flex-col rounded-card-lg bg-white p-6 shadow-card ring-1 ring-rim-faint lg:p-7">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cloud text-orbit-1">
                  <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-space-2 lg:text-xl">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.65] text-prose">{item.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const LANGKAH_ICON: Record<(typeof TENTANG_PERJALANAN.steps)[number]["icon"], LucideIcon> = {
  kenali: Sparkles,
  arah: Compass,
  jelajah: Search,
  rencana: Route,
  siap: BookOpenCheck,
};

/** Perjalanan lima langkah di sepanjang garis orbit yang mengalir. */
export function PerjalananSection() {
  const ref = usePauseOffscreen<HTMLElement>();
  const J = TENTANG_PERJALANAN;
  return (
    <section ref={ref} className="bg-white py-16 lg:py-28">
      <div className={`${CONTAINER} xl:max-w-[1360px]`}>
        <div className="mx-auto max-w-[680px] text-center">
          <p className={KICKER}>{J.kicker}</p>
          <h2 className={H2}>{J.title}</h2>
        </div>
        <ol className="relative mt-12 grid gap-8 lg:mt-16 lg:grid-cols-5 lg:gap-6">
          {/* Garis putus-putus yang mengalir: vertikal (HP) atau horizontal (desktop). */}
          <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-[2px] bg-garis-y motion-safe:animate-ob-garis-y lg:hidden" />
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[27px] hidden h-[2px] bg-garis-x motion-safe:animate-ob-garis-x lg:block" />
          {J.steps.map((step, i) => {
            const Icon = LANGKAH_ICON[step.icon];
            return (
              <Reveal as="li" key={step.title} delay={i * 110} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-4 lg:text-center">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-orbit text-white shadow-cta">
                  <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-space-2">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-prose">{step.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
