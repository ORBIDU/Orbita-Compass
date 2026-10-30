import type {
  WaliDashboardData,
  StudentSummary,
  StudentDetail,
} from "@/types/wali";
import { delay } from "@/lib/delay";

const mock = () => import("@/mocks/waliMock");

/**
 * Mengambil ringkasan dashboard untuk Wali Kelas (KPI, grafik distribusi, tren, dsb.)
 */
export async function getWaliDashboard(): Promise<WaliDashboardData> {
  if (USE_MOCK) {
    await delay(120);
    const m = await mock();
    return m.MOCK_WALI_DASHBOARD;
  }
  // Fallback endpoint ketika backend siap (lihat docs/API_CONTRACT.md)
  throw new Error("Endpoint backend /walikelas/dashboard belum tersedia.");
}

/**
 * Mengambil daftar seluruh siswa di kelas yang diampu
 */
export async function getWaliStudents(): Promise<StudentSummary[]> {
  if (USE_MOCK) {
    await delay(150);
    const m = await mock();
    return m.MOCK_STUDENTS;
  }
  throw new Error("Endpoint backend /walikelas/students belum tersedia.");
}

/**
 * Mengambil detail data seorang siswa (profil, akademik semester 1-6, prestasi, catatan BK)
 */
export async function getWaliStudentDetail(id: number): Promise<StudentDetail> {
  if (USE_MOCK) {
    await delay(180);
    const m = await mock();
    return m.getMockStudentDetail(id);
  }
  throw new Error(`Endpoint backend /walikelas/students/${id} belum tersedia.`);
}

/**
 * Simulasi upload / impor rekap nilai Excel
 */
export async function importRaporExcel(_payload: {
  semester: string;
  tahunAjaran: string;
  fileName: string;
}): Promise<{ success: boolean; count: number }> {
  if (USE_MOCK) {
    await delay(800); // Simulasi proses parsing file excel
    return { success: true, count: 36 };
  }
  throw new Error("Endpoint backend /profile/rapor/import-excel belum disesuaikan.");
}
