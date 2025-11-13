import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiMoreVertical } from "react-icons/fi";

const statusColors = {
  Approved: "bg-green-500",
  Pending: "bg-yellow-500",
  Rejected: "bg-red-500",
};

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      const res = await axios.get("http://localhost:5000/api/leaves");
      setLeaves(res.data);
      setFiltered(res.data);
    };
    fetchLeaves();
  }, []);

  useEffect(() => {
    let temp = leaves;

    if (search)
      temp = temp.filter((l) =>
        l.employee_name.toLowerCase().includes(search.toLowerCase())
      );

    if (status)
      temp = temp.filter((l) => l.status === status);

    setFiltered(temp);
  }, [search, status, leaves]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto flex-1">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8">Leave Requests</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search employee..."
            className="px-4 py-2 rounded-full border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-full border border-gray-300"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((leave, i) => (
            <div
              key={leave._id}
              className="bg-white p-6 rounded-3xl shadow-lg border border-blue-200 hover:scale-105 transition-all relative animate-fadeIn"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Dropdown */}
              <button
                className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() =>
                  setShowDropdown(showDropdown === leave._id ? null : leave._id)
                }
              >
                <FiMoreVertical />
              </button>

              {showDropdown === leave._id && (
                <div className="absolute top-12 right-4 bg-white border rounded-md shadow-lg w-32">
                  <button className="w-full px-4 py-2 hover:bg-blue-100">
                    Approve
                  </button>
                  <button className="w-full px-4 py-2 hover:bg-yellow-100">
                    Pending
                  </button>
                  <button className="w-full px-4 py-2 hover:bg-red-100 text-red-600">
                    Reject
                  </button>
                </div>
              )}

              <h2 className="text-xl font-bold text-blue-700">
                {leave.employee_name}
              </h2>

              <p className="text-gray-600 mt-2">
                {leave.from} → {leave.to}
              </p>

              <p className="text-gray-500 mt-3">{leave.reason}</p>

              <span
                className={`px-4 py-1 mt-4 inline-block rounded-full text-white ${
                  statusColors[leave.status] || "bg-gray-500"
                }`}
              >
                {leave.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Leaves;
