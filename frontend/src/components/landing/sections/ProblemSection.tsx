import { ArrowDown } from "lucide-react";
import { PROBLEM } from "@/content/landing";
import { Accent, CONTAINER, H2, SECTION_Y } from "../primitives";
import { useLandingNav } from "../useLandingNav";

type Tone = (typeof PROBLEM.bubbles)[number]["tone"];

const TONE: Record<Tone, string> = {
  blue: "bg-surface-bubble text-space-1",
  peach: "bg-surface-peach text-space-1",
  outline: "border-[1.5px] border-rim bg-white text-prose",
};

// Posisi gelembung di layar lebar (≥1280px), persis seperti desain 1200×470.
const DESKTOP_LAYOUT = [
  { left: 20, top: 20, maxW: 420, rotate: -1.5, corner: "rounded-[24px_24px_24px_8px]" },
  { left: 740, top: 0, maxW: 420, rotate: 1.5, corner: "rounded-[24px_24px_8px_24px]" },
  { left: 390, top: 150, maxW: 420, rotate: 0, corner: "rounded-[24px]" },
  { left: 0, top: 270, maxW: 470, rotate: 1, corner: "rounded-[24px_24px_24px_8px]" },
  { left: 790, top: 250, maxW: 400, rotate: -1, corner: "rounded-[24px_24px_8px_24px]" },
  { left: 700, top: 370, maxW: undefined, rotate: 2, corner: "rounded-[22px]" },
];

// Garis putus-putus yang menghubungkan pertanyaan ke titik orbit di bawah.
const LINES = [
  "M220 70 Q400 300 600 440",
  "M930 50 Q800 300 600 440",
  "M600 200 Q600 330 600 440",
  "M230 330 Q420 420 600 440",
  "M960 300 Q780 420 600 440",
];

export default function ProblemSection() {
  const { scrollTo } = useLandingNav();

  return (
    <section id="masalah" className={`scroll-mt-16 lg:scroll-mt-20 bg-white ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col items-center gap-7 lg:gap-14`}>
        <H2 className="text-center">{PROBLEM.title}</H2>

        {/* HP & tablet: gelembung bergantian kiri-kanan */}
        <div className="flex w-full max-w-[560px] flex-col gap-3 xl:hidden">
          {PROBLEM.bubbles.map((b, i) => (
            <p
              key={i}
              className={`max-w-[300px] px-[18px] py-3 text-[15px] font-medium leading-normal sm:max-w-[360px] ${TONE[b.tone]} ${
                i % 2 === 0 ? "self-start" : "self-end"
              } ${
                b.tone === "outline"
                  ? "rounded-[20px]"
                  : i % 2 === 0
                    ? "rounded-[20px_20px_20px_6px]"
                    : "rounded-[20px_20px_6px_20px]"
              }`}
            >
              {b.text}
            </p>
          ))}
        </div>

        {/* Desktop lebar: kolase seperti desain */}
        <div className="relative hidden h-[470px] w-[1200px] xl:block">
          <svg viewBox="0 0 1200 470" aria-hidden="true" className="absolute inset-0 h-full w-full">
            {LINES.map((d) => (
              <path key={d} d={d} fill="none" strokeWidth="1.5" strokeDasharray="4 8" className="stroke-rim-dash" />
            ))}
            <circle cx="600" cy="440" r="24" strokeWidth="1.5" className="fill-white stroke-rim" />
            <circle cx="600" cy="440" r="8" className="fill-orbit-1" />
            <ellipse cx="600" cy="441" rx="17" ry="6" fill="none" strokeWidth="2.2" transform="rotate(-18 600 441)" className="stroke-sun-1" />
          </svg>
          {PROBLEM.bubbles.map((b, i) => {
            const pos = DESKTOP_LAYOUT[i];
            const isOutline = b.tone === "outline";
            return (
              <p
                key={i}
                className={`absolute m-0 font-medium leading-normal ${isOutline ? "px-[22px] py-3.5 text-[17px]" : "px-6 py-[18px] text-[19px]"} ${TONE[b.tone]} ${pos.corner}`}
                style={{ left: pos.left, top: pos.top, maxWidth: pos.maxW, transform: pos.rotate ? `rotate(${pos.rotate}deg)` : undefined }}
              >
                {b.text}
              </p>
            );
          })}
        </div>

        <div className="flex max-w-[760px] flex-col items-center gap-3 text-center">
          <Accent className="mt-1.5 text-orbit-1">{PROBLEM.reassurance}</Accent>
          <h3 className="text-balance text-[22px] font-bold leading-[1.3] text-space-2 lg:text-[30px] lg:leading-[1.25]">{PROBLEM.heading}</h3>
          <p className="text-base leading-[1.65] text-prose lg:text-lg">{PROBLEM.body}</p>
          <button
            type="button"
            onClick={() => scrollTo("kenali")}
            aria-label={PROBLEM.nextLabel}
            className="mt-3 flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-rim-strong text-space-1 transition hover:bg-surface-soft"
          >
            <ArrowDown size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
}
