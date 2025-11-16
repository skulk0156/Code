import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard/${user.employeeId}`);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30s (optional)
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return <p>Loading user...</p>;
  if (loading) return <p className="p-10 text-lg font-medium text-gray-600">Fetching dashboard data...</p>;
  if (!stats) return <p className="p-10 text-lg font-medium text-red-600">Failed to load data.</p>;

  const { role, employeeId } = user;

  const pieData = [
    { name: 'Completed', value: stats.completedTasks },
    { name: 'Pending', value: stats.pendingTasks },
  ];

  const COLORS = ['#22c55e', '#f97316'];

  const barData = [
    { name: 'Week 1', Performance: 70 },
    { name: 'Week 2', Performance: 76 },
    { name: 'Week 3', Performance: 80 },
    { name: 'Week 4', Performance: stats.performance },
  ];

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />

      <div className="p-8 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {user.name}</h1>
        <h2 className="text-2xl font-semibold mb-8 text-gray-700">Role: {role.toUpperCase()}</h2>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card title="Total Tasks" value={stats.totalTasks} color="border-blue-500" textColor="text-blue-600" />
          <Card title="Completed Tasks" value={stats.completedTasks} color="border-green-500" textColor="text-green-600" />
          <Card title="Pending Tasks" value={stats.pendingTasks} color="border-orange-500" textColor="text-orange-600" />
          <Card title="Performance" value={`${stats.performance}%`} color="border-indigo-500" textColor="text-indigo-600" />
          {role === 'admin' && (
            <Card title="Total Users" value={stats.totalUsers || 0} color="border-purple-500" textColor="text-purple-600" />
          )}
        </div>

        {/* ===== PROGRESS BAR ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Performance Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-700"
              style={{ width: `${stats.performance}%` }}
            ></div>
          </div>
        </div>

        {/* ===== CHARTS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Task Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weekly Performance">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Performance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ===== RECENT ACTIVITY ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
          <ul className="space-y-3">
            {stats.activities?.length > 0 ? (
              stats.activities.map((item) => (
                <li key={item.id} className="flex justify-between bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition">
                  <span className="text-gray-700">{item.activity}</span>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No recent activity available</li>
            )}
          </ul>
        </div>

        {/* ===== ROLE PANEL ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {role === 'admin' && <RolePanel title="Admin Panel" desc="Manage users, roles, and system settings." />}
          {role === 'employee' && <RolePanel title="Employee Panel" desc="View your tasks, projects, and profile information." />}
          {role === 'hr' && <RolePanel title="HR Panel" desc="Manage employee data, leave requests, and payroll." />}
          {role === 'manager' && <RolePanel title="Manager Panel" desc="View team progress, assign tasks, and track performance." />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Card = ({ title, value, color, textColor }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg text-center border-t-4 ${color}`}>
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);

const RolePanel = ({ title, desc }) => (
  <>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </>
);

export default Dashboard;
