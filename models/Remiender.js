// models/Lead.js
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    leadsid:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" , default: null }],
    customersid:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" , default: null }],
    staffid:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" , default: null }],
    title: { type: String },
    description: { type: String },
    datetime: { type: Date },
    priority: {type: String, default: "medium" },
    status: {type: String, default: "pending" },
    reminderType: {type: String, default: "email" },
    
    // ✅ Calendar fields
    start: { type: Date },
    end: { type: Date },
  },
  { timestamps: true }
);

const Reminders = mongoose.model("Reminders", staffSchema);
export default Reminders;
