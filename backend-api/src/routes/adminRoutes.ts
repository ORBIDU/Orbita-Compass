import { Router } from 'express';
import { getAdminStats, getAdminUsers, updateUserRole } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);

export default router;
