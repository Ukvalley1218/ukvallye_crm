import express from 'express';
import { checkInOut,getMyCheckIns ,getAttendanceSummary, checkIn, checkOut} from '../controllers/checkInOutController.js';
import upload from '../middleware/upload.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.post("/", auth, upload.single("selfie"), checkInOut);
// router.post("/", auth,upload.single("selfie"), checkIn);
// router.post("/checkout", auth,upload.single("selfie"), checkOut);
router.get("/", auth,getMyCheckIns);

router.get('/summary',auth,getAttendanceSummary);

export default router;