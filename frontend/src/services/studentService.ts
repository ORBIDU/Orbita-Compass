import type { MeUser, ProfileResponse, StudentProfileDetail } from "@/types/backend";
import type { StudentStatus } from "@/types/student";
import { getToken, request } from "./http";

// Mode dummy: dimuat hanya di cabang USE_MOCK, jadi tidak ikut di build mode backend.
const mock = () => import("@/mocks/studentMock");

export async function getProfile(): Promise<StudentProfileDetail> {
  const data = USE_MOCK ? await (await mock()).mockGetProfile(getToken()) : await request<ProfileResponse>("/profile");
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
  if (USE_MOCK) return (await mock()).mockGetStatus(getToken());
  return user.profile?.assessment ? "sudah_asesmen" : "baru";
}

/** Khusus panel Mode Demo: mengganti status akun dummy. */
export async function setDemoStatus(status: StudentStatus): Promise<StudentStatus> {
  if (!USE_MOCK) throw new Error("Status hanya bisa diganti di mode dummy.");
  return (await mock()).mockSetStatus(getToken(), status);
}
