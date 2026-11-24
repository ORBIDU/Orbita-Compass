import { useId } from "react";

interface MascotFigureProps {
  /** Geser pupil mata (satuan gambar), untuk efek "melihat". */
  lookX?: number;
  lookY?: number;
  /** Kemiringan badan dalam derajat. */
  tilt?: number;
  /** Animasi melayang dan berkedip (otomatis mati jika prefers-reduced-motion). */
  animated?: boolean;
  /** Cincin gradient oranye (hero) atau dua warna polos (versi kecil). */
  ring?: "gradient" | "solid";
}

// Maskot ORBIDU versi SVG dari desain. Koordinatnya mengikuti desain:
// badan berpusat di (320, 270). Komponen ini hanya menggambar <g>, jadi
// harus diletakkan di dalam <svg> yang mengatur viewBox-nya.
export default function MascotFigure({ lookX = 0, lookY = 0, tilt = 0, animated = true, ring = "gradient" }: MascotFigureProps) {
  const id = useId().replace(/:/g, "");
  const bodyId = `mascot-body-${id}`;
  const ringId = `mascot-ring-${id}`;
  const frontId = `mascot-front-${id}`;
  const ringBack = ring === "gradient" ? { stroke: `url(#${ringId})` } : { className: "stroke-sun-1" };
  const ringFront = ring === "gradient" ? { stroke: `url(#${ringId})` } : { className: "stroke-sun-2" };

  return (
    <g>
      <defs>
        <radialGradient id={bodyId} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" className="[stop-color:theme(colors.mascot.light)]" />
          <stop offset="0.5" className="[stop-color:theme(colors.mascot.mid)]" />
          <stop offset="1" className="[stop-color:theme(colors.mascot.dark)]" />
        </radialGradient>
        <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" className="[stop-color:theme(colors.sun-1)]" />
          <stop offset="1" className="[stop-color:theme(colors.sun-2)]" />
        </linearGradient>
        <clipPath id={frontId}>
          <rect x="100" y="285" width="440" height="140" />
        </clipPath>
      </defs>

      <g className={animated ? "motion-safe:animate-ob-float" : undefined}>
        <g transform={`rotate(${tilt} 320 270)`}>
          {/* Cincin bagian belakang */}
          <g transform="rotate(-16 320 285)">
            <ellipse cx="320" cy="285" rx="172" ry="40" fill="none" strokeWidth="16" {...ringBack} />
          </g>
          {/* Badan */}
          <circle cx="320" cy="270" r="110" fill={`url(#${bodyId})`} />
          <circle cx="320" cy="270" r="109" fill="none" strokeWidth="2" className="stroke-mascot-highlight [stroke-opacity:0.45]" />
          <ellipse cx="280" cy="208" rx="34" ry="16" transform="rotate(-30 280 208)" className="fill-white [fill-opacity:0.28]" />
          {/* Topi wisuda */}
          <path d="M262 180 L378 180 L374 210 Q320 226 266 210 Z" className="fill-space-2" />
          <polygon points="236,172 320,144 404,172 320,200" className="fill-mascot-cap" />
          <circle cx="320" cy="172" r="5" className="fill-sun-1" />
          <path d="M320 172 Q370 178 386 192 L388 226" fill="none" strokeWidth="4" strokeLinecap="round" className="stroke-sun-1" />
          <rect x="382" y="222" width="12" height="18" rx="4" className="fill-sun-2" />
          {/* Wajah dari desain maskot terbaru: mata hitam berkilau, pipi biru muda, senyum kecil. */}
          <g className={animated ? "origin-center [transform-box:fill-box] motion-safe:animate-ob-blink" : undefined}>
            <g transform={`translate(${lookX * 0.6} ${lookY * 0.6})`}>
              <circle cx="277" cy="258" r="17" className="fill-black" />
              <circle cx="363" cy="258" r="17" className="fill-black" />
              <circle cx="282" cy="251.5" r="6" className="fill-white" />
              <circle cx="368" cy="251.5" r="6" className="fill-white" />
              <circle cx="273" cy="263" r="2.8" className="fill-white" />
              <circle cx="359" cy="263" r="2.8" className="fill-white" />
            </g>
          </g>
          <ellipse cx="247" cy="277" rx="13" ry="6.5" className="fill-mascot-cheek [fill-opacity:0.55]" />
          <ellipse cx="393" cy="277" rx="13" ry="6.5" className="fill-mascot-cheek [fill-opacity:0.55]" />
          <path d="M307 276 Q320 289 333 276" fill="none" strokeWidth="4.5" strokeLinecap="round" className="stroke-space-2" />
          {/* Cincin bagian depan (menutupi bawah badan) */}
          <g transform="rotate(-16 320 285)">
            <ellipse cx="320" cy="285" rx="172" ry="40" fill="none" strokeWidth="16" clipPath={`url(#${frontId})`} {...ringFront} />
          </g>
        </g>
      </g>
    </g>
  );
}
