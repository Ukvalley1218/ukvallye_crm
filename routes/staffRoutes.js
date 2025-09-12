import express from "express";

import {} from "../controllers/staffController.js";
import {
  getStaff,
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router = express.Router();
router.get("/", getStaffs);
router.get("/:id", getStaff);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
