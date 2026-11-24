import { BRAND, CONTACT } from "@/config/brand";
import { ACCOUNT_ACCESS } from "./common";

// Teks halaman FAQ (/faq), mengikuti desain docs/design/publik/FAQ-Desktop.jpg.
// Jawaban hanya berisi hal yang benar-benar ada di produk; ubah di sini, bukan di komponen.

const B = BRAND.name;
const HI = BRAND.audience;

export const FAQ_PAGE_TITLE = "FAQ";

export const FAQ_HERO = {
  title: "Temukan Jawabanmu di Sini",
  body: `Pelajari lebih lanjut bagaimana ${B} bekerja untuk membantumu menggapai impian.`,
};

/** Ikon kategori (nama dipetakan ke ikon lucide di komponen). */
export type FaqIcon = "info" | "rocket" | "graduation" | "list" | "school";

export interface FaqCategory {
  id: string;
  title: string;
  /** Keterangan kecil di kartu kategori. */
  hint: string;
  icon: FaqIcon;
  items: { q: string; a: string }[];
}

export const FAQ_LIST = {
  categoriesLabel: "Kategori pertanyaan",
  categories: [
    {
      id: "tentang",
      title: `Tentang ${B}`,
      hint: "Konsep & tujuan",
      icon: "info",
      items: [
        { q: `Apa itu ${B}?`, a: `${B} adalah platform pendampingan perencanaan pendidikan bagi siswa SMA untuk membantu mengenali potensi, menemukan arah pendidikan, mengeksplorasi pilihan, dan menentukan langkah berikutnya.` },
        { q: `Siapa yang bisa menggunakan ${B}?`, a: `${B} ditujukan untuk siswa SMA kelas X–XII, serta mendukung Guru BK, Wali Kelas, dan sekolah dalam proses pendampingan pendidikan.` },
        { q: `Bagaimana ${B} memberikan rekomendasi pendidikan?`, a: "Rekomendasi disusun berdasarkan informasi dalam profil siswa, seperti data akademik, prestasi, minat dan bakat, serta refleksi diri. Setiap rekomendasi dilengkapi alasan agar siswa memahami dasar pilihannya." },
        { q: "Apakah data siswa aman?", a: `Data siswa hanya dipakai untuk fitur ${B}, seperti rekomendasi jurusan dan rencana belajar. Pengamanannya terus disiapkan bersama tim sebelum ${B} dipakai secara luas.` },
      ],
    },
    {
      id: "cara",
      title: "Cara Menggunakan",
      hint: "Langkah demi langkah",
      icon: "rocket",
      items: [
        { q: `Bagaimana cara mendapatkan akun ${B}?`, a: `${ACCOUNT_ACCESS.full} Tidak ada pendaftaran mandiri, jadi akunmu disiapkan oleh tim ${B}.` },
        { q: "Apa yang perlu dilakukan setelah pertama kali masuk?", a: "Saat pertama kali masuk, kamu diminta mengganti password awal. Setelah itu, lengkapi profilmu (nilai rapor dan prestasi), lalu kerjakan tes Analisis Potensi supaya rekomendasimu bisa disusun." },
        { q: `Apakah ${B} bisa dibuka lewat HP?`, a: `Bisa. ${B} dibuka lewat browser, jadi bisa dipakai di HP, tablet, maupun laptop tanpa perlu memasang aplikasi.` },
        { q: "Aku lupa password, harus bagaimana?", a: `Pilih "Lupa password?" di halaman Masuk untuk menghubungi tim ${B} lewat WhatsApp. Tim akan membantu mengatur ulang password akunmu.` },
      ],
    },
    {
      id: "jurusan",
      title: "Jurusan & Kampus",
      hint: "Sistem rekomendasi",
      icon: "graduation",
      items: [
        { q: `Apakah ${B} menentukan satu jurusan terbaik untuk saya?`, a: `Tidak. ${BRAND.compassName} membantu menemukan beberapa pilihan yang sesuai dengan profilmu untuk kemudian kamu eksplorasi dan pertimbangkan.` },
        { q: "Pilihan pendidikan apa saja yang bisa dieksplorasi?", a: "Berbagai program studi dan jalur pendidikan, seperti PTN, PTS, Kedinasan, dan PTLN, sesuai dengan pilihan dan kebutuhanmu." },
        { q: "Bisakah aku melihat daftar jurusan tanpa akun?", a: `Bisa. Halaman Eksplor Jurusan terbuka untuk siapa saja. Rekomendasi pribadi dari ${BRAND.compassName} baru bisa dipakai setelah kamu masuk dengan akun ${B}.` },
      ],
    },
    {
      id: "action-plan",
      title: "Action Plan",
      hint: "Misi & persiapan",
      icon: "list",
      items: [
        { q: "Apa itu Action Plan?", a: "Action Plan membantu mengubah tujuan pendidikanmu menjadi langkah yang lebih konkret, mulai dari menentukan prioritas, membuat tugas, hingga memantau progres." },
        { q: `Apakah ${B} juga membantu persiapan seleksi?`, a: `Ya. ${B} membantumu memahami apa yang perlu disiapkan untuk jalur seleksi yang relevan, seperti SNBP, SNBT, TKA, SKD, dan jalur lainnya sesuai ketentuan yang berlaku.` },
        { q: "Apakah ada latihan soal?", a: "Ada. Di bagian persiapan ujian kamu bisa mengerjakan latihan soal dan tryout. Kunci jawaban dan pembahasan baru muncul setelah jawabanmu dikirim." },
      ],
    },
    {
      id: "sekolah",
      title: "Untuk Sekolah",
      hint: "Guru BK & Wali Kelas",
      icon: "school",
      items: [
        { q: `Bagaimana sekolah bisa menggunakan ${B}?`, a: `Sekolah dapat menggunakan ${B} sebagai bagian dari pendampingan pendidikan siswa. Guru BK dan Wali Kelas memperoleh informasi yang lebih terarah untuk memahami dan mendampingi perjalanan siswa.` },
        { q: `Bagaimana cara sekolah bergabung dengan ${B}?`, a: `Sekolah dapat menghubungi tim ${B} untuk mendapatkan informasi mengenai proses kerja sama, implementasi, dan penggunaan platform di sekolah.` },
      ],
    },
  ] satisfies FaqCategory[],
};

export type KontakIcon = "mail" | "instagram" | "lokasi";

export const FAQ_KONTAK = {
  badge: "Hubungi Kami",
  title: "Punya pertanyaan, ide, atau ingin berkolaborasi?",
  body: `Kami ingin mendengar darimu. Baik sekolah yang ingin menghadirkan ${B}, calon partner, maupun ${HI} yang ingin berbagi cerita, jangan ragu untuk menghubungi kami.`,
  resmi: {
    title: "Kontak Resmi",
    body: "Hubungi kanal resmi kami atau terhubung lewat media sosial.",
    items: [
      { icon: "mail", label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { icon: "instagram", label: "Instagram", value: CONTACT.instagram.handle, href: CONTACT.instagram.url },
      { icon: "lokasi", label: "Lokasi", value: BRAND.location, href: null },
    ] satisfies { icon: KontakIcon; label: string; value: string; href: string | null }[],
    note: "Untuk jawaban tercepat, kirim pesan lewat form di samping. Pesanmu langsung masuk ke WhatsApp tim kami.",
  },
  form: {
    title: "Kirim Pesan Langsung",
    body: "Isi identitasmu supaya pesanmu bisa langsung diarahkan ke tim yang tepat.",
    nama: "Nama Lengkap",
    namaPlaceholder: "Contoh: Sarah Anindya",
    email: "Email Aktif (opsional)",
    emailPlaceholder: "nama@sekolah.sch.id",
    peran: "Saya adalah:",
    peranOptions: ["Sekolah", "Guru BK", "Wali Kelas", "Partner", `Siswa / ${HI}`, "Lainnya"],
    pesan: "Pesan",
    pesanPlaceholder: "Ceritakan pertanyaan, kebutuhan sekolah, atau ide kolaborasimu...",
    kirim: "Kirim lewat WhatsApp",
    /** Belum ada endpoint pesan, jadi form dikirim lewat WhatsApp (SPEK Fase 10). */
    hint: "Tombol ini membuka WhatsApp dengan pesan yang sudah terisi. Kamu tinggal menekan kirim.",
    wajib: "Nama dan pesan wajib diisi.",
    emailSalah: "Format email belum benar.",
  },
};

/** Isi pesan WhatsApp dari form "Kirim Pesan Langsung". */
export function faqWhatsappMessage(d: { nama: string; email: string; peran: string; pesan: string }): string {
  const lines = [`Halo tim ${B}, saya ${d.nama.trim()} (${d.peran}).`];
  if (d.email.trim()) lines.push(`Email: ${d.email.trim()}`);
  lines.push("", d.pesan.trim());
  return lines.join("\n");
}
