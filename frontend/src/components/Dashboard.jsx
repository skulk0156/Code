import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <p>Loading...</p>;

  const { role, employeeId } = user;

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {employeeId}</h1>
        <h2 className="text-2xl font-semibold mb-4">Role: {role.toUpperCase()}</h2>

        {role === 'admin' && (
          <div>
            <h3 className="text-xl font-medium mb-2">Admin Panel</h3>
            <p>Manage users, roles, and system settings here.</p>
          </div>
        )}

        {role === 'employee' && (
          <div>
            <h3 className="text-xl font-medium mb-2">Employee Panel</h3>
            <p>View your tasks, projects, and profile information.</p>
          </div>
        )}

        {role === 'hr' && (
          <div>
            <h3 className="text-xl font-medium mb-2">HR Panel</h3>
            <p>Manage employee data, leave requests, and payroll.</p>
          </div>
        )}

        {role === 'manager' && (
          <div>
            <h3 className="text-xl font-medium mb-2">Manager Panel</h3>
            <p>View team progress, assign tasks, and track performance.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
