import type { LoginResponse, MeResponse, MeUser } from "@/types/backend";
import { withLocalProfil } from "./profileService";
import { clearToken, getToken, request, setToken } from "./http";

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/authMock");

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = USE_MOCK
    ? await (await mock()).mockLogin(email, password)
    : await request<LoginResponse>("/auth/login", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data;
}

/**
 * Login pertama: ganti password awal dari admin (API_CONTRACT 14.2). Hanya
 * dipanggil kalau `/auth/me` mengirim `mustChangePassword: true`.
 */
export async function setFirstPassword(newPassword: string): Promise<void> {
  if (USE_MOCK) return (await mock()).mockSetFirstPassword(getToken(), newPassword);
  await request("/auth/first-password", { method: "POST", body: { newPassword } });
}

/**
 * Simpan persetujuan orang tua/wali serta Syarat & Ketentuan (API_CONTRACT
 * 2.4). Waktunya dicatat server.
 */
export async function saveConsents(consent: { parent: boolean; terms: boolean }): Promise<void> {
  if (USE_MOCK) return (await mock()).mockSaveConsents(getToken(), consent);
  await request("/auth/consent", { method: "POST", body: { parentConsent: consent.parent, termsAccepted: consent.terms } });
}

/** Data user yang sedang login, beserta profil lengkapnya. */
export async function getMe(): Promise<MeUser> {
  const data = USE_MOCK ? await (await mock()).mockMe(getToken()) : await request<MeResponse>("/auth/me");
  // Backend ikut mengirim passwordHash; dibuang di sini agar tidak pernah tersimpan di state.
  const { passwordHash: _passwordHash, ...user } = data.user as MeUser & { passwordHash?: string };
  // Mode backend: nama panggilan dan foto masih disimpan di browser (API_CONTRACT 13.3).
  return withLocalProfil(user);
}

export function hasToken(): boolean {
  return getToken() !== null;
}

export function logout(): void {
  clearToken();
}
