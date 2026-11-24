import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { scrapeAndSeedAll146Ptns } from './scrape_all_146_ptn';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Official Full Ingestion of ALL 146 PTNs in Indonesia...');

  // 1. Execute Full Ingestion of ALL 146 Official PTNs (76 Akademik, 44 Vokasi, 26 PTKIN)
  await scrapeAndSeedAll146Ptns();

  // Fetch UI & UGM for demo profiles
  const ui = await prisma.university.findFirst({ where: { code: '311' } });
  const ugm = await prisma.university.findFirst({ where: { code: '361' } });
  const csUI = await prisma.major.findFirst({ where: { name: { contains: 'Komputer' } } });
  const manUGM = await prisma.major.findFirst({ where: { name: { contains: 'Manajemen' } } });

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Seed Demo Accounts
  const student = await prisma.user.upsert({
    where: { email: 'siswa@orbidu.id' },
    update: {},
    create: {
      email: 'siswa@orbidu.id',
      passwordHash,
      name: 'Ahmad Rizki',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      profile: {
        create: {
          schoolName: 'SMA Negeri 1 Jakarta',
          grade: 12,
          majorTrack: 'IPA',
          city: 'Jakarta Pusat',
          targetPtnId: ui?.id,
          targetMajorId: csUI?.id,
          assessment: {
            create: { technology: 88, research: 82, creativity: 75, leadership: 70, communication: 78 }
          },
          reflection: {
            create: {
              interests: JSON.stringify(['Software Engineering', 'AI & Machine Learning', 'Robotics']),
              careerGoals: JSON.stringify(['AI Engineer', 'Technology Entrepreneur']),
              motivation: 'Ingin menciptakan solusi teknologi cerdas untuk pendidikan Indonesia.'
            }
          },
          academicRecords: {
            create: [
              { semester: 1, subject: 'Matematika Wajib', score: 88, kkm: 75 },
              { semester: 1, subject: 'Fisika', score: 85, kkm: 75 },
              { semester: 1, subject: 'Bahasa Indonesia', score: 90, kkm: 75 },
              { semester: 2, subject: 'Matematika Wajib', score: 90, kkm: 75 },
              { semester: 2, subject: 'Fisika', score: 89, kkm: 75 },
              { semester: 3, subject: 'Matematika Wajib', score: 92, kkm: 75 },
              { semester: 3, subject: 'Fisika', score: 91, kkm: 75 },
              { semester: 4, subject: 'Matematika Wajib', score: 94, kkm: 75 },
              { semester: 4, subject: 'Fisika', score: 93, kkm: 75 },
              { semester: 5, subject: 'Matematika Wajib', score: 95, kkm: 75 },
              { semester: 5, subject: 'Fisika', score: 94, kkm: 75 },
            ]
          },
          achievements: {
            create: [
              { title: 'Juara 1 Olimpiade Sains Nasional (OSN) Komputer', category: 'Academic', level: 'National', year: 2025 },
              { title: 'Juara 2 Hackathon Pelajar SMA Se-DKI Jakarta', category: 'Academic', level: 'Province', year: 2025 }
            ]
          }
        }
      }
    }
  });

  const bkTeacher = await prisma.user.upsert({
    where: { email: 'gurubk@orbidu.id' },
    update: {},
    create: {
      email: 'gurubk@orbidu.id',
      passwordHash,
      name: 'Bapak Ahmad, S.Pd.',
      role: 'BK_TEACHER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@orbidu.id' },
    update: {},
    create: {
      email: 'admin@orbidu.id',
      passwordHash,
      name: 'Administrator ORBIDU',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    }
  });

  const studentSoshum = await prisma.user.upsert({
    where: { email: 'budi@orbidu.id' },
    update: {},
    create: {
      email: 'budi@orbidu.id',
      passwordHash,
      name: 'Budi Pratama',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      profile: {
        create: {
          schoolName: 'SMA Negeri 3 Bandung',
          grade: 12,
          majorTrack: 'IPS',
          city: 'Bandung',
          targetPtnId: ugm?.id,
          targetMajorId: manUGM?.id,
          assessment: {
            create: { technology: 65, research: 78, creativity: 85, leadership: 92, communication: 90 }
          }
        }
      }
    }
  });

  const totalUnivs = await prisma.university.count();
  const totalMajors = await prisma.major.count();

  console.log('🎉 100% COMPLETE INGESTION OF ALL 146 OFFICIAL PTNS FINISHED!');
  console.log({
    total_official_institutions: totalUnivs,
    total_majors_in_db: totalMajors,
    demo_accounts: [student.email, studentSoshum.email, bkTeacher.email, admin.email]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
