import express from "express";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "../controllers/notesControllers.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notes (admin/superadmin), staff sees only their own
router.get("/", protect, authorize("staff", "admin", "superadmin"), getNotes);

// Get single note
router.get("/:id", protect, authorize("staff", "admin", "superadmin"), getNote);

// Create note
router.post("/", protect, authorize("staff", "admin", "superadmin"), createNote);

// Update note
router.put("/:id", protect, authorize("staff", "admin", "superadmin"), updateNote);

// Delete note
router.delete("/:id", protect, authorize("staff", "admin", "superadmin"), deleteNote);

export default router;
