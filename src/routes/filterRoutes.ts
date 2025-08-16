import { Router } from 'express';
import { FilterController } from '../controllers/filterController';

const router = Router();
const filterController = new FilterController();

// POST /api/filter-applicants
router.post('/filter-applicants', (req, res) => {
  filterController.filterApplicants(req, res);
});

// GET /api/download/:filename
router.get('/download/:filename', (req, res) => {
  filterController.downloadFile(req, res);
});

export default router;