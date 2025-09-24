import express from "express";
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

// Staff, admin, superadmin can get leads
router.get("/", authorize("staff", "admin", "superadmin"), getLeads);

// Staff, admin, superadmin can view single lead
router.get("/:id", authorize("staff", "admin", "superadmin"), getLead);

// Staff can create (their own), admin/superadmin can also create
router.post("/", authorize("staff", "admin", "superadmin"), createLead);

// Staff can update their own, admin/superadmin can update all
router.put("/:id", authorize("staff", "admin", "superadmin"), updateLead);

// Only admin/superadmin can delete
router.delete("/:id", authorize("staff","admin", "superadmin"), deleteLead);

export default router;
