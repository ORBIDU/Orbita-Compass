interface LogoProps {
  /** Tampilkan ikon maskot di kiri tulisan. */
  withIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const TEXT_SIZE = { sm: "text-xl", md: "text-[26px]" } as const;
const ICON_SIZE = { sm: "h-8 w-8", md: "h-10 w-10" } as const;

/** Logo ORBITA: "ORB" gradient biru + "ITA" gradient oranye. */
export default function Logo({ withIcon = true, size = "md", className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {withIcon && <img src="/logo-icon.png" alt="" className={`${ICON_SIZE[size]} shrink-0 object-contain`} />}
      <span className={`${TEXT_SIZE[size]} font-bold leading-none tracking-tight`}>
        <span className="bg-gradient-orbit bg-clip-text text-transparent">ORB</span>
        <span className="bg-gradient-sun bg-clip-text text-transparent">ITA</span>
        <span className="sr-only">ORBITA</span>
      </span>
    </span>
  );
}
