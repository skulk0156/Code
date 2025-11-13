import Project from "../models/Project.js";

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
};

// Add project
export const addProject = async (req, res) => {
  try {
    const { project_name, description, manager_name, status, deadline } = req.body;
    const newProject = new Project({ project_name, description, manager_name, status, deadline });
    await newProject.save();
    res.status(201).json({ message: "Project added successfully", project: newProject });
  } catch (err) {
    res.status(400).json({ message: "Error adding project", error: err.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    res.status(400).json({ message: "Error updating project", error: err.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting project", error: err.message });
  }
};
