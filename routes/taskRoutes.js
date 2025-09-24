import express from "express";
import {
  getTask,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

// Staff, admin, superadmin can view tasks
router.get("/", authorize("staff", "admin", "superadmin"), getTasks);
router.get("/:id", authorize("staff", "admin", "superadmin"), getTask);

// Staff can create their own, admin/superadmin can also create
router.post("/", authorize("staff", "admin", "superadmin"), createTask);

// Staff can update their own, admin/superadmin can update all
router.put("/:id", authorize("staff", "admin", "superadmin"), updateTask);

// Only admin/superadmin can delete
router.delete("/:id", authorize("staff","admin", "superadmin"), deleteTask);

export default router;

