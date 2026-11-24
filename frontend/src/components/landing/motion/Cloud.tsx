import type { CSSProperties } from "react";

/**
 * Awan lembut (bentuk dari hero Tentang Kami), bergeser pelan.
 * Dipakai di semua hero publik; posisi dan ukuran lewat className/style.
 */
export default function Cloud({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 220 80" aria-hidden="true" className={`pointer-events-none absolute h-auto motion-safe:animate-ob-awan ${className}`} style={style}>
      <g className="fill-white">
        <ellipse cx="70" cy="52" rx="58" ry="26" />
        <ellipse cx="118" cy="38" rx="46" ry="34" />
        <ellipse cx="160" cy="54" rx="48" ry="24" />
        <rect x="20" y="52" width="190" height="26" rx="13" />
      </g>
    </svg>
  );
}
