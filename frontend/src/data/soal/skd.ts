import type { BankQuestion } from "@/types/soal";

// Sementara, dipakai juga di mode backend sampai endpoint bank soal (API_CONTRACT 12.5) ada.
//
// CONTOH SOAL SKD, 5 soal per tes. Bukan bank soal resmi.
// TWK dan TIU: satu jawaban benar. TKP: setiap pilihan bernilai 1–5 poin
// (seperti SKD asli); `answer` = pilihan dengan poin 5.

const q = (id: string, subject: string, text: string, options: string[], answer: number, explanation: string, points?: number[]): BankQuestion => ({
  id: `skd-${id}`,
  exam: "skd",
  subject,
  text,
  options,
  answer,
  explanation,
  ...(points ? { points } : {}),
});

export const SKD_BANK: BankQuestion[] = [
  // ── TWK ──
  q("twk-1", "TWK", "Rumusan Pancasila sebagai dasar negara tercantum dalam …", [
    "Batang Tubuh UUD 1945 Pasal 1",
    "Pembukaan UUD 1945 alinea keempat",
    "Pembukaan UUD 1945 alinea pertama",
    "Ketetapan MPR",
    "Piagam Jakarta yang berlaku sekarang",
  ], 1, "Kelima sila Pancasila tercantum dalam alinea keempat Pembukaan UUD 1945."),
  q("twk-2", "TWK", "Semboyan Bhinneka Tunggal Ika tertulis pada …", ["bendera Merah Putih", "naskah Proklamasi", "teks Sumpah Pemuda", "Pembukaan UUD 1945", "pita yang dicengkeram Garuda Pancasila"], 4,
    "Semboyan Bhinneka Tunggal Ika tertulis pada pita yang dicengkeram burung Garuda dalam lambang negara Garuda Pancasila."),
  q("twk-3", "TWK", "Sumpah Pemuda diikrarkan pada tanggal …", ["20 Mei 1908", "17 Agustus 1945", "28 Oktober 1928", "1 Juni 1945", "10 November 1945"], 2,
    "Sumpah Pemuda diikrarkan pada Kongres Pemuda II, 28 Oktober 1928."),
  q("twk-4", "TWK", "Lembaga negara yang berwenang mengubah dan menetapkan Undang-Undang Dasar adalah …", ["MPR", "DPR", "Presiden", "Mahkamah Konstitusi", "DPD"], 0,
    "Menurut Pasal 3 ayat (1) UUD 1945, MPR berwenang mengubah dan menetapkan Undang-Undang Dasar."),
  q("twk-5", "TWK", "Bunyi sila ketiga Pancasila adalah …", ["Ketuhanan Yang Maha Esa", "Kemanusiaan yang adil dan beradab", "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan", "Persatuan Indonesia", "Keadilan sosial bagi seluruh rakyat Indonesia"], 3,
    "Sila ketiga Pancasila berbunyi \"Persatuan Indonesia\"."),

  // ── TIU ──
  q("tiu-1", "TIU", "DOKTER : RUMAH SAKIT = GURU : …", ["murid", "buku", "sekolah", "pelajaran", "kapur"], 2,
    "Dokter bekerja di rumah sakit. Hubungan yang sama: guru bekerja di sekolah."),
  q("tiu-2", "TIU", "Bilangan berikutnya dari deret 2, 4, 8, 16, … adalah …", ["18", "24", "30", "32", "20"], 3, "Setiap suku dikali 2, jadi suku berikutnya 16 × 2 = 32."),
  q("tiu-3", "TIU", "15% dari 200 adalah …", ["30", "15", "20", "25", "35"], 0, "15% × 200 = 15/100 × 200 = 30."),
  q("tiu-4", "TIU", "Semua pegawai wajib mengikuti apel pagi. Andi adalah pegawai. Simpulan yang tepat adalah …", [
    "Andi tidak wajib mengikuti apel pagi.",
    "Andi wajib mengikuti apel pagi.",
    "Sebagian pegawai tidak mengikuti apel pagi.",
    "Andi kadang mengikuti apel pagi.",
    "Tidak dapat disimpulkan.",
  ], 1, "Andi termasuk semua pegawai, dan semua pegawai wajib mengikuti apel pagi. Jadi Andi wajib mengikuti apel pagi."),
  q("tiu-5", "TIU", "Sinonim kata imitasi adalah …", ["asli", "mahal", "langka", "baru", "tiruan"], 4, "Imitasi berarti tiruan atau barang yang meniru aslinya."),

  // ── TKP (poin 1–5 per pilihan) ──
  q("tkp-1", "TKP", "Rekan kerja meminta bantuan menyelesaikan tugasnya, padahal pekerjaan Anda sendiri hampir mencapai tenggat. Sikap Anda adalah …", [
    "Menolak karena itu bukan urusan saya.",
    "Menyuruhnya meminta bantuan atasan.",
    "Membantu sambil mengeluh soal pekerjaan saya.",
    "Langsung membantu dan menunda pekerjaan saya sendiri.",
    "Menyelesaikan pekerjaan saya dulu, lalu membantunya dan memberi tahu kapan saya bisa.",
  ], 4, "Pilihan terbaik tetap bertanggung jawab pada tugas sendiri sekaligus mau bekerja sama dengan komunikasi yang jelas. Menunda tugas sendiri berisiko melewati tenggat.", [1, 2, 3, 4, 5]),
  q("tkp-2", "TKP", "Seorang warga datang dengan marah karena antrean layanan sangat lama. Sikap Anda sebagai petugas adalah …", [
    "Mendengarkan dengan tenang, meminta maaf, menjelaskan penyebabnya, lalu membantu prosesnya.",
    "Meminta warga itu menunggu tanpa penjelasan.",
    "Menegur warga karena tidak sopan.",
    "Memanggil petugas keamanan.",
    "Mendahulukan warga itu agar tidak marah lagi.",
  ], 0, "Pelayanan publik yang baik tetap tenang, empatik, memberi penjelasan, dan membantu tanpa melanggar urutan antrean warga lain.", [5, 2, 1, 3, 4]),
  q("tkp-3", "TKP", "Kantor Anda mulai memakai aplikasi baru yang belum Anda kuasai. Sikap Anda adalah …", [
    "Tetap memakai cara lama selama masih bisa.",
    "Menunggu pelatihan resmi tanpa mencoba.",
    "Mempelajarinya, lalu berbagi cara pakai dengan rekan yang kesulitan.",
    "Meminta rekan mengerjakan bagian yang memakai aplikasi itu.",
    "Mencoba sedikit, lalu menyerah jika sulit.",
  ], 2, "Sikap terbaik adalah mau belajar teknologi baru dan membantu tim beradaptasi.", [1, 3, 5, 2, 4]),
  q("tkp-4", "TKP", "Anda menyadari ada kesalahan dalam laporan yang sudah Anda kirim dan berdampak pada pekerjaan tim. Sikap Anda adalah …", [
    "Diam saja karena belum ada yang menyadari.",
    "Menyalahkan data dari rekan.",
    "Memperbaikinya diam-diam tanpa memberi tahu.",
    "Mengakui kesalahan, memberi tahu tim, dan segera memperbaikinya.",
    "Menunggu atasan menegur dulu.",
  ], 3, "Integritas berarti jujur mengakui kesalahan, mengomunikasikannya, dan bertanggung jawab memperbaikinya.", [1, 2, 4, 5, 3]),
  q("tkp-5", "TKP", "Anda ditempatkan bertugas di daerah terpencil yang jauh dari keluarga. Sikap Anda adalah …", [
    "Menolak penempatan.",
    "Menerima dengan berat hati dan segera minta pindah.",
    "Menerima, beradaptasi dengan lingkungan baru, dan bekerja sebaik mungkin.",
    "Menerima tetapi bekerja seadanya.",
    "Meminta waktu menunda keberangkatan.",
  ], 2, "Abdi negara siap ditempatkan di mana saja, beradaptasi, dan tetap bekerja optimal.", [1, 3, 5, 2, 4]),
];
