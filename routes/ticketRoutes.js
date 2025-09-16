import express from 'express';

import { createTicket,getAllTickets,getMyTickets,getTicket,updateTicket,deleteTicket } from '../controllers/ticketController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Customer raises ticket
router.post("/", auth, createTicket);

// Customer views own tickets
router.get("/my", auth, getMyTickets);

// Staff/Admin views all tickets
router.get("/",getAllTickets);

// Get single ticket
router.get("/:id", getTicket);

// Update ticket (assign staff/change status)
router.put("/:id", updateTicket);

// Delete ticket
router.delete("/:id", deleteTicket);
export default router;