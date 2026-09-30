import { BIDANG, COVER_CLASSES } from "@/config/bidang";
import type { JurusanSummary } from "@/types/jurusan";

interface JurusanCoverProps {
  jurusan: Pick<JurusanSummary, "name" | "bidang" | "imageUrl">;
  /** Teks kecil di pojok saat foto belum ada. */
  placeholderLabel?: string;
  className?: string;
}

/**
 * Sampul kartu jurusan. Jika `imageUrl` sudah ada, tampil fotonya.
 * Jika belum, tampil sampul berwarna dengan ikon sesuai bidang.
 */
export default function JurusanCover({ jurusan, placeholderLabel, className = "" }: JurusanCoverProps) {
  const bidang = BIDANG[jurusan.bidang];
  const theme = COVER_CLASSES[bidang.theme];
  const Icon = bidang.icon;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${jurusan.imageUrl ? "bg-surface-soft" : theme.bg} ${className}`}>
      {jurusan.imageUrl ? (
        <img src={jurusan.imageUrl} alt={jurusan.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <svg viewBox="0 0 282 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 h-full w-full">
            <ellipse cx="141" cy="90" rx="130" ry="44" fill="none" strokeWidth="1.5" transform="rotate(-12 141 90)" className={`${theme.stroke} [stroke-opacity:0.18]`} />
            <circle cx="40" cy="36" r="3" className={`${theme.fill} [fill-opacity:0.3]`} />
            <circle cx="244" cy="140" r="4" className="fill-sun-1 [fill-opacity:0.5]" />
          </svg>
          <Icon aria-hidden="true" strokeWidth={1.4} className={`relative h-[60px] w-[60px] lg:h-[68px] lg:w-[68px] ${theme.ink}`} />
          {placeholderLabel && <span className={`absolute right-3 top-2.5 text-[11px] font-medium ${theme.ink}`}>{placeholderLabel}</span>}
        </>
      )}
      <span className="absolute bottom-3 left-3 rounded-lg bg-sun-1 px-[9px] py-1 text-[11px] font-semibold text-space-2 lg:px-2.5 lg:py-[5px] lg:text-xs">
        {bidang.label}
      </span>
    </div>
  );
}
