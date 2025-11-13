import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const statusColors = {
  Present: "bg-green-500",
  Absent: "bg-red-500",
  Leave: "bg-yellow-500",
};

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/attendance");
        setRecords(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let temp = records;

    if (search)
      temp = temp.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );

    if (date)
      temp = temp.filter((r) => r.date.startsWith(date));

    setFiltered(temp);
  }, [search, date, records]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto flex-1">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6">Attendance</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search employee..."
            className="px-4 py-2 rounded-full border border-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            className="px-4 py-2 rounded-full border border-gray-300"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((rec, i) => (
            <div
              key={rec._id}
              className="bg-white p-6 rounded-3xl shadow-md border border-blue-200 hover:scale-105 transition-all animate-fadeIn"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <h2 className="text-2xl font-bold text-blue-700">{rec.name}</h2>
              <p className="text-gray-500 mt-1">Date: {rec.date}</p>
              <p className="text-gray-500">Punch In: {rec.punch_in}</p>
              <p className="text-gray-500">Punch Out: {rec.punch_out}</p>

              <span
                className={`px-4 py-1 mt-3 inline-block text-white rounded-full ${
                  statusColors[rec.status] || "bg-gray-500"
                }`}
              >
                {rec.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Attendance;
