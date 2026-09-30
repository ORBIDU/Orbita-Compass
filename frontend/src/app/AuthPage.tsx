import { AUTH_MODES, AUTH_PANEL, type AuthMode } from "@/content/auth";
import ModeToggle, { useSwitchAuthMode } from "@/components/auth/ModeToggle";
import MasukForm from "@/components/auth/MasukForm";
import DaftarForm from "@/components/auth/DaftarForm";

/**
 * Halaman Masuk dan Daftar (/masuk, /daftar). Mode ditentukan route, jadi
 * berganti mode cukup mengganti URL tanpa reload. Setelah berhasil, GuestOnly
 * (routes/guards.tsx) yang menentukan halaman tujuan.
 */
export default function AuthPage({ mode }: { mode: AuthMode }) {
  const copy = AUTH_MODES[mode];
  const switchMode = useSwitchAuthMode();

  return (
    <div className="flex flex-col gap-4">
      <ModeToggle mode={mode} />

      <div className="flex flex-col gap-1">
        <p className="font-accent text-[26px] font-bold leading-none text-sun-1 lg:text-[28px]">{AUTH_PANEL.greeting}</p>
        <h1 className="text-[26px] font-bold leading-tight tracking-[-0.4px] text-space-2 lg:text-[30px] lg:tracking-[-0.5px]">
          {copy.title}
        </h1>
        <p className="text-[15px] leading-[1.55] text-prose">{copy.subtitle}</p>
      </div>

      {/* key: form diganti utuh saat berpindah mode, supaya isian dan error tidak terbawa. */}
      {mode === "masuk" ? <MasukForm key="masuk" /> : <DaftarForm key="daftar" />}

      <p className="flex items-center justify-center gap-1 text-sm text-prose">
        {copy.switchText}
        <button
          type="button"
          onClick={() => switchMode(mode === "masuk" ? "daftar" : "masuk")}
          className="min-h-11 rounded px-1 text-sm font-semibold text-orbit-1 hover:underline lg:min-h-9"
        >
          {copy.switchCta}
        </button>
      </p>
    </div>
  );
}
