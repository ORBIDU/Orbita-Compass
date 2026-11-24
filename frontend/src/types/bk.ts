import type {
  AchievementItem,
  BkNoteItem,
  BkPriority,
  Gender,
  RaporMapelItem,
  StudentAbsensi,
  StudentBelajar,
  StudentDetail,
  StudentKeluarga,
  StudentProfileStatus,
  StudentSummary,
  StudentTrend,
} from "@/types/wali";

export type {
  AchievementItem,
  BkNoteItem,
  BkPriority,
  Gender,
  RaporMapelItem,
  StudentAbsensi,
  StudentBelajar,
  StudentKeluarga,
  StudentProfileStatus,
  StudentTrend,
};

export interface BkTeacherProfile {
  id: string;
  name: string;
  nip: string;
  jabatan: string;
  sekolah: string;
  semester: string;
  tahunAjaran: string;
  avatarUrl?: string;
  initials: string;
}

export interface BkKpi {
  totalSiswa: number;
  siswaPrioritas: number;
  belumTesMinat: number;
  totalKelas: number;
}

export interface BkAiFinding {
  id: string;
  highlight: string;
  text: string;
  tone: "danger" | "warning" | "purple";
}

export type PotensiGradeFilter = "semua" | "x" | "xi" | "xii";

export interface PotensiBidangItem {
  label: string;
  pct: number;
  color: string;
}

export type BkPotensiData = Record<
  PotensiGradeFilter,
  {
    total: number;
    items: PotensiBidangItem[];
  }
>;

export type BkActivityType = "selesai" | "catatan" | "ai" | "pengajuan";

export interface BkActivityItem {
  id: string;
  studentId?: number;
  nama: string;
  aksi: string;
  waktu: string;
  type: BkActivityType;
}

export interface BkDashboardData {
  guru: BkTeacherProfile;
  kpi: BkKpi;
  aiMonitoring: {
    title: string;
    subtitle: string;
    summary: string;
    findings: BkAiFinding[];
  };
  potensi: BkPotensiData;
  aktivitas: BkActivityItem[];
}

export type BkPendampinganLevel = "pendampingan" | "dipantau" | "normal";
export type BkRekapStatus = "lengkap" | "belum_lengkap" | "belum_diunggah";

export interface BkStudentSummary extends StudentSummary {
  tingkat: "X" | "XI" | "XII";
  rekapSemester: string;
  rekapStatus: BkRekapStatus;
  tesMinatSelesai: boolean;
  prioritasPendampingan: BkPendampinganLevel;
}

export type BkTryoutCategory = "TKA" | "SNBT" | "SKD";

export interface BkTryoutSubtest {
  name: string;
  score: number;
  max: number;
  status: "Sangat Baik" | "Baik" | "Perlu Peningkatan";
}

export interface BkTryoutCategoryData {
  history: { label: string; skor: number }[];
  avgScore: number;
  lastScore: number;
  lastLabel: string;
  ranking: string;
  trenLabel: string;
  subtests: BkTryoutSubtest[];
  aiInsight: string;
}

export type BkEducationTrack = "ptn" | "kedinasan";

export interface BkEducationTrackData {
  bidangNama: string;
  bidangDesc: string;
  targetLabel: string;
  targetNama: string;
  targetProdi: string;
  recommendations: {
    label: string;
    sub: string;
    pct: number;
  }[];
}

export interface BkStudentDetail extends StudentDetail {
  tingkat: "X" | "XI" | "XII";
  prioritasPendampingan: BkPendampinganLevel;
  tesMinatSelesai: boolean;
  nilaiToTerakhir: number;
  minatList: string[];
  bakatList: string[];
  aiAkademik: {
    ringkasan: string;
    kekuatan: string[];
    perluPerhatian: string[];
    rekomendasi: string[];
  };
  tryout: Record<BkTryoutCategory, BkTryoutCategoryData>;
  rekomendasiPendidikan: Record<BkEducationTrack, BkEducationTrackData>;
}

export interface CreateBkNoteInput {
  tanggal: string;
  konselor: string;
  topik: string;
  catatan: string;
  rekomendasi: string;
  tindakLanjut: string;
  prioritas: BkPriority;
}
