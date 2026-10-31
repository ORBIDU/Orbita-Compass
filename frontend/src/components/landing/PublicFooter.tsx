import { Link } from "react-router-dom";
import { FOOTER, type FooterLink } from "@/content/landing";
import { whatsappLink } from "@/config/brand";
import Logo from "@/components/ui/Logo";
import { CONTAINER, ExternalLink } from "./primitives";

const LINK = "flex min-h-10 items-center text-sm text-night-text transition hover:text-night-light lg:min-h-0";

function FooterItem({ link }: { link: FooterLink }) {
  if ("whatsapp" in link) {
    return (
      <ExternalLink href={whatsappLink(link.whatsapp)} className={LINK}>
        {link.label}
      </ExternalLink>
    );
  }
  return (
    <Link to={link.to} className={LINK}>
      {link.label}
    </Link>
  );
}

/** Footer semua halaman publik (desain docs/design/publik), latar navy. */
export default function PublicFooter() {
  return (
    // pb ekstra supaya baris terakhir tidak tertutup tombol konsultasi (fixed di pojok kanan bawah).
    <footer className="on-dark border-t border-night-line bg-space-2 pb-28 pt-12 lg:pb-32 lg:pt-16">
      <div className={`${CONTAINER} flex flex-col gap-10`}>
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_200px_200px] lg:gap-12">
          <div className="flex flex-col gap-4">
            <Logo tone="dark" size="sm" />
            <p className="max-w-[440px] text-sm leading-[1.7] text-night-text">{FOOTER.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:contents">
            {FOOTER.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-0.5 lg:gap-3">
                <span className="mb-1.5 text-sm font-semibold text-night-light lg:mb-1">{col.title}</span>
                {col.links.map((link) => (
                  <FooterItem key={link.label} link={link} />
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-night-line pt-6 text-[13px] text-night-dim sm:flex-row sm:items-center sm:justify-between">
          <span>{FOOTER.copyright(new Date().getFullYear())}</span>
          <span>{FOOTER.location}</span>
        </div>
      </div>
    </footer>
  );
}
