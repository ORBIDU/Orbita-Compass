import { Router } from 'express';
import {
  getUniversities,
  getMajors,
  getRationalization,
  getPracticeQuestions,
  submitPracticeAnswers,
  getQuestionBlueprints,
  generateAIQuestions
} from '../controllers/ptnController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/universities', getUniversities);
router.get('/majors', getMajors);
router.get('/rationalization', authenticateToken, getRationalization);
router.get('/practice/blueprints', getQuestionBlueprints);
router.get('/practice/questions', getPracticeQuestions);
router.post('/practice/generate-ai', generateAIQuestions);
router.post('/practice/submit', authenticateToken, submitPracticeAnswers);

export default router;
