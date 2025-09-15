// controllers/reminderController.js
import Reminder from "../models/Remiender.js"; // updated schema

// @desc Get all reminders
// @desc Get all reminders with filters
export const getReminders = async (req, res, next) => {
  try {
    const { status, priority, reminderType, staffid, customersid, leadsid, startDate, endDate } = req.query;

    // Build filter object dynamically
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (reminderType) filter.reminderType = reminderType;
    if (staffid) filter.staffid = staffid;
    if (customersid) filter.customersid = customersid;
    if (leadsid) filter.leadsid = leadsid;

    // Date range filter
    if (startDate && endDate) {
      filter.datetime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.datetime = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.datetime = { $lte: new Date(endDate) };
    }

    const reminders = await Reminder.find(filter)
      .populate("leadsid")
      .populate("customersid")
      .populate("staffid");

    res.json(reminders);
  } catch (err) {
    next(err);
  }
};

// @desc Get single reminder
export const getReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id)
      .populate("leadsid")
      .populate("customersid")
      .populate("staffid");

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);
  } catch (err) {
    next(err);
  }
};

// @desc Create new reminder
// @desc Create new reminder
export const createReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.create(req.body);

    // populate after creation
    await reminder.populate("leadsid");
    await reminder.populate("customersid");
    await reminder.populate("staffid");

    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
};


// @desc Update reminder
export const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await reminder.populate("leadsid");
    await reminder.populate("customersid");
    await reminder.populate("staffid");

    res.json(reminder);
  } catch (err) {
    next(err);
  }
};

// @desc Delete reminder
export const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted successfully" });
  } catch (err) {
    next(err);
  }
};
