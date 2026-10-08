// Teks halaman Dashboard (/portal), mengikuti docs/design/portal.
// Nama brand diambil dari config/brand.ts.

import { BRAND } from "@/config/brand";
import type { ExamKey } from "@/types/dashboard";
import type { PlanCategory } from "@/types/actionPlan";

export const HERO = {
  baru: {
    body: `Yuk mulai dari mengenal dirimu. Isi Gambaran Minat Bakat supaya ${BRAND.name} bisa menyusun rekomendasi jurusan dan rencana belajarmu.`,
    cta: "Isi Gambaran Minat Bakat",
    note: "7 bagian, bisa dicicil",
  },
  noFocus: {
    body: "Rekomendasimu sudah siap. Langkah berikutnya: atur rencana belajar, lalu AI menyusun latihan soal harianmu.",
    cta: "Atur rencana belajar",
  },
  progress: (done: number, total: number) =>
    done >= total
      ? `Semua ${total} latihan hari ini sudah selesai. Keren!`
      : `${done} dari ${total} latihan hari ini sudah selesai. ${done > 0 ? "Tinggal sedikit lagi." : "Yuk mulai dari yang paling ringan."}`,
  noTaskToday: (next: string | null) =>
    next ? `Hari ini bukan hari belajar. Latihan berikutnya ${next}.` : "Rencana belajarmu sudah selesai. Atur ulang rencana untuk lanjut latihan.",
  focusChip: (focus: PlanCategory[]) => `Fokus: ${focus.join(" dan ").replace(/ dan (?=.* dan )/g, ", ")}`,
};

export const LOCKED = {
  title: "Terbuka setelah tes minat bakat",
  plan: "Rencana belajar disusun dari hasil tes dan fokus yang kamu pilih.",
  performa: "Setelah itu kamu bisa mulai latihan, dan performamu akan tampil di sini.",
  compass: `${BRAND.compassName} membaca hasil tesmu, prestasi, dan nilai rapor untuk menunjukkan arah yang paling selaras.`,
};

export const PLAN = {
  title: "Rencana hari ini",
  link: "Buka Action Plan",
  linkShort: "Lihat semua",
  summary: (done: number, total: number) => `${done} dari ${total} latihan selesai`,
  remaining: (minutes: number) => `Sekitar ${minutes} menit lagi untuk hari ini`,
  allDone: "Semua latihan hari ini selesai",
  more: (n: number) => `+${n} latihan lainnya`,
  doneLabel: "Selesai",
  inProgressLabel: "Sedang dikerjakan",
  todoLabel: "Belum dikerjakan",
  meta: (questions: number, minutes: number) => `${questions} soal, ${minutes} menit`,
  progress: (answered: number, total: number) => `${answered} dari ${total} soal`,
  emptyNoFocus: {
    title: "Belum ada rencana belajar",
    body: `Pilih fokusmu (SNBT, TKA, atau Kedinasan) dan hari belajar, AI ${BRAND.name} akan menyusun latihan soalnya.`,
    cta: "Atur rencana belajar",
  },
  restDay: {
    title: "Hari ini bukan hari belajar",
    next: (date: string, count: number) => `Latihan berikutnya: ${date}, ${count} latihan`,
    cta: "Buka Action Plan",
  },
  ended: {
    title: "Rencana belajarmu sudah selesai",
    body: "Atur ulang rencana di Action Plan untuk menyusun latihan berikutnya.",
    cta: "Buka Action Plan",
  },
};

export const PERFORMA = {
  title: "Performa latihan",
  link: "Lihat performa",
  linkShort: "Detail",
  radarLabel: "Radar skor 7 subtes SNBT dari tryout terakhir",
  lastScore: "Skor tryout SNBT terakhir",
  delta: (diff: number, short: boolean) => {
    const suffix = short ? "dari sebelumnya" : "dari tryout sebelumnya";
    if (diff === 0) return `Sama ${suffix.replace("dari", "dengan")}`;
    return `${diff > 0 ? "+" : "−"}${Math.abs(diff)} ${suffix}`;
  },
  weakest: "Paling perlu dilatih:",
  rows: { SNBT: "Siap SNBT", TKA: "Siap TKA", SKD: "Siap SKD" } as Record<ExamKey, string>,
  noPractice: "Belum ada latihan",
  start: "Mulai",
  tkaAccuracy: (percent: number) => `Akurasi latihan ${percent}%`,
  tkaAccuracyMeta: (answered: number) => `Belum ada tryout, dari ${answered} soal latihan`,
  empty: {
    title: "Belum ada hasil latihan",
    body: "Coba satu latihan atau tryout di Persiapan. Hasilnya akan muncul di sini, lengkap dengan subtes yang perlu dilatih.",
    cta: "Mulai latihan pertama",
  },
};

export const COMPASS = {
  title: BRAND.compassName,
  updated: (date: string) => `Diperbarui ${date}`,
  topField: "Bidang yang paling selaras",
  fieldFit: { "Sangat sesuai": "Sangat selaras", Sesuai: "Selaras" } as const,
  explore: "Jurusan untuk dieksplorasi",
  open: `Buka ${BRAND.compassName}`,
  empty: {
    title: "Rekomendasimu belum tersedia",
    body: `Buka ${BRAND.compassName} supaya hasil tesmu diolah jadi rekomendasi jurusan.`,
  },
};

export const TIMELINE = {
  title: "Timeline seleksi",
  subtitle: "Jadwal perkiraan. Jadwal resmi mengikuti SNPMB dan instansi terkait.",
  empty: "Belum ada agenda seleksi dalam waktu dekat.",
};

export const EXPLORE = {
  title: "Masih penasaran dengan jurusan lain?",
  body: "Lihat isi kuliah, mapel pendukung, dan kampus yang membukanya.",
  cta: "Explore Jurusan",
};

