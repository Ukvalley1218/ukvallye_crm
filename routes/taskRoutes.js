import express from "express";
import { getTask,getTasks,createTask,updateTask,deleteTask } from "../controllers/taskController.js";

const router = express.Router();
router.get("/", getTask);
router.get("/:id", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
