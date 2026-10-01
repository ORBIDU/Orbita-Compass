import type { FitLabel } from "@/types/jurusan";

const STYLE: Record<FitLabel, string> = {
  "Sangat sesuai": "bg-tint-green-bg text-tint-green-fg",
  Sesuai: "bg-tint-blue-bg text-tint-blue-fg",
};

/** Label kecocokan dari Compass (tanpa persentase). */
export default function FitBadge({ label, className = "" }: { label: FitLabel; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-xs font-semibold ${STYLE[label]} ${className}`}>
      {label}
    </span>
  );
}
