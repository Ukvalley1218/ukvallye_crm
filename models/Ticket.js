import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }, // who raised ticket
    subject: { type: String, required: true, trim: true },                               // ticket title
    description: { type: String, required: true },                                      // issue details
    attachments: [{ type: String }],                                                    // optional file URLs
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // staff handling
    //createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },     // who created (optional)
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
