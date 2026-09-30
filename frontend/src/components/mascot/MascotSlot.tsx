import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MascotFigure from "./MascotFigure";

interface MascotSlotProps {
  className?: string;
}

interface Look {
  x: number;
  y: number;
  tilt: number;
}

const CENTER: Look = { x: 0, y: 0, tilt: 0 };
// Setelah disentuh di HP, maskot kembali menatap ke depan setelah jeda ini.
const TOUCH_RESET_MS = 1600;

/**
 * Maskot hero beranda. Wadah ini sengaja berdiri sendiri: nanti isinya bisa
 * diganti model 3D (.glb) tanpa mengubah halaman.
 *
 * - Desktop (mouse): mata mengikuti kursor dan badan sedikit miring.
 * - HP (sentuh): maskot menoleh ke titik yang disentuh, lalu kembali ke tengah.
 * - prefers-reduced-motion: diam, tanpa animasi dan tanpa pelacakan.
 */
export default function MascotSlot({ className = "" }: MascotSlotProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState<Look>(CENTER);

  useEffect(() => {
    if (reduced) {
      setLook(CENTER);
      return;
    }
    let raf = 0;
    let resetTimer = 0;

    // Rumus dari desain: arah pupil ternormalisasi (maks. 7 satuan), kemiringan maks. 7°.
    function lookAt(clientX: number, clientY: number) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 360);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setLook({
          x: Math.round((dx / d) * 7 * k * 10) / 10,
          y: Math.round((dy / d) * 7 * k * 10) / 10,
          tilt: Math.round(Math.max(-7, Math.min(7, dx / 90)) * 10) / 10,
        });
      });
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === "mouse") lookAt(e.clientX, e.clientY);
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "mouse") return;
      lookAt(e.clientX, e.clientY);
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => setLook(CENTER), TOUCH_RESET_MS);
    }

    function onLeave() {
      setLook(CENTER);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resetTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {/* viewBox membingkai maskot dalam koordinat desain (pusat badan 320, 270). */}
      <svg viewBox="130 120 380 250" className="h-full w-full overflow-visible">
        <MascotFigure lookX={look.x} lookY={look.y} tilt={look.tilt} animated={!reduced} />
      </svg>
    </div>
  );
}
