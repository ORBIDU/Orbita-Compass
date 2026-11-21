import type { CSSProperties } from "react";

interface SiluetProps {
  /** Gambar dari desain (SVG). Bentuknya dipakai apa adanya, warnanya diganti. */
  src: string;
  /** Warna isi, biasanya token gradient Tailwind (mis. "bg-pohon-malam"). */
  fill: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Gambar dari desain (pohon, awan, bukit) yang digambar ulang sebagai siluet
 * rata dengan gradasi halus: bentuk dan posisinya sama, gayanya lebih bersih.
 * Gambar asli tetap dimuat (tak terlihat) supaya ukurannya mengikuti rasio aslinya.
 */
export default function Siluet({ src, fill, className = "", style }: SiluetProps) {
  // Tanda kutip wajib: SVG kecil di-inline Vite sebagai data URL yang berisi spasi.
  const mask = `url("${src}") center / 100% 100% no-repeat`;
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute block select-none ${className}`} style={style}>
      <img src={src} alt="" className="invisible block h-auto w-full" />
      <span className={`absolute inset-0 ${fill}`} style={{ mask, WebkitMask: mask }} />
    </span>
  );
}
