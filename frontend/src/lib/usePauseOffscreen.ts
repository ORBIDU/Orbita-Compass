import { useEffect, useRef } from "react";

/**
 * Menghentikan animasi CSS di dalam sebuah bagian halaman selama bagian itu
 * tidak terlihat di layar, supaya HP tidak boros baterai. Pasang `ref` di
 * pembungkusnya; atribut `data-paused` dipakai aturan di styles/index.css.
 */
export function usePauseOffscreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.removeAttribute("data-paused");
      else el.setAttribute("data-paused", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
