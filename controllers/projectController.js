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
    page = Number(page);
    limit = Number(limit);

    let filter = search ? { name: { $regex: search, $options: "i" } } : {};

    // Staff sees only projects assigned to them or created by them
    if (req.user.role === "staff") {
      filter.$or = [
        { assignedStaff: req.user._id },
        { createdBy: req.user._id },
      ];
    }

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate("client", "name email")
      .populate("assignedStaff", "name email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

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

    // Staff restriction
    if (
      req.user.role === "staff" &&
      project.assignedStaff?.toString() !== req.user._id.toString() &&
      project.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};


// Update Project
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (
      req.user.role === "staff" &&
      project.assignedStaff?.toString() !== req.user._id.toString() &&
      project.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(project, req.body);
    await project.save();
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