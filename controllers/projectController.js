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
    let { page = 1, limit = 10, search = "" } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const query = search
      ? { name: { $regex: search, $options: "i" } } // case-insensitive search by project name
      : {};

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .populate("client", "name email")
      .populate("assignedStaff", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    res.json({
      projects,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
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