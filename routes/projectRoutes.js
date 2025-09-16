import express from "express";
import { createProject,getProject,getProjects,updateProject,deleteProject } from "../controllers/projectController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
// use auth later to add authentication middleware
router.post('/',auth,createProject);
router.get('/', getProjects); 
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;