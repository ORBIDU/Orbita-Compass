import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/http";
import { USE_MOCK } from "@/services/config";
import { ROUTES } from "@/config/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { TextField } from "@/components/ui/FormField";
import { BRAND } from "@/config/brand";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Halaman Masuk versi sederhana. Tampilan lengkapnya dikerjakan di Fase 3. */
export default function MasukPage() {
  const { login, sessionError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email wajib diisi.";
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = "Format email belum benar.";
    if (!password) next.password = "Password wajib diisi.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Setelah berhasil, GuestOnly (routes/guards.tsx) yang memindahkan ke halaman tujuan.
      await login(email.trim(), password);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal masuk. Coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <Card padding="lg">
      <h1 className="text-xl font-bold text-ink">Masuk ke {BRAND.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">Lanjutkan perjalanan menuju jurusan impianmu.</p>

      {sessionError && !formError && (
        <div className="mt-5 flex items-start gap-2 rounded-xl bg-cloud px-4 py-3 text-sm text-ink-soft">
          <Info size={16} className="mt-0.5 shrink-0 text-orbit-1" />
          <span>{sessionError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {formError && (
          <div role="alert" className="flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Memeriksa..." : "Masuk"}
        </Button>
      </form>

      {USE_MOCK && (
        <p className="mt-4 rounded-xl bg-page px-4 py-3 text-center text-xs text-ink-muted">
          Mode dummy · akun demo <span className="font-semibold text-ink-soft">siswa@orbita.id</span> /{" "}
          <span className="font-semibold text-ink-soft">password123</span>
        </p>
      )}

      <p className="mt-6 text-center text-sm text-ink-muted">
        Belum punya akun?{" "}
        <Link to={ROUTES.daftar} className="font-semibold text-orbit-1 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </Card>
  );
}
