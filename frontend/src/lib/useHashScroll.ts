import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Halaman publik dengan #section di alamat (mis. /#perjalanan, /faq#kontak):
 * gulir ke section itu setelah tampil. Tanpa hash, mulai dari atas.
 */
export function useHashScroll(): void {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    // Tunggu satu frame supaya section sudah tampil.
    const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(raf);
  }, [hash]);
}
