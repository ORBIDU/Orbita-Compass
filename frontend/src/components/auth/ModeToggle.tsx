import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/navigation";
import { AUTH_TOGGLE, type AuthMode } from "@/content/auth";

/**
 * Pindah antara /masuk dan /daftar tanpa reload. `state` ikut dibawa supaya
 * halaman asal (state.from, dari RequireAuth) tetap dipakai setelah login.
 * `replace` supaya tombol Back browser kembali ke halaman sebelum Masuk/Daftar.
 */
export function useSwitchAuthMode() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (mode: AuthMode) => navigate(ROUTES[mode], { replace: true, state: location.state }),
    [navigate, location.state],
  );
}

const MODES: AuthMode[] = ["masuk", "daftar"];

/** Dua tombol Masuk | Daftar di atas form. */
export default function ModeToggle({ mode }: { mode: AuthMode }) {
  const switchMode = useSwitchAuthMode();
  return (
    <div role="group" aria-label={AUTH_TOGGLE.label} className="grid grid-cols-2 rounded-[14px] bg-field-track p-1">
      {MODES.map((m) => {
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            aria-pressed={active}
            onClick={() => !active && switchMode(m)}
            className={`h-11 rounded-[11px] text-[15px] font-semibold transition ${
              active ? "bg-white text-space-2 shadow-tab" : "text-prose hover:text-space-2"
            }`}
          >
            {AUTH_TOGGLE[m]}
          </button>
        );
      })}
    </div>
  );
}
