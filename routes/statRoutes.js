import express from 'express';
import { getDashboardCounts } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/',protect, getDashboardCounts);

export default router;