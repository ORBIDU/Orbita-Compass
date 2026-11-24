import { SEKOLAH_CTA, SEKOLAH_PAGE_TITLE } from "@/content/untukSekolah";
import { whatsappLink } from "@/config/brand";
import { usePageTitle } from "@/lib/usePageTitle";
import SekolahHero from "@/components/sekolah/SekolahHero";
import PeranSection from "@/components/sekolah/PeranSection";
import ManfaatSection from "@/components/sekolah/ManfaatSection";
import LangkahSection from "@/components/sekolah/LangkahSection";
import NavyCta from "@/components/landing/NavyCta";

/**
 * Untuk Sekolah (/untuk-sekolah), desain docs/design/publik/UntukSekolah-Desktop.jpg.
 * Teks di src/content/untukSekolah.ts; header, footer, dan tombol konsultasi dari PublicLayout.
 */
export default function UntukSekolahPage() {
  usePageTitle(SEKOLAH_PAGE_TITLE);
  const C = SEKOLAH_CTA;

  return (
    <div className="font-sans text-space-2">
      <SekolahHero />
      <PeranSection />
      <ManfaatSection />
      <LangkahSection />
      <NavyCta
        title={
          <>
            <span className="block">{C.titleTop}</span>
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
