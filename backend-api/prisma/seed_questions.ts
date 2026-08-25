import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const QUESTIONS_DATA = [
  // UTBK Questions
  {
    category: 'utbk',
    subtest: 'Penalaran Umum',
    question: 'Semua siswa yang tekun belajar lulus SNBT. Sebagian siswa SMA 1 adalah siswa yang tekun belajar. Kesimpulan yang sah adalah...',
    optionsJson: JSON.stringify([
      'Sebagian siswa SMA 1 lulus SNBT',
      'Semua siswa SMA 1 lulus SNBT',
      'Rian pasti tidak lulus SNBT',
      'Semua yang lulus SNBT adalah siswa SMA 1'
    ]),
    answerIndex: 0,
    difficultyWeight: 1.25
  },
  {
    category: 'utbk',
    subtest: 'Pengetahuan Kuantitatif',
    question: 'Jika 3x + 5 = 20, maka nilai dari 6x - 2 adalah...',
    optionsJson: JSON.stringify(['28', '30', '32', '34']),
    answerIndex: 0,
    difficultyWeight: 1.15
  },
  {
    category: 'utbk',
    subtest: 'Literasi Bahasa Indonesia',
    question: 'Gagasan utama paragraf mengenai evaluasi kebijakan SNPMB Kemdikbud adalah...',
    optionsJson: JSON.stringify([
      'Peningkatan transparansi kuota daya tampung SNBP dan SNBT',
      'Penurunan jumlah lulusan SMA di Indonesia',
      'Perubahan jadwal ujian mandiri di semua kampus',
      'Pentingnya ujian tulis berbasis kertas'
    ]),
    answerIndex: 0,
    difficultyWeight: 1.30
  },
  {
    category: 'utbk',
    subtest: 'Literasi Bahasa Inggris',
    question: 'What is the primary objective of adaptive learning technology in modern education platforms?',
    optionsJson: JSON.stringify([
      'To tailor educational roadmaps to individual student strengths',
      'To replace human teachers in public schools',
      'To reduce test scores across universities',
      'To eliminate exams completely'
    ]),
    answerIndex: 0,
    difficultyWeight: 1.35
  },
  {
    category: 'utbk',
    subtest: 'Penalaran Matematika',
    question: 'Sebuah tangki air diisi dengan laju 15 liter/menit. Jika kapasitas tangki 450 liter dan sudah terisi 150 liter, berapa menit lagi tangki akan penuh?',
    optionsJson: JSON.stringify(['20 menit', '25 menit', '30 menit', '35 menit']),
    answerIndex: 0,
    difficultyWeight: 1.40
  },

  // SKD Questions
  {
    category: 'skd',
    subtest: 'Tes Wawasan Kebangsaan (TWK)',
    question: 'Pancasila sebagai ideologi terbuka memuat nilai-nilai dasar, instrumental, dan praksis. Kedudukan UUD 1945 dalam konteks tersebut adalah sebagai...',
    optionsJson: JSON.stringify([
      'Nilai Instrumental',
      'Nilai Dasar',
      'Nilai Praksis',
      'Nilai Substantif'
    ]),
    answerIndex: 0,
    difficultyWeight: 1.30
  },
  {
    category: 'skd',
    subtest: 'Tes Inteligensia Umum (TIU)',
    question: 'Analogi Kata: KERTAS : PENA = ... : ...',
    optionsJson: JSON.stringify([
      'PAPAN TULIS : KAPUR',
      'DINDING : CAT',
      'MEJA : KURSI',
      'MEJA : TAPLAK'
    ]),
    answerIndex: 0,
    difficultyWeight: 1.20
  },
  {
    category: 'skd',
    subtest: 'Tes Karakteristik Pribadi (TKP)',
    question: 'Ketika instansi tempat Anda bertugas di Sekolah Kedinasan menghadapi perubahan sistem digital baru, sikap Anda adalah...',
    optionsJson: JSON.stringify([
      'Mempelajari sistem baru dengan proaktif dan membantu rekan lain',
      'Menunggu instruksi lebih lanjut dari atasan',
      'Meminta kembali ke sistem lama',
      'Menyerahkan tugas digital ke staf IT'
    ]),
    answerIndex: 0,
    difficultyWeight: 1.50
  },

  // TKA (Tes Kemampuan Akademik - SNBP Mapel Pendukung)
  {
    category: 'tka',
    subtest: 'TKA Fisika',
    question: 'Sebuah mobil bermassa 1000 kg bergerak dengan kecepatan 20 m/s. Energi kinetik mobil tersebut adalah...',
    optionsJson: JSON.stringify(['200.000 Joule', '100.000 Joule', '400.000 Joule', '50.000 Joule']),
    answerIndex: 0,
    difficultyWeight: 1.35
  },
  {
    category: 'tka',
    subtest: 'TKA Ekonomi',
    question: 'Jika harga barang X naik 10% menyebabkan jumlah penawaran naik 15%, maka elastisitas penawaran bersifat...',
    optionsJson: JSON.stringify(['Elastis (E > 1)', 'Inelastis (E < 1)', 'Elastis Uniter (E = 1)', 'Inelastis Sempurna']),
    answerIndex: 0,
    difficultyWeight: 1.25
  },

  // Mandiri per-Kampus
  {
    category: 'mandiri',
    subtest: 'Simak UI - Kemampuan Dasar',
    question: '[SIMAK UI] Matriks A berordo 2x2 memenuhi A^2 - 3A + 2I = 0. Manakah determinan A yang mungkin?',
    optionsJson: JSON.stringify(['1 atau 2', '0 atau 3', '1 atau 4', '-1 atau 2']),
    answerIndex: 0,
    difficultyWeight: 1.50
  },
  {
    category: 'mandiri',
    subtest: 'UM UGM - Utul UGM',
    question: '[UM UGM] Persamaan reaksi redoks yang sudah setara menunjukkan koefisien KMnO4 sebesar...',
    optionsJson: JSON.stringify(['2', '3', '5', '8']),
    answerIndex: 0,
    difficultyWeight: 1.45
  }
];

export async function seedQuestionBank() {
  console.log('📝 Seeding QuestionBank Table in Database...');
  for (const q of QUESTIONS_DATA) {
    const existing = await prisma.questionBank.findFirst({
      where: { question: q.question }
    });
    if (!existing) {
      await prisma.questionBank.create({ data: q });
    }
  }
  console.log(`✅ Seeded ${QUESTIONS_DATA.length} practice questions in QuestionBank!`);
}

seedQuestionBank()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
