import { Router } from 'express';
import { getProfile, updateProfile, getRapor, saveRapor, saveAchievement, deleteAchievement, saveAssessment } from '../controllers/profileController';
import { importExcelRapor, uploadPdfRapor } from '../controllers/raporImportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/rapor', getRapor);
router.post('/rapor', saveRapor);

// Bulk & OCR Rapor Import Endpoints
router.post('/rapor/import-excel', importExcelRapor);
router.post('/rapor/upload-pdf', uploadPdfRapor);

// Achievements CRUD Endpoints
router.post('/achievements', saveAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Assessment CRUD Endpoint
router.post('/assessment', saveAssessment);

export default router;
