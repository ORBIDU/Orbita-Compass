import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { JURUSAN_SECTION } from "@/content/landing";
import { ROUTES } from "@/config/navigation";
import { getFeaturedJurusan } from "@/services/jurusanService";
import type { JurusanSummary } from "@/types/jurusan";
import JurusanCarousel from "../JurusanCarousel";
import { CONTAINER, H2, Lead, SECTION_Y, StepChip } from "../primitives";

const MORE_BTN =
  "flex shrink-0 items-center justify-center rounded-xl border-[1.5px] border-rim bg-white px-[22px] text-[15px] font-semibold text-orbit-1 transition hover:bg-surface-blue";

export default function JurusanSection() {
  const [items, setItems] = useState<JurusanSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getFeaturedJurusan()
      .then((data) => active && setItems(data))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="jurusan" className={`scroll-mt-4 overflow-hidden bg-surface-soft ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-6 lg:gap-10`}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[700px] flex-col gap-3.5 lg:gap-[18px]">
            <StepChip no={JURUSAN_SECTION.step.no} label={JURUSAN_SECTION.step.label} className="self-start" />
            <H2>{JURUSAN_SECTION.title}</H2>
            <Lead>{JURUSAN_SECTION.body}</Lead>
          </div>
          <Link to={ROUTES.jurusan} className={`${MORE_BTN} hidden h-12 lg:flex`}>
            {JURUSAN_SECTION.moreCta}
          </Link>
        </div>

        {/* Di HP, carousel melebar sampai tepi kanan layar supaya kartu berikutnya mengintip. */}
        <div className="-mr-5 sm:-mr-8 lg:mr-0">
          {items && items.length > 0 ? (
            <JurusanCarousel items={items} />
          ) : failed ? (
            <p className="py-10 text-center text-sm text-prose">{JURUSAN_SECTION.empty}</p>
          ) : (
            // Kerangka sementara selama data dimuat (tinggi sama dengan kartu).
            <div aria-hidden="true" className="h-[330px] animate-pulse rounded-[18px] bg-white/60 lg:h-[340px]" />
          )}
        </div>

        <Link to={ROUTES.jurusan} className={`${MORE_BTN} h-[52px] lg:hidden`}>
          {JURUSAN_SECTION.moreCta}
        </Link>
      </div>
    </section>
  );
}
