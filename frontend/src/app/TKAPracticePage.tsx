import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Check, CheckCircle2, ChevronRight, Sparkles,
  TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, RotateCcw,
} from "lucide-react";

const PP = "Poppins, sans-serif";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Question = {
  q: string; opts: string[]; ans: number; exp: string;
  diff: "Mudah" | "Sedang" | "Sulit"; topic: string; subjectKey: string;
};

// ─── Subject Metadata ──────────────────────────────────────────────────────────
const SUBJ_META = [
  { key: "mat", label: "Matematika",   emoji: "🔢", color: "#0965fa", light: "#eff6ff", group: "wajib" },
  { key: "ind", label: "B. Indonesia", emoji: "📝", color: "#f1ad00", light: "#fffbeb", group: "wajib" },
  { key: "eng", label: "B. Inggris",   emoji: "🌍", color: "#22c55e", light: "#f0fdf4", group: "wajib" },
  { key: "fis", label: "Fisika",       emoji: "⚡", color: "#f59e0b", light: "#fffbeb", group: "saintek" },
  { key: "kim", label: "Kimia",        emoji: "🧪", color: "#ef4444", light: "#fef2f2", group: "saintek" },
  { key: "bio", label: "Biologi",      emoji: "🧬", color: "#10b981", light: "#f0fdf4", group: "saintek" },
  { key: "eko", label: "Ekonomi",      emoji: "📊", color: "#6366f1", light: "#f0f0ff", group: "sosial" },
  { key: "geo", label: "Geografi",     emoji: "🌏", color: "#f97316", light: "#fff7ed", group: "sosial" },
  { key: "sos", label: "Sosiologi",    emoji: "👥", color: "#ec4899", light: "#fdf4ff", group: "sosial" },
];

// ─── Question Bank ─────────────────────────────────────────────────────────────
const QBANK: Record<string, Question[]> = {
  mat: [
    { q: "Jika f(x) = 2x² + 3x − 1, nilai f(2) = ...", opts: ["12","13","9","11"], ans: 1, exp: "f(2) = 2(4) + 3(2) − 1 = 13", diff: "Mudah", topic: "Fungsi", subjectKey: "mat" },
    { q: "Nilai ²log 8 adalah ...", opts: ["2","3","4","6"], ans: 1, exp: "²log 8 = ²log 2³ = 3", diff: "Mudah", topic: "Fungsi", subjectKey: "mat" },
    { q: "Suku ke-10 dari barisan 3, 7, 11, ... adalah ...", opts: ["39","41","43","45"], ans: 0, exp: "U₁₀ = 3 + 9 × 4 = 39", diff: "Mudah", topic: "Barisan & Deret", subjectKey: "mat" },
    { q: "Jumlah 10 suku pertama dari deret 2 + 5 + 8 + ... adalah ...", opts: ["145","155","165","175"], ans: 1, exp: "S₁₀ = 10/2 × (4 + 27) = 5 × 31 = 155", diff: "Sedang", topic: "Barisan & Deret", subjectKey: "mat" },
    { q: "Peluang munculnya keduanya angka saat melempar 2 koin adalah ...", opts: ["1/4","1/2","3/4","1"], ans: 0, exp: "HH = 1 dari {HH, HT, TH, TT}. P = 1/4", diff: "Sedang", topic: "Peluang", subjectKey: "mat" },
    { q: "Nilai limit lim(x→2) (x² − 4)/(x − 2) = ...", opts: ["0","2","4","∞"], ans: 2, exp: "(x²−4)/(x−2) = (x+2)(x−2)/(x−2) = x+2 → 4", diff: "Sulit", topic: "Fungsi", subjectKey: "mat" },
    { q: "Dari 5 siswa dipilih 3 pengurus. Berapa banyak cara?", opts: ["10","20","30","60"], ans: 0, exp: "C(5,3) = 5!/(3!2!) = 10", diff: "Sedang", topic: "Peluang", subjectKey: "mat" },
    { q: "Akar-akar dari x² − 5x + 6 = 0 adalah ...", opts: ["2 dan 3","−2 dan −3","1 dan 6","−1 dan −6"], ans: 0, exp: "(x−2)(x−3) = 0 → x = 2 atau x = 3", diff: "Mudah", topic: "Persamaan Linear", subjectKey: "mat" },
    { q: "Gradien garis 3x − 2y + 4 = 0 adalah ...", opts: ["3/2","−3/2","2/3","−2/3"], ans: 0, exp: "−2y = −3x − 4 → y = 3/2x + 2. Gradien = 3/2", diff: "Sedang", topic: "Persamaan Linear", subjectKey: "mat" },
    { q: "sin 30° + cos 60° = ...", opts: ["1/2","1","3/2","0"], ans: 1, exp: "sin 30° = 1/2, cos 60° = 1/2. Jumlah = 1", diff: "Mudah", topic: "Trigonometri", subjectKey: "mat" },
  ],
  ind: [
    { q: "Kata 'ambigu' berarti ...", opts: ["Jelas dan pasti","Bermakna ganda","Tidak bermakna","Sangat pasti"], ans: 1, exp: "Ambigu = bermakna lebih dari satu.", diff: "Mudah", topic: "Kalimat Efektif", subjectKey: "ind" },
    { q: "Kata baku dari 'apotik' adalah ...", opts: ["apotek","apotik","apatek","apetek"], ans: 0, exp: "Penulisan baku KBBI: 'apotek'.", diff: "Mudah", topic: "Kalimat Efektif", subjectKey: "ind" },
    { q: "Kalimat efektif adalah kalimat yang ...", opts: ["Panjang dan detail","Menyampaikan pesan dengan tepat dan jelas","Hanya menggunakan bahasa baku","Memiliki banyak anak kalimat"], ans: 1, exp: "Kalimat efektif: menyampaikan gagasan tepat dan jelas.", diff: "Sedang", topic: "Kalimat Efektif", subjectKey: "ind" },
    { q: "Paragraf deduktif: kalimat utama terletak di ...", opts: ["Akhir","Awal","Tengah","Tersebar"], ans: 1, exp: "Deduktif: kalimat utama di awal.", diff: "Sedang", topic: "Ide Pokok", subjectKey: "ind" },
    { q: "Simpulan yang baik bersifat ...", opts: ["Subjektif","Objektif dan mencerminkan isi","Berlebihan","Sebagian isi saja"], ans: 1, exp: "Simpulan baik: objektif, mencerminkan keseluruhan isi.", diff: "Sedang", topic: "Simpulan Bacaan", subjectKey: "ind" },
    { q: "Majas yang menggunakan kata 'seperti' disebut ...", opts: ["Metafora","Personifikasi","Simile","Hiperbola"], ans: 2, exp: "Simile = perumpamaan dengan 'seperti', 'bagaikan', 'laksana'.", diff: "Sulit", topic: "Majas", subjectKey: "ind" },
    { q: "Antonim kata 'konkret' adalah ...", opts: ["Nyata","Abstrak","Jelas","Padat"], ans: 1, exp: "Konkret = nyata/berwujud. Antonim = abstrak.", diff: "Mudah", topic: "Kalimat Efektif", subjectKey: "ind" },
    { q: "Paragraf induktif: kalimat utama di ...", opts: ["Awal","Tengah","Akhir","Awal dan akhir"], ans: 2, exp: "Induktif: kalimat penjelas dulu, kesimpulan di akhir.", diff: "Sedang", topic: "Ide Pokok", subjectKey: "ind" },
    { q: "Kata 'prediksi' bersinonim dengan ...", opts: ["Fakta","Ramalan","Kesimpulan","Opini"], ans: 1, exp: "Prediksi = prakiraan / ramalan sebelum terjadi.", diff: "Mudah", topic: "Kalimat Efektif", subjectKey: "ind" },
    { q: "Gagasan utama paragraf disebut juga ...", opts: ["Kalimat penjelas","Ide pokok","Majas","Diksi"], ans: 1, exp: "Gagasan utama = ide pokok = kalimat topik.", diff: "Mudah", topic: "Ide Pokok", subjectKey: "ind" },
  ],
  eng: [
    { q: "She ___ to school every day.", opts: ["go","goes","going","went"], ans: 1, exp: "3rd person singular: verb + s/es → 'goes'.", diff: "Mudah", topic: "Grammar", subjectKey: "eng" },
    { q: "Opposite of 'diligent' is ...", opts: ["Hardworking","Lazy","Clever","Active"], ans: 1, exp: "Diligent = rajin. Opposite = lazy.", diff: "Mudah", topic: "Vocabulary", subjectKey: "eng" },
    { q: "If I ___ you, I would study harder.", opts: ["am","was","were","be"], ans: 2, exp: "Conditional type 2: 'were' for all subjects in formal English.", diff: "Sedang", topic: "Grammar", subjectKey: "eng" },
    { q: "'Benevolent' means ...", opts: ["Harmful","Kind and generous","Angry","Selfish"], ans: 1, exp: "Benevolent = kind and generous.", diff: "Sedang", topic: "Vocabulary", subjectKey: "eng" },
    { q: "Passive of 'They built this bridge in 1990':", opts: ["This bridge was built in 1990.","This bridge is built in 1990.","This bridge built in 1990.","This bridge were built in 1990."], ans: 0, exp: "Simple past passive: Subject + was/were + V3.", diff: "Sulit", topic: "Grammar", subjectKey: "eng" },
    { q: "She has ___ her homework.", opts: ["finish","finished","finishing","finishes"], ans: 1, exp: "Present perfect: has/have + V3.", diff: "Mudah", topic: "Tenses", subjectKey: "eng" },
    { q: "The synonym of 'eloquent' is ...", opts: ["Silent","Well-spoken","Confused","Clumsy"], ans: 1, exp: "Eloquent = well-spoken, articulate.", diff: "Sedang", topic: "Vocabulary", subjectKey: "eng" },
    { q: "What is the main idea of a text about exercise benefits?", opts: ["Exercise is tiring","Exercise improves health and well-being","Exercise is only for athletes","Exercise needs equipment"], ans: 1, exp: "Main idea = central point about positive health outcomes.", diff: "Sedang", topic: "Main Idea", subjectKey: "eng" },
    { q: "They ___ working on the project for two hours.", opts: ["have been","has been","was","were"], ans: 0, exp: "Present perfect continuous (plural subject): have been + V-ing.", diff: "Sulit", topic: "Tenses", subjectKey: "eng" },
    { q: "The word 'ambiguous' means ...", opts: ["Clear","Having two possible meanings","Definite","Obvious"], ans: 1, exp: "Ambiguous = having more than one possible meaning.", diff: "Sedang", topic: "Vocabulary", subjectKey: "eng" },
  ],
  fis: [
    { q: "Satuan SI untuk tekanan adalah ...", opts: ["Newton","Joule","Pascal","Watt"], ans: 2, exp: "Pascal (Pa) = satuan tekanan. 1 Pa = 1 N/m².", diff: "Mudah", topic: "Mekanika", subjectKey: "fis" },
    { q: "F = ma adalah bunyi Hukum Newton ke- ...", opts: ["I","II","III","IV"], ans: 1, exp: "F = m × a = Hukum Newton II.", diff: "Mudah", topic: "Mekanika", subjectKey: "fis" },
    { q: "Energi kinetik benda massa m, kecepatan v adalah ...", opts: ["mv","½mv","mv²","½mv²"], ans: 3, exp: "Ek = ½mv²", diff: "Sedang", topic: "Mekanika", subjectKey: "fis" },
    { q: "Persamaan kecepatan gelombang: v = ...", opts: ["f×T","f×λ","λ/T","f/λ"], ans: 1, exp: "v = f × λ (frekuensi × panjang gelombang).", diff: "Sedang", topic: "Gelombang", subjectKey: "fis" },
    { q: "Satuan muatan listrik adalah ...", opts: ["Ampere","Volt","Coulomb","Ohm"], ans: 2, exp: "Coulomb (C) = satuan muatan listrik.", diff: "Sedang", topic: "Listrik", subjectKey: "fis" },
    { q: "Benda v₀ = 20 m/s vertikal ke atas. Ketinggian maks (g = 10 m/s²)?", opts: ["10 m","20 m","30 m","40 m"], ans: 1, exp: "h = v₀²/2g = 400/20 = 20 m", diff: "Sulit", topic: "Mekanika", subjectKey: "fis" },
    { q: "Frekuensi dan periode dihubungkan dengan ...", opts: ["f = T","f = 1/T","f = T²","f = 2T"], ans: 1, exp: "f = 1/T (frekuensi = kebalikan periode).", diff: "Mudah", topic: "Gelombang", subjectKey: "fis" },
    { q: "Indeks bias cahaya n = c/v menunjukkan ...", opts: ["Percepatan cahaya","Perbandingan kecepatan cahaya di vakum vs medium","Refleksi","Difraksi"], ans: 1, exp: "n = c/v: rasio kecepatan di vakum (c) terhadap medium (v).", diff: "Sulit", topic: "Optika", subjectKey: "fis" },
    { q: "Hukum Ohm menyatakan V = ...", opts: ["I/R","I×R","R/I","I+R"], ans: 1, exp: "Hukum Ohm: V = I × R", diff: "Mudah", topic: "Listrik", subjectKey: "fis" },
    { q: "Kalor jenis didefinisikan sebagai ...", opts: ["Kalor per satuan massa per satuan waktu","Kalor per satuan massa per perubahan suhu","Total kalor","Kapasitas panas total"], ans: 1, exp: "c = Q/(m × ΔT) → kalor jenis = Q per kg per °C", diff: "Sedang", topic: "Termodinamika", subjectKey: "fis" },
  ],
  kim: [
    { q: "Nomor atom karbon (C) adalah ...", opts: ["4","6","8","12"], ans: 1, exp: "Karbon = nomor atom 6.", diff: "Mudah", topic: "Stoikiometri", subjectKey: "kim" },
    { q: "Rumus molekul air adalah ...", opts: ["HO","H₂O","H₂O₂","OH"], ans: 1, exp: "Air = H₂O.", diff: "Mudah", topic: "Stoikiometri", subjectKey: "kim" },
    { q: "pH larutan dengan [H⁺] = 10⁻³ M adalah ...", opts: ["3","7","11","14"], ans: 0, exp: "pH = −log(10⁻³) = 3", diff: "Sedang", topic: "Kesetimbangan", subjectKey: "kim" },
    { q: "Ikatan kovalen terbentuk dari ...", opts: ["Transfer elektron","Pemakaian bersama elektron","Gaya van der Waals","Ikatan hidrogen"], ans: 1, exp: "Ikatan kovalen = pemakaian bersama pasangan elektron.", diff: "Sedang", topic: "Ikatan Kimia", subjectKey: "kim" },
    { q: "Reaksi asam + basa menghasilkan ...", opts: ["Asam kuat","Basa kuat","Garam dan air","Gas"], ans: 2, exp: "Netralisasi: asam + basa → garam + air.", diff: "Sedang", topic: "Kesetimbangan", subjectKey: "kim" },
    { q: "Jumlah atom H dalam 1 mol CH₄ (Nₐ = 6,02×10²³)?", opts: ["6,02×10²³","2,41×10²⁴","1,20×10²⁴","3,01×10²³"], ans: 1, exp: "4H per molekul × 6,02×10²³ = 2,41×10²⁴", diff: "Sulit", topic: "Stoikiometri", subjectKey: "kim" },
    { q: "Perubahan fisika adalah perubahan yang ...", opts: ["Mengubah sifat kimia","Tidak mengubah sifat kimia","Membentuk zat baru","Melepas energi besar"], ans: 1, exp: "Perubahan fisika tidak mengubah sifat/susunan kimia zat.", diff: "Mudah", topic: "Stoikiometri", subjectKey: "kim" },
    { q: "Reaksi eksoterm adalah reaksi yang ...", opts: ["Menyerap panas","Melepas panas","Tidak melibatkan panas","Butuh energi besar"], ans: 1, exp: "Eksoterm = reaksi yang melepas energi (panas) ke lingkungan.", diff: "Sedang", topic: "Termokimia", subjectKey: "kim" },
    { q: "Konfigurasi elektron atom Na (Z=11) adalah ...", opts: ["2-8-1","2-9","2-8","1-8-2"], ans: 0, exp: "Na: 1s²2s²2p⁶3s¹ → kulit: 2-8-1", diff: "Sedang", topic: "Ikatan Kimia", subjectKey: "kim" },
    { q: "Massa molar CO₂ (C=12, O=16) adalah ...", opts: ["28 g/mol","44 g/mol","32 g/mol","36 g/mol"], ans: 1, exp: "M(CO₂) = 12 + 2(16) = 44 g/mol", diff: "Mudah", topic: "Stoikiometri", subjectKey: "kim" },
  ],
  bio: [
    { q: "Organel sel tempat respirasi sel adalah ...", opts: ["Nukleus","Ribosom","Mitokondria","Vakuola"], ans: 2, exp: "Mitokondria = 'powerhouse', tempat respirasi aerob.", diff: "Mudah", topic: "Sel", subjectKey: "bio" },
    { q: "Fotosintesis menghasilkan ...", opts: ["CO₂ dan H₂O","O₂ dan glukosa","ATP dan NADPH","ADP dan fosfat"], ans: 1, exp: "CO₂ + H₂O + cahaya → C₆H₁₂O₆ + O₂", diff: "Mudah", topic: "Metabolisme", subjectKey: "bio" },
    { q: "Pembelahan meiosis menghasilkan ...", opts: ["2 sel diploid","4 sel diploid","2 sel haploid","4 sel haploid"], ans: 3, exp: "Meiosis → 4 sel haploid (n).", diff: "Sedang", topic: "Sel", subjectKey: "bio" },
    { q: "Hukum Mendel I disebut Hukum ...", opts: ["Dominansi","Segregasi","Asortasi bebas","Pewarisan"], ans: 1, exp: "Mendel I = Segregasi: alel berpisah saat pembentukan gamet.", diff: "Sedang", topic: "Genetika", subjectKey: "bio" },
    { q: "Rantai makanan yang benar adalah ...", opts: ["Singa→Zebra→Rumput","Rumput→Belalang→Katak→Ular","Katak→Ular→Belalang","Ular→Katak→Rumput"], ans: 1, exp: "Rantai makanan: produsen → herbivora → karnivora.", diff: "Mudah", topic: "Ekologi", subjectKey: "bio" },
    { q: "Gen X-linked adalah gen yang ...", opts: ["Hanya di Y","Hanya di X","Di X tanpa pasangan di Y","Di kedua kromosom seks"], ans: 2, exp: "X-linked: di kromosom X tanpa alel pasangan di Y.", diff: "Sulit", topic: "Genetika", subjectKey: "bio" },
    { q: "Respirasi aerob menghasilkan berapa ATP per glukosa?", opts: ["2","8","36−38","100"], ans: 2, exp: "Respirasi aerob menghasilkan 36−38 ATP per molekul glukosa.", diff: "Sedang", topic: "Metabolisme", subjectKey: "bio" },
    { q: "Transpirasi pada tumbuhan terjadi melalui ...", opts: ["Akar","Batang","Stomata","Buah"], ans: 2, exp: "Transpirasi = penguapan air melalui stomata daun.", diff: "Mudah", topic: "Metabolisme", subjectKey: "bio" },
    { q: "Organel yang berperan dalam sintesis protein adalah ...", opts: ["Mitokondria","Lisosom","Ribosom","Badan Golgi"], ans: 2, exp: "Ribosom = tempat sintesis protein.", diff: "Mudah", topic: "Sel", subjectKey: "bio" },
    { q: "Proses pembuatan ATP di kloroplas menggunakan energi cahaya disebut ...", opts: ["Respirasi","Fotosintesis","Fermentasi","Glikolisis"], ans: 1, exp: "Fotosintesis = proses mengubah energi cahaya menjadi energi kimia (ATP/gula).", diff: "Mudah", topic: "Metabolisme", subjectKey: "bio" },
  ],
  eko: [
    { q: "Jika harga naik, permintaan ...", opts: ["Naik","Turun","Tetap","Tidak menentu"], ans: 1, exp: "Hukum permintaan: harga naik → permintaan turun.", diff: "Mudah", topic: "Permintaan & Penawaran", subjectKey: "eko" },
    { q: "Kebijakan fiskal dilakukan oleh ...", opts: ["Bank Sentral","Pemerintah","Swasta","Koperasi"], ans: 1, exp: "Fiskal = kebijakan pemerintah melalui APBN.", diff: "Mudah", topic: "Kebijakan Ekonomi", subjectKey: "eko" },
    { q: "Pasar dengan satu penjual disebut ...", opts: ["Oligopoli","Duopoli","Monopoli","Monopolistik"], ans: 2, exp: "Monopoli = satu penjual tunggal.", diff: "Sedang", topic: "Pasar", subjectKey: "eko" },
    { q: "Inflasi adalah ...", opts: ["Kenaikan nilai mata uang","Penurunan harga umum","Kenaikan harga umum terus-menerus","Stagnasi"], ans: 2, exp: "Inflasi = kenaikan harga barang/jasa secara umum dan berkelanjutan.", diff: "Sedang", topic: "Inflasi", subjectKey: "eko" },
    { q: "Pergeseran kurva permintaan ke kanan disebabkan ...", opts: ["Harga barang naik","Harga barang turun","Pendapatan konsumen naik","Selera turun"], ans: 2, exp: "Pergeseran demand: faktor selain harga, seperti pendapatan.", diff: "Sulit", topic: "Permintaan & Penawaran", subjectKey: "eko" },
    { q: "GDP adalah singkatan dari ...", opts: ["Gross Domestic Price","Gross Domestic Product","General Demand Product","Global Domestic Price"], ans: 1, exp: "GDP = Gross Domestic Product.", diff: "Mudah", topic: "Pendapatan Nasional", subjectKey: "eko" },
    { q: "Kebijakan moneter adalah kebijakan untuk ...", opts: ["Mengatur pajak","Mengatur jumlah uang beredar","Mengatur APBN","Mengatur perdagangan"], ans: 1, exp: "Kebijakan moneter: Bank Sentral mengatur jumlah uang beredar.", diff: "Sedang", topic: "Kebijakan Ekonomi", subjectKey: "eko" },
    { q: "Kurva supply bergeser ke kiri karena ...", opts: ["Harga barang naik","Teknologi maju","Biaya produksi naik","Pendapatan konsumen naik"], ans: 2, exp: "Kenaikan biaya produksi → penawaran turun → kurva supply ke kiri.", diff: "Sulit", topic: "Permintaan & Penawaran", subjectKey: "eko" },
    { q: "Pasar oligopoli ditandai dengan ...", opts: ["Satu penjual","Banyak penjual produk homogen","Beberapa penjual produk sejenis","Banyak penjual produk berbeda"], ans: 2, exp: "Oligopoli = beberapa penjual (dominan) di pasar.", diff: "Sedang", topic: "Pasar", subjectKey: "eko" },
    { q: "Hukum penawaran menyatakan ...", opts: ["Harga naik → penawaran turun","Harga turun → penawaran naik","Harga naik → penawaran naik","Harga turun → penawaran tetap"], ans: 2, exp: "Hukum penawaran: harga naik → penjual tertarik menambah pasokan → penawaran naik.", diff: "Mudah", topic: "Permintaan & Penawaran", subjectKey: "eko" },
  ],
  geo: [
    { q: "Lapisan atmosfer paling bawah disebut ...", opts: ["Stratosfer","Mesosfer","Troposfer","Termosfer"], ans: 2, exp: "Troposfer (0–12 km) = lapisan terbawah.", diff: "Mudah", topic: "Atmosfer", subjectKey: "geo" },
    { q: "Garis yang menghubungkan tempat curah hujan sama disebut ...", opts: ["Isotherm","Isobar","Isohyet","Isogon"], ans: 2, exp: "Isohyet = garis curah hujan sama di peta.", diff: "Mudah", topic: "Atmosfer", subjectKey: "geo" },
    { q: "Gempa akibat pergerakan lempeng tektonik disebut ...", opts: ["Vulkanik","Tektonik","Runtuhan","Buatan"], ans: 1, exp: "Gempa tektonik = pergerakan lempeng.", diff: "Sedang", topic: "Gempa Bumi", subjectKey: "geo" },
    { q: "Pulau terbesar di Indonesia adalah ...", opts: ["Jawa","Sulawesi","Sumatera","Kalimantan"], ans: 3, exp: "Kalimantan (Borneo) ≈ 743.330 km².", diff: "Mudah", topic: "Persebaran Flora", subjectKey: "geo" },
    { q: "Tanah dari abu vulkanik yang sangat subur disebut tanah ...", opts: ["Laterit","Andosol","Gambut","Podsolik"], ans: 1, exp: "Andosol: dari abu vulkanik, kaya mineral, sangat subur.", diff: "Sulit", topic: "Geomorfologi", subjectKey: "geo" },
    { q: "Angin darat bertiup dari darat ke laut pada ...", opts: ["Siang hari","Malam hari","Pagi hari","Sore hari"], ans: 1, exp: "Angin darat (darat→laut) terjadi malam hari: daratan lebih cepat dingin.", diff: "Sedang", topic: "Atmosfer", subjectKey: "geo" },
    { q: "Indonesia terletak di pertemuan tiga lempeng ...", opts: ["Eurasia dan Pasifik saja","Eurasia, Pasifik, dan Indo-Australia","Indo-Australia dan Pasifik saja","Hanya Eurasia"], ans: 1, exp: "Indonesia: pertemuan lempeng Eurasia, Pasifik, dan Indo-Australia.", diff: "Mudah", topic: "Gempa Bumi", subjectKey: "geo" },
    { q: "Iklim yang dipengaruhi laut disebut iklim ...", opts: ["Kontinental","Maritim","Tropis","Subtropis"], ans: 1, exp: "Iklim maritim = dipengaruhi massa udara laut, lembap dan hangat.", diff: "Sedang", topic: "Atmosfer", subjectKey: "geo" },
    { q: "Hutan hujan tropis banyak ditemukan di ...", opts: ["Gurun Sahara","Pegunungan Alpen","Kalimantan dan Amazon","Siberia"], ans: 2, exp: "Hutan hujan tropis: daerah beriklim tropis lembap seperti Kalimantan dan Amazon.", diff: "Mudah", topic: "Persebaran Flora", subjectKey: "geo" },
    { q: "Erosi oleh angin yang mengikis batuan disebut ...", opts: ["Abrasi","Deflasi","Korasi","Korosi"], ans: 2, exp: "Korasi = erosi mekanik oleh angin yang membawa pasir mengikis batuan.", diff: "Sulit", topic: "Geomorfologi", subjectKey: "geo" },
  ],
  sos: [
    { q: "Proses penyesuaian individu dengan norma kelompok disebut ...", opts: ["Sosialisasi","Enkulturasi","Difusi","Akulturasi"], ans: 0, exp: "Sosialisasi = proses belajar nilai dan norma kelompok.", diff: "Mudah", topic: "Sosialisasi", subjectKey: "sos" },
    { q: "Konflik antar kelompok sederajat disebut konflik ...", opts: ["Internal","Horizontal","Vertikal","Diagonal"], ans: 1, exp: "Konflik horizontal = antar kelompok setara.", diff: "Mudah", topic: "Konflik Sosial", subjectKey: "sos" },
    { q: "Stratifikasi terbuka ditandai dengan ...", opts: ["Status ditentukan kelahiran","Mobilitas sangat terbatas","Kesempatan berpindah strata","Tidak ada mobilitas"], ans: 2, exp: "Stratifikasi terbuka = individu bisa berpindah strata.", diff: "Sedang", topic: "Stratifikasi Sosial", subjectKey: "sos" },
    { q: "Contoh perubahan sosial yang cepat adalah ...", opts: ["Mode pakaian berubah","Revolusi industri","Perubahan bahasa","Perubahan adat"], ans: 1, exp: "Revolusi industri = perubahan cepat dan menyeluruh.", diff: "Sedang", topic: "Perubahan Sosial", subjectKey: "sos" },
    { q: "Lembaga yang mengatur hubungan antarnegara adalah ...", opts: ["Lembaga keluarga","Lembaga pendidikan","Lembaga politik","Lembaga internasional"], ans: 3, exp: "Lembaga internasional (PBB, WHO) mengatur hubungan antarnegara.", diff: "Sedang", topic: "Lembaga Sosial", subjectKey: "sos" },
    { q: "Teori konflik: perubahan sosial terjadi akibat ...", opts: ["Konsensus nilai","Pertentangan kepentingan","Evolusi bertahap","Adaptasi lingkungan"], ans: 1, exp: "Marx: pertentangan kepentingan → perubahan sosial.", diff: "Sulit", topic: "Perubahan Sosial", subjectKey: "sos" },
    { q: "Nilai sosial adalah ...", opts: ["Peraturan tertulis","Ukuran yang dianggap baik/buruk dalam masyarakat","Sanksi sosial","Norma hukum"], ans: 1, exp: "Nilai sosial = standar yang dianggap baik/buruk oleh masyarakat.", diff: "Mudah", topic: "Sosialisasi", subjectKey: "sos" },
    { q: "Asimilasi adalah ...", opts: ["Penyerapan budaya asing sepenuhnya","Pencampuran dua budaya menghasilkan budaya baru","Konflik antar budaya","Penolakan budaya asing"], ans: 0, exp: "Asimilasi = penyerapan/peleburan budaya minoritas ke budaya dominan.", diff: "Sulit", topic: "Sosialisasi", subjectKey: "sos" },
    { q: "Mobilitas sosial vertikal ke atas contohnya adalah ...", opts: ["Pindah kota","Berganti pekerjaan yang sama","Kenaikan jabatan","Ganti agama"], ans: 2, exp: "Mobilitas vertikal naik = berpindah ke strata lebih tinggi, contoh kenaikan jabatan.", diff: "Sedang", topic: "Stratifikasi Sosial", subjectKey: "sos" },
    { q: "Lembaga keluarga berfungsi sebagai ...", opts: ["Mengatur pemerintahan","Sosialisasi primer individu","Membuat undang-undang","Mengelola ekonomi"], ans: 1, exp: "Keluarga = lembaga sosialisasi primer (pertama dan utama) bagi individu.", diff: "Mudah", topic: "Lembaga Sosial", subjectKey: "sos" },
  ],
};

// ─── Practice History (static) ─────────────────────────────────────────────────
const PRACTICE_HISTORY = [
  { id: "h1", date: "Hari ini",  label: "Matematika",     subjects: ["mat"],        pct: 84, mode: "guided", correct: 42, total: 50, dur: "36 menit" },
  { id: "h2", date: "Kemarin",   label: "Mixed Practice",  subjects: ["mat","eng"],  pct: 79, mode: "custom",  correct: 32, total: 40, dur: "28 menit" },
  { id: "h3", date: "Senin",     label: "Bahasa Inggris",  subjects: ["eng"],        pct: 82, mode: "guided", correct: 24, total: 30, dur: "20 menit" },
  { id: "h4", date: "Minggu",    label: "Saintek Mix",     subjects: ["fis","kim"],  pct: 71, mode: "custom",  correct: 28, total: 40, dur: "33 menit" },
];

const PROGRESS_TREND = [72, 74, 73, 76, 78, 79, 81];

const LEARNING_TRENDS = [
  { label: "Matematika",      trend: "up",     prev: 76, curr: 84, color: "#0965fa" },
  { label: "Bahasa Indonesia", trend: "stable", prev: 77, curr: 78, color: "#f1ad00" },
  { label: "Bahasa Inggris",  trend: "down",   prev: 84, curr: 79, color: "#22c55e" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(subjects: string[], numQ: number): Question[] {
  const pool = shuffle(subjects.flatMap(s => QBANK[s] ?? []));
  return pool.slice(0, Math.min(numQ, pool.length));
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

function getWeakTopics(questions: Question[], answers: (number | null)[]) {
  const map: Record<string, { c: number; t: number }> = {};
  questions.forEach((q, i) => {
    if (!map[q.topic]) map[q.topic] = { c: 0, t: 0 };
    map[q.topic].t++;
    if (answers[i] === q.ans) map[q.topic].c++;
  });
  return Object.entries(map)
    .map(([topic, { c, t }]) => ({ topic, pct: Math.round((c / t) * 100) }))
    .filter(x => x.pct < 80)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 4);
}

function getSubjectAccuracy(questions: Question[], answers: (number | null)[]) {
  const map: Record<string, { c: number; t: number }> = {};
  questions.forEach((q, i) => {
    if (!map[q.subjectKey]) map[q.subjectKey] = { c: 0, t: 0 };
    map[q.subjectKey].t++;
    if (answers[i] === q.ans) map[q.subjectKey].c++;
  });
  return Object.entries(map)
    .map(([key, { c, t }]) => ({ key, pct: Math.round((c / t) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

// ─── Mini SVG Trend Line ───────────────────────────────────────────────────────
function TrendLine({ data, color }: { data: number[]; color: string }) {
  const W = 200; const H = 48;
  const minV = Math.min(...data) - 2;
  const maxV = Math.max(...data) + 2;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - minV) / (maxV - minV)) * H,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <svg width={W} height={H + 6} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="tl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${W},${H + 6} L0,${H + 6} Z`} fill="url(#tl-grad)" />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2.5}
          fill={i === pts.length - 1 ? color : "white"} stroke={color} strokeWidth={i === pts.length - 1 ? 0 : 1.5} />
      ))}
    </svg>
  );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ on, color = "#22c55e" }: { on: boolean; color?: string }) {
  return (
    <div className="w-10 h-5 rounded-full transition-colors relative" style={{ background: on ? color : "#d1d5db" }}>
      <div className="w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-all"
        style={{ left: on ? "22px" : "2px" }} />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TKAPracticeFlow({ onBack }: { onBack: () => void }) {
  // High-level state
  const [pState, setPState] = useState<"setup" | "exam" | "results">("setup");
  const [setupTab, setSetupTab] = useState<"guided" | "custom" | "history">("guided");

  // Guided setup
  const [gSubjects, setGSubjects] = useState<string[]>(["mat", "ind", "eng"]);
  const [gNumQ, setGNumQ] = useState<number | "custom">(20);
  const [gCustomNum, setGCustomNum] = useState(25);
  const [gTimerOn, setGTimerOn] = useState(false);
  const [gTimerMin, setGTimerMin] = useState<number | "custom">(30);
  const [gCustomTimer, setGCustomTimer] = useState(45);
  const [gReviewMode, setGReviewMode] = useState<"per-soal" | "setelah-selesai">("per-soal");

  // Custom setup
  const [cName, setCName] = useState("Review TKA Matematika");
  const [cSubjects, setCSubjects] = useState<string[]>(["mat"]);
  const [cNumQ, setCNumQ] = useState(20);
  const [cTimerOn, setCTimerOn] = useState(false);
  const [cTimerMin, setCTimerMin] = useState(30);
  const [cReviewMode, setCReviewMode] = useState<"per-soal" | "setelah-selesai">("setelah-selesai");

  // Exam state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExp, setShowExp] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [examTimerOn, setExamTimerOn] = useState(false);
  const [reviewMode, setReviewMode] = useState<"per-soal" | "setelah-selesai">("per-soal");
  const [practiceMode, setPracticeMode] = useState<"guided" | "custom">("guided");
  const [practiceName, setPracticeName] = useState("");
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  // History
  const [expandHistory, setExpandHistory] = useState<string | null>(null);

  // Timers
  useEffect(() => {
    if (pState !== "exam") return;
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [pState]);

  useEffect(() => {
    if (pState !== "exam" || !examTimerOn) return;
    const t = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setPState("results"); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [pState, examTimerOn]);

  // Start helpers
  function startGuided() {
    const numQ = gNumQ === "custom" ? gCustomNum : gNumQ;
    const timerSecs = gTimerOn ? ((gTimerMin === "custom" ? gCustomTimer : gTimerMin as number) * 60) : 0;
    const q = generateQuestions(gSubjects, numQ);
    setQuestions(q);
    setAnswers(Array(q.length).fill(null));
    setQIdx(0); setSelectedOpt(null); setShowExp(false); setElapsed(0);
    setRemaining(timerSecs); setExamTimerOn(gTimerOn);
    setReviewMode(gReviewMode); setPracticeMode("guided");
    setPracticeName("Guided Practice");
    setPState("exam");
  }

  function startCustom() {
    const timerSecs = cTimerOn ? cTimerMin * 60 : 0;
    const q = generateQuestions(cSubjects, cNumQ);
    setQuestions(q);
    setAnswers(Array(q.length).fill(null));
    setQIdx(0); setSelectedOpt(null); setShowExp(false); setElapsed(0);
    setRemaining(timerSecs); setExamTimerOn(cTimerOn);
    setReviewMode(cReviewMode); setPracticeMode("custom");
    setPracticeName(cName || "Custom Practice");
    setPState("exam");
  }

  function handleAnswer(optIdx: number) {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIdx);
    const newAns = [...answers];
    newAns[qIdx] = optIdx;
    setAnswers(newAns);
    if (reviewMode === "per-soal") setShowExp(true);
  }

  function nextQ() {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
      setSelectedOpt(null);
      setShowExp(false);
    } else {
      setPState("results");
    }
  }

  // Derived stats
  const currentQ = questions[qIdx];
  const subMeta = currentQ ? (SUBJ_META.find(s => s.key === currentQ.subjectKey) ?? SUBJ_META[0]) : SUBJ_META[0];
  const correct = answers.filter((a, i) => a !== null && a === questions[i]?.ans).length;
  const wrong = answers.filter((a, i) => a !== null && a !== questions[i]?.ans).length;
  const blank = answers.filter(a => a === null).length;
  const totalQ = questions.length;
  const scorePct = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
  const scoreColor = scorePct >= 80 ? "#22c55e" : scorePct >= 60 ? "#f1ad00" : "#ef4444";
  const scoreLabel = scorePct >= 80 ? "Excellent! 🎉" : scorePct >= 60 ? "Good Job! 👍" : "Perlu Latihan 📚";
  const weakTopics = getWeakTopics(questions, answers);
  const subjectAccuracy = getSubjectAccuracy(questions, answers);

  // ── EXAM ──────────────────────────────────────────────────────────────────────
  if (pState === "exam" && currentQ) {
    const circ = 2 * Math.PI * 36;
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <button onClick={() => { if (window.confirm("Keluar dari latihan? Progress akan hilang.")) setPState("setup"); }}
              className="flex items-center gap-1.5 text-[11px] font-bold text-[#9ca3af] hover:text-[#374151]"
              style={{ fontFamily: PP, outline: "none" }}>
              <ArrowLeft size={13} /> Keluar
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-black" style={{ color: subMeta.color, fontFamily: PP }}>
                {subMeta.emoji} Soal {qIdx + 1}/{totalQ}
              </span>
              {examTimerOn ? (
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${remaining < 60 ? "bg-[#fef2f2] text-[#ef4444]" : "bg-[#f5f6fb] text-[#374151]"}`}
                  style={{ fontFamily: PP }}>
                  <Clock size={11} /> {formatTime(remaining)}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-[#f5f6fb] text-[#374151] text-[11px] font-bold" style={{ fontFamily: PP }}>
                  ⏱ {formatTime(elapsed)}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {questions.slice(0, Math.min(questions.length, 20)).map((_, i) => (
                <div key={i} className={`rounded-full transition-all ${i === qIdx ? "w-3.5 h-2" : "w-2 h-2"} ${
                  i < qIdx ? (answers[i] === questions[i].ans ? "bg-[#22c55e]" : "bg-[#ef4444]")
                  : i === qIdx ? "bg-[#0965fa]" : "bg-[#e5e7eb]"
                }`} />
              ))}
              {questions.length > 20 && <span className="text-[9px] text-[#9ca3af]" style={{ fontFamily: PP }}>+{questions.length - 20}</span>}
            </div>
          </div>
          <div className="h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((qIdx + 1) / totalQ) * 100}%`, background: subMeta.color }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
          <div className="px-6 py-5 max-w-2xl mx-auto flex flex-col gap-4">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                currentQ.diff === "Mudah" ? "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]"
                : currentQ.diff === "Sedang" ? "bg-[#fffbeb] text-[#92400e] border-[#fde68a]"
                : "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]"
              }`} style={{ fontFamily: PP }}>
                {currentQ.diff}
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white border border-[rgba(0,0,0,0.08)] text-[#9ca3af]"
                style={{ fontFamily: PP }}>
                {subMeta.emoji} {subMeta.label} · {currentQ.topic}
              </span>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm px-6 py-5">
              <p className="text-[10px] font-bold text-[#9ca3af] mb-3 uppercase tracking-wider" style={{ fontFamily: PP }}>Soal {qIdx + 1}</p>
              <p className="text-[15px] font-bold text-[#1a1d2e] leading-relaxed" style={{ fontFamily: PP }}>{currentQ.q}</p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {currentQ.opts.map((opt, i) => {
                const revealed = selectedOpt !== null;
                const isCorrect = i === currentQ.ans;
                const isSelected = selectedOpt === i;
                let cls = "bg-white border-[rgba(0,0,0,0.08)] hover:border-[#0965fa] cursor-pointer";
                if (revealed) {
                  if (isCorrect) cls = "bg-[#f0fdf4] border-[#22c55e]";
                  else if (isSelected) cls = "bg-[#fef2f2] border-[#ef4444]";
                  else cls = "bg-white border-[rgba(0,0,0,0.06)] opacity-40 cursor-default";
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={revealed}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all ${cls}`}
                    style={{ outline: "none" }}>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${
                      revealed && isCorrect ? "bg-[#22c55e] text-white"
                      : revealed && isSelected && !isCorrect ? "bg-[#ef4444] text-white"
                      : "bg-[#f5f6fb] text-[#374151]"
                    }`}>{["A","B","C","D"][i]}</div>
                    <span className="text-[13px] font-semibold text-[#1a1d2e] flex-1" style={{ fontFamily: PP }}>{opt}</span>
                    {revealed && isCorrect && <Check size={15} className="text-[#22c55e] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExp && (
              <div className={`rounded-2xl p-4 border ${selectedOpt === currentQ.ans ? "bg-[#f0fdf4] border-[#bbf7d0]" : "bg-[#fef2f2] border-[#fecaca]"}`}>
                <p className="text-[11px] font-bold mb-1.5" style={{ color: selectedOpt === currentQ.ans ? "#15803d" : "#991b1b", fontFamily: PP }}>
                  {selectedOpt === currentQ.ans ? "✅ Jawaban benar!" : "❌ Jawaban salah"}
                </p>
                <p className="text-[11px] font-bold text-[#1a1d2e] mb-1" style={{ fontFamily: PP }}>💡 Pembahasan:</p>
                <p className="text-[12px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{currentQ.exp}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              {selectedOpt === null ? (
                <button onClick={nextQ}
                  className="ml-auto text-[11px] font-semibold text-[#9ca3af] hover:text-[#374151] py-1.5 px-3"
                  style={{ fontFamily: PP, outline: "none" }}>
                  Lewati →
                </button>
              ) : (
                <button onClick={nextQ}
                  className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: subMeta.color, fontFamily: PP, outline: "none" }}>
                  {qIdx < questions.length - 1 ? "Soal Berikutnya →" : "Selesai & Lihat Hasil →"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────────
  if (pState === "results") {
    const circ = 2 * Math.PI * 42;
    const aiInsight = scorePct >= 80
      ? `Kamu menunjukkan performa sangat baik dalam sesi ini! Akurasi ${scorePct}% mencerminkan penguasaan materi yang kuat. Pertahankan konsistensi dan fokus pada topik yang masih perlu dipoles.`
      : scorePct >= 60
      ? `Peningkatan yang baik! Akurasi ${scorePct}% adalah titik yang solid untuk terus berkembang. Ditemukan beberapa kesalahan pada soal yang membutuhkan penalaran bertingkat — review topik lemah di bawah.`
      : `Jangan menyerah! Latihan ini membantu mengidentifikasi area yang perlu diperkuat. Akurasi ${scorePct}% menunjukkan masih banyak ruang untuk berkembang. Fokus pada pembahasan dan ulang materi topik lemah terlebih dahulu.`;

    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)] px-6 py-4 flex items-center gap-3">
          <button onClick={() => setPState("setup")}
            className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#eef0f8]"
            style={{ outline: "none" }}>
            <ArrowLeft size={14} className="text-[#374151]" />
          </button>
          <div>
            <p className="text-[17px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>Practice Completed ✅</p>
            <p className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{practiceName} · {formatTime(elapsed)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">
          <div className="px-6 py-5 max-w-3xl mx-auto flex flex-col gap-4">

            {/* Summary Card */}
            <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-sm p-5">
              <div className="grid grid-cols-[auto_1fr] gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f0f2f8" strokeWidth="9" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="9" strokeLinecap="round"
                        strokeDasharray={`${(scorePct / 100) * circ} ${circ}`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[26px] font-black" style={{ color: scoreColor, fontFamily: PP }}>{scorePct}%</p>
                      <p className="text-[8px] font-bold text-[#9ca3af]" style={{ fontFamily: PP }}>SCORE</p>
                    </div>
                  </div>
                  <span className="text-[12px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>{scoreLabel}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[["Score", `${correct}/${totalQ}`, "#1a1d2e"], ["Benar", `${correct}`, "#22c55e"], ["Salah", `${wrong}`, "#ef4444"], ["Blank", `${blank}`, "#9ca3af"]].map(([k, v, c]) => (
                      <div key={k} className="bg-[#f8faff] rounded-xl px-3 py-3 border border-[rgba(0,0,0,0.05)] text-center">
                        <p className="text-[9px] text-[#9ca3af] mb-1" style={{ fontFamily: PP }}>{k}</p>
                        <p className="text-[18px] font-black" style={{ color: c, fontFamily: PP }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#f8faff] rounded-xl px-3 py-2.5 border border-[rgba(0,0,0,0.05)]">
                      <p className="text-[9px] text-[#9ca3af]" style={{ fontFamily: PP }}>Durasi</p>
                      <p className="text-[14px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>{formatTime(elapsed)}</p>
                    </div>
                    <div className="bg-[#f8faff] rounded-xl px-3 py-2.5 border border-[rgba(0,0,0,0.05)]">
                      <p className="text-[9px] text-[#9ca3af]" style={{ fontFamily: PP }}>Akurasi</p>
                      <p className="text-[14px] font-black" style={{ color: scoreColor, fontFamily: PP }}>{scorePct}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Performance Insight */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]" style={{ background: "linear-gradient(90deg,#eff6ff,#fff)" }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#0965fa]" />
                  <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>AI Performance Insight</p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[12px] text-[#374151] leading-relaxed" style={{ fontFamily: PP }}>{aiInsight}</p>
              </div>
            </div>

            {/* Weak Topic Detection */}
            {weakTopics.length > 0 && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]" style={{ background: "linear-gradient(90deg,#fff7ed,#fff)" }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#f59e0b]" />
                    <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Weak Topic Detection ⭐</p>
                  </div>
                  <p className="text-[10px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Topik yang perlu ditingkatkan</p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  {weakTopics.map(t => {
                    const c = t.pct < 60 ? "#ef4444" : t.pct < 70 ? "#f59e0b" : "#f1ad00";
                    return (
                      <div key={t.topic}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={12} style={{ color: c }} />
                            <span className="text-[12px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{t.topic}</span>
                          </div>
                          <span className="text-[12px] font-black" style={{ color: c, fontFamily: PP }}>{t.pct}%</span>
                        </div>
                        <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, background: c }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cross-Subject Analysis (custom mode only) */}
            {practiceMode === "custom" && subjectAccuracy.length > 1 && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]" style={{ background: "linear-gradient(90deg,#f5f3ff,#fff)" }}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#8b5cf6]" />
                    <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>AI Cross Subject Analysis</p>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(subjectAccuracy.length, 3)}, 1fr)` }}>
                    {subjectAccuracy.map(sa => {
                      const meta = SUBJ_META.find(s => s.key === sa.key);
                      if (!meta) return null;
                      return (
                        <div key={sa.key} className="rounded-xl px-3 py-3 border border-[rgba(0,0,0,0.06)] text-center" style={{ background: meta.light }}>
                          <p className="text-[14px] mb-1">{meta.emoji}</p>
                          <p className="text-[11px] font-bold text-[#1a1d2e] mb-1.5" style={{ fontFamily: PP }}>{meta.label}</p>
                          <p className="text-[20px] font-black" style={{ color: meta.color, fontFamily: PP }}>{sa.pct}%</p>
                          <div className="h-1 mt-2 rounded-full" style={{ background: `${meta.color}30` }}>
                            <div className="h-full rounded-full" style={{ width: `${sa.pct}%`, background: meta.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-xl p-3.5 bg-[#f5f3ff] border border-[#ddd6fe]">
                    <p className="text-[10px] font-bold text-[#7c3aed] mb-1" style={{ fontFamily: PP }}>🤖 AI berkata</p>
                    <p className="text-[11px] text-[#5b21b6] leading-relaxed" style={{ fontFamily: PP }}>
                      {subjectAccuracy[0] && subjectAccuracy[subjectAccuracy.length - 1] &&
                        subjectAccuracy[0].pct - subjectAccuracy[subjectAccuracy.length - 1].pct > 15
                        ? `Kemampuan ${SUBJ_META.find(s => s.key === subjectAccuracy[0].key)?.label ?? ""} menunjukkan performa terbaik (${subjectAccuracy[0].pct}%). Sementara ${SUBJ_META.find(s => s.key === subjectAccuracy[subjectAccuracy.length - 1].key)?.label ?? ""} perlu lebih banyak latihan agar performa lintas mapel lebih merata.`
                        : "Performa lintas mata pelajaran cukup merata. Pertahankan konsistensi di semua mapel untuk hasil optimal saat UTBK."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Recommendation */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>🎯 AI Recommendation</p>
                <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>Langkah Belajar Selanjutnya</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-2">
                {(weakTopics.length > 0
                  ? [`Review materi: ${weakTopics[0]?.topic}`, weakTopics[1] ? `Kerjakan latihan: ${weakTopics[1]?.topic}` : "Tingkatkan kecepatan menjawab soal", "Ikuti Tryout UTBK untuk mengukur progress"]
                  : ["Pertahankan performa yang sudah sangat baik", "Coba tingkatkan jumlah soal di sesi berikutnya", "Latihan dengan mode Custom Practice lintas mapel"]
                ).map((rec, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#0965fa] flex items-center justify-center shrink-0">
                      <Check size={10} className="text-white" />
                    </div>
                    <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Pembahasan (setelah-selesai mode) */}
            {reviewMode === "setelah-selesai" && (
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                  <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>📖 Review Pembahasan</p>
                </div>
                <div className="divide-y divide-[rgba(0,0,0,0.04)]">
                  {questions.map((q, i) => {
                    const isCorrect = answers[i] === q.ans;
                    return (
                      <div key={i} className="px-5 py-3.5">
                        <div className="flex items-start gap-2.5 mb-1.5">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 ${isCorrect ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}>
                            {isCorrect ? "✓" : "✗"}
                          </div>
                          <p className="text-[12px] font-semibold text-[#1a1d2e]" style={{ fontFamily: PP }}>{q.q}</p>
                        </div>
                        {!isCorrect && (
                          <div className="pl-7.5">
                            <p className="text-[10px] text-[#9ca3af] mb-0.5" style={{ fontFamily: PP }}>
                              Jawaban: <strong className="text-[#22c55e]">{q.opts[q.ans]}</strong>
                            </p>
                            <p className="text-[10px] text-[#6b7280] leading-relaxed" style={{ fontFamily: PP }}>{q.exp}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3">
              <button onClick={() => {
                const q = generateQuestions(
                  practiceMode === "guided" ? gSubjects : cSubjects,
                  practiceMode === "guided" ? (gNumQ === "custom" ? gCustomNum : gNumQ as number) : cNumQ
                );
                setQuestions(q);
                setAnswers(Array(q.length).fill(null));
                setQIdx(0); setSelectedOpt(null); setShowExp(false); setElapsed(0);
                setRemaining(examTimerOn ? (gTimerMin === "custom" ? gCustomTimer : gTimerMin as number) * 60 : 0);
                setPState("exam");
              }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold text-white hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
                <RotateCcw size={14} /> Practice Again
              </button>
              <button onClick={() => setPState("setup")}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[13px] font-bold border border-[rgba(0,0,0,0.1)] text-[#374151] hover:bg-white bg-[#f5f6fb]"
                style={{ fontFamily: PP, outline: "none" }}>
                Back to Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SETUP ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="shrink-0 bg-white border-b border-[rgba(0,0,0,0.07)]">
        <div className="px-6 py-4 flex items-center gap-3">
          <button onClick={onBack}
            className="w-8 h-8 rounded-xl bg-[#f5f6fb] flex items-center justify-center hover:bg-[#eef0f8]"
            style={{ outline: "none" }}>
            <ArrowLeft size={14} className="text-[#374151]" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>SNBP Planner</span>
              <ChevronRight size={10} className="text-[#9ca3af]" />
              <span className="text-[10px] font-medium text-[#0965fa]" style={{ fontFamily: PP }}>Latihan TKA</span>
            </div>
            <p className="text-[17px] font-black text-[#1a1d2e]" style={{ fontFamily: PP }}>📝 Latihan TKA</p>
          </div>
        </div>
        <div className="flex border-b border-[rgba(0,0,0,0.06)]">
          {(["guided", "custom", "history"] as const).map(tab => (
            <button key={tab} onClick={() => setSetupTab(tab)}
              className={`px-5 py-3 text-[12px] font-bold transition-all border-b-2 ${setupTab === tab ? "border-[#0965fa] text-[#0965fa]" : "border-transparent text-[#9ca3af] hover:text-[#374151]"}`}
              style={{ fontFamily: PP, outline: "none" }}>
              {tab === "guided" ? "🎯 Guided" : tab === "custom" ? "✏️ Custom" : "📋 History"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f5f6fb]">

        {/* ── GUIDED SETUP ─────────────────────────────────────────────────── */}
        {setupTab === "guided" && (
          <div className="px-6 py-5 max-w-3xl mx-auto flex flex-col gap-4">
            <div className="rounded-2xl p-3.5 border border-[#bfdbfe] bg-[#eff6ff]">
              <p className="text-[11px] text-[#1e40af] leading-relaxed" style={{ fontFamily: PP }}>
                <strong>Guided Practice</strong> — Latihan terstruktur berdasarkan subtest TKA. AI akan menganalisis performa dan mendeteksi topik yang perlu ditingkatkan.
              </p>
            </div>

            {/* A. Choose Subtest */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>A. Choose Subtest</p>
                <p className="text-[10px] text-[#9ca3af] mt-0.5" style={{ fontFamily: PP }}>Sesuai struktur TKA</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">
                {/* Wajib */}
                <div>
                  <p className="text-[10px] font-bold text-[#15803d] uppercase tracking-wide mb-2" style={{ fontFamily: PP }}>Mata Pelajaran Wajib</p>
                  <div className="flex flex-col gap-2">
                    {SUBJ_META.filter(s => s.group === "wajib").map(s => (
                      <div key={s.key} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0]"
                        onClick={() => setGSubjects(prev => prev.includes(s.key) ? prev.filter(k => k !== s.key) : [...prev, s.key])}
                        style={{ cursor: "pointer" }}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#22c55e]" />
                          <span className="text-[12px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{s.emoji} {s.label}</span>
                        </div>
                        <Toggle on={gSubjects.includes(s.key)} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Pilihan */}
                {["saintek", "sosial"].map(grp => (
                  <div key={grp}>
                    <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wide mb-2" style={{ fontFamily: PP }}>Kelompok {grp}</p>
                    <div className="flex flex-col gap-1.5">
                      {SUBJ_META.filter(s => s.group === grp).map(s => (
                        <div key={s.key}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${gSubjects.includes(s.key) ? "border-[#0965fa] bg-[#f0f6ff]" : "border-[rgba(0,0,0,0.07)] bg-[#fafbff] hover:border-[#0965fa]"}`}
                          onClick={() => setGSubjects(prev => prev.includes(s.key) ? prev.filter(k => k !== s.key) : [...prev, s.key])}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${gSubjects.includes(s.key) ? "border-[#0965fa] bg-[#0965fa]" : "border-[#d1d5db]"}`}>
                              {gSubjects.includes(s.key) && <Check size={9} className="text-white" />}
                            </div>
                            <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>{s.emoji} {s.label}</span>
                          </div>
                          <span className="text-[9px] text-[#9ca3af]" style={{ fontFamily: PP }}>{(QBANK[s.key] ?? []).length} soal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B. Number of Questions */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>B. Number of Questions</p>
              </div>
              <div className="px-5 py-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {[10, 20, 30, 40, 50].map(n => (
                    <button key={n} onClick={() => setGNumQ(n)}
                      className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${gNumQ === n ? "bg-[#0965fa] text-white border-[#0965fa]" : "border-[rgba(0,0,0,0.1)] text-[#374151] hover:border-[#0965fa]"}`}
                      style={{ fontFamily: PP, outline: "none" }}>{n}</button>
                  ))}
                  <button onClick={() => setGNumQ("custom")}
                    className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${gNumQ === "custom" ? "bg-[#0965fa] text-white border-[#0965fa]" : "border-[rgba(0,0,0,0.1)] text-[#374151] hover:border-[#0965fa]"}`}
                    style={{ fontFamily: PP, outline: "none" }}>Custom</button>
                </div>
                {gNumQ === "custom" && (
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={200} value={gCustomNum}
                      onChange={e => setGCustomNum(Number(e.target.value))}
                      className="w-24 px-3 py-2 text-[13px] font-bold text-center border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none focus:border-[#0965fa]"
                      style={{ fontFamily: PP }} />
                    <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>soal</span>
                  </div>
                )}
              </div>
            </div>

            {/* C. Timer */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>C. Timer</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex gap-2">
                  {([false, true] as const).map(v => (
                    <button key={String(v)} onClick={() => setGTimerOn(v)}
                      className={`flex-1 py-2 rounded-xl text-[12px] font-bold border transition-all ${gTimerOn === v ? "bg-[#0965fa] text-white border-[#0965fa]" : "border-[rgba(0,0,0,0.1)] text-[#374151]"}`}
                      style={{ fontFamily: PP, outline: "none" }}>
                      {v ? "⏱ On" : "Off"}
                    </button>
                  ))}
                </div>
                {gTimerOn && (
                  <div className="flex flex-wrap gap-2">
                    {[15, 30, 45, 60].map(n => (
                      <button key={n} onClick={() => setGTimerMin(n)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${gTimerMin === n ? "bg-[#8b5cf6] text-white border-[#8b5cf6]" : "border-[rgba(0,0,0,0.1)] text-[#374151]"}`}
                        style={{ fontFamily: PP, outline: "none" }}>{n} menit</button>
                    ))}
                    <button onClick={() => setGTimerMin("custom")}
                      className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${gTimerMin === "custom" ? "bg-[#8b5cf6] text-white border-[#8b5cf6]" : "border-[rgba(0,0,0,0.1)] text-[#374151]"}`}
                      style={{ fontFamily: PP, outline: "none" }}>Custom</button>
                    {gTimerMin === "custom" && (
                      <div className="flex items-center gap-2 w-full">
                        <input type="number" min={1} max={180} value={gCustomTimer}
                          onChange={e => setGCustomTimer(Number(e.target.value))}
                          className="w-24 px-3 py-2 text-[12px] font-bold text-center border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none focus:border-[#8b5cf6]"
                          style={{ fontFamily: PP }} />
                        <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>menit</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* D. Review Mode */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>D. Review Mode</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-2">
                {(["per-soal", "setelah-selesai"] as const).map(m => (
                  <label key={m}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${gReviewMode === m ? "border-[#0965fa] bg-[#eff6ff]" : "border-[rgba(0,0,0,0.08)] hover:border-[#0965fa]"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${gReviewMode === m ? "border-[#0965fa] bg-[#0965fa]" : "border-[#d1d5db]"}`}>
                      {gReviewMode === m && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>
                      {m === "per-soal" ? "Per Soal — tampilkan pembahasan langsung" : "Setelah Selesai — tampilkan semua pembahasan di akhir"}
                    </span>
                    <input type="radio" className="sr-only" checked={gReviewMode === m} onChange={() => setGReviewMode(m)} />
                  </label>
                ))}
              </div>
            </div>

            <button onClick={startGuided} disabled={gSubjects.length === 0}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-40"
              style={{ background: "linear-gradient(90deg,#0965fa,#00b2dd)", fontFamily: PP, outline: "none" }}>
              <Sparkles size={16} /> 🚀 Start Guided Practice
            </button>
          </div>
        )}

        {/* ── CUSTOM SETUP ─────────────────────────────────────────────────── */}
        {setupTab === "custom" && (
          <div className="px-6 py-5 max-w-3xl mx-auto flex flex-col gap-4">
            <div className="rounded-2xl p-3.5 border border-[#ddd6fe] bg-[#f5f3ff]">
              <p className="text-[11px] text-[#5b21b6] leading-relaxed" style={{ fontFamily: PP }}>
                <strong>Custom Practice</strong> — Buat sesi latihan sendiri. AI akan menganalisis performa lintas mata pelajaran dan memberikan rekomendasi prioritas belajar.
              </p>
            </div>

            {/* Practice Name */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Nama Sesi Latihan</p>
              </div>
              <div className="px-5 py-4">
                <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Contoh: Review TKA Matematika"
                  className="w-full px-4 py-3 text-[13px] font-semibold border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none focus:border-[#8b5cf6] text-[#1a1d2e]"
                  style={{ fontFamily: PP }} />
              </div>
            </div>

            {/* Choose Subjects */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Choose Subjects</p>
                  <span className="text-[10px] font-bold text-[#8b5cf6] bg-[#f5f3ff] px-2 py-1 rounded-lg" style={{ fontFamily: PP }}>{cSubjects.length} dipilih</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="grid grid-cols-3 gap-2">
                  {SUBJ_META.map(s => {
                    const active = cSubjects.includes(s.key);
                    return (
                      <button key={s.key}
                        onClick={() => setCSubjects(prev => prev.includes(s.key) ? prev.filter(k => k !== s.key) : [...prev, s.key])}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all"
                        style={{ background: active ? s.color : "white", borderColor: active ? s.color : "rgba(0,0,0,0.08)", outline: "none" }}>
                        <span className="text-base">{s.emoji}</span>
                        <span className="text-[11px] font-bold truncate" style={{ color: active ? "white" : "#374151", fontFamily: PP }}>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Number of Questions */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Number of Questions</p>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <input type="number" min={1} max={200} value={cNumQ}
                  onChange={e => setCNumQ(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-[13px] font-bold text-center border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none focus:border-[#8b5cf6]"
                  style={{ fontFamily: PP }} />
                <div className="flex gap-1.5">
                  {[10, 20, 30, 50].map(n => (
                    <button key={n} onClick={() => setCNumQ(n)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${cNumQ === n ? "bg-[#8b5cf6] text-white border-[#8b5cf6]" : "border-[rgba(0,0,0,0.1)] text-[#9ca3af]"}`}
                      style={{ fontFamily: PP, outline: "none" }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Timer</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex gap-2">
                  {([false, true] as const).map(v => (
                    <button key={String(v)} onClick={() => setCTimerOn(v)}
                      className={`flex-1 py-2 rounded-xl text-[12px] font-bold border transition-all ${cTimerOn === v ? "bg-[#8b5cf6] text-white border-[#8b5cf6]" : "border-[rgba(0,0,0,0.1)] text-[#374151]"}`}
                      style={{ fontFamily: PP, outline: "none" }}>{v ? "⏱ On" : "Off"}</button>
                  ))}
                </div>
                {cTimerOn && (
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={180} value={cTimerMin}
                      onChange={e => setCTimerMin(Number(e.target.value))}
                      className="w-24 px-3 py-2 text-[12px] font-bold text-center border border-[rgba(0,0,0,0.1)] rounded-xl bg-[#f8f9fc] outline-none focus:border-[#8b5cf6]"
                      style={{ fontFamily: PP }} />
                    <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>menit</span>
                  </div>
                )}
              </div>
            </div>

            {/* Review Mode */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>Review Mode</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-2">
                {(["per-soal", "setelah-selesai"] as const).map(m => (
                  <label key={m}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${cReviewMode === m ? "border-[#8b5cf6] bg-[#f5f3ff]" : "border-[rgba(0,0,0,0.08)] hover:border-[#8b5cf6]"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${cReviewMode === m ? "border-[#8b5cf6] bg-[#8b5cf6]" : "border-[#d1d5db]"}`}>
                      {cReviewMode === m && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-[12px] font-semibold text-[#374151]" style={{ fontFamily: PP }}>
                      {m === "per-soal" ? "Per Soal — pembahasan langsung setiap menjawab" : "Setelah Selesai — semua pembahasan tampil di akhir"}
                    </span>
                    <input type="radio" className="sr-only" checked={cReviewMode === m} onChange={() => setCReviewMode(m)} />
                  </label>
                ))}
              </div>
            </div>

            <button onClick={startCustom} disabled={cSubjects.length === 0}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-40"
              style={{ background: "linear-gradient(90deg,#8b5cf6,#0965fa)", fontFamily: PP, outline: "none" }}>
              <Sparkles size={16} /> ✏️ Generate Practice
            </button>
          </div>
        )}

        {/* ── HISTORY & PROGRESS ───────────────────────────────────────────── */}
        {setupTab === "history" && (
          <div className="px-6 py-5 max-w-3xl mx-auto flex flex-col gap-4">

            {/* AI Progress */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>📈 AI Progress — 30 Hari Terakhir</p>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-end gap-6 mb-4">
                  <div className="flex items-end gap-4">
                    <div className="text-center">
                      <p className="text-[9px] text-[#9ca3af] mb-1" style={{ fontFamily: PP }}>Awal</p>
                      <p className="text-[24px] font-black text-[#9ca3af]" style={{ fontFamily: PP }}>72%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-[#9ca3af] mb-1" style={{ fontFamily: PP }}>Sekarang</p>
                      <p className="text-[24px] font-black text-[#22c55e]" style={{ fontFamily: PP }}>81%</p>
                    </div>
                  </div>
                  <span className="text-[12px] font-black text-[#22c55e] bg-[#f0fdf4] px-2.5 py-1 rounded-full border border-[#bbf7d0] mb-1" style={{ fontFamily: PP }}>↑ +9%</span>
                  <div className="flex-1">
                    <TrendLine data={PROGRESS_TREND} color="#0965fa" />
                    <div className="flex justify-between mt-1">
                      {["30d", "25d", "20d", "15d", "10d", "5d", "Hari ini"].map(d => (
                        <span key={d} className="text-[7px] text-[#9ca3af]" style={{ fontFamily: PP }}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subject trends */}
                <div className="border-t border-[rgba(0,0,0,0.05)] pt-3">
                  <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-2.5" style={{ fontFamily: PP }}>AI Learning Trend</p>
                  <div className="flex flex-col gap-2">
                    {LEARNING_TRENDS.map(t => (
                      <div key={t.label} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#f8faff]">
                        <span className="text-[12px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>{t.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#9ca3af]" style={{ fontFamily: PP }}>{t.prev}% → {t.curr}%</span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.trend === "up" ? "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]"
                            : t.trend === "down" ? "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]"
                            : "bg-[#f5f6fb] text-[#6b7280] border-[rgba(0,0,0,0.08)]"
                          }`} style={{ fontFamily: PP }}>
                            {t.trend === "up" ? <TrendingUp size={10} /> : t.trend === "down" ? <TrendingDown size={10} /> : <Minus size={10} />}
                            {t.trend === "up" ? "↑ Improving" : t.trend === "down" ? "↓ Declining" : "→ Stable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Practice History */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[rgba(0,0,0,0.05)]">
                <p className="text-[13px] font-bold text-[#1a1d2e]" style={{ fontFamily: PP }}>📋 Practice History</p>
              </div>
              <div className="divide-y divide-[rgba(0,0,0,0.04)]">
                {PRACTICE_HISTORY.map(h => {
                  const expanded = expandHistory === h.id;
                  const c = h.pct >= 80 ? "#22c55e" : h.pct >= 60 ? "#f1ad00" : "#ef4444";
                  return (
                    <div key={h.id}>
                      <button
                        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#f8faff] transition-colors text-left"
                        style={{ outline: "none" }}
                        onClick={() => setExpandHistory(expanded ? null : h.id)}>
                        <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-base"
                          style={{ background: h.mode === "guided" ? "#eff6ff" : "#f5f3ff" }}>
                          {h.mode === "guided" ? "🎯" : "✏️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-[#1a1d2e] truncate" style={{ fontFamily: PP }}>{h.label}</p>
                          <p className="text-[10px] text-[#9ca3af]" style={{ fontFamily: PP }}>{h.date} · {h.dur} · {h.mode === "guided" ? "Guided" : "Custom"}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c}18` }}>
                            <span className="text-[13px] font-black" style={{ color: c, fontFamily: PP }}>{h.pct}%</span>
                          </div>
                          <ChevronRight size={13} className={`text-[#9ca3af] transition-transform ${expanded ? "rotate-90" : ""}`} />
                        </div>
                      </button>
                      {expanded && (
                        <div className="px-5 pb-4">
                          <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#f8faff] rounded-xl border border-[rgba(0,0,0,0.06)]">
                            {[["Total Soal", h.total, "#1a1d2e"], ["Benar", h.correct, "#22c55e"], ["Salah", h.total - h.correct, "#ef4444"]].map(([k, v, col]) => (
                              <div key={k as string} className="text-center">
                                <p className="text-[9px] text-[#9ca3af] mb-1" style={{ fontFamily: PP }}>{k}</p>
                                <p className="text-[17px] font-black" style={{ color: col as string, fontFamily: PP }}>{v}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
