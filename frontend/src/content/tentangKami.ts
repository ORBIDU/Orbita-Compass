import { BRAND } from "@/config/brand";

// Teks halaman Tentang Kami (/tentang-kami), mengikuti desain dari tim (pratinjau
// docs/design/publik/TentangKami-Desktop.webp). Bagian "Hubungi Kami" dari desain
// tidak dipakai karena sudah ada di /faq. Teks yang tidak terbaca di pratinjau
// ditulis ulang sesuai fitur yang benar-benar ada; ganti di sini kalau teks resminya ada.

const B = BRAND.name;
const HI = BRAND.audience;

export const TENTANG_PAGE_TITLE = "Tentang Kami";

export const TENTANG_HERO = {
  titleTop: "Setiap siswa punya",
  titleAccent: "Orbitnya sendiri",
  body: {
    before: "Kami percaya setiap siswa punya potensi, perjalanan, dan tujuan pendidikan yang berbeda. ",
    brand: B,
    after: " hadir untuk membantu mereka mengenali diri, menemukan arah, dan mengambil langkah menuju tujuan tersebut.",
  },
  primary: `Kenali ${B}`,
  secondary: "Misi Kami",
  /** Label di sekitar maskot (urutan perjalanan). */
  steps: ["1. Potensi", "2. Arah", "3. Langkah"],
};

export const TENTANG_STORY = {
  badge: "Our Story",
  title: "Semuanya berawal dari satu pertanyaan",
  quote: "Bagaimana kalau setiap siswa punya cara yang lebih mudah untuk menemukan arah pendidikannya?",
  illustrationTitle: "Kebingungan Setelah SMA?",
  illustrationBody: "Nilai, minat, dan prestasi sering tersebar dan belum terbaca utuh.",
  highlight:
    "Memilih pendidikan setelah SMA bukan selalu tentang menemukan satu jawaban yang benar. Siswa perlu memahami dirinya, mengenal berbagai pilihan, dan mengetahui langkah yang perlu dilakukan.",
  body: "Namun, informasi tentang nilai, prestasi, minat, kemampuan, dan pilihan pendidikan sering kali masih berjalan sendiri-sendiri tanpa ada benang merah yang terhubung.",
  hadir: {
    lead: "Dari situlah ",
    brand: B,
    after: " hadir.",
    body: "Kami membangun platform pendampingan perencanaan pendidikan yang membantu menghubungkan perjalanan tersebut dalam satu tempat, dari mengenali potensi hingga mulai mengambil langkah.",
  },
};

export const TENTANG_JOURNEY = {
  titleTop: "Your journey",
  titleAccent: "Your orbit",
  body: "Setiap siswa punya potensi, minat, kemampuan, pengalaman, dan tujuan yang berbeda.",
  callout: {
    before: "Karena itu, ",
    strong: `${B} tidak hadir untuk menentukan satu jawaban`,
    after: ", tetapi membantu siswa memahami pilihan yang tersedia dan alasan di baliknya.",
  },
  diagramTitle: "Pencabangan Orbit Pendidikan",
  /** Cabang pilihan di diagram (warna dipetakan di komponen). */
  branches: ["PTN", "PTS", "Kedinasan", "PTLN"],
  diagramNote: `${B} menampilkan beberapa pilihan beserta alasannya, bukan satu jawaban.`,
};

export const TENTANG_MISI = {
  badge: "Our Mission",
  titleLead: "Membantu siswa ",
  titleStrong: "menemukan",
  titleAfter: " arahnya sendiri.",
  body: `${B} hadir untuk mendampingi setiap tahap eksplorasi pendidikan melalui 6 pilar misi utama.`,
  items: [
    { icon: "potensi", title: "Memahami Potensi Diri", body: "Membantu siswa mengenali minat, bakat, dan kekuatannya lewat Gambaran Minat Bakat." },
    { icon: "informasi", title: "Menghubungkan Informasi", body: "Menyatukan nilai rapor, prestasi, dan minat menjadi satu profil yang utuh." },
    { icon: "eksplorasi", title: "Eksplorasi Relevan", body: "Membantu siswa menjelajahi jurusan dan kampus yang sesuai dengan profilnya." },
    { icon: "alasan", title: "Rasional & Alasan", body: "Setiap rekomendasi dilengkapi alasan, supaya siswa paham kenapa pilihan itu cocok." },
    { icon: "langkah", title: "Tujuan Menjadi Langkah", body: "Mengubah tujuan pendidikan menjadi latihan dan rencana harian lewat Action Plan." },
    { icon: "sekolah", title: "Dukungan untuk Sekolah", body: "Membantu Guru BK dan Wali Kelas mendampingi perjalanan setiap siswa." },
  ],
} as const;

export interface TeamMember {
  name: string;
  role: string;
  body: string;
  /** URL foto. Kosong = avatar bawaan. */
  photo?: string;
}

// BELUM DIPASTIKAN: hanya tiga nama yang terbaca dari desain dan semua foto belum ada.
// Lengkapi nama, peran, deskripsi, dan foto 8 anggota lainnya di sini.
const PLACEHOLDER: TeamMember = { name: "Anggota Tim", role: "Peran menyusul", body: "Profil anggota tim ini akan segera dilengkapi." };

export const TENTANG_TIM = {
  badge: "Our Team",
  title: "Meet the Team!",
  body: `${B} dibangun oleh tim yang peduli pada pendidikan, teknologi, dan perjalanan siswa. Kami bekerja bersama supaya merencanakan masa depan terasa lebih personal, jelas, dan mudah dipahami.`,
  prev: "Anggota tim sebelumnya",
  next: "Anggota tim berikutnya",
  position: (current: number, total: number) => `${current} dari ${total}`,
  members: [
    { name: "Alya Fahira", role: "UX Researcher", body: "Memahami kebutuhan siswa dan sekolah lewat riset pengguna." },
    { name: "Dhiya Rizki Ramadhani", role: "Product Lead", body: "Menyelaraskan strategi produk, prioritas fitur, dan kebutuhan pengguna di setiap tahapan." },
    { name: "Naufal Raffi Pratama", role: "Backend & AI Engineer", body: `Membangun sistem backend, basis data, API, dan integrasi AI ${B}.` },
    ...Array.from({ length: 8 }, () => PLACEHOLDER),
  ] satisfies TeamMember[],
};

export const TENTANG_EKOSISTEM = {
  titleBrand: B,
  titleLead: " tidak membangun perjalanan ini sendirian.",
  titleAccent: "Perjalanan ini dibangun bersama.",
  body: `${B} terbuka untuk berkolaborasi dengan sekolah, institusi pendidikan, profesional, dan berbagai pihak yang peduli pada perkembangan pendidikan siswa.`,
  partners: [
    { icon: "sekolah", label: "Sekolah" },
    { icon: "guru", label: "Guru BK & Wali Kelas" },
    { icon: "keluarga", label: "Orang Tua" },
    { icon: "mitra", label: "Mitra Pendidikan" },
  ],
  quote: "We're building the ecosystem.",
  quoteBody: "Mari bersama menghadirkan pendampingan pendidikan yang lebih terarah untuk setiap siswa.",
  cta: `Bawa ${B} ke Sekolahmu`,
} as const;

export const TENTANG_CTA = {
  titleLead: "Ready to find your orbit, ",
  titleAccent: `${HI}?`,
  body: "Kenali dirimu. Temukan arahmu. Mulai langkahmu.",
  cta: `Hadirkan ${B} di Sekolahmu`,
};
