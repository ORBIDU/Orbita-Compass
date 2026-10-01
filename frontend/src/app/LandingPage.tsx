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
import ConsultButton from "@/components/landing/ConsultButton";

/**
 * Beranda ORBIDU. Urutan section sesuai docs/SPEK_SISWA.md bagian 1.
 * Semua teks ada di src/content/landing.ts.
 */
export default function LandingPage() {
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
    <div className="public-site min-h-dvh overflow-x-clip bg-white font-sans text-space-2">
      <main>
        <HeroSection />
        <ProblemSection />
        <KenaliSection />
        <CompassSection />
        <JurusanSection />
        <ActionPlanSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <ConsultButton />
    </div>
  );
}
