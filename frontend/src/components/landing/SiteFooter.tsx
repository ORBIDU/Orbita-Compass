import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { FOOTER } from "@/content/landing";
import { BRAND, CONTACT } from "@/config/brand";
import { ROUTES } from "@/config/navigation";
import Logo from "@/components/ui/Logo";
import { ExternalLink } from "./primitives";
import { InstagramIcon, LinkedinIcon } from "./SocialIcons";
import { useLandingNav } from "./useLandingNav";

type FooterTarget =
  | (typeof FOOTER.explore.links)[number]["target"]
  | (typeof FOOTER.account.links)[number]["target"];

const LINK = "flex min-h-10 items-center text-sm text-night-text transition hover:text-night-light lg:min-h-0 lg:text-[15px]";
const HEADING = "mb-1.5 text-sm font-semibold text-night-light lg:mb-0 lg:text-[15px]";

/** Footer halaman publik (di atas latar navy, dipakai bersama Final CTA). */
export default function SiteFooter() {
  const { scrollTo, subscribeHref } = useLandingNav();

  function renderLink(label: string, target: FooterTarget) {
    switch (target) {
      case "beranda":
        return (
          <button type="button" onClick={() => scrollTo("top")} className={`${LINK} text-left`}>
            {label}
          </button>
        );
      case "faq":
        return (
          <button type="button" onClick={() => scrollTo("faq")} className={`${LINK} text-left`}>
            {label}
          </button>
        );
      case "jurusan":
        return (
          <Link to={ROUTES.jurusan} className={LINK}>
            {label}
          </Link>
        );
      case "masuk":
        return (
          <Link to={ROUTES.masuk} className={LINK}>
            {label}
          </Link>
        );
      case "berlangganan":
        return (
          <ExternalLink href={subscribeHref} className={LINK}>
            {label}
          </ExternalLink>
        );
    }
  }

  const contactItem = "flex min-h-10 items-center gap-2.5 text-sm text-night-text lg:min-h-0 lg:text-[15px]";

  return (
    <footer className="relative flex flex-col gap-8 border-t border-night-line pt-10 lg:gap-10 lg:pt-14">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,400px)_repeat(3,minmax(0,1fr))] lg:gap-12">
        <div className="flex flex-col gap-3 lg:gap-3.5">
          <Logo tone="dark" size="sm" className="lg:hidden" />
          <Logo tone="dark" size="md" className="hidden lg:inline-flex" />
          <p className="max-w-[320px] text-sm leading-[1.65] text-night-text lg:text-[15px]">{FOOTER.description}</p>
        </div>

        {/* Di HP, Jelajahi dan Akun berdampingan. lg:contents membuat keduanya ikut grid desktop. */}
        <div className="grid grid-cols-2 gap-6 lg:contents">
          <nav aria-label={FOOTER.explore.title} className="flex flex-col gap-0.5 lg:gap-3">
            <span className={HEADING}>{FOOTER.explore.title}</span>
            {FOOTER.explore.links.map((l) => (
              <span key={l.target}>{renderLink(l.label, l.target)}</span>
            ))}
          </nav>
          <nav aria-label={FOOTER.account.title} className="flex flex-col gap-0.5 lg:gap-3">
            <span className={HEADING}>{FOOTER.account.title}</span>
            {FOOTER.account.links.map((l) => (
              <span key={l.target}>{renderLink(l.label, l.target)}</span>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-0.5 lg:gap-3">
          <span className={HEADING}>{FOOTER.contactTitle}</span>
          <a href={`mailto:${CONTACT.email}`} className={`${contactItem} hover:text-night-light`}>
            <Mail size={18} strokeWidth={1.8} aria-hidden="true" />
            {CONTACT.email}
          </a>
          <ExternalLink href={CONTACT.instagram.url} className={`${contactItem} hover:text-night-light`}>
            <InstagramIcon />
            {CONTACT.instagram.handle}
          </ExternalLink>
          <ExternalLink href={CONTACT.linkedin.url} className={`${contactItem} hover:text-night-light`}>
            <LinkedinIcon />
            {CONTACT.linkedin.label}
          </ExternalLink>
          <span className={contactItem}>
            <MapPin size={18} strokeWidth={1.8} aria-hidden="true" />
            {BRAND.location}
          </span>
        </div>
      </div>
      <span className="text-[13px] text-night-dim lg:text-sm">{FOOTER.copyright(new Date().getFullYear())}</span>
    </footer>
  );
}
