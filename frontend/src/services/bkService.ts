import type {
  BkDashboardData,
  BkNoteItem,
  BkStudentDetail,
  BkStudentSummary,
  BkTeacherProfile,
  CreateBkNoteInput,
} from "@/types/bk";
import { delay } from "@/lib/delay";

const mock = () => import("@/mocks/bkMock");

/** Profil guru BK yang sedang masuk (NIP, jabatan, sekolah, semester) untuk header dan layout. */
export async function getBkProfile(): Promise<BkTeacherProfile> {
  if (USE_MOCK) {
    const m = await mock();
    return m.MOCK_BK_PROFILE;
  }
  throw new Error("Endpoint backend /bk/profile belum tersedia.");
}

/** Mengambil ringkasan dashboard untuk Guru BK (KPI sekolah, AI monitoring, peta potensi, aktivitas). */
export async function getBkDashboard(): Promise<BkDashboardData> {
  if (USE_MOCK) {
    await delay(120);
    const m = await mock();
    return m.getMockBkDashboard();
  }
  throw new Error("Endpoint backend /bk/dashboard belum tersedia.");
}

/** Mengambil daftar siswa lintas kelas untuk pemantauan dan filter prioritas Guru BK. */
export async function getBkStudents(): Promise<BkStudentSummary[]> {
  if (USE_MOCK) {
    await delay(140);
    const m = await mock();
    return m.MOCK_BK_STUDENTS;
  }
  throw new Error("Endpoint backend /bk/students belum tersedia.");
}

/** Mengambil detail lengkap siswa (profil, rapor, tryout, minat & rekomendasi, prestasi, dan catatan BK). */
export async function getBkStudentDetail(id: number): Promise<BkStudentDetail> {
  if (USE_MOCK) {
    await delay(160);
    const m = await mock();
    return m.getMockBkStudentDetail(id);
  }
  throw new Error(`Endpoint backend /bk/students/${id} belum tersedia.`);
}

/** Menambahkan catatan bimbingan konseling baru untuk siswa. */
export async function addBkCounselingNote(studentId: number, input: CreateBkNoteInput): Promise<BkNoteItem> {
  if (USE_MOCK) {
    await delay(240);
    const m = await mock();
    return m.saveMockBkNote(studentId, input);
  }
  throw new Error(`Endpoint backend POST /bk/students/${studentId}/notes belum tersedia.`);
}
