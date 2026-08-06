import { Router } from 'express';
import { getTeachers, createBooking, getBookings, updateBookingStatus, deleteBooking } from '../controllers/bkController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/teachers', getTeachers);

router.use(authenticateToken);
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.patch('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

export default router;
