import express from "express";

import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";

const router = express.Router();
router.get("/", getLeads);  // Get all leads
router.get("/:id", getLead);  // Get a specific lead by id
router.post("/", createLead);  // Create a new lead
router.put("/:id", updateLead);  //update a specific lead by id
router.delete("/:id", deleteLead);  // Delete a specific lead by id

export default router;
