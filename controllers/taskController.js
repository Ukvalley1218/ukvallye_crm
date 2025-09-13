// controllers/taskController.js
import Task from "../models/Tasks.js";

// @desc Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findById(req.params.id)
      .populate("reminderid") // if tasks are linked to reminders
      .populate("staffid")    // if directly linked to staff
      .populate("leadid")     // optional if task is tied to a lead
      .populate("customerid"); // optional if task is tied to a customer

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// @desc Get single task
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.find()
      .populate("reminderid")
      .populate("staffid")
      .populate("leadid")
      .populate("customerid");

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
     // populate after creation
     await task.populate("reminderid"); 
    await task.populate("leadid");
    await task.populate("customerid");
    await task.populate("staffid");

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
     // populate after creation
     await task.populate("reminderid"); 
    await task.populate("leadid");
    await task.populate("customerid");
    await task.populate("staffid");
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
