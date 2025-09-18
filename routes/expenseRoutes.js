import express from 'express';
import { addExpense,updateExpenseStatus,getAllExpenses,getMyExpenses,deleteExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Staff: Add Expense & Get Own Expenses
// add authMiddleware when you have admin access


router.post("/", protect,addExpense);
router.get("/my", protect,getMyExpenses);

// Admin: Get All Expenses
router.get("/", getAllExpenses);

// Admin: Update Status (Approve/Reject)
router.put("/:id/status", updateExpenseStatus);

// Delete Expense
router.delete("/:id", deleteExpense);
export default router;