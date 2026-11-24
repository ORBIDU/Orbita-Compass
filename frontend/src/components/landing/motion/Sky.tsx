import type { CSSProperties } from "react";

// Lapisan langit yang dipakai beberapa hero halaman publik: bintang berkelip
// dan meteor. Posisi dibuat dari angka acak tetap (seed), jadi sama setiap
// kali halaman dibuka dan tidak berubah saat render ulang. Semua gerakan
// memakai motion-safe, jadi diam kalau pengguna meminta animasi dikurangi.

/** Angka acak tetap 0–1 (mulberry32). */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

interface StarfieldProps {
  count: number;
  seed?: number;
  /** Batas area bintang dalam persen tinggi (mis. 70 = hanya 70% bagian atas). */
  maxTop?: number;
  className?: string;
}

/** Titik bintang putih yang berkelip bergantian. */
export function Starfield({ count, seed = 7, maxTop = 100, className = "" }: StarfieldProps) {
  const rnd = seeded(seed);
  const stars = Array.from({ length: count }, () => ({
    left: rnd() * 100,
    top: rnd() * maxTop,
    size: 1.5 + rnd() * 2.2,
    delay: -rnd() * 6,
    duration: 2.4 + rnd() * 3.2,
  }));
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white opacity-60 motion-safe:animate-ob-kelip"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.size > 3 ? "0 0 6px rgba(255,255,255,0.8)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export interface MeteorSpec {
  /** Titik awal dalam persen (biasanya di kanan atas, meteor jatuh ke kiri bawah). */
  left: number;
  top: number;
  /** Detik satu putaran (makin besar makin jarang muncul). */
  duration: number;
  delay: number;
  /** Panjang ekor dalam px. */
  length?: number;
}

/** Meteor: kepala bercahaya dengan ekor memudar, jatuh diagonal lalu muncul lagi. */
export function Meteors({ meteors, angle = -32, className = "" }: { meteors: MeteorSpec[]; angle?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {meteors.map((m, i) => (
        <span key={i} className="absolute" style={{ left: `${m.left}%`, top: `${m.top}%`, transform: `rotate(${angle}deg)` }}>
          <span
            className="flex items-center opacity-0 motion-safe:animate-ob-meteor motion-reduce:opacity-60"
            style={{ animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` } as CSSProperties}
          >
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-white shadow-[0_0_10px_3px_rgba(125,212,243,0.9)]" />
            <span className="h-[2px] rounded-full bg-gradient-to-r from-[#7DD4F3] to-transparent" style={{ width: m.length ?? 160 }} />
          </span>
        </span>
      ))}
    </div>
  );
}

/** Bintang kuning lima sudut (dekorasi section, desain Untuk Sekolah). */
export function StarShape({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 23" aria-hidden="true" className={className} style={style}>
      <path d="M12 0l3.1 7.4 7.9.6-6 5.2 1.9 7.8L12 16.8 5.1 21l1.9-7.8-6-5.2 7.9-.6z" fill="currentColor" />
    </svg>
  );
}
