import express from "express";
import { registerUser,loginUser } from "../controllers/authController.js";
import { protect,authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Example protected routes
router.get("/staff-only", protect, authorize("staff", "admin", "superadmin"), (req, res) => {
  res.json({ message: "Hello Staff/Admin/Superadmin" });
});

router.get("/admin-only", protect, authorize("admin", "superadmin"), (req, res) => {
  res.json({ message: "Hello Admin/Superadmin" });
});

router.get("/superadmin-only", protect, authorize("superadmin"), (req, res) => {
  res.json({ message: "Hello Superadmin" });
});

export default router;