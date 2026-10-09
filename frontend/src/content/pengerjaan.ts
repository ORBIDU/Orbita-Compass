// Teks halaman pengerjaan soal, hasil latihan, dan laporan tryout,
// mengikuti docs/design/portal/Portal-Pengerjaan.dc.html dan Portal-Laporan.dc.html.
// Angka dan nama subtes TIDAK ditulis di sini; semuanya dihitung dari data.

import { BRAND } from "@/config/brand";

/** Pesan dari "server" simulasi (mocks/practiceServer.ts). */
export const PRACTICE_SERVER_MSG = {
  notFound: "Latihan atau tryout ini tidak ditemukan.",
  notYet: (weekday: string) => `Latihan ini baru terbuka hari ${weekday}.`,
  noBank: "Soal contoh untuk mapel ini belum tersedia.",
  finished: "Latihan ini sudah selesai.",
  notFinished: "Hasil baru bisa dilihat setelah selesai dikerjakan.",
  invalid: "Pilihan jawaban tidak valid.",
  tryoutDone: "Tryout ini sudah selesai. Kamu diarahkan ke laporannya.",
  tryoutLocked: (prev: string) => `Tryout ini terbuka setelah ${prev} selesai.`,
  sectionClosed: "Subtes ini sudah ditutup.",
  timeUp: "Waktu subtes ini sudah habis.",
  noReport: "Laporan tryout ini tidak tersedia.",
};

export const SAMPLE_LABEL = "Contoh soal. Semua paket tryout contoh memakai soal yang sama; bank soal resmi menunggu tim data.";

export const SESSION = {
  exit: "Keluar",
  questionOf: (n: number, total: number) => `Soal ${n} dari ${total}`,
  letters: ["A", "B", "C", "D", "E"],
  prev: "Sebelumnya",
  next: "Berikutnya",
  nav: "Nomor soal",
  navOpen: "Nomor soal",
  navClose: "Tutup",
  loading: "Menyiapkan soal...",
  backTo: "Kembali",
};

export const LATIHAN_RUN = {
  fromPlan: (date: string) => `Dari Action Plan, ${date}`,
  free: "Latihan bebas",
  timerLabel: "Waktu latihan",
  timerAria: (m: number, s: number) => `Waktu latihan ${m} menit ${s} detik`,
  finish: "Selesai latihan",
  check: "Cek jawaban",
  checking: "Memeriksa...",
  correct: "Jawabanmu benar",
  wrong: (letter: string) => `Jawabanmu belum tepat. Jawaban yang benar: ${letter}`,
  tkpPoints: (p: number) => `Pilihanmu bernilai ${p} dari 5 poin.`,
  explanation: "Pembahasan",
  markCorrect: "Jawaban benar",
  markYours: "Jawabanmu",
  summary: (answered: number, correct: number) => `${answered} dijawab, ${correct} benar`,
  legend: { correct: "Benar", wrong: "Salah", empty: "Belum dijawab", current: "Soal yang sedang dibuka" },
  navAria: (n: number, state: string) => `Soal ${n}, ${state}`,
  state: { correct: "benar", wrong: "salah", empty: "belum dijawab" },
  exitTitle: "Keluar dari latihan?",
  exitBody: "Jawabanmu sejauh ini tersimpan. Kamu bisa melanjutkan latihan ini nanti.",
  exitOk: "Ya, keluar",
  exitCancel: "Lanjut mengerjakan",
  finishTitle: "Selesaikan latihan?",
  finishBody: (unanswered: number) =>
    unanswered > 0
      ? `Masih ada ${unanswered} soal belum dijawab dan tidak ikut dihitung benar. Kamu bisa melihat pembahasan semua soal di halaman hasil.`
      : "Kamu bisa melihat pembahasan semua soal di halaman hasil.",
  finishOk: "Selesai dan lihat hasil",
  finishCancel: "Kembali mengerjakan",
  finishLast: "Selesai dan lihat hasil",
  error: "Jawaban gagal diperiksa. Coba lagi.",
};

export const TRYOUT_RUN = {
  sub: (i: number, n: number, name: string) => `Subtes ${i} dari ${n}: ${name}`,
  timerLabel: "Sisa waktu",
  timerAria: (m: number, s: number) => `Sisa waktu subtes ${m} menit ${s} detik`,
  /** Diumumkan ke pembaca layar (aria-live) saat melewati batas di config/practice.ts. */
  timeLeftAnnounce: (minutes: number) => `Sisa waktu subtes ${minutes} menit.`,
  finishSection: "Selesaikan subtes",
  flag: "Ragu-ragu",
  flagged: "Ditandai ragu-ragu",
  clear: "Hapus jawaban",
  summary: (answered: number, flagged: number, empty: number) => `${answered} dijawab, ${flagged} ragu-ragu, ${empty} belum`,
  legend: { answered: "Sudah dijawab", empty: "Belum dijawab", flagged: "Ditandai ragu-ragu", current: "Soal yang sedang dibuka" },
  navAria: (n: number, answered: boolean, flagged: boolean) => `Soal ${n}, ${answered ? "dijawab" : "belum dijawab"}${flagged ? ", ragu-ragu" : ""}`,
  exitTitle: "Keluar dari tryout?",
  exitBody: "Waktu tryout tetap berjalan walaupun kamu keluar. Jawaban yang sudah diisi tersimpan.",
  exitOk: "Ya, keluar",
  exitCancel: "Lanjut mengerjakan",
  finishTitle: (name: string) => `Selesaikan subtes ${name}?`,
  finishBody: (empty: number, flagged: number, last: boolean) =>
    `Masih ada ${empty} soal belum dijawab dan ${flagged} soal ditandai ragu-ragu. ${
      last ? "Ini subtes terakhir; setelah selesai, tryout langsung dinilai." : "Setelah selesai, kamu tidak bisa kembali ke subtes ini."
    }`,
  finishOk: "Ya, selesaikan",
  finishCancel: "Kembali mengerjakan",
  expired: (names: string) => `Waktu subtes ${names} habis saat halaman ditutup, jadi subtes itu sudah dikumpulkan dengan jawaban yang tersimpan.`,
  timeUp: (name: string) => `Waktu subtes ${name} habis. Jawabanmu sudah dikumpulkan.`,
  nextSection: "Lanjut ke subtes berikutnya",
  saveError: "Jawaban gagal disimpan. Periksa koneksimu.",
  grading: "Menilai tryout...",
};

export const HASIL = {
  breadcrumbSection: "Persiapan",
  latihanTitle: (title: string) => `Hasil ${title}`,
  latihanDone: (date: string) => `Selesai ${date}`,
  backPlan: "Kembali ke Action Plan",
  backSiap: (name: string) => `Kembali ke ${name}`,
  correct: "Jawaban benar",
  correctOf: (c: number, t: number) => `${c} dari ${t}`,
  unanswered: "Tidak dijawab",
  unansweredValue: (n: number) => `${n} soal`,
  accuracy: "Akurasi",
  again: "Latihan lagi",
};

export const LAPORAN = {
  title: (name: string, exam: string) => `Laporan ${name} ${exam}`,
  breadcrumb: (name: string) => `Laporan ${name}`,
  doneAt: (date: string) => `Dikerjakan ${date}`,
  scoreLabel: { snbt: "Skor rata-rata", tka: "Nilai rata-rata", skd: "Skor total" } as Record<string, string>,
  deltaFrom: (diff: number, name: string, score: number) =>
    diff === 0 ? `Sama dengan ${name} (${score})` : `${diff > 0 ? "Naik" : "Turun"} dari ${name} (${score})`,
  first: "Tryout pertama untuk ujian ini",
  correct: "Jawaban benar",
  unanswered: "Tidak dijawab",
  timeUsed: "Waktu dipakai",
  duration: (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h > 0 ? `${h} jam ${m} menit` : `${Math.max(1, m)} menit`;
  },
  perSubject: "Hasil per subtes",
  cols: { subject: "Subtes", correct: "Benar", score: "Skor" },
  lowest: "Terendah",
  focusTitle: "Fokus berikutnya",
  focusWeak: (names: string) => `${names} masih paling rendah di tryout ini, jadi bisa jadi prioritas latihanmu berikutnya.`,
  focusStrong: (names: string) => `${names} sudah kuat. Pertahankan dengan latihan rutin.`,
  focusCta: "Lihat Action Plan",
  reviewTitle: "Pembahasan soal",
  subjectFilter: "Subtes",
  allSubjects: "Semua subtes",
  filters: { salah: "Salah", ragu: "Ragu-ragu", kosong: "Tidak dijawab", semua: "Semua" },
  filterLabel: "Saring soal",
  emptyFilter: "Tidak ada soal di saringan ini.",
  questionNo: (n: number) => `Soal ${n}`,
  status: { benar: "Benar", salah: "Salah", kosong: "Tidak dijawab" },
  yours: "Jawabanmu:",
  key: "Jawaban benar:",
  none: "Tidak dijawab",
  showExplanation: "Lihat pembahasan",
  hideExplanation: "Sembunyikan pembahasan",
  tkpPoints: (p: number) => `${p} dari 5 poin`,
  backTryout: (name: string) => `Kembali ke ${name}`,
};

/** Gabungkan nama: "A", "A dan B", "A, B, dan C". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} dan ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, dan ${names[names.length - 1]}`;
}

export const PENGERJAAN_ERROR = {
  title: "Latihan tidak bisa dibuka",
  back: "Kembali",
  brand: BRAND.name,
};
