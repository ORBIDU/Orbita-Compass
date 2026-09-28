// Bentuk data persis seperti yang dikirim backend-api (lihat BACKEND_MAP.md
// dan backend-api/prisma/schema.prisma). Data dummy di src/mocks/ wajib
// mengikuti tipe ini supaya saklar VITE_USE_MOCK tidak mengubah tampilan.
// Tanggal dikirim sebagai string ISO karena lewat JSON.

export type Role = "STUDENT" | "BK_TEACHER" | "ADMIN";
export type AlignmentStatus = "ALIGNED" | "PARTIAL" | "MISALIGNED";

export interface StudentProfile {
  id: string;
  userId: string;
  schoolName: string;
  grade: number;
  majorTrack: string;
  city: string;
  targetPtnId: string | null;
  targetMajorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicRecord {
  id: string;
  profileId: string;
  semester: number;
  subject: string;
  score: number;
  kkm: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  profileId: string;
  title: string;
  category: string;
  level: string;
  year: number;
  createdAt: string;
}

export interface Reflection {
  id: string;
  profileId: string;
  /** JSON string berisi array teks */
  interests: string;
  /** JSON string berisi array teks */
  careerGoals: string;
  motivation: string | null;
  updatedAt: string;
}

/** Hasil tes gambaran minat bakat: 5 skor 0–100. */
export interface Assessment {
  id: string;
  profileId: string;
  technology: number;
  research: number;
  creativity: number;
  leadership: number;
  communication: number;
  updatedAt: string;
}

export interface University {
  id: string;
  name: string;
  code: string;
  city: string;
  type: string;
  accreditation: string;
  logoUrl: string | null;
}

export interface Major {
  id: string;
  universityId: string;
  name: string;
  category: string;
  capacity: number;
  capacitySnbp: number;
  capacitySnbt: number;
  capacityMandiri: number;
  passingGrade: number | null;
  accreditation: string;
}

/** Profil lengkap seperti di GET /profile dan di dalam GET /auth/me. */
export interface StudentProfileDetail extends StudentProfile {
  academicRecords: AcademicRecord[];
  achievements: Achievement[];
  reflection: Reflection | null;
  assessment: Assessment | null;
  targetPtn: University | null;
  targetMajor: Major | null;
}

export interface CompassAnalysis {
  id: string;
  profileId: string;
  confidenceScore: number;
  interestAlignmentPct: number;
  competencyAlignmentPct: number;
  careerAlignmentStatus: AlignmentStatus;
  aiSummary: string;
  /** JSON string berisi array teks */
  topStrengths: string;
  /** JSON string berisi array objek jurusan */
  recommendedMajors: string;
  /** JSON string berisi array objek kampus */
  recommendedUnivs: string;
  /** JSON string berisi array objek karier */
  recommendedCareers: string;
  analyzedAt: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

interface UserBase {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
}

/** `user` di respons POST /auth/login dan POST /auth/register. */
export interface LoginUser extends UserBase {
  profile: StudentProfile | null;
}

/**
 * `user` di respons GET /auth/me. Backend juga mengirim `passwordHash`;
 * field itu sengaja dibuang di authService dan tidak pernah disimpan.
 */
export interface MeUser extends UserBase {
  createdAt: string;
  updatedAt: string;
  profile: StudentProfileDetail | null;
}

// ─── Respons endpoint ────────────────────────────────────────────────────────

export interface LoginResponse {
  message: string;
  token: string;
  user: LoginUser;
}

export type RegisterResponse = LoginResponse;

export interface MeResponse {
  user: MeUser;
}

export interface ProfileResponse {
  profile: StudentProfileDetail;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export interface MajorWithUniversity extends Major {
  university: University;
}

export interface UniversityWithMajors extends University {
  majors: Major[];
}

export interface MajorsResponse {
  majors: MajorWithUniversity[];
  pagination: Pagination;
}

export interface UniversitiesResponse {
  universities: UniversityWithMajors[];
  pagination: Pagination;
}

export interface CompassAnalyzeResponse {
  message: string;
  analysis: CompassAnalysis;
}

export interface CompassResultResponse {
  analysis: CompassAnalysis | null;
}
