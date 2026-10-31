import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/landing/sections/HeroSection";
import ProblemSection from "@/components/landing/sections/ProblemSection";
import KenaliSection from "@/components/landing/sections/KenaliSection";
import CompassSection from "@/components/landing/sections/CompassSection";
import JurusanSection from "@/components/landing/sections/JurusanSection";
import ActionPlanSection from "@/components/landing/sections/ActionPlanSection";
import FaqSection from "@/components/landing/sections/FaqSection";
import FinalCtaSection from "@/components/landing/sections/FinalCtaSection";
import { HOME_TITLE } from "@/lib/usePageTitle";

/**
 * Beranda ORBIDU. Urutan section sesuai docs/SPEK_SISWA.md bagian 1.
 * Semua teks ada di src/content/landing.ts. Header, footer, dan tombol
 * konsultasi dari PublicLayout.
 */
export default function LandingPage() {
  // Beranda memakai judul lengkap dengan tagline.
  useEffect(() => {
    document.title = HOME_TITLE;
  }, []);
  const { hash } = useLocation();

  // Dukung tautan /#faq, /#jurusan, dll. (mis. dari footer halaman lain).
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    // Tunggu satu frame supaya section sudah tampil.
    const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(raf);
  }, [hash]);

  return (
    <div className="font-sans text-space-2">
      <HeroSection />
      <ProblemSection />
      <KenaliSection />
      <CompassSection />
      <JurusanSection />
      <ActionPlanSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
