import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Check, Loader2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { IDENTITY } from "@/content/profil";
import { checkAvatarFile, resizeAvatar } from "@/lib/avatar";
import { NICKNAME_MAX } from "@/types/profil";

interface IdentityCardProps {
  name: string;
  initials: string;
  subtitle: string;
  avatarUrl: string | null;
  nickname: string | null;
  /** false = tersimpan di browser (mode backend). */
  savedOnServer: boolean;
  onSaveNickname: (nickname: string) => Promise<void>;
  onSaveAvatar: (dataUrl: string | null) => Promise<void>;
}

/** Kartu identitas: foto profil + nama panggilan (dua hal yang bisa diubah siswa). */
export default function IdentityCard({ name, initials, subtitle, avatarUrl, nickname, savedOnServer, onSaveNickname, onSaveAvatar }: IdentityCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(nickname ?? "");
  const [nickError, setNickError] = useState<string | null>(null);
  const [nickBusy, setNickBusy] = useState(false);
  const [nickSaved, setNickSaved] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoSaved, setPhotoSaved] = useState(false);

  async function pickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoSaved(false);
    const err = checkAvatarFile(file);
    if (err) {
      setPhotoError(err === "type" ? IDENTITY.photoType : IDENTITY.photoSize);
      return;
    }
    setPhotoError(null);
    setPhotoBusy(true);
    try {
      await onSaveAvatar(await resizeAvatar(file));
      setPhotoSaved(true);
    } catch {
      setPhotoError(IDENTITY.photoError);
    } finally {
      setPhotoBusy(false);
    }
  }

  async function removePhoto() {
    setPhotoBusy(true);
    setPhotoError(null);
    try {
      await onSaveAvatar(null);
      setPhotoSaved(false);
    } catch {
      setPhotoError(IDENTITY.photoError);
    } finally {
      setPhotoBusy(false);
    }
  }

  async function saveNickname() {
    const value = draft.trim();
    if (!value) return setNickError(IDENTITY.nickRequired);
    if (value.length > NICKNAME_MAX) return setNickError(IDENTITY.nickTooLong);
    setNickBusy(true);
    setNickError(null);
    try {
      await onSaveNickname(value);
      setEditing(false);
      setNickSaved(true);
    } catch {
      setNickError(IDENTITY.nickError);
    } finally {
      setNickBusy(false);
    }
  }

  return (
    <section aria-label={IDENTITY.label} className="flex flex-col items-center gap-3.5 rounded-card border border-rim-soft bg-white p-5 text-center sm:p-6">
      <div className="relative">
        <Avatar src={avatarUrl} initials={initials} className="h-[104px] w-[104px] text-4xl" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={photoBusy}
          aria-label={IDENTITY.changePhoto}
          aria-describedby="pf-photo-hint"
          className="absolute -bottom-0.5 -right-0.5 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-space-2 text-white hover:brightness-125 disabled:cursor-wait"
        >
          {photoBusy ? <Loader2 size={18} aria-hidden="true" className="motion-safe:animate-spin" /> : <Camera size={18} aria-hidden="true" />}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={pickPhoto} className="sr-only" tabIndex={-1} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xl font-bold text-space-2">{name}</span>
        {subtitle && <span className="text-sm text-prose">{subtitle}</span>}
      </div>
      <div className="flex flex-col items-center gap-1 text-xs">
        <span id="pf-photo-hint" className="text-prose-dim">
          {IDENTITY.photoHint}
        </span>
        {avatarUrl && !photoBusy && (
          <button type="button" onClick={removePhoto} className="font-semibold text-orbit-1 hover:underline">
            {IDENTITY.removePhoto}
          </button>
        )}
        {photoError && (
          <span role="alert" className="text-alert-fg">
            {photoError}
          </span>
        )}
        {photoSaved && (
          <span role="status" className="flex items-center gap-1 font-semibold text-tint-green-fg">
            <Check size={14} strokeWidth={2.6} aria-hidden="true" />
            {IDENTITY.photoSaved}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 self-stretch rounded-[14px] bg-field-bg p-3.5 text-left">
        <span className="flex items-center justify-between gap-2">
          <span id="pf-nick-label" className="text-[13px] font-semibold text-prose">
            {IDENTITY.nickLabel}
          </span>
          <span className="rounded-full bg-tint-blue-bg px-2 py-0.5 text-[11px] font-semibold text-tint-blue-fg">{IDENTITY.nickBadge}</span>
        </span>
        {!editing ? (
          <>
            <div className="flex items-center justify-between gap-2.5">
              <span className={`text-base font-semibold ${nickname ? "text-space-2" : "italic text-prose-dim"}`}>{nickname ?? IDENTITY.nickEmpty}</span>
              <button
                type="button"
                onClick={() => {
                  setDraft(nickname ?? "");
                  setEditing(true);
                  setNickSaved(false);
                  setNickError(null);
                }}
                className="min-h-9 px-1 text-[13px] font-semibold text-orbit-1 hover:underline"
              >
                {IDENTITY.edit}
                <span className="sr-only"> {IDENTITY.nickLabel}</span>
              </button>
            </div>
            <span className="text-xs text-prose-dim">{IDENTITY.nickHint}</span>
          </>
        ) : (
          <>
            <input
              type="text"
              value={draft}
              maxLength={NICKNAME_MAX}
              autoFocus
              aria-labelledby="pf-nick-label"
              aria-invalid={nickError ? true : undefined}
              aria-describedby="pf-nick-help"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void saveNickname();
                if (e.key === "Escape") setEditing(false);
              }}
              className="h-11 rounded-xl border-[1.5px] border-orbit-1 bg-white px-3 text-base text-space-2 focus:outline-none focus:ring-2 focus:ring-orbit-1/20"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={nickBusy}
                className="h-10 flex-1 rounded-[10px] border-[1.5px] border-rim bg-white text-[13px] font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-50"
              >
                {IDENTITY.cancel}
              </button>
              <button
                type="button"
                onClick={saveNickname}
                disabled={nickBusy}
                aria-busy={nickBusy}
                className="h-10 flex-1 rounded-[10px] bg-orbit-1 text-[13px] font-semibold text-white hover:brightness-95 disabled:cursor-wait disabled:opacity-70"
              >
                {nickBusy ? IDENTITY.saving : IDENTITY.save}
              </button>
            </div>
            <span id="pf-nick-help" className={`text-xs ${nickError ? "text-alert-fg" : "text-prose-dim"}`}>
              {nickError ?? `${IDENTITY.nickMax} ${draft.trim().length}/${NICKNAME_MAX}`}
            </span>
          </>
        )}
        {nickSaved && !editing && (
          <span role="status" className="flex items-center gap-1.5 text-xs font-semibold text-tint-green-fg">
            <Check size={14} strokeWidth={2.6} aria-hidden="true" />
            {IDENTITY.nickSaved}
          </span>
        )}
      </div>
      {!savedOnServer && <p className="text-xs leading-normal text-prose-dim">{IDENTITY.localNote}</p>}
    </section>
  );
}
