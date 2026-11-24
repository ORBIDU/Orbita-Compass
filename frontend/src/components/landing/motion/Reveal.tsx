import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Isi muncul halus (naik + memudar masuk) saat pertama kali terlihat ketika
 * di-scroll. Tanpa JavaScript atau kalau pengguna meminta animasi dikurangi,
 * isi langsung tampil seperti biasa.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** Jeda dalam ms, untuk kartu yang muncul berurutan. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${className} ${shown ? "motion-safe:animate-ob-muncul" : "motion-safe:opacity-0"}`}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
