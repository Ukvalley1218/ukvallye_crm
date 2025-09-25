import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    reminderid: { type: mongoose.Schema.Types.ObjectId, ref: "Reminders", default: null },
    leadid: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
    customerid: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    staffid: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }],

    title: { type: String },
    description: { type: String },
  

    // ✅ Calendar fields
    start: { type: Date },  
    end: { type: Date },    

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