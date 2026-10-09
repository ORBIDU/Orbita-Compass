import type { LoginResponse, LoginUser, MeResponse } from "@/types/backend";
import { ApiError } from "@/services/http";
import { AKTIVASI } from "@/content/auth";
import { findAccountByEmail, mockTokenFor, updateAccount, type MockAccount } from "./db";
import { buildProfileDetail, requireAccount } from "./studentMock";
import { delay } from "@/lib/delay";

function toLoginUser(account: MockAccount): LoginUser {
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    role: account.role,
    avatarUrl: account.avatarUrl,
    profile: account.profile,
  };
}

/** Tiruan POST /auth/login. */
export async function mockLogin(email: string, password: string): Promise<LoginResponse> {
  await delay(500);
  if (!email || !password) throw new ApiError(400, "Email dan password wajib diisi.");
  const account = findAccountByEmail(email);
  if (!account || account.password !== password) throw new ApiError(401, "Email atau password salah.");
  return { message: "Login successful", token: mockTokenFor(account.id), user: toLoginUser(account) };
}

/** Tiruan GET /auth/me. */
export async function mockMe(token: string | null): Promise<MeResponse> {
  await delay(200);
  const account = requireAccount(token);
  return {
    user: {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      avatarUrl: account.avatarUrl,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      profile: buildProfileDetail(account),
      mustChangePassword: account.mustChangePassword ?? false,
      parentConsentAt: account.parentConsentAt ?? null,
      termsAcceptedAt: account.termsAcceptedAt ?? null,
    },
  };
}

/**
 * Tiruan POST /auth/first-password (API_CONTRACT 14.2): mengganti password
 * awal dari admin. Hanya boleh selama `mustChangePassword` masih true.
 */
export async function mockSetFirstPassword(token: string | null, newPassword: string): Promise<void> {
  await delay(500);
  const account = requireAccount(token);
  if (!account.mustChangePassword) throw new ApiError(409, "Password awal sudah pernah diganti.");
  if (account.password === newPassword) throw new ApiError(400, AKTIVASI.errors.sameAsInitial);
  updateAccount(account.id, (a) => {
    a.password = newPassword;
    a.mustChangePassword = false;
  });
}

/**
 * Tiruan POST /auth/consent (API_CONTRACT 2.4). Waktu tiap persetujuan diisi
 * "server", bukan dikirim browser. Persetujuan yang sudah ada tidak ditimpa.
 */
export async function mockSaveConsents(token: string | null, consent: { parent: boolean; terms: boolean }): Promise<void> {
  await delay(400);
  const account = requireAccount(token);
  if (!consent.parent || !consent.terms) throw new ApiError(400, "Kedua persetujuan wajib dicentang.");
  const now = new Date().toISOString();
  updateAccount(account.id, (a) => {
    a.parentConsentAt = a.parentConsentAt ?? now;
    a.termsAcceptedAt = a.termsAcceptedAt ?? now;
  });
}
