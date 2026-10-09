import type { BankQuestion } from "@/types/soal";

// Sementara, dipakai juga di mode backend sampai endpoint bank soal (API_CONTRACT 12.5) ada.
//
// CONTOH SOAL SNBT, 5 soal per subtes. Bukan bank soal resmi (menunggu tim
// data). Semua paket tryout contoh memakai soal yang sama.
// answer = indeks pilihan benar (0 = A).

const q = (id: string, subject: string, text: string, options: string[], answer: number, explanation: string, passage?: string): BankQuestion => ({
  id: `snbt-${id}`,
  exam: "snbt",
  subject,
  text,
  options,
  answer,
  explanation,
  ...(passage ? { passage } : {}),
});

const RTH =
  "Di banyak kota, luas ruang terbuka hijau (RTH) masih di bawah 30 persen dari luas wilayah, padahal undang-undang mensyaratkan angka tersebut. RTH berfungsi menyerap air hujan, menurunkan suhu udara, dan menjadi tempat warga berinteraksi. Kurangnya RTH membuat banjir lebih sering terjadi dan udara kota terasa lebih panas.";
const RINA =
  "Rina selalu membawa botol minum sendiri ke sekolah. Ia juga menolak sedotan plastik setiap kali membeli minuman. Menurutnya, kebiasaan kecil yang dilakukan banyak orang akan berdampak besar bagi lingkungan.";
const STUDY =
  "Many students find it hard to focus when studying at home. Experts suggest creating a dedicated study area, turning off phone notifications, and taking a short break every 25 minutes. These simple habits can improve concentration and help students remember more of what they learn.";

export const SNBT_BANK: BankQuestion[] = [
  // ── Penalaran Umum ──
  q("pu-1", "PU", "Semua peserta lomba mendapat sertifikat. Sebagian peserta lomba adalah siswa kelas XII. Simpulan yang pasti benar adalah …", [
    "Semua siswa kelas XII mendapat sertifikat.",
    "Sebagian siswa kelas XII mendapat sertifikat.",
    "Semua yang mendapat sertifikat adalah peserta lomba.",
    "Sebagian peserta lomba tidak mendapat sertifikat.",
    "Tidak ada siswa kelas XII yang mendapat sertifikat.",
  ], 1, "Siswa kelas XII yang ikut lomba termasuk peserta, dan semua peserta mendapat sertifikat. Jadi pasti ada (sebagian) siswa kelas XII yang mendapat sertifikat. Pilihan A salah karena tidak semua siswa kelas XII ikut lomba, dan pilihan C tidak bisa disimpulkan karena bisa saja bukan peserta juga mendapat sertifikat."),
  q("pu-2", "PU", "Bilangan berikutnya dari pola 3, 6, 11, 18, 27, … adalah …", ["36", "37", "38", "39", "40"], 2,
    "Selisih antarsuku adalah 3, 5, 7, 9, jadi selisih berikutnya 11. Suku berikutnya 27 + 11 = 38."),
  q("pu-3", "PU", "Jika hujan turun, jalan menjadi basah. Ternyata jalan tidak basah. Simpulan yang tepat adalah …", [
    "Tidak dapat disimpulkan.",
    "Hujan turun.",
    "Jalan basah karena hal lain.",
    "Mungkin hujan turun sebentar.",
    "Hujan tidak turun.",
  ], 4, "Pola \"jika p maka q; bukan q\" menghasilkan \"bukan p\" (modus tollens). Karena jalan tidak basah, maka hujan tidak turun."),
  q("pu-4", "PU", "Huruf berikutnya dari pola A, C, F, J, O, … adalah …", ["U", "S", "T", "V", "W"], 0,
    "Urutan huruf A, C, F, J, O berada di posisi 1, 3, 6, 10, 15. Selisihnya 2, 3, 4, 5, jadi berikutnya 15 + 6 = 21, yaitu huruf U."),
  q("pu-5", "PU", "Di sebuah kelas, 18 siswa menyukai matematika, 15 siswa menyukai fisika, 7 siswa menyukai keduanya, dan 4 siswa tidak menyukai keduanya. Berapa jumlah siswa di kelas itu?", ["26", "30", "28", "33", "37"], 1,
    "Siswa yang menyukai minimal satu pelajaran = 18 + 15 − 7 = 26. Ditambah 4 siswa yang tidak menyukai keduanya, jumlahnya 30 siswa."),

  // ── Pengetahuan dan Pemahaman Umum ──
  q("ppu-1", "PPU", "Kata yang paling tepat untuk melengkapi kalimat \"Hasil penelitian itu belum dapat … karena jumlah sampelnya terlalu sedikit\" adalah …", [
    "didramatisasi",
    "dimonopoli",
    "diproklamasikan",
    "digeneralisasikan",
    "dikompensasi",
  ], 3, "Menggeneralisasikan berarti menarik simpulan umum. Sampel yang terlalu sedikit membuat hasil penelitian belum bisa diberlakukan secara umum."),
  q("ppu-2", "PPU", "Sinonim kata efisien adalah …", ["hemat dan tepat guna", "mahal", "lambat", "rumit", "boros"], 0,
    "Efisien berarti tepat dan tidak membuang waktu, tenaga, atau biaya, sehingga padanannya adalah hemat dan tepat guna."),
  q("ppu-3", "PPU", "Antonim kata abstrak adalah …", ["samar", "teoretis", "konkret", "umum", "rumit"], 2,
    "Abstrak berarti tidak berwujud atau tidak dapat diraba. Lawannya adalah konkret, yaitu nyata dan berwujud."),
  q("ppu-4", "PPU", "Kata yang ditulis sesuai kaidah baku adalah …", ["apotik", "praktek", "nasehat", "resiko", "kualitas"], 4,
    "Bentuk baku menurut KBBI: kualitas, apotek, praktik, nasihat, dan risiko."),
  q("ppu-5", "PPU", "Pemerintah menggalakkan gerakan menanam pohon. Kata menggalakkan dalam kalimat tersebut berarti …", [
    "menghentikan",
    "menggiatkan",
    "mengurangi",
    "melarang",
    "menunda",
  ], 1, "Menggalakkan berarti membuat lebih giat atau lebih bersemangat, jadi maknanya menggiatkan."),

  // ── Pemahaman Bacaan dan Menulis ──
  q("pbm-1", "PBM", "Kalimat yang efektif adalah …", [
    "Para siswa-siswa berkumpul di aula.",
    "Bagi siswa-siswa diharap berkumpul di aula.",
    "Kepada para siswa-siswa dimohon berkumpul.",
    "Para siswa berkumpul di aula.",
    "Siswa-siswa para berkumpul di aula.",
  ], 3, "\"Para\" sudah menyatakan jamak, jadi kata \"siswa\" tidak perlu diulang. Kalimat C dan B juga tidak efektif karena diawali kata depan \"bagi/kepada\" sehingga tidak punya subjek."),
  q("pbm-2", "PBM", "Kalimat yang penggunaan tanda bacanya tepat adalah …", [
    "Ibu membeli sayur, buah, dan ikan.",
    "Ibu membeli: sayur, buah, dan ikan.",
    "Ibu membeli sayur buah, dan ikan.",
    "Ibu, membeli sayur, buah dan ikan.",
    "Ibu membeli sayur; buah; dan ikan.",
  ], 0, "Koma dipakai di antara unsur dalam perincian, termasuk sebelum \"dan\". Titik dua tidak dipakai jika perincian merupakan pelengkap yang langsung mengikuti kata kerja."),
  q("pbm-3", "PBM", "Gagasan utama paragraf berikut adalah …\n\n\"Sampah plastik sulit terurai dan dapat bertahan ratusan tahun. Sampah itu mencemari tanah dan laut serta membahayakan hewan. Karena itu, mengurangi penggunaan plastik sekali pakai menjadi langkah penting.\"", [
    "Plastik dapat bertahan ratusan tahun.",
    "Hewan laut terancam oleh sampah.",
    "Tanah tercemar oleh sampah plastik.",
    "Harga plastik sekali pakai murah.",
    "Mengurangi plastik sekali pakai penting karena dampak sampah plastik.",
  ], 4, "Kalimat pertama dan kedua menjelaskan dampak sampah plastik, lalu kalimat terakhir menyimpulkan pentingnya mengurangi plastik sekali pakai. Gagasan utama mencakup keduanya."),
  q("pbm-4", "PBM", "Kata hubung yang tepat untuk kalimat \"Ia sudah belajar keras, … nilainya belum memuaskan\" adalah …", ["sehingga", "karena", "agar", "namun", "jika"], 3,
    "Kedua bagian kalimat berlawanan (sudah belajar keras, tetapi nilai belum memuaskan), jadi dipakai kata hubung pertentangan \"namun\"."),
  q("pbm-5", "PBM", "Kalimat yang penulisan huruf kapitalnya tepat adalah …", [
    "Kami berlibur ke Pulau Bali pada bulan juni.",
    "Kami berlibur ke Pulau Bali pada bulan Juni.",
    "kami berlibur ke Pulau bali pada bulan Juni.",
    "Kami Berlibur ke Pulau Bali pada Bulan Juni.",
    "Kami berlibur ke pulau bali pada bulan juni.",
  ], 1, "Huruf kapital dipakai di awal kalimat, pada nama geografi yang menjadi nama diri (Pulau Bali), dan pada nama bulan (Juni). Kata \"berlibur\" dan \"bulan\" tidak diawali huruf kapital."),

  // ── Pengetahuan Kuantitatif ──
  q("pk-1", "PK", "Jika 3x − 7 = 11, nilai x adalah …", ["4", "5", "7", "6", "8"], 3, "3x = 11 + 7 = 18, sehingga x = 18 ÷ 3 = 6."),
  q("pk-2", "PK", "Nilai dari 25% × 240 + ⅓ × 90 adalah …", ["90", "80", "85", "95", "100"], 0, "25% × 240 = 60 dan ⅓ × 90 = 30. Jumlahnya 60 + 30 = 90."),
  q("pk-3", "PK", "Rata-rata 5 bilangan adalah 12. Setelah ditambah satu bilangan, rata-ratanya menjadi 13. Bilangan yang ditambahkan adalah …", ["13", "15", "16", "20", "18"], 4,
    "Jumlah 5 bilangan = 5 × 12 = 60. Jumlah 6 bilangan = 6 × 13 = 78. Bilangan yang ditambahkan = 78 − 60 = 18."),
  q("pk-4", "PK", "Harga 4 buku Rp30.000. Harga 10 buku yang sama adalah …", ["Rp60.000", "Rp70.000", "Rp75.000", "Rp80.000", "Rp90.000"], 2,
    "Harga 1 buku = Rp30.000 ÷ 4 = Rp7.500. Harga 10 buku = 10 × Rp7.500 = Rp75.000."),
  q("pk-5", "PK", "Nilai dari 2⁵ − 3³ adalah …", ["1", "5", "3", "7", "9"], 1, "2⁵ = 32 dan 3³ = 27, sehingga 32 − 27 = 5."),

  // ── Literasi dalam Bahasa Indonesia ──
  q("lbi-1", "LBI", "Berdasarkan bacaan, salah satu akibat kurangnya ruang terbuka hijau adalah …", [
    "harga tanah di kota naik",
    "banjir lebih sering terjadi",
    "jumlah penduduk bertambah",
    "warga lebih sering berinteraksi",
    "suhu udara menjadi lebih rendah",
  ], 1, "Kalimat terakhir bacaan menyebut bahwa kurangnya RTH membuat banjir lebih sering terjadi dan udara terasa lebih panas.", RTH),
  q("lbi-2", "LBI", "Fungsi ruang terbuka hijau yang TIDAK disebutkan dalam bacaan adalah …", [
    "menyerap air hujan",
    "menurunkan suhu udara",
    "tempat warga berinteraksi",
    "sumber pendapatan daerah",
    "membantu mengurangi banjir",
  ], 3, "Bacaan menyebut fungsi menyerap air hujan, menurunkan suhu, dan tempat berinteraksi, serta kaitannya dengan banjir. Sumber pendapatan daerah tidak disebutkan.", RTH),
  q("lbi-3", "LBI", "Menurut bacaan, berapa persen luas ruang terbuka hijau yang disyaratkan undang-undang?", ["20 persen", "25 persen", "40 persen", "50 persen", "30 persen"], 4,
    "Bacaan menyebut luas RTH di banyak kota masih di bawah 30 persen, \"padahal undang-undang mensyaratkan angka tersebut\", yaitu 30 persen.", RTH),
  q("lbi-4", "LBI", "Sikap Rina yang tergambar dalam bacaan adalah …", ["peduli lingkungan", "hemat uang", "suka menolong teman", "disiplin waktu", "gemar berolahraga"], 0,
    "Rina membawa botol minum sendiri dan menolak sedotan plastik karena memikirkan dampaknya bagi lingkungan. Sikap itu menunjukkan kepedulian terhadap lingkungan.", RINA),
  q("lbi-5", "LBI", "Kata berdampak dalam kalimat terakhir bacaan bermakna …", ["berbahaya", "berpengaruh", "bertambah", "berkurang", "berubah"], 1,
    "Berdampak berarti menimbulkan akibat atau pengaruh, sehingga maknanya sama dengan berpengaruh.", RINA),

  // ── Literasi dalam Bahasa Inggris ──
  q("lbe-1", "LBE", "What is the main idea of the text?", [
    "Studying at home is easier than studying at school.",
    "Phones are the biggest problem for students.",
    "Simple habits can help students focus when studying at home.",
    "Students should study for 25 minutes a day.",
    "Experts disagree about how to study.",
  ], 2, "The text describes a problem (hard to focus at home) and then gives simple habits that improve concentration. That is the main idea.", STUDY),
  q("lbe-2", "LBE", "According to the text, how often should students take a short break?", ["Every 15 minutes", "Every 30 minutes", "Every hour", "Every 25 minutes", "Only after finishing"], 3,
    "The text says experts suggest \"taking a short break every 25 minutes\".", STUDY),
  q("lbe-3", "LBE", "The word dedicated in the text is closest in meaning to …", ["set apart for one purpose", "expensive", "shared with others", "noisy", "temporary"], 0,
    "A dedicated study area is a place used only for studying, so dedicated means set apart for one purpose.", STUDY),
  q("lbe-4", "LBE", "Which of the following is NOT suggested in the text?", [
    "Creating a study area",
    "Turning off phone notifications",
    "Taking short breaks",
    "Keeping a regular break time",
    "Studying with loud music",
  ], 4, "The text suggests a study area, turning off notifications, and short breaks every 25 minutes (a regular break time). Studying with loud music is not mentioned.", STUDY),
  q("lbe-5", "LBE", "If she … earlier, she would not have missed the bus.", ["leaves", "had left", "left", "has left", "would leave"], 1,
    "This is a third conditional (past unreal situation): If + past perfect, would have + past participle. So the correct form is \"had left\"."),

  // ── Penalaran Matematika ──
  q("pm-1", "PM", "Sebuah toko memberi diskon 20% untuk semua tas, lalu tambahan diskon 10% dari harga setelah diskon pertama. Jika harga awal sebuah tas Rp250.000, berapa harga yang harus dibayar?", [
    "Rp175.000",
    "Rp180.000",
    "Rp187.500",
    "Rp192.500",
    "Rp200.000",
  ], 1, "Diskon bertingkat dihitung berurutan, bukan dijumlahkan. Setelah diskon pertama: Rp250.000 × 0,8 = Rp200.000. Setelah diskon kedua: Rp200.000 × 0,9 = Rp180.000. Jawaban Rp175.000 muncul kalau 20% dan 10% langsung dijumlahkan jadi 30%."),
  q("pm-2", "PM", "Rata-rata nilai ulangan 5 siswa adalah 78. Jika nilai satu siswa yang mendapat 90 tidak diikutkan, berapa rata-rata nilai 4 siswa lainnya?", ["72", "74", "75", "76", "78"], 2,
    "Jumlah nilai 5 siswa = 5 × 78 = 390. Tanpa siswa bernilai 90, jumlahnya 300. Rata-rata 4 siswa = 300 ÷ 4 = 75."),
  q("pm-3", "PM", "Sebuah mobil menempuh jarak 180 km dalam waktu 2 jam 30 menit. Berapa kecepatan rata-rata mobil tersebut?", ["60 km/jam", "65 km/jam", "75 km/jam", "72 km/jam", "90 km/jam"], 3,
    "Ubah waktu ke jam: 2 jam 30 menit = 2,5 jam. Kecepatan = jarak ÷ waktu = 180 ÷ 2,5 = 72 km/jam. Jawaban 60 km/jam muncul kalau waktunya dibulatkan menjadi 3 jam."),
  q("pm-4", "PM", "Perbandingan uang Ani dan Budi adalah 3 : 5. Jika selisih uang mereka Rp40.000, berapa uang Budi?", ["Rp100.000", "Rp60.000", "Rp80.000", "Rp120.000", "Rp200.000"], 0,
    "Selisih perbandingan 5 − 3 = 2 bagian, sama dengan Rp40.000, jadi 1 bagian = Rp20.000. Uang Budi = 5 × Rp20.000 = Rp100.000."),
  q("pm-5", "PM", "Sebuah kolam berbentuk balok berukuran 4 m × 3 m × 1,5 m diisi air sampai penuh. Berapa liter air di kolam itu?", ["180 liter", "1.800 liter", "12.000 liter", "15.000 liter", "18.000 liter"], 4,
    "Volume = 4 × 3 × 1,5 = 18 m³. Karena 1 m³ = 1.000 liter, isi kolam = 18 × 1.000 = 18.000 liter. Jawaban 1.800 liter muncul kalau 1 m³ dianggap 100 liter."),
];
