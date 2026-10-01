import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FitLabel, JurusanSummary } from "@/types/jurusan";
import { JURUSAN_SECTION } from "@/content/landing";
import JurusanCard from "@/components/jurusan/JurusanCard";

// Carousel digeser dengan transform (bukan scroll), jadi tidak pernah ada
// scrollbar. Bisa digeser dengan tombol panah, swipe/drag, atau Tab keyboard.
//
// Jumlah kartu per tampilan:
// - HP (< 640px): 1 kartu + intipan kartu berikutnya, geser 1 kartu
// - Tablet (640–1023px): 2 kartu + intipan, geser 2 kartu
// - Desktop (≥ 1024px): 4 kartu penuh, geser 4 kartu (per halaman)

const SWIPE_THRESHOLD = 40;

interface Layout {
  cardWidth: number;
  gap: number;
  step: number;
}

function layoutFor(width: number): Layout {
  if (width >= 900) {
    const gap = 24;
    return { cardWidth: (width - gap * 3) / 4, gap, step: 4 };
  }
  if (width >= 600) {
    const gap = 16;
    const peek = 72;
    return { cardWidth: (width - peek - gap * 2) / 2, gap, step: 2 };
  }
  const gap = 12;
  // Desain HP: kartu 290px di layar 370px → sekitar 78% lebar.
  return { cardWidth: Math.min(290, width * 0.78), gap, step: 1 };
}

export default function JurusanCarousel({ items, fit = {} }: { items: JurusanSummary[]; fit?: Record<string, FitLabel> }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { cardWidth, gap, step } = layoutFor(width || 360);
  const total = items.length;
  const trackWidth = total * cardWidth + (total - 1) * gap;
  const maxOffset = Math.max(0, trackWidth - width);
  // Indeks terakhir yang masih menggeser (sisanya sudah terlihat semua).
  const lastIndex = Math.max(0, Math.ceil(maxOffset / (cardWidth + gap)));
  const clampedIndex = Math.min(index, lastIndex);
  const offset = Math.min(clampedIndex * (cardWidth + gap), maxOffset);
  const atStart = offset <= 0;
  const atEnd = offset >= maxOffset - 1;

  // Saat layar berubah ukuran, jaga indeks tetap valid.
  useEffect(() => {
    if (index > lastIndex) setIndex(lastIndex);
  }, [index, lastIndex]);

  const go = useCallback((next: number) => setIndex(Math.max(0, Math.min(lastIndex, next))), [lastIndex]);
  const prev = () => go(clampedIndex - step);
  const next = () => go(clampedIndex + step);

  function onPointerDown(e: ReactPointerEvent) {
    drag.current = { x: e.clientX, moved: false };
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
  }

  function onPointerUp(e: ReactPointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    // Kalau tadi menyeret, klik yang menyusul tidak membuka kartu.
    suppressClick.current = drag.current.moved;
    drag.current = null;
    if (dx < -SWIPE_THRESHOLD) next();
    else if (dx > SWIPE_THRESHOLD) prev();
  }

  const arrow =
    "absolute top-[63px] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-space-2 shadow-float transition disabled:cursor-default disabled:opacity-40 lg:top-[68px]";

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        className="touch-pan-y select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        <ul
          className="flex transition-transform duration-[450ms] ease-out motion-reduce:transition-none"
          style={{ gap, transform: `translateX(-${offset}px)` }}
        >
          {items.map((j, i) => (
            <li key={j.slug} className="flex shrink-0" style={{ width: cardWidth }}>
              <JurusanCard
                jurusan={j}
                photoPlaceholder={JURUSAN_SECTION.photoPlaceholder}
                fit={fit[j.slug]}
                draggable={false}
                className="w-full"
                // Kartu yang difokus lewat keyboard digeser ke dalam tampilan.
                onFocus={() => {
                  const cardLeft = i * (cardWidth + gap);
                  if (cardLeft < offset || cardLeft + cardWidth > offset + width) go(i);
                }}
                onClickCapture={(e) => {
                  if (suppressClick.current) {
                    e.preventDefault();
                    suppressClick.current = false;
                  }
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={prev} disabled={atStart} aria-label={JURUSAN_SECTION.prevLabel} className={`${arrow} -left-2 lg:-left-[22px]`}>
        <ArrowLeft size={20} strokeWidth={2.2} />
      </button>
      <button type="button" onClick={next} disabled={atEnd} aria-label={JURUSAN_SECTION.nextLabel} className={`${arrow} right-3 lg:-right-[22px]`}>
        <ArrowRight size={20} strokeWidth={2.2} />
      </button>
    </div>
  );
}
