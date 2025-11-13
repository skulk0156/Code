import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCalendar, FiUser, FiMoreVertical, FiFolder } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'In Progress': 'bg-yellow-500',
  Completed: 'bg-green-500',
  'On Hold': 'bg-red-500',
  DEFAULT: 'bg-gray-500',
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search) setFilteredProjects(projects);
    else {
      setFilteredProjects(
        projects.filter(p =>
          p.project_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.manager_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.status?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, projects]);

  // Delete confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
    setShowDropdown(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${deleteId}`);
      setProjects(prev => prev.filter(p => p.project_id !== deleteId));
      setFilteredProjects(prev => prev.filter(p => p.project_id !== deleteId));
      setModalOpen(false);
      alert('Project deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-blue-700">Projects Overview</h1>
          <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, manager, or status..."
              className="px-4 py-2 rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              onClick={() => navigate('/add-project')}
              className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              + Add Project
            </button>
          </div>
        </div>

        {/* Project Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-gray-600 text-center text-lg mt-10">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProjects.map((proj, index) => (
              <div
                key={proj.project_id}
                className="relative bg-white rounded-3xl shadow-md p-6 flex flex-col text-left border border-blue-200
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Dropdown */}
                <div className="absolute top-4 right-4">
                  <button
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    onClick={() =>
                      setShowDropdown(showDropdown === proj.project_id ? null : proj.project_id)
                    }
                  >
                    <FiMoreVertical />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-300 ${
                      showDropdown === proj.project_id
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                      onClick={() => navigate(`/edit-project/${proj.project_id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                      onClick={() => confirmDelete(proj.project_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
                  <FiFolder size={28} />
                </div>

                {/* Info */}
                <h2 className="text-xl font-semibold text-blue-700 mb-1">
                  {proj.project_name || 'Untitled'}
                </h2>
                <span
                  className={`text-white px-3 py-1 rounded-full text-sm ${
                    statusColors[proj.status] || statusColors.DEFAULT
                  }`}
                >
                  {proj.status || 'Unknown'}
                </span>

                <p className="text-gray-600 text-sm mt-3 mb-2">
                  {proj.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-2 text-gray-700 mt-auto text-sm">
                  <FiUser className="text-blue-600" /> {proj.manager_name || 'N/A'}
                </div>
                <div
                  className="flex items-center gap-2 text-gray-600 text-sm"
                  data-tooltip-id={`deadline-${proj.project_id}`}
                  data-tooltip-content={`Deadline: ${proj.deadline || 'Not set'}`}
                >
                  <FiCalendar className="text-blue-600" /> {proj.deadline || 'Not Set'}
                </div>
                <Tooltip id={`deadline-${proj.project_id}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center animate-fadeIn">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this project?</p>
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

export default Projects;
