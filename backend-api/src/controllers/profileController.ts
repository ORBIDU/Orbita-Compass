import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        academicRecords: { orderBy: [{ semester: 'asc' }, { subject: 'asc' }] },
        achievements: { orderBy: { createdAt: 'desc' } },
        reflection: true,
        assessment: true,
        targetPtn: true,
        targetMajor: true,
      }
    });

    if (!profile) return res.status(404).json({ error: 'Student profile not found', code: 'PROFILE_NOT_FOUND' });

    return res.json({ profile });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update Profile - Student can ONLY update targetPtnId, targetMajorId, and nickname (Contract 13.2)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { schoolName, grade, majorTrack, city, targetPtnId, targetMajorId, nickname } = req.body;
    const isStudent = req.user.role === 'STUDENT';

    // Prepare update data
    const updateData: any = {};
    if (nickname !== undefined) updateData.nickname = nickname ? String(nickname).trim().slice(0, 20) : null;
    if (targetPtnId !== undefined) updateData.targetPtnId = targetPtnId || null;
    if (targetMajorId !== undefined) updateData.targetMajorId = targetMajorId || null;

    // School data is LOCKED for students, only Admin / Teachers can modify (Contract 13.2)
    if (!isStudent) {
      if (schoolName !== undefined) updateData.schoolName = schoolName;
      if (grade !== undefined) updateData.grade = grade ? Number(grade) : null;
      if (majorTrack !== undefined) updateData.majorTrack = majorTrack;
      if (city !== undefined) updateData.city = city;
    }

    const profile = await prisma.studentProfile.upsert({
      where: { userId: req.user.id },
      update: updateData,
      create: {
        userId: req.user.id,
        nickname: nickname ? String(nickname).trim().slice(0, 20) : null,
        schoolName: isStudent ? null : schoolName || null,
        grade: isStudent ? null : grade ? Number(grade) : null,
        majorTrack: isStudent ? null : majorTrack || null,
        city: isStudent ? null : city || null,
        targetPtnId: targetPtnId || null,
        targetMajorId: targetMajorId || null,
      },
      include: {
        targetPtn: true,
        targetMajor: true
      }
    });

    return res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const updateNickname = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { nickname } = req.body;

    const trimmed = nickname ? String(nickname).trim().slice(0, 20) : null;
    const profile = await prisma.studentProfile.upsert({
      where: { userId: req.user.id },
      update: { nickname: trimmed },
      create: {
        userId: req.user.id,
        nickname: trimmed
      }
    });

    return res.json({ nickname: profile.nickname });
  } catch (error) {
    console.error('updateNickname error:', error);
    return res.status(500).json({ error: 'Failed to update nickname' });
  }
};

export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: avatarUrl || null }
    });

    return res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    console.error('updateAvatar error:', error);
    return res.status(500).json({ error: 'Failed to update avatar' });
  }
};

export const deleteAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: null }
    });

    return res.json({ avatarUrl: null });
  } catch (error) {
    console.error('deleteAvatar error:', error);
    return res.status(500).json({ error: 'Failed to delete avatar' });
  }
};

export const getRapor = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: { academicRecords: { orderBy: [{ semester: 'asc' }, { subject: 'asc' }] } }
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
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { records, studentUserId } = req.body;
    const targetUserId = (req.user.role === 'ADMIN' || req.user.role === 'BK_TEACHER') && studentUserId
      ? studentUserId
      : req.user.id;

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Records must be an array' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: targetUserId }
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
          kkm: item.kkm !== undefined ? Number(item.kkm) : 75.0,
        },
        create: {
          profileId: profile.id,
          semester: Number(item.semester),
          subject: String(item.subject),
          score: Number(item.score),
          kkm: item.kkm !== undefined ? Number(item.kkm) : 75.0,
        }
      })
    );

    await Promise.all(upsertPromises);

    const updatedRecords = await prisma.academicRecord.findMany({
      where: { profileId: profile.id },
      orderBy: [{ semester: 'asc' }, { subject: 'asc' }]
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
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

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

// Delete Achievement with Ownership Validation (Contract 1.4)
export const deleteAchievement = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { id } = req.params;

    const achievement = await prisma.achievement.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!achievement || achievement.profile.userId !== req.user.id) {
      return res.status(404).json({ error: 'Achievement not found or unauthorized' });
    }

    await prisma.achievement.delete({
      where: { id }
    });

    return res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('deleteAchievement error:', error);
    return res.status(500).json({ error: 'Failed to delete achievement' });
  }
};

// CRUD Assessment (Minat Bakat) - Preserve 0 scores, do NOT convert 0 to 70 (Contract 3.4)
export const saveAssessment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { technology, research, creativity, leadership, communication } = req.body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const parseScore = (val: any) => {
      if (val === undefined || val === null || val === '') return 70.0;
      const num = Number(val);
      return Math.max(0, Math.min(100, isNaN(num) ? 70.0 : num));
    };

    const assessment = await prisma.assessment.upsert({
      where: { profileId: profile.id },
      update: {
        technology: parseScore(technology),
        research: parseScore(research),
        creativity: parseScore(creativity),
        leadership: parseScore(leadership),
        communication: parseScore(communication),
      },
      create: {
        profileId: profile.id,
        technology: parseScore(technology),
        research: parseScore(research),
        creativity: parseScore(creativity),
        leadership: parseScore(leadership),
        communication: parseScore(communication),
      }
    });

    return res.json({ message: 'Assessment updated successfully', assessment });
  } catch (error) {
    console.error('saveAssessment error:', error);
    return res.status(500).json({ error: 'Failed to save assessment' });
  }
};
