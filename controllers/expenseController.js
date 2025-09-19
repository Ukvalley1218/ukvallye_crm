import Expense from "../models/Expense.js";


// Add Expense
export const addExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      //user: req.user._id,
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

// Get All Expenses (Admin)
export const getAllExpenses = async (req, res, next) => {
  try {
    let { month, year, page = 1, limit = 10 } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const filter = {};

    if (month) filter.month = month;
    if (year) filter.year = year;

    const total = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      expenses,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
    
  } catch (error) {
    req.status(404).json({ message: "Expense not found" });
  }
}
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