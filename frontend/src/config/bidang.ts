import {
  Activity,
  BarChart3,
  Brain,
  Code2,
  GraduationCap,
  Landmark,
  PenTool,
  Scale,
  Shield,
  Sigma,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { BidangKey } from "@/types/jurusan";

/** Tema warna sampul (lihat token `cover-*` di tailwind.config.js). */
export type CoverTheme = "blue" | "orange" | "teal" | "navy" | "amber";

interface BidangInfo {
  label: string;
  theme: CoverTheme;
  icon: LucideIcon;
}

/** Label, warna sampul, dan ikon untuk setiap bidang jurusan (urutan = urutan chip filter). */
export const BIDANG: Record<BidangKey, BidangInfo> = {
  teknologi: { label: "Teknologi & Informatika", theme: "blue", icon: Code2 },
  sains: { label: "Matematika & Sains Data", theme: "teal", icon: Sigma },
  kesehatan: { label: "Kesehatan", theme: "orange", icon: Activity },
  teknik: { label: "Teknik & Industri", theme: "blue", icon: Landmark },
  ekonomi: { label: "Ekonomi & Bisnis", theme: "amber", icon: BarChart3 },
  hukum: { label: "Hukum", theme: "navy", icon: Scale },
  sosial: { label: "Sosial & Humaniora", theme: "teal", icon: Brain },
  pendidikan: { label: "Pendidikan", theme: "teal", icon: GraduationCap },
  desain: { label: "Desain & Seni", theme: "orange", icon: PenTool },
  pertanian: { label: "Pertanian", theme: "amber", icon: Sprout },
  kedinasan: { label: "Kedinasan", theme: "navy", icon: Shield },
};

export const BIDANG_KEYS = Object.keys(BIDANG) as BidangKey[];

/**
 * Kelas Tailwind per tema. Ditulis lengkap (bukan disusun dari string)
 * supaya Tailwind bisa menemukannya saat build.
 */
export const COVER_CLASSES: Record<CoverTheme, { bg: string; ink: string; stroke: string; fill: string }> = {
  blue: { bg: "bg-cover-blue-bg", ink: "text-cover-blue-ink", stroke: "stroke-cover-blue-ink", fill: "fill-cover-blue-ink" },
  orange: { bg: "bg-cover-orange-bg", ink: "text-cover-orange-ink", stroke: "stroke-cover-orange-ink", fill: "fill-cover-orange-ink" },
  teal: { bg: "bg-cover-teal-bg", ink: "text-cover-teal-ink", stroke: "stroke-cover-teal-ink", fill: "fill-cover-teal-ink" },
  navy: { bg: "bg-cover-navy-bg", ink: "text-cover-navy-ink", stroke: "stroke-cover-navy-ink", fill: "fill-cover-navy-ink" },
  amber: { bg: "bg-cover-amber-bg", ink: "text-cover-amber-ink", stroke: "stroke-cover-amber-ink", fill: "fill-cover-amber-ink" },
};
