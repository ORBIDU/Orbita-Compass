import { Router } from 'express';
import { register, login, getMe, setFirstPassword, saveConsent, changePassword } from '../controllers/authController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Public Authentication
router.post('/login', login);

// Admin-only registration (Contract 1.2 & 14)
router.post('/register', authenticateToken, requireRole('ADMIN'), register);

// Authenticated Student & User Endpoints
router.get('/me', authenticateToken, getMe);
router.post('/first-password', authenticateToken, setFirstPassword);
router.post('/consent', authenticateToken, saveConsent);
router.put('/password', authenticateToken, changePassword);

export default router;
