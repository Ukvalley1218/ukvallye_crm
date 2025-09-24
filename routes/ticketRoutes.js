import express from 'express';
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicket,
  updateTicket,
  deleteTicket
} from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer: create ticket
router.post("/", protect, authorize("customer"), createTicket);

// Customer: view own tickets
router.get("/my", protect, authorize("customer"), getMyTickets);

// Staff/Admin/Superadmin: view all tickets
router.get("/", protect, authorize("staff", "admin", "superadmin"), getAllTickets);

// Get single ticket
router.get("/:id", protect, authorize("customer","staff","admin","superadmin"), getTicket);

// Update ticket (staff/admin/superadmin)
router.put("/:id", protect, authorize("staff","admin","superadmin"), updateTicket);

// Delete ticket (admin/superadmin only)
router.delete("/:id", protect, authorize("customer","staff","admin","superadmin"), deleteTicket);

export default router;
