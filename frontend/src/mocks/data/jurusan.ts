import type { BidangKey, Career, JalurKey, JurusanDetail } from "@/types/jurusan";

// CONTOH DATA. Katalog jurusan dikelompokkan per nama jurusan.
// Sumber: JurusanPage lama (dipindah ke sini) dan desain docs/design/landing.
// Sengaja TIDAK dipindah dari halaman lama: persentase "match", perkiraan gaji,
// dan daftar alumni/kutipan tokoh, karena tidak bisa dipertanggungjawabkan.
// Bagian detail yang belum ada isinya dibiarkan kosong → tampil empty state.

const PTN_JALUR: JalurKey[] = ["SNBP", "SNBT", "Mandiri"];

type Input = Partial<JurusanDetail> & Pick<JurusanDetail, "slug" | "name" | "bidang" | "description">;

const RUMPUN_DEFAULT: Record<BidangKey, string> = {
  teknologi: "Saintek",
  sains: "Saintek",
  kesehatan: "Saintek",
  teknik: "Saintek",
  pertanian: "Saintek",
  ekonomi: "Soshum",
  hukum: "Soshum",
  sosial: "Soshum",
  pendidikan: "Soshum",
  desain: "Soshum",
  kedinasan: "Kedinasan",
};

function jurusan(input: Input): JurusanDetail {
  const kedinasan = input.bidang === "kedinasan";
  return {
    imageUrl: null,
    degree: kedinasan ? "D4" : "S1",
    rumpun: RUMPUN_DEFAULT[input.bidang],
    jalur: kedinasan ? ["Kedinasan"] : PTN_JALUR,
    about: [],
    topics: [],
    careers: [],
    supportingSubjects: [],
    similar: [],
    ptn: { search: input.name },
    ...input,
  };
}

const c = (title: string, description: string, icon?: Career["icon"]): Career => ({ title, description, icon });

export const JURUSAN_CATALOG: JurusanDetail[] = [
  // ── Teknologi & Informatika ────────────────────────────────────────────────
  jurusan({
    slug: "informatika",
    name: "Informatika",
    bidang: "teknologi",
    description:
      "Jurusan Informatika mempelajari cara merancang perangkat lunak, algoritma, dan sistem cerdas, mulai dari pemrograman dasar sampai kecerdasan buatan.",
    about: [
      "Informatika mempelajari bagaimana komputer bekerja dan bagaimana memanfaatkannya untuk menyelesaikan masalah. Kamu akan belajar merancang algoritma, menulis program, mengelola data, sampai membangun sistem cerdas yang dipakai banyak orang.",
      "Jurusan ini cocok untuk kamu yang senang memecahkan teka-teki, penasaran bagaimana aplikasi dibuat, dan sabar mencoba lagi ketika sesuatu belum berhasil.",
    ],
    topics: [
      "Algoritma dan Pemrograman",
      "Struktur Data",
      "Basis Data",
      "Jaringan Komputer",
      "Rekayasa Perangkat Lunak",
      "Kecerdasan Buatan",
      "Keamanan Siber",
    ],
    careers: [
      c("Software Engineer", "Membangun aplikasi web dan mobile", "code"),
      c("Data Analyst", "Mengolah data jadi keputusan", "chart"),
      c("UI/UX Designer", "Merancang tampilan yang mudah dipakai", "monitor"),
      c("Cyber Security Analyst", "Melindungi sistem dari serangan", "shield"),
      c("AI Engineer", "Membuat sistem yang bisa belajar", "sparkles"),
      c("IT Consultant", "Membantu bisnis memilih teknologi", "user"),
    ],
    supportingSubjects: ["Matematika", "Informatika", "Bahasa Inggris"],
    similar: ["sistem-informasi", "ilmu-komputer", "statistika"],
    ptn: { search: "Informatika", names: ["Teknik Informatika / Ilmu Komputer"] },
  }),
  jurusan({
    slug: "ilmu-komputer",
    name: "Ilmu Komputer",
    bidang: "teknologi",
    description: "Mempelajari dasar teori komputasi, algoritma, dan pemrograman untuk membangun solusi perangkat lunak.",
    similar: ["informatika", "sistem-informasi", "data-science"],
    ptn: { search: "Ilmu Komputer", names: ["Teknik Informatika / Ilmu Komputer"] },
  }),
  jurusan({
    slug: "sistem-informasi",
    name: "Sistem Informasi",
    bidang: "teknologi",
    description: "Menghubungkan teknologi dengan kebutuhan bisnis organisasi.",
    about: [
      "Sistem Informasi menghubungkan teknologi dengan kebutuhan bisnis. Kamu akan mempelajari cara membangun, mengelola, dan mengoptimalkan sistem informasi yang mendukung operasional organisasi modern.",
      "Jurusan ini cocok untuk kamu yang menyukai analisis, pemecahan masalah, serta kolaborasi antara teknologi dan bisnis.",
    ],
    topics: ["Basis Data", "Analisis Bisnis", "Pemrograman", "UI/UX", "Cloud", "Analitik Data"],
    careers: [
      c("Business Analyst", "Menerjemahkan kebutuhan bisnis jadi solusi", "chart"),
      c("Product Manager", "Mengarahkan pengembangan produk digital", "briefcase"),
      c("IT Consultant", "Membantu organisasi memilih teknologi", "user"),
      c("System Analyst", "Merancang alur sistem informasi", "monitor"),
      c("UI/UX Designer", "Merancang tampilan yang mudah dipakai", "monitor"),
    ],
    supportingSubjects: ["Matematika", "Informatika", "Bahasa Inggris", "Ekonomi"],
    similar: ["informatika", "data-science"],
    ptn: { search: "Sistem Informasi", names: ["Sistem Informasi"] },
  }),
  jurusan({
    slug: "teknik-komputer",
    name: "Teknik Komputer",
    bidang: "teknologi",
    description: "Merancang perangkat keras dan sistem tertanam modern.",
    similar: ["teknik-elektro", "informatika"],
  }),
  jurusan({
    slug: "keamanan-siber",
    name: "Keamanan Siber",
    bidang: "teknologi",
    description: "Melindungi sistem informasi dari ancaman siber.",
    similar: ["informatika", "teknik-komputer"],
  }),
  jurusan({
    slug: "rekayasa-perangkat-lunak",
    name: "Rekayasa Perangkat Lunak",
    bidang: "teknologi",
    description: "Membangun software berkualitas tinggi secara sistematis.",
    similar: ["informatika", "sistem-informasi"],
    ptn: { search: "Rekayasa Perangkat Lunak" },
  }),

  // ── Matematika & Sains Data ────────────────────────────────────────────────
  jurusan({
    slug: "data-science",
    name: "Data Science",
    bidang: "sains",
    description: "Mengolah data menjadi keputusan yang bernilai.",
    about: [
      "Data Science mengajarkan kamu mengubah data mentah menjadi keputusan yang bernilai. Di era kecerdasan buatan, kemampuan ini dibutuhkan di hampir semua industri.",
      "Jurusan ini ideal untuk kamu yang menyukai angka, pola, dan senang menceritakan data menjadi wawasan yang mudah dipahami.",
    ],
    topics: ["Statistika", "Machine Learning", "Python & R", "Visualisasi Data", "Deep Learning", "Big Data"],
    careers: [
      c("Data Scientist", "Membangun model dari data", "chart"),
      c("Machine Learning Engineer", "Menerapkan model ke produk", "sparkles"),
      c("Data Analyst", "Mengolah data jadi keputusan", "chart"),
      c("AI Researcher", "Meneliti metode kecerdasan buatan", "sparkles"),
      c("Business Intelligence", "Menyusun dasbor dan laporan data", "monitor"),
    ],
    supportingSubjects: ["Matematika", "Informatika", "Ekonomi"],
    similar: ["statistika", "sistem-informasi", "informatika"],
    // Seed backend memakai dua penulisan nama prodi ini.
    ptn: { search: "Data", names: ["Sains Data & Data Science", "Data Science & Sains Data"] },
  }),
  jurusan({
    slug: "statistika",
    name: "Statistika",
    bidang: "sains",
    description: "Mempelajari cara mengumpulkan, menganalisis, dan menafsirkan data untuk mengambil kesimpulan.",
    similar: ["data-science", "komputasi-statistik"],
    ptn: { search: "Statistika", names: ["Statistika"] },
  }),

  // ── Kesehatan ─────────────────────────────────────────────────────────────
  jurusan({
    slug: "kedokteran",
    name: "Kedokteran",
    bidang: "kesehatan",
    degree: "S1 + Profesi",
    description:
      "Jurusan Kedokteran mempelajari tubuh manusia, penyakit, serta cara mendiagnosis, mengobati, dan mencegahnya, termasuk praktik klinis di rumah sakit.",
    about: [
      "Kedokteran adalah panggilan untuk menyembuhkan dan menolong sesama. Program studi ini membutuhkan dedikasi tinggi dan membentuk tenaga kesehatan yang kompeten serta berempati.",
      "Jurusan ini membutuhkan kombinasi kemampuan akademik, empati, dan ketahanan mental yang kuat.",
    ],
    topics: ["Anatomi", "Farmakologi", "Patologi", "Fisiologi", "Neurologi", "Keterampilan Klinis"],
    careers: [
      c("Dokter Umum", "Memberikan layanan kesehatan dasar", "user"),
      c("Dokter Spesialis", "Mendalami satu bidang kedokteran", "user"),
      c("Peneliti Medis", "Meneliti penyakit dan pengobatan", "sparkles"),
      c("Konsultan Kesehatan", "Memberi saran untuk layanan kesehatan", "briefcase"),
    ],
    supportingSubjects: ["Biologi", "Kimia", "Fisika", "Matematika"],
    similar: ["farmasi", "ilmu-gizi", "kedokteran-gigi"],
    ptn: { search: "Kedokteran", names: ["Kedokteran (Pendidikan Dokter)"] },
  }),
  jurusan({
    slug: "kedokteran-gigi",
    name: "Kedokteran Gigi",
    bidang: "kesehatan",
    degree: "S1 + Profesi",
    description: "Merawat kesehatan gigi dan mulut untuk kualitas hidup lebih baik.",
    similar: ["kedokteran", "keperawatan"],
    ptn: { search: "Kedokteran Gigi" },
  }),
  jurusan({
    slug: "farmasi",
    name: "Farmasi",
    bidang: "kesehatan",
    description: "Mengembangkan dan memastikan keamanan penggunaan obat-obatan.",
    similar: ["kedokteran", "teknik-kimia"],
    ptn: { search: "Farmasi", names: ["Farmasi"] },
  }),
  jurusan({
    slug: "keperawatan",
    name: "Keperawatan",
    bidang: "kesehatan",
    description: "Memberikan perawatan profesional kepada pasien dengan empati.",
    similar: ["kedokteran", "ilmu-gizi"],
  }),
  jurusan({
    slug: "ilmu-gizi",
    name: "Ilmu Gizi",
    bidang: "kesehatan",
    description: "Mengoptimalkan kesehatan masyarakat melalui ilmu nutrisi.",
    similar: ["keperawatan", "farmasi"],
  }),

  // ── Teknik & Industri ─────────────────────────────────────────────────────
  jurusan({
    slug: "teknik-sipil",
    name: "Teknik Sipil",
    bidang: "teknik",
    description:
      "Jurusan Teknik Sipil mempelajari perancangan dan pembangunan infrastruktur seperti gedung, jembatan, jalan, dan sistem pengairan.",
    similar: ["arsitektur", "teknik-industri"],
    ptn: { search: "Teknik Sipil", names: ["Teknik Sipil"] },
  }),
  jurusan({
    slug: "teknik-mesin",
    name: "Teknik Mesin",
    bidang: "teknik",
    description: "Merancang mesin dan sistem mekanik untuk berbagai industri.",
    similar: ["teknik-industri", "teknik-elektro"],
  }),
  jurusan({
    slug: "teknik-elektro",
    name: "Teknik Elektro",
    bidang: "teknik",
    description: "Mengembangkan sistem kelistrikan, elektronika, dan otomasi.",
    similar: ["teknik-komputer", "teknik-mesin"],
    ptn: { search: "Teknik Elektro", names: ["Teknik Elektro"] },
  }),
  jurusan({
    slug: "teknik-kimia",
    name: "Teknik Kimia",
    bidang: "teknik",
    description: "Merancang proses produksi bahan kimia dan material industri.",
    similar: ["teknik-industri", "farmasi"],
  }),
  jurusan({
    slug: "teknik-industri",
    name: "Teknik Industri",
    bidang: "teknik",
    description: "Mengoptimalkan sistem produksi dan operasional di dunia industri.",
    similar: ["teknik-mesin", "manajemen"],
    ptn: { search: "Teknik Industri", names: ["Teknik Industri"] },
  }),

  // ── Ekonomi & Bisnis ──────────────────────────────────────────────────────
  jurusan({
    slug: "manajemen",
    name: "Manajemen",
    bidang: "ekonomi",
    description:
      "Jurusan Manajemen mempelajari cara mengelola organisasi dan bisnis, mulai dari pemasaran, keuangan, sumber daya manusia, sampai strategi.",
    similar: ["akuntansi", "bisnis-internasional", "ilmu-ekonomi"],
    ptn: { search: "Manajemen", names: ["Manajemen"] },
  }),
  jurusan({
    slug: "akuntansi",
    name: "Akuntansi",
    bidang: "ekonomi",
    description: "Mencatat dan menganalisis informasi keuangan organisasi.",
    similar: ["manajemen", "akuntansi-sektor-publik"],
    ptn: { search: "Akuntansi", names: ["Akuntansi"] },
  }),
  jurusan({
    slug: "ilmu-ekonomi",
    name: "Ilmu Ekonomi",
    bidang: "ekonomi",
    description: "Memahami mekanisme pasar, kebijakan, dan perilaku ekonomi.",
    similar: ["manajemen", "akuntansi"],
  }),
  jurusan({
    slug: "bisnis-internasional",
    name: "Bisnis Internasional",
    bidang: "ekonomi",
    description: "Mengelola strategi bisnis di pasar global yang kompetitif.",
    similar: ["manajemen", "hubungan-internasional"],
  }),

  // ── Hukum ─────────────────────────────────────────────────────────────────
  jurusan({
    slug: "ilmu-hukum",
    name: "Ilmu Hukum",
    bidang: "hukum",
    description:
      "Jurusan Ilmu Hukum mengkaji aturan, keadilan, dan cara hukum bekerja di tengah masyarakat, dari hukum pidana sampai hukum bisnis.",
    about: [
      "Ilmu Hukum mempersiapkanmu memahami sistem hukum, keadilan, dan regulasi yang mengatur kehidupan bermasyarakat dan bernegara.",
      "Jurusan ini cocok untuk kamu yang punya kemampuan argumentasi kuat, berpikir kritis, dan peduli pada keadilan sosial.",
    ],
    topics: ["Hukum Perdata", "Hukum Pidana", "Hukum Internasional", "Hukum Bisnis", "Hukum Tata Negara", "Mediasi"],
    careers: [
      c("Advokat", "Mendampingi klien di dalam dan luar pengadilan", "briefcase"),
      c("Hakim", "Memutus perkara di pengadilan", "shield"),
      c("Notaris", "Membuat akta otentik (setelah pendidikan lanjutan)", "user"),
      c("Legal Consultant", "Memberi nasihat hukum untuk bisnis", "briefcase"),
      c("Diplomat", "Mewakili kepentingan negara di luar negeri", "user"),
    ],
    supportingSubjects: ["Bahasa Indonesia", "Bahasa Inggris", "PPKn", "Sejarah"],
    similar: ["hukum-bisnis", "hubungan-internasional"],
    ptn: { search: "Hukum", names: ["Ilmu Hukum"] },
  }),
  jurusan({
    slug: "hukum-bisnis",
    name: "Hukum Bisnis",
    bidang: "hukum",
    description: "Menguasai regulasi dan perjanjian di dunia bisnis dan korporasi.",
    similar: ["ilmu-hukum", "manajemen"],
  }),

  // ── Sosial & Humaniora ────────────────────────────────────────────────────
  jurusan({
    slug: "psikologi",
    name: "Psikologi",
    bidang: "sosial",
    description:
      "Jurusan Psikologi mempelajari cara manusia berpikir, merasa, dan berperilaku, serta bagaimana membantu orang lain menghadapi masalahnya.",
    similar: ["ilmu-komunikasi", "sosiologi"],
    ptn: { search: "Psikologi", names: ["Psikologi"] },
  }),
  jurusan({
    slug: "ilmu-komunikasi",
    name: "Ilmu Komunikasi",
    bidang: "sosial",
    description: "Mengembangkan strategi komunikasi efektif di berbagai media.",
    similar: ["psikologi", "desain-komunikasi-visual"],
    ptn: { search: "Komunikasi", names: ["Ilmu Komunikasi"] },
  }),
  jurusan({
    slug: "hubungan-internasional",
    name: "Hubungan Internasional",
    bidang: "sosial",
    description: "Menganalisis diplomasi, kebijakan luar negeri, dan isu global.",
    similar: ["ilmu-hukum", "sosiologi"],
    ptn: { search: "Hubungan Internasional" },
  }),
  jurusan({
    slug: "sosiologi",
    name: "Sosiologi",
    bidang: "sosial",
    description: "Mengkaji fenomena sosial, budaya, dan perubahan masyarakat.",
    similar: ["psikologi", "hubungan-internasional"],
  }),

  // ── Pendidikan ────────────────────────────────────────────────────────────
  jurusan({
    slug: "pendidikan-matematika",
    name: "Pendidikan Matematika",
    bidang: "pendidikan",
    rumpun: "Saintek",
    description: "Mempersiapkan guru Matematika yang profesional dan inovatif.",
    similar: ["pendidikan-biologi", "pgsd"],
  }),
  jurusan({
    slug: "pendidikan-bahasa-inggris",
    name: "Pendidikan Bahasa Inggris",
    bidang: "pendidikan",
    description: "Mencetak pendidik bahasa Inggris yang komunikatif dan kompeten.",
    similar: ["pendidikan-ips", "pgsd"],
  }),
  jurusan({
    slug: "pendidikan-biologi",
    name: "Pendidikan Biologi",
    bidang: "pendidikan",
    rumpun: "Saintek",
    description: "Membekali calon guru Biologi dengan ilmu dan metode terbaik.",
    similar: ["pendidikan-matematika", "pgsd"],
  }),
  jurusan({
    slug: "pgsd",
    name: "PGSD",
    bidang: "pendidikan",
    description: "Mendidik guru SD yang kreatif, sabar, dan berdedikasi.",
    similar: ["pendidikan-matematika", "pendidikan-ips"],
  }),
  jurusan({
    slug: "pendidikan-ips",
    name: "Pendidikan IPS",
    bidang: "pendidikan",
    description: "Menyiapkan pendidik yang membangun kesadaran sosial siswa.",
    similar: ["pgsd", "sosiologi"],
  }),

  // ── Desain & Seni ─────────────────────────────────────────────────────────
  jurusan({
    slug: "desain-komunikasi-visual",
    name: "Desain Komunikasi Visual",
    bidang: "desain",
    description:
      "Jurusan DKV mempelajari cara menyampaikan pesan lewat visual, seperti ilustrasi, tipografi, branding, fotografi, dan desain digital.",
    about: [
      "DKV membekali kamu dengan kemampuan merancang komunikasi visual yang efektif, dari identitas merek, ilustrasi, dan motion graphics, sampai kampanye digital yang mampu menggerakkan audiens.",
      "Jurusan ini cocok untuk kamu yang punya selera estetika, senang bercerita lewat visual, dan mengikuti perkembangan desain.",
    ],
    topics: ["Desain Grafis", "UI/UX Digital", "Motion Graphics", "Fotografi", "Branding", "Ilustrasi"],
    careers: [
      c("Graphic Designer", "Merancang materi visual", "monitor"),
      c("UI/UX Designer", "Merancang tampilan yang mudah dipakai", "monitor"),
      c("Creative Director", "Memimpin arah kreatif sebuah tim", "user"),
      c("Motion Designer", "Membuat animasi dan video grafis", "sparkles"),
      c("Brand Strategist", "Membangun citra merek", "briefcase"),
    ],
    supportingSubjects: ["Seni Budaya", "Bahasa Indonesia", "Informatika", "Bahasa Inggris"],
    similar: ["arsitektur", "film-dan-televisi", "ilmu-komunikasi"],
    ptn: { search: "Desain Komunikasi Visual" },
  }),
  jurusan({
    slug: "arsitektur",
    name: "Arsitektur",
    bidang: "desain",
    rumpun: "Saintek",
    description: "Merancang bangunan yang fungsional, estetis, dan berkelanjutan.",
    similar: ["teknik-sipil", "desain-komunikasi-visual"],
  }),
  jurusan({
    slug: "seni-musik",
    name: "Seni Musik",
    bidang: "desain",
    description: "Mengembangkan kemampuan bermusik dan apresiasi seni secara mendalam.",
    similar: ["film-dan-televisi"],
  }),
  jurusan({
    slug: "film-dan-televisi",
    name: "Film dan Televisi",
    bidang: "desain",
    description: "Memproduksi karya audiovisual yang kreatif dan bermakna.",
    similar: ["desain-komunikasi-visual", "ilmu-komunikasi"],
  }),

  // ── Pertanian ─────────────────────────────────────────────────────────────
  jurusan({
    slug: "agroteknologi",
    name: "Agroteknologi",
    bidang: "pertanian",
    description: "Mengembangkan teknologi pertanian untuk ketahanan pangan.",
    similar: ["agribisnis", "peternakan"],
  }),
  jurusan({
    slug: "agribisnis",
    name: "Agribisnis",
    bidang: "pertanian",
    description: "Mengelola usaha pertanian secara modern dan menguntungkan.",
    similar: ["agroteknologi", "manajemen"],
  }),
  jurusan({
    slug: "peternakan",
    name: "Peternakan",
    bidang: "pertanian",
    description: "Mengembangkan teknologi budidaya ternak yang berkelanjutan.",
    similar: ["agroteknologi", "perikanan"],
  }),
  jurusan({
    slug: "perikanan",
    name: "Perikanan",
    bidang: "pertanian",
    description: "Mengelola sumber daya perairan dan industri kelautan.",
    similar: ["peternakan", "agroteknologi"],
  }),

  // ── Kedinasan ─────────────────────────────────────────────────────────────
  jurusan({
    slug: "akuntansi-sektor-publik",
    name: "Akuntansi Sektor Publik",
    bidang: "kedinasan",
    description:
      "Jurusan ini mempelajari pengelolaan keuangan negara dan pelaporannya, dengan ikatan dinas sebagai aparatur setelah lulus.",
    about: [
      "Program ini ada di PKN STAN, sekolah kedinasan di bawah Kementerian Keuangan yang mendidik aparatur pengelola keuangan negara.",
      "Cocok untuk kamu yang punya kemampuan numerik dan analitik yang baik, serta berkomitmen tinggi pada integritas.",
    ],
    careers: [
      c("Direktorat Jenderal Pajak", "Kementerian Keuangan", "briefcase"),
      c("Direktorat Jenderal Bea dan Cukai", "Kementerian Keuangan", "shield"),
      c("Direktorat Jenderal Perbendaharaan", "Kementerian Keuangan", "chart"),
      c("Badan Pemeriksa Keuangan", "Lembaga negara", "user"),
    ],
    supportingSubjects: ["Matematika", "Ekonomi", "Bahasa Inggris"],
    similar: ["akuntansi", "komputasi-statistik", "tata-pemerintahan"],
    ptn: { search: "Akuntansi Sektor Publik" },
  }),
  jurusan({
    slug: "komputasi-statistik",
    name: "Komputasi Statistik",
    bidang: "kedinasan",
    description: "Mendidik ahli statistik dan data untuk kebutuhan data nasional, dengan ikatan dinas di Badan Pusat Statistik.",
    about: [
      "Program ini ada di Politeknik Statistika STIS, sekolah kedinasan di bawah Badan Pusat Statistik (BPS).",
      "Cocok untuk kamu yang menyukai angka, statistika, dan analisis data.",
    ],
    careers: [
      c("Statistisi", "Badan Pusat Statistik", "chart"),
      c("Analis Data", "Kementerian dan lembaga", "chart"),
      c("Peneliti Statistik", "Lembaga riset pemerintah", "sparkles"),
    ],
    supportingSubjects: ["Matematika", "Informatika", "Bahasa Inggris"],
    similar: ["statistika", "data-science", "akuntansi-sektor-publik"],
    ptn: { search: "Komputasi Statistik" },
  }),
  jurusan({
    slug: "tata-pemerintahan",
    name: "Tata Pemerintahan",
    bidang: "kedinasan",
    description: "Mencetak aparatur pemerintahan daerah yang kompeten dan berintegritas.",
    about: ["Program ini ada di Institut Pemerintahan Dalam Negeri (IPDN), sekolah kedinasan di bawah Kementerian Dalam Negeri."],
    similar: ["akuntansi-sektor-publik", "ilmu-hukum"],
    ptn: { search: "Tata Pemerintahan" },
  }),
  jurusan({
    slug: "meteorologi",
    name: "Meteorologi",
    bidang: "kedinasan",
    description: "Mempersiapkan ahli cuaca, iklim, dan geofisika untuk BMKG.",
    about: [
      "Program ini ada di Sekolah Tinggi Meteorologi Klimatologi dan Geofisika (STMKG) di bawah BMKG. Lulusannya berperan dalam prakiraan cuaca dan peringatan dini bencana.",
    ],
    careers: [
      c("Prakirawan Cuaca", "BMKG", "sparkles"),
      c("Analis Gempa Bumi", "BMKG", "chart"),
      c("Peneliti Geofisika", "Lembaga riset", "sparkles"),
    ],
    supportingSubjects: ["Fisika", "Matematika", "Geografi"],
    similar: ["komputasi-statistik"],
  }),
];

/** Urutan jurusan unggulan di carousel beranda (sesuai desain). */
export const FEATURED_SLUGS = [
  "informatika",
  "kedokteran",
  "psikologi",
  "ilmu-hukum",
  "manajemen",
  "teknik-sipil",
  "desain-komunikasi-visual",
  "akuntansi-sektor-publik",
];
