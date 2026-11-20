import { BRAND, type WhatsAppTopic } from "@/config/brand";
import { ROUTES } from "@/config/navigation";
import { ACCOUNT_ACCESS } from "./common";

// Semua teks beranda dan kerangka halaman publik, mengikuti desain docs/design/publik.
// Komponen hanya menampilkan isi file ini; ubah teks di sini, bukan di komponen.

const B = BRAND.name;
const HI = BRAND.audience;

export const HEADER = {
  /** Tamu: membuka WhatsApp (tidak ada pendaftaran mandiri; desain menulis "Daftar"). */
  berlangganan: ACCOUNT_ACCESS.subscribe,
  masuk: "Masuk",
  bukaPortal: "Buka Portal",
  logoLabel: `${B}, ke beranda`,
};

/**
 * Menu navbar halaman publik (desain docs/design/publik).
 * Latihan Soal ditambahkan saat halamannya dibuat (Tahap 10D), halaman FAQ di
 * Tahap 10E (sementara menuju section FAQ di beranda).
 */
export const NAV = {
  label: "Menu utama",
  open: "Buka menu",
  close: "Tutup menu",
  items: [
    { label: "Beranda", to: ROUTES.landing },
    { label: "Untuk Sekolah", to: ROUTES.untukSekolah },
    { label: "Eksplor Jurusan", to: ROUTES.jurusan },
    { label: "Tentang Kami", to: ROUTES.tentangKami },
    { label: "FAQ", to: `${ROUTES.landing}#faq` },
  ],
};

export const HERO = {
  titleTop: "Temukan potensi diri,",
  titleBottom: "Raih mimpi sepenuh hati",
  subtitle: "Platform pendampingan pendidikan terarah bagi siswa SMA untuk mengeksplorasi pilihan terbaik dan mewujudkan masa depan.",
  /** Tamu: WhatsApp pesan "sekolah". Sudah masuk: "Buka Portal". */
  primaryCta: "Daftarin Sekolah",
  primaryCtaLoggedIn: "Buka Portal",
  /** Scroll ke section Masalah. */
  secondaryCta: `Jelajahi ${B}`,
  schoolAlt: "Ilustrasi gedung sekolah dengan logo beberapa kampus",
};

export const PROBLEM = {
  title: "Masih bingung harus mulai dari mana?",
  /** Urutan dan bentuk gelembung sama dengan desain. */
  bubbles: [
    { text: "PTN, PTS, Kedinasan, atau PTLN, ya? Kok pilihannya banyak banget...", shape: "box", tail: "right" },
    { text: "Masih bingung harus mulai dari mana :(", shape: "oval", tail: "right" },
    { text: "Aku gatau potensi-ku di bidang apa...", shape: "oval", tail: "left" },
    { text: "Kalau aku suka ini, berarti jurusannya apa yaa?", shape: "box", tail: "left" },
  ] as const,
};

export const TENANG = {
  lead: `Tenang ${HI}, ada`,
  points: ["Membantumu mengenali diri,", "Menemukan arah pendidikan,", "Mengeksplorasi pilihan,", "Mengambil langkah yang lebih terarah"],
};

export const PERJALANAN = {
  badge: `Perjalananmu di ${B}`,
  title: "Dari bingung menjadi lebih yakin",
  body: "Tiga tahap sederhana untuk membantumu memahami diri, melihat kemungkinan, lalu bergerak dengan rencana yang lebih terarah.",
  link: "Pelajari tahap ini",
  /** `to`: tujuan link (lihat useLandingNav: tamu ke Masuk, siswa ke portal). */
  cards: [
    {
      no: "01",
      kicker: "Kenali Diri",
      title: "Temukan kekuatan unikmu",
      // Desain menyebut "gaya belajar"; tes ORBIDU mengukur minat dan bakat, jadi disesuaikan.
      body: "Pahami minat, bakat, dan potensimu melalui tes yang terasa ringan dan relevan.",
      to: "kenali",
      tone: "blue",
    },
    {
      no: "02",
      kicker: "Jelajahi Pilihan",
      title: "Lihat jurusan lebih dekat",
      body: "Kenali berbagai bidang studi dan hubungkan setiap pilihan dengan dirimu, bukan sekadar tren.",
      to: "jurusan",
      tone: "orange",
    },
    {
      no: "03",
      kicker: "Susun Langkah",
      title: "Bangun peta perjalananmu",
      body: "Ubah tujuan besar menjadi langkah-langkah nyata yang dapat kamu mulai dari sekarang.",
      to: "action-plan",
      tone: "green",
    },
  ] as const,
};

/** Dipakai kartu jurusan di /jurusan. */
export const JURUSAN_SECTION = {
  photoPlaceholder: "Foto jurusan",
};

export interface FaqGroup {
  category: string;
  items: { q: string; a: string }[];
}

export const FAQ = {
  categoriesLabel: "Kategori pertanyaan",
  title: `Punya pertanyaan tentang ${B}?`,
  body: `Pilih kategori pertanyaanmu. Kalau jawabannya belum ada, ngobrol langsung sama tim ${B} lewat WhatsApp.`,
  whatsappCta: "Tanya lewat WhatsApp",
  groups: [
    {
      category: `Tentang ${B}`,
      items: [
        { q: `Apa itu ${B}?`, a: `${B} adalah platform pendampingan perencanaan pendidikan bagi siswa SMA untuk membantu mengenali potensi, menemukan arah pendidikan, mengeksplorasi pilihan, dan menentukan langkah berikutnya.` },
        { q: `Bagaimana cara mendapatkan akun ${B}?`, a: ACCOUNT_ACCESS.full },
        { q: `Siapa yang bisa menggunakan ${B}?`, a: `${B} ditujukan untuk siswa SMA kelas X–XII, serta mendukung Guru BK, Wali Kelas, dan sekolah dalam proses pendampingan pendidikan.` },
        { q: `Bagaimana ${B} memberikan rekomendasi pendidikan?`, a: "Rekomendasi disusun berdasarkan informasi dalam profil siswa, seperti data akademik, prestasi, minat dan bakat, serta refleksi diri. Setiap rekomendasi dilengkapi alasan agar siswa memahami dasar pilihannya." },
        { q: "Apakah data siswa aman?", a: `Data siswa hanya dipakai untuk fitur ${B}, seperti rekomendasi jurusan dan rencana belajar. Pengamanannya terus disiapkan bersama tim sebelum ${B} dipakai secara luas.` },
      ],
    },
    {
      category: `Untuk ${HI}`,
      items: [
        { q: `Apakah ${B} menentukan satu jurusan terbaik untuk saya?`, a: `Tidak. ${B} membantu menemukan beberapa pilihan yang sesuai dengan profilmu untuk kemudian kamu eksplorasi dan pertimbangkan.` },
        { q: "Pilihan pendidikan apa saja yang bisa dieksplorasi?", a: "Berbagai program studi dan jalur pendidikan, seperti PTN, PTS, Kedinasan, dan PTLN, sesuai dengan pilihan dan kebutuhanmu." },
        { q: `Apakah ${B} juga membantu persiapan seleksi?`, a: `Ya. ${B} membantumu memahami apa yang perlu disiapkan untuk jalur seleksi yang relevan, seperti SNBP, SNBT, TKA, SKD, dan jalur lainnya sesuai ketentuan yang berlaku.` },
        { q: "Apa itu Action Plan?", a: "Action Plan membantu mengubah tujuan pendidikanmu menjadi langkah yang lebih konkret, mulai dari menentukan prioritas, membuat tugas, hingga memantau progres." },
      ],
    },
    {
      category: "Untuk Sekolah",
      items: [
        { q: `Bagaimana sekolah bisa menggunakan ${B}?`, a: `Sekolah dapat menggunakan ${B} sebagai bagian dari pendampingan pendidikan siswa. Guru BK dan Wali Kelas memperoleh informasi yang lebih terarah untuk memahami dan mendampingi perjalanan siswa.` },
        { q: `Bagaimana cara sekolah bergabung dengan ${B}?`, a: `Sekolah dapat menghubungi tim ${B} untuk mendapatkan informasi mengenai proses kerja sama, implementasi, dan penggunaan platform di sekolah.` },
      ],
    },
  ] satisfies FaqGroup[],
};

export const FINAL_CTA = {
  kicker: BRAND.tagline,
  titleTop: "Setiap mimpi punya jalurnya.",
  titleBottom: `Temukan orbitmu bersama ${B}.`,
  subtitle: "Mulai dari memahami diri. Bergerak dengan arah. Bertumbuh melalui setiap langkah.",
  /** Tamu: WhatsApp berlangganan. Sudah masuk: ke portal. */
  cta: "Mulai Perjalanan",
  ctaLoggedIn: "Buka Portal",
};

export type FooterLink = { label: string; to: string } | { label: string; whatsapp: WhatsAppTopic };

export const FOOTER = {
  description: "Smart companion untuk membantu siswa memahami diri, menemukan arah, dan mengambil langkah menuju masa depan.",
  // "Hubungi Kami" pindah ke /faq di Tahap 10E.
  columns: [
    {
      title: "Perjalanan",
      links: [
        { label: "Cara kerja", to: `${ROUTES.landing}#tenang` },
        { label: BRAND.compassName, to: `${ROUTES.landing}#perjalanan` },
        { label: "Action Plan", to: `${ROUTES.landing}#perjalanan` },
      ],
    },
    {
      title: "Kolaborasi",
      links: [
        { label: "Untuk Sekolah", to: ROUTES.untukSekolah },
        { label: "Tentang Kami", to: ROUTES.tentangKami },
        { label: "FAQ", to: `${ROUTES.landing}#faq` },
        { label: "Hubungi Kami", whatsapp: "faq" },
      ],
    },
  ] satisfies { title: string; links: FooterLink[] }[],
  copyright: (year: number) => `© ${year} ${B}. Hak cipta dilindungi.`,
  location: BRAND.location,
};

export const CONSULT = {
  title: "Ayo konsultasi!",
  subtitle: "Tanya lewat WhatsApp",
  ariaLabel: "Ayo konsultasi lewat WhatsApp",
};
