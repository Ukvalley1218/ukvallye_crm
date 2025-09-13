import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    // Relations
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "leads" },        // optional link to lead
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customers" }, // optional link to customer
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "staffs", required: true }, // who wrote the note

    // Note details
    content: { type: String, required: true }, // actual note text
    tags: [{ type: String }], // optional tags like ["important", "follow-up"]
  },
  { timestamps: true } // auto-manages createdAt & updatedAt
);

export default mongoose.model("Note", noteSchema);
