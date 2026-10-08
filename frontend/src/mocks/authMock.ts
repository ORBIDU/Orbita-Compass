import type { LoginResponse, LoginUser, MeResponse, RegisterResponse } from "@/types/backend";
import type { RegisterPayload } from "@/services/authService";
import { ApiError } from "@/services/http";
import { EMPTY_SCHOOL_PROFILE } from "./data/profil";
import { findAccountByEmail, insertAccount, mockTokenFor, type MockAccount } from "./db";
import { buildProfileDetail, requireAccount } from "./studentMock";
import { delay } from "./delay";

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

/** Tiruan POST /auth/register. Akun baru selalu STUDENT dengan status "baru". */
export async function mockRegister(payload: RegisterPayload): Promise<RegisterResponse> {
  await delay(600);
  if (!payload.email || !payload.password || !payload.name) {
    throw new ApiError(400, "Nama, email, dan password wajib diisi.");
  }
  if (findAccountByEmail(payload.email)) throw new ApiError(409, "Email ini sudah terdaftar.");

  const now = new Date().toISOString();
  const id = `user-${Date.now().toString(36)}`;
  const account: MockAccount = {
    id,
    email: payload.email.trim(),
    password: payload.password,
    name: payload.name.trim(),
    role: "STUDENT",
    avatarUrl: null,
    createdAt: now,
    updatedAt: now,
    profile: {
      id: `profile-${id}`,
      userId: id,
      schoolName: payload.schoolName,
      grade: payload.grade,
      // Sama seperti backend: jurusan SMA tidak ditanya saat daftar, jadi
      // backend mengisi "IPA". Dicatat di docs/API_CONTRACT.md.
      majorTrack: payload.majorTrack ?? "IPA",
      // Form Daftar tidak menanyakan nama panggilan; sapaan memakai kata pertama nama.
      nickname: null,
      city: payload.city,
      targetPtnId: null,
      targetMajorId: null,
      createdAt: now,
      updatedAt: now,
    },
    status: "baru",
    academicRecords: [],
    achievements: [],
    reflection: null,
    assessment: null,
    compassAnalysis: null,
    actionPlan: null,
    actionPlanStash: null,
    practiceLog: { free: [], tryouts: [] },
    practiceSessions: {},
    tryoutAttempts: {},
    practiceStash: null,
    assessmentDraft: null,
    assessmentAnswers: null,
    assessmentGrade: null,
    assessmentHistory: [],
    compassTarget: null,
    inputsUpdatedAt: null,
    savedScholarships: [],
    snbp: null,
    // Akun baru belum punya data dari sekolah.
    schoolProfile: structuredClone(EMPTY_SCHOOL_PROFILE),
    // Waktu dicatat server, bukan dikirim browser (lihat docs/API_CONTRACT.md bagian 2.4).
    parentConsentAt: payload.parentConsent ? now : null,
  };
  insertAccount(account);
  return { message: "Registration successful", token: mockTokenFor(id), user: toLoginUser(account) };
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
    },
  };
}
