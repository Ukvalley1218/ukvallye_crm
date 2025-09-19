import express from "express";

import { getUser,createUser,deleteUser,updateUser,getUsers,searchUserWithLeads,getUserLeads } from "../controllers/staffController.js";

const router = express.Router();
router.get("/", getUsers);  // GET all Users
router.get("/:id", getUser);  // GET a specific User by ID
router.post("/", createUser);  // Create a new User
router.put("/:id", updateUser);  // Update an existing User
router.delete("/:id", deleteUser);  // Delete a User

router.get("/search", searchUserWithLeads); // ?name=Rahul
router.get("/:id/leads", getUserLeads);  // GET leads assigned to a specific User

export default router;
