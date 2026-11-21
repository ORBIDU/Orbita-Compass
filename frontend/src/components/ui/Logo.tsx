import { BRAND } from "@/config/brand";
import MascotFigure from "@/components/mascot/MascotFigure";

interface LogoProps {
  size?: "sm" | "md";
  /** "light" untuk latar terang, "dark" untuk latar navy. */
  tone?: "light" | "dark";
  className?: string;
}

const ICON_SIZE = { sm: "h-[34px]", md: "h-[42px]" } as const;
const TEXT_SIZE = { sm: "text-[23px]", md: "text-[28px]" } as const;
const GRADIENT_TEXT = "bg-clip-text text-transparent";

/** Logo ORBIDU: maskot sebagai huruf "O", lalu "RB" biru dan "IDU" oranye, dengan kilau kecil. */
export default function Logo({ size = "md", tone = "light", className = "" }: LogoProps) {
  const dark = tone === "dark";
  return (
    <span role="img" aria-label={BRAND.name} className={`inline-flex items-center ${className}`}>
      <svg viewBox="148 138 344 248" aria-hidden="true" className={`${ICON_SIZE[size]} -mr-[0.32em] w-auto shrink-0 overflow-visible`}>
        <MascotFigure ring="solid" animated={false} />
      </svg>
      <span aria-hidden="true" className={`relative ${TEXT_SIZE[size]} font-bold leading-none tracking-[0.2px]`}>
        <span className={dark ? "text-night-light" : `bg-gradient-orbit-x ${GRADIENT_TEXT}`}>{BRAND.logoText.lead}</span>
        <span className={`bg-gradient-sun-x ${GRADIENT_TEXT}`}>{BRAND.logoText.accent}</span>
        <svg viewBox="0 0 24 24" className="absolute -right-[0.42em] -top-[0.32em] h-[0.42em] w-[0.42em] fill-sun-1">
          <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
        </svg>
      </span>
    </span>
  );
}
