import express from "express";
import {
  getUser,
  createUser,
  deleteUser,
  updateUser,
  getUsers,
  searchUserWithLeads,
  getUserLeads,
} from "../controllers/staffController.js";

import { protect,authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Staff Routes
router.get(
  "/",
  protect,
  authorize("staff","admin", "superadmin"), // only admin/superadmin can see all staff
  getUsers
);

router.get("/:id", protect, authorize("staff", "admin", "superadmin"), getUser);

router.post(
  "/",
  protect,
  authorize("admin", "superadmin"), // only admin/superadmin can create staff
  createUser
);

router.put(
  "/:id",
  protect,
  authorize("staff", "admin", "superadmin"),
  updateUser
);

router.delete(
  "/:id",
  protect,
  authorize("admin","superadmin"), // only superadmin can delete staff
  deleteUser
);

// Extra Routes
router.get(
  "/search",
  protect,
  authorize("admin", "superadmin"),
  searchUserWithLeads
);

router.get(
  "/:id/leads",
  protect,
  authorize("staff", "admin", "superadmin"),
  getUserLeads
);

export default router;
