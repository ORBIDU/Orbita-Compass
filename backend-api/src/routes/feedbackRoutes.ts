import { Router } from 'express';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getFeedbacks);
router.post('/', authenticateToken, submitFeedback);

export default router;
