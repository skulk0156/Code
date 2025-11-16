import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const [teams, setTeams] = useState([]);
  const [managers, setManagers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [managerId, setManagerId] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(res.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again.");
      }
    };

    const fetchManagers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/managers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setManagers(res.data);
      } catch (err) {
        console.error("Error fetching managers:", err);
        setError("Failed to load managers. Please try again.");
      }
    };

    fetchTeams();
    fetchManagers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        {
          project_name: projectName,
          description,
          team_id: teamId,
          manager_id: managerId,
          status,
          deadline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Project created successfully!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      setError("Failed to create project.");
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto bg-blue-50">
      <h1 className="text-3xl font-bold mb-6">Add Project</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          className="p-2 border rounded"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          required
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.team_name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          required
        >
          <option value="">Select Manager</option>
          {managers.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
        <input
          type="date"
          className="p-2 border rounded"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
