import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { FINAL_CTA } from "@/content/landing";
import { whatsappLink } from "@/config/brand";
import { makeStars } from "@/lib/stars";
import MascotFigure from "@/components/mascot/MascotFigure";
import SiteFooter from "../SiteFooter";
import { CONTAINER, ExternalLink, pillClasses } from "../primitives";

const DOTS = [
  [14, 134],
  [70, 86],
  [220, 73],
  [340, 120],
  [260, 182],
];

/** Ajakan penutup + footer, di atas latar navy berbintang. */
export default function FinalCtaSection() {
  const stars = useMemo(() => makeStars(56, 29), []);

  // pb ekstra di HP supaya baris terakhir footer tidak tertutup tombol konsultasi.
  return (
    <section className="on-dark relative overflow-hidden bg-night-glow pb-32 pt-[72px] lg:pb-14 lg:pt-[110px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white motion-safe:animate-ob-twinkle"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      <div className={`${CONTAINER} relative flex flex-col gap-[72px] lg:gap-[110px]`}>
        <div className="flex max-w-[780px] flex-col items-center gap-3.5 self-center text-center lg:gap-[18px]">
          <svg viewBox="0 0 360 250" aria-hidden="true" className="w-[260px] overflow-visible lg:w-[360px]">
            <g transform="rotate(-12 180 130)">
              <ellipse cx="180" cy="130" rx="168" ry="58" fill="none" strokeWidth="1.6" className="stroke-mascot-orbit-soft [stroke-opacity:0.5]" />
              <ellipse
                cx="180"
                cy="130"
                rx="168"
                ry="58"
                fill="none"
                strokeWidth="2"
                strokeDasharray="1 23"
                strokeLinecap="round"
                className="stroke-white [stroke-opacity:0.55] motion-safe:animate-ob-flow"
              />
              {DOTS.map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6.5" className="fill-sun-1" />
              ))}
            </g>
            <g transform="translate(180 128) scale(0.52) translate(-320 -270)">
              {/* Seperti desain: maskot menatap ke atas, ke arah judul. */}
              <MascotFigure ring="solid" lookX={2} lookY={-6} />
            </g>
          </svg>
          <h2 className="text-balance text-[32px] font-bold leading-[1.15] tracking-[-0.6px] text-night-light lg:text-[52px] lg:leading-[1.12] lg:tracking-[-1px]">
            {FINAL_CTA.title}
          </h2>
          <p className="text-[17px] font-medium leading-[1.6] text-night-sub lg:text-xl">{FINAL_CTA.subtitle}</p>
          <span className="text-sm font-semibold text-sun-2 lg:text-[15px]">{FINAL_CTA.hashtag}</span>
          <ExternalLink href={whatsappLink("sekolah")} className={pillClasses("sun", "mt-3.5 h-[54px] text-center lg:h-[58px] lg:px-7 lg:text-[17px]")}>
            {FINAL_CTA.cta}
            <ArrowRight size={20} strokeWidth={2.2} aria-hidden="true" />
          </ExternalLink>
        </div>

        <SiteFooter />
      </div>
    </section>
  );
}
