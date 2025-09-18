import Lead from "../models/Lead.js";
import Staff from "../models/Staff.js";
import Customer from "../models/Customer.js";
import Expense from "../models/Expense.js";
import Project from "../models/Project.js";
import Task from "../models/Tasks.js";

export const getDashboardCounts = async (req, res, next) => {
  try {
    const [leadCount, taskCount, staffCount, projectCount, customerCount,expensecounts] =
      await Promise.all([
        Lead.countDocuments(),
        Task.countDocuments(),
        Staff.countDocuments(),
        Project.countDocuments(),
        Customer.countDocuments(),
        Expense.countDocuments(),  
      ]);

    res.json({
      leads: leadCount,
      tasks: taskCount,
      staff: staffCount,
      projects: projectCount,
      customers: customerCount,
      expenses:expensecounts
    });
  } catch (err) {
    next(err);
  }
};