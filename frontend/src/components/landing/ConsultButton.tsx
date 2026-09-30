import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CONSULT } from "@/content/landing";
import { whatsappLink } from "@/config/brand";
import MascotFigure from "@/components/mascot/MascotFigure";
import { ExternalLink } from "./primitives";

/** Lama gelembung "Ayo konsultasi!" tampil di HP sebelum mengecil jadi maskot saja. */
const BUBBLE_VISIBLE_MS = 4000;
const FADE_MS = 300;

type BubbleState = "shown" | "fading" | "hidden";

/**
 * Tombol "Ayo konsultasi!" dengan maskot melompat, menempel di pojok kanan
 * bawah layar di semua halaman publik. Membuka WhatsApp.
 *
 * Di HP (< 1024px) gelembung teks hanya tampil beberapa detik setiap kali
 * halaman dibuka, lalu mengecil supaya tidak menutupi konten. Di desktop
 * gelembung selalu tampil.
 */
export default function ConsultButton() {
  const { pathname } = useLocation();
  const [bubble, setBubble] = useState<BubbleState>("shown");

  useEffect(() => {
    setBubble("shown");
    const fade = window.setTimeout(() => setBubble("fading"), BUBBLE_VISIBLE_MS);
    const hide = window.setTimeout(() => setBubble("hidden"), BUBBLE_VISIBLE_MS + FADE_MS);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(hide);
    };
  }, [pathname]);

  return (
    <ExternalLink
      href={whatsappLink("konsultasi")}
      aria-label={CONSULT.ariaLabel}
      className="group fixed bottom-3 right-2.5 z-40 flex items-end gap-0.5 lg:bottom-7 lg:right-7 lg:gap-1"
    >
      <span
        data-bubble={bubble}
        className={`mb-11 flex flex-col gap-px rounded-[14px_14px_4px_14px] bg-white px-3 py-2 shadow-bubble transition duration-300 group-hover:-translate-y-0.5 lg:mb-[52px] lg:gap-0.5 lg:rounded-[16px_16px_4px_16px] lg:px-3.5 lg:py-2.5 ${
          bubble === "shown" ? "" : "max-lg:translate-x-2 max-lg:opacity-0"
        } ${bubble === "hidden" ? "max-lg:hidden" : ""}`}
      >
        <span className="text-[13px] font-bold text-space-2 lg:text-sm">{CONSULT.title}</span>
        <span className="flex items-center gap-1.5 text-[11px] text-prose lg:text-xs">
          <span className="h-2 w-2 rounded-full bg-whatsapp" />
          {CONSULT.subtitle}
        </span>
      </span>
      <svg
        viewBox="0 0 88 96"
        aria-hidden="true"
        className="h-[84px] w-[76px] overflow-visible drop-shadow-mascot motion-safe:animate-ob-hop lg:h-24 lg:w-[88px]"
      >
        <g transform="translate(44 52) scale(0.236) translate(-320 -270)">
          <MascotFigure ring="solid" animated={false} />
        </g>
        {/* Lencana WhatsApp */}
        <circle cx="70" cy="80" r="13" strokeWidth="2.5" className="fill-whatsapp stroke-white" />
        <rect x="63.5" y="74" width="13" height="10" rx="3" className="fill-white" />
        <path d="M66 84 L64.5 87.5 L69.5 84 Z" className="fill-white" />
      </svg>
    </ExternalLink>
  );
}
