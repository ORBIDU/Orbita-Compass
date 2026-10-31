import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { generateQuestions, getBlueprintTaxonomy } from '../services/aiQuestionService';

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

export const getQuestionBlueprints = async (req: Request, res: Response) => {
  try {
    const taxonomy = getBlueprintTaxonomy();
    return res.json({
      success: true,
      totalSubtests: taxonomy.length,
      blueprints: taxonomy
    });
  } catch (error) {
    console.error('getQuestionBlueprints error:', error);
    return res.status(500).json({ error: 'Failed to retrieve question blueprints' });
  }
};

export const generateAIQuestions = async (req: Request, res: Response) => {
  try {
    const { category = 'snbt', subtest, topic, count = 5, difficulty = 'medium', saveToBank = false } = req.body;
    const result = await generateQuestions({
      category: String(category),
      subtest: subtest ? String(subtest) : undefined,
      topic: topic ? String(topic) : undefined,
      count: Number(count),
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      saveToBank: Boolean(saveToBank)
    });

    return res.json(result);
  } catch (error) {
    console.error('generateAIQuestions error:', error);
    return res.status(500).json({ error: 'Failed to generate questions with AI' });
  }
};

export const getPracticeQuestions = async (req: Request, res: Response) => {
  try {
    const { category, campus, subtest, limit = 10 } = req.query;
    const catLower = String(category || 'snbt').toLowerCase();
    const campusStr = campus ? String(campus).trim() : null;
    const subtestStr = subtest ? String(subtest).trim() : null;
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));

    const whereCondition: any = {};
    if (catLower === 'snbt' || catLower === 'utbk') {
      whereCondition.category = { in: ['snbt', 'utbk'] };
    } else {
      whereCondition.category = catLower;
    }

    if (catLower === 'mandiri' && campusStr) {
      whereCondition.subtest = { contains: campusStr, mode: 'insensitive' };
    } else if (subtestStr) {
      whereCondition.subtest = { contains: subtestStr, mode: 'insensitive' };
    }

    let dbQuestions = await prisma.questionBank.findMany({
      where: whereCondition,
      take: limitNum,
      orderBy: { createdAt: 'asc' }
    });

    // Fallback if specific subtest or category not yet in DB
    if (dbQuestions.length === 0) {
      dbQuestions = await prisma.questionBank.findMany({
        where: { category: { in: ['snbt', 'utbk'] } },
        take: limitNum
      });
    }

    // Questions returned WITHOUT answerIndex and explanation (Contract 1.5)
    const formattedQuestions = dbQuestions.map(q => ({
      id: q.id,
      category: q.category,
      subtest: q.subtest,
      topic: q.topic || undefined,
      question: q.question,
      options: typeof q.optionsJson === 'string' ? JSON.parse(q.optionsJson) : q.optionsJson,
      difficultyWeight: q.difficultyWeight
    }));

    return res.json({
      category: catLower,
      subtest: subtestStr || 'Semua Subtes',
      campus: campusStr || 'Semua Kampus',
      total: formattedQuestions.length,
      questions: formattedQuestions
    });
  } catch (error) {
    console.error('getPracticeQuestions error:', error);
    return res.status(500).json({ error: 'Failed to fetch practice questions' });
  }
};

export const submitPracticeAnswers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { type, userAnswers } = req.body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const testType = String(type || 'UTBK').toUpperCase();
    const isSkd = testType === 'SKD';
    const maxScore = isSkd ? 550 : 1000;

    // Fetch questions from DB to evaluate server-side
    const answersObj = typeof userAnswers === 'object' && userAnswers !== null ? userAnswers : {};
    const questionIds = Object.keys(answersObj);

    let correctCount = 0;
    const reviewItems: any[] = [];

    if (questionIds.length > 0) {
      const questions = await prisma.questionBank.findMany({
        where: { id: { in: questionIds } }
      });

      for (const q of questions) {
        const chosen = answersObj[q.id];
        const isCorrect = chosen !== undefined && Number(chosen) === q.answerIndex;
        if (isCorrect) correctCount++;

        reviewItems.push({
          questionId: q.id,
          subtest: q.subtest,
          topic: q.topic || undefined,
          chosenIndex: chosen !== undefined ? Number(chosen) : null,
          answerIndex: q.answerIndex,
          isCorrect,
          explanation: q.explanation || `Jawaban benar: pilihan ke-${q.answerIndex + 1}.`
        });
      }
    }

    const totalQuestions = Math.max(1, questionIds.length);
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
        sessionId: session.id,
        totalScore: calculatedScore,
        maxScore,
        correctCount,
        totalQuestions,
        answers: reviewItems
      }
    });
  } catch (error) {
    console.error('submitPracticeAnswers error:', error);
    return res.status(500).json({ error: 'Failed to process tryout submission' });
  }
};
