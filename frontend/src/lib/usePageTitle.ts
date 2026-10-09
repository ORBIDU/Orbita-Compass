import { useEffect } from "react";
import { BRAND } from "@/config/brand";

/** Judul beranda, juga judul sementara selama data halaman belum dimuat. */
export const HOME_TITLE = `${BRAND.name} · ${BRAND.tagline}`;

/**
 * Judul tab browser per halaman: "Action Plan · ORBIDU". `null` atau string
 * kosong (mis. data belum dimuat) → nama brand saja.
 */
export function usePageTitle(title: string | null | undefined): void {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND.name}` : BRAND.name;
  }, [title]);
}
