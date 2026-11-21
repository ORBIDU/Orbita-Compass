import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Search, X } from "lucide-react";
import { JURUSAN_LIST } from "@/content/jurusan";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import type { JenisLembaga } from "@/services/jurusanService";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, StarShape } from "@/components/landing/motion/Sky";
import Siluet from "@/components/landing/motion/Siluet";
import { pillClasses } from "@/components/landing/primitives";
import matahari from "@/assets/publik/jurusan/jurusan-matahari.svg";
import awanKanan from "@/assets/publik/jurusan/jurusan-awan-kanan.svg";
import awanKiri from "@/assets/publik/jurusan/jurusan-awan-kiri.svg";
import bukitKiri from "@/assets/publik/jurusan/jurusan-bukit-kiri.svg";
import pohonGelapKanan from "@/assets/publik/jurusan/jurusan-pohon-gelap-kanan.svg";
import pohonGelapTengah from "@/assets/publik/jurusan/jurusan-pohon-gelap-tengah.svg";
import bukitBiru from "@/assets/publik/jurusan/jurusan-bukit-biru.svg";
import pohonKanan from "@/assets/publik/jurusan/jurusan-pohon-kanan.svg";
import pohonKiri from "@/assets/publik/jurusan/jurusan-pohon-kiri.svg";
import pohonKecil from "@/assets/publik/jurusan/jurusan-pohon-kecil.svg";

/** Posisi dalam persen "panggung" 1730 × 700 (hero desain, y 99–799). */
const at = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / 1730) * 100}%`,
  top: `${((y - 99) / 700) * 100}%`,
  width: `${(w / 1730) * 100}%`,
});

/** Bintang kuning samar dari desain (x, y, lebar, jeda animasi). */
const STARS: [number, number, number, string][] = [
  [1633, 697, 54, "0s"],
  [506, 217, 34, "-1.1s"],
  [126, 181, 34, "-2.3s"],
  [160, 672, 34, "-0.6s"],
  [1208, 664, 34, "-1.8s"],
  [1096, 420, 21, "-2.9s"],
];

const SWAY = "origin-bottom motion-safe:animate-ob-goyang";

/**
 * Ilustrasi pagi dari desain: matahari, awan, bukit, dan pohon. Bentuk dan posisi
 * sama dengan desain; awan, bukit, dan pohon digambar sebagai siluet bergradasi halus.
 */
function HeroArt({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-[1730/700] ${className}`}>
      <img src={matahari} alt="" className="absolute h-auto max-w-none select-none motion-safe:animate-ob-denyut" style={at(778, 280, 541)} />
      <Siluet src={awanKanan} fill="bg-awan-pagi" className="motion-safe:animate-ob-awan [animation-duration:18s]" style={at(1064, 269, 719)} />
      <Siluet src={awanKiri} fill="bg-awan-pagi" className="motion-safe:animate-ob-awan [animation-direction:alternate-reverse]" style={at(52, 347, 719)} />
      <Siluet src={bukitKiri} fill="bg-bukit-pagi" style={at(0, 213, 905)} />
      <Siluet src={pohonGelapKanan} fill="bg-pohon-pagi-gelap" className={`${SWAY} [animation-duration:7s]`} style={at(1285, 163, 312)} />
      <Siluet src={pohonGelapTengah} fill="bg-pohon-pagi-gelap" className={`${SWAY} [animation-delay:-2.5s]`} style={at(784, 330, 174)} />
      <Siluet src={bukitBiru} fill="bg-bukit-pagi-dekat" style={at(506, 481, 1225)} />
      <Siluet src={pohonKanan} fill="bg-pohon-pagi" className={`${SWAY} [animation-delay:-1s]`} style={at(1575, 330, 128)} />
      <Siluet src={pohonKiri} fill="bg-pohon-pagi" className={`${SWAY} [animation-delay:-3.2s]`} style={at(546, 450, 128)} />
      <Siluet src={pohonKecil} fill="bg-pohon-pagi" className={`${SWAY} [animation-delay:-1.7s] [animation-duration:6s]`} style={at(723, 344, 105)} />
      {STARS.map(([x, y, w, delay]) => (
        <StarShape key={`${x}-${y}`} className="absolute text-sun-2/50 motion-safe:animate-ob-kelip" style={{ ...at(x, y, w), animationDelay: delay }} />
      ))}
    </div>
  );
}

interface JurusanHeroProps {
  search: string;
  onSearch: (value: string) => void;
  jenis: JenisLembaga;
  onJenis: (value: JenisLembaga) => void;
}

/**
 * Hero Eksplor Jurusan (docs/design/publik/EksplorJurusan-Desktop.jpg): langit pagi
 * dengan ilustrasi desain (HeroArt). Berisi tab jenis kampus, pencarian, dan ajakan
 * Compass. Ukurannya sengaja ringkas supaya daftar jurusan cepat terlihat.
 */
export default function JurusanHero({ search, onSearch, jenis, onJenis }: JurusanHeroProps) {
  const ref = usePauseOffscreen<HTMLElement>();
  const { status, user } = useAuth();
  const L = JURUSAN_LIST;

  // Tamu: masuk dulu lalu langsung ke Compass. Peran lain: ke portalnya masing-masing.
  const compass =
    status !== "authenticated"
      ? { to: ROUTES.masuk, state: { from: ROUTES.compass } }
      : { to: user?.role === "STUDENT" ? ROUTES.compass : ROUTES.portal, state: undefined };

  const tab = (value: JenisLembaga) =>
    `flex h-11 flex-1 items-center justify-center rounded-full bg-white px-5 text-[15px] font-bold shadow-card transition sm:flex-none sm:min-w-[150px] ${
      jenis === value ? "text-orbit-1 shadow-[inset_0_-3px_0_theme(colors.orbit-1)]" : "text-prose-dim hover:text-space-2"
    }`;

  return (
    <section ref={ref} className="relative overflow-hidden bg-jurusan-langit">
      <Meteors
        meteors={[
          { left: 30, top: -8, duration: 10, delay: -2, length: 180 },
          { left: 85, top: -6, duration: 13, delay: -8, length: 200 },
        ]}
        angle={-50}
      />

      {/* Ilustrasi desain menempel di bawah: hero dibuat ringkas, jadi bagian langit atasnya terpotong.
          HP: dilebarkan supaya bukit dan pohon tetap terlihat besar. */}
      <HeroArt className="bottom-0 left-1/2 w-[230%] -translate-x-[58%] sm:w-[150%] sm:-translate-x-1/2 lg:w-full" />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col px-5 pb-[110px] pt-8 sm:px-8 sm:pb-[140px] sm:pt-10 lg:max-w-[1280px] lg:px-12 lg:pb-[150px] lg:pt-12">
        <h1 className="flex items-center gap-2.5 text-[30px] font-bold leading-none tracking-[-0.6px] text-white [text-shadow:0_2px_12px_rgba(16,26,51,0.25)] sm:text-[38px] lg:text-[44px]">
          <GraduationCap aria-hidden="true" strokeWidth={2.2} className="h-[1em] w-[1em] shrink-0" />
          {L.title}
        </h1>
        <p className="mt-2.5 max-w-[640px] text-[15px] leading-snug text-ink-muted sm:text-base lg:text-lg">{L.subtitle}</p>

        <div className="mt-5 flex max-w-[760px] flex-col gap-3.5">
          <div role="group" aria-label={L.jenisLabel} className="flex gap-3">
            {(["umum", "kedinasan"] as const).map((value) => (
              <button key={value} type="button" aria-pressed={jenis === value} onClick={() => onJenis(value)} className={tab(value)}>
                {L.jenis[value]}
              </button>
            ))}
          </div>

          <label className="relative block">
            <span className="sr-only">{L.searchLabel}</span>
            <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-prose-dim" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={L.searchPlaceholder}
              className="h-12 w-full rounded-2xl border border-black/10 bg-white/95 pl-12 pr-12 text-[15px] text-space-2 shadow-card placeholder:text-prose-dim focus:border-orbit-1 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearch("")}
                aria-label={L.clearSearch}
                className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-prose-dim hover:bg-surface-soft hover:text-space-2"
              >
                <X size={17} aria-hidden="true" />
              </button>
            )}
          </label>

          <div className="flex flex-col items-stretch gap-2.5 rounded-2xl bg-space-1/45 p-2.5 backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full sm:p-1.5 sm:pl-5">
            <p className="text-center text-sm font-medium leading-snug text-white sm:flex-1 sm:text-left sm:text-[15px]">{L.compassText}</p>
            <Link to={compass.to} state={compass.state} className={pillClasses("sun", "h-10 shrink-0 px-5 text-sm")}>
              {L.compassCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
