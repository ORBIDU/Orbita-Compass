/**
 * Status siswa menentukan bagian yang terkunci (docs/SPEK_SISWA.md):
 * - baru: belum mengisi tes gambaran minat bakat
 * - sudah_asesmen: tes selesai, belum pernah latihan atau tryout
 * - aktif: sudah punya data latihan atau tryout
 */
export type StudentStatus = "baru" | "sudah_asesmen" | "aktif";

export const STUDENT_STATUSES: StudentStatus[] = ["baru", "sudah_asesmen", "aktif"];

export const STUDENT_STATUS_LABEL: Record<StudentStatus, string> = {
  baru: "Baru",
  sudah_asesmen: "Sudah Asesmen",
  aktif: "Aktif",
};

/** Bagian portal yang bisa terkunci karena status. */
export type LockableFeature = "compass" | "actionPlan" | "performa";
