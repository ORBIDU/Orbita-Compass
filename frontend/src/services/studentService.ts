import type { MeUser, ProfileResponse, StudentProfileDetail } from "@/types/backend";
import type { StudentStatus } from "@/types/student";
import { mockGetProfile, mockGetStatus, mockSetStatus } from "@/mocks/studentMock";
import { USE_MOCK } from "./config";
import { getToken, request } from "./http";

export async function getProfile(): Promise<StudentProfileDetail> {
  const data = USE_MOCK ? await mockGetProfile(getToken()) : await request<ProfileResponse>("/profile");
  return data.profile;
}

/**
 * Status siswa untuk user yang sedang login. Bukan siswa → null.
 *
 * Backend belum menyimpan status, jadi dengan backend sungguhan status
 * diturunkan dari data: ada hasil tes → "sudah_asesmen", belum → "baru".
 * Status "aktif" butuh riwayat latihan/tryout yang endpoint-nya belum ada
 * (docs/API_CONTRACT.md), sehingga sementara hanya muncul di mode dummy.
 */
export async function getStudentStatus(user: MeUser): Promise<StudentStatus | null> {
  if (user.role !== "STUDENT") return null;
  if (USE_MOCK) return mockGetStatus(getToken());
  return user.profile?.assessment ? "sudah_asesmen" : "baru";
}

/** Khusus panel Mode Demo: mengganti status akun dummy. */
export async function setDemoStatus(status: StudentStatus): Promise<StudentStatus> {
  if (!USE_MOCK) throw new Error("Status hanya bisa diganti di mode dummy.");
  return mockSetStatus(getToken(), status);
}
