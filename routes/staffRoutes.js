import express from "express";

import {
  getStaff,
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
  searchStaffWithLeads,
  getStaffLeads,
} from "../controllers/staffController.js";

const router = express.Router();
router.get("/", getStaffs);  // GET all staffs
router.get("/:id", getStaff);  // GET a specific staff by ID
router.post("/", createStaff);  // Create a new staff
router.put("/:id", updateStaff);  // Update an existing staff
router.delete("/:id", deleteStaff);  // Delete a staff

router.get("/search", searchStaffWithLeads); // ?name=Rahul
router.get("/:id/leads", getStaffLeads);  // GET leads assigned to a specific staff

export default router;
