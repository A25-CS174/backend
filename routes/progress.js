import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getProgressOverview,
  updateModuleProgress,
  getChartData,
  getModulesBarData
} from '../controllers/progressController.js';

const router = express.Router();

// semua route butuh auth
router.use(authMiddleware);

router.get('/overview', getProgressOverview);           // summary mvp: percentage, milestones, modules, recommendations
router.post('/module/:moduleId/update', updateModuleProgress); // update progress per module
router.get('/chart', getChartData);                     // time-series chart data
router.get('/modules/bar', getModulesBarData);          // bar chart per module

export default router;