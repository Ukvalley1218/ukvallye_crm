import express from "express";
import { createReminder, deleteReminder, getReminder, getReminders, updateReminder } from "../controllers/reminderController.js";


const router = express.Router();
router.get("/", getReminders);
router.get("/:id", getReminder);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

export default router;
