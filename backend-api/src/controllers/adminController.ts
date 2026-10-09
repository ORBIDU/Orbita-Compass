import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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
        avatarUrl: true,
        mustChangePassword: true,
        parentConsentAt: true,
        termsAcceptedAt: true,
        subscriptionEndsAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            nickname: true,
            schoolName: true,
            grade: true,
            majorTrack: true,
            city: true,
            targetPtn: { select: { id: true, name: true } },
            targetMajor: { select: { id: true, name: true } }
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
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, schoolName, grade, city, initialPassword } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const generatedPassword = initialPassword || crypto.randomBytes(4).toString('hex') + 'A1!';
    const passwordHash = await bcrypt.hash(generatedPassword, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'STUDENT',
        mustChangePassword: true,
        profile: {
          create: {
            schoolName: schoolName || null,
            grade: grade ? Number(grade) : null,
            majorTrack: null,
            city: city || null
          }
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        mustChangePassword: true,
        createdAt: true,
        profile: true
      }
    });

    return res.status(201).json({
      user,
      initialPassword: generatedPassword
    });
  } catch (error) {
    console.error('createStudent error:', error);
    return res.status(500).json({ error: 'Failed to create student account' });
  }
};

export const createStudentsBulk = async (req: AuthRequest, res: Response) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'Array of students is required' });
    }

    const accounts: any[] = [];
    const errors: any[] = [];
    let created = 0;
    let skipped = 0;

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      if (!s.email || !s.name) {
        errors.push({ row: i + 1, message: 'Name and email are required' });
        skipped++;
        continue;
      }

      const existing = await prisma.user.findUnique({ where: { email: s.email } });
      if (existing) {
        errors.push({ row: i + 1, message: 'Email sudah terdaftar' });
        skipped++;
        continue;
      }

      const initialPassword = s.initialPassword || crypto.randomBytes(4).toString('hex') + 'A1!';
      const passwordHash = await bcrypt.hash(initialPassword, 10);

      await prisma.user.create({
        data: {
          email: s.email,
          passwordHash,
          name: s.name,
          role: 'STUDENT',
          mustChangePassword: true,
          profile: {
            create: {
              schoolName: s.schoolName || null,
              grade: s.grade ? Number(s.grade) : null,
              city: s.city || null
            }
          }
        }
      });

      accounts.push({ row: i + 1, email: s.email, initialPassword });
      created++;
    }

    return res.json({
      created,
      skipped,
      accounts,
      errors
    });
  } catch (error) {
    console.error('createStudentsBulk error:', error);
    return res.status(500).json({ error: 'Failed to create bulk students' });
  }
};
