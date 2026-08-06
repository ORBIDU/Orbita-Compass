import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'BK_TEACHER' },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      }
    });

    return res.json({ teachers });
  } catch (error) {
    console.error('getTeachers error:', error);
    return res.status(500).json({ error: 'Failed to fetch BK teachers' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { teacherId, bookingDate, timeSlot, topic, notes } = req.body;

    if (!teacherId || !bookingDate || !timeSlot || !topic) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const booking = await prisma.bkBooking.create({
      data: {
        studentId: req.user.id,
        teacherId,
        bookingDate: new Date(bookingDate),
        timeSlot,
        topic,
        notes,
        status: 'PENDING'
      }
    });

    return res.status(201).json({ message: 'Counseling session booked successfully', booking });
  } catch (error) {
    console.error('createBooking error:', error);
    return res.status(500).json({ error: 'Failed to create BK booking' });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const isTeacher = req.user.role === 'BK_TEACHER';

    const bookings = await prisma.bkBooking.findMany({
      where: isTeacher ? { teacherId: req.user.id } : { studentId: req.user.id },
      include: {
        student: { select: { id: true, name: true, email: true } },
        teacher: { select: { id: true, name: true, email: true } }
      },
      orderBy: { bookingDate: 'asc' }
    });

    return res.json({ bookings });
  } catch (error) {
    console.error('getBookings error:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const { status, teacherNotes } = req.body; // CONFIRMED, COMPLETED, CANCELLED

    const updateData: any = {};
    if (status) updateData.status = status;
    if (teacherNotes !== undefined) updateData.teacherNotes = teacherNotes;

    const updated = await prisma.bkBooking.update({
      where: { id },
      data: updateData
    });

    return res.json({ message: 'Booking status updated successfully', booking: updated });
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    return res.status(500).json({ error: 'Failed to update booking status' });
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    await prisma.bkBooking.delete({
      where: { id }
    });

    return res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('deleteBooking error:', error);
    return res.status(500).json({ error: 'Failed to delete booking' });
  }
};
