import { BRAND } from "@/config/brand";
import { ACCOUNT_ACCESS } from "./common";

// Semua teks beranda, mengikuti desain docs/design/landing/Home-*.dc.html.
// Komponen hanya menampilkan isi file ini; ubah teks di sini, bukan di komponen.

const B = BRAND.name;
const HI = BRAND.audience;

/** Lima langkah perjalanan, dipakai di chip hero dan badge tiap section. */
export const STEPS = {
  potensi: { no: 1, label: "Potensi" },
  arah: { no: 2, label: "Arah" },
  pilihan: { no: 3, label: "Pilihan" },
  persiapan: { no: 4, label: "Persiapan" },
  langkah: { no: 5, label: "Langkah" },
} as const;

export const HEADER = {
  /** Tamu: membuka WhatsApp (tidak ada pendaftaran mandiri). */
  berlangganan: ACCOUNT_ACCESS.subscribe,
  masuk: "Masuk",
  bukaPortal: "Buka Portal",
  logoLabel: `${B}, ke beranda`,
};

export const HERO = {
  greeting: `Hi, ${HI}!`,
  title: "Setiap siswa punya orbitnya sendiri.",
  subtitle: "Kenali potensimu, temukan arah pendidikanmu, dan mulai langkahmu menuju tujuan yang ingin kamu capai.",
  /** Tamu: "Berlangganan" (WhatsApp). Siswa yang sudah masuk: "Buka Portal". */
  primaryCta: ACCOUNT_ACCESS.subscribe,
  primaryCtaLoggedIn: "Buka Portal",
  secondaryCta: `Kenali ${B}`,
  campusCaption: "Jelajahi program studi dari berbagai kampus di dalam dan luar negeri",
  /** PLACEHOLDER: logo kampus belum tersedia. */
  campusLogos: ["[Logo UNSRI]", "[Logo PTN]", "[Logo PTN]", "[Logo PTN]", "[Logo PTLN]", "[Logo PTLN]"],
};

export const PROBLEM = {
  title: "Masih bingung harus mulai dari mana?",
  /** Urutan sama dengan desain. `tone` menentukan warna gelembung. */
  bubbles: [
    { text: "“Aku sebenernya gatau punya potensi di bidang apa…”", tone: "blue" },
    { text: "“Kalau aku suka ini, berarti jurusannya apa?”", tone: "peach" },
    { text: "“Kalau nanti ternyata nggak cocok gimana?”", tone: "blue" },
    { text: "“PTN, PTS, Kedinasan, atau PTLN, ya? Kok pilihannya banyak banget...”", tone: "peach" },
    { text: "“Terus, aku harus siapin apa dulu?”", tone: "blue" },
    { text: "“Duh... mulai dari mana, ya? :(”", tone: "outline" },
  ] as const,
  reassurance: `Tenang, ${HI}!`,
  heading: "Kamu nggak harus punya semua jawabannya sekarang.",
  body: `${B} membantumu mengenali diri, menemukan arah pendidikan, mengeksplorasi pilihan, dan mengambil langkah yang lebih terarah.`,
  nextLabel: "Lanjut ke bagian Kenali Dirimu",
};

export const KENALI = {
  step: STEPS.potensi,
  title: "Semuanya dimulai dari mengenal dirimu.",
  body: "Setiap siswa punya minat, kemampuan, pengalaman, dan hal-hal yang membuatnya unik. Gambaran Minat Bakat membantu kamu mengenali potensi dan hal-hal yang paling menonjol dalam dirimu.",
  cta: "Kenali Dirimu",
  profile: { title: "Profil kamu", subtitle: "Kelas X SMA", progressLabel: "Gambaran Minat Bakat", progressValue: "5 dari 7 bagian", progressPct: 71 },
  cards: [
    { key: "minat", title: "Minat", tone: "orange", chips: ["Teknologi", "Desain", "Bisnis"] },
    { key: "potensi", title: "Potensi", tone: "blue", chips: ["Analitis", "Kreatif", "Problem Solving"] },
    { key: "kemampuan", title: "Kemampuan", tone: "teal", chips: ["Komunikasi", "Digital", "Data"] },
  ] as const,
  reflection: { title: "Refleksi", note: "Hal yang ingin aku kembangkan…" },
};

export const COMPASS = {
  step: STEPS.arah,
  title: "Dari mengenal diri, lalu temukan arahmu.",
  body: `Kamu punya banyak hal yang membentuk dirimu. ${BRAND.compassName} membantu melihat semuanya sebagai satu kesatuan untuk menemukan pilihan pendidikan yang sesuai untuk kamu eksplorasi. Mulai dari program studi hingga berbagai jalur pendidikan!`,
  profile: {
    title: "Profil kamu",
    rows: [
      ["Minat", "Teknologi"],
      ["Potensi", "Analitis"],
      ["Akademik", "Matematika stabil"],
      ["Prestasi", "2 lomba"],
    ] as const,
  },
  options: {
    title: "Pilihan untuk dieksplorasi",
    badge: "Contoh hasil",
    badgeShort: "Contoh",
    items: [
      { name: "Sistem Informasi", fit: "Sangat sesuai", strong: true, reason: "Karena minat teknologimu kuat dan nilai matematikamu stabil." },
      { name: "Statistika", fit: "Sesuai", strong: false, reason: "Karena potensi analitismu menonjol." },
      { name: "Desain Komunikasi Visual", fit: "Sesuai", strong: false, reason: "Karena minat desain dan kemampuan digitalmu." },
    ] as const,
  },
  paths: {
    title: "Jalur yang bisa ditempuh",
    items: [
      { key: "ptn", name: "PTN", desc: "SNBP, SNBT, dan Mandiri" },
      { key: "pts", name: "PTS", desc: "Seleksi masing-masing kampus" },
      { key: "kedinasan", name: "Kedinasan", desc: "SKD dan tes lanjutan" },
      { key: "ptln", name: "PTLN", desc: "Seleksi dan beasiswa luar negeri" },
    ] as const,
  },
};

export const JURUSAN_SECTION = {
  step: STEPS.pilihan,
  title: "Lalu, jelajahi pilihanmu.",
  body: "Kenali apa yang dipelajari di setiap program studi, mapel yang mendukung, dan jalur masuknya sebelum kamu memutuskan.",
  moreCta: "Lihat Jurusan Lainnya",
  prevLabel: "Jurusan sebelumnya",
  nextLabel: "Jurusan berikutnya",
  photoPlaceholder: "Foto jurusan",
  empty: "Daftar jurusan belum bisa dimuat. Coba muat ulang halaman.",
};

export const ACTION_PLAN = {
  step: STEPS.persiapan,
  title: "Dari menemukan arah, lalu mulai langkahmu.",
  body: `Setelah menemukan pilihan pendidikan yang sesuai, ${B} membantu kamu menentukan apa yang perlu dipersiapkan dan langkah yang bisa dilakukan untuk mencapainya.`,
  cta: "Mulai Action Plan",
  flow: ["Goal", "Langkah", "Prioritas", "Progress"],
  goal: { label: "Goal", value: "Lolos SNBT di Sistem Informasi" },
  tasks: [
    { text: "Pahami struktur soal SNBT", status: "done", label: "Selesai" },
    { text: "Latihan 20 soal Penalaran Matematika", status: "done", label: "Selesai" },
    { text: "Ikut Tryout #1 dan bahas hasilnya", status: "high", label: "Prioritas tinggi" },
    { text: "Perbaiki subtes yang paling lemah", status: "medium", label: "Prioritas sedang" },
  ] as const,
  progress: { label: "Progress", value: "2 dari 4 langkah selesai", pct: 50 },
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
  title: `Ready to find your orbit, ${HI}?`,
  subtitle: "Kenali dirimu. Temukan arahmu. Mulai langkahmu.",
  hashtag: BRAND.hashtag,
  cta: `Hadirkan ${B} di Sekolahmu`,
};

export const FOOTER = {
  description: `${BRAND.tagline}. Pendampingan perencanaan pendidikan untuk siswa SMA kelas X sampai XII.`,
  explore: {
    title: "Jelajahi",
    // "Untuk Sekolah" dan "Tentang Kami" disembunyikan sampai halamannya dibuat.
    links: [
      { label: "Beranda", target: "beranda" },
      { label: "Explore Jurusan", target: "jurusan" },
      { label: "FAQ", target: "faq" },
    ] as const,
  },
  account: {
    title: "Akun",
    links: [
      { label: "Masuk", target: "masuk" },
      { label: ACCOUNT_ACCESS.subscribe, target: "berlangganan" },
    ] as const,
  },
  contactTitle: "Hubungi kami",
  copyright: (year: number) => `© ${year} ${B}`,
};

export const CONSULT = {
  title: "Ayo konsultasi!",
  subtitle: "Tanya lewat WhatsApp",
  ariaLabel: "Ayo konsultasi lewat WhatsApp",
};
