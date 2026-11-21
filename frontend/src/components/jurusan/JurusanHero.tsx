import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { JURUSAN_LIST } from "@/content/jurusan";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import type { JenisLembaga } from "@/services/jurusanService";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, StarShape } from "@/components/landing/motion/Sky";
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

const IMG = "pointer-events-none absolute h-auto max-w-none select-none";

/** Bintang kuning samar dari desain (x, y, lebar). */
const STARS: [number, number, number, string][] = [
  [1633, 697, 54, "0s"],
  [506, 217, 34, "-1.1s"],
  [126, 181, 34, "-2.3s"],
  [160, 672, 34, "-0.6s"],
  [1208, 664, 34, "-1.8s"],
  [1096, 420, 21, "-2.9s"],
];

/** Ilustrasi pagi: matahari, awan, bukit, dan pohon (lapisan dari SVG desain). */
function HeroArt({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute aspect-[1730/700] ${className}`}>
      <img src={matahari} alt="" className={`${IMG} motion-safe:animate-ob-denyut`} style={at(778, 280, 541)} />
      <img src={awanKanan} alt="" className={`${IMG} motion-safe:animate-ob-awan [animation-duration:18s]`} style={at(1064, 269, 719)} />
      <img src={awanKiri} alt="" className={`${IMG} motion-safe:animate-ob-awan [animation-direction:alternate-reverse]`} style={at(52, 347, 719)} />
      <img src={bukitKiri} alt="" className={IMG} style={at(0, 213, 905)} />
      <img src={pohonGelapKanan} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang [animation-duration:7s]`} style={at(1285, 163, 312)} />
      <img src={pohonGelapTengah} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang [animation-delay:-2.5s]`} style={at(784, 330, 174)} />
      <img src={bukitBiru} alt="" className={IMG} style={at(506, 481, 1225)} />
      <img src={pohonKanan} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang [animation-delay:-1s]`} style={at(1575, 330, 128)} />
      <img src={pohonKiri} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang [animation-delay:-3.2s]`} style={at(546, 450, 128)} />
      <img src={pohonKecil} alt="" className={`${IMG} origin-bottom motion-safe:animate-ob-goyang [animation-delay:-1.7s] [animation-duration:6s]`} style={at(723, 344, 105)} />
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

/** Hero Eksplor Jurusan (docs/design/publik/EksplorJurusan-Desktop.jpg): tab jenis kampus, pencarian, ajakan Compass. */
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
    `flex h-12 flex-1 items-center justify-center rounded-full bg-white px-6 text-base font-bold shadow-card transition sm:flex-none lg:h-[clamp(52px,4.4vw,76px)] lg:min-w-[clamp(180px,14vw,243px)] lg:text-[clamp(17px,1.6vw,28px)] ${
      jenis === value ? "text-orbit-1 shadow-[inset_0_-4px_0_theme(colors.orbit-1)]" : "text-prose-dim hover:text-space-2"
    }`;

  return (
    <section ref={ref} className="relative overflow-hidden bg-jurusan-langit pb-[52vw] sm:pb-[34vw] lg:aspect-[1730/700] lg:max-h-[820px] lg:min-h-[580px] lg:pb-0">
      <Meteors
        meteors={[
          { left: 30, top: -8, duration: 10, delay: -2, length: 220 },
          { left: 80, top: -6, duration: 13, delay: -8, length: 260 },
        ]}
        angle={-50}
      />
      {/* HP: ilustrasi di bawah, dilebarkan supaya bukit dan pohon tetap terlihat besar. Desktop: memenuhi hero. */}
      <HeroArt className="bottom-0 left-1/2 w-[220%] -translate-x-[58%] sm:w-[150%] sm:-translate-x-1/2 lg:left-auto lg:right-0 lg:h-full lg:w-auto lg:translate-x-0" />

      <div className="relative flex flex-col px-5 pt-10 sm:px-8 sm:pt-14 lg:absolute lg:inset-0 lg:px-0 lg:pl-[13%] lg:pr-[5.5%] lg:pt-[5.2%]">
        <h1 className="flex items-center gap-3 text-[40px] font-bold leading-none tracking-[-1px] text-white [text-shadow:0_2px_14px_rgba(16,26,51,0.28)] sm:text-6xl lg:text-[clamp(52px,5.1vw,88px)]">
          <span aria-hidden="true" className="text-[0.75em]">
            🎓
          </span>
          {L.title}
        </h1>
        <p className="mt-3 max-w-[760px] text-base leading-snug text-ink-muted sm:text-lg lg:mt-[1.6%] lg:max-w-none lg:pl-[0.3%] lg:text-[clamp(17px,1.7vw,30px)]">{L.subtitle}</p>

        <div role="group" aria-label={L.jenisLabel} className="mt-6 flex gap-3 sm:gap-6 lg:mt-[2.6%]">
          {(["umum", "kedinasan"] as const).map((value) => (
            <button key={value} type="button" aria-pressed={jenis === value} onClick={() => onJenis(value)} className={tab(value)}>
              {L.jenis[value]}
            </button>
          ))}
        </div>

        <label className="relative mt-6 block lg:mt-[3.3%]">
          <span className="sr-only">{L.searchLabel}</span>
          <Search size={22} aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-prose-dim" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={L.searchPlaceholder}
            className="h-[54px] w-full rounded-2xl border border-black/10 bg-surface-soft/95 pl-14 pr-12 text-base text-space-2 shadow-card placeholder:text-prose-dim focus:border-orbit-1 focus:outline-none lg:h-[clamp(56px,4.4vw,76px)] lg:rounded-[20px] lg:text-[clamp(16px,1.3vw,22px)] [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label={L.clearSearch}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-prose-dim hover:bg-white hover:text-space-2"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="mt-5 flex flex-col items-stretch gap-3 rounded-2xl bg-space-1/45 p-3 backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full sm:p-1.5 sm:pl-6 lg:mt-[2.6%]">
          <p className="text-center text-[15px] font-medium leading-snug text-white sm:flex-1 sm:text-left lg:text-[clamp(15px,1.5vw,26px)]">{L.compassText}</p>
          <Link to={compass.to} state={compass.state} className={pillClasses("sun", "h-12 shrink-0 px-6 text-[15px] lg:h-[clamp(48px,3.6vw,62px)] lg:px-10 lg:text-[clamp(15px,1.5vw,26px)]")}>
            {L.compassCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
