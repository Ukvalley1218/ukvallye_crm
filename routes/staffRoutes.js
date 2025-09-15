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
router.get("/", getStaffs);
router.get("/:id", getStaff);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

router.get("/search/leads", searchStaffWithLeads); // ?name=Rahul
router.get("/:id/leads", getStaffLeads);

export default router;
