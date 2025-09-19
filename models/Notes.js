import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    // Relations
    leadid: { type: mongoose.Schema.Types.ObjectId, ref: "Lead",dafault:null },        // optional link to lead
    customerid: { type: mongoose.Schema.Types.ObjectId, ref: "Customer",dafault:null }, // optional link to customer
    staffid: { type: mongoose.Schema.Types.ObjectId, ref: "User", default:null }, // who wrote the note

    // Note details
    content: { type: String, required: true }, // actual note text
    tags: [{ type: String }], // optional tags like ["important", "follow-up"]
   date:{type: Date, default: Date.now},
  },
  { timestamps: true } // auto-manages createdAt & updatedAt
);

export default mongoose.model("Note", noteSchema);
