import { useId, useRef, useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/http";
import { USE_MOCK } from "@/services/config";
import { whatsappLink } from "@/config/brand";
import { AUTH_DEMO_HINT, AUTH_ERRORS, AUTH_FIELDS, AUTH_FORGOT, AUTH_MASUK } from "@/content/auth";
import { TextField } from "@/components/ui/FormField";
import AuthAlert from "./AuthAlert";
import SubmitButton from "./SubmitButton";
import { compact, emailError } from "./validation";

type Field = "email" | "password";
type Errors = Partial<Record<Field, string>>;

/** Form Masuk: email + password, lupa password lewat WhatsApp. */
export default function MasukForm() {
  const { login, sessionError } = useAuth();
  const forgotId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [credentialsWrong, setCredentialsWrong] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // Kunci tambahan: state React baru berubah setelah render, jadi Enter/klik
  // beruntun dalam jeda itu tetap ditahan oleh ref ini.
  const inFlight = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function clearFeedback(field: Field) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    setServerError(null);
    setCredentialsWrong(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    setServerError(null);
    setCredentialsWrong(false);

    const found = compact<Errors>({ email: emailError(email), password: password ? undefined : AUTH_ERRORS.passwordEmpty });
    setErrors(found);
    if (found.email) return emailRef.current?.focus();
    if (found.password) return passwordRef.current?.focus();

    inFlight.current = true;
    setSubmitting(true);
    try {
      // Setelah berhasil, GuestOnly (routes/guards.tsx) yang memindahkan ke halaman
      // tujuan, jadi tombol dibiarkan loading sampai halaman berganti.
      await login(email.trim(), password);
    } catch (err) {
      const wrong = err instanceof ApiError && err.status === 401;
      setServerError(err instanceof ApiError ? err.message : AUTH_ERRORS.masukFallback);
      setCredentialsWrong(wrong);
      setSubmitting(false);
      inFlight.current = false;
      if (wrong) emailRef.current?.focus();
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
      {serverError && <AuthAlert>{serverError}</AuthAlert>}
      {sessionError && !serverError && <AuthAlert tone="info">{sessionError}</AuthAlert>}

      <TextField
        ref={emailRef}
        label={AUTH_FIELDS.email.label}
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder={AUTH_FIELDS.email.placeholder}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearFeedback("email");
        }}
        error={errors.email}
        invalid={credentialsWrong}
      />
      <TextField
        ref={passwordRef}
        label={AUTH_FIELDS.password.label}
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder={AUTH_FIELDS.password.placeholder}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearFeedback("password");
        }}
        error={errors.password}
      />

      <div className="-mt-1 flex flex-col gap-2">
        <button
          type="button"
          aria-expanded={forgotOpen}
          aria-controls={forgotId}
          onClick={() => setForgotOpen((v) => !v)}
          className="min-h-9 self-end rounded text-sm font-medium text-orbit-1 hover:underline"
        >
          {AUTH_FORGOT.trigger}
        </button>
        <div id={forgotId} hidden={!forgotOpen} className="rounded-xl bg-cloud px-4 py-3 text-sm text-space-1">
          <p className="font-semibold">{AUTH_FORGOT.title}</p>
          <p className="mt-1 leading-relaxed text-prose">{AUTH_FORGOT.body}</p>
          <a
            href={whatsappLink("lupaPassword")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-whatsapp px-3.5 text-sm font-semibold text-white hover:brightness-95"
          >
            <MessageCircle size={16} aria-hidden="true" />
            {AUTH_FORGOT.cta}
          </a>
        </div>
      </div>

      <SubmitButton loading={submitting} label={AUTH_MASUK.submit} loadingLabel={AUTH_MASUK.submitting} />

      {USE_MOCK && (
        <div className="flex flex-col gap-1 rounded-xl bg-surface-soft px-4 py-2.5 text-center text-xs text-prose">
          <p>
            {AUTH_DEMO_HINT.label}, password <span className="font-semibold text-space-1">{AUTH_DEMO_HINT.password}</span>
          </p>
          <ul className="flex flex-col gap-0.5">
            {AUTH_DEMO_HINT.accounts.map((a) => (
              <li key={a.email}>
                <span className="font-semibold text-space-1">{a.email}</span> ({a.note})
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
