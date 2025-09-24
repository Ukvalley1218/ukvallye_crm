import Task from "../models/Tasks.js";
import { notifyUser } from "../utils/notify.js";

// @desc Get single task
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("reminderid")
      .populate("staffid")
      .populate("leadid")
      .populate("customerid");

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Staff can only access their own tasks
    if (req.user.role === "staff" && task.staffid.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const filter = {};

    // 🔹 Role-based filter
    if (req.user.role === "staff") {
      filter.staffid = req.user._id; // staff sees only their tasks
    }

    // Optional search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate("reminderid")
      .populate("staffid")
      .populate("leadid")
      .populate("customerid")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      tasks,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Create new task
export const createTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
      staffid:
        req.user.role === "staff" ? req.user._id : req.body.staffid, // staff assigns to self
    };

    const task = await Task.create(taskData);

    await task.populate("reminderid");
    await task.populate("leadid");
    await task.populate("customerid");
    await task.populate("staffid");

    // 🔔 notify the staff assigned to this task
    if (Array.isArray(task.staffid)) {
      await Promise.all(
        task.staffid.map((id) =>
          notifyUser({
            userId: id,
            type: "task",
            message: `New task assigned: ${task.title || ""}`,
            link: `/tasks/${task._id}`,
          })
        )
      );
    } else {
      await notifyUser({
        userId: task.staffid,
        type: "task",
        message: `New task assigned: ${task.title || ""}`,
        link: `/tasks/${task._id}`,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};


// @desc Update task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role === "staff" &&
      task.staffid.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("reminderid")
      .populate("leadid")
      .populate("customerid")
      .populate("staffid");

    // 🔔 notify on update
    if (Array.isArray(updatedTask.staffid)) {
      await Promise.all(
        updatedTask.staffid.map((id) =>
          notifyUser({
            userId: id,
            type: "task-update",
            message: `Task updated: ${updatedTask.title || ""}`,
            link: `/tasks/${updatedTask._id}`,
          })
        )
      );
    } else {
      await notifyUser({
        userId: updatedTask.staffid,
        type: "task-update",
        message: `Task updated: ${updatedTask.title || ""}`,
        link: `/tasks/${updatedTask._id}`,
      });
    }

    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};


// @desc Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();

    // 🔔 notify on delete
    if (Array.isArray(task.staffid)) {
      await Promise.all(
        task.staffid.map((id) =>
          notifyUser({
            userId: id,
            type: "task-delete",
            message: `Task deleted: ${task.title || ""}`,
          })
        )
      );
    } else {
      await notifyUser({
        userId: task.staffid,
        type: "task-delete",
        message: `Task deleted: ${task.title || ""}`,
      });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};


