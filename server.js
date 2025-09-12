// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import cors from "cors";

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
