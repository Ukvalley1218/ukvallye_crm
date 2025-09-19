import mongoose from "mongoose";
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },         // Project name
    description: { type: String, trim: true },                  // Details about project
    startDate: { type: Date },                                  // Start date
    endDate: { type: Date },                                    // End date
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "On Hold"],
      default: "Pending",
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // Link to Customer
    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Staff assigned
    budget: { type: Number },                                   // Optional budget
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },       // Admin/creator
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);