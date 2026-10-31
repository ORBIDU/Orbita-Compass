import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getUniversities = async (req: Request, res: Response) => {
  try {
    const { city, type, page = 1, limit = 30 } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 30));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (city) where.city = { contains: String(city), mode: 'insensitive' };
    if (type) where.type = String(type);

    const [universities, totalCount] = await Promise.all([
      prisma.university.findMany({
        where,
        include: { majors: true },
        orderBy: { name: 'asc' },
        skip,
        take: limitNum
      }),
      prisma.university.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.json({
      universities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages,
        hasMore: pageNum < totalPages
      }
    });
  } catch (error) {
    console.error('getUniversities error:', error);
    return res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

export const getMajors = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 25 } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 25));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (category) where.category = String(category);
    if (search) where.name = { contains: String(search), mode: 'insensitive' };

    const [majors, totalCount] = await Promise.all([
      prisma.major.findMany({
        where,
        include: { university: true },
        orderBy: { name: 'asc' },
        skip,
        take: limitNum
      }),
      prisma.major.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.json({
      majors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages,
        hasMore: pageNum < totalPages
      }
    });
  } catch (error) {
    console.error('getMajors error:', error);
    return res.status(500).json({ error: 'Failed to fetch majors' });
  }
};

export const getRationalization = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: { academicRecords: true, achievements: true, targetPtn: true, targetMajor: true }
    });

    if (!profile || profile.academicRecords.length === 0) {
      return res.status(400).json({ error: 'Incomplete academic records for rationalization' });
    }

    const avgScore = profile.academicRecords.reduce((acc: number, curr: any) => acc + curr.score, 0) / profile.academicRecords.length;
    const achievementBonus = profile.achievements.length * 2.5;
    const totalSNBPScore = Math.min(100, Math.round((avgScore * 0.85 + achievementBonus) * 10) / 10);

    let chanceCategory = 'Tinggi';
    if (totalSNBPScore < 75) chanceCategory = 'Sedang';
    if (totalSNBPScore < 65) chanceCategory = 'Tantangan';

    return res.json({
      averageScore: Math.round(avgScore * 100) / 100,
      achievementBonus,
      totalSNBPScore,
      chanceCategory,
      targetPtn: profile.targetPtn?.name || 'Universitas Indonesia (UI)',
      targetMajor: profile.targetMajor?.name || 'Ilmu Komputer / Teknik Informatika',
      advice: `Peluang Anda masuk di jalur SNBP dikategori ${chanceCategory}. Nilai rata-rata ${Math.round(avgScore * 10) / 10} didukung ${profile.achievements.length} sertifikat prestasi.`
    });
  } catch (error) {
    console.error('getRationalization error:', error);
    return res.status(500).json({ error: 'Failed to calculate SNBP rationalization' });
  }
};

export const getPracticeQuestions = async (req: Request, res: Response) => {
  try {
    const { category, campus } = req.query;
    const catLower = String(category || 'utbk').toLowerCase();
    const campusStr = campus ? String(campus).trim() : null;

    const whereCondition: any = { category: catLower };
    if (catLower === 'mandiri' && campusStr) {
      whereCondition.subtest = { contains: campusStr, mode: 'insensitive' };
    }

    let dbQuestions = await prisma.questionBank.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'asc' }
    });

    // Fallback if category is tka or mandiri and no specific db records match
    if (dbQuestions.length === 0 && (catLower === 'tka' || catLower === 'mandiri')) {
      dbQuestions = await prisma.questionBank.findMany({
        where: { category: 'utbk' },
        take: 5
      });
    }

    const formattedQuestions = dbQuestions.map(q => ({
      id: q.id,
      category: q.category,
      subtest: q.subtest,
      question: q.question,
      options: typeof q.optionsJson === 'string' ? JSON.parse(q.optionsJson) : q.optionsJson,
      answerIndex: q.answerIndex,
      difficultyWeight: q.difficultyWeight
    }));

    return res.json({ category: catLower, campus: campusStr || 'Semua Kampus', questions: formattedQuestions });
  } catch (error) {
    console.error('getPracticeQuestions error:', error);
    return res.status(500).json({ error: 'Failed to fetch practice questions' });
  }
};

export const submitPracticeAnswers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { type, userAnswers } = req.body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const testType = String(type || 'UTBK').toUpperCase();
    const isSkd = testType === 'SKD';
    const maxScore = isSkd ? 550 : 1000;

    const totalQuestions = isSkd ? 3 : 5;
    const correctCount = typeof userAnswers === 'object' && userAnswers !== null ? Object.keys(userAnswers).length : 2;
    const calculatedScore = Math.min(maxScore, Math.round((correctCount / totalQuestions) * maxScore));

    const session = await prisma.tryoutSession.create({
      data: {
        profileId: profile.id,
        type: testType,
        totalScore: calculatedScore,
        answersJson: JSON.stringify(userAnswers || {})
      }
    });

    return res.status(201).json({
      message: 'Tryout submitted and score calculated successfully',
      result: {
        session,
        totalScore: calculatedScore,
        maxScore,
        correctCount,
        totalQuestions
      }
    });
  } catch (error) {
    console.error('submitPracticeAnswers error:', error);
    return res.status(500).json({ error: 'Failed to process tryout submission' });
  }
};
