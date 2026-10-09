// Teks halaman Explore Beasiswa, mengikuti docs/design/portal/Portal-Beasiswa.dc.html.

import { BRAND } from "@/config/brand";

export const BEASISWA_HEADER = {
  breadcrumbHome: "Dashboard",
  breadcrumbCompass: BRAND.compassName,
  title: "Explore Beasiswa",
  description: "Arah kuliahmu sudah ada. Sekarang cari cara untuk mewujudkannya.",
  /** Belum mengisi Gambaran Minat Bakat (status "baru"). */
  descriptionBaru: `Cari beasiswa yang bisa membantu biaya kuliahmu. Isi Gambaran Minat Bakat supaya ${BRAND.name} bisa menandai yang cocok dengan jalurmu.`,
  /** Sudah tes, tetapi belum punya hasil ORBIDU Compass. */
  descriptionNoCompass: `Cari beasiswa yang bisa membantu biaya kuliahmu. Buka ${BRAND.compassName} supaya beasiswa yang cocok dengan jalurmu bisa ditandai.`,
  sample: "Contoh data, menunggu data resmi dari tim",
};

export const FILTERS = {
  title: "Filter",
  reset: "Atur ulang",
  open: "Filter",
  openWithCount: (n: number) => `Filter (${n})`,
  apply: (n: number) => `Lihat ${n} beasiswa`,
  close: "Tutup",
  match: { title: "Cocok dengan jalurku", hint: `Dari hasil ${BRAND.compassName}` },
  matchUnavailable: {
    baru: "Isi Gambaran Minat Bakat dulu",
    noCompass: `Belum ada hasil ${BRAND.compassName}`,
  },
  groups: { levels: "Jenjang", locations: "Lokasi kuliah", aid: "Jenis bantuan" },
  saved: "Hanya yang disimpan",
  search: "Cari beasiswa",
  // Dibuat pendek supaya tidak terpotong di HP 360px.
  searchPlaceholder: "Cari beasiswa atau penyelenggara",
  countUnit: "beasiswa",
};

export const CARD = {
  match: "Cocok dengan jalurmu",
  coverage: "Cakupan",
  requirements: "Syarat utama",
  detail: "Lihat detail",
  save: (name: string) => `Simpan ${name}`,
  unsave: (name: string) => `Hapus ${name} dari simpanan`,
  saveError: "Gagal menyimpan. Coba lagi.",
};

export const DETAIL = {
  coverage: "Cakupan",
  requirements: "Syarat utama",
  documents: "Dokumen yang biasanya diminta",
  website: "Kunjungi situs resmi",
  websiteNewTab: "(terbuka di tab baru)",
  noWebsite: "Situs resmi belum tersedia di contoh data. Cari informasinya dari penyelenggara langsung.",
  save: "Simpan beasiswa",
  saved: "Disimpan",
};

export const EMPTY = {
  title: "Belum ada beasiswa yang cocok dengan filtermu",
  body: "Coba kurangi filter atau atur ulang.",
  cta: "Atur ulang filter",
};

export const ELIGIBILITY_NOTE = `Label "Cocok dengan jalurmu" hanya melihat jenjang dan jalur dari ${BRAND.compassName}. Kelayakan sebenarnya ditentukan penyelenggara, misalnya kondisi ekonomi keluarga untuk KIP Kuliah. Selalu cek syarat terbaru di situs resminya.`;

/** Bagian beasiswa di halaman Compass. */
export const COMPASS_SCHOLARSHIPS = {
  title: "Beasiswa yang bisa kamu coba",
  subtitle: "Cocokkan syaratnya dengan kondisimu. Seleksi beasiswa punya kriteria masing-masing.",
  cta: "Explore Beasiswa",
  coverage: "Cakupan:",
  requirements: "Syarat utama:",
  empty: "Belum ada beasiswa contoh yang cocok dengan jalurmu. Lihat semua beasiswa untuk pilihan lain.",
};
