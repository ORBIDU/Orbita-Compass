import type { FocusEventHandler, MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/navigation";
import type { JurusanSummary } from "@/types/jurusan";
import JurusanCover from "./JurusanCover";

interface JurusanCardProps {
  jurusan: JurusanSummary;
  photoPlaceholder?: string;
  className?: string;
  onFocus?: FocusEventHandler<HTMLAnchorElement>;
  onClickCapture?: MouseEventHandler<HTMLAnchorElement>;
  /** Mencegah gambar/link ikut terseret saat carousel di-swipe. */
  draggable?: boolean;
}

/** Kartu jurusan: sampul, nama, dan deskripsi singkat. Membuka /jurusan/:slug. */
export default function JurusanCard({ jurusan, photoPlaceholder, className = "", onFocus, onClickCapture, draggable }: JurusanCardProps) {
  return (
    <Link
      to={ROUTES.jurusanDetail(jurusan.slug)}
      onFocus={onFocus}
      onClickCapture={onClickCapture}
      draggable={draggable}
      className={`group flex flex-col overflow-hidden rounded-[18px] border border-rim bg-white transition hover:shadow-soft ${className}`}
    >
      <JurusanCover jurusan={jurusan} placeholderLabel={photoPlaceholder} className="h-[170px] lg:h-[180px]" />
      <div className="flex flex-col gap-1.5 px-4 pb-5 pt-4 lg:gap-2 lg:px-[18px] lg:pb-[22px] lg:pt-[18px]">
        <span className="text-lg font-semibold leading-[1.3] text-space-2 group-hover:text-orbit-1 lg:text-[19px]">{jurusan.name}</span>
        <span className="line-clamp-3 text-sm leading-[1.55] text-prose lg:leading-[1.6]">{jurusan.description}</span>
      </div>
    </Link>
  );
}
