// Teks panel Mode Demo. Hanya dipakai DemoModePanel, yang dimuat terpisah di
// mode dummy, jadi teks ini tidak ikut di build mode backend.

import { BRAND } from "@/config/brand";

export const DEMO_PANEL = {
  title: "Mode Demo",
  close: "Tutup panel Mode Demo",
  data: (email: string) => `Data dummy · ${email}`,
  statusTitle: "Status siswa",
  reset: "Kembalikan data dummy ke awal",
  error: "Gagal mengganti status. Coba lagi.",
  hints: {
    baru: `Belum isi Gambaran Minat Bakat. ${BRAND.compassName}, Performa, dan Action Plan terkunci.`,
    sudah_asesmen: "Tes selesai, belum pernah latihan atau tryout.",
    aktif: "Sudah punya data latihan atau tryout. Semua bagian terisi.",
  },
};
