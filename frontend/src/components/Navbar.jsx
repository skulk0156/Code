import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanyLogo from '../assets/logo.png';
import { Bell, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  if (!user) return null;

  const { role, employeeId } = user;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },

    // Admin + HR access
    ...(role === 'admin' || role === 'hr' ? [{ name: 'Employees', path: '/employees' }] : []),

    // Admin + Manager + Employee access
    ...(role === 'admin' || role === 'manager' || role === 'employee'
      ? [
          { name: 'Team', path: '/team' },
          { name: 'Tasks', path: '/tasks' },
          { name: 'Projects', path: '/projects' }, // ✅ Added Project here
        ]
      : []),

    // Admin + HR + Manager access
    ...(role === 'admin' || role === 'hr' || role === 'manager'
      ? [{ name: 'Attendance', path: '/attendance' }]
      : []),

    // Admin + HR access
    ...(role === 'admin' || role === 'hr' ? [{ name: 'Leave', path: '/leave' }] : []),

    // Employee access
    ...(role === 'employee'
      ? [
          { name: 'My Tasks', path: '/my-tasks' },
          { name: 'Leave', path: '/leave' },
        ]
      : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow py-2 px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Left: Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 md:space-x-4">
            <img
              src={CompanyLogo}
              alt="Wordlane Tech Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className="text-xl md:text-2xl font-bold text-grey-600">Wordlane Tech</span>
          </Link>

          {/* Middle: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="font-medium text-sm md:text-lg text-gray-700 hover:text-blue-600 transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: User, Notifications, Profile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              className="hidden md:block px-2 py-1 md:px-3 md:py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base transition"
            />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-700 relative"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-2 z-50">
                  <p className="text-gray-700 text-sm font-semibold mb-2">Notifications</p>
                  <ul className="space-y-1 max-h-48 overflow-y-auto">
                    <li className="text-gray-600 text-xs md:text-sm">New task assigned</li>
                    <li className="text-gray-600 text-xs md:text-sm">Leave request approved</li>
                    <li className="text-gray-600 text-xs md:text-sm">Attendance reminder</li>
                    <li className="text-gray-600 text-xs md:text-sm">Performance review pending</li>
                    <li className="text-gray-600 text-xs md:text-sm">New message from HR</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
              >
                <User size={22} />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-gray-700 font-semibold text-sm">{employeeId}</p>
                    <p className="text-gray-500 text-xs">{role.toUpperCase()}</p>
                  </div>
                  <ul className="max-h-40 overflow-y-auto">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 transition"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden ml-1" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden mt-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-1 bg-gray-100 rounded-md font-medium text-sm hover:bg-blue-100 transition"
                onClick={() => setMobileMenu(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
