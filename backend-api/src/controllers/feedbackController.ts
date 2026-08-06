import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { rating, comment, category } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedback = await prisma.systemFeedback.create({
      data: {
        userId: req.user.id,
        rating: Number(rating),
        comment,
        category: category || 'General'
      }
    });

    return res.status(201).json({ message: 'Ulasan berhasil disimpan. Terima kasih atas masukan Anda!', feedback });
  } catch (error) {
    console.error('submitFeedback error:', error);
    return res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await prisma.systemFeedback.findMany({
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const avgRating = await prisma.systemFeedback.aggregate({
      _avg: { rating: true },
      _count: { rating: true }
    });

    return res.json({
      feedbacks,
      averageRating: Math.round((avgRating._avg.rating || 4.8) * 10) / 10,
      totalFeedbacks: avgRating._count.rating || 0
    });
  } catch (error) {
    console.error('getFeedbacks error:', error);
    return res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};
