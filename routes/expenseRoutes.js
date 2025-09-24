import express from "express";
import {
  addExpense,
  updateExpenseStatus,
  getAllExpenses,
  getMyExpenses,
  deleteExpense,
  getExpenseById,
} from "../controllers/expenseController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Staff: Add Expense & Get Own Expenses
router.post("/", protect, authorize("staff", "admin", "superadmin"), addExpense);
router.get("/my", protect, authorize("staff", "admin", "superadmin"), getMyExpenses);

// Admin & Superadmin: Get All Expenses
router.get("/", protect, authorize("admin", "superadmin"), getAllExpenses);

// View Expense by ID
router.get("/:id", protect, authorize("staff", "admin", "superadmin"), getExpenseById);

// Admin: Update Status (Approve/Reject)
router.put("/:id/status", protect, authorize("admin", "superadmin"), updateExpenseStatus);

// Superadmin: Delete Expense
router.delete("/:id", protect, authorize("superadmin"), deleteExpense);

export default router;
