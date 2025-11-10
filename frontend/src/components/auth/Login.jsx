import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import axios from 'axios';

const roles = ['admin', 'employee', 'hr', 'manager'];

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // hook for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        employeeId,
        password,
        role,
      });

      // Save JWT and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
      <div className="bg-white rounded-2xl shadow-2xl w-[24rem] p-8 sm:w-[20rem] transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-6 animate-bounce">
          <img src={Logo} alt="Logo" className="w-20 h-auto" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter Employee ID"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-20"
                placeholder="Enter Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Role</label>
            <div className="flex gap-2 flex-wrap">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm ${role === r
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          &copy; 2025 Company Name. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
