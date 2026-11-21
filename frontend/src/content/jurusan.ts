import { BRAND } from "@/config/brand";
import { ACCOUNT_ACCESS } from "./common";
import type { CampusGroup, FitLabel, JalurKey } from "@/types/jurusan";

// Teks halaman /jurusan dan /jurusan/:slug. Komponen hanya menampilkan isi file ini.

export const JURUSAN_LIST = {
  // Hero mengikuti docs/design/publik/EksplorJurusan-Desktop.jpg.
  title: "Eksplor Jurusan",
  subtitle: "Temukan jurusan yang sesuai dengan minat, potensi, dan tujuan kariermu.",
  jenisLabel: "Jenis kampus",
  jenis: { umum: "PTN & PTS", kedinasan: "Kedinasan" },
  compassText: "Cari tahu jurusan yang cocok berdasarkan profil diri saya",
  compassCta: `Coba ${BRAND.compassName}`,
  listTitle: "Semua Jurusan",
  listBody: "Jelajahi berbagai jurusan berdasarkan bidang ilmu untuk menemukan jurusan yang paling menarik bagimu.",
  searchLabel: "Cari jurusan",
  searchPlaceholder: "Cari jurusan...",
  clearSearch: "Hapus pencarian",
  filterLabel: "Filter bidang",
  allBidang: "Semua",
  resultCount: (n: number) => `${n} jurusan`,
  loading: "Memuat daftar jurusan...",
  emptyTitle: "Jurusan tidak ditemukan",
  emptyBody: "Coba kata kunci lain atau pilih bidang yang berbeda.",
  resetFilter: "Tampilkan semua jurusan",
  fitHint: `Label kecocokan berasal dari hasil ${BRAND.compassName}-mu.`,
};

export const JURUSAN_DETAIL = {
  breadcrumbHome: "Beranda",
  breadcrumbList: "Jurusan",
  back: "Kembali ke daftar jurusan",
  photoPlaceholder: (name: string) => `[Foto jurusan ${name}]`,
  about: "Tentang Jurusan",
  topics: "Apa yang dipelajari",
  careers: "Prospek karier",
  campuses: "Kampus yang membuka jurusan ini",
  sampleData: "Contoh data",
  subjects: "Mapel pendukung di SMA",
  jalur: "Jalur masuk",
  similar: "Jurusan lain yang mirip",
  empty: {
    topics: "Daftar mata kuliah untuk jurusan ini belum tersedia.",
    careers: "Informasi prospek karier untuk jurusan ini belum tersedia.",
    subjects: "Informasi mapel pendukung belum tersedia.",
  },
  campus: {
    filterType: "Jenis kampus",
    filterCity: "Kota",
    allTypes: "Semua",
    allCities: "Semua kota",
    loading: "Mencari kampus...",
    error: "Daftar kampus belum bisa dimuat. Coba muat ulang halaman.",
    none: "Belum ada data kampus yang membuka jurusan ini.",
    noneFiltered: "Tidak ada kampus yang cocok dengan filter ini.",
    noPtln: "Data kampus luar negeri (PTLN) belum tersedia.",
    logo: "Logo",
    showAll: (n: number) => `Lihat semua kampus (${n})`,
    showLess: "Tampilkan lebih sedikit",
  },
  cta: {
    accent: "Cocok nggak sih buatku?",
    guestBody: (name: string) =>
      `Dengan akun ${BRAND.name}, kamu bisa mengisi Gambaran Minat Bakat lalu melihat apakah ${name} termasuk pilihan yang selaras dengan profilmu. ${ACCOUNT_ACCESS.note}`,
    /** Tamu: membuka WhatsApp (tidak ada pendaftaran mandiri). */
    guestButton: ACCOUNT_ACCESS.subscribe,
    guestLoginText: "Sudah punya akun?",
    guestLogin: "Masuk",
    baruBody: (name: string) =>
      `Isi Gambaran Minat Bakat dulu, lalu lihat apakah ${name} termasuk pilihan yang selaras dengan profilmu.`,
    baruButton: "Isi Gambaran Minat Bakat",
    fitBody: (name: string, label: FitLabel) =>
      `Menurut ${BRAND.compassName}, ${name} ${label.toLowerCase()} dengan profilmu.`,
    noFitBody: (name: string) =>
      `${name} belum termasuk rekomendasi ${BRAND.compassName}-mu. Lihat pilihan yang paling selaras dengan profilmu.`,
    compassButton: `Buka ${BRAND.compassName}`,
  },
  notFoundTitle: "Jurusan tidak ditemukan",
  notFoundBody: "Jurusan yang kamu cari tidak ada atau alamatnya sudah berubah.",
};

/** Penjelasan singkat tiap jalur masuk (kolom samping halaman detail). */
export const JALUR_INFO: Record<JalurKey, string> = {
  SNBP: "Berdasarkan nilai rapor dan prestasi, untuk siswa eligible.",
  SNBT: "Berdasarkan hasil tes UTBK.",
  Mandiri: "Seleksi yang diadakan masing-masing kampus.",
  Kedinasan: "Seleksi sekolah kedinasan, diawali SKD lalu tes lanjutan.",
};

export const CAMPUS_GROUPS: CampusGroup[] = ["PTN", "PTS", "Kedinasan", "PTLN"];
