// Teks halaman Dashboard (/portal), mengikuti docs/design/portal.
// Nama brand diambil dari config/brand.ts.

import { BRAND } from "@/config/brand";
import type { ExamKey } from "@/types/dashboard";

export const HERO = {
  baru: {
    body: `Yuk mulai dari mengenal dirimu. Isi Gambaran Minat Bakat supaya ${BRAND.name} bisa menyusun rekomendasi jurusan dan rencana belajarmu.`,
    cta: "Isi Gambaran Minat Bakat",
    note: "7 bagian, bisa dicicil",
  },
  noFocus: {
    body: "Rekomendasimu sudah siap. Langkah berikutnya: atur fokus belajar lalu coba latihan pertamamu.",
    cta: "Atur fokus belajar",
  },
  progress: (done: number, total: number) =>
    done >= total
      ? `Semua ${total} tugas hari ini sudah selesai. Keren!`
      : `${done} dari ${total} tugas hari ini sudah selesai. ${done > 0 ? "Tinggal sedikit lagi." : "Yuk mulai dari yang paling ringan."}`,
  noTaskToday: "Tidak ada tugas untuk hari ini. Mau cicil latihan tambahan di Persiapan?",
  focusChip: (focus: ExamKey[]) => `Fokus: ${focus.join(" dan ").replace(/ dan (?=.* dan )/g, ", ")}`,
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
  summary: (done: number, total: number) => `${done} dari ${total} tugas selesai`,
  remaining: (minutes: number) => `Sekitar ${minutes} menit lagi untuk hari ini`,
  allDone: "Semua tugas hari ini selesai",
  more: (n: number) => `+${n} tugas lainnya`,
  doneLabel: "Selesai",
  todoLabel: "Belum selesai",
  minutes: (m: number) => `${m} menit`,
  emptyNoFocus: {
    title: "Belum ada rencana belajar",
    body: `Pilih fokusmu (SNBT, TKA, atau SKD) dan hari belajar, ${BRAND.name} akan menyusun latihannya.`,
    cta: "Atur fokus belajar",
  },
  emptyToday: {
    title: "Tidak ada tugas hari ini",
    body: "Rencanamu kosong untuk hari ini. Kamu bisa cicil latihan tambahan di Persiapan.",
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
  tkaValue: (correct: number, total: number) => `${correct}/${total} benar`,
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

export const LOAD_ERROR = "Bagian ini gagal dimuat.";
export const RETRY = "Coba lagi";
