// Ikon Instagram dan LinkedIn versi garis, diambil dari desain.
// (lucide-react versi terpasang tidak lagi menyediakan ikon merek.)

interface IconProps {
  size?: number;
  className?: string;
}

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...common}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...common}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10v6M8 7.5v.01M12 16v-3.5a2 2 0 014 0V16M12 10v6" />
    </svg>
  );
}
