import { FOOTER } from "@/content/landing";
import Logo from "@/components/ui/Logo";
import { CONTAINER } from "./primitives";

/** Footer ringkas halaman publik selain beranda (logo + hak cipta), sesuai desain detail jurusan. */
export default function SimpleFooter() {
  return (
    // pb ekstra di HP supaya teks tidak tertutup tombol konsultasi.
    <footer className="on-dark bg-space-2 pb-24 pt-8 lg:py-10">
      <div className={`${CONTAINER} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
        <Logo tone="dark" size="sm" />
        <span className="text-sm text-night-dim">{FOOTER.copyright(new Date().getFullYear())}</span>
      </div>
    </footer>
  );
}
