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
 * Latihan Soal ditambahkan saat halamannya dibuat (Tahap 10D).
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
    { label: "FAQ", to: ROUTES.faq },
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
  /** Urutan dan bentuk gelembung sama dengan desain (gambar gelembung di assets/publik/masalah). */
  bubbles: [
    { text: "PTN, PTS, Kedinasan, atau PTLN, ya? Kok pilihannya banyak banget...", shape: "kotakKanan" },
    { text: "Masih bingung harus mulai dari mana :(", shape: "oval" },
    { text: "Aku gatau potensi-ku di bidang apa...", shape: "bebas" },
    { text: "Kalau aku suka ini, berarti jurusannya apa yaa?", shape: "kotakKiri" },
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
        { label: "FAQ", to: ROUTES.faq },
        { label: "Hubungi Kami", to: `${ROUTES.faq}#kontak` },
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
