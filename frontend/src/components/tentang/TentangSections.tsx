import { Brain, Compass, GraduationCap, HeartHandshake, Network, Quote, Rocket, Scale, School, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { TENTANG_EKOSISTEM, TENTANG_JOURNEY, TENTANG_MISI, TENTANG_STORY } from "@/content/tentangKami";
import { whatsappLink } from "@/config/brand";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import MascotFigure from "@/components/mascot/MascotFigure";
import { Badge, CONTAINER, PillExternal } from "@/components/landing/primitives";
import { Starfield } from "@/components/landing/motion/Sky";
import Reveal from "@/components/landing/motion/Reveal";
import siswaBingung from "@/assets/publik/masalah-siswa.svg";

const H2 = "mt-3 text-balance text-[26px] font-bold leading-[1.2] tracking-[-0.5px] text-space-2 lg:text-[38px]";

/** Maskot kecil dalam <svg> sendiri (viewBox membingkai maskot + cincin). */
function Mascot({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="148 138 344 248" aria-hidden="true" className={`overflow-visible ${className}`}>
      <MascotFigure ring="solid" animated={animated} />
    </svg>
  );
}

/** Our Story: pertanyaan awal, ilustrasi kebingungan, lalu "Dari situlah ORBIDU hadir". */
export function StorySection() {
  const S = TENTANG_STORY;
  return (
    <section id="cerita" className="scroll-mt-20 bg-masalah-glow py-16 lg:py-24">
      <div className={`${CONTAINER} flex flex-col items-center xl:max-w-[1200px]`}>
        <Badge>{S.badge}</Badge>
        <h2 className={`${H2} text-center`}>{S.title}</h2>

        <Reveal className="relative mt-8 w-full overflow-hidden rounded-card-lg bg-gradient-navy px-6 py-6 shadow-card lg:mt-10 lg:px-12 lg:py-8">
          <Starfield count={14} seed={5} />
          <div className="relative flex items-start gap-4 lg:items-center lg:justify-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sun-2">
              <Quote size={20} aria-hidden="true" />
            </span>
            <p className="text-balance text-lg font-bold leading-snug text-white lg:text-center lg:text-2xl">“{S.quote}”</p>
          </div>
        </Reveal>

        <div className="mt-8 grid w-full items-center gap-6 lg:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
          <Reveal className="rounded-card-lg bg-white p-5 text-center shadow-card ring-1 ring-rim-faint lg:p-7">
            <img src={siswaBingung} alt="" className="mx-auto w-full max-w-[380px]" />
            <h3 className="mt-3 text-lg font-bold text-space-2">{S.illustrationTitle}</h3>
            <p className="mt-1 text-sm text-prose-dim">{S.illustrationBody}</p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-5">
            <p className="rounded-r-2xl border-l-4 border-sun-1 bg-white/80 px-5 py-4 text-base leading-[1.7] text-space-2 shadow-card lg:text-lg">{S.highlight}</p>
            <p className="px-1 text-base leading-[1.7] text-prose lg:text-lg">{S.body}</p>
          </Reveal>
        </div>

        <Reveal className="mt-10 flex w-full max-w-[760px] items-center gap-5 rounded-card-lg bg-white p-5 shadow-card ring-1 ring-orbit-1/15 lg:mt-14 lg:p-7">
          <Mascot className="w-20 shrink-0 lg:w-24" />
          <div>
            <h3 className="text-lg font-bold text-space-2 lg:text-xl">
              {S.hadir.lead}
              <span className="text-orbit-1">{S.hadir.brand}</span>
              {S.hadir.after}
            </h3>
            <p className="mt-1.5 text-[15px] leading-[1.65] text-prose">{S.hadir.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Warna cabang diagram: garis (stroke) dan label (latar + teks). */
const BRANCH_TONES = [
  { stroke: "stroke-orbit-1", dash: "6 6", pill: "bg-orbit-1 text-white" },
  { stroke: "stroke-sun-1", dash: undefined, pill: "bg-sun-1 text-white" },
  { stroke: "stroke-tint-green-fg", dash: undefined, pill: "bg-tint-green-fg text-white" },
  { stroke: "stroke-tint-purple-dot", dash: "2 6", pill: "bg-tint-purple-dot text-white" },
];

/** Your journey, Your orbit: teks di kiri, diagram cabang pilihan di kanan. */
export function JourneySection() {
  const ref = usePauseOffscreen<HTMLElement>();
  const J = TENTANG_JOURNEY;
  const ys = [36, 92, 148, 204];
  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-gradient-navy py-16 lg:py-24">
      <Starfield count={40} seed={17} />
      <div className={`${CONTAINER} relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:max-w-[1200px]`}>
        <Reveal>
          <h2 className="text-[36px] font-bold leading-[1.1] tracking-[-0.8px] lg:text-[56px]">
            <span className="block text-white">{J.titleTop}</span>
            <span className="block text-sun-2">{J.titleAccent}</span>
          </h2>
          <p className="mt-5 max-w-[480px] text-base leading-[1.65] text-night-sub lg:text-lg">{J.body}</p>
          <p className="mt-6 max-w-[520px] rounded-2xl border-l-4 border-sun-1 bg-white px-5 py-4 text-[15px] leading-[1.65] text-space-2 shadow-card lg:text-base">
            {J.callout.before}
            <strong className="font-bold">{J.callout.strong}</strong>
            {J.callout.after}
          </p>
        </Reveal>

        <Reveal delay={120} className="rounded-card-lg bg-white p-5 shadow-card lg:p-7">
          <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-space-2">{J.diagramTitle}</p>
          <div className="relative mt-4 aspect-[400/240]">
            <svg viewBox="0 0 400 240" aria-hidden="true" className="absolute inset-0 h-full w-full">
              {ys.map((y, i) => (
                <path
                  key={y}
                  d={`M92 120 C 160 120, 170 ${y}, 236 ${y}`}
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={BRANCH_TONES[i].dash}
                  className={BRANCH_TONES[i].stroke}
                />
              ))}
            </svg>
            <Mascot animated className="absolute left-[2%] top-1/2 w-[24%] -translate-y-1/2" />
            <ul>
              {J.branches.map((label, i) => (
                <li
                  key={label}
                  className={`absolute left-[59%] flex h-[13%] min-w-[30%] -translate-y-1/2 items-center justify-center rounded-full px-3 text-[clamp(11px,1.1vw,14px)] font-semibold ${BRANCH_TONES[i].pill}`}
                  style={{ top: `${(ys[i] / 240) * 100}%` }}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-center text-xs text-prose-dim">{J.diagramNote}</p>
        </Reveal>
      </div>
    </section>
  );
}

const MISI_ICON: Record<(typeof TENTANG_MISI.items)[number]["icon"], { Icon: LucideIcon; tone: string }> = {
  potensi: { Icon: Brain, tone: "bg-tint-orange-bg text-tint-orange-fg" },
  informasi: { Icon: Network, tone: "bg-tint-blue-bg text-tint-blue-fg" },
  eksplorasi: { Icon: Rocket, tone: "bg-tint-purple-bg text-tint-purple-fg" },
  alasan: { Icon: Scale, tone: "bg-tint-green-bg text-tint-green-fg" },
  langkah: { Icon: TrendingUp, tone: "bg-tint-purple-bg text-tint-purple-fg" },
  sekolah: { Icon: HeartHandshake, tone: "bg-tint-orange-bg text-tint-orange-fg" },
};

/** Our Mission: enam pilar misi dalam kartu. */
export function MisiSection() {
  const M = TENTANG_MISI;
  return (
    <section id="misi" className="scroll-mt-20 bg-white py-16 lg:py-24">
      <div className={`${CONTAINER} flex flex-col items-center xl:max-w-[1200px]`}>
        <Badge>{M.badge}</Badge>
        <h2 className={`${H2} text-center`}>
          {M.titleLead}
          <span className="text-orbit-1">{M.titleStrong}</span>
          {M.titleAfter}
        </h2>
        <p className="mt-3 max-w-[560px] text-center text-base leading-[1.65] text-prose">{M.body}</p>
        <div className="mt-10 grid w-full gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {M.items.map((item, i) => {
            const { Icon, tone } = MISI_ICON[item.icon];
            return (
              <Reveal key={item.title} delay={(i % 3) * 100} className="flex flex-col rounded-card-lg bg-white p-6 shadow-card ring-1 ring-sun-2/30">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-space-2 lg:text-lg">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-prose">{item.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const PARTNER_ICON: Record<(typeof TENTANG_EKOSISTEM.partners)[number]["icon"], { Icon: LucideIcon; tone: string }> = {
  sekolah: { Icon: School, tone: "bg-tint-blue-bg text-tint-blue-fg" },
  guru: { Icon: GraduationCap, tone: "bg-tint-amber-bg text-tint-amber-fg" },
  keluarga: { Icon: Users, tone: "bg-tint-purple-bg text-tint-purple-fg" },
  mitra: { Icon: Compass, tone: "bg-tint-green-bg text-tint-green-fg" },
};

/** Posisi label mitra di sekeliling orbit (persen kotak diagram). */
const PARTNER_POS = ["left-[4%] top-[12%]", "right-[2%] top-[26%]", "left-[0%] bottom-[18%]", "right-[8%] bottom-[8%]"];

/** Ekosistem: maskot di tengah orbit, mitra di sekelilingnya, ajakan kolaborasi. */
export function EkosistemSection() {
  const ref = usePauseOffscreen<HTMLElement>();
  const E = TENTANG_EKOSISTEM;
  return (
    <section ref={ref} className="bg-white px-4 py-12 sm:px-8 lg:py-20">
      <div className="on-dark relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] bg-gradient-navy px-5 py-12 shadow-card sm:px-10 lg:rounded-[36px] lg:px-16 lg:py-16">
        <Starfield count={36} seed={29} />
        <div className="relative flex flex-col items-center text-center">
          <h2 className="max-w-[760px] text-balance text-[24px] font-bold leading-[1.25] lg:text-[34px]">
            <span className="text-orbit-2">{E.titleBrand}</span>
            <span className="text-white">{E.titleLead}</span>
            <span className="block text-sun-2">{E.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-[620px] text-[15px] leading-[1.65] text-night-sub lg:text-base">{E.body}</p>

          <div className="relative mt-10 aspect-[4/3] w-full max-w-[560px] sm:aspect-[16/10]">
            <svg viewBox="0 0 400 250" aria-hidden="true" className="absolute inset-0 h-full w-full">
              <ellipse cx="200" cy="125" rx="190" ry="115" fill="none" className="stroke-orbit-2/50" strokeWidth="1.5" />
              <ellipse cx="200" cy="125" rx="150" ry="90" fill="none" className="stroke-white/30" strokeWidth="1.5" />
              <ellipse cx="200" cy="125" rx="110" ry="65" fill="none" className="stroke-white/20" strokeWidth="1.5" />
            </svg>
            <div className="absolute left-1/2 top-1/2 flex aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-orbit shadow-[0_0_60px_rgba(9,101,250,0.5)]">
              <Mascot animated className="w-[78%]" />
            </div>
            <ul>
              {E.partners.map((p, i) => {
                const { Icon, tone } = PARTNER_ICON[p.icon];
                return (
                  <li
                    key={p.label}
                    className={`absolute flex items-center gap-2 rounded-xl bg-white px-2.5 py-1.5 text-left text-xs font-semibold text-space-2 shadow-card motion-safe:animate-ob-melayang sm:text-sm ${PARTNER_POS[i]}`}
                    style={{ animationDelay: `${-i * 1.3}s` }}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone}`}>
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    {p.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-10 w-full max-w-[520px] rounded-2xl border border-white/15 bg-white/5 px-6 py-6 backdrop-blur-sm">
            <p className="text-lg font-bold text-sun-2">“{E.quote}”</p>
            <p className="mt-2 text-sm leading-relaxed text-night-sub">{E.quoteBody}</p>
            <PillExternal href={whatsappLink("sekolah")} variant="sun" icon="none" className="mt-5 h-11 px-6 text-sm">
              {E.cta}
            </PillExternal>
          </div>
        </div>
      </div>
    </section>
  );
}
