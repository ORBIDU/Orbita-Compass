import { Building2, Globe, GraduationCap, Landmark, MapPin, Shield, type LucideIcon } from "lucide-react";
import type { ScholarshipProvider } from "@/types/beasiswa";

/** Ikon dan warna petak untuk tiap jenis penyelenggara beasiswa. */
export const PROVIDER_STYLE: Record<ScholarshipProvider, { icon: LucideIcon; tile: string }> = {
  pemerintah: { icon: Landmark, tile: "bg-tint-blue-bg text-cover-blue-ink" },
  kampus: { icon: GraduationCap, tile: "bg-tint-orange-bg text-tint-orange-fg" },
  daerah: { icon: MapPin, tile: "bg-tint-teal-bg text-tint-teal-fg" },
  swasta: { icon: Building2, tile: "bg-tint-green-bg text-tint-green-fg" },
  luarNegeri: { icon: Globe, tile: "bg-tint-blue-bg text-cover-blue-ink" },
  kedinasan: { icon: Shield, tile: "bg-tint-navy-bg text-tint-navy-fg" },
};
