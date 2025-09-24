// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  type: { type: String, required: true }, // e.g., task_assigned, lead_assigned
  message: { type: String, required: true },
  link: { type: String }, // frontend link
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
