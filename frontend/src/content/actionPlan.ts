// Teks halaman Action Plan, mengikuti docs/design/portal/Portal-ActionPlan.dc.html.

import { BRAND } from "@/config/brand";
import type { PlanCategory } from "@/types/actionPlan";

export const AP_HEADER = {
  breadcrumbHome: "Dashboard",
  title: "Action Plan",
  description: "Latihan soal harian yang disusun AI sesuai fokus, hari belajar, dan subtes yang paling perlu kamu latih.",
  compass: `Cek ${BRAND.compassName}`,
  replan: "Atur ulang rencana",
};

export const AP_LOCKED = {
  title: "Action Plan terbuka setelah Gambaran Minat Bakat",
  body: "Latihan harian disusun dari hasil tes dan fokus seleksimu. Kenali dirimu dulu, lalu kita susun langkahnya bersama.",
  cta: "Isi Gambaran Minat Bakat",
};

export const AP_SETUP = {
  title: "Susun rencana belajarmu",
  body: `Pilih fokus seleksi, hari belajar, dan sampai kapan rencananya berjalan. Di setiap hari belajar, AI ${BRAND.name} menyiapkan latihan soal dan memberi porsi lebih untuk subtes yang skornya paling rendah.`,
  cta: "Atur rencana",
  steps: [
    { title: "Pilih fokus", body: "Maksimal 2: SNBT, TKA, atau Kedinasan" },
    { title: "Pilih hari belajar", body: "Latihan muncul di hari yang kamu pilih" },
    { title: "Tentukan durasi", body: "Beberapa minggu atau sampai hari ujian" },
  ],
};

export const AP_SUMMARY = {
  label: "Ringkasan minggu ini",
  focusTitle: "Fokus minggu ini",
  focusCount: (done: number, total: number) => `${done} dari ${total} latihan`,
  week: (from: string, to: string) => `Minggu ini, ${from} sampai ${to}`,
  weekDone: "dari",
  weekDoneSuffix: (total: number) => `${total} latihan selesai`,
  studyDays: "hari belajar",
};

export const AP_CALENDAR = {
  prev: "Bulan sebelumnya",
  next: "Bulan berikutnya",
  weekdays: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  hint: "Pilih tanggal untuk melihat latihannya. Tombol panah juga bisa dipakai.",
  status: {
    done: "Selesai",
    unfinished: "Belum selesai",
    today: "Hari ini",
    scheduled: "Terjadwal",
    none: "Bukan hari belajar",
  },
};

export const AP_DAY = {
  summary: (count: number, questions: number, minutes: number) => `${count} latihan, ${questions} soal, sekitar ${minutes} menit`,
  ring: (done: number, total: number) => `${done} dari ${total} latihan selesai`,
  meta: (questions: number, minutes: number) => `${questions} soal, sekitar ${minutes} menit`,
  progress: (answered: number, total: number) => `${answered} dari ${total} soal`,
  result: (correct: number, total: number) => `Selesai, ${correct} dari ${total} benar`,
  cta: { todo: "Kerjakan", in_progress: "Lanjutkan", done: "Lihat pembahasan" },
  opensOn: (weekday: string) => `Terbuka ${weekday}`,
  note: {
    unfinished: "Latihan di hari ini belum selesai. Kamu masih bisa mengerjakannya kapan saja.",
    future: "Soal disiapkan AI saat harinya tiba, menyesuaikan hasil latihanmu sebelumnya.",
    focus: (focus: PlanCategory[]) =>
      `Soal disusun AI dari fokus ${focus.join(" dan ")}, dengan porsi lebih untuk subtes yang skornya paling rendah.`,
  },
  notStarted: { title: "Rencana belajar belum dimulai", body: (date: string) => `Rencanamu dimulai ${date}.` },
  rest: { title: "Bukan hari belajar", body: "Istirahat juga bagian dari rencana. Pilih tanggal lain di kalender." },
  ended: { title: "Rencana belajar sudah selesai", body: "Atur ulang rencana untuk menyusun latihan berikutnya." },
  next: (date: string, count: number) => `Latihan berikutnya: ${date}, ${count} latihan`,
  showNext: "Lihat latihannya",
};

export const AP_DIALOG = {
  titleNew: "Atur rencana belajar",
  titleEdit: "Atur ulang rencana",
  subtitle: "Latihan di hari belajar berikutnya akan disusun ulang dari pilihan ini.",
  subtitleNew: "Latihan pertama muncul mulai hari ini kalau hari ini termasuk hari belajarmu.",
  focus: "Fokus seleksi",
  focusCount: (n: number, max: number) => `${n} dari ${max} dipilih`,
  focusOptions: {
    SNBT: "Latihan 7 subtes UTBK",
    TKA: "Mapel wajib dan pilihan",
    Kedinasan: "TWK, TIU, TKP",
  } as Record<PlanCategory, string>,
  kedinasanMismatch: "Kurang selaras dengan profilmu",
  electives: "Mapel pilihan TKA",
  electivesCount: (n: number, max: number) => `${n} dari ${max} dipilih`,
  electivesHint: "Pilih sesuai mapel pilihan saat kamu mendaftar TKA. Mapel wajib (Matematika, Bahasa Indonesia, Bahasa Inggris) selalu ikut dilatih.",
  suggested: "Saran",
  suggestedHint: `Saran dari jurusan rekomendasi ${BRAND.compassName} dan nilai rapormu. Keputusan tetap di kamu.`,
  days: "Hari belajar",
  daysCount: (n: number) => `${n} hari per minggu`,
  dayNames: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
  duration: "Durasi rencana",
  minutes: "Waktu belajar per hari",
  minutesOption: (m: number) => `Sekitar ${m} menit`,
  estimate: (n: number) => `Kira-kira ${n} latihan soal per minggu. Subtes dengan skor terendah dapat porsi lebih banyak.`,
  cancel: "Batal",
  apply: "Terapkan rencana",
  applying: "AI sedang menyusun latihan...",
  needFocus: "Pilih minimal satu fokus dan satu hari belajar.",
  error: "Rencana gagal disimpan. Coba lagi.",
  optionsError: "Pilihan rencana gagal dimuat.",
};

export const AP_CATEGORY_LABEL: Record<PlanCategory, string> = { SNBT: "SNBT", TKA: "TKA", Kedinasan: "Kedinasan" };
