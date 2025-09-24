import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { 
  createReminder, 
  deleteReminder, 
  getReminder, 
  getReminders, 
  updateReminder 
} from "../controllers/reminderController.js";

const router = express.Router();

// Staff/Admin/Superadmin can create reminders
router.post("/", protect, authorize("staff","admin","superadmin"), createReminder);

// Staff/Admin/Superadmin can get all reminders
router.get("/", protect, authorize("staff","admin","superadmin"), getReminders);

// Staff/Admin/Superadmin can get a single reminder
router.get("/:id", protect, authorize("staff","admin","superadmin"), getReminder);

// Update reminder (staff if assigned, admin/superadmin full)
router.put("/:id", protect, authorize("staff","admin","superadmin"), updateReminder);

// Delete reminder (admin/superadmin only)
router.delete("/:id", protect, authorize("staff","admin","superadmin"), deleteReminder);

export default router;
