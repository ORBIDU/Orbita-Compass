import { Sparkle } from "lucide-react";
import { TENANG } from "@/content/landing";
import { BRAND } from "@/config/brand";
import MascotFigure from "@/components/mascot/MascotFigure";
import { CONTAINER } from "../primitives";

// Wordmark besar seperti desain: tiga huruf pertama biru, sisanya oranye.
const SPLIT = 3;

/** "Tenang Bifriends, ada ORBIDU" + empat hal yang dibantu ORBIDU. */
export default function TenangSection() {
  return (
    <section id="tenang" className="scroll-mt-16 overflow-hidden bg-white py-16 lg:scroll-mt-20 lg:py-24">
      <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6`}>
        {/* Maskot besar; di desktop terpotong di tepi kiri layar seperti desain. */}
        <svg viewBox="150 130 360 300" aria-hidden="true" className="mx-auto w-[70%] max-w-[360px] overflow-visible lg:-ml-[22%] lg:w-[125%] lg:max-w-none">
          <MascotFigure />
        </svg>

        <div className="flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-col items-center gap-1 text-center lg:items-start lg:text-left">
            <p className="bg-gradient-orbit-x bg-clip-text text-2xl font-bold text-transparent lg:text-[40px] lg:leading-tight">{TENANG.lead}</p>
            <p className="relative inline-flex text-[64px] font-bold leading-none tracking-[-1px] lg:ml-[15%] lg:text-[110px]">
              <span className="bg-gradient-orbit-x bg-clip-text text-transparent">{BRAND.name.slice(0, SPLIT)}</span>
              <span className="bg-gradient-sun-x bg-clip-text text-transparent">{BRAND.name.slice(SPLIT)}</span>
              <Sparkle aria-hidden="true" className="absolute -right-7 -top-3 h-8 w-8 fill-sun-1 text-sun-1 lg:-right-10 lg:h-12 lg:w-12" />
            </p>
          </div>

          <ol className="relative flex flex-col gap-8 bg-buku-garis py-4 pl-2 lg:gap-[72px] lg:py-6 lg:pl-8">
            {/* Garis penghubung titik */}
            <span aria-hidden="true" className="absolute bottom-[calc(1rem+16px)] left-[calc(0.5rem+15px)] top-[calc(1rem+16px)] w-[3px] bg-sun-2 lg:bottom-[calc(1.5rem+22px)] lg:left-[calc(2rem+22px)] lg:top-[calc(1.5rem+22px)]" />
            {TENANG.points.map((p) => (
              <li key={p} className="relative flex items-center gap-5 lg:gap-14">
                <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-full bg-sun-2 lg:h-12 lg:w-12" />
                <span className="text-lg font-medium text-space-2 lg:text-2xl">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
