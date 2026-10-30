import type {
  WaliDashboardData,
  StudentSummary,
  StudentDetail,
  RaporMapelItem,
} from "@/types/wali";

export const MOCK_WALI_PROFILE = {
  id: "wali-1",
  name: "Dewi Sartika, S.Pd.",
  nip: "19850412 201001 2 015",
  kelas: "XI IPA 2",
  semester: "Semester Ganjil",
  tahunAjaran: "2026 / 2027",
  initials: "DS",
};

export const MOCK_WALI_DASHBOARD: WaliDashboardData = {
  wali: MOCK_WALI_PROFILE,
  kpi: {
    rataRataNilai: 87.6,
    deltaNilai: 2.3,
    nilaiTertinggi: 96.4,
    namaTertinggi: "Farah Nadia",
    nilaiTerendah: 72.3,
    noteTerendah: "Perlu perhatian: 2 siswa",
    ketuntasanPct: 83,
    tuntasCount: 30,
    totalCount: 36,
  },
  distribusi: [
    { label: "Tinggi", subLabel: "90–100", count: 12, color: "#0965FA" },
    { label: "Sedang", subLabel: "75–89", count: 18, color: "#F1AD00" },
    { label: "Rendah", subLabel: "<75", count: 6, color: "#EF4444" },
  ],
  trenSemester: [
    { sem: "Sem 1", avg: 82.4 },
    { sem: "Sem 2", avg: 83.8 },
    { sem: "Sem 3", avg: 85.1 },
    { sem: "Sem 4", avg: 86.2 },
    { sem: "Sem 5", avg: 87.6 },
  ],
  kelengkapan: {
    lengkapPct: 86,
    lengkapCount: 31,
    belumCount: 5,
    totalCount: 36,
  },
  aiInsight: {
    title: "Orbita AI Insight Kelas",
    body: "Sebagian besar siswa menunjukkan perkembangan akademik yang stabil. Sebanyak 18 siswa mengalami peningkatan lebih dari 5 poin, sedangkan 4 siswa mengalami penurunan selama dua semester berturut-turut sehingga disarankan mendapatkan pendampingan lebih lanjut dari Guru BK.",
    highlightCountUp: 18,
    highlightCountDown: 4,
  },
  notifikasiBk: [
    {
      id: 1,
      studentId: 3,
      nama: "Candra Wijaya",
      pesan: "Catatan konseling baru ditambahkan",
      prioritas: "Tinggi",
      waktu: "2 jam lalu",
    },
    {
      id: 2,
      studentId: 2,
      nama: "Bela Saputri",
      pesan: "Rekomendasi pendampingan diperbarui",
      prioritas: "Sedang",
      waktu: "Kemarin",
    },
    {
      id: 3,
      studentId: 1,
      nama: "Andi Maulana",
      pesan: "Status pendampingan berubah menjadi Normal",
      prioritas: "Rendah",
      waktu: "3 hari lalu",
    },
  ],
};

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
];

export const MOCK_STUDENTS: StudentSummary[] = [
  {
    id: 1,
    nama: "Andi Maulana",
    nisn: "0061234561",
    jk: "L",
    kelas: "XI IPA 2",
    avgNilai: 91.2,
    tren: "naik",
    statusProfil: "lengkap",
    prestasiCount: 3,
    alamat: "Jl. Mawar No. 12, Jakarta",
    noHpOrtu: "0812-3456-7890",
  },
  {
    id: 2,
    nama: "Bela Saputri",
    nisn: "0061234562",
    jk: "P",
    kelas: "XI IPA 2",
    avgNilai: 88.4,
    tren: "naik",
    statusProfil: "lengkap",
    prestasiCount: 1,
    alamat: "Jl. Melati No. 5, Jakarta",
    noHpOrtu: "0823-4567-8901",
  },
  {
    id: 3,
    nama: "Candra Wijaya",
    nisn: "0061234563",
    jk: "L",
    kelas: "XI IPA 2",
    avgNilai: 74.1,
    tren: "turun",
    statusProfil: "sebagian",
    prestasiCount: 0,
    alamat: "Jl. Anggrek No. 8, Jakarta",
    noHpOrtu: "0834-5678-9012",
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    nisn: "0061234564",
    jk: "P",
    kelas: "XI IPA 2",
    avgNilai: 85.7,
    tren: "stabil",
    statusProfil: "lengkap",
    prestasiCount: 2,
    alamat: "Jl. Dahlia No. 3, Jakarta",
    noHpOrtu: "0845-6789-0123",
  },
  {
    id: 5,
    nama: "Eka Pratama",
    nisn: "0061234565",
    jk: "L",
    kelas: "XI IPA 2",
    avgNilai: 72.3,
    tren: "turun",
    statusProfil: "belum",
    prestasiCount: 0,
    alamat: "Jl. Bougenville No. 17, Jakarta",
    noHpOrtu: "0856-7890-1234",
  },
  {
    id: 6,
    nama: "Farah Nadia",
    nisn: "0061234566",
    jk: "P",
    kelas: "XI IPA 2",
    avgNilai: 96.4,
    tren: "naik",
    statusProfil: "lengkap",
    prestasiCount: 4,
    alamat: "Jl. Cempaka Putih No. 24, Jakarta",
    noHpOrtu: "0867-8901-2345",
  },
  {
    id: 7,
    nama: "Gilang Ramadhan",
    nisn: "0061234567",
    jk: "L",
    kelas: "XI IPA 2",
    avgNilai: 82.0,
    tren: "stabil",
    statusProfil: "sebagian",
    prestasiCount: 1,
    alamat: "Jl. Kenanga No. 14, Jakarta",
    noHpOrtu: "0878-9012-3456",
  },
  {
    id: 8,
    nama: "Hani Pratiwi",
    nisn: "0061234568",
    jk: "P",
    kelas: "XI IPA 2",
    avgNilai: 89.5,
    tren: "naik",
    statusProfil: "lengkap",
    prestasiCount: 2,
    alamat: "Jl. Flamboyan No. 9, Jakarta",
    noHpOrtu: "0889-0123-4567",
  },
  {
    id: 9,
    nama: "Ilham Hidayat",
    nisn: "0061234569",
    jk: "L",
    kelas: "XI IPA 2",
    avgNilai: 78.6,
    tren: "stabil",
    statusProfil: "lengkap",
    prestasiCount: 0,
    alamat: "Jl. Kemuning No. 11, Jakarta",
    noHpOrtu: "0890-1234-5678",
  },
  {
    id: 10,
    nama: "Jessica Aurelia",
    nisn: "0061234570",
    jk: "P",
    kelas: "XI IPA 2",
    avgNilai: 93.1,
    tren: "naik",
    statusProfil: "lengkap",
    prestasiCount: 3,
    alamat: "Jl. Teratai No. 2, Jakarta",
    noHpOrtu: "0811-2345-6789",
  },
  {
    id: 11,
    nama: "Kevin Sanjaya",
    nisn: "0061234571",
    jk: "L",
    kelas: "XI IPA 2",
    avgNilai: 84.8,
    tren: "stabil",
    statusProfil: "sebagian",
    prestasiCount: 1,
    alamat: "Jl. Kamboja No. 7, Jakarta",
    noHpOrtu: "0822-3456-7890",
  },
  {
    id: 12,
    nama: "Larasati Putri",
    nisn: "0061234572",
    jk: "P",
    kelas: "XI IPA 2",
    avgNilai: 87.2,
    tren: "naik",
    statusProfil: "lengkap",
    prestasiCount: 1,
    alamat: "Jl. Melur No. 20, Jakarta",
    noHpOrtu: "0833-4567-8901",
  },
];

export function getMockStudentDetail(id: number): StudentDetail {
  const base = MOCK_STUDENTS.find((s) => s.id === id) || MOCK_STUDENTS[0];

  return {
    ...base,
    tempatTanggalLahir: "Jakarta, 14 Mei 2008",
    agama: "Islam",
    email: `${base.nama.toLowerCase().replace(/\s+/g, ".")}@sekolah.sch.id`,
    absensi: {
      total: 90,
      hadir: base.id === 5 ? 72 : base.id === 3 ? 80 : 88,
      izin: base.id === 3 ? 5 : 1,
      sakit: base.id === 5 ? 12 : 1,
      alpa: base.id === 5 ? 6 : 0,
    },
    keluarga: {
      namaAyah: "Bambang Sudarmono",
      pekerjaanAyah: "Wiraswasta",
      namaIbu: "Sri Wahyuni",
      pekerjaanIbu: "Guru",
      noHpOrtu: base.noHpOrtu || "0812-3456-7890",
      alamat: base.alamat || "Jl. Mawar No. 12, Jakarta",
    },
    belajar: {
      gayaBelajar: base.id % 2 === 0 ? "Visual & Praktik" : "Auditori & Diskusi",
      citaCita: base.jk === "L" ? "Teknik Informatika / Software Engineer" : "Kedokteran / Dokter Spesialis",
      minatKarier: "Sains & Teknologi Komputer",
    },
    raporMapel: DEFAULT_MAPEL.map((m) => ({
      ...m,
      scores: Object.fromEntries(
        Object.entries(m.scores).map(([sem, score]) => {
          const delta = base.avgNilai - 88;
          return [sem, Math.min(100, Math.max(60, Math.round(score + delta)))];
        })
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
                    title: "Medali Perak Lomba Karya Tulis Ilmiah Remaja (LKIR)",
                    category: "Akademik",
                    level: "Provinsi",
                    year: 2026,
                  } as const,
                ]
              : []),
          ]
        : [],
    bkNotes:
      base.id === 3
        ? [
            {
              id: "bk-1",
              tanggal: "28 Oktober 2026",
              topik: "Penurunan Konsistensi Belajar Matematika",
              konselor: "Hendra Raharjo, S.Pd. (Guru BK)",
              catatan:
                "Siswa merasa kesulitan membagi waktu antara kegiatan ekstrakurikuler dan tugas praktikum.",
              rekomendasi:
                "Mengurangi intensitas ekskul sementara menjelang penilaian tengah semester dan bimbingan belajar tambahan.",
              tindakLanjut:
                "Sesi follow up dijadwalkan kembali 2 minggu kemudian bersama wali kelas.",
              prioritas: "Tinggi",
            },
          ]
        : base.id === 1
        ? [
            {
              id: "bk-2",
              tanggal: "15 September 2026",
              topik: "Eksplorasi Minat Jurusan Teknik vs Kedokteran",
              konselor: "Hendra Raharjo, S.Pd. (Guru BK)",
              catatan: "Siswa sudah mantap memilih jurusan Teknik Informatika.",
              rekomendasi: "Mulai memperdalam portofolio olimpiade komputer.",
              tindakLanjut: "Rasionalisasi SNBP di semester 5.",
              prioritas: "Rendah",
            },
          ]
        : [],
  };
}
