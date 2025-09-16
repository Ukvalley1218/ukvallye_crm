import Expense from "../models/Expense.js";


// Add Expense
export const addExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

// Get All Expenses (Admin)
export const getAllExpenses = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month) filter.month = month;
    if (year) filter.year = year;

    const expenses = await Expense.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// Get My Expenses (Staff)
export const getMyExpenses = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let filter = { user: req.user.id };

    if (month) filter.month = month;
    if (year) filter.year = year;

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// Update Expense Status (Admin Approve/Reject)
export const updateExpenseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

// Delete Expense
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    next(err);
  }
};