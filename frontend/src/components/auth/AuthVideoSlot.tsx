import { useMemo, useState, type ReactNode } from "react";
import { AUTH_MEDIA } from "@/config/authMedia";
import { makeStars } from "@/lib/stars";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MascotFigure from "@/components/mascot/MascotFigure";

type Variant = "panel" | "banner";

interface AuthVideoSlotProps {
  /** "panel" = kiri 65% di desktop, "banner" = banner atas di HP/tablet. */
  variant: Variant;
  className?: string;
  /** Isi di atas video (logo, teks sapaan, tombol kembali). */
  children?: ReactNode;
}

const MEDIA = { panel: AUTH_MEDIA.desktop, banner: AUTH_MEDIA.mobile } as const;

/**
 * Slot video animasi di halaman Masuk & Daftar.
 *
 * Urutan yang ditampilkan:
 * 1. Video dari config/authMedia.ts (autoplay, muted, loop, tanpa suara).
 * 2. Poster, jika video belum ada, gagal dimuat, atau pengguna memilih
 *    prefers-reduced-motion (video tidak pernah diputar).
 * 3. Ilustrasi maskot dan orbit dari desain, jika poster juga belum ada.
 */
export default function AuthVideoSlot({ variant, className = "", children }: AuthVideoSlotProps) {
  const reduced = useReducedMotion();
  const { video, poster } = MEDIA[variant];
  const [videoFailed, setVideoFailed] = useState(false);
  const playVideo = Boolean(video) && !reduced && !videoFailed;
  const bg = variant === "panel" ? "bg-auth-glow" : "bg-auth-glow-sm";

  return (
    <div className={`relative overflow-hidden ${bg} ${className}`}>
      <div aria-hidden="true" className="absolute inset-0">
        {playVideo ? (
          <video
            key={video}
            src={video ?? undefined}
            poster={poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : poster ? (
          <img src={poster} alt="" className="h-full w-full object-cover" />
        ) : variant === "panel" ? (
          <PanelIllustration animated={!reduced} />
        ) : (
          <BannerIllustration animated={!reduced} />
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Ilustrasi pengganti (sampai video dari tim animasi tersedia) ───────────

function Stars({ count, seed }: { count: number; seed: number }) {
  const stars = useMemo(() => makeStars(count, seed), [count, seed]);
  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white motion-safe:animate-ob-twinkle"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  );
}

/** Lima titik oranye di lintasan orbit, koordinat dari desain. */
const PANEL_DOTS = [
  [38, 294],
  [124, 183],
  [409, 166],
  [590, 234],
  [496, 337],
];
const BANNER_DOTS = [
  [45, 156],
  [92, 103],
  [250, 95],
  [350, 128],
  [298, 177],
];

function OrbitPath({ cx, cy, rx, ry, width, flowWidth }: { cx: number; cy: number; rx: number; ry: number; width: number; flowWidth: number }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" strokeWidth={width} className="stroke-mascot-orbit-soft [stroke-opacity:0.35]" />
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        strokeWidth={flowWidth}
        strokeDasharray="1 23"
        strokeLinecap="round"
        className="stroke-white [stroke-opacity:0.6] motion-safe:animate-ob-flow"
      />
    </>
  );
}

/** Panel desktop: bintang, dua orbit, cahaya biru, dan maskot besar di tengah. */
function PanelIllustration({ animated }: { animated: boolean }) {
  return (
    <>
      <Stars count={70} seed={17} />
      {/* Lebar dibatasi tinggi layar supaya maskot tidak menabrak teks di bawah. */}
      <svg
        viewBox="0 0 620 520"
        className="absolute left-1/2 top-[46%] w-[min(620px,68%,78vh)] -translate-x-1/2 -translate-y-1/2 overflow-visible"
      >
        <defs>
          <radialGradient id="auth-panel-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" className="[stop-color:theme(colors.mascot.glow)] [stop-opacity:0.5]" />
            <stop offset="1" className="[stop-color:theme(colors.mascot.glow)] [stop-opacity:0]" />
          </radialGradient>
        </defs>
        <g transform="rotate(28 310 260)">
          <ellipse cx="310" cy="260" rx="210" ry="250" fill="none" strokeWidth="1.4" className="stroke-mascot-orbit-soft [stroke-opacity:0.22]" />
        </g>
        <g transform="rotate(-14 310 260)">
          <OrbitPath cx={310} cy={260} rx={290} ry={100} width={1.6} flowWidth={2.4} />
          {PANEL_DOTS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" className="fill-sun-1" />
          ))}
        </g>
        <circle cx="310" cy="260" r="200" fill="url(#auth-panel-glow)" />
        <g transform="translate(-10 -10)">
          {/* Seperti desain: pupil sedikit melirik ke kanan, ke arah form. */}
          <MascotFigure lookX={6} lookY={-1} animated={animated} />
        </g>
      </svg>
    </>
  );
}

/** Banner HP: bintang, satu orbit, dan maskot kecil. Lebar tetap 390, dipusatkan. */
function BannerIllustration({ animated }: { animated: boolean }) {
  return (
    <>
      <Stars count={30} seed={23} />
      <svg viewBox="0 0 390 240" className="absolute left-1/2 top-0 h-full w-[390px] -translate-x-1/2">
        <g transform="rotate(-12 195 140)">
          <OrbitPath cx={195} cy={140} rx={160} ry={48} width={1.4} flowWidth={2} />
          {BANNER_DOTS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" className="fill-sun-1" />
          ))}
        </g>
        {/* Maskot desain (pusat 320,270, jari-jari 110) diperkecil ke jari-jari ±35. */}
        <g transform="translate(194 148) scale(0.32) translate(-320 -270)">
          <MascotFigure ring="solid" lookX={3} animated={animated} />
        </g>
      </svg>
    </>
  );
}
