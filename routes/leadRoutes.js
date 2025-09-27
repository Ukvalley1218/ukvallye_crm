import express from "express";
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  convertLeadToCustomer,getTrashLeads,restoreLead
} from "../controllers/leadController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

// Staff, admin, superadmin can get leads
router.get("/", authorize("staff", "admin", "superadmin"), getLeads);

// Specific routes first
router.get('/trash', authorize("staff", "admin", "superadmin"), getTrashLeads);
router.put('/restore/:id', authorize("staff", "admin", "superadmin"), restoreLead);

// Then dynamic routes
router.get("/:id", authorize("staff", "admin", "superadmin"), getLead);

router.post("/", authorize("staff", "admin", "superadmin"), createLead);
router.put("/:id", authorize("staff", "admin", "superadmin"), updateLead);
router.delete("/:id", authorize("staff", "admin", "superadmin"), deleteLead);

// convert lead to customer 
router.post("/convert/:leadId",authorize("staff","admin","superadmin"),convertLeadToCustomer);


export default router;
