import type { JurusanSummary } from "@/types/jurusan";

// CONTOH DATA. Jurusan unggulan untuk carousel beranda, sesuai desain
// docs/design/landing. Katalog lengkap (dikelompokkan per nama jurusan)
// ditambahkan di Tahap 2B. Foto belum ada, jadi imageUrl = null.

export const FEATURED_JURUSAN: JurusanSummary[] = [
  {
    slug: "informatika",
    name: "Informatika",
    bidang: "teknologi",
    description:
      "Jurusan Informatika mempelajari cara merancang perangkat lunak, algoritma, dan sistem cerdas, mulai dari pemrograman dasar sampai kecerdasan buatan.",
    imageUrl: null,
  },
  {
    slug: "kedokteran",
    name: "Kedokteran",
    bidang: "kesehatan",
    description:
      "Jurusan Kedokteran mempelajari tubuh manusia, penyakit, serta cara mendiagnosis, mengobati, dan mencegahnya, termasuk praktik klinis di rumah sakit.",
    imageUrl: null,
  },
  {
    slug: "psikologi",
    name: "Psikologi",
    bidang: "sosial",
    description:
      "Jurusan Psikologi mempelajari cara manusia berpikir, merasa, dan berperilaku, serta bagaimana membantu orang lain menghadapi masalahnya.",
    imageUrl: null,
  },
  {
    slug: "ilmu-hukum",
    name: "Ilmu Hukum",
    bidang: "hukum",
    description:
      "Jurusan Ilmu Hukum mengkaji aturan, keadilan, dan cara hukum bekerja di tengah masyarakat, dari hukum pidana sampai hukum bisnis.",
    imageUrl: null,
  },
  {
    slug: "manajemen",
    name: "Manajemen",
    bidang: "ekonomi",
    description:
      "Jurusan Manajemen mempelajari cara mengelola organisasi dan bisnis, mulai dari pemasaran, keuangan, sumber daya manusia, sampai strategi.",
    imageUrl: null,
  },
  {
    slug: "teknik-sipil",
    name: "Teknik Sipil",
    bidang: "teknik",
    description:
      "Jurusan Teknik Sipil mempelajari perancangan dan pembangunan infrastruktur seperti gedung, jembatan, jalan, dan sistem pengairan.",
    imageUrl: null,
  },
  {
    slug: "desain-komunikasi-visual",
    name: "Desain Komunikasi Visual",
    bidang: "desain",
    description:
      "Jurusan DKV mempelajari cara menyampaikan pesan lewat visual, seperti ilustrasi, tipografi, branding, fotografi, dan desain digital.",
    imageUrl: null,
  },
  {
    slug: "akuntansi-sektor-publik",
    name: "Akuntansi Sektor Publik",
    bidang: "kedinasan",
    description:
      "Jurusan ini mempelajari pengelolaan keuangan negara dan pelaporannya, dengan ikatan dinas sebagai aparatur setelah lulus.",
    imageUrl: null,
  },
];
