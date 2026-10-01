import { ArrowDown, ArrowRight, Building2, Globe, Landmark, Shield, UserRound, type LucideIcon } from "lucide-react";
import { COMPASS } from "@/content/landing";
import { CONTAINER, H2, Lead, SECTION_Y, StepChip } from "../primitives";

type PathKey = (typeof COMPASS.paths.items)[number]["key"];

const PATH_STYLE: Record<PathKey, { icon: LucideIcon; box: string }> = {
  ptn: { icon: Landmark, box: "bg-tint-blue-bg text-orbit-1" },
  pts: { icon: Building2, box: "bg-tint-orange-bg text-tint-orange-fg" },
  kedinasan: { icon: Shield, box: "bg-tint-navy-bg text-space-1" },
  ptln: { icon: Globe, box: "bg-tint-teal-bg text-tint-teal-fg" },
};

const CARD = "flex flex-col rounded-[18px] bg-white p-[18px] shadow-soft xl:rounded-[22px] xl:p-[22px]";

/** Panah penghubung: ke bawah di layar sempit, ke kanan di desktop lebar. */
function Connector() {
  return (
    <div className="flex justify-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orbit-1 xl:h-10 xl:w-10">
        <ArrowDown size={16} strokeWidth={2.4} className="xl:hidden" />
        <ArrowRight size={18} strokeWidth={2.2} className="hidden xl:block" />
      </span>
    </div>
  );
}

export default function CompassSection() {
  const { profile, options, paths } = COMPASS;

  return (
    <section id="compass" className={`scroll-mt-4 bg-white ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-7 lg:items-center lg:gap-14`}>
        <div className="flex max-w-[780px] flex-col gap-3.5 lg:items-center lg:gap-[18px] lg:text-center">
          <StepChip no={COMPASS.step.no} label={COMPASS.step.label} className="self-start lg:self-center" />
          <H2>{COMPASS.title}</H2>
          <Lead>{COMPASS.body}</Lead>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col gap-2.5 rounded-card-lg bg-surface-blue p-4 xl:grid xl:max-w-none xl:grid-cols-[300px_56px_minmax(0,1fr)_56px_300px] xl:items-center xl:gap-0 xl:rounded-panel xl:p-10">
          {/* Profil */}
          <div className={`${CARD} gap-3 xl:gap-3.5`}>
            <div className="flex items-center gap-2.5 xl:gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-orbit text-white xl:h-11 xl:w-11">
                <UserRound size={20} strokeWidth={1.9} />
              </span>
              <span className="text-[15px] font-bold text-space-2 xl:text-base">{profile.title}</span>
            </div>
            <div className="flex flex-col gap-3 xl:gap-2.5">
              {profile.rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 text-[13px] xl:text-sm">
                  <span className="text-prose">{k}</span>
                  <span className="font-semibold text-space-2">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <Connector />

          {/* Pilihan untuk dieksplorasi */}
          <div className={`${CARD} gap-2.5 xl:gap-3.5`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[15px] font-bold text-space-2 xl:text-base">{options.title}</span>
              <span className="shrink-0 rounded-full bg-tint-orange-bg px-[9px] py-[3px] text-[11px] font-semibold text-tint-orange-fg xl:px-2.5 xl:py-1 xl:text-xs">
                <span className="xl:hidden">{options.badgeShort}</span>
                <span className="hidden xl:inline">{options.badge}</span>
              </span>
            </div>
            {options.items.map((o) => (
              <div key={o.name} className="flex flex-col gap-1 rounded-[14px] bg-surface-soft p-3 xl:gap-1.5 xl:rounded-2xl xl:p-3.5">
                <div className="flex items-center justify-between gap-2 xl:gap-3">
                  <span className="text-[15px] font-semibold text-space-2 xl:text-base">{o.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-[9px] py-[3px] text-[11px] font-semibold xl:px-2.5 xl:text-xs ${
                      o.strong ? "bg-tint-green-bg text-tint-green-fg" : "bg-tint-blue-bg text-tint-blue-fg"
                    }`}
                  >
                    {o.fit}
                  </span>
                </div>
                <span className="text-xs leading-normal text-prose xl:text-[13px]">{o.reason}</span>
              </div>
            ))}
          </div>

          <Connector />

          {/* Jalur */}
          <div className={`${CARD} gap-2.5 xl:gap-3`}>
            <span className="text-[15px] font-bold text-space-2 xl:text-base">{paths.title}</span>
            {paths.items.map((p) => {
              const s = PATH_STYLE[p.key];
              const Icon = s.icon;
              return (
                <div key={p.key} className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.box}`}>
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-space-2 xl:text-[15px]">{p.name}</span>
                    <span className="text-xs text-prose">{p.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
