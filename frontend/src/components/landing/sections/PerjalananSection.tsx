import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PERJALANAN } from "@/content/landing";
import { ROUTES } from "@/config/navigation";
import { CONTAINER } from "../primitives";
import { useLandingNav } from "../useLandingNav";

type Card = (typeof PERJALANAN.cards)[number];

const NUMBER_TONE: Record<Card["tone"], string> = {
  blue: "bg-tint-blue-bg text-tint-blue-fg",
  orange: "bg-tint-orange-bg text-tint-orange-fg",
  green: "bg-tint-green-bg text-tint-green-fg",
};

/** Tiga tahap perjalanan siswa di ORBIDU (Kenali Diri, Jelajahi Pilihan, Susun Langkah). */
export default function PerjalananSection() {
  const { kenaliTo, actionPlanTo } = useLandingNav();
  const target: Record<Card["to"], string> = { kenali: kenaliTo, jurusan: ROUTES.jurusan, "action-plan": actionPlanTo };

  return (
    <section id="perjalanan" className="scroll-mt-16 bg-white pb-20 pt-6 lg:scroll-mt-20 lg:pb-32 lg:pt-10">
      <div className={`${CONTAINER} flex flex-col items-center gap-10 lg:gap-16`}>
        <div className="flex max-w-[900px] flex-col items-center gap-4 text-center lg:gap-5">
          <span className="rounded-full border border-rim bg-cloud px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-tint-blue-fg lg:text-sm">
            {PERJALANAN.badge}
          </span>
          <h2 className="text-balance text-[32px] font-bold leading-[1.15] tracking-[-1px] text-space-1 lg:text-[52px]">{PERJALANAN.title}</h2>
          <p className="max-w-[720px] text-base leading-[1.7] text-prose-dim lg:text-lg">{PERJALANAN.body}</p>
        </div>

        <ol className="grid w-full gap-5 md:grid-cols-3 lg:gap-6">
          {PERJALANAN.cards.map((c) => (
            <li key={c.no} className="flex flex-col rounded-card-lg bg-white p-7 shadow-lift lg:p-10">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-medium lg:h-16 lg:w-16 lg:text-xl ${NUMBER_TONE[c.tone]}`}>
                {c.no}
              </span>
              <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-tint-orange-fg lg:mt-12 lg:text-sm">{c.kicker}</p>
              <h3 className="mt-2 text-xl font-bold tracking-[-0.5px] text-space-1 lg:text-[26px]">{c.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-prose-dim lg:text-base">{c.body}</p>
              <Link to={target[c.to]} className="mt-6 inline-flex items-center gap-2 self-start text-[15px] font-medium text-orbit-1 hover:underline">
                {PERJALANAN.link}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
