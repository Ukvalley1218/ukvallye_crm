// models/Lead.js
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    leadsid:  [{ type: mongoose.Schema.Types.ObjectId, ref: "leads" , default: null }],
    customersid:  [{ type: mongoose.Schema.Types.ObjectId, ref: "customers" , default: null }],
    staffid:  [{ type: mongoose.Schema.Types.ObjectId, ref: "staffs" , default: null }],
    title: { type: String },
    description: { type: String },
    datetime: { type: Date },
    priority: {type: String, default: "medium" },
    status: {type: String, default: "pending" },
    reminderType: {type: String, default: "email" }
  },
  { timestamps: true }
);

const Reminders = mongoose.model("Reminders", staffSchema);
export default Reminders;
