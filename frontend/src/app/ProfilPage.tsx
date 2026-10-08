import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Landmark } from "lucide-react";
import { ROUTES } from "@/config/navigation";
import { PASSWORD_DIALOG, PROFIL_HEADER, SECTIONS } from "@/content/profil";
import { useAuth } from "@/context/AuthContext";
import { buildSections, formatDate } from "@/lib/profil";
import { formatKelas, toDisplayUser } from "@/lib/user";
import { useAsync } from "@/lib/useAsync";
import { changePassword, getProfil, setAvatar, setNickname } from "@/services/profileService";
import PageLoader from "@/components/ui/PageLoader";
import { PanelError, PanelSkeleton } from "@/components/ui/PanelState";
import IdentityCard from "@/components/profil/IdentityCard";
import AccountCard from "@/components/profil/AccountCard";
import InfoSection from "@/components/profil/InfoSection";
import PasswordDialog from "@/components/profil/PasswordDialog";

/**
 * Profil (/portal/profil), sesuai docs/design/portal/Portal-Profil.dc.html.
 * Data diri diisi pihak kurikulum sekolah dan hanya dibaca; siswa hanya
 * mengubah nama panggilan, foto, dan password (SPEK bagian 11).
 */
export default function ProfilPage() {
  const { user, refreshUser } = useAuth();
  const profil = useAsync(() => (user ? getProfil(user) : Promise.reject(new Error("no user"))), [user?.id, user?.profile?.nickname, user?.avatarUrl], Boolean(user));
  const [pwOpen, setPwOpen] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const sections = useMemo(() => (profil.data ? buildSections(profil.data) : []), [profil.data]);

  if (!user) return <PageLoader />;
  const display = toDisplayUser(user);
  const v = profil.data;

  let body;
  if (profil.loading && !v) body = <PanelSkeleton />;
  else if (profil.error || !v) body = <PanelError onRetry={profil.reload} />;
  else {
    const subtitle = [formatKelas(v.grade), v.schoolName].filter(Boolean).join(" · ");
    body = (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
          <IdentityCard
            name={v.name}
            initials={display.initials}
            subtitle={subtitle}
            avatarUrl={v.avatarUrl}
            nickname={v.nickname}
            savedOnServer={v.savedOnServer}
            onSaveNickname={async (nick) => {
              await setNickname(user.id, nick);
              // Sapaan Dashboard dan header membaca data user, jadi ambil ulang.
              await refreshUser();
            }}
            onSaveAvatar={async (dataUrl) => {
              await setAvatar(user.id, dataUrl);
              await refreshUser();
            }}
          />
          {pwSaved && (
            <p role="status" className="flex items-center gap-2 rounded-xl bg-tint-green-bg px-4 py-3 text-[13px] font-semibold text-tint-green-fg">
              <Check size={16} strokeWidth={2.6} aria-hidden="true" />
              {PASSWORD_DIALOG.success}
            </p>
          )}
          <AccountCard
            email={v.email}
            canChangePassword={v.canChangePassword}
            parentConsentAt={v.parentConsentAt}
            onChangePassword={() => {
              setPwSaved(false);
              setPwOpen(true);
            }}
          />
        </aside>
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          {sections.map((s) => (
            <InfoSection key={s.id} section={s} />
          ))}
          <p className="text-[13px] leading-relaxed text-prose-dim">{SECTIONS.footer}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-surface-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pb-8 pt-4 sm:px-6 lg:gap-[22px] lg:px-10 lg:pb-12 lg:pt-7">
        <div className="flex max-w-[760px] flex-col gap-1.5 lg:gap-2">
          <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[13px] text-prose-dim lg:flex">
            <Link to={ROUTES.portal} className="rounded hover:text-space-2 hover:underline">
              {PROFIL_HEADER.breadcrumbHome}
            </Link>
            <ChevronRight size={12} strokeWidth={2.4} aria-hidden="true" className="text-prose-faint" />
            <span aria-current="page" className="font-semibold text-space-2">
              {PROFIL_HEADER.title}
            </span>
          </nav>
          <h1 className="text-2xl font-bold leading-tight text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">{PROFIL_HEADER.title}</h1>
          <p className="text-sm leading-relaxed text-prose lg:text-[15px]">{PROFIL_HEADER.description}</p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl bg-surface-blue px-4 py-3.5 sm:flex-row sm:items-center sm:gap-3.5 sm:px-[18px]">
          <div className="flex flex-1 gap-3">
            <Landmark size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-orbit-1 sm:mt-0" />
            <p className="text-sm leading-normal text-space-1">
              {PROFIL_HEADER.infoBefore}
              <strong>{PROFIL_HEADER.infoStrong}</strong>
              {PROFIL_HEADER.infoAfter}
            </p>
          </div>
          {v?.school.updatedAt && <span className="shrink-0 pl-8 text-xs text-prose sm:pl-0">{PROFIL_HEADER.updated(formatDate(v.school.updatedAt))}</span>}
        </div>

        {body}
      </div>

      {pwOpen && (
        <PasswordDialog
          onClose={() => setPwOpen(false)}
          onSubmit={async (current, next) => {
            await changePassword(current, next);
            setPwOpen(false);
            setPwSaved(true);
          }}
        />
      )}
    </div>
  );
}
