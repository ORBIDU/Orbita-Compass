import type { ReactNode } from "react";
import { usePauseOffscreen } from "@/lib/usePauseOffscreen";
import { Meteors, Starfield } from "./motion/Sky";
import { CONTAINER, PillExternal } from "./primitives";

/**
 * Ajakan penutup di latar navy berbintang dengan meteor (Untuk Sekolah,
 * Tentang Kami). Tombolnya membuka link luar (WhatsApp).
 */
export default function NavyCta({
  title,
  body,
  cta,
  href,
  extra,
}: {
  title: ReactNode;
  body: ReactNode;
  cta: string;
  href: string;
  /** Tombol/tautan tambahan di samping tombol utama. */
  extra?: ReactNode;
}) {
  const ref = usePauseOffscreen<HTMLElement>();
  return (
    <section ref={ref} className="on-dark relative overflow-hidden bg-gradient-navy py-20 lg:py-28">
      <Starfield count={46} seed={31} />
      <Meteors
        meteors={[
          { left: 78, top: 4, duration: 11, delay: -2, length: 180 },
          { left: 40, top: -6, duration: 14, delay: -9, length: 220 },
        ]}
      />
      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(9,101,250,0.28),transparent_68%)]" />
      <div className={`${CONTAINER} relative flex flex-col items-center gap-5 text-center lg:gap-6`}>
        <h2 className="text-balance text-[32px] font-bold leading-[1.15] tracking-[-0.8px] text-white lg:text-[56px]">{title}</h2>
        <p className="max-w-[760px] text-base leading-[1.65] text-night-sub lg:text-lg">{body}</p>
        <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
          <PillExternal href={href} variant="sun" icon="none" className="h-[54px] px-8 lg:px-10">
            {cta}
          </PillExternal>
          {extra}
        </div>
      </div>
    </section>
  );
}
