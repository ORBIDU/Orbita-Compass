import type { TimelineEvent } from "@/types/dashboard";

// Jadwal seleksi PERKIRAAN berdasarkan pola tahun-tahun sebelumnya.
// Jadwal resmi mengikuti pengumuman SNPMB dan instansi terkait; perbarui
// data ini setiap kali jadwal resmi keluar. Belum ada endpoint backend
// (docs/API_CONTRACT.md bagian 7.3).
export const SELECTION_TIMELINE: TimelineEvent[] = [
  { id: "tka-2026", month: "2026-11", title: "Tes Kemampuan Akademik (TKA)", note: "Perkiraan, untuk siswa kelas XII", tone: "orange" },
  { id: "snbp-eligible-2026", month: "2026-12", title: "Pengumuman siswa eligible SNBP", note: "Perkiraan, ditentukan sekolah", tone: "blue" },
  { id: "snpmb-akun-2027", month: "2027-01", title: "Registrasi akun SNPMB", note: "Perkiraan", tone: "blue" },
  { id: "snbp-daftar-2027", month: "2027-02", title: "Pendaftaran SNBP", note: "Perkiraan", tone: "blue" },
  { id: "snbt-daftar-2027", month: "2027-03", title: "Pendaftaran UTBK-SNBT", note: "Perkiraan", tone: "blue" },
  { id: "utbk-2027", month: "2027-04", title: "Pelaksanaan UTBK-SNBT", note: "Perkiraan", tone: "blue" },
  { id: "skd-2027", month: "2027-07", title: "Seleksi sekolah kedinasan (SKD)", note: "Perkiraan, mengikuti instansi masing-masing", tone: "blue" },
];
