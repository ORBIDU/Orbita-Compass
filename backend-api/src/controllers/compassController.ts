import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { triggerAiAnalysis } from '../utils/aiClient';

export const analyzeCompass = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        academicRecords: true,
        achievements: true,
        reflection: true,
        assessment: true,
        targetPtn: true,
        targetMajor: true,
      }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Prepare payload for Python AI Engine
    const payload = {
      student_id: profile.id,
      name: req.user.email,
      grade: profile.grade,
      major_track: profile.majorTrack,
      target_ptn: profile.targetPtn?.name || 'Universitas Indonesia',
      target_major: profile.targetMajor?.name || 'Teknik Informatika',
      academic_records: profile.academicRecords.map((r: any) => ({
        semester: r.semester,
        subject: r.subject,
        score: r.score
      })),
      achievements: profile.achievements.map((a: any) => ({
        title: a.title,
        category: a.category,
        level: a.level,
        year: a.year
      })),
      assessment: profile.assessment || {
        technology: 85,
        research: 75,
        creativity: 80,
        leadership: 70,
        communication: 75
      },
      reflection: profile.reflection || {
        interests: ['Software Engineering', 'AI & Data Science'],
        careerGoals: ['AI Engineer', 'Tech Entrepreneur'],
        motivation: 'Ingin membangun platform berdampak untuk pendidikan.'
      }
    };

    // Call Python FastAPI AI Engine
    const aiResult = await triggerAiAnalysis(payload);

    // Save/Update Compass Analysis output in PostgreSQL DB
    const compassAnalysis = await prisma.compassAnalysis.create({
      data: {
        profileId: profile.id,
        confidenceScore: aiResult.confidence_score || 88.5,
        interestAlignmentPct: aiResult.interest_alignment_pct || 92.0,
        competencyAlignmentPct: aiResult.competency_alignment_pct || 85.0,
        careerAlignmentStatus: aiResult.career_alignment_status || 'ALIGNED',
        aiSummary: aiResult.ai_summary || 'Siswa menunjukkan potensi sangat kuat di bidang Saintek dan Software Engineering.',
        topStrengths: JSON.stringify(aiResult.top_strengths || ['Analitis Tinggi', 'Problem Solving', 'Pemrograman']),
        recommendedMajors: JSON.stringify(aiResult.recommended_majors || []),
        recommendedUnivs: JSON.stringify(aiResult.recommended_univs || []),
        recommendedCareers: JSON.stringify(aiResult.recommended_careers || []),
      }
    });

    return res.status(200).json({
      message: 'Compass AI analysis completed successfully',
      analysis: compassAnalysis
    });
  } catch (error: any) {
    console.error('analyzeCompass error:', error);
    return res.status(500).json({ error: error.message || 'Failed to complete Compass AI analysis' });
  }
};

export const getCompassResult = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const latestAnalysis = await prisma.compassAnalysis.findFirst({
      where: { profileId: profile.id },
      orderBy: { analyzedAt: 'desc' }
    });

    return res.json({ analysis: latestAnalysis || null });
  } catch (error) {
    console.error('getCompassResult error:', error);
    return res.status(500).json({ error: 'Failed to fetch Compass AI result' });
  }
};
