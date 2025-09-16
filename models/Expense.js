import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true }, // staff who added
    date: { type: Date, default: Date.now },                                     // expense date
    category: {
      type: String,
      enum: ["Travel", "Food", "Supplies", "Other"], // you can extend categories
      default: "Other",
    },
    description: { type: String, trim: true },                                   // details of expense
    amount: { type: Number, required: true },                                    // expense amount
    attachmentUrl: { type: String },                                             // receipt/photo optional
    month: { type: String },                                                     // auto-filled for monthly filter
    year: { type: Number },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],                                 // admin can approve later
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Auto fill month & year before save
expenseSchema.pre("save", function (next) {
  const date = this.date || new Date();
  this.month = date.toLocaleString("default", { month: "long" }); // e.g. "September"
  this.year = date.getFullYear();
  next();
});

export default mongoose.model("Expense", expenseSchema);
