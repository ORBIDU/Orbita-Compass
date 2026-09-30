import type { ReactNode } from "react";
import { BIDANG, COVER_CLASSES } from "@/config/bidang";
import type { JurusanSummary } from "@/types/jurusan";

interface JurusanCoverProps {
  jurusan: Pick<JurusanSummary, "name" | "bidang" | "imageUrl">;
  /** "card" untuk kartu (dengan label bidang), "hero" untuk sampul besar di halaman detail. */
  variant?: "card" | "hero";
  /** Teks kecil di pojok saat foto belum ada. */
  placeholderLabel?: string;
  /** Isi tambahan di pojok kiri atas (mis. label kecocokan). */
  topLeft?: ReactNode;
  className?: string;
}

/**
 * Sampul jurusan. Jika `imageUrl` sudah ada, tampil fotonya.
 * Jika belum, tampil sampul berwarna dengan ikon sesuai bidang.
 */
export default function JurusanCover({ jurusan, variant = "card", placeholderLabel, topLeft, className = "" }: JurusanCoverProps) {
  const bidang = BIDANG[jurusan.bidang];
  const theme = COVER_CLASSES[bidang.theme];
  const Icon = bidang.icon;
  const hero = variant === "hero";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${jurusan.imageUrl ? "bg-surface-soft" : theme.bg} ${className}`}>
      {jurusan.imageUrl ? (
        <img src={jurusan.imageUrl} alt={jurusan.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          {hero ? (
            <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
              <ellipse cx="600" cy="200" rx="540" ry="140" fill="none" strokeWidth="2" transform="rotate(-8 600 200)" className={`${theme.stroke} [stroke-opacity:0.14]`} />
              <ellipse cx="600" cy="200" rx="380" ry="96" fill="none" strokeWidth="2" transform="rotate(-8 600 200)" className={`${theme.stroke} [stroke-opacity:0.1]`} />
              <circle cx="170" cy="120" r="6" className="fill-sun-1 [fill-opacity:0.6]" />
              <circle cx="1040" cy="300" r="8" className="fill-orbit-1 [fill-opacity:0.35]" />
            </svg>
          ) : (
            <svg viewBox="0 0 282 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
              <ellipse cx="141" cy="90" rx="130" ry="44" fill="none" strokeWidth="1.5" transform="rotate(-12 141 90)" className={`${theme.stroke} [stroke-opacity:0.18]`} />
              <circle cx="40" cy="36" r="3" className={`${theme.fill} [fill-opacity:0.3]`} />
              <circle cx="244" cy="140" r="4" className="fill-sun-1 [fill-opacity:0.5]" />
            </svg>
          )}
          <Icon
            aria-hidden="true"
            strokeWidth={hero ? 1.2 : 1.4}
            className={`relative ${hero ? "h-20 w-20 sm:h-[120px] sm:w-[120px]" : "h-[60px] w-[60px] lg:h-[68px] lg:w-[68px]"} ${theme.ink}`}
          />
          {placeholderLabel &&
            (hero ? (
              <span className="absolute right-4 top-3.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-tint-blue-fg sm:right-5 sm:top-4">
                {placeholderLabel}
              </span>
            ) : (
              <span className={`absolute right-3 top-2.5 text-[11px] font-medium ${theme.ink}`}>{placeholderLabel}</span>
            ))}
        </>
      )}
      {topLeft && <div className="absolute left-3 top-2.5">{topLeft}</div>}
      {!hero && (
        <span className="absolute bottom-3 left-3 rounded-lg bg-sun-1 px-[9px] py-1 text-[11px] font-semibold text-space-2 lg:px-2.5 lg:py-[5px] lg:text-xs">
          {bidang.label}
        </span>
      )}
    </div>
  );
}
