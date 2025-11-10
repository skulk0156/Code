import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMoreVertical, FiUser, FiUsers } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const roleColors = {
  ADMIN: "bg-red-500",
  HR: "bg-green-500",
  EMPLOYEE: "bg-blue-500",
  MANAGER: "bg-yellow-500",
  DEFAULT: "bg-gray-500",
};

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    setUserRole(role.toLowerCase());
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teams", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTeams(res.data);
        setFilteredTeams(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!search) setFilteredTeams(teams);
    else {
      setFilteredTeams(
        teams.filter(
          (team) =>
            (team.team_name || "").toLowerCase().includes(search.toLowerCase()) ||
            (team.team_leader?.name || "").toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, teams]);

  const confirmDelete = (id) => {
    setDeleteTeamId(id);
    setModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/teams/${deleteTeamId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeams((prev) => prev.filter((team) => team._id !== deleteTeamId));
      setFilteredTeams((prev) => prev.filter((team) => team._id !== deleteTeamId));
      setModalOpen(false);
      alert("Team deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete team.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />

      <div className="flex-1 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-blue-700">Our Teams</h1>
          <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search teams or leaders..."
              className="px-4 py-2 rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {userRole === "admin" && (
              <button
                onClick={() => navigate("/add-team")}
                className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                + Add Team
              </button>
            )}
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : filteredTeams.length === 0 ? (
          <p className="text-gray-600 text-center text-lg mt-10">No teams found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredTeams.map((team, index) => (
              <div
                key={team._id}
                className={`bg-white rounded-3xl shadow-md p-6 flex flex-col items-center text-center border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                {/* Dropdown */}
                {userRole === "admin" && (
                  <div className="absolute top-4 right-4">
                    <button
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === team._id ? null : team._id)
                      }
                    >
                      <FiMoreVertical />
                    </button>
                    <div
                      className={`absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-300 ${
                        dropdownOpen === team._id
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() => navigate(`/edit-team/${team._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                        onClick={() => confirmDelete(team._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Team Info */}
                <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                  {team.team_name || "Unnamed Team"}
                </h2>

                <p className="flex items-center gap-1 text-gray-700 mb-2">
                  <FiUser className="text-blue-500" />
                  <strong>Leader:</strong>{" "}
                  {team.team_leader
                    ? `${team.team_leader.name} (${team.team_leader.role})`
                    : "Not assigned"}
                </p>

                <p className="flex items-center gap-1 text-gray-700 font-semibold">
                  <FiUsers className="text-blue-500" />
                  Members:
                </p>
                <ul className="list-disc ml-6 mt-1 text-gray-600">
                  {team.members && team.members.length > 0
                    ? team.members.map((m) => (
                        <li key={m._id}>
                          {m.employee
                            ? `${m.employee.name} (${m.employee.role})`
                            : "Unknown"}
                        </li>
                      ))
                    : "No members assigned"}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this team?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Team;
