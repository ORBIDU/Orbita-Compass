import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/navigation";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Id section beranda yang bisa dituju lewat tombol atau /#id. */
export type LandingSection = "masalah" | "kenali" | "compass" | "jurusan" | "action-plan" | "faq";

/**
 * Tujuan tombol-tombol beranda. Tamu diarahkan ke /daftar, siswa yang
 * sudah login langsung ke halaman portal terkait.
 */
export function useLandingNav() {
  const { status } = useAuth();
  const loggedIn = status === "authenticated";
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
    scrollTo,
    /** "Mulai Perjalanan" */
    mulaiTo: loggedIn ? ROUTES.portal : ROUTES.daftar,
    /** "Kenali Dirimu" */
    kenaliTo: loggedIn ? ROUTES.analisisPotensi : ROUTES.daftar,
    /** "Mulai Action Plan" */
    actionPlanTo: loggedIn ? ROUTES.actionPlan : ROUTES.daftar,
  };
}
