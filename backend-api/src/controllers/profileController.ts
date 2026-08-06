import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
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

    if (!profile) return res.status(404).json({ error: 'Student profile not found' });

    return res.json({ profile });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { schoolName, grade, majorTrack, city, targetPtnId, targetMajorId } = req.body;

    const profile = await prisma.studentProfile.upsert({
      where: { userId: req.user.id },
      update: { schoolName, grade, majorTrack, city, targetPtnId, targetMajorId },
      create: {
        userId: req.user.id,
        schoolName: schoolName || 'SMA Negeri 1 Jakarta',
        grade: grade || 12,
        majorTrack: majorTrack || 'IPA',
        city: city || 'Jakarta',
        targetPtnId,
        targetMajorId,
      }
    });

    return res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getRapor = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: { academicRecords: true }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    return res.json({ academicRecords: profile.academicRecords });
  } catch (error) {
    console.error('getRapor error:', error);
    return res.status(500).json({ error: 'Failed to fetch academic records' });
  }
};

export const saveRapor = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Records must be an array' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const upsertPromises = records.map((item: any) =>
      prisma.academicRecord.upsert({
        where: {
          profileId_semester_subject: {
            profileId: profile.id,
            semester: Number(item.semester),
            subject: String(item.subject),
          }
        },
        update: {
          score: Number(item.score),
          kkm: item.kkm ? Number(item.kkm) : 75.0,
        },
        create: {
          profileId: profile.id,
          semester: Number(item.semester),
          subject: String(item.subject),
          score: Number(item.score),
          kkm: item.kkm ? Number(item.kkm) : 75.0,
        }
      })
    );

    await Promise.all(upsertPromises);

    const updatedRecords = await prisma.academicRecord.findMany({
      where: { profileId: profile.id }
    });

    return res.json({ message: 'Rapor records updated successfully', records: updatedRecords });
  } catch (error) {
    console.error('saveRapor error:', error);
    return res.status(500).json({ error: 'Failed to save academic records' });
  }
};

// CRUD Achievements (Prestasi)
export const saveAchievement = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { title, category, level, year } = req.body;

    if (!title) return res.status(400).json({ error: 'Achievement title is required' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const achievement = await prisma.achievement.create({
      data: {
        profileId: profile.id,
        title,
        category: category || 'Academic',
        level: level || 'National',
        year: year ? Number(year) : new Date().getFullYear(),
      }
    });

    return res.status(201).json({ message: 'Achievement added successfully', achievement });
  } catch (error) {
    console.error('saveAchievement error:', error);
    return res.status(500).json({ error: 'Failed to save achievement' });
  }
};

export const deleteAchievement = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    await prisma.achievement.delete({
      where: { id }
    });

    return res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('deleteAchievement error:', error);
    return res.status(500).json({ error: 'Failed to delete achievement' });
  }
};

// CRUD Assessment (Minat Bakat)
export const saveAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { technology, research, creativity, leadership, communication } = req.body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const assessment = await prisma.assessment.upsert({
      where: { profileId: profile.id },
      update: {
        technology: Number(technology || 70),
        research: Number(research || 70),
        creativity: Number(creativity || 70),
        leadership: Number(leadership || 70),
        communication: Number(communication || 70),
      },
      create: {
        profileId: profile.id,
        technology: Number(technology || 70),
        research: Number(research || 70),
        creativity: Number(creativity || 70),
        leadership: Number(leadership || 70),
        communication: Number(communication || 70),
      }
    });

    return res.json({ message: 'Assessment updated successfully', assessment });
  } catch (error) {
    console.error('saveAssessment error:', error);
    return res.status(500).json({ error: 'Failed to save assessment' });
  }
};
