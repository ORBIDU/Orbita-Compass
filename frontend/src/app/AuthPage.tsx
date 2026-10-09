import { ACCOUNT_ACCESS } from "@/content/common";
import { AUTH_MASUK, AUTH_PANEL } from "@/content/auth";
import { whatsappLink } from "@/config/brand";
import MasukForm from "@/components/auth/MasukForm";
import { usePageTitle } from "@/lib/usePageTitle";
import { PAGE_TITLES } from "@/content/common";

/**
 * Halaman Masuk (/masuk). Tidak ada pendaftaran mandiri: akun dibuat setelah
 * berlangganan. Setelah berhasil, GuestOnly (routes/guards.tsx) yang
 * menentukan halaman tujuan (atau /aktivasi untuk login pertama).
 */
export default function AuthPage() {
  usePageTitle(PAGE_TITLES.masuk);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-accent text-[26px] font-bold leading-none text-sun-1 lg:text-[28px]">{AUTH_PANEL.greeting}</p>
        <h1 className="text-[26px] font-bold leading-tight tracking-[-0.4px] text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">
          {AUTH_MASUK.title}
        </h1>
        <p className="text-[15px] leading-[1.55] text-prose">{AUTH_MASUK.subtitle}</p>
      </div>

      <MasukForm />

      <p className="text-center text-sm leading-relaxed text-prose">
        {ACCOUNT_ACCESS.note}{" "}
        <span className="whitespace-nowrap">
          {ACCOUNT_ACCESS.question}{" "}
          <a
            href={whatsappLink("berlangganan")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-semibold text-orbit-1 hover:underline"
          >
            {ACCOUNT_ACCESS.cta}
          </a>
          .
        </span>
      </p>
    </div>
  );
}
