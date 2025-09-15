// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import cors from "cors";

import customerRoutes from "./routes/customerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkInOutRoutes from "./routes/checkInOutRoutes.js";

dotenv.config();

const app = express();

connectDB();



// Allow all origins
app.use(cors());

// If you also need to allow custom headers, methods, and credentials:
app.use(cors({
  origin: "*",             // allow all origins
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
// Middleware
app.use(express.json());

// auth route
app.use("/api/auth",authRoutes);

app.use("/api/checkinout",checkInOutRoutes);
// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/customers",customerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 CRM Backend running with single-file setup!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
