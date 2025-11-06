import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <Navbar />
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600">Our Team</h1>
          <button
            onClick={() => navigate('/add-employee')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Employee
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {employees.map((emp) => (
              <div
                key={emp.employeeId}
                className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-blue-200
                           transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  {emp.profileImage ? (
                    <img
                      src={emp.profileImage}
                      alt={emp.name || 'Employee'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-300 flex items-center justify-center text-white font-bold text-xl">
                      {emp.name ? emp.name.charAt(0) : '?'}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-blue-600">{emp.name || 'No Name'}</h2>
                <p className="text-blue-600 font-medium">{emp.role ? emp.role.toUpperCase() : 'N/A'}</p>
                <p className="text-gray-500 text-sm">{emp.department || 'N/A'}</p>
                <p className="text-gray-500 text-sm">{emp.designation || 'N/A'}</p>
                <p className="text-gray-500 text-sm mt-2">{emp.email || 'N/A'}</p>
                <p className="text-gray-500 text-sm">{emp.phone || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
