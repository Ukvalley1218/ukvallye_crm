// controllers/reminderController.js
import Reminder from "../models/Remiender.js";

// @desc Get all reminders
export const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find()
      .populate("leadId")
      .populate("customerId")
      .populate("staffId");
    res.json(reminders);
  } catch (err) {
    next(err);
  }
};

// @desc Get single reminder
export const getReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id)
      .populate("leadId")
      .populate("customerId")
      .populate("staffId");

    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(reminder);
  } catch (err) {
    next(err);
  }
};

// @desc Create new reminder
export const createReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
};

// @desc Update reminder
export const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(reminder);
  } catch (err) {
    next(err);
  }
};

// @desc Delete reminder
export const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    res.json({ message: "Reminder deleted" });
  } catch (err) {
    next(err);
  }
};
