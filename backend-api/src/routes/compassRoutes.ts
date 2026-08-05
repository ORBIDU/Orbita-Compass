import { Router } from 'express';
import { analyzeCompass, getCompassResult } from '../controllers/compassController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/analyze', analyzeCompass);
router.get('/result', getCompassResult);

export default router;
