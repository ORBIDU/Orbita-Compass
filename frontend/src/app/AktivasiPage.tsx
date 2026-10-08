import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AKTIVASI, AUTH_PANEL } from "@/content/auth";
import { useAuth } from "@/context/AuthContext";
import { useStudentStatus } from "@/context/StudentStatusContext";
import { activationStep, fromState, portalTarget } from "@/lib/activation";
import { saveConsents, setFirstPassword } from "@/services/authService";
import PageLoader from "@/components/ui/PageLoader";
import { ConsentForm, FirstPasswordForm } from "@/components/auth/ActivationForms";

/**
 * Aktivasi akun saat pertama masuk (/aktivasi, SPEK bagian 3): akun dibuat
 * admin dengan password awal, jadi siswa wajib (1) mengganti password lalu
 * (2) mencentang dua persetujuan sebelum bisa membuka portal. Langkah yang
 * sudah beres dilewati. Mode backend: penandanya belum ada, jadi halaman ini
 * tidak pernah tampil (lib/activation.ts).
 */
export default function AktivasiPage() {
  const { user, refreshUser, logout } = useAuth();
  const { status: studentStatus, ready } = useStudentStatus();
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const step = activationStep(user);
  const from = fromState(location.state);

  // Pindah langkah: fokus ke judul baru supaya pembaca layar ikut tahu.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  if (!step) {
    if (user?.role === "STUDENT" && !ready) return <PageLoader label="Menyiapkan portal..." />;
    return <Navigate to={portalTarget(studentStatus, from)} replace />;
  }

  const copy = step === "password" ? AKTIVASI.password : AKTIVASI.consent;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-accent text-[26px] font-bold leading-none text-sun-1 lg:text-[28px]">{AUTH_PANEL.greeting}</p>
        <p className="text-[13px] font-semibold uppercase tracking-[0.6px] text-orbit-1">{AKTIVASI.step(step === "password" ? 1 : 2, 2)}</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[26px] font-bold leading-tight tracking-[-0.4px] text-space-2 focus:outline-none lg:text-[30px] lg:tracking-[-0.5px]"
        >
          {copy.title}
        </h1>
        <p className="text-[15px] leading-[1.55] text-prose">{copy.subtitle}</p>
      </div>

      {step === "password" ? (
        <FirstPasswordForm
          key="password"
          onSubmit={async (next) => {
            await setFirstPassword(next);
            await refreshUser();
          }}
        />
      ) : (
        <ConsentForm
          key="consent"
          onSubmit={async (consent) => {
            await saveConsents(consent);
            await refreshUser();
          }}
        />
      )}

      <button
        type="button"
        // Setelah keluar, RequireAuth otomatis membawa ke /masuk.
        onClick={logout}
        className="min-h-11 self-center rounded px-2 text-sm font-semibold text-orbit-1 hover:underline"
      >
        {AKTIVASI.logout}
      </button>
    </div>
  );
}
