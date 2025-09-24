// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";

// page routers
import leadRoutes from "./routes/leadRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkInOutRoutes from "./routes/checkInOutRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statRoutes from "./routes/statRoutes.js"
// notifications
import notificationRoutes from "./routes/notificationRoutes.js"


dotenv.config();

const app = express();

connectDB();



// Allow all origins
app.use(cors());

// If you also need to allow custom headers, methods, and credentials:
app.use(cors({
  origin: ["http://localhost:5173"],             // allow all origins
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:true,
}));
// Middleware
app.use(express.json());

// count route
app.use("/api/stats",statRoutes);
// auth route

app.use("/api/auth",authRoutes);
app.use("/api/checkinout",checkInOutRoutes);
app.use("/api/users",userRoutes);
// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/customers",customerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/tickets",ticketRoutes);

// notifications
app.use("/api/notifications", notificationRoutes);



const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Routes
// app.get("/", (req, res) => {
//   res.send("🚀 CRM Backend running with single-file setup!");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
