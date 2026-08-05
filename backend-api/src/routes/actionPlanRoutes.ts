import { Router } from 'express';
import { getActionPlans, createActionPlan, toggleActionPlanComplete, deleteActionPlan } from '../controllers/actionPlanController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getActionPlans);
router.post('/', createActionPlan);
router.patch('/:id/complete', toggleActionPlanComplete);
router.delete('/:id', deleteActionPlan);

export default router;
