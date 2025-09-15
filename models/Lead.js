// models/Lead.js
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    position: { type: String },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    website: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    zipCode: { type: String },
    company: { type: String },

    leadValue: { type: Number, default: 0 },
    status: { type: String, default: "Non selected" }, // dropdown
    source: { type: String, default: "Non selected" }, // dropdown
    assign: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" , default: null }],
    tags: [{ type: String }],

    description: { type: String },
    public: { type: Boolean, default: false },
    contactedToday: { type: Boolean, default: false },
    referer: { type: String },
    leadType: { type: String, default: "Other" },

    defaultLanguage: { type: String, default: "System Default" },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
