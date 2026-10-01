import { Lightbulb, MessageCircle, Puzzle, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { KENALI } from "@/content/landing";
import { CONTAINER, H2, Lead, PillLink, SECTION_Y, StepChip } from "../primitives";
import { useLandingNav } from "../useLandingNav";

type CardKey = (typeof KENALI.cards)[number]["key"];

const CARD_STYLE: Record<CardKey, { icon: LucideIcon; iconClass: string; chipClass: string }> = {
  minat: { icon: Lightbulb, iconClass: "text-sun-1", chipClass: "bg-tint-orange-bg text-tint-orange-fg" },
  potensi: { icon: Sparkles, iconClass: "text-orbit-1", chipClass: "bg-tint-blue-bg text-tint-blue-fg" },
  kemampuan: { icon: Puzzle, iconClass: "text-tint-teal-fg", chipClass: "bg-tint-teal-bg text-tint-teal-fg" },
};

function ProfileCard({ large = false }: { large?: boolean }) {
  const p = KENALI.profile;
  return (
    <div className={`flex flex-col rounded-[22px] bg-white shadow-soft ${large ? "gap-3.5 p-[22px] shadow-lift" : "gap-3 p-[18px]"}`}>
      <div className="flex items-center gap-3">
        <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-orbit text-white ${large ? "h-14 w-14" : "h-12 w-12"}`}>
          <UserRound size={large ? 28 : 24} strokeWidth={1.9} />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className={`font-bold text-space-2 ${large ? "text-lg" : "text-[17px]"}`}>{p.title}</span>
          <span className="text-[13px] text-prose">{p.subtitle}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className={`flex justify-between ${large ? "text-[13px]" : "text-xs"}`}>
          <span className="text-prose">{p.progressLabel}</span>
          <span className="font-semibold text-orbit-1">{p.progressValue}</span>
        </div>
        <div className="h-2 rounded-full bg-surface-track">
          <div className="h-full rounded-full bg-gradient-orbit-x" style={{ width: `${p.progressPct}%` }} />
        </div>
      </div>
    </div>
  );
}

function TraitCard({ cardKey, title, chips, large = false }: { cardKey: CardKey; title: string; chips: readonly string[]; large?: boolean }) {
  const s = CARD_STYLE[cardKey];
  const Icon = s.icon;
  return (
    <div className={`flex flex-col border border-rim bg-white ${large ? "gap-2.5 rounded-[20px] p-[18px]" : "gap-2 rounded-[18px] p-4"}`}>
      <span className={`flex items-center gap-1.5 font-bold text-space-2 ${large ? "gap-2 text-[15px]" : "text-sm"}`}>
        <Icon size={large ? 20 : 18} strokeWidth={2} className={s.iconClass} />
        {title}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span key={c} className={`rounded-full font-medium ${large ? "px-2.5 py-1 text-xs" : "px-[9px] py-[3px] text-[11px]"} ${s.chipClass}`}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReflectionCard({ large = false }: { large?: boolean }) {
  return (
    <div className={`flex flex-col border border-rim bg-white ${large ? "gap-2 rounded-[20px] p-[18px]" : "gap-1.5 rounded-[18px] p-4"}`}>
      <span className={`flex items-center gap-1.5 font-bold text-space-2 ${large ? "gap-2 text-[15px]" : "text-sm"}`}>
        <MessageCircle size={large ? 20 : 18} strokeWidth={2} className="text-space-1" />
        {KENALI.reflection.title}
      </span>
      <span className={`font-accent font-semibold leading-[1.15] text-space-1 ${large ? "text-[23px]" : "text-xl"}`}>{KENALI.reflection.note}</span>
    </div>
  );
}

// Posisi kartu di kolase desktop (640×540), sesuai desain.
const COLLAGE = { minat: { left: 0, top: 18, width: 250 }, potensi: { left: 390, top: 0, width: 250 }, kemampuan: { left: 10, top: 400, width: 250 } };

export default function KenaliSection() {
  const { kenaliTo } = useLandingNav();

  return (
    <section id="kenali" className={`scroll-mt-4 bg-surface-soft ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 xl:grid-cols-[480px_640px] xl:gap-20`}>
        <div className="flex flex-col gap-3.5 lg:gap-[18px]">
          <StepChip no={KENALI.step.no} label={KENALI.step.label} className="self-start" />
          <H2>{KENALI.title}</H2>
          <Lead>{KENALI.body}</Lead>
          <PillLink to={kenaliTo} className="mt-1.5 h-[52px] self-start text-[15px] lg:mt-2 lg:text-base">
            {KENALI.cta}
          </PillLink>
        </div>

        {/* HP, tablet, desktop sempit: kartu bertumpuk */}
        <div className="flex flex-col gap-3 xl:hidden">
          <ProfileCard />
          <div className="grid grid-cols-2 gap-3">
            {KENALI.cards.map((c) => (
              <TraitCard key={c.key} cardKey={c.key} title={c.title} chips={c.chips} />
            ))}
            <ReflectionCard />
          </div>
        </div>

        {/* Desktop lebar: kolase dengan garis orbit */}
        <div className="relative hidden h-[540px] w-[640px] xl:block">
          <svg viewBox="0 0 640 540" aria-hidden="true" className="absolute inset-0 h-full w-full">
            <ellipse cx="320" cy="270" rx="300" ry="230" fill="none" strokeWidth="1.5" strokeDasharray="3 9" className="stroke-rim-strong" />
            {["M240 190 L150 110", "M400 190 L500 100", "M250 300 L150 410", "M390 300 L500 420"].map((d) => (
              <path key={d} d={d} strokeWidth="1.5" strokeDasharray="4 6" className="stroke-rim-dash" />
            ))}
          </svg>
          <div className="absolute left-[170px] top-[172px] w-[300px]">
            <ProfileCard large />
          </div>
          {KENALI.cards.map((c) => (
            <div key={c.key} className="absolute" style={COLLAGE[c.key]}>
              <TraitCard cardKey={c.key} title={c.title} chips={c.chips} large />
            </div>
          ))}
          <div className="absolute left-[380px] top-[410px] w-[260px]">
            <ReflectionCard large />
          </div>
        </div>
      </div>
    </section>
  );
}
