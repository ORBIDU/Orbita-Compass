import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateNickname,
  updateAvatar,
  deleteAvatar,
  getRapor,
  saveRapor,
  saveAchievement,
  deleteAchievement,
  saveAssessment
} from '../controllers/profileController';
import { importExcelRapor, uploadPdfRapor } from '../controllers/raporImportController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/nickname', updateNickname);
router.post('/profile/avatar', updateAvatar);
router.delete('/profile/avatar', deleteAvatar);

// Rapor
router.get('/rapor', getRapor);
router.post('/rapor', saveRapor);

// Bulk & OCR Rapor Import Endpoints (Admin & Teacher Only, Contract 13.2)
router.post('/rapor/import-excel', requireRole('ADMIN', 'BK_TEACHER'), importExcelRapor);
router.post('/rapor/upload-pdf', requireRole('ADMIN', 'BK_TEACHER'), uploadPdfRapor);

// Achievements CRUD Endpoints
router.post('/achievements', saveAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Assessment CRUD Endpoint
router.post('/assessment', saveAssessment);

export default router;
