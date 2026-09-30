import {
  BookOpenCheck,
  Brain,
  CalendarCheck,
  Compass,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  PenLine,
  Rocket,
  Search,
  Target,
  type LucideIcon,
} from "lucide-react";
import { BRAND } from "@/config/brand";

/** Semua URL aplikasi di satu tempat (sesuai peta halaman docs/SPEK_SISWA.md). */
export const ROUTES = {
  landing: "/",
  jurusan: "/jurusan",
  jurusanDetail: (id: string) => `/jurusan/${id}`,
  masuk: "/masuk",
  daftar: "/daftar",
  portal: "/portal",
  analisisPotensi: "/portal/analisis-potensi",
  compass: "/portal/compass",
  beasiswa: "/portal/beasiswa",
  actionPlan: "/portal/action-plan",
  persiapan: "/portal/persiapan",
  persiapanSnbp: "/portal/persiapan/snbp",
  persiapanUjian: (ujian: UjianKey) => `/portal/persiapan/${ujian}`,
  profil: "/portal/profil",
} as const;

export type UjianKey = "tka" | "snbt" | "skd";
export const UJIAN_KEYS: UjianKey[] = ["tka", "snbt", "skd"];

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** true = aktif hanya jika URL sama persis (untuk Dashboard). */
  end?: boolean;
}

export interface PersiapanItem {
  label: string;
  description: string;
  icon: LucideIcon;
  /** null = belum tersedia, tampil "Segera hadir" dan tidak bisa diklik. */
  to: string | null;
}

// Menu portal, berurutan sesuai SPEK bagian 4. "Persiapan" berupa dropdown
// dan disisipkan setelah Action Plan oleh komponen menu.
export const PORTAL_NAV_BEFORE: NavItem[] = [
  { label: "Dashboard", to: ROUTES.portal, icon: LayoutDashboard, end: true },
  { label: "Analisis Potensi", to: ROUTES.analisisPotensi, icon: Brain },
  { label: BRAND.compassName, to: ROUTES.compass, icon: Compass },
  { label: "Action Plan", to: ROUTES.actionPlan, icon: CalendarCheck },
];

export const PORTAL_NAV_AFTER: NavItem[] = [{ label: "Explore Jurusan", to: ROUTES.jurusan, icon: Search }];

export const PERSIAPAN_LABEL = "Persiapan";
export const PERSIAPAN_ICON = GraduationCap;

export const PERSIAPAN_ITEMS: PersiapanItem[] = [
  { label: "Siap SNBP", description: "Cek peluang lewat nilai rapor", icon: BookOpenCheck, to: ROUTES.persiapanSnbp },
  { label: "Siap TKA", description: "Latihan Tes Kemampuan Akademik", icon: Target, to: ROUTES.persiapanUjian("tka") },
  { label: "Siap SNBT", description: "Latihan dan tryout UTBK-SNBT", icon: PenLine, to: ROUTES.persiapanUjian("snbt") },
  { label: "Siap SKD", description: "Latihan tes sekolah kedinasan", icon: Landmark, to: ROUTES.persiapanUjian("skd") },
  { label: "Siap Mandiri", description: "Ujian mandiri kampus", icon: Rocket, to: null },
];
