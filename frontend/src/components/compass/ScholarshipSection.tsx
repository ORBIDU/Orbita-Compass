import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { COMPASS_SCHOLARSHIPS } from "@/content/beasiswa";
import type { Scholarship } from "@/types/beasiswa";

/** "Beasiswa yang bisa kamu coba" di halaman Compass: 3 beasiswa yang cocok dengan jalurmu. */
export default function ScholarshipSection({ items }: { items: Scholarship[] }) {
  return (
    <section aria-labelledby="compass-bea" className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1">
          <h2 id="compass-bea" className="text-lg font-bold text-space-2 lg:text-xl">
            {COMPASS_SCHOLARSHIPS.title}
          </h2>
          <p className="text-sm text-prose">{COMPASS_SCHOLARSHIPS.subtitle}</p>
        </div>
        <Link
          to={`${ROUTES.beasiswa}?cocok=1`}
          className="flex h-[42px] shrink-0 items-center justify-center gap-1.5 self-start rounded-xl border-[1.5px] border-rim bg-white px-4 text-sm font-semibold text-orbit-1 hover:bg-surface-sky sm:self-auto"
        >
          {COMPASS_SCHOLARSHIPS.cta}
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="rounded-[18px] border border-rim-soft bg-white p-5 text-sm text-prose">{COMPASS_SCHOLARSHIPS.empty}</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-3 lg:gap-4">
          {items.map((s) => (
            <li key={s.id} className="flex flex-col gap-2.5 rounded-[18px] border border-rim-soft bg-white p-5">
              <span className="self-start rounded-full bg-tint-orange-bg px-2.5 py-[3px] text-xs font-semibold text-tint-orange-fg">{s.note}</span>
              <h3 className="text-base font-bold text-space-2">{s.name}</h3>
              <span className="text-[13px] text-prose-dim">{s.organizer}</span>
              <p className="text-sm leading-normal text-space-1">
                <strong className="font-semibold">{COMPASS_SCHOLARSHIPS.coverage}</strong> {s.coverage}
              </p>
              <p className="text-sm leading-normal text-space-1">
                <strong className="font-semibold">{COMPASS_SCHOLARSHIPS.requirements}</strong> {s.requirements[0]}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
