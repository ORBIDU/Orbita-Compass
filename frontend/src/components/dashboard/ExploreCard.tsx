import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { EXPLORE } from "@/content/dashboard";

/** Ajakan ke Explore Jurusan (/jurusan). Di HP ini salah satu jalan masuk ke katalog jurusan. */
export default function ExploreCard() {
  return (
    <section className="flex flex-col gap-3 rounded-card border border-rim bg-surface-blue p-5 lg:flex-row lg:items-center lg:gap-5 lg:px-7 lg:py-6">
      <span className="hidden h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-white text-orbit-1 lg:flex">
        <Search size={26} aria-hidden="true" />
      </span>
      <div className="flex flex-1 flex-col gap-1 lg:gap-0.5">
        <h2 className="text-base font-bold text-space-2">{EXPLORE.title}</h2>
        <p className="text-[13px] leading-normal text-prose lg:text-sm">{EXPLORE.body}</p>
      </div>
      <Link
        to={ROUTES.jurusan}
        className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-xl bg-orbit-1 px-[18px] text-sm font-semibold text-white transition hover:brightness-95 lg:h-11"
      >
        {EXPLORE.cta}
      </Link>
    </section>
  );
}
