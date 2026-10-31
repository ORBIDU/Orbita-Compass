import { Router } from 'express';
import { getAdminStats, getAdminUsers, updateUserRole, createStudent, createStudentsBulk } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Protect ALL /admin routes with token auth AND requireRole ADMIN (Contract 1.3)
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);

// Admin student creation (Contract 14.1)
router.post('/students', createStudent);
router.post('/students/bulk', createStudentsBulk);

export default router;
