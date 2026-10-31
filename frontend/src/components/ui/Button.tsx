import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  // Aksi utama: gradient biru
  primary: "bg-gradient-orbit text-white shadow-cta hover:opacity-90",
  // CTA paling penting: gradient oranye (pakai hemat)
  outline: "border border-orbit-1 text-orbit-1 bg-white hover:bg-cloud",
  ghost: "text-ink-soft hover:bg-page",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-2xl",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return [
    "inline-flex items-center justify-center gap-2 font-semibold transition",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orbit-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANT[variant],
    SIZE[size],
    extra,
  ].join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({ variant, size, className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Tampilan tombol, tetapi berupa tautan ke halaman lain. */
export function ButtonLink({ variant, size, className = "", ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
