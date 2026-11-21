import type { CSSProperties } from "react";
import { PROBLEM } from "@/content/landing";
import siswa from "@/assets/publik/masalah-siswa.svg";
import { CONTAINER } from "../primitives";

type Bubble = (typeof PROBLEM.bubbles)[number];

// Posisi gelembung di desktop: persen dari panggung (lebar 1728, tinggi 894 dari desain).
const DESKTOP_POS: CSSProperties[] = [
  { left: "5%", top: "20.4%", width: "19.7%" },
  { left: "27%", top: "3.7%", width: "15.4%" },
  { left: "62.7%", top: "15.4%", width: "19.7%" },
  { left: "78.5%", top: "44.6%", width: "19%" },
];

/** Gelembung pikiran dengan ekor di kiri/kanan bawah. */
function SpeechBubble({ bubble, className = "", style }: { bubble: Bubble; className?: string; style?: CSSProperties }) {
  const oval = bubble.shape === "oval";
  return (
    <div className={`relative ${className}`} style={style}>
      <div
        className={`flex items-center justify-center border-2 border-space-2 bg-white text-center shadow-chip ${
          oval ? "min-h-[8.5em] rounded-[50%] px-[1.6em] py-[1.4em]" : "rounded-[1.4em] px-[1.1em] py-[1em]"
        }`}
      >
        <p className="leading-[1.6] text-space-2">{bubble.text}</p>
      </div>
      {/* Garis ekor tidak ditutup, jadi bagian atasnya menutupi border gelembung tanpa garis. */}
      <svg
        viewBox="0 0 32 26"
        aria-hidden="true"
        className={`absolute top-[calc(100%-4px)] h-[1.6em] w-[2em] ${bubble.tail === "right" ? "right-[18%]" : "left-[18%] -scale-x-100"}`}
      >
        <path d="M1 0 C 2 12, 14 22, 30 24 C 18 16, 15 8, 15 0" className="fill-white stroke-space-2" strokeWidth="2" />
      </svg>
    </div>
  );
}

/** "Masih bingung harus mulai dari mana?" dengan siswa yang bingung dan empat gelembung pertanyaan. */
export default function ProblemSection() {
  return (
    <section id="masalah" className="scroll-mt-16 overflow-hidden bg-masalah-glow pt-16 lg:scroll-mt-20 lg:pt-20">
      <div className={CONTAINER}>
        <h2 className="mx-auto max-w-[760px] text-balance text-center text-[32px] font-bold leading-[1.25] tracking-[-0.5px] text-orbit-1 lg:text-[52px]">
          {PROBLEM.title}
        </h2>

        {/* HP & tablet: gelembung dalam grid, lalu ilustrasi */}
        <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 text-[15px] sm:grid-cols-2 lg:hidden">
          {PROBLEM.bubbles.map((b) => (
            <li key={b.text}>
              <SpeechBubble bubble={b} className="mx-auto max-w-[300px]" />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: panggung berasio desain, gelembung di sekeliling siswa */}
      <div className="relative mx-auto mt-10 w-full max-w-[1728px] lg:mt-0 lg:aspect-[1728/894]">
        <img
          src={siswa}
          alt=""
          className="mx-auto block w-[110%] max-w-none -translate-x-[5%] sm:w-full sm:translate-x-0 lg:absolute lg:bottom-0 lg:left-[16.2%] lg:w-[64.8%]"
        />
        <ul className="hidden text-[clamp(13px,1.25vw,22px)] lg:block">
          {PROBLEM.bubbles.map((b, i) => (
            <li key={b.text}>
              <SpeechBubble bubble={b} className="absolute" style={DESKTOP_POS[i]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
