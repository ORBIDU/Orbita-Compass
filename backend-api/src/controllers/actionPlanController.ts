import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getActionPlans = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const items = await prisma.actionPlanItem.findMany({
      where: { profileId: profile.id },
      orderBy: { dueDate: 'asc' }
    });

    return res.json({ items, actionPlans: items });
  } catch (error) {
    console.error('getActionPlans error:', error);
    return res.status(500).json({ error: 'Failed to fetch action plan items' });
  }
};

export const createActionPlan = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { title, description, category, dueDate, notifyEmail, notifyWa } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and dueDate are required' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const item = await prisma.actionPlanItem.create({
      data: {
        profileId: profile.id,
        title,
        description,
        category: category || 'General',
        dueDate: new Date(dueDate),
        notifyEmail: notifyEmail !== undefined ? Boolean(notifyEmail) : true,
        notifyWa: notifyWa !== undefined ? Boolean(notifyWa) : true,
      }
    });

    return res.status(201).json({ message: 'Action plan item created', item });
  } catch (error) {
    console.error('createActionPlan error:', error);
    return res.status(500).json({ error: 'Failed to create action plan item' });
  }
};

// Check Ownership on Toggle Complete (Contract 1.4)
export const toggleActionPlanComplete = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { id } = req.params;
    const { completed } = req.body;

    const existing = await prisma.actionPlanItem.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!existing || existing.profile.userId !== req.user.id) {
      return res.status(404).json({ error: 'Action plan item not found or unauthorized' });
    }

    const updated = await prisma.actionPlanItem.update({
      where: { id },
      data: { completed: Boolean(completed) }
    });

    return res.json({ message: 'Status updated', item: updated });
  } catch (error) {
    console.error('toggleActionPlanComplete error:', error);
    return res.status(500).json({ error: 'Failed to update item' });
  }
};

// Check Ownership on Delete Action Plan (Contract 1.4)
export const deleteActionPlan = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });

    const { id } = req.params;

    const existing = await prisma.actionPlanItem.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!existing || existing.profile.userId !== req.user.id) {
      return res.status(404).json({ error: 'Action plan item not found or unauthorized' });
    }

    await prisma.actionPlanItem.delete({
      where: { id }
    });

    return res.json({ message: 'Action plan deleted successfully' });
  } catch (error) {
    console.error('deleteActionPlan error:', error);
    return res.status(500).json({ error: 'Failed to delete action plan' });
  }
};
