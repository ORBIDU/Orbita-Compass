import { useEffect } from "react";
import HeroSection from "@/components/landing/sections/HeroSection";
import ProblemSection from "@/components/landing/sections/ProblemSection";
import TenangSection from "@/components/landing/sections/TenangSection";
import PerjalananSection from "@/components/landing/sections/PerjalananSection";
import FinalCtaSection from "@/components/landing/sections/FinalCtaSection";
import { HOME_TITLE } from "@/lib/usePageTitle";
import { useHashScroll } from "@/lib/useHashScroll";

/**
 * Beranda ORBIDU (docs/design/publik/Beranda-Desktop.jpg, SPEK bagian 1).
 * Semua teks ada di src/content/landing.ts. Header, footer, dan tombol
 * konsultasi dari PublicLayout.
 */
export default function LandingPage() {
  // Beranda memakai judul lengkap dengan tagline.
  useEffect(() => {
    document.title = HOME_TITLE;
  }, []);
  useHashScroll();

  return (
    <div className="font-sans text-space-2">
      <HeroSection />
      <ProblemSection />
      <TenangSection />
      <PerjalananSection />
      <FinalCtaSection />
    </div>
  );
}
