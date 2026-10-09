import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MeUser } from "@/types/backend";
import * as authService from "@/services/authService";
import { ApiError, SESSION_EXPIRED_EVENT, SESSION_EXPIRED_MESSAGE } from "@/services/http";

/** loading = sedang memeriksa sesi yang tersimpan saat halaman dibuka. */
export type AuthStatus = "loading" | "authenticated" | "guest";

interface AuthContextValue {
  status: AuthStatus;
  user: MeUser | null;
  /** Pesan jika sesi lama gagal dipulihkan karena server tidak bisa dihubungi. */
  sessionError: string | null;
  login: (email: string, password: string) => Promise<MeUser>;
  logout: () => void;
  /** Ambil ulang data user, misalnya setelah profil atau status berubah. */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() => (authService.hasToken() ? "loading" : "guest"));
  const [user, setUser] = useState<MeUser | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setStatus("guest");
  }, []);

  // Sesi berakhir di tengah pemakaian (token sudah dihapus http.ts): keluar dan
  // beri tahu siswa di halaman Masuk. RequireAuth mengingat halaman asalnya.
  useEffect(() => {
    function onExpired() {
      setUser(null);
      setStatus("guest");
      setSessionError(SESSION_EXPIRED_MESSAGE);
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  // Pulihkan sesi dari token yang tersimpan, supaya refresh halaman tidak membuat logout.
  useEffect(() => {
    if (!authService.hasToken()) return;
    let cancelled = false;
    authService
      .getMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus("authenticated");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.isNetworkError) {
          // Server mati sementara: token disimpan supaya refresh berikutnya bisa mencoba lagi.
          setSessionError(err.message);
          setStatus("guest");
        } else {
          logout();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    await authService.login(email, password);
    // /auth/login tidak membawa profil lengkap, jadi ambil /auth/me.
    const me = await authService.getMe();
    setUser(me);
    setSessionError(null);
    setStatus("authenticated");
    return me;
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await authService.getMe();
    setUser(me);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, sessionError, login, logout, refreshUser }),
    [status, user, sessionError, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  return ctx;
}
