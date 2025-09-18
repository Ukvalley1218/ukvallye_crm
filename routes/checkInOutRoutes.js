import express from 'express';
import { checkInOut,getMyCheckIns ,getAttendanceSummary, checkIn, checkOut} from '../controllers/checkInOutController.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post("/", protect, upload.single("selfie"), checkInOut);


// router.post("/", auth,upload.single("selfie"), checkIn);
// router.post("/checkout", auth,upload.single("selfie"), checkOut);
router.get("/", protect,getMyCheckIns);

router.get('/summary',protect,getAttendanceSummary);

export default router;