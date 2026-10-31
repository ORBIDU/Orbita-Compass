// Definisi tipe data untuk fitur Wali Kelas (/walikelas)

export type StudentProfileStatus = "lengkap" | "sebagian" | "belum";
export type StudentTrend = "naik" | "turun" | "stabil";
export type Gender = "L" | "P";
export type BkPriority = "Tinggi" | "Sedang" | "Rendah";

export interface WaliTeacherProfile {
  id: string;
  name: string;
  nip: string;
  kelas: string;
  semester: string;
  tahunAjaran: string;
  avatarUrl?: string;
  initials: string;
}

export interface WaliKpi {
  rataRataNilai: number;
  deltaNilai: number; // e.g. +2.3
  nilaiTertinggi: number;
  namaTertinggi: string;
  nilaiTerendah: number;
  noteTerendah: string;
  ketuntasanPct: number; // e.g. 83
  tuntasCount: number;
  totalCount: number;
}

export interface DistribusiNilaiItem {
  label: string;
  count: number;
  color: string;
  subLabel: string;
}

export interface TrenSemesterItem {
  sem: string;
  avg: number;
}

export interface BkNotificationItem {
  id: number;
  studentId: number;
  nama: string;
  pesan: string;
  prioritas: BkPriority;
  waktu: string;
}

export interface StudentSummary {
  id: number;
  nama: string;
  nisn: string;
  jk: Gender;
  kelas: string;
  avgNilai: number;
  tren: StudentTrend;
  statusProfil: StudentProfileStatus;
  prestasiCount: number;
  alamat?: string;
  noHpOrtu?: string;
}

export interface StudentAbsensi {
  total: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
}

export interface StudentKeluarga {
  namaAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  noHpOrtu: string;
  alamat: string;
}

export interface StudentBelajar {
  gayaBelajar: string;
  citaCita: string;
  minatKarier: string;
}

export interface RaporMapelItem {
  key: string;
  name: string;
  category: "Wajib" | "Peminatan";
  kkm: number;
  /** Nilai per semester (1 s/d 6) */
  scores: Record<number, number>;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: "Akademik" | "Non-Akademik";
  level: "Sekolah" | "Kota/Kabupaten" | "Provinsi" | "Nasional" | "Internasional";
  year: number;
}

export interface BkNoteItem {
  id: string;
  tanggal: string;
  topik: string;
  konselor: string;
  catatan: string;
  rekomendasi: string;
  tindakLanjut: string;
  prioritas: BkPriority;
}

export interface StudentDetail extends StudentSummary {
  tempatTanggalLahir: string;
  agama: string;
  email: string;
  absensi: StudentAbsensi;
  keluarga: StudentKeluarga;
  belajar: StudentBelajar;
  raporMapel: RaporMapelItem[];
  achievements: AchievementItem[];
  bkNotes: BkNoteItem[];
}

export interface WaliDashboardData {
  wali: WaliTeacherProfile;
  kpi: WaliKpi;
  distribusi: DistribusiNilaiItem[];
  trenSemester: TrenSemesterItem[];
  kelengkapan: {
    lengkapPct: number;
    lengkapCount: number;
    belumCount: number;
    totalCount: number;
  };
  aiInsight: {
    title: string;
    body: string;
    highlightCountUp: number;
    highlightCountDown: number;
  };
  notifikasiBk: BkNotificationItem[];
}
