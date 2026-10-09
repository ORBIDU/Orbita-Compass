import type { BankQuestion } from "@/types/soal";

// Sementara, dipakai juga di mode backend sampai endpoint bank soal (API_CONTRACT 12.5) ada.
//
// CONTOH SOAL TKA, 5 soal untuk 3 mapel wajib + Matematika Tingkat Lanjut dan
// Fisika. Mapel pilihan lain belum punya soal contoh. Bukan bank soal resmi.
// answer = indeks pilihan benar (0 = A).

const q = (id: string, subject: string, text: string, options: string[], answer: number, explanation: string, passage?: string): BankQuestion => ({
  id: `tka-${id}`,
  exam: "tka",
  subject,
  text,
  options,
  answer,
  explanation,
  ...(passage ? { passage } : {}),
});

const NOTICE = "Notice: The school library will be closed on Monday, 12 October, for maintenance. Students may return borrowed books at the front office.";

export const TKA_BANK: BankQuestion[] = [
  // ── Matematika ──
  q("mat-1", "Matematika", "Hasil dari ⅔ + ¾ adalah …", ["5/7", "5/12", "6/7", "17/12", "1 ⅚"], 3, "Samakan penyebut menjadi 12: ⅔ = 8/12 dan ¾ = 9/12. Jumlahnya 17/12."),
  q("mat-2", "Matematika", "Persamaan garis yang melalui titik (0, 2) dengan gradien 3 adalah …", ["y = 3x + 2", "y = 2x + 3", "y = 3x − 2", "y = −3x + 2", "y = x + 5"], 0,
    "Bentuk umum y = mx + c. Gradien m = 3 dan garis memotong sumbu y di (0, 2), jadi c = 2. Persamaannya y = 3x + 2."),
  q("mat-3", "Matematika", "Akar-akar persamaan x² − 5x + 6 = 0 adalah …", ["1 dan 6", "−2 dan −3", "2 dan 3", "−1 dan 6", "1 dan 5"], 2,
    "x² − 5x + 6 = (x − 2)(x − 3) = 0, sehingga x = 2 atau x = 3."),
  q("mat-4", "Matematika", "Luas lingkaran dengan jari-jari 7 cm (π = 22/7) adalah …", ["44 cm²", "88 cm²", "308 cm²", "616 cm²", "154 cm²"], 4, "Luas = π × r² = 22/7 × 7 × 7 = 154 cm²."),
  q("mat-5", "Matematika", "Median dari data 4, 7, 5, 9, 6, 8, 3 adalah …", ["5", "6", "7", "5,5", "6,5"], 1,
    "Urutkan data: 3, 4, 5, 6, 7, 8, 9. Ada 7 data, jadi median adalah data ke-4, yaitu 6."),

  // ── Bahasa Indonesia ──
  q("bi-1", "Bahasa Indonesia", "Pada paragraf deduktif, kalimat utama terletak di …", ["akhir paragraf", "awal paragraf", "tengah paragraf", "awal dan akhir paragraf", "setiap kalimat"], 1,
    "Paragraf deduktif dimulai dari gagasan umum lalu diikuti penjelasan khusus, sehingga kalimat utamanya berada di awal paragraf."),
  q("bi-2", "Bahasa Indonesia", "Teks yang menceritakan kembali peristiwa yang dialami penulis secara berurutan waktu disebut teks …", ["eksposisi", "deskripsi", "prosedur", "cerita ulang (rekon)", "eksplanasi"], 3,
    "Teks cerita ulang atau rekon menceritakan kembali pengalaman atau peristiwa secara kronologis (berurutan waktu)."),
  q("bi-3", "Bahasa Indonesia", "Kata berimbuhan yang ditulis dengan benar adalah …", ["mempertanggungjawabkan", "mempertanggung jawabkan", "dipertanggung jawabkan", "pertanggung-jawaban", "bertanggungjawab"], 0,
    "Gabungan kata yang mendapat awalan dan akhiran sekaligus ditulis serangkai: mempertanggungjawabkan. Jika hanya mendapat awalan, tetap ditulis terpisah: bertanggung jawab."),
  q("bi-4", "Bahasa Indonesia", "Majas dalam kalimat \"Angin malam membelai rambutku dengan lembut\" adalah …", ["hiperbola", "metafora", "personifikasi", "litotes", "ironi"], 2,
    "Angin digambarkan bisa \"membelai\" seperti manusia. Memberi sifat manusia pada benda mati disebut personifikasi."),
  q("bi-5", "Bahasa Indonesia", "Ciri utama teks prosedur adalah …", [
    "berisi pendapat penulis tentang suatu isu",
    "menggambarkan objek secara rinci",
    "menceritakan pengalaman masa lalu",
    "menjelaskan proses terjadinya fenomena alam",
    "berisi langkah-langkah berurutan dengan kalimat perintah",
  ], 4, "Teks prosedur menjelaskan cara melakukan sesuatu, sehingga berisi langkah berurutan dan banyak memakai kalimat perintah."),

  // ── Bahasa Inggris ──
  q("bing-1", "Bahasa Inggris", "She … to school every day.", ["go", "goes", "going", "gone", "is go"], 1,
    "For a habit in the simple present with a third-person singular subject (she), the verb takes -s/-es: goes."),
  q("bing-2", "Bahasa Inggris", "The active form of \"The letter was written by Tom\" is …", ["Tom writes the letter.", "Tom has written the letter.", "Tom was writing the letter.", "Tom wrote the letter.", "Tom will write the letter."], 3,
    "\"Was written\" is simple past passive, so the active form uses the simple past: Tom wrote the letter."),
  q("bing-3", "Bahasa Inggris", "The word rapid has the closest meaning to …", ["fast", "careful", "quiet", "heavy", "late"], 0, "Rapid means happening quickly, so its synonym is fast."),
  q("bing-4", "Bahasa Inggris", "I have lived in this city … 2020.", ["for", "since", "at", "in", "on"], 1,
    "\"Since\" is used with a starting point in time (2020) in the present perfect. \"For\" is used with a length of time, such as \"for six years\"."),
  q("bing-5", "Bahasa Inggris", "Why will the library be closed on Monday?", ["Because it is a holiday", "Because of a school event", "Because the books are being moved", "Because the staff are on leave", "Because of maintenance"], 4,
    "The notice says the library will be closed \"for maintenance\".", NOTICE),

  // ── Matematika Tingkat Lanjut ──
  q("mtl-1", "Matematika Tingkat Lanjut", "Turunan pertama dari f(x) = 3x² + 2x adalah …", ["3x + 2", "6x + 2", "6x² + 2", "3x² + 2", "6x"], 1, "Turunan axⁿ adalah n·a·xⁿ⁻¹. Jadi f'(x) = 2·3x + 2 = 6x + 2."),
  q("mtl-2", "Matematika Tingkat Lanjut", "Nilai dari lim x→2 (x² − 4)/(x − 2) adalah …", ["0", "2", "tidak ada", "4", "8"], 3,
    "x² − 4 = (x − 2)(x + 2). Setelah (x − 2) dicoret, limitnya x + 2 untuk x → 2, yaitu 4."),
  q("mtl-3", "Matematika Tingkat Lanjut", "Nilai dari ∫₀³ 2x dx adalah …", ["9", "6", "3", "18", "12"], 0, "Antiturunan 2x adalah x². Nilainya 3² − 0² = 9."),
  q("mtl-4", "Matematika Tingkat Lanjut", "Nilai dari sin 30° + cos 60° adalah …", ["½", "√3", "1", "½√3", "2"], 2, "sin 30° = ½ dan cos 60° = ½, jadi jumlahnya ½ + ½ = 1."),
  q("mtl-5", "Matematika Tingkat Lanjut", "Nilai dari ²log 32 adalah …", ["4", "6", "16", "8", "5"], 4, "2⁵ = 32, sehingga ²log 32 = 5."),

  // ── Fisika ──
  q("fis-1", "Fisika", "Sebuah mobil bergerak dengan kecepatan tetap 20 m/s selama 5 sekon. Jarak yang ditempuh adalah …", ["4 m", "25 m", "100 m", "200 m", "15 m"], 2, "Pada gerak lurus beraturan, jarak = kecepatan × waktu = 20 × 5 = 100 m."),
  q("fis-2", "Fisika", "Gaya 10 N bekerja pada benda bermassa 2 kg. Percepatan benda adalah …", ["5 m/s²", "20 m/s²", "12 m/s²", "8 m/s²", "0,2 m/s²"], 0, "Menurut hukum II Newton, a = F ÷ m = 10 ÷ 2 = 5 m/s²."),
  q("fis-3", "Fisika", "Satuan SI untuk energi adalah …", ["watt", "newton", "pascal", "joule", "volt"], 3, "Energi dan usaha dalam SI diukur dengan joule (J). Watt adalah satuan daya, newton satuan gaya."),
  q("fis-4", "Fisika", "Sebuah hambatan 6 Ω dihubungkan dengan tegangan 12 V. Kuat arus yang mengalir adalah …", ["72 A", "2 A", "0,5 A", "18 A", "6 A"], 1, "Menurut hukum Ohm, I = V ÷ R = 12 ÷ 6 = 2 A."),
  q("fis-5", "Fisika", "Gelombang dengan frekuensi 50 Hz dan panjang gelombang 2 m memiliki cepat rambat …", ["25 m/s", "52 m/s", "48 m/s", "0,04 m/s", "100 m/s"], 4, "Cepat rambat gelombang v = λ × f = 2 × 50 = 100 m/s."),
];
