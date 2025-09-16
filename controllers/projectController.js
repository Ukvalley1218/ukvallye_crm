import Project from "../models/Project.js";
// Create Project
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user._id, // from auth middleware
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// Get All Projects
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email") // show client name & email
      .populate("assignedStaff", "name email"); // show staff name & email
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// Get Single Project
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email")
      .populate("assignedStaff", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Update Project
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Delete Project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};