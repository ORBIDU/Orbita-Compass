import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/navigation";
import { whatsappLink } from "@/config/brand";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Id section beranda yang bisa dituju lewat tombol atau /#id. */
export type LandingSection = "masalah" | "tenang" | "perjalanan" | "faq";

/**
 * Tujuan tombol-tombol beranda. Tidak ada pendaftaran mandiri: tamu diajak
 * berlangganan lewat WhatsApp atau masuk; siswa yang sudah login langsung ke
 * halaman portal terkait.
 */
export function useLandingNav() {
  const { status, user } = useAuth();
  const loggedIn = status === "authenticated";
  const portalTo = user?.role === "WALI_KELAS" ? ROUTES.walikelas : ROUTES.portal;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  const scrollTo = useCallback(
    (id: LandingSection | "top") => {
      // Dari halaman lain: pindah ke beranda dulu, LandingPage yang akan scroll.
      if (pathname !== ROUTES.landing) {
        navigate(id === "top" ? ROUTES.landing : `${ROUTES.landing}#${id}`);
        return;
      }
      const behavior = reduced ? "auto" : "smooth";
      if (id === "top") {
        window.scrollTo({ top: 0, behavior });
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    },
    [navigate, pathname, reduced],
  );

  return {
    loggedIn,
    portalTo,
    scrollTo,
    /** "Berlangganan": WhatsApp dengan pesan template (brand.ts). */
    subscribeHref: whatsappLink("berlangganan"),
    /** Kartu "Kenali Diri" */
    kenaliTo: loggedIn ? ROUTES.analisisPotensi : ROUTES.masuk,
    /** Kartu "Susun Langkah" */
    actionPlanTo: loggedIn ? ROUTES.actionPlan : ROUTES.masuk,
  };
}
