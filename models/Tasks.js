import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    reminderId: { type: mongoose.Schema.Types.ObjectId, ref: "reminders" }, // optional link to reminder
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "leads" },         // optional link to lead
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customers" }, // optional link to customer
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "staffs", required: true }, // assigned staff
    title: { type: String, required: true },
    description: { type: String },
    dueDateTime: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed", "cancelled"],
      default: "todo",
    },
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;