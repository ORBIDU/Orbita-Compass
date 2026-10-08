import type { LoginResponse, MeResponse, MeUser } from "@/types/backend";
import { mockLogin, mockMe, mockSaveConsents, mockSetFirstPassword } from "@/mocks/authMock";
import { USE_MOCK } from "./config";
import { withLocalProfil } from "./profileService";
import { clearToken, getToken, request, setToken } from "./http";

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = USE_MOCK
    ? await mockLogin(email, password)
    : await request<LoginResponse>("/auth/login", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data;
}

/**
 * Login pertama: ganti password awal dari admin (API_CONTRACT 14.2). Hanya
 * dipanggil kalau `/auth/me` mengirim `mustChangePassword: true`.
 */
export async function setFirstPassword(newPassword: string): Promise<void> {
  if (USE_MOCK) return mockSetFirstPassword(getToken(), newPassword);
  await request("/auth/first-password", { method: "POST", body: { newPassword } });
}

/**
 * Simpan persetujuan orang tua/wali serta Syarat & Ketentuan (API_CONTRACT
 * 2.4). Waktunya dicatat server.
 */
export async function saveConsents(consent: { parent: boolean; terms: boolean }): Promise<void> {
  if (USE_MOCK) return mockSaveConsents(getToken(), consent);
  await request("/auth/consent", { method: "POST", body: { parentConsent: consent.parent, termsAccepted: consent.terms } });
}

/** Data user yang sedang login, beserta profil lengkapnya. */
export async function getMe(): Promise<MeUser> {
  const data = USE_MOCK ? await mockMe(getToken()) : await request<MeResponse>("/auth/me");
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
