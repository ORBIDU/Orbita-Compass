import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { PASSWORD_DIALOG } from "@/content/profil";
import { ApiError } from "@/services/http";
import { passwordProblem } from "@/lib/password";

const PROBLEM_TEXT = { short: PASSWORD_DIALOG.tooShort, mix: PASSWORD_DIALOG.needMix, same: PASSWORD_DIALOG.sameAsOld };

/** Aturan password baru (lib/password.ts) dengan pesan jendela ini. */
function nextError(current: string, next: string): string | null {
  const problem = passwordProblem(next, current);
  return problem ? PROBLEM_TEXT[problem] : null;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
  hint,
  autoFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  error: string | null;
  hint?: string;
  autoFocus?: boolean;
}) {
  const [show, setShow] = useState(false);
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-space-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          data-autofocus={autoFocus || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 w-full rounded-xl border-[1.5px] bg-field-bg pl-3.5 pr-12 text-base text-space-2 focus:outline-none focus:ring-2 ${
            error ? "border-alert-rim focus:ring-alert-rim/20" : "border-field-rim focus:border-orbit-1 focus:ring-orbit-1/20"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? PASSWORD_DIALOG.hide : PASSWORD_DIALOG.show}
          aria-pressed={show}
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-prose hover:text-space-2"
        >
          {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {hint && (
        <span id={`${id}-hint`} className="text-xs text-prose-dim">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-err`} className="text-[13px] text-alert-fg">
          {error}
        </span>
      )}
    </div>
  );
}

/** Jendela Ganti password: password sekarang dicek oleh "server". */
export default function PasswordDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (current: string, next: string) => Promise<void> }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string; repeat?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  async function submit() {
    const e: typeof errors = {};
    if (!current) e.current = PASSWORD_DIALOG.currentEmpty;
    const ne = nextError(current, next);
    if (ne) e.next = ne;
    if (!ne && repeat !== next) e.repeat = PASSWORD_DIALOG.mismatch;
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await onSubmit(current, next);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) setErrors({ current: err.message });
      else setErrors({ form: PASSWORD_DIALOG.error });
      setBusy(false);
    }
  }

  return (
    <Dialog title={PASSWORD_DIALOG.title} onClose={onClose} widthClass="max-w-[480px]" busy={busy}>
      <form
        noValidate
        className="flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <PasswordField id="pw-current" label={PASSWORD_DIALOG.current} value={current} onChange={setCurrent} autoComplete="current-password" error={errors.current ?? null} autoFocus />
        <PasswordField id="pw-next" label={PASSWORD_DIALOG.next} value={next} onChange={setNext} autoComplete="new-password" error={errors.next ?? null} hint={PASSWORD_DIALOG.nextHint} />
        <PasswordField id="pw-repeat" label={PASSWORD_DIALOG.repeat} value={repeat} onChange={setRepeat} autoComplete="new-password" error={errors.repeat ?? null} />
        {errors.form && (
          <p role="alert" className="rounded-xl bg-alert-bg px-4 py-2.5 text-sm text-alert-fg">
            {errors.form}
          </p>
        )}
        <div className="mt-1.5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-[46px] rounded-xl border-[1.5px] border-rim bg-white px-[18px] text-sm font-semibold text-space-1 hover:bg-surface-soft disabled:opacity-50"
          >
            {PASSWORD_DIALOG.cancel}
          </button>
          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="h-[46px] rounded-xl bg-orbit-1 px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-wait disabled:opacity-70"
          >
            {busy ? PASSWORD_DIALOG.saving : PASSWORD_DIALOG.save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
