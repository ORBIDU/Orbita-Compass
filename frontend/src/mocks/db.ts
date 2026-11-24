import type {
  AcademicRecord,
  Achievement,
  Assessment,
  CompassAnalysis,
  Reflection,
  Role,
  StudentProfile,
} from "@/types/backend";
import type { StudentStatus } from "@/types/student";
import type { PracticeLog } from "@/types/practice";
import type { AsesmenAnswers, AsesmenDraft, AssessmentHistoryEntry } from "@/types/analisis";
import type { CompassTarget } from "@/types/compass";
import type { SnbpDraft } from "@/types/snbp";
import type { SchoolProfile } from "@/types/profil";
import { BUDI_SCHOOL_PROFILE, SISWA_SCHOOL_PROFILE } from "./data/profil";
import { EMPTY_SCHOOL_PROFILE } from "@/data/profilKosong";
import { simulateCompass } from "./compassEngine";
import type { PlanState } from "@/data/actionPlanEngine";
import { demoPlanState } from "./data/actionPlan";
import { EMPTY_PRACTICE_LOG } from "@/data/tryout";
import { demoTryoutData } from "./data/practiceSeed";
import type { PracticeSession, TryoutAttempt } from "@/data/practiceServer";

// "Database" dummy untuk mode VITE_USE_MOCK=true. Disimpan di localStorage
// supaya login dan perubahan data tetap ada setelah halaman di-refresh.
// Akun dan isinya meniru seed backend (backend-api/prisma/seed.ts).

export interface MockAccount {
  id: string;
  email: string;
  /** Password akun demo saja, bukan data sungguhan. */
  password: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  profile: StudentProfile | null;
  /** Status siswa (belum ada di backend, lihat docs/API_CONTRACT.md). */
  status: StudentStatus;
  academicRecords: AcademicRecord[];
  achievements: MockAchievement[];
  reflection: Reflection | null;
  /** Hasil tes yang tersimpan. Hanya tampil jika status bukan "baru". */
  assessment: Assessment | null;
  compassAnalysis: CompassAnalysis | null;
  /**
   * Action Plan: pengaturan rencana + latihan harian (API_CONTRACT bagian 11).
   * null = belum mengatur rencana.
   */
  actionPlan: PlanState | null;
  /** Mode Demo: rencana yang disembunyikan saat status bukan "aktif". */
  actionPlanStash: PlanState | null;
  /** Riwayat latihan bebas dan tryout (API_CONTRACT 12.4). Akurasi latihan Action Plan diambil dari `actionPlan`. */
  practiceLog: PracticeLog;
  /** Sesi latihan (jawaban per soal) dan percobaan tryout (API_CONTRACT 12.5–12.6). */
  practiceSessions: Record<string, PracticeSession>;
  tryoutAttempts: Record<string, TryoutAttempt>;
  /** Mode Demo: data latihan yang disimpan dulu saat status bukan "aktif". */
  practiceStash: { log: PracticeLog; sessions: Record<string, PracticeSession>; attempts: Record<string, TryoutAttempt> } | null;
  /** Jawaban tes yang belum dikirim, disimpan per bagian (API_CONTRACT 3.3). */
  assessmentDraft: AsesmenDraft | null;
  /** Jawaban tes terbaru yang sudah dikirim, untuk "Lihat jawabanku". */
  assessmentAnswers: AsesmenAnswers | null;
  /** Kelas saat tes terbaru diisi. */
  assessmentGrade: number | null;
  /** Riwayat tes kelas sebelumnya (API_CONTRACT 3.2). */
  assessmentHistory: AssessmentHistoryEntry[];
  /** Target jurusan dari Compass (API_CONTRACT 9.1). */
  compassTarget: CompassTarget | null;
  /**
   * Waktu terakhir data masukan Compass berubah tanpa jejak tanggal lain
   * (mis. prestasi diubah atau dihapus). Lihat API_CONTRACT 9.2.
   */
  inputsUpdatedAt: string | null;
  /** Id beasiswa yang disimpan (API_CONTRACT 10.2). */
  savedScholarships: string[];
  /** Data diri dari pihak kurikulum sekolah, hanya dibaca siswa (API_CONTRACT 13.1). */
  schoolProfile: SchoolProfile;
  /** Isian dan hasil terakhir Siap SNBP (API_CONTRACT 12.1). */
  snbp: SnbpDraft | null;
  /**
   * Akun dibuat admin dengan password awal; siswa wajib menggantinya saat
   * pertama masuk (API_CONTRACT 14.2).
   */
  mustChangePassword?: boolean;
  /** Waktu siswa mencentang "Orang tua/wali sudah mengetahui dan menyetujui…" (API_CONTRACT 2.4). */
  parentConsentAt?: string | null;
  /** Waktu siswa menyetujui Syarat & Ketentuan dan Kebijakan Privasi (API_CONTRACT 2.4). */
  termsAcceptedAt?: string | null;
}

/**
 * Prestasi dummy: bentuk backend + field yang belum ada di backend
 * (capaian, penyelenggara, sertifikat; API_CONTRACT bagian 8.1).
 */
export type MockAchievement = Achievement & {
  rank?: string | null;
  organizer?: string | null;
  certificateName?: string | null;
};

interface MockDb {
  version: number;
  accounts: MockAccount[];
}

const STORAGE_KEY = "orbidu_mock_db";
// Naikkan angka ini jika bentuk data dummy berubah, supaya data lama diganti.
// v2 (Tahap 2B): akun demo langsung punya hasil Compass + kampus PTS contoh.
// v3 (Tahap 4A): nama panggilan, rencana belajar, dan riwayat latihan.
// v4 (Tahap 4B): rapor Kurikulum Merdeka lengkap, prestasi + sertifikat, riwayat tes.
// v5 (Tahap 5A): target jurusan Compass dan waktu perubahan data masukan.
// v6 (Tahap 5B): beasiswa yang disimpan.
// v7 (Fase 6): Action Plan berisi latihan soal harian (menggantikan studyPlan).
// v8 (Tahap 7A): isian Siap SNBP.
// v9 (Tahap 7B): riwayat tryout per paket (menggantikan ringkasan `practice`).
// v10 (Tahap 7C): sesi latihan dan percobaan tryout dari bank soal contoh.
// v11: riwayat tryout contoh dengan kenaikan yang wajar.
// v12 (Fase 8): data diri dari sekolah, sekolah demo di Palembang.
// v13: akun dibuat admin (tanpa daftar mandiri), akun demo login pertama, dua persetujuan.
// v14: tambah akun wali kelas walkel@orbidu.id (role WALI_KELAS).
// v15: tambah akun guru BK gurubk@orbidu.id (role BK_TEACHER).
const DB_VERSION = 15;

const SEED_DATE = "2026-07-01T08:00:00.000Z";

function academic(profileId: string, semester: number, subject: string, score: number): AcademicRecord {
  return {
    id: `rec-${profileId}-${semester}-${subject.toLowerCase().replace(/\s+/g, "-")}`,
    profileId,
    semester,
    subject,
    score,
    kkm: 75,
    createdAt: SEED_DATE,
  };
}

// Rapor dummy format Kurikulum Merdeka: satu nilai akhir per mapel.
// Kelas X: 13 mapel umum. Kelas XI: Biologi diganti 2 mapel pilihan tingkat lanjut.
const RAPOR_X = ["Pendidikan Agama dan Budi Pekerti", "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "Bahasa Inggris", "Sejarah", "PJOK", "Seni Budaya", "Fisika", "Kimia", "Biologi", "Informatika", "Muatan Lokal"];
const RAPOR_XI = ["Pendidikan Agama dan Budi Pekerti", "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "Bahasa Inggris", "Sejarah", "PJOK", "Seni Budaya", "Matematika Tingkat Lanjut", "Fisika", "Kimia", "Informatika", "Bahasa Inggris Tingkat Lanjut", "Muatan Lokal"];
/** Nilai akhir semester 1–4 per mapel (sesuai contoh di docs/design/portal/Portal-Analisis.dc.html). */
const RAPOR_SISWA: Record<string, number[]> = {
  "Pendidikan Agama dan Budi Pekerti": [86, 87, 88, 88],
  "Pendidikan Pancasila": [85, 86, 86, 87],
  "Bahasa Indonesia": [85, 86, 86, 87],
  Matematika: [86, 88, 89, 91],
  "Bahasa Inggris": [80, 81, 83, 84],
  Sejarah: [83, 84, 85, 85],
  PJOK: [86, 87, 87, 88],
  "Seni Budaya": [84, 85, 86, 86],
  Fisika: [82, 83, 85, 86],
  Kimia: [81, 82, 84, 85],
  Biologi: [83, 84],
  Informatika: [88, 90, 91, 93],
  "Muatan Lokal": [85, 86, 86, 87],
  "Matematika Tingkat Lanjut": [0, 0, 88, 90],
  "Bahasa Inggris Tingkat Lanjut": [0, 0, 82, 83],
};

function raporSeed(profileId: string): AcademicRecord[] {
  const records: AcademicRecord[] = [];
  for (let semester = 1; semester <= 4; semester++) {
    for (const subject of semester <= 2 ? RAPOR_X : RAPOR_XI) {
      records.push({ ...academic(profileId, semester, subject, RAPOR_SISWA[subject][semester - 1]), createdAt: RAPOR_UPDATED });
    }
  }
  return records;
}

/** Tanggal rapor semester 4 diunggah sekolah (dummy). */
const RAPOR_UPDATED = "2026-07-05T08:00:00.000Z";

function profileOf(
  userId: string,
  data: Pick<StudentProfile, "schoolName" | "grade" | "majorTrack" | "city" | "targetPtnId" | "targetMajorId" | "nickname">,
): StudentProfile {
  return { id: `profile-${userId}`, userId, createdAt: SEED_DATE, updatedAt: SEED_DATE, ...data };
}

function seed(): MockDb {
  const siswaProfile = profileOf("user-siswa", {
    schoolName: "SMA Negeri 1 Palembang",
    grade: 12,
    majorTrack: "IPA",
    city: "Palembang",
    targetPtnId: "univ-311",
    targetMajorId: "major-311-informatika",
    nickname: "Rizki",
  });
  const budiProfile = profileOf("user-budi", {
    schoolName: "SMA Negeri 3 Bandung",
    grade: 12,
    majorTrack: "IPS",
    city: "Bandung",
    targetPtnId: "univ-361",
    targetMajorId: "major-361-manajemen",
    nickname: "Budi",
  });

  const demoTryout = demoTryoutData();
  const siswa: MockAccount = {
    id: "user-siswa",
    email: "siswa@orbidu.id",
    password: "password123",
    name: "Ahmad Rizki",
    role: "STUDENT",
    avatarUrl: null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
    profile: siswaProfile,
    status: "aktif",
    academicRecords: raporSeed(siswaProfile.id),
    achievements: [
      { id: "ach-siswa-1", profileId: siswaProfile.id, title: "Olimpiade Sains Nasional bidang Informatika", category: "Academic", level: "National", year: 2025, createdAt: SEED_DATE, rank: "Medali Perunggu", organizer: "Puspresnas", certificateName: "sertifikat-osn.pdf" },
      { id: "ach-siswa-2", profileId: siswaProfile.id, title: "Hackathon Pelajar SMA se-Sumatera Selatan", category: "Academic", level: "Province", year: 2025, createdAt: SEED_DATE, rank: "Juara 2", organizer: "Dinas Pendidikan Provinsi Sumatera Selatan", certificateName: null },
      { id: "ach-siswa-3", profileId: siswaProfile.id, title: "Ketua OSIS", category: "Non-Academic", level: "School", year: 2025, createdAt: SEED_DATE, rank: "Periode 2025/2026", organizer: "SMA Negeri 1 Palembang", certificateName: "sk-osis.pdf" },
      { id: "ach-siswa-4", profileId: siswaProfile.id, title: "Turnamen Futsal Pelajar", category: "Non-Academic", level: "City", year: 2024, createdAt: SEED_DATE, rank: "Juara 3", organizer: "Pemerintah Kota Palembang", certificateName: "piagam-futsal.jpg" },
    ],
    reflection: {
      id: "refl-siswa",
      profileId: siswaProfile.id,
      interests: JSON.stringify(["Software Engineering", "AI & Machine Learning", "Robotics"]),
      careerGoals: JSON.stringify(["AI Engineer", "Technology Entrepreneur"]),
      motivation: "Ingin menciptakan solusi teknologi cerdas untuk pendidikan Indonesia.",
      updatedAt: SEED_DATE,
    },
    assessment: {
      id: "asm-siswa",
      profileId: siswaProfile.id,
      technology: 88,
      research: 82,
      creativity: 75,
      leadership: 70,
      communication: 78,
      updatedAt: "2026-09-12T08:00:00.000Z",
    },
    compassAnalysis: null,
    assessmentDraft: null,
    // Akun demo mengisi tes sebelum fitur simpan jawaban ada, jadi jawabannya tidak tersimpan.
    assessmentAnswers: null,
    assessmentGrade: 12,
    assessmentHistory: [
      { grade: 11, completedAt: "2025-08-08T08:00:00.000Z", topBidang: "teknologi" },
      { grade: 10, completedAt: "2024-08-14T08:00:00.000Z", topBidang: "sains" },
    ],
    compassTarget: null,
    inputsUpdatedAt: null,
    savedScholarships: ["kip-kuliah"],
    snbp: null,
    schoolProfile: structuredClone(SISWA_SCHOOL_PROFILE),
    mustChangePassword: false,
    parentConsentAt: "2026-08-12T08:00:00.000Z",
    termsAcceptedAt: "2026-08-12T08:00:00.000Z",
    actionPlan: demoPlanState(new Date()),
    actionPlanStash: null,
    practiceLog: demoTryout.log,
    practiceSessions: {},
    tryoutAttempts: demoTryout.attempts,
    practiceStash: null,
  };

  const budi: MockAccount = {
    id: "user-budi",
    email: "budi@orbidu.id",
    password: "password123",
    name: "Budi Pratama",
    role: "STUDENT",
    avatarUrl: null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
    profile: budiProfile,
    status: "sudah_asesmen",
    academicRecords: [],
    achievements: [],
    reflection: null,
    assessment: {
      id: "asm-budi",
      profileId: budiProfile.id,
      technology: 65,
      research: 78,
      creativity: 85,
      leadership: 92,
      communication: 90,
      updatedAt: SEED_DATE,
    },
    compassAnalysis: null,
    actionPlan: null,
    actionPlanStash: null,
    practiceLog: structuredClone(EMPTY_PRACTICE_LOG),
    practiceSessions: {},
    tryoutAttempts: {},
    practiceStash: null,
    assessmentDraft: null,
    assessmentAnswers: null,
    assessmentGrade: 12,
    assessmentHistory: [],
    compassTarget: null,
    inputsUpdatedAt: null,
    savedScholarships: [],
    snbp: null,
    schoolProfile: structuredClone(BUDI_SCHOOL_PROFILE),
    mustChangePassword: false,
    parentConsentAt: "2026-07-20T08:00:00.000Z",
    termsAcceptedAt: "2026-07-20T08:00:00.000Z",
  };

  // Akun yang baru dibuat admin: belum pernah masuk, jadi wajib ganti password
  // awal dan mengisi dua persetujuan dulu (halaman /aktivasi).
  const dimasProfile = profileOf("user-dimas", {
    schoolName: "SMA Negeri 1 Palembang",
    grade: 10,
    majorTrack: "IPA",
    city: "Palembang",
    targetPtnId: null,
    targetMajorId: null,
    nickname: null,
  });
  const dimas: MockAccount = {
    id: "user-dimas",
    email: "dimas@orbidu.id",
    password: "password123",
    name: "Dimas Saputra",
    role: "STUDENT",
    avatarUrl: null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
    profile: dimasProfile,
    status: "baru",
    academicRecords: [],
    achievements: [],
    reflection: null,
    assessment: null,
    compassAnalysis: null,
    actionPlan: null,
    actionPlanStash: null,
    practiceLog: structuredClone(EMPTY_PRACTICE_LOG),
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
    schoolProfile: structuredClone(EMPTY_SCHOOL_PROFILE),
    mustChangePassword: true,
    parentConsentAt: null,
    termsAcceptedAt: null,
  };

  const walkel: MockAccount = {
    id: "user-walkel",
    email: "walkel@orbidu.id",
    password: "password123",
    name: "Dewi Sartika, S.Pd.",
    role: "WALI_KELAS",
    avatarUrl: null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
    profile: null,
    status: "aktif",
    academicRecords: [],
    achievements: [],
    reflection: null,
    assessment: null,
    compassAnalysis: null,
    actionPlan: null,
    actionPlanStash: null,
    practiceLog: structuredClone(EMPTY_PRACTICE_LOG),
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
    schoolProfile: structuredClone(EMPTY_SCHOOL_PROFILE),
    mustChangePassword: false,
    parentConsentAt: "2026-07-20T08:00:00.000Z",
    termsAcceptedAt: "2026-07-20T08:00:00.000Z",
  };

  const gurubk: MockAccount = {
    id: "user-gurubk",
    email: "gurubk@orbidu.id",
    password: "password123",
    name: "Hendra Raharjo, S.Psi.",
    role: "BK_TEACHER",
    avatarUrl: null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
    profile: null,
    status: "aktif",
    academicRecords: [],
    achievements: [],
    reflection: null,
    assessment: null,
    compassAnalysis: null,
    actionPlan: null,
    actionPlanStash: null,
    practiceLog: structuredClone(EMPTY_PRACTICE_LOG),
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
    schoolProfile: structuredClone(EMPTY_SCHOOL_PROFILE),
    mustChangePassword: false,
    parentConsentAt: "2026-07-20T08:00:00.000Z",
    termsAcceptedAt: "2026-07-20T08:00:00.000Z",
  };

  // Akun demo yang sudah asesmen dianggap sudah pernah membuka Compass,
  // supaya label kecocokan di kartu jurusan bisa langsung dicoba.
  for (const account of [siswa, budi]) {
    if (account.assessment && account.profile) {
      account.compassAnalysis = simulateCompass(
        account.assessment,
        account.academicRecords.map((r) => r.score),
        account.achievements.length,
        account.profile.id,
      );
    }
  }

  return { version: DB_VERSION, accounts: [siswa, budi, dimas, walkel, gurubk] };
}

let cache: MockDb | null = null;

function load(): MockDb {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockDb;
      if (parsed.version === DB_VERSION && Array.isArray(parsed.accounts)) {
        cache = parsed;
        return cache;
      }
    }
  } catch {
    /* data rusak atau localStorage tidak bisa dipakai → pakai seed */
  }
  cache = seed();
  return cache;
}

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(load()));
  } catch {
    /* abaikan: data tetap ada di memori sampai halaman ditutup */
  }
}

export function findAccountById(id: string): MockAccount | undefined {
  return load().accounts.find((a) => a.id === id);
}

export function findAccountByEmail(email: string): MockAccount | undefined {
  const target = email.trim().toLowerCase();
  return load().accounts.find((a) => a.email.toLowerCase() === target);
}

/** Ubah akun lalu simpan. */
export function updateAccount(id: string, change: (account: MockAccount) => void): MockAccount | undefined {
  const account = findAccountById(id);
  if (!account) return undefined;
  change(account);
  account.updatedAt = new Date().toISOString();
  save();
  return account;
}

/** Kembalikan semua data dummy ke kondisi awal (dipakai panel Mode Demo). */
export function resetMockDb(): void {
  cache = seed();
  save();
}

// ─── Token dummy ─────────────────────────────────────────────────────────────

const TOKEN_PREFIX = "mock.";

export function mockTokenFor(accountId: string): string {
  return `${TOKEN_PREFIX}${accountId}`;
}

export function accountFromToken(token: string | null): MockAccount | undefined {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return undefined;
  return findAccountById(token.slice(TOKEN_PREFIX.length));
}
