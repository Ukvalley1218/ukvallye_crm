import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get all notifications for logged-in user
router.get("/", protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// Mark a single notification as read
router.put("/:id/read", protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // only user's own notification
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.put("/mark-all/read", protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read for logged-in user
router.put("/read-all", protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    const updatedNotifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(updatedNotifications);
  } catch (err) {
    next(err);
  }
});

export default router;
