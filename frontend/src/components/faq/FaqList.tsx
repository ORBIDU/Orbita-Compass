import { useEffect, useId, useState } from "react";
import { ChevronDown, GraduationCap, Info, ListChecks, Rocket, School, type LucideIcon } from "lucide-react";
import { FAQ_LIST, type FaqIcon } from "@/content/faq";

const ICONS: Record<FaqIcon, LucideIcon> = {
  info: Info,
  rocket: Rocket,
  graduation: GraduationCap,
  list: ListChecks,
  school: School,
};

const sectionId = (id: string) => `faq-${id}`;

/** Jarak dari atas layar (px) yang menandai kategori aktif; sedikit di bawah navbar + baris kategori HP. */
const ACTIVE_LINE = 180;

/**
 * Daftar pertanyaan per kategori. Desktop: kartu kategori di kiri (menempel saat
 * digulir), pertanyaan di kanan. HP: kategori jadi tombol yang bisa digeser.
 * Kategori aktif mengikuti bagian yang sedang terlihat.
 */
export default function FaqList() {
  const cats = FAQ_LIST.categories;
  const [active, setActive] = useState(cats[0].id);
  // Pertanyaan pertama terbuka seperti di desain.
  const [open, setOpen] = useState<Set<string>>(() => new Set([`${cats[0].id}-0`]));
  const baseId = useId();

  // Kategori aktif = bagian terakhir yang judulnya sudah melewati bagian atas layar.
  useEffect(() => {
    let raf = 0;
    function update() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let current = cats[0].id;
        for (const c of cats) {
          const el = document.getElementById(sectionId(c.id));
          if (el && el.getBoundingClientRect().top <= ACTIVE_LINE) current = c.id;
        }
        setActive(current);
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
    };
  }, [cats]);

  function jump(id: string) {
    setActive(id);
    document.getElementById(sectionId(id))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggle(key: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-16 xl:gap-14">
        {/* Kategori */}
        <nav aria-label={FAQ_LIST.categoriesLabel} className="sticky top-16 z-10 -mx-5 bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:top-28 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0">
            {cats.map((c) => {
              const Icon = ICONS[c.icon];
              const on = c.id === active;
              return (
                <li key={c.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={on ? "true" : undefined}
                    onClick={() => jump(c.id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition lg:w-full lg:gap-3.5 lg:whitespace-normal lg:rounded-2xl lg:px-4 lg:py-3.5 lg:text-left ${
                      on ? "border-space-2 bg-gradient-navy text-white shadow-card" : "border-orbit-1/40 bg-white text-orbit-1 hover:border-orbit-1"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} aria-hidden="true" className="shrink-0" />
                    <span className="flex flex-col">
                      <span className="lg:text-[15px]">{c.title}</span>
                      <span className={`hidden text-xs font-normal lg:block ${on ? "text-night-sub" : "text-prose-dim"}`}>{c.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pertanyaan */}
        <div className="mt-4 flex flex-col gap-10 lg:mt-0">
          {cats.map((c) => (
            <div key={c.id} id={sectionId(c.id)} className="scroll-mt-32 lg:scroll-mt-28">
              <h2 className="text-lg font-bold text-space-2 lg:text-xl">{c.title}</h2>
              <div className="mt-4 flex flex-col gap-3">
                {c.items.map((item, i) => {
                  const key = `${c.id}-${i}`;
                  const isOpen = open.has(key);
                  const panelId = `${baseId}-${key}`;
                  return (
                    <div key={item.q} className="overflow-hidden rounded-xl shadow-card">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggle(key)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 bg-orbit-1 px-5 py-3.5 text-left text-[15px] font-semibold leading-snug text-white transition hover:bg-orbit-1/90 lg:min-h-[60px] lg:text-base"
                      >
                        <span>{item.q}</span>
                        <ChevronDown size={20} strokeWidth={2.4} aria-hidden="true" className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <p id={panelId} className="border-x border-b border-rim bg-white px-5 py-4 text-[15px] leading-[1.7] text-prose lg:text-base">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
