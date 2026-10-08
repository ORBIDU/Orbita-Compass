import { useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { AKTIVASI } from "@/content/auth";
import { passwordProblem } from "@/lib/password";
import { ApiError } from "@/services/http";
import { TextField, FieldError } from "@/components/ui/FormField";
import AuthAlert from "./AuthAlert";
import SubmitButton from "./SubmitButton";

const E = AKTIVASI.errors;
const PROBLEM_TEXT = { short: E.tooShort, mix: E.needMix, same: E.sameAsInitial };

/** Pesan dari server kalau aman ditampilkan, selain itu pesan umum. */
function serverMessage(err: unknown): string {
  return err instanceof ApiError && err.status < 500 && err.status !== 0 ? err.message : E.fallback;
}

/**
 * Langkah 1: ganti password awal dari admin. Password lama tidak ditanya lagi
 * (baru saja dipakai untuk masuk); server yang mengecek bedanya.
 */
export function FirstPasswordForm({ onSubmit }: { onSubmit: (next: string) => Promise<void> }) {
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<{ next?: string; repeat?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const nextRef = useRef<HTMLInputElement>(null);
  const repeatRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    setServerError(null);
    const problem = next ? passwordProblem(next) : null;
    const found = {
      next: !next ? E.nextEmpty : problem ? PROBLEM_TEXT[problem] : undefined,
      repeat: next && !problem && repeat !== next ? E.mismatch : undefined,
    };
    setErrors(found);
    if (found.next) return nextRef.current?.focus();
    if (found.repeat) return repeatRef.current?.focus();

    inFlight.current = true;
    setSubmitting(true);
    try {
      // Setelah berhasil, halaman pindah ke langkah berikutnya.
      await onSubmit(next);
    } catch (err) {
      setServerError(serverMessage(err));
      setSubmitting(false);
      inFlight.current = false;
      nextRef.current?.focus();
    }
  }

  const P = AKTIVASI.password;
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
      {serverError && <AuthAlert>{serverError}</AuthAlert>}
      <TextField
        ref={nextRef}
        label={P.next}
        type="password"
        name="new-password"
        autoComplete="new-password"
        placeholder={P.nextPlaceholder}
        hint={P.nextHint}
        value={next}
        onChange={(e) => {
          setNext(e.target.value);
          setErrors((x) => ({ ...x, next: undefined }));
          setServerError(null);
        }}
        error={errors.next}
      />
      <TextField
        ref={repeatRef}
        label={P.repeat}
        type="password"
        name="repeat-password"
        autoComplete="new-password"
        placeholder={P.repeatPlaceholder}
        value={repeat}
        onChange={(e) => {
          setRepeat(e.target.value);
          setErrors((x) => ({ ...x, repeat: undefined }));
        }}
        error={errors.repeat}
      />
      <SubmitButton loading={submitting} label={P.submit} loadingLabel={P.submitting} />
    </form>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  error,
  inputRef,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  children: ReactNode;
}) {
  const errorId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] border-field-rim bg-field-bg px-3.5 py-3 text-sm leading-[1.55] text-space-1">
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-px h-5 w-5 shrink-0 cursor-pointer accent-orbit-1"
        />
        <span>{children}</span>
      </label>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/** Langkah 2: dua persetujuan terpisah, keduanya wajib. Waktunya dicatat server. */
export function ConsentForm({ onSubmit }: { onSubmit: (consent: { parent: boolean; terms: boolean }) => Promise<void> }) {
  const [parent, setParent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<{ parent?: string; terms?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const parentRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    setServerError(null);
    const found = { parent: parent ? undefined : E.parentEmpty, terms: terms ? undefined : E.termsEmpty };
    setErrors(found);
    if (found.parent) return parentRef.current?.focus();
    if (found.terms) return termsRef.current?.focus();

    inFlight.current = true;
    setSubmitting(true);
    try {
      await onSubmit({ parent, terms });
    } catch (err) {
      setServerError(serverMessage(err));
      setSubmitting(false);
      inFlight.current = false;
    }
  }

  const C = AKTIVASI.consent;
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
      {serverError && <AuthAlert>{serverError}</AuthAlert>}
      <ConsentCheckbox
        inputRef={parentRef}
        checked={parent}
        onChange={(v) => {
          setParent(v);
          setErrors((x) => ({ ...x, parent: undefined }));
        }}
        error={errors.parent}
      >
        {C.parent}
      </ConsentCheckbox>
      <ConsentCheckbox
        inputRef={termsRef}
        checked={terms}
        onChange={(v) => {
          setTerms(v);
          setErrors((x) => ({ ...x, terms: undefined }));
        }}
        error={errors.terms}
      >
        {C.terms.before}
        <strong className="font-semibold">{C.terms.terms}</strong>
        {C.terms.between}
        <strong className="font-semibold">{C.terms.privacy}</strong>
        {C.terms.after}
      </ConsentCheckbox>
      <SubmitButton loading={submitting} label={C.submit} loadingLabel={C.submitting} />
    </form>
  );
}
