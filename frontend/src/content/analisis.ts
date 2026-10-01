// Teks halaman Analisis Potensi, mengikuti docs/design/portal/Portal-Analisis*.dc.html.

import { BRAND } from "@/config/brand";

export const ANALISIS_HEADER = {
  breadcrumbHome: "Dashboard",
  title: "Analisis Potensi",
  description: `Tiga hal ini membentuk rekomendasi ${BRAND.compassName}: gambaran minat bakatmu, prestasi yang kamu raih, dan nilai rapor dari sekolah.`,
  descriptionShort: `Minat bakat, prestasi, dan nilai rapormu membentuk rekomendasi ${BRAND.compassName}.`,
};

export const TABS = {
  label: "Bagian Analisis Potensi",
  minat: "Gambaran Minat Bakat",
  prestasi: "Prestasi",
  rapor: "Nilai Rapor",
  chipDone: "Selesai",
  chipNoRapor: "Belum ada",
  chipRapor: (first: number, last: number) => (first === last ? `Sem ${first}` : `Sem ${first}–${last}`),
};

export const COMPLETENESS = {
  title: "Kelengkapan profil",
  ringLabel: (pct: number) => `Kelengkapan profil ${pct} persen`,
  testDone: "Gambaran Minat Bakat selesai",
  testPartial: (done: number, total: number) => `Gambaran Minat Bakat, ${done} dari ${total} bagian`,
  testEmpty: "Gambaran Minat Bakat belum diisi",
  raporDone: "Nilai rapor sudah diinput sekolah",
  raporWait: "Nilai rapor menunggu input dari sekolah",
  prestasiDone: (n: number) => `${n} prestasi tercatat`,
  prestasiEmpty: "Belum ada prestasi tercatat",
  certDone: "Semua prestasi sudah ada sertifikat",
  certMissing: (n: number) => `${n} prestasi belum ada sertifikat`,
  certEmpty: "Sertifikat prestasi belum ada",
  /** Ringkasan di HP: apa yang masih bisa dilengkapi siswa. */
  hint: (todo: string[], raporWaiting: boolean) => {
    if (todo.length > 0) return `Lengkapi ${todo.join(" dan ").replace(/ dan (?=.* dan )/g, ", ")} untuk analisis terbaik`;
    if (raporWaiting) return "Tinggal menunggu nilai rapor dari sekolah";
    return "Profilmu sudah lengkap";
  },
  hintParts: { test: "tes", prestasi: "prestasi", cert: "sertifikat" },
};

export const TEST = {
  sectionsTitle: "Bagian tes",
  sectionsDone: (done: number, total: number) => `${done} dari ${total} bagian selesai`,
  sectionsDoneShort: (done: number, total: number) => `${done} dari ${total} selesai`,
  sectionOf: (n: number, total: number) => `Bagian ${n} dari ${total}`,
  sectionShort: (n: number) => `Bagian ${n}`,
  status: { done: "Selesai", current: "Sedang diisi", todo: "Belum diisi", todoShort: "Belum" },
  showList: "Lihat semua bagian",
  hideList: "Sembunyikan daftar bagian",
  answered: (n: number, total: number) => `${n} dari ${total} terjawab`,
  likertDefault: ["Sangat tidak setuju", "Sangat setuju"] as [string, string],
  likertAria: (v: number, labels: [string, string]) => (v === 1 ? `1, ${labels[0]}` : v === 5 ? `5, ${labels[1]}` : `${v} dari 5`),
  multiLimit: (n: number, max: number, total: number) => (max >= total ? `${n} dipilih` : `${n} dari ${max} dipilih`),
  rankingHint: "Nomor 1 berarti paling penting buatmu.",
  moveUp: (label: string) => `Naikkan ${label}`,
  moveDown: (label: string) => `Turunkan ${label}`,
  saving: "Menyimpan...",
  savedAt: (time: string) => `Tersimpan otomatis pukul ${time}`,
  notSaved: "Jawabanmu tersimpan otomatis setiap kali diubah",
  saveError: "Gagal menyimpan. Jawabanmu masih ada di layar, coba lagi.",
  prev: "Bagian sebelumnya",
  next: (n: number) => `Lanjut ke Bagian ${n}`,
  save: "Simpan",
  saved: "Tersimpan",
  analyze: "Simpan & Analisis",
  hintThisSection: "Jawab semua soal di bagian ini supaya bisa mulai analisis.",
  hintOtherSections: (names: string) => `Masih ada bagian yang belum lengkap: ${names}.`,
};

export const ANALYZING = {
  title: "AI sedang memahami profilmu",
  body: `${BRAND.name} menggabungkan jawaban tes, prestasi, dan nilai rapormu. Tunggu sebentar, ya.`,
  steps: ["Membaca jawaban Gambaran Minat Bakat", "Menggabungkan prestasi dan nilai rapor", "Menyusun rekomendasi jurusan"],
  error: "Analisis gagal. Jawabanmu sudah tersimpan, coba lagi sebentar lagi.",
  retry: "Coba lagi",
  back: "Kembali ke tes",
};

export const TEST_DONE = {
  title: "Gambaran Minat Bakat selesai",
  body: (date: string, kelas: string) =>
    `Diisi pada ${date} saat ${kelas.charAt(0).toLowerCase()}${kelas.slice(1)}. Hasilnya sudah dipakai ${BRAND.compassName} untuk menyusun arah pendidikan dan rekomendasi jurusanmu.`,
  toCompass: `Lihat hasil di ${BRAND.compassName}`,
  myAnswers: "Lihat jawabanku",
  answersTitle: "Jawabanku",
  answersNote: "Jawaban tes terbaru. Jawaban tidak bisa diubah; isi ulang saat naik kelas.",
  historyTitle: "Riwayat per kelas",
  latest: "Terbaru",
  topField: (label: string) => `Paling selaras: ${label}`,
  historyNote: "Isi ulang setiap naik kelas supaya perkembanganmu tetap terpantau.",
};

export const PRESTASI = {
  kindLabel: "Jenis prestasi",
  kinds: { akademik: "Akademik", nonakademik: "Non-akademik" },
  add: "Tambah prestasi",
  info: `Prestasi dipakai untuk rekomendasi ${BRAND.compassName} dan bisa kamu pilih saat rasionalisasi SNBP.`,
  backendNote: "Mengubah prestasi dan mengunggah sertifikat belum tersedia saat ini. Untuk mengoreksi, hapus lalu tambahkan ulang.",
  noCertificate: "Sertifikat belum diunggah",
  edit: (title: string) => `Ubah ${title}`,
  remove: (title: string) => `Hapus ${title}`,
  empty: {
    akademik: { title: "Belum ada prestasi akademik", body: "Olimpiade, lomba karya tulis, atau kompetisi sains bisa dicatat di sini." },
    nonakademik: { title: "Belum ada prestasi non-akademik", body: "Organisasi, olahraga, seni, atau kegiatan sosial juga berharga untuk dicatat." },
  },
  dialog: {
    addTitle: "Tambah prestasi",
    editTitle: "Ubah prestasi",
    kind: "Jenis",
    title: "Nama prestasi",
    titlePlaceholder: "Contoh: Olimpiade Sains Nasional bidang Kimia",
    level: "Tingkat",
    levelPlaceholder: "Pilih tingkat",
    rank: "Capaian",
    rankPlaceholder: "Juara 1, Finalis, dsb.",
    organizer: "Penyelenggara",
    organizerPlaceholder: "Nama penyelenggara",
    year: "Tahun",
    certificate: "Sertifikat (opsional)",
    pickFile: "Pilih file atau seret ke sini",
    fileRule: "PDF, JPG, atau PNG, maksimal 2 MB",
    replaceFile: "Ganti file",
    removeFile: "Hapus file",
    cancel: "Batal",
    saveNew: "Simpan prestasi",
    saveEdit: "Simpan perubahan",
    saving: "Menyimpan...",
    close: "Tutup",
    errors: {
      title: "Tulis nama prestasimu.",
      level: "Pilih tingkat prestasi.",
      fileType: "File harus PDF, JPG, atau PNG.",
      fileSize: "Ukuran file maksimal 2 MB.",
      server: "Prestasi gagal disimpan. Coba lagi.",
    },
  },
  confirm: {
    title: "Hapus prestasi ini?",
    body: "akan dihapus dan tidak bisa dikembalikan.",
    cancel: "Batal",
    confirm: "Hapus",
    deleting: "Menghapus...",
    error: "Prestasi gagal dihapus. Coba lagi.",
  },
};

export const RAPOR = {
  info: "Nilai diinput sekolah dengan format Kurikulum Merdeka. Kalau ada yang tidak sesuai, hubungi wali kelasmu.",
  source: (date: string) => `Sumber: e-Rapor Kemendikdasmen, diperbarui ${date}`,
  empty: {
    title: "Nilai rapormu belum diinput sekolah",
    body: "Nilai akan muncul di sini setelah wali kelas mengunggah rapor lewat e-Rapor. Kalau rapor sudah dibagikan tapi belum muncul, tanyakan ke wali kelasmu.",
  },
  trendTitle: "Tren nilai per semester",
  subjectGroup: "Pilih mata pelajaran",
  average: "Rata-rata semua mapel",
  notAvailable: "Belum tersedia",
  ongoingShort: (s: number) => `S${s} belum tersedia`,
  semShort: (s: number) => `S${s}`,
  semLong: (s: number, ongoing: boolean) => (ongoing ? `Sem ${s} (berjalan)` : `Sem ${s}`),
  chartLabel: (subject: string) => `Grafik nilai ${subject} dan rata-rata semua mapel per semester`,
  tableTitle: "Rapor per semester",
  columns: { semester: "Semester", kelas: "Kelas", year: "Tahun ajaran", count: "Mapel", avg: "Rata-rata nilai akhir" },
  semester: (s: number) => `Semester ${s}`,
  kelasYear: (kelas: string, year: string) => `${kelas}, ${year}`,
  countAvg: (n: number) => `${n} mapel, rata-rata nilai akhir`,
  notInput: "Belum diinput",
  detail: "Lihat detail",
  close: "Tutup",
  footnote: "Nilai semester 1 sampai 5 dipakai untuk SNBP. Nilai semester 5 muncul setelah rapor dibagikan.",
};

export const LOAD_ERROR = "Bagian ini gagal dimuat.";
export const RETRY = "Coba lagi";
