import Project from "../models/Project.js";

// ---------------- Create Project ----------------
export const createProject = async (req, res) => {
  try {
    const { project_name, description, manager_id, deadline, status } = req.body;

    if (!project_name || !manager_id) {
      return res.status(400).json({ message: "Project name and manager are required" });
    }

    const project = await Project.create({
      project_name,
      description: description || "",
      manager: manager_id,
      status: status || "In Progress",
      deadline: deadline || null,
    });

    // Populate manager info before sending response
    await project.populate("manager", "name email role");

    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get All Projects ----------------
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("manager", "name email role");
    res.status(200).json({ data: projects });
  } catch (err) {
    console.error("Get Projects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get Project By ID ----------------
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "manager",
      "name email role"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (err) {
    console.error("Get Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Update Project ----------------
export const updateProject = async (req, res) => {
  try {
    const { project_name, description, manager_id, deadline, status } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        project_name,
        description,
        manager: manager_id,
        deadline,
        status,
      },
      { new: true }
    ).populate("manager", "name email role");

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project updated successfully", project: updatedProject });
  } catch (err) {
    console.error("Update Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Delete Project ----------------
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
