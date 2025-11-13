import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  description: { type: String },
  manager_name: { type: String, required: true },
  status: { type: String, enum: ["In Progress", "Completed"], default: "In Progress" },
  deadline: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
