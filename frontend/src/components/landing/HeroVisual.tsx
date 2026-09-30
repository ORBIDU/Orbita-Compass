import { useMemo } from "react";
import { STEPS } from "@/content/landing";
import { makeStars } from "@/lib/stars";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import MascotSlot from "@/components/mascot/MascotSlot";
import { StepChip } from "./primitives";

// Komposisi visual hero: piringan planet berbintang, lintasan orbit,
// maskot (MascotSlot), dan lima chip langkah. Ukuran dan posisi diambil
// dari desain desktop (560×600) dan HP (390×290), lalu diubah ke persen
// supaya ikut mengecil/membesar sesuai lebar layar.

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SceneConfig {
  w: number;
  h: number;
  aspect: string;
  disc: { x: number; y: number; d: number };
  stars: { count: number; seed: number };
  mascot: Box;
  chips: { step: keyof typeof STEPS; x: number; y: number; delay: number }[];
  chipSize: "sm" | "md";
}

const DESKTOP: SceneConfig = {
  w: 560,
  h: 600,
  aspect: "aspect-[560/600]",
  disc: { x: 75, y: 75, d: 450 },
  stars: { count: 60, seed: 7 },
  // Kotak MascotSlot = viewBox maskot (130,120,380,250) digeser (-20,30) seperti di desain.
  mascot: { left: 110, top: 150, width: 380, height: 250 },
  chips: [
    { step: "potensi", x: 6, y: 410, delay: 0 },
    { step: "arah", x: 22, y: 222, delay: -1.4 },
    { step: "pilihan", x: 330, y: 138, delay: -2.8 },
    { step: "persiapan", x: 474, y: 160, delay: -4.2 },
    { step: "langkah", x: 470, y: 348, delay: -5.6 },
  ],
  chipSize: "md",
};

const MOBILE: SceneConfig = {
  w: 390,
  h: 290,
  aspect: "aspect-[390/290]",
  disc: { x: 70, y: 20, d: 250 },
  stars: { count: 34, seed: 11 },
  // Maskot diperkecil 0,5× dan berpusat di (195,145) seperti di desain HP.
  mascot: { left: 100, top: 70, width: 190, height: 125 },
  chips: [
    { step: "potensi", x: 8, y: 222, delay: 0 },
    { step: "arah", x: 12, y: 90, delay: -1.4 },
    { step: "pilihan", x: 196, y: 30, delay: -2.8 },
    { step: "persiapan", x: 286, y: 50, delay: -4.2 },
    { step: "langkah", x: 296, y: 206, delay: -5.6 },
  ],
  chipSize: "sm",
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

const TWINKLE = "origin-center [transform-box:fill-box] motion-safe:animate-ob-twinkle";

function Sparkle({ d, className, delay = 0 }: { d: string; className: string; delay?: number }) {
  return <path d={d} className={`${TWINKLE} ${className}`} style={{ animationDelay: `${delay}s` }} />;
}

function DesktopOrbits() {
  return (
    <svg viewBox="0 0 560 600" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <radialGradient id="hero-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" className="[stop-color:theme(colors.mascot.glow)] [stop-opacity:0.45]" />
          <stop offset="1" className="[stop-color:theme(colors.mascot.glow)] [stop-opacity:0]" />
        </radialGradient>
      </defs>
      <Sparkle d="M38 120 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" className="fill-orbit-1 [fill-opacity:0.55]" />
      <Sparkle d="M520 470 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" className="fill-sun-1 [fill-opacity:0.7]" delay={-1.5} />
      <Sparkle d="M505 70 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" className="fill-sun-2" delay={-3} />
      <Sparkle d="M30 540 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" className="fill-orbit-1 [fill-opacity:0.5]" delay={-2.2} />
      <g transform="rotate(28 300 300)">
        <ellipse cx="300" cy="300" rx="205" ry="270" fill="none" strokeWidth="1.4" className="stroke-mascot-orbit [stroke-opacity:0.3]" />
      </g>
      <g transform="rotate(-14 300 300)">
        <ellipse cx="300" cy="300" rx="270" ry="96" fill="none" strokeWidth="1.6" className="stroke-mascot-orbit [stroke-opacity:0.45]" />
        <ellipse
          cx="300"
          cy="300"
          rx="270"
          ry="96"
          fill="none"
          strokeWidth="2.4"
          strokeDasharray="1 23"
          strokeLinecap="round"
          className="stroke-orbit-1 [stroke-opacity:0.8] motion-safe:animate-ob-flow"
        />
        {[
          [46, 333],
          [126, 227],
          [392, 210],
          [561, 275],
          [474, 374],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" strokeWidth="2.5" className="fill-sun-1 stroke-white" />
        ))}
      </g>
      <circle cx="300" cy="300" r="190" fill="url(#hero-glow)" />
    </svg>
  );
}

function MobileOrbits() {
  return (
    <svg viewBox="0 0 390 290" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
      <Sparkle d="M30 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" className="fill-orbit-1 [fill-opacity:0.55]" />
      <Sparkle d="M360 250 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" className="fill-sun-1 [fill-opacity:0.7]" delay={-2} />
      <g transform="rotate(-14 195 145)">
        <ellipse cx="195" cy="145" rx="180" ry="62" fill="none" strokeWidth="1.5" className="stroke-mascot-orbit [stroke-opacity:0.45]" />
        <ellipse
          cx="195"
          cy="145"
          rx="180"
          ry="62"
          fill="none"
          strokeWidth="2.2"
          strokeDasharray="1 23"
          strokeLinecap="round"
          className="stroke-orbit-1 [stroke-opacity:0.8] motion-safe:animate-ob-flow"
        />
        {[
          [26, 166],
          [79, 98],
          [257, 87],
          [369, 129],
          [311, 193],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.5" strokeWidth="2" className="fill-sun-1 stroke-white" />
        ))}
      </g>
    </svg>
  );
}

export default function HeroVisual({ className = "" }: { className?: string }) {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const scene = desktop ? DESKTOP : MOBILE;
  const stars = useMemo(() => makeStars(scene.stars.count, scene.stars.seed), [scene]);
  const { w, h, disc, mascot } = scene;

  return (
    <div className={`relative w-full ${scene.aspect} ${className}`}>
      {/* Piringan planet berbintang */}
      <div
        aria-hidden="true"
        className={`absolute overflow-hidden rounded-full bg-planet ${desktop ? "shadow-planet" : "shadow-lift"}`}
        style={{ left: pct(disc.x, w), top: pct(disc.y, h), width: pct(disc.d, w), height: pct(disc.d, h) }}
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white motion-safe:animate-ob-twinkle"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      {desktop ? <DesktopOrbits /> : <MobileOrbits />}

      {/* Wadah posisi maskot (persen dari konfigurasi scene) */}
      <div
        className="absolute"
        style={{ left: pct(mascot.left, w), top: pct(mascot.top, h), width: pct(mascot.width, w), height: pct(mascot.height, h) }}
      >
        <MascotSlot className="h-full w-full" />
      </div>

      {/* Chip langkah */}
      {scene.chips.map((c) => (
        <span
          key={c.step}
          aria-hidden="true"
          className="absolute motion-safe:animate-ob-bob"
          style={{ left: pct(c.x, w), top: pct(c.y, h), animationDelay: `${c.delay}s` }}
        >
          <StepChip no={STEPS[c.step].no} label={STEPS[c.step].label} size={scene.chipSize} className="shadow-chip" />
        </span>
      ))}
    </div>
  );
}
