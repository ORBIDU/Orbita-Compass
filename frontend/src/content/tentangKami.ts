import { BRAND } from "@/config/brand";

// Teks halaman Tentang Kami (/tentang-kami). Belum ada desain dari tim UI/UX,
// jadi halaman disusun dengan gaya situs publik yang sama. Isinya hanya hal
// yang benar-benar ada di produk: tanpa angka, nama tim, atau klaim yang belum
// bisa dipertanggungjawabkan. Ganti teks di sini setelah tim menyiapkan versi resminya.

const B = BRAND.name;

export const TENTANG_PAGE_TITLE = "Tentang Kami";

export const TENTANG_HERO = {
  kicker: `Tentang ${B}`,
  titleLead: "Menemani siswa menemukan ",
  titleAccent: "orbitnya sendiri.",
  body: `${B} adalah platform pendampingan pendidikan untuk siswa SMA. Kami membantu siswa mengenali potensi, menemukan arah pendidikan, mengeksplorasi pilihan, dan menyusun langkah persiapannya sejak kelas X.`,
  primary: "Hubungi Kami",
  secondary: `${B} untuk Sekolah`,
};

export const TENTANG_ALASAN = {
  kicker: `Kenapa ${B} ada`,
  title: "Banyak siswa bingung harus mulai dari mana.",
  paragraphs: [
    "Pilihannya banyak: PTN, PTS, Kedinasan, sampai kuliah di luar negeri. Di saat yang sama, banyak siswa belum yakin potensinya ada di bidang apa.",
    `${B} merangkum gambaran minat bakat, prestasi, dan nilai rapor menjadi rekomendasi jurusan beserta alasannya, supaya siswa paham kenapa sebuah pilihan cocok untuknya.`,
    "Keputusan tetap di tangan siswa, didampingi guru BK, wali kelas, dan orang tua.",
  ],
};

export const TENTANG_PRINSIP = {
  kicker: "Yang kami pegang",
  title: "Empat hal yang selalu kami jaga",
  items: [
    {
      icon: "keputusan",
      title: "Siswa yang memutuskan",
      body: `${B} memberi beberapa pilihan yang sesuai beserta alasannya, bukan satu jawaban "terbaik".`,
    },
    {
      icon: "jujur",
      title: "Jujur pada data",
      body: "Kalau datanya belum ada, kami tampilkan apa adanya. Tidak ada angka yang dikarang.",
    },
    {
      icon: "langkah",
      title: "Langkah kecil yang nyata",
      body: "Tujuan besar dipecah menjadi latihan dan rencana harian lewat Action Plan.",
    },
    {
      icon: "bersama",
      title: "Bersama sekolah",
      body: "Guru BK dan wali kelas bisa ikut mendampingi sesuai peran dan aksesnya.",
    },
  ],
} as const;

export const TENTANG_PERJALANAN = {
  kicker: `Perjalanan di ${B}`,
  title: "Dari mengenal diri sampai siap seleksi",
  steps: [
    { icon: "kenali", title: "Kenali diri", body: "Gambaran Minat Bakat, prestasi, dan nilai rapor." },
    { icon: "arah", title: "Temukan arah", body: `${BRAND.compassName} menyarankan bidang dan jurusan beserta alasannya.` },
    { icon: "jelajah", title: "Jelajahi pilihan", body: "Explore Jurusan dan Explore Beasiswa." },
    { icon: "rencana", title: "Susun langkah", body: "Action Plan berisi latihan soal harian." },
    { icon: "siap", title: "Bersiap", body: "Siap SNBP, SNBT, TKA, dan SKD." },
  ],
} as const;

export const TENTANG_CTA = {
  titleLead: "Punya pertanyaan tentang ",
  titleAccent: `${B}?`,
  body: `Ngobrol langsung dengan tim ${B} lewat WhatsApp, atau lihat bagaimana ${B} bisa hadir di sekolahmu.`,
  cta: `Hubungi Tim ${B}`,
  secondary: "Lihat Untuk Sekolah",
};
