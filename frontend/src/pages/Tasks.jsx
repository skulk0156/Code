import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiUser, FiCalendar, FiClipboard } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    deadline: "",
  });

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (e) {
      console.log("Error fetching tasks", e);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/team-members", {
        withCredentials: true,
      });
      setTeamMembers(res.data);
    } catch (e) {
      console.log("Error fetching team members", e);
    }
  };

  const addTask = async () => {
    try {
      await axios.post("http://localhost:5000/api/tasks/add", form, {
        withCredentials: true,
      });
      toast.success("Task Added");
      setOpenModal(false);
      fetchTasks();
    } catch (e) {
      toast.error("Failed to add task");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Task
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 shadow-lg rounded-2xl border"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FiClipboard /> {task.title}
            </h2>
            <p className="text-gray-600 text-sm mt-2">{task.description}</p>

            <div className="mt-4 flex items-center gap-2 text-gray-700">
              <FiUser /> {task.assigned_to?.name}
            </div>

            <div className="mt-1 flex items-center gap-2 text-gray-700">
              <FiCalendar /> {task.deadline}
            </div>

            <div className="mt-3 text-sm font-medium text-blue-600">
              Status: <span className="text-gray-800">In Progress</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ADD TASK MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              className="w-full mb-3 p-2 border rounded-lg"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className="w-full mb-3 p-2 border rounded-lg"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* TEAM MEMBERS (Manager Team Only) */}
            <select
              className="w-full mb-3 p-2 border rounded-lg"
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
            >
              <option value="">Assign to</option>
              {teamMembers.map((member) => (
                <option value={member._id} key={member._id}>
                  {member.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="w-full mb-3 p-2 border rounded-lg"
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
