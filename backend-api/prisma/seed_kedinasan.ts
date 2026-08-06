import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Official Indonesian Sekolah Kedinasan (PTK - Perguruan Tinggi Kedinasan)
const KEDINASAN_SCHOOLS = [
  {
    code: 'PTK-01',
    name: 'PKN STAN (Politeknik Keuangan Negara STAN)',
    city: 'Tangerang Selatan',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Akuntansi Sektor Publik', category: 'Kedinasan', capacity: 480, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 480, passingGrade: 88.5, accreditation: 'Unggul' },
      { name: 'D4 Manajemen Keuangan Negara', category: 'Kedinasan', capacity: 360, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 360, passingGrade: 87.0, accreditation: 'Unggul' },
      { name: 'D4 Manajemen Aset Publik', category: 'Kedinasan', capacity: 260, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 260, passingGrade: 86.0, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-02',
    name: 'IPDN (Institut Pemerintahan Dalam Negeri)',
    city: 'Sumedang',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Tata Pemerintahan (Fakultas Politik Pemerintahan)', category: 'Kedinasan', capacity: 534, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 534, passingGrade: 89.0, accreditation: 'Unggul' },
      { name: 'D4 Manajemen Pemerintahan', category: 'Kedinasan', capacity: 420, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 420, passingGrade: 87.5, accreditation: 'Unggul' },
      { name: 'D4 Pembangunan Pemberdayaan Masyarakat', category: 'Kedinasan', capacity: 260, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 260, passingGrade: 86.5, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-03',
    name: 'Politeknik Statistika STIS (BPS)',
    city: 'Jakarta Timur',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Komputasi Statistik', category: 'Kedinasan', capacity: 250, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 250, passingGrade: 91.5, accreditation: 'Unggul' },
      { name: 'D4 Statistika', category: 'Kedinasan', capacity: 200, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 200, passingGrade: 90.0, accreditation: 'Unggul' },
      { name: 'D3 Statistika', category: 'Kedinasan', capacity: 100, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 100, passingGrade: 88.0, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-04',
    name: 'STIN (Sekolah Tinggi Intelijen Negara - BIN)',
    city: 'Bogor',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'S1 Agen Intelijen (Fakultas Intelijen Negara)', category: 'Kedinasan', capacity: 200, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 200, passingGrade: 92.0, accreditation: 'Unggul' },
      { name: 'S1 Teknologi Intelijen / Cyber Intelligence', category: 'Kedinasan', capacity: 100, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 100, passingGrade: 93.0, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-05',
    name: 'Poltek SSN (Politeknik Siber dan Sandi Negara - BSSN)',
    city: 'Bogor',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Rekayasa Kriptografi', category: 'Kedinasan', capacity: 50, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 50, passingGrade: 94.0, accreditation: 'Unggul' },
      { name: 'D4 Rekayasa Perangkat Keras Kriptografi', category: 'Kedinasan', capacity: 40, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 40, passingGrade: 92.5, accreditation: 'Unggul' },
      { name: 'D4 Rekayasa Keamanan Siber', category: 'Kedinasan', capacity: 60, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 60, passingGrade: 93.5, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-06',
    name: 'STMKG (Sekolah Tinggi Meteorologi Klimatologi dan Geofisika - BMKG)',
    city: 'Tangerang Selatan',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Meteorologi', category: 'Kedinasan', capacity: 120, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 120, passingGrade: 89.5, accreditation: 'Unggul' },
      { name: 'D4 Klimatologi', category: 'Kedinasan', capacity: 80, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 80, passingGrade: 88.0, accreditation: 'Unggul' },
      { name: 'D4 Geofisika', category: 'Kedinasan', capacity: 60, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 60, passingGrade: 88.5, accreditation: 'Unggul' },
      { name: 'D4 Instrumentasi MKG', category: 'Kedinasan', capacity: 50, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 50, passingGrade: 87.5, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-07',
    name: 'Poltekip (Politeknik Ilmu Pemasyarakatan - Kemenkumham)',
    city: 'Depok',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Manajemen Pemasyarakatan', category: 'Kedinasan', capacity: 150, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 150, passingGrade: 88.0, accreditation: 'Unggul' },
      { name: 'D4 Teknik Pemasyarakatan', category: 'Kedinasan', capacity: 150, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 150, passingGrade: 87.0, accreditation: 'Unggul' },
      { name: 'D4 Bimbingan Pemasyarakatan', category: 'Kedinasan', capacity: 100, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 100, passingGrade: 86.5, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-08',
    name: 'Poltekim (Politeknik Imigrasi - Kemenkumham)',
    city: 'Depok',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Hukum Keimigrasian', category: 'Kedinasan', capacity: 150, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 150, passingGrade: 89.0, accreditation: 'Unggul' },
      { name: 'D4 Administrasi Keimigrasian', category: 'Kedinasan', capacity: 150, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 150, passingGrade: 88.5, accreditation: 'Unggul' },
      { name: 'D4 Manajemen Teknologi Keimigrasian', category: 'Kedinasan', capacity: 100, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 100, passingGrade: 88.0, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-09',
    name: 'PTDI-STTD Bekasi (Kemenhub)',
    city: 'Bekasi',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Transportasi Darat', category: 'Kedinasan', capacity: 240, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 240, passingGrade: 87.0, accreditation: 'Unggul' },
      { name: 'D4 Teknologi Rekayasa Otomotif', category: 'Kedinasan', capacity: 120, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 120, passingGrade: 86.0, accreditation: 'Unggul' },
      { name: 'D3 Manajemen Transportasi Jalan', category: 'Kedinasan', capacity: 180, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 180, passingGrade: 85.0, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-10',
    name: 'STIP Jakarta (Sekolah Tinggi Ilmu Pelayaran - Kemenhub)',
    city: 'Jakarta Utara',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D4 Nautika Pelayaran', category: 'Kedinasan', capacity: 180, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 180, passingGrade: 86.5, accreditation: 'Unggul' },
      { name: 'D4 Teknika Pelayaran', category: 'Kedinasan', capacity: 180, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 180, passingGrade: 86.0, accreditation: 'Unggul' },
      { name: 'D4 KALK (Ketatalaksana Pelabuhan)', category: 'Kedinasan', capacity: 120, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 120, passingGrade: 85.5, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-11',
    name: 'Poltekbang Surabaya (Politeknik Penerbangan Kemenhub)',
    city: 'Surabaya',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D3 Teknik Navigasi Udara', category: 'Kedinasan', capacity: 90, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 90, passingGrade: 87.5, accreditation: 'Unggul' },
      { name: 'D3 Teknik Pesawat Udara', category: 'Kedinasan', capacity: 90, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 90, passingGrade: 87.0, accreditation: 'Unggul' },
      { name: 'D3 Manajemen Lalu Lintas Udara', category: 'Kedinasan', capacity: 90, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 90, passingGrade: 88.0, accreditation: 'Unggul' },
    ]
  },
  {
    code: 'PTK-12',
    name: 'PPI Madiun (Politeknik Perkeretaapian Indonesia)',
    city: 'Madiun',
    type: 'PTK Kedinasan',
    accreditation: 'Unggul',
    majors: [
      { name: 'D3 Teknologi Bangunan dan Jalur Perkeretaapian', category: 'Kedinasan', capacity: 72, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 72, passingGrade: 86.0, accreditation: 'Unggul' },
      { name: 'D3 Teknologi Elektro Perkeretaapian', category: 'Kedinasan', capacity: 72, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 72, passingGrade: 86.5, accreditation: 'Unggul' },
      { name: 'D3 Manajemen Transportasi Perkeretaapian', category: 'Kedinasan', capacity: 72, capacitySnbp: 0, capacitySnbt: 0, capacityMandiri: 72, passingGrade: 85.5, accreditation: 'Unggul' },
    ]
  }
];

export async function seedSekolahKedinasan() {
  console.log('🏛️ Starting Ingestion of Official Sekolah Kedinasan Indonesia (PTK)...');
  let insertedUnivs = 0;
  let insertedMajors = 0;

  for (const school of KEDINASAN_SCHOOLS) {
    const univ = await prisma.university.upsert({
      where: { code: school.code },
      update: {
        name: school.name,
        city: school.city,
        type: school.type,
        accreditation: school.accreditation,
      },
      create: {
        code: school.code,
        name: school.name,
        city: school.city,
        type: school.type,
        accreditation: school.accreditation,
      }
    });
    insertedUnivs++;

    for (const m of school.majors) {
      const existingMajor = await prisma.major.findFirst({
        where: {
          universityId: univ.id,
          name: m.name
        }
      });

      if (existingMajor) {
        await prisma.major.update({
          where: { id: existingMajor.id },
          data: {
            category: m.category,
            capacity: m.capacity,
            capacitySnbp: m.capacitySnbp,
            capacitySnbt: m.capacitySnbt,
            capacityMandiri: m.capacityMandiri,
            passingGrade: m.passingGrade,
            accreditation: m.accreditation,
          }
        });
      } else {
        await prisma.major.create({
          data: {
            universityId: univ.id,
            name: m.name,
            category: m.category,
            capacity: m.capacity,
            capacitySnbp: m.capacitySnbp,
            capacitySnbt: m.capacitySnbt,
            capacityMandiri: m.capacityMandiri,
            passingGrade: m.passingGrade,
            accreditation: m.accreditation,
          }
        });
      }
      insertedMajors++;
    }
  }

  console.log(`✅ Ingested ${insertedUnivs} Sekolah Kedinasan & ${insertedMajors} Program Studi Kedinasan!`);
}

seedSekolahKedinasan()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
