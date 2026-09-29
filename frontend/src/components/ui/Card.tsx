import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Jarak dalam kartu. Default "md". */
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" } as const;

/** Kartu putih dengan sudut membulat besar dan bayangan lembut. */
export default function Card({ padding = "md", className = "", ...props }: CardProps) {
  return <div className={`rounded-card bg-white shadow-card ${PADDING[padding]} ${className}`} {...props} />;
}
