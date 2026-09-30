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
import { simulateCompass } from "./compassEngine";

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
  achievements: Achievement[];
  reflection: Reflection | null;
  /** Hasil tes yang tersimpan. Hanya tampil jika status bukan "baru". */
  assessment: Assessment | null;
  compassAnalysis: CompassAnalysis | null;
  /** Waktu persetujuan orang tua/wali saat daftar (belum ada di backend, lihat docs/API_CONTRACT.md). */
  parentConsentAt?: string | null;
}

interface MockDb {
  version: number;
  accounts: MockAccount[];
}

const STORAGE_KEY = "orbita_mock_db";
// Naikkan angka ini jika bentuk data dummy berubah, supaya data lama diganti.
// v2 (Tahap 2B): akun demo langsung punya hasil Compass + kampus PTS contoh.
const DB_VERSION = 2;

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

function profileOf(userId: string, data: Pick<StudentProfile, "schoolName" | "grade" | "majorTrack" | "city" | "targetPtnId" | "targetMajorId">): StudentProfile {
  return { id: `profile-${userId}`, userId, createdAt: SEED_DATE, updatedAt: SEED_DATE, ...data };
}

function seed(): MockDb {
  const siswaProfile = profileOf("user-siswa", {
    schoolName: "SMA Negeri 1 Jakarta",
    grade: 12,
    majorTrack: "IPA",
    city: "Jakarta Pusat",
    targetPtnId: "univ-311",
    targetMajorId: "major-311-informatika",
  });
  const budiProfile = profileOf("user-budi", {
    schoolName: "SMA Negeri 3 Bandung",
    grade: 12,
    majorTrack: "IPS",
    city: "Bandung",
    targetPtnId: "univ-361",
    targetMajorId: "major-361-manajemen",
  });

  const siswa: MockAccount = {
    id: "user-siswa",
    email: "siswa@orbita.id",
    password: "password123",
    name: "Ahmad Rizki",
    role: "STUDENT",
    avatarUrl: null,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
    profile: siswaProfile,
    status: "aktif",
    academicRecords: [
      academic(siswaProfile.id, 1, "Matematika Wajib", 88),
      academic(siswaProfile.id, 1, "Fisika", 85),
      academic(siswaProfile.id, 1, "Bahasa Indonesia", 90),
      academic(siswaProfile.id, 2, "Matematika Wajib", 90),
      academic(siswaProfile.id, 2, "Fisika", 89),
      academic(siswaProfile.id, 3, "Matematika Wajib", 92),
      academic(siswaProfile.id, 3, "Fisika", 91),
      academic(siswaProfile.id, 4, "Matematika Wajib", 94),
      academic(siswaProfile.id, 4, "Fisika", 93),
      academic(siswaProfile.id, 5, "Matematika Wajib", 95),
      academic(siswaProfile.id, 5, "Fisika", 94),
    ],
    achievements: [
      { id: "ach-siswa-1", profileId: siswaProfile.id, title: "Juara 1 Olimpiade Sains Nasional (OSN) Komputer", category: "Academic", level: "National", year: 2025, createdAt: SEED_DATE },
      { id: "ach-siswa-2", profileId: siswaProfile.id, title: "Juara 2 Hackathon Pelajar SMA Se-DKI Jakarta", category: "Academic", level: "Province", year: 2025, createdAt: SEED_DATE },
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
      updatedAt: SEED_DATE,
    },
    compassAnalysis: null,
  };

  const budi: MockAccount = {
    id: "user-budi",
    email: "budi@orbita.id",
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

  return { version: DB_VERSION, accounts: [siswa, budi] };
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

export function insertAccount(account: MockAccount): void {
  load().accounts.push(account);
  save();
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
