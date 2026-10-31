import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Info, Trophy } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { AKUN } from "@/content/profil";
import { formatDate } from "@/lib/datetime";

interface AccountCardProps {
  email: string;
  canChangePassword: boolean;
  /** null = belum tercatat; undefined = belum bisa dibaca. */
  parentConsentAt: string | null | undefined;
  onChangePassword: () => void;
}

/** Akun ORBIDU: email akun, ganti password, persetujuan orang tua/wali, dan pintasan ke Analisis Potensi. */
export default function AccountCard({ email, canChangePassword, parentConsentAt, onChangePassword }: AccountCardProps) {
  const consent =
    parentConsentAt === undefined
      ? { ok: false, title: AKUN.consentUnknown, body: AKUN.consentUnknownBody }
      : parentConsentAt === null
        ? { ok: false, title: AKUN.consentMissing, body: AKUN.consentMissingBody }
        : { ok: true, title: AKUN.consentOk, body: AKUN.consentOkDate(formatDate(parentConsentAt)) };
  return (
    <>
      <section aria-labelledby="pf-akun" className="flex flex-col gap-3.5 rounded-card border border-rim-soft bg-white p-5">
        <h2 id="pf-akun" className="text-base font-bold text-space-2">
          {AKUN.title}
        </h2>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-prose-dim">{AKUN.email}</span>
          <span className="break-all text-sm font-medium text-space-2">{email}</span>
          <span className="text-xs text-prose-dim">{AKUN.emailHint}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex flex-col gap-0.5">
            <span className="text-xs text-prose-dim">{AKUN.password}</span>
            <span aria-hidden="true" className="text-sm font-medium tracking-[2px] text-space-2">
              ••••••••
            </span>
          </span>
          <button
            type="button"
            onClick={onChangePassword}
            disabled={!canChangePassword}
            aria-haspopup="dialog"
            aria-describedby={canChangePassword ? undefined : "pf-pw-note"}
            className="h-10 rounded-[10px] border-[1.5px] border-rim bg-white px-3.5 text-[13px] font-semibold text-orbit-1 hover:bg-surface-sky disabled:cursor-not-allowed disabled:text-field-hint disabled:hover:bg-white"
          >
            {AKUN.change}
          </button>
        </div>
        {!canChangePassword && (
          <p id="pf-pw-note" className="text-xs leading-normal text-prose-dim">
            {AKUN.changeUnavailable}
          </p>
        )}
        <div className={`flex items-start gap-2.5 rounded-xl p-3 ${consent.ok ? "bg-tint-green-bg" : "bg-surface-soft"}`}>
          {consent.ok ? (
            <CheckCircle2 size={18} aria-hidden="true" className="mt-px shrink-0 text-tint-green-fg" />
          ) : (
            <Info size={18} aria-hidden="true" className="mt-px shrink-0 text-prose" />
          )}
          <span className="flex flex-col gap-0.5">
            <span className={`text-[13px] font-semibold ${consent.ok ? "text-tint-green-fg" : "text-space-1"}`}>{consent.title}</span>
            <span className="text-xs text-prose">{consent.body}</span>
          </span>
        </div>
      </section>

      <Link
        to={ROUTES.analisisPotensi}
        className="flex items-center gap-3.5 rounded-[18px] border border-rim-soft bg-white px-[18px] py-4 text-space-2 hover:bg-surface-soft"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-orange-bg text-tint-orange-fg">
          <Trophy size={20} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-sm font-semibold">{AKUN.shortcutTitle}</span>
          <span className="text-xs text-prose">{AKUN.shortcutBody}</span>
        </span>
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" className="text-orbit-1" />
      </Link>
    </>
  );
}
