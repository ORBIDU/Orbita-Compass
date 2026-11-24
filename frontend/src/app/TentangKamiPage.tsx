import { TENTANG_CTA, TENTANG_PAGE_TITLE } from "@/content/tentangKami";
import { whatsappLink } from "@/config/brand";
import { usePageTitle } from "@/lib/usePageTitle";
import TentangHero from "@/components/tentang/TentangHero";
import { EkosistemSection, JourneySection, MisiSection, StorySection } from "@/components/tentang/TentangSections";
import TentangTim from "@/components/tentang/TentangTim";
import NavyCta from "@/components/landing/NavyCta";

/**
 * Tentang Kami (/tentang-kami), desain docs/design/publik/TentangKami-Desktop.webp
 * tanpa bagian "Hubungi Kami" (sudah ada di /faq). Teks di src/content/tentangKami.ts.
 */
export default function TentangKamiPage() {
  usePageTitle(TENTANG_PAGE_TITLE);
  const C = TENTANG_CTA;

  return (
    <div className="font-sans text-space-2">
      <TentangHero />
      <StorySection />
      <JourneySection />
      <MisiSection />
      <TentangTim />
      <EkosistemSection />
      <NavyCta
        title={
          <>
            {C.titleLead}
            <span className="text-sun-2">{C.titleAccent}</span>
          </>
        }
        body={C.body}
        cta={C.cta}
        href={whatsappLink("sekolah")}
      />
    </div>
  );
}
