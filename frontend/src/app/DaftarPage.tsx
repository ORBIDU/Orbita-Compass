import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/http";
import { ROUTES } from "@/config/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SelectField, TextField } from "@/components/ui/FormField";
import { BRAND } from "@/config/brand";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

interface FormState {
  name: string;
  email: string;
  password: string;
  schoolName: string;
  grade: string;
  city: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: "", email: "", password: "", schoolName: "", grade: "", city: "" };

const GRADE_OPTIONS = [
  { value: "10", label: "Kelas 10" },
  { value: "11", label: "Kelas 11" },
  { value: "12", label: "Kelas 12" },
];

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.name.trim().length < 3) errors.name = "Tulis nama lengkapmu (minimal 3 huruf).";
  if (!form.email.trim()) errors.email = "Email wajib diisi.";
  else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Format email belum benar.";
  if (form.password.length < MIN_PASSWORD) errors.password = `Password minimal ${MIN_PASSWORD} karakter.`;
  if (!form.schoolName.trim()) errors.schoolName = "Nama sekolah wajib diisi.";
  if (!form.grade) errors.grade = "Pilih kelasmu.";
  if (!form.city.trim()) errors.city = "Kota wajib diisi.";
  return errors;
}

/** Halaman Daftar versi sederhana. Tampilan lengkapnya dikerjakan di Fase 3. */
export default function DaftarPage() {
  const { register } = useAuth();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // Sengaja tanpa field role (lihat authService.RegisterPayload).
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        schoolName: form.schoolName.trim(),
        grade: Number(form.grade),
        city: form.city.trim(),
      });
      // Akun baru berstatus "baru", jadi GuestOnly (routes/guards.tsx) langsung
      // membawanya ke Analisis Potensi untuk mengisi Gambaran Minat Bakat.
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal mendaftar. Coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <Card padding="lg">
      <h1 className="text-xl font-bold text-ink">Buat akun {BRAND.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">Mulai petakan jurusanmu sejak sekarang.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <TextField label="Nama lengkap" autoComplete="name" value={form.name} onChange={(e) => set("name")(e.target.value)} error={errors.name} />
        <TextField label="Email" type="email" autoComplete="email" placeholder="nama@email.com" value={form.email} onChange={(e) => set("email")(e.target.value)} error={errors.email} />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => set("password")(e.target.value)}
          error={errors.password}
          hint={`Minimal ${MIN_PASSWORD} karakter.`}
        />
        <TextField label="Nama sekolah" autoComplete="organization" placeholder="Contoh: SMA Negeri 1 Bogor" value={form.schoolName} onChange={(e) => set("schoolName")(e.target.value)} error={errors.schoolName} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField label="Kelas" placeholder="Pilih kelas" options={GRADE_OPTIONS} value={form.grade} onChange={(e) => set("grade")(e.target.value)} error={errors.grade} />
          <TextField label="Kota" autoComplete="address-level2" value={form.city} onChange={(e) => set("city")(e.target.value)} error={errors.city} />
        </div>

        {formError && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <Button type="submit" variant="cta" size="lg" disabled={submitting} className="mt-2 w-full">
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Mendaftarkan..." : "Daftar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Sudah punya akun?{" "}
        <Link to={ROUTES.masuk} className="font-semibold text-orbit-1 hover:underline">
          Masuk
        </Link>
      </p>
    </Card>
  );
}
