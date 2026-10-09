import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'orbita_compass_super_secret_jwt_key_2026';

// 1. Admin-Only Registration (Contract 1.2 & 14)
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, schoolName, grade, city } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Body role is ignored; default to STUDENT for student registrations (Contract 1.2)
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
            city: city || null,
          }
        }
      },
      include: { profile: true }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        mustChangePassword: user.mustChangePassword,
        parentConsentAt: user.parentConsentAt,
        termsAcceptedAt: user.termsAcceptedAt,
        createdAt: user.createdAt,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

// 2. Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah', code: 'INVALID_CREDENTIALS' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah', code: 'INVALID_CREDENTIALS' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        mustChangePassword: user.mustChangePassword,
        parentConsentAt: user.parentConsentAt,
        termsAcceptedAt: user.termsAcceptedAt,
        createdAt: user.createdAt,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

// 3. Get Current User (/auth/me - passwordHash NEVER returned, Contract 1.1)
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: {
          include: {
            academicRecords: true,
            achievements: true,
            reflection: true,
            assessment: true,
            targetPtn: true,
            targetMajor: true,
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found', code: 'NOT_FOUND' });

    // Exclude passwordHash completely
    const { passwordHash: _, ...safeUser } = user;

    return res.json({ user: safeUser });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ error: 'Failed to fetch current user' });
  }
};

// 4. Set First Password for Newly Activated Student (Contract 14.2)
export const setFirstPassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password minimal 8 karakter', code: 'PASSWORD_TOO_SHORT' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.mustChangePassword) {
      return res.status(409).json({ error: 'Password already changed', code: 'PASSWORD_ALREADY_CHANGED' });
    }

    const isSame = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSame) {
      return res.status(400).json({ error: 'New password must differ from the initial password', code: 'PASSWORD_MUST_DIFFER' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('setFirstPassword error:', error);
    return res.status(500).json({ error: 'Failed to set first password' });
  }
};

// 5. Parent Consent & Terms Agreement (Contract 2.4)
export const saveConsent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { parentConsent, termsAccepted, termsVersion } = req.body;

    if (!parentConsent || !termsAccepted) {
      return res.status(400).json({ error: 'Both consents are required', code: 'CONSENT_REQUIRED' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        parentConsentAt: user.parentConsentAt || now,
        termsAcceptedAt: user.termsAcceptedAt || now,
        termsVersion: termsVersion || '2026-10'
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('saveConsent error:', error);
    return res.status(500).json({ error: 'Failed to save consent' });
  }
};

// 6. Regular Change Password (Contract 13.3)
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password baru minimal 8 karakter', code: 'PASSWORD_TOO_SHORT' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Password sekarang salah', code: 'INVALID_CURRENT_PASSWORD' });
    }

    const isSame = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSame) {
      return res.status(400).json({ error: 'Password baru tidak boleh sama dengan password lama', code: 'PASSWORD_SAME_AS_OLD' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newHash }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('changePassword error:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
};
