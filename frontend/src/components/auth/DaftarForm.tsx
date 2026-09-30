import { useId, useRef, useState, type FormEvent, type RefObject } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/http";
import { AUTH_ERRORS, AUTH_FIELDS, AUTH_MODES } from "@/content/auth";
import { FieldError, TextField } from "@/components/ui/FormField";
import AuthAlert from "./AuthAlert";
import ClassPicker from "./ClassPicker";
import SubmitButton from "./SubmitButton";
import { compact, emailError, newPasswordError } from "./validation";

interface FormState {
  name: string;
  email: string;
  password: string;
  schoolName: string;
  grade: number | null;
  city: string;
  consent: boolean;
}

type Field = keyof FormState;
type Errors = Partial<Record<Field, string>>;

/** Urutan field di layar, untuk memfokuskan field salah yang paling atas. */
const ORDER: Field[] = ["name", "email", "password", "schoolName", "grade", "city", "consent"];

const EMPTY: FormState = { name: "", email: "", password: "", schoolName: "", grade: null, city: "", consent: false };

const COPY = AUTH_MODES.daftar;
const CONSENT = AUTH_FIELDS.consent;

function validate(form: FormState): Errors {
  return compact<Errors>({
    name: form.name.trim().length < 3 ? AUTH_ERRORS.nameShort : undefined,
    email: emailError(form.email),
    password: newPasswordError(form.password),
    schoolName: form.schoolName.trim() ? undefined : AUTH_ERRORS.schoolEmpty,
    grade: form.grade ? undefined : AUTH_ERRORS.gradeEmpty,
    city: form.city.trim() ? undefined : AUTH_ERRORS.cityEmpty,
    consent: form.consent ? undefined : AUTH_ERRORS.consentEmpty,
  });
}

/** Form Daftar akun siswa. Nama field sama dengan POST /auth/register, tanpa role. */
export default function DaftarForm() {
  const { register } = useAuth();
  const consentErrorId = `${useId()}-consent-error`;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Kunci tambahan terhadap kirim dua kali (lihat MasukForm).
  const inFlight = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const schoolRef = useRef<HTMLInputElement>(null);
  const gradeRef = useRef<HTMLButtonElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const focusTarget: Record<Field, RefObject<HTMLElement | null>> = {
    name: nameRef,
    email: emailRef,
    password: passwordRef,
    schoolName: schoolRef,
    grade: gradeRef,
    city: cityRef,
    consent: consentRef,
  };

  function set<K extends Field>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    setServerError(null);
    if (key === "email") setEmailTaken(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    setServerError(null);
    setEmailTaken(false);

    const found = validate(form);
    setErrors(found);
    const firstInvalid = ORDER.find((f) => found[f]);
    if (firstInvalid) return focusTarget[firstInvalid].current?.focus();

    inFlight.current = true;
    setSubmitting(true);
    try {
      // authService menyusun body satu per satu, jadi role tidak pernah ikut terkirim.
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        schoolName: form.schoolName.trim(),
        grade: form.grade as number,
        city: form.city.trim(),
        parentConsent: form.consent,
      });
      // Akun baru berstatus "baru", jadi GuestOnly (routes/guards.tsx) langsung
      // membawanya ke Analisis Potensi untuk mengisi Gambaran Minat Bakat.
    } catch (err) {
      const taken = err instanceof ApiError && err.status === 409;
      setServerError(err instanceof ApiError ? err.message : AUTH_ERRORS.daftarFallback);
      setEmailTaken(taken);
      setSubmitting(false);
      inFlight.current = false;
      if (taken) emailRef.current?.focus();
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5">
      {serverError && <AuthAlert>{serverError}</AuthAlert>}

      <TextField
        ref={nameRef}
        label={AUTH_FIELDS.name.label}
        name="name"
        autoComplete="name"
        placeholder={AUTH_FIELDS.name.placeholder}
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        error={errors.name}
      />
      <TextField
        ref={emailRef}
        label={AUTH_FIELDS.email.label}
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder={AUTH_FIELDS.email.placeholder}
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        error={errors.email}
        invalid={emailTaken}
      />
      <TextField
        ref={passwordRef}
        label={AUTH_FIELDS.passwordDaftar.label}
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder={AUTH_FIELDS.passwordDaftar.placeholder}
        value={form.password}
        onChange={(e) => set("password", e.target.value)}
        error={errors.password}
      />
      <TextField
        ref={schoolRef}
        label={AUTH_FIELDS.schoolName.label}
        name="schoolName"
        autoComplete="organization"
        placeholder={AUTH_FIELDS.schoolName.placeholder}
        value={form.schoolName}
        onChange={(e) => set("schoolName", e.target.value)}
        error={errors.schoolName}
      />
      <div className="grid grid-cols-2 items-start gap-3">
        <ClassPicker ref={gradeRef} value={form.grade} onChange={(k) => set("grade", k)} error={errors.grade} />
        <TextField
          ref={cityRef}
          label={AUTH_FIELDS.city.label}
          name="city"
          autoComplete="address-level2"
          placeholder={AUTH_FIELDS.city.placeholder}
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
          error={errors.city}
        />
      </div>

      <div className="mt-0.5 flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.55] text-prose">
          <input
            ref={consentRef}
            type="checkbox"
            name="parentConsent"
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-required="true"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? consentErrorId : undefined}
            className="mt-px h-5 w-5 shrink-0 cursor-pointer accent-orbit-1"
          />
          <span>
            {CONSENT.before}
            <strong className="font-semibold text-space-1">{CONSENT.terms}</strong>
            {CONSENT.between}
            <strong className="font-semibold text-space-1">{CONSENT.privacy}</strong>
            {CONSENT.after}
          </span>
        </label>
        {errors.consent && <FieldError id={consentErrorId}>{errors.consent}</FieldError>}
      </div>

      <SubmitButton loading={submitting} label={COPY.submit} loadingLabel={COPY.submitting} />
    </form>
  );
}
