import { BRAND } from "@/config/brand";

// Teks halaman Untuk Sekolah (/untuk-sekolah), mengikuti
// docs/design/publik/UntukSekolah-Desktop.jpg. Beberapa teks desain disesuaikan
// supaya sesuai kondisi produk (dicatat di docs/design/publik/README.md):
// salah ketik diperbaiki, judul kartu Wali Kelas tidak lagi sama dengan kartu
// Siswa, poin Guru BK yang dobel diganti, dan "umpan balik real-time" dihapus.

const B = BRAND.name;

export const SEKOLAH_PAGE_TITLE = "Untuk Sekolah";

export const SEKOLAH_HERO = {
  titleTop: "Mendampingi setiap langkah siswa,",
  titleLead: "dengan ",
  titleAccent: "lebih terarah",
  body: {
    before: "Kami percaya setiap siswa punya potensi, perjalanan, dan tujuan pendidikan yang berbeda. ",
    brand: B,
    after: " hadir untuk membantu mereka mengenali diri, menemukan arah, dan mengambil langkah menuju tujuan tersebut.",
  },
  cta: `Ingin menghadirkan ${B} di sekolahmu?`,
};

export const SEKOLAH_PERAN = {
  title: `Satu ${B} untuk semua yang mendampingi siswa`,
  link: "Tanya tim kami",
  cards: [
    {
      kicker: "Untuk Siswa",
      title: "Bantu siswa mengenali arahnya sendiri.",
      avatar: "siswa",
      tone: "green",
      points: [
        "Mengenali minat dan potensi diri",
        "Melihat profil dirinya secara lebih utuh",
        "Mengeksplorasi pilihan pendidikan",
        "Memahami alasan di balik rekomendasi",
        "Menentukan langkah yang perlu dipersiapkan",
        "Membangun kepercayaan diri melalui refleksi",
      ],
    },
    {
      kicker: "Untuk Guru BK",
      title: "Pendampingan dimulai dari memahami siswa.",
      avatar: "guru",
      tone: "orange",
      points: [
        "Melihat profil dan insight siswa",
        "Memahami minat, potensi, akademik, dan prestasi",
        "Mendukung eksplorasi pilihan pendidikan siswa",
        "Memberikan catatan atau arahan",
        "Memahami alasan di balik rekomendasi siswa",
        "Memantau perkembangan Action Plan siswa",
      ],
    },
    {
      kicker: "Untuk Wali Kelas",
      title: "Ikuti perkembangan siswa di kelasmu.",
      avatar: "wali",
      tone: "green",
      points: [
        "Melihat informasi siswa sesuai akses",
        "Memahami perkembangan siswa",
        "Mendukung komunikasi dengan Guru BK",
        "Membantu siswa tetap fokus pada langkah yang telah direncanakan",
        "Memfasilitasi kolaborasi antara orang tua dan guru",
        "Memberikan umpan balik yang membangun",
      ],
    },
  ],
} as const;

export const SEKOLAH_MANFAAT = {
  titleLead: "Apa yang Didapat ",
  titleAccent: "Sekolah?",
  cards: [
    { icon: "personal", title: "Personal", body: "Pendampingan dapat melihat kondisi dan kebutuhan setiap siswa." },
    { icon: "terintegrasi", title: "Terintegrasi", body: "Informasi akademik, prestasi, minat dan bakat, serta refleksi dapat dilihat dalam konteks yang lebih utuh." },
    { icon: "terarah", title: "Terarah", body: "Siswa tidak hanya mengetahui pilihannya, tetapi juga memahami langkah berikutnya." },
    { icon: "terukur", title: "Terukur", body: "Perkembangan siswa dan aktivitas perencanaan dapat dipantau sesuai kebutuhan sekolah." },
  ],
} as const;

export const SEKOLAH_LANGKAH = {
  badge: "Cara kerjanya",
  steps: [
    { no: "01", icon: "sekolah", title: "Sekolah bergabung", body: `Sekolah menghubungi tim ${B} dan menentukan kebutuhan penerapannya.` },
    { no: "02", icon: "siswa", title: "Siswa mengisi profil", body: "Siswa melengkapi informasi akademik, prestasi, minat dan bakat, serta refleksi diri." },
    { no: "03", icon: "maskot", title: `${B} membantu memetakan`, body: "Informasi siswa dirangkum menjadi profil dan insight yang dapat digunakan untuk eksplorasi pendidikan." },
    { no: "04", icon: "siswa", title: "Siswa menentukan langkah", body: "Siswa mengeksplorasi pilihan pendidikan dan membuat Action Plan." },
    { no: "05", icon: "sekolah", title: "Sekolah mendampingi", body: "Guru BK dan Wali Kelas dapat mendukung perjalanan siswa sesuai peran dan akses masing-masing." },
  ],
} as const;

export const SEKOLAH_CTA = {
  titleTop: "Ready to find your",
  titleLead: "orbit, ",
  titleAccent: `${BRAND.audience}?`,
  body: `Siap menghadirkan pendampingan pendidikan yang lebih terarah? Bersama ${B}, bantu setiap siswa mengenali potensinya, menemukan arah pendidikan yang sesuai, dan mengambil langkah untuk mencapainya.`,
  cta: `Hadirkan ${B} di Sekolahmu`,
};
