import mongoose from "mongoose";

const checkInOutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    date: { type: String, required: true }, // YYYY-MM-DD

    checkInTime: { type: Date },
    checkOutTime: { type: Date },

    selfieUrl: { type: String,  },
    type: { type: String, enum: ["checkin", "checkout"], required: true },

    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    officeLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    distanceFromOffice: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("CheckInOut", checkInOutSchema);
