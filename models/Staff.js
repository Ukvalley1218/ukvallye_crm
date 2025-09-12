// models/Lead.js
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
