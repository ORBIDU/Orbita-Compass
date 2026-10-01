import { useId, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { FAQ } from "@/content/landing";
import { whatsappLink } from "@/config/brand";
import { CONTAINER, ExternalLink, H2, SECTION_Y } from "../primitives";

function WhatsAppButton({ className = "" }: { className?: string }) {
  return (
    <ExternalLink
      href={whatsappLink("faq")}
      className={`items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-rim bg-white px-5 text-[15px] font-semibold text-tint-blue-fg transition hover:bg-surface-blue ${className}`}
    >
      <MessageCircle size={20} strokeWidth={2} className="text-whatsapp" aria-hidden="true" />
      {FAQ.whatsappCta}
    </ExternalLink>
  );
}

export default function FaqSection() {
  const [category, setCategory] = useState(0);
  // Seperti desain: pertanyaan pertama terbuka saat kategori dipilih.
  const [open, setOpen] = useState<number>(0);
  const baseId = useId();
  const group = FAQ.groups[category];

  return (
    <section id="faq" className={`scroll-mt-4 bg-surface-soft ${SECTION_Y}`}>
      <div className={`${CONTAINER} flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-14 xl:grid-cols-[400px_720px] xl:gap-20`}>
        <div className="flex flex-col gap-3 lg:gap-[18px]">
          <H2>{FAQ.title}</H2>
          <p className="text-base leading-[1.65] text-prose lg:text-[17px] lg:leading-[1.7]">{FAQ.body}</p>
          <WhatsAppButton className="mt-2 hidden h-12 self-start lg:flex" />
        </div>

        <div className="flex flex-col gap-6">
          <div role="group" aria-label="Kategori pertanyaan" className="flex flex-wrap gap-2">
            {FAQ.groups.map((g, i) => {
              const active = i === category;
              return (
                <button
                  key={g.category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCategory(i);
                    setOpen(0);
                  }}
                  className={`h-11 rounded-xl border-[1.5px] px-3.5 text-[13px] font-semibold transition lg:px-[18px] lg:text-sm ${
                    active ? "border-orbit-1 bg-orbit-1 text-white" : "border-rim bg-white text-space-1 hover:border-rim-strong"
                  }`}
                >
                  {g.category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col border-t border-rim">
            {group.items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${baseId}-faq-${category}-${i}`;
              return (
                <div key={item.q} className="border-b border-rim">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-3.5 py-4 text-left text-base font-semibold leading-[1.4] text-space-2 lg:min-h-[76px] lg:gap-6 lg:py-[22px] lg:text-lg"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={22}
                      strokeWidth={2.2}
                      aria-hidden="true"
                      className={`shrink-0 text-orbit-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p id={panelId} className="pb-[18px] pr-7 text-[15px] leading-[1.65] text-prose lg:pb-6 lg:pr-14 lg:text-base lg:leading-[1.7]">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <WhatsAppButton className="flex h-[50px] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
