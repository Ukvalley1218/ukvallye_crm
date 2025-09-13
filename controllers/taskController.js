// controllers/taskController.js
import Task from "../models/Tasks.js";

// @desc Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("reminderId") // if tasks are linked to reminders
      .populate("staffId")    // if directly linked to staff
      .populate("leadId")     // optional if task is tied to a lead
      .populate("customerId"); // optional if task is tied to a customer

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// @desc Get single task
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("reminderId")
      .populate("staffId")
      .populate("leadId")
      .populate("customerId");

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc Create new task
export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc Update task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
