import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, Shield, Target, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { NEXT_STEPS } from "@/content/compass";

const STYLE: Record<(typeof NEXT_STEPS.items)[number]["key"], { to: string; icon: LucideIcon; box: string }> = {
  snbp: { to: ROUTES.persiapanSnbp, icon: FileText, box: "bg-tint-blue-bg text-orbit-1" },
  tka: { to: ROUTES.persiapanUjian("tka"), icon: Target, box: "bg-tint-orange-bg text-tint-orange-fg" },
  snbt: { to: ROUTES.persiapanUjian("snbt"), icon: BookOpen, box: "bg-tint-green-bg text-tint-green-fg" },
  skd: { to: ROUTES.persiapanUjian("skd"), icon: Shield, box: "bg-tint-navy-bg text-tint-navy-fg" },
};

/** Ajakan ke Persiapan. Siap SKD hanya muncul jika Kedinasan relevan. */
export default function NextSteps({ showSkd }: { showSkd: boolean }) {
  const items = NEXT_STEPS.items.filter((i) => i.key !== "skd" || showSkd);
  return (
    <section aria-labelledby="compass-next" className="flex flex-col gap-3.5">
      <h2 id="compass-next" className="text-lg font-bold text-space-2 lg:text-xl">
        {NEXT_STEPS.title}
      </h2>
      <div className={`grid gap-3 md:grid-cols-3 lg:gap-4 ${items.length > 3 ? "lg:grid-cols-4" : ""}`}>
        {items.map((item) => {
          const { to, icon: Icon, box } = STYLE[item.key];
          return (
            <Link key={item.key} to={to} className="group flex flex-col gap-2 rounded-[18px] border border-rim-soft bg-white p-5 transition-colors hover:border-orbit-1">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${box}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="text-base font-bold text-space-2">{item.title}</span>
              <span className="text-sm leading-normal text-prose">{item.desc}</span>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-orbit-1">
                {item.cta}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
