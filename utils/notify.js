import Notification from "../models/Notification.js";

export const notifyUser = async ({ userId, type, message, link = "" }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      link,
    });
    return notification;
  } catch (err) {
    console.error("Notification error:", err);
    return null;
  }
};
