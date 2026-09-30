import { BRAND } from "@/config/brand";

interface LogoProps {
  size?: "sm" | "md";
  /** "light" untuk latar terang, "dark" untuk latar navy. */
  tone?: "light" | "dark";
  className?: string;
}

const ICON_SIZE = { sm: "h-[30px] w-[30px]", md: "h-9 w-9" } as const;
const TEXT_SIZE = { sm: "text-[21px]", md: "text-[25px]" } as const;

/** Logo ORBIDU: planet biru dengan cincin oranye + nama brand. */
export default function Logo({ size = "md", tone = "light", className = "" }: LogoProps) {
  const dark = tone === "dark";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 34 34" aria-hidden="true" className={`${ICON_SIZE[size]} shrink-0`}>
        <circle cx="17" cy="17" r="9.5" className={dark ? "fill-mascot-mid" : "fill-orbit-1"} />
        <ellipse cx="17" cy="18" rx="15" ry="5" fill="none" strokeWidth="2.6" transform="rotate(-18 17 18)" className="stroke-sun-1" />
      </svg>
      <span className={`${TEXT_SIZE[size]} font-bold leading-none tracking-[0.3px] ${dark ? "text-night-light" : "text-space-2"}`}>
        {BRAND.name}
      </span>
    </span>
  );
}
