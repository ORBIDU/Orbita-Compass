import { Link } from "react-router-dom";
import { TENTANG_CTA, TENTANG_PAGE_TITLE } from "@/content/tentangKami";
import { ROUTES } from "@/config/navigation";
import { whatsappLink } from "@/config/brand";
import { usePageTitle } from "@/lib/usePageTitle";
import TentangHero from "@/components/tentang/TentangHero";
import { AlasanSection, PerjalananSection, PrinsipSection } from "@/components/tentang/TentangSections";
import NavyCta from "@/components/landing/NavyCta";
import { pillClasses } from "@/components/landing/primitives";

/**
 * Tentang Kami (/tentang-kami). Belum ada desain dari tim UI/UX; disusun
 * dengan gaya situs publik yang sama (lihat docs/design/publik/README.md).
 * Teks di src/content/tentangKami.ts.
 */
export default function TentangKamiPage() {
  usePageTitle(TENTANG_PAGE_TITLE);
  const C = TENTANG_CTA;

  return (
    <div className="font-sans text-space-2">
      <TentangHero />
      <AlasanSection />
      <PrinsipSection />
      <PerjalananSection />
      <NavyCta
        title={
          <>
            {C.titleLead}
            <span className="text-sun-2">{C.titleAccent}</span>
          </>
        }
        body={C.body}
        cta={C.cta}
        href={whatsappLink("faq")}
        extra={
          <Link to={ROUTES.untukSekolah} className={pillClasses("outline", "h-[54px] border-white/40 bg-white/10 px-8 text-white hover:bg-white/20")}>
            {C.secondary}
          </Link>
        }
      />
    </div>
  );
}
