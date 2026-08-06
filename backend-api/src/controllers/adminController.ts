import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalUniversities,
      totalMajors,
      totalTryouts,
      totalCompassAnalyses,
      totalBkBookings
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'BK_TEACHER' } }),
      prisma.university.count(),
      prisma.major.count(),
      prisma.tryoutSession.count(),
      prisma.compassAnalysis.count(),
      prisma.bkBooking.count()
    ]);

    return res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalUniversities,
        totalMajors,
        totalTryouts,
        totalCompassAnalyses,
        totalBkBookings
      }
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

export const getAdminUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            schoolName: true,
            grade: true,
            majorTrack: true,
            targetPtn: { select: { name: true } },
            targetMajor: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ users });
  } catch (error) {
    console.error('getAdminUsers error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // STUDENT, BK_TEACHER, ADMIN

    if (!['STUDENT', 'BK_TEACHER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role as any }
    });

    return res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({ error: 'Failed to update user role' });
  }
};
