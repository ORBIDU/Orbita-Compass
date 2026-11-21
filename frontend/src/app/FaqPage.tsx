import { FAQ_PAGE_TITLE } from "@/content/faq";
import { usePageTitle } from "@/lib/usePageTitle";
import { useHashScroll } from "@/lib/useHashScroll";
import FaqHero from "@/components/faq/FaqHero";
import FaqList from "@/components/faq/FaqList";
import FaqKontak from "@/components/faq/FaqKontak";

/**
 * FAQ dan Hubungi Kami (/faq, docs/design/publik/FAQ-Desktop.jpg).
 * Teks di src/content/faq.ts.
 */
export default function FaqPage() {
  usePageTitle(FAQ_PAGE_TITLE);
  // Mendukung /faq#kontak (link "Hubungi Kami" di footer).
  useHashScroll();

  return (
    <div className="font-sans text-space-2">
      <FaqHero />
      <FaqList />
      <FaqKontak />
    </div>
  );
}
