import { BRAND } from "@/config/brand";
import { formatDate } from "@/lib/datetime";
import type {
  BkActivityItem,
  BkDashboardData,
  BkNoteItem,
  BkStudentDetail,
  BkStudentSummary,
  BkTeacherProfile,
  CreateBkNoteInput,
  RaporMapelItem,
} from "@/types/bk";

export const BK_KELAS_LIST = [
  "X IPA 1",
  "X IPA 2",
  "XI IPA 1",
  "XI IPA 2",
  "XII IPA 1",
  "XII IPA 2",
] as const;

export const MOCK_BK_PROFILE: BkTeacherProfile = {
  id: "bk-1",
  name: "Hendra Raharjo, S.Psi.",
  nip: "19870918 201201 1 008",
  jabatan: "Konselor BK",
  sekolah: "SMA Negeri 1 Palembang",
  semester: "Semester Ganjil",
  tahunAjaran: "2026 / 2027",
  initials: "HR",
};

export const MOCK_BK_STUDENTS: BkStudentSummary[] = [
  {
    id: 1,
    nama: "Andi Maulana",
    nisn: "0061234561",
    jk: "L",
    kelas: "X IPA 1",
    tingkat: "X",
    avgNilai: 91.2,
    tren: "naik",
    statusProfil: "lengkap",
    rekapSemester: "Semester 1",
    rekapStatus: "lengkap",
    prestasiCount: 3,
    tesMinatSelesai: true,
    prioritasPendampingan: "normal",
    alamat: "Jl. Mawar No. 12, Palembang",
    noHpOrtu: "0812-3456-7890",
  },
  {
    id: 2,
    nama: "Bela Saputri",
    nisn: "0061234562",
    jk: "P",
    kelas: "X IPA 2",
    tingkat: "X",
    avgNilai: 88.4,
    tren: "naik",
    statusProfil: "lengkap",
    rekapSemester: "Semester 1",
    rekapStatus: "lengkap",
    prestasiCount: 1,
    tesMinatSelesai: true,
    prioritasPendampingan: "normal",
    alamat: "Jl. Melati No. 5, Palembang",
    noHpOrtu: "0823-4567-8901",
  },
  {
    id: 3,
    nama: "Candra Wijaya",
    nisn: "0061234563",
    jk: "L",
    kelas: "XI IPA 1",
    tingkat: "XI",
    avgNilai: 74.1,
    tren: "turun",
    statusProfil: "sebagian",
    rekapSemester: "Semester 3",
    rekapStatus: "belum_lengkap",
    prestasiCount: 0,
    tesMinatSelesai: true,
    prioritasPendampingan: "pendampingan",
    alamat: "Jl. Anggrek No. 8, Palembang",
    noHpOrtu: "0834-5678-9012",
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    nisn: "0061234564",
    jk: "P",
    kelas: "XI IPA 2",
    tingkat: "XI",
    avgNilai: 85.7,
    tren: "stabil",
    statusProfil: "lengkap",
    rekapSemester: "Semester 3",
    rekapStatus: "lengkap",
    prestasiCount: 2,
    tesMinatSelesai: true,
    prioritasPendampingan: "normal",
    alamat: "Jl. Dahlia No. 3, Palembang",
    noHpOrtu: "0845-6789-0123",
  },
  {
    id: 5,
    nama: "Eka Pratama",
    nisn: "0061234565",
    jk: "L",
    kelas: "XII IPA 1",
    tingkat: "XII",
    avgNilai: 72.3,
    tren: "turun",
    statusProfil: "belum",
    rekapSemester: "—",
    rekapStatus: "belum_diunggah",
    prestasiCount: 0,
    tesMinatSelesai: false,
    prioritasPendampingan: "pendampingan",
    alamat: "Jl. Bougenville No. 17, Palembang",
    noHpOrtu: "0856-7890-1234",
  },
  {
    id: 6,
    nama: "Farah Nadia",
    nisn: "0061234566",
    jk: "P",
    kelas: "XII IPA 2",
    tingkat: "XII",
    avgNilai: 93.8,
    tren: "naik",
    statusProfil: "lengkap",
    rekapSemester: "Semester 5",
    rekapStatus: "lengkap",
    prestasiCount: 4,
    tesMinatSelesai: true,
    prioritasPendampingan: "normal",
    alamat: "Jl. Kenanga No. 21, Palembang",
    noHpOrtu: "0867-8901-2345",
  },
  {
    id: 7,
    nama: "Galih Santoso",
    nisn: "0061234567",
    jk: "L",
    kelas: "XI IPA 1",
    tingkat: "XI",
    avgNilai: 79.5,
    tren: "naik",
    statusProfil: "sebagian",
    rekapSemester: "Semester 3",
    rekapStatus: "belum_lengkap",
    prestasiCount: 1,
    tesMinatSelesai: true,
    prioritasPendampingan: "dipantau",
    alamat: "Jl. Teratai No. 9, Palembang",
    noHpOrtu: "0878-9012-3456",
  },
  {
    id: 8,
    nama: "Hana Pertiwi",
    nisn: "0061234568",
    jk: "P",
    kelas: "X IPA 1",
    tingkat: "X",
    avgNilai: 89.1,
    tren: "naik",
    statusProfil: "lengkap",
    rekapSemester: "Semester 1",
    rekapStatus: "lengkap",
    prestasiCount: 2,
    tesMinatSelesai: true,
    prioritasPendampingan: "dipantau",
    alamat: "Jl. Flamboyan No. 6, Palembang",
    noHpOrtu: "0889-0123-4567",
  },
  {
    id: 9,
    nama: "Ahmad Fauzi",
    nisn: "0061234569",
    jk: "L",
    kelas: "XII IPA 1",
    tingkat: "XII",
    avgNilai: 86.5,
    tren: "naik",
    statusProfil: "lengkap",
    rekapSemester: "Semester 5",
    rekapStatus: "lengkap",
    prestasiCount: 2,
    tesMinatSelesai: true,
    prioritasPendampingan: "normal",
    alamat: "Jl. Sudirman No. 45, Palembang",
    noHpOrtu: "0813-4567-8902",
  },
  {
    id: 10,
    nama: "Sarah Amelia",
    nisn: "0061234570",
    jk: "P",
    kelas: "XI IPA 2",
    tingkat: "XI",
    avgNilai: 84.2,
    tren: "stabil",
    statusProfil: "lengkap",
    rekapSemester: "Semester 3",
    rekapStatus: "lengkap",
    prestasiCount: 1,
    tesMinatSelesai: true,
    prioritasPendampingan: "dipantau",
    alamat: "Jl. Veteran No. 18, Palembang",
    noHpOrtu: "0814-5678-9013",
  },
  {
    id: 11,
    nama: "Dewi Kusuma",
    nisn: "0061234571",
    jk: "P",
    kelas: "XII IPA 2",
    tingkat: "XII",
    avgNilai: 76.4,
    tren: "turun",
    statusProfil: "sebagian",
    rekapSemester: "Semester 5",
    rekapStatus: "belum_lengkap",
    prestasiCount: 0,
    tesMinatSelesai: false,
    prioritasPendampingan: "pendampingan",
    alamat: "Jl. Kartini No. 10, Palembang",
    noHpOrtu: "0815-6789-0124",
  },
  {
    id: 12,
    nama: "Rizky Darmawan",
    nisn: "0061234572",
    jk: "L",
    kelas: "XII IPA 1",
    tingkat: "XII",
    avgNilai: 73.8,
    tren: "turun",
    statusProfil: "belum",
    rekapSemester: "—",
    rekapStatus: "belum_diunggah",
    prestasiCount: 0,
    tesMinatSelesai: false,
    prioritasPendampingan: "pendampingan",
    alamat: "Jl. Demang Lebar Daun No. 31, Palembang",
    noHpOrtu: "0816-7890-1235",
  },
  {
    id: 13,
    nama: "Nadia Khairunnisa",
    nisn: "0061234573",
    jk: "P",
    kelas: "XII IPA 2",
    tingkat: "XII",
    avgNilai: 81.9,
    tren: "stabil",
    statusProfil: "lengkap",
    rekapSemester: "Semester 5",
    rekapStatus: "lengkap",
    prestasiCount: 1,
    tesMinatSelesai: false,
    prioritasPendampingan: "dipantau",
    alamat: "Jl. Basuki Rahmat No. 7, Palembang",
    noHpOrtu: "0817-8901-2346",
  },
  {
    id: 14,
    nama: "Bagas Pradipta",
    nisn: "0061234574",
    jk: "L",
    kelas: "X IPA 2",
    tingkat: "X",
    avgNilai: 80.5,
    tren: "stabil",
    statusProfil: "sebagian",
    rekapSemester: "Semester 1",
    rekapStatus: "lengkap",
    prestasiCount: 1,
    tesMinatSelesai: false,
    prioritasPendampingan: "dipantau",
    alamat: "Jl. Merdeka No. 19, Palembang",
    noHpOrtu: "0818-9012-3457",
  },
  {
    id: 15,
    nama: "Tania Wulandari",
    nisn: "0061234575",
    jk: "P",
    kelas: "XI IPA 1",
    tingkat: "XI",
    avgNilai: 90.4,
    tren: "naik",
    statusProfil: "lengkap",
    rekapSemester: "Semester 3",
    rekapStatus: "lengkap",
    prestasiCount: 3,
    tesMinatSelesai: true,
    prioritasPendampingan: "normal",
    alamat: "Jl. Diponegoro No. 22, Palembang",
    noHpOrtu: "0819-0123-4568",
  },
  {
    id: 16,
    nama: "Fajar Nugroho",
    nisn: "0061234576",
    jk: "L",
    kelas: "XI IPA 2",
    tingkat: "XI",
    avgNilai: 74.8,
    tren: "turun",
    statusProfil: "belum",
    rekapSemester: "Semester 3",
    rekapStatus: "belum_lengkap",
    prestasiCount: 0,
    tesMinatSelesai: false,
    prioritasPendampingan: "pendampingan",
    alamat: "Jl. Rajawali No. 14, Palembang",
    noHpOrtu: "0821-1234-5679",
  },
  {
    id: 17,
    nama: "Maya Salsabila",
    nisn: "0061234577",
    jk: "P",
    kelas: "X IPA 1",
    tingkat: "X",
    avgNilai: 87.9,
    tren: "naik",
    statusProfil: "lengkap",
    rekapSemester: "Semester 1",
    rekapStatus: "lengkap",
    prestasiCount: 2,
    tesMinatSelesai: true,
    prioritasPendampingan: "normal",
    alamat: "Jl. Kapten A. Rivai No. 4, Palembang",
    noHpOrtu: "0822-2345-6780",
  },
  {
    id: 18,
    nama: "Dimas Kurniawan",
    nisn: "0061234578",
    jk: "L",
    kelas: "X IPA 2",
    tingkat: "X",
    avgNilai: 77.2,
    tren: "turun",
    statusProfil: "sebagian",
    rekapSemester: "—",
    rekapStatus: "belum_diunggah",
    prestasiCount: 0,
    tesMinatSelesai: false,
    prioritasPendampingan: "dipantau",
    alamat: "Jl. Sumpah Pemuda No. 8, Palembang",
    noHpOrtu: "0823-3456-7891",
  },
];

const INITIAL_ACTIVITIES: BkActivityItem[] = [
  {
    id: "act-1",
    studentId: 9,
    nama: "Ahmad Fauzi",
    aksi: "Konseling selesai",
    waktu: "09:20",
    type: "selesai",
  },
  {
    id: "act-2",
    studentId: 10,
    nama: "Sarah Amelia",
    aksi: "Catatan diperbarui",
    waktu: "11:00",
    type: "catatan",
  },
  {
    id: "act-3",
    nama: `${BRAND.name} AI`,
    aksi: "Analisis 12 siswa selesai",
    waktu: "12:15",
    type: "ai",
  },
  {
    id: "act-4",
    studentId: 11,
    nama: "Dewi Kusuma",
    aksi: "Pengajuan konseling baru",
    waktu: "13:30",
    type: "pengajuan",
  },
];

export const MOCK_BK_DASHBOARD_BASE: BkDashboardData = {
  guru: MOCK_BK_PROFILE,
  kpi: {
    totalSiswa: 325,
    siswaPrioritas: 15,
    belumTesMinat: 24,
    totalKelas: 6,
  },
  aiMonitoring: {
    title: `${BRAND.name} AI Monitoring`,
    subtitle: "Berdasarkan analisis AI minggu ini:",
    summary: "AI merekomendasikan siswa-siswa tersebut menjadi prioritas pendampingan.",
    findings: [
      {
        id: "f-1",
        highlight: "8 siswa",
        text: "mengalami penurunan performa akademik.",
        tone: "danger",
      },
      {
        id: "f-2",
        highlight: "4 siswa kelas XII",
        text: "belum mengikuti Tes Minat Bakat.",
        tone: "warning",
      },
      {
        id: "f-3",
        highlight: "12 siswa",
        text: "memiliki ketidaksesuaian antara minat dan performa akademik.",
        tone: "purple",
      },
    ],
  },
  potensi: {
    semua: {
      total: 325,
      items: [
        { label: "Teknik", pct: 40, color: "#0965FA" },
        { label: "Humaniora", pct: 30, color: "#00B2DD" },
        { label: "Medis", pct: 20, color: "#22C55E" },
        { label: "Seni", pct: 10, color: "#F1AD00" },
      ],
    },
    x: {
      total: 108,
      items: [
        { label: "Teknik", pct: 35, color: "#0965FA" },
        { label: "Humaniora", pct: 28, color: "#00B2DD" },
        { label: "Medis", pct: 25, color: "#22C55E" },
        { label: "Seni", pct: 12, color: "#F1AD00" },
      ],
    },
    xi: {
      total: 110,
      items: [
        { label: "Teknik", pct: 42, color: "#0965FA" },
        { label: "Humaniora", pct: 30, color: "#00B2DD" },
        { label: "Medis", pct: 18, color: "#22C55E" },
        { label: "Seni", pct: 10, color: "#F1AD00" },
      ],
    },
    xii: {
      total: 107,
      items: [
        { label: "Teknik", pct: 44, color: "#0965FA" },
        { label: "Humaniora", pct: 28, color: "#00B2DD" },
        { label: "Medis", pct: 20, color: "#22C55E" },
        { label: "Seni", pct: 8, color: "#F1AD00" },
      ],
    },
  },
  aktivitas: INITIAL_ACTIVITIES,
};

const SEEDED_NOTES: Record<number, BkNoteItem[]> = {
  1: [
    {
      id: "bk-seed-1",
      tanggal: "12 Mei 2026",
      topik: "Penjurusan & Target PTN",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan:
        "Siswa menunjukkan motivasi tinggi dan sudah memiliki target PTN yang jelas. Perlu dukungan manajemen waktu belajar mandiri agar konsisten.",
      rekomendasi: "Berikan jadwal belajar terstruktur dan dorong bergabung dengan kelompok belajar olimpiade.",
      tindakLanjut: "Pantau konsistensi nilai setiap tryout berikutnya.",
      prioritas: "Rendah",
    },
  ],
  3: [
    {
      id: "bk-seed-3a",
      tanggal: "2 Mei 2026",
      topik: "Tindak Lanjut Kehadiran",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan:
        "Kehadiran sedikit membaik namun belum stabil. Orang tua sudah dihubungi via telepon dan berjanji lebih aktif memantau.",
      rekomendasi: "Lanjutkan pemantauan mingguan serta evaluasi beban praktikum.",
      tindakLanjut: "Check-in dengan siswa setiap Senin pagi bersama wali kelas.",
      prioritas: "Tinggi",
    },
    {
      id: "bk-seed-3b",
      tanggal: "5 April 2026",
      topik: "Kehadiran & Motivasi Belajar",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan:
        "Siswa beberapa kali tidak masuk tanpa keterangan jelas. Saat dikonseling, mengungkapkan rasa kurang nyaman dan kesulitan mengikuti materi Matematika.",
      rekomendasi:
        "Perlu pendampingan intensif. Koordinasikan dengan orang tua dan pertimbangkan dukungan belajar tambahan.",
      tindakLanjut: "Jadwalkan pertemuan orang tua bulan depan. Wali kelas perhatikan kehadiran berkala.",
      prioritas: "Tinggi",
    },
  ],
  5: [
    {
      id: "bk-seed-5",
      tanggal: "10 April 2026",
      topik: "Kehadiran & Kondisi Kesehatan",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan:
        "Siswa sering absen karena sakit. Dari perbincangan, diduga ada tekanan belajar menjelang persiapan ujian akhir.",
      rekomendasi: "Kurangi tekanan berlebih dan berikan apresiasi atas progres harian siswa.",
      tindakLanjut: "Wali kelas koordinasi dengan orang tua agar memberi dukungan emosional di rumah.",
      prioritas: "Tinggi",
    },
  ],
  7: [
    {
      id: "bk-seed-7",
      tanggal: "8 Mei 2026",
      topik: "Adaptasi & Kepercayaan Diri",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan:
        "Siswa cenderung pendiam dan kurang aktif berpartisipasi di kelas meskipun kemampuan analitiknya cukup baik.",
      rekomendasi: "Beri kesempatan presentasi kelompok kecil dan apresiasi kontribusi di kelas.",
      tindakLanjut: "Wali kelas perhatikan dan beri dorongan positif saat diskusi kelas.",
      prioritas: "Sedang",
    },
  ],
  8: [
    {
      id: "bk-seed-8",
      tanggal: "15 Mei 2026",
      topik: "Pilihan Jurusan",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan:
        "Siswa bimbang antara mengikuti keinginan orang tua (Kedokteran) atau minat pribadi (Desain Komunikasi Visual).",
      rekomendasi: "Fasilitasi siswa mengenal prospek kedua bidang lebih dalam dan libatkan orang tua dalam diskusi terarah.",
      tindakLanjut: "Jadwalkan sesi konseling lanjutan dengan menghadirkan orang tua.",
      prioritas: "Sedang",
    },
  ],
  9: [
    {
      id: "bk-seed-9",
      tanggal: "20 November 2026",
      topik: "Pemantapan Strategi SNBT & SNBP",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan: "Sesi konseling selesai dengan hasil sangat baik. Siswa siap mengunci pilihan prodi Teknik Informatika.",
      rekomendasi: "Fokus meningkatkan akurasi Literasi Bahasa Inggris di sisa jadwal latihan Action Plan.",
      tindakLanjut: "Review hasil Tryout #4 bulan depan.",
      prioritas: "Rendah",
    },
  ],
  10: [
    {
      id: "bk-seed-10",
      tanggal: "20 November 2026",
      topik: "Evaluasi Keseimbangan Belajar & Organisasi",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan: "Catatan diperbarui setelah diskusi pembagian jadwal OSIS dan persiapan ujian tengah semester.",
      rekomendasi: "Gunakan kalender belajar mingguan untuk membatasi aktivitas non-akademik saat pekan ulangan.",
      tindakLanjut: "Koordinasi dengan pembina OSIS dan wali kelas XI IPA 2.",
      prioritas: "Sedang",
    },
  ],
  11: [
    {
      id: "bk-seed-11",
      tanggal: "20 November 2026",
      topik: "Pengajuan Konseling Penurunan Skor",
      konselor: "Hendra Raharjo, S.Psi.",
      catatan: "Siswa mengajukan jadwal konseling baru karena merasa bingung memilih jurusan dan belum menyelesaikan Tes Minat Bakat.",
      rekomendasi: "Arahkan siswa segera menyelesaikan asesmen minat bakat sebagai bahan sesi tatap muka.",
      tindakLanjut: "Jadwalkan sesi konseling tatap muka minggu ini.",
      prioritas: "Tinggi",
    },
  ],
};

const BK_NOTES_STORAGE_KEY = "orbidu_mock_bk_notes_v1";
const BK_ACTIVITIES_STORAGE_KEY = "orbidu_mock_bk_activities_v1";

function loadSavedNotes(): Record<number, BkNoteItem[]> {
  try {
    const raw = localStorage.getItem(BK_NOTES_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<number, BkNoteItem[]>;
  } catch {
    /* abaikan jika storage tidak tersedia */
  }
  return {};
}

function loadSavedActivities(): BkActivityItem[] {
  try {
    const raw = localStorage.getItem(BK_ACTIVITIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BkActivityItem[];
  } catch {
    /* abaikan jika storage tidak tersedia */
  }
  return [];
}

export function saveMockBkNote(studentId: number, input: CreateBkNoteInput): BkNoteItem {
  const formattedDate = /^\d{4}-\d{2}-\d{2}$/.test(input.tanggal)
    ? formatDate(input.tanggal)
    : input.tanggal;

  const newNote: BkNoteItem = {
    id: `bk-local-${Date.now()}`,
    tanggal: formattedDate,
    topik: input.topik.trim(),
    konselor: input.konselor.trim() || MOCK_BK_PROFILE.name,
    catatan: input.catatan.trim() || "-",
    rekomendasi: input.rekomendasi.trim() || "-",
    tindakLanjut: input.tindakLanjut.trim() || "-",
    prioritas: input.prioritas,
  };

  const existing = loadSavedNotes();
  const prevList = existing[studentId] ?? [];
  existing[studentId] = [newNote, ...prevList];

  try {
    localStorage.setItem(BK_NOTES_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    /* abaikan */
  }

  const student = MOCK_BK_STUDENTS.find((s) => s.id === studentId);
  if (student) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const newActivity: BkActivityItem = {
      id: `act-local-${Date.now()}`,
      studentId,
      nama: student.nama,
      aksi: `Catatan konseling baru: ${newNote.topik}`,
      waktu: `${hh}:${mm}`,
      type: "catatan",
    };
    const prevAct = loadSavedActivities();
    try {
      localStorage.setItem(BK_ACTIVITIES_STORAGE_KEY, JSON.stringify([newActivity, ...prevAct].slice(0, 6)));
    } catch {
      /* abaikan */
    }
  }

  return newNote;
}

export function getMockBkDashboard(): BkDashboardData {
  const customActivities = loadSavedActivities();
  return {
    ...MOCK_BK_DASHBOARD_BASE,
    aktivitas: [...customActivities, ...INITIAL_ACTIVITIES].slice(0, 6),
  };
}

const DEFAULT_MAPEL: RaporMapelItem[] = [
  {
    key: "mat",
    name: "Matematika Tingkat Lanjut",
    category: "Peminatan",
    kkm: 75,
    scores: { 1: 85, 2: 87, 3: 88, 4: 90, 5: 92, 6: 94 },
  },
  {
    key: "fis",
    name: "Fisika",
    category: "Peminatan",
    kkm: 75,
    scores: { 1: 82, 2: 84, 3: 86, 4: 87, 5: 89, 6: 91 },
  },
  {
    key: "kim",
    name: "Kimia",
    category: "Peminatan",
    kkm: 75,
    scores: { 1: 80, 2: 82, 3: 85, 4: 88, 5: 90, 6: 92 },
  },
  {
    key: "bio",
    name: "Biologi",
    category: "Peminatan",
    kkm: 75,
    scores: { 1: 84, 2: 86, 3: 87, 4: 89, 5: 91, 6: 93 },
  },
  {
    key: "ind",
    name: "Bahasa Indonesia",
    category: "Wajib",
    kkm: 75,
    scores: { 1: 88, 2: 89, 3: 90, 4: 91, 5: 92, 6: 93 },
  },
  {
    key: "ing",
    name: "Bahasa Inggris",
    category: "Wajib",
    kkm: 75,
    scores: { 1: 86, 2: 88, 3: 90, 4: 92, 5: 94, 6: 95 },
  },
  {
    key: "inf",
    name: "Informatika",
    category: "Peminatan",
    kkm: 75,
    scores: { 1: 88, 2: 90, 3: 91, 4: 92, 5: 94, 6: 95 },
  },
];

export function getMockBkStudentDetail(id: number): BkStudentDetail {
  const base = MOCK_BK_STUDENTS.find((s) => s.id === id) ?? MOCK_BK_STUDENTS[0];
  const savedMap = loadSavedNotes();
  const savedForStudent = savedMap[base.id] ?? [];
  const seededForStudent = SEEDED_NOTES[base.id] ?? [];
  const bkNotes = [...savedForStudent, ...seededForStudent];

  const hadir = base.prioritasPendampingan === "pendampingan" ? 76 : base.prioritasPendampingan === "dipantau" ? 84 : 88;
  const alpa = base.id === 3 || base.id === 5 ? 5 : base.prioritasPendampingan === "pendampingan" ? 3 : 0;
  const sakit = base.id === 5 ? 7 : 1;
  const izin = 90 - hadir - alpa - sakit;

  const nilaiTo = Math.round(base.avgNilai * 7.6);
  const deltaRapor = base.avgNilai - 88;

  return {
    ...base,
    tempatTanggalLahir: "Palembang, 14 Mei 2008",
    agama: "Islam",
    email: `${base.nama.toLowerCase().replace(/\s+/g, ".")}@sekolah.sch.id`,
    nilaiToTerakhir: nilaiTo,
    absensi: {
      total: 90,
      hadir,
      izin: Math.max(0, izin),
      sakit,
      alpa,
    },
    keluarga: {
      namaAyah: "Bambang Sudarmono",
      pekerjaanAyah: "Wiraswasta",
      namaIbu: "Sri Wahyuni",
      pekerjaanIbu: "Guru",
      noHpOrtu: base.noHpOrtu ?? "0812-3456-7890",
      alamat: base.alamat ?? "Jl. Mawar No. 12, Palembang",
    },
    belajar: {
      gayaBelajar: base.id % 2 === 0 ? "Visual & Praktik" : "Auditori & Diskusi",
      citaCita: base.jk === "L" ? "Teknik Informatika / Software Engineer" : "Kedokteran / Sains Biomedis",
      minatKarier: base.id % 2 === 0 ? "Teknologi & Rekayasa Perangkat Lunak" : "Kesehatan & Riset Sains",
    },
    minatList:
      base.id === 8
        ? ["Psikologi", "Konseling", "Desain Komunikasi Visual"]
        : ["Teknologi Informasi", "Pemrograman", "Matematika Terapan"],
    bakatList: ["Logika Analitis", "Pemecahan Masalah", "Komunikasi Tim"],
    aiAkademik: {
      ringkasan:
        base.prioritasPendampingan === "pendampingan"
          ? `Siswa menunjukkan kecenderungan penurunan rata-rata nilai (${base.avgNilai}) dan tingkat kehadiran yang perlu perhatian (${Math.round((hadir / 90) * 100)}%). Perlu sesi konseling terstruktur untuk memetakan kendala belajar dan kesesuaian target jurusan.`
          : `Siswa menunjukkan perkembangan akademik yang konsisten dengan rata-rata nilai ${base.avgNilai} dan tren ${base.tren}. Potensi kuat pada bidang analitik mendukung persiapan menuju target pendidikan tinggi.`,
      kekuatan: ["Konsistensi pengerjaan tugas terstruktur", "Daya analitik numerik & logika baik"],
      perluPerhatian:
        base.prioritasPendampingan === "pendampingan"
          ? ["Ketidakhadiran tanpa keterangan masih tinggi", "Manajemen waktu & motivasi belajar mandiri"]
          : ["Optimalisasi subtes Literasi Bahasa Inggris", "Stabilitas performa saat simulasi berdurasi ketat"],
      rekomendasi: ["Jadwalkan sesi review target jurusan & pola belajar bersama Guru BK."],
    },
    raporMapel: DEFAULT_MAPEL.map((m) => ({
      ...m,
      scores: Object.fromEntries(
        Object.entries(m.scores).map(([sem, score]) => [
          Number(sem),
          Math.min(100, Math.max(60, Math.round(score + deltaRapor))),
        ]),
      ),
    })),
    achievements:
      base.prestasiCount > 0
        ? [
            {
              id: "ach-1",
              title: "Juara 1 Olimpiade Sains Nasional (OSN) Tingkat Kota",
              category: "Akademik",
              level: "Kota/Kabupaten",
              year: 2025,
            },
            ...(base.prestasiCount > 1
              ? [
                  {
                    id: "ach-2",
                    title: "Medali Perak Lomba Karya Tulis Ilmiah Remaja",
                    category: "Akademik",
                    level: "Provinsi",
                    year: 2026,
                  } as const,
                ]
              : []),
          ]
        : [],
    bkNotes,
    tryout: {
      SNBT: {
        history: [
          { label: "TO1", skor: nilaiTo - 68 },
          { label: "TO2", skor: nilaiTo - 50 },
          { label: "TO3", skor: nilaiTo - 34 },
          { label: "TO4", skor: nilaiTo - 19 },
          { label: "TO5", skor: nilaiTo - 7 },
          { label: "TO6", skor: nilaiTo },
        ],
        avgScore: nilaiTo - 29,
        lastScore: nilaiTo,
        lastLabel: "TO 6",
        ranking: base.avgNilai >= 88 ? "12 / 145" : base.avgNilai >= 80 ? "34 / 145" : "78 / 145",
        trenLabel: base.tren === "turun" ? "Fluktuatif" : "Meningkat",
        subtests: [
          { name: "Penalaran Umum", score: 88, max: 100, status: "Sangat Baik" },
          { name: "Pengetahuan Kuantitatif", score: 82, max: 100, status: "Baik" },
          { name: "Literasi Bahasa Indonesia", score: 78, max: 100, status: "Baik" },
          { name: "Literasi Bahasa Inggris", score: 65, max: 100, status: "Perlu Peningkatan" },
        ],
        aiInsight: `Performa SNBT ${base.nama} berada pada skor terakhir ${nilaiTo}. Subtes terkuat adalah Penalaran Umum, sedangkan Literasi Bahasa Inggris masih memerlukan latihan pemahaman bacaan secara rutin.`,
      },
      TKA: {
        history: [
          { label: "TKA1", skor: 72 },
          { label: "TKA2", skor: 75 },
          { label: "TKA3", skor: 74 },
          { label: "TKA4", skor: 78 },
          { label: "TKA5", skor: 80 },
          { label: "TKA6", skor: 84 },
        ],
        avgScore: 77,
        lastScore: 84,
        lastLabel: "TKA 6",
        ranking: "16 / 145",
        trenLabel: "Meningkat",
        subtests: [
          { name: "Bahasa Indonesia", score: 88, max: 100, status: "Sangat Baik" },
          { name: "Bahasa Inggris", score: 80, max: 100, status: "Baik" },
          { name: "Matematika", score: 68, max: 100, status: "Perlu Peningkatan" },
          { name: "Mapel Pilihan", score: 82, max: 100, status: "Baik" },
        ],
        aiInsight: `Nilai TKA meningkat 12 poin dari TKA1 (72) ke TKA6 (84). Penguatan soal aljabar dan statistika Matematika sangat direkomendasikan sebelum sesi TKA berikutnya.`,
      },
      SKD: {
        history: [
          { label: "SKD1", skor: 286 },
          { label: "SKD2", skor: 298 },
          { label: "SKD3", skor: 305 },
          { label: "SKD4", skor: 312 },
          { label: "SKD5", skor: 320 },
          { label: "SKD6", skor: 328 },
        ],
        avgScore: 308,
        lastScore: 328,
        lastLabel: "SKD 6",
        ranking: "22 / 145",
        trenLabel: "Meningkat",
        subtests: [
          { name: "TWK (Tes Wawasan Kebangsaan)", score: 96, max: 150, status: "Baik" },
          { name: "TIU (Tes Intelegensia Umum)", score: 108, max: 175, status: "Perlu Peningkatan" },
          { name: "TKP (Tes Karakteristik Pribadi)", score: 124, max: 225, status: "Baik" },
        ],
        aiInsight: `Nilai SKD berkembang positif ke angka 328. Subtes TIU dapat ditingkatkan dengan latihan kecepatan hitung numerik dan silogisme.`,
      },
    },
    rekomendasiPendidikan: {
      ptn: {
        bidangNama: "Teknologi & Komputasi",
        bidangDesc:
          "Mempelajari pengembangan sistem digital, analisis data, kecerdasan buatan, dan rekayasa perangkat lunak untuk kebutuhan industri modern.",
        targetLabel: "Target Perguruan Tinggi",
        targetNama: "Universitas Indonesia",
        targetProdi: "Target Jurusan: Teknik Informatika",
        recommendations: [
          { label: "Teknik Informatika", sub: "UI / ITB", pct: 94 },
          { label: "Ilmu Komputer", sub: "UNDIP", pct: 87 },
          { label: "Sistem Informasi", sub: "ITS", pct: 79 },
        ],
      },
      kedinasan: {
        bidangNama: "Ekonomi, Keuangan & Tata Kelola Publik",
        bidangDesc:
          "Berfokus pada pengelolaan keuangan negara, sistem informasi pemerintahan, keamanan siber nasional, dan tata kelola administrasi publik.",
        targetLabel: "Target Sekolah Kedinasan",
        targetNama: "PKN STAN",
        targetProdi: "Program Studi Target: D4 Akuntansi Sektor Publik",
        recommendations: [
          { label: "PKN STAN", sub: "D4 Akuntansi Sektor Publik", pct: 91 },
          { label: "Poltek SSN", sub: "D4 Rekayasa Keamanan Siber", pct: 87 },
          { label: "IPDN", sub: "Administrasi Pemerintahan", pct: 82 },
        ],
      },
    },
  };
}
