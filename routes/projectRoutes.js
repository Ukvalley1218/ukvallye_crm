import express from "express";
import {
  createProject,
  getProject,
  getProjects,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Staff/Admin/Superadmin: create project
router.post("/", protect, authorize("staff","admin","superadmin"), createProject);

// Staff/Admin/Superadmin: get all projects
router.get("/", protect, authorize("staff","admin","superadmin"), getProjects);

// Get single project (role-based filtering inside controller)
router.get("/:id", protect, authorize("staff","admin","superadmin"), getProject);

// Update project (staff only if assigned or created, admin/superadmin full)
router.put("/:id", protect, authorize("staff","admin","superadmin"), updateProject);

// Delete project (admin/superadmin only)
router.delete("/:id", protect, authorize("admin","superadmin"), deleteProject);

export default router;
