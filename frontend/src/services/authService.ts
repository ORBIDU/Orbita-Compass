import type { LoginResponse, MeResponse, MeUser, RegisterResponse } from "@/types/backend";
import { mockLogin, mockMe, mockRegister } from "@/mocks/authMock";
import { USE_MOCK } from "./config";
import { clearToken, getToken, request, setToken } from "./http";

/**
 * Data formulir Daftar. Sengaja TIDAK punya field `role`: backend menerima
 * `role` dari body sehingga siapa pun bisa mendaftar sebagai ADMIN
 * (BACKEND_MAP.md bagian 6), jadi frontend tidak pernah mengirimnya.
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  schoolName: string;
  /** 10, 11, atau 12 */
  grade: number;
  city: string;
  majorTrack?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = USE_MOCK
    ? await mockLogin(email, password)
    : await request<LoginResponse>("/auth/login", { method: "POST", body: { email, password } });
  setToken(data.token);
  return data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  // Body disusun satu per satu supaya tidak ada field lain (termasuk role) yang ikut terkirim.
  const body: RegisterPayload = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    schoolName: payload.schoolName,
    grade: payload.grade,
    city: payload.city,
    ...(payload.majorTrack ? { majorTrack: payload.majorTrack } : {}),
  };
  const data = USE_MOCK
    ? await mockRegister(body)
    : await request<RegisterResponse>("/auth/register", { method: "POST", body });
  setToken(data.token);
  return data;
}

/** Data user yang sedang login, beserta profil lengkapnya. */
export async function getMe(): Promise<MeUser> {
  const data = USE_MOCK ? await mockMe(getToken()) : await request<MeResponse>("/auth/me");
  // Backend ikut mengirim passwordHash; dibuang di sini agar tidak pernah tersimpan di state.
  const { passwordHash: _passwordHash, ...user } = data.user as MeUser & { passwordHash?: string };
  return user;
}

export function hasToken(): boolean {
  return getToken() !== null;
}

export function logout(): void {
  clearToken();
}
