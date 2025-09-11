// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/leads", leadRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 CRM Backend running with single-file setup!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
