import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    reminderid: { type: mongoose.Schema.Types.ObjectId, ref: "Reminders",default:null }, // optional link to reminder
    leadid: { type: mongoose.Schema.Types.ObjectId, ref: "Lead",default:null },         // optional link to lead
    customerid: { type: mongoose.Schema.Types.ObjectId, ref: "Customer",default:null }, // optional link to customer
    staffid: { type: mongoose.Schema.Types.ObjectId, ref: "Staff",default:null }, // assigned staff
    title: { type: String},
    description: { type: String },
    dueDateTime: { type: Date},
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